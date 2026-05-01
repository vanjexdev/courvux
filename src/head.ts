// useHead — per-component head management for SEO and metadata.
//
// Returns a cleanup function. Pass it to `this.$addCleanup(useHead({...}))`
// inside `onMount` so the tags are reverted when the component is destroyed
// (e.g. on route change).
//
// Dedupe rules:
//   - title: stored and restored on cleanup
//   - meta:  by `name`, `property`, or `http-equiv` — existing tag's attrs are
//            captured and restored on cleanup
//   - link:  `rel="canonical"` is unique; other links dedupe by `rel + href`
//   - script: always inserted fresh (use sparingly — scripts have side effects)
//   - htmlAttrs / bodyAttrs: previous values captured and restored on cleanup
//
// SSR-safe: returns a no-op cleanup when `document` is unavailable. SSG
// integration that captures these tags during `renderToString` is a separate
// concern (see roadmap).

export interface HeadMeta {
    name?: string;
    property?: string;
    'http-equiv'?: string;
    charset?: string;
    content?: string;
    [key: string]: string | undefined;
}

export interface HeadLink {
    rel: string;
    href?: string;
    [key: string]: string | undefined;
}

export interface HeadScript {
    src?: string;
    type?: string;
    async?: boolean | string;
    defer?: boolean | string;
    innerHTML?: string;
    [key: string]: string | boolean | undefined;
}

export interface HeadConfig {
    title?: string;
    titleTemplate?: string | ((title: string) => string);
    meta?: HeadMeta[];
    link?: HeadLink[];
    script?: HeadScript[];
    htmlAttrs?: Record<string, string>;
    bodyAttrs?: Record<string, string>;
}

interface ManagedTag {
    el: Element;
    prevAttrs?: Record<string, string>;
    created: boolean;
}

// SSR collection mode — populated by renderPage in src/ssr.ts during static
// generation. When non-null, useHead() pushes its config here instead of
// touching the document.
//
// Stored on globalThis so the framework's own modules and code that imports
// `useHead` from a different module-cache slot (e.g. through a pnpm symlink)
// see the same buffer. Without this, SSG-time `useHead` calls coming from
// the user's bundle resolve to a separate module instance and are dropped.
const HEAD_KEY = '__COURVUX_HEAD_COLLECTOR__';

function getCollected(): HeadConfig[] | null {
    return (globalThis as any)[HEAD_KEY] ?? null;
}

function setCollected(v: HeadConfig[] | null): void {
    (globalThis as any)[HEAD_KEY] = v;
}

/** @internal — used by `renderPage` in src/ssr.ts to capture head calls during SSG. */
export function _startHeadCollection(): void {
    setCollected([]);
}

/** @internal — called by `renderPage` to retrieve and reset the collected head. */
export function _stopHeadCollection(): HeadConfig[] {
    const result = getCollected() ?? [];
    setCollected(null);
    return result;
}

const setAttrs = (el: Element, attrs: Record<string, any>): void => {
    Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'innerHTML') return;
        if (v == null || v === false) return;
        el.setAttribute(k, v === true ? '' : String(v));
    });
};

const captureAttrs = (el: Element): Record<string, string> => {
    const snap: Record<string, string> = {};
    Array.from(el.attributes).forEach(a => { snap[a.name] = a.value; });
    return snap;
};

const restoreAttrs = (el: Element, attrs: Record<string, string>): void => {
    Array.from(el.attributes).forEach(a => el.removeAttribute(a.name));
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
};

const upsertTag = (
    tagName: 'meta' | 'link',
    attrs: Record<string, any>,
    selector: string | null,
    managed: ManagedTag[]
): void => {
    let el: Element | null = selector ? document.head.querySelector(selector) : null;
    if (el) {
        managed.push({ el, prevAttrs: captureAttrs(el), created: false });
        Array.from(el.attributes).forEach(a => el!.removeAttribute(a.name));
    } else {
        el = document.createElement(tagName);
        document.head.appendChild(el);
        managed.push({ el, created: true });
    }
    setAttrs(el, attrs);
};

export function useHead(config: HeadConfig): () => void {
    // SSG / SSR collection mode — capture without touching the document.
    const collected = getCollected();
    if (collected !== null) {
        collected.push(config);
        return () => {};
    }
    if (typeof document === 'undefined') return () => {};

    const managed: ManagedTag[] = [];
    let prevTitle: string | undefined;
    const prevHtmlAttrs: Record<string, string | null> = {};
    const prevBodyAttrs: Record<string, string | null> = {};

    if (config.title !== undefined) {
        prevTitle = document.title;
        const tpl = config.titleTemplate;
        const final = typeof tpl === 'function'
            ? tpl(config.title)
            : typeof tpl === 'string'
                ? tpl.replace('%s', config.title)
                : config.title;
        document.title = final;
    }

    config.meta?.forEach(m => {
        const sel = m.name
            ? `meta[name="${CSS.escape(m.name)}"]`
            : m.property
                ? `meta[property="${CSS.escape(m.property)}"]`
                : m['http-equiv']
                    ? `meta[http-equiv="${CSS.escape(m['http-equiv'])}"]`
                    : null;
        upsertTag('meta', m, sel, managed);
    });

    config.link?.forEach(l => {
        const sel = l.rel === 'canonical'
            ? 'link[rel="canonical"]'
            : (l.rel && l.href)
                ? `link[rel="${CSS.escape(l.rel)}"][href="${CSS.escape(l.href)}"]`
                : null;
        upsertTag('link', l, sel, managed);
    });

    config.script?.forEach(s => {
        const el = document.createElement('script');
        Object.entries(s).forEach(([k, v]) => {
            if (k === 'innerHTML') el.textContent = String(v);
            else if (v != null && v !== false) el.setAttribute(k, v === true ? '' : String(v));
        });
        document.head.appendChild(el);
        managed.push({ el, created: true });
    });

    if (config.htmlAttrs) {
        Object.entries(config.htmlAttrs).forEach(([k, v]) => {
            prevHtmlAttrs[k] = document.documentElement.getAttribute(k);
            document.documentElement.setAttribute(k, v);
        });
    }

    if (config.bodyAttrs) {
        Object.entries(config.bodyAttrs).forEach(([k, v]) => {
            prevBodyAttrs[k] = document.body.getAttribute(k);
            document.body.setAttribute(k, v);
        });
    }

    return function cleanup() {
        if (prevTitle !== undefined) document.title = prevTitle;
        managed.forEach(({ el, prevAttrs, created }) => {
            if (created) {
                el.parentNode?.removeChild(el);
            } else if (prevAttrs) {
                restoreAttrs(el, prevAttrs);
            }
        });
        Object.entries(prevHtmlAttrs).forEach(([k, v]) => {
            if (v === null) document.documentElement.removeAttribute(k);
            else document.documentElement.setAttribute(k, v);
        });
        Object.entries(prevBodyAttrs).forEach(([k, v]) => {
            if (v === null) document.body.removeAttribute(k);
            else document.body.setAttribute(k, v);
        });
    };
}
