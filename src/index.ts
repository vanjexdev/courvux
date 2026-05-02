import { AppConfig, ComponentConfig, RouteMatch, Router, WatcherOptions, DirectiveDef, DirectiveShorthand, ComputedDef, LazyComponent } from './types.js';
import { createReactivityScope, batchUpdate, collectDeps, markRaw, toRaw } from './reactivity.js';
import { walk, WalkContext, evaluate, subscribeExpr, subscribeDeps, setStateValue, injectCloakStyle } from './dom.js';
import { setupRouterView, RouteActivation } from './router.js';
import { setupDevTools, nextDevToolsId, DevToolsStoreEntry } from './devtools.js';
import { mountDevOverlay } from './overlay.js';
import { SSR_ATTR } from './ssr.js';
import { subscribeToStore } from './store.js';

export { createRouter } from './router.js';
export { createStore } from './store.js';
export { batchUpdate, markRaw, toRaw, readonly } from './reactivity.js';
export { createEventBus } from './events.js';
export type { EventBus } from './events.js';
export { cvStorage, cvListener, cvMediaQuery, cvFetch, cvDebounce, cvThrottle } from './composables.js';
export type { FetchState, FetchOptions } from './composables.js';
export { setupDevTools } from './devtools.js';
export { mountDevOverlay } from './overlay.js';
export { renderToString, renderPage, renderHeadToString, SSR_ATTR } from './ssr.js';
export type { RenderedPage } from './ssr.js';
export { useHead } from './head.js';
export type { HeadConfig, HeadMeta, HeadLink, HeadScript } from './head.js';
export type { DevToolsHook, DevToolsComponentInstance, DevToolsStoreEntry } from './devtools.js';
export type { AppConfig, ComponentConfig, RouteConfig, Router, RouteMatch, NavigationGuard, ScrollBehavior, WatcherEntry, WatcherOptions, DirectiveBinding, DirectiveDef, DirectiveShorthand, LazyComponent, ComputedDef } from './types.js';
export type { RouteActivation } from './router.js';
export type { StoreConfig } from './store.js';

export const nextTick = (cb?: () => void): Promise<void> =>
    cb ? Promise.resolve().then(cb) : Promise.resolve();

type AppContext = Omit<WalkContext, 'subscribe'> & {
    currentRoute?: RouteMatch;
    baseUrl?: string;
    errorHandler?: (err: Error, instance: any, componentName: string) => void;
    globalProperties?: Record<string, any>;
    magics?: Record<string, (instance: any) => any>;
};

