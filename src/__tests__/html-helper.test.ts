import { describe, it, expect } from 'vitest';
import { html } from '../index.js';

describe('html tagged template', () => {
    it('passes plain strings through unchanged', () => {
        expect(html`<p>hello</p>`).toBe('<p>hello</p>');
    });

    it('converts \\$ to $ so Courvux interpolation survives JS template parsing', () => {
        const result = html`<p>\${{ price }}</p>`;
        expect(result).toBe('<p>${{ price }}</p>');
    });

    it('multiple \\$ escapes in same template', () => {
        const result = html`<span>\${{ a }}</span><span>\${{ b }}</span>`;
        expect(result).toBe('<span>${{ a }}</span><span>${{ b }}</span>');
    });

    it('interpolated JS values are included', () => {
        const cls = 'btn-primary';
        const result = html`<button class="${cls}">\${{ label }}</button>`;
        expect(result).toBe('<button class="btn-primary">${{ label }}</button>');
    });

    it('does not touch plain $ signs', () => {
        const result = html`<p>Price: $99</p>`;
        expect(result).toBe('<p>Price: $99</p>');
    });
});
