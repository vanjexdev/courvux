export interface DirectiveBinding {
    value: any;
    arg?: string;
    modifiers: Record<string, boolean>;
}
export interface DirectiveDef {
    onMount?: (el: HTMLElement, binding: DirectiveBinding) => void;
    onUpdate?: (el: HTMLElement, binding: DirectiveBinding) => void;
    onDestroy?: (el: HTMLElement, binding: DirectiveBinding) => void;
}
export type DirectiveShorthand = (el: HTMLElement, binding: DirectiveBinding) => void;
export interface WatcherOptions {
    handler(this: any, newVal: any, oldVal: any): void;
    immediate?: boolean;
    deep?: boolean;
}
export type WatcherEntry = ((this: any, newVal: any, oldVal: any) => void) | WatcherOptions;
export type ComputedDef = ((this: any) => any) | {
    get(this: any): any;
    set?(this: any, val: any): void;
};
export interface ComponentConfig {
    name?: string;
    templateUrl?: string;
    template?: string;
    data?: Record<string, any>;
    methods?: Record<string, Function>;
    computed?: Record<string, ComputedDef>;
    watch?: Record<string, WatcherEntry>;
    components?: Record<string, ComponentConfig>;
    provide?: Record<string, any> | ((this: any) => Record<string, any>);
    inject?: string[] | Record<string, string>;
    onBeforeMount?(this: any): void;
    onMount?(this: any): void;
    onBeforeUnmount?(this: any): void;
    onDestroy?(this: any): void;
    onActivated?(this: any): void;
    onDeactivated?(this: any): void;
    onError?(this: any, err: Error): void;
    inheritAttrs?: boolean;
}
export type LazyComponent = () => Promise<{
    default: ComponentConfig;
}>;
export type NavigationGuard = (to: RouteMatch, next: (redirectPath?: string) => void) => void | Promise<void>;
export interface RouteConfig {
    path: string;
    redirect?: string | ((route: RouteMatch) => string);
    layout?: string;
    transition?: string;
    keepAlive?: boolean;
    meta?: Record<string, any>;
    loadingTemplate?: string;
    beforeEnter?: NavigationGuard;
    component?: ComponentConfig | LazyComponent;
    components?: Record<string, ComponentConfig | LazyComponent>;
    children?: RouteConfig[];
}
export type ScrollBehavior = (to: RouteMatch, from: RouteMatch | null) => {
    x?: number;
    y?: number;
} | void;
export interface Router {
    routes: RouteConfig[];
    mode: 'hash' | 'history';
    transition?: string;
    beforeEach?: NavigationGuard;
    afterEach?: (to: RouteMatch, from: RouteMatch | null) => void;
    scrollBehavior?: ScrollBehavior;
    navigate(path: string): void;
    replace(path: string): void;
    back(): void;
    forward(): void;
}
export interface AppConfig extends ComponentConfig {
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
}
export interface RouteMatch {
    params: Record<string, string>;
    path: string;
    meta?: Record<string, any>;
}
