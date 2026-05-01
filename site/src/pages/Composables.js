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
                    <tr><td><code>cvStorage(key, defaults)</code></td><td>Reactive object backed by <code>localStorage</code></td></tr>
                    <tr><td><code>cvFetch(url, callback, options)</code></td><td>Reactive HTTP fetch with <code>{ data, loading, error }</code></td></tr>
                    <tr><td><code>cvDebounce(fn, ms)</code></td><td>Debounced function preserving <code>this</code></td></tr>
                    <tr><td><code>cvThrottle(fn, ms)</code></td><td>Throttled function preserving <code>this</code></td></tr>
                    <tr><td><code>cvMediaQuery(query, callback)</code></td><td>matchMedia with reactive callback</td></tr>
                    <tr><td><code>cvListener(target, event, handler)</code></td><td>addEventListener returning a cleanup fn</td></tr>
                </tbody>
            </table>

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
            description: 'Reactive composables in Courvux: cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener.',
            slug: '/composables',
        });
    },
};
