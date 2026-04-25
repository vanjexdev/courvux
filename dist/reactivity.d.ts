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
};
export {};
