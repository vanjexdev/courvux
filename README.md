# Courvux

Lightweight reactive UI framework for the browser. No build step required for users — ships as a single minified ES module.

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

Then reference it via an import map:

```html
<script type="importmap">
  { "imports": { "courvux": "./node_modules/courvux/dist/index.js" } }
</script>
<script type="module" src="./main.js"></script>
```

### Manual

Copy `dist/index.js` to your project and reference it via an import map:

```html
<script type="importmap">
  { "imports": { "courvux": "/dist/index.js" } }
</script>
<script type="module" src="./main.js"></script>
```

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
| `templateUrl` | `string` | Path to an external `.html` file |
| `data` | `object` | Reactive state |
| `methods` | `object` | Methods bound to state via `this` |
| `components` | `object` | Registered child components |
| `router` | `Router` | Router instance from `createRouter` |
| `store` | `object` | Global store from `createStore` |

---

### `createRouter(routes, options?)`

```js
import { createRouter } from 'courvux';

const router = createRouter([
    { path: '/', component: { templateUrl: './home.html' } },
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

## Directives

### `{{ expr }}` — Interpolation

Renders the value of a reactive expression inside text nodes.

```html
<p>Count: {{ count }}</p>
<p>Full name: {{ $store.firstName }}</p>
```

---

### `@event` — Event binding

Binds a DOM event to a method.

```html
<button @click="increment">+1</button>
<input @input="handleInput" />
```

---

### `:prop` — Property binding

Evaluates a JS expression and sets it as a property on the element or passes it as a prop to a child component.

```html
<input :disabled="count > 10" />
<my-card :title="$store.user" :subtitle="'static value'"></my-card>
```

---

### `cv-model` — Two-way binding

Syncs an input element with a reactive state value.

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

Iterates over arrays or objects.

```html
<!-- array -->
<li cv-for="item in items">{{ item }}</li>

<!-- array with index -->
<li cv-for="(item, i) in items">{{ i }}: {{ item }}</li>

<!-- object -->
<li cv-for="(value, key) in person">{{ key }}: {{ value }}</li>
```

---

### `cv-if` / `cv-else-if` / `cv-else` — Conditional rendering

Conditionally inserts or removes elements from the DOM.

```html
<p cv-if="count > 10">High</p>
<p cv-else-if="count > 0">Low</p>
<p cv-else>Zero</p>
```

---

### `cv-show` — Visibility toggle

Toggles `display: none` without removing the element from the DOM.

```html
<div cv-show="isVisible">This panel can be hidden</div>
<button @click="toggle">Toggle</button>
```

---

### `cv-cloak` — Flash prevention

Hides elements until the component finishes mounting. Pair with a CSS rule:

```css
[cv-cloak] { display: none; }
```

```html
<div id="app" cv-cloak>...</div>
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
            data: { title: '', body: '' }
        }
    },
    template: `<my-card :title="'Hello'" :body="subtitle"></my-card>`,
    data: { subtitle: 'World' }
});
```

### Nested components

Components can register their own child components:

```js
createApp('#app', {
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
});
```

### Props

Pass data from parent to child using `:prop="expr"`. Props are reactive — when the parent state changes the child updates automatically.

```html
<!-- parent template -->
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
# Minified bundle → dist/index.js
pnpm build

# Type declarations only → dist/*.d.ts
pnpm build:types

# Both
pnpm build:all
```

Output:

| File | Description |
|---|---|
| `dist/index.js` | Minified ES module bundle (~7 kB) |
| `dist/index.d.ts` | TypeScript declarations for public API |
| `dist/*.d.ts` | Declarations for individual modules |

---

## Development

```bash
# Starts TypeScript watch + local dev server
pnpm dev
```

The dev server serves `app/` at `http://localhost:3000` with SPA fallback for history mode routing.
