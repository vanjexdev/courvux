---
name: courvux
description: >
  Expert knowledge of the Courvux reactive framework (cv-framework). Use when the user
  asks about Courvux directives, components, reactivity, routing, store, SSG, useHead,
  composables, devtools, or debugging issues in projects that import from 'courvux'.
---

# Courvux Framework Expert

Lightweight reactive UI framework for the browser. No virtual DOM. ~20.7 KB gzip with everything (router, store, devtools, composables, useHead, SSR primitives). Vue/Alpine ergonomics.

All paths below are relative to the repo root (`vanjexdev/courvux`).

| | |
|---|---|
| Source | `src/` |
| Dist | `dist/index.js` |
| Docs site source | `site/` |
| Docs site output | `docs/` (GH Pages) |
| Examples | `examples/` |
| Changelog | `CHANGELOG.md` |
| Benchmarks | `BENCHMARKS.md` |
| Current version | **0.4.5** |
| Repo | `https://github.com/vanjexdev/courvux` |
| Live docs | `https://vanjexdev.github.io/courvux/` |

---

## App bootstrap

```js
import { createApp } from 'courvux';

createApp({
    data: { count: 0 },
    methods: { inc() { this.count++; } },
    onMount() { console.log('mounted'); }
}).mount('#app');
```

App-level options: `data`, `methods`, `computed`, `watch`, `components`, `router`, `store`,
`directives`, `provide`, `globalProperties`, `debug`, lifecycle hooks (`onBeforeMount`,
`onMount`, `onBeforeUnmount`, `onDestroy`, `onError`).

App methods: `.use(plugin)`, `.directive(name, def)`, `.component(name, config)`,
`.provide(key, val)`, `.magic(name, fn)`, `.mount(selector)`, `.mountAll(sel?)`,
`.mountEl(el)`, `.unmount(sel?)`, `.destroy()`.

`.magic()` registers a global `$name` available in every component:
```js
createApp(config).magic('fmt', () => ({ currency: v => `$${v.toFixed(2)}` })).mount('#app');
// In any template: {{ $fmt.currency(price) }}
```

---

## Directives

| Directive | Description |
|-----------|-------------|
| `{{ expr }}` | Text interpolation (full JS expressions) |
| `:attr="expr"` | Bind attribute/prop |
| `:class="{ cls: bool }"` | Class binding (object / array / string) |
| `:style="{ color: val }"` | Style binding (object / string) |
| `@event="method"` / `cv:on:event` | Event listener (interchangeable shorthand) |
| `cv-if="expr"` | Conditional render (removes from DOM) |
| `cv-else-if="expr"` / `cv-else` | Branched conditions |
| `cv-show="expr"` | Toggle `display` (stays in DOM) |
| `cv-for="item in list" :key="item.id"` | List render with keyed reconciliation |
| `cv-for="(item, i) in list"` | With index |
| `cv-for="(val, key) in obj"` | Object iteration |
| `cv-model="prop"` | Two-way binding (input/select/checkbox/radio) |
| `cv-model.lazy` / `.trim` / `.number` / `.debounce[.NN]` | Modifiers |
| `cv-html="expr"` / `cv-html.sanitize` | innerHTML (raw or sanitized) |
| `cv-ref="name"` / `:cv-ref="'edit_'+id"` | Refs (static or dynamic) |
| `cv-data="{ key: val }"` | Inline reactive scope |
| `cv-once` | Render once, skip future updates |
| `cv-cloak` | Hidden until app mounts (auto-injected CSS) |
| `cv-teleport="body"` | Move to different DOM target keeping reactivity |
| `cv-intersect="handler()"` / `.once` / `.half` / `.threshold-N` / `.margin-N` | IntersectionObserver |
| `cv-transition` / `cv-transition:enter` etc. | Enter/leave transitions (built-in or class-based, Alpine-compatible) |

Event modifiers: `.prevent`, `.stop`, `.once`, `.self`, `.passive`, `.capture`.
Key modifiers: `.enter`, `.esc`, `.space`, `.tab`, `.delete`, `.up/down/left/right`.

