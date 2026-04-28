export default {
    data: {
        s_setup: `import { createApp, createRouter } from 'courvux';

const router = createRouter([
    { path: '/',       component: HomeComp },
    { path: '/about',  component: AboutComp },
    { path: '/user/:id', component: UserComp },
    { path: '*',       component: NotFoundComp }   // catch-all
], {
    mode: 'hash',          // 'hash' (default) | 'history'
    transition: 'fade',    // global page transition
    beforeEach(to, next) {
        if (!isLoggedIn() && to.path !== '/login') next('/login');
        else next();
    },
    scrollBehavior(_to, _from) { return { x: 0, y: 0 }; }
});

createApp({
    router,
    template: \`
        <nav>
            <router-link to="/">Home</router-link>
            <router-link to="/about">About</router-link>
        </nav>
        <router-view />
    \`
}).mount('#app');`,
        s_route: `// Route options
{
    path: '/dashboard',
    component: DashboardComp,       // single view
    components: { default: Main, panel: Sidebar }, // named views
    redirect: '/home',              // static redirect
    redirect: (route) => \`/new/\${route.params.id}\`, // dynamic
    layout: \`<aside>{{ $store.user }}</aside><router-view />\`,
    transition: 'slide-up',         // per-route override
    keepAlive: true,                // cache DOM + state
    meta: { requiresAuth: true },
    loadingTemplate: '<p>Loading...</p>',
    beforeEnter(to, next) { next(); },  // per-route guard
    children: [...]
}`,
        s_params: `// Route definition
{ path: '/user/:id', component: UserComp }

// In UserComp template
<p>ID: {{ $route.params.id }}</p>
<p>Query: {{ $route.query.tab }}</p>
<p>Meta: {{ $route.meta.section }}</p>`,
        s_lazy: `// Dynamic import — loaded on first visit
{ path: '/dashboard', component: () => import('./dashboard.js') }

// dashboard.js
export default {
    template: \`<h1>Dashboard</h1>\`,
    data: { /* ... */ }
};

// With Vite and .html templates
import template from './dashboard.html?raw';
export default { template, data: {} };`,
        s_navigate: `// Programmatic navigation
methods: {
    goHome()         { this.$router.navigate('/'); },
    goToUser(id)     { this.$router.navigate(\`/user/\${id}\`); },
    goBack()         { this.$router.back(); },
    search(term) {
        this.$router.navigate('/results', { query: { q: term } });
    },
    redirect(path) {
        this.$router.replace(path);  // no history entry
    }
}`,
        s_nested: `{
    path: '/panel',
    component: {
        template: \`
            <nav>
                <router-link to="/panel/stats">Stats</router-link>
                <router-link to="/panel/config">Config</router-link>
            </nav>
            <router-view />   <!-- child renders here -->
        \`
    },
    children: [
        { path: '/stats',  component: StatsComp },
        { path: '/config', component: ConfigComp }
    ]
}`,
    },
    template: `
        <div class="prose">
            <h1>Router</h1>
            <p>Client-side routing with hash or history mode, transitions, guards, lazy loading, and nested routes.</p>

            <h2>Setup</h2>
            <code-block :lang="'js'" :code="s_setup"></code-block>

            <h2>Route options</h2>
            <code-block :lang="'js'" :code="s_route"></code-block>

            <h2>Dynamic params & $route</h2>
            <code-block :lang="'js'" :code="s_params"></code-block>
            <table>
                <tr><th>Property</th><th>Description</th></tr>
                <tr><td><code>$route.path</code></td><td>Current pathname, e.g. <code>/user/42</code></td></tr>
                <tr><td><code>$route.params</code></td><td>Path params — <code>{ id: '42' }</code></td></tr>
                <tr><td><code>$route.query</code></td><td>Query string as object — <code>{ page: '2' }</code></td></tr>
                <tr><td><code>$route.meta</code></td><td>Route-level metadata object</td></tr>
            </table>

            <h2>Lazy loading</h2>
            <code-block :lang="'js'" :code="s_lazy"></code-block>

            <h2>Programmatic navigation — $router</h2>
            <code-block :lang="'js'" :code="s_navigate"></code-block>

            <h2>Nested routes</h2>
            <p>The parent component must contain a <code>&lt;router-view /&gt;</code>. Child paths are relative to the parent.</p>
            <code-block :lang="'js'" :code="s_nested"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/lifecycle" style="font-size:13px; color:#555;">← Lifecycle</router-link>
                <router-link to="/store" style="font-size:13px; color:#111; font-weight:600;">Store →</router-link>
            </div>
        </div>
    `
};
