<p align="center">
  <strong>Courvux</strong>
  <br>
  <em>Lightweight reactive UI framework for the browser.</em>
  <br>
  No virtual DOM. ~20 KB gzip with router, store, devtools, composables, useHead, and SSR primitives. Vue/Alpine ergonomics.
</p>

<p align="center">
  <img alt="version"  src="https://img.shields.io/badge/version-0.4.6-blue">
  <img alt="size"     src="https://img.shields.io/badge/gzip-~20kB-brightgreen">
  <img alt="license"  src="https://img.shields.io/badge/license-MIT-lightgrey">
  <img alt="ts"       src="https://img.shields.io/badge/TypeScript-strict-3178c6">
</p>

**Author:** Vanjex — **Version:** 0.4.6

---

## Comparison

| | Courvux | Alpine | Petite-Vue | Preact |
|---|---|---|---|---|
| Size (gzip) | ~20 KB (full) | ~15 KB | ~6 KB | ~5 KB (core only) |
| Reactivity | Proxy | Proxy | Proxy | Signals |
| Virtual DOM | ❌ | ❌ | ❌ | ✅ |
| Components | ✅ | Limited | ✅ | ✅ |
| Router | Built-in | ❌ | ❌ | External |
| Store | Built-in | ❌ | ❌ | External |
| DevTools | Built-in overlay | ❌ | ❌ | External |
| SSR | ✅ (basic) | ❌ | ❌ | ✅ |
| Composables | Built-in | External | External | External |
| Vite plugin | ✅ | — | — | ✅ |

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [createApp](#createapp)
- [Template Syntax](#template-syntax)
  - [Interpolation](#interpolation)
  - [Event binding — cv:on:event](#event-binding--cvonevent)
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
  - [cv-data — Inline reactive scope](#cv-data--inline-reactive-scope)
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
- [autoInit()](#autoinit)
- [Computed Properties](#computed-properties)
- [Watchers](#watchers)
- [Lifecycle Hooks](#lifecycle-hooks)
- [Instance Properties](#instance-properties)
- [Custom Directives](#custom-directives)
- [Transitions — cv-transition](#transitions--cv-transition)
  - [Inline / bare cv-transition](#inline--bare-cv-transition-built-in)
  - [Class-based cv-transition (Alpine-compatible)](#class-based-cv-transition-alpine-compatible)
  - [\<cv-transition\> component](#cv-transition-component)
- [cv-intersect — Intersection Observer](#cv-intersect--intersection-observer)
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
  - [Defining plugins with `createPlugin`](#defining-plugins-with-createplugin)
- [Composables](#composables)
- [SEO and `useHead`](#seo-and-usehead)
- [Static Site Generation (SSG)](#static-site-generation-ssg)
- [Event Bus](#event-bus)
- [Reactivity escape hatches](#reactivity-escape-hatches)
- [DevTools](#devtools)
- [Server-Side Rendering (SSR)](#server-side-rendering-ssr)
- [Testing](#testing)
- [Progressive Web App (PWA)](#progressive-web-app-pwa)
  - [Web App Manifest](#web-app-manifest)
  - [Service Worker with Workbox](#service-worker-with-workbox)
  - [PWA install prompt utility](#pwa-install-prompt-utility)
- [Building](#building)
- [Development](#development)
- [Known Limitations](#known-limitations)
- [Top-level exports](#top-level-exports)

---

## Installation

### From GitHub

```bash
pnpm add github:vanjexdev/courvux
# or
npm install github:vanjexdev/courvux
```

Pin a tag for stable installs:

```bash
pnpm add github:vanjexdev/courvux#v0.4.6
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

### Vite plugin (recommended for any Vite-based project)

The repo ships a Vite plugin that inlines `templateUrl` references at build time, eliminating runtime `fetch` calls for templates and enabling HMR on `.html` files in dev.

```js
// vite.config.js
import { defineConfig } from 'vite';
import courvux from 'courvux/plugin';

export default defineConfig({
    plugins: [courvux()]
});
```

This makes the `templateUrl` pattern viable for production, eliminating the relative-path resolution issue noted in [Known Limitations](#known-limitations).

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
| `.component(name, config)` | Register a global component. Chainable. |
| `.provide(key, value)` | Provide a value to all descendants via `inject`. Chainable. Also accepts an object: `.provide({ key: val })`. |
| `.magic(name, fn)` | Register a global `$name` property. `fn` receives the component instance and its return value is assigned as `this.$name` in every component. Chainable. |
| `.mount(selector)` | Mount on a CSS selector. Returns `Promise<CourvuxApp>`. |
| `.mountAll(selector?)` | Mount on all matching elements (default `[data-courvux]`). Returns `Promise<CourvuxApp>`. |
| `.mountEl(el)` | Mount on a specific `HTMLElement`. Returns `Promise<state>`. |
| `.unmount(selector?)` | Destroy the mounted instance at `selector`, or all instances if omitted. |
| `.destroy()` | Destroy all instances created by this app. |
| `.router` | The router instance (useful inside plugins). |

**`app.magic()` example:**

```js
createApp(config)
    .magic('fmt', () => ({
        currency: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
        date:     (val) => new Date(val).toLocaleDateString(),
        upper:    (str) => String(str).toUpperCase(),
    }))
    .magic('http', () => axios)
    .mount('#app');
```

```html
<!-- available in every component template -->
<p>{{ $fmt.currency(price) }}</p>
<p>{{ $fmt.date(createdAt) }}</p>
<button @click="$http.post('/api/save', data)">Save</button>
```

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

### `html` tagged template helper

When you write a component template inside a JS template literal, the `$` character is consumed by JS before Courvux ever sees it:

```js
// ❌ JS parses ${{ as a template expression — ReferenceError at runtime
template: `<button>Price: ${{ price }}</button>`

// ✅ Option 1 — use a regular string (no JS interpolation)
template: '<button>Price: ${{ price }}</button>'

// ✅ Option 2 — use the html tagged template helper
import { html } from 'courvux';
template: html`<button>Price: \${{ price }}</button>`
//                              ^ backslash escapes $ from JS, html tag restores it
```

The `html` tag reads the raw string (before JS escape processing), replaces `\$` with `$`, and returns the final string. It does **not** do any HTML escaping.

### Event binding — `cv:on:event`

```html
<button cv:on:click="increment">+1</button>
<input cv:on:input="handleInput" />
<form cv:on:submit="onSubmit"></form>
```

The `cv:on:` prefix is the native Courvux syntax. The shorthand `@event` is also accepted and behaves identically — both can be used interchangeably.

**Inline expressions** — no method needed:

```html
<button cv:on:click="count++">+</button>
<button cv:on:click="count = 0">Reset</button>
<button cv:on:click="items.push('new')">Add</button>
```

**`$event`** — access the raw DOM event:

```html
<input cv:on:input="search = $event.target.value" />
<button cv:on:click="doThing($event)">Click</button>
```

**Custom parameters**:

```html
<button cv:on:click="deleteItem(item.id)">Delete</button>
<button cv:on:click="doThing(item, $event)">Action</button>
```

**Event modifiers** — chain with `.`:

```html
<form cv:on:submit.prevent="onSubmit">...</form>
<button cv:on:click.stop="doThing">...</button>
<button cv:on:click.once="runOnce">...</button>
<div cv:on:click.self="onSelf">...</div>
```

**Listener options** (passive / capture):

```html
<div cv:on:scroll.passive="onScroll">...</div>
<div cv:on:click.capture="onCapture">...</div>
```

**Key modifiers**:

```html
<input cv:on:keydown.enter="submit" />
<input cv:on:keydown.esc="cancel" />
<input cv:on:keydown.tab="nextField" />
```

Available key modifiers: `enter`, `esc` / `escape`, `space`, `tab`, `delete`, `backspace`, `up`, `down`, `left`, `right`.

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

**Keyed reconciliation** — add `:key` for stable identity. When the list changes, Courvux reuses existing DOM nodes for matching keys, only creating/destroying nodes for new/removed keys, and moving nodes for reorders.

```html
<li cv-for="user in users" :key="user.id">{{ user.name }}</li>
```

Without `:key`, all nodes are destroyed and recreated on every change. With `:key`, only the diff is applied. Duplicate keys log a console warning.

**List transitions with `:key`** — combine with `cv-transition` on the `cv-for` element:

```html
<ul>
    <li cv-for="item in items" :key="item.id" cv-transition="fade">
        {{ item.name }}
    </li>
</ul>
```

Entering nodes get `{name}-enter`, leaving nodes get `{name}-leave`.

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

Sets `innerHTML` reactively.

```html
<!-- Raw — use only with trusted content -->
<div cv-html="richContent"></div>

<!-- Sanitized — strips scripts, event handlers, and dangerous elements -->
<div cv-html.sanitize="userContent"></div>
```

`.sanitize` uses the native [Sanitizer API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API) when available, and falls back to a DOMParser-based approach that removes `<script>`, `<iframe>`, `onerror`/`onclick` inline handlers, and `javascript:` URLs.

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

**Dynamic refs in lists** — prefix with `:` to compute the ref name from an expression:

```html
<input cv-for="todo in todos" :key="todo.id"
       :cv-ref="'edit_' + todo.id" />
```

Access with bracket notation:

```js
this.$refs['edit_' + someId]?.focus();
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

`createApp()` automatically injects `[cv-cloak]{display:none!important}` — no manual CSS needed.

```html
<div id="app" cv-cloak></div>
<!-- or on individual components -->
<my-card cv-cloak></my-card>
```

The attribute is removed from each element as the framework processes it during the DOM walk.

### `cv-data` — Inline reactive scope

Create a self-contained reactive scope directly on any element — no component registration needed.

```html
<!-- Inline data object -->
<div cv-data="{ count: 0, step: 1 }">
    <button @click="count -= step">−</button>
    <span>{{ count }}</span>
    <button @click="count += step">+</button>
</div>
```

**Methods** can be included in the same object using shorthand syntax:

```html
<div cv-data="{ open: false, toggle() { this.open = !this.open } }">
    <button @click="toggle()">{{ open ? 'Close' : 'Open' }}</button>
    <div cv-show="open">Panel content</div>
</div>
```

**Nested scopes** — a child `cv-data` inherits all keys from the parent scope. Child keys shadow parent keys of the same name, but do not mutate the parent.

```html
<div cv-data="{ user: 'Alice', tags: ['admin', 'dev'] }">
    <p>Outer: {{ user }}</p>
    <div cv-data="{ role: 'Editor', idx: 0 }">
        <!-- reads parent's user + tags -->
        <p>Inner: {{ role }} — user from parent: {{ user }}</p>
        <p>Tag: {{ tags[idx] }}</p>
        <button @click="idx = (idx + 1) % tags.length">Next</button>
    </div>
</div>
```

**Named component reference** — use a registered component name as the value to reuse a component's `data` and `methods` without mounting a full component:

```html
<div cv-data="my-counter">
    <button @click="dec()">−</button>
    <span>{{ n }}</span>
    <button @click="inc()">+</button>
</div>
```

```js
// Registered globally
app.component('my-counter', {
    data: { n: 0 },
    methods: {
        inc() { this.n++; },
        dec() { this.n--; }
    }
});
```

> `cv-data` scopes are lighter than components — no lifecycle hooks, no slots, no emits. Use components when you need those features.

---

## Components

### `defineComponent` (TypeScript)

For TypeScript projects, `defineComponent` provides type inference for component config without runtime overhead — it's an identity function that helps the type checker understand the `this` binding inside methods/hooks.

```ts
import { defineComponent } from 'courvux';

export const UserCard = defineComponent({
    data: { name: '', age: 0 },
    computed: {
        label() { return `${this.name} (${this.age})`; }
    },
    template: `<p>{{ label }}</p>`
});
```

### `defineAsyncComponent` for lazy loading

```ts
import { defineAsyncComponent } from 'courvux';

const HeavyChart = defineAsyncComponent({
    loader: () => import('./HeavyChart.js'),
    loadingTemplate: '<div class="skeleton">Loading chart...</div>',
    errorTemplate:   '<p class="error">Failed to load chart</p>',
    delay: 200,
    timeout: 5000,
});
```

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

## `autoInit()`

Initialize `cv-data` elements automatically on page load — no `createApp()` call required. Ideal for adding interactivity to server-rendered HTML.

```js
import { autoInit } from 'courvux';

autoInit(); // scans [cv-data] on DOMContentLoaded
```

```html
<!-- No JavaScript setup beyond the import -->
<div cv-data="{ count: 0, inc() { this.count++ } }">
    <button @click="inc()">Clicks: {{ count }}</button>
</div>

<div cv-data="{ open: false }">
    <button @click="open = !open">Toggle</button>
    <p cv-show="open">Visible!</p>
</div>
```

**Options:**

```js
autoInit({
    components: {
        'my-card': MyCardComponent,
    },
    directives: {
        tooltip: myTooltipDirective,
    },
    globalProperties: {
        appName: 'My Site',
    },
});
```

**Named component shorthand:**

```js
autoInit({ components: { dropdown: DropdownDef } });
```

```html
<div cv-data="dropdown">
    <!-- uses DropdownDef data + methods -->
</div>
```

`autoInit` finds all top-level `[cv-data]` elements — elements nested inside another `[cv-data]` are handled by their outer scope's walk, not re-mounted by `autoInit`.

---

## Instance Properties

These are available as `this.x` inside any method, hook, computed getter/setter, or watcher, and as `{{ $x }}` in templates.

| Property | Description |
|---|---|
| `this.$el` | The root DOM element of the component |
| `this.$refs` | Object of refs collected via `cv-ref` |
| `this.$route` | Current route — `{ path, params, query, meta }` |
| `this.$router` | The router instance — call `this.$router.navigate('/path')` |
| `this.$store` | The global store |
| `this.$attrs` | Non-prop, non-event attributes passed to this component |
| `this.$slots` | `{ slotName: true }` for each slot provided by the parent |
| `this.$parent` | The parent component's reactive state |
| `this.$emit(event, ...args)` | Emit an event to the parent component |
| `this.$dispatch(event, detail?, opts?)` | Fire a bubbling `CustomEvent` from `$el` — any DOM ancestor can listen with `@event` |
| `this.$watch(key, handler, opts?)` | Register a watcher programmatically |
| `this.$watchEffect(fn)` | Auto-tracked side effect, stopped on destroy |
| `this.$forceUpdate()` | Re-notify all reactive keys — force full DOM refresh |
| `this.$addCleanup(fn)` | Register a teardown function run on component destroy |
| `this.$batch(fn)` | Group multiple state mutations into one DOM flush |
| `this.$nextTick(cb?)` | Run a callback after the next DOM update |

**`$nextTick` example:**

```js
methods: {
    addItem() {
        this.items.push({ id: Date.now(), name: 'New' });
        // DOM is not yet updated here — wait for the next flush
        this.$nextTick(() => {
            this.$refs.list.lastElementChild?.scrollIntoView();
        });
    }
}
```

`$nextTick` returns a `Promise` if no callback is given:

```js
async save() {
    this.saved = true;
    await this.$nextTick();
    console.log('DOM updated, saved badge is visible');
}
```

> **Standalone import:** `nextTick` is also exported as a top-level function for use outside component context (stores, plugins, test setup):
>
> ```js
> import { nextTick } from 'courvux';
> await nextTick();  // resolves after the next DOM flush
> ```

---

### `$dispatch` vs `$emit`

| | Direction | Reach |
|---|---|---|
| `$emit(event, ...args)` | Parent only | One level |
| `$dispatch(event, detail?, opts?)` | DOM bubble | Any DOM ancestor |

Use `$emit` for normal parent-child communication. Use `$dispatch` when the event should travel multiple component levels without each parent re-emitting it manually.

**`$dispatch` example:**

```js
// child component
methods: {
    select(item) {
        this.$dispatch('item-selected', { id: item.id, name: item.name });
    }
}
```

```html
<!-- parent template — catches the bubbling event -->
<div @item-selected="onSelected">
    <product-list></product-list>
</div>
```

The event bubbles from the child component's `$el` up through the DOM tree. Any ancestor element with an `@event` listener will receive it.

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

## Transitions — `cv-transition`

Courvux supports two styles of enter/leave transitions, both tied to `cv-show`.

---

### Inline / bare `cv-transition` (built-in)

Add `cv-transition` directly on any `cv-show` element for instant fade/scale animations — no CSS needed.

```html
<!-- Fade only (default) -->
<div cv-show="open" cv-transition>Panel</div>

<!-- Fade + scale -->
<div cv-show="open" cv-transition.scale>Panel</div>

<!-- Custom scale origin (0–100) and duration (ms) -->
<div cv-show="open" cv-transition.scale.90.duration.300>Panel</div>

<!-- Scale without fade -->
<div cv-show="open" cv-transition.scale.opacity>Panel</div>
```

Modifiers:

| Modifier | Effect |
|---|---|
| _(none)_ | Fade in/out |
| `.scale` | Fade + scale (default origin 0.9) |
| `.scale.N` | Custom scale origin — e.g. `.scale.85` = `scale(0.85)` |
| `.duration.N` | Animation duration in ms — e.g. `.duration.300` |

---

### Class-based `cv-transition` (Alpine-compatible)

Attach fine-grained CSS class sets to control every phase of the transition.

```html
<div
    cv-show="open"
    cv-transition:enter="transition ease-out duration-300"
    cv-transition:enter-start="opacity-0 scale-95"
    cv-transition:enter-end="opacity-100 scale-100"
    cv-transition:leave="transition ease-in duration-200"
    cv-transition:leave-start="opacity-100 scale-100"
    cv-transition:leave-end="opacity-0 scale-95"
>
    Panel
</div>
```

Class timeline per phase:

| Phase | Classes applied | Then removed |
|---|---|---|
| Enter | `:enter` + `:enter-start` | `:enter-start` → `:enter-end` → wait → remove all |
| Leave | `:leave` + `:leave-start` | `:leave-start` → `:leave-end` → wait → hide + remove all |

Each step is separated by a double `requestAnimationFrame` to guarantee the browser paints the start state before the transition begins.

Works with any CSS utility framework (Tailwind, UnoCSS, etc.).

---

### `<cv-transition>` component

Wraps an element and controls visibility via a `:show` prop. Uses the built-in named transitions.

```html
<button @click="show = !show">Toggle</button>

<cv-transition name="fade" :show="show">
    <div class="panel">Animated content</div>
</cv-transition>
```

**Built-in names**: `fade`, `slide-down`, `slide-up`.

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

## `cv-intersect` — Intersection Observer

Runs an expression when an element enters or leaves the viewport. Backed by the native `IntersectionObserver` API — no-op if unsupported.

```html
<!-- Fire when element scrolls into view -->
<div cv-intersect="loadMore()">...</div>

<!-- Separate enter / leave handlers -->
<div
    cv-intersect:enter="onEnter()"
    cv-intersect:leave="onLeave()"
>...</div>

<!-- Only fire once, then stop observing -->
<div cv-intersect.once="trackImpression()">...</div>
```

**Threshold modifiers** — how much of the element must be visible:

```html
<!-- 50% visible -->
<div cv-intersect.half="handler()">...</div>

<!-- 100% visible -->
<div cv-intersect.full="handler()">...</div>

<!-- Arbitrary % (0–100) -->
<div cv-intersect.threshold-75="handler()">...</div>
```

**Margin modifier** — expand or shrink the detection zone:

```html
<!-- Trigger 200px before the element reaches the viewport -->
<div cv-intersect.margin-200="prefetch()">...</div>
```

**Combining modifiers**:

```html
<div cv-intersect.once.half.margin-100="animate()">...</div>
```

**Modifier reference**:

| Modifier | Description |
|---|---|
| `.once` | Disconnect observer after first intersection |
| `.half` | threshold = 0.5 (50% visible) |
| `.full` | threshold = 1.0 (100% visible) |
| `.threshold-N` | threshold = N / 100 |
| `.margin-N` | `rootMargin` = `Npx` (positive = expand zone) |

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

`$route` is available in any component rendered by the router:

| Property | Description |
|---|---|
| `$route.path` | Current pathname, e.g. `/user/42` |
| `$route.params` | Path params — `{ id: '42' }` |
| `$route.query` | Query string as a plain object — `{ page: '2', filter: 'active' }` |
| `$route.meta` | Route-level metadata object |

```html
<!-- template -->
<p>Page: {{ $route.query.page ?? '1' }}</p>
<p>Filter: {{ $route.query.filter ?? 'all' }}</p>
```

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
    goHome()         { this.$router.navigate('/'); },
    goToUser(id)     { this.$router.navigate(`/user/${id}`); },
    goBack()         { this.$router.back(); },

    // Navigate with query string
    search(term)     {
        this.$router.navigate('/results', { query: { q: term, page: '1' } });
    },
    // → /results?q=term&page=1

    // Replace (no history entry)
    redirect(path)   {
        this.$router.replace(path, { query: { from: 'redirect' } });
    },
}
```

| Method | Description |
|---|---|
| `navigate(path, opts?)` | Push a new history entry. `opts.query` is serialized as `?key=value`. |
| `replace(path, opts?)` | Replace current history entry (no back-button entry). |
| `back()` | Go to previous history entry. |
| `forward()` | Go to next history entry. |

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

### Defining plugins with `createPlugin`

The recommended API. `createPlugin` provides dedupe by `name` — installing the same plugin twice is a no-op.

```ts
import { createPlugin } from 'courvux';

export const lucidePlugin = createPlugin({
    name: 'lucide',
    install(app) {
        app.router?.afterEach(() => createIcons());
    }
});

createApp(config).use(lucidePlugin).mount('#app');
```

### Raw plugin object (alternative)

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

## Composables

Courvux ships a small set of composables covering common app needs without third-party dependencies. All preserve `this` binding, are SSR-safe, and integrate with `$addCleanup` for automatic teardown.

| Composable | Purpose |
|---|---|
| `cvStorage(key, defaults)` | Reactive object backed by `localStorage`, auto-persists |
| `cvFetch(url, callback, options)` | Reactive HTTP fetch with `{ data, loading, error }` callback |
| `cvDebounce(fn, ms)` | Debounced function preserving `this` |
| `cvThrottle(fn, ms)` | Throttled function preserving `this` |
| `cvMediaQuery(query, callback)` | matchMedia with reactive callback |
| `cvListener(target, event, handler, opts?)` | addEventListener with cleanup return |

### Examples

`cvStorage` for app settings:

```js
import { cvStorage } from 'courvux';

const settings = cvStorage('app-settings', { theme: 'light', sidebar: true });
settings.theme = 'dark';   // automatically persisted to localStorage
settings.$clear();          // reset to defaults + remove from localStorage
```

`cvFetch` for reactive data:

```js
onMount() {
    const { execute, abort } = cvFetch('/api/users', ({ data, loading, error }) => {
        this.users = data ?? [];
        this.loading = loading;
        this.error = error;
    });
    this.$addCleanup(abort);
}
```

`cvDebounce` inside a method:

```js
methods: {
    search: cvDebounce(function(q) {
        return fetch(`/search?q=${q}`)
            .then(r => r.json())
            .then(r => this.results = r);
    }, 300)
}
```

`cvMediaQuery` for responsive logic:

```js
onMount() {
    cvMediaQuery('(max-width: 768px)', (matches) => {
        this.isMobile = matches;
    });
}
```

`cvListener` with auto-cleanup:

```js
onMount() {
    const off = cvListener(window, 'keydown', (e) => {
        if (e.key === 'Escape') this.close();
    });
    this.$addCleanup(off);
}
```

---

## SEO and `useHead`

`useHead` is the per-component head management composable. It updates `document.title`, inserts/upserts `<meta>` and `<link>` tags, and lets each route declare its own metadata. Tags are reverted on cleanup so navigating away from a route restores the previous head exactly.

```js
import { useHead } from 'courvux';

export default {
    onMount() {
        const cleanup = useHead({
            title: 'Installation',
            titleTemplate: '%s — Courvux',
            meta: [
                { name: 'description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:title',       content: 'Installation — Courvux' },
                { property: 'og:description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:image',       content: '/og/installation.png' },
                { name: 'twitter:card',       content: 'summary_large_image' },
            ],
            link: [
                { rel: 'canonical', href: 'https://courvux.dev/installation' },
            ],
        });
        this.$addCleanup(cleanup);
    }
};
```

### Config shape

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Replaces `document.title`. Restored on cleanup. |
| `titleTemplate` | `string \| (t) => string` | String form: `%s` is replaced. Function form: receives the title and returns the final string. |
| `meta` | `HeadMeta[]` | Each entry becomes a `<meta>` tag. Dedupe by `name`, then `property`, then `http-equiv`. |
| `link` | `HeadLink[]` | Each entry becomes a `<link>` tag. `rel="canonical"` is unique. Other links dedupe by `rel + href`. |
| `script` | `HeadScript[]` | Each entry becomes a `<script>` tag. Use `innerHTML` for inline content. Always inserted fresh — use sparingly. |
| `htmlAttrs` | `Record<string,string>` | Sets attributes on `<html>` (e.g. `lang`, `class`). Restored on cleanup. |
| `bodyAttrs` | `Record<string,string>` | Sets attributes on `<body>`. Restored on cleanup. |

### JSON-LD structured data

Inject Schema.org structured data via the `script` field:

```js
useHead({
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Courvux',
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0' },
        }),
    }],
});
```

### SSR safety

`useHead` is a no-op when `document` is unavailable, so it's safe to call during SSR. SSG integration that captures these tags during `renderToString` for static HTML emission is on the roadmap.

> **Tip — SEO baseline.** Pair `useHead` with `mode: 'history'` in the router so each route has a real URL the crawler can fetch. Hash routing (`#/path`) prevents servers and crawlers from seeing per-route content.

---

## Static Site Generation (SSG)

Courvux ships a Vite plugin that pre-renders every route to its own `index.html` at build time. Crawlers, Open Graph previewers, and static hosts (GitHub Pages, Netlify, Cloudflare Pages) see real per-route HTML — not an empty SPA shell.

The plugin captures `useHead` calls during render, so each emitted page has its correct `<title>`, meta tags, canonical link, and JSON-LD inlined into `<head>`. A `sitemap.xml` and `robots.txt` are emitted alongside.

### Usage

```js
// vite.config.js
import { defineConfig } from 'vite';
import courvuxSsg from 'courvux/plugin/ssg';

export default defineConfig({
    plugins: [
        courvuxSsg({
            // Required — async function returning the route list.
            // Each entry: { path, component, head?, prerender? }
            routes: async () => (await import('./src/routes.js')).default,

            // Site base URL — required for sitemap.xml + robots.txt
            baseUrl: 'https://courvux.dev',

            // Optional — page shell with %head%, %app%, %mountId% placeholders.
            // Defaults to a minimal HTML5 shell.
            // template: '<!doctype html>...',

            // Optional — id of the mount root in the shell. Default: 'app'.
            // mountId: 'app',

            // Optional — also emit sitemap.xml + robots.txt. Default: true.
            // sitemap: true,
        }),
    ],
});
```

### Per-route options

```js
const routes = [
    {
        path: '/',
        component: HomePage,
        // Optional fallback head if the component does not call useHead
        head: { title: 'Home — Courvux' }
    },
    {
        path: '/installation',
        component: InstallationPage,  // calls useHead({ title, meta, ... }) in onMount
    },
    {
        // Dynamic route: the plugin calls prerender() to learn which paths to emit
        path: '/blog/:slug',
        component: BlogPost,
        prerender: async () => {
            const posts = await fetch('https://api.example.com/posts').then(r => r.json());
            return posts.map(p => `/blog/${p.slug}`);
        },
    },
];
```

### Output structure

```
dist/
├── index.html                  ← /
├── installation/index.html     ← /installation
├── blog/
│   ├── intro/index.html        ← /blog/intro (from prerender)
│   └── faq/index.html          ← /blog/faq
├── sitemap.xml
└── robots.txt
```

### How head capture works

During SSG, `useHead` calls are buffered instead of mutating the document. The plugin merges them per route, applies dedupe rules (same as runtime), and inlines them into the `<head>` of the emitted HTML. If a component does not call `useHead`, the route-level `head` field is used as a fallback.

`onMount` is invoked during SSG so the standard `useHead` pattern works as-is. Errors thrown from `onMount` (e.g. for client-only APIs like `IntersectionObserver`) are caught and logged — guard SSR-incompatible code with `typeof window === 'undefined'`.

### Programmatic API

If you don't use Vite, the same primitives are exported:

```js
import { renderPage, renderHeadToString } from 'courvux';

const { html, head } = await renderPage(componentConfig);
const headHtml = renderHeadToString(head);
// → embed `headHtml` in your shell, then `html` in the mount root
```

---

## Event Bus

For cross-component signals that don't belong in the store (analytics events, IPC bridges, plugin hooks), Courvux exports a typed event bus:

```ts
import { createEventBus, type EventBus } from 'courvux';

interface AppEvents {
    'user:login':  { id: string; name: string };
    'cart:update': { count: number };
}

const bus: EventBus<AppEvents> = createEventBus();

const off = bus.on('user:login', payload => { /* ... */ });
bus.emit('user:login', { id: '1', name: 'Alice' });
bus.once('cart:update', payload => { /* fires once */ });
off();                       // unsubscribe
bus.clear('user:login');     // clear all listeners for an event
```

Provide it via `createApp({ provide: { bus } })` and `inject` in components.

---

## Reactivity escape hatches

```js
import { markRaw, toRaw, readonly, batchUpdate } from 'courvux';
```

| Helper | Use case |
|---|---|
| `markRaw(obj)` | Skip Proxy wrapping (third-party class instances like Chart.js or xterm.js controllers) |
| `toRaw(reactive)` | Get the underlying non-Proxy object (serialization, `JSON.stringify`, deep equality) |
| `readonly(obj)` | Wrap so writes are silently ignored (use for `provide` values that shouldn't mutate downstream) |
| `batchUpdate(fn)` | Group multiple mutations into one DOM flush — see [Batch Updates](#batch-updates--batch) |

```js
{
    data: {
        chart: markRaw(new Chart(canvas, opts)),  // not made reactive — internal slots stay intact
    }
}
```

Native built-ins like `Date`, `Map`, `Set`, `RegExp`, and typed arrays are automatically skipped from Proxy wrapping (they rely on internal slots that break under Proxy).

---

## DevTools

Courvux ships an in-app DevTools panel — no browser extension required. It mounts a draggable badge in the corner of the page that opens a panel showing all mounted components, their reactive state, and the global store, with **inline live editing**: click any value to edit it, press Enter to commit.

```js
import { createApp, setupDevTools, mountDevOverlay } from 'courvux';

const app = createApp(config);

if (import.meta.env.DEV) {
    const hook = setupDevTools();
    mountDevOverlay(hook);
}

await app.mount('#app');
```

The hook is also exposed at `window.__COURVUX_DEVTOOLS__` for use by external tooling (a Chrome extension is on the roadmap).

**Hook API:**

```ts
interface DevToolsHook {
    instances: DevToolsComponentInstance[];
    stores: DevToolsStoreEntry[];
    on(event: 'mount' | 'update' | 'destroy' | 'store-update', cb): () => void;
}
```

Each instance exposes `getState()`, `setState(key, value)`, and `subscribe(cb)` for programmatic introspection.

---

## Server-Side Rendering (SSR)

Courvux supports basic SSR via `renderToString`, plus client-side hydration. Requires `jsdom` or `happy-dom` as a peer dependency on the server.

```js
// server.js
import { JSDOM } from 'jsdom';
const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
globalThis.document = window.document;
globalThis.window = window;

import { renderToString } from 'courvux';
const html = await renderToString(myConfig, { data: { /* SSR data */ } });
// → '<root data-courvux-ssr="true">Hello</root>'
```

The client-side `mount()` automatically detects `data-courvux-ssr` and hydrates instead of re-rendering. SSR is currently best-suited to small static sites and SSG; it's not yet optimized for high-throughput SSR servers.

**SSR-related exports:**

| Export | Purpose |
|---|---|
| `renderToString(config, opts?)` | Renders a component config to an HTML string |
| `SSR_ATTR` | The hydration marker attribute (`data-courvux-ssr`) — useful for tooling |

A first-class SSG plugin (`courvux/plugin/ssg`) that pre-renders every static route at build time is on the roadmap.

---

## Testing

Courvux exports a Vitest-compatible test utility from `'courvux/test-utils'`:

```js
import { mount } from 'courvux/test-utils';
import { describe, it, expect } from 'vitest';

describe('counter', () => {
    it('increments on click', async () => {
        const w = await mount({
            template: '<button @click="count++">{{ count }}</button>',
            data: { count: 0 }
        });

        w.find('button').click();
        await w.nextTick();
        expect(w.find('button').textContent).toBe('1');

        w.destroy();
    });
});
```

Run with `vitest`. The recommended test environment is `happy-dom`:

```js
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: { environment: 'happy-dom' }
});
```

The wrapper exposes:

| Method | Description |
|---|---|
| `state` | The mounted reactive state |
| `find(selector)` | First matching element inside the mount |
| `findAll(selector)` | All matching elements |
| `nextTick()` | Wait for the next DOM flush |
| `destroy()` | Tear down the mount |

---

## Progressive Web App (PWA)

Courvux does not bundle PWA tooling — the manifest and service worker strategy are always app-specific. This section covers the minimal setup to make any Courvux app installable and offline-capable, plus an optional utility for reacting to install and connectivity events in your components.

---

### Web App Manifest

Create `public/manifest.json`:

```json
{
  "name": "My App",
  "short_name": "MyApp",
  "description": "A Courvux application",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Link it in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#3b82f6" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

---

### Service Worker with Workbox

Install the Vite plugin:

```bash
npm install -D vite-plugin-pwa
```

Configure in `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false, // use your own public/manifest.json
      workbox: {
        // cache the app shell and all static assets
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // runtime caching for API calls
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.yourapp\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ],
});
```

**Cache strategies at a glance:**

| Strategy | Best for |
|---|---|
| `CacheFirst` | Static assets (fonts, images, icons) |
| `NetworkFirst` | API calls — fresh data when online, fallback when offline |
| `StaleWhileRevalidate` | Non-critical data — instant from cache, updates in background |

---

### PWA install prompt utility

The browser fires `beforeinstallprompt` when the app is installable, but only once. Capture it early — before any user interaction — and surface it at the right moment.

Create `src/pwa.ts`:

```ts
interface PWAState {
  installable: boolean;
  installed: boolean;
  online: boolean;
  prompt: (() => Promise<void>) | null;
}

export function createPWA(): PWAState {
  const state: PWAState = {
    installable: false,
    installed: window.matchMedia('(display-mode: standalone)').matches,
    online: navigator.onLine,
    prompt: null,
  };

  let deferredPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (e: any) => {
    e.preventDefault();
    deferredPrompt = e;
    state.installable = true;
    state.prompt = async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        state.installed = true;
        state.installable = false;
      }
      deferredPrompt = null;
      state.prompt = null;
    };
  });

  window.addEventListener('appinstalled', () => {
    state.installed = true;
    state.installable = false;
    deferredPrompt = null;
  });

  window.addEventListener('online',  () => { state.online = true; });
  window.addEventListener('offline', () => { state.online = false; });

  return state;
}
```

Use it in your app:

```ts
import { createApp } from 'courvux';
import { createPWA } from './pwa';

const pwa = createPWA();

createApp({
  data: { pwa },
  template: `<router-view></router-view>`,
  // ...
}).mount('#app');
```

Then in any template:

```html
<!-- offline banner -->
<div cv-if="!pwa.online" class="offline-banner">
  Sin conexión — usando datos en caché
</div>

<!-- install button -->
<button cv-if="pwa.installable && !pwa.installed" @click="pwa.prompt()">
  Instalar aplicación
</button>
```

**What `createPWA` does and does not do:**

| Does | Does not |
|---|---|
| Captures `beforeinstallprompt` before it expires | Register or manage the service worker |
| Exposes a `prompt()` function to trigger the install dialog | Handle cache versioning or update notifications |
| Tracks `online` / `offline` state reactively | Decide cache strategies — that belongs in `vite.config.ts` |
| Detects if already running in standalone mode | Polyfill Safari's lack of `beforeinstallprompt` |

> **Safari / iOS:** The install prompt API is not supported. Users must add to home screen manually via the share button. You can detect iOS and show a custom instruction with `navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')`.

---

## Building

```bash
pnpm build
```

Produces:

| File | Description |
|---|---|
| `dist/index.js` | Minified ES module (~20 kB gzip with all features) |
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
| `cv-for` without `:key` | Without a `:key`, any change to a tracked array/object destroys and recreates all list nodes. Use `:key="item.id"` to enable keyed reconciliation — only changed/added/removed nodes are touched. |
| `cv-for` array mutation | Courvux detects array reassignment (`items = newArray`) and does a full keyed diff. Direct array mutations like `items.push(x)` or `items[0].name = 'x'` also trigger reactively via the deep Proxy, but the diff still runs over the full list. Intercepting specific mutations (push/splice) for O(1) DOM ops is not yet implemented. |
| Self-closing custom elements | `<my-comp />` is **not** valid for custom elements — HTML5 parser ignores the trailing `/`, leaving the element open and swallowing its siblings. Always use explicit closing tags: `<my-comp></my-comp>`. |
| SSR scope | Basic SSR + hydration is supported via `renderToString`, and route pre-rendering is shipped via `courvux/plugin/ssg`. Neither is yet optimized for high-throughput SSR servers — the use case targeted today is SSG / static export, not per-request server rendering. |

---

## Top-level exports

Everything exported from `'courvux'` (v0.4.6):

**App & lifecycle:**
`createApp`, `defineComponent`, `defineAsyncComponent`, `createPlugin`, `autoInit`, `nextTick`, `html`

**Router & store:**
`createRouter`, `createStore`

**Reactivity:**
`batchUpdate`, `markRaw`, `toRaw`, `readonly`

**Composables:**
`cvStorage`, `cvFetch`, `cvDebounce`, `cvThrottle`, `cvMediaQuery`, `cvListener`

**Event bus:**
`createEventBus`

**DevTools:**
`setupDevTools`, `mountDevOverlay`

**SSR / SSG:**
`renderToString`, `renderPage`, `renderHeadToString`, `SSR_ATTR`

**SEO:**
`useHead`

**Subpath exports:**

| Path | Purpose |
|---|---|
| `'courvux'` | Main runtime |
| `'courvux/test-utils'` | Vitest helpers (`mount`) |
| `'courvux/plugin'` | Vite plugin for `templateUrl` inlining |
| `'courvux/plugin/ssg'` | Vite plugin for static site generation |

## Claude Code skill

The repo ships a Claude Code skill at [`skills/courvux/SKILL.md`](./skills/courvux/SKILL.md). Drop it into `~/.claude/skills/courvux/` (or any agent that supports skill files) and your assistant gets a condensed reference to every public surface — directives, components, router, store, useHead, SSG plugin, composables, devtools, gotchas, and the project layout.

```bash
mkdir -p ~/.claude/skills/courvux
cp skills/courvux/SKILL.md ~/.claude/skills/courvux/
```

The skill is kept in sync with the framework's public API on every release.

## Examples

Self-contained example projects in [`examples/`](./examples/):

| # | Example | What it shows |
|---|---|---|
| [01](./examples/01-todomvc/) | TodoMVC | Components, computed, watchers, deep persistence, keyed `cv-for`, dynamic `:cv-ref` |
| [02](./examples/02-counter/) | Counter | Smallest possible Courvux app — drop into Tauri / Electron / mobile webview |
| [03](./examples/03-ssg-blog/) | SSG blog | `useHead`, `courvux/plugin/ssg`, history mode, sitemap, dynamic-route prerender |
| [04](./examples/04-island-mode/) | Island mode | `autoInit()` upgrading `cv-data` islands inside server-rendered HTML |

See [BENCHMARKS.md](./BENCHMARKS.md) for bundle-size comparisons and the methodology for cross-framework runtime benchmarks.

**Type exports** (`import type`):
`AppConfig`, `ComponentConfig`, `RouteConfig`, `Router`, `RouteMatch`, `RouteActivation`, `NavigationGuard`, `ScrollBehavior`, `WatcherEntry`, `WatcherOptions`, `DirectiveBinding`, `DirectiveDef`, `DirectiveShorthand`, `LazyComponent`, `ComputedDef`, `EventBus`, `FetchState`, `FetchOptions`, `DevToolsHook`, `DevToolsComponentInstance`, `DevToolsStoreEntry`, `StoreConfig`, `HeadConfig`, `HeadMeta`, `HeadLink`, `HeadScript`, `RenderedPage`
