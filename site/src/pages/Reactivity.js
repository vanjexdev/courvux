import { setHead } from '../seo.js';

export default {
    data: {
        s_computed: `{
    data: { price: 10, qty: 3 },
    computed: {
        total() { return this.price * this.qty; }
    },
    template: \`<p>Total: {{ total }}</p>\`
}`,
        s_computed_set: `computed: {
    fullName: {
        get() { return \`\${this.first} \${this.last}\`.trim(); },
        set(val) {
            const [f, ...rest] = val.split(' ');
            this.first = f ?? '';
            this.last  = rest.join(' ');
        }
    }
}`,
        s_watch: `watch: {
    // Simple watcher
    search(newVal, oldVal) {
        if (newVal) this.fetchResults(newVal);
    },

    // With options
    count: {
        immediate: true,   // run once on mount with current value
        handler(newVal, oldVal) {
            this.log.push(\`\${oldVal ?? 'init'} → \${newVal}\`);
        }
    },

    // Deep — detects nested mutations inside objects/arrays
    user: {
        deep: true,
        handler(newVal) { console.log('user changed:', newVal); }
    }
}`,
        s_watch_prog: `onMount() {
    // Returns an unsubscribe function
    const stop = this.$watch('count', (newVal, oldVal) => {
        console.log(oldVal, '→', newVal);
    }, { immediate: true });

    // Stop later:
    // stop();
}`,
        s_batch: `methods: {
    updateAll() {
        // One DOM flush instead of three
        this.$batch(() => {
            this.a++;
            this.b++;
            this.c = 'new';
        });
    }
}

// Named export — useful outside components
import { batchUpdate } from 'courvux';
batchUpdate(() => {
    store.counter.n = 10;
    store.user.role = 'admin';
});`,
        s_nexttick: `methods: {
    addItem() {
        this.items.push({ id: Date.now(), text: 'New' });
        // DOM not yet updated — wait for next flush
        this.$nextTick(() => {
            this.$refs.list.lastElementChild?.scrollIntoView();
        });
    },

    // Also returns a Promise
    async save() {
        this.saved = true;
        await this.$nextTick();
        console.log('DOM updated, badge is visible');
    }
}`,
        s_watcheffect: `onMount() {
    // Auto-tracked: re-runs when any accessed reactive key changes
    this.$watchEffect(() => {
        document.title = \`\${this.count} items — MyApp\`;
    });
    // Stopped automatically on component destroy
}`,
    },
    template: `
        <div class="prose">
            <h1>Reactivity</h1>
            <p>Courvux uses Proxy-based reactivity. Every key in <code>data</code> is observable — reading it creates a subscription, writing it notifies subscribers.</p>

            <h2>Computed properties</h2>
            <p>Automatically recalculate when their dependencies change. Dependencies are detected by parsing <code>this.key</code> references in the getter source.</p>
            <code-block :lang="'js'" :code="s_computed"></code-block>

            <h3>Computed setter</h3>
            <code-block :lang="'js'" :code="s_computed_set"></code-block>

            <h2>Watchers</h2>
            <p>React to state changes. Receives <code>(newVal, oldVal)</code> with <code>this</code> bound to component state.</p>
            <code-block :lang="'js'" :code="s_watch"></code-block>

            <h3>Programmatic watcher — $watch</h3>
            <code-block :lang="'js'" :code="s_watch_prog"></code-block>

            <h2>$batch — group mutations</h2>
            <p>Multiple state changes inside <code>$batch</code> trigger only one DOM update cycle.</p>
            <code-block :lang="'js'" :code="s_batch"></code-block>

            <h2>$nextTick — after DOM update</h2>
            <p>Runs a callback after the next reactive flush. Also returns a <code>Promise</code>.</p>
            <code-block :lang="'js'" :code="s_nexttick"></code-block>

            <h2>$watchEffect — auto-tracked effect</h2>
            <p>Runs immediately and re-runs when any reactive key accessed inside it changes. Stopped automatically on component destroy.</p>
            <code-block :lang="'js'" :code="s_watcheffect"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/components" style="font-size:13px; color:#555;">← Components</router-link>
                <router-link to="/lifecycle" style="font-size:13px; color:#111; font-weight:600;">Lifecycle →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Reactivity',
            description: 'Proxy-based reactive state, computed properties, watchers, and refs in Courvux.',
            slug: '/reactivity',
        });
    },
};
