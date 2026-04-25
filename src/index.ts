import { AppConfig, ComponentConfig, RouteMatch } from './types.js';
import { createReactivityScope } from './reactivity.js';
import { walk, WalkContext, evaluate, subscribeExpr } from './dom.js';
import { setupRouterView } from './router.js';

export { createRouter } from './router.js';
export { createStore } from './store.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard } from './types.js';

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

    // Computed properties — evaluated eagerly, re-run when this.x deps change
    if (config.computed) {
        Object.entries(config.computed).forEach(([key, fn]) => {
            const compute = () => { (state as any)[key] = fn.call(state); };
            const deps = [...fn.toString().matchAll(/this\.(\w+)/g)].map(m => m[1]);
            [...new Set(deps)].forEach(dep => subscribe(dep, compute));
            compute();
        });
    }

    // Watchers — fire handler(newVal, oldVal) when key changes
    if (config.watch) {
        Object.entries(config.watch).forEach(([key, handler]) => {
            let oldVal = (state as any)[key];
            subscribe(key, () => {
                const newVal = (state as any)[key];
                handler.call(state, newVal, oldVal);
                oldVal = newVal;
            });
        });
    }

    await walk(el, state, { subscribe, ...appContext });
    el.removeAttribute('cv-cloak');

    config.onMount?.call(state);

    const destroy = () => { config.onDestroy?.call(state); };
    return { state, destroy };
}

function createMountElement(appContext: AppContext): AppContext['mountElement'] {
    return async (el, tagName, parentState, parentContext) => {
        const componentConfig = appContext.components![tagName];

        // Props — :prop="expr" bindings
        const props: Record<string, any> = {};
        const propBindings: Array<{ propName: string; expr: string }> = [];

        // $emit handlers — @event="handler" on component tag
        const emitHandlers: Record<string, Function> = {};

        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith(':')) {
                const propName = attr.name.slice(1);
                const expr = attr.value;
                props[propName] = evaluate(expr, parentState);
                propBindings.push({ propName, expr });
            } else if (attr.name.startsWith('@')) {
                const eventName = attr.name.slice(1);
                const handlerName = attr.value;
                emitHandlers[eventName] = (...args: any[]) => {
                    if (typeof parentState[handlerName] === 'function') {
                        parentState[handlerName].call(parentState, ...args);
                    }
                };
            }
        });

        // Slots — capture children before mount replaces innerHTML
        const slotNodes = Array.from(el.childNodes).map(n => n.cloneNode(true));
        const hasSlotContent = slotNodes.some(n =>
            n.nodeType === 1 || (n.nodeType === 3 && (n.textContent?.trim() ?? '') !== ''));

        const localContext: AppContext = {
            ...appContext,
            components: { ...appContext.components, ...componentConfig.components },
        };
        localContext.mountElement = createMountElement(localContext);

        const configWithProps: ComponentConfig = {
            ...componentConfig,
            data: { ...componentConfig.data, ...props },
            methods: {
                ...componentConfig.methods,
                $emit(_eventName: string, ..._args: any[]) {
                    emitHandlers[_eventName]?.(..._args);
                }
            }
        };

        const { state: childState } = await mount(el, configWithProps, localContext);

        // Inject slot content into <slot> element (walked with parent context)
        if (hasSlotContent) {
            const slotEl = el.querySelector('slot');
            if (slotEl) {
                const fragment = document.createDocumentFragment();
                slotNodes.forEach(n => fragment.appendChild(n));
                await walk(fragment, parentState, parentContext);
                slotEl.replaceWith(fragment);
            }
        }

        // Reactive prop bindings: parent changes → update child
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
            setupRouterView(el, router, async (el, cfg, route, layout) => {
                destroyPrev?.();
                destroyPrev = null;
                const routeContext: AppContext = { ...appContext, currentRoute: route };

                if (layout) {
                    let componentDestroy: (() => void) | null = null;
                    const layoutContext: AppContext = {
                        ...routeContext,
                        mountRouterView: async (innerEl: HTMLElement) => {
                            const { destroy } = await mount(innerEl, cfg, routeContext);
                            componentDestroy = destroy;
                        }
                    };
                    const { destroy: layoutDestroy } = await mount(el, { template: layout }, layoutContext);
                    destroyPrev = () => { componentDestroy?.(); layoutDestroy(); };
                } else {
                    const { destroy } = await mount(el, cfg, routeContext);
                    destroyPrev = destroy;
                }
            });
        };
    }

    const { state } = await mount(root, config, appContext);
    return state;
}