---

## Components

```js
export default {
    template: `<div>{{ title }}</div>`,
    props: ['title', 'count'],
    emits: ['update'],
    data: { local: 0 },
    methods: { send() { this.$emit('update', this.local); } },
    onMount() {},
};
```

**Self-closing custom elements DON'T WORK** — HTML5 parser ignores `/` in `<my-comp />`,
element stays open and swallows siblings. **Always** use explicit closing tags:
`<my-comp></my-comp>`.

### Props
- Pass: `<my-card :title="x" :items="list" @saved="onSave"></my-card>`
- Receive: `props: ['title', 'items']`
- Hyphenated → camelCase: `:available-days="days"` arrives as `availableDays`
- Reactive arrays/objects pass `toRaw()`-unwrapped (no double-Proxy)

### cv-model on components
`cv-model="x"` is sugar for `:modelValue="x" @update:modelValue="x = $event"`.
For named props: `cv-model:title="docTitle"` → child emits `update:title`.

### Slots
- Default: `<slot></slot>` + `<my-modal><p>content</p></my-modal>`
- Named: `<slot name="header">` + `<span slot="header">...</span>`
- Scoped: `<slot :item="item">` + `<my-list v-slot="{ item }">{{ item }}</my-list>`
- Conditional: `<div cv-if="$slots.header">` based on `$slots[name]` boolean

### Dynamic component
`<component :is="activeView"></component>` — destroys previous, mounts new on change.

### `defineComponent` / `defineAsyncComponent`
TS helpers for type inference + lazy loading with `loadingTemplate` / `errorTemplate` / `delay` / `timeout`.

---

## Lifecycle

`onBeforeMount` → walk → `onMount` → updates → `onBeforeUpdate` / `onUpdated` → `onBeforeUnmount` → `onDestroy`.

Routing: `onBeforeRouteLeave(to, next)`, `onBeforeRouteEnter(from)`.
Keep-alive: `onActivated`, `onDeactivated`.
Errors: `onError(err)` (catches descendant errors).

---

## Computed & Watch

```js
computed: {
    total() { return this.price * this.qty; },
    fullName: {  // writable
        get() { return `${this.first} ${this.last}`; },
        set(v) { [this.first, ...rest] = v.split(' '); this.last = rest.join(' '); }
    }
},
watch: {
    query(newVal, oldVal) { this.search(newVal); },
    items: { handler(v) { ... }, immediate: true, deep: true }
}
```

Programmatic: `this.$watch(key, handler, opts)` / `this.$watchEffect(fn)` (auto-tracked).

---

## Reactivity escape hatches

```js
import { markRaw, toRaw, readonly, batchUpdate } from 'courvux';

markRaw(new Chart(...))        // skip Proxy wrapping for class instances with internal slots
toRaw(reactiveValue)           // unwrap to plain value (works on createReactiveState + makeDeepProxy)
readonly(obj)                  // wrap for provide; writes silently ignored with warn
batchUpdate(() => { a++; b++; }) // single DOM flush for multiple mutations
```

Native built-ins (`Date`, `Map`, `Set`, `RegExp`, typed arrays) are **automatically skipped** from Proxy wrapping — no `markRaw` needed.

---

## Router

```js
import { createApp, createRouter } from 'courvux';

const router = createRouter([
    { path: '/', component: Home },
    { path: '/about', component: () => import('./pages/About.js') }, // lazy
    { path: '/user/:id', component: UserPage },
    { path: '/admin', component: Admin, beforeEnter: authGuard },
    { path: '/dashboard', layout: sidebarHTML, component: Dashboard, keepAlive: true },
    { path: '*', component: NotFound }
], {
    mode: 'history',         // or 'hash' (default)
    base: '/courvux',        // for GH Pages subpath deployments
    transition: 'fade',      // global; per-route override on the route
    beforeEach(to, next) { next(); },
    afterEach(to, from) {},
    scrollBehavior(to, from) { return { x: 0, y: 0 }; },
});
```

