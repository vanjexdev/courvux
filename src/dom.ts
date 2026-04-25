import { ComponentConfig, Router } from './types.js';
import { subscribeToStore } from './store.js';

export interface WalkContext {
    subscribe: (key: string, cb: Function) => () => void;
    storeSubscribeOverride?: (store: object, key: string, cb: Function) => () => void;
    components?: Record<string, ComponentConfig>;
    router?: Router;
    store?: Record<string, any>;
    mountElement?: (el: HTMLElement, tagName: string, parentState: any, parentContext: WalkContext) => Promise<void>;
    mountRouterView?: (el: HTMLElement) => Promise<void>;
}

export const resolve = (expr: string, state: any): any =>
    expr.split('.').reduce((o: any, k) => o?.[k], state);

export const evaluate = (expr: string, state: any): any => {
    try {
        const keys = Object.keys(state);
        const fn = new Function(...keys, `return (${expr})`);
        return fn(...keys.map(k => state[k]));
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

const subscribeDeps = (expr: string, context: WalkContext, cb: Function): (() => void) => {
    const keywords = new Set(['true', 'false', 'null', 'undefined', 'in', 'of', 'typeof', 'instanceof']);
    const tokens = expr.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g) ?? [];
    const deps = [...new Set(tokens.filter(t => !keywords.has(t.split('.')[0])))];
    if (deps.length === 0) return () => {};
    const unsubs = deps.map(dep => subscribeExpr(dep, context, cb));
    return () => unsubs.forEach(u => u());
};

const setStateValue = (expr: string, state: any, value: any) => {
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

        // cv-for
        if (element.hasAttribute('cv-for')) {
            const expr = element.getAttribute('cv-for')!;
            element.removeAttribute('cv-for');
            const match = expr.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);

            if (match) {
                const [, itemVar, indexVar, collectionExpr] = match;
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
                rendering = false;
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

        // cv-model
        if (element.hasAttribute('cv-model')) {
            const expr = element.getAttribute('cv-model')!;
            element.removeAttribute('cv-model');
            const inputEl = element as HTMLInputElement;
            const type = inputEl.type?.toLowerCase();

            if (type === 'checkbox') {
                const update = () => {
                    const val = evaluate(expr, state);
                    inputEl.checked = Array.isArray(val)
                        ? val.includes(inputEl.value)
                        : !!val;
                };
                subscribeExpr(expr, context, update);
                update();
                inputEl.addEventListener('change', () => {
                    const val = evaluate(expr, state);
                    if (Array.isArray(val)) {
                        const arr = [...val];
                        if (inputEl.checked) {
                            if (!arr.includes(inputEl.value)) arr.push(inputEl.value);
                        } else {
                            const idx = arr.indexOf(inputEl.value);
                            if (idx > -1) arr.splice(idx, 1);
                        }
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
                    if (inputEl.checked) setStateValue(expr, state, inputEl.value);
                });
            } else {
                const event = tagName === 'select' ? 'change' : 'input';
                const update = () => { inputEl.value = evaluate(expr, state) ?? ''; };
                subscribeExpr(expr, context, update);
                update();
                inputEl.addEventListener(event, () => setStateValue(expr, state, inputEl.value));
            }
        }

        // router-view
        if (tagName === 'router-view' && context.mountRouterView) {
            element.setAttribute('aria-live', 'polite');
            element.setAttribute('aria-atomic', 'true');
            await context.mountRouterView(element);
            i++;
            continue;
        }

        // router-link
        if (tagName === 'router-link') {
            const to = element.getAttribute('to') || '/';
            const a = document.createElement('a');
            a.innerHTML = element.innerHTML;
            const getCurrentPath = () => context.router?.mode === 'history'
                ? window.location.pathname
                : window.location.hash.slice(1) || '/';
            const updateActive = () => {
                if (getCurrentPath() === to) a.setAttribute('aria-current', 'page');
                else a.removeAttribute('aria-current');
            };
            if (context.router?.mode === 'history') {
                a.href = to;
                a.addEventListener('click', e => { e.preventDefault(); context.router!.navigate(to); });
                window.addEventListener('popstate', updateActive);
            } else {
                a.href = `#${to}`;
                window.addEventListener('hashchange', updateActive);
            }
            updateActive();
            element.replaceWith(a);
            await walk(a, state, context);
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
        Array.from(element.attributes).forEach(attr => {
            if (attr.name.startsWith('@')) {
                const eventName = attr.name.substring(1);
                const methodName = attr.value;
                element.addEventListener(eventName, (event) => {
                    if (typeof state[methodName] === 'function') state[methodName].call(state, event);
                });
            } else if (attr.name.startsWith(':')) {
                const propName = attr.name.slice(1);
                const expr = attr.value;
                const update = () => { (element as any)[propName] = evaluate(expr, state) ?? ''; };
                subscribeExpr(expr, context, update);
                update();
            }
        });

        if (node.hasChildNodes()) await walk(node, state, context);

        i++;
    }
}
