import { setHead } from '../seo.js';

export default {
    data: {
        s_basic: `import { useHead } from 'courvux';

export default {
    onMount() {
        const cleanup = useHead({
            title: 'Installation',
            titleTemplate: '%s — Courvux',
            meta: [
                { name: 'description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:title',       content: 'Installation — Courvux' },
                { property: 'og:description', content: 'Get started with Courvux in under 60 seconds.' },
                { property: 'og:image',       content: '/og/installation.png' },
                { name: 'twitter:card',       content: 'summary_large_image' },
            ],
            link: [
                { rel: 'canonical', href: 'https://courvux.dev/installation' },
            ],
        });
        this.$addCleanup(cleanup);
    }
};`,

        s_jsonld: `useHead({
    script: [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'SoftwareApplication',
            name:        'Courvux',
            applicationCategory: 'DeveloperApplication',
            operatingSystem:     'Any',
            offers: { '@type': 'Offer', price: '0' },
        }),
    }],
});`,

        s_html_attrs: `useHead({
    htmlAttrs: { lang: 'es', class: 'theme-dark' },
    bodyAttrs: { 'data-route': 'installation' },
});`,

        s_title_tpl: `// String form — %s is replaced
useHead({ title: 'Install', titleTemplate: '%s — Courvux' });
// → <title>Install — Courvux</title>

// Function form
useHead({ title: 'Install', titleTemplate: t => \`\${t} | site\` });
// → <title>Install | site</title>`,
    },
    template: `
        <div class="prose">
            <h1>useHead — SEO and metadata</h1>
            <p><code>useHead</code> is the per-component head management composable. It updates <code>document.title</code>, upserts <code>&lt;meta&gt;</code> and <code>&lt;link&gt;</code> tags, and lets each route declare its own metadata. Tags are reverted on cleanup so navigating away from a route restores the previous head exactly.</p>

            <h2>Basic usage</h2>
            <code-block :lang="'js'" :code="s_basic"></code-block>

            <h2>Title templates</h2>
            <code-block :lang="'js'" :code="s_title_tpl"></code-block>

            <h2>Config shape</h2>
            <table>
                <thead><tr><th>Field</th><th>Notes</th></tr></thead>
                <tbody>
                    <tr><td><code>title</code></td><td>Replaces <code>document.title</code>. Restored on cleanup.</td></tr>
                    <tr><td><code>titleTemplate</code></td><td>String with <code>%s</code> placeholder, or function form.</td></tr>
                    <tr><td><code>meta</code></td><td>Each entry becomes a <code>&lt;meta&gt;</code> tag. Dedupe by <code>name</code>, then <code>property</code>, then <code>http-equiv</code>.</td></tr>
                    <tr><td><code>link</code></td><td>Each entry becomes a <code>&lt;link&gt;</code> tag. <code>rel="canonical"</code> is unique. Other links dedupe by <code>rel + href</code>.</td></tr>
                    <tr><td><code>script</code></td><td>Each entry becomes a <code>&lt;script&gt;</code> tag. Use <code>innerHTML</code> for inline content. Always inserted fresh.</td></tr>
                    <tr><td><code>htmlAttrs</code></td><td>Sets attributes on <code>&lt;html&gt;</code> (e.g. <code>lang</code>, <code>class</code>). Restored on cleanup.</td></tr>
                    <tr><td><code>bodyAttrs</code></td><td>Sets attributes on <code>&lt;body&gt;</code>. Restored on cleanup.</td></tr>
                </tbody>
            </table>

            <h2>JSON-LD structured data</h2>
            <p>Inject Schema.org structured data via the <code>script</code> field. Improves SERP appearance and Knowledge Graph eligibility.</p>
            <code-block :lang="'js'" :code="s_jsonld"></code-block>

            <h2>html / body attrs</h2>
            <code-block :lang="'js'" :code="s_html_attrs"></code-block>

            <h2>SSR safety</h2>
            <p><code>useHead</code> is a no-op when <code>document</code> is unavailable, so it's safe to call during SSR. During <a href="/courvux/ssg/" class="link">static generation</a>, calls are buffered and inlined into the emitted page's <code>&lt;head&gt;</code> automatically.</p>

            <div class="callout info">
                Pair <code>useHead</code> with <code>mode: 'history'</code> in the router so each route has a real URL the crawler can fetch. Hash routing (<code>#/path</code>) prevents servers and crawlers from seeing per-route content.
            </div>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/store" style="font-size:13px; color:#555;">← Store</router-link>
                <router-link to="/ssg" style="font-size:13px; color:#111; font-weight:600;">Static Generation →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'useHead — SEO and metadata',
            description: 'Per-component head management with useHead in Courvux: title, meta tags, Open Graph, JSON-LD, htmlAttrs.',
            slug: '/head',
        });
    },
};
