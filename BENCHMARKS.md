# Benchmarks and comparisons

Honest, reproducible numbers. Where we cite competitor sizes we link the source. Cross-framework runtime benchmarks (mount time, re-render, RAM) are pending — see [Methodology](#methodology) for how to run them yourself.

## Bundle size — measured

Courvux ships a single ES module. Measured against `dist/index.js` from `0.4.2`:

| Metric | Value |
|---|---|
| Minified | **63.7 KB** |
| Minified + gzipped | **20.7 KB** |
| Minified + brotli | ~18 KB |

Reproduce:
```bash
pnpm build
wc -c dist/index.js                # minified bytes
gzip  -c dist/index.js | wc -c     # gzipped bytes
brotli -c dist/index.js | wc -c    # brotli bytes (if installed)
```

## Bundle size — comparison

| Framework | Min + gzip | Source |
|---|---|---|
| **Courvux 0.4.2** | **~20.7 KB** | This repo, measured above |
| Alpine.js 3.x | ~14 KB | [bundlephobia](https://bundlephobia.com/package/alpinejs) |
| Petite-Vue 0.4.x | ~6 KB | [bundlephobia](https://bundlephobia.com/package/petite-vue) |
| Preact 10.x (core) | ~4 KB | [bundlephobia](https://bundlephobia.com/package/preact) |
| Preact + signals + router | ~10 KB | [bundlephobia](https://bundlephobia.com/package/@preact/signals), preact-router |
| Vue 3.x runtime + reactivity | ~34 KB | [bundlephobia](https://bundlephobia.com/package/vue) |
| Svelte runtime (per-app cost) | ~2 KB | Compiler emits per-component code; runtime tiny |

What's in those 20.7 KB of Courvux that's not in the smaller ones:
- Built-in router with `:param`, nested routes, transitions, `keepAlive`, lazy routes, scroll behavior, and `base` prefix
- Built-in store with module support
- Built-in DevTools overlay (live state inspection + edit)
- Composables: `cvStorage`, `cvFetch`, `cvDebounce`, `cvThrottle`, `cvMediaQuery`, `cvListener`
- Event bus
- `useHead` for SEO
- Lifecycle hooks beyond mount (route guards, error boundaries)
- SSR primitives (`renderToString`, `renderPage`)
- Custom directives, plugins, transitions, slots (named + scoped), keyed `cv-for`

You don't pay separately for these via npm — they are tree-shakeable per import but the typical app uses most of them.

## Feature comparison

| | Courvux | Alpine | Petite-Vue | Preact | Vue 3 |
|---|---|---|---|---|---|
| Reactivity | Proxy | Proxy | Proxy | Signals | Proxy |
| Virtual DOM | ❌ | ❌ | ❌ | ✅ | ✅ |
| Components | ✅ | Limited | ✅ | ✅ | ✅ |
| Router | Built-in | ❌ | ❌ | External | External (vue-router) |
| Store | Built-in | ❌ | ❌ | External | External (pinia) |
| DevTools | Built-in overlay | ❌ | ❌ | External | External (browser ext.) |
| SSR | ✅ basic | ❌ | ❌ | ✅ | ✅ |
| SSG plugin | ✅ | ❌ | ❌ | External (preact-iso) | External (vite-ssg, nuxt) |
| Composables | Built-in | External | External | External | Built-in |
| Slots (named, scoped) | ✅ | ❌ | ✅ | children prop | ✅ |
| Vite plugin (templateUrl) | ✅ | — | — | ✅ (jsx) | ✅ (sfc) |

## Runtime performance — pending

Cross-framework benchmarks (mount time on 1k rows, re-render on 100-row toggle, idle RAM) are not yet published for Courvux. The right way to measure these is [`js-framework-benchmark`](https://github.com/krausest/js-framework-benchmark) which runs the same scenarios across every framework with consistent methodology.

What we can say honestly today:
- Courvux uses **direct DOM updates** with no virtual DOM — re-render of a single key only touches that key's subscribers.
- Reactive reads are tracked **per-key**, not per-component, so updating one field in a 1000-item list re-renders only that field, not the list.
- `cv-for` with `:key` does **keyed reconciliation** — array reorders move existing nodes instead of recreating.
- All this means we expect performance close to Alpine and Petite-Vue (both also direct-DOM Proxy frameworks). We do not expect to beat Svelte (compiled output is naturally faster on cold mount).

If you run Courvux through `js-framework-benchmark`, please share results — we'll publish them here with full methodology.

## Methodology

### Bundle size
1. `pnpm install && pnpm build`
2. `dist/index.js` is the single output. Measure raw bytes with `wc -c`, gzip with `gzip -c | wc -c`.
3. Competitor numbers above come from [bundlephobia](https://bundlephobia.com) (which gzip-compresses the published npm dist) on the dates the README was last updated. Re-check before quoting in production decisions.

### Runtime (when we get to it)
1. Clone [`js-framework-benchmark`](https://github.com/krausest/js-framework-benchmark).
2. Add a Courvux entry following the existing patterns.
3. Run `npm run bench-all` against the same Chromium version across implementations.
4. Report duration and DOM op counts (the benchmark separates them).

Be skeptical of any benchmark you can't reproduce. The link to the source is more important than the number.

---

> **A note on size.** ~20 KB is not the smallest possible reactive runtime. It is, however, all-in: router, store, DevTools, composables, head management, and SSR primitives. If you compare gzipped costs of Alpine + a third-party router + a third-party store + a head-management library + an SSG plugin, the sum is usually larger than 20 KB and the integration is your responsibility.
