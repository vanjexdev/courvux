# E2E test suite

Cross-browser regression tests focused on **WebKit** (Safari / iOS / Samsung
Internet share the strict `setAttribute` path that surfaced the 0.4.4 +
0.4.5 bugs). The suite runs against the built docs site
(`site/` → `docs/`) so it exercises the exact code that production users see.

## Setup (one-time)

```bash
# 1. Install Playwright browsers (already a devDep)
pnpm exec playwright install webkit chromium firefox

# 2. Install OS-level deps Playwright's WebKit needs (Linux only)
sudo pnpm exec playwright install-deps
# ...or, on Ubuntu/Debian:
sudo apt-get install libicu74 libjpeg-turbo8 libwoff1 \
                     libgstreamer-plugins-bad1.0-0 libwebpdemux2 \
                     libavif16 libharfbuzz-icu0 libenchant-2-2 libsecret-1-0
```

The browser binaries live under `~/.cache/ms-playwright/` and are shared
across projects.

## Running

```bash
# Build docs site first (the suite serves docs/ via site preview)
pnpm --dir site build

# All browsers
pnpm test:e2e

# Single browser (fastest signal for the WebKit class of bug)
pnpm test:e2e:webkit
pnpm test:e2e:mobile         # iPhone 14 viewport on WebKit

# Interactive UI mode
pnpm test:e2e:ui
```

Playwright auto-spawns `pnpm --dir site preview` on port 4173 (configured
in `playwright.config.ts > webServer`). If you want to keep the preview
running between test runs, set `reuseExistingServer: true` is already on
for non-CI runs.

## What's covered

Each test asserts there are **zero unhandled errors** during mount —
that's the silent-failure pattern that hid the 0.4.4 Safari crash.

| File | Covers |
|---|---|
| `e2e/site.spec.ts` | Home mount + SSG-rendered code blocks (regression for 0.4.2), client-side routing with framework-attr `<router-link>` (regression for 0.4.4), direct deep-link load + hydration, 404 page, TodoMVC under `cv-for` + `cv-model` state changes, mobile sidebar toggle button rendering (`{{ }}` interpolation in mobile-only viewport), sitemap / robots / 404 static asset shape. |

To add a regression test for a future bug: keep the pattern of asserting
`errors === []` after the scenario — that catches the `Unhandled Promise
Rejection` class of bug that Playwright's `pageerror` event surfaces.

## CI integration

Not wired yet (roadmap Fase 5.2 — Repo polish). The intent is to add a
GitHub Actions matrix that runs `pnpm test:e2e` against webkit + chromium
+ firefox on every PR. Until then, run locally before tagging a release.
