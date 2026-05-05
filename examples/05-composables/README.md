# 05 — Composables

Three composables (`useCounter`, `useFlag`, `useClock`) merged into a single component via `useComposables`. Demonstrates the spread pattern, lifecycle hooks owned by composables, and `$addCleanup` from inside a composable's `onMount`.

## Run

```bash
npx serve .
```

Open http://localhost:3000/examples/05-composables/

## What it shows

- **`defineComposable`** — author a reusable bundle (data, methods, computed, watch, lifecycle hooks).
- **`useComposables(...)`** — combine multiple composables into a single config you can spread.
- **Lifecycle inside a composable** — `useClock` owns its own `onMount` + cleanup, transparent to the consumer.
- **First-writer wins** on data/methods key collisions; lifecycle hooks all run in insertion order.

## Code

| File | Purpose |
|---|---|
| `composables.js` | `useCounter`, `useFlag`, `useClock` factories |
| `main.js`        | Component spreading the merged composables |
| `index.html`     | Shell with inline styles + template |
