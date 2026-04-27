export interface DevToolsComponentInstance {
    id: number;
    name: string;
    el: HTMLElement;
    getState(): Record<string, any>;
    setState(key: string, value: any): void;
    subscribe(cb: () => void): () => void;
    children: DevToolsComponentInstance[];
}
type DevToolsEvent = 'mount' | 'update' | 'destroy';
export interface DevToolsHook {
    instances: DevToolsComponentInstance[];
    on(event: DevToolsEvent, cb: (instance: DevToolsComponentInstance) => void): () => void;
    /** @internal */
    _emit(event: DevToolsEvent, instance: DevToolsComponentInstance): void;
    /** @internal */
    _registerInstance(instance: DevToolsComponentInstance): void;
    /** @internal */
    _unregisterInstance(id: number): void;
}
declare global {
    interface Window {
        __COURVUX_DEVTOOLS__?: DevToolsHook;
    }
}
export declare function setupDevTools(): DevToolsHook;
export declare function nextDevToolsId(): number;
export {};
