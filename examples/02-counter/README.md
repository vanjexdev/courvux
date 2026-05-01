# 02 — Counter (Tauri-friendly)

A minimal reactive counter app — small enough to drop into a [Tauri](https://tauri.app), [Electron](https://www.electronjs.org), Capacitor, or any other native-shell webview without changes.

## Run

```bash
npx serve .
```

Open http://localhost:3000/examples/02-counter/

## What it shows

- **Smallest possible Courvux app** — no router, no store, no components, just `data` + `methods` + `computed`.
- **Inline template** in HTML (using `cv-cloak` to avoid the flash of un-rendered braces).
- **Same API for desktop / mobile shells** — Courvux makes no assumptions about being inside a browser tab.

## Wrapping with Tauri

The whole example fits in a single static folder. From the Tauri side:

```bash
# Inside your Tauri project
cd src-tauri
# In tauri.conf.json:
#   "build": { "frontendDist": "../examples/02-counter" }
```

`window.__TAURI__` is available globally to the Courvux app, so you can call Rust commands from `methods`:

```js
methods: {
    async greet() {
        const { invoke } = window.__TAURI__.core;
        const msg = await invoke('greet', { name: 'world' });
        // store/use the response
    }
}
```

## Wrapping with Electron

Point `BrowserWindow.loadFile()` at `index.html` — the import map resolves relative to the HTML file, so no bundler config required.

## Wrapping with Capacitor

Configure `webDir` in `capacitor.config.ts` to point at this example's directory (or a build-step copy of it).

## Code

| File | Purpose |
|---|---|
| `index.html` | Shell with inline styles + template |
| `main.js`    | Counter logic (data, computed, methods) |
