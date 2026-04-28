export declare const markRaw: <T extends object>(obj: T) => T;
export declare const isRaw: (obj: object) => boolean;
export declare const toRaw: <T>(obj: T) => T;
export declare function readonly<T extends object>(obj: T): Readonly<T>;
type DepEntry = {
    sub: (key: string, cb: Function) => () => void;
    key: string;
};
export declare function collectDeps(fn: () => void): DepEntry[];
export declare function batchUpdate(fn: () => void): void;
export declare function createReactivityScope(): {
    subscribe: (key: string, callback: Function) => (() => void);
    createReactiveState: <T extends object>(initialData: T) => T;
    registerSetInterceptor: (key: string, fn: (val: any) => void) => void;
    notifyAll: () => void;
};
export {};
