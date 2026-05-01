# 03 — SSG blog

A small static blog built with `courvux/plugin/ssg`. Each post is pre-rendered to its own `dist/posts/<slug>/index.html` at build time, with the correct `<title>`, meta description, Open Graph tags, and canonical link.

## Run

```bash
pnpm install
pnpm dev          # Vite dev server with HMR
pnpm build        # produces dist/ — ready for any static host
pnpm preview      # serve the built dist/ locally
```

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
