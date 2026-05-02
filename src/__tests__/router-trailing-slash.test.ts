import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '../test-utils.js';
import { createRouter } from '../router.js';

describe('router — trailing slash normalization', () => {
    beforeEach(() => { history.replaceState({}, '', '/'); });

    it('matches both /foo and /foo/ to the same route', async () => {
        const router = createRouter(
            [
                { path: '/', component: { template: '<p>home</p>' } },
                { path: '/about', component: { template: '<p>about</p>' } },
                { path: '*', component: { template: '<p>not-found</p>' } },
            ],
            { mode: 'history' }
        );

        const w = await mount({
            template: '<div><router-view></router-view></div>',
        }, { global: { router } });

        // Navigate via history.replaceState so the router reads pathname
        history.replaceState({}, '', '/about');
        window.dispatchEvent(new PopStateEvent('popstate'));
        await w.nextTick();
        expect(w.text()).toBe('about');

        history.replaceState({}, '', '/about/');  // trailing slash
        window.dispatchEvent(new PopStateEvent('popstate'));
        await w.nextTick();
        expect(w.text()).toBe('about');  // still matches, NOT the wildcard

        w.destroy();
    });

    it('root path stays as / (does not normalize away the slash)', async () => {
        const router = createRouter(
            [
                { path: '/', component: { template: '<p>home</p>' } },
                { path: '*', component: { template: '<p>not-found</p>' } },
            ],
            { mode: 'history' }
        );

        const w = await mount({
            template: '<div><router-view></router-view></div>',
        }, { global: { router } });

        history.replaceState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        await w.nextTick();
        expect(w.text()).toBe('home');

        w.destroy();
    });

    it('respects trailing slash with base prefix', async () => {
        const router = createRouter(
            [
                { path: '/about', component: { template: '<p>about</p>' } },
                { path: '*', component: { template: '<p>not-found</p>' } },
            ],
            { mode: 'history', base: '/courvux' }
        );

        const w = await mount({
            template: '<div><router-view></router-view></div>',
        }, { global: { router } });

        // Real GH-Pages-style URL: base + path + trailing slash
        history.replaceState({}, '', '/courvux/about/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        await w.nextTick();
        expect(w.text()).toBe('about');

        w.destroy();
    });
});
