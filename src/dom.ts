import { ComponentConfig, Router, DirectiveDef, DirectiveBinding, DirectiveShorthand } from './types.js';
import { subscribeToStore } from './store.js';
import { createReactivityScope } from './reactivity.js';

export interface WalkContext {
    subscribe: (key: string, cb: Function) => () => void;
    storeSubscribeOverride?: (store: object, key: string, cb: Function) => () => void;
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
    refs?: Record<string, any>;
    slots?: Record<string, ((scope: Record<string, any>) => Promise<Node[]>) | undefined>;
    mountElement?: (el: HTMLElement, tagName: string, parentState: any, parentContext: WalkContext) => Promise<void>;
    mountRouterView?: (el: HTMLElement, name?: string) => Promise<void>;
    mountDynamic?: (anchor: Comment, compExpr: string, originalEl: HTMLElement, parentState: any, parentContext: WalkContext) => Promise<void>;
    provided?: Record<string, any>;
    directives?: Record<string, DirectiveDef | DirectiveShorthand>;
    registerCleanup?: (cleanup: () => void) => void;
    createChildScope?: (data: Record<string, any>, methods: Record<string, Function>) => {
        state: any;
        subscribe: (key: string, cb: Function) => () => void;
        cleanup: () => void;
    };
}

export const resolve = (expr: string, state: any): any =>
    expr.split('.').reduce((o: any, k) => o?.[k], state);

const evalSupported = (() => {
    try { new Function('return 1')(); return true; }
    catch { console.warn('[courvux] CSP blocks eval. Expressions limited to property access and literals.'); return false; }
})();

const evalCache = new Map<string, Function>();
const handlerCache = new Map<string, Function>();

