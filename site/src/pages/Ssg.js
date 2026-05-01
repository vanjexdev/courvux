import { setHead } from '../seo.js';

export default {
    data: {
        s_vite: `// vite.config.js
import { defineConfig } from 'vite';
import courvuxSsg from 'courvux/plugin/ssg';

export default defineConfig({
    plugins: [
        courvuxSsg({
            // Required — async function returning the route list.
            routes: async () => (await import('./src/routes-data.js')).default,

            // Required for sitemap.xml + robots.txt
            baseUrl: 'https://courvux.dev',

            // Optional — page shell (HTML string or path). Defaults to the
            // Vite-emitted index.html with %head% / %app% placeholders.
            // template: '<!doctype html>...',

            // Optional — id of the mount root in the shell. Default: 'app'.
            // mountId: 'app',

            // Optional — also emit sitemap.xml + robots.txt. Default: true.
            // sitemap: true,
        }),
    ],
});`,

        s_routes: `const routes = [
    {
        path: '/',
        component: HomePage,
        head: { title: 'Home — Courvux' },     // fallback if useHead not called
    },
    {
        path: '/installation',
        component: InstallationPage,            // calls useHead in onMount
    },
    {
        // Dynamic route — list paths to emit
        path: '/blog/:slug',
        component: BlogPost,
        prerender: async () => {
            const posts = await fetch('https://api.example.com/posts').then(r => r.json());
            return posts.map(p => \`/blog/\${p.slug}\`);
        },
    },
];`,

        s_output: `dist/
├── index.html                  ← /
├── installation/index.html     ← /installation
├── quick-start/index.html      ← /quick-start
├── blog/
│   ├── intro/index.html        ← /blog/intro (from prerender)
│   └── faq/index.html          ← /blog/faq
├── sitemap.xml
└── robots.txt`,

        s_programmatic: `import { renderPage, renderHeadToString } from 'courvux';

const { html, head } = await renderPage(componentConfig);
const headHtml = renderHeadToString(head);

// → embed headHtml in your shell, then html in the mount root`,
    },
    template: `
        <div class="prose">
            <h1>Static Site Generation (SSG)</h1>
            <p>The <code>courvux/plugin/ssg</code> Vite plugin pre-renders every route to its own <code>index.html</code> at build time. Crawlers, Open Graph previewers, and static hosts (GitHub Pages, Netlify, Cloudflare Pages) see real per-route HTML — not an empty SPA shell.</p>

            <p>The plugin captures <code>useHead</code> calls during render, so each emitted page has its correct <code>&lt;title&gt;</code>, meta tags, canonical link, and JSON-LD inlined into <code>&lt;head&gt;</code>. A <code>sitemap.xml</code> and <code>robots.txt</code> are emitted alongside.</p>

            <h2>Vite config</h2>
            <code-block :lang="'js'" :code="s_vite"></code-block>

            <h2>Per-route options</h2>
            <code-block :lang="'js'" :code="s_routes"></code-block>

            <h2>Output structure</h2>
            <p>Each route gets its own folder so static hosts serve real HTML at every URL — no <code>404.html</code> trick needed.</p>
            <code-block :lang="'text'" :code="s_output"></code-block>

            <h2>How head capture works</h2>
            <p>During SSG, <code>useHead</code> calls are buffered instead of mutating the document. The plugin merges them per route, applies dedupe rules, and inlines them into the <code>&lt;head&gt;</code> of the emitted HTML. If a component does not call <code>useHead</code>, the route-level <code>head</code> field is used as a fallback.</p>

            <p><code>onMount</code> is invoked during SSG so the standard <code>useHead</code> pattern works as-is. Errors thrown from <code>onMount</code> (e.g. for client-only APIs like <code>IntersectionObserver</code>) are caught and logged — guard SSR-incompatible code with <code>typeof window === 'undefined'</code>.</p>

            <h2>Programmatic API</h2>
            <p>If you don't use Vite, the same primitives are exported:</p>
            <code-block :lang="'js'" :code="s_programmatic"></code-block>

            <h2>Subpath deployments — router base</h2>
            <p>If your site lives under a subpath (e.g. GitHub Pages at <code>/&lt;repo&gt;/</code>), pass <code>base</code> to the router so internal route paths stay clean (<code>/about</code>) but URLs and links are prefixed correctly:</p>
            <code-block :lang="'js'" :code="\`createRouter(routes, {\\n    mode: 'history',\\n    base: '/courvux',\\n});\`"></code-block>

            <div style="margin-top:2rem; display:flex; gap:12px;">
                <router-link to="/head" style="font-size:13px; color:#555;">← useHead</router-link>
                <router-link to="/devtools" style="font-size:13px; color:#111; font-weight:600;">DevTools →</router-link>
            </div>
        </div>
    `,
    onMount() {
        setHead({
            title: 'Static Site Generation',
            description: 'Pre-render every route to static HTML at build time with the courvux/plugin/ssg Vite plugin.',
            slug: '/ssg',
        });
    },
};
