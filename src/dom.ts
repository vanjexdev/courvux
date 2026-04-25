import { ComponentConfig, Router, DirectiveDef, DirectiveBinding, DirectiveShorthand } from './types.js';
import { subscribeToStore } from './store.js';

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
}

export const resolve = (expr: string, state: any): any =>
    expr.split('.').reduce((o: any, k) => o?.[k], state);

const evalSupported = (() => {
    try { new Function('return 1')(); return true; }
    catch { console.warn('[courvux] CSP blocks eval. Expressions limited to property access and literals.'); return false; }
})();

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
        const fn = new Function('$data', `with($data) { return (${expr}) }`);
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
    const deps = [...new Set(tokens.filter(t => !keywords.has(t.split('.')[0])))];
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
        const proxy = new Proxy({} as any, {
            has: () => true,
            get: (_t, k: string) => {
                if (k === '$event') return event;
                if (k in state) return state[k];
                return (globalThis as any)[k];
            },
            set: (_t, k: string, v: any) => { state[k] = v; return true; }
        });
        // new Function is non-strict → 'with' works
        const fn = new Function('__p__', `with(__p__){${expr}}`);
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

        // cv-for
        if (element.hasAttribute('cv-for')) {
            const expr = element.getAttribute('cv-for')!;
            element.removeAttribute('cv-for');
            const match = expr.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);

            if (match) {
                const [, itemVar, indexVar, collectionExpr] = match;
                const keyExpr = element.getAttribute(':key') ?? null;
                if (keyExpr) element.removeAttribute(':key');
                const anchor = document.createComment(`cv-for: ${collectionExpr}`);
                element.replaceWith(anchor);
                let rendered: Node[] = [];
                let itemUnsubs: Array<() => void> = [];

                const render = async () => {
                    itemUnsubs.forEach(u => u());
                    itemUnsubs = [];
                    rendered.forEach(n => n.parentNode?.removeChild(n));
                    rendered = [];
                    const collection = evaluate(collectionExpr, state);
                    if (!collection) return;
                    const entries: [any, any][] = Array.isArray(collection)
                        ? collection.map((v: any, idx: number) => [v, idx])
                        : Object.entries(collection).map(([k, v]) => [v, k]);

                    if (keyExpr) {
                        const seen = new Set();
                        entries.forEach(([item, index]) => {
                            const k = evaluate(keyExpr, makeItemState(state, item, itemVar, index, indexVar));
                            if (seen.has(k)) console.warn(`[courvux] cv-for: duplicate :key "${k}" in "${collectionExpr}"`);
                            seen.add(k);
                        });
                    }

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
                        const itemState = makeItemState(state, item, itemVar, index, indexVar);
                        await walk(clone, itemState, childContext);
                        parent.insertBefore(clone, insertBefore);
                        rendered.push(clone);
                    }
                };

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
                                await walk(clone, state, context);
                                branch.anchor.parentNode?.insertBefore(clone, branch.anchor.nextSibling);
                                activeClone = clone;
                                break;
                            }
                        }
                    } while (dirty);
                } finally {
                    rendering = false;
                }
            };

            const allDeps = new Set<string>();
            chain.filter(b => b.condition).forEach(b => {
                const kw = new Set(['true','false','null','undefined','in','of','typeof','instanceof']);
                (b.condition!.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g) ?? [])
                    .filter(t => !kw.has(t.split('.')[0]))
                    .forEach(dep => allDeps.add(dep));
            });
            allDeps.forEach(dep => subscribeExpr(dep, context, render));
            await render();
            continue;
        }

        // cv-show
        if (element.hasAttribute('cv-show')) {
            const expr = element.getAttribute('cv-show')!;
            element.removeAttribute('cv-show');
            const update = () => { element.style.display = evaluate(expr, state) ? '' : 'none'; };
            subscribeDeps(expr, context, update);
            update();
        }

        // cv-html
        if (element.hasAttribute('cv-html')) {
            const expr = element.getAttribute('cv-html')!;
            element.removeAttribute('cv-html');
            const update = () => { element.innerHTML = String(evaluate(expr, state) ?? ''); };
            subscribeDeps(expr, context, update);
            update();
            i++;
            continue;
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
            const a = document.createElement('a');
            a.innerHTML = element.innerHTML;
            Array.from(element.attributes).forEach(attr => {
                if (attr.name !== 'to' && attr.name !== ':to') a.setAttribute(attr.name, attr.value);
            });
            const getCurrentPath = () => context.router?.mode === 'history'
                ? window.location.pathname
                : window.location.hash.slice(1) || '/';
            const updateActive = () => {
                const to = getTo();
                const isActive = getCurrentPath() === to;
                if (context.router?.mode === 'history') a.href = to;
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
            element.replaceWith(a);
            await walk(a, state, context);
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
