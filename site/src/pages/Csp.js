import { setHead } from '../seo.js';

export default {
    data: {
        s_install: `pnpm add courvux-precompiler@github:vanjexdev/courvux-precompiler`,
        s_vite: `// vite.config.js
import { defineConfig } from 'vite';
import courvux           from 'courvux/plugin';            // existing templateUrl inliner
import courvuxPrecompile from 'courvux/plugin/precompile'; // new in 0.7.0

export default defineConfig({
    plugins: [
        courvux(),
        courvuxPrecompile(),
    ],
});`,
        s_csp: `<!-- index.html — strict CSP, no unsafe-eval -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';
               connect-src 'self';
               object-src 'none';
               base-uri 'self';
               form-action 'self'" />`,
        s_inline: `// Component file (.js / .ts) — plugin recognizes static templates
export default {
    template: \`
        <button @click="count++">{{ count }}</button>
    \`,
    data: { count: 0 },
};`,
        s_html: `// HTML file with ?courvux suffix — plugin handles the import
import compiled from './my-component.html?courvux';

export default {
    ...compiled,                // spreads { template, exprs }
    data: { count: 0 },
};`,
        s_report: `[courvux-precompile] using courvux-precompiler v0.1.0
[courvux-precompile] processed 25 file(s), 258 expression(s) precompiled, 0 template(s) fell back to runtime new Function.`,
        s_skip: `[courvux-precompile] templates not precompiled (CSP \`unsafe-eval\` required for these):
  - src/pages/Dynamic.js:42 — \`template\` value is Identifier, not a static literal
  - src/pages/Cards.js:12  — \`template\` value is ConditionalExpression, not a static literal`,
    },

    template: `
        <div class="prose">
            <h1>Strict CSP &amp; the precompiler</h1>
            <p>By default Courvux compiles every template expression at runtime via <code>new Function('with(state){ return (expr) }')</code>. That requires the page's <code>Content-Security-Policy</code> to allow <code>script-src 'unsafe-eval'</code>. For most apps that's fine — Courvux is small, the runtime evaluator is the same one Alpine and Vue 2 use, and 'unsafe-eval' is widely accepted.</p>
            <p>For apps that <strong>cannot</strong> ship <code>'unsafe-eval'</code> — Tauri / Electron shells with strict default policies, embeds inside untrusted pages, anything graded by automated security tooling — version <strong>0.7.0</strong> introduces a Vite plugin that moves expression compilation to <em>build</em> time. Apps that go through the plugin can ship with <code>script-src 'self'</code>, full stop.</p>

            <div class="callout info">
                The plugin is <strong>opt-in and additive</strong>. Apps without it work exactly as before — same expressions, same evaluator, same CSP requirements. CDN-loaded apps (drop a <code>&lt;script type="module"&gt;</code> with an importmap, no build) keep using the runtime path.
            </div>

            <h2>How it works</h2>
            <p>The plugin is paired with a Rust crate compiled to WebAssembly (<code>courvux-precompiler</code>) that turns each template expression into a JavaScript arrow function:</p>
            <table>
                <thead><tr><th>You write</th><th>Plugin emits</th></tr></thead>
                <tbody>
                    <tr><td><code>{{ count + 1 }}</code></td><td><code>($s) => ($s.count + 1)</code></td></tr>
                    <tr><td><code>:disabled="loading"</code></td><td><code>($s) => $s.loading</code></td></tr>
                    <tr><td><code>@click="todos.push(draft)"</code></td><td><code>($s) => $s.todos.push($s.draft)</code></td></tr>
                    <tr><td><code>cv-model="form.email"</code></td><td><code>($s) => $s.form.email</code></td></tr>
                    <tr><td><code>todos.filter(t =&gt; !t.done).length</code></td><td><code>($s) => $s.todos.filter(t =&gt; !t.done).length</code></td></tr>
                </tbody>
            </table>
            <p>The compiled function lives in a per-component <code>exprs</code> map keyed by the original expression string. The runtime checks this map before falling back to <code>new Function</code>, so apps fully covered by the plugin never trigger the runtime evaluator and never need <code>'unsafe-eval'</code>.</p>

            <h2>Setup</h2>
            <ol>
                <li>
                    <p>Install the WASM precompiler crate:</p>
                    <code-block :lang="'bash'" :code="s_install"></code-block>
                </li>
                <li>
                    <p>Add the Vite plugin alongside the existing Courvux plugin:</p>
                    <code-block :lang="'js'" :code="s_vite"></code-block>
                </li>
                <li>
                    <p>Set a strict CSP in your HTML shell:</p>
                    <code-block :lang="'html'" :code="s_csp"></code-block>
                </li>
            </ol>

            <h2>What gets precompiled</h2>
            <p>Two opt-in entry points, both backed by the same compiler:</p>

            <h3>1. Inline string templates inside <code>.js</code> / <code>.ts</code></h3>
            <p>If the <code>template:</code> value is a static string literal or template literal with no <code>\${...}</code> interpolations, the plugin walks the template, extracts every expression, and inserts a sibling <code>exprs:</code> property — no source change required:</p>
            <code-block :lang="'js'" :code="s_inline"></code-block>

            <h3>2. HTML files imported with <code>?courvux</code></h3>
            <p>For external templates, append <code>?courvux</code> to the import. The plugin compiles the file at build time and resolves it as a module that already exports <code>{ template, exprs }</code>:</p>
            <code-block :lang="'js'" :code="s_html"></code-block>

            <h2>What falls back</h2>
            <p>Templates whose value isn't a static literal — <code>template: someVar</code>, <code>template: cond ? a : b</code>, <code>template: makeTemplate('btn')</code>, tagged template literals, and so on — are skipped silently. The runtime <code>new Function</code> path handles them, just at the cost of needing <code>'unsafe-eval'</code> for those specific components.</p>
            <p>The plugin's build-end report tells you exactly which templates fell back, so you know what to refactor for full CSP compliance:</p>
            <code-block :lang="'text'" :code="s_skip"></code-block>

            <h2>Build-end report</h2>
            <p>Every build prints a one-shot summary so the precompile coverage is visible at a glance:</p>
            <code-block :lang="'text'" :code="s_report"></code-block>
            <p>Apps that need strict CSP want zero templates in the fallback bucket. Apps that don't care can ignore the report — fallbacks are not errors.</p>

            <h2>Supported expression subset</h2>
            <p>The compiler accepts what a normal Courvux template uses. Anything off-grammar fails at build time with a precise location, so you find out at <code>vite build</code> instead of in the browser console:</p>
            <ul>
                <li>Literals: numbers, strings (<code>'</code>, <code>"</code>), template literals, <code>true</code>, <code>false</code>, <code>null</code>, <code>undefined</code></li>
                <li>Identifiers + dot / bracket / optional access (<code>?.</code>)</li>
                <li>Function calls — including methods on identifiers and member chains</li>
                <li>Arithmetic <code>+ - * / %</code></li>
                <li>Comparison <code>&lt; &lt;= &gt; &gt;= == != === !==</code> (<code>==</code> and <code>!=</code> compile to <code>===</code> / <code>!==</code> for parity with Courvux runtime semantics)</li>
                <li>Logical <code>&amp;&amp; || ??</code></li>
                <li>Ternary</li>
                <li>Assignment <code>= += -= *= /= %=</code></li>
                <li>Pre- and post-increment / decrement</li>
                <li>Object and array literals (with shorthand, computed keys, spread)</li>
                <li>Comma- or semicolon-separated multi-statement event handlers</li>
                <li>Arrow functions (single expression body): <code>t =&gt; !t.done</code>, <code>(a, b) =&gt; a + b</code></li>
            </ul>

            <h3>Out of scope</h3>
            <p>Rejected at build time so the failure mode stays loud:</p>
            <ul>
                <li><code>function</code> / <code>class</code> declarations</li>
                <li><code>async</code> / <code>await</code> / generator syntax</li>
                <li>Regex literals</li>
                <li>Destructuring assignment</li>
                <li>Block-body arrow functions (<code>=&gt; { ... }</code>)</li>
            </ul>
            <p>If your template needs any of these, move the logic into a method on the component (where it's normal JS, type-checked by your editor, and not bound by the template-expression subset).</p>

            <h2>Performance</h2>
            <p>The compiler is a Rust crate compiled to WebAssembly (~104 KB uncompressed, loaded once per build session). For a typical 50-component project it adds 200-500 ms to the cold build and 5-20 ms per HMR change. Faster than the Vue compiler running on the same set of templates because the parser is purpose-built for the Courvux subset, not full ECMAScript.</p>
            <p>At runtime, precompiled expressions are roughly 2-3× faster than the <code>new Function('with(state){...}')</code> path because they're plain arrow function calls — no scope resolution, no <code>with</code> binding, no per-call compilation cache lookup.</p>

            <h2>Source maps</h2>
            <p>Both the inline-template and <code>?courvux</code> paths emit Vite-compatible source maps. Console errors and stack traces point at the original <code>.js</code> / <code>.html</code> file, not the rewritten module. The position information is precise to the line where the <code>template:</code> property starts.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/installation" style="font-size:13px; color:#555;">← Installation</router-link>
                <router-link to="/template" style="font-size:13px; color:#111; font-weight:600;">Template Syntax →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Strict CSP & the precompiler',
            description: "Drop `script-src 'unsafe-eval'` from your CSP by precompiling Courvux template expressions at build time with the Rust → WASM precompiler and its Vite plugin.",
            slug: '/csp',
        });
    },
};
