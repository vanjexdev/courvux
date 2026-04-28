import { isRaw } from './reactivity.js';

const storeSubscribers = new WeakMap<object, (key: string, cb: Function) => () => void>();

export interface StoreConfig<T extends object> {
    state: T;
    actions?: Record<string, (...args: any[]) => void>;
    modules?: Record<string, StoreConfig<any>>;
    onChange?: (key: string, value: any) => void;
}

function makeDeepNotifyProxy(val: any, notify: () => void): any {
    if (val === null || typeof val !== 'object' || isRaw(val)) return val;
    return new Proxy(val, {
        get(t, k: string) {
            const v = t[k];
            if (v !== null && typeof v === 'object' && !isRaw(v)) return makeDeepNotifyProxy(v, notify);
            return v;
        },
        set(t, k: string, v) { t[k] = v; notify(); return true; }
    });
}

export function createStore<T extends object>(config: StoreConfig<T>): T & Record<string, any> {
    const listeners: Record<string, Set<Function>> = {};

    const subscribe = (key: string, cb: Function): (() => void) => {
        if (!listeners[key]) listeners[key] = new Set();
        listeners[key].add(cb);
        return () => { listeners[key]?.delete(cb); };
    };

    const notifyKey = (key: string) => {
        const cbs = listeners[key] ? [...listeners[key]] : [];
        cbs.forEach(cb => cb());
    };

    const stateData = { ...config.state } as Record<string, any>;
    const actions = config.actions ?? {};
    const modules = config.modules ?? {};

    Object.keys(actions).forEach(key => {
        if (key in stateData) {
            console.warn(`[courvux] Store: action "${key}" shadows state key "${key}". Rename one of them.`);
        }
    });

    Object.keys(modules).forEach(name => {
        if (name in stateData || name in actions) {
            console.warn(`[courvux] Store: module "${name}" conflicts with existing key. Rename it.`);
        }
        stateData[name] = createStore(modules[name]);
    });

    const proxy = new Proxy(stateData, {
        get(target, key: string) {
            if (key in actions) {
                return (...args: any[]) => (actions[key] as Function).apply(proxy, args);
            }
            const val = target[key];
            // Wrap plain nested objects so deep mutations (e.g. store.a.b.c = x) notify top-level key
            if (val !== null && typeof val === 'object' && !storeSubscribers.has(val) && !isRaw(val)) {
                return makeDeepNotifyProxy(val, () => notifyKey(key));
            }
            return val;
        },
        set(target, key: string, value) {
            if (key in modules) return true;
            target[key] = value;
            notifyKey(key);
            config.onChange?.(key, value);
            return true;
        }
    });

    storeSubscribers.set(proxy, subscribe);
    return proxy as T & Record<string, any>;
}

export function subscribeToStore(store: object, key: string, cb: Function): () => void {
    const dotIdx = key.indexOf('.');
    if (dotIdx >= 0) {
        const topKey = key.slice(0, dotIdx);
        const restKey = key.slice(dotIdx + 1);
        const subStore = (store as any)[topKey];
        if (subStore && storeSubscribers.has(subStore)) {
            return subscribeToStore(subStore, restKey, cb);
        }
        // Plain nested object: subscribe to top-level key; fires on any deep mutation
        return storeSubscribers.get(store)?.(topKey, cb) ?? (() => {});
    }
    return storeSubscribers.get(store)?.(key, cb) ?? (() => {});
}
