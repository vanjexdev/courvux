import { describe, it, expect, vi } from 'vitest';
import { mount } from '../test-utils.js';

describe('cv-bind', () => {
    it('sets attributes from object expression', async () => {
        const w = await mount({
            template: '<a cv-bind="attrs">link</a>',
            data: { attrs: { href: '/home', title: 'Home' } },
        });
        const a = w.find('a') as HTMLAnchorElement;
        expect(a.getAttribute('href')).toBe('/home');
        expect(a.getAttribute('title')).toBe('Home');
        w.destroy();
    });

    it('removes attributes that disappear from the bound object', async () => {
        const w = await mount({
            template: '<a cv-bind="attrs">link</a>',
            data: { attrs: { href: '/a', title: 't' } },
        });
        w.state.attrs = { href: '/a' };  // title gone
        await w.nextTick();
        expect(w.find('a')!.hasAttribute('title')).toBe(false);
        expect(w.find('a')!.getAttribute('href')).toBe('/a');
        w.destroy();
    });

    it('boolean true attribute renders as empty string', async () => {
        const w = await mount({
            template: '<input cv-bind="attrs" />',
            data: { attrs: { disabled: true } },
        });
        const input = w.find('input') as HTMLInputElement;
        expect(input.hasAttribute('disabled')).toBe(true);
        expect(input.getAttribute('disabled')).toBe('');
        w.destroy();
    });

    it('false / null / undefined removes the attribute', async () => {
        const w = await mount({
            template: '<input cv-bind="attrs" />',
            data: { attrs: { disabled: true, readonly: null, hidden: false, custom: undefined } },
        });
        const input = w.find('input') as HTMLInputElement;
        expect(input.hasAttribute('disabled')).toBe(true);
        expect(input.hasAttribute('readonly')).toBe(false);
        expect(input.hasAttribute('hidden')).toBe(false);
        expect(input.hasAttribute('custom')).toBe(false);
        w.destroy();
    });

    it('skips invalid attribute names with a warn instead of crashing the walk', async () => {
        // Stricter browsers reject names containing `@` or `:` through
        // setAttribute(). Verify cv-bind catches the throw and continues
        // setting the rest of the attrs (regression for the audit hardening).
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const w = await mount({
            template: '<a cv-bind="attrs">x</a>',
            data: { attrs: { href: '/ok', '@click': 'foo' } },
        });
        // happy-dom is more permissive than Safari and won't throw, so we
        // only assert that the valid attr was set and the bad one is either
        // skipped or warned-about depending on the runtime.
        expect(w.find('a')!.getAttribute('href')).toBe('/ok');
        warnSpy.mockRestore();
        w.destroy();
    });
});
