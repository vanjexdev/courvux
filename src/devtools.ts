export interface DevToolsComponentInstance {
    id: number;
    name: string;
    el: HTMLElement;
    getState(): Record<string, any>;
    setState(key: string, value: any): void;
    subscribe(cb: () => void): () => void;
    children: DevToolsComponentInstance[];
}

export interface DevToolsStoreEntry {
    getState(): Record<string, any>;
    setState(key: string, value: any): void;
    subscribe(cb: () => void): () => void;
}

type DevToolsEvent = 'mount' | 'update' | 'destroy' | 'store-update';

export interface DevToolsHook {
    instances: DevToolsComponentInstance[];
    stores: DevToolsStoreEntry[];
    on(event: DevToolsEvent, cb: (payload: any) => void): () => void;
    /** @internal */
    _emit(event: DevToolsEvent, payload: any): void;
    /** @internal */
    _registerInstance(instance: DevToolsComponentInstance): void;
    /** @internal */
    _unregisterInstance(id: number): void;
    /** @internal */
    _registerStore(entry: DevToolsStoreEntry): void;
}

declare global {
    interface Window {
        __COURVUX_DEVTOOLS__?: DevToolsHook;
    }
}

export function setupDevTools(): DevToolsHook {
    if (typeof window === 'undefined') return null as any;
    if (window.__COURVUX_DEVTOOLS__) return window.__COURVUX_DEVTOOLS__;

    const listeners = new Map<DevToolsEvent, Set<(payload: any) => void>>();

    const hook: DevToolsHook = {
        instances: [],
        stores: [],
        on(event, cb) {
            if (!listeners.has(event)) listeners.set(event, new Set());
            listeners.get(event)!.add(cb);
            return () => listeners.get(event)?.delete(cb);
        },
        _emit(event, payload) {
            listeners.get(event)?.forEach(cb => { try { cb(payload); } catch { /* */ } });
        },
        _registerInstance(instance) {
            this.instances.push(instance);
            this._emit('mount', instance);
        },
        _unregisterInstance(id) {
            const idx = this.instances.findIndex(i => i.id === id);
            if (idx !== -1) {
                const inst = this.instances[idx];
                this.instances.splice(idx, 1);
                this._emit('destroy', inst);
            }
        },
        _registerStore(entry) {
            this.stores.push(entry);
            entry.subscribe(() => this._emit('store-update', entry));
        },
    };

    window.__COURVUX_DEVTOOLS__ = hook;
    return hook;
}

let _idCounter = 0;
export function nextDevToolsId() { return ++_idCounter; }
