import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-model', () => {
    it('sets initial value on input', async () => {
        const w = await mount({
            template: '<input cv-model="name">',
            data: { name: 'hello' }
        });
        expect((w.find('input') as HTMLInputElement)?.value).toBe('hello');
        w.destroy();
    });

    it('updates state on user input', async () => {
        const w = await mount({
            template: '<input cv-model="name">',
            data: { name: '' }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = 'world';
        await w.trigger(input, 'input');
        expect(w.state.name).toBe('world');
        w.destroy();
    });

    it('updates input when state changes', async () => {
        const w = await mount({
            template: '<input cv-model="name">',
            data: { name: 'a' }
        });
        w.state.name = 'z';
        await w.nextTick();
        expect((w.find('input') as HTMLInputElement)?.value).toBe('z');
        w.destroy();
    });

    it('.number modifier coerces value', async () => {
        const w = await mount({
            template: '<input cv-model.number="qty" type="number">',
            data: { qty: 0 }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = '42';
        await w.trigger(input, 'input');
        expect(typeof w.state.qty).toBe('number');
        expect(w.state.qty).toBe(42);
        w.destroy();
    });

    it('.trim modifier trims whitespace', async () => {
        const w = await mount({
            template: '<input cv-model.trim="name">',
            data: { name: '' }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = '  hi  ';
        await w.trigger(input, 'input');
        expect(w.state.name).toBe('hi');
        w.destroy();
    });

    it('checkbox binds boolean', async () => {
        const w = await mount({
            template: '<input type="checkbox" cv-model="checked">',
            data: { checked: false }
        });
        const cb = w.find('input') as HTMLInputElement;
        expect(cb.checked).toBe(false);
        cb.checked = true;
        await w.trigger(cb, 'change');
        expect(w.state.checked).toBe(true);
        w.destroy();
    });

    // Regression: cv-model's read side accepted bracket notation (handled by
    // evaluate's new Function path), but setStateValue only parsed dot paths,
    // so user input was silently dropped — input looked "live but disconnected".
    it('writes back to bracket notation with a literal key', async () => {
        const w = await mount({
            template: '<input cv-model="form[\'first_name\']">',
            data: { form: { first_name: '' } }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = 'Ada';
        await w.trigger(input, 'input');
        expect((w.state as any).form.first_name).toBe('Ada');
        w.destroy();
    });

    it('writes back to bracket notation with a dynamic key from state', async () => {
        const w = await mount({
            template: '<input cv-model="draft[colKey]">',
            data: { draft: { backlog: '' }, colKey: 'backlog' }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = 'Buy milk';
        await w.trigger(input, 'input');
        expect((w.state as any).draft.backlog).toBe('Buy milk');
        w.destroy();
    });

    it('writes back to a deep dot path', async () => {
        const w = await mount({
            template: '<input cv-model="user.profile.name">',
            data: { user: { profile: { name: '' } } }
        });
        const input = w.find('input') as HTMLInputElement;
        input.value = 'Grace';
        await w.trigger(input, 'input');
        expect((w.state as any).user.profile.name).toBe('Grace');
        w.destroy();
    });
});
