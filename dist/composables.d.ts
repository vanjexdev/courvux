export declare function cvStorage<T extends Record<string, any>>(key: string, defaults: T): T & {
    $clear(): void;
};
export declare function cvListener<K extends keyof WindowEventMap>(target: EventTarget, event: K | string, handler: (e: any) => void, options?: AddEventListenerOptions): () => void;
export declare function cvMediaQuery(query: string, callback: (matches: boolean) => void): () => void;
export interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}
export interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    immediate?: boolean;
    transform?: (raw: any) => any;
}
export declare function cvFetch<T = any>(initialUrl: string, callback: (state: FetchState<T>) => void, options?: FetchOptions): {
    execute(url?: string): void;
    abort(): void;
};
export declare function cvDebounce<T extends (this: any, ...args: any[]) => any>(fn: T, delay: number): T & {
    cancel(): void;
};
export declare function cvThrottle<T extends (this: any, ...args: any[]) => any>(fn: T, delay: number): T & {
    cancel(): void;
};
