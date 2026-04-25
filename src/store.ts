const storeSubscribers = new WeakMap<object, (key: string, cb: Function) => () => void>();

export interface StoreConfig<T extends object> {
    state: T;
    actions?: Record<string, (...args: any[]) => void>;
    modules?: Record<string, StoreConfig<any>>;
}

export function createStore<T extends object>(config: StoreConfig<T>): T & Record<string, any> {
    const listeners: Record<string, Set<Function>> = {};

    const subscribe = (key: string, cb: Function): (() => void) => {
        if (!listeners[key]) listeners[key] = new Set();
        listeners[key].add(cb);
        return () => { listeners[key]?.delete(cb); };
    };

    const stateData = { ...config.state } as Record<string, any>;
    const actions = config.actions ?? {};
    const modules = config.modules ?? {};

    Object.keys(actions).forEach(key => {
        if (key in stateData) {
            console.warn(`[courvux] Store: action "${key}" shadows state key "${key}". Rename one of them.`);
        }
    });

    // Create sub-stores for each module
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
            return target[key];
        },
        set(target, key: string, value) {
            if (key in modules) return true; // protect module sub-stores
            target[key] = value;
            listeners[key]?.forEach(cb => cb());
            return true;
        }
    });

    storeSubscribers.set(proxy, subscribe);
    return proxy as T & Record<string, any>;
}

export function subscribeToStore(store: object, key: string, cb: Function): () => void {
    const dotIdx = key.indexOf('.');
    if (dotIdx >= 0) {
        const moduleKey = key.slice(0, dotIdx);
        const restKey = key.slice(dotIdx + 1);
        const subStore = (store as any)[moduleKey];
        if (subStore && storeSubscribers.has(subStore)) {
            return subscribeToStore(subStore, restKey, cb);
        }
        return () => {};
    }
    return storeSubscribers.get(store)?.(key, cb) ?? (() => {});
}
