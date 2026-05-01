import { describe, it, expect, beforeEach } from 'vitest';
import { createRouter } from '../router.js';

describe('createRouter — base option', () => {
    beforeEach(() => {
        // Reset history to a clean state for each test
        history.replaceState({}, '', '/');
    });

    it('defaults base to empty string', () => {
        const r = createRouter([{ path: '/', component: { template: '<p>x</p>' } }]);
        expect(r.base).toBe('');
    });

    it('normalizes leading slash and strips trailing slash', () => {
        const a = createRouter([], { base: 'courvux' });
        expect(a.base).toBe('/courvux');

        const b = createRouter([], { base: '/courvux/' });
        expect(b.base).toBe('/courvux');

        const c = createRouter([], { base: '/' });
        expect(c.base).toBe('');
    });

    it('navigate prepends base when writing to history', () => {
        const r = createRouter([], { mode: 'history', base: '/courvux' });
        r.navigate('/installation');
        expect(window.location.pathname).toBe('/courvux/installation');
    });

    it('navigate prepends base for the root path', () => {
        const r = createRouter([], { mode: 'history', base: '/courvux' });
        r.navigate('/');
        expect(window.location.pathname).toBe('/courvux/');
    });

    it('navigate preserves query string with base', () => {
        const r = createRouter([], { mode: 'history', base: '/courvux' });
        r.navigate('/search', { query: { q: 'test' } });
        expect(window.location.pathname).toBe('/courvux/search');
        expect(window.location.search).toBe('?q=test');
    });

    it('replace prepends base when writing to history', () => {
        const r = createRouter([], { mode: 'history', base: '/app' });
        r.replace('/dashboard');
        expect(window.location.pathname).toBe('/app/dashboard');
    });

    it('hash mode ignores base', () => {
        const r = createRouter([], { mode: 'hash', base: '/courvux' });
        r.navigate('/installation');
        expect(window.location.hash).toBe('#/installation');
    });
});
