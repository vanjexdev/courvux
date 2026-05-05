import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-html — sanitize-by-default (0.6.0)', () => {
    it('renders bare innerHTML for safe markup with bare cv-html', async () => {
        const w = await mount({
            template: '<div cv-html="content"></div>',
            data: { content: '<p><strong>Hello</strong> <em>world</em></p>' }
        });
        const div = w.find('div')!;
        expect(div.querySelector('strong')?.textContent).toBe('Hello');
        expect(div.querySelector('em')?.textContent).toBe('world');
        w.destroy();
    });

    it('strips <script> tags from cv-html', async () => {
        const w = await mount({
            template: '<div cv-html="content"></div>',
            data: { content: '<p>safe</p><script>window.__pwned__ = true;<\/script>' }
        });
        const div = w.find('div')!;
        expect(div.querySelector('script')).toBeNull();
        expect(div.querySelector('p')?.textContent).toBe('safe');
        w.destroy();
    });

    it('strips on* event handler attributes from cv-html', async () => {
        const w = await mount({
            template: '<div cv-html="content"></div>',
            data: { content: '<img src="x" onerror="window.__pwned__ = true">' }
        });
        const img = w.find('img');
        expect(img?.hasAttribute('onerror')).toBe(false);
        w.destroy();
    });

    it('strips javascript: URLs from cv-html', async () => {
        const w = await mount({
            template: '<div cv-html="content"></div>',
            data: { content: '<a href="javascript:alert(1)">click</a>' }
        });
        const a = w.find('a');
        expect(a?.getAttribute('href')).toBeNull();
        w.destroy();
    });

    it('cv-html.raw bypasses sanitization (trusted content)', async () => {
        const w = await mount({
            template: '<div cv-html.raw="content"></div>',
            data: { content: '<p>raw</p><iframe src="about:blank"></iframe>' }
        });
        const div = w.find('div')!;
        expect(div.querySelector('iframe')).not.toBeNull();
        w.destroy();
    });

    it('cv-html.sanitize is a back-compat no-op (still sanitizes, same as bare cv-html)', async () => {
        const w = await mount({
            template: '<div cv-html.sanitize="content"></div>',
            data: { content: '<p>safe</p><script>boom();<\/script>' }
        });
        const div = w.find('div')!;
        expect(div.querySelector('script')).toBeNull();
        expect(div.querySelector('p')?.textContent).toBe('safe');
        w.destroy();
    });

    it('cv-html updates reactively when state changes', async () => {
        const w = await mount({
            template: '<div cv-html="content"></div>',
            data: { content: '<p>first</p>' }
        });
        const div = w.find('div')!;
        expect(div.querySelector('p')?.textContent).toBe('first');
        w.state.content = '<p>second</p>';
        await w.nextTick();
        expect(div.querySelector('p')?.textContent).toBe('second');
        w.destroy();
    });
});
