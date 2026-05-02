import { setHead } from '../seo.js';

export default {
    data: {
        s_keyed: `<!-- Without :key, every state change rebuilds the whole list -->
<li cv-for="todo in todos">{{ todo.text }}</li>

<!-- With :key, only changed nodes are touched -->
<li cv-for="todo in todos" :key="todo.id">{{ todo.text }}</li>`,

        s_csp: `// Strict CSP rejects expressions evaluated via new Function():
//   <input cv-model.trim="user.name" />          ← still works
//   {{ count }}                                  ← still works
//   {{ count > 0 ? 'on' : 'off' }}               ← falls back to safe eval (no inline ternary)
//   :class="{ active: count > 0 && open }"       ← falls back

// Mitigations:
//   1. Move complex expressions into a computed and reference its name.
//   2. Move event-handler logic into a method.
//   3. Allow 'unsafe-eval' in CSP (loses the protection point).`,

        s_ts: `// 1. Component config files: declare with defineComponent for inference
import { defineComponent } from 'courvux';

export default defineComponent({
    data: { name: '' as string, count: 0 as number },
    methods: {
        inc(this) { this.count++; }   // 'this' typed against the data shape
    }
});

// 2. tsconfig.json — add Courvux to types
{
    "compilerOptions": {
        "types": ["courvux"]
    }
}

// 3. Templates outside SFC syntax don't get type-checked. Trade-off
//    accepted with the "no parser" decision.`,

        s_lazy: `// Lazy-load a component for code-splitting
{
    path: '/heavy',
    component: () => import('./pages/HeavyPage.js'),
    loadingTemplate: '<p>Loading...</p>'      // optional placeholder
}

// Or with defineAsyncComponent for finer control
import { defineAsyncComponent } from 'courvux';
const HeavyChart = defineAsyncComponent({
    loader: () => import('./HeavyChart.js'),
    loadingTemplate: '<div class="skeleton"></div>',
    errorTemplate: '<p>Failed to load chart</p>',
    delay: 200,
    timeout: 5000,
});`,

        s_vite: `// vite.config.js — recommended setup
import { defineConfig } from 'vite';
import courvux from 'courvux/plugin';        // inline templateUrl
import courvuxSsg from 'courvux/plugin/ssg'; // optional, for SSG

export default defineConfig({
    plugins: [
        courvux(),
        courvuxSsg({ /* see SSG docs */ }),
    ],
});`,

        s_tauri: `// 1. Build your Courvux app as a normal SPA (or SSG it).
// 2. Point Tauri's frontendDist at the build output.
// tauri.conf.json:
{
    "build": {
        "frontendDist": "../docs"        // or wherever your build lands
    }
}

// 3. Inside Courvux methods, call Tauri commands like any async fn:
methods: {
    async greet() {
        const { invoke } = window.__TAURI__.core;
        this.message = await invoke('greet', { name: this.name });
    }
}`,

        s_test: `// 1. Use the test-utils mount helper + happy-dom
// vitest.config.js
import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: { environment: 'happy-dom' }
});

// 2. Write the test
import { mount } from 'courvux/test-utils';
import { describe, it, expect } from 'vitest';

it('counter increments on click', async () => {
    const w = await mount({
        template: '<button @click="count++">{{ count }}</button>',
        data: { count: 0 }
    });
    w.find('button').click();
    await w.nextTick();
    expect(w.find('button').textContent).toBe('1');
    w.destroy();
});`,
    },
    template: `
        <div class="prose">
            <h1>FAQ &amp; troubleshooting</h1>
            <p>Common questions, in roughly the order they tend to come up. If your question isn't here, <a href="https://github.com/vanjexdev/courvux/issues" target="_blank" rel="noopener">open an issue</a> — answers here are usually distilled from real issues.</p>

            <h2>My <code>cv-for</code> isn't updating after I change the array</h2>
            <p>You're almost certainly missing <code>:key</code>. Without it, the framework destroys and recreates every node on each change — and if your update is a mutation that points to the same array reference, the surrounding reactivity may not re-render at all.</p>
            <code-block :lang="'html'" :code="s_keyed"></code-block>
            <p>Always pass <code>:key="item.id"</code> (or any stable unique identifier per item). See <router-link to="/template" class="link">Template Syntax → cv-for</router-link>.</p>

            <h2>Strict CSP breaks my app</h2>
            <p>Courvux uses <code>new Function()</code> to evaluate expressions in templates and inline event handlers. Strict Content Security Policies (no <code>unsafe-eval</code>) reject this. The framework falls back to a safe evaluator that handles property access and literals only, so you'll lose inline expressions but the app still mounts.</p>
            <code-block :lang="'js'" :code="s_csp"></code-block>
            <p>Trade-off documented at <router-link to="/design-decisions" class="link">Design Decisions</router-link>.</p>

            <h2>How do I integrate with TypeScript?</h2>
            <p>Three things: use <code>defineComponent</code> for component config inference, add Courvux to <code>tsconfig.json#types</code>, and accept that templates outside an SFC compiler aren't type-checked.</p>
            <code-block :lang="'ts'" :code="s_ts"></code-block>

            <h2>How do I lazy-load components?</h2>
            <p>Two ways: route-level (only loads when the route is visited) or component-level (more control, with <code>loadingTemplate</code> / <code>errorTemplate</code> / <code>timeout</code>).</p>
            <code-block :lang="'js'" :code="s_lazy"></code-block>

            <h2>Does it work with Vite / Webpack / Rollup?</h2>
            <p>Yes to Vite (recommended — there's a first-party plugin). Yes to Webpack and Rollup if you treat Courvux as a regular ES module dependency — but you'll lose the build-time <code>templateUrl</code> inlining and the SSG plugin (those are Vite-specific).</p>
            <code-block :lang="'js'" :code="s_vite"></code-block>

            <h2>Does it work with Tauri / Electron / Capacitor?</h2>
            <p>Yes. Courvux makes no assumptions about being inside a browser tab — it just needs a DOM. Build the app as a SPA (or SSG it for the splash / first-paint advantage), point the native shell at the build output.</p>
            <code-block :lang="'js'" :code="s_tauri"></code-block>
            <p>See <router-link to="/installation" class="link">Installation</router-link> and the <a href="https://github.com/vanjexdev/courvux/tree/main/examples/02-counter" target="_blank" rel="noopener">02-counter example</a>.</p>

            <h2>How do I write tests?</h2>
            <p>Use the <code>'courvux/test-utils'</code> subpath with Vitest + happy-dom. The wrapper exposes <code>state</code>, <code>find</code>, <code>nextTick</code>, <code>destroy</code> and friends — the docs at <router-link to="/testing" class="link">Testing</router-link> have the full API.</p>
            <code-block :lang="'js'" :code="s_test"></code-block>

            <h2>How do I migrate from Vue or Alpine?</h2>
            <p>Short answer: most templates and lifecycle hooks port nearly 1:1. The differences are surgical — directive prefix, where reactive state lives, how events / props flow.</p>
            <p>See the dedicated mapping tables: <router-link to="/migrating-from-vue" class="link">Migrating from Vue</router-link> and <router-link to="/migrating-from-alpine" class="link">Migrating from Alpine</router-link>.</p>

            <h2>The framework crashed on Safari / Samsung Internet — what now?</h2>
            <p>Three releases (0.4.4 / 0.4.5 / 0.4.6) shipped fixes for this exact class of bug — strict <code>setAttribute</code> validation in WebKit-class browsers rejecting framework directive names. If you hit a new instance: <a href="https://github.com/vanjexdev/courvux/issues" target="_blank" rel="noopener">open an issue with the page URL and Safari version</a>. These are first-priority fixes.</p>

            <h2>Can I use it without a build step?</h2>
            <p>Yes. Courvux is a single ES module. Drop an importmap and a <code>&lt;script type="module"&gt;</code> into any HTML file and you're done. See <router-link to="/installation" class="link">Installation → Without a bundler</router-link>.</p>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/design-decisions" style="font-size:13px; color:#555;">← Design Decisions</router-link>
                <router-link to="/migrating-from-vue" style="font-size:13px; color:#111; font-weight:600;">Migrating from Vue →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'FAQ',
            description: 'Frequently asked questions and troubleshooting for Courvux: cv-for keys, strict CSP, TypeScript, lazy loading, Vite/Tauri integration, testing, migration.',
            slug: '/faq',
        });
    },
};
