import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-show', () => {
    it('shows element when condition is true', async () => {
        const w = await mount({ template: '<div cv-show="visible">content</div>', data: { visible: true } });
        expect(w.find('div')?.style.display).not.toBe('none');
        w.destroy();
    });

    it('hides element when condition is false', async () => {
        const w = await mount({ template: '<div cv-show="visible">content</div>', data: { visible: false } });
        expect(w.find('div')?.style.display).toBe('none');
        w.destroy();
    });

    it('reacts to state change', async () => {
        const w = await mount({ template: '<div cv-show="open">panel</div>', data: { open: false } });
        expect(w.find('div')?.style.display).toBe('none');
        w.state.open = true;
        await w.nextTick();
        expect(w.find('div')?.style.display).not.toBe('none');
        w.destroy();
    });

    it('evaluates boolean expression', async () => {
        const w = await mount({ template: '<div cv-show="count > 0">positive</div>', data: { count: 0 } });
        expect(w.find('div')?.style.display).toBe('none');
        w.state.count = 1;
        await w.nextTick();
        expect(w.find('div')?.style.display).not.toBe('none');
        w.destroy();
    });
});
