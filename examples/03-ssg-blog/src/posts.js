// Blog post catalog — usually you'd load this from markdown files,
// a CMS, or an API. Kept inline here for clarity.
export const POSTS = [
    {
        slug:        'hello-world',
        title:       'Hello, world',
        date:        '2026-04-01',
        description: 'A first post — and a tour of how this static blog is generated.',
        body: `<p>Welcome. This site is pre-rendered to flat HTML with the
            <code>courvux/plugin/ssg</code> Vite plugin. Every post in
            <code>src/posts.js</code> turns into its own
            <code>&lt;slug&gt;/index.html</code> at build time, with the correct
            <code>&lt;title&gt;</code>, meta description, and canonical link.</p>
            <p>The home page lists all posts. Clicking one navigates client-side
            via the router; loading the URL directly serves the pre-rendered HTML.</p>`,
    },
    {
        slug:        'how-prerender-works',
        title:       'How prerender() works',
        date:        '2026-04-15',
        description: 'Static routes are emitted automatically. Dynamic routes opt in by listing the paths to generate.',
        body: `<p>Static routes (no <code>:param</code>) are emitted automatically:
            one folder per path, each containing an <code>index.html</code>.</p>
            <p>Dynamic routes — like <code>/posts/:slug</code> — opt in by
            providing a <code>prerender</code> callback that returns the
            concrete paths to emit. The plugin loops over them, calls
            <code>renderPage</code> for each, and writes the resulting HTML.</p>`,
    },
    {
        slug:        'use-head-and-seo',
        title:       'useHead and SEO',
        date:        '2026-04-22',
        description: 'Per-page title, meta description, Open Graph tags — all captured during SSG.',
        body: `<p>Each post page calls <code>useHead</code> in
            <code>onMount</code>. During SSG those calls are buffered and
            inlined into the emitted page's <code>&lt;head&gt;</code>. At runtime,
            the same calls update <code>document.title</code> and the meta tags
            during client-side navigation.</p>`,
    },
];
