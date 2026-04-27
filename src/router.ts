import type { Router, RouteConfig, ComponentConfig, LazyComponent, RouteMatch, NavigationGuard, ScrollBehavior } from './types.js';

export type RouteActivation = {
    destroy: () => void;
    activate?: () => void;
    deactivate?: () => void;
};

type MountFn = (el: HTMLElement, config: ComponentConfig, route: RouteMatch, layout?: string, childRouter?: Router) => Promise<RouteActivation>;

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

function getViewComponent(route: RouteConfig, viewName: string): ComponentConfig | LazyComponent | undefined {
    if (route.components) return route.components[viewName];
    if (viewName === 'default') return route.component;
    return undefined;
}

function matchRoute(pattern: string, path: string): Record<string, string> | null {
    if (pattern === '*') return {};
    const keys: string[] = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; });
    const m = path.match(new RegExp(`^${regexStr}$`));
    if (!m) return null;
    return Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
}

function matchRoutePrefix(pattern: string, path: string): { params: Record<string, string>; remaining: string } | null {
    if (pattern === '/') return { params: {}, remaining: path };
    const keys: string[] = [];
    const regexStr = pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; });
    const m = path.match(new RegExp(`^${regexStr}(/.+)?$`));
    if (!m) return null;
    const params = Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
    const remaining = m[keys.length + 1] || '/';
    return { params, remaining };
}

function normalizeRoutes(routes: RouteConfig[], prefix = ''): RouteConfig[] {
    return routes.map(route => {
        if (route.path === '*') return route;
        const base = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
        const fullPath = (base + route.path).replace(/\/+/g, '/') || '/';
        if (!route.children?.length) return { ...route, path: fullPath };
        return { ...route, path: fullPath, children: normalizeRoutes(route.children, fullPath === '/' ? '' : fullPath) };
    });
}

const runGuard = (guard: NavigationGuard, routeMatch: RouteMatch): Promise<string | undefined> =>
    new Promise<string | undefined>(resolve => guard(routeMatch, resolve));

export function createRouter(routes: RouteConfig[], options: {
    mode?: 'hash' | 'history';
    transition?: string;
    beforeEach?: NavigationGuard;
    afterEach?: (to: RouteMatch, from: RouteMatch | null) => void;
    scrollBehavior?: ScrollBehavior;
} = {}): Router {
    const mode = options.mode ?? 'hash';

    const router: Router = {
        routes: normalizeRoutes(routes),
        mode,
        transition: options.transition,
        beforeEach: options.beforeEach,
        afterEach: options.afterEach,
        scrollBehavior: options.scrollBehavior,
        navigate(path: string) {
            if (mode === 'history') {
                history.pushState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                window.location.hash = path;
            }
        },
        replace(path: string) {
            if (mode === 'history') {
                history.replaceState({}, '', path);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const base = window.location.href.split('#')[0];
                window.location.replace(`${base}#${path}`);
            }
        },
        back() {
            history.back();
        },
        forward() {
            history.forward();
        },
    };

    return router;
}

