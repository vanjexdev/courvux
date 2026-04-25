export interface StoreConfig<T extends object> {
    state: T;
    actions?: Record<string, (...args: any[]) => void>;
    modules?: Record<string, StoreConfig<any>>;
}
export declare function createStore<T extends object>(config: StoreConfig<T>): T & Record<string, any>;
export declare function subscribeToStore(store: object, key: string, cb: Function): () => void;
