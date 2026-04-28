import { describe, it, expect } from 'vitest';
import { createApp } from '../index.js';

describe('app.magic()', () => {
    it('registers $magic property available in component state', async () => {
        const el = document.createElement('div');
        document.body.appendChild(el);

        const app = createApp({
            template: '<p>{{ $fmt.upper("hello") }}</p>',
            data: {}
        }).magic('fmt', () => ({ upper: (s: string) => s.toUpperCase() }));

        const state = await app.mountEl(el);
        await new Promise(r => setTimeout(r, 0));

        expect(el.querySelector('p')?.textContent?.trim()).toBe('HELLO');
        app.destroy();
        el.remove();
    });
});
