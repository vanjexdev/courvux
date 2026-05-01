/**
 * Vite plugin — Courvux SSG (Static Site Generation)
 *
 * Pre-renders Courvux routes to static HTML at build time. Each route gets
 * its own index.html in a path-aware folder structure so GitHub Pages,
 * Netlify, Cloudflare Pages, and crawlers see real per-route HTML.
 *
 * Usage:
 *   import courvuxSsg from 'courvux/plugin/ssg';
 *   import { defineConfig } from 'vite';
 *
 *   export default defineConfig({
 *       plugins: [
 *           courvuxSsg({
 *               // Required — async function returning the route list to render.
 *               // Each entry: { path, component, head?, prerender? }
 *               routes: async () => (await import('./src/routes.js')).default,
 *
 *               // Optional — site base URL (used for sitemap.xml + canonical fallback)
 *               baseUrl: 'https://courvux.dev',
 *
 *               // Optional — page shell template (string or path).
 *               // Defaults to a minimal HTML5 shell. Use `%head%` and `%app%`.
 *               template: '<!doctype html>...',
 *
 *               // Optional — id of the mount root in the shell. Default: 'app'.
 *               mountId: 'app',
 *
 *               // Optional — also emit sitemap.xml + robots.txt (default true)
 *               sitemap: true,
 *           }),
 *       ],
 *   });
 *
 * Per-route options:
 *   - path: '/' or '/installation' or '/user/:id'
 *   - component: ComponentConfig (the same one passed to createRouter)
 *   - head: HeadConfig | (state) => HeadConfig — applied as fallback if the
 *       component does not call useHead. Component-level useHead always wins.
 *   - prerender: () => Promise<string[]> — for paths with dynamic params,
 *       returns the actual paths to emit (e.g. ['/user/1', '/user/2']).
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';

const DEFAULT_TEMPLATE = `<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    %head%
</head>
<body>
    <div id="%mountId%">%app%</div>
    <script type="module" src="/main.js"></script>
</body>
</html>`;

export default function courvuxSsg(options = {}) {
    const {
        routes,
        baseUrl,
        template: templateOpt,
        mountId = 'app',
        sitemap = true,
        skipDuringDev = true,
        notFound,
        router,
        components,
    } = options;

    if (typeof routes !== 'function') {
        throw new Error('[courvux-ssg] `routes` option must be an async function returning route configs.');
    }

    let resolvedOutDir;
    let resolvedTemplate = DEFAULT_TEMPLATE;
    let isDevMode = false;

    return {
        name: 'courvux-ssg',
        apply: 'build',

        configResolved(cfg) {
            resolvedOutDir = path.resolve(cfg.root, cfg.build?.outDir ?? 'dist');
            isDevMode = cfg.command === 'serve';
        },

        async closeBundle() {
            if (skipDuringDev && isDevMode) return;

            // Resolve shell template — priority:
            //   1. explicit `template` option (HTML string or file path)
            //   2. Vite-emitted <outDir>/index.html (preserves hashed asset paths)
            //   3. fallback default minimal shell
            if (typeof templateOpt === 'string') {
                if (templateOpt.includes('<')) {
                    resolvedTemplate = templateOpt;
                } else {
                    try {
                        resolvedTemplate = await fs.readFile(path.resolve(templateOpt), 'utf-8');
                    } catch {
                        console.warn(`[courvux-ssg] Could not read template at ${templateOpt}, using default.`);
                    }
                }
            } else {
                const viteIndexPath = path.join(resolvedOutDir, 'index.html');
                try {
                    let viteIndex = await fs.readFile(viteIndexPath, 'utf-8');
                    // Inline CSS to eliminate render-blocking <link> request
                    viteIndex = await inlineCss(viteIndex, resolvedOutDir);
                    resolvedTemplate = adaptViteIndex(viteIndex, mountId);
                } catch {
                    console.log(`[courvux-ssg] No Vite-emitted index.html found, using default minimal shell.`);
                }
            }

            // Set up DOM environment via happy-dom
            const { Window } = await import('happy-dom');
            const win = new Window();
            globalThis.document = win.document;
            globalThis.window = win;
            globalThis.Node = win.Node;
            globalThis.Element = win.Element;
            globalThis.HTMLElement = win.HTMLElement;
            globalThis.Comment = win.Comment;
            globalThis.MutationObserver = win.MutationObserver ?? class {};
            globalThis.CSS = win.CSS ?? { escape: (s) => String(s).replace(/[^a-zA-Z0-9_-]/g, c => `\\${c}`) };

            // Resolve user routes
            const routeList = await routes();
            if (!Array.isArray(routeList)) {
                throw new Error('[courvux-ssg] `routes()` must return an array.');
            }

            // Lazy-import courvux SSR (peer of the user project)
            const { renderPage, renderHeadToString } = await import('../dist/index.js');

            // Resolve global components map (the same one passed to createApp).
            // Accepts an object or an async function returning the map.
            let resolvedComponents = {};
            if (typeof components === 'function') {
                resolvedComponents = (await components()) ?? {};
            } else if (components && typeof components === 'object') {
                resolvedComponents = components;
            }

            const emitted = [];

            for (const route of routeList) {
                if (!route.path || !route.component) continue;

                let pathsToEmit;
                if (route.path.includes(':') || route.path.includes('*')) {
                    if (typeof route.prerender !== 'function') {
                        console.log(`[courvux-ssg] Skipping dynamic route "${route.path}" (no \`prerender\` provided).`);
                        continue;
                    }
                    pathsToEmit = await route.prerender();
                    if (!Array.isArray(pathsToEmit)) {
                        console.warn(`[courvux-ssg] prerender() for "${route.path}" did not return an array — skipping.`);
                        continue;
                    }
                } else {
                    pathsToEmit = [route.path];
                }

                for (const targetPath of pathsToEmit) {
                    try {
                        // Set window.location to the route being rendered so
                        // components can read pathname synchronously during
                        // SSG (e.g. to resolve which slug they represent).
                        // happy-dom updates location via .href assignment.
                        const fullPath = (router?.base ?? '') + targetPath;
                        try { window.location.href = `http://localhost${fullPath}`; } catch { /* */ }

                        await emitRoute({
                            targetPath,
                            component: route.component,
                            fallbackHead: route.head,
                            template: resolvedTemplate,
                            mountId,
                            outDir: resolvedOutDir,
                            renderPage,
                            renderHeadToString,
                            router,
                            components: resolvedComponents,
                        });
                        emitted.push(targetPath);
                        console.log(`[courvux-ssg] ✓ ${targetPath}`);
                    } catch (err) {
                        console.error(`[courvux-ssg] ✗ ${targetPath} — ${err.message}`);
                    }
                }
            }

            if (sitemap && baseUrl) {
                await emitSitemap(resolvedOutDir, emitted, baseUrl);
                await emitRobots(resolvedOutDir, baseUrl);
                console.log(`[courvux-ssg] ✓ sitemap.xml + robots.txt`);
            } else if (sitemap && !baseUrl) {
                console.log('[courvux-ssg] Skipping sitemap.xml (provide `baseUrl` to enable).');
            }

            // Emit 404.html when a notFound component is provided. GitHub
            // Pages, Netlify, Cloudflare Pages, etc. serve this file for
            // unknown paths so the SPA can hydrate and render the wildcard.
            if (notFound) {
                try {
                    await emit404({
                        component: notFound,
                        template: resolvedTemplate,
                        mountId,
                        outDir: resolvedOutDir,
                        renderPage,
                        renderHeadToString,
                        components: resolvedComponents,
                    });
                    console.log(`[courvux-ssg] ✓ 404.html`);
                } catch (err) {
                    console.error(`[courvux-ssg] ✗ 404.html — ${err.message}`);
                }
            }

            console.log(`[courvux-ssg] Emitted ${emitted.length} route(s).`);
        },
    };
}

