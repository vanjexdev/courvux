import { setHead } from '../seo.js';

export default {
    data: {
        s_storage: `import { cvStorage } from 'courvux';

const settings = cvStorage('app-settings', {
    theme: 'light',
    sidebar: true,
});

settings.theme = 'dark';   // automatically persisted to localStorage
settings.$clear();          // reset to defaults + remove from storage`,

        s_fetch: `import { cvFetch } from 'courvux';

export default {
    data: { users: [], loading: false, error: null },
    onMount() {
        const { execute, abort } = cvFetch('/api/users', ({ data, loading, error }) => {
            this.users   = data ?? [];
            this.loading = loading;
            this.error   = error;
        });
        this.$addCleanup(abort);
    }
};`,

        s_fetch_opts: `cvFetch('/api/posts', cb, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    { title: 'Hello' },
    immediate: false,                    // don't fire until execute() is called
    transform: raw => raw.data ?? raw,   // map response payload
});`,

        s_debounce: `import { cvDebounce } from 'courvux';

export default {
    data: { query: '', results: [] },
    methods: {
        // 300ms after the last keystroke, fire a single request
        search: cvDebounce(function(q) {
            return fetch(\`/search?q=\${q}\`)
                .then(r => r.json())
                .then(r => this.results = r);
        }, 300),
    }
};`,

        s_throttle: `import { cvThrottle } from 'courvux';

onMount() {
    // Fire at most once every 100ms while scrolling
    window.addEventListener('scroll', cvThrottle(() => {
        this.scrollY = window.scrollY;
    }, 100));
}`,

        s_media: `import { cvMediaQuery } from 'courvux';

onMount() {
    cvMediaQuery('(max-width: 768px)', matches => {
        this.isMobile = matches;
    });
}`,

        s_listener: `import { cvListener } from 'courvux';

onMount() {
    const off = cvListener(window, 'keydown', e => {
        if (e.key === 'Escape') this.close();
    });
    this.$addCleanup(off);
}`,

        s_define: `import { defineComposable } from 'courvux';

// A composable is a factory that returns a partial component config:
// data, methods, computed, watch, and lifecycle hooks. Spread the result
// into a component to share the logic.
export const useCounter = defineComposable((initial = 0) => ({
    data: { count: initial },
    methods: {
        inc() { this.count++; },
        reset() { this.count = initial; },
    },
}));

// Use it:
export default {
    ...useCounter(10),
    template: \`<button @click="inc()">{{ count }}</button>\`,
};`,

        s_useMany: `import { useComposables } from 'courvux';
import { useCounter } from './composables/useCounter.js';
import { useFlag }    from './composables/useFlag.js';

export default {
    // Merges data, methods, computed, watch, and hooks from all the
    // composables into one config. First-writer wins on key collisions
    // (and a console warning is logged). Hooks run in insertion order.
    ...useComposables(
        useCounter(0),
        useFlag(),
        // A plain config object also works — useful to add component-only
        // pieces alongside composables:
        {
            methods: {
                logBoth() { console.log(this.count, this.flag); }
            }
        }
    ),
    template: \`
        <div>
            <p>{{ count }} — {{ flag }}</p>
            <button @click="inc()">+1</button>
            <button @click="toggle()">toggle</button>
        </div>
    \`,
};`,

        s_nested: `import { defineComposable, useComposables } from 'courvux';

const useLogger = defineComposable((label) => ({
    data: { lastLog: '' },
    methods: { log(msg) { this.lastLog = \`\${label}:\${msg}\`; } },
}));

// Composables can call other composables. Combine via useComposables and
// return the merged config — the outer composable is just a normal factory.
export const useCounter = defineComposable((initial = 0) => useComposables(
    useLogger('counter'),
    {
        data: { count: initial },
        methods: {
            inc() { this.count++; this.log(\`now=\${this.count}\`); },
        },
    }
));`,
    },
    template: `
        <div class="prose">
            <h1>Composables</h1>
            <p>Courvux ships a small set of composables that cover common app needs without third-party deps. All preserve <code>this</code> binding, are SSR-safe, and integrate with <code>$addCleanup</code> for automatic teardown.</p>

            <table>
                <thead>
                    <tr><th>Composable</th><th>Purpose</th></tr>
                </thead>
                <tbody>
                    <tr><td><code>defineComposable(factory)</code></td><td>Author a reusable bundle of data, methods, computed, watch, and hooks</td></tr>
                    <tr><td><code>useComposables(...composables)</code></td><td>Merge multiple composables into one spreadable config</td></tr>
                    <tr><td><code>cvStorage(key, defaults)</code></td><td>Reactive object backed by <code>localStorage</code></td></tr>
                    <tr><td><code>cvFetch(url, callback, options)</code></td><td>Reactive HTTP fetch with <code>{ data, loading, error }</code></td></tr>
                    <tr><td><code>cvDebounce(fn, ms)</code></td><td>Debounced function preserving <code>this</code></td></tr>
                    <tr><td><code>cvThrottle(fn, ms)</code></td><td>Throttled function preserving <code>this</code></td></tr>
                    <tr><td><code>cvMediaQuery(query, callback)</code></td><td>matchMedia with reactive callback</td></tr>
                    <tr><td><code>cvListener(target, event, handler)</code></td><td>addEventListener returning a cleanup fn</td></tr>
                </tbody>
            </table>

            <h2>defineComposable — author your own</h2>
            <p>A composable is a factory that returns a partial component config (<code>data</code>, <code>methods</code>, <code>computed</code>, <code>watch</code>, lifecycle hooks). Spread the result into a component to share the logic without coupling to the global store.</p>
            <code-block :lang="'js'" :code="s_define"></code-block>
            <p><code>defineComposable</code> is the identity helper used to mark intent and improve TypeScript inference — at runtime it returns the factory unchanged.</p>

            <h2>useComposables — combine several</h2>
            <p>To use more than one composable in the same component, wrap them with <code>useComposables(...)</code>. Data, methods, computed, watch, and hooks from every composable are merged into a single config you can spread.</p>
            <code-block :lang="'js'" :code="s_useMany"></code-block>
            <div class="callout">
                <strong>Collision rule:</strong> first writer wins for <code>data</code>, <code>methods</code>, <code>computed</code>, and <code>watch</code> keys. Duplicates log a <code>console.warn</code>. Lifecycle hooks (<code>onMount</code>, <code>onBeforeUnmount</code>, …) all run, in insertion order.
            </div>

            <h3>Nested composables</h3>
            <p>Composables are normal functions, so they can call other composables. Combine the results with <code>useComposables</code> and return the merged config:</p>
            <code-block :lang="'js'" :code="s_nested"></code-block>

            <h2>cvStorage — persistent reactive state</h2>
            <p>Every mutation is auto-persisted to <code>localStorage</code>. Survives page reloads.</p>
            <code-block :lang="'js'" :code="s_storage"></code-block>

            <h2>cvFetch — reactive data fetching</h2>
            <p>Calls the callback with <code>{ data, loading, error }</code> across the request lifecycle. Returns <code>{ execute, abort }</code> for manual control.</p>
            <code-block :lang="'js'" :code="s_fetch"></code-block>

            <h3>Options</h3>
            <code-block :lang="'js'" :code="s_fetch_opts"></code-block>

            <h2>cvDebounce — coalesce rapid calls</h2>
            <p>Returns a debounced version of the function. Wraps it preserving <code>this</code> so it works as a method.</p>
            <code-block :lang="'js'" :code="s_debounce"></code-block>

            <h2>cvThrottle — rate limit</h2>
            <p>Fires immediately, then drops calls inside the window and schedules a single trailing call.</p>
            <code-block :lang="'js'" :code="s_throttle"></code-block>

            <h2>cvMediaQuery — reactive matchMedia</h2>
            <p>Fires the callback with the initial value, then on every change.</p>
            <code-block :lang="'js'" :code="s_media"></code-block>

            <h2>cvListener — event listener with cleanup</h2>
            <p>Adds an event listener and returns a function that removes it. Pair with <code>$addCleanup</code> for automatic teardown on destroy.</p>
            <code-block :lang="'js'" :code="s_listener"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/lifecycle" style="font-size:13px; color:#555;">← Lifecycle</router-link>
                <router-link to="/event-bus" style="font-size:13px; color:#111; font-weight:600;">Event Bus →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Composables',
            description: 'Author and reuse logic in Courvux with defineComposable + useComposables, plus the built-in cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener helpers.',
            slug: '/composables',
        });
    },
};
