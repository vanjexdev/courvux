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
export declare const SSR_ATTR = "data-courvux-ssr";
/**
 * Render a component config to an HTML string.
 * Requires a DOM environment (jsdom / happy-dom) available via globalThis.document.
 */
export declare function renderToString(config: ComponentConfig, options?: {
    data?: Record<string, any>;
}): Promise<string>;
/**
 * Detect whether an element was server-rendered and should be hydrated
 * instead of re-rendered.
 */
export declare function isSSR(el: HTMLElement): boolean;