async function emitRoute({
    targetPath,
    component,
    fallbackHead,
    template,
    mountId,
    outDir,
    renderPage,
    renderHeadToString,
    router,
    components,
}) {
    const resolvedComponent = typeof component === 'function'
        ? (await component()).default ?? (await component())
        : component;

    const result = await renderPage(resolvedComponent, { router, components });

    // If the component did not declare any head via useHead and a fallback
    // is provided at the route level, use it.
    let head = result.head;
    const isEmptyHead =
        head.title === undefined &&
        (!head.meta || head.meta.length === 0) &&
        (!head.link || head.link.length === 0) &&
        (!head.script || head.script.length === 0);

    if (isEmptyHead && fallbackHead) {
        head = typeof fallbackHead === 'function' ? fallbackHead() : fallbackHead;
    }

    const headHtml = renderHeadToString(head);
    const finalHtml = template
        .replaceAll('%head%', headHtml)
        .replaceAll('%app%',  result.html)
        .replaceAll('%mountId%', mountId);

    const fileDir = targetPath === '/' || targetPath === ''
        ? outDir
        : path.join(outDir, targetPath.replace(/^\//, ''));
    await fs.mkdir(fileDir, { recursive: true });
    await fs.writeFile(path.join(fileDir, 'index.html'), finalHtml, 'utf-8');
}

async function emit404({ component, template, mountId, outDir, renderPage, renderHeadToString, components }) {
    const resolved = typeof component === 'function'
        ? (await component()).default ?? (await component())
        : component;

    const result = await renderPage(resolved, { components });
    const headHtml = renderHeadToString(result.head);
    const finalHtml = template
        .replaceAll('%head%', headHtml)
        .replaceAll('%app%',  result.html)
        .replaceAll('%mountId%', mountId);
    await fs.writeFile(path.join(outDir, '404.html'), finalHtml, 'utf-8');
}

async function emitSitemap(outDir, paths, baseUrl) {
    const trimmed = baseUrl.replace(/\/$/, '');
    const today = new Date().toISOString().split('T')[0];
    const urls = paths
        .map(p => `    <url>
        <loc>${trimmed}${p === '/' ? '' : p}</loc>
        <lastmod>${today}</lastmod>
    </url>`)
        .join('\n');
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
    await fs.writeFile(path.join(outDir, 'sitemap.xml'), xml, 'utf-8');
}

async function emitRobots(outDir, baseUrl) {
    const trimmed = baseUrl.replace(/\/$/, '');
    const txt = `User-agent: *\nAllow: /\n\nSitemap: ${trimmed}/sitemap.xml\n`;
    await fs.writeFile(path.join(outDir, 'robots.txt'), txt, 'utf-8');
}

/**
 * Adapt the Vite-emitted index.html to act as the SSG shell:
 *  - replace the empty mount root <div id="<mountId>"></div> with `%app%` placeholder
 *  - inject `%head%` placeholder right before </head>
 * Asset references with content hashes (Vite's outputs) are preserved untouched.
 */
function adaptViteIndex(html, mountId) {
    let out = html;

    // Replace mount-root content with %app% (handles both empty and pre-rendered roots)
    const mountRe = new RegExp(`(<div[^>]*\\bid="${mountId}"[^>]*>)([\\s\\S]*?)(</div>)`);
    if (mountRe.test(out)) {
        out = out.replace(mountRe, `$1%app%$3`);
    } else {
        console.warn(`[courvux-ssg] Could not find <div id="${mountId}"> in Vite index.html — appending mount root.`);
        out = out.replace('</body>', `<div id="${mountId}">%app%</div>\n</body>`);
    }

    // Strip head tags that should be set per-page by useHead so we don't
    // emit duplicates. Keep charset, viewport, and asset links untouched.
    out = out.replace(/[ \t]*<title[^>]*>[\s\S]*?<\/title>\s*\n?/gi, '');
    out = out.replace(/[ \t]*<meta\s+name=["'](description|twitter:[^"']*)["'][^>]*>\s*\n?/gi, '');
    out = out.replace(/[ \t]*<meta\s+property=["']og:[^"']*["'][^>]*>\s*\n?/gi, '');
    out = out.replace(/[ \t]*<link\s+rel=["']canonical["'][^>]*>\s*\n?/gi, '');

    // Inject %head% before </head>. Subsequent per-page content goes here.
    out = out.replace('</head>', '    %head%\n</head>');

    return out;
}

/**
 * Find CSS <link> tags in the HTML and replace them with inline <style> tags.
 * Eliminates render-blocking CSS requests for small stylesheets.
 */
async function inlineCss(html, outDir) {
    const cssLinkRe = /<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*\s*\/?>/gi;
    let match;
    while ((match = cssLinkRe.exec(html)) !== null) {
        const fullTag = match[0];
        let href = match[1];
        // Skip external URLs (Google Fonts, CDN, etc.)
        if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) continue;
        // Strip base path if present (e.g. /courvux/assets/... -> assets/...)
        // The href is URL-path relative, but files are at outDir directly
        if (href.startsWith('/')) {
            href = href.replace(/^\//, '');
            // Remove the Vite base path segment (first directory component)
            // if it doesn't match a real subdirectory in outDir
            const parts = href.split('/');
            if (parts.length > 1 && !fsSync.existsSync(path.join(outDir, parts[0]))) {
                href = parts.slice(1).join('/');
            }
        }
        const cssPath = path.join(outDir, href);
        try {
            const css = fsSync.readFileSync(cssPath, 'utf-8');
            const replacement = `<style>${css}</style>`;
            html = html.replace(fullTag, replacement);
            console.log(`[courvux-ssg] Inlined CSS: ${match[1]} (${(css.length / 1024).toFixed(1)} KB)`);
        } catch {
            console.warn(`[courvux-ssg] Could not inline CSS ${match[1]} (file not found at ${cssPath}).`);
        }
    }
    return html;
}