type MountResult = {
    state: any;
    destroy: () => void;
    activate: () => void;
    deactivate: () => void;
    beforeLeave?: (to: RouteMatch, next: (redirect?: string) => void) => void;
    enter?: (from: RouteMatch | null) => void;
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
    const refs: Record<string, any> = {};
    const { subscribe, createReactiveState, registerSetInterceptor, notifyAll } = createReactivityScope();

    // Resolve data — if async, show loadingTemplate while awaiting
    let rawData: Record<string, any>;
    if (typeof config.data === 'function') {
        if (config.loadingTemplate) el.innerHTML = config.loadingTemplate;
        rawData = await (config.data as () => Record<string, any> | Promise<Record<string, any>>)();
    } else {
        rawData = config.data ?? {};
    }

    // Inject template (replaces loadingTemplate if shown)
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

    // Remove SSR marker (no-op if not present)
    el.removeAttribute(SSR_ATTR);
    el.querySelector(`[${SSR_ATTR}]`)?.removeAttribute(SSR_ATTR);

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
        ...(appContext.globalProperties ?? {}),
        ...rawData,
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

    // $dispatch — fire a custom DOM event that bubbles up from $el
    (state as any).$dispatch = (eventName: string, detail?: any, options?: CustomEventInit) => {
        el.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, ...(options ?? {}), detail }));
    };

    // magics — inject app-level magic properties registered via app.magic()
    if (appContext.magics) {
        Object.entries(appContext.magics).forEach(([key, fn]) => {
            (state as any)[key] = fn(state);
        });
    }

    // $forceUpdate — re-notifies all reactive keys, forcing every DOM subscription to re-run
    (state as any).$forceUpdate = () => notifyAll();

    // $watchEffect — auto-dep-tracking side effect; auto-stopped on destroy
    const watchEffectStops: Array<() => void> = [];
    (state as any).$watchEffect = (fn: () => void): (() => void) => {
        let unsubs: Array<() => void> = [];
        const run = () => {
            unsubs.forEach(u => u());
            unsubs = [];
            const rawDeps = collectDeps(() => { try { fn(); } catch { /* */ } });
            const seen = new Map<Function, Set<string>>();
            for (const { sub, key: k } of rawDeps) {
                if (!seen.has(sub)) seen.set(sub, new Set());
                if (seen.get(sub)!.has(k)) continue;
                seen.get(sub)!.add(k);
                unsubs.push(sub(k, run));
            }
        };
        run();
        const stop = () => {
            unsubs.forEach(u => u());
            unsubs = [];
            const idx = watchEffectStops.indexOf(stop);
            if (idx > -1) watchEffectStops.splice(idx, 1);
        };
        watchEffectStops.push(stop);
        return stop;
    };

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
                // Collect deps by running the getter ONLY — do NOT set inside collectDeps.
                // Setting inside would trigger notifyKey(key) while _activeEffect is active,
                // causing downstream DOM callbacks to pollute deps → computed subscribes to
                // its own output key → infinite loop.
                let computedValue: any;
                const rawDeps = collectDeps(() => { try { computedValue = getter.call(state); } catch (e) { if ((config as any).debug ?? (appContext as any).debug) console.warn('[courvux] computed error:', e); } });
                (state as any)[key] = computedValue;
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

    // createChildScope — factory for cv-data inline scopes; child keys get own reactivity,
    // parent keys delegate to current component's subscribe (live inheritance)
    walkContext.createChildScope = (inlineData, inlineMethods) => {
        const dataKeys = new Set(Object.keys(inlineData));
        const methodKeys = new Set(Object.keys(inlineMethods));
        const { subscribe: childSub, createReactiveState: childCreate } = createReactivityScope();
        const childReactive = childCreate(inlineData);

        let mergedState: any;
        mergedState = new Proxy({} as any, {
            get(_t, key: string) {
                if (typeof key !== 'string') return (state as any)[key];
                if (dataKeys.has(key)) return (childReactive as any)[key];
                if (methodKeys.has(key)) return (inlineMethods[key] as Function).bind(mergedState);
                return (state as any)[key];
            },
            set(_t, key: string, value) {
                if (typeof key !== 'string') return false;
                if (dataKeys.has(key)) { (childReactive as any)[key] = value; return true; }
                (state as any)[key] = value;
                return true;
            },
            has(_t, key) {
                return dataKeys.has(key as string) || methodKeys.has(key as string) || key in (state as any);
            },
            ownKeys() {
                return [...dataKeys, ...methodKeys, ...Object.keys(state as any)];
            },
            getOwnPropertyDescriptor(_t, key) {
                const has = dataKeys.has(key as string) || methodKeys.has(key as string) || key in (state as any);
                return has ? { configurable: true, enumerable: true, writable: true } : undefined;
            },
        });

        const mergedSub = (key: string, cb: Function) => {
            if (dataKeys.has(key)) return childSub(key, cb);
            return domSubscribe(key, cb);
        };

        return { state: mergedState, subscribe: mergedSub, cleanup: () => {} };
    };

    // mountDynamic — gestiona ciclo de vida de <component :is="...">
    walkContext.mountDynamic = async (anchor, compExpr, originalEl, parentState, parentContext) => {
        let currentEl: HTMLElement | null = null;
        let currentDestroy: (() => void) | null = null;

        const fallbackHtml = originalEl.getAttribute('loading-template') ?? '';

        const doRender = async () => {
            currentDestroy?.();
            currentDestroy = null;
            if (currentEl?.parentNode) { currentEl.parentNode.removeChild(currentEl); currentEl = null; }

            const compValue = evaluate(compExpr, parentState);
            if (!compValue) return;

            let config: ComponentConfig | undefined;
            if (typeof compValue === 'function') {
                if (fallbackHtml) {
                    const fb = document.createElement('div');
                    fb.innerHTML = fallbackHtml;
                    anchor.parentNode?.insertBefore(fb, anchor.nextSibling);
                    currentEl = fb;
                }
                const mod = await (compValue as () => Promise<{ default: ComponentConfig }>)();
                config = mod.default;
                if (currentEl?.parentNode) { currentEl.parentNode.removeChild(currentEl); currentEl = null; }
            } else if (typeof compValue === 'string') {
                config = walkContext.components?.[compValue];
            } else if (compValue && typeof compValue === 'object') {
                config = compValue as ComponentConfig;
            }
            if (!config) return;

            const newEl = document.createElement('div');
            // Forward non-framework attributes to the wrapper. Framework
            // directive names (`@event`, `:prop`, `cv-*`, `v-slot`) are
            // either consumed by the prop/emit extraction below OR not
            // valid HTML attribute names through the setAttribute() DOM API
            // in stricter browsers (Safari, Samsung Internet) — copying
            // them here would throw `InvalidCharacterError` and abort the
            // dynamic mount, same class of bug as router-link in 0.4.4.
            const isFrameworkAttr = (name: string): boolean =>
                name.startsWith('@') || name.startsWith('cv:on:') ||
                name.startsWith(':') || name.startsWith('cv-') ||
                name.startsWith('v-slot');
            Array.from(originalEl.attributes).forEach(a => {
                if (!isFrameworkAttr(a.name)) newEl.setAttribute(a.name, a.value);
            });
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
                    $emit(_n: string, ..._a: any[]) { validateEmit(config, _n, _a); emitHandlers[_n]?.(..._a); }
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

    // $addCleanup — register a teardown function that runs when component is destroyed
    (state as any).$addCleanup = (fn: () => void) => { cleanups.push(fn); };

    // Wrap subscribe for onBeforeUpdate/onUpdated lifecycle hooks on DOM subscriptions
    let _updatePending = false;
    const domSubscribe = (key: string, cb: Function): (() => void) => {
        if (!config.onBeforeUpdate && !config.onUpdated) return subscribe(key, cb);
        return subscribe(key, () => {
            if (!_updatePending) {
                _updatePending = true;
                config.onBeforeUpdate?.call(state);
                Promise.resolve().then(() => {
                    _updatePending = false;
                    config.onUpdated?.call(state);
                });
            }
            cb();
        });
    };

    // error boundary — onError atrapa errores en este componente y sus hijos
    try {
        config.onBeforeMount?.call(state);
        await walk(el, state, { subscribe: domSubscribe, refs, ...walkContext, registerCleanup: (c) => cleanups.push(c) });
        el.removeAttribute('cv-cloak');
        config.onMount?.call(state);
    } catch (err) {
        if (config.onError) {
            el.removeAttribute('cv-cloak');
            config.onError.call(state, err as Error);
        } else if (appContext.errorHandler) {
            el.removeAttribute('cv-cloak');
            appContext.errorHandler(err as Error, state, config.name ?? el.tagName.toLowerCase());
        } else {
            throw err;
        }
    }

    // DevTools integration
    const devtools = typeof window !== 'undefined' ? window.__COURVUX_DEVTOOLS__ : undefined;
    const devId = devtools ? nextDevToolsId() : 0;
    if (devtools) {
        const s = state as Record<string, any>;
        const updateListeners = new Set<() => void>();
        const devInstance = {
            id: devId,
            name: config.name ?? el.tagName.toLowerCase(),
            el,
            getState: () => {
                const snap: Record<string, any> = {};
                for (const k of Object.keys(s)) {
                    if (k.startsWith('$') || typeof s[k] === 'function') continue;
                    try { snap[k] = s[k]; } catch { /* getter error */ }
                }
                return snap;
            },
            setState: (key: string, value: any) => { s[key] = value; },
            subscribe: (cb: () => void) => {
                updateListeners.add(cb);
                return () => updateListeners.delete(cb);
            },
            children: [],
        };
        Object.keys(s).filter(k => !k.startsWith('$') && typeof s[k] !== 'function').forEach(k => {
            subscribe(k, () => {
                devtools._emit('update', devInstance);
                updateListeners.forEach(cb => cb());
            });
        });
        devtools._registerInstance(devInstance);
        cleanups.push(() => devtools._unregisterInstance(devId));
    }

    return {
        state,
        destroy: () => {
            config.onBeforeUnmount?.call(state);
            computedCleanups.forEach(c => c());
            watcherUnsubs.forEach(u => u());
            watchEffectStops.forEach(s => s());
            cleanups.forEach(c => c());
            config.onDestroy?.call(state);
        },
        activate: () => { config.onActivated?.call(state); },
        deactivate: () => { config.onDeactivated?.call(state); },
        beforeLeave: config.onBeforeRouteLeave
            ? (to: RouteMatch, next: (redirect?: string) => void) => config.onBeforeRouteLeave!.call(state, to, next)
            : undefined,
        enter: config.onBeforeRouteEnter
            ? (from: RouteMatch | null) => config.onBeforeRouteEnter!.call(state, from)
            : undefined,
    };
}

function validateEmit(config: ComponentConfig, eventName: string, args: any[]): void {
    if (!config.emits || Array.isArray(config.emits)) return;
    const validator = (config.emits as Record<string, ((...a: any[]) => boolean) | null>)[eventName];
    if (typeof validator === 'function' && !validator(...args)) {
        console.warn(`[courvux] emit "${eventName}": validator returned false`);
    }
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
                props[propName] = toRaw(evaluate(modelExpr, parentState));
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
                props[propName] = toRaw(evaluate(expr, parentState));
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
                    validateEmit(componentConfig, _eventName, _args);
                    emitHandlers[_eventName]?.(..._args);
                }
            }
        };

        const { state: childState } = await mount(el, configWithProps, localContext);

        if (childState) {
            propBindings.forEach(({ propName, expr }) => {
                subscribeExpr(expr, { ...parentContext, subscribe: parentContext.subscribe }, () => {
                    childState[propName] = toRaw(evaluate(expr, parentState));
                });
            });
            if (compRefName && parentContext.refs) {
                parentContext.refs[compRefName] = childState;
            }
        }
    };
}