const safeEval = (expr: string, state: any): any => {
    const t = expr.trim();
    if (t === 'true') return true;
    if (t === 'false') return false;
    if (t === 'null') return null;
    if (t === 'undefined') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
    if (/^(['"`])(.*)\1$/s.test(t)) return t.slice(1, -1);
    if (t.startsWith('!')) return !safeEval(t.slice(1).trim(), state);
    return resolve(t, state);
};

export const evaluate = (expr: string, state: any): any => {
    if (!evalSupported) return safeEval(expr, state);
    try {
        let fn = evalCache.get(expr);
        if (!fn) {
            fn = new Function('$data', `with($data) { return (${expr}) }`);
            evalCache.set(expr, fn);
        }
        return fn(state);
    } catch {
        return resolve(expr, state);
    }
};

export const subscribeExpr = (expr: string, context: WalkContext, cb: Function): (() => void) => {
    if (expr.startsWith('$store.') && context.store) {
        if (context.storeSubscribeOverride) {
            return context.storeSubscribeOverride(context.store, expr.slice(7), cb);
        }
        return subscribeToStore(context.store, expr.slice(7), cb);
    }
    return context.subscribe(expr, cb);
};

export const subscribeDeps = (expr: string, context: WalkContext, cb: Function): (() => void) => {
    const keywords = new Set(['true', 'false', 'null', 'undefined', 'in', 'of', 'typeof', 'instanceof']);
    const tokens = expr.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g) ?? [];
    // Reactivity notifies on the top-level state key only (mutations to
    // nested properties propagate via deep-proxy notify of the parent key),
    // so subscribers for `items.length` would never fire if registered on
    // the dotted path. Reduce each dotted token to its root segment, except
    // for `$store.<path>` which subscribeExpr handles specially per-leaf.
    const deps = [...new Set(
        tokens
            .map(t => t.startsWith('$store.') ? t : t.split('.')[0])
            .filter(t => !keywords.has(t))
    )];
    if (deps.length === 0) return () => {};
    const unsubs = deps.map(dep => subscribeExpr(dep, context, cb));
    return () => unsubs.forEach(u => u());
};

export const setStateValue = (expr: string, state: any, value: any) => {
    const parts = expr.split('.');
    if (parts.length === 1) {
        state[parts[0]] = value;
    } else {
        const obj = parts.slice(0, -1).reduce((o: any, k) => o?.[k], state);
        if (obj) obj[parts[parts.length - 1]] = value;
    }
};

const makeItemState = (parentState: any, item: any, itemVar: string, index: any, indexVar?: string): any => {
    const base: any = {};
    Object.keys(parentState).forEach(k => base[k] = parentState[k]);
    base[itemVar] = item;
    if (indexVar) base[indexVar] = index;
    return base;
};

const resolveClass = (val: any): string => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.map(resolveClass).filter(Boolean).join(' ');
    if (typeof val === 'object') {
        return Object.entries(val as Record<string, any>)
            .filter(([, v]) => !!v).map(([k]) => k).join(' ');
    }
    return '';
};

const applyStyle = (el: HTMLElement, val: any, staticStyle: string) => {
    if (!val) { el.style.cssText = staticStyle; return; }
    if (typeof val === 'string') {
        el.style.cssText = staticStyle ? `${staticStyle};${val}` : val;
    } else if (typeof val === 'object') {
        if (staticStyle) el.style.cssText = staticStyle;
        Object.entries(val as Record<string, any>).forEach(([k, v]) => {
            (el.style as any)[k] = v ?? '';
        });
    }
};

const executeHandler = (expr: string, state: any, event: Event): void => {
    if (!evalSupported) return;
    try {
        let fn = handlerCache.get(expr);
        if (!fn) {
            fn = new Function('__p__', `with(__p__){${expr}}`);
            handlerCache.set(expr, fn);
        }
        const proxy = new Proxy({} as any, {
            has: () => true,
            get: (_t, k: string) => {
                if (k === '$event') return event;
                if (k in state) return state[k];
                return (globalThis as any)[k];
            },
            set: (_t, k: string, v: any) => { state[k] = v; return true; }
        });
        fn(proxy);
    } catch (e) {
        console.warn(`[courvux] handler error "${expr}":`, e);
    }
};

const waitForTransition = (el: HTMLElement): Promise<void> => {
    const cs = getComputedStyle(el);
    const duration = Math.max(
        parseFloat(cs.animationDuration) || 0,
        parseFloat(cs.transitionDuration) || 0
    ) * 1000;
    if (duration <= 0) return Promise.resolve();
    return new Promise(resolve => {
        const done = () => resolve();
        el.addEventListener('animationend', done, { once: true });
        el.addEventListener('transitionend', done, { once: true });
        setTimeout(done, duration + 50);
    });
};

const CV_TRANSITION_STYLES = `
.cv-t-wrap{overflow:hidden}
.fade-enter{animation:cvt-fade-in 0.25s forwards}
.fade-leave{animation:cvt-fade-out 0.25s forwards}
.slide-down-enter{animation:cvt-slide-down-in 0.25s forwards}
.slide-down-leave{animation:cvt-slide-down-out 0.25s forwards}
.slide-up-enter{animation:cvt-slide-up-in 0.2s forwards}
.slide-up-leave{animation:cvt-slide-up-out 0.2s forwards}
@keyframes cvt-fade-in{from{opacity:0}to{opacity:1}}
@keyframes cvt-fade-out{from{opacity:1}to{opacity:0}}
@keyframes cvt-slide-down-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes cvt-slide-down-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-8px)}}
@keyframes cvt-slide-up-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes cvt-slide-up-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
`;
let cvtStylesInjected = false;
function injectCvTransitionStyles() {
    if (cvtStylesInjected || typeof document === 'undefined') return;
    cvtStylesInjected = true;
    const s = document.createElement('style');
    s.id = 'cv-transitions-el';
    s.textContent = CV_TRANSITION_STYLES;
    document.head.appendChild(s);
}

let cloakStyleInjected = false;
export function injectCloakStyle() {
    if (cloakStyleInjected || typeof document === 'undefined') return;
    cloakStyleInjected = true;
    const s = document.createElement('style');
    s.id = 'cv-cloak-style';
    s.textContent = '[cv-cloak]{display:none!important}';
    document.head.appendChild(s);
}

function sanitizeHtml(html: string): string {
    if (typeof window !== 'undefined' && 'Sanitizer' in window) {
        const tmp = document.createElement('div');
        (tmp as any).setHTML(html, { sanitizer: new (window as any).Sanitizer() });
        return tmp.innerHTML;
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,iframe,object,embed,form,meta,link,style').forEach(e => e.remove());
    doc.querySelectorAll('*').forEach(e => {
        Array.from(e.attributes).forEach(a => {
            if (a.name.startsWith('on') || a.value.trim().toLowerCase().startsWith('javascript:')) e.removeAttribute(a.name);
        });
    });
    return doc.body.innerHTML;
}

export async function walk(el: Node, state: any, context: WalkContext) {
    const nodes = Array.from(el.childNodes);
    let i = 0;

    while (i < nodes.length) {
        const node = nodes[i];

        // Texto: interpolación {{ expr }}
        if (node.nodeType === 3) {
            const text = node.textContent || '';
            const matches = text.match(/\{\{([\s\S]+?)\}\}/g);
            if (matches) {
                const originalText = text;
                const update = () => {
                    let newText = originalText;
                    matches.forEach(m => {
                        const expr = m.replace(/^\{\{\s*/, '').replace(/\s*\}\}$/, '');
                        newText = newText.replace(m, evaluate(expr, state) ?? '');
                    });
                    node.textContent = newText;
                };
                matches.forEach(m => {
                    const expr = m.replace(/^\{\{\s*/, '').replace(/\s*\}\}$/, '');
                    subscribeDeps(expr, context, update);
                });
                update();
            }
            i++;
            continue;
        }

        if (node.nodeType !== 1) { i++; continue; }

        const element = node as HTMLElement;
        const tagName = element.tagName.toLowerCase();

        // cv-pre — skip any processing; raw content preserved as-is (useful for code samples)
        if (element.hasAttribute('cv-pre')) {
            element.removeAttribute('cv-pre');
            i++;
            continue;
        }

        // cv-once — render sin reactividad
        if (element.hasAttribute('cv-once')) {
            element.removeAttribute('cv-once');
            const frozenCtx: WalkContext = {
                ...context,
                subscribe: () => () => {},
                storeSubscribeOverride: () => () => {}
            };
            await walk(element, state, frozenCtx);
            i++;
            continue;
        }

        // cv-cloak — CSS hides element until framework processes it; removed here during walk
        if (element.hasAttribute('cv-cloak')) element.removeAttribute('cv-cloak');

        // cv-teleport — renderiza el elemento en otro nodo del DOM
        if (element.hasAttribute('cv-teleport')) {
            const targetSelector = element.getAttribute('cv-teleport')!;
            element.removeAttribute('cv-teleport');
            const targetEl = document.querySelector(targetSelector) ?? document.body;
            const placeholder = document.createComment(`cv-teleport: ${targetSelector}`);
            element.replaceWith(placeholder);
            await walk(element, state, context);
            targetEl.appendChild(element);
            i++;
            continue;
        }

        // cv-memo — congela el subtree; solo actualiza cuando cambien las deps explícitas
        if (element.hasAttribute('cv-memo')) {
            const depsExpr = element.getAttribute('cv-memo')!;
            element.removeAttribute('cv-memo');
            const getDeps = () => depsExpr.split(',').map(e => evaluate(e.trim(), state));
            let prevDeps = getDeps();
            // Collect all DOM callbacks without wiring real subscriptions
            const memoCallbacks: Array<() => void> = [];
            const makeMemoUnsub = (cb: Function) => {
                memoCallbacks.push(cb as () => void);
                return () => { const idx = memoCallbacks.indexOf(cb as () => void); if (idx > -1) memoCallbacks.splice(idx, 1); };
            };
            await walk(element, state, {
                ...context,
                subscribe: (_key, cb) => makeMemoUnsub(cb),
                storeSubscribeOverride: (_store, _key, cb) => makeMemoUnsub(cb),
            });
            const unsub = subscribeDeps(depsExpr, context, () => {
                const newDeps = getDeps();
                if (newDeps.some((v, i) => v !== prevDeps[i])) {
                    prevDeps = newDeps;
                    [...memoCallbacks].forEach(cb => cb());
                }
            });
            context.registerCleanup?.(() => unsub());
            i++;
            continue;
        }

        // cv-data — inline reactive scope; data+methods merged on top of parent state
        if (element.hasAttribute('cv-data')) {
            const dataExpr = element.getAttribute('cv-data')!.trim();
            element.removeAttribute('cv-data');

            let childData: Record<string, any> = {};
            let childMethods: Record<string, Function> = {};

            if (dataExpr.startsWith('{')) {
                const obj = evaluate(dataExpr, state) ?? {};
                Object.entries(obj).forEach(([k, v]) => {
                    if (typeof v === 'function') childMethods[k] = v as Function;
                    else childData[k] = v;
                });
            } else if (dataExpr) {
                const comp = context.components?.[dataExpr];
                if (comp) {
                    const raw = typeof comp.data === 'function'
                        ? (comp.data as () => Record<string, any>)()
                        : (comp.data ?? {});
                    if (!(raw instanceof Promise)) Object.assign(childData, raw);
                    Object.assign(childMethods, comp.methods ?? {});
                }
            }

            if (context.createChildScope) {
                const child = context.createChildScope(childData, childMethods);
                context.registerCleanup?.(child.cleanup);
                await walk(element, child.state, { ...context, subscribe: child.subscribe });
            } else {
                await walk(element, { ...state, ...childData, ...childMethods }, context);
            }
            i++;
            continue;
        }

        // cv-for
        if (element.hasAttribute('cv-for')) {
            const expr = element.getAttribute('cv-for')!;
            element.removeAttribute('cv-for');
            const match = expr.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);

            if (match) {
                const [, itemVar, indexVar, collectionExpr] = match;
                const keyExpr = element.getAttribute(':key') ?? null;
                if (keyExpr) element.removeAttribute(':key');
                const forTransition = element.getAttribute('cv-transition') ?? null;
                if (forTransition) element.removeAttribute('cv-transition');
                const anchor = document.createComment(`cv-for: ${collectionExpr}`);
                element.replaceWith(anchor);
                let rendered: Node[] = [];
                let itemUnsubs: Array<() => void> = [];
                // keyed diffing: key → { el, reactive, destroy }
                // reactive holds per-item reactive state so targeted updates are possible
                const keyNodeMap = new Map<any, { el: HTMLElement; reactive: any; itemRef: any; destroy: () => void }>();

                const render = async () => {
                    const collection = evaluate(collectionExpr, state);
                    const entries: [any, any][] = !collection ? [] :
                        typeof collection === 'number'
                            ? Array.from({ length: collection }, (_, i) => [i + 1, i])
                            : Array.isArray(collection)
                                ? collection.map((v: any, idx: number) => [v, idx])
                                : Object.entries(collection).map(([k, v]) => [v, k]);

                    if (keyExpr) {
                        // --- keyed diffing ---
                        const newKeys: any[] = [];
                        const newEntries = new Map<any, [any, any]>();
                        const seen = new Set();
                        for (const [item, index] of entries) {
                            const k = evaluate(keyExpr, makeItemState(state, item, itemVar, index, indexVar));
                            if (seen.has(k)) console.warn(`[courvux] cv-for: duplicate :key "${k}" in "${collectionExpr}"`);
                            seen.add(k);
                            newKeys.push(k);
                            newEntries.set(k, [item, index]);
                        }

                        // remove stale nodes (with optional leave animation)
                        const leavePromises: Promise<void>[] = [];
                        for (const [k, { el, destroy }] of keyNodeMap) {
                            if (!newEntries.has(k)) {
                                if (forTransition) {
                                    el.classList.add(`${forTransition}-leave`);
                                    leavePromises.push(
                                        waitForTransition(el).then(() => {
                                            el.classList.remove(`${forTransition}-leave`);
                                            destroy();
                                            el.parentNode?.removeChild(el);
                                            keyNodeMap.delete(k);
                                        })
                                    );
                                } else {
                                    destroy();
                                    el.parentNode?.removeChild(el);
                                    keyNodeMap.delete(k);
                                }
                            }
                        }
                        if (leavePromises.length) await Promise.all(leavePromises);

                        // update existing nodes or create new ones
                        const parent = anchor.parentNode!;
                        const enterEls: HTMLElement[] = [];
                        for (const k of newKeys) {
                            const [item, index] = newEntries.get(k)!;
                            if (keyNodeMap.has(k)) {
                                // Existing key: only update reactive if item reference or index changed,
                                // skipping unnecessary reactive notifications for unchanged data.
                                const entry = keyNodeMap.get(k)!;
                                if (entry.itemRef !== item) {
                                    entry.reactive[itemVar] = item;
                                    entry.itemRef = item;
                                }
                                if (indexVar) entry.reactive[indexVar] = index;
                            } else {
                                // New key: create fresh node with isolated reactive scope for
                                // item/index vars so updates are targeted, not full re-renders.
                                const clone = element.cloneNode(true) as HTMLElement;
                                const perItemUnsubs: Array<() => void> = [];

                                const { subscribe: itemSub, createReactiveState: itemCreate } = createReactivityScope();
                                const itemReactive = itemCreate({
                                    [itemVar]: item,
                                    ...(indexVar ? { [indexVar]: index } : {})
                                }) as any;

                                // Proxy: itemVar/indexVar → per-item reactive scope; rest → parent state
                                const mergedItemState = new Proxy({} as any, {
                                    has(_, key: string) { return true; },
                                    get(_, key: string) {
                                        if (typeof key !== 'string') return (state as any)[key];
                                        if (key === itemVar || (indexVar && key === indexVar)) return itemReactive[key];
                                        return (state as any)[key];
                                    },
                                    set(_, key: string, val: any) {
                                        if (key === itemVar || (indexVar && key === indexVar)) {
                                            itemReactive[key] = val; return true;
                                        }
                                        (state as any)[key] = val; return true;
                                    }
                                });

                                // Subscribe: route itemVar/indexVar to item scope, rest to parent
                                const childCtx: WalkContext = {
                                    ...context,
                                    subscribe: (key: string, cb: Function) => {
                                        const baseKey = key.split('.')[0];
                                        let unsub: () => void;
                                        if (baseKey === itemVar || (indexVar && baseKey === indexVar)) {
                                            unsub = itemSub(baseKey, cb);
                                        } else {
                                            unsub = context.subscribe(key, cb);
                                        }
                                        perItemUnsubs.push(unsub);
                                        return unsub;
                                    },
                                    storeSubscribeOverride: (store, key, cb) => {
                                        const unsub = subscribeToStore(store, key, cb);
                                        perItemUnsubs.push(unsub);
                                        return unsub;
                                    }
                                };

                                // Walk a fragment so that special root elements (router-link,
                                // custom components) get processed — walk() only visits childNodes.
                                const tempFrag = document.createDocumentFragment();
                                tempFrag.appendChild(clone);
                                await walk(tempFrag, mergedItemState, childCtx);
                                const actualEl = (tempFrag.firstChild ?? clone) as HTMLElement;
                                if (forTransition) actualEl.classList.add(`${forTransition}-enter`);
                                keyNodeMap.set(k, {
                                    el: actualEl,
                                    reactive: itemReactive,
                                    itemRef: item,
                                    destroy: () => perItemUnsubs.forEach(u => u())
                                });
                                if (forTransition) enterEls.push(actualEl);
                            }
                        }

                        // reorder: count mismatches first; few → targeted moves, many → single fragment
                        let cursor: ChildNode | null = anchor.nextSibling;
                        let mismatches = 0;
                        for (const k of newKeys) {
                            const { el } = keyNodeMap.get(k)!;
                            if (el !== cursor) mismatches++;
                            else cursor = el.nextSibling;
                        }
                        if (mismatches > 0) {
                            if (mismatches > (newKeys.length >> 1)) {
                                // majority displaced → batch all into one fragment insert
                                const frag = document.createDocumentFragment();
                                for (const k of newKeys) frag.appendChild(keyNodeMap.get(k)!.el);
                                parent.insertBefore(frag, anchor.nextSibling);
                            } else {
                                // few displacements → targeted insertBefore per out-of-place node
                                cursor = anchor.nextSibling;
                                for (const k of newKeys) {
                                    const { el } = keyNodeMap.get(k)!;
                                    if (el !== cursor) parent.insertBefore(el, cursor);
                                    else cursor = el.nextSibling;
                                }
                            }
                        }
                        rendered = newKeys.map(k => keyNodeMap.get(k)!.el);

                        // trigger enter animations after elements are in DOM
                        if (enterEls.length) {
                            Promise.all(enterEls.map(el =>
                                waitForTransition(el).then(() => el.classList.remove(`${forTransition!}-enter`))
                            ));
                        }

                    } else {
                        // --- no key: destroy and recreate all ---
                        itemUnsubs.forEach(u => u());
                        itemUnsubs = [];
                        rendered.forEach(n => n.parentNode?.removeChild(n));
                        rendered = [];
                        if (!entries.length) return;

                        const parent = anchor.parentNode!;
                        const insertBefore = anchor.nextSibling;
                        const childContext: WalkContext = {
                            ...context,
                            subscribe: (key, cb) => {
                                const unsub = context.subscribe(key, cb);
                                itemUnsubs.push(unsub);
                                return unsub;
                            },
                            storeSubscribeOverride: (store, key, cb) => {
                                const unsub = subscribeToStore(store, key, cb);
                                itemUnsubs.push(unsub);
                                return unsub;
                            }
                        };
                        for (const [item, index] of entries) {
                            const clone = element.cloneNode(true) as HTMLElement;
                            const tempFrag = document.createDocumentFragment();
                            tempFrag.appendChild(clone);
                            await walk(tempFrag, makeItemState(state, item, itemVar, index, indexVar), childContext);
                            const actualEl = (tempFrag.firstChild ?? clone) as HTMLElement;
                            parent.insertBefore(tempFrag, insertBefore);
                            rendered.push(actualEl);
                        }
                    }
                };

                context.registerCleanup?.(() => {
                    keyNodeMap.forEach(({ el, destroy }) => { destroy(); el.parentNode?.removeChild(el); });
                    keyNodeMap.clear();
                    itemUnsubs.forEach(u => u());
                    rendered.forEach(n => n.parentNode?.removeChild(n));
                    rendered = [];
                });

                subscribeDeps(collectionExpr, context, render);
                await render();
            }
            i++;
            continue;
        }

        // cv-if / cv-else-if / cv-else
        if (element.hasAttribute('cv-if')) {
            type Branch = { condition: string | null; template: HTMLElement; anchor: Comment };
            const chain: Branch[] = [];

            const ifExpr = element.getAttribute('cv-if')!;
            element.removeAttribute('cv-if');
            const ifAnchor = document.createComment('cv-if');
            element.replaceWith(ifAnchor);
            chain.push({ condition: ifExpr, template: element, anchor: ifAnchor });

            let j = i + 1;
            while (j < nodes.length) {
                const sib = nodes[j];
                if (sib.nodeType === 3 && (sib.textContent?.trim() ?? '') === '') { j++; continue; }
                if (sib.nodeType !== 1) break;
                const sibEl = sib as HTMLElement;
                if (sibEl.hasAttribute('cv-else-if')) {
                    const elseIfExpr = sibEl.getAttribute('cv-else-if')!;
                    sibEl.removeAttribute('cv-else-if');
                    const anchor = document.createComment('cv-else-if');
                    sibEl.replaceWith(anchor);
                    chain.push({ condition: elseIfExpr, template: sibEl, anchor });
                    j++;
                    continue;
                }
                if (sibEl.hasAttribute('cv-else')) {
                    sibEl.removeAttribute('cv-else');
                    const anchor = document.createComment('cv-else');
                    sibEl.replaceWith(anchor);
                    chain.push({ condition: null, template: sibEl, anchor });
                    j++;
                    break;
                }
                break;
            }
            i = j;

            let activeClone: Node | null = null;
            let rendering = false;
            let dirty = false;

            const render = async () => {
                if (rendering) { dirty = true; return; }
                rendering = true;
                try {
                    do {
                        dirty = false;
                        if (activeClone) { activeClone.parentNode?.removeChild(activeClone); activeClone = null; }
                        for (const branch of chain) {
                            if (branch.condition === null || !!evaluate(branch.condition, state)) {
                                const clone = branch.template.cloneNode(true) as HTMLElement;
                                const frag = document.createDocumentFragment();
                                frag.appendChild(clone);
                                await walk(frag, state, context);
                                const actualEl = (frag.firstChild ?? clone) as HTMLElement;
                                branch.anchor.parentNode?.insertBefore(frag, branch.anchor.nextSibling);
                                activeClone = actualEl;
                                break;
                            }
                        }
                    } while (dirty);
                } finally {
                    rendering = false;
                }
            };

            chain.filter(b => b.condition).forEach(b => {
                subscribeDeps(b.condition!, context, render);
            });
            await render();
            continue;
        }

        // cv-show — supports optional transition via cv-show-transition, :transition, or cv-transition[:[enter|leave]*]
        if (element.hasAttribute('cv-show')) {
            const expr = element.getAttribute('cv-show')!;
            element.removeAttribute('cv-show');

            // Alpine-style cv-transition attribute detection
            const cvtAttrs = Array.from(element.attributes).filter(a =>
                a.name === 'cv-transition' || a.name.startsWith('cv-transition:') || a.name.startsWith('cv-transition.')
            );
            const hasAlpineTransition = cvtAttrs.length > 0;

            if (hasAlpineTransition) {
                // Collect class strings from cv-transition:enter / :enter-start / :enter-end / :leave / :leave-start / :leave-end
                const getClasses = (name: string) => (element.getAttribute(name) ?? '').split(' ').filter(Boolean);
                const enterCls = getClasses('cv-transition:enter');
                const enterStartCls = getClasses('cv-transition:enter-start');
                const enterEndCls = getClasses('cv-transition:enter-end');
                const leaveCls = getClasses('cv-transition:leave');
                const leaveStartCls = getClasses('cv-transition:leave-start');
                const leaveEndCls = getClasses('cv-transition:leave-end');

                // Bare cv-transition modifiers: .opacity .scale .scale.80 .duration.300
                const bareVal = element.getAttribute('cv-transition') ?? '';
                const bareMods = new Set(bareVal.split('.').slice(1));
                const durationMod = [...bareMods].find(m => /^\d+$/.test(m));
                const duration = durationMod ? parseInt(durationMod) : 200;
                const hasCustomClasses = enterCls.length || enterStartCls.length || leaveCls.length || leaveStartCls.length;

                // Built-in when no custom classes: inject transition style inline
                if (!hasCustomClasses) {
                    const scaleMod = [...bareMods].find(m => m === 'scale' || /^scale$/.test(m));
                    const scaleVal = (() => {
                        const sv = [...bareMods].find(m => /^\d+$/.test(m) && m !== durationMod);
                        return sv ? parseInt(sv) / 100 : 0.9;
                    })();
                    const parts: string[] = [];
                    if (!bareMods.has('scale') || bareMods.has('opacity')) parts.push(`opacity ${duration}ms ease`);
                    if (scaleMod) parts.push(`transform ${duration}ms ease`);
                    if (!parts.length) parts.push(`opacity ${duration}ms ease`);
                    element.style.transition = (element.style.transition ? element.style.transition + ', ' : '') + parts.join(', ');
                    cvtAttrs.forEach(a => element.removeAttribute(a.name));

                    let visible = !!evaluate(expr, state);
                    const twoRafs = () => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));

                    const applyBuiltin = async (show: boolean) => {
                        if (show) {
                            element.style.display = '';
                            element.style.opacity = '0';
                            if (scaleMod) element.style.transform = `scale(${scaleVal})`;
                            await twoRafs();
                            element.style.opacity = '';
                            if (scaleMod) element.style.transform = '';
                            await waitForTransition(element);
                        } else {
                            element.style.opacity = '0';
                            if (scaleMod) element.style.transform = `scale(${scaleVal})`;
                            await waitForTransition(element);
                            element.style.display = 'none';
                            element.style.opacity = '';
                            if (scaleMod) element.style.transform = '';
                        }
                        visible = show;
                    };

                    if (!visible) element.style.display = 'none';
                    subscribeDeps(expr, context, () => { const v = !!evaluate(expr, state); if (v !== visible) applyBuiltin(v); });
                } else {
                    // Class-based Alpine-compatible transition
                    cvtAttrs.forEach(a => element.removeAttribute(a.name));
                    const twoRafs = () => new Promise<void>(r => requestAnimationFrame(() => requestAnimationFrame(() => r())));
                    let visible = !!evaluate(expr, state);
                    let transitioning = false;
                    let pending: boolean | null = null;

                    const applyClasses = async (show: boolean) => {
                        if (transitioning) { pending = show; return; }
                        transitioning = true;
                        try {
                            if (show) {
                                element.style.display = '';
                                element.classList.add(...enterCls, ...enterStartCls);
                                await twoRafs();
                                element.classList.remove(...enterStartCls);
                                element.classList.add(...enterEndCls);
                                await waitForTransition(element);
                                element.classList.remove(...enterCls, ...enterEndCls);
                            } else {
                                element.classList.add(...leaveCls, ...leaveStartCls);
                                await twoRafs();
                                element.classList.remove(...leaveStartCls);
                                element.classList.add(...leaveEndCls);
                                await waitForTransition(element);
                                element.classList.remove(...leaveCls, ...leaveEndCls);
                                element.style.display = 'none';
                            }
                            visible = show;
                        } finally {
                            transitioning = false;
                            if (pending !== null && pending !== visible) {
                                const next = pending; pending = null; applyClasses(next);
                            } else pending = null;
                        }
                    };

                    if (!visible) element.style.display = 'none';
                    subscribeDeps(expr, context, () => { const v = !!evaluate(expr, state); if (v !== visible) applyClasses(v); });
                }
            } else {
                // Legacy name-based transition: cv-show-transition="name" or :transition="expr"
                const staticTrans = element.getAttribute('cv-show-transition');
                const dynamicTrans = element.getAttribute(':transition');
                if (staticTrans) element.removeAttribute('cv-show-transition');
                if (dynamicTrans) element.removeAttribute(':transition');
                const transitionName = staticTrans ?? (dynamicTrans ? String(evaluate(dynamicTrans, state)) : null);

                if (transitionName) {
                    injectCvTransitionStyles();
                    let visible = !!evaluate(expr, state);
                    if (!visible) element.style.display = 'none';
                    let transitioning = false;
                    let pending: boolean | null = null;
                    const animate = async (show: boolean) => {
                        if (transitioning) { pending = show; return; }
                        transitioning = true;
                        try {
                            if (show) {
                                element.style.display = '';
                                element.classList.add(`${transitionName}-enter`);
                                await waitForTransition(element);
                                element.classList.remove(`${transitionName}-enter`);
                            } else {
                                element.classList.add(`${transitionName}-leave`);
                                await waitForTransition(element);
                                element.classList.remove(`${transitionName}-leave`);
                                element.style.display = 'none';
                            }
                            visible = show;
                        } finally {
                            transitioning = false;
                            if (pending !== null && pending !== visible) {
                                const next = pending; pending = null; animate(next);
                            } else pending = null;
                        }
                    };
                    subscribeDeps(expr, context, () => { const v = !!evaluate(expr, state); if (v !== visible) animate(v); });
                } else {
                    const update = () => { element.style.display = evaluate(expr, state) ? '' : 'none'; };
                    subscribeDeps(expr, context, update);
                    update();
                }
            }
        }

        // cv-focus — auto-focus element on mount or when condition becomes truthy
        if (element.hasAttribute('cv-focus')) {
            const expr = element.getAttribute('cv-focus') ?? '';
            element.removeAttribute('cv-focus');
            if (!expr) {
                Promise.resolve().then(() => (element as HTMLElement).focus());
            } else {
                const doFocus = () => { if (evaluate(expr, state)) Promise.resolve().then(() => (element as HTMLElement).focus()); };
                subscribeDeps(expr, context, doFocus);
                doFocus();
            }
        }

        // cv-intersect — IntersectionObserver directive
        // cv-intersect="expr"          → fires expr when element enters viewport
        // cv-intersect:enter="expr"    → fires on enter
        // cv-intersect:leave="expr"    → fires on leave
        // modifiers: .once  .half (0.5)  .full (1.0)  .threshold-75  .margin-200
        {
            const interAttrs = Array.from(element.attributes).filter(a =>
                a.name === 'cv-intersect' || a.name.startsWith('cv-intersect:') || a.name.startsWith('cv-intersect.')
            );
            if (interAttrs.length && typeof IntersectionObserver !== 'undefined') {
                const enterAttr = interAttrs.find(a => a.name === 'cv-intersect' || a.name === 'cv-intersect:enter' || a.name.startsWith('cv-intersect.'));
                const leaveAttr = interAttrs.find(a => a.name === 'cv-intersect:leave');
                const enterExpr = enterAttr?.value ?? '';
                const leaveExpr = leaveAttr?.value ?? '';

                // Parse modifiers from entering attribute name
                const modParts = (enterAttr?.name ?? 'cv-intersect').split('.');
                const mods = new Set(modParts.slice(1));
                const once = mods.has('once');
                let threshold = 0;
                if (mods.has('half')) threshold = 0.5;
                else if (mods.has('full')) threshold = 1.0;
                else {
                    const tMod = [...mods].find(m => m.startsWith('threshold-'));
                    if (tMod) threshold = parseInt(tMod.replace('threshold-', '')) / 100;
                }
                const marginMod = [...mods].find(m => m.startsWith('margin-'));
                const rootMargin = marginMod ? `${marginMod.replace('margin-', '')}px` : undefined;

                interAttrs.forEach(a => element.removeAttribute(a.name));

                const runExpr = (expr: string) => {
                    if (!expr) return;
                    try { new Function('$data', `with($data){${expr}}`)(state); }
                    catch (e) { console.warn(`[courvux] cv-intersect error "${expr}":`, e); }
                };

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            runExpr(enterExpr);
                            if (once) observer.disconnect();
                        } else {
                            runExpr(leaveExpr);
                        }
                    });
                }, { threshold, ...(rootMargin ? { rootMargin } : {}) });

                observer.observe(element);
                context.registerCleanup?.(() => observer.disconnect());
            }
        }

        // cv-html [.sanitize] — set innerHTML; add .sanitize modifier to strip XSS vectors
        {
            const htmlAttr = Array.from(element.attributes).find(a => a.name === 'cv-html' || a.name.startsWith('cv-html.'));
            if (htmlAttr) {
                const expr = htmlAttr.value;
                element.removeAttribute(htmlAttr.name);
                const doSanitize = htmlAttr.name.split('.').slice(1).includes('sanitize');
                const update = () => {
                    const raw = String(evaluate(expr, state) ?? '');
                    element.innerHTML = doSanitize ? sanitizeHtml(raw) : raw;
                };
                subscribeDeps(expr, context, update);
                update();
                i++;
                continue;
            }
        }

        // cv-ref — native: set element; custom component: leave attr for createMountElement
        if (element.hasAttribute('cv-ref')) {
            if (!context.components?.[tagName]) {
                const refName = element.getAttribute('cv-ref')!;
                element.removeAttribute('cv-ref');
                if (context.refs) context.refs[refName] = element;
            }
        }

        // cv-model (+ modifiers: .lazy .trim .number .debounce)
        // Skip for custom components — handled by createMountElement as modelValue prop/emit
        const isCustomComponent = !!context.components?.[tagName];
        const modelAttr = Array.from(element.attributes).find(a => a.name === 'cv-model' || a.name.startsWith('cv-model.'));
        if (modelAttr && !isCustomComponent) {
            const expr = modelAttr.value;
            element.removeAttribute(modelAttr.name);
            const mods = new Set(modelAttr.name.split('.').slice(1));
            const inputEl = element as HTMLInputElement;
            const type = inputEl.type?.toLowerCase();

            const applyMods = (v: string): any => {
                if (mods.has('number')) { const n = parseFloat(v); return isNaN(n) ? v : n; }
                if (mods.has('trim')) return v.trim();
                return v;
            };

            if (type === 'checkbox') {
                const update = () => {
                    const val = evaluate(expr, state);
                    inputEl.checked = Array.isArray(val) ? val.includes(inputEl.value) : !!val;
                };
                subscribeExpr(expr, context, update);
                update();
                inputEl.addEventListener('change', () => {
                    const val = evaluate(expr, state);
                    if (Array.isArray(val)) {
                        const arr = [...val];
                        if (inputEl.checked) { if (!arr.includes(inputEl.value)) arr.push(inputEl.value); }
                        else { const idx = arr.indexOf(inputEl.value); if (idx > -1) arr.splice(idx, 1); }
                        setStateValue(expr, state, arr);
                    } else {
                        setStateValue(expr, state, inputEl.checked);
                    }
                });
            } else if (type === 'radio') {
                const update = () => { inputEl.checked = evaluate(expr, state) === inputEl.value; };
                subscribeExpr(expr, context, update);
                update();
                inputEl.addEventListener('change', () => {
                    if (inputEl.checked) setStateValue(expr, state, applyMods(inputEl.value));
                });
            } else if (element.hasAttribute('contenteditable')) {
                const ceEl = element as HTMLElement;
                const update = () => {
                    const val = String(evaluate(expr, state) ?? '');
                    if (ceEl.innerText !== val) ceEl.innerText = val;
                };
                subscribeExpr(expr, context, update);
                update();

                if (mods.has('debounce')) {
                    const delayMod = [...mods].find(m => /^\d+$/.test(m));
                    const delay = delayMod ? parseInt(delayMod) : 300;
                    let timer: ReturnType<typeof setTimeout>;
                    ceEl.addEventListener('input', () => {
                        clearTimeout(timer);
                        timer = setTimeout(() => setStateValue(expr, state, applyMods(ceEl.innerText)), delay);
                    });
                } else {
                    const inputEvent = mods.has('lazy') ? 'blur' : 'input';
                    ceEl.addEventListener(inputEvent, () => setStateValue(expr, state, applyMods(ceEl.innerText)));
                }
            } else {
                const update = () => { inputEl.value = evaluate(expr, state) ?? ''; };
                subscribeExpr(expr, context, update);
                update();

                if (mods.has('debounce')) {
                    const delayMod = [...mods].find(m => /^\d+$/.test(m));
                    const delay = delayMod ? parseInt(delayMod) : 300;
                    let timer: ReturnType<typeof setTimeout>;
                    inputEl.addEventListener('input', () => {
                        clearTimeout(timer);
                        timer = setTimeout(() => setStateValue(expr, state, applyMods(inputEl.value)), delay);
                    });
                } else {
                    const inputEvent = tagName === 'select' ? 'change' : (mods.has('lazy') ? 'change' : 'input');
                    inputEl.addEventListener(inputEvent, () => setStateValue(expr, state, applyMods(inputEl.value)));
                }
            }
        }

        // Custom directives — cv-{name}[:{arg}][.modifier...]
        if (context.directives) {
            Array.from(element.attributes).forEach(attr => {
                if (!attr.name.startsWith('cv-')) return;
                const rest = attr.name.slice(3);
                const parts = rest.split('.');
                const nameWithArg = parts[0];
                const modParts = parts.slice(1);
                const colonIdx = nameWithArg.indexOf(':');
                const dName = colonIdx >= 0 ? nameWithArg.slice(0, colonIdx) : nameWithArg;
                const dArg = colonIdx >= 0 ? nameWithArg.slice(colonIdx + 1) : undefined;
                const def = context.directives![dName];
                if (!def) return;
                const attrValue = attr.value;
                element.removeAttribute(attr.name);
                const normDef: DirectiveDef = typeof def === 'function' ? { onMount: def } : def;
                const binding: DirectiveBinding = {
                    value: attrValue ? evaluate(attrValue, state) : undefined,
                    arg: dArg,
                    modifiers: Object.fromEntries(modParts.map(m => [m, true]))
                };
                normDef.onMount?.(element, binding);
                if (normDef.onUpdate && attrValue) {
                    subscribeDeps(attrValue, context, () => {
                        binding.value = evaluate(attrValue, state);
                        normDef.onUpdate!(element, binding);
                    });
                }
                if (normDef.onDestroy) {
                    context.registerCleanup?.(() => normDef.onDestroy!(element, binding));
                }
            });
        }

        // <slot> — render parent-provided content with optional scoped data
        if (tagName === 'slot') {
            const slotName = element.getAttribute('name') ?? 'default';
            const renderer = context.slots?.[slotName];
            if (renderer) {
                const scope: Record<string, any> = {};
                Array.from(element.attributes).forEach(attr => {
                    if (attr.name.startsWith(':')) scope[attr.name.slice(1)] = evaluate(attr.value, state);
                });
                const nodes = await renderer(scope);
                const fragment = document.createDocumentFragment();
                nodes.forEach(n => fragment.appendChild(n));
                element.replaceWith(fragment);
            } else {
                // Fallback content — walk slot children in current component scope
                const frag = document.createDocumentFragment();
                while (element.firstChild) frag.appendChild(element.firstChild);
                await walk(frag, state, context);
                element.replaceWith(frag);
            }
            i++;
            continue;
        }

        // cv-transition — wrapper con animación enter/leave
        if (tagName === 'cv-transition') {
            injectCvTransitionStyles();
            const name = element.getAttribute('name') ?? 'fade';
            const showExpr = element.getAttribute(':show') ?? null;
            element.removeAttribute('name');
            if (showExpr) element.removeAttribute(':show');

            const wrapper = document.createElement('div');
            wrapper.className = 'cv-t-wrap';
            while (element.firstChild) wrapper.appendChild(element.firstChild);
            element.replaceWith(wrapper);

            await walk(wrapper, state, context);

            if (showExpr) {
                let visible = !!evaluate(showExpr, state);
                let transitioning = false;
                let pending: boolean | null = null;

                if (!visible) wrapper.style.display = 'none';

                const animate = async (show: boolean) => {
                    if (transitioning) { pending = show; return; }
                    transitioning = true;
                    try {
                        if (show) {
                            wrapper.style.display = '';
                            wrapper.classList.add(`${name}-enter`);
                            await waitForTransition(wrapper);
                            wrapper.classList.remove(`${name}-enter`);
                        } else {
                            wrapper.classList.add(`${name}-leave`);
                            await waitForTransition(wrapper);
                            wrapper.classList.remove(`${name}-leave`);
                            wrapper.style.display = 'none';
                        }
                        visible = show;
                    } finally {
                        transitioning = false;
                        if (pending !== null && pending !== visible) {
                            const next = pending;
                            pending = null;
                            animate(next);
                        } else {
                            pending = null;
                        }
                    }
                };

                subscribeDeps(showExpr, context, () => {
                    const newV = !!evaluate(showExpr, state);
                    if (newV !== visible) animate(newV);
                });
            }

            i++;
            continue;
        }

        // router-view
        if (tagName === 'router-view' && context.mountRouterView) {
            const name = element.getAttribute('name') ?? undefined;
            element.setAttribute('aria-live', 'polite');
            element.setAttribute('aria-atomic', 'true');
            await context.mountRouterView(element, name);
            i++;
            continue;
        }

        // router-link
        if (tagName === 'router-link') {
            const toExpr = element.getAttribute(':to');
            const toStatic = element.getAttribute('to');
            const getTo = () => toExpr ? String(evaluate(toExpr, state) ?? '/') : (toStatic || '/');

            // Build the inner <a> via innerHTML so the HTML parser accepts
            // framework directive attributes whose names contain `@` / `:`
            // (e.g. `@click`, `:aria-label`, `cv-show`). Stricter browsers
            // — Safari, Samsung Internet — reject those names through the
            // setAttribute() DOM API ("'@click' is not a valid attribute name"),
            // even though the parser accepts them. Round-tripping through
            // innerHTML uses the parser path. The walk below then processes
            // the directives normally via a DocumentFragment wrapper.
            const escAttr = (s: string) => String(s).replace(/[&"<>]/g, c =>
                ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' }[c]!));
            let attrsStr = '';
            Array.from(element.attributes).forEach(attr => {
                if (attr.name === 'to' || attr.name === ':to') return;
                attrsStr += ` ${attr.name}="${escAttr(attr.value)}"`;
            });
            const tmpWrapper = document.createElement('div');
            tmpWrapper.innerHTML = `<a${attrsStr}></a>`;
            const a = tmpWrapper.firstElementChild as HTMLAnchorElement;
            // Move original children into the new anchor.
            while (element.firstChild) a.appendChild(element.firstChild);
            const routerBase = context.router?.base ?? '';
            const stripBaseLocal = (p: string): string => {
                if (!routerBase) return p || '/';
                if (p === routerBase) return '/';
                if (p.startsWith(routerBase + '/')) return p.slice(routerBase.length) || '/';
                return p || '/';
            };
            const getCurrentPath = () => context.router?.mode === 'history'
                ? stripBaseLocal(window.location.pathname)
                : window.location.hash.slice(1) || '/';
            const updateActive = () => {
                const to = getTo();
                const isActive = getCurrentPath() === to;
                if (context.router?.mode === 'history') a.href = `${routerBase}${to}`;
                else a.href = `#${to}`;
                if (isActive) { a.setAttribute('aria-current', 'page'); a.classList.add('active'); }
                else { a.removeAttribute('aria-current'); a.classList.remove('active'); }
            };
            if (context.router?.mode === 'history') {
                a.addEventListener('click', e => { e.preventDefault(); context.router!.navigate(getTo()); });
                window.addEventListener('popstate', updateActive);
            } else {
                window.addEventListener('hashchange', updateActive);
            }
            if (toExpr) subscribeExpr(toExpr, context, updateActive);
            updateActive();

            // Wrap in a DocumentFragment before walking so framework
            // directives ON `a` itself (e.g. `@click`, `:aria-label`) get
            // processed — walk() only visits CHILDREN of the passed node.
            const linkFrag = document.createDocumentFragment();
            linkFrag.appendChild(a);
            await walk(linkFrag, state, context);
            const renderedA = (linkFrag.firstChild ?? a) as HTMLElement;
            element.replaceWith(renderedA);
            i++;
            continue;
        }

        // <component :is="..."> — componente dinámico
        if (tagName === 'component' && element.hasAttribute(':is') && context.mountDynamic) {
            const isExpr = element.getAttribute(':is')!;
            element.removeAttribute(':is');
            const anchor = document.createComment('component:is');
            element.replaceWith(anchor);
            await context.mountDynamic(anchor, isExpr, element, state, context);
            i++;
            continue;
        }

        // Componentes custom
        if (context.components?.[tagName] && context.mountElement) {
            await context.mountElement(element, tagName, state, context);
            i++;
            continue;
        }

        // cv-intersect — IntersectionObserver; fires handler when element enters/exits viewport
        // Usage: cv-intersect="handler" | cv-intersect="{ handler, threshold: 0.5, margin: '100px', once: true }"
        // Modifier: cv-intersect.once fires only on first intersection
        {
            const intersectAttr = Array.from(element.attributes).find(
                a => a.name === 'cv-intersect' || a.name.startsWith('cv-intersect.')
            );
            if (intersectAttr && typeof IntersectionObserver !== 'undefined') {
                const mods = new Set(intersectAttr.name.split('.').slice(1));
                element.removeAttribute(intersectAttr.name);
                const val = evaluate(intersectAttr.value, state);
                let handlerFn: ((entry: IntersectionObserverEntry) => void) | undefined;
                let threshold = 0;
                let rootMargin = '0px';
                let once = mods.has('once');
                if (typeof val === 'function') {
                    handlerFn = (entry) => (val as Function).call(state, entry);
                } else if (val && typeof val === 'object') {
                    if (typeof val.handler === 'function') handlerFn = (entry) => val.handler.call(state, entry);
                    if (val.threshold !== undefined) threshold = val.threshold;
                    if (val.margin) rootMargin = val.margin;
                    if (val.once) once = true;
                }
                if (handlerFn) {
                    const observer = new IntersectionObserver((entries) => {
                        const entry = entries[0];
                        handlerFn!(entry);
                        if (once && entry.isIntersecting) observer.disconnect();
                    }, { threshold, rootMargin });
                    observer.observe(element);
                    context.registerCleanup?.(() => observer.disconnect());
                }
            }
        }

        // cv-resize — ResizeObserver; fires when element dimensions change
        // Usage: cv-resize="handler" | cv-resize="{ handler, box: 'border-box' }"
        if (element.hasAttribute('cv-resize')) {
            const expr = element.getAttribute('cv-resize')!;
            element.removeAttribute('cv-resize');
            if (typeof ResizeObserver !== 'undefined') {
                const val = evaluate(expr, state);
                let handlerFn: ((entry: ResizeObserverEntry) => void) | undefined;
                let box: ResizeObserverBoxOptions = 'content-box';
                if (typeof val === 'function') {
                    handlerFn = (entry) => (val as Function).call(state, entry);
                } else if (val && typeof val === 'object') {
                    if (typeof val.handler === 'function') handlerFn = (entry) => val.handler.call(state, entry);
                    if (val.box) box = val.box;
                }
                if (handlerFn) {
                    const observer = new ResizeObserver(entries => { if (entries[0]) handlerFn!(entries[0]); });
                    observer.observe(element, { box });
                    context.registerCleanup?.(() => observer.disconnect());
                }
            }
        }

        // cv-scroll — scroll event with position info and optional throttle
        // Usage: cv-scroll="handler" | cv-scroll="{ handler, throttle: 100 }"
        if (element.hasAttribute('cv-scroll')) {
            const expr = element.getAttribute('cv-scroll')!;
            element.removeAttribute('cv-scroll');
            const val = evaluate(expr, state);
            let handlerFn: ((info: { scrollTop: number; scrollLeft: number; scrollHeight: number; scrollWidth: number; clientHeight: number; clientWidth: number }) => void) | undefined;
            let throttleMs = 0;
            if (typeof val === 'function') {
                handlerFn = (info) => (val as Function).call(state, info);
            } else if (val && typeof val === 'object') {
                if (typeof val.handler === 'function') handlerFn = (info) => val.handler.call(state, info);
                if (val.throttle) throttleMs = val.throttle;
            }
            if (handlerFn) {
                let lastTime = 0;
                const onScroll = () => {
                    const now = Date.now();
                    if (throttleMs > 0 && now - lastTime < throttleMs) return;
                    lastTime = now;
                    handlerFn!({
                        scrollTop: element.scrollTop, scrollLeft: element.scrollLeft,
                        scrollHeight: element.scrollHeight, scrollWidth: element.scrollWidth,
                        clientHeight: element.clientHeight, clientWidth: element.clientWidth,
                    });
                };
                element.addEventListener('scroll', onScroll, { passive: true });
                context.registerCleanup?.(() => element.removeEventListener('scroll', onScroll));
            }
        }

        // cv-clickoutside — fires handler when user clicks outside this element
        if (element.hasAttribute('cv-clickoutside')) {
            const expr = element.getAttribute('cv-clickoutside')!;
            element.removeAttribute('cv-clickoutside');
            const handler = (e: MouseEvent) => {
                if (!element.contains(e.target as Node)) {
                    if (typeof state[expr] === 'function') {
                        (state[expr] as Function).call(state, e);
                    } else {
                        executeHandler(expr, state, e);
                    }
                }
            };
            document.addEventListener('click', handler, true);
            context.registerCleanup?.(() => document.removeEventListener('click', handler, true));
        }

        // cv-bind — bind multiple attributes from an object expression
        if (element.hasAttribute('cv-bind')) {
            const bindExpr = element.getAttribute('cv-bind')!;
            element.removeAttribute('cv-bind');
            const staticClass = element.getAttribute('class') ?? '';
            const staticStyle = element.getAttribute('style') ?? '';
            let prevKeys: string[] = [];
            const applyBind = () => {
                const obj: Record<string, any> = evaluate(bindExpr, state) ?? {};
                const newKeys = Object.keys(obj);
                for (const k of prevKeys) {
                    if (!(k in obj)) {
                        if (k === 'class') element.className = staticClass;
                        else if (k === 'style') element.style.cssText = staticStyle;
                        else element.removeAttribute(k);
                    }
                }
                for (const [k, val] of Object.entries(obj)) {
                    if (k === 'class') {
                        element.className = [staticClass, resolveClass(val)].filter(Boolean).join(' ');
                    } else if (k === 'style') {
                        applyStyle(element, val, staticStyle);
                    } else if (val === null || val === undefined || val === false) {
                        try { element.removeAttribute(k); } catch { /* invalid name */ }
                    } else {
                        // Defensive try/catch: stricter browsers (Safari,
                        // Samsung Internet) reject attribute names containing
                        // chars like `@` or `:` through the setAttribute()
                        // DOM API. cv-bind takes a free-form object so users
                        // could pass unusual keys; warn instead of crashing
                        // the whole walk.
                        try {
                            element.setAttribute(k, val === true ? '' : String(val));
                        } catch (err) {
                            console.warn(`[courvux] cv-bind: skipping invalid attribute name "${k}":`, err);
                        }
                    }
                }
                prevKeys = newKeys;
            };
            subscribeDeps(bindExpr, context, applyBind);
            applyBind();
        }

        // Atributos: @eventos y :bindings
        const KEY_MAP: Record<string, string> = {
            enter: 'Enter', esc: 'Escape', escape: 'Escape', space: ' ',
            tab: 'Tab', delete: 'Delete', backspace: 'Backspace',
            up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight'
        };
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('@') || attr.name.startsWith('cv:on:')) {
                const raw = attr.name.startsWith('@') ? attr.name.substring(1) : attr.name.substring(6);
                const parts = raw.split('.');
                const baseEvent = parts[0];
                const modifiers = new Set(parts.slice(1));
                const keyFilter = [...modifiers].find(m => m in KEY_MAP);
                const expr = attr.value;
                const handler = (event: Event) => {
                    if (modifiers.has('prevent')) event.preventDefault();
                    if (modifiers.has('stop')) event.stopPropagation();
                    if (modifiers.has('self') && event.target !== event.currentTarget) return;
                    if (keyFilter && (event as KeyboardEvent).key !== KEY_MAP[keyFilter]) return;
                    if (typeof state[expr] === 'function') {
                        (state[expr] as Function).call(state, event);
                    } else {
                        executeHandler(expr, state, event);
                    }
                };
                const listenerOpts: AddEventListenerOptions = {};
                if (modifiers.has('once')) listenerOpts.once = true;
                if (modifiers.has('passive')) listenerOpts.passive = true;
                if (modifiers.has('capture')) listenerOpts.capture = true;
                element.addEventListener(baseEvent, handler, Object.keys(listenerOpts).length ? listenerOpts : undefined);
            } else if (attr.name.startsWith(':')) {
                const propName = attr.name.slice(1);
                const expr = attr.value;
                if (propName === 'class') {
                    const staticClass = element.getAttribute('class') ?? '';
                    const update = () => {
                        const dynamic = resolveClass(evaluate(expr, state));
                        element.className = [staticClass, dynamic].filter(Boolean).join(' ');
                    };
                    subscribeDeps(expr, context, update);
                    update();
                } else if (propName === 'style') {
                    const staticStyle = element.getAttribute('style') ?? '';
                    const update = () => applyStyle(element, evaluate(expr, state), staticStyle);
                    subscribeDeps(expr, context, update);
                    update();
                } else if (propName.includes('-')) {
                    // Hyphenated names (data-*, aria-*) are HTML attributes, not DOM properties
                    const update = () => {
                        const val = evaluate(expr, state);
                        if (val === null || val === undefined || val === false) {
                            element.removeAttribute(propName);
                        } else {
                            element.setAttribute(propName, val === true ? '' : String(val));
                        }
                    };
                    subscribeDeps(expr, context, update);
                    update();
                } else {
                    const update = () => { (element as any)[propName] = evaluate(expr, state) ?? ''; };
                    subscribeDeps(expr, context, update);
                    update();
                }
            }
        });

        if (node.hasChildNodes()) await walk(node, state, context);

        i++;
    }
}
