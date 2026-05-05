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

        s_escape: `import { markRaw, toRaw, readonly } from 'courvux';`,

        s_markraw: `// Skip Proxy wrapping for third-party class instances whose internal
// slots break under Proxy (Chart.js, xterm.js, Map, Set, etc.)
{
    data: {
        chart: markRaw(new Chart(canvas, opts)),  // not made reactive
    }
}`,

        s_toraw: `// Get the underlying non-Proxy object — useful for serialization,
// JSON.stringify, deep equality, or passing to non-reactive APIs.
const snapshot = toRaw(this.user);
console.log(JSON.stringify(snapshot));`,

        s_readonly: `// Wrap so writes are silently ignored (with a warning).
// Use for provide values that descendants must not mutate.
provide() {
    return {
        config: readonly(this.appConfig),
    };
}`,

        s_proxyId: `// ❌ Pitfall — proxy identity is per-access
const card = this.cards.find(c => c.id === this.dragId);
const idx  = this.cards.indexOf(card);   // -1 — different proxy wrapper!
this.cards.splice(idx, 1);                // splice(-1, 1) deletes the LAST row

// ✅ Always look items up by primitive id, never by proxy reference
const idx = this.cards.findIndex(c => c.id === this.dragId);
this.cards.splice(idx, 1);

// ✅ Or unwrap with toRaw if you really need identity
import { toRaw } from 'courvux';
const raw = toRaw(card);
this.cards.indexOf(raw);   // works, but findIndex is usually clearer`,

        s_batchHot: `// Three rapid mutations to the same array key — drop handler in a kanban
// board, swap rows in a table, etc. Each one schedules its own re-render.
// Wrap in $batch so cv-for re-renders once with the final state instead of
// three times.
this.$batch(() => {
    this.rows[fromIdx].col = toCol;
    const [moved] = this.rows.splice(fromIdx, 1);
    this.rows.push(moved);
});`,
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

            <h2>Escape hatches</h2>
            <p>Three helpers let you opt out of reactivity selectively:</p>
            <code-block :lang="'js'" :code="s_escape"></code-block>

            <table>
                <thead><tr><th>Helper</th><th>Use case</th></tr></thead>
                <tbody>
                    <tr><td><code>markRaw(obj)</code></td><td>Skip Proxy wrapping (third-party class instances like Chart.js or xterm.js controllers)</td></tr>
                    <tr><td><code>toRaw(reactive)</code></td><td>Get the underlying non-Proxy object (serialization, <code>JSON.stringify</code>, deep equality)</td></tr>
                    <tr><td><code>readonly(obj)</code></td><td>Wrap so writes are silently ignored (use for <code>provide</code> values that shouldn't mutate downstream)</td></tr>
                </tbody>
            </table>

            <h3>markRaw</h3>
            <code-block :lang="'js'" :code="s_markraw"></code-block>

            <h3>toRaw</h3>
            <code-block :lang="'js'" :code="s_toraw"></code-block>

            <h3>readonly</h3>
            <code-block :lang="'js'" :code="s_readonly"></code-block>

            <div class="callout info">
                Native built-ins like <code>Date</code>, <code>Map</code>, <code>Set</code>, <code>RegExp</code>, and typed arrays are automatically skipped from Proxy wrapping — you don't need <code>markRaw</code> for them.
            </div>

            <h2>Common gotchas</h2>

            <h3>Proxy identity — prefer <code>findIndex</code> over <code>indexOf</code></h3>
            <p>Courvux wraps each property access in a fresh Proxy, so the object you get from <code>.find()</code> is not <code>===</code> to the same row when read again from the array. <code>indexOf(proxy)</code> returns <code>-1</code>, and <code>splice(-1, 1)</code> silently deletes the last row instead of the one you meant. Look items up by their primitive id with <code>findIndex</code>:</p>
            <code-block :lang="'js'" :code="s_proxyId"></code-block>

            <h3>Hot-path mutations — wrap in <code>$batch</code></h3>
            <p>If you do three or more rapid mutations to the same array (drag-and-drop, bulk edits, etc.), each one schedules its own re-render. Wrapping the sequence in <code>$batch</code> coalesces them into a single render with the final state — usually a noticeable speedup, and it sidesteps any chance of intermediate states being painted.</p>
            <code-block :lang="'js'" :code="s_batchHot"></code-block>
            <div class="callout info">
                Since 0.5.1, <code>cv-for</code> with <code>:key</code> serializes overlapping renders internally, so even without <code>$batch</code> the DOM stays correct. <code>$batch</code> is now a pure performance lever for these patterns, not a correctness requirement.
            </div>

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
