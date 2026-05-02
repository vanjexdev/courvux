# E2E test suite

Cross-browser regression tests focused on **WebKit** (Safari / iOS / Samsung
Internet share the strict `setAttribute` path that surfaced the 0.4.4 +
0.4.5 bugs). The suite runs against the built docs site
(`site/` → `docs/`) so it exercises the exact code that production users see.

## Setup (one-time)

### 1. Install Playwright browsers (already a devDep)

```bash
pnpm exec playwright install webkit chromium firefox
```

Browser binaries live under `~/.cache/ms-playwright/` and are shared
across projects.

### 2. Install OS-level deps WebKit needs (Linux only)

#### Ubuntu / Debian

```bash
sudo pnpm exec playwright install-deps
# ...or, manually:
sudo apt-get install libicu74 libjpeg-turbo8 libwoff1 \
                     libgstreamer-plugins-bad1.0-0 libwebpdemux2 \
                     libavif16 libharfbuzz-icu0 libenchant-2-2 libsecret-1-0
```

#### Fedora

`playwright install-deps` only knows Debian/Ubuntu, so install manually:

```bash
sudo dnf install -y libicu libjpeg-turbo woff2 \
                    gstreamer1-plugins-bad-free \
                    libwebp libavif harfbuzz-icu \
                    enchant2 libsecret
```

Two extra steps Fedora needs:

1. **Skip Playwright's host validator** — it checks via `dpkg` and always
   fails on non-Debian distros even when the libs are installed:
   ```bash
   export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
   ```
   (consider adding to your shell profile)

2. **ICU version mismatch** — Playwright's WebKit links against
   `libicudata.so.74` (Ubuntu 24.04) but Fedora ships ICU 76+. Symlink:
   ```bash
   sudo ln -sf /usr/lib64/libicudata.so.76 /usr/lib64/libicudata.so.74
   sudo ln -sf /usr/lib64/libicui18n.so.76 /usr/lib64/libicui18n.so.74
   sudo ln -sf /usr/lib64/libicuuc.so.76   /usr/lib64/libicuuc.so.74
   sudo ln -sf /usr/lib64/libicuio.so.76   /usr/lib64/libicuio.so.74
   ```
   (replace `.76` with whatever `ls /usr/lib64/libicu*.so.*` reports)

ICU's ABI is generally stable across major versions, so symlinks work
in practice. If WebKit complains about another `lib*.so.NN`, find it
with `ls /usr/lib64/lib<name>*` and apply the same symlink pattern.

#### Docker fallback (any Linux)

If juggling system libs is annoying, use Playwright's official image:

```bash
docker run --rm --ipc=host \
  -v $(pwd):/work -w /work \
  mcr.microsoft.com/playwright:v1.59.1-noble \
  bash -c "pnpm install --frozen-lockfile && pnpm test:e2e:webkit"
```

Heavier (~1 GB image) but no host pollution.

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
