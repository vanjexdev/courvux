# Changelog

All notable changes to Courvux are documented here.
Format: `[version] — date — description`

---

## [Unreleased]

### Features

#### `useHead` composable for per-component head management
**File:** `src/head.ts`
Per-route SEO metadata: `title`, `titleTemplate`, `meta`, `link`, `script`, `htmlAttrs`, `bodyAttrs`. Returns a cleanup function that reverts every tag it touched (existing tags' previous attrs are captured and restored). Dedupe rules: meta by `name`/`property`/`http-equiv`; link by `rel="canonical"` or `rel+href`. SSR-safe (no-op when `document` is unavailable). See README "SEO and `useHead`".

#### Static Site Generation plugin (`courvux/plugin/ssg`)
**Files:** `plugin/vite-plugin-courvux-ssg.js`, `src/ssr.ts`, `src/head.ts`
Vite plugin that pre-renders Courvux routes to static HTML at build time. Each route emits its own `<path>/index.html` so crawlers and static hosts see real per-route HTML, not an empty SPA shell.
- `useHead` calls during render are buffered (not applied to `document`) and inlined into the emitted page's `<head>` after dedupe.
- Dynamic routes with `:param` opt in via a `prerender()` callback returning the concrete paths.
- Emits `sitemap.xml` and `robots.txt` from the route list when `baseUrl` is provided.
- Customizable shell template with `%head%`, `%app%`, `%mountId%` placeholders.

#### `renderPage` and `renderHeadToString` (low-level SSG primitives)
**File:** `src/ssr.ts`
- `renderPage(config, opts) → { html, head }` — runs `onBeforeMount` and `onMount` (errors caught) and captures `useHead` calls during render.
- `renderHeadToString(head) → string` — renders a `HeadConfig` to HTML for embedding in a page shell.
- Both await async `onMount` so users can dynamic-import inside it.

#### Router `base` option for subpath deployments
**File:** `src/router.ts`, `src/dom.ts`, `src/types.ts`
`createRouter(routes, { mode: 'history', base: '/myapp' })` — internal route paths stay clean (`/about`); the router prepends `base` when writing to history and strips it when reading `window.location`. `<router-link>` `href` is also rendered with the base prefix so server-rendered HTML and progressive enhancement work without JS. Required for SSG deployments under a subpath (e.g. GitHub Pages at `/<repo>/`).

### Changes

#### Head collection state moved to `globalThis`
**File:** `src/head.ts`
The SSG/SSR head buffer is now stored at `globalThis.__COURVUX_HEAD_COLLECTOR__`. Without this, when `useHead` is imported from a different module-cache slot (e.g. through a pnpm symlink) than the one used by `renderPage`, calls would land in a separate buffer and be silently dropped. Behavior in regular client runtime is unchanged.

#### SSG plugin shell auto-detection
**File:** `plugin/vite-plugin-courvux-ssg.js`
By default, the plugin now reads the Vite-emitted `<outDir>/index.html` and uses it as the page shell — preserving hashed asset paths automatically. It strips per-page-overridable head tags (`<title>`, `<meta name="description">`, `<meta property="og:*">`, `<link rel="canonical">`) so the SSG-injected metadata does not duplicate the shell's. An explicit `template` option still overrides this behavior.

#### SSG plugin `notFound` option for `404.html`
**File:** `plugin/vite-plugin-courvux-ssg.js`
New plugin option: `notFound: ComponentConfig | () => Promise<{default: ComponentConfig}>`. When provided, the plugin renders this component the same way as a regular route and writes the result to `<outDir>/404.html`. Static hosts (GitHub Pages, Netlify, Cloudflare Pages) serve this file for any unknown path, allowing the SPA to hydrate over a real 404 view instead of falling back to the host's generic page.

---

## [0.3.0] — 2026-04-29

### Bug fixes

#### `makeDeepProxy` wraps native browser objects (Date, Map, Set, RegExp, etc.)
**File:** `src/reactivity.ts`  
**Problem:** `makeDeepProxy` wrapped any object indiscriminately. Native built-ins like `Date`,
`Map`, `Set`, `RegExp`, typed arrays rely on internal slots (`[[DateValue]]`, `[[MapData]]`, etc.)
that break when accessed through a Proxy.  
**Fix:** Added `SKIP_PROXY` guard. Built-in types are returned as-is without wrapping.
Applied in both `makeDeepProxy` and the `createReactiveState` get trap.
```ts
const SKIP_PROXY = (v: any): boolean =>
    v instanceof Date || v instanceof RegExp ||
    v instanceof Map  || v instanceof Set    ||
    v instanceof WeakMap || v instanceof WeakSet ||
    ArrayBuffer.isView(v) || v instanceof ArrayBuffer;
```

#### `toRaw` could not unwrap values returned by `makeDeepProxy`
**File:** `src/reactivity.ts`  
**Problem:** `makeDeepProxy` did not handle `RAW_SYMBOL` in its get trap. Calling
`toRaw(makeDeepProxy(x))` returned the proxy unchanged. When reactive arrays/objects were
passed as props to child components, they arrived as a double-wrapped proxy
(`Proxy { target: Proxy { target: [] } }`), breaking `Array.prototype.includes()` and
similar methods.  
**Fix:** `makeDeepProxy` now propagates `RAW_SYMBOL` upward through nested proxies.
`toRaw()` in `index.ts` is applied to all prop values before assignment to child state.
```ts
get(t, k) {
    if (k === RAW_SYMBOL) return (t as any)[RAW_SYMBOL] ?? t;
    ...
}
// index.ts — prop assignment
props[propName] = toRaw(evaluate(expr, parentState));
childState[propName] = toRaw(evaluate(expr, parentState));
```

#### Computed errors swallowed silently
**File:** `src/index.ts`  
**Problem:** Errors thrown inside computed getters were caught and discarded with an empty
`catch` block. In development this made broken computeds completely invisible — they just
returned `undefined` with no warning.  
**Fix:** Errors are now logged via `console.warn` when `debug: true` is set on the app config.
```ts
} catch (e) {
    if ((config as any).debug ?? (appContext as any).debug)
        console.warn('[courvux] computed error:', e);
}
```

#### `cv-if` / `cv-else-if` / `cv-else` did not mount custom components used as root element
**File:** `src/dom.ts`  
**Problem:** `walk(node, state, ctx)` only processes **children** of the passed node, not the
node itself. When a custom component was the direct target of `cv-if`
(e.g. `<month-view cv-if="view === 'month'">`) the component was never processed and never
mounted.  
**Fix:** Clone is wrapped in a `DocumentFragment` before `walk()`. The clone becomes a child
of the fragment, so `walk()` sees and processes it as a component.
```ts
const frag = document.createDocumentFragment();
frag.appendChild(clone);
await walk(frag, state, context);
const actualEl = (frag.firstChild ?? clone) as HTMLElement;
branch.anchor.parentNode?.insertBefore(frag, branch.anchor.nextSibling);
activeClone = actualEl;
```

---

## [0.2.0] — prior

### Bug fixes

#### `cv-for` did not mount custom components / router-links inside loops
**File:** `src/dom.ts`  
**Problem:** Same `walk()` root-node limitation. Cloned elements inside `cv-for` (keyed and
non-keyed paths) were not processed as components or router-links.  
**Fix:** DocumentFragment wrapper applied in both keyed and non-keyed `cv-for` render paths.

#### `mergedItemState` Proxy missing `has` trap caused `section is undefined`
**File:** `src/dom.ts`  
**Problem:** `cv-for` creates a merged state proxy for each iteration item. Without a `has`
trap, `k in proxy` returned `false`. The `executeHandler` proxy fell through to
`globalThis.k = undefined`, making variables appear undefined inside loops.  
**Fix:** Added `has(_, key) { return true; }` to the `mergedItemState` Proxy.

#### Self-closing custom elements broke template parsing
**Scope:** All template files  
**Problem:** HTML5 parser ignores `/` in `<my-comp />`. The element stays open and swallows
subsequent siblings as children. When Courvux mounts the component it replaces the element,
discarding the swallowed siblings.  
**Fix:** All custom elements must use explicit closing tags: `<my-comp></my-comp>`.
