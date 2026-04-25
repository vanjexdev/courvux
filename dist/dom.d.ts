import { ComponentConfig, Router } from './types.js';
export interface WalkContext {
    subscribe: (key: string, cb: Function) => () => void;
    storeSubscribeOverride?: (store: object, key: string, cb: Function) => () => void;
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
    mountElement?: (el: HTMLElement, tagName: string, parentState: any, parentContext: WalkContext) => Promise<void>;
    mountRouterView?: (el: HTMLElement) => Promise<void>;
}
export declare const resolve: (expr: string, state: any) => any;
export declare const evaluate: (expr: string, state: any) => any;
export declare const subscribeExpr: (expr: string, context: WalkContext, cb: Function) => (() => void);
export declare function walk(el: Node, state: any, context: WalkContext): Promise<void>;
