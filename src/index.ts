import { AppConfig, ComponentConfig, RouteMatch, Router, WatcherOptions, DirectiveDef, DirectiveShorthand, ComputedDef } from './types.js';
import { createReactivityScope, batchUpdate, collectDeps } from './reactivity.js';
import { walk, WalkContext, evaluate, subscribeExpr, subscribeDeps, setStateValue } from './dom.js';
import { setupRouterView, RouteActivation } from './router.js';

export { createRouter } from './router.js';
export { createStore } from './store.js';
export { batchUpdate } from './reactivity.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard, ScrollBehavior, WatcherEntry, WatcherOptions, DirectiveBinding, DirectiveDef, DirectiveShorthand, LazyComponent, ComputedDef } from './types.js';
export type { StoreConfig } from './store.js';

export const nextTick = (cb?: () => void): Promise<void> =>
    cb ? Promise.resolve().then(cb) : Promise.resolve();

type AppContext = Omit<WalkContext, 'subscribe'> & {
    currentRoute?: RouteMatch;
    baseUrl?: string;
};

type MountResult = {
    state: any;
    destroy: () => void;
    activate: () => void;
    deactivate: () => void;
};

function parseVSlot(expr: string, scope: Record<string, any>): Record<string, any> {
    const t = expr.trim();
    if (t.startsWith('{')) {
        const keys = t.replace(/[{}]/g, '').split(',').map(k => k.trim()).filter(Boolean);
        return Object.fromEntries(keys.map(k => [k, scope[k]]));
    }
    return { [t]: scope };
}

