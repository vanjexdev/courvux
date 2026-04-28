import { ComponentConfig, Router, DirectiveDef, DirectiveShorthand } from './types.js';
export interface WalkContext {
    subscribe: (key: string, cb: Function) => () => void;
    storeSubscribeOverride?: (store: object, key: string, cb: Function) => () => void;
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
    refs?: Record<string, any>;
    slots?: Record<string, ((scope: Record<string, any>) => Promise<Node[]>) | undefined>;
    mountElement?: (el: HTMLElement, tagName: string, parentState: any, parentContext: WalkContext) => Promise<void>;
    mountRouterView?: (el: HTMLElement, name?: string) => Promise<void>;
    mountDynamic?: (anchor: Comment, compExpr: string, originalEl: HTMLElement, parentState: any, parentContext: WalkContext) => Promise<void>;
    provided?: Record<string, any>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    registerCleanup?: (cleanup: () => void) => void;
    createChildScope?: (data: Record<string, any>, methods: Record<string, Function>) => {
        state: any;
        subscribe: (key: string, cb: Function) => () => void;
        cleanup: () => void;
    };
}
export declare const resolve: (expr: string, state: any) => any;
export declare const evaluate: (expr: string, state: any) => any;
export declare const subscribeExpr: (expr: string, context: WalkContext, cb: Function) => (() => void);
export declare const subscribeDeps: (expr: string, context: WalkContext, cb: Function) => (() => void);
export declare const setStateValue: (expr: string, state: any, value: any) => void;
export declare function injectCloakStyle(): void;
export declare function walk(el: Node, state: any, context: WalkContext): Promise<void>;