```html
<router-view></router-view>
<router-link to="/about">About</router-link>
<router-link to="/about" class="custom">About</router-link>  <!-- attrs forwarded -->
```

```js
this.$router.navigate('/user/42');
this.$router.navigate('/search', { query: { q: 'hello' } });
this.$router.replace('/login');
this.$router.back(); this.$router.forward();

this.$route.params.id;  this.$route.query.q;
this.$route.path;       this.$route.meta;
```

Built-in transitions: `'fade'`, `'slide-up'`. Named views (`<router-view name="panel">` + `components: { default: A, panel: B }`). Nested routes via `children:` array.

---

## Store

```js
import { createStore } from 'courvux';

const store = createStore({
    state: { user: 'guest', count: 0 },
    actions: { setUser(name) { this.user = name; } },
    modules: {
        cart: {
            state: { items: [] },
            actions: { add(item) { this.items.push(item); } }
        }
    }
});

createApp({ store, ... }).mount('#app');
```

Templates: `{{ $store.user }}` / `<input cv-model="$store.user">` / `<button @click="$store.cart.add(p)">`. State and action names must be distinct (warning if collision).

---

## Composables

| | |
|---|---|
| `cvStorage(key, defaults)` | Reactive object backed by localStorage. `.$clear()` resets. |
| `cvFetch(url, callback, opts?)` | Reactive fetch with `{ data, loading, error }`. Returns `{ execute, abort }`. Opts: `method`, `headers`, `body`, `immediate`, `transform`. |
| `cvDebounce(fn, ms)` / `cvThrottle(fn, ms)` | Wrappers preserving `this`. Both expose `.cancel()`. |
| `cvMediaQuery(query, cb)` | matchMedia with reactive callback. |
| `cvListener(target, event, handler, opts?)` | addEventListener returning cleanup fn (pair with `$addCleanup`). |

```js
import { cvStorage, cvFetch } from 'courvux';

const settings = cvStorage('app-settings', { theme: 'light' });
settings.theme = 'dark';  // auto-persisted

onMount() {
    const { abort } = cvFetch('/api/users', ({ data, loading, error }) => {
        this.users = data ?? [];
    });
    this.$addCleanup(abort);
}
```

---

## Event Bus

```js
import { createEventBus, type EventBus } from 'courvux';

interface AppEvents {
    'user:login': { id: string };
    'cart:update': { count: number };
}
const bus: EventBus<AppEvents> = createEventBus();

const off = bus.on('user:login', p => { /* p typed */ });
bus.emit('user:login', { id: '1' });
bus.once('cart:update', cb);
off();
bus.clear('user:login');
bus.clear();  // all events
```

Provide via `createApp({ provide: { bus } })` + inject in components.

---

## SEO — `useHead`

Per-component head management. Updates `document.title`, upserts `<meta>`, `<link>`, `<script>` tags, plus `htmlAttrs`/`bodyAttrs`. Returns cleanup that **restores prior values exactly** (existing tag attrs are captured before override).

```js
import { useHead } from 'courvux';

onMount() {
    const cleanup = useHead({
        title: 'Installation',
        titleTemplate: '%s — Courvux',  // or fn: t => `${t} | site`
        meta: [
            { name: 'description', content: '...' },
            { property: 'og:title', content: 'Installation — Courvux' },
            { property: 'og:image', content: '/og/installation.png' },
            { name: 'twitter:card', content: 'summary_large_image' },
        ],
        link: [{ rel: 'canonical', href: 'https://courvux.dev/installation' }],
        script: [{
            type: 'application/ld+json',
            innerHTML: JSON.stringify({ '@type': 'SoftwareApplication', name: 'Courvux' })
        }],
        htmlAttrs: { lang: 'es' },
        bodyAttrs: { class: 'theme-dark' },
    });
    this.$addCleanup(cleanup);
}
```

