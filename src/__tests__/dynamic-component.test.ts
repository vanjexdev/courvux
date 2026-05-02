import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('<component :is>', () => {
    const ComponentA = { template: '<p class="a">A</p>' };
    const ComponentB = { template: '<p class="b">B</p>' };

    it('mounts the component named by `:is`', async () => {
        const w = await mount({
            template: '<div><component :is="active"></component></div>',
            data: { active: 'a' },
            components: { a: ComponentA, b: ComponentB },
        });
        expect(w.find('.a')?.textContent).toBe('A');
        w.destroy();
    });

    it('switches when `:is` value changes', async () => {
        const w = await mount({
            template: '<div><component :is="active"></component></div>',
            data: { active: 'a' },
            components: { a: ComponentA, b: ComponentB },
        });
        w.state.active = 'b';
        await w.nextTick();
        expect(w.find('.a')).toBeNull();
        expect(w.find('.b')?.textContent).toBe('B');
        w.destroy();
    });

    it('forwards plain HTML attributes (id, data-*) to the wrapper', async () => {
        const w = await mount({
            template: '<div><component :is="active" id="dyn" data-test="x"></component></div>',
            data: { active: 'a' },
            components: { a: ComponentA },
        });
        const wrapper = w.find('#dyn') as HTMLElement;
        expect(wrapper).not.toBeNull();
        expect(wrapper.dataset.test).toBe('x');
        w.destroy();
    });

    it('does NOT forward framework directive attrs as raw attributes (regression: Safari/Samsung crash)', async () => {
        // Before the audit fix this would call setAttribute('@click', '...')
        // on the wrapper div, which throws InvalidCharacterError on Safari
        // and Samsung Internet (the browsers that surfaced the router-link
        // bug in 0.4.4). Verify the @ / : / cv-* attrs are stripped from
        // the raw DOM attributes of the wrapper.
        let clicked = 0;
        const w = await mount({
            template: '<div><component :is="active" id="dyn" @click="onclick" :title="lbl" cv-show="true"></component></div>',
            data: { active: 'a', lbl: 'hello', onclick: () => { clicked++; } },
            components: { a: ComponentA },
        });
        const wrapper = w.find('#dyn') as HTMLElement;
        expect(wrapper).not.toBeNull();
        expect(wrapper.hasAttribute('@click')).toBe(false);
        expect(wrapper.hasAttribute(':title')).toBe(false);
        expect(wrapper.hasAttribute('cv-show')).toBe(false);
        // Plain id stayed:
        expect(wrapper.id).toBe('dyn');
        w.destroy();
    });

    it('passes `:prop` bindings to child as data', async () => {
        const ChildWithProp = {
            data: { msg: 'default' },
            template: '<p>{{ msg }}</p>',
        };
        const w = await mount({
            template: '<div><component :is="active" :msg="title"></component></div>',
            data: { active: 'c', title: 'from parent' },
            components: { c: ChildWithProp },
        });
        expect(w.text()).toBe('from parent');
        w.destroy();
    });
});
