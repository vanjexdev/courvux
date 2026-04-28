export interface EventBus<Events extends Record<string, any> = Record<string, any>> {
    on<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void;
    off<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void;
    emit<K extends keyof Events>(event: K, payload?: Events[K]): void;
    once<K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): () => void;
    clear(event?: keyof Events): void;
}

export function createEventBus<Events extends Record<string, any> = Record<string, any>>(): EventBus<Events> {
    const listeners = new Map<keyof Events, Set<Function>>();

    const on = <K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): (() => void) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(handler);
        return () => off(event, handler);
    };

    const off = <K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): void => {
        listeners.get(event)?.delete(handler);
    };

    const emit = <K extends keyof Events>(event: K, payload?: Events[K]): void => {
        const cbs = listeners.get(event);
        if (cbs) [...cbs].forEach(cb => cb(payload));
    };

    const once = <K extends keyof Events>(event: K, handler: (payload: Events[K]) => void): (() => void) => {
        const wrapped = (payload: Events[K]) => { handler(payload); off(event, wrapped as any); };
        return on(event, wrapped as any);
    };

    const clear = (event?: keyof Events): void => {
        if (event !== undefined) listeners.delete(event);
        else listeners.clear();
    };

    return { on, off, emit, once, clear };
}
