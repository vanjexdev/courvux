import { Router, RouteConfig, ComponentConfig } from './types.js';

type MountFn = (el: HTMLElement, config: ComponentConfig) => Promise<void>;

export function createRouter(routes: RouteConfig[], options: { mode?: 'hash' | 'history' } = {}): Router {
    const mode = options.mode ?? 'hash';

    const router: Router = {
        routes,
        mode,
        navigate(path: string) {
            if (mode === 'history') {
                history.pushState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                window.location.hash = path;
            }
        }
    };

    return router;
}

export function setupRouterView(el: HTMLElement, router: Router, mount: MountFn): void {
    const getCurrentPath = () => router.mode === 'history'
        ? window.location.pathname
        : window.location.hash.slice(1) || '/';

    const render = async () => {
        const path = getCurrentPath();
        const route = router.routes.find(r => r.path === path);
        el.innerHTML = '';
        if (route) await mount(el, route.component);
    };

    window.addEventListener(router.mode === 'history' ? 'popstate' : 'hashchange', render);
    render();
}
