import type { Router, RouteConfig, ComponentConfig, LazyComponent, RouteMatch, NavigationGuard, ScrollBehavior } from './types.js';

export type RouteActivation = {
    destroy: () => void;
    activate?: () => void;
    deactivate?: () => void;
    beforeLeave?: (to: RouteMatch, next: (redirect?: string) => void) => void;
    enter?: (from: RouteMatch | null) => void;
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

const runComponentLeaveGuard = (activation: RouteActivation | null, to: RouteMatch): Promise<string | undefined> => {
    if (!activation?.beforeLeave) return Promise.resolve(undefined);
    return new Promise<string | undefined>(resolve => activation.beforeLeave!(to, resolve));
};

export function createRouter(routes: RouteConfig[], options: {
    mode?: 'hash' | 'history';
    base?: string;
    transition?: string;
    beforeEach?: NavigationGuard;
    afterEach?: (to: RouteMatch, from: RouteMatch | null) => void;
    scrollBehavior?: ScrollBehavior;
} = {}): Router {
    const mode = options.mode ?? 'hash';
    const base = normalizeBase(options.base ?? '');

    const router: Router = {
        routes: normalizeRoutes(routes),
        mode,
        base,
        transition: options.transition,
        beforeEach: options.beforeEach,
        afterEach: options.afterEach,
        scrollBehavior: options.scrollBehavior,
        navigate(path: string, options?: { query?: Record<string, string> }) {
            const full = buildUrl(path, options?.query);
            if (mode === 'history') {
                history.pushState({}, '', `${base}${full}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                window.location.hash = full;
            }
        },
        replace(path: string, options?: { query?: Record<string, string> }) {
            const full = buildUrl(path, options?.query);
            if (mode === 'history') {
                history.replaceState({}, '', `${base}${full}`);
                window.dispatchEvent(new PopStateEvent('popstate'));
            } else {
                const baseHref = window.location.href.split('#')[0];
                window.location.replace(`${baseHref}#${full}`);
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

// Normalize: strip trailing slash; ensure leading slash if non-empty
function normalizeBase(base: string): string {
    if (!base || base === '/') return '';
    let b = base.startsWith('/') ? base : `/${base}`;
    if (b.endsWith('/')) b = b.slice(0, -1);
    return b;
}

/** Strip the router's base prefix from a pathname. Returns at least '/'. */
function stripBase(pathname: string, base: string): string {
    if (!base) return pathname || '/';
    if (pathname === base) return '/';
    if (pathname.startsWith(base + '/')) return pathname.slice(base.length) || '/';
    return pathname || '/';
}

function buildUrl(path: string, query?: Record<string, string>): string {
    if (!query || !Object.keys(query).length) return path;
    return `${path}?${new URLSearchParams(query).toString()}`;
}

function parseQuery(search: string): Record<string, string> {
    if (!search) return {};
    const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
    const out: Record<string, string> = {};
    params.forEach((v, k) => { out[k] = v; });
    return out;
}

export function setupRouterView(el: HTMLElement, router: Router, mount: MountFn, name = 'default', onFirstRender?: () => void): () => void {
    const base = router.base ?? '';
    const getCurrentPath = () => {
        if (router.mode === 'history') return stripBase(window.location.pathname, base);
        const hash = window.location.hash.slice(1) || '/';
        return hash.split('?')[0] || '/';
    };
    const getCurrentQuery = () => {
        if (router.mode === 'history') return parseQuery(window.location.search);
        const hash = window.location.hash.slice(1) || '/';
        const qIdx = hash.indexOf('?');
        return qIdx >= 0 ? parseQuery(hash.slice(qIdx + 1)) : {};
    };

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
        const asyncOpts = isFirstLoad ? (routeComp as any).__asyncOptions : undefined;
        const loadingHtml = route.loadingTemplate ?? asyncOpts?.loadingTemplate;
        if (isFirstLoad && loadingHtml) el.innerHTML = loadingHtml;
        let config: ComponentConfig;
        try {
            config = await resolveComponent(routeComp);
        } catch (err) {
            const errorHtml = asyncOpts?.errorTemplate;
            if (errorHtml) { el.innerHTML = errorHtml; return { destroy: () => { el.innerHTML = ''; } }; }
            throw err;
        }
        if (isFirstLoad && loadingHtml) el.innerHTML = '';
        return mount(el, config, routeMatch, layout, childRouter);
    };

    const render = async () => {
        const path = getCurrentPath();
        const query = getCurrentQuery();

        for (const route of router.routes) {
            // --- Nested routes ---
            if (route.children?.length) {
                const prefixMatch = matchRoutePrefix(route.path, path);
                if (prefixMatch !== null) {
                    for (const child of route.children) {
                        const childParams = matchRoute(child.path, path);
                        if (childParams !== null) {
                            const routeMatch: RouteMatch = { params: prefixMatch.params, query, path, meta: route.meta };

                            if (child.redirect) {
                                const childMatch: RouteMatch = { params: childParams, query, path, meta: child.meta };
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
                                const childMatch: RouteMatch = { params: childParams, query, path, meta: child.meta };
                                const r = await runGuard(child.beforeEnter, childMatch);
                                if (r) { router.navigate(r); return; }
                            }

                            const parentKey = `${route.path}::${JSON.stringify(prefixMatch.params)}`;

                            if (currentParentKey !== parentKey) {
                                const compLeaveRedirect = await runComponentLeaveGuard(prevActivation, routeMatch);
                                if (compLeaveRedirect) { router.navigate(compLeaveRedirect); return; }

                                const transitionName = route.transition ?? router.transition;
                                if (transitionName && el.hasChildNodes()) await animateEl(el, transitionName, 'leave');
                                leaveEl(prevRouteConfig);

                                const routeComp = getViewComponent(route, name);
                                if (routeComp) {
                                    const childRouter: Router = {
                                        routes: route.children!,
                                        mode: router.mode,
                                        base: router.base,
                                        transition: route.transition ?? router.transition,
                                        beforeEach: router.beforeEach,
                                        afterEach: router.afterEach,
                                        scrollBehavior: router.scrollBehavior,
                                        navigate: (p, o) => router.navigate(p, o),
                                        replace: (p, o) => router.replace(p, o),
                                        back: () => router.back(),
                                        forward: () => router.forward(),
                                    };
                                    prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === 'default' ? route.layout : undefined, name === 'default' ? childRouter : undefined);
                                    prevActivation.enter?.(prevRouteMatch);
                                } else {
                                    el.innerHTML = '';
                                }
                                currentParentKey = parentKey;
                                if (transitionName) await animateEl(el, transitionName, 'enter');
                            }

                            const combined: RouteMatch = { params: { ...prefixMatch.params, ...childParams }, query, path, meta: child.meta ?? route.meta };
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
                const routeMatch: RouteMatch = { params, query, path, meta: route.meta };

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

                const compLeaveRedirect = await runComponentLeaveGuard(prevActivation, routeMatch);
                if (compLeaveRedirect) { router.navigate(compLeaveRedirect); return; }

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
                        const fromRoute = prevRouteMatch;
                        prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === 'default' ? route.layout : undefined);
                        prevActivation.enter?.(fromRoute);
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
