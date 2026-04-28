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
export declare function setupDevTools(): DevToolsHook;
export declare function nextDevToolsId(): number;
export {};