const tryClone = (val: any): any => {
    if (val === null || typeof val !== 'object') return val;
    try { return structuredClone(val); } catch { return val; }
};

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

    const refs: Record<string, any> = {};
    const { subscribe, createReactiveState, registerSetInterceptor } = createReactivityScope();

    // inject — pull provided values into local state
    const injected: Record<string, any> = {};
    if (config.inject && appContext.provided) {
        const injectDefs: Record<string, string> = Array.isArray(config.inject)
            ? Object.fromEntries(config.inject.map(k => [k, k]))
            : config.inject;
        Object.entries(injectDefs).forEach(([localKey, provideKey]) => {
            if (appContext.provided && provideKey in appContext.provided) {
                injected[localKey] = appContext.provided[provideKey];
            }
        });
    }

    const state = createReactiveState({
        ...config.data,
        ...injected,
        ...config.methods,
        $refs: refs,
        $el: el,
        ...(appContext.slots ? { $slots: Object.fromEntries(Object.keys(appContext.slots).map(k => [k, true])) } : {}),
        ...(appContext.store ? { $store: appContext.store } : {}),
        ...(appContext.currentRoute ? { $route: appContext.currentRoute } : {}),
        ...(appContext.router ? { $router: appContext.router } : {}),
    });

    // $watch — programmatic watcher API
    (state as any).$watch = (key: string, handler: Function, options?: { immediate?: boolean; deep?: boolean }) => {
        const deep = options?.deep ?? false;
        const immediate = options?.immediate ?? false;
        let oldVal = deep ? tryClone((state as any)[key]) : (state as any)[key];
        const unsub = subscribe(key, () => {
            const newVal = (state as any)[key];
            handler.call(state, newVal, oldVal);
            oldVal = deep ? tryClone(newVal) : newVal;
        });
        if (immediate) handler.call(state, (state as any)[key], undefined);
        return unsub;
    };

    // $batch — group multiple state mutations into a single DOM flush
    (state as any).$batch = batchUpdate;

    // $nextTick — espera el siguiente tick del microtask queue
    (state as any).$nextTick = (cb?: () => void): Promise<void> => nextTick(cb);

    // Computed — auto-tracks deps via _activeEffect; soporta { get, set? }
    const computedCleanups: Array<() => void> = [];
    if (config.computed) {
        Object.entries(config.computed).forEach(([key, def]: [string, ComputedDef]) => {
            const getter = typeof def === 'function' ? def : def.get;
            const setter = typeof def !== 'function' ? def.set : undefined;
            let unsubs: Array<() => void> = [];
            const compute = () => {
                unsubs.forEach(u => u());
                unsubs = [];
                const rawDeps = collectDeps(() => { (state as any)[key] = getter.call(state); });
                const seen = new Map<Function, Set<string>>();
                for (const { sub, key: k } of rawDeps) {
                    if (!seen.has(sub)) seen.set(sub, new Set());
                    if (seen.get(sub)!.has(k)) continue;
                    seen.get(sub)!.add(k);
                    unsubs.push(sub(k, compute));
                }
            };
            compute();
            computedCleanups.push(() => unsubs.forEach(u => u()));
            if (setter) registerSetInterceptor(key, (val: any) => setter.call(state, val));
        });
    }

    // Watchers — soporta función directa o { handler, immediate?, deep? }
    const watcherUnsubs: Array<() => void> = [];
    if (config.watch) {
        Object.entries(config.watch).forEach(([key, watcherDef]) => {
            const isOptions = typeof watcherDef === 'object' && watcherDef !== null && 'handler' in watcherDef;
            const handler = isOptions ? (watcherDef as WatcherOptions).handler : watcherDef as Function;
            const immediate = isOptions ? ((watcherDef as WatcherOptions).immediate ?? false) : false;
            const deep = isOptions ? ((watcherDef as WatcherOptions).deep ?? false) : false;

            let oldVal = deep ? tryClone((state as any)[key]) : (state as any)[key];
            const unsub = subscribe(key, () => {
                const newVal = (state as any)[key];
                handler.call(state, newVal, oldVal);
                oldVal = deep ? tryClone(newVal) : newVal;
            });
            watcherUnsubs.push(unsub);
            if (immediate) {
                handler.call(state, (state as any)[key], undefined);
            }
        });
    }

    // provide — expone valores para componentes descendientes
    const childProvided: Record<string, any> = { ...(appContext.provided ?? {}) };
    if (config.provide) {
        const provideMap = typeof config.provide === 'function'
            ? (config.provide as Function).call(state)
            : config.provide;
        Object.assign(childProvided, provideMap);
    }

    const walkContext: AppContext = {
        ...appContext,
        provided: childProvided,
        components: { ...appContext.components, ...config.components },
    };
    walkContext.mountElement = createMountElement(walkContext);

    // mountDynamic — gestiona ciclo de vida de <component :is="...">
    walkContext.mountDynamic = async (anchor, compExpr, originalEl, parentState, parentContext) => {
        let currentEl: HTMLElement | null = null;
        let currentDestroy: (() => void) | null = null;

        const doRender = async () => {
            currentDestroy?.();
            currentDestroy = null;
            if (currentEl?.parentNode) { currentEl.parentNode.removeChild(currentEl); currentEl = null; }

            const compValue = evaluate(compExpr, parentState);
            if (!compValue) return;

            let config: ComponentConfig | undefined;
            if (typeof compValue === 'string') {
                config = walkContext.components?.[compValue];
            } else if (compValue && typeof compValue === 'object') {
                config = compValue as ComponentConfig;
            }
            if (!config) return;

            const newEl = document.createElement('div');
            Array.from(originalEl.attributes).forEach(a => newEl.setAttribute(a.name, a.value));
            newEl.innerHTML = originalEl.innerHTML;

            const props: Record<string, any> = {};
            const emitHandlers: Record<string, Function> = {};
            Array.from(originalEl.attributes).forEach(attr => {
                if (attr.name.startsWith(':')) {
                    props[attr.name.slice(1)] = evaluate(attr.value, parentState);
                } else if (attr.name.startsWith('@') || attr.name.startsWith('cv:on:')) {
                    const handlerName = attr.value;
                    const eventName = attr.name.startsWith('@') ? attr.name.slice(1) : attr.name.slice(6);
                    emitHandlers[eventName] = (...args: any[]) => {
                        if (typeof parentState[handlerName] === 'function') parentState[handlerName].call(parentState, ...args);
                    };
                }
            });

            const configWithProps: ComponentConfig = {
                ...config,
                data: { ...config.data, ...props },
                methods: {
                    ...config.methods,
                    $emit(_n: string, ..._a: any[]) { emitHandlers[_n]?.(..._a); }
                }
            };
            const localCtx: AppContext = { ...walkContext, components: { ...walkContext.components, ...config.components } };
            localCtx.mountElement = createMountElement(localCtx);

            const result = await mount(newEl, configWithProps, localCtx);
            currentDestroy = result.destroy;
            anchor.parentNode?.insertBefore(newEl, anchor.nextSibling);
            currentEl = newEl;
        };

        subscribeDeps(compExpr, parentContext, doRender);
        await doRender();
    };

    const cleanups: Array<() => void> = [];

    // error boundary — onError atrapa errores en este componente y sus hijos
    try {
        config.onBeforeMount?.call(state);
        await walk(el, state, { subscribe, refs, ...walkContext, registerCleanup: (c) => cleanups.push(c) });
        el.removeAttribute('cv-cloak');
        config.onMount?.call(state);
    } catch (err) {
        if (config.onError) {
            el.removeAttribute('cv-cloak');
            config.onError.call(state, err as Error);
        } else {
            throw err;
        }
    }

    return {
        state,
        destroy: () => {
            config.onBeforeUnmount?.call(state);
            computedCleanups.forEach(c => c());
            watcherUnsubs.forEach(u => u());
            cleanups.forEach(c => c());
            config.onDestroy?.call(state);
        },
        activate: () => { config.onActivated?.call(state); },
        deactivate: () => { config.onDeactivated?.call(state); },
    };
}

