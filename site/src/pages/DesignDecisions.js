import { setHead } from '../seo.js';

export default {
    template: `
        <div class="prose">
            <h1>Design decisions</h1>
            <p>The choices below shape what Courvux is — and isn't. Each one has a contextual reason and an alternative we explicitly rejected. The goal of this page is two-fold:</p>
            <ul>
                <li>Save you from re-asking the same questions when you evaluate the framework.</li>
                <li>Save us from re-defending the same trade-offs in every Twitter thread.</li>
            </ul>
            <p>If a decision starts feeling wrong as the framework grows, the "When to reconsider" line in each section is the trigger to revisit it.</p>

            <h2>Proxy reactivity, not signals</h2>
            <p><strong>Decision:</strong> reactive state is built on <code>Proxy</code> traps, with deep wrapping for nested objects and arrays. No signals (<code>ref()</code> / <code>$state</code>).</p>
            <p><strong>Alternative rejected:</strong> signals (Solid, Preact Signals, Svelte 5 runes).</p>
            <p><strong>Why:</strong> Proxy lets users write <code>this.count++</code> in methods and <code>{{ count }}</code> in templates with no boilerplate. Signals require <code>count.value++</code> or wrappers everywhere, which is ergonomically heavier for the Vue-like Options API style we wanted. We pay a small runtime cost (Proxy traps are not free) but the developer experience win is real and immediate.</p>
            <p><strong>Trade-off accepted:</strong> deep equality and structural-clone scenarios are slightly slower than signal-based counterparts. Doesn't matter for typical UI work; matters for animation-heavy or data-grid-heavy apps where you'd switch to a more specialized tool anyway.</p>
            <p><strong>When to reconsider:</strong> if benchmarks (Fase 4 of the roadmap) show Courvux losing badly in re-render-heavy scenarios, signals could become an opt-in alternative for hot paths — never replacing the default.</p>

            <h2>Options API, not Composition API</h2>
            <p><strong>Decision:</strong> components are plain objects with <code>data</code>, <code>methods</code>, <code>computed</code>, <code>watch</code>, lifecycle hooks. <code>this</code> inside each is the reactive state.</p>
            <p><strong>Alternative rejected:</strong> Composition API (Vue 3's <code>setup()</code>, React Hooks-style).</p>
            <p><strong>Why:</strong> Options API is what people who haven't touched JS frameworks since Vue 2 immediately recognize. The cost of "learn this new mental model" is zero. Composition API is more powerful for code reuse but requires understanding closures + lifecycles + tracking + manual cleanup — too much friction for a framework whose first promise is "drop into any HTML".</p>
            <p><strong>Trade-off accepted:</strong> code reuse is harder. <code>defineComposable</code> (roadmap Fase 3) closes that gap with the same Options API ergonomics — no Composition API runtime needed.</p>
            <p><strong>When to reconsider:</strong> if real-world apps repeatedly hit reuse problems even with <code>defineComposable</code>, a Composition-style API could be added as a second option. Not before.</p>

            <h2>No Virtual DOM</h2>
            <p><strong>Decision:</strong> the framework walks the DOM once at mount, attaches reactive subscriptions to nodes that bind state, and updates only those nodes when state changes.</p>
            <p><strong>Alternative rejected:</strong> Virtual DOM diffing (React, Vue 3, Preact).</p>
            <p><strong>Why:</strong> Most UI updates touch one or two nodes. Diffing a tree to discover that is wasted work. Direct DOM updates are simpler to reason about, faster on hot paths, and produce smaller bundle sizes. The tradeoff is real for cases the diff was good at — like swapping entire subtrees — but for those we have keyed <code>cv-for</code> with explicit reconciliation, which gives equivalent behavior without the perma-cost of a vDOM.</p>
            <p><strong>Trade-off accepted:</strong> rendering deeply nested templates that depend on dynamic conditions (<code>cv-if</code> chains, dynamic components) sometimes requires more careful template structure than vDOM diffing would forgive.</p>
            <p><strong>When to reconsider:</strong> never as the default. Could justify an optional vDOM-backed component type for very large interactive surfaces (visual editors, IDE-like UIs) — but that's plugin territory, not core.</p>

            <h2>DevTools embedded, not browser extension</h2>
            <p><strong>Decision:</strong> <code>setupDevTools()</code> + <code>mountDevOverlay()</code> ship in the framework bundle. They render a draggable panel into the page itself.</p>
            <p><strong>Alternative rejected:</strong> a separate browser extension (Vue DevTools / React DevTools pattern).</p>
            <p><strong>Why:</strong> Browser extensions are friction. Per-browser install, per-user install, often blocked in corporate environments, never available on mobile. Embedded devtools are immediate: gate behind <code>import.meta.env.DEV</code> and they're visible the moment a developer opens a dev build, on any browser, on any device.</p>
            <p><strong>Trade-off accepted:</strong> embedded devtools cost runtime weight. They also can't introspect frames / iframes / shadow roots the way an extension would. We mitigate the weight by code-splitting (the call site is dynamic-imported behind the env flag) and accept the introspection limit.</p>
            <p><strong>When to reconsider:</strong> if the community really wants a Chrome extension, the embedded hook (<code>window.__COURVUX_DEVTOOLS__</code>) already exposes everything an extension would need. The extension would be additive, not a replacement.</p>

            <h2><code>templateUrl</code> alongside <code>template</code></h2>
            <p><strong>Decision:</strong> components can declare templates inline (<code>template: '...'</code>) or as external HTML files (<code>templateUrl: './foo.html'</code>). The Vite plugin (<code>courvux/plugin</code>) inlines templateUrl references at build time.</p>
            <p><strong>Alternative rejected:</strong> single-file components with custom syntax (<code>.vue</code> / <code>.svelte</code>).</p>
            <p><strong>Why:</strong> SFC syntax requires a parser, IDE integration (Volar-style), and compiler plumbing. We're optimizing for "drop into any project". Plain <code>.html</code> + <code>.js</code> works in every editor, every linter, every formatter, with zero plugin setup. The Vite plugin is a quality-of-life improvement, not a requirement.</p>
            <p><strong>Trade-off accepted:</strong> co-locating template + script + style in a single file (the SFC value-prop) is harder. Some users will miss it.</p>
            <p><strong>When to reconsider:</strong> never as a replacement — the parser cost is fundamentally at odds with our "small framework" promise. Could appear as an optional separate compiler package for users who really want it.</p>

            <h2><code>cv-</code> prefix, not <code>x-</code> or <code>v-</code></h2>
            <p><strong>Decision:</strong> directives use <code>cv-</code> as the prefix (<code>cv-for</code>, <code>cv-if</code>, <code>cv-show</code>, etc.). Bindings use <code>:prop</code> and events use <code>@event</code> or <code>cv:on:event</code>.</p>
            <p><strong>Alternative rejected:</strong> <code>x-</code> (Alpine), <code>v-</code> (Vue), or no prefix at all.</p>
            <p><strong>Why:</strong> A unique prefix avoids conflicts with HTML / CSS authors who already use <code>x-</code> in their own conventions, and makes templates greppable ("where do we use <code>cv-show</code>?" returns Courvux usage only). <code>:</code> and <code>@</code> are kept identical to Vue / Alpine because muscle memory is real and the cost of changing them is zero.</p>
            <p><strong>Trade-off accepted:</strong> people copy-pasting Alpine examples need to swap <code>x-</code> for <code>cv-</code>. The migration guide (<a href="/courvux/migrating-from-alpine/" class="link">Migrating from Alpine</a>) lists every mapping.</p>
            <p><strong>When to reconsider:</strong> never. Renaming directives post-1.0 is a breaking change for every user.</p>

            <h2>SSG over per-request SSR</h2>
            <p><strong>Decision:</strong> the supported SSR story is <strong>static site generation</strong> via <code>courvux/plugin/ssg</code>. <code>renderToString</code> exists for custom server setups, but isn't optimized for high-throughput per-request rendering.</p>
            <p><strong>Alternative rejected:</strong> a Next.js / Nuxt-style streaming SSR runtime.</p>
            <p><strong>Why:</strong> SSG covers the SEO / OG / first-paint use cases that 90% of "I need SSR" actually means, with no server to operate. Per-request SSR adds operational complexity (Node servers, cache layers, memory ceilings) that's hard to justify when SSG + client-side hydration solves the same problem for static-content sites.</p>
            <p><strong>Trade-off accepted:</strong> truly dynamic per-request server rendering (per-user dashboards, auth-gated content) needs to be done by your own backend. <code>renderToString</code> works there, but you'll write the integration glue.</p>
            <p><strong>When to reconsider:</strong> if a real user case demands streaming SSR and we can implement it in &lt;500 lines without bloating the core, it could land as a peer-dep package (<code>courvux/server</code>). Not before.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/" style="font-size:13px; color:#555;">← Home</router-link>
                <router-link to="/faq" style="font-size:13px; color:#111; font-weight:600;">FAQ →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Design decisions',
            description: 'Why Courvux uses Proxy over signals, Options API over Composition, no Virtual DOM, embedded DevTools, cv- prefix, and SSG over per-request SSR. Trade-offs documented.',
            slug: '/design-decisions',
        });
    },
};