export interface ComponentThis {
    $el: HTMLElement;
    $refs: Record<string, Element | Record<string, any>>;
    $router: Router;
    $store: Record<string, any>;
    $route: RouteMatch;
    $slots: Record<string, boolean>;
    $attrs: Record<string, string>;
    $parent: Record<string, any>;
    $emit(event: string, ...args: any[]): void;
    $dispatch(event: string, detail?: any, options?: CustomEventInit): void;
    $watch(key: string, handler: (newVal: any, oldVal: any) => void, options?: { immediate?: boolean; deep?: boolean }): () => void;
    $watchEffect(fn: () => void): () => void;
    $forceUpdate(): void;
    $addCleanup(fn: () => void): void;
    $batch(fn: () => void): void;
    $nextTick(cb?: () => void): Promise<void>;
    [key: string]: any;
}

type Inst<D, M> = D & M & ComponentThis;
type ComputedFn<D, M> = ((this: Inst<D, M>) => any) | { get(this: Inst<D, M>): any; set?(this: Inst<D, M>, val: any): void };
type WatchFn<D, M> = ((this: Inst<D, M>, n: any, o: any) => void) | { handler(this: Inst<D, M>, n: any, o: any): void; immediate?: boolean; deep?: boolean };

export function defineComponent<
    D extends Record<string, any> = Record<string, never>,
    M extends Record<string, Function> = Record<string, never>
