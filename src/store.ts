const storeSubscribers = new WeakMap<object, (key: string, cb: Function) => void>();

export interface StoreConfig<T extends object> {
    state: T;
    actions?: Record<string, (...args: any[]) => void>;
}

export function createStore<T extends object>(config: StoreConfig<T>): T & Record<string, any> {
    const listeners: Record<string, Function[]> = {};

    const subscribe = (key: string, cb: Function) => {
        if (!listeners[key]) listeners[key] = [];
        listeners[key].push(cb);
    };

    const proxy = new Proxy({ ...config.state, ...(config.actions ?? {}) } as any, {
        get(target, key: string) {
            return target[key];
        },
        set(target, key: string, value) {
            target[key] = value;
            listeners[key]?.forEach(cb => cb());
            return true;
        }
    });

    storeSubscribers.set(proxy, subscribe);
    return proxy;
}

export function subscribeToStore(store: object, key: string, cb: Function) {
    storeSubscribers.get(store)?.(key, cb);
}
