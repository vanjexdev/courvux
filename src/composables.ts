import { createStore } from './store.js';
import type { ComputedDef, WatcherEntry } from './types.js';

// cvStorage — store backed by localStorage; auto-persists on every mutation
export function cvStorage<T extends Record<string, any>>(
    key: string,
    defaults: T
): T & { $clear(): void } {
    let saved: Partial<T> = {};
    try {
        if (typeof localStorage !== 'undefined') {
            const raw = localStorage.getItem(key);
            if (raw) saved = JSON.parse(raw);
        }
    } catch { /* ignore parse errors */ }

    const persist = () => {
        try {
            const snap: Record<string, any> = {};
            Object.keys(defaults).forEach(k => { snap[k] = (store as any)[k]; });
            localStorage.setItem(key, JSON.stringify(snap));
        } catch { /* ignore storage errors */ }
    };

    const store = createStore<T & { $clear(): void }>({
        state: { ...defaults, ...saved } as T & { $clear(): void },
        actions: {
            $clear(this: T) {
                Object.keys(defaults).forEach((k: string) => { (this as any)[k] = (defaults as any)[k]; });
                try { if (typeof localStorage !== 'undefined') localStorage.removeItem(key); } catch { /* */ }
            }
        },
        onChange: () => persist(),
    });

    return store;
}

// cvListener — add DOM event listener and return cleanup function
export function cvListener<K extends keyof WindowEventMap>(
    target: EventTarget,
    event: K | string,
    handler: (e: any) => void,
    options?: AddEventListenerOptions
): () => void {
    target.addEventListener(event, handler as EventListener, options);
    return () => target.removeEventListener(event, handler as EventListener, options);
}

// cvMediaQuery — fires callback immediately with initial value, then on every change
// Returns cleanup; pass to $addCleanup for auto-teardown
export function cvMediaQuery(
    query: string,
    callback: (matches: boolean) => void
): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) {
        callback(false);
        return () => {};
    }
    const mql = window.matchMedia(query);
    callback(mql.matches);
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
}

export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}

export interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    immediate?: boolean;
    transform?: (raw: any) => any;
}

// cvFetch — reactive data fetching; fires callback with { data, loading, error }
// Returns { execute(url?), abort() } — pass abort to $addCleanup
export function cvFetch<T = any>(
    initialUrl: string,
    callback: (state: FetchState<T>) => void,
    options: FetchOptions = {}
): { execute(url?: string): void; abort(): void } {
    let abortCtrl: AbortController | null = null;
    const { method = 'GET', headers = {}, body, transform, immediate = true } = options;

    const execute = (url: string = initialUrl) => {
        abortCtrl?.abort();
        abortCtrl = new AbortController();
        callback({ data: null, loading: true, error: null });

        const reqOpts: RequestInit = { method, headers, signal: abortCtrl.signal };
        if (body !== undefined) reqOpts.body = typeof body === 'string' ? body : JSON.stringify(body);

        fetch(url, reqOpts)
            .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
            .then(raw => callback({ data: transform ? transform(raw) : raw, loading: false, error: null }))
            .catch(err => { if (err?.name !== 'AbortError') callback({ data: null, loading: false, error: err }); });
    };

    const abort = () => { abortCtrl?.abort(); abortCtrl = null; };

    if (immediate) execute(initialUrl);

    return { execute, abort };
}

// cvDebounce — returns debounced version of fn; preserves `this` binding for use in methods
export function cvDebounce<T extends (this: any, ...args: any[]) => any>(fn: T, delay: number): T & { cancel(): void } {
    let timer: ReturnType<typeof setTimeout>;
    const debounced = function(this: any, ...args: any[]) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    } as T & { cancel(): void };
    debounced.cancel = () => clearTimeout(timer);
    return debounced;
}