>(config: {
    name?: string;
    template?: string;
    templateUrl?: string;
    data?: D | (() => D | Promise<D>);
    methods?: M & ThisType<Inst<D, M>>;
    computed?: Record<string, ComputedFn<D, M>>;
    watch?: Record<string, WatchFn<D, M>>;
    emits?: string[] | Record<string, ((...args: any[]) => boolean) | null>;
    components?: Record<string, ComponentConfig>;
    provide?: Record<string, any> | ((this: Inst<D, M>) => Record<string, any>);
    inject?: string[] | Record<string, string>;
    inheritAttrs?: boolean;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    onBeforeMount?(this: Inst<D, M>): void;
    onMount?(this: Inst<D, M>): void;
    onBeforeUpdate?(this: Inst<D, M>): void;
    onUpdated?(this: Inst<D, M>): void;
    onBeforeUnmount?(this: Inst<D, M>): void;
    onDestroy?(this: Inst<D, M>): void;
    onActivated?(this: Inst<D, M>): void;
    onDeactivated?(this: Inst<D, M>): void;
    onError?(this: Inst<D, M>, err: Error): void;
    onBeforeRouteLeave?(this: Inst<D, M>, to: RouteMatch, next: (redirect?: string) => void): void;
    onBeforeRouteEnter?(this: Inst<D, M>, from: RouteMatch | null): void;
}): ComponentConfig {
    return config as unknown as ComponentConfig;
}

export interface AsyncComponentOptions {
    loader: LazyComponent;
    loadingTemplate?: string;
    errorTemplate?: string;
    timeout?: number;
    onError?: (err: Error, retry: () => void, fail: (e: Error) => void, attempts: number) => void;
}

