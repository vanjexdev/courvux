import { Router, RouteConfig, ComponentConfig, LazyComponent, RouteMatch } from './types.js';

type MountFn = (el: HTMLElement, config: ComponentConfig, route: RouteMatch, layout?: string) => Promise<void>;

const BUILT_IN_STYLES = `
router-view.fade-leave{animation:cv-fade-out 0.25s forwards}
router-view.fade-enter{animation:cv-fade-in 0.25s forwards}
router-view.slide-up-leave{animation:cv-slide-up-out 0.25s forwards}
router-view.slide-up-enter{animation:cv-slide-up-in 0.25s forwards}
@keyframes cv-fade-out{to{opacity:0}}
@keyframes cv-fade-in{from{opacity:0}}
@keyframes cv-slide-up-out{to{opacity:0;transform:translateY(-12px)}}
@keyframes cv-slide-up-in{from{opacity:0;transform:translateY(12px)}}
`;

function injectTransitionStyles() {
    if (document.getElementById('cv-transitions')) return;
    const style = document.createElement('style');
    style.id = 'cv-transitions';
    style.textContent = BUILT_IN_STYLES;
    document.head.appendChild(style);
}

async function animateEl(el: HTMLElement, name: string, phase: 'enter' | 'leave'): Promise<void> {
    el.classList.add(`${name}-${phase}`);
    const cs = getComputedStyle(el);
    const duration = Math.max(
        parseFloat(cs.animationDuration) || 0,
        parseFloat(cs.transitionDuration) || 0
    ) * 1000;
    if (duration > 0) {
        await new Promise<void>(resolve => {
            const done = () => resolve();
            el.addEventListener('animationend', done, { once: true });
            el.addEventListener('transitionend', done, { once: true });
            setTimeout(done, duration + 50);
        });
    }
    el.classList.remove(`${name}-${phase}`);
}

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

export function createRouter(routes: RouteConfig[], options: { mode?: 'hash' | 'history'; transition?: string } = {}): Router {
    const mode = options.mode ?? 'hash';

    const router: Router = {
        routes,
        mode,
        transition: options.transition,
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

    if (router.transition) injectTransitionStyles();

    const render = async () => {
        const path = getCurrentPath();

        for (const route of router.routes) {
            const params = matchRoute(route.path, path);
            if (params !== null) {
                const routeMatch: RouteMatch = { params, path };

                if (route.beforeEnter) {
                    let redirectTo: string | undefined;
                    await new Promise<void>(resolve => {
                        route.beforeEnter!(routeMatch, (redirectPath?: string) => {
                            redirectTo = redirectPath;
                            resolve();
                        });
                    });
                    if (redirectTo) { router.navigate(redirectTo); return; }
                }

                const transitionName = route.transition !== undefined
                    ? route.transition
                    : router.transition;

                if (transitionName && el.hasChildNodes()) {
                    await animateEl(el, transitionName, 'leave');
                }

                el.innerHTML = '';
                const config = await resolveComponent(route.component);
                await mount(el, config, routeMatch, route.layout);

                if (transitionName) {
                    await animateEl(el, transitionName, 'enter');
                }

                return;
            }
        }

        el.innerHTML = '';
    };

    window.addEventListener(router.mode === 'history' ? 'popstate' : 'hashchange', render);
    render();
}