function createMountElement(appContext: AppContext): AppContext['mountElement'] {
    return async (el, tagName, parentState, parentContext) => {
        const componentConfig = appContext.components![tagName];

        // cv-ref en componente: dom.ts lo deja intacto para que lo manejemos aquí
        const compRefName = el.getAttribute('cv-ref');
        if (compRefName) el.removeAttribute('cv-ref');

        const props: Record<string, any> = {};
        const propBindings: Array<{ propName: string; expr: string }> = [];
        const emitHandlers: Record<string, Function> = {};

        // cv-model en componentes — uno o múltiples: cv-model="x" | cv-model:titulo="x"
        Array.from(el.attributes)
            .filter(a => a.name === 'cv-model' || a.name.startsWith('cv-model.') || a.name.startsWith('cv-model:'))
            .forEach(cvModelAttr => {
                el.removeAttribute(cvModelAttr.name);
                const modelExpr = cvModelAttr.value;
                const colonIdx = cvModelAttr.name.indexOf(':');
                const propName = colonIdx >= 0 ? cvModelAttr.name.slice(colonIdx + 1).split('.')[0] : 'modelValue';
                const emitEvent = propName === 'modelValue' ? 'update:modelValue' : `update:${propName}`;
                props[propName] = evaluate(modelExpr, parentState);
                propBindings.push({ propName, expr: modelExpr });
                emitHandlers[emitEvent] = (newVal: any) => { setStateValue(modelExpr, parentState, newVal); };
            });

        // $attrs — atributos no-framework que el componente no consumió
        const $attrs: Record<string, string> = {};
        Array.from(el.attributes).forEach(attr => {
            const isBinding = attr.name.startsWith(':');
            const isEvent = attr.name.startsWith('@') || attr.name.startsWith('cv:on:');
            const isCvModel = attr.name === 'cv-model' || attr.name.startsWith('cv-model.') || attr.name.startsWith('cv-model:');
            const isVSlot = attr.name.startsWith('v-slot');
            const isSlot = attr.name === 'slot';
            if (!isBinding && !isEvent && !isCvModel && !isVSlot && !isSlot) {
                $attrs[attr.name] = attr.value;
            }
        });
        if (componentConfig.inheritAttrs === false) {
            Object.keys($attrs).forEach(k => el.removeAttribute(k));
        }

        Array.from(el.attributes).forEach(attr => {
            if (attr.name.startsWith(':')) {
                const propName = attr.name.slice(1);
                const expr = attr.value;
                props[propName] = evaluate(expr, parentState);
                propBindings.push({ propName, expr });
            } else if (attr.name.startsWith('@') || attr.name.startsWith('cv:on:')) {
                const eventName = attr.name.startsWith('@') ? attr.name.slice(1) : attr.name.slice(6);
                const handlerName = attr.value;
                emitHandlers[eventName] = (...args: any[]) => {
                    if (typeof parentState[handlerName] === 'function') {
                        parentState[handlerName].call(parentState, ...args);
                    }
                };
            }
        });

        const defaultVSlot = el.getAttribute('v-slot') ?? el.getAttribute('v-slot:default');
        if (defaultVSlot) { el.removeAttribute('v-slot'); el.removeAttribute('v-slot:default'); }

        const namedSlots = new Map<string, { nodes: Node[]; vSlot: string | null }>();
        const defaultSlotNodes: Node[] = [];
        Array.from(el.childNodes).forEach(n => {
            const slotName = n.nodeType === 1 ? (n as HTMLElement).getAttribute('slot') : null;
            if (slotName) {
                if (!namedSlots.has(slotName)) {
                    const namedVSlot = el.getAttribute(`v-slot:${slotName}`) ?? null;
                    if (namedVSlot) el.removeAttribute(`v-slot:${slotName}`);
                    namedSlots.set(slotName, { nodes: [], vSlot: namedVSlot });
                }
                namedSlots.get(slotName)!.nodes.push(n.cloneNode(true));
            } else {
                defaultSlotNodes.push(n.cloneNode(true));
            }
        });

        const slots: WalkContext['slots'] = {};
        if (defaultSlotNodes.some(n => n.nodeType === 1 || (n.nodeType === 3 && (n.textContent?.trim() ?? '') !== ''))) {
            slots['default'] = async (scope) => {
                const slotState = defaultVSlot ? { ...parentState, ...parseVSlot(defaultVSlot, scope) } : parentState;
                const frag = document.createDocumentFragment();
                defaultSlotNodes.forEach(n => frag.appendChild(n.cloneNode(true)));
                await walk(frag, slotState, parentContext);
                return Array.from(frag.childNodes);
            };
        }
        for (const [name, { nodes, vSlot }] of namedSlots) {
            slots[name] = async (scope) => {
                const slotState = vSlot ? { ...parentState, ...parseVSlot(vSlot, scope) } : parentState;
                const frag = document.createDocumentFragment();
                nodes.forEach(n => frag.appendChild(n.cloneNode(true)));
                await walk(frag, slotState, parentContext);
                return Array.from(frag.childNodes);
            };
        }

        const localContext: AppContext = {
            ...appContext,
            components: { ...appContext.components, ...componentConfig.components },
            slots,
        };
        localContext.mountElement = createMountElement(localContext);

        const configWithProps: ComponentConfig = {
            ...componentConfig,
            data: { ...componentConfig.data, ...props, $attrs, $parent: parentState },
            methods: {
                ...componentConfig.methods,
                $emit(_eventName: string, ..._args: any[]) {
                    emitHandlers[_eventName]?.(..._args);
                }
            }
        };

        const { state: childState } = await mount(el, configWithProps, localContext);

        if (childState) {
            propBindings.forEach(({ propName, expr }) => {
                subscribeExpr(expr, { ...parentContext, subscribe: parentContext.subscribe }, () => {
                    childState[propName] = evaluate(expr, parentState);
                });
            });
            if (compRefName && parentContext.refs) {
                parentContext.refs[compRefName] = childState;
            }
        }
    };
}

