/**
 * Courvux SSR — renderToString + hydration
 *
 * Server-side usage (requires jsdom or happy-dom as peer dep):
 *
 *   import { JSDOM } from 'jsdom';
 *   import { renderToString } from 'courvux/ssr';
 *   const { window } = new JSDOM('<!DOCTYPE html><html><body></body></html>');
 *   globalThis.document = window.document;
 *
 *   const html = await renderToString({ template: '<p>{{ msg }}</p>', data: { msg: 'Hello' } });
 *   // → '<p data-courvux-ssr="true">Hello</p>'
 *
 * Client-side hydration:
 *   createApp(config).mount('#app');  // auto-detects data-courvux-ssr and skips first render
 */

import type { ComponentConfig } from './types.js';
import { walk } from './dom.js';
import { createReactivityScope } from './reactivity.js';

export const SSR_ATTR = 'data-courvux-ssr';

async function runWalkSSR(el: Element, state: any): Promise<void> {
    const { subscribe } = createReactivityScope();
    const context = { subscribe, refs: {} };
    await walk(el as any, state, context as any);
}

function buildState(config: ComponentConfig): any {
    const raw = { ...(config.data ?? {}), ...(config.methods ?? {}) };
    const state = new Proxy(raw as Record<string, any>, {
        get: (t, k: string) => t[k],
        set: (t, k: string, v) => { t[k] = v; return true; },
    });
    if (config.computed) {
        for (const [k, def] of Object.entries(config.computed)) {
            const getter = typeof def === 'function' ? def : def.get;
            try { (state as any)[k] = getter.call(state); } catch { /* skip */ }
        }
    }
    return state;
}

/**
 * Render a component config to an HTML string.
 * Requires a DOM environment (jsdom / happy-dom) available via globalThis.document.
 */
export async function renderToString(
    config: ComponentConfig,
    options: { data?: Record<string, any> } = {}
): Promise<string> {
    if (typeof document === 'undefined') {
        throw new Error(
            '[courvux/ssr] renderToString requires a DOM environment.\n' +
            'Set up jsdom or happy-dom before calling renderToString:\n\n' +
            "  import { JSDOM } from 'jsdom';\n" +
            "  const { window } = new JSDOM('<!DOCTYPE html>');\n" +
            '  globalThis.document = window.document;\n' +
            '  globalThis.window = window;'
        );
    }

    const template = config.template ?? '';
    if (!template) return '';

    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const state = buildState({ ...config, data: { ...config.data, ...options.data } });

    config.onBeforeMount?.call(state);
    await runWalkSSR(wrapper, state);

    // Mark root element with SSR attr so client knows to hydrate
    const root = wrapper.firstElementChild;
    if (root) root.setAttribute(SSR_ATTR, 'true');

    return wrapper.innerHTML;
}

/**
 * Detect whether an element was server-rendered and should be hydrated
 * instead of re-rendered.
 */
export function isSSR(el: HTMLElement): boolean {
    return el.hasAttribute(SSR_ATTR) ||
        el.querySelector(`[${SSR_ATTR}]`) !== null;
}
