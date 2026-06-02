# Changelog

All notable changes to Courvux are documented here.
Format: `[version] — date — description`

---

## [7.1.1] — 2026-06-02

Patch — fixes iframe mounting edge cases and tightens `cv-else` chain
handling.

### Bug fixes

#### Apps mounted in iframe-like `about:blank` contexts could render empty
**Files:** `src/index.ts`, `src/router.ts`, `src/dom.ts`
- Guard `document.baseURI` resolution so `about:blank` / `about:srcdoc`
  no longer throw during mount.
- Normalize non-slash history pathnames to `/`, so a history-mode
  router mounted inside an iframe can still match the root route.
- Apply the same path normalization to `router-link` active-state checks.

#### `cv-else` could render alongside a true `cv-if`
**File:** `src/dom.ts`
- Treat HTML comments between `cv-if`, `cv-else-if`, and `cv-else` as
  transparent so conditional chains stay linked.
- Warn when `cv-else` / `cv-else-if` reaches the normal walk path without
  an adjacent chain.

### Tests
- `src/__tests__/iframe-history.test.ts` — new coverage for
  `about:blank` base URLs and history-mode root matching.
- `src/__tests__/cv-if.test.ts` — regression coverage for comment-separated
  `cv-else` chains and orphan `cv-else` warnings.

---

## [0.7.1] — 2026-05-05

Patch — `cv-if` no longer destroys and rebuilds the active branch when
its dependencies fire but the truthy branch hasn't changed. Inputs
inside `cv-if` / `cv-else` keep their focus and IME state across
unrelated re-renders.

### Bug fixes

#### `cv-if` rebuilt the same active branch on every dep change → input focus loss
**File:** `src/dom.ts` — cv-if `render()`
The previous implementation always called `activeClone.parentNode.removeChild(activeClone)` and re-cloned the matched branch's template at the start of every render pass, even when the same branch was still the truthy one. Templates inside that branch update through their own bindings (interpolations, attribute subscriptions, inner cv-for keyed reconciliation), so the outer remount was wasted work — and worse, it destroyed any `<input>` / `<textarea>` mid-edit, dropping focus and any in-progress IME composition.

Surfaced by the `courvux-tauri-example` notepad: every keystroke mutated `selected.updatedAt` → `notes` notify → computed `selected` recomputed → notify on `selected` → cv-if re-evaluated `!selected`, which stayed false, but the cv-else editor was still re-cloned. Title and body inputs lost focus after one character.

**Fix:** track the active branch index. On re-render, resolve which branch matches now; if the index is unchanged AND a clone is already mounted, leave the DOM untouched and return. Branch flips (truthy → falsy or one cv-else-if → another) still rebuild as before. Interpolations and attribute bindings inside the branch stay reactive through their own subscriptions, so visible content keeps updating without the remount.

### Tests
- `src/__tests__/cv-if.test.ts` — new regression: mutate a dep of the cv-if condition without flipping branches, assert the same DOM node is reused; flip the branch, assert a new node is rendered.
- 172 unit (was 171), 10 ssr, 20 ssg.
- Bundle: 67.0 KB min, 21.7 KB gzip (+0.1 / +0.0 from the index-tracking).

---

## [0.7.0] — 2026-05-05

Minor — first release that lets apps drop `script-src 'unsafe-eval'` from
their CSP. Pure addition: every existing app keeps working unchanged
(same templates, same evaluator, same CSP requirements). Apps that opt
into the new Vite plugin get expression compilation moved to build time
and ship under strict CSP.

### Added

#### `vite-plugin-courvux-precompile` — build-time expression compiler
**Files:** `plugin/vite-plugin-courvux-precompile.js`, runtime hooks in
`src/dom.ts` and `src/index.ts`.