export function defineAsyncComponent(options: LazyComponent | AsyncComponentOptions): LazyComponent {
    if (typeof options === 'function') return options;
    const { loader, timeout, onError } = options;
    let attempts = 0;
    const wrappedLoader: LazyComponent = () => new Promise((resolve, reject) => {
        attempts++;
        let settled = false;
        let timer: ReturnType<typeof setTimeout> | undefined;
        const settle = (fn: typeof resolve | typeof reject, val: any) => {
            if (settled) return; settled = true; clearTimeout(timer); fn(val as any);
        };
        if (timeout) timer = setTimeout(() => settle(reject, new Error(`[courvux] Async component timed out after ${timeout}ms`)), timeout);
        loader().then(
            mod => settle(resolve, mod),
            err => {
                if (!onError) { settle(reject, err); return; }
                onError(err, () => wrappedLoader().then(m => settle(resolve, m)).catch(e => settle(reject, e)), e => settle(reject, e), attempts);
            }
        );
    });
    (wrappedLoader as any).__asyncOptions = options;
    return wrappedLoader;
}

export interface CourvuxPlugin {
    install(app: CourvuxApp): void;
}

// createPlugin — standardized plugin factory
// Module augmentation for globalProperties (add to your project's .d.ts):
// declare module 'courvux' { interface ComponentThis { $http: typeof axios } }
export function createPlugin(options: {
    components?: Record<string, ComponentConfig>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    provide?: Record<string, any>;
    globalProperties?: Record<string, any>;
    install?: (app: CourvuxApp) => void;
}): CourvuxPlugin {
    return {
        install(app: CourvuxApp) {
            if (options.components) Object.entries(options.components).forEach(([n, c]) => app.component(n, c));
            if (options.directives) Object.entries(options.directives).forEach(([n, d]) => app.directive(n, d));
            if (options.provide) app.provide(options.provide);
            options.install?.(app);
        }
    };
}

export interface CourvuxApp {
    use(plugin: CourvuxPlugin): CourvuxApp;
    directive(name: string, def: DirectiveDef | DirectiveShorthand): CourvuxApp;
    component(name: string, config: ComponentConfig): CourvuxApp;
    provide(key: string, value: any): CourvuxApp;
    provide(values: Record<string, any>): CourvuxApp;
    magic(name: string, fn: (instance: any) => any): CourvuxApp;
    mount(selector: string): Promise<CourvuxApp>;
    mountAll(selector?: string): Promise<CourvuxApp>;
    mountEl(el: HTMLElement): Promise<any>;
    unmount(selector?: string): CourvuxApp;
    destroy(): void;
    router?: Router;
}

