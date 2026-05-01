# 04 — Island mode

A plain HTML page sprinkled with `cv-data` attributes. Each one becomes its own reactive island, upgraded by `autoInit()` on `DOMContentLoaded`. There is no SPA shell, no router, and no single mount root.

This is the right pattern when:

- You have a **server-rendered** site (Rails, Django, Laravel, plain PHP, static-site generator) and want to add interactivity to specific blocks without rewriting the whole page.
- You want **multiple independent reactive widgets** on a single page that don't share state.
- You want the **smallest possible JS footprint** — only the islands cost reactivity overhead; the surrounding HTML costs zero.

## Run

```bash
npx serve .
```

Open http://localhost:3000/examples/04-island-mode/

## What it shows

| Island | Pattern |
|---|---|
| **Counter** | Inline `data` object: `cv-data="{ count: 0 }"` |
| **Toggle**  | Inline data + `cv-show` for visibility |
| **Reverse** | Inline data + computed-style expression in interpolation |
| **Counter (registered)** | `cv-data="counter"` references a component registered in `autoInit({ components })` |

## Code

| File | Purpose |
|---|---|
| `index.html` | Plain HTML with four `cv-data` attributes |
| `main.js`    | Single `autoInit()` call. Registers a named component for the last island. |

## Notes

- `autoInit` only walks **top-level** `[cv-data]` elements. Nested ones are handled by their outer scope's walk, not re-mounted.
- Inline expressions inside `cv-data` are full JS — methods can be defined inline:
  ```html
  <div cv-data="{ open: false, toggle() { this.open = !this.open } }">
      <button @click="toggle()">{{ open ? '−' : '+' }}</button>
  </div>
  ```
- Want to add directives or globals? Pass them through:
  ```js
  autoInit({
      directives: { focus: el => el.focus() },
      globalProperties: { siteName: 'My Site' },
  });
  ```
