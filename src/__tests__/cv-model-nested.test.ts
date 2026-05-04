import { describe, it, expect } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-model — reactivity through nested object paths', () => {
    it('updates input value when nested form property is mutated programmatically', async () => {
        // Regression: cv-model used subscribeExpr (exact-key match) instead of
        // subscribeDeps (root-key + reactivity propagation). Setting
        // state.form.first_name from a method left the input untouched
        // because notifyKey('form') never reached a listener registered
        // under the dotted key 'form.first_name'.
        const w = await mount({
            template: `
                <div>
                    <input cv-model="form.first_name" />
                    <input cv-model="form.last_name" />
                    <button @click="hydrate()">hydrate</button>
                </div>
            `,
            data: {
                form: { first_name: '', last_name: '' },
            },
            methods: {
                hydrate(this: any) {
                    this.form.first_name = 'Jane';
                    this.form.last_name = 'Doe';
                },
            },
        });
        const inputs = w.findAll<HTMLInputElement>('input');
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');

        w.find<HTMLButtonElement>('button')!.click();
        await w.nextTick();

        expect(inputs[0].value).toBe('Jane');
        expect(inputs[1].value).toBe('Doe');
        w.destroy();
    });

    it('checkbox cv-model on nested boolean reflects programmatic change', async () => {
        const w = await mount({
            template: `
                <div>
                    <input type="checkbox" cv-model="prefs.subscribed" />
                </div>
            `,
            data: { prefs: { subscribed: false } },
        });
        const cb = w.find<HTMLInputElement>('input[type=checkbox]')!;
        expect(cb.checked).toBe(false);

        w.state.prefs.subscribed = true;
        await w.nextTick();
        expect(cb.checked).toBe(true);
        w.destroy();
    });

    it('select cv-model on nested string reflects programmatic change', async () => {
        const w = await mount({
            template: `
                <div>
                    <select cv-model="form.locale">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </select>
                </div>
            `,
            data: { form: { locale: 'es' } },
        });
        const sel = w.find<HTMLSelectElement>('select')!;
        expect(sel.value).toBe('es');

        w.state.form.locale = 'en';
        await w.nextTick();
        expect(sel.value).toBe('en');
        w.destroy();
    });
});
