import { AppConfig, ComponentConfig, RouteMatch, Router, DirectiveDef, DirectiveShorthand, LazyComponent } from './types.js';
export { createRouter } from './router.js';
export { createStore } from './store.js';
export { batchUpdate, markRaw, toRaw, readonly } from './reactivity.js';
export { createEventBus } from './events.js';
export type { EventBus } from './events.js';
export { cvStorage, cvListener, cvMediaQuery, cvFetch, cvDebounce, cvThrottle } from './composables.js';
export type { FetchState, FetchOptions } from './composables.js';
export { setupDevTools } from './devtools.js';
export { mountDevOverlay } from './overlay.js';
export { renderToString, SSR_ATTR } from './ssr.js';
export { useHead } from './head.js';
export type { HeadConfig, HeadMeta, HeadLink, HeadScript } from './head.js';
export type { DevToolsHook, DevToolsComponentInstance, DevToolsStoreEntry } from './devtools.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard, ScrollBehavior, WatcherEntry, WatcherOptions, DirectiveBinding, DirectiveDef, DirectiveShorthand, LazyComponent, ComputedDef } from './types.js';
export type { RouteActivation } from './router.js';
export type { StoreConfig } from './store.js';
export declare const nextTick: (cb?: () => void) => Promise<void>;
export interface ComponentThis {
    $el: HTMLElement;
    $refs: Record<string, Element | Record<string, any>>;
    $router: Router;
    $store: Record<string, any>;
    $route: RouteMatch;
    $slots: Record<string, boolean>;
    $attrs: Record<string, string>;
    $parent: Record<string, any>;
    $emit(event: string, ...args: any[]): void;
    $dispatch(event: string, detail?: any, options?: CustomEventInit): void;
    $watch(key: string, handler: (newVal: any, oldVal: any) => void, options?: {
        immediate?: boolean;
        deep?: boolean;
    }): () => void;
    $watchEffect(fn: () => void): () => void;
    $forceUpdate(): void;
    $addCleanup(fn: () => void): void;
    $batch(fn: () => void): void;
    $nextTick(cb?: () => void): Promise<void>;
    [key: string]: any;
}
type Inst<D, M> = D & M & ComponentThis;
type ComputedFn<D, M> = ((this: Inst<D, M>) => any) | {
    get(this: Inst<D, M>): any;
    set?(this: Inst<D, M>, val: any): void;
};
type WatchFn<D, M> = ((this: Inst<D, M>, n: any, o: any) => void) | {
    handler(this: Inst<D, M>, n: any, o: any): void;
    immediate?: boolean;
    deep?: boolean;
};
export declare function defineComponent<D extends Record<string, any> = Record<string, never>, M extends Record<string, Function> = Record<string, never>>(config: {
    name?: string;
    template?: string;
    templateUrl?: string;
    data?: D | (() => D | Promise<D>);
    methods?: M & ThisType<Inst<D, M>>;
    computed?: Record<string, ComputedFn<D, M>>;
    watch?: Record<string, WatchFn<D, M>>;
    emits?: string[] | Record<string, ((...args: any[]) => boolean) | null>;
    components?: Record<string, ComponentConfig>;
    provide?: Record<string, any> | ((this: Inst<D, M>) => Record<string, any>);
    inject?: string[] | Record<string, string>;
    inheritAttrs?: boolean;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    onBeforeMount?(this: Inst<D, M>): void;
    onMount?(this: Inst<D, M>): void;
    onBeforeUpdate?(this: Inst<D, M>): void;
    onUpdated?(this: Inst<D, M>): void;
    onBeforeUnmount?(this: Inst<D, M>): void;
    onDestroy?(this: Inst<D, M>): void;
    onActivated?(this: Inst<D, M>): void;
    onDeactivated?(this: Inst<D, M>): void;
    onError?(this: Inst<D, M>, err: Error): void;
    onBeforeRouteLeave?(this: Inst<D, M>, to: RouteMatch, next: (redirect?: string) => void): void;
    onBeforeRouteEnter?(this: Inst<D, M>, from: RouteMatch | null): void;
}): ComponentConfig;
export interface AsyncComponentOptions {
    loader: LazyComponent;
    loadingTemplate?: string;
    errorTemplate?: string;
    timeout?: number;
    onError?: (err: Error, retry: () => void, fail: (e: Error) => void, attempts: number) => void;
}
export declare function defineAsyncComponent(options: LazyComponent | AsyncComponentOptions): LazyComponent;
export interface CourvuxPlugin {
    install(app: CourvuxApp): void;
}
export declare function createPlugin(options: {
    components?: Record<string, ComponentConfig>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    provide?: Record<string, any>;
    globalProperties?: Record<string, any>;
    install?: (app: CourvuxApp) => void;
}): CourvuxPlugin;
export interface CourvuxApp {
    use(plugin: CourvuxPlugin): CourvuxApp;
    directive(name: string, def: DirectiveDef | DirectiveShorthand): CourvuxApp;
    component(name: string, config: ComponentConfig): CourvuxApp;
    provide(key: string, value: any): CourvuxApp;
    provide(values: Record<string, any>): CourvuxApp;
    magic(name: string, fn: (instance: any) => any): CourvuxApp;
    mount(selector: string): Promise<CourvuxApp>;
    mountAll(selector?: string): Promise<CourvuxApp>;
    mountEl(el: HTMLElement): Promise<any>;
    unmount(selector?: string): CourvuxApp;
    destroy(): void;
    router?: Router;
}
export declare function createApp(config: AppConfig): CourvuxApp;
/**
 * Tagged template helper for writing component templates in JS template literals.
 * Converts \${{ expr }} → ${{ expr }} so Courvux interpolation survives JS parsing.
 *
 * @example
 * template: html`<button @click="buy()">Price: \${{ price }}</button>`
 */
export declare function html(strings: TemplateStringsArray, ...values: any[]): string;
export interface AutoInitOptions {
    components?: Record<string, ComponentConfig>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    globalProperties?: Record<string, any>;
}
export declare function autoInit(options?: AutoInitOptions): void;