Pairs with the new [`courvux-precompiler`](https://github.com/vanjexdev/courvux-precompiler)
crate (Rust → WebAssembly) to translate every Courvux template
expression — `{{ count + 1 }}`, `:class="{ active: isOn }"`,
`@click="save(id)"`, `cv-model="form.email"`, arrow callbacks like
`todos.filter(t => !t.done).length`, multi-statement event handlers,
ternary, optional chaining — into JavaScript arrow functions that ship
in the bundle. The runtime checks a per-state `WeakMap` registry before
falling back to `new Function`, so apps fully covered by the plugin
never trigger the runtime evaluator and never need `'unsafe-eval'`.

Two opt-in entry points, both backed by the same compiler:

```js
// 1. Inline string templates inside .js / .ts (zero source change):
export default {
    template: \`<button @click="count++">{{ count }}</button>\`,
    data: { count: 0 },
};

// 2. HTML files imported with the ?courvux suffix:
import compiled from './my-component.html?courvux';
export default {
    ...compiled,                // spreads { template, exprs }
    data: { count: 0 },
};
```

Plugin behavior is conservative — anything more dynamic than a static
literal (variable reference, ternary, function call, tagged template) is
silently skipped, the runtime fallback handles those, and the build-end
report logs which templates fell back so authors can refactor for full
CSP coverage.

#### Runtime registry + lazy eval probe
**Files:** `src/dom.ts`, `src/index.ts`, `src/types.ts`.
- New export `attachCompiledExprs(state, exprs)` registers a precompiled
  expression map on a state object via `WeakMap`. Called automatically
  by `mount()` when the component config carries an `exprs` field.
- New export `inheritCompiledExprs(child, parent)` forwards the registry
  through every scope boundary that creates a new state proxy
  (`makeItemState` for non-keyed `cv-for`, the `mergedItemState` Proxy
  for keyed `cv-for`, `cv-data` inline scopes). Without this, expressions
  inside iterations would miss the registry and trip the fallback.
- `evalSupported` is now a lazy probe (`isEvalSupported()`) instead of
  a module-init constant. Apps fully covered by the precompiler never
  run the probe and ship with a clean console under strict CSP — the
  previous implementation triggered a CSP violation just by loading
  Courvux.
- The fallback warning now points at `vite-plugin-courvux-precompile` so
  devs hitting the limited evaluator know the recommended fix.

#### Strict CSP demo + docs
- `site/index.html` dropped `'unsafe-eval'` from its `script-src`. The
  whole docs site now runs under `script-src 'self'`, validating the
  end-to-end story against 25 components and 258 expressions.
- New `/csp` page on the docs site walks through setup, the supported
  expression subset, the build-end report, source-maps story, and
  performance.
- README, design-decisions, and FAQ pages link to it.

### Tests
- `src/__tests__/precompile-registry.test.ts` — 7 runtime tests covering
  evaluate fast path, attribute bindings, handler mutation, fallback for
  unregistered expressions, multi-call merge, and registry inheritance
  through `cv-for` and `cv-data` scopes.
- `src/__tests__/precompile-plugin.test.ts` — 9 plugin tests covering
  expression extraction (interpolations, attributes including `>` inside
  values, event handlers, `cv-for` collection-only extraction, every
  `cv-*` directive, non-expression attrs ignored), and round-trip
  compilation through the WASM bindings (dedupe, error envelope, emitted
  source evaluates correctly against a mock state).
- 171 unit (was 155), 10 ssr, 20 ssg.
- Bundle: 66.9 KB min, 21.7 KB gzip (+0.7 KB / +0.2 KB from registry +
  inherit + lazy probe scaffolding).

### Dependencies
- Adds `courvux-precompiler` (github:vanjexdev/courvux-precompiler) as a
  runtime dep so the WASM bindings ship with the package.
- Adds `acorn` and `magic-string` for the inline-template AST walk.
  Vite already pulls these as transitives; promoting to direct deps
  guarantees plugin users have them at the version we tested against.

---

## [0.6.0] — 2026-05-05

Minor — flips the default for `cv-html` from raw to sanitized. **Breaking
change** for any binding that intentionally rendered raw HTML; everything
else is unaffected.

### ⚠️ BREAKING — `cv-html` sanitizes by default

**File:** `src/dom.ts`
Pre-0.6 behavior: bare `cv-html="expr"` set `innerHTML` raw, and you
opted INTO sanitization with `cv-html.sanitize`. That meant every
careless use of the directive — interpolating user-provided markup into
a page — was an XSS by default. Inverted: bare `cv-html` now strips
`<script>`, `on*=` event handlers, `javascript:` URLs, and a
documented set of dangerous tags before assigning. Opt OUT with the new
`.raw` modifier when the markup is something you authored (Markdown
rendered server-side, hand-curated copy, etc.).

**Migration:**
```bash
# Find every cv-html binding in the project:
grep -rn 'cv-html' src/

# For each one, ask: "is this markup from a trusted source?"
#   - YES → switch to cv-html.raw (preserves old behavior)
#   - NO  → leave as cv-html (now safe by default)
```

The pre-0.6 `cv-html.sanitize` modifier still works as a no-op so
existing templates keep behaving correctly without edits — sanitization
is just the default now. Removing the redundant `.sanitize` is a
cleanup, not a fix.

Internal example update: `examples/03-ssg-blog/src/pages/Post.js`
switches its post-body binding to `cv-html.raw` since the post bodies
are hand-authored HTML in `posts.js`.

### Tests
- `src/__tests__/cv-html.test.ts` (new, 7 tests): bare cv-html sanitizes
  safe markup, strips `<script>`, strips `on*=`, strips `javascript:`,
  `cv-html.raw` preserves dangerous markup, `cv-html.sanitize`
  back-compat path still sanitizes, reactive update flow.
- 155 unit (was 148), 10 ssr, 20 ssg.
- Bundle: 66.2 KB min, 21.5 KB gzip (no measurable change).

### Docs
- `/template` cv-html section reframes default as "sanitized" with a
  callout about the breaking change and the legacy `.sanitize`
  back-compat.
- README cv-html section rewritten with same framing.
- `/migrating-from-vue` and `/migrating-from-alpine` rows updated to
  point at `cv-html.raw` for the parity behavior.
- `skills/courvux/SKILL.md` quick-ref row updated.

---

## [0.5.3] — 2026-05-05

Patch — finishes the `cv-model` write-side fix from 0.5.2.

### Bug fixes

#### `cv-model` bracket notation broke when the dynamic key came from a `cv-for` iteration variable
**File:** `src/dom.ts` — `setStateValue`
The 0.5.2 implementation compiled `with(__s__){ (${expr}) = __v__ }`. That
worked at top level but silently wrote `undefined` whenever the `state`
passed in was the per-iteration `mergedItemState` proxy used by `cv-for`,
because the proxy's catch-all `has` trap (returns `true` for every
identifier so reads can fall through to the parent state) ALSO captured the
function's `__v__` parameter. `__v__` resolved to `state.__v__` inside the
`with`, which is `undefined`. Surfaced by the kanban "Add a card" inputs
once 0.5.2 enabled the read+write asymmetry: button enabled because the
input's typed character briefly hit state, then the next render read it
back as `undefined` and cleared the field.
**Fix:** stop using `with(...)` for the assignment. Split the expression
into a parent expression and a final key (`draft[col.key]` →
`{ parent: 'draft', keyExpr: 'col.key' }`), evaluate both via the existing
`evaluate()` (which uses `with(state)` only for reads, where the value
parameter doesn't exist), then assign `obj[key] = value` in plain scope —
no with, no shadowing. The split is cached per expression.

### Tests
- `src/__tests__/cv-model.test.ts` — new regression covering bracket
  notation keyed by a `cv-for` iteration variable (two inputs in two
  iterations, each writes back to the right key).
- 148 unit (was 147), 10 ssr, 20 ssg.
- Bundle: 66.2 KB min, 21.5 KB gzip (+0.4 KB / +0.2 KB from the lvalue
  splitter + cache).

---

## [0.5.2] — 2026-05-05

Patch — `cv-model` write side now matches the read side's expressivity.

### Bug fixes

#### `cv-model` silently dropped updates with bracket notation
**File:** `src/dom.ts` — `setStateValue`
The read side of `cv-model` (and any other place that called `evaluate`)
already accepted any assignable expression — `form[key]`, `draft[col.key]`,
deep dot chains — because it goes through the `new Function` evaluator.
The write side, `setStateValue`, parsed the expression as a literal dot
path: `expr.split('.')`. So `cv-model="draft[col.key]"` rendered the
correct value but every keystroke was silently swallowed: input "live but
disconnected." Surfaced by the kanban example's per-column "Add a card"
form (one input per iteration of `cv-for="col in columns"`).
**Fix:** `setStateValue` now compiles a `new Function('__s__', '__v__',
\`with(__s__){ (${expr}) = __v__ }\`)` writer (cached per expression) when
the runtime supports `eval`, identical to how `evaluate` reads. The
existing dot-path code stays as the CSP-strict fallback — that path was
already the only thing strict-CSP apps had, so nothing regresses.

### Tests
- `src/__tests__/cv-model.test.ts` — three new regressions: bracket
  notation with literal key, bracket notation with dynamic key from
  state, deep dot path.
- 147 unit (was 144), 10 ssr, 20 ssg.
- Bundle: 65.8 KB min, 21.3 KB gzip (+0.2 KB / +0.0 KB from the cache
  + writer compile).

---

## [0.5.1] — 2026-05-05

Patch — race-condition fix in `cv-for` keyed reconciliation, exposed by the new
kanban example, plus the docs that surround the same gotcha.

### Bug fixes

#### `cv-for :key` could orphan a clone in the DOM under rapid mutations
**File:** `src/dom.ts`
The keyed `cv-for` `render()` is async — it `await`s `walk()` for every newly
cloned row. Three rapid mutations to the same array (the kanban drop handler:
property change → `splice` → `push`) fire three `notifyKey('items')` calls,
each scheduling its own `render()`. With nothing serializing them, a later
render could enter the diff loop while an earlier one was still suspended at
`await walk` for the same new key — both ended up creating a clone, both got
attached to the DOM, but only one was tracked in `keyNodeMap`. The orphan
stayed visible as a duplicated row.
**Fix:** wrap the keyed `render()` in a per-instance serializer (`renderInflight`
+ `renderPending`). If a new notification arrives while a render is in flight,
mark a single follow-up as pending; after the current render finishes, drain
the pending flag with one extra render against the latest state. Many
coalesced notifications collapse to at most one extra render — which is the
whole point.

### Tests
- `src/__tests__/cv-for-keyed.test.ts` — new regression covering three rapid
  mutations to the same keyed array in a single tick.
- 144 unit (was 143), 10 ssr, 20 ssg.
- Bundle: 65.6 KB min, 21.3 KB gzip (+0.2 KB / +0.1 KB from the serializer).

### Docs
- `/reactivity` adds a "Common gotchas" section covering the proxy-identity
  pitfall (`findIndex` vs `indexOf`) and the rapid-mutation pattern (when
  `$batch` is the right tool).
- `/faq` adds the "drag-and-drop deletes the wrong row" question pointing at
  the same fix.

### Examples
- `examples/06-realworld-kanban/` keeps `$batch` in its drop handlers, but
  now framed as a performance choice (one re-render instead of three) rather
  than a correctness workaround.

---

## [0.5.0] — 2026-05-05

Roadmap **Fase 3** — composable authoring API. First minor bump since the 0.4
line; no breaking changes.

### Added

#### `defineComposable(factory)` — author reusable bundles of component logic
**File:** `src/composables.ts`
A composable is a factory that returns a partial component config (`data`,
`methods`, `computed`, `watch`, lifecycle hooks). `defineComposable` is the
identity helper used to mark intent and improve TypeScript inference — at
runtime it returns the factory unchanged. Spread the result into a component
to share the logic without coupling to the global store:

```js
import { defineComposable } from 'courvux';

export const useCounter = defineComposable((initial = 0) => ({
    data: { count: initial },
    methods: {
        inc() { this.count++; },
        reset() { this.count = initial; },
    },
}));

export default {
    ...useCounter(10),
    template: `<button @click="inc()">{{ count }}</button>`,
};
```

#### `useComposables(...composables)` — combine several into one config
**File:** `src/composables.ts`
Merges multiple composable configs (or plain config-like objects) into a single
spreadable config.
- **First-writer wins** for `data`, `methods`, `computed`, `watch` keys;
  collisions log a `console.warn`.
- **Lifecycle hooks** (`onBeforeMount`, `onMount`, `onBeforeUpdate`,
  `onUpdated`, `onBeforeUnmount`, `onDestroy`) all run, in insertion order.
- Empty buckets are dropped from the merged result so the spread does not
  shadow component-level keys.

#### Site self-hosts JetBrains Mono + adds CSP meta
**Files:** `site/index.html`, `site/src/style.css`, `site/package.json`
- JetBrains Mono now ships from `@fontsource/jetbrains-mono` (latin subset,
  weights 400/500/600/700 + 400 italic). No requests to `fonts.googleapis.com`
  / `fonts.gstatic.com` — privacy + latency win, SRI possible going forward.
- Added a `Content-Security-Policy` `<meta>` tag. Strict `default-src 'self'`
  with `'unsafe-eval'` retained temporarily for the runtime template
  evaluator (slated for removal once the build-time precompiler ships).
  Restricts `img/font/connect/object/base/form-action/frame-src`.
- Dropped the three redundant `<link>` tags pointing at the same Google Fonts
  URL (`preconnect` / `preload` / `stylesheet+onload` + `<noscript>` fallback)
  and the inline `onload="this.media='all'..."` handler — the only `on*=`
  inline handler in the document, blocking any CSP without
  `script-src 'unsafe-inline'`.

### Tests
- `src/__tests__/define-composable.test.ts` (new, 9 tests): identity
  helper, single-spread reactivity, hook merge order, collision warn,
  nested composables, computed + watch buckets.
- 143 unit (was 134), 10 ssr, 20 ssg.
- Bundle: 65.4 KB min, 21.2 KB gzip.

### Examples
- `examples/05-composables/` — `useCounter` + `useFlag` + `useClock` spread
  into a single component, demonstrates lifecycle inside a composable with
  `$addCleanup`.

---

## [0.4.7] — 2026-05-02

### Bug fixes

#### `cv-model` did not react to programmatic mutations of nested-path bindings
**File:** `src/dom.ts`
Inputs bound with `cv-model="form.first_name"` (and other dotted paths) silently failed to update when their state was mutated from a method — e.g. hydrating a drawer form with `this.form.first_name = data.first_name`. State logged the new value but the input value stayed empty.
**Cause:** `cv-model` registered listeners via `subscribeExpr`, which uses the expression literally as the listener key (`'form.first_name'`). Reactivity only fires `notifyKey('form')` when nested properties of `form` mutate — listeners under the dotted-path key are orphaned. Same class of bug that the 0.4.0 `subscribeDeps` fix solved for `cv-if` / interpolation, but `cv-model` wasn't on that path.
**Fix:** all four `cv-model` paths (text input, checkbox, radio, contenteditable) now subscribe through `subscribeDeps`, which reduces dotted tokens to their root key and lets `notifyKey('form')` reach the listener correctly.

Same fix applied to the `<router-link :to="...">` subscription, which had the identical pattern. `:to="'/user/' + user.id"` now reacts to `state.user.id` mutations.

### Tests
- `src/__tests__/cv-model-nested.test.ts` (new, 3 tests): text input, checkbox, and select bound to nested paths each verify programmatic state mutation updates the DOM.
- 134 unit (was 131), 10 ssr, 20 ssg, 10 e2e on Chromium / Firefox.
- Bundle: 64.6 KB min.

---

## [0.4.6] — 2026-05-02

### Bug fixes

#### Router did not match SSG'd `<route>/index.html` URLs (trailing slash)
**File:** `src/router.ts` — `setupRouterView`
SSG output emits each page at `<route>/index.html` so direct URL hits and crawlers land at `/foo/` (with trailing slash), but route configs are written as `{ path: '/foo' }`. The previous `matchRoute` did an exact `r.path === path` comparison, so every direct deep-link to a SSG'd page fell through to the wildcard `NotFound` component on first load. Client-side navigation worked by accident because `navigate('/foo')` writes the configured form to history.
**Fix:** `getCurrentPath` normalizes the pathname through a `normalizePath` helper that drops a single trailing `/` on any non-root path before `matchRoute` runs. `/` itself is preserved.
**Surfaced by:** the new Playwright suite (Fase 1.2). Production users were hitting this every time they refreshed a page or shared a link.

### Internal — testing infrastructure

#### Playwright E2E suite (roadmap Fase 1.2)
**Files:** `playwright.config.ts`, `e2e/site.spec.ts`, `e2e/README.md`
Cross-browser regression suite focused on the WebKit class of bugs that surfaced in 0.4.4 / 0.4.5. Runs against the built docs site, so it exercises the same code production users see. Each test asserts `pageerror` / `console.error` arrays are empty — the silent-failure pattern that hid the original Safari crash.

- 4 projects: `webkit`, `chromium`, `firefox`, `mobile-safari` (iPhone 14 viewport).
- 10 scenarios: home mount, SSG-rendered code blocks (regression for 0.4.2), sidebar `<router-link>` with `@click` (regression for 0.4.4), direct deep-link hydration, wildcard NotFound, TodoMVC under cv-for + cv-model state changes, mobile sidebar toggle interpolation, sitemap / robots / 404.
- New scripts: `pnpm test:e2e`, `pnpm test:e2e:webkit`, `pnpm test:e2e:mobile`, `pnpm test:e2e:ui`.
- WebServer auto-spawn of `pnpm --dir site preview` on port 4173.
- WebKit on Linux requires OS-level libs; the `e2e/README.md` documents the install path on Ubuntu / Fedora plus the `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1` workaround for non-Debian distros where Playwright's `dpkg`-based validator misreports.

### Tests
- 131 unit (was 128 — +3 trailing-slash tests).
- 10 SSR + 20 SSG unchanged.
- 10 E2E on Chromium ✅, 10 on Firefox ✅. WebKit pending OS deps locally; CI integration deferred to Fase 5.2.
- Bundle: 64.6 KB min.

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
