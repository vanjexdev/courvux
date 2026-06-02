import { describe, it, expect } from 'vitest';
import { createApp, createRouter } from '../index.js';

describe('iframe-like environments', () => {
    it('mounts even when document.baseURI is about:blank', async () => {
        const root = document.createElement('div');
        document.body.appendChild(root);

        const baseDesc = Object.getOwnPropertyDescriptor(document, 'baseURI');
        Object.defineProperty(document, 'baseURI', { configurable: true, value: 'about:blank' });

        try {
            await createApp({ template: '<p>Hello iframe</p>' }).mountEl(root);
            expect(root.innerHTML).toContain('Hello iframe');
        } finally {
            if (baseDesc) Object.defineProperty(document, 'baseURI', baseDesc);
        }
    });

    it('history router treats non-slash pathname as root', async () => {
        const root = document.createElement('div');
        document.body.appendChild(root);

        const pathDesc = Object.getOwnPropertyDescriptor(window.location, 'pathname');
        Object.defineProperty(window.location, 'pathname', { configurable: true, value: 'blank' });

        try {
            const router = createRouter(
                [{ path: '/', component: { template: '<h1>Home</h1>' } }],
                { mode: 'history' }
            );
            await createApp({ router, template: '<router-view></router-view>' }).mountEl(root);
            expect(root.innerHTML).toContain('Home');
        } finally {
            if (pathDesc) Object.defineProperty(window.location, 'pathname', pathDesc);
        }
    });
});
