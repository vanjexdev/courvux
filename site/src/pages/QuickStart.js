export default {
    data: {
        s1: `import { createApp } from 'courvux';

createApp({
    template: \`
        <div>
            <h1>{{ count }}</h1>
            <button @click="count++">Increment</button>
            <button @click="count = 0">Reset</button>
        </div>
    \`,
    data: { count: 0 }
}).mount('#app');`,
        s2: `createApp({
    template: \`
        <div>
            <input cv-model="name" placeholder="Your name" />
            <p cv-if="name">Hello, {{ name }}!</p>
            <p cv-else>Enter your name above.</p>
        </div>
    \`,
    data: { name: '' }
}).mount('#app');`,
        s3: `createApp({
    template: \`
        <ul>
            <li cv-for="item in items" :key="item.id">
                {{ item.text }}
                <button @click="remove(item.id)">×</button>
            </li>
        </ul>
        <input cv-model="newItem" @keydown.enter="add()" placeholder="Add item..." />
    \`,
    data: { items: [], newItem: '', _id: 0 },
    methods: {
        add() {
            if (!this.newItem.trim()) return;
            this.items = [...this.items, { id: ++this._id, text: this.newItem }];
            this.newItem = '';
        },
        remove(id) {
            this.items = this.items.filter(i => i.id !== id);
        }
    }
}).mount('#app');`,
        s4: `import { createApp, createRouter, createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest' },
    actions: {
        login(name) { this.user = name; }
    }
});

const router = createRouter([
    { path: '/',      component: HomeComp },
    { path: '/about', component: AboutComp }
], { mode: 'hash' });

createApp({ store, router, template: '<router-view />' }).mount('#app');`,
    },
    template: `
        <div class="prose">
            <h1>Quick Start</h1>
            <p>Three examples to get you productive in minutes.</p>

            <h2>1. Reactive counter</h2>
            <p>The minimal Courvux app — reactive state + event binding in a single object.</p>
            <code-block :lang="'js'" :code="s1" :label="'main.js'"></code-block>

            <h2>2. Two-way binding + conditionals</h2>
            <p><code>cv-model</code> syncs input to state. <code>cv-if</code>/<code>cv-else</code> toggle DOM nodes.</p>
            <code-block :lang="'js'" :code="s2" :label="'main.js'"></code-block>

            <h2>3. List with keyed reconciliation</h2>
            <p>
                <code>cv-for</code> with <code>:key</code> enables efficient DOM reuse —
                only added/removed/reordered nodes are touched.
            </p>
            <code-block :lang="'js'" :code="s3" :label="'main.js'"></code-block>

            <h2>Larger apps — router + store</h2>
            <p>Add a router for multi-page navigation and a store for global state:</p>
            <code-block :lang="'js'" :code="s4" :label="'main.js'"></code-block>

            <div class="callout info">
                Every API shown here is covered in depth in the sidebar sections.
                Start with <router-link to="/template">Template Syntax</router-link> or jump to
                <router-link to="/demo">the TODO demo</router-link>.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/installation" style="font-size:13px; color:#555;">← Installation</router-link>
                <router-link to="/template" style="font-size:13px; color:#111; font-weight:600;">Template Syntax →</router-link>
            </div>
        </div>
    `
};
