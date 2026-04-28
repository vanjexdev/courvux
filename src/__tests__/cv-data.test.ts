import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-data — inline reactive scopes', () => {
    it('creates isolated reactive scope with data', async () => {
        const w = await mount({
            template: '<div cv-data="{ n: 5 }"><span>{{ n }}</span></div>',
            data: {}
        });
        expect(w.find('span')?.textContent?.trim()).toBe('5');
        w.destroy();
    });

    it('methods in inline scope work', async () => {
        const w = await mount({
            template: `
                <div cv-data="{ count: 0, inc() { this.count++ } }">
                    <button @click="inc()">+</button>
                    <span>{{ count }}</span>
                </div>`,
            data: {}
        });
        await w.trigger('button', 'click');
        await w.nextTick();
        expect(w.find('span')?.textContent?.trim()).toBe('1');
        w.destroy();
    });

    it('child scope reads parent state', async () => {
        const w = await mount({
            template: '<div cv-data="{ local: 10 }"><span>{{ parent }} {{ local }}</span></div>',
            data: { parent: 'hello' }
        });
        expect(w.find('span')?.textContent?.trim()).toBe('hello 10');
        w.destroy();
    });

    it('child scope writes are isolated from parent', async () => {
        const w = await mount({
            template: `
                <div cv-data="{ x: 1 }">
                    <button @click="x = 99">set</button>
                    <span id="child">{{ x }}</span>
                </div>
                <span id="parent">{{ x }}</span>`,
            data: { x: 0 }
        });
        await w.trigger('button', 'click');
        await w.nextTick();
        // child scope x → 99; parent x stays 0
        expect(w.find('#child')?.textContent?.trim()).toBe('99');
        expect(w.find('#parent')?.textContent?.trim()).toBe('0');
        w.destroy();
    });
});
