/**
 * vite-plugin-courvux-precompile
 *
 * Build-time expression precompiler for Courvux templates. Pairs with the
 * `courvux-precompiler` Rust → WASM crate to convert every template
 * expression (`{{ count + 1 }}`, `:class="{ active: isOn }"`, `@click="save(id)"`,
 * `cv-model="form.name"`, …) into a JS arrow function that ships in the
 * bundle. The runtime checks a per-state registry before falling back to
 * `new Function`, so apps that go through this plugin can ship with
 * `Content-Security-Policy: script-src 'self'` (no `unsafe-eval`).
 *
 * Two entry points (both opt-in):
 *
 *   1. `?courvux` query suffix on HTML imports:
 *        import compiled from './foo.html?courvux';
 *        export default { ...compiled, data: { ... } };
 *      `compiled` resolves to `{ template, exprs }` where `exprs` is a
 *      record keyed by the expression source string.
 *
 *   2. Inline string templates in `.js` / `.ts` files:
 *        export default {
 *            template: `<button @click="count++">{{ count }}</button>`,
 *            data: { count: 0 }
 *        };
 *      The plugin walks the AST, finds `template:` properties whose value
 *      is a static string literal or template literal with no `${...}`
 *      interpolation, extracts the expressions, and inserts an `exprs:`
 *      sibling. Anything more dynamic (variable reference, ternary,
 *      tagged template, function call) is silently skipped — the runtime
 *      `new Function` fallback handles those, just at the cost of needing
 *      `unsafe-eval` for that specific component.
 *
 * Usage (vite.config.js):
 *   import courvux from './plugin/vite-plugin-courvux.js';
 *   import courvuxPrecompile from './plugin/vite-plugin-courvux-precompile.js';
 *   export default {
 *       plugins: [
 *           courvux(),              // existing templateUrl inliner
 *           courvuxPrecompile(),    // new
 *       ]
 *   }
 *
 * Order matters: this plugin must run AFTER `courvux()` so that
 * `templateUrl: './foo.html'` has already been inlined into a string
 * literal by the time we walk for inline templates.
 *
 * @param {Object}  [options]
 * @param {boolean} [options.warn=true]      Emit warnings when a template can't be precompiled.
 * @param {boolean} [options.report=true]    Print a summary (precompiled vs fallback) at build end.
 * @param {string}  [options.queryParam='courvux']  Query suffix that triggers HTML compilation.
 * @returns {import('vite').Plugin}
 */