// cvThrottle — returns throttled version of fn; preserves `this` binding for use in methods
export function cvThrottle<T extends (this: any, ...args: any[]) => any>(fn: T, delay: number): T & { cancel(): void } {
    let lastTime = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const throttled = function(this: any, ...args: any[]) {
        const now = Date.now();
        const remaining = delay - (now - lastTime);
        if (remaining <= 0) {
            clearTimeout(timer);
            lastTime = now;
            fn.apply(this, args);
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => { lastTime = Date.now(); fn.apply(this, args); }, remaining);
        }
    } as T & { cancel(): void };
    throttled.cancel = () => { clearTimeout(timer); lastTime = 0; };
    return throttled;
}

// ── defineComposable / useComposables ────────────────────────────────────────
// Reusable bundle of data, methods, computed, watch and lifecycle hooks that
// can be spread into a component config. Keeps logic portable across
// components without coupling to the global store.

export interface ComposableConfig {
    data?: Record<string, any>;
    methods?: Record<string, Function>;
    computed?: Record<string, ComputedDef>;
    watch?: Record<string, WatcherEntry>;
    onBeforeMount?(this: any): void;
    onMount?(this: any): void;
    onBeforeUpdate?(this: any): void;
    onUpdated?(this: any): void;
    onBeforeUnmount?(this: any): void;
    onDestroy?(this: any): void;
}

export type ComposableFactory<TArgs extends any[] = any[]> = (...args: TArgs) => ComposableConfig;

// Identity helper. Exists for type-inference + intent ("this is a composable").
// `defineComposable(fn)` is `fn`; the runtime is a no-op.
export function defineComposable<TArgs extends any[]>(
    factory: ComposableFactory<TArgs>
): ComposableFactory<TArgs> {
    return factory;
}

const COMPOSABLE_HOOKS: Array<keyof ComposableConfig> = [
    'onBeforeMount', 'onMount', 'onBeforeUpdate', 'onUpdated', 'onBeforeUnmount', 'onDestroy'
];

// Merge multiple composable configs (or plain config-like objects) into one.
// First-writer wins for data/methods/computed/watch; collisions log a warning.
// Hooks run in insertion order.
export function useComposables(...composables: ComposableConfig[]): ComposableConfig {
    const merged: ComposableConfig = { data: {}, methods: {}, computed: {}, watch: {} };
    const hookFns: Record<string, Array<(this: any) => void>> = {};

    const mergeBucket = (bucket: 'data' | 'methods' | 'computed' | 'watch', src: Record<string, any> | undefined) => {
        if (!src) return;
        const dest = merged[bucket] as Record<string, any>;
        for (const k of Object.keys(src)) {
            if (k in dest) {
                console.warn(`[courvux] useComposables: ${bucket} key "${k}" already defined; ignoring duplicate.`);
                continue;
            }
            dest[k] = src[k];
        }
    };

    for (const c of composables) {
        if (!c) continue;
        mergeBucket('data', c.data);
        mergeBucket('methods', c.methods);
        mergeBucket('computed', c.computed);
        mergeBucket('watch', c.watch);
        for (const h of COMPOSABLE_HOOKS) {
            const fn = c[h];
            if (typeof fn === 'function') {
                (hookFns[h] ||= []).push(fn as (this: any) => void);
            }
        }
    }

    for (const h of COMPOSABLE_HOOKS) {
        const arr = hookFns[h];
        if (arr && arr.length) {
            (merged as any)[h] = function (this: any) {
                for (const fn of arr) fn.call(this);
            };
        }
    }

    // Drop empty buckets so the spread doesn't shadow component-level keys
    // (e.g. a component declaring `data: { foo: 1 }` should win when the
    // spread didn't contribute any data).
    if (Object.keys(merged.data!).length === 0) delete merged.data;
    if (Object.keys(merged.methods!).length === 0) delete merged.methods;
    if (Object.keys(merged.computed!).length === 0) delete merged.computed;
    if (Object.keys(merged.watch!).length === 0) delete merged.watch;

    return merged;
}
