import { AppConfig, Router, DirectiveDef, DirectiveShorthand } from './types.js';
export { createRouter } from './router.js';
export { createStore } from './store.js';
export { batchUpdate } from './reactivity.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard, ScrollBehavior, WatcherEntry, WatcherOptions, DirectiveBinding, DirectiveDef, DirectiveShorthand, LazyComponent, ComputedDef } from './types.js';
export type { StoreConfig } from './store.js';
export declare const nextTick: (cb?: () => void) => Promise<void>;
export interface CourvuxPlugin {
    install(app: CourvuxApp): void;
}
export interface CourvuxApp {
    use(plugin: CourvuxPlugin): CourvuxApp;
    directive(name: string, def: DirectiveDef | DirectiveShorthand): CourvuxApp;
    mount(selector: string): Promise<CourvuxApp>;
    router?: Router;
}
export declare function createApp(config: AppConfig): CourvuxApp;
