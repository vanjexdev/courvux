export declare function createReactivityScope(): {
    subscribe: (key: string, callback: Function) => void;
    createReactiveState: <T extends object>(initialData: T) => T;
};
