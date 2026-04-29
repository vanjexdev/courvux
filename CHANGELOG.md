# Changelog

All notable changes to Courvux are documented here.
Format: `[version] — date — description`

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
