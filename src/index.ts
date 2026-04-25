import { AppConfig, ComponentConfig, RouteMatch } from './types.js';
import { createReactivityScope } from './reactivity.js';
import { walk, WalkContext, evaluate, subscribeExpr } from './dom.js';
import { setupRouterView } from './router.js';

export { createRouter } from './router.js';
export { createStore } from './store.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch } from './types.js';

type AppContext = Omit<WalkContext, 'subscribe'> & {
    currentRoute?: RouteMatch;
    baseUrl?: string;
};

type MountResult = { state: any; destroy: () => void };

async function mount(el: HTMLElement, config: ComponentConfig, appContext: AppContext): Promise<MountResult> {
    if (config.templateUrl) {
        const url = appContext.baseUrl
            ? new URL(config.templateUrl, appContext.baseUrl).href
            : config.templateUrl;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load template: ${url} (${res.status})`);
        el.innerHTML = await res.text();
    } else if (config.template) {
        el.innerHTML = config.template;
    }

    const { subscribe, createReactiveState } = createReactivityScope();
    const state = createReactiveState({
        ...config.data,
        ...config.methods,
        ...(appContext.store ? { $store: appContext.store } : {}),
        ...(appContext.currentRoute ? { $route: appContext.currentRoute } : {})
    });

    await walk(el, state, { subscribe, ...appContext });
    el.removeAttribute('cv-cloak');

    config.onMount?.call(state);

    const destroy = () => { config.onDestroy?.call(state); };
    return { state, destroy };
}

function createMountElement(appContext: AppContext): AppContext['mountElement'] {
    return async (el, tagName, parentState, parentContext) => {
        const componentConfig = appContext.components![tagName];

        const props: Record<string, any> = {};
        const propBindings: Array<{ propName: string; expr: string }> = [];

        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith(':')) {
                const propName = attr.name.slice(1);
                const expr = attr.value;
                props[propName] = evaluate(expr, parentState);
                propBindings.push({ propName, expr });
            }
        });

        const localContext: AppContext = {
            ...appContext,
            components: { ...appContext.components, ...componentConfig.components },
        };
        localContext.mountElement = createMountElement(localContext);

        const configWithProps: ComponentConfig = {
            ...componentConfig,
            data: { ...componentConfig.data, ...props }
        };

        const { state: childState } = await mount(el, configWithProps, localContext);

        if (childState) {
            propBindings.forEach(({ propName, expr }) => {
                subscribeExpr(expr, { ...parentContext, subscribe: parentContext.subscribe }, () => {
                    childState[propName] = evaluate(expr, parentState);
                });
            });
        }
    };
}

export async function createApp(selector: string, config: AppConfig) {
    const root = document.querySelector(selector) as HTMLElement;
    if (!root) return;

    const baseUrl = new URL('.', document.baseURI).href;

    const appContext: AppContext = {
        components: config.components,
        router: config.router,
        store: config.store,
        baseUrl,
    };

    appContext.mountElement = createMountElement(appContext);

    if (config.router) {
        const router = config.router;
        appContext.mountRouterView = async (el: HTMLElement) => {
            let destroyPrev: (() => void) | null = null;
            setupRouterView(el, router, async (el, cfg, route) => {
                destroyPrev?.();
                const routeContext: AppContext = { ...appContext, currentRoute: route };
                const { destroy } = await mount(el, cfg, routeContext);
                destroyPrev = destroy;
            });
        };
    }

    const { state } = await mount(root, config, appContext);
    return state;
}
