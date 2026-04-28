export default {
    data: {
        s_dir: `// Full definition
app.directive('focus', {
    onMount(el, binding) { el.focus(); },
    onUpdate(el, binding) { /* reactive update */ },
    onDestroy(el, binding) { /* cleanup */ }
});

// Shorthand — mount only
app.directive('highlight', (el, binding) => {
    el.style.background = binding.value ?? 'yellow';
});

// Per-component directives
{
    directives: {
        tooltip: { onMount(el, b) { ... }, onDestroy(el) { ... } }
    }
}`,
        s_dir_use: `<!-- Plain -->
<input cv-focus />

<!-- With value (reactive) -->
<p cv-highlight="activeColor">Text</p>

<!-- With argument and modifiers -->
<div cv-pin:top.once="offset"></div>`,
        s_transition: `<!-- Bare cv-transition — fade (built-in) -->
<div cv-show="open" cv-transition>Panel</div>

<!-- Fade + scale -->
<div cv-show="open" cv-transition.scale>Panel</div>

<!-- Scale origin + duration -->
<div cv-show="open" cv-transition.scale.90.duration.400>Panel</div>

<!-- Class-based (Alpine-compatible) — any CSS framework -->
<div
    cv-show="open"
    cv-transition:enter="transition ease-out duration-300"
    cv-transition:enter-start="opacity-0 scale-95"
    cv-transition:enter-end="opacity-100 scale-100"
    cv-transition:leave="transition ease-in duration-200"
    cv-transition:leave-start="opacity-100 scale-100"
    cv-transition:leave-end="opacity-0 scale-95"
>Panel</div>

<!-- <cv-transition> component (built-in named animations) -->
<cv-transition name="fade" :show="open">
    <div>Animated content</div>
</cv-transition>`,
        s_intersect: `<!-- Fire when element enters viewport -->
<div cv-intersect="loadMore()">...</div>

<!-- Separate enter / leave handlers -->
<div
    cv-intersect:enter="onEnter()"
    cv-intersect:leave="onLeave()"
>...</div>

<!-- Modifiers -->
<div cv-intersect.once="trackImpression()">...</div>
<div cv-intersect.half="handler()">...</div>     <!-- 50% visible -->
<div cv-intersect.threshold-75="handler()">...</div>
<div cv-intersect.margin-200="prefetch()">...</div>`,
        s_plugins: `const analyticsPlugin = {
    install(app) {
        if (app.router) {
            const prev = app.router.afterEach;
            app.router.afterEach = (to, from) => {
                prev?.(to, from);
                analytics.track(to.path);
            };
        }
    }
};

createApp(config)
    .use(analyticsPlugin)
    .mount('#app');`,
        s_magic: `// Register a global $name property available in every component
createApp(config)
    .magic('fmt', () => ({
        currency: (val) => new Intl.NumberFormat('en-US', {
            style: 'currency', currency: 'USD'
        }).format(val),
        date: (val) => new Date(val).toLocaleDateString(),
    }))
    .magic('http', () => axios)
    .mount('#app');

// In any template:
// <p>{{ $fmt.currency(price) }}</p>
// <button @click="$http.post('/api/save', data)">Save</button>`,
        s_autoinit: `import { autoInit } from 'courvux';

// Scans [cv-data] elements on DOMContentLoaded
autoInit({
    components: { dropdown: DropdownDef },
    directives: { tooltip: myDirective },
    globalProperties: { appName: 'My Site' }
});`,
    },
    template: `
        <div class="prose">
            <h1>Advanced</h1>

            <h2>Custom Directives</h2>
            <p>Register globally via <code>app.directive()</code> or per-component via <code>directives</code>.</p>
            <code-block :lang="'js'" :code="s_dir"></code-block>
            <code-block :lang="'html'" :code="s_dir_use"></code-block>
            <table>
                <tr><th>Binding property</th><th>Description</th></tr>
                <tr><td><code>value</code></td><td>Evaluated expression (reactive in <code>onUpdate</code>)</td></tr>
                <tr><td><code>arg</code></td><td>Argument after <code>:</code> — <code>cv-pin:top</code> → <code>'top'</code></td></tr>
                <tr><td><code>modifiers</code></td><td>Flags — <code>cv-pin.once</code> → <code>{ once: true }</code></td></tr>
            </table>

            <h2>Transitions — cv-transition</h2>
            <p>Animate elements entering and leaving. Works on any element with <code>cv-show</code>.</p>
            <code-block :lang="'html'" :code="s_transition"></code-block>

            <h2>cv-intersect — Intersection Observer</h2>
            <code-block :lang="'html'" :code="s_intersect"></code-block>

            <h2>Plugin System</h2>
            <p>A plugin is an object with an <code>install(app)</code> method. Install before mounting. Duplicate installs are silently ignored.</p>
            <code-block :lang="'js'" :code="s_plugins"></code-block>

            <h2>app.magic() — global properties</h2>
            <p>Register a <code>$name</code> property available in every component template.</p>
            <code-block :lang="'js'" :code="s_magic"></code-block>

            <h2>autoInit()</h2>
            <p>Initialize <code>cv-data</code> elements automatically — no <code>createApp()</code> required. Ideal for server-rendered HTML.</p>
            <code-block :lang="'js'" :code="s_autoinit"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/store" style="font-size:13px; color:#555;">← Store</router-link>
                <router-link to="/demo" style="font-size:13px; color:#111; font-weight:600;">TODO Demo →</router-link>
            </div>
        </div>
    `
};
