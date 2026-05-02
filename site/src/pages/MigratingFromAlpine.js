import { setHead } from '../seo.js';

export default {
    data: {
        s_xdata: `<!-- Alpine -->
<div x-data="{ open: false }">
    <button @click="open = !open">{{ open ? '−' : '+' }}</button>
    <div x-show="open">Panel content</div>
</div>

<!-- Courvux — almost identical, just cv- prefix -->
<div cv-data="{ open: false }">
    <button @click="open = !open">{{ open ? '−' : '+' }}</button>
    <div cv-show="open">Panel content</div>
</div>`,

        s_init: `<!-- Alpine — auto-discovers x-data on DOMContentLoaded -->
<script src="//unpkg.com/alpinejs" defer><\/script>
<div x-data="{ count: 0 }">
    <button @click="count++">{{ count }}</button>
</div>

<!-- Courvux — same pattern via autoInit() -->
<script type="module">
    import { autoInit } from 'courvux';
    autoInit();
<\/script>
<div cv-data="{ count: 0 }">
    <button @click="count++">{{ count }}</button>
</div>`,

        s_components: `// Alpine — Alpine.data() registers a named composable
document.addEventListener('alpine:init', () => {
    Alpine.data('counter', () => ({
        count: 0,
        inc() { this.count++ }
    }));
});
// Used in HTML:
// <div x-data="counter">...</div>

// Courvux — same idea via autoInit({ components })
import { autoInit } from 'courvux';
autoInit({
    components: {
        counter: {
            data: { count: 0 },
            methods: { inc() { this.count++ } }
        }
    }
});
// Used in HTML:
// <div cv-data="counter">...</div>`,

        s_store: `// Alpine — Alpine.store() for global state
document.addEventListener('alpine:init', () => {
    Alpine.store('cart', { count: 0, add() { this.count++ } });
});
// Used in HTML: $store.cart.count

// Courvux — createStore + provide on autoInit
import { autoInit, createStore } from 'courvux';
const store = createStore({
    state: { cart: { count: 0 } },
    actions: {
        addToCart() { this.cart.count++ }
    }
});
autoInit({ globalProperties: { $store: store } });
// Used in HTML: $store.cart.count`,
    },
    template: `
        <div class="prose">
            <h1>Migrating from Alpine</h1>
            <p>Courvux's island-mode (<code>autoInit</code> + <code>cv-data</code>) is intentionally aligned with Alpine — the muscle memory transfers almost completely. The differences are: directive prefix (<code>cv-</code> vs <code>x-</code>), how named "components" are registered, and a few extra capabilities Courvux adds (router, store, devtools, SSG).</p>

            <h2>Template syntax — directive prefix swap</h2>
            <table>
                <thead><tr><th>Alpine</th><th>Courvux</th></tr></thead>
                <tbody>
                    <tr><td><code>x-data="{ open: false }"</code></td><td><code>cv-data="{ open: false }"</code></td></tr>
                    <tr><td><code>x-show="open"</code></td><td><code>cv-show="open"</code></td></tr>
                    <tr><td><code>x-if</code> / <code>x-else</code> (template only)</td><td><code>cv-if</code> / <code>cv-else-if</code> / <code>cv-else</code> (any element)</td></tr>
                    <tr><td><code>x-for="item in items"</code></td><td><code>cv-for="item in items"</code></td></tr>
                    <tr><td><code>x-for + :key</code></td><td><code>cv-for + :key</code> (same)</td></tr>
                    <tr><td><code>x-model</code></td><td><code>cv-model</code></td></tr>
                    <tr><td><code>x-model.lazy</code> / <code>.number</code></td><td><code>cv-model.lazy</code> / <code>.number</code> / <code>.trim</code> / <code>.debounce</code></td></tr>
                    <tr><td><code>x-html="..."</code></td><td><code>cv-html</code> (also <code>cv-html.sanitize</code>)</td></tr>
                    <tr><td><code>x-ref="el"</code></td><td><code>cv-ref="el"</code> (plus dynamic <code>:cv-ref="'foo_'+id"</code>)</td></tr>
                    <tr><td><code>x-cloak</code></td><td><code>cv-cloak</code> (auto-injects the hide CSS for you)</td></tr>
                    <tr><td><code>x-on:click</code> / <code>@click</code></td><td><code>cv:on:click</code> / <code>@click</code></td></tr>
                    <tr><td><code>:bind</code> / <code>x-bind:foo</code></td><td><code>:foo</code> (identical)</td></tr>
                    <tr><td><code>x-transition</code></td><td><code>cv-transition</code> (Alpine class semantics supported)</td></tr>
                    <tr><td><code>x-intersect</code></td><td><code>cv-intersect</code> (with <code>.once</code> / <code>.half</code> / <code>.threshold-N</code> / <code>.margin-N</code>)</td></tr>
                </tbody>
            </table>

            <h2>Inline scope (<code>x-data</code> → <code>cv-data</code>)</h2>
            <code-block :lang="'html'" :code="s_xdata"></code-block>
            <p>Same model: an inline reactive scope, methods can be defined inline, nested scopes inherit the parent. The only delta is the prefix.</p>

            <h2>Auto-init</h2>
            <code-block :lang="'html'" :code="s_init"></code-block>
            <p>Alpine auto-discovers <code>x-data</code> on script load. Courvux requires an explicit <code>autoInit()</code> call, but the behavior from there is identical — it walks all top-level <code>[cv-data]</code> elements and upgrades them.</p>

            <h2>Named components (<code>Alpine.data()</code>)</h2>
            <code-block :lang="'js'" :code="s_components"></code-block>
            <p>Alpine registers reusable scopes via the <code>alpine:init</code> event. Courvux registers them through the <code>autoInit({ components })</code> option. Both end up referencing them by name in <code>cv-data="counter"</code> / <code>x-data="counter"</code>.</p>

            <h2>Stores</h2>
            <code-block :lang="'js'" :code="s_store"></code-block>
            <p>Alpine.store + Courvux <code>createStore</code> serve the same purpose; Courvux's store integrates with the router and devtools and supports <code>modules:</code> for namespacing. See <router-link to="/store" class="link">Store</router-link>.</p>

            <h2>What Courvux adds beyond Alpine</h2>
            <ul>
                <li><strong>Built-in router with <code>:param</code>, nested routes, transitions, <code>keepAlive</code></strong> — Alpine has no router (use a third-party).</li>
                <li><strong>Components (real, not just inline scopes)</strong> — Courvux supports separate <code>.js</code> + <code>.html</code> files, props, emits, slots (default + named + scoped), <code>cv-model</code> on components.</li>
                <li><strong>SSR / SSG</strong> — pre-render every route at build time with <code>courvux/plugin/ssg</code>. Alpine is browser-only.</li>
                <li><strong><code>useHead</code></strong> for per-route SEO metadata, captured during SSG.</li>
                <li><strong>DevTools</strong> built-in. No browser extension.</li>
                <li><strong><code>defineComposable</code></strong> (landing in 0.5.x) — first-class shared logic between components.</li>
            </ul>

            <h2>What Courvux deliberately doesn't add</h2>
            <ul>
                <li>Magic helpers in templates (<code>$el</code> / <code>$refs</code> / <code>$watch</code> exist but are framework primitives, not Alpine "magics" with their own syntax).</li>
                <li>An explicit <code>x-data</code>-only mode — Courvux components are opt-in upgrades from islands; you can mix freely with <code>autoInit</code>.</li>
            </ul>

            <h2>Quick mental model swap</h2>
            <p>If your Alpine app is single-file with a few <code>x-data</code> islands:</p>
            <ol>
                <li>Replace every <code>x-</code> with <code>cv-</code> in your template.</li>
                <li>Add <code>&lt;script type="module"&gt;import { autoInit } from 'courvux'; autoInit();&lt;/script&gt;</code>.</li>
                <li>Replace the Alpine CDN script with the Courvux importmap (see <router-link to="/installation" class="link">Installation → CDN</router-link>).</li>
                <li>Done. The site behaves the same.</li>
            </ol>
            <p>From there, the Courvux extras (router, store, components, SSG) are optional — adopt them when you outgrow inline scopes.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/migrating-from-vue" style="font-size:13px; color:#555;">← Migrating from Vue</router-link>
                <router-link to="/" style="font-size:13px; color:#111; font-weight:600;">Home →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Migrating from Alpine',
            description: 'Mapping table from Alpine.js to Courvux: x-data → cv-data, directives, named components, stores. Mostly identical syntax with a prefix swap.',
            slug: '/migrating-from-alpine',
        });
    },
};
