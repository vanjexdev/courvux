import { Router, RouteConfig, ComponentConfig, LazyComponent, RouteMatch } from './types.js';

type MountFn = (el: HTMLElement, config: ComponentConfig, route: RouteMatch, layout?: string) => Promise<void>;

const lazyCache = new Map<LazyComponent, ComponentConfig>();

async function resolveComponent(component: ComponentConfig | LazyComponent): Promise<ComponentConfig> {
    if (typeof component !== 'function') return component;
    if (lazyCache.has(component)) return lazyCache.get(component)!;
    const mod = await component();
    lazyCache.set(component, mod.default);
    return mod.default;
}

function matchRoute(pattern: string, path: string): Record<string, string> | null {
    const keys: string[] = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; });
    const m = path.match(new RegExp(`^${regexStr}$`));
    if (!m) return null;
    return Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
}

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
        el.innerHTML = '';
        for (const route of router.routes) {
            const params = matchRoute(route.path, path);
            if (params !== null) {
                const config = await resolveComponent(route.component);
                await mount(el, config, { params, path }, route.layout);
                return;
            }
        }
    };

    window.addEventListener(router.mode === 'history' ? 'popstate' : 'hashchange', render);
    render();
}
