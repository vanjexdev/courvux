export function createReactivityScope() {
    const listeners: Record<string, Function[]> = {};

    const subscribe = (key: string, callback: Function): void => {
        if (!listeners[key]) listeners[key] = [];
        listeners[key].push(callback);
    };

    const createReactiveState = <T extends object>(initialData: T): T => {
        return new Proxy(initialData, {
            get(target, key: string) {
                return target[key as keyof T];
            },
            set(target, key: string, value) {
                (target as any)[key] = value;
                listeners[key]?.forEach(cb => cb());
                return true;
            }
        });
    };

    return { subscribe, createReactiveState };
}
