import { AppConfig, ComponentConfig } from './types.js';
import { createReactivityScope } from './reactivity.js';
import { walk, WalkContext, evaluate, subscribeExpr } from './dom.js';
import { setupRouterView } from './router.js';

export { createRouter } from './router.js';
export { createStore } from './store.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router } from './types.js';

type AppContext = Omit<WalkContext, 'subscribe'>;

async function mount(el: HTMLElement, config: ComponentConfig, appContext: AppContext): Promise<any> {
    if (config.templateUrl) {
        const html = await fetch(config.templateUrl).then(r => r.text());
        el.innerHTML = html;
    } else if (config.template) {
        el.innerHTML = config.template;
    }

    const { subscribe, createReactiveState } = createReactivityScope();
    const state = createReactiveState({
        ...config.data,
        ...config.methods,
        ...(appContext.store ? { $store: appContext.store } : {})
    });

    await walk(el, state, { subscribe, ...appContext });
    el.removeAttribute('cv-cloak');
    return state;
}

function createMountElement(appContext: AppContext): AppContext['mountElement'] {
    return async (el, tagName, parentState, parentContext) => {
        const componentConfig = appContext.components![tagName];

        // Extraer props de atributos :prop="expr"
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

        // Contexto local: mezcla componentes globales + locales del componente
        const localContext: AppContext = {
            ...appContext,
            components: { ...appContext.components, ...componentConfig.components },
        };
        localContext.mountElement = createMountElement(localContext);

        const configWithProps: ComponentConfig = {
            ...componentConfig,
            data: { ...componentConfig.data, ...props }
        };

        const childState = await mount(el, configWithProps, localContext);

        // Suscribir cambios del padre → actualizar props del hijo
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

    const appContext: AppContext = {
        components: config.components,
        router: config.router,
        store: config.store,
    };

    appContext.mountElement = createMountElement(appContext);

    if (config.router) {
        const router = config.router;
        appContext.mountRouterView = async (el: HTMLElement) => {
            setupRouterView(el, router, (el, cfg) => mount(el, cfg, appContext));
        };
    }

    return mount(root, config, appContext);
}
