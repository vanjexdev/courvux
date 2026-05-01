/**
 * ssg-test.mjs — End-to-end test for vite-plugin-courvux-ssg.
 * Simulates Vite's plugin lifecycle (configResolved + closeBundle) and
 * verifies emitted files. No real Vite build invoked.
 *
 * Run: node ssg-test.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import courvuxSsg from './plugin/vite-plugin-courvux-ssg.js';

const TMP = await fs.mkdtemp(path.join(os.tmpdir(), 'courvux-ssg-'));

let passed = 0;
let failed = 0;
const log = (ok, name, detail = '') => {
    if (ok) { passed++; console.log(`  ✅ ${name}`); }
    else    { failed++; console.error(`  ❌ ${name}${detail ? '\n     ' + detail : ''}`); }
};

const Home = {
    template: '<p>Home: {{ msg }}</p>',
    data: { msg: 'Welcome' },
    onMount() {
        // useHead is auto-imported via the dist build the plugin uses
    },
};

const About = {
    template: '<h1>{{ title }}</h1>',
    data: { title: 'About us' },
};

const UserPage = {
    template: '<section>User</section>',
    data: { id: 0 },
};

const PageWithHead = {
    template: '<p>x</p>',
    async onMount() {
        const { useHead } = await import('./dist/index.js');
        useHead({
            title: 'Hello',
            titleTemplate: '%s — site',
            meta: [{ name: 'description', content: 'A page' }],
            link: [{ rel: 'canonical', href: 'https://test.example/page' }],
        });
    },
};

const routes = [
    { path: '/',      component: Home,         head: { title: 'Home — fallback' } },
    { path: '/about', component: About,        head: { title: 'About', meta: [{ name: 'description', content: 'About' }] } },
    { path: '/page',  component: PageWithHead },
    { path: '/user/:id', component: UserPage, prerender: () => Promise.resolve(['/user/1', '/user/2']) },
    { path: '/skipped/:x', component: UserPage }, // dynamic without prerender — should be skipped
];

const plugin = courvuxSsg({
    routes: () => Promise.resolve(routes),
    baseUrl: 'https://test.example',
});

// Simulate Vite lifecycle
plugin.configResolved({
    root: process.cwd(),
    build: { outDir: path.relative(process.cwd(), TMP) },
    command: 'build',
});
await plugin.closeBundle();

// Assertions
const mustExist = async (p) => {
    try { await fs.access(p); return true; } catch { return false; }
};
const read = (p) => fs.readFile(p, 'utf-8');

log(await mustExist(path.join(TMP, 'index.html')), 'home → index.html');
log(await mustExist(path.join(TMP, 'about', 'index.html')), 'about → about/index.html');
log(await mustExist(path.join(TMP, 'page', 'index.html')), 'page → page/index.html');
log(await mustExist(path.join(TMP, 'user', '1', 'index.html')), 'dynamic /user/1 → user/1/index.html');
log(await mustExist(path.join(TMP, 'user', '2', 'index.html')), 'dynamic /user/2 → user/2/index.html');
log(await mustExist(path.join(TMP, 'sitemap.xml')), 'sitemap.xml emitted');
log(await mustExist(path.join(TMP, 'robots.txt')), 'robots.txt emitted');

// Skipped dynamic without prerender shouldn't have a folder
log(!(await mustExist(path.join(TMP, 'skipped'))), 'skipped dynamic route (no prerender) emits nothing');

const home = await read(path.join(TMP, 'index.html'));
log(home.includes('<title>Home — fallback</title>'), 'home shell contains fallback title');
log(home.includes('Welcome'), 'home shell contains rendered template');
log(home.includes('data-courvux-ssr="true"'), 'rendered html marked with SSR attr');

const about = await read(path.join(TMP, 'about', 'index.html'));
log(about.includes('<title>About</title>'),       'about title');
log(about.includes('name="description" content="About"'), 'about meta description');

const page = await read(path.join(TMP, 'page', 'index.html'));
log(page.includes('<title>Hello — site</title>'), 'useHead title with template applied');
log(page.includes('rel="canonical"'),             'useHead canonical emitted');
log(page.includes('content="A page"'),            'useHead meta description');

const sitemap = await read(path.join(TMP, 'sitemap.xml'));
log(sitemap.includes('<loc>https://test.example</loc>'),         'sitemap has root URL');
log(sitemap.includes('<loc>https://test.example/about</loc>'),   'sitemap has /about');
log(sitemap.includes('<loc>https://test.example/user/1</loc>'),  'sitemap has dynamic /user/1');

const robots = await read(path.join(TMP, 'robots.txt'));
log(robots.includes('Sitemap: https://test.example/sitemap.xml'), 'robots.txt points to sitemap');

console.log(`\n── Resultado: ${passed} ✅  ${failed} ❌ ──`);
console.log(`(tmp dir: ${TMP})`);
process.exit(failed > 0 ? 1 : 0);
