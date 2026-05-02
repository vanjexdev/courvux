# Changelog

All notable changes to Courvux are documented here.
Format: `[version] — date — description`

---

## [0.4.5] — 2026-05-02

### Bug fixes (preventive — Safari/Samsung Internet hardening)

A repo-wide audit (roadmap Fase 1.1) of every `setAttribute` /
`removeAttribute` / `element.attributes` loop found one more spot with
the same class of bug as the router-link fix in 0.4.4: the HTML parser
accepts attribute names containing `@` or `:` (`@click`, `:aria-label`,
etc.) but the `setAttribute()` DOM API in Safari and Samsung Internet
rejects them with `InvalidCharacterError`.

#### `<component :is="...">` crashed when the original tag carried framework directives
**File:** `src/index.ts` — `mountDynamic`
The dynamic-component handler initialised the wrapper `<div>` with
`Array.from(originalEl.attributes).forEach(a => newEl.setAttribute(a.name, a.value))`
— same pattern that crashed `<router-link>` in 0.4.4. Any consumer
writing
`<component :is="active" @click="handler" :title="lbl">`
would crash mount on stricter browsers.
**Fix:** skip framework attribute names (`@`, `cv:on:`, `:`, `cv-`,
`v-slot`) in the wrapper copy. The prop / `$emit` extraction below
already reads them from the original element so nothing is lost.

#### `cv-bind` defensive try/catch around setAttribute
**File:** `src/dom.ts`
`cv-bind` takes a free-form object whose keys become element
attributes. A user passing `{ '@click': 'foo' }` would crash the
entire walk on stricter browsers. Now wraps `setAttribute` /
`removeAttribute` in try/catch with a `console.warn` — the rest of the
bind keeps applying and the page stays alive.

### Tests
- `src/__tests__/dynamic-component.test.ts` (new, 5 tests) — including a regression that asserts `@`/`:`/`cv-*` attrs do **not** end up as raw DOM attributes on the wrapper.
- `src/__tests__/cv-bind.test.ts` (new, 5 tests) — covers basic bind, removal, boolean coercion, falsy removal, and the invalid-name guard.
- 128 unit tests total (was 118), 10 ssr, 20 ssg.

### Audit findings (no action — for the record)
- `removeAttribute` paths use either fixed strings or names from already-parsed DOM attrs; `removeAttribute` is permissive across major browsers.
- `head.ts` `setAttribute` calls use known meta/link attribute names from the documented `HeadConfig` shape, plus `CSS.escape` on selector values.
- `:hyphenated-prop` `setAttribute` only fires for names containing hyphens (data-\*, aria-\*) — all valid HTML attribute names.
- No `setAttributeNS` / `getAttributeNS` in `src/`.
- No `outerHTML` or `innerHTML +=` patterns in `src/`.
- SVG / MathML namespaces are not processed by `walk()`.

---

## [0.4.4] — 2026-05-01

### Bug fixes

#### `<router-link>` crashes mount on Safari and Samsung Internet
**File:** `src/dom.ts` — `router-link` directive
Reported on iOS Safari and Samsung Internet (mobile): page renders blank with the unhandled rejection
`Failed to execute 'setAttribute' on 'Element': '@click' is not a valid attribute name.`
Cause: when the framework cloned `<router-link>` into the inner `<a>`, it forwarded **every** original attribute via `setAttribute(attr.name, attr.value)`. The HTML parser accepts framework directive names containing `@` and `:` (`@click`, `:aria-label`, etc.), but the `setAttribute()` DOM API in stricter browsers rejects them outright. Desktop Chrome / Firefox accepted these silently, so the bug went undetected.
**Fix:**
1. Build the inner `<a>` via `innerHTML` so the HTML parser handles framework attribute names (the parser-path is lenient).
2. Wrap the new anchor in a `DocumentFragment` before walking so directives **on** the anchor itself (`@click`, `:aria-label`, `:aria-expanded`, `cv-show`, etc.) are processed by the directive handlers — `walk()` only visits children of the passed node.

Affects every `<router-link>` that carries any framework directive — including the docs site sidebar where `@click="closeSidebar()"` was on every link.

Also added in the docs site (`site/src/main.js`):
- `<router-view />` → `<router-view></router-view>` (we documented self-closing custom elements as a no-go and were violating it ourselves).
- `.mount('#app').catch(...)` — surfaces mount failures as an inline error card instead of a blank page, so the next mobile-only crash is diagnosable without remote debugging.

---

## [0.4.3] — 2026-05-01

### Bug fixes

#### iOS Safari `InvalidCharacterError` during hydration of SSG'd custom components
**File:** `src/ssr.ts` — `ssgMountElement`
The 0.4.2 SSG-components feature rendered child-component templates into static HTML but did not strip the framework attributes the walk had already processed. Bindings like `:class="'language-' + lang"` and `cv-html`/`cv-ref` survived into the emitted HTML, which then meant client-side hydration re-walked them in the **wrong scope** (the page's parent state, where the inner component's local data — `lang`, `code`, etc. — does not exist). On iOS Safari this surfaced as an unhandled `InvalidCharacterError: The string contains invalid characters.` during initial mount; the page failed to render.
**Fix:** After walking the rendered template in `ssgMountElement`, traverse the subtree and remove every `:`-prefixed attribute and `cv-html` from the rendered output. Their resolved values are already baked into the static `class`/`style`/etc. attributes, so removal is lossless. `@event` listeners (e.g. the Copy button on `<code-block>`) are preserved so the client can still wire interactivity.

---

## [0.4.2] — 2026-05-01

### Features

