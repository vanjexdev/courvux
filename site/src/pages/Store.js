export default {
    data: {
        s1: `import { createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest', count: 0 },
    actions: {
        setUser(name) { this.user = name; },
        increment()   { this.count++; },
        reset()       { this.count = 0; }
    }
});

createApp({ store, template: '...' }).mount('#app');`,
        s2: `<!-- Access in any template -->
<p>{{ $store.user }}</p>
<p>{{ $store.count }}</p>

<!-- Two-way binding directly on store -->
<input cv-model="$store.user" />

<!-- Call actions -->
<button @click="$store.increment()">+</button>
<button @click="$store.setUser('Alice')">Login</button>`,
        s3: `const store = createStore({
    state: { theme: 'light' },
    actions: {
        toggleTheme() {
            this.theme = this.theme === 'light' ? 'dark' : 'light';
        }
    },
    modules: {
        counter: {
            state: { n: 0 },
            actions: {
                inc()   { this.n++; },
                dec()   { this.n--; },
                reset() { this.n = 0; }
            }
        },
        user: {
            state: { name: 'guest', role: 'viewer' },
            actions: {
                login(name, role) { this.name = name; this.role = role; }
            }
        }
    }
});`,
        s4: `<!-- Module state and actions -->
<p>Count: {{ $store.counter.n }}</p>
<p>Role:  {{ $store.user.role }}</p>

<button @click="$store.counter.inc()">+</button>
<button @click="$store.user.login('Alice', 'admin')">Login</button>`,
        s5: `// Named export — use outside components
import { batchUpdate } from 'courvux';

batchUpdate(() => {
    store.counter.n  = 0;
    store.user.role  = 'viewer';
});`,
        s6: `// Provide / Inject — pass data deep without threading props

// Root app
createApp({
    provide: {
        theme: 'dark',
        apiUrl: 'https://api.example.com'
    }
})

// Or as a function for reactive values
{
    provide() {
        return { currentUser: this.user };
    }
}

// Any descendant
{ inject: ['theme', 'apiUrl'] }

// Object form — rename on injection
{ inject: { localTheme: 'theme', endpoint: 'apiUrl' } }`,
    },
    template: `
        <div class="prose">
            <h1>Store</h1>
            <p>A global reactive state container. Access via <code>$store</code> in any template or component.</p>

            <h2>createStore</h2>
            <code-block :lang="'js'" :code="s1"></code-block>

            <h2>Accessing store in templates</h2>
            <code-block :lang="'html'" :code="s2"></code-block>

            <h2>Store modules</h2>
            <p>Organize into namespaced sub-stores. Each module is a full standalone store. State and action names in each module must be distinct.</p>
            <code-block :lang="'js'" :code="s3"></code-block>
            <code-block :lang="'html'" :code="s4"></code-block>

            <h2>batchUpdate — bulk mutations</h2>
            <code-block :lang="'js'" :code="s5"></code-block>

            <h2>Provide / Inject</h2>
            <p>Alternative to the store for passing values deep into the tree without threading props through every level.</p>
            <code-block :lang="'js'" :code="s6"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/router" style="font-size:13px; color:#555;">← Router</router-link>
                <router-link to="/advanced" style="font-size:13px; color:#111; font-weight:600;">Advanced →</router-link>
            </div>
        </div>
    `
};
