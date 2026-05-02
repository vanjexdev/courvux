# Release checklist

Mandatory steps before tagging any `vX.Y.Z`. Skip none. Discipline now beats post-release horror later.

---

## 1. Tests — all suites green

```bash
pnpm test                # vitest unit tests
pnpm test:ssr            # ssr-test.mjs
pnpm test:ssg            # ssg-test.mjs
pnpm --dir site build    # site SSG must succeed (proves end-to-end pipeline works)
pnpm test:e2e --project=chromium    # Playwright on Chromium
pnpm test:e2e --project=firefox     # Playwright on Firefox
```

If `test:e2e:webkit` runs locally (depends on host OS — see [`e2e/README.md`](./e2e/README.md) for Linux setup), include it. Otherwise WebKit coverage comes from the manual device check below.

---

## 2. Real-device manual smoke

The Playwright suite covers Chromium + Firefox automatically. WebKit-class browsers must be hit on real devices each release (see [`README.md` Browser support](./README.md#browser-support) for the supported matrix):

- [ ] Chrome desktop (any recent) — open https://vanjexdev.github.io/courvux/, navigate every sidebar route, open `/demo` and add/toggle/delete a todo.
- [ ] Firefox desktop — same flow.
- [ ] Safari on iOS (real iPhone or BrowserStack) — same flow + verify the floating sidebar toggle button shows `☰` (not raw `{{ }}`). This is the regression check for the 0.4.4 class of bug.
- [ ] Samsung Internet on Android (real device or BrowserStack) — same flow.

---

## 3. Version + changelog

Every `vX.Y.Z` requires consistent version refs. Quick audit:

```bash
grep -rn "0\.X\.Y" \
    package.json README.md BENCHMARKS.md \
    skills/courvux/SKILL.md \
    site/src/main.js site/src/pages/Home.js site/src/pages/Installation.js
```

Bump:

- [ ] `package.json` — `"version": "X.Y.Z"`
- [ ] `README.md` — version badge, body line, install pin (`#vX.Y.Z`), Top-level exports header
- [ ] `BENCHMARKS.md` — measurement reference line(s)
- [ ] `skills/courvux/SKILL.md` — `Current version` table cell + `Top-level exports (vX.Y.Z)` header. Mirror to `~/.claude/skills/courvux/SKILL.md` if used as personal Claude Code skill.
- [ ] `site/src/main.js` — sidebar version label + aria-label
- [ ] `site/src/pages/Home.js` — hero badge + install snippet
- [ ] `site/src/pages/Installation.js` — install snippet + jsDelivr CDN pin
- [ ] `CHANGELOG.md` — new `## [X.Y.Z] — YYYY-MM-DD` section above the previous one. List every fix / feature / breaking change with file references.

---

## 4. Build artifacts up to date

- [ ] `pnpm build` from repo root — regenerates `dist/index.js` + `dist/test-utils.js` + `.d.ts`.
- [ ] `pnpm --dir site build` — regenerates `docs/` for GitHub Pages.

Both should appear in `git status` after running.

---

## 5. Branch hygiene

- [ ] Work happened on a dedicated branch (`fix/`, `feat/`, `chore/`, `docs/`).
- [ ] Branch was merged into `staging` with `--no-ff` (preserves the merge commit so history shows the unit of work).
- [ ] `staging` was merged into `main` with `--no-ff` after explicit user approval.
- [ ] No direct commits on `main`.

---

## 6. Tag + GitHub release

```bash
git tag vX.Y.Z
git push origin main
git push origin vX.Y.Z
gh release create vX.Y.Z --generate-notes
```

The GitHub release notes auto-generate from commit messages; double-check they mention the `[X.Y.Z]` CHANGELOG section.

---

## 7. NPM publish — 🔒 USER-GATED

**Do not run `npm publish` autonomously.** Even when every checklist item is green, the publish step is gated by an explicit user decision per release. The framework can sit fully tagged on GitHub indefinitely without going to npm; that's intentional while we're pre-1.0 and validating with the SSG site + the upcoming Tauri app.

When the user does say go:

- [ ] `npm pack --dry-run` — verify the tarball only contains `dist/`, `plugin/`, `README.md`, `LICENSE`, `package.json`. No `src/`, `site/`, `docs/`, `e2e/`, `node_modules/`, dotfiles, etc.
- [ ] Try a fresh install in a scratch directory: `npm pack` → `npm install ../courvux-X.Y.Z.tgz` in a new project, run a tiny `createApp` smoke test.
- [ ] `npm publish` (you'll need npm 2FA configured).
- [ ] Verify on `https://www.npmjs.com/package/courvux` that the published version + files match.
- [ ] Update site / README install snippets from `github:vanjexdev/courvux#vX.Y.Z` to plain `pnpm add courvux@X.Y.Z` (or whatever the user prefers).

---

## Why this checklist exists

Every Courvux bug shipped to production so far (0.4.4 router-link, 0.4.5 component-is, 0.4.6 trailing-slash) **would have been caught earlier** by either (a) the cross-browser manual smoke or (b) the Playwright suite. After-the-fact patches are fine, but they cost a release each. Going through this list before tagging shifts that cost left.
