import { AppConfig } from './types.js';
export { createRouter } from './router.js';
export { createStore } from './store.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard } from './types.js';
export declare function createApp(selector: string, config: AppConfig): Promise<any>;
