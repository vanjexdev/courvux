# Courvux

Lightweight reactive UI framework for the browser. No virtual DOM — direct DOM updates via Proxy-based reactivity. Ships as a single minified ES module (~10 kB gzip), no build step required.

**Author:** Vanjex — **Version:** 0.1.1

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [createApp](#createapp)
- [Template Syntax](#template-syntax)
  - [Interpolation](#interpolation)
  - [Event binding — @event](#event-binding--event)
  - [Property binding — :prop](#property-binding--prop)
  - [Class binding — :class](#class-binding--class)
  - [Style binding — :style](#style-binding--style)
  - [cv-model — two-way binding](#cv-model--two-way-binding)
  - [cv-for — list rendering](#cv-for--list-rendering)
  - [cv-if / cv-else-if / cv-else](#cv-if--cv-else-if--cv-else)
  - [cv-show](#cv-show)
  - [cv-html](#cv-html)
  - [cv-once](#cv-once)
  - [cv-ref](#cv-ref)
  - [cv-teleport](#cv-teleport)
  - [cv-cloak](#cv-cloak)
- [Components](#components)
  - [Defining components](#defining-components)
  - [Props](#props)
  - [Emitting events — $emit](#emitting-events--emit)
  - [cv-model on components](#cv-model-on-components)
  - [Multiple cv-model bindings](#multiple-cv-model-bindings)
  - [Slots](#slots)
  - [Scoped slots](#scoped-slots)
  - [Dynamic component — \<component :is\>](#dynamic-component--component-is)
  - [$refs on components](#refs-on-components)
  - [$attrs and inheritAttrs](#attrs-and-inheritattrs)
  - [$parent](#parent)
  - [$slots](#slots-1)
- [Computed Properties](#computed-properties)
- [Watchers](#watchers)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Instance Properties](#instance-properties)
- [Custom Directives](#custom-directives)
- [Transitions — \<cv-transition\>](#transitions--cv-transition)
- [Router](#router)
  - [createRouter](#createrouter)
  - [Route options](#route-options)
  - [Dynamic params](#dynamic-params)
  - [Redirects](#redirects)
  - [Lazy loading](#lazy-loading)
  - [Loading state](#loading-state)
  - [Layouts](#layouts)
  - [Nested routes](#nested-routes)
  - [Named router views](#named-router-views)
  - [Route transitions](#route-transitions)
  - [keepAlive](#keepalive)
  - [Navigation guards](#navigation-guards)
  - [scroll behavior](#scroll-behavior)
  - [Programmatic navigation — $router](#programmatic-navigation--router)
- [Store](#store)
  - [createStore](#createstore)
  - [Store modules](#store-modules)
- [Provide / Inject](#provide--inject)
- [Batch Updates — $batch](#batch-updates--batch)
- [Error Boundaries — onError](#error-boundaries--onerror)
- [Plugin System](#plugin-system)
- [Building](#building)
- [Development](#development)
- [Known Limitations](#known-limitations)

---

## Installation

### From GitHub

```bash
pnpm add github:vanjexdev/courvux
# or
npm install github:vanjexdev/courvux
```

**Without a bundler** — use an import map:

```html
<script type="importmap">
{
  "imports": {
    "courvux": "./node_modules/courvux/dist/index.js"
  }
}
</script>
<script type="module" src="./main.js"></script>
```

**With Vite / a bundler** — import directly:

```ts
import { createApp } from 'courvux';
```

### Update

```bash
pnpm remove courvux && pnpm add github:vanjexdev/courvux
```

> `dist/` is committed to the repo. Courvux does not run a build step on install.

---

## Quick Start

```js
import { createApp } from 'courvux';

createApp({
    template: `
        <h1>Hello, {{ name }}!</h1>
        <button @click="greet">Click me</button>
    `,
    data: { name: 'World' },
    methods: {
        greet() { this.name = 'Courvux'; }
    }
}).mount('#app');
```

---

## createApp

```js
import { createApp } from 'courvux';

const app = createApp(config);
app.use(plugin).directive('name', def).mount('#app');
```

### AppConfig options

| Option | Type | Description |
|---|---|---|
| `template` | `string` | Inline HTML template |
| `templateUrl` | `string` | Path to an external `.html` file (fetched at mount time) |
| `data` | `object` | Reactive state — keys become `this.key` inside methods/hooks |
| `methods` | `object` | Functions bound to the component state via `this` |
| `computed` | `object` | Derived state — see [Computed Properties](#computed-properties) |
| `watch` | `object` | Change callbacks — see [Watchers](#watchers) |
| `components` | `object` | Globally registered child components |
| `directives` | `object` | Globally registered custom directives |
| `router` | `Router` | Router instance from `createRouter` |
| `store` | `object` | Global store from `createStore` |
| `provide` | `object \| () => object` | Values provided to all descendants via inject |
| `inject` | `string[] \| object` | Keys to receive from an ancestor's `provide` |
| `inheritAttrs` | `boolean` | Default `true`. Set `false` to suppress automatic attribute inheritance |
| `onBeforeMount` | `function` | Called before the DOM walk begins |
| `onMount` | `function` | Called after mounting is complete |
| `onBeforeUnmount` | `function` | Called before the component is destroyed |
| `onDestroy` | `function` | Called after the component is destroyed |
| `onError` | `(err: Error) => void` | Catches errors from descendant components |

> On the root `createApp` config, **`onMount` fires after the first route is fully rendered** — safe for third-party DOM libraries like Lucide Icons.

### CourvuxApp methods

| Method | Description |
|---|---|
| `.use(plugin)` | Install a plugin. Chainable. |
| `.directive(name, def)` | Register a global custom directive. Chainable. |
| `.mount(selector)` | Mount on a CSS selector. Returns `Promise<CourvuxApp>`. |
| `.router` | The router instance (useful inside plugins). |

---

## Template Syntax

### Interpolation

```html
<p>{{ count }}</p>
<p>{{ price * qty }}</p>
<p>{{ active ? 'On' : 'Off' }}</p>
<p>{{ $store.user }}</p>
```

Full JavaScript expressions are supported (requires no strict CSP — see [Known Limitations](#known-limitations)).

### Event binding — `@event`

```html
<button @click="increment">+1</button>
<input @input="handleInput" />
<form @submit="onSubmit"></form>
```

**Inline expressions** — no method needed:

```html
<button @click="count++">+</button>
<button @click="count = 0">Reset</button>
<button @click="items.push('new')">Add</button>
```

**Event modifiers** — chain with `.`:

```html
<form @submit.prevent="onSubmit">...</form>
<button @click.stop="doThing">...</button>
<button @click.once="runOnce">...</button>
<div @click.self="onSelf">...</div>
```

**Listener options** (passive / capture):

```html
<div @scroll.passive="onScroll">...</div>
<div @click.capture="onCapture">...</div>
```

**Key modifiers**:

```html
<input @keydown.enter="submit" />
<input @keydown.esc="cancel" />
<input @keydown.tab="nextField" />
```

Available key modifiers: `enter`, `esc` / `escape`, `space`, `tab`, `delete`, `backspace`, `up`, `down`, `left`, `right`.

**`$event`** — access the raw DOM event inside inline expressions:

```html
<input @input="search = $event.target.value" />
```

### Property binding — `:prop`

```html
<input :disabled="count > 10" />
<img :src="avatarUrl" :alt="user.name" />
<my-card :title="$store.user" :max="100"></my-card>
```

### Class binding — `:class`

Supports string, object, and array syntax. Merged with any static `class` attribute.

```html
<!-- Object — keys applied when value is truthy -->
<div :class="{ active: isActive, 'text-danger': hasError }"></div>

<!-- Array — each item can be a string, object, or nested array -->
<div :class="['base', isActive ? 'active' : 'inactive']"></div>

<!-- Combined with static class -->
<div class="card" :class="{ highlighted: isPinned }"></div>
```

### Style binding — `:style`

Supports object and string syntax. Merged with any static `style` attribute.

```html
<!-- Object — camelCase CSS properties -->
<span :style="{ color: textColor, fontSize: size + 'px' }"></span>

<!-- String — raw CSS (replaces inline style) -->
<span :style="'color: red; font-weight: bold'"></span>
```

### `cv-model` — two-way binding

```html
<!-- Text input -->
<input type="text" cv-model="name" />

<!-- Checkbox → boolean -->
<input type="checkbox" cv-model="active" />

<!-- Checkbox → array (multiple values) -->
<input type="checkbox" cv-model="skills" value="HTML" />
<input type="checkbox" cv-model="skills" value="CSS" />

<!-- Radio -->
<input type="radio" cv-model="color" value="red" />
<input type="radio" cv-model="color" value="blue" />

<!-- Select -->
<select cv-model="country">
    <option value="es">Spain</option>
    <option value="mx">Mexico</option>
</select>
```

**Modifiers**:

```html
<!-- .lazy — update on blur/change instead of every keystroke -->
<input cv-model.lazy="query" />

<!-- .trim — strip leading/trailing whitespace -->
<input cv-model.trim="username" />

<!-- .number — coerce to number -->
<input type="number" cv-model.number="price" />

<!-- .debounce — update 300ms after last keystroke (default 300ms) -->
<input cv-model.debounce="search" />

<!-- Custom delay in ms -->
<input cv-model.debounce.500="search" />

<!-- Combine modifiers -->
<input cv-model.debounce.trim="query" />
```

**Store binding** — `cv-model` works directly on `$store` keys:

```html
<input cv-model="$store.user" />
```

### `cv-for` — list rendering

```html
<!-- Array -->
<li cv-for="item in items">{{ item }}</li>
<li cv-for="(item, index) in items">{{ index }}: {{ item }}</li>

<!-- Object -->
<li cv-for="(value, key) in person">{{ key }}: {{ value }}</li>
```

Use `:key` for stable identity. Duplicate keys log a console warning.

```html
<li cv-for="user in users" :key="user.id">{{ user.name }}</li>
```

### `cv-if` / `cv-else-if` / `cv-else`

Elements are inserted/removed from the DOM.

```html
<p cv-if="count > 10">High</p>
<p cv-else-if="count > 0">Low</p>
<p cv-else>Zero</p>
```

### `cv-show`

Toggles `display: none` — element stays in the DOM.

```html
<div cv-show="isVisible">Panel</div>
```

### `cv-html`

Sets `innerHTML` reactively. Use only with trusted content.

```html
<div cv-html="richContent"></div>
```

### `cv-once`

Renders once with the initial value and never updates. Useful for static content that reads from state.

```html
<strong cv-once>{{ initialValue }}</strong>
```

### `cv-ref`

Stores a reference in `this.$refs`. On a native element, stores the `HTMLElement`. On a custom component, stores the child's reactive state (see [$refs on components](#refs-on-components)).

```html
<input cv-ref="myInput" placeholder="..." />
```

```js
methods: {
    focus() {
        this.$nextTick(() => this.$refs.myInput.focus());
    }
}
```

### `cv-teleport`

Moves the element to a different DOM node while keeping its reactivity.

```html
<div cv-show="showModal"
     cv-teleport="body"
     style="position:fixed;top:0;left:0;...">
    {{ modalMessage }}
</div>
```

The element is physically appended to `body` (or any CSS selector) but reacts to the local component state.

### `cv-cloak`

Hides content until mounting completes. Prevents a flash of un-rendered template text.

```css
[cv-cloak] { display: none !important; }
```

```html
<div id="app" cv-cloak></div>
<!-- or on individual components -->
<my-card cv-cloak></my-card>
```

---

## Components

### Defining components

Components are registered in `components` on either the root app config or any `ComponentConfig`. Child components are available within that component's template and all its descendants.

```js
createApp({
    components: {
        'user-card': {
            templateUrl: './user-card.html',
            data: { name: '', role: '' }
        },
        'alert-box': {
            template: `<div class="alert">{{ message }}</div>`,
            data: { message: '' }
        }
    },
    template: `<user-card :name="$store.user" :role="'admin'"></user-card>`
}).mount('#app');
```

Route-level components can also be registered inside a route's `component.components`:

```js
{
    path: '/dashboard',
    component: {
        templateUrl: './dashboard.html',
        components: {
            'stat-card': { template: `...`, data: { value: 0 } }
        }
    }
}
```

### Props

Pass reactive data from parent to child with `:propName`. The child declares them in `data` with initial/default values.

```html
<!-- parent template -->
<user-card :name="currentUser" :role="'editor'"></user-card>
```

```js
// user-card component
{
    data: { name: '', role: '' },
    template: `<h3>{{ name }}</h3><span>{{ role }}</span>`
}
```

Props are reactive — parent changes flow down automatically.

### Emitting events — `$emit`

Child notifies parent without tightly coupling them.

```js
// child component
methods: {
    close() { this.$emit('close'); },
    submit(data) { this.$emit('submit', data); }
}
```

```html
<!-- parent template -->
<modal-dialog @close="onClose" @submit="onSubmit"></modal-dialog>
```

### `cv-model` on components

`cv-model="x"` on a component is sugar for `:modelValue="x" @update:modelValue="x = $event"`. The child calls `this.$emit('update:modelValue', newValue)`.

```js
// child: mi-input
{
    data: { modelValue: '' },
    template: `<input :value="modelValue" @input="onInput" />`,
    methods: {
        onInput(e) { this.$emit('update:modelValue', e.target.value); }
    }
}
```

```html
<!-- parent -->
<mi-input cv-model="search"></mi-input>
```

### Multiple `cv-model` bindings

Use `cv-model:propName` to bind multiple props simultaneously. The child emits `update:propName`.

```html
<!-- parent -->
<dual-editor cv-model:title="docTitle" cv-model:body="docBody"></dual-editor>
<p>Title: {{ docTitle }} | Body: {{ docBody }}</p>
```

```js
// dual-editor component
{
    data: { title: '', body: '' },
    template: `
        <input :value="title" @input="$emit('update:title', $event.target.value)" />
        <textarea :value="body" @input="$emit('update:body', $event.target.value)"></textarea>
    `
}
```

### Slots

#### Default slot

```html
<!-- parent -->
<my-panel><p>Content from parent</p></my-panel>
```

```html
<!-- my-panel template -->
<div class="panel">
    <slot></slot>
</div>
```

#### Named slots

```html
<!-- parent -->
<my-card>
    <span slot="header">Title</span>
    <p>Body content</p>
    <em slot="footer">Footer note</em>
</my-card>
```

```html
<!-- my-card template -->
<div class="card">
    <header><slot name="header"><em>Default header</em></slot></header>
    <main><slot></slot></main>
    <footer><slot name="footer"></slot></footer>
</div>
```

#### `$slots` — conditional slot rendering

Use `$slots.slotName` to check whether the parent provided content for a slot.

```html
<!-- my-card template -->
<div class="card">
    <header cv-if="$slots.header">
        <slot name="header"></slot>
    </header>
    <slot></slot>
</div>
```

### Scoped slots

The component exposes data up to the parent via `:binding` on `<slot>`. The parent accesses it via `v-slot`.

```html
<!-- parent -->
<item-list :items="products" v-slot="{ item, index }">
    <strong>{{ index }}.</strong> {{ item.name }} — {{ item.price }}
</item-list>
```

```html
<!-- item-list template -->
<ul>
    <li cv-for="(item, i) in items">
        <slot :item="item" :index="i"></slot>
    </li>
</ul>
```

Named scoped slots:

```html
<my-table v-slot:row="{ row }">
    <td>{{ row.name }}</td>
    <td>{{ row.value }}</td>
</my-table>
```

### Dynamic component — `<component :is>`

Mounts the component whose name (or config object) matches the expression. Destroys the previous component and mounts the new one when the value changes.

```html
<component :is="activeView"></component>
```

```js
data: { activeView: 'tab-home' },
methods: {
    switchTab(name) { this.activeView = name; }
},
components: {
    'tab-home':     { template: `<p>Home tab content</p>` },
    'tab-settings': { template: `<p>Settings content</p>` }
}
```

### `$refs` on components

`cv-ref` on a custom component exposes the child's **reactive state** (not the DOM element) in the parent's `$refs`. This lets the parent call child methods directly.

```html
<!-- parent template -->
<counter-widget cv-ref="counter"></counter-widget>
<button @click="$refs.counter.reset()">Reset from parent</button>
<button @click="$refs.counter.add(5)">+5 from parent</button>
```

```js
// counter-widget component
{
    data: { value: 0 },
    template: `<p>Value: {{ value }}</p><button @click="value++">+1</button>`,
    methods: {
        add(n)  { this.value += n; },
        reset() { this.value = 0; }
    }
}
```

### `$attrs` and `inheritAttrs`

By default, non-framework attributes passed to a component (e.g. `id`, `data-*`, `class`) are applied to the component's root element. Set `inheritAttrs: false` to suppress this and access them via `$attrs` instead.

```html
<fancy-input id="email" data-required="true" label="Email"></fancy-input>
```

```js
// fancy-input component
{
    inheritAttrs: false,
    data: { label: '' },
    template: `
        <label>{{ label }}</label>
        <ul>
            <li cv-for="(val, key) in $attrs">{{ key }}: {{ val }}</li>
        </ul>
    `
}
```

`$attrs` contains all attributes that were not consumed as props (`:binding` attrs) or events.

### `$parent`

Every component receives a `$parent` reference injected automatically, pointing to the parent component's reactive state. Useful for tightly-coupled parent–child patterns.

```html
<!-- child template -->
<p>Parent says: {{ $parent.message }}</p>
```

> Prefer props + emit for general communication. `$parent` creates implicit coupling.

### `$slots`

`$slots` is a plain object where each key is `true` if the parent provided content for that slot name. Use it for conditional rendering inside a component.

```html
<div cv-if="$slots.header">
    <slot name="header"></slot>
</div>
```

---

## Computed Properties

Automatically recalculate when their dependencies change.

```js
{
    data: { price: 10, qty: 3 },
    computed: {
        total() { return this.price * this.qty; }
    }
}
```

```html
<p>Total: {{ total }}</p>
```

**Computed setter** — provide a `{ get, set }` object to handle writes:

```js
computed: {
    fullName: {
        get() { return `${this.first} ${this.last}`.trim(); },
        set(val) {
            const [f, ...rest] = val.split(' ');
            this.first = f ?? '';
            this.last  = rest.join(' ');
        }
    }
}
```

```html
<!-- Writing this input calls the setter, which splits into first + last -->
<input cv-model="fullName" />
```

Dependencies are detected by parsing `this.key` references in the getter's source. Computed values support `$store` and other reactive keys.

---

## Watchers

React to state changes. All watchers receive `(newVal, oldVal)` and have `this` bound to the component state.

**Simple watcher**:

```js
watch: {
    search(newVal, oldVal) {
        if (newVal) this.fetchResults(newVal);
    }
}
```

**Watcher with options**:

```js
watch: {
    // immediate — runs once on mount with the current value
    count: {
        immediate: true,
        handler(newVal, oldVal) {
            this.log.push(`${oldVal ?? 'init'} → ${newVal}`);
        }
    },
    // deep — detects nested mutations inside objects/arrays
    user: {
        deep: true,
        handler(newVal) {
            console.log('user changed:', newVal);
        }
    }
}
```

**Programmatic watcher — `$watch`**:

Create a watcher at runtime from `onMount` or anywhere in your code. Returns an unsubscribe function.

```js
onMount() {
    const stop = this.$watch('count', (newVal, oldVal) => {
        console.log(oldVal, '→', newVal);
    }, { immediate: true });

    // later, to stop watching:
    // stop();
}
```

---

## Lifecycle Hooks

All hooks have `this` bound to the reactive component state.

| Hook | When it fires |
|---|---|
| `onBeforeMount` | Before the DOM walk begins — DOM is not yet processed |
| `onMount` | After mounting is complete — DOM is ready, `$el` is set |
| `onBeforeUnmount` | Before the component is destroyed — cleanup here |
| `onDestroy` | After the component is destroyed |
| `onActivated` | When a `keepAlive` component is restored from cache |
| `onDeactivated` | When a `keepAlive` component is stored in cache |
| `onError` | When a descendant component throws — see [Error Boundaries](#error-boundaries--onerror) |

```js
{
    data: { ticks: 0 },
    onBeforeMount() {
        console.log('before DOM walk');
    },
    onMount() {
        this._timer = setInterval(() => this.ticks++, 1000);
        console.log('root element:', this.$el.tagName);
    },
    onBeforeUnmount() {
        clearInterval(this._timer);
    },
    onDestroy() {
        console.log('component destroyed');
    }
}
```

---

## Instance Properties

These are available as `this.x` inside any method, hook, computed getter/setter, or watcher, and as `{{ $x }}` in templates.

| Property | Description |
|---|---|
| `this.$el` | The root DOM element of the component |
| `this.$refs` | Object of refs collected via `cv-ref` |
| `this.$route` | Current route — `{ path, params, meta }` |
| `this.$router` | The router instance — call `this.$router.navigate('/path')` |
| `this.$store` | The global store |
| `this.$attrs` | Non-prop, non-event attributes passed to this component |
| `this.$slots` | `{ slotName: true }` for each slot provided by the parent |
| `this.$parent` | The parent component's reactive state |
| `this.$emit(event, ...args)` | Emit an event to the parent |
| `this.$watch(key, handler, opts?)` | Register a watcher programmatically |
| `this.$batch(fn)` | Group multiple state mutations into one DOM flush |
| `this.$nextTick(cb?)` | Run a callback after the next DOM update |

---

## Custom Directives

Register directives globally via `app.directive()` or per-component via `directives` in the config.

```js
// Full definition
app.directive('focus', {
    onMount(el, binding) { el.focus(); },
    onUpdate(el, binding) { /* reactive update */ },
    onDestroy(el, binding) { /* cleanup */ }
});

// Shorthand — called on mount only
app.directive('highlight', (el, binding) => {
    el.style.background = binding.value ?? 'yellow';
});
```

Use in templates:

```html
<!-- Plain directive -->
<input cv-focus />

<!-- With value (reactive) -->
<p cv-highlight="activeColor">Text</p>

<!-- With argument and modifiers -->
<div cv-pin:top.once="offset"></div>
```

**DirectiveBinding** object:

| Property | Description |
|---|---|
| `value` | Evaluated expression value (reactive in `onUpdate`) |
| `arg` | Argument after `:` — `cv-pin:top` → `arg = 'top'` |
| `modifiers` | Object of modifier flags — `cv-pin.once` → `modifiers.once = true` |

**Reactive directives** — provide both `onMount` and `onUpdate` to react to value changes:

```js
app.directive('color', {
    onMount(el, b)  { el.style.color = b.value; },
    onUpdate(el, b) { el.style.color = b.value; }
});
```

```html
<strong cv-color="selectedColor">Text</strong>
```

**Cleanup** — use `onDestroy` to remove event listeners or cancel timers:

```js
app.directive('tooltip', {
    onMount(el, b) {
        el._tip = createTooltip(el, b.value);
    },
    onDestroy(el) {
        el._tip?.destroy();
    }
});
```

---

## Transitions — `<cv-transition>`

Animate elements entering and leaving with CSS animations.

```html
<button @click="show = !show">Toggle</button>

<cv-transition name="fade" :show="show">
    <div class="panel">Animated content</div>
</cv-transition>
```

**Built-in transitions**: `fade`, `slide-down`, `slide-up`.

CSS classes injected:
- `{name}-enter` — applied during the enter phase, removed when done
- `{name}-leave` — applied during the leave phase, element hidden after

**Custom transition** — define your own CSS:

```css
.my-pop-enter {
    animation: pop-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.my-pop-leave {
    animation: pop-out 0.2s ease-in forwards;
}
@keyframes pop-in  { from { opacity: 0; transform: scale(0.85); } }
@keyframes pop-out { to   { opacity: 0; transform: scale(0.85); } }
```

```html
<cv-transition name="my-pop" :show="showModal">
    <div class="modal">...</div>
</cv-transition>
```

---

## Router

### `createRouter`

```js
import { createApp, createRouter } from 'courvux';

const router = createRouter(routes, options);

createApp({ router, template: `<router-view></router-view>` }).mount('#app');
```

Navigation links:

```html
<router-link to="/">Home</router-link>
<router-link to="/about" class="nav-link">About</router-link>
```

`router-link` renders an `<a>` tag. Attributes (including `class`) are forwarded to the anchor. The `active` CSS class and `aria-current="page"` are added automatically when the link matches the current route.

### Route options

| Option | Type | Description |
|---|---|---|
| `path` | `string` | URL pattern — supports `:param` segments and `*` (wildcard) |
| `component` | `ComponentConfig \| LazyComponent` | Component to render (single view) |
| `components` | `Record<string, ComponentConfig \| LazyComponent>` | Named views — see [Named router views](#named-router-views) |
| `redirect` | `string \| (route) => string` | Redirect to another path |
| `layout` | `string` | HTML wrapper template containing a `<router-view>` |
| `transition` | `string` | Per-route transition override |
| `keepAlive` | `boolean` | Cache DOM and state when navigating away |
| `meta` | `object` | Arbitrary data — accessible as `$route.meta` |
| `loadingTemplate` | `string` | HTML shown while a lazy component is loading |
| `beforeEnter` | `NavigationGuard` | Per-route navigation guard |
| `children` | `RouteConfig[]` | Nested child routes |

### Router options

| Option | Type | Description |
|---|---|---|
| `mode` | `'hash' \| 'history'` | Routing mode — default `'hash'` |
| `transition` | `string` | Global transition applied to all routes |
| `beforeEach` | `NavigationGuard` | Global guard — runs before every navigation |
| `afterEach` | `(to, from) => void` | Runs after every navigation |
| `scrollBehavior` | `ScrollBehavior` | Controls scroll position |

### Dynamic params

```js
{ path: '/user/:id', component: { template: `<p>ID: {{ $route.params.id }}</p>` } }
```

`$route.params`, `$route.path`, and `$route.meta` are available in any component rendered by the router.

### Redirects

```js
// Static redirect
{ path: '/home', redirect: '/' },

// Dynamic redirect — receives the current RouteMatch
{ path: '/old/:id', redirect: (route) => `/new/${route.params.id}` }
```

### Lazy loading

```js
{ path: '/dashboard', component: () => import('./dashboard.js') }
```

```js
// dashboard.js
export default {
    template: `<h1>Dashboard</h1>`,
    data: { /* ... */ },
    methods: { /* ... */ }
};
```

With Vite and `.html` templates:

```ts
// dashboard.ts
import template from './dashboard.html?raw';
export default { template, data: {}, methods: {} };
```

### Loading state

Show a placeholder while a lazy component resolves (first load only):

```js
{
    path: '/heavy',
    loadingTemplate: `<p>Loading...</p>`,
    component: () => import('./heavy.js')
}
```

### Layouts

A layout is an HTML string containing a `<router-view>` where the route component is injected. The layout template has access to `$store`.

```js
const sidebarLayout = `
    <aside>{{ $store.user }}</aside>
    <main><router-view></router-view></main>
`;

{ path: '/dashboard', layout: sidebarLayout, component: DashboardComp }
```

### Nested routes

The parent component must contain a `<router-view>`. Child paths are relative to the parent.

```js
{
    path: '/panel',
    component: {
        template: `
            <nav>
                <router-link to="/panel/summary">Summary</router-link>
                <router-link to="/panel/config">Config</router-link>
            </nav>
            <router-view></router-view>
        `
    },
    children: [
        { path: '/summary', component: SummaryComp },
        { path: '/config',  component: ConfigComp }
    ]
}
```

The parent stays mounted while navigating between children.

### Named router views

Render multiple components for a single route using named `<router-view>` elements.

```html
<!-- app template -->
<router-view></router-view>
<aside><router-view name="panel"></router-view></aside>
```

```js
{
    path: '/extras',
    components: {
        default: MainComponent,
        panel:   SidebarComponent
    }
}
```

Routes that don't define a `panel` component leave that view empty.

### Route transitions

Built-in: `'fade'`, `'slide-up'`.

```js
// Global — applies to all routes
createRouter(routes, { transition: 'fade' });

// Per-route override
{ path: '/modal', transition: 'slide-up', component: ModalComp }
```

### `keepAlive`

Caches the DOM and state of a route. When navigating back, the component is restored without re-mounting.

```js
{ path: '/form', keepAlive: true, component: FormComp }
```

`onActivated` / `onDeactivated` hooks fire when the component enters/exits the cache.

### Navigation guards

```js
// Global guard
createRouter(routes, {
    beforeEach(to, next) {
        if (!isLoggedIn() && to.path !== '/login') {
            next('/login');
        } else {
            next(); // or next('/other') to redirect
        }
    }
});

// Per-route guard
{
    path: '/admin',
    beforeEnter(to, next) {
        if (!isAdmin()) next('/');
        else next();
    },
    component: AdminComp
}
```

`next()` — continue. `next('/path')` — redirect. Omitting the call blocks navigation.

### Scroll behavior

```js
createRouter(routes, {
    scrollBehavior(to, from) {
        return { x: 0, y: 0 }; // scroll to top on every navigation
    }
});
```

### Programmatic navigation — `$router`

```js
methods: {
    goHome()      { this.$router.navigate('/'); },
    goToUser(id)  { this.$router.navigate(`/user/${id}`); }
}
```

---

## Store

### `createStore`

A global reactive state container. Access via `$store` in any template or component.

```js
import { createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest', count: 0 },
    actions: {
        setUser(name) { this.user = name; },
        increment()   { this.count++; }
    }
});

createApp({ store, template: `...` }).mount('#app');
```

```html
<!-- any template -->
<p>{{ $store.user }}</p>
<input cv-model="$store.user" />
<button @click="$store.increment()">+</button>
```

State keys and action names must be distinct — a warning is logged if they collide.

### Store modules

Organize the store into namespaced sub-stores. Each module is a full standalone store.

```js
const store = createStore({
    state: { theme: 'light' },
    actions: {
        toggleTheme() { this.theme = this.theme === 'light' ? 'dark' : 'light'; }
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
});
```

```html
<!-- access module state -->
<p>Count: {{ $store.counter.n }}</p>
<p>Role: {{ $store.user.role }}</p>

<!-- call module actions -->
<button @click="$store.counter.inc()">+</button>
<button @click="$store.user.login('Alice', 'admin')">Login</button>
```

Module state and actions are fully reactive.

---

## Provide / Inject

Pass data deep into the component tree without threading props through every level.

**Provide** — on any ancestor component (including the root app):

```js
createApp({
    provide: {
        theme: 'dark',
        apiUrl: 'https://api.example.com'
    },
    // ...
})

// Or as a function for reactive values
{
    provide() {
        return { currentUser: this.user };
    }
}
```

**Inject** — in any descendant component:

```js
// Array shorthand — key names match provide
{ inject: ['theme', 'apiUrl'] }

// Object form — rename on injection
{ inject: { localTheme: 'theme', endpoint: 'apiUrl' } }
```

Injected keys are available as `this.theme`, `{{ theme }}`, etc. — just like data.

---

## Batch Updates — `$batch`

Group multiple state mutations so they trigger only one DOM update cycle instead of one per change.

```js
methods: {
    updateAll() {
        this.$batch(() => {
            this.a++;
            this.b++;
            this.c = 'new';
            // DOM is updated once after this block
        });
    }
}
```

Also available as a named export:

```js
import { batchUpdate } from 'courvux';

batchUpdate(() => {
    store.counter.n = 10;
    store.user.role = 'admin';
});
```

---

## Error Boundaries — `onError`

An `onError` hook catches errors thrown by any descendant component's `onMount`. The error does not propagate further — the component with `onError` handles it.

```js
{
    data: { hasError: false, errorMsg: '' },
    onError(err) {
        this.hasError = true;
        this.errorMsg = err.message;
    },
    template: `
        <p cv-if="hasError" class="error">Error: {{ errorMsg }}</p>
        <div cv-if="!hasError">
            <risky-widget></risky-widget>
        </div>
    `
}
```

---

## Plugin System

A plugin is an object with an `install(app)` method. Install before mounting.

```js
const myPlugin = {
    install(app) {
        // Hook into the router
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
    .use(myPlugin)
    .mount('#app');
```

Plugins are installed in order. Duplicate installs are silently ignored.

### Example: Lucide Icons

```bash
pnpm add lucide
```

Import map (no bundler):

```html
<script type="importmap">
{
    "imports": {
        "courvux": "./node_modules/courvux/dist/index.js",
        "lucide":  "./node_modules/lucide/dist/esm/lucide.mjs"
    }
}
</script>
```

```js
import { createApp } from 'courvux';
import { createIcons, Home, Star, User } from 'lucide';

const ICONS = { Home, Star, User };

const lucidePlugin = {
    install(app) {
        if (app.router) {
            const prev = app.router.afterEach;
            app.router.afterEach = (to, from) => {
                prev?.(to, from);
                createIcons({ icons: ICONS });
            };
        }
    }
};

createApp({
    onMount() { createIcons({ icons: ICONS }); },
    // ...
})
.use(lucidePlugin)
.mount('#app');
```

```html
<i data-lucide="home"></i>
<i data-lucide="star"></i>
```

---

## Building

```bash
pnpm build
```

Produces:

| File | Description |
|---|---|
| `dist/index.js` | Minified ES module (~10 kB gzip) |
| `dist/index.d.ts` | TypeScript declarations |
| `dist/types.d.ts` | Exported type definitions |
| `dist/dom.d.ts` | DOM walk context types |
| `dist/reactivity.d.ts` | Reactivity primitives |
| `dist/router.d.ts` | Router types |

---

## Development

```bash
pnpm dev   # TypeScript watch + dev server at http://localhost:3000
```

The dev server (`devserver.js`) serves:
- `/dist/` — built framework files
- `/node_modules/` — npm packages (for import maps)
- `app/` — demo application (SPA fallback for history mode)

---

## Known Limitations

| Item | Description |
|---|---|
| CSP / `new Function` | Expression evaluation and inline event handlers use `new Function`. Falls back to a safe evaluator (property access + literals only) under strict CSP — complex JS expressions in templates won't work. |
| `cv-for` re-render cost | Any change to a tracked array/object triggers a full cv-for re-render (no key-based diffing). Nested property mutations (`items[0].name = 'x'`) do trigger correctly via deep proxy — but the whole list re-renders. |
| SSR | Not supported. Courvux is browser-only. |
