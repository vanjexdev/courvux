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

    it('cv-if reacts to expressions involving nested property access (e.g. items.length)', async () => {
        const w = await mount({
            template: '<p cv-if="items.length > 0">have</p><p cv-else>empty</p>',
            data: { items: [] as number[] }
        });
        expect(w.text()).toBe('empty');

        w.state.items = [1, 2, 3];
        await w.nextTick();
        expect(w.text()).toBe('have');

        w.state.items = [];
        await w.nextTick();
        expect(w.text()).toBe('empty');
        w.destroy();
    });

    // Regression for the Tauri-notepad input-focus loss: every keystroke
    // mutated `selected.updatedAt` → notify on `notes` → computed `selected`
    // recomputed → notify on `selected` → cv-if re-ran. The previous
    // implementation removed and re-cloned the active branch every time, so
    // the <input> inside the cv-else lost focus mid-typing. cv-if now
    // compares the active branch index and skips the rebuild when it hasn't
    // changed — the branch's own bindings still update via their own
    // subscriptions.
    it('does not rebuild the active branch when its dependencies fire but the truthy branch does not change', async () => {
        const w = await mount({
            template: `
                <div>
                    <p cv-if="!current">empty</p>
                    <p cv-else>{{ current.title }}</p>
                </div>
            `,
            data: {
                items: [{ id: 1, title: 'first' }, { id: 2, title: 'second' }],
                selectedId: 1,
            },
            computed: {
                current(this: any) {
                    return this.items.find((it: any) => it.id === this.selectedId) ?? null;
                },
            },
        });

        // Capture the initial DOM node so we can prove identity stability.
        const initialP = w.find('p')!;
        expect(initialP.textContent?.trim()).toBe('first');

        // Mutate `items` (touches a dep of `current`) without changing the
        // truthy/falsy branch. Old behavior: cv-if re-cloned the <p>, so
        // findAll('p')[0] was a NEW node. Fixed behavior: same node reused.
        (w.state.items[0] as any).title = 'first edited';
        await w.nextTick();

        const afterEditP = w.find('p')!;
        expect(afterEditP).toBe(initialP);                  // same DOM node
        expect(afterEditP.textContent?.trim()).toBe('first edited');

        // Switching the selected note keeps `current` truthy → still cv-else
        // branch → still the same clone, just with updated interpolation.
        w.state.selectedId = 2;
        await w.nextTick();
        const afterSelectP = w.find('p')!;
        expect(afterSelectP).toBe(initialP);
        expect(afterSelectP.textContent?.trim()).toBe('second');

        // Forcing a branch flip (no current) DOES rebuild — different branch.
        w.state.selectedId = 999;
        await w.nextTick();
        const emptyP = w.find('p')!;
        expect(emptyP).not.toBe(initialP);                  // new clone for cv-if branch
        expect(emptyP.textContent?.trim()).toBe('empty');

        w.destroy();
    });
});
