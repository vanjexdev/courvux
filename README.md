# Courvux

Lightweight reactive UI framework for the browser. No build step required — ships as a single minified ES module (~8 kB gzip).

**Author:** Vanjexdex  
**Version:** 0.1.0

---

## Installation

### From GitHub

```bash
pnpm add github:vanjexdev/courvux
# or
pnpm add git+ssh://git@github.com:vanjexdev/courvux.git
```

**Without Vite** — reference via import map:

```html
<script type="importmap">
  { "imports": { "courvux": "./node_modules/courvux/dist/index.js" } }
</script>
<script type="module" src="./main.js"></script>
```

**With Vite** — import directly:

```ts
import { createApp } from 'courvux';
```

### Update

```bash
pnpm remove courvux && pnpm add github:vanjexdev/courvux
```

> **Note:** `dist/` must be committed to the repo. Courvux does not run a build step on install.

---

## Quick Start

```js
import { createApp } from 'courvux';

createApp('#app', {
    template: `<h1>Hello, {{ name }}!</h1>
               <button @click="greet">Click me</button>`,
    data: { name: 'World' },
    methods: {
        greet() { this.name = 'Courvux'; }
    }
});
```

---

## API

### `createApp(selector, config)`

Mounts the application on the given CSS selector.

| Option | Type | Description |
|---|---|---|
| `template` | `string` | Inline HTML template |
| `templateUrl` | `string` | Path to an external `.html` file (fetched at runtime) |
| `data` | `object` | Reactive state |
| `methods` | `object` | Methods bound to state via `this` |
| `components` | `object` | Registered child components |
| `router` | `Router` | Router instance from `createRouter` |
| `store` | `object` | Global store from `createStore` |
| `onMount` | `function` | Called after the component mounts |
| `onDestroy` | `function` | Called before the component unmounts |

---

### `createRouter(routes, options?)`

```js
import { createRouter } from 'courvux';

const router = createRouter([
    { path: '/',      component: { templateUrl: './home.html' } },
    { path: '/about', component: { template: '<h1>About</h1>' } }
], { mode: 'history' }); // 'hash' (default) | 'history'
```

Use `<router-view>` in your template to render the active route and `<router-link to="/path">` for navigation.

```html
<nav>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
</nav>
<router-view></router-view>
```

#### Dynamic route params

```js
{ path: '/user/:id', component: { template: '<p>ID: {{ $route.params.id }}</p>' } }
```

`$route.params` is available in the component state:

```html
<h1>User {{ $route.params.id }}</h1>
```

#### Lazy loading

Pass a function that returns a dynamic import. The module is fetched only on first visit and cached.

```js
{ path: '/dashboard', component: () => import('./components/dashboard.js') }
```

The component file must export a default `ComponentConfig`:

```js
// components/dashboard.js
export default {
    template: `<h1>Dashboard</h1>`,
    data: {},
    methods: {}
};
```

**With Vite**, use `?raw` imports for HTML templates:

```ts
// components/dashboard.ts
import template from './dashboard.html?raw';
export default { template, data: {}, methods: {} };
```

#### Layouts

Wrap a route in a layout by passing an HTML string with a `<router-view>` inside it. The component mounts inside that `<router-view>`. The layout has access to `$store`.

```js
const appLayout = `
    <nav>{{ $store.user }}</nav>
    <main>
        <router-view></router-view>
    </main>
`;

createRouter([
    { path: '/',    layout: appLayout, component: () => import('./home.js') },
    { path: '/login',                  component: () => import('./login.js') }
]);
```

**With Vite:**

```ts
import appLayout from './layouts/app.html?raw';

createRouter([
    { path: '/', layout: appLayout, component: () => import('./home') }
]);
```

Routes without `layout` mount the component directly — no change in behavior.

---

### `createStore(config)`

```js
import { createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest' },
    actions: {
        setUser(name) { this.user = name; }
    }
});
```

Access the store anywhere in templates with `$store`:

```html
<p>Welcome, {{ $store.user }}</p>
<input cv-model="$store.user" />
```

---

## Lifecycle Hooks

Available on any component config or route component.

```js
{
    path: '/dashboard',
    component: {
        templateUrl: './dashboard.html',
        data: { ticks: 0 },
        onMount() {
            this._timer = setInterval(() => this.ticks++, 1000);
        },
        onDestroy() {
            clearInterval(this._timer);
        }
    }
}
```

| Hook | When |
|---|---|
| `onMount` | After the component is mounted and reactive |
| `onDestroy` | Before the component is removed (route change) |

`this` inside hooks is the reactive component state.

---

## Directives

### `{{ expr }}` — Interpolation

Any JS expression inside `{{ }}` is evaluated reactively.