#### SSG renders custom components into static HTML
**Files:** `src/ssr.ts`, `plugin/vite-plugin-courvux-ssg.js`
Before: `renderPage` walked templates without registering any components, so custom-component tags (`<code-block :code="install">`, `<my-card :title="x">`, etc.) were left intact in the emitted HTML — crawlers and `View Source` saw empty `<code-block>` tags with bound expressions still un-evaluated.
**Fix:**
- `renderPage(opts.components)` — accepts a global components map.
- New internal `ssgMountElement` resolves `:prop="expr"` against parent state (with `toRaw`), builds child state, runs `onBeforeMount` and `onMount` (so `useHead` capture and ref-using setup like Prism syntax highlighting fire), walks the child template recursively, and replaces the original element with the rendered output.
- SSG plugin gains a `components: object | () => Promise<object>` option mirroring `routes:` / `notFound:`. Same map registered on `createApp({ components })` is now used at build time.
- Default-slot content is captured and rendered. Named/scoped slots are not yet handled in SSG — they hydrate on the client.
**Result:** Bound props are evaluated and visible in `view-source`; full HTML for SEO/OG previews. The docs site now ships static HTML where every code-block is fully Prism-highlighted at build time.
**Known limitation:** Prism's HTML markup grammar has an artifact under happy-dom that duplicates the open-tag of `<!-- ... -->` comments inside a `language-html` block. Cosmetic only — surrounding code highlights correctly, and the underlying source code text in the DOM is intact. Other languages (bash, js, ts, json) are unaffected.

### Documentation

#### Skill paths converted to repo-relative
**File:** `skills/courvux/SKILL.md`
The bundled Claude Code skill referenced absolute paths under `/home/jesusuzcategui/...` for source, dist, site, examples, etc. After cloning the repo and copying the skill into `~/.claude/skills/courvux/`, those paths don't exist on the user's machine. Replaced with repo-relative paths (`src/`, `dist/index.js`, `site/`, etc.) plus a header noting the convention.

#### README size claim corrected (~10 KB → ~20 KB)
**File:** `README.md`
Header tagline, gzip badge, comparison table, and Building section all stated `~10 KB gzip`. The actual measured bundle is 20.7 KB gzip with everything (router, store, devtools, composables, useHead, SSR primitives) — the 10 KB figure dated from a much earlier core-only state. Updated to `~20 KB`, with the comparison-table cell labeled "(full)" so it's compared apples-to-apples against Alpine/Petite-Vue/Preact (~5–15 KB) which themselves include their respective runtimes.

### Performance fixes

#### DevTools overlay drag forced reflow (~64ms)
**File:** `src/overlay.ts`
Lighthouse `forced-reflow-insight` flagged two `getBoundingClientRect()` calls inside the panel-drag `mousedown` handler. Each call forces the browser to flush pending style/layout before returning dimensions; doing two back-to-back compounds the cost (~64ms in the audit).
**Fix:** Switch to `pointerdown` / `pointermove` with `setPointerCapture`. Capture the cursor and the panel's position once (`offsetLeft`/`offsetTop`) at drag start; subsequent `pointermove` writes only set `style.left/top` from cached values + cursor delta — no layout reads during drag. Listeners are scoped to the head element via pointer capture so they auto-clean on release/cancel.

---

## [0.4.1] — 2026-05-01

### Documentation

#### Claude Code skill bundled with the repo
**File:** `skills/courvux/SKILL.md`
The Claude Code / agent skill that ships condensed framework expertise (directives, components, router, store, useHead, SSG plugin, composables, devtools, common gotchas, project layout) is now versioned alongside the source. Drop into `~/.claude/skills/courvux/` to give a Claude Code or compatible-agent assistant up-to-date Courvux knowledge. Will be kept in sync on every release.

#### Site install snippets refreshed
**Files:** `site/src/pages/Installation.js`, `site/src/pages/Home.js`
- jsDelivr importmap example pinned to `@v0.4.1` (was `@0.2.0`).
- GitHub install snippets updated to demonstrate the recommended `#v<tag>` pin pattern alongside the rolling-`main` option.
- "no npm publish yet" wording replaced with positive guidance to pin a tag.

---

## [0.4.0] — 2026-05-01

### Bug fixes

#### `cv-if` / `cv-show` / interpolation never re-evaluate when their expression accesses a nested property (e.g. `items.length`)
**File:** `src/dom.ts` — `subscribeDeps`
The dep extractor matched the entire dotted path (`items.length`) as a single token and subscribed to that exact string. But the reactivity scope only notifies on the top-level state key — assigning a new array to `state.items` notifies `'items'`, never `'items.length'`. Subscribers registered on the dotted path therefore never fired, so any `cv-if`, `cv-show`, `cv-class`, interpolation, or `:attr` whose expression touched a nested property (`array.length`, `obj.someProp`, `user.name`, etc.) silently failed to react after the initial render.
**Fix:** reduce each token to its root segment before subscribing, except for `$store.<path>` which is handled per-leaf by `subscribeExpr`. Existing tests didn't catch this because they used bare-key expressions (`show`, `count`); a regression test for `items.length > 0` was added.

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

#### SSG plugin `router` option (router-aware static rendering)
**Files:** `plugin/vite-plugin-courvux-ssg.js`, `src/ssr.ts`
- Plugin: new `router: { mode, base }` option. The plugin sets `window.location.href` to the route being rendered (so components can read `window.location.pathname` synchronously) and forwards the router shape to `renderPage`.
- `renderPage`: new `options.router` argument. Injects a minimal router shape into the walk context so `<router-link>` emits the correct `href` (history-mode + base prefix) in statically generated HTML — fixing crawler-visible links that previously fell back to hash-mode in SSG output.

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
