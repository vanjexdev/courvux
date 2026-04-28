import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('computed properties', () => {
    it('computes derived value', async () => {
        const w = await mount({
            template: '<p>{{ double }}</p>',
            data: { n: 4 },
            computed: { double() { return (this as any).n * 2; } }
        });
        expect(w.text()).toBe('8');
        w.destroy();
    });

    it('updates when dependency changes', async () => {
        const w = await mount({
            template: '<p>{{ double }}</p>',
            data: { n: 1 },
            computed: { double() { return (this as any).n * 2; } }
        });
        w.state.n = 5;
        await w.nextTick();
        expect(w.text()).toBe('10');
        w.destroy();
    });
});

describe('watchers', () => {
    it('fires handler on key change', async () => {
        const calls: any[] = [];
        const w = await mount({
            template: '<p>{{ count }}</p>',
            data: { count: 0 },
            watch: { count(newVal: number, oldVal: number) { calls.push({ newVal, oldVal }); } }
        });
        w.state.count = 3;
        await w.nextTick();
        expect(calls).toHaveLength(1);
        expect(calls[0].newVal).toBe(3);
        w.destroy();
    });

    it('immediate option fires on mount', async () => {
        const calls: any[] = [];
        await mount({
            template: '<p>{{ x }}</p>',
            data: { x: 7 },
            watch: {
                x: { handler(v: number) { calls.push(v); }, immediate: true }
            }
        });
        expect(calls).toContain(7);
    });
});
