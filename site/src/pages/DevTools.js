import { setHead } from '../seo.js';

export default {
    data: {
        s_setup: `import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

const app = createApp(config);

if (import.meta.env.DEV) {
    const hook = setupDevTools();
    mountDevOverlay(hook);
}

await app.mount('#app');`,

        s_hook: `interface DevToolsHook {
    instances: DevToolsComponentInstance[];
    stores:    DevToolsStoreEntry[];
    on(event: 'mount' | 'update' | 'destroy' | 'store-update', cb: Function): () => void;
}

interface DevToolsComponentInstance {
    id:       string;
    name:     string;
    getState(): Record<string, any>;
    setState(key: string, value: any): void;
    subscribe(cb: () => void): () => void;
}`,

        s_external: `// The hook is also exposed for external tooling
const hook = window.__COURVUX_DEVTOOLS__;

hook.on('mount', instance => {
    console.log('mounted:', instance.name);
});

// Reactively edit a component's state from the console:
const inst = hook.instances.find(i => i.name === 'todo-list');
inst.setState('filter', 'completed');`,
    },
    template: `
        <div class="prose">
            <h1>DevTools</h1>
            <p>Courvux ships an in-app DevTools panel — no browser extension required. It mounts a draggable badge in the corner of the page that opens a panel showing all mounted components, their reactive state, and the global store, with <strong>inline live editing</strong>: click any value to edit it, press Enter to commit.</p>

            <h2>Setup</h2>
            <code-block :lang="'js'" :code="s_setup"></code-block>

            <h2>What it shows</h2>
            <table>
                <thead><tr><th>Tab</th><th>Content</th></tr></thead>
                <tbody>
                    <tr><td>Components</td><td>Tree of all mounted components with their reactive state. Click a key to edit its value live.</td></tr>
                    <tr><td>Store</td><td>Global store snapshot. Modules nested. Same inline editing as Components.</td></tr>
                    <tr><td>Events</td><td>Recent <code>$emit</code> / <code>$dispatch</code> activity for tracing communication between components.</td></tr>
                </tbody>
            </table>

            <h2>External integration</h2>
            <p>The hook is exposed at <code>window.__COURVUX_DEVTOOLS__</code> for use by external tooling — a Chrome extension is on the roadmap.</p>
            <code-block :lang="'js'" :code="s_external"></code-block>

            <h2>Hook API</h2>
            <code-block :lang="'ts'" :code="s_hook"></code-block>

            <div class="callout info">
                Wrap the setup in <code>import.meta.env.DEV</code> (Vite) or equivalent to keep the overlay out of production bundles. The runtime cost in dev is small — observers attach lazily per component.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/ssg" style="font-size:13px; color:#555;">← Static Generation</router-link>
                <router-link to="/testing" style="font-size:13px; color:#111; font-weight:600;">Testing →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'DevTools',
            description: 'In-app DevTools overlay for Courvux: live component state inspection and inline editing, no browser extension needed.',
            slug: '/devtools',
        });
    },
};
