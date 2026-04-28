import { createStore } from './store.js';

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
