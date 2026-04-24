import { Router, RouteConfig, ComponentConfig } from './types.js';
type MountFn = (el: HTMLElement, config: ComponentConfig) => Promise<void>;
export declare function createRouter(routes: RouteConfig[], options?: {
    mode?: 'hash' | 'history';
}): Router;
export declare function setupRouterView(el: HTMLElement, router: Router, mount: MountFn): void;
export {};