Dedupe rules: meta by `name` then `property` then `http-equiv`; link by `rel="canonical"` (unique) or `rel+href`. SSR-safe (no-op when `document` undefined).

---

## SSG — `courvux/plugin/ssg`

Vite plugin that pre-renders every route to its own `<path>/index.html` at build time. Inlines `useHead` calls per route. Emits `sitemap.xml`, `robots.txt`, optional `404.html`.

```js
// vite.config.js
import courvuxSsg from 'courvux/plugin/ssg';

export default defineConfig({
    plugins: [
        courvuxSsg({
            // Required — async fn returning route list
            routes: async () => (await import('./src/routes-data.js')).default,

            // Required for sitemap.xml
            baseUrl: 'https://courvux.dev',

            // Match createRouter() options for correct router-link hrefs
            router: { mode: 'history', base: '/courvux' },

            // Optional — emits dist/404.html for static-host fallback
            notFound: async () => (await import('./src/pages/NotFound.js')).default,

            // Optional — same global components passed to createApp().
            // Required for custom components (<code-block>, <my-card>, etc.)
            // to render into static HTML during SSG instead of staying as
            // unprocessed tags. Default-slot content is rendered; named/
            // scoped slots are skipped at build time and hydrate on client.
            components: async () => ({
                'code-block': (await import('./src/components/CodeBlock.js')).CodeBlock,
            }),

            // Optional — custom shell. Default: auto-reads Vite-emitted index.html
            // template: '<!doctype html>...%head%...%app%...',
            // mountId: 'app',
            // sitemap: true,
        }),
    ],
});
```

**Per-route options**: `path`, `component`, `head` (fallback HeadConfig), `prerender: () => Promise<string[]>` for `:param` routes (returns concrete paths to emit).

**Output structure**:
```
dist/
├── index.html              (← /)
├── installation/index.html (← /installation)
├── posts/
│   ├── intro/index.html    (← /posts/intro from prerender)
│   └── faq/index.html
├── 404.html
├── sitemap.xml
└── robots.txt
```

**Programmatic primitives** (no Vite needed):
```js
import { renderPage, renderHeadToString } from 'courvux';

const { html, head } = await renderPage(componentConfig, {
    router: { mode: 'history', base: '' }
});
const headHtml = renderHeadToString(head);
// Embed both in your shell.
```

`renderPage` runs `onBeforeMount` AND `onMount` (errors caught) — guard client-only code with `typeof window === 'undefined'`. The plugin sets `window.location.href` to the route being rendered so components can read `pathname` synchronously.

---

## DevTools

In-app overlay — no browser extension needed. Draggable badge → panel with Components, Store tabs and inline live editing.

```js
import { setupDevTools, mountDevOverlay } from 'courvux';

if (import.meta.env.DEV) {
    const hook = setupDevTools();
    mountDevOverlay(hook);
}
```

Hook exposed at `window.__COURVUX_DEVTOOLS__`. API: `instances[]`, `stores[]`, `on('mount'|'update'|'destroy'|'store-update', cb)`. Each instance has `getState()`, `setState(k, v)`, `subscribe(cb)`.

---

## Provide / Inject

```js
// ancestor (root or any component)
provide: { theme: 'dark' }
provide() { return { user: this.user }; }  // function form for reactive values

// descendant
inject: ['theme']
inject: { localTheme: 'theme' }  // aliased
```

---

## Custom directives

```js
createApp({
    directives: {
        focus: el => el.focus(),  // shorthand: mount only
        tooltip: {
            onMount(el, b)  { el.title = b.value; },
            onUpdate(el, b) { el.title = b.value; },
            onDestroy(el)   { el.title = ''; }
        }
    }
});
```

`<input cv-focus>` / `<span cv-tooltip="msg">`. Binding: `{ value, arg, modifiers }`.

---

## Plugins

```js
import { createPlugin } from 'courvux';

const lucidePlugin = createPlugin({
    name: 'lucide',  // dedupe key
    install(app) {
        app.router?.afterEach(() => createIcons());
    }
});

createApp(config).use(lucidePlugin).mount('#app');
```

