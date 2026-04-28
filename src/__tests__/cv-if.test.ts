import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-if / cv-else-if / cv-else', () => {
    it('renders when condition is true', async () => {
        const w = await mount({ template: '<p cv-if="show">yes</p>', data: { show: true } });
        expect(w.find('p')).not.toBeNull();
        expect(w.text()).toBe('yes');
        w.destroy();
    });

    it('does not render when condition is false', async () => {
        const w = await mount({ template: '<p cv-if="show">yes</p>', data: { show: false } });
        expect(w.find('p')).toBeNull();
        w.destroy();
    });

    it('toggles on state change', async () => {
        const w = await mount({ template: '<p cv-if="show">yes</p>', data: { show: false } });
        expect(w.find('p')).toBeNull();
        w.state.show = true;
        await w.nextTick();
        expect(w.find('p')).not.toBeNull();
        w.destroy();
    });

    it('cv-else renders when cv-if is false', async () => {
        const w = await mount({
            template: '<p cv-if="show">yes</p><p cv-else>no</p>',
            data: { show: false }
        });
        expect(w.text()).toBe('no');
        w.destroy();
    });

    it('cv-else-if chain works', async () => {
        const w = await mount({
            template: '<p cv-if="v === 1">one</p><p cv-else-if="v === 2">two</p><p cv-else>other</p>',
            data: { v: 2 }
        });
        expect(w.text()).toBe('two');
        w.destroy();
    });
});