export default function courvuxPrecompile(options = {}) {
    const {
        warn = true,
        report = true,
        queryParam = 'courvux',
    } = options;

    /** @type {{ compile: (src: string) => string, version: () => string } | null} */
    let wasm = null;

    // Build-end stats — prints a one-shot summary of how much of the app is
    // precompiled vs falling back. Apps that need strict CSP want zero
    // entries in the fallback bucket.
    const stats = {
        files: 0,
        precompiledExprs: 0,
        fallbackTemplates: 0,
        skippedTemplates: [], // [{ file, line, reason }]
    };

    return {
        name: 'courvux-precompile',
        enforce: 'pre',

        async buildStart() {
            // Lazy-load the WASM bindings only once per dev/build session.
            // wasm-pack with target=nodejs ships a synchronous CommonJS
            // wrapper, so this is essentially free.
            if (!wasm) {
                const mod = await import('courvux-precompiler');
                wasm = { compile: mod.compile, version: mod.version };
                if (warn) {
                    // eslint-disable-next-line no-console
                    console.log(`[courvux-precompile] using courvux-precompiler v${wasm.version()}`);
                }
            }
            stats.files = 0;
            stats.precompiledExprs = 0;
            stats.fallbackTemplates = 0;
            stats.skippedTemplates.length = 0;
        },

        // ?courvux HTML → { template, exprs } module.
        // We hook `load` (not `transform`) so we control the source
        // entirely instead of mutating Vite's default `?raw` handling.
        async load(id) {
            const [path, query] = id.split('?');
            if (!query || !path.endsWith('.html')) return null;
            const params = new URLSearchParams(query);
            if (!params.has(queryParam)) return null;

            const fs = await import('node:fs/promises');
            const html = await fs.readFile(path, 'utf8');
            const result = compileHtml(html, wasm, { file: path, warn });
            stats.files += 1;
            stats.precompiledExprs += result.exprCount;
            for (const skip of result.skipped) {
                stats.skippedTemplates.push({ file: path, ...skip });
            }
            return {
                code: emitCompiledModule(html, result.exprMap),
                map: null, // TODO source map for ?courvux path (next commit)
            };
        },

        // Inline `template:` literals inside .js / .ts files.
        //
        // Strategy: parse the module with acorn, walk every ObjectExpression,
        // find Property nodes whose key is `template` and whose value is a
        // string-literal-shaped expression (StringLiteral or TemplateLiteral
        // with no `${...}` interpolations). Extract every Courvux template
        // expression from the string, compile each via WASM, and use
        // magic-string to insert an `exprs:` sibling property in place.
        //
        // Anything more dynamic (Identifier, ConditionalExpression, etc.) is
        // skipped silently — runtime falls back to `new Function` for that
        // component, just at the cost of needing `unsafe-eval` for those
        // specific expressions.
        async transform(code, id) {
            // Skip non-source files and the plugin itself.
            const cleanId = id.split('?')[0];
            if (!/\.(?:js|ts|mjs|mts|jsx|tsx)$/.test(cleanId)) return null;
            if (cleanId.includes('/node_modules/')) return null;
            if (!code.includes('template')) return null; // cheap pre-check

            const { parse } = await import('acorn');
            const MagicStringMod = await import('magic-string');
            const MagicString = MagicStringMod.default ?? MagicStringMod;

            let ast;
            try {
                ast = parse(code, {
                    ecmaVersion: 'latest',
                    sourceType: 'module',
                    locations: true,
                });
            } catch {
                // Not parseable JS — Vite's main pipeline will report the
                // syntax error; we just don't precompile this file.
                return null;
            }

            const ms = new MagicString(code);
            let changed = false;
            let templatesFound = 0;
            let templatesSkipped = 0;

            walkNodes(ast, (node, parent) => {
                if (node.type !== 'Property') return;
                if (node.computed) return;
                const keyName = node.key.type === 'Identifier' ? node.key.name
                              : node.key.type === 'Literal' ? node.key.value
                              : null;
                if (keyName !== 'template') return;

                templatesFound += 1;

                const tpl = staticTemplateString(node.value);
                if (tpl === null) {
                    templatesSkipped += 1;
                    stats.fallbackTemplates += 1;
                    if (warn) {
                        const loc = node.value.loc?.start;
                        stats.skippedTemplates.push({
                            file: cleanId,
                            line: loc?.line,
                            reason: `\`template\` value is ${node.value.type}, not a static literal`,
                        });
                    }
                    return;
                }

                // Skip if sibling `exprs:` already present (component author
                // hand-wrote one, or we ran twice somehow).
                const siblingExprs = parent && parent.type === 'ObjectExpression'
                    ? parent.properties.find(p => p.type === 'Property'
                        && !p.computed
                        && ((p.key.type === 'Identifier' && p.key.name === 'exprs')
                         || (p.key.type === 'Literal' && p.key.value === 'exprs')))
                    : null;
                if (siblingExprs) return;

                const result = compileHtml(tpl, wasm, { file: cleanId, warn });
                if (result.exprCount === 0) {
                    // Nothing to precompile (template has no expressions);
                    // skip insertion to keep the diff minimal.
                    return;
                }

                stats.precompiledExprs += result.exprCount;
                for (const skip of result.skipped) {
                    stats.skippedTemplates.push({
                        file: cleanId,
                        line: node.value.loc?.start?.line,
                        ...skip,
                    });
                }

                // Inject `exprs: { ... },` immediately AFTER the template
                // property so the diff stays surgical.
                const exprEntries = Object.entries(result.exprMap)
                    .map(([src, fn]) => `${JSON.stringify(src)}: ${fn}`)
                    .join(', ');
                const insertion = `, exprs: { ${exprEntries} }`;
                ms.appendRight(node.end, insertion);
                changed = true;
            });

            if (!changed) {
                stats.files += templatesFound > templatesSkipped ? 1 : 0;
                return null;
            }
            stats.files += 1;

            return {
                code: ms.toString(),
                map: ms.generateMap({ source: id, includeContent: true, hires: 'boundary' }),
            };
        },

        buildEnd() {
            if (!report) return;
            // eslint-disable-next-line no-console
            console.log(
                `[courvux-precompile] processed ${stats.files} file(s), ` +
                `${stats.precompiledExprs} expression(s) precompiled, ` +
                `${stats.fallbackTemplates} template(s) fell back to runtime new Function.`
            );
            if (stats.skippedTemplates.length && warn) {
                console.log('[courvux-precompile] templates not precompiled (CSP `unsafe-eval` required for these):');
                for (const s of stats.skippedTemplates.slice(0, 20)) {
                    console.log(`  - ${s.file}${s.line ? `:${s.line}` : ''} — ${s.reason}`);
                }
                if (stats.skippedTemplates.length > 20) {
                    console.log(`  ... and ${stats.skippedTemplates.length - 20} more`);
                }
            }
        },
    };
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Compile every expression inside an HTML template via the WASM precompiler.
 * Returns the de-duplicated expression map ({ exprSource: compiledJsSource })
 * and counters for the build-end report.
 *
 * @param {string} html
 * @param {{ compile: (src: string) => string }} wasm
 * @param {{ file: string, warn: boolean }} ctx
 */
export function compileHtml(html, wasm, ctx) {
    const exprMap = Object.create(null);
    let exprCount = 0;
    const skipped = [];

    const exprs = extractExpressions(html);
    for (const src of exprs) {
        if (src in exprMap) continue;
        const out = wasm.compile(src);
        if (out.startsWith('{"__compileError":true,')) {
            const err = JSON.parse(out);
            // Don't fail the build — fall back to runtime `new Function` for
            // this specific expression. The console warning lets the dev
            // know which one and why.
            if (ctx.warn) {
                // eslint-disable-next-line no-console
                console.warn(`[courvux-precompile] ${ctx.file}: cannot precompile \`${src}\` — ${err.error} (offset ${err.pos}). Falling back to runtime.`);
            }
            skipped.push({ reason: `invalid expression \`${src}\`: ${err.error}` });
            continue;
        }
        exprMap[src] = out;
        exprCount += 1;
    }

    return { exprMap, exprCount, skipped };
}

/**
 * Extract every Courvux template expression from a raw HTML string.
 *
 * Sources of expressions inside a template:
 *   - Text node interpolations    `{{ ... }}`
 *   - `:attr="..."` bindings       (incl. `:class`, `:style`, custom `:foo-bar`)
 *   - `@event="..."` handlers      (incl. modifiers like `@click.prevent`)
 *   - `cv:on:event="..."`          (alt event syntax)
 *   - `cv-if`, `cv-else-if`, `cv-show` conditions
 *   - `cv-for="x in <expr>"`       (collection only, the binding name is not an expression)
 *   - `cv-model`, `cv-html`, `cv-html.raw`, `cv-bind`, `cv-text`, `cv-data`,
 *     `cv-html.sanitize` (back-compat), `cv-focus`, `cv-clickoutside`,
 *     `cv-intersect`, `cv-resize`, `cv-scroll`, `cv-memo`
 *
 * The implementation deliberately walks the raw string with regex/index
 * scans rather than spinning up a full HTML parser. Courvux templates are
 * typically small and shallow; the expressions live in well-defined
 * positions that a strict scan handles correctly. Edge cases (raw `{{ }}`
 * inside CSS string literals, attribute values with embedded quotes that
 * aren't HTML-escaped) fall through to the runtime fallback.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function extractExpressions(html) {
    const found = [];

    // 1. Interpolations — text-node `{{ expr }}`. We don't try to skip the
    //    contents of <style>/<script> because Courvux's runtime walks them
    //    too; matching what the runtime sees keeps behavior consistent.
    const interpRe = /\{\{([\s\S]+?)\}\}/g;
    for (const m of html.matchAll(interpRe)) {
        const expr = m[1].trim();
        if (expr) found.push(expr);
    }

    // 2. Attribute expressions. Naively scanning each tag with `[^>]*` would
    //    break on `:class="{ active: count > 0 }"` (the `>` inside the
    //    attribute value gets treated as the tag terminator). Real HTML
    //    parsers handle this, but since Courvux templates always use
    //    quote-delimited attribute values, we can scan globally for a
    //    `name="value"` / `name='value'` pattern. The attribute names
    //    we care about (`@event`, `:prop`, `cv-x`, `cv:on:event`) are
    //    distinctive enough that false matches inside text nodes are rare;
    //    when they do happen, the WASM compile fails fast and we log a
    //    warning rather than producing broken code.
    const attrRe = /([@:]?[\w.\-:]+)\s*=\s*("[^"]*"|'[^']*')/g;
    for (const m of html.matchAll(attrRe)) {
        const name = m[1];
        const valueQuoted = m[2];
        const value = valueQuoted.slice(1, -1);
        if (!isExpressionAttr(name)) continue;

        // cv-for has the form `(item, idx) in expr` — only `expr` is an
        // expression; the binding parens are syntax, not values.
        if (name === 'cv-for') {
            const cvForMatch = value.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+([\s\S]+)$/);
            if (cvForMatch) {
                const collection = cvForMatch[3].trim();
                if (collection) found.push(collection);
            }
            continue;
        }

        const trimmed = value.trim();
        if (trimmed) found.push(trimmed);
    }

    return found;
}

/**
 * Whether an HTML attribute name is expected to hold a Courvux expression.
 * This is the canonical list — keeping it in one place so the plugin and
 * the runtime can't drift apart on what counts as an expression site.
 */
function isExpressionAttr(name) {
    if (name.startsWith(':')) return name !== ':is'; // `:is` is component name, treated specially
    if (name.startsWith('@')) return true;
    if (name.startsWith('cv:on:')) return true;
    const base = name.split('.')[0];
    switch (base) {
        case 'cv-if':
        case 'cv-else-if':
        case 'cv-show':
        case 'cv-for':
        case 'cv-model':
        case 'cv-html':
        case 'cv-bind':
        case 'cv-text':
        case 'cv-data':
        case 'cv-focus':
        case 'cv-clickoutside':
        case 'cv-intersect':
        case 'cv-resize':
        case 'cv-scroll':
        case 'cv-memo':
            return true;
        default:
            return false;
    }
}

/**
 * Pre-order AST walk that visits every node and reports the parent.
 * Lightweight alternative to `acorn-walk` so we don't take another dep
 * just for this. Skips the locations / start / end keys to avoid runaway
 * recursion through circular metadata.
 *
 * @param {object} node
 * @param {(node: object, parent: object | null) => void} visit
 * @param {object | null} [parent]
 */
function walkNodes(node, visit, parent = null) {
    if (!node || typeof node !== 'object') return;
    if (typeof node.type === 'string') visit(node, parent);
    for (const key of Object.keys(node)) {
        if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') continue;
        const child = node[key];
        if (Array.isArray(child)) {
            for (const item of child) walkNodes(item, visit, node);
        } else if (child && typeof child === 'object') {
            walkNodes(child, visit, node);
        }
    }
}

/**
 * If `node` is an expression that resolves to a static string at build
 * time, return the string's value. Otherwise return null and the caller
 * leaves the template alone (runtime fallback).
 *
 * Accepted shapes:
 *   - StringLiteral / Literal { value: 'string' }
 *   - TemplateLiteral with no expressions  (e.g. `<div>...</div>` with no `${}`)
 *
 * @param {object} node — acorn AST node
 * @returns {string | null}
 */
function staticTemplateString(node) {
    if (!node) return null;
    if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
    if (node.type === 'TemplateLiteral'
        && Array.isArray(node.expressions)
        && node.expressions.length === 0
        && Array.isArray(node.quasis)
        && node.quasis.length === 1) {
        return node.quasis[0].value.cooked;
    }
    return null;
}

/**
 * Emit the JS source for a `?courvux`-imported HTML module.
 *
 * Output shape:
 *   export const template = `...html...`;
 *   export const exprs = {
 *       'count': (($s) => ($s.count)),
 *       ...
 *   };
 *   export default { template, exprs };
 *
 * @param {string} html
 * @param {Record<string, string>} exprMap
 */
function emitCompiledModule(html, exprMap) {
    const exprEntries = Object.entries(exprMap)
        .map(([src, fn]) => `    ${JSON.stringify(src)}: ${fn},`)
        .join('\n');
    return [
        `export const template = ${JSON.stringify(html)};`,
        `export const exprs = {`,
        exprEntries,
        `};`,
        `export default { template, exprs };`,
    ].join('\n');
}