export function createApp(config: AppConfig): CourvuxApp {
    injectCloakStyle();
    const devtools = typeof window !== 'undefined' ? setupDevTools() : undefined;
    const plugins: CourvuxPlugin[] = [];
    const directives: Record<string, DirectiveDef | DirectiveShorthand> = { ...config.directives };
    const globalComponents: Record<string, ComponentConfig> = { ...(config.components ?? {}) };
    const destroyFns: Array<() => void> = [];
    const mountRegistry = new Map<HTMLElement, () => void>();
    const globalProvided: Record<string, any> = {};
    const magics = new Map<string, (instance: any) => any>();

    // Dev overlay — mounted before store/app so it's ready when events fire
    if (config.debug && devtools) mountDevOverlay(devtools);

    // Register store in devtools if present
    if (devtools && config.store) {
        const store = config.store as Record<string, any>;
        const storeKeys = Object.keys(store).filter(k => typeof store[k] !== 'function');
        const storeEntry: DevToolsStoreEntry = {
            getState() {
                const snap: Record<string, any> = {};
                storeKeys.forEach(k => { try { snap[k] = store[k]; } catch { /* */ } });
                return snap;
            },
            setState(key, value) { store[key] = value; },
            subscribe(cb) {
                const unsubs = storeKeys.map(k => { try { return subscribeToStore(store, k, cb); } catch { return () => {}; } });
                return () => unsubs.forEach(u => u());
            },
        };
        devtools._registerStore(storeEntry);
    }

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
        component(name: string, cfg: ComponentConfig) {
            globalComponents[name] = cfg;
            return app;
        },
        provide(keyOrObj: string | Record<string, any>, value?: any): CourvuxApp {
            if (typeof keyOrObj === 'string') {
                globalProvided[keyOrObj] = value;
            } else {
                Object.assign(globalProvided, keyOrObj);
            }
            return app;
        },
        magic(name: string, fn: (instance: any) => any): CourvuxApp {
            magics.set(`$${name}`, fn);
            return app;
        },
        mount: async (selector: string) => { await _mount(selector); return app; },
        mountAll: async (selector = '[data-courvux]') => {
            const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
            await Promise.all(els.map(el => _mountEl(el)));
            return app;
        },
        mountEl: async (el: HTMLElement) => _mountEl(el),
        unmount(selector?: string) {
            if (!selector) {
                destroyFns.forEach(fn => fn());
                destroyFns.length = 0;
                mountRegistry.clear();
            } else {
                const el = document.querySelector<HTMLElement>(selector);
                if (el) {
                    const destroy = mountRegistry.get(el);
                    if (destroy) {
                        destroy();
                        mountRegistry.delete(el);
                        const idx = destroyFns.indexOf(destroy);
                        if (idx > -1) destroyFns.splice(idx, 1);
                    }
                }
            }
            return app;
        },
        destroy() {
            destroyFns.forEach(fn => fn());
            destroyFns.length = 0;
            mountRegistry.clear();
        },
    };

    const _mountEl = async (root: HTMLElement) => {
        const baseUrl = new URL('.', document.baseURI).href;

        const appContext: AppContext = {
            components: globalComponents,
            router: config.router,
            store: config.store,
            directives,
            baseUrl,
            provided: { ...globalProvided },
            errorHandler: config.errorHandler,
            globalProperties: config.globalProperties,
            magics: magics.size ? Object.fromEntries(magics) : undefined,
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

        const result = await mount(root, config, appContext);
        destroyFns.push(result.destroy);
        mountRegistry.set(root, result.destroy);
        return result.state;
    };

    const _mount = async (selector: string) => {
        const root = document.querySelector(selector) as HTMLElement;
        if (!root) return;
        return _mountEl(root);
    };

    return app;
}

/**
 * Tagged template helper for writing component templates in JS template literals.
 * Converts \${{ expr }} → ${{ expr }} so Courvux interpolation survives JS parsing.
 *
 * @example
 * template: html`<button @click="buy()">Price: \${{ price }}</button>`
 */
export function html(strings: TemplateStringsArray, ...values: any[]): string {
    let result = '';
    strings.raw.forEach((raw, i) => {
        result += raw.replace(/\\\$/g, '$');
        if (i < values.length) result += String(values[i] ?? '');
    });
    return result;
}

export interface AutoInitOptions {
    components?: Record<string, ComponentConfig>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    globalProperties?: Record<string, any>;
}

export function autoInit(options: AutoInitOptions = {}): void {
    const parseInline = (expr: string): { data: Record<string, any>; methods: Record<string, Function> } => {
        if (!expr.trim() || !expr.trim().startsWith('{')) return { data: {}, methods: {} };
        try {
            const obj = new Function(`return (${expr})`)() ?? {};
            const data: Record<string, any> = {};
            const methods: Record<string, Function> = {};
            Object.entries(obj).forEach(([k, v]) => {
                if (typeof v === 'function') methods[k] = v as Function;
                else data[k] = v;
            });
            return { data, methods };
        } catch { return { data: {}, methods: {} }; }
    };

    const run = () => {
        document.querySelectorAll<HTMLElement>('[cv-data]').forEach(el => {
            // Skip elements nested inside another [cv-data] — outer will handle them
            if (el.parentElement?.closest('[cv-data]')) return;

            const dataExpr = (el.getAttribute('cv-data') ?? '').trim();
            el.removeAttribute('cv-data');

            let cfg: ComponentConfig;

            // Named component: cv-data="my-counter"
            const namedComp = dataExpr && !dataExpr.startsWith('{')
                ? options.components?.[dataExpr]
                : null;

            if (namedComp) {
                cfg = {
                    ...namedComp,
                    components: { ...(namedComp.components ?? {}), ...(options.components ?? {}) },
                };
            } else {
                const { data, methods } = parseInline(dataExpr);
                cfg = { data, methods };
            }

            createApp({
                ...cfg,
                components: { ...(cfg.components ?? {}), ...(options.components ?? {}) },
                directives: options.directives,
                globalProperties: options.globalProperties,
            }).mountEl(el);
        });
    };

    if (typeof document === 'undefined') return;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        Promise.resolve().then(run);
    }
}
