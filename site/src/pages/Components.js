import { setHead } from '../seo.js';

export default {
    data: {
        s_define: `createApp({
    components: {
        'user-card': {
            template: \`<div class="card">{{ name }} — {{ role }}</div>\`,
            data: { name: '', role: '' }
        }
    },
    template: \`<user-card :name="currentUser" :role="'editor'" />\`
}).mount('#app');`,
        s_props: `<!-- Parent passes props with : prefix -->
<user-card :name="currentUser" :role="'editor'" />

// user-card component
{
    data: { name: '', role: '' },
    template: \`<h3>{{ name }}</h3><span>{{ role }}</span>\`
}`,
        s_emit: `// Child emits to parent
{
    methods: {
        close() { this.$emit('close'); },
        submit(data) { this.$emit('submit', data); }
    }
}

<!-- Parent listens -->
<modal @close="onClose" @submit="onSubmit" />`,
        s_dispatch: `// Child dispatches a bubbling CustomEvent from $el
methods: {
    select(item) {
        this.$dispatch('item-selected', { id: item.id });
    }
}

<!-- Any ancestor can listen -->
<div @item-selected="onSelected">
    <product-list />
</div>`,
        s_slots: `<!-- Default slot -->
<my-panel><p>Content from parent</p></my-panel>

<!-- my-panel template -->
<div class="panel"><slot></slot></div>

<!-- Named slots -->
<my-card>
    <span slot="header">Title</span>
    <p>Body content</p>
</my-card>

<!-- my-card template -->
<div>
    <header><slot name="header" /></header>
    <main><slot /></main>
</div>

<!-- Scoped slot — component exposes data up to parent -->
<item-list :items="products" v-slot="{ item, index }">
    {{ index }}. {{ item.name }}
</item-list>`,
        s_dynamic: `<!-- Mounts the component whose name matches activeView -->
<component :is="activeView" />

data: { activeView: 'tab-home' },
components: {
    'tab-home':     { template: \`<p>Home</p>\` },
    'tab-settings': { template: \`<p>Settings</p>\` }
}`,
        s_refs: `<!-- On a native element: stores the HTMLElement -->
<input cv-ref="myInput" />

<!-- On a component: stores the child's reactive state -->
<counter cv-ref="counter" />
<button @click="$refs.counter.reset()">Reset</button>`,
        s_model: `<!-- cv-model on a component -->
<mi-input cv-model="search" />

// Expands to: :modelValue="search" @update:modelValue="search = $event"
// Child emits:
methods: {
    onInput(e) { this.$emit('update:modelValue', e.target.value); }
}

<!-- Multiple cv-model bindings -->
<editor cv-model:title="docTitle" cv-model:body="docBody" />`,
    },
    template: `
        <div class="prose">
            <h1>Components</h1>
            <p>Components encapsulate template, data, methods, and lifecycle into reusable units.</p>

            <h2>Defining & registering</h2>
            <p>Register in <code>components</code> on the root app or any parent component. Children are available in that component's template and all its descendants.</p>
            <code-block :lang="'js'" :code="s_define"></code-block>

            <h2>Props</h2>
            <p>Pass reactive data from parent to child via <code>:propName</code>. Parent changes flow down automatically.</p>
            <code-block :lang="'js'" :code="s_props"></code-block>

            <h2>Emitting events — $emit</h2>
            <p>Child notifies parent without direct coupling.</p>
            <code-block :lang="'js'" :code="s_emit"></code-block>

            <h2>$dispatch — bubbling CustomEvent</h2>
            <p>Alternative to emit — fires a native <code>CustomEvent</code> that bubbles up the DOM. Any ancestor element can catch it with <code>@event</code>.</p>
            <code-block :lang="'js'" :code="s_dispatch"></code-block>

            <h2>Slots</h2>
            <p>Default slot, named slots, and scoped slots (parent reads component-exposed data via <code>v-slot</code>).</p>
            <code-block :lang="'html'" :code="s_slots"></code-block>

            <h2>Dynamic component</h2>
            <p>Destroys and mounts a new component when the value changes.</p>
            <code-block :lang="'html'" :code="s_dynamic"></code-block>

            <h2>$refs</h2>
            <code-block :lang="'html'" :code="s_refs"></code-block>

            <h2>cv-model on components</h2>
            <code-block :lang="'js'" :code="s_model"></code-block>

            <h2>Other instance properties</h2>
            <table>
                <tr><th>Property</th><th>Description</th></tr>
                <tr><td><code>$el</code></td><td>Root DOM element</td></tr>
                <tr><td><code>$attrs</code></td><td>Non-prop, non-event attributes. Set <code>inheritAttrs: false</code> to opt out of auto-inheritance.</td></tr>
                <tr><td><code>$parent</code></td><td>Parent component's reactive state. Prefer props + emit when possible.</td></tr>
                <tr><td><code>$slots</code></td><td>Object with <code>true</code> for each provided slot name. Use for conditional slot rendering.</td></tr>
            </table>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/template" style="font-size:13px; color:#555;">← Template Syntax</router-link>
                <router-link to="/reactivity" style="font-size:13px; color:#111; font-weight:600;">Reactivity →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Components',
            description: 'Define, register, and compose Courvux components with props, slots, emits, and scoped slots.',
            slug: '/components',
        });
    },
};