```html
<p>Count: {{ count }}</p>
<p>Index: {{ i + 1 }}</p>
<p>Label: {{ active ? 'On' : 'Off' }}</p>
<p>User: {{ $store.user }}</p>
```

---

### `@event` — Event binding

```html
<button @click="increment">+1</button>
<input @input="handleInput" />
```

---

### `:prop` — Property / prop binding

Evaluates a JS expression and sets it as a DOM property or passes it as a prop to a child component.

```html
<input :disabled="count > 10" />
<my-card :title="$store.user" :subtitle="'static value'"></my-card>
```

---

### `cv-model` — Two-way binding

```html
<!-- text / textarea -->
<input type="text" cv-model="name" />

<!-- checkbox → boolean -->
<input type="checkbox" cv-model="active" />

<!-- checkbox group → array -->
<input type="checkbox" cv-model="skills" value="HTML" />
<input type="checkbox" cv-model="skills" value="CSS" />

<!-- radio -->
<input type="radio" cv-model="color" value="red" />
<input type="radio" cv-model="color" value="blue" />

<!-- select -->
<select cv-model="country">
    <option value="ve">Venezuela</option>
    <option value="us">USA</option>
</select>
```

---

### `cv-for` — List rendering

```html
<!-- array -->
<li cv-for="item in items">{{ item }}</li>

<!-- array with index -->
<li cv-for="(item, i) in items">{{ i + 1 }}: {{ item }}</li>

<!-- object -->
<li cv-for="(value, key) in person">{{ key }}: {{ value }}</li>
```

---

### `cv-if` / `cv-else-if` / `cv-else` — Conditional rendering

```html
<p cv-if="count > 10">High</p>
<p cv-else-if="count > 0">Low</p>
<p cv-else>Zero</p>
```

---

### `cv-show` — Visibility toggle

Toggles `display: none` — element stays in the DOM.

```html
<div cv-show="isVisible">Panel</div>
```

---

### `cv-cloak` — Flash prevention

Hides elements until mounting is complete.

```css
[cv-cloak] { display: none; }
```

```html
<div id="app" cv-cloak></div>
```

Courvux removes `cv-cloak` automatically after mounting.

---

## Components

### Defining components

```js
createApp('#app', {
    components: {
        'my-card': {
            templateUrl: './card.html',
            data: { title: '', body: '' },
            onMount() { console.log('card mounted'); }
        }
    },
    template: `<my-card :title="'Hello'" :body="subtitle"></my-card>`,
    data: { subtitle: 'World' }
});
```

### Nested components

```js
components: {
    tarjeta: {
        templateUrl: './tarjeta.html',
        data: { titulo: '', categoria: '' },
        components: {
            badge: {
                templateUrl: './badge.html',
                data: { texto: '' }
            }
        }
    }
}
```

### Props

Pass data from parent to child using `:prop="expr"`. Props are reactive — parent changes flow down automatically.

```html
<!-- parent -->
<tarjeta :titulo="$store.user" :categoria="'Featured'"></tarjeta>
```

```html
<!-- tarjeta.html -->
<h3>{{ titulo }}</h3>
<span>{{ categoria }}</span>
```

---

## Building

```bash
pnpm build   # minified bundle + .d.ts declarations → dist/
```

Output:

| File | Description |
|---|---|
| `dist/index.js` | Minified ES module bundle (~8 kB) |
| `dist/index.d.ts` | TypeScript declarations for public API |
| `dist/*.d.ts` | Declarations for individual modules |

---

## Development

```bash
pnpm dev   # TypeScript watch + dev server at http://localhost:3000
```

The dev server serves `app/` at the root with SPA fallback for history mode routing.

---

## Roadmap

Features planned or in progress:

| Feature | Priority | Description |
|---|---|---|
| `$emit` — component events | High | Child notifies parent without passing callbacks as props |
| Slots | High | Dynamic content injection into components (`<my-card><p>...</p></my-card>`) |
| Computed properties | Medium | Derived state that recalculates automatically |
| Watchers | Medium | React to specific state changes (`watch: { name(val) {} }`) |
| Route guards | Medium | `beforeEnter` for protected routes (auth) |
| `cv-transition` | Low | Enter/leave animations for `cv-if` and `cv-for` |
| Plugin system | Low | Extend the framework from outside |
| SSR / hydration | Low | Server-side rendering support |

Known limitations:

| Item | Description |
|---|---|
| `new Function` / CSP | Expression evaluation requires `unsafe-eval`. May be blocked in strict CSP environments (e.g., some WordPress setups). |
| `cv-for` deep objects | Subscriptions only track the root identifier. Replacing a nested property won't trigger a re-render — reassign the root object instead. |
| State/actions collision | If an action has the same name as a state key in `createStore`, the action overwrites the state silently. Use distinct names. |