export function setupRouterView(el: HTMLElement, router: Router, mount: MountFn, name = 'default', onFirstRender?: () => void): () => void {
    const getCurrentPath = () => router.mode === 'history'
        ? window.location.pathname
        : window.location.hash.slice(1) || '/';

    if (router.transition) injectTransitionStyles();

    let prevRouteMatch: RouteMatch | null = null;
    let prevRouteConfig: RouteConfig | null = null;
    let prevActivation: RouteActivation | null = null;
    let currentParentKey: string | null = null;
    let firstRenderDone = false;
    const notifyFirstRender = () => {
        if (!firstRenderDone) { firstRenderDone = true; onFirstRender?.(); }
    };
    const keepAliveCache = new Map<string, { fragment: DocumentFragment; activation: RouteActivation }>();

    const leaveEl = (route: RouteConfig | null) => {
        if (route?.keepAlive && prevActivation) {
            prevActivation.deactivate?.();
            const fragment = document.createDocumentFragment();
            while (el.firstChild) fragment.appendChild(el.firstChild);
            keepAliveCache.set(prevRouteMatch!.path, { fragment, activation: prevActivation });
            prevActivation = null;
        } else {
            prevActivation?.destroy();
            prevActivation = null;
            el.innerHTML = '';
        }
    };

    const mountWithLoading = async (route: RouteConfig, routeComp: ComponentConfig | LazyComponent, routeMatch: RouteMatch, layout?: string, childRouter?: Router): Promise<RouteActivation> => {
        const isFirstLoad = typeof routeComp === 'function' && !lazyCache.has(routeComp as LazyComponent);
        if (isFirstLoad && route.loadingTemplate) el.innerHTML = route.loadingTemplate;
        const config = await resolveComponent(routeComp);
        if (isFirstLoad && route.loadingTemplate) el.innerHTML = '';
        return mount(el, config, routeMatch, layout, childRouter);
    };

    const render = async () => {
        const path = getCurrentPath();

        for (const route of router.routes) {
            // --- Nested routes ---
            if (route.children?.length) {
                const prefixMatch = matchRoutePrefix(route.path, path);
                if (prefixMatch !== null) {
                    for (const child of route.children) {
                        const childParams = matchRoute(child.path, path);
                        if (childParams !== null) {
                            const routeMatch: RouteMatch = { params: prefixMatch.params, path, meta: route.meta };

                            if (child.redirect) {
                                const childMatch: RouteMatch = { params: childParams, path, meta: child.meta };
                                const target = typeof child.redirect === 'function' ? child.redirect(childMatch) : child.redirect;
                                router.navigate(target);
                                return;
                            }

                            if (router.beforeEach) {
                                const r = await runGuard(router.beforeEach, routeMatch);
                                if (r) { router.navigate(r); return; }
                            }
                            if (route.beforeEnter) {
                                const r = await runGuard(route.beforeEnter, routeMatch);
                                if (r) { router.navigate(r); return; }
                            }
                            if (child.beforeEnter) {
                                const childMatch: RouteMatch = { params: childParams, path, meta: child.meta };
                                const r = await runGuard(child.beforeEnter, childMatch);
                                if (r) { router.navigate(r); return; }
                            }

                            const parentKey = `${route.path}::${JSON.stringify(prefixMatch.params)}`;

                            if (currentParentKey !== parentKey) {
                                const transitionName = route.transition ?? router.transition;
                                if (transitionName && el.hasChildNodes()) await animateEl(el, transitionName, 'leave');
                                leaveEl(prevRouteConfig);

                                const routeComp = getViewComponent(route, name);
                                if (routeComp) {
                                    const childRouter: Router = {
                                        routes: route.children!,
                                        mode: router.mode,
                                        transition: route.transition ?? router.transition,
                                        beforeEach: router.beforeEach,
                                        afterEach: router.afterEach,
                                        scrollBehavior: router.scrollBehavior,
                                        navigate: (p) => router.navigate(p),
                                        replace: (p) => router.replace(p),
                                        back: () => router.back(),
                                        forward: () => router.forward(),
                                    };
                                    prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === 'default' ? route.layout : undefined, name === 'default' ? childRouter : undefined);
                                } else {
                                    el.innerHTML = '';
                                }
                                currentParentKey = parentKey;
                                if (transitionName) await animateEl(el, transitionName, 'enter');
                            }

                            const combined: RouteMatch = { params: { ...prefixMatch.params, ...childParams }, path, meta: child.meta ?? route.meta };
                            router.afterEach?.(combined, prevRouteMatch);
                            const scrollPos = router.scrollBehavior?.(combined, prevRouteMatch);
                            if (scrollPos) window.scrollTo(scrollPos.x ?? 0, scrollPos.y ?? 0);
                            prevRouteMatch = combined;
                            prevRouteConfig = route;
                            notifyFirstRender();
                            return;
                        }
                    }
                }
            }

            // --- Exact match ---
            const params = matchRoute(route.path, path);
            if (params !== null) {
                currentParentKey = null;
                const routeMatch: RouteMatch = { params, path, meta: route.meta };

                if (route.redirect) {
                    const target = typeof route.redirect === 'function' ? route.redirect(routeMatch) : route.redirect;
                    router.navigate(target);
                    return;
                }

                if (router.beforeEach) {
                    const r = await runGuard(router.beforeEach, routeMatch);
                    if (r) { router.navigate(r); return; }
                }
                if (route.beforeEnter) {
                    const r = await runGuard(route.beforeEnter, routeMatch);
                    if (r) { router.navigate(r); return; }
                }

                const transitionName = route.transition ?? router.transition;
                if (transitionName && el.hasChildNodes()) await animateEl(el, transitionName, 'leave');
                leaveEl(prevRouteConfig);

                const routeComp = getViewComponent(route, name);
                if (routeComp) {
                    const cacheKey = routeMatch.path;
                    if (route.keepAlive && keepAliveCache.has(cacheKey)) {
                        const cached = keepAliveCache.get(cacheKey)!;
                        el.appendChild(cached.fragment);
                        prevActivation = cached.activation;
                        prevActivation.activate?.();
                        keepAliveCache.delete(cacheKey);
                    } else {
                        prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === 'default' ? route.layout : undefined);
                    }
                } else {
                    el.innerHTML = '';
                    prevActivation = null;
                }

                if (transitionName) await animateEl(el, transitionName, 'enter');

                router.afterEach?.(routeMatch, prevRouteMatch);
                const scrollPos = router.scrollBehavior?.(routeMatch, prevRouteMatch);
                if (scrollPos) window.scrollTo(scrollPos.x ?? 0, scrollPos.y ?? 0);
                prevRouteMatch = routeMatch;
                prevRouteConfig = route;
                notifyFirstRender();
                return;
            }
        }

        currentParentKey = null;
        leaveEl(prevRouteConfig);
        prevRouteConfig = null;
        notifyFirstRender();
    };

    const eventType = router.mode === 'history' ? 'popstate' : 'hashchange';
    window.addEventListener(eventType, render);
    render();
    return () => {
        window.removeEventListener(eventType, render);
        prevActivation?.destroy();
        prevActivation = null;
        keepAliveCache.forEach(({ activation }) => activation.destroy());
        keepAliveCache.clear();
    };
}
