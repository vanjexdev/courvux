const ARRAY_MUTATING = new Set(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']);

const _rawSet = new WeakSet<object>();
export const markRaw = <T extends object>(obj: T): T => { _rawSet.add(obj); return obj; };
export const isRaw = (obj: object): boolean => _rawSet.has(obj);

const RAW_SYMBOL = Symbol('raw');
export const toRaw = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') return obj;
    return ((obj as any)[RAW_SYMBOL] as T | undefined) ?? obj;
};

export function readonly<T extends object>(obj: T): Readonly<T> {
    return new Proxy(obj, {
        set(_t, key) { console.warn(`[courvux] readonly: cannot set "${String(key)}"`); return true; },
        deleteProperty(_t, key) { console.warn(`[courvux] readonly: cannot delete "${String(key)}"`); return true; }
    });
}

let _batchDepth = 0;
const _batchQueue = new Map<string, () => void>();

// Module-level dep tracking — used by computed auto-tracking across all reactive scopes
type DepEntry = { sub: (key: string, cb: Function) => () => void; key: string };
let _activeEffect: DepEntry[] | null = null;

export function collectDeps(fn: () => void): DepEntry[] {
    const deps: DepEntry[] = [];
    const prev = _activeEffect;
    _activeEffect = deps;
    try { fn(); } finally { _activeEffect = prev; }
    return deps;
}

export function batchUpdate(fn: () => void): void {
    _batchDepth++;
    try { fn(); } finally {
        _batchDepth--;
        if (_batchDepth === 0) {
            const queue = [..._batchQueue.values()];
            _batchQueue.clear();
            queue.forEach(n => n());
        }
    }
}

function makeDeepProxy(val: any, notify: () => void): any {
    if (val === null || typeof val !== 'object' || _rawSet.has(val)) return val;
    return new Proxy(val, {
        get(t, k) {
            // Propagate RAW_SYMBOL upward so toRaw() can fully unwrap nested proxies
            if (k === RAW_SYMBOL) return (t as any)[RAW_SYMBOL] ?? t;
            if (typeof k === 'string' && Array.isArray(t) && ARRAY_MUTATING.has(k)) {
                return (...args: any[]) => {
                    const result = (Array.prototype as any)[k].apply(t, args);
                    notify();
                    return result;
                };
            }
            const v = (t as any)[k as string];
            if (v !== null && typeof v === 'object' && !_rawSet.has(v as object)) return makeDeepProxy(v, notify);
            return v;
        },
        set(t, k: string, v) { t[k] = v; notify(); return true; }
    });
}

export function createReactivityScope() {
    const listeners: Record<string, Set<Function>> = {};
    const scopeId = Math.random().toString(36).slice(2);

    const subscribe = (key: string, callback: Function): (() => void) => {
        if (!listeners[key]) listeners[key] = new Set();
        listeners[key].add(callback);
        return () => { listeners[key]?.delete(callback); };
    };

    const notifyKey = (key: string) => {
        if (_batchDepth > 0) {
            // Snapshot at queue time so mutations during batch don't add to the captured set
            _batchQueue.set(`${scopeId}:${key}`, () => {
                const cbs = listeners[key] ? [...listeners[key]] : [];
                cbs.forEach(cb => cb());
            });
        } else {
            // Snapshot before iterating: track() may re-subscribe to the same key
            // during the callback, and Set.forEach visits newly-added entries → infinite loop
            const cbs = listeners[key] ? [...listeners[key]] : [];
            cbs.forEach(cb => cb());
        }
    };

    const setInterceptors: Record<string, (val: any) => void> = {};

    const registerSetInterceptor = (key: string, fn: (val: any) => void) => {
        setInterceptors[key] = fn;
    };

    const createReactiveState = <T extends object>(initialData: T): T => {
        return new Proxy(initialData, {
            get(target, key) {
                if (key === RAW_SYMBOL) return initialData;
                if (typeof key === 'string' && !key.startsWith('$') && _activeEffect) {
                    _activeEffect.push({ sub: subscribe, key });
                }
                const val = target[key as keyof T];
                if (typeof key === 'string' && !key.startsWith('$') && val !== null && typeof val === 'object' && !_rawSet.has(val as object)) {
                    return makeDeepProxy(val, () => notifyKey(key));
                }
                return val;
            },
            set(target, key: string, value) {
                if (setInterceptors[key]) { setInterceptors[key](value); return true; }
                const prev = (target as any)[key];
                (target as any)[key] = value;
                // Skip notification when primitive value is unchanged
                if (prev !== value || (value !== null && typeof value === 'object')) notifyKey(key);
                return true;
            }
        });
    };

    const notifyAll = () => { Object.keys(listeners).forEach(k => notifyKey(k)); };

    return { subscribe, createReactiveState, registerSetInterceptor, notifyAll };
}
