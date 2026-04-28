import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-for', () => {
    it('renders a list from array', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items">{{ item }}</li></ul>',
            data: { items: ['a', 'b', 'c'] }
        });
        const lis = w.findAll('li');
        expect(lis).toHaveLength(3);
        expect(lis[0].textContent?.trim()).toBe('a');
        expect(lis[2].textContent?.trim()).toBe('c');
        w.destroy();
    });

    it('renders empty list', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items">{{ item }}</li></ul>',
            data: { items: [] }
        });
        expect(w.findAll('li')).toHaveLength(0);
        w.destroy();
    });

    it('exposes index in (item, index) form', async () => {
        const w = await mount({
            template: '<ul><li cv-for="(item, i) in items">{{ i }}:{{ item }}</li></ul>',
            data: { items: ['x', 'y'] }
        });
        const lis = w.findAll('li');
        expect(lis[0].textContent?.trim()).toBe('0:x');
        expect(lis[1].textContent?.trim()).toBe('1:y');
        w.destroy();
    });

    it('reacts to push', async () => {
        const w = await mount({
            template: '<ul><li cv-for="item in items">{{ item }}</li></ul>',
            data: { items: ['a'] }
        });
        expect(w.findAll('li')).toHaveLength(1);
        w.state.items = [...w.state.items, 'b'];
        await w.nextTick();
        expect(w.findAll('li')).toHaveLength(2);
        w.destroy();
    });

    it('iterates over object (val, key)', async () => {
        const w = await mount({
            template: '<ul><li cv-for="(val, key) in obj">{{ key }}={{ val }}</li></ul>',
            data: { obj: { a: 1, b: 2 } }
        });
        const lis = w.findAll('li');
        expect(lis).toHaveLength(2);
        const texts = lis.map(l => l.textContent?.trim());
        expect(texts).toContain('a=1');
        expect(texts).toContain('b=2');
        w.destroy();
    });
});