export interface CourvuxPlugin {
    install(app: CourvuxApp): void;
}

export interface CourvuxApp {
    use(plugin: CourvuxPlugin): CourvuxApp;
    directive(name: string, def: DirectiveDef | DirectiveShorthand): CourvuxApp;
    mount(selector: string): Promise<CourvuxApp>;
    router?: Router;
}

export function createApp(config: AppConfig): CourvuxApp {
    const plugins: CourvuxPlugin[] = [];
    const directives: Record<string, DirectiveDef | DirectiveShorthand> = { ...config.directives };

    const app: CourvuxApp = {
        router: config.router,
        use(plugin) {
            if (!plugins.includes(plugin)) {
                plugins.push(plugin);
                plugin.install(app);
            }
            return app;
        },
        directive(name, def) {
            directives[name] = def;
            return app;
        },
        mount: async (selector: string) => { await _mount(selector); return app; }
    };

    const _mount = async (selector: string) => {
        const root = document.querySelector(selector) as HTMLElement;
        if (!root) return;

        const baseUrl = new URL('.', document.baseURI).href;

        const appContext: AppContext = {
            components: config.components,
            router: config.router,
            store: config.store,
            directives,
            baseUrl,
        };

        appContext.mountElement = createMountElement(appContext);

        if (config.router) {
            const router = config.router;
            appContext.mountRouterView = async (el: HTMLElement, name?: string) => {
                await new Promise<void>(resolve => {
                    setupRouterView(el, router, async (el, cfg, route, layout, childRouter): Promise<RouteActivation> => {
                        const routeContext: AppContext = { ...appContext, currentRoute: route };

                        if (childRouter) {
                            let innerCleanup: (() => void) | null = null;

                            const ctxWithChild: AppContext = {
                                ...routeContext,
                                mountRouterView: async (innerEl: HTMLElement, innerName?: string) => {
                                    innerCleanup = setupRouterView(innerEl, childRouter, async (innerEl2, innerCfg, innerRoute, innerLayout): Promise<RouteActivation> => {
                                        const innerCtx: AppContext = { ...routeContext, currentRoute: innerRoute };
                                        if (innerLayout) {
                                            let innerCmpResult: MountResult | null = null;
                                            const innerLayoutCtx: AppContext = {
                                                ...innerCtx,
                                                mountRouterView: async (deepEl: HTMLElement, _deepName?: string) => {
                                                    innerCmpResult = await mount(deepEl, innerCfg, innerCtx);
                                                }
                                            };
                                            const { destroy: ld } = await mount(innerEl2, { template: innerLayout }, innerLayoutCtx);
                                            return {
                                                destroy: () => { innerCmpResult?.destroy(); ld(); },
                                                activate: () => innerCmpResult?.activate(),
                                                deactivate: () => innerCmpResult?.deactivate(),
                                            };
                                        } else {
                                            return await mount(innerEl2, innerCfg, innerCtx);
                                        }
                                    }, innerName);
                                }
                            };

                            if (layout) {
                                let cmpResult: MountResult | null = null;
                                const layoutCtx: AppContext = {
                                    ...ctxWithChild,
                                    mountRouterView: async (innerEl: HTMLElement, _innerName?: string) => {
                                        cmpResult = await mount(innerEl, cfg, ctxWithChild);
                                    }
                                };
                                const { destroy: ld } = await mount(el, { template: layout }, layoutCtx);
                                return {
                                    destroy: () => { innerCleanup?.(); cmpResult?.destroy(); ld(); },
                                    activate: () => cmpResult?.activate(),
                                    deactivate: () => cmpResult?.deactivate(),
                                };
                            } else {
                                const result = await mount(el, cfg, ctxWithChild);
                                return {
                                    destroy: () => { innerCleanup?.(); result.destroy(); },
                                    activate: () => result.activate(),
                                    deactivate: () => result.deactivate(),
                                };
                            }
                        } else {
                            if (layout) {
                                let cmpResult: MountResult | null = null;
                                const layoutContext: AppContext = {
                                    ...routeContext,
                                    mountRouterView: async (innerEl: HTMLElement, _innerName?: string) => {
                                        cmpResult = await mount(innerEl, cfg, routeContext);
                                    }
                                };
                                const { destroy: layoutDestroy } = await mount(el, { template: layout }, layoutContext);
                                return {
                                    destroy: () => { cmpResult?.destroy(); layoutDestroy(); },
                                    activate: () => cmpResult?.activate(),
                                    deactivate: () => cmpResult?.deactivate(),
                                };
                            } else {
                                return await mount(el, cfg, routeContext);
                            }
                        }
                    }, name, resolve);
                });
            };
        }

        const { state } = await mount(root, config, appContext);
        return state;
    };

    return app;
}
