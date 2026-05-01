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
import { walk, evaluate } from './dom.js';
import { createReactivityScope, toRaw } from './reactivity.js';
import {
    _startHeadCollection,
    _stopHeadCollection,
    type HeadConfig,
    type HeadMeta,
    type HeadLink,
    type HeadScript,
} from './head.js';

export const SSR_ATTR = 'data-courvux-ssr';

async function runWalkSSR(el: Element, state: any, extraContext: Record<string, any> = {}): Promise<void> {
    const { subscribe } = createReactivityScope();
    const context = { subscribe, refs: {}, ...extraContext };
    await walk(el as any, state, context as any);
}

/**
 * Slimmed-down `mountElement` for SSG. Resolves `:prop` bindings from parent
 * state, builds child state, runs `onBeforeMount` / `onMount` so `useHead`
 * and ref-using setup (e.g. Prism syntax highlight in CodeBlock) execute,
 * walks the child template with the same SSG context (so nested custom
 * components are also rendered), and replaces the original element with the
 * rendered output.
 *
 * Differences vs the runtime `createMountElement`:
 *  - No reactivity subscriptions / prop bindings / emit handlers / cv-model
 *    wiring (one-shot render — no events fire post-render).
 *  - Slot support is default-slot only (named/scoped slots are skipped for
 *    now; client hydration restores them).
 *  - `$emit` is a no-op.
 */
async function ssgMountElement(
    el: HTMLElement,
    tagName: string,
    parentState: any,
    parentContext: any,
    components: Record<string, ComponentConfig>
): Promise<void> {
    const componentConfig = components[tagName];
    if (!componentConfig) return;

    // Resolve props from `:prop="expr"` and gather $attrs (non-framework attrs).
    const props: Record<string, any> = {};
    const $attrs: Record<string, string> = {};
    Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith(':')) {
            const propName = attr.name.slice(1);
            try { props[propName] = toRaw(evaluate(attr.value, parentState)); }
            catch { /* skip props that fail to evaluate */ }
        } else if (
            !attr.name.startsWith('@') &&
            !attr.name.startsWith('cv:on:') &&
            !attr.name.startsWith('cv-model') &&
            !attr.name.startsWith('v-slot') &&
            attr.name !== 'slot'
        ) {
            $attrs[attr.name] = attr.value;
        }
    });

    // Capture default-slot children (anything without `slot` attr).
    const defaultSlotNodes: Node[] = [];
    Array.from(el.childNodes).forEach(n => {
        if (n.nodeType === 1 && (n as HTMLElement).getAttribute('slot')) return;
        defaultSlotNodes.push(n.cloneNode(true));
    });

    // Build a child state with props merged and a no-op $emit.
    const data = typeof componentConfig.data === 'function'
        ? await (componentConfig.data as any)()
        : (componentConfig.data ?? {});
    const childRaw: Record<string, any> = {
        ...data,
        ...(componentConfig.methods ?? {}),
        ...props,
        $attrs,
        $refs: {} as Record<string, any>,
        $emit: () => {},
    };
    const childState = new Proxy(childRaw, {
        get: (t, k: string) => t[k],
        set: (t, k: string, v) => { t[k] = v; return true; },
    });
    if (componentConfig.computed) {
        for (const [k, def] of Object.entries(componentConfig.computed)) {
            const getter = typeof def === 'function' ? def : def.get;
            try { (childState as any)[k] = getter.call(childState); } catch { /* */ }
        }
    }

    // Render template into a wrapper, then walk recursively with SSG context.
    const template = componentConfig.template ?? '';
    if (!template) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    // Resolve <slot> placeholders to the captured default-slot nodes.
    const slots = wrapper.querySelectorAll('slot:not([name])');
    slots.forEach(slot => {
        const frag = document.createDocumentFragment();
        defaultSlotNodes.forEach(n => frag.appendChild(n.cloneNode(true)));
        slot.replaceWith(frag);
    });

    // Walk children with the same SSG context so nested custom components,
    // router-link, useHead, etc. all keep working.
    const ssgCtx = {
        ...parentContext,
        refs: childRaw.$refs,
        // Propagate nested components map and the same ssgMountElement so
        // child→grandchild custom components also render.
    };

    try { await componentConfig.onBeforeMount?.call(childState); } catch { /* */ }
    await walk(wrapper as any, childState, ssgCtx as any);
    try { await componentConfig.onMount?.call(childState); } catch { /* */ }

    // Strip framework attributes the walk processed but didn't remove from
    // the DOM (`:prop` bindings, `cv-html`, etc.). Their resolved values are
    // already baked into the static `class`/`style`/etc. attributes, so
    // leaving the source bindings would (a) ship dead bytes and (b) make
    // client-side hydration re-evaluate them in the wrong scope (e.g. the
    // page's parent state, where the inner-component's `lang` is undefined).
    // It also avoids iOS Safari `InvalidCharacterError`s seen in practice
    // when colon-prefixed attribute names survive into the hydrated DOM.
    // `@event` listeners are preserved — the client still needs to wire them
    // for interactive controls (like a Copy button).
    const stripFrameworkAttrs = (root: Element) => {
        const all = root.querySelectorAll('*');
        const els: Element[] = [root, ...Array.from(all)];
        for (const node of els) {
            for (const attr of Array.from(node.attributes)) {
                if (
                    attr.name.startsWith(':') ||
                    attr.name.startsWith('cv-html')
                ) {
                    node.removeAttribute(attr.name);
                }
            }
        }
    };
    Array.from(wrapper.children).forEach(child => stripFrameworkAttrs(child));

    // Replace original element with rendered output (preserve as a fragment).
    const out = document.createDocumentFragment();
    while (wrapper.firstChild) out.appendChild(wrapper.firstChild);
    el.replaceWith(out);
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
    options: {
        data?: Record<string, any>;
        router?: { mode?: 'hash' | 'history'; base?: string };
        components?: Record<string, ComponentConfig>;
    } = {}
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

        // Inject a minimal router shape so router-link renders mode-aware
        // hrefs (history-mode + base prefix) in the emitted HTML.
        const extraCtx: Record<string, any> = {};
        if (options.router) {
            extraCtx.router = {
                mode: options.router.mode ?? 'history',
                base: options.router.base ?? '',
            };
        }

        // Custom-component support during SSG: register components and a
        // mountElement that produces static HTML. Without these the walk()
        // leaves <my-comp> tags unrendered in the output (crawler-invisible).
        const allComponents: Record<string, ComponentConfig> = {
            ...(config.components ?? {}),
            ...(options.components ?? {}),
        };
        if (Object.keys(allComponents).length > 0) {
            extraCtx.components = allComponents;
            extraCtx.mountElement = (
                el: HTMLElement,
                tagName: string,
                pState: any,
                pContext: any
            ) => ssgMountElement(el, tagName, pState, pContext, allComponents);
        }

        try { await config.onBeforeMount?.call(state); } catch { /* */ }
        if (template) await runWalkSSR(wrapper, state, extraCtx);
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
