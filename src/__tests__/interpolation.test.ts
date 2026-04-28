import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount } from '../test-utils.js';

describe('Interpolation {{ }}', () => {
    it('renders simple variable', async () => {
        const w = await mount({ template: '<p>{{ name }}</p>', data: { name: 'Courvux' } });
        expect(w.text()).toBe('Courvux');
        w.destroy();
    });

    it('renders numeric expression', async () => {
        const w = await mount({ template: '<p>{{ a + b }}</p>', data: { a: 3, b: 4 } });
        expect(w.text()).toBe('7');
        w.destroy();
    });

    it('renders ternary expression', async () => {
        const w = await mount({ template: '<p>{{ active ? "on" : "off" }}</p>', data: { active: true } });
        expect(w.text()).toBe('on');
        w.destroy();
    });

    it('updates DOM when state changes', async () => {
        const w = await mount({ template: '<p>{{ count }}</p>', data: { count: 0 } });
        expect(w.text()).toBe('0');
        w.state.count = 42;
        await w.nextTick();
        expect(w.text()).toBe('42');
        w.destroy();
    });

    it('handles nested object access', async () => {
        const w = await mount({
            template: '<p>{{ user.name }}</p>',
            data: { user: { name: 'Vanjex' } }
        });
        expect(w.text()).toBe('Vanjex');
        w.destroy();
    });
});
