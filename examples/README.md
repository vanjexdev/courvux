# Courvux examples

Self-contained example projects covering the most common Courvux patterns.

| # | Example | Build step | What it shows |
|---|---|---|---|
| [01](./01-todomvc/) | TodoMVC | None — open `index.html` | Components, computed, watchers, deep persistence to `localStorage`, keyed `cv-for`, dynamic `:cv-ref` |
| [02](./02-counter/) | Counter (Tauri-friendly) | None — open `index.html` | Minimal reactive counter you can drop into a Tauri / Electron / mobile webview shell |
| [03](./03-ssg-blog/) | SSG blog | `pnpm build` | `useHead`, `courvux/plugin/ssg`, history mode + `base`, sitemap, dynamic-route prerender |
| [04](./04-island-mode/) | Island mode | None — open `index.html` | `autoInit()` upgrading `cv-data` islands inside server-rendered HTML — no full SPA |

Each example has its own `README.md` with a quick start. Most run without a build step via an import map pointing at the local Courvux dist.

## Running examples without a bundler

The "no build step" examples include a small dev server you can use:

```bash
# Any of these work — pick one:
npx serve .
python3 -m http.server 5500
php -S localhost:5500
```

Then open the example's URL (e.g. `http://localhost:5500/examples/01-todomvc/`).
