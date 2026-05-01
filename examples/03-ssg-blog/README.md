# 03 — SSG blog

A small static blog built with `courvux/plugin/ssg`. Each post is pre-rendered to its own `dist/posts/<slug>/index.html` at build time, with the correct `<title>`, meta description, Open Graph tags, and canonical link.

## Run

You have three options. The first two demonstrate the SSG pipeline; the third is a no-Vite fallback that runs the SPA only.

### Option A — `pnpm dev` (recommended for development)

From inside this directory:

```bash
pnpm install      # symlinks courvux from the parent repo
pnpm dev          # Vite dev server with HMR
```

Open the printed URL. Routes render dynamically; SSG does not run in dev mode.

### Option B — `pnpm build && pnpm preview` (production simulation)

```bash
pnpm install
pnpm build        # vite build + courvuxSsg → dist/<route>/index.html for every route
pnpm preview      # serve the built dist/ locally
```

This is what GitHub Pages / Netlify / Cloudflare Pages will see: real per-route HTML files, sitemap, robots, 404.html. Open the printed URL and inspect `view-source:` on any route — title, description, OG, canonical are inlined.

### Option C — Plain static server (no Node tooling)

The `index.html` includes an importmap pointing to `../../dist/index.js`, so the source can also run under any plain static server **as long as it's served from the repo root** (so `../../dist/` is reachable from the example's URL).

From the repo root:

```bash
npx serve .
# Open http://localhost:3000/examples/03-ssg-blog/
```

> Option C runs the SPA **without pre-rendering** — every route resolves client-side. Use Option B to see what production-deployed HTML actually looks like.

## Structure

```
03-ssg-blog/
├── package.json
├── vite.config.js          # plugins: [courvuxSsg({ routes, notFound, baseUrl })]
├── index.html              # shell — Vite injects asset hashes; SSG inlines per-route head
└── src/
    ├── main.js             # createApp({ router })
    ├── router.js           # mode: 'history'; wraps routes-data.js
    ├── routes-data.js      # shared by router and SSG plugin
    ├── posts.js            # the post catalog (replace with markdown loader / CMS)
    ├── style.css
    └── pages/
        ├── Home.js
        ├── Post.js
        └── NotFound.js
```

## What it shows

- **`useHead` per page** — title, description, OG, canonical, all captured during SSG and inlined into each emitted HTML file.
- **`courvux/plugin/ssg`** — Vite plugin that runs the routes through `renderPage` and writes per-route HTML.
- **Dynamic-route prerender** — `/posts/:slug` opts in via a `prerender()` callback that returns the concrete paths to emit (one per post in `posts.js`).
- **`mode: 'history'` routing** — internal links navigate client-side; deep links fetch the pre-rendered HTML.
- **Custom 404** — `notFound:` plugin option emits `dist/404.html` so static hosts serve it for any unknown path.
- **Sitemap + robots** — generated automatically from the route list when `baseUrl` is set.

## Output after `pnpm build`

```
dist/
├── index.html                         ← /
├── posts/
│   ├── hello-world/index.html         ← /posts/hello-world
│   ├── how-prerender-works/index.html
│   └── use-head-and-seo/index.html
├── 404.html
├── sitemap.xml
└── robots.txt
```

Open `dist/posts/hello-world/index.html` directly in a browser — the post text and metadata are in the static HTML, no JS execution required.

## Replacing the post catalog

`src/posts.js` is a hardcoded array. Real-world variants:

- **Markdown files**: load with [`vite-plugin-markdown`](https://www.npmjs.com/package/vite-plugin-markdown) or `fs.readdir` in a build helper, parse frontmatter into the same shape.
- **Headless CMS (Sanity / Contentful / Strapi)**: turn `prerender:` into an async function that fetches the slug list at build time.
- **Local SQLite / DB**: same pattern — `prerender: async () => (await db.all('SELECT slug FROM posts')).map(r => '/posts/' + r.slug)`.
