export default {
    data: {
        s1: `{
    data: { ticks: 0 },

    onBeforeMount() {
        // DOM not yet walked — no $el, no $refs
        console.log('before mount');
    },

    onMount() {
        // DOM ready — $el and $refs are available
        this._timer = setInterval(() => this.ticks++, 1000);
        console.log('root element:', this.$el.tagName);
    },

    onBeforeUnmount() {
        // Cleanup before destroy
        clearInterval(this._timer);
    },

    onDestroy() {
        console.log('component destroyed');
    }
}`,
        s2: `// keepAlive lifecycle
{
    onActivated() {
        // Restored from cache — re-subscribe to live data
        this.startPolling();
    },
    onDeactivated() {
        // Stored in cache — pause background work
        this.stopPolling();
    }
}`,
        s3: `// Error boundary — catches errors from descendant onMount
{
    data: { hasError: false, errorMsg: '' },
    onError(err) {
        this.hasError = true;
        this.errorMsg = err.message;
    },
    template: \`
        <p cv-if="hasError">Error: {{ errorMsg }}</p>
        <risky-widget cv-if="!hasError" />
    \`
}`,
    },
    template: `
        <div class="prose">
            <h1>Lifecycle Hooks</h1>
            <p>All hooks have <code>this</code> bound to the reactive component state.</p>

            <table>
                <tr><th>Hook</th><th>When it fires</th></tr>
                <tr><td><code>onBeforeMount</code></td><td>Before the DOM walk begins — <code>$el</code> not yet set</td></tr>
                <tr><td><code>onMount</code></td><td>After mounting — DOM ready, <code>$el</code> and <code>$refs</code> available</td></tr>
                <tr><td><code>onBeforeUnmount</code></td><td>Before destroy — cleanup event listeners, timers here</td></tr>
                <tr><td><code>onDestroy</code></td><td>After the component is destroyed</td></tr>
                <tr><td><code>onActivated</code></td><td>When a <code>keepAlive</code> component is restored from cache</td></tr>
                <tr><td><code>onDeactivated</code></td><td>When a <code>keepAlive</code> component is stored in cache</td></tr>
                <tr><td><code>onError</code></td><td>Catches errors thrown by descendant <code>onMount</code> hooks</td></tr>
            </table>

            <h2>Example — timer with cleanup</h2>
            <code-block :lang="'js'" :code="s1"></code-block>

            <h2>keepAlive hooks</h2>
            <p>Set <code>keepAlive: true</code> on a route to cache the component's DOM and state between navigations.</p>
            <code-block :lang="'js'" :code="s2"></code-block>

            <h2>Error boundary — onError</h2>
            <p>An <code>onError</code> hook catches errors thrown by any descendant component's <code>onMount</code>. The error does not propagate further.</p>
            <code-block :lang="'js'" :code="s3"></code-block>

            <div class="callout">
                On the root <code>createApp</code> config, <code>onMount</code> fires after the first route is fully rendered — safe for third-party DOM libraries.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/reactivity" style="font-size:13px; color:#555;">← Reactivity</router-link>
                <router-link to="/router" style="font-size:13px; color:#111; font-weight:600;">Router →</router-link>
            </div>
        </div>
    `
};
