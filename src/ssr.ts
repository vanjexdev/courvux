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
import {
    _startHeadCollection,
    _stopHeadCollection,
    type HeadConfig,
    type HeadMeta,
    type HeadLink,
    type HeadScript,
} from './head.js';

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

// ─── Page rendering with head collection (used by SSG plugin) ────────────

export interface RenderedPage {
    html: string;
    head: HeadConfig;
}

/**
 * Render a component config to HTML and collect any head metadata declared
 * via `useHead()` during the render. Returns `{ html, head }`.
 *
 * Unlike `renderToString`, this also invokes `onMount` on a best-effort basis
 * so components that call `useHead` inside `onMount` (the recommended pattern)
 * have their head captured. Errors thrown by `onMount` are caught and ignored
 * — guard SSR-incompatible code with `typeof window === 'undefined'` or skip
 * non-SSR work in `onMount`.
 */
export async function renderPage(
    config: ComponentConfig,
    options: { data?: Record<string, any> } = {}
): Promise<RenderedPage> {
    _startHeadCollection();
    let html = '';
    let state: any;
    try {
        if (typeof document === 'undefined') {
            throw new Error(
                '[courvux/ssr] renderPage requires a DOM environment (jsdom or happy-dom).'
            );
        }

        const template = config.template ?? '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = template;

        state = buildState({ ...config, data: { ...config.data, ...options.data } });

        try { await config.onBeforeMount?.call(state); } catch { /* */ }
        if (template) await runWalkSSR(wrapper, state);
        try { await config.onMount?.call(state); } catch { /* SSR-incompatible onMount work */ }

        const root = wrapper.firstElementChild;
        if (root) root.setAttribute(SSR_ATTR, 'true');

        html = wrapper.innerHTML;
    } finally {
        const collected = _stopHeadCollection();
        var head: HeadConfig = mergeHeads(collected);
    }
    return { html, head };
}

function mergeHeads(heads: HeadConfig[]): HeadConfig {
    const merged: HeadConfig = { meta: [], link: [], script: [], htmlAttrs: {}, bodyAttrs: {} };
    let title: string | undefined;
    let titleTemplate: HeadConfig['titleTemplate'];

    for (const h of heads) {
        if (h.title !== undefined) title = h.title;
        if (h.titleTemplate !== undefined) titleTemplate = h.titleTemplate;
        if (h.meta) merged.meta!.push(...h.meta);
        if (h.link) merged.link!.push(...h.link);
        if (h.script) merged.script!.push(...h.script);
        if (h.htmlAttrs) Object.assign(merged.htmlAttrs!, h.htmlAttrs);
        if (h.bodyAttrs) Object.assign(merged.bodyAttrs!, h.bodyAttrs);
    }

    if (title !== undefined) merged.title = title;
    if (titleTemplate !== undefined) merged.titleTemplate = titleTemplate;

    // Dedupe meta — last write wins per key
    const metaByKey = new Map<string, HeadMeta>();
    for (const m of merged.meta!) {
        const key = m.name ? `name:${m.name}`
            : m.property ? `property:${m.property}`
            : m['http-equiv'] ? `http-equiv:${m['http-equiv']}`
            : m.charset ? 'charset' : `_${metaByKey.size}`;
        metaByKey.set(key, m);
    }
    merged.meta = Array.from(metaByKey.values());

    // Dedupe link — canonical is unique; rel+href otherwise
    const linkByKey = new Map<string, HeadLink>();
    for (const l of merged.link!) {
        const key = l.rel === 'canonical' ? 'canonical'
            : `${l.rel}:${l.href}`;
        linkByKey.set(key, l);
    }
    merged.link = Array.from(linkByKey.values());

    return merged;
}

/**
 * Render head config to a HTML string suitable for placing inside `<head>`.
 * Used by the SSG plugin and available for custom server setups.
 */
export function renderHeadToString(head: HeadConfig): string {
    const parts: string[] = [];

    if (head.title !== undefined) {
        const tpl = head.titleTemplate;
        const finalTitle = typeof tpl === 'function'
            ? tpl(head.title)
            : typeof tpl === 'string'
                ? tpl.replace('%s', head.title)
                : head.title;
        parts.push(`<title>${escapeHtml(finalTitle)}</title>`);
    }

    head.meta?.forEach(m => parts.push(renderTag('meta', m as Record<string, any>)));
    head.link?.forEach(l => parts.push(renderTag('link', l as Record<string, any>)));
    head.script?.forEach(s => {
        const { innerHTML, ...attrs } = s as any;
        const attrStr = renderAttrs(attrs);
        const inner = innerHTML ?? '';
        parts.push(`<script${attrStr}>${inner}</script>`);
    });

    return parts.join('\n    ');
}

function renderTag(name: string, attrs: Record<string, any>): string {
    return `<${name}${renderAttrs(attrs)}>`;
}

function renderAttrs(attrs: Record<string, any>): string {
    return Object.entries(attrs)
        .filter(([_, v]) => v !== undefined && v !== null && v !== false)
        .map(([k, v]) => v === true ? ` ${k}` : ` ${k}="${escapeAttr(String(v))}"`)
        .join('');
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]!));
}

function escapeAttr(s: string): string {
    return s.replace(/[&"]/g, c => ({ '&': '&amp;', '"': '&quot;' }[c]!));
}
