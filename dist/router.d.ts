import type { Router, RouteConfig, ComponentConfig, RouteMatch, NavigationGuard, ScrollBehavior } from './types.js';
export type RouteActivation = {
    destroy: () => void;
    activate?: () => void;
    deactivate?: () => void;
};
type MountFn = (el: HTMLElement, config: ComponentConfig, route: RouteMatch, layout?: string, childRouter?: Router) => Promise<RouteActivation>;
export declare function createRouter(routes: RouteConfig[], options?: {
    mode?: 'hash' | 'history';
    transition?: string;
    beforeEach?: NavigationGuard;
    afterEach?: (to: RouteMatch, from: RouteMatch | null) => void;
    scrollBehavior?: ScrollBehavior;
}): Router;
export declare function setupRouterView(el: HTMLElement, router: Router, mount: MountFn, name?: string, onFirstRender?: () => void): () => void;
export {};