---

## Vite plugins

| Path | Purpose |
|---|---|
| `'courvux/plugin'` | Inlines `templateUrl: './foo.html'` at build time, eliminates runtime fetches, HMR for `.html` |
| `'courvux/plugin/ssg'` | Static site generation (see SSG section above) |

---

## Testing

```js
import { mount } from 'courvux/test-utils';
import { describe, it, expect } from 'vitest';

it('counter', async () => {
    const w = await mount({
        template: '<button @click="count++">{{ count }}</button>',
        data: { count: 0 }
    });
    w.find('button').click();
    await w.nextTick();
    expect(w.find('button').textContent).toBe('1');
    w.destroy();
});
```

Wrapper: `el`, `state` (drive directly!), `html()`, `text()`, `find(sel)`, `findAll(sel)`, `trigger(target, event)`, `nextTick()`, `destroy()`. Pass `global: { store, router, components }` for app-level deps.

Use `environment: 'happy-dom'` in `vitest.config.js`.

---

## `autoInit()` — island mode

Initialize `cv-data` elements automatically on `DOMContentLoaded` — no `createApp` needed. Ideal for sprinkling reactivity onto server-rendered HTML pages.

```js
import { autoInit } from 'courvux';

autoInit({
    components: { counter: CounterDef },         // named-component scopes
    directives: { focus: el => el.focus() },
    globalProperties: { siteName: 'My Site' },
});
```

```html
<div cv-data="{ count: 0 }">
    <button @click="count++">{{ count }}</button>
</div>
<div cv-data="counter">  <!-- references registered component -->
    <button @click="dec()">−</button> {{ n }} <button @click="inc()">+</button>
</div>
```

Only **top-level** `[cv-data]` elements are walked — nested ones are handled by their outer scope.

---

## Top-level exports (v0.4.5)

**App**: `createApp`, `defineComponent`, `defineAsyncComponent`, `createPlugin`, `autoInit`, `nextTick`, `html`
**Router/Store**: `createRouter`, `createStore`
**Reactivity**: `batchUpdate`, `markRaw`, `toRaw`, `readonly`
**Composables**: `cvStorage`, `cvFetch`, `cvDebounce`, `cvThrottle`, `cvMediaQuery`, `cvListener`
**Events**: `createEventBus`
**DevTools**: `setupDevTools`, `mountDevOverlay`
**SEO**: `useHead`
**SSR/SSG**: `renderToString`, `renderPage`, `renderHeadToString`, `SSR_ATTR`

**Subpath exports**: `'courvux'`, `'courvux/test-utils'`, `'courvux/plugin'`, `'courvux/plugin/ssg'`.

---

## Known gotchas (post-fixes)

### Self-closing custom elements
HTML5 parser ignores `/` in `<my-comp />` — element stays open. **Always**: `<my-comp></my-comp>`.

### Hyphenated prop names → camelCase
`:available-days="days"` → child receives `availableDays`.

### `cv-model` on components requires `modelValue` prop + `update:modelValue` emit
Or use named: `cv-model:title="x"` → prop `title`, emit `update:title`.

### Walk root limitation
`walk(node)` processes CHILDREN only, not the node itself. **Already fixed** in cv-if/else/for via DocumentFragment wrapper — but watch out if you write your own walk-using code.

### subscribeDeps + nested paths
`cv-if="items.length > 0"` and similar (any `.<prop>` chain) used to never re-evaluate. **Fixed in 0.4.0** — now reduces dotted tokens to root key for subscription. Bare-key tests didn't catch this; if writing tests for the framework, exercise nested-path expressions.

### Native built-ins through Proxy
`Date`, `Map`, `Set`, `RegExp`, typed arrays, `ArrayBuffer` views are auto-skipped from `makeDeepProxy`. No `markRaw` needed for them. (Fixed in 0.3.x.)

