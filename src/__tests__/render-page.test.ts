import { describe, it, expect } from 'vitest';
import { renderPage, renderHeadToString } from '../ssr.js';
import { useHead } from '../head.js';

describe('renderPage', () => {
    it('returns html and empty head when component does not call useHead', async () => {
        const result = await renderPage({
            template: '<p>{{ msg }}</p>',
            data: { msg: 'Hello' },
        });
        expect(result.html).toContain('Hello');
        expect(result.head.title).toBeUndefined();
        expect(result.head.meta).toEqual([]);
    });

    it('captures useHead calls made inside onMount', async () => {
        const result = await renderPage({
            template: '<p>{{ msg }}</p>',
            data: { msg: 'Page' },
            onMount() {
                useHead({
                    title: 'Test Page',
                    meta: [{ name: 'description', content: 'A test page' }],
                });
            },
        });
        expect(result.head.title).toBe('Test Page');
        expect(result.head.meta).toHaveLength(1);
        expect(result.head.meta![0]).toEqual({ name: 'description', content: 'A test page' });
    });

    it('captures useHead calls in onBeforeMount as well', async () => {
        const result = await renderPage({
            template: '<p>x</p>',
            onBeforeMount() {
                useHead({ title: 'Early' });
            },
        });
        expect(result.head.title).toBe('Early');
    });

    it('merges multiple useHead calls — later overrides earlier title', async () => {
        const result = await renderPage({
            template: '<p>x</p>',
            onMount() {
                useHead({ title: 'First',  meta: [{ name: 'description', content: 'a' }] });
                useHead({ title: 'Second', meta: [{ name: 'description', content: 'b' }] });
            },
        });
        expect(result.head.title).toBe('Second');
        // Last write wins for same dedupe key
        expect(result.head.meta).toHaveLength(1);
        expect(result.head.meta![0].content).toBe('b');
    });

    it('dedupes meta tags by property (Open Graph)', async () => {
        const result = await renderPage({
            template: '<p>x</p>',
            onMount() {
                useHead({
                    meta: [
                        { property: 'og:title', content: 'A' },
                        { property: 'og:title', content: 'B' },
                        { name: 'description', content: 'desc' },
                    ],
                });
            },
        });
        expect(result.head.meta).toHaveLength(2);
        const og = result.head.meta!.find(m => m.property === 'og:title');
        expect(og?.content).toBe('B');
    });

    it('dedupes canonical link', async () => {
        const result = await renderPage({
            template: '<p>x</p>',
            onMount() {
                useHead({
                    link: [
                        { rel: 'canonical', href: 'https://a.test/' },
                        { rel: 'canonical', href: 'https://b.test/' },
                    ],
                });
            },
        });
        expect(result.head.link).toHaveLength(1);
        expect(result.head.link![0].href).toBe('https://b.test/');
    });

    it('useHead in collection mode does not touch the document', async () => {
        const titleBefore = document.title;
        const beforeMeta = document.head.querySelectorAll('meta[name="description"]').length;
        await renderPage({
            template: '<p>x</p>',
            onMount() {
                useHead({ title: 'Should-not-leak', meta: [{ name: 'description', content: 'X' }] });
            },
        });
        expect(document.title).toBe(titleBefore);
        expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(beforeMeta);
    });

    it('marks rendered root with data-courvux-ssr', async () => {
        const result = await renderPage({ template: '<p>x</p>' });
        expect(result.html).toContain('data-courvux-ssr="true"');
    });

    it('swallows errors thrown by onMount during SSR', async () => {
        await expect(renderPage({
            template: '<p>x</p>',
            onMount() { throw new Error('client-only API'); },
        })).resolves.toMatchObject({ html: expect.stringContaining('x') });
    });
});

describe('renderHeadToString', () => {
    it('renders title with template applied', () => {
        const html = renderHeadToString({ title: 'Install', titleTemplate: '%s — Site' });
        expect(html).toContain('<title>Install — Site</title>');
    });

    it('escapes HTML in title', () => {
        const html = renderHeadToString({ title: 'A < B & C' });
        expect(html).toContain('<title>A &lt; B &amp; C</title>');
    });

    it('renders meta tags', () => {
        const html = renderHeadToString({
            meta: [
                { name: 'description', content: 'Desc' },
                { property: 'og:image', content: '/og.png' },
            ],
        });
        expect(html).toContain('<meta name="description" content="Desc">');
        expect(html).toContain('<meta property="og:image" content="/og.png">');
    });

    it('escapes attribute values', () => {
        const html = renderHeadToString({
            meta: [{ name: 'description', content: 'Has "quotes" & ampersand' }],
        });
        expect(html).toContain('&quot;quotes&quot;');
        expect(html).toContain('&amp;');
    });

    it('renders link tags', () => {
        const html = renderHeadToString({
            link: [{ rel: 'canonical', href: 'https://example.com/' }],
        });
        expect(html).toContain('<link rel="canonical" href="https://example.com/">');
    });

    it('renders inline script with innerHTML', () => {
        const html = renderHeadToString({
            script: [{ type: 'application/ld+json', innerHTML: '{"@type":"X"}' }],
        });
        expect(html).toContain('<script type="application/ld+json">{"@type":"X"}</script>');
    });

    it('returns empty string for empty head', () => {
        expect(renderHeadToString({}).trim()).toBe('');
    });
});
