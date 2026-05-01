import { describe, it, expect, beforeEach } from 'vitest';
import { useHead } from '../head.js';

const headHtml = () => document.head.innerHTML;
const meta = (sel: string) => document.head.querySelector(sel) as HTMLMetaElement | null;
const link = (sel: string) => document.head.querySelector(sel) as HTMLLinkElement | null;

describe('useHead', () => {
    beforeEach(() => {
        document.title = '';
        document.head.innerHTML = '';
        document.documentElement.removeAttribute('lang');
        document.documentElement.removeAttribute('class');
        document.body.removeAttribute('class');
    });

    it('sets document.title and restores it on cleanup', () => {
        document.title = 'Original';
        const cleanup = useHead({ title: 'New page' });
        expect(document.title).toBe('New page');
        cleanup();
        expect(document.title).toBe('Original');
    });

    it('applies titleTemplate string with %s placeholder', () => {
        useHead({ title: 'Install', titleTemplate: '%s — Courvux' });
        expect(document.title).toBe('Install — Courvux');
    });

    it('applies titleTemplate function', () => {
        useHead({ title: 'Install', titleTemplate: t => `${t} | site` });
        expect(document.title).toBe('Install | site');
    });

    it('inserts meta tags and removes them on cleanup', () => {
        const cleanup = useHead({
            meta: [
                { name: 'description', content: 'A short description' },
                { property: 'og:title', content: 'Hello' },
            ],
        });
        expect(meta('meta[name="description"]')!.content).toBe('A short description');
        expect(meta('meta[property="og:title"]')!.content).toBe('Hello');
        cleanup();
        expect(meta('meta[name="description"]')).toBeNull();
        expect(meta('meta[property="og:title"]')).toBeNull();
    });

    it('dedupes existing meta by name and restores its attrs on cleanup', () => {
        document.head.innerHTML = '<meta name="description" content="ORIGINAL">';
        expect(meta('meta[name="description"]')!.content).toBe('ORIGINAL');

        const cleanup = useHead({
            meta: [{ name: 'description', content: 'OVERRIDE' }],
        });
        expect(document.head.querySelectorAll('meta[name="description"]').length).toBe(1);
        expect(meta('meta[name="description"]')!.content).toBe('OVERRIDE');

        cleanup();
        expect(meta('meta[name="description"]')!.content).toBe('ORIGINAL');
    });

    it('dedupes by property (Open Graph)', () => {
        document.head.innerHTML = '<meta property="og:image" content="/old.png">';
        const cleanup = useHead({
            meta: [{ property: 'og:image', content: '/new.png' }],
        });
        expect(document.head.querySelectorAll('meta[property="og:image"]').length).toBe(1);
        expect(meta('meta[property="og:image"]')!.content).toBe('/new.png');
        cleanup();
        expect(meta('meta[property="og:image"]')!.content).toBe('/old.png');
    });

    it('inserts canonical link and dedupes by rel', () => {
        document.head.innerHTML = '<link rel="canonical" href="https://old.example/">';
        const cleanup = useHead({
            link: [{ rel: 'canonical', href: 'https://new.example/page' }],
        });
        expect(document.head.querySelectorAll('link[rel="canonical"]').length).toBe(1);
        expect(link('link[rel="canonical"]')!.href).toContain('new.example');
        cleanup();
        expect(link('link[rel="canonical"]')!.href).toContain('old.example');
    });

    it('inserts script tag and removes on cleanup', () => {
        const cleanup = useHead({
            script: [{ type: 'application/ld+json', innerHTML: '{"@type":"X"}' }],
        });
        const s = document.head.querySelector('script[type="application/ld+json"]');
        expect(s).not.toBeNull();
        expect(s!.textContent).toBe('{"@type":"X"}');
        cleanup();
        expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
    });

    it('htmlAttrs sets and restores <html> attrs', () => {
        document.documentElement.setAttribute('lang', 'en');
        const cleanup = useHead({ htmlAttrs: { lang: 'es', class: 'dark' } });
        expect(document.documentElement.getAttribute('lang')).toBe('es');
        expect(document.documentElement.getAttribute('class')).toBe('dark');
        cleanup();
        expect(document.documentElement.getAttribute('lang')).toBe('en');
        expect(document.documentElement.getAttribute('class')).toBeNull();
    });

    it('bodyAttrs sets and restores <body> attrs', () => {
        const cleanup = useHead({ bodyAttrs: { class: 'theme-dark' } });
        expect(document.body.getAttribute('class')).toBe('theme-dark');
        cleanup();
        expect(document.body.getAttribute('class')).toBeNull();
    });

    it('multiple useHead calls compose; later cleanup reverts only its own tags', () => {
        const c1 = useHead({ meta: [{ name: 'description', content: 'A' }] });
        const c2 = useHead({ meta: [{ name: 'description', content: 'B' }] });
        expect(meta('meta[name="description"]')!.content).toBe('B');
        c2();
        expect(meta('meta[name="description"]')!.content).toBe('A');
        c1();
        expect(meta('meta[name="description"]')).toBeNull();
    });

    it('returns no-op cleanup when document is unavailable (SSR safety)', () => {
        // Simulate by deleting the global temporarily
        const realDoc = globalThis.document;
        // @ts-expect-error — deliberately remove
        delete globalThis.document;
        const cleanup = useHead({ title: 'X', meta: [{ name: 'd', content: 'c' }] });
        expect(typeof cleanup).toBe('function');
        // Should not throw
        cleanup();
        globalThis.document = realDoc;
    });
});
