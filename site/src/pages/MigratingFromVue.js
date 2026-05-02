import { setHead } from '../seo.js';

export default {
    data: {
        s_component_vue: `// Vue 3 — Options API
export default {
    data() { return { count: 0 } },
    computed: { double() { return this.count * 2 } },
    methods: { inc() { this.count++ } },
    mounted() { console.log('mounted') }
}`,

        s_component_courvux: `// Courvux — same shape, minor renames
export default {
    data: { count: 0 },                 // object literal, not a fn
    computed: { double() { return this.count * 2 } },
    methods: { inc() { this.count++ } },
    onMount() { console.log('mounted') } // mounted → onMount
};`,

        s_setup_warn: `// Vue 3 Composition API has no Courvux equivalent today.
// If your component looks like:
import { ref, computed, onMounted } from 'vue';
export default {
    setup() {
        const count = ref(0);
        const double = computed(() => count.value * 2);
        onMounted(() => console.log('mounted'));
        return { count, double };
    }
}

// Port to Options API:
export default {
    data: { count: 0 },
    computed: { double() { return this.count * 2 } },
    onMount() { console.log('mounted') }
};

// 'count++' instead of 'count.value++' — no .value anywhere.`,

        s_props: `// Vue
defineProps(['title', 'count'])
defineEmits(['change'])

// Courvux
{
    data: { title: '', count: 0 },     // props are just data with default values
    emits: ['change'],
    methods: {
        send() { this.$emit('change', this.count) }
    }
}`,

        s_router: `// Vue (vue-router 4)
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
router.push('/about');

// Courvux — built-in, available on every component instance
this.$route.params.id;
this.$router.navigate('/about');`,

        s_store: `// Vue (Pinia)
import { defineStore } from 'pinia';
export const useCart = defineStore('cart', {
    state: () => ({ items: [] }),
    actions: { add(item) { this.items.push(item) } }
});
// In a component:
const cart = useCart();
cart.add(product);

// Courvux — single createStore at app root
import { createStore } from 'courvux';
const store = createStore({
    state: { cart: { items: [] } },
    actions: {
        addToCart(item) { this.cart.items.push(item) }
    }
});
createApp({ store, ... }).mount('#app');
// In a component:
this.$store.addToCart(product);`,
    },
    template: `
        <div class="prose">
            <h1>Migrating from Vue</h1>
            <p>Most Vue (Options API) code ports to Courvux with surgical changes — directive names are mostly identical, lifecycle hooks rename, and reactive state lives in <code>data</code> as a plain object instead of a function. This page is a mapping reference, not an exhaustive guide.</p>

            <h2>Template syntax — mostly identical</h2>
            <table>
                <thead><tr><th>Vue</th><th>Courvux</th></tr></thead>
                <tbody>
                    <tr><td><code>v-for="item in items"</code></td><td><code>cv-for="item in items"</code></td></tr>
                    <tr><td><code>v-for + :key</code></td><td><code>cv-for + :key</code></td></tr>
                    <tr><td><code>v-if</code> / <code>v-else-if</code> / <code>v-else</code></td><td><code>cv-if</code> / <code>cv-else-if</code> / <code>cv-else</code></td></tr>
                    <tr><td><code>v-show</code></td><td><code>cv-show</code></td></tr>
                    <tr><td><code>v-model</code></td><td><code>cv-model</code></td></tr>
                    <tr><td><code>v-model.lazy</code> / <code>.trim</code> / <code>.number</code></td><td><code>cv-model.lazy</code> / <code>.trim</code> / <code>.number</code> (same)</td></tr>
                    <tr><td><code>v-html</code></td><td><code>cv-html</code> (also <code>cv-html.sanitize</code>)</td></tr>
                    <tr><td><code>v-once</code></td><td><code>cv-once</code></td></tr>
                    <tr><td><code>:prop</code></td><td><code>:prop</code> (identical)</td></tr>
                    <tr><td><code>@click</code> / <code>@event.modifier</code></td><td><code>@click</code> / <code>@event.modifier</code> (identical)</td></tr>
                    <tr><td><code>{{ expression }}</code></td><td><code>{{ expression }}</code> (identical)</td></tr>
                    <tr><td><code>&lt;component :is&gt;</code></td><td><code>&lt;component :is&gt;</code> (identical)</td></tr>
                    <tr><td><code>&lt;Transition&gt;</code></td><td><code>&lt;cv-transition&gt;</code> + <code>cv-transition</code> directive</td></tr>
                </tbody>
            </table>

            <h2>Component config — minor renames</h2>
            <code-block :lang="'js'" :code="s_component_vue"></code-block>
            <p>becomes:</p>
            <code-block :lang="'js'" :code="s_component_courvux"></code-block>
            <table>
                <thead><tr><th>Vue option</th><th>Courvux equivalent</th></tr></thead>
                <tbody>
                    <tr><td><code>data() { return {} }</code></td><td><code>data: {}</code> (object literal)</td></tr>
                    <tr><td><code>beforeCreate</code> / <code>created</code></td><td>not separate — use <code>data</code> initialization or <code>onBeforeMount</code></td></tr>
                    <tr><td><code>beforeMount</code> / <code>mounted</code></td><td><code>onBeforeMount</code> / <code>onMount</code></td></tr>
                    <tr><td><code>beforeUpdate</code> / <code>updated</code></td><td><code>onBeforeUpdate</code> / <code>onUpdated</code></td></tr>
                    <tr><td><code>beforeUnmount</code> / <code>unmounted</code></td><td><code>onBeforeUnmount</code> / <code>onDestroy</code></td></tr>
                    <tr><td><code>activated</code> / <code>deactivated</code></td><td><code>onActivated</code> / <code>onDeactivated</code> (with <code>keepAlive</code> route)</td></tr>
                    <tr><td><code>errorCaptured</code></td><td><code>onError</code> (semantic equivalent for descendant errors)</td></tr>
                </tbody>
            </table>

            <h2>Composition API — port to Options</h2>
            <p>Courvux does not have <code>setup()</code> / <code>ref()</code> / <code>reactive()</code>. The Composition API equivalent is the Options API itself. See <router-link to="/design-decisions" class="link">Design Decisions</router-link> for the rationale.</p>
            <code-block :lang="'js'" :code="s_setup_warn"></code-block>
            <p>For shared logic (the original use case for Composition API), use <code>defineComposable</code> when it lands in 0.5.x. Roadmap Fase 3.</p>

            <h2>Props &amp; emits</h2>
            <code-block :lang="'js'" :code="s_props"></code-block>
            <p>Props in Courvux are just <code>data</code> entries with their default values. The parent's <code>:title="x"</code> binding overrides the default. The component declares <code>emits</code> the same way Vue does (validated when emitted).</p>

            <h2>Router</h2>
            <code-block :lang="'js'" :code="s_router"></code-block>
            <p>The router is built-in (no external <code>vue-router</code>). The instance is on every component as <code>this.$router</code>; the current route on <code>this.$route</code>. Same shape as Vue Router for the common cases. See <router-link to="/router" class="link">Router</router-link>.</p>

            <h2>Store / Pinia</h2>
            <code-block :lang="'js'" :code="s_store"></code-block>
            <p>One global store at the app level (no per-store factory functions). Modules are supported via the <code>modules:</code> field for namespacing. See <router-link to="/store" class="link">Store</router-link>.</p>

            <h2>What doesn't have an equivalent</h2>
            <ul>
                <li><strong>Single-file components (<code>.vue</code> files)</strong> — Courvux uses plain <code>.js</code> + <code>.html</code> with the <code>templateUrl</code> pattern. Trade-off documented at <router-link to="/design-decisions" class="link">Design Decisions</router-link>.</li>
                <li><strong>Pinia plugin ecosystem</strong> — the store is simpler and integrated; advanced patterns (persistence, undo/redo) are user-implemented today.</li>
                <li><strong>Server Components / Suspense</strong> — out of scope for now. SSG covers most "I want server-rendered HTML" cases.</li>
                <li><strong>Provide/inject as a Composition API tree-bypass tool</strong> — Courvux supports the Options API form (<code>provide</code> / <code>inject</code>) without the Composition API integration.</li>
            </ul>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/faq" style="font-size:13px; color:#555;">← FAQ</router-link>
                <router-link to="/migrating-from-alpine" style="font-size:13px; color:#111; font-weight:600;">Migrating from Alpine →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Migrating from Vue',
            description: 'Mapping table from Vue 3 Options API to Courvux: directives, lifecycle hooks, props, emits, router, Pinia store. Surgical migration, mostly identical syntax.',
            slug: '/migrating-from-vue',
        });
    },
};