### Props arrive `toRaw`-unwrapped
Reactive arrays/objects passed as props no longer arrive as double-wrapped Proxy. Methods like `Array.prototype.includes()` work normally on prop arrays in child components.

### computed errors swallowed
By default, errors in computed getters are caught silently (returning `undefined`). Set `debug: true` on app config to log them via `console.warn`.

### history mode + base path
For GH Pages or any subpath deployment: `createRouter(routes, { mode: 'history', base: '/<repo>' })`. The router prefixes URLs and strips on read; `<router-link>` renders correct `href` with the prefix.

### SSG hydration
`renderPage` marks the root with `data-courvux-ssr="true"`. Client `mount()` detects this and skips first render → hydrates the existing DOM. Component `onMount` runs both during SSG (for `useHead` capture) and on client — guard with `typeof window === 'undefined'` for SSR-incompatible work.

### vite preview trailing slash
`pnpm preview` doesn't auto-redirect `/foo` → `/foo/` for dynamically generated SSG folders. GH Pages / Netlify / Cloudflare handle this correctly. Don't be alarmed if direct-typing routes without trailing slash hits home only in `vite preview`.

---

## Build & test commands

| Workflow | Command (from repo root unless noted) |
|---|---|
| Build framework | `pnpm build` |
| Run unit tests | `pnpm test` (vitest, 118 tests) |
| SSR self-test | `pnpm test:ssr` (10 assertions) |
| SSG self-test | `pnpm test:ssg` (20 assertions) |
| All tests | `pnpm test:all` |
| Coverage | `pnpm vitest run --coverage` |
| Site dev | `cd site && pnpm dev` |
| Site build | `cd site && pnpm build` (outputs to `docs/`) |
| Site preview | `cd site && pnpm preview` |

Build output: `dist/index.js` (~62 kB min / ~20.7 kB gzip), `dist/test-utils.js`, plus `.d.ts` files.

---

## Examples (`examples/`)

| Dir | Build step | What it shows |
|---|---|---|
| `01-todomvc/` | None — open via static server | Components, computed, watchers, deep persistence, keyed `cv-for`, dynamic `:cv-ref` |
| `02-counter/` | None | Smallest possible Courvux app — Tauri/Electron-friendly |
| `03-ssg-blog/` | `pnpm build` (Vite) | `useHead`, `courvux/plugin/ssg`, history mode + `base`, sitemap, dynamic-route prerender |
| `04-island-mode/` | None | `autoInit()` upgrading `cv-data` islands inside server-rendered HTML |

Examples 01/02/04 use an importmap pointing at `../../dist/index.js` — serve from the repo root: `npx serve .` then visit `/examples/01-todomvc/`. Example 03 has its own `package.json` with `courvux: link:..` — run `pnpm dev` or `pnpm build && pnpm preview` from inside its directory.

---

## Project structure

```
src/
  dom.ts          — walk(), all directive processing (cv-for, cv-if, cv-show, cv-model, etc.)
  reactivity.ts   — createReactiveState, makeDeepProxy, toRaw, markRaw, batchUpdate
  index.ts        — createApp, mount, createMountElement (prop binding), defineComponent
  router.ts       — createRouter, setupRouterView, base prefix handling
  store.ts        — createStore, modules, subscribeToStore
  events.ts       — createEventBus
  composables.ts  — cvStorage, cvFetch, cvDebounce, cvThrottle, cvMediaQuery, cvListener
  head.ts         — useHead with SSR collection mode (globalThis-based for symlink-safety)
  ssr.ts          — renderToString, renderPage, renderHeadToString, mergeHeads
  overlay.ts      — devtools overlay UI
  devtools.ts     — devtools hook integration
  test-utils.ts   — mount() for vitest

plugin/
  vite-plugin-courvux.js          — templateUrl inlining
  vite-plugin-courvux-ssg.js      — static site generation

dist/index.js     — built ESM (run pnpm build)
docs/             — built site for GH Pages
site/             — docs site source
examples/         — 4 example projects
```
