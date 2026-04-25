import { Router, RouteConfig, ComponentConfig, RouteMatch } from './types.js';
type MountFn = (el: HTMLElement, config: ComponentConfig, route: RouteMatch, layout?: string) => Promise<void>;
export declare function createRouter(routes: RouteConfig[], options?: {
    mode?: 'hash' | 'history';
    transition?: string;
}): Router;
export declare function setupRouterView(el: HTMLElement, router: Router, mount: MountFn): void;
export {};
