// src/reactivity.ts
var ARRAY_MUTATING = /* @__PURE__ */ new Set(["push", "pop", "shift", "unshift", "splice", "sort", "reverse"]);
var _rawSet = /* @__PURE__ */ new WeakSet();
var RAW_SYMBOL = /* @__PURE__ */ Symbol("raw");
var _batchDepth = 0;
var _batchQueue = /* @__PURE__ */ new Map();
var _activeEffect = null;
function collectDeps(fn) {
  const deps = [];
  const prev = _activeEffect;
  _activeEffect = deps;
  try {
    fn();
  } finally {
    _activeEffect = prev;
  }
  return deps;
}
function batchUpdate(fn) {
  _batchDepth++;
  try {
    fn();
  } finally {
    _batchDepth--;
    if (_batchDepth === 0) {
      const queue = [..._batchQueue.values()];
      _batchQueue.clear();
      queue.forEach((n) => n());
    }
  }
}
function makeDeepProxy(val, notify) {
  if (val === null || typeof val !== "object" || _rawSet.has(val)) return val;
  return new Proxy(val, {
    get(t, k) {
      if (Array.isArray(t) && ARRAY_MUTATING.has(k)) {
        return (...args) => {
          const result = Array.prototype[k].apply(t, args);
          notify();
          return result;
        };
      }
      const v = t[k];
      if (v !== null && typeof v === "object" && !_rawSet.has(v)) return makeDeepProxy(v, notify);
      return v;
    },
    set(t, k, v) {
      t[k] = v;
      notify();
      return true;
    }
  });
}
function createReactivityScope() {
  const listeners = {};
  const scopeId = Math.random().toString(36).slice(2);
  const subscribe = (key, callback) => {
    if (!listeners[key]) listeners[key] = /* @__PURE__ */ new Set();
    listeners[key].add(callback);
    return () => {
      listeners[key]?.delete(callback);
    };
  };
  const notifyKey = (key) => {
    if (_batchDepth > 0) {
      _batchQueue.set(`${scopeId}:${key}`, () => {
        const cbs = listeners[key] ? [...listeners[key]] : [];
        cbs.forEach((cb) => cb());
      });
    } else {
      const cbs = listeners[key] ? [...listeners[key]] : [];
      cbs.forEach((cb) => cb());
    }
  };
  const setInterceptors = {};
  const registerSetInterceptor = (key, fn) => {
    setInterceptors[key] = fn;
  };
  const createReactiveState = (initialData) => {
    return new Proxy(initialData, {
      get(target, key) {
        if (key === RAW_SYMBOL) return initialData;
        if (typeof key === "string" && !key.startsWith("$") && _activeEffect) {
          _activeEffect.push({ sub: subscribe, key });
        }
        const val = target[key];
        if (typeof key === "string" && !key.startsWith("$") && val !== null && typeof val === "object" && !_rawSet.has(val)) {
          return makeDeepProxy(val, () => notifyKey(key));
        }
        return val;
      },
      set(target, key, value) {
        if (setInterceptors[key]) {
          setInterceptors[key](value);
          return true;
        }
        const prev = target[key];
        target[key] = value;
        if (prev !== value || value !== null && typeof value === "object") notifyKey(key);
        return true;
      }
    });
  };
  const notifyAll = () => {
    Object.keys(listeners).forEach((k) => notifyKey(k));
  };
  return { subscribe, createReactiveState, registerSetInterceptor, notifyAll };
}

// src/store.ts
var storeSubscribers = /* @__PURE__ */ new WeakMap();
function subscribeToStore(store, key, cb) {
  const dotIdx = key.indexOf(".");
  if (dotIdx >= 0) {
    const topKey = key.slice(0, dotIdx);
    const restKey = key.slice(dotIdx + 1);
    const subStore = store[topKey];
    if (subStore && storeSubscribers.has(subStore)) {
      return subscribeToStore(subStore, restKey, cb);
    }
    return storeSubscribers.get(store)?.(topKey, cb) ?? (() => {
    });
  }
  return storeSubscribers.get(store)?.(key, cb) ?? (() => {
  });
}

// src/dom.ts
var resolve = (expr, state) => expr.split(".").reduce((o, k) => o?.[k], state);
var evalSupported = (() => {
  try {
    new Function("return 1")();
    return true;
  } catch {
    console.warn("[courvux] CSP blocks eval. Expressions limited to property access and literals.");
    return false;
  }
})();
var evalCache = /* @__PURE__ */ new Map();
var handlerCache = /* @__PURE__ */ new Map();
var safeEval = (expr, state) => {
  const t = expr.trim();
  if (t === "true") return true;
  if (t === "false") return false;
  if (t === "null") return null;
  if (t === "undefined") return void 0;
  if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
  if (/^(['"`])(.*)\1$/s.test(t)) return t.slice(1, -1);
  if (t.startsWith("!")) return !safeEval(t.slice(1).trim(), state);
  return resolve(t, state);
};
var evaluate = (expr, state) => {
  if (!evalSupported) return safeEval(expr, state);
  try {
    let fn = evalCache.get(expr);
    if (!fn) {
      fn = new Function("$data", `with($data) { return (${expr}) }`);
      evalCache.set(expr, fn);
    }
    return fn(state);
  } catch {
    return resolve(expr, state);
  }
};
var subscribeExpr = (expr, context, cb) => {
  if (expr.startsWith("$store.") && context.store) {
    if (context.storeSubscribeOverride) {
      return context.storeSubscribeOverride(context.store, expr.slice(7), cb);
    }
    return subscribeToStore(context.store, expr.slice(7), cb);
  }
  return context.subscribe(expr, cb);
};
var subscribeDeps = (expr, context, cb) => {
  const keywords = /* @__PURE__ */ new Set(["true", "false", "null", "undefined", "in", "of", "typeof", "instanceof"]);
  const tokens = expr.match(/\$?[a-zA-Z_][\w$]*(?:\.\$?[a-zA-Z_][\w$]*)*/g) ?? [];
  const deps = [...new Set(tokens.filter((t) => !keywords.has(t.split(".")[0])))];
  if (deps.length === 0) return () => {
  };
  const unsubs = deps.map((dep) => subscribeExpr(dep, context, cb));
  return () => unsubs.forEach((u) => u());
};
var setStateValue = (expr, state, value) => {
  const parts = expr.split(".");
  if (parts.length === 1) {
    state[parts[0]] = value;
  } else {
    const obj = parts.slice(0, -1).reduce((o, k) => o?.[k], state);
    if (obj) obj[parts[parts.length - 1]] = value;
  }
};
var makeItemState = (parentState, item, itemVar, index, indexVar) => {
  const base = {};
  Object.keys(parentState).forEach((k) => base[k] = parentState[k]);
  base[itemVar] = item;
  if (indexVar) base[indexVar] = index;
  return base;
};
var resolveClass = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (Array.isArray(val)) return val.map(resolveClass).filter(Boolean).join(" ");
  if (typeof val === "object") {
    return Object.entries(val).filter(([, v]) => !!v).map(([k]) => k).join(" ");
  }
  return "";
};
var applyStyle = (el, val, staticStyle) => {
  if (!val) {
    el.style.cssText = staticStyle;
    return;
  }
  if (typeof val === "string") {
    el.style.cssText = staticStyle ? `${staticStyle};${val}` : val;
  } else if (typeof val === "object") {
    if (staticStyle) el.style.cssText = staticStyle;
    Object.entries(val).forEach(([k, v]) => {
      el.style[k] = v ?? "";
    });
  }
};
var executeHandler = (expr, state, event) => {
  if (!evalSupported) return;
  try {
    let fn = handlerCache.get(expr);
    if (!fn) {
      fn = new Function("__p__", `with(__p__){${expr}}`);
      handlerCache.set(expr, fn);
    }
    const proxy = new Proxy({}, {
      has: () => true,
      get: (_t, k) => {
        if (k === "$event") return event;
        if (k in state) return state[k];
        return globalThis[k];
      },
      set: (_t, k, v) => {
        state[k] = v;
        return true;
      }
    });
    fn(proxy);
  } catch (e) {
    console.warn(`[courvux] handler error "${expr}":`, e);
  }
};
var waitForTransition = (el) => {
  const cs = getComputedStyle(el);
  const duration = Math.max(
    parseFloat(cs.animationDuration) || 0,
    parseFloat(cs.transitionDuration) || 0
  ) * 1e3;
  if (duration <= 0) return Promise.resolve();
  return new Promise((resolve2) => {
    const done = () => resolve2();
    el.addEventListener("animationend", done, { once: true });
    el.addEventListener("transitionend", done, { once: true });
    setTimeout(done, duration + 50);
  });
};
var CV_TRANSITION_STYLES = `
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
var cvtStylesInjected = false;
function injectCvTransitionStyles() {
  if (cvtStylesInjected || typeof document === "undefined") return;
  cvtStylesInjected = true;
  const s = document.createElement("style");
  s.id = "cv-transitions-el";
  s.textContent = CV_TRANSITION_STYLES;
  document.head.appendChild(s);
}
var cloakStyleInjected = false;
function injectCloakStyle() {
  if (cloakStyleInjected || typeof document === "undefined") return;
  cloakStyleInjected = true;
  const s = document.createElement("style");
  s.id = "cv-cloak-style";
  s.textContent = "[cv-cloak]{display:none!important}";
  document.head.appendChild(s);
}
function sanitizeHtml(html) {
  if (typeof window !== "undefined" && "Sanitizer" in window) {
    const tmp = document.createElement("div");
    tmp.setHTML(html, { sanitizer: new window.Sanitizer() });
    return tmp.innerHTML;
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("script,iframe,object,embed,form,meta,link,style").forEach((e) => e.remove());
  doc.querySelectorAll("*").forEach((e) => {
    Array.from(e.attributes).forEach((a) => {
      if (a.name.startsWith("on") || a.value.trim().toLowerCase().startsWith("javascript:")) e.removeAttribute(a.name);
    });
  });
  return doc.body.innerHTML;
}
async function walk(el, state, context) {
  const nodes = Array.from(el.childNodes);
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    if (node.nodeType === 3) {
      const text = node.textContent || "";
      const matches = text.match(/\{\{([\s\S]+?)\}\}/g);
      if (matches) {
        const originalText = text;
        const update = () => {
          let newText = originalText;
          matches.forEach((m) => {
            const expr = m.replace(/^\{\{\s*/, "").replace(/\s*\}\}$/, "");
            newText = newText.replace(m, evaluate(expr, state) ?? "");
          });
          node.textContent = newText;
        };
        matches.forEach((m) => {
          const expr = m.replace(/^\{\{\s*/, "").replace(/\s*\}\}$/, "");
          subscribeDeps(expr, context, update);
        });
        update();
      }
      i++;
      continue;
    }
    if (node.nodeType !== 1) {
      i++;
      continue;
    }
    const element = node;
    const tagName = element.tagName.toLowerCase();
    if (element.hasAttribute("cv-pre")) {
      element.removeAttribute("cv-pre");
      i++;
      continue;
    }
    if (element.hasAttribute("cv-once")) {
      element.removeAttribute("cv-once");
      const frozenCtx = {
        ...context,
        subscribe: () => () => {
        },
        storeSubscribeOverride: () => () => {
        }
      };
      await walk(element, state, frozenCtx);
      i++;
      continue;
    }
    if (element.hasAttribute("cv-cloak")) element.removeAttribute("cv-cloak");
    if (element.hasAttribute("cv-teleport")) {
      const targetSelector = element.getAttribute("cv-teleport");
      element.removeAttribute("cv-teleport");
      const targetEl = document.querySelector(targetSelector) ?? document.body;
      const placeholder = document.createComment(`cv-teleport: ${targetSelector}`);
      element.replaceWith(placeholder);
      await walk(element, state, context);
      targetEl.appendChild(element);
      i++;
      continue;
    }
    if (element.hasAttribute("cv-memo")) {
      const depsExpr = element.getAttribute("cv-memo");
      element.removeAttribute("cv-memo");
      const getDeps = () => depsExpr.split(",").map((e) => evaluate(e.trim(), state));
      let prevDeps = getDeps();
      const memoCallbacks = [];
      const makeMemoUnsub = (cb) => {
        memoCallbacks.push(cb);
        return () => {
          const idx = memoCallbacks.indexOf(cb);
          if (idx > -1) memoCallbacks.splice(idx, 1);
        };
      };
      await walk(element, state, {
        ...context,
        subscribe: (_key, cb) => makeMemoUnsub(cb),
        storeSubscribeOverride: (_store, _key, cb) => makeMemoUnsub(cb)
      });
      const unsub = subscribeDeps(depsExpr, context, () => {
        const newDeps = getDeps();
        if (newDeps.some((v, i2) => v !== prevDeps[i2])) {
          prevDeps = newDeps;
          [...memoCallbacks].forEach((cb) => cb());
        }
      });
      context.registerCleanup?.(() => unsub());
      i++;
      continue;
    }
    if (element.hasAttribute("cv-data")) {
      const dataExpr = element.getAttribute("cv-data").trim();
      element.removeAttribute("cv-data");
      let childData = {};
      let childMethods = {};
      if (dataExpr.startsWith("{")) {
        const obj = evaluate(dataExpr, state) ?? {};
        Object.entries(obj).forEach(([k, v]) => {
          if (typeof v === "function") childMethods[k] = v;
          else childData[k] = v;
        });
      } else if (dataExpr) {
        const comp = context.components?.[dataExpr];
        if (comp) {
          const raw = typeof comp.data === "function" ? comp.data() : comp.data ?? {};
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
    if (element.hasAttribute("cv-for")) {
      const expr = element.getAttribute("cv-for");
      element.removeAttribute("cv-for");
      const match = expr.match(/^\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(.+)$/);
      if (match) {
        const [, itemVar, indexVar, collectionExpr] = match;
        const keyExpr = element.getAttribute(":key") ?? null;
        if (keyExpr) element.removeAttribute(":key");
        const forTransition = element.getAttribute("cv-transition") ?? null;
        if (forTransition) element.removeAttribute("cv-transition");
        const anchor = document.createComment(`cv-for: ${collectionExpr}`);
        element.replaceWith(anchor);
        let rendered = [];
        let itemUnsubs = [];
        const keyNodeMap = /* @__PURE__ */ new Map();
        const render = async () => {
          const collection = evaluate(collectionExpr, state);
          const entries = !collection ? [] : typeof collection === "number" ? Array.from({ length: collection }, (_, i2) => [i2 + 1, i2]) : Array.isArray(collection) ? collection.map((v, idx) => [v, idx]) : Object.entries(collection).map(([k, v]) => [v, k]);
          if (keyExpr) {
            const newKeys = [];
            const newEntries = /* @__PURE__ */ new Map();
            const seen = /* @__PURE__ */ new Set();
            for (const [item, index] of entries) {
              const k = evaluate(keyExpr, makeItemState(state, item, itemVar, index, indexVar));
              if (seen.has(k)) console.warn(`[courvux] cv-for: duplicate :key "${k}" in "${collectionExpr}"`);
              seen.add(k);
              newKeys.push(k);
              newEntries.set(k, [item, index]);
            }
            const leavePromises = [];
            for (const [k, { el: el2, destroy }] of keyNodeMap) {
              if (!newEntries.has(k)) {
                if (forTransition) {
                  el2.classList.add(`${forTransition}-leave`);
                  leavePromises.push(
                    waitForTransition(el2).then(() => {
                      el2.classList.remove(`${forTransition}-leave`);
                      destroy();
                      el2.parentNode?.removeChild(el2);
                      keyNodeMap.delete(k);
                    })
                  );
                } else {
                  destroy();
                  el2.parentNode?.removeChild(el2);
                  keyNodeMap.delete(k);
                }
              }
            }
            if (leavePromises.length) await Promise.all(leavePromises);
            const parent = anchor.parentNode;
            const enterEls = [];
            for (const k of newKeys) {
              const [item, index] = newEntries.get(k);
              if (keyNodeMap.has(k)) {
                const entry = keyNodeMap.get(k);
                if (entry.itemRef !== item) {
                  entry.reactive[itemVar] = item;
                  entry.itemRef = item;
                }
                if (indexVar) entry.reactive[indexVar] = index;
              } else {
                const clone = element.cloneNode(true);
                const perItemUnsubs = [];
                const { subscribe: itemSub, createReactiveState: itemCreate } = createReactivityScope();
                const itemReactive = itemCreate({
                  [itemVar]: item,
                  ...indexVar ? { [indexVar]: index } : {}
                });
                const mergedItemState = new Proxy({}, {
                  has(_, key) {
                    return true;
                  },
                  get(_, key) {
                    if (typeof key !== "string") return state[key];
                    if (key === itemVar || indexVar && key === indexVar) return itemReactive[key];
                    return state[key];
                  },
                  set(_, key, val) {
                    if (key === itemVar || indexVar && key === indexVar) {
                      itemReactive[key] = val;
                      return true;
                    }
                    state[key] = val;
                    return true;
                  }
                });
                const childCtx = {
                  ...context,
                  subscribe: (key, cb) => {
                    const baseKey = key.split(".")[0];
                    let unsub;
                    if (baseKey === itemVar || indexVar && baseKey === indexVar) {
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
                const tempFrag = document.createDocumentFragment();
                tempFrag.appendChild(clone);
                await walk(tempFrag, mergedItemState, childCtx);
                const actualEl = tempFrag.firstChild ?? clone;
                if (forTransition) actualEl.classList.add(`${forTransition}-enter`);
                keyNodeMap.set(k, {
                  el: actualEl,
                  reactive: itemReactive,
                  itemRef: item,
                  destroy: () => perItemUnsubs.forEach((u) => u())
                });
                if (forTransition) enterEls.push(actualEl);
              }
            }
            let cursor = anchor.nextSibling;
            let mismatches = 0;
            for (const k of newKeys) {
              const { el: el2 } = keyNodeMap.get(k);
              if (el2 !== cursor) mismatches++;
              else cursor = el2.nextSibling;
            }
            if (mismatches > 0) {
              if (mismatches > newKeys.length >> 1) {
                const frag = document.createDocumentFragment();
                for (const k of newKeys) frag.appendChild(keyNodeMap.get(k).el);
                parent.insertBefore(frag, anchor.nextSibling);
              } else {
                cursor = anchor.nextSibling;
                for (const k of newKeys) {
                  const { el: el2 } = keyNodeMap.get(k);
                  if (el2 !== cursor) parent.insertBefore(el2, cursor);
                  else cursor = el2.nextSibling;
                }
              }
            }
            rendered = newKeys.map((k) => keyNodeMap.get(k).el);
            if (enterEls.length) {
              Promise.all(enterEls.map(
                (el2) => waitForTransition(el2).then(() => el2.classList.remove(`${forTransition}-enter`))
              ));
            }
          } else {
            itemUnsubs.forEach((u) => u());
            itemUnsubs = [];
            rendered.forEach((n) => n.parentNode?.removeChild(n));
            rendered = [];
            if (!entries.length) return;
            const parent = anchor.parentNode;
            const insertBefore = anchor.nextSibling;
            const childContext = {
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
              const clone = element.cloneNode(true);
              const tempFrag = document.createDocumentFragment();
              tempFrag.appendChild(clone);
              await walk(tempFrag, makeItemState(state, item, itemVar, index, indexVar), childContext);
              const actualEl = tempFrag.firstChild ?? clone;
              parent.insertBefore(tempFrag, insertBefore);
              rendered.push(actualEl);
            }
          }
        };
        context.registerCleanup?.(() => {
          keyNodeMap.forEach(({ el: el2, destroy }) => {
            destroy();
            el2.parentNode?.removeChild(el2);
          });
          keyNodeMap.clear();
          itemUnsubs.forEach((u) => u());
          rendered.forEach((n) => n.parentNode?.removeChild(n));
          rendered = [];
        });
        subscribeDeps(collectionExpr, context, render);
        await render();
      }
      i++;
      continue;
    }
    if (element.hasAttribute("cv-if")) {
      const chain = [];
      const ifExpr = element.getAttribute("cv-if");
      element.removeAttribute("cv-if");
      const ifAnchor = document.createComment("cv-if");
      element.replaceWith(ifAnchor);
      chain.push({ condition: ifExpr, template: element, anchor: ifAnchor });
      let j = i + 1;
      while (j < nodes.length) {
        const sib = nodes[j];
        if (sib.nodeType === 3 && (sib.textContent?.trim() ?? "") === "") {
          j++;
          continue;
        }
        if (sib.nodeType !== 1) break;
        const sibEl = sib;
        if (sibEl.hasAttribute("cv-else-if")) {
          const elseIfExpr = sibEl.getAttribute("cv-else-if");
          sibEl.removeAttribute("cv-else-if");
          const anchor = document.createComment("cv-else-if");
          sibEl.replaceWith(anchor);
          chain.push({ condition: elseIfExpr, template: sibEl, anchor });
          j++;
          continue;
        }
        if (sibEl.hasAttribute("cv-else")) {
          sibEl.removeAttribute("cv-else");
          const anchor = document.createComment("cv-else");
          sibEl.replaceWith(anchor);
          chain.push({ condition: null, template: sibEl, anchor });
          j++;
          break;
        }
        break;
      }
      i = j;
      let activeClone = null;
      let rendering = false;
      let dirty = false;
      const render = async () => {
        if (rendering) {
          dirty = true;
          return;
        }
        rendering = true;
        try {
          do {
            dirty = false;
            if (activeClone) {
              activeClone.parentNode?.removeChild(activeClone);
              activeClone = null;
            }
            for (const branch of chain) {
              if (branch.condition === null || !!evaluate(branch.condition, state)) {
                const clone = branch.template.cloneNode(true);
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
      chain.filter((b) => b.condition).forEach((b) => {
        subscribeDeps(b.condition, context, render);
      });
      await render();
      continue;
    }
    if (element.hasAttribute("cv-show")) {
      const expr = element.getAttribute("cv-show");
      element.removeAttribute("cv-show");
      const cvtAttrs = Array.from(element.attributes).filter(
        (a) => a.name === "cv-transition" || a.name.startsWith("cv-transition:") || a.name.startsWith("cv-transition.")
      );
      const hasAlpineTransition = cvtAttrs.length > 0;
      if (hasAlpineTransition) {
        const getClasses = (name) => (element.getAttribute(name) ?? "").split(" ").filter(Boolean);
        const enterCls = getClasses("cv-transition:enter");
        const enterStartCls = getClasses("cv-transition:enter-start");
        const enterEndCls = getClasses("cv-transition:enter-end");
        const leaveCls = getClasses("cv-transition:leave");
        const leaveStartCls = getClasses("cv-transition:leave-start");
        const leaveEndCls = getClasses("cv-transition:leave-end");
        const bareVal = element.getAttribute("cv-transition") ?? "";
        const bareMods = new Set(bareVal.split(".").slice(1));
        const durationMod = [...bareMods].find((m) => /^\d+$/.test(m));
        const duration = durationMod ? parseInt(durationMod) : 200;
        const hasCustomClasses = enterCls.length || enterStartCls.length || leaveCls.length || leaveStartCls.length;
        if (!hasCustomClasses) {
          const scaleMod = [...bareMods].find((m) => m === "scale" || /^scale$/.test(m));
          const scaleVal = (() => {
            const sv = [...bareMods].find((m) => /^\d+$/.test(m) && m !== durationMod);
            return sv ? parseInt(sv) / 100 : 0.9;
          })();
          const parts = [];
          if (!bareMods.has("scale") || bareMods.has("opacity")) parts.push(`opacity ${duration}ms ease`);
          if (scaleMod) parts.push(`transform ${duration}ms ease`);
          if (!parts.length) parts.push(`opacity ${duration}ms ease`);
          element.style.transition = (element.style.transition ? element.style.transition + ", " : "") + parts.join(", ");
          cvtAttrs.forEach((a) => element.removeAttribute(a.name));
          let visible = !!evaluate(expr, state);
          const twoRafs = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          const applyBuiltin = async (show) => {
            if (show) {
              element.style.display = "";
              element.style.opacity = "0";
              if (scaleMod) element.style.transform = `scale(${scaleVal})`;
              await twoRafs();
              element.style.opacity = "";
              if (scaleMod) element.style.transform = "";
              await waitForTransition(element);
            } else {
              element.style.opacity = "0";
              if (scaleMod) element.style.transform = `scale(${scaleVal})`;
              await waitForTransition(element);
              element.style.display = "none";
              element.style.opacity = "";
              if (scaleMod) element.style.transform = "";
            }
            visible = show;
          };
          if (!visible) element.style.display = "none";
          subscribeDeps(expr, context, () => {
            const v = !!evaluate(expr, state);
            if (v !== visible) applyBuiltin(v);
          });
        } else {
          cvtAttrs.forEach((a) => element.removeAttribute(a.name));
          const twoRafs = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
          let visible = !!evaluate(expr, state);
          let transitioning = false;
          let pending = null;
          const applyClasses = async (show) => {
            if (transitioning) {
              pending = show;
              return;
            }
            transitioning = true;
            try {
              if (show) {
                element.style.display = "";
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
                element.style.display = "none";
              }
              visible = show;
            } finally {
              transitioning = false;
              if (pending !== null && pending !== visible) {
                const next = pending;
                pending = null;
                applyClasses(next);
              } else pending = null;
            }
          };
          if (!visible) element.style.display = "none";
          subscribeDeps(expr, context, () => {
            const v = !!evaluate(expr, state);
            if (v !== visible) applyClasses(v);
          });
        }
      } else {
        const staticTrans = element.getAttribute("cv-show-transition");
        const dynamicTrans = element.getAttribute(":transition");
        if (staticTrans) element.removeAttribute("cv-show-transition");
        if (dynamicTrans) element.removeAttribute(":transition");
        const transitionName = staticTrans ?? (dynamicTrans ? String(evaluate(dynamicTrans, state)) : null);
        if (transitionName) {
          injectCvTransitionStyles();
          let visible = !!evaluate(expr, state);
          if (!visible) element.style.display = "none";
          let transitioning = false;
          let pending = null;
          const animate = async (show) => {
            if (transitioning) {
              pending = show;
              return;
            }
            transitioning = true;
            try {
              if (show) {
                element.style.display = "";
                element.classList.add(`${transitionName}-enter`);
                await waitForTransition(element);
                element.classList.remove(`${transitionName}-enter`);
              } else {
                element.classList.add(`${transitionName}-leave`);
                await waitForTransition(element);
                element.classList.remove(`${transitionName}-leave`);
                element.style.display = "none";
              }
              visible = show;
            } finally {
              transitioning = false;
              if (pending !== null && pending !== visible) {
                const next = pending;
                pending = null;
                animate(next);
              } else pending = null;
            }
          };
          subscribeDeps(expr, context, () => {
            const v = !!evaluate(expr, state);
            if (v !== visible) animate(v);
          });
        } else {
          const update = () => {
            element.style.display = evaluate(expr, state) ? "" : "none";
          };
          subscribeDeps(expr, context, update);
          update();
        }
      }
    }
    if (element.hasAttribute("cv-focus")) {
      const expr = element.getAttribute("cv-focus") ?? "";
      element.removeAttribute("cv-focus");
      if (!expr) {
        Promise.resolve().then(() => element.focus());
      } else {
        const doFocus = () => {
          if (evaluate(expr, state)) Promise.resolve().then(() => element.focus());
        };
        subscribeDeps(expr, context, doFocus);
        doFocus();
      }
    }
    {
      const interAttrs = Array.from(element.attributes).filter(
        (a) => a.name === "cv-intersect" || a.name.startsWith("cv-intersect:") || a.name.startsWith("cv-intersect.")
      );
      if (interAttrs.length && typeof IntersectionObserver !== "undefined") {
        const enterAttr = interAttrs.find((a) => a.name === "cv-intersect" || a.name === "cv-intersect:enter" || a.name.startsWith("cv-intersect."));
        const leaveAttr = interAttrs.find((a) => a.name === "cv-intersect:leave");
        const enterExpr = enterAttr?.value ?? "";
        const leaveExpr = leaveAttr?.value ?? "";
        const modParts = (enterAttr?.name ?? "cv-intersect").split(".");
        const mods = new Set(modParts.slice(1));
        const once = mods.has("once");
        let threshold = 0;
        if (mods.has("half")) threshold = 0.5;
        else if (mods.has("full")) threshold = 1;
        else {
          const tMod = [...mods].find((m) => m.startsWith("threshold-"));
          if (tMod) threshold = parseInt(tMod.replace("threshold-", "")) / 100;
        }
        const marginMod = [...mods].find((m) => m.startsWith("margin-"));
        const rootMargin = marginMod ? `${marginMod.replace("margin-", "")}px` : void 0;
        interAttrs.forEach((a) => element.removeAttribute(a.name));
        const runExpr = (expr) => {
          if (!expr) return;
          try {
            new Function("$data", `with($data){${expr}}`)(state);
          } catch (e) {
            console.warn(`[courvux] cv-intersect error "${expr}":`, e);
          }
        };
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runExpr(enterExpr);
              if (once) observer.disconnect();
            } else {
              runExpr(leaveExpr);
            }
          });
        }, { threshold, ...rootMargin ? { rootMargin } : {} });
        observer.observe(element);
        context.registerCleanup?.(() => observer.disconnect());
      }
    }
    {
      const htmlAttr = Array.from(element.attributes).find((a) => a.name === "cv-html" || a.name.startsWith("cv-html."));
      if (htmlAttr) {
        const expr = htmlAttr.value;
        element.removeAttribute(htmlAttr.name);
        const doSanitize = htmlAttr.name.split(".").slice(1).includes("sanitize");
        const update = () => {
          const raw = String(evaluate(expr, state) ?? "");
          element.innerHTML = doSanitize ? sanitizeHtml(raw) : raw;
        };
        subscribeDeps(expr, context, update);
        update();
        i++;
        continue;
      }
    }
    if (element.hasAttribute("cv-ref")) {
      if (!context.components?.[tagName]) {
        const refName = element.getAttribute("cv-ref");
        element.removeAttribute("cv-ref");
        if (context.refs) context.refs[refName] = element;
      }
    }
    const isCustomComponent = !!context.components?.[tagName];
    const modelAttr = Array.from(element.attributes).find((a) => a.name === "cv-model" || a.name.startsWith("cv-model."));
    if (modelAttr && !isCustomComponent) {
      const expr = modelAttr.value;
      element.removeAttribute(modelAttr.name);
      const mods = new Set(modelAttr.name.split(".").slice(1));
      const inputEl = element;
      const type = inputEl.type?.toLowerCase();
      const applyMods = (v) => {
        if (mods.has("number")) {
          const n = parseFloat(v);
          return isNaN(n) ? v : n;
        }
        if (mods.has("trim")) return v.trim();
        return v;
      };
      if (type === "checkbox") {
        const update = () => {
          const val = evaluate(expr, state);
          inputEl.checked = Array.isArray(val) ? val.includes(inputEl.value) : !!val;
        };
        subscribeExpr(expr, context, update);
        update();
        inputEl.addEventListener("change", () => {
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
      } else if (type === "radio") {
        const update = () => {
          inputEl.checked = evaluate(expr, state) === inputEl.value;
        };
        subscribeExpr(expr, context, update);
        update();
        inputEl.addEventListener("change", () => {
          if (inputEl.checked) setStateValue(expr, state, applyMods(inputEl.value));
        });
      } else if (element.hasAttribute("contenteditable")) {
        const ceEl = element;
        const update = () => {
          const val = String(evaluate(expr, state) ?? "");
          if (ceEl.innerText !== val) ceEl.innerText = val;
        };
        subscribeExpr(expr, context, update);
        update();
        if (mods.has("debounce")) {
          const delayMod = [...mods].find((m) => /^\d+$/.test(m));
          const delay = delayMod ? parseInt(delayMod) : 300;
          let timer;
          ceEl.addEventListener("input", () => {
            clearTimeout(timer);
            timer = setTimeout(() => setStateValue(expr, state, applyMods(ceEl.innerText)), delay);
          });
        } else {
          const inputEvent = mods.has("lazy") ? "blur" : "input";
          ceEl.addEventListener(inputEvent, () => setStateValue(expr, state, applyMods(ceEl.innerText)));
        }
      } else {
        const update = () => {
          inputEl.value = evaluate(expr, state) ?? "";
        };
        subscribeExpr(expr, context, update);
        update();
        if (mods.has("debounce")) {
          const delayMod = [...mods].find((m) => /^\d+$/.test(m));
          const delay = delayMod ? parseInt(delayMod) : 300;
          let timer;
          inputEl.addEventListener("input", () => {
            clearTimeout(timer);
            timer = setTimeout(() => setStateValue(expr, state, applyMods(inputEl.value)), delay);
          });
        } else {
          const inputEvent = tagName === "select" ? "change" : mods.has("lazy") ? "change" : "input";
          inputEl.addEventListener(inputEvent, () => setStateValue(expr, state, applyMods(inputEl.value)));
        }
      }
    }
    if (context.directives) {
      Array.from(element.attributes).forEach((attr) => {
        if (!attr.name.startsWith("cv-")) return;
        const rest = attr.name.slice(3);
        const parts = rest.split(".");
        const nameWithArg = parts[0];
        const modParts = parts.slice(1);
        const colonIdx = nameWithArg.indexOf(":");
        const dName = colonIdx >= 0 ? nameWithArg.slice(0, colonIdx) : nameWithArg;
        const dArg = colonIdx >= 0 ? nameWithArg.slice(colonIdx + 1) : void 0;
        const def = context.directives[dName];
        if (!def) return;
        const attrValue = attr.value;
        element.removeAttribute(attr.name);
        const normDef = typeof def === "function" ? { onMount: def } : def;
        const binding = {
          value: attrValue ? evaluate(attrValue, state) : void 0,
          arg: dArg,
          modifiers: Object.fromEntries(modParts.map((m) => [m, true]))
        };
        normDef.onMount?.(element, binding);
        if (normDef.onUpdate && attrValue) {
          subscribeDeps(attrValue, context, () => {
            binding.value = evaluate(attrValue, state);
            normDef.onUpdate(element, binding);
          });
        }
        if (normDef.onDestroy) {
          context.registerCleanup?.(() => normDef.onDestroy(element, binding));
        }
      });
    }
    if (tagName === "slot") {
      const slotName = element.getAttribute("name") ?? "default";
      const renderer = context.slots?.[slotName];
      if (renderer) {
        const scope = {};
        Array.from(element.attributes).forEach((attr) => {
          if (attr.name.startsWith(":")) scope[attr.name.slice(1)] = evaluate(attr.value, state);
        });
        const nodes2 = await renderer(scope);
        const fragment = document.createDocumentFragment();
        nodes2.forEach((n) => fragment.appendChild(n));
        element.replaceWith(fragment);
      } else {
        const frag = document.createDocumentFragment();
        while (element.firstChild) frag.appendChild(element.firstChild);
        await walk(frag, state, context);
        element.replaceWith(frag);
      }
      i++;
      continue;
    }
    if (tagName === "cv-transition") {
      injectCvTransitionStyles();
      const name = element.getAttribute("name") ?? "fade";
      const showExpr = element.getAttribute(":show") ?? null;
      element.removeAttribute("name");
      if (showExpr) element.removeAttribute(":show");
      const wrapper = document.createElement("div");
      wrapper.className = "cv-t-wrap";
      while (element.firstChild) wrapper.appendChild(element.firstChild);
      element.replaceWith(wrapper);
      await walk(wrapper, state, context);
      if (showExpr) {
        let visible = !!evaluate(showExpr, state);
        let transitioning = false;
        let pending = null;
        if (!visible) wrapper.style.display = "none";
        const animate = async (show) => {
          if (transitioning) {
            pending = show;
            return;
          }
          transitioning = true;
          try {
            if (show) {
              wrapper.style.display = "";
              wrapper.classList.add(`${name}-enter`);
              await waitForTransition(wrapper);
              wrapper.classList.remove(`${name}-enter`);
            } else {
              wrapper.classList.add(`${name}-leave`);
              await waitForTransition(wrapper);
              wrapper.classList.remove(`${name}-leave`);
              wrapper.style.display = "none";
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
    if (tagName === "router-view" && context.mountRouterView) {
      const name = element.getAttribute("name") ?? void 0;
      element.setAttribute("aria-live", "polite");
      element.setAttribute("aria-atomic", "true");
      await context.mountRouterView(element, name);
      i++;
      continue;
    }
    if (tagName === "router-link") {
      const toExpr = element.getAttribute(":to");
      const toStatic = element.getAttribute("to");
      const getTo = () => toExpr ? String(evaluate(toExpr, state) ?? "/") : toStatic || "/";
      const a = document.createElement("a");
      a.innerHTML = element.innerHTML;
      Array.from(element.attributes).forEach((attr) => {
        if (attr.name !== "to" && attr.name !== ":to") a.setAttribute(attr.name, attr.value);
      });
      const getCurrentPath = () => context.router?.mode === "history" ? window.location.pathname : window.location.hash.slice(1) || "/";
      const updateActive = () => {
        const to = getTo();
        const isActive = getCurrentPath() === to;
        if (context.router?.mode === "history") a.href = to;
        else a.href = `#${to}`;
        if (isActive) {
          a.setAttribute("aria-current", "page");
          a.classList.add("active");
        } else {
          a.removeAttribute("aria-current");
          a.classList.remove("active");
        }
      };
      if (context.router?.mode === "history") {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          context.router.navigate(getTo());
        });
        window.addEventListener("popstate", updateActive);
      } else {
        window.addEventListener("hashchange", updateActive);
      }
      if (toExpr) subscribeExpr(toExpr, context, updateActive);
      updateActive();
      element.replaceWith(a);
      await walk(a, state, context);
      i++;
      continue;
    }
    if (tagName === "component" && element.hasAttribute(":is") && context.mountDynamic) {
      const isExpr = element.getAttribute(":is");
      element.removeAttribute(":is");
      const anchor = document.createComment("component:is");
      element.replaceWith(anchor);
      await context.mountDynamic(anchor, isExpr, element, state, context);
      i++;
      continue;
    }
    if (context.components?.[tagName] && context.mountElement) {
      await context.mountElement(element, tagName, state, context);
      i++;
      continue;
    }
    {
      const intersectAttr = Array.from(element.attributes).find(
        (a) => a.name === "cv-intersect" || a.name.startsWith("cv-intersect.")
      );
      if (intersectAttr && typeof IntersectionObserver !== "undefined") {
        const mods = new Set(intersectAttr.name.split(".").slice(1));
        element.removeAttribute(intersectAttr.name);
        const val = evaluate(intersectAttr.value, state);
        let handlerFn;
        let threshold = 0;
        let rootMargin = "0px";
        let once = mods.has("once");
        if (typeof val === "function") {
          handlerFn = (entry) => val.call(state, entry);
        } else if (val && typeof val === "object") {
          if (typeof val.handler === "function") handlerFn = (entry) => val.handler.call(state, entry);
          if (val.threshold !== void 0) threshold = val.threshold;
          if (val.margin) rootMargin = val.margin;
          if (val.once) once = true;
        }
        if (handlerFn) {
          const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            handlerFn(entry);
            if (once && entry.isIntersecting) observer.disconnect();
          }, { threshold, rootMargin });
          observer.observe(element);
          context.registerCleanup?.(() => observer.disconnect());
        }
      }
    }
    if (element.hasAttribute("cv-resize")) {
      const expr = element.getAttribute("cv-resize");
      element.removeAttribute("cv-resize");
      if (typeof ResizeObserver !== "undefined") {
        const val = evaluate(expr, state);
        let handlerFn;
        let box = "content-box";
        if (typeof val === "function") {
          handlerFn = (entry) => val.call(state, entry);
        } else if (val && typeof val === "object") {
          if (typeof val.handler === "function") handlerFn = (entry) => val.handler.call(state, entry);
          if (val.box) box = val.box;
        }
        if (handlerFn) {
          const observer = new ResizeObserver((entries) => {
            if (entries[0]) handlerFn(entries[0]);
          });
          observer.observe(element, { box });
          context.registerCleanup?.(() => observer.disconnect());
        }
      }
    }
    if (element.hasAttribute("cv-scroll")) {
      const expr = element.getAttribute("cv-scroll");
      element.removeAttribute("cv-scroll");
      const val = evaluate(expr, state);
      let handlerFn;
      let throttleMs = 0;
      if (typeof val === "function") {
        handlerFn = (info) => val.call(state, info);
      } else if (val && typeof val === "object") {
        if (typeof val.handler === "function") handlerFn = (info) => val.handler.call(state, info);
        if (val.throttle) throttleMs = val.throttle;
      }
      if (handlerFn) {
        let lastTime = 0;
        const onScroll = () => {
          const now = Date.now();
          if (throttleMs > 0 && now - lastTime < throttleMs) return;
          lastTime = now;
          handlerFn({
            scrollTop: element.scrollTop,
            scrollLeft: element.scrollLeft,
            scrollHeight: element.scrollHeight,
            scrollWidth: element.scrollWidth,
            clientHeight: element.clientHeight,
            clientWidth: element.clientWidth
          });
        };
        element.addEventListener("scroll", onScroll, { passive: true });
        context.registerCleanup?.(() => element.removeEventListener("scroll", onScroll));
      }
    }
    if (element.hasAttribute("cv-clickoutside")) {
      const expr = element.getAttribute("cv-clickoutside");
      element.removeAttribute("cv-clickoutside");
      const handler = (e) => {
        if (!element.contains(e.target)) {
          if (typeof state[expr] === "function") {
            state[expr].call(state, e);
          } else {
            executeHandler(expr, state, e);
          }
        }
      };
      document.addEventListener("click", handler, true);
      context.registerCleanup?.(() => document.removeEventListener("click", handler, true));
    }
    if (element.hasAttribute("cv-bind")) {
      const bindExpr = element.getAttribute("cv-bind");
      element.removeAttribute("cv-bind");
      const staticClass = element.getAttribute("class") ?? "";
      const staticStyle = element.getAttribute("style") ?? "";
      let prevKeys = [];
      const applyBind = () => {
        const obj = evaluate(bindExpr, state) ?? {};
        const newKeys = Object.keys(obj);
        for (const k of prevKeys) {
          if (!(k in obj)) {
            if (k === "class") element.className = staticClass;
            else if (k === "style") element.style.cssText = staticStyle;
            else element.removeAttribute(k);
          }
        }
        for (const [k, val] of Object.entries(obj)) {
          if (k === "class") {
            element.className = [staticClass, resolveClass(val)].filter(Boolean).join(" ");
          } else if (k === "style") {
            applyStyle(element, val, staticStyle);
          } else if (val === null || val === void 0 || val === false) {
            element.removeAttribute(k);
          } else {
            element.setAttribute(k, val === true ? "" : String(val));
          }
        }
        prevKeys = newKeys;
      };
      subscribeDeps(bindExpr, context, applyBind);
      applyBind();
    }
    const KEY_MAP = {
      enter: "Enter",
      esc: "Escape",
      escape: "Escape",
      space: " ",
      tab: "Tab",
      delete: "Delete",
      backspace: "Backspace",
      up: "ArrowUp",
      down: "ArrowDown",
      left: "ArrowLeft",
      right: "ArrowRight"
    };
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("@") || attr.name.startsWith("cv:on:")) {
        const raw = attr.name.startsWith("@") ? attr.name.substring(1) : attr.name.substring(6);
        const parts = raw.split(".");
        const baseEvent = parts[0];
        const modifiers = new Set(parts.slice(1));
        const keyFilter = [...modifiers].find((m) => m in KEY_MAP);
        const expr = attr.value;
        const handler = (event) => {
          if (modifiers.has("prevent")) event.preventDefault();
          if (modifiers.has("stop")) event.stopPropagation();
          if (modifiers.has("self") && event.target !== event.currentTarget) return;
          if (keyFilter && event.key !== KEY_MAP[keyFilter]) return;
          if (typeof state[expr] === "function") {
            state[expr].call(state, event);
          } else {
            executeHandler(expr, state, event);
          }
        };
        const listenerOpts = {};
        if (modifiers.has("once")) listenerOpts.once = true;
        if (modifiers.has("passive")) listenerOpts.passive = true;
        if (modifiers.has("capture")) listenerOpts.capture = true;
        element.addEventListener(baseEvent, handler, Object.keys(listenerOpts).length ? listenerOpts : void 0);
      } else if (attr.name.startsWith(":")) {
        const propName = attr.name.slice(1);
        const expr = attr.value;
        if (propName === "class") {
          const staticClass = element.getAttribute("class") ?? "";
          const update = () => {
            const dynamic = resolveClass(evaluate(expr, state));
            element.className = [staticClass, dynamic].filter(Boolean).join(" ");
          };
          subscribeDeps(expr, context, update);
          update();
        } else if (propName === "style") {
          const staticStyle = element.getAttribute("style") ?? "";
          const update = () => applyStyle(element, evaluate(expr, state), staticStyle);
          subscribeDeps(expr, context, update);
          update();
        } else if (propName.includes("-")) {
          const update = () => {
            const val = evaluate(expr, state);
            if (val === null || val === void 0 || val === false) {
              element.removeAttribute(propName);
            } else {
              element.setAttribute(propName, val === true ? "" : String(val));
            }
          };
          subscribeDeps(expr, context, update);
          update();
        } else {
          const update = () => {
            element[propName] = evaluate(expr, state) ?? "";
          };
          subscribeDeps(expr, context, update);
          update();
        }
      }
    });
    if (node.hasChildNodes()) await walk(node, state, context);
    i++;
  }
}

// src/router.ts
var BUILT_IN_STYLES = `
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
  if (document.getElementById("cv-transitions")) return;
  const style = document.createElement("style");
  style.id = "cv-transitions";
  style.textContent = BUILT_IN_STYLES;
  document.head.appendChild(style);
}
async function animateEl(el, name, phase) {
  el.classList.add(`${name}-${phase}`);
  const cs = getComputedStyle(el);
  const duration = Math.max(
    parseFloat(cs.animationDuration) || 0,
    parseFloat(cs.transitionDuration) || 0
  ) * 1e3;
  if (duration > 0) {
    await new Promise((resolve2) => {
      const done = () => resolve2();
      el.addEventListener("animationend", done, { once: true });
      el.addEventListener("transitionend", done, { once: true });
      setTimeout(done, duration + 50);
    });
  }
  el.classList.remove(`${name}-${phase}`);
}
var lazyCache = /* @__PURE__ */ new Map();
async function resolveComponent(component) {
  if (typeof component !== "function") return component;
  if (lazyCache.has(component)) return lazyCache.get(component);
  const mod = await component();
  lazyCache.set(component, mod.default);
  return mod.default;
}
function getViewComponent(route, viewName) {
  if (route.components) return route.components[viewName];
  if (viewName === "default") return route.component;
  return void 0;
}
function matchRoute(pattern, path) {
  if (pattern === "*") return {};
  const keys = [];
  const regexStr = pattern.replace(/:(\w+)/g, (_, k) => {
    keys.push(k);
    return "([^/]+)";
  });
  const m = path.match(new RegExp(`^${regexStr}$`));
  if (!m) return null;
  return Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
}
function matchRoutePrefix(pattern, path) {
  if (pattern === "/") return { params: {}, remaining: path };
  const keys = [];
  const regexStr = pattern.replace(/:(\w+)/g, (_, k) => {
    keys.push(k);
    return "([^/]+)";
  });
  const m = path.match(new RegExp(`^${regexStr}(/.+)?$`));
  if (!m) return null;
  const params = Object.fromEntries(keys.map((k, i) => [k, m[i + 1]]));
  const remaining = m[keys.length + 1] || "/";
  return { params, remaining };
}
var runGuard = (guard, routeMatch) => new Promise((resolve2) => guard(routeMatch, resolve2));
var runComponentLeaveGuard = (activation, to) => {
  if (!activation?.beforeLeave) return Promise.resolve(void 0);
  return new Promise((resolve2) => activation.beforeLeave(to, resolve2));
};
function parseQuery(search) {
  if (!search) return {};
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out = {};
  params.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}
function setupRouterView(el, router, mount3, name = "default", onFirstRender) {
  const getCurrentPath = () => {
    if (router.mode === "history") return window.location.pathname;
    const hash = window.location.hash.slice(1) || "/";
    return hash.split("?")[0] || "/";
  };
  const getCurrentQuery = () => {
    if (router.mode === "history") return parseQuery(window.location.search);
    const hash = window.location.hash.slice(1) || "/";
    const qIdx = hash.indexOf("?");
    return qIdx >= 0 ? parseQuery(hash.slice(qIdx + 1)) : {};
  };
  if (router.transition) injectTransitionStyles();
  let prevRouteMatch = null;
  let prevRouteConfig = null;
  let prevActivation = null;
  let currentParentKey = null;
  let firstRenderDone = false;
  const notifyFirstRender = () => {
    if (!firstRenderDone) {
      firstRenderDone = true;
      onFirstRender?.();
    }
  };
  const keepAliveCache = /* @__PURE__ */ new Map();
  const leaveEl = (route) => {
    if (route?.keepAlive && prevActivation) {
      prevActivation.deactivate?.();
      const fragment = document.createDocumentFragment();
      while (el.firstChild) fragment.appendChild(el.firstChild);
      keepAliveCache.set(prevRouteMatch.path, { fragment, activation: prevActivation });
      prevActivation = null;
    } else {
      prevActivation?.destroy();
      prevActivation = null;
      el.innerHTML = "";
    }
  };
  const mountWithLoading = async (route, routeComp, routeMatch, layout, childRouter) => {
    const isFirstLoad = typeof routeComp === "function" && !lazyCache.has(routeComp);
    const asyncOpts = isFirstLoad ? routeComp.__asyncOptions : void 0;
    const loadingHtml = route.loadingTemplate ?? asyncOpts?.loadingTemplate;
    if (isFirstLoad && loadingHtml) el.innerHTML = loadingHtml;
    let config;
    try {
      config = await resolveComponent(routeComp);
    } catch (err) {
      const errorHtml = asyncOpts?.errorTemplate;
      if (errorHtml) {
        el.innerHTML = errorHtml;
        return { destroy: () => {
          el.innerHTML = "";
        } };
      }
      throw err;
    }
    if (isFirstLoad && loadingHtml) el.innerHTML = "";
    return mount3(el, config, routeMatch, layout, childRouter);
  };
  const render = async () => {
    const path = getCurrentPath();
    const query = getCurrentQuery();
    for (const route of router.routes) {
      if (route.children?.length) {
        const prefixMatch = matchRoutePrefix(route.path, path);
        if (prefixMatch !== null) {
          for (const child of route.children) {
            const childParams = matchRoute(child.path, path);
            if (childParams !== null) {
              const routeMatch = { params: prefixMatch.params, query, path, meta: route.meta };
              if (child.redirect) {
                const childMatch = { params: childParams, query, path, meta: child.meta };
                const target = typeof child.redirect === "function" ? child.redirect(childMatch) : child.redirect;
                router.navigate(target);
                return;
              }
              if (router.beforeEach) {
                const r = await runGuard(router.beforeEach, routeMatch);
                if (r) {
                  router.navigate(r);
                  return;
                }
              }
              if (route.beforeEnter) {
                const r = await runGuard(route.beforeEnter, routeMatch);
                if (r) {
                  router.navigate(r);
                  return;
                }
              }
              if (child.beforeEnter) {
                const childMatch = { params: childParams, query, path, meta: child.meta };
                const r = await runGuard(child.beforeEnter, childMatch);
                if (r) {
                  router.navigate(r);
                  return;
                }
              }
              const parentKey = `${route.path}::${JSON.stringify(prefixMatch.params)}`;
              if (currentParentKey !== parentKey) {
                const compLeaveRedirect = await runComponentLeaveGuard(prevActivation, routeMatch);
                if (compLeaveRedirect) {
                  router.navigate(compLeaveRedirect);
                  return;
                }
                const transitionName = route.transition ?? router.transition;
                if (transitionName && el.hasChildNodes()) await animateEl(el, transitionName, "leave");
                leaveEl(prevRouteConfig);
                const routeComp = getViewComponent(route, name);
                if (routeComp) {
                  const childRouter = {
                    routes: route.children,
                    mode: router.mode,
                    transition: route.transition ?? router.transition,
                    beforeEach: router.beforeEach,
                    afterEach: router.afterEach,
                    scrollBehavior: router.scrollBehavior,
                    navigate: (p, o) => router.navigate(p, o),
                    replace: (p, o) => router.replace(p, o),
                    back: () => router.back(),
                    forward: () => router.forward()
                  };
                  prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === "default" ? route.layout : void 0, name === "default" ? childRouter : void 0);
                  prevActivation.enter?.(prevRouteMatch);
                } else {
                  el.innerHTML = "";
                }
                currentParentKey = parentKey;
                if (transitionName) await animateEl(el, transitionName, "enter");
              }
              const combined = { params: { ...prefixMatch.params, ...childParams }, query, path, meta: child.meta ?? route.meta };
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
      const params = matchRoute(route.path, path);
      if (params !== null) {
        currentParentKey = null;
        const routeMatch = { params, query, path, meta: route.meta };
        if (route.redirect) {
          const target = typeof route.redirect === "function" ? route.redirect(routeMatch) : route.redirect;
          router.navigate(target);
          return;
        }
        if (router.beforeEach) {
          const r = await runGuard(router.beforeEach, routeMatch);
          if (r) {
            router.navigate(r);
            return;
          }
        }
        if (route.beforeEnter) {
          const r = await runGuard(route.beforeEnter, routeMatch);
          if (r) {
            router.navigate(r);
            return;
          }
        }
        const compLeaveRedirect = await runComponentLeaveGuard(prevActivation, routeMatch);
        if (compLeaveRedirect) {
          router.navigate(compLeaveRedirect);
          return;
        }
        const transitionName = route.transition ?? router.transition;
        if (transitionName && el.hasChildNodes()) await animateEl(el, transitionName, "leave");
        leaveEl(prevRouteConfig);
        const routeComp = getViewComponent(route, name);
        if (routeComp) {
          const cacheKey = routeMatch.path;
          if (route.keepAlive && keepAliveCache.has(cacheKey)) {
            const cached = keepAliveCache.get(cacheKey);
            el.appendChild(cached.fragment);
            prevActivation = cached.activation;
            prevActivation.activate?.();
            keepAliveCache.delete(cacheKey);
          } else {
            const fromRoute = prevRouteMatch;
            prevActivation = await mountWithLoading(route, routeComp, routeMatch, name === "default" ? route.layout : void 0);
            prevActivation.enter?.(fromRoute);
          }
        } else {
          el.innerHTML = "";
          prevActivation = null;
        }
        if (transitionName) await animateEl(el, transitionName, "enter");
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
  const eventType = router.mode === "history" ? "popstate" : "hashchange";
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

// src/devtools.ts
function setupDevTools() {
  if (typeof window === "undefined") return null;
  if (window.__COURVUX_DEVTOOLS__) return window.__COURVUX_DEVTOOLS__;
  const listeners = /* @__PURE__ */ new Map();
  const hook = {
    instances: [],
    stores: [],
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, /* @__PURE__ */ new Set());
      listeners.get(event).add(cb);
      return () => listeners.get(event)?.delete(cb);
    },
    _emit(event, payload) {
      listeners.get(event)?.forEach((cb) => {
        try {
          cb(payload);
        } catch {
        }
      });
    },
    _registerInstance(instance) {
      this.instances.push(instance);
      this._emit("mount", instance);
    },
    _unregisterInstance(id) {
      const idx = this.instances.findIndex((i) => i.id === id);
      if (idx !== -1) {
        const inst = this.instances[idx];
        this.instances.splice(idx, 1);
        this._emit("destroy", inst);
      }
    },
    _registerStore(entry) {
      this.stores.push(entry);
      entry.subscribe(() => this._emit("store-update", entry));
    }
  };
  window.__COURVUX_DEVTOOLS__ = hook;
  return hook;
}
var _idCounter = 0;
function nextDevToolsId() {
  return ++_idCounter;
}

// src/overlay.ts
var CSS = `
#cvd{position:fixed;bottom:16px;right:16px;z-index:2147483647;font-family:monospace;font-size:12px;line-height:1.4}
#cvd *{box-sizing:border-box;margin:0;padding:0}
#cvd-badge{background:#5b4cf5;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:700;letter-spacing:.5px;user-select:none;box-shadow:0 2px 8px rgba(0,0,0,.4)}
#cvd-badge:hover{background:#7066f7}
#cvd-panel{background:#16161e;color:#c9c9d3;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6);width:380px;max-height:70vh;display:flex;flex-direction:column;border:1px solid #2a2a3d;overflow:hidden}
#cvd-head{display:flex;align-items:center;gap:6px;padding:8px 10px;background:#1f1f30;cursor:move;border-bottom:1px solid #2a2a3d}
#cvd-title{flex:1;font-weight:700;font-size:11px;color:#7066f7;letter-spacing:.8px}
#cvd-tabs{display:flex;gap:2px}
.cvd-tab{background:none;border:none;color:#888;padding:3px 8px;border-radius:4px;cursor:pointer;font:inherit;font-size:11px}
.cvd-tab.active,.cvd-tab:hover{background:#2a2a3d;color:#c9c9d3}
#cvd-close{background:none;border:none;color:#666;cursor:pointer;font-size:14px;line-height:1;padding:0 2px}
#cvd-close:hover{color:#e06c75}
#cvd-body{overflow-y:auto;flex:1;padding:6px}
#cvd-body::-webkit-scrollbar{width:4px}
#cvd-body::-webkit-scrollbar-track{background:#1a1a28}
#cvd-body::-webkit-scrollbar-thumb{background:#3a3a52;border-radius:2px}
.cvd-inst{border:1px solid #2a2a3d;border-radius:6px;margin-bottom:6px;overflow:hidden}
.cvd-inst-head{display:flex;align-items:center;gap:6px;padding:5px 8px;background:#1f1f30;cursor:pointer}
.cvd-inst-head:hover{background:#252538}
.cvd-inst-name{font-weight:700;color:#82aaff;flex:1}
.cvd-inst-id{color:#555;font-size:10px}
.cvd-arrow{color:#555;font-size:10px;transition:transform .15s}
.cvd-inst.open .cvd-arrow{transform:rotate(90deg)}
.cvd-kv{display:none;padding:6px 8px;background:#16161e;border-top:1px solid #2a2a3d}
.cvd-inst.open .cvd-kv{display:block}
.cvd-row{display:flex;align-items:baseline;gap:6px;padding:2px 0;border-bottom:1px solid #1e1e2a}
.cvd-row:last-child{border-bottom:none}
.cvd-key{color:#c792ea;min-width:90px;flex-shrink:0}
.cvd-val{color:#c3e88d;flex:1;word-break:break-all;cursor:pointer;padding:1px 4px;border-radius:3px}
.cvd-val:hover{background:#252538}
.cvd-val.editing{background:transparent;padding:0}
.cvd-edit{background:#252538;border:1px solid #5b4cf5;color:#c3e88d;font:inherit;width:100%;border-radius:3px;padding:1px 4px;outline:none}
.cvd-store-key{color:#ffcb6b}
.cvd-empty{color:#555;text-align:center;padding:20px;font-style:italic}
.cvd-badge-dot{display:inline-block;width:6px;height:6px;background:#61d46a;border-radius:50%;margin-right:5px;animation:cvd-pulse 2s infinite}
@keyframes cvd-pulse{0%,100%{opacity:1}50%{opacity:.4}}
.cvd-count{color:#888;font-size:10px}
`;
function injectCss() {
  if (document.getElementById("cvd-styles")) return;
  const s = document.createElement("style");
  s.id = "cvd-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function formatVal(v) {
  if (v === null) return "null";
  if (v === void 0) return "undefined";
  if (typeof v === "string") return `"${v}"`;
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}
function parseVal(s) {
  try {
    return JSON.parse(s);
  } catch {
    return s;
  }
}
function mountDevOverlay(hook) {
  if (typeof document === "undefined") return;
  injectCss();
  const root = document.createElement("div");
  root.id = "cvd";
  document.body.appendChild(root);
  let panelVisible = false;
  let activeTab = "components";
  let openInstances = /* @__PURE__ */ new Set();
  const badge = document.createElement("div");
  badge.id = "cvd-badge";
  badge.innerHTML = '<span class="cvd-badge-dot"></span>COURVUX';
  root.appendChild(badge);
  const panel = document.createElement("div");
  panel.id = "cvd-panel";
  panel.style.display = "none";
  root.appendChild(panel);
  panel.innerHTML = `
        <div id="cvd-head">
            <span id="cvd-title">\u26A1 COURVUX DEVTOOLS</span>
            <div id="cvd-tabs">
                <button class="cvd-tab active" data-tab="components">Components</button>
                <button class="cvd-tab" data-tab="store">Store</button>
            </div>
            <button id="cvd-close">\u2715</button>
        </div>
        <div id="cvd-body"></div>
    `;
  const body = panel.querySelector("#cvd-body");
  badge.addEventListener("click", () => {
    panelVisible = true;
    badge.style.display = "none";
    panel.style.display = "flex";
    render();
  });
  panel.querySelector("#cvd-close").addEventListener("click", () => {
    panelVisible = false;
    panel.style.display = "none";
    badge.style.display = "";
  });
  panel.querySelectorAll(".cvd-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab;
      panel.querySelectorAll(".cvd-tab").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      render();
    });
  });
  const head = panel.querySelector("#cvd-head");
  let dragging = false, ox = 0, oy = 0;
  head.addEventListener("mousedown", (e) => {
    if (e.target.closest("button")) return;
    dragging = true;
    ox = e.clientX - root.getBoundingClientRect().left;
    oy = e.clientY - root.getBoundingClientRect().top;
  });
  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    root.style.right = "auto";
    root.style.bottom = "auto";
    root.style.left = `${e.clientX - ox}px`;
    root.style.top = `${e.clientY - oy}px`;
  });
  document.addEventListener("mouseup", () => {
    dragging = false;
  });
  function renderComponents() {
    const instances = hook.instances;
    if (!instances.length) {
      body.innerHTML = '<div class="cvd-empty">No hay componentes montados</div>';
      return;
    }
    body.innerHTML = instances.map((inst) => {
      const state = inst.getState();
      const keys = Object.keys(state);
      const isOpen = openInstances.has(inst.id);
      return `
                <div class="cvd-inst${isOpen ? " open" : ""}" data-id="${inst.id}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow">\u25B6</span>
                        <span class="cvd-inst-name">&lt;${inst.name}&gt;</span>
                        <span class="cvd-count">${keys.length} keys</span>
                        <span class="cvd-inst-id">#${inst.id}</span>
                    </div>
                    <div class="cvd-kv">
                        ${keys.length ? keys.map((k) => `
                            <div class="cvd-row">
                                <span class="cvd-key">${k}</span>
                                <span class="cvd-val" data-inst="${inst.id}" data-key="${k}" title="click to edit">${formatVal(state[k])}</span>
                            </div>
                        `).join("") : '<span style="color:#555">\u2014 sin datos reactivos \u2014</span>'}
                    </div>
                </div>
            `;
    }).join("");
    body.querySelectorAll(".cvd-inst-head").forEach((h) => {
      h.addEventListener("click", () => {
        const el = h.closest(".cvd-inst");
        const id = parseInt(el.dataset.id);
        if (openInstances.has(id)) openInstances.delete(id);
        else openInstances.add(id);
        el.classList.toggle("open");
      });
    });
    body.querySelectorAll(".cvd-val").forEach((valEl) => {
      valEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const el = valEl;
        if (el.querySelector("input")) return;
        const instId = parseInt(el.dataset.inst);
        const key = el.dataset.key;
        const inst = hook.instances.find((i) => i.id === instId);
        if (!inst) return;
        const current = formatVal(inst.getState()[key]);
        el.classList.add("editing");
        el.innerHTML = `<input class="cvd-edit" value='${current.replace(/'/g, "&#39;")}'>`;
        const input = el.querySelector("input");
        input.focus();
        input.select();
        const commit = () => {
          inst.setState(key, parseVal(input.value));
          el.classList.remove("editing");
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            commit();
          }
          if (ev.key === "Escape") {
            el.classList.remove("editing");
            render();
          }
        });
      });
    });
  }
  function renderStore() {
    if (!hook.stores.length) {
      body.innerHTML = '<div class="cvd-empty">No hay store registrado</div>';
      return;
    }
    body.innerHTML = hook.stores.map((entry, si) => {
      const state = entry.getState();
      const keys = Object.keys(state);
      return `
                <div class="cvd-inst open" data-store="${si}">
                    <div class="cvd-inst-head">
                        <span class="cvd-arrow" style="transform:rotate(90deg)">\u25B6</span>
                        <span class="cvd-inst-name" style="color:#ffcb6b">Store</span>
                        <span class="cvd-count">${keys.length} keys</span>
                    </div>
                    <div class="cvd-kv">
                        ${keys.map((k) => `
                            <div class="cvd-row">
                                <span class="cvd-key cvd-store-key">${k}</span>
                                <span class="cvd-val" data-store="${si}" data-key="${k}" title="click to edit">${formatVal(state[k])}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
    }).join("");
    body.querySelectorAll(".cvd-inst-head").forEach((h) => {
      h.addEventListener("click", () => h.closest(".cvd-inst").classList.toggle("open"));
    });
    body.querySelectorAll("[data-store][data-key]").forEach((valEl) => {
      valEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const el = valEl;
        if (el.querySelector("input")) return;
        const si = parseInt(el.dataset.store);
        const key = el.dataset.key;
        const entry = hook.stores[si];
        if (!entry) return;
        const current = formatVal(entry.getState()[key]);
        el.classList.add("editing");
        el.innerHTML = `<input class="cvd-edit" value='${current.replace(/'/g, "&#39;")}'>`;
        const input = el.querySelector("input");
        input.focus();
        input.select();
        const commit = () => {
          entry.setState(key, parseVal(input.value));
          el.classList.remove("editing");
        };
        input.addEventListener("blur", commit);
        input.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            commit();
          }
          if (ev.key === "Escape") {
            el.classList.remove("editing");
            render();
          }
        });
      });
    });
  }
  function render() {
    if (!panelVisible) return;
    if (activeTab === "components") renderComponents();
    else renderStore();
  }
  hook.on("mount", () => render());
  hook.on("update", () => render());
  hook.on("destroy", () => render());
  hook.on("store-update", () => render());
}

// src/ssr.ts
var SSR_ATTR = "data-courvux-ssr";

// src/index.ts
var nextTick = (cb) => cb ? Promise.resolve().then(cb) : Promise.resolve();
function parseVSlot(expr, scope) {
  const t = expr.trim();
  if (t.startsWith("{")) {
    const keys = t.replace(/[{}]/g, "").split(",").map((k) => k.trim()).filter(Boolean);
    return Object.fromEntries(keys.map((k) => [k, scope[k]]));
  }
  return { [t]: scope };
}
var tryClone = (val) => {
  if (val === null || typeof val !== "object") return val;
  try {
    return structuredClone(val);
  } catch {
    return val;
  }
};
async function mount(el, config, appContext) {
  const refs = {};
  const { subscribe, createReactiveState, registerSetInterceptor, notifyAll } = createReactivityScope();
  let rawData;
  if (typeof config.data === "function") {
    if (config.loadingTemplate) el.innerHTML = config.loadingTemplate;
    rawData = await config.data();
  } else {
    rawData = config.data ?? {};
  }
  if (config.templateUrl) {
    const url = appContext.baseUrl ? new URL(config.templateUrl, appContext.baseUrl).href : config.templateUrl;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load template: ${url} (${res.status})`);
    el.innerHTML = await res.text();
  } else if (config.template) {
    el.innerHTML = config.template;
  }
  el.removeAttribute(SSR_ATTR);
  el.querySelector(`[${SSR_ATTR}]`)?.removeAttribute(SSR_ATTR);
  const injected = {};
  if (config.inject && appContext.provided) {
    const injectDefs = Array.isArray(config.inject) ? Object.fromEntries(config.inject.map((k) => [k, k])) : config.inject;
    Object.entries(injectDefs).forEach(([localKey, provideKey]) => {
      if (appContext.provided && provideKey in appContext.provided) {
        injected[localKey] = appContext.provided[provideKey];
      }
    });
  }
  const state = createReactiveState({
    ...appContext.globalProperties ?? {},
    ...rawData,
    ...injected,
    ...config.methods,
    $refs: refs,
    $el: el,
    ...appContext.slots ? { $slots: Object.fromEntries(Object.keys(appContext.slots).map((k) => [k, true])) } : {},
    ...appContext.store ? { $store: appContext.store } : {},
    ...appContext.currentRoute ? { $route: appContext.currentRoute } : {},
    ...appContext.router ? { $router: appContext.router } : {}
  });
  state.$watch = (key, handler, options) => {
    const deep = options?.deep ?? false;
    const immediate = options?.immediate ?? false;
    let oldVal = deep ? tryClone(state[key]) : state[key];
    const unsub = subscribe(key, () => {
      const newVal = state[key];
      handler.call(state, newVal, oldVal);
      oldVal = deep ? tryClone(newVal) : newVal;
    });
    if (immediate) handler.call(state, state[key], void 0);
    return unsub;
  };
  state.$batch = batchUpdate;
  state.$nextTick = (cb) => nextTick(cb);
  state.$dispatch = (eventName, detail, options) => {
    el.dispatchEvent(new CustomEvent(eventName, { bubbles: true, composed: true, ...options ?? {}, detail }));
  };
  if (appContext.magics) {
    Object.entries(appContext.magics).forEach(([key, fn]) => {
      state[key] = fn(state);
    });
  }
  state.$forceUpdate = () => notifyAll();
  const watchEffectStops = [];
  state.$watchEffect = (fn) => {
    let unsubs = [];
    const run = () => {
      unsubs.forEach((u) => u());
      unsubs = [];
      const rawDeps = collectDeps(() => {
        try {
          fn();
        } catch {
        }
      });
      const seen = /* @__PURE__ */ new Map();
      for (const { sub, key: k } of rawDeps) {
        if (!seen.has(sub)) seen.set(sub, /* @__PURE__ */ new Set());
        if (seen.get(sub).has(k)) continue;
        seen.get(sub).add(k);
        unsubs.push(sub(k, run));
      }
    };
    run();
    const stop = () => {
      unsubs.forEach((u) => u());
      unsubs = [];
      const idx = watchEffectStops.indexOf(stop);
      if (idx > -1) watchEffectStops.splice(idx, 1);
    };
    watchEffectStops.push(stop);
    return stop;
  };
  const computedCleanups = [];
  if (config.computed) {
    Object.entries(config.computed).forEach(([key, def]) => {
      const getter = typeof def === "function" ? def : def.get;
      const setter = typeof def !== "function" ? def.set : void 0;
      let unsubs = [];
      const compute = () => {
        unsubs.forEach((u) => u());
        unsubs = [];
        let computedValue;
        const rawDeps = collectDeps(() => {
          try {
            computedValue = getter.call(state);
          } catch {
          }
        });
        state[key] = computedValue;
        const seen = /* @__PURE__ */ new Map();
        for (const { sub, key: k } of rawDeps) {
          if (!seen.has(sub)) seen.set(sub, /* @__PURE__ */ new Set());
          if (seen.get(sub).has(k)) continue;
          seen.get(sub).add(k);
          unsubs.push(sub(k, compute));
        }
      };
      compute();
      computedCleanups.push(() => unsubs.forEach((u) => u()));
      if (setter) registerSetInterceptor(key, (val) => setter.call(state, val));
    });
  }
  const watcherUnsubs = [];
  if (config.watch) {
    Object.entries(config.watch).forEach(([key, watcherDef]) => {
      const isOptions = typeof watcherDef === "object" && watcherDef !== null && "handler" in watcherDef;
      const handler = isOptions ? watcherDef.handler : watcherDef;
      const immediate = isOptions ? watcherDef.immediate ?? false : false;
      const deep = isOptions ? watcherDef.deep ?? false : false;
      let oldVal = deep ? tryClone(state[key]) : state[key];
      const unsub = subscribe(key, () => {
        const newVal = state[key];
        handler.call(state, newVal, oldVal);
        oldVal = deep ? tryClone(newVal) : newVal;
      });
      watcherUnsubs.push(unsub);
      if (immediate) {
        handler.call(state, state[key], void 0);
      }
    });
  }
  const childProvided = { ...appContext.provided ?? {} };
  if (config.provide) {
    const provideMap = typeof config.provide === "function" ? config.provide.call(state) : config.provide;
    Object.assign(childProvided, provideMap);
  }
  const walkContext = {
    ...appContext,
    provided: childProvided,
    components: { ...appContext.components, ...config.components }
  };
  walkContext.mountElement = createMountElement(walkContext);
  walkContext.createChildScope = (inlineData, inlineMethods) => {
    const dataKeys = new Set(Object.keys(inlineData));
    const methodKeys = new Set(Object.keys(inlineMethods));
    const { subscribe: childSub, createReactiveState: childCreate } = createReactivityScope();
    const childReactive = childCreate(inlineData);
    let mergedState;
    mergedState = new Proxy({}, {
      get(_t, key) {
        if (typeof key !== "string") return state[key];
        if (dataKeys.has(key)) return childReactive[key];
        if (methodKeys.has(key)) return inlineMethods[key].bind(mergedState);
        return state[key];
      },
      set(_t, key, value) {
        if (typeof key !== "string") return false;
        if (dataKeys.has(key)) {
          childReactive[key] = value;
          return true;
        }
        state[key] = value;
        return true;
      },
      has(_t, key) {
        return dataKeys.has(key) || methodKeys.has(key) || key in state;
      },
      ownKeys() {
        return [...dataKeys, ...methodKeys, ...Object.keys(state)];
      },
      getOwnPropertyDescriptor(_t, key) {
        const has = dataKeys.has(key) || methodKeys.has(key) || key in state;
        return has ? { configurable: true, enumerable: true, writable: true } : void 0;
      }
    });
    const mergedSub = (key, cb) => {
      if (dataKeys.has(key)) return childSub(key, cb);
      return domSubscribe(key, cb);
    };
    return { state: mergedState, subscribe: mergedSub, cleanup: () => {
    } };
  };
  walkContext.mountDynamic = async (anchor, compExpr, originalEl, parentState, parentContext) => {
    let currentEl = null;
    let currentDestroy = null;
    const fallbackHtml = originalEl.getAttribute("loading-template") ?? "";
    const doRender = async () => {
      currentDestroy?.();
      currentDestroy = null;
      if (currentEl?.parentNode) {
        currentEl.parentNode.removeChild(currentEl);
        currentEl = null;
      }
      const compValue = evaluate(compExpr, parentState);
      if (!compValue) return;
      let config2;
      if (typeof compValue === "function") {
        if (fallbackHtml) {
          const fb = document.createElement("div");
          fb.innerHTML = fallbackHtml;
          anchor.parentNode?.insertBefore(fb, anchor.nextSibling);
          currentEl = fb;
        }
        const mod = await compValue();
        config2 = mod.default;
        if (currentEl?.parentNode) {
          currentEl.parentNode.removeChild(currentEl);
          currentEl = null;
        }
      } else if (typeof compValue === "string") {
        config2 = walkContext.components?.[compValue];
      } else if (compValue && typeof compValue === "object") {
        config2 = compValue;
      }
      if (!config2) return;
      const newEl = document.createElement("div");
      Array.from(originalEl.attributes).forEach((a) => newEl.setAttribute(a.name, a.value));
      newEl.innerHTML = originalEl.innerHTML;
      const props = {};
      const emitHandlers = {};
      Array.from(originalEl.attributes).forEach((attr) => {
        if (attr.name.startsWith(":")) {
          props[attr.name.slice(1)] = evaluate(attr.value, parentState);
        } else if (attr.name.startsWith("@") || attr.name.startsWith("cv:on:")) {
          const handlerName = attr.value;
          const eventName = attr.name.startsWith("@") ? attr.name.slice(1) : attr.name.slice(6);
          emitHandlers[eventName] = (...args) => {
            if (typeof parentState[handlerName] === "function") parentState[handlerName].call(parentState, ...args);
          };
        }
      });
      const configWithProps = {
        ...config2,
        data: { ...config2.data, ...props },
        methods: {
          ...config2.methods,
          $emit(_n, ..._a) {
            validateEmit(config2, _n, _a);
            emitHandlers[_n]?.(..._a);
          }
        }
      };
      const localCtx = { ...walkContext, components: { ...walkContext.components, ...config2.components } };
      localCtx.mountElement = createMountElement(localCtx);
      const result = await mount(newEl, configWithProps, localCtx);
      currentDestroy = result.destroy;
      anchor.parentNode?.insertBefore(newEl, anchor.nextSibling);
      currentEl = newEl;
    };
    subscribeDeps(compExpr, parentContext, doRender);
    await doRender();
  };
  const cleanups = [];
  state.$addCleanup = (fn) => {
    cleanups.push(fn);
  };
  let _updatePending = false;
  const domSubscribe = (key, cb) => {
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
  try {
    config.onBeforeMount?.call(state);
    await walk(el, state, { subscribe: domSubscribe, refs, ...walkContext, registerCleanup: (c) => cleanups.push(c) });
    el.removeAttribute("cv-cloak");
    config.onMount?.call(state);
  } catch (err) {
    if (config.onError) {
      el.removeAttribute("cv-cloak");
      config.onError.call(state, err);
    } else if (appContext.errorHandler) {
      el.removeAttribute("cv-cloak");
      appContext.errorHandler(err, state, config.name ?? el.tagName.toLowerCase());
    } else {
      throw err;
    }
  }
  const devtools = typeof window !== "undefined" ? window.__COURVUX_DEVTOOLS__ : void 0;
  const devId = devtools ? nextDevToolsId() : 0;
  if (devtools) {
    const s = state;
    const updateListeners = /* @__PURE__ */ new Set();
    const devInstance = {
      id: devId,
      name: config.name ?? el.tagName.toLowerCase(),
      el,
      getState: () => {
        const snap = {};
        for (const k of Object.keys(s)) {
          if (k.startsWith("$") || typeof s[k] === "function") continue;
          try {
            snap[k] = s[k];
          } catch {
          }
        }
        return snap;
      },
      setState: (key, value) => {
        s[key] = value;
      },
      subscribe: (cb) => {
        updateListeners.add(cb);
        return () => updateListeners.delete(cb);
      },
      children: []
    };
    Object.keys(s).filter((k) => !k.startsWith("$") && typeof s[k] !== "function").forEach((k) => {
      subscribe(k, () => {
        devtools._emit("update", devInstance);
        updateListeners.forEach((cb) => cb());
      });
    });
    devtools._registerInstance(devInstance);
    cleanups.push(() => devtools._unregisterInstance(devId));
  }
  return {
    state,
    destroy: () => {
      config.onBeforeUnmount?.call(state);
      computedCleanups.forEach((c) => c());
      watcherUnsubs.forEach((u) => u());
      watchEffectStops.forEach((s) => s());
      cleanups.forEach((c) => c());
      config.onDestroy?.call(state);
    },
    activate: () => {
      config.onActivated?.call(state);
    },
    deactivate: () => {
      config.onDeactivated?.call(state);
    },
    beforeLeave: config.onBeforeRouteLeave ? (to, next) => config.onBeforeRouteLeave.call(state, to, next) : void 0,
    enter: config.onBeforeRouteEnter ? (from) => config.onBeforeRouteEnter.call(state, from) : void 0
  };
}
function validateEmit(config, eventName, args) {
  if (!config.emits || Array.isArray(config.emits)) return;
  const validator = config.emits[eventName];
  if (typeof validator === "function" && !validator(...args)) {
    console.warn(`[courvux] emit "${eventName}": validator returned false`);
  }
}
function createMountElement(appContext) {
  return async (el, tagName, parentState, parentContext) => {
    const componentConfig = appContext.components[tagName];
    const compRefName = el.getAttribute("cv-ref");
    if (compRefName) el.removeAttribute("cv-ref");
    const props = {};
    const propBindings = [];
    const emitHandlers = {};
    Array.from(el.attributes).filter((a) => a.name === "cv-model" || a.name.startsWith("cv-model.") || a.name.startsWith("cv-model:")).forEach((cvModelAttr) => {
      el.removeAttribute(cvModelAttr.name);
      const modelExpr = cvModelAttr.value;
      const colonIdx = cvModelAttr.name.indexOf(":");
      const propName = colonIdx >= 0 ? cvModelAttr.name.slice(colonIdx + 1).split(".")[0] : "modelValue";
      const emitEvent = propName === "modelValue" ? "update:modelValue" : `update:${propName}`;
      props[propName] = evaluate(modelExpr, parentState);
      propBindings.push({ propName, expr: modelExpr });
      emitHandlers[emitEvent] = (newVal) => {
        setStateValue(modelExpr, parentState, newVal);
      };
    });
    const $attrs = {};
    Array.from(el.attributes).forEach((attr) => {
      const isBinding = attr.name.startsWith(":");
      const isEvent = attr.name.startsWith("@") || attr.name.startsWith("cv:on:");
      const isCvModel = attr.name === "cv-model" || attr.name.startsWith("cv-model.") || attr.name.startsWith("cv-model:");
      const isVSlot = attr.name.startsWith("v-slot");
      const isSlot = attr.name === "slot";
      if (!isBinding && !isEvent && !isCvModel && !isVSlot && !isSlot) {
        $attrs[attr.name] = attr.value;
      }
    });
    if (componentConfig.inheritAttrs === false) {
      Object.keys($attrs).forEach((k) => el.removeAttribute(k));
    }
    Array.from(el.attributes).forEach((attr) => {
      if (attr.name.startsWith(":")) {
        const propName = attr.name.slice(1);
        const expr = attr.value;
        props[propName] = evaluate(expr, parentState);
        propBindings.push({ propName, expr });
      } else if (attr.name.startsWith("@") || attr.name.startsWith("cv:on:")) {
        const eventName = attr.name.startsWith("@") ? attr.name.slice(1) : attr.name.slice(6);
        const handlerName = attr.value;
        emitHandlers[eventName] = (...args) => {
          if (typeof parentState[handlerName] === "function") {
            parentState[handlerName].call(parentState, ...args);
          }
        };
      }
    });
    const defaultVSlot = el.getAttribute("v-slot") ?? el.getAttribute("v-slot:default");
    if (defaultVSlot) {
      el.removeAttribute("v-slot");
      el.removeAttribute("v-slot:default");
    }
    const namedSlots = /* @__PURE__ */ new Map();
    const defaultSlotNodes = [];
    Array.from(el.childNodes).forEach((n) => {
      const slotName = n.nodeType === 1 ? n.getAttribute("slot") : null;
      if (slotName) {
        if (!namedSlots.has(slotName)) {
          const namedVSlot = el.getAttribute(`v-slot:${slotName}`) ?? null;
          if (namedVSlot) el.removeAttribute(`v-slot:${slotName}`);
          namedSlots.set(slotName, { nodes: [], vSlot: namedVSlot });
        }
        namedSlots.get(slotName).nodes.push(n.cloneNode(true));
      } else {
        defaultSlotNodes.push(n.cloneNode(true));
      }
    });
    const slots = {};
    if (defaultSlotNodes.some((n) => n.nodeType === 1 || n.nodeType === 3 && (n.textContent?.trim() ?? "") !== "")) {
      slots["default"] = async (scope) => {
        const slotState = defaultVSlot ? { ...parentState, ...parseVSlot(defaultVSlot, scope) } : parentState;
        const frag = document.createDocumentFragment();
        defaultSlotNodes.forEach((n) => frag.appendChild(n.cloneNode(true)));
        await walk(frag, slotState, parentContext);
        return Array.from(frag.childNodes);
      };
    }
    for (const [name, { nodes, vSlot }] of namedSlots) {
      slots[name] = async (scope) => {
        const slotState = vSlot ? { ...parentState, ...parseVSlot(vSlot, scope) } : parentState;
        const frag = document.createDocumentFragment();
        nodes.forEach((n) => frag.appendChild(n.cloneNode(true)));
        await walk(frag, slotState, parentContext);
        return Array.from(frag.childNodes);
      };
    }
    const localContext = {
      ...appContext,
      components: { ...appContext.components, ...componentConfig.components },
      slots
    };
    localContext.mountElement = createMountElement(localContext);
    const configWithProps = {
      ...componentConfig,
      data: { ...componentConfig.data, ...props, $attrs, $parent: parentState },
      methods: {
        ...componentConfig.methods,
        $emit(_eventName, ..._args) {
          validateEmit(componentConfig, _eventName, _args);
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
function createApp(config) {
  injectCloakStyle();
  const devtools = typeof window !== "undefined" ? setupDevTools() : void 0;
  const plugins = [];
  const directives = { ...config.directives };
  const globalComponents = { ...config.components ?? {} };
  const destroyFns = [];
  const mountRegistry = /* @__PURE__ */ new Map();
  const globalProvided = {};
  const magics = /* @__PURE__ */ new Map();
  if (config.debug && devtools) mountDevOverlay(devtools);
  if (devtools && config.store) {
    const store = config.store;
    const storeKeys = Object.keys(store).filter((k) => typeof store[k] !== "function");
    const storeEntry = {
      getState() {
        const snap = {};
        storeKeys.forEach((k) => {
          try {
            snap[k] = store[k];
          } catch {
          }
        });
        return snap;
      },
      setState(key, value) {
        store[key] = value;
      },
      subscribe(cb) {
        const unsubs = storeKeys.map((k) => {
          try {
            return subscribeToStore(store, k, cb);
          } catch {
            return () => {
            };
          }
        });
        return () => unsubs.forEach((u) => u());
      }
    };
    devtools._registerStore(storeEntry);
  }
  const app = {
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
    component(name, cfg) {
      globalComponents[name] = cfg;
      return app;
    },
    provide(keyOrObj, value) {
      if (typeof keyOrObj === "string") {
        globalProvided[keyOrObj] = value;
      } else {
        Object.assign(globalProvided, keyOrObj);
      }
      return app;
    },
    magic(name, fn) {
      magics.set(`$${name}`, fn);
      return app;
    },
    mount: async (selector) => {
      await _mount(selector);
      return app;
    },
    mountAll: async (selector = "[data-courvux]") => {
      const els = Array.from(document.querySelectorAll(selector));
      await Promise.all(els.map((el) => _mountEl(el)));
      return app;
    },
    mountEl: async (el) => _mountEl(el),
    unmount(selector) {
      if (!selector) {
        destroyFns.forEach((fn) => fn());
        destroyFns.length = 0;
        mountRegistry.clear();
      } else {
        const el = document.querySelector(selector);
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
      destroyFns.forEach((fn) => fn());
      destroyFns.length = 0;
      mountRegistry.clear();
    }
  };
  const _mountEl = async (root) => {
    const baseUrl = new URL(".", document.baseURI).href;
    const appContext = {
      components: globalComponents,
      router: config.router,
      store: config.store,
      directives,
      baseUrl,
      provided: { ...globalProvided },
      errorHandler: config.errorHandler,
      globalProperties: config.globalProperties,
      magics: magics.size ? Object.fromEntries(magics) : void 0
    };
    appContext.mountElement = createMountElement(appContext);
    if (config.router) {
      const router = config.router;
      appContext.mountRouterView = async (el, name) => {
        await new Promise((resolve2) => {
          setupRouterView(el, router, async (el2, cfg, route, layout, childRouter) => {
            const routeContext = { ...appContext, currentRoute: route };
            if (childRouter) {
              let innerCleanup = null;
              const ctxWithChild = {
                ...routeContext,
                mountRouterView: async (innerEl, innerName) => {
                  innerCleanup = setupRouterView(innerEl, childRouter, async (innerEl2, innerCfg, innerRoute, innerLayout) => {
                    const innerCtx = { ...routeContext, currentRoute: innerRoute };
                    if (innerLayout) {
                      let innerCmpResult = null;
                      const innerLayoutCtx = {
                        ...innerCtx,
                        mountRouterView: async (deepEl, _deepName) => {
                          innerCmpResult = await mount(deepEl, innerCfg, innerCtx);
                        }
                      };
                      const { destroy: ld } = await mount(innerEl2, { template: innerLayout }, innerLayoutCtx);
                      return {
                        destroy: () => {
                          innerCmpResult?.destroy();
                          ld();
                        },
                        activate: () => innerCmpResult?.activate(),
                        deactivate: () => innerCmpResult?.deactivate()
                      };
                    } else {
                      return await mount(innerEl2, innerCfg, innerCtx);
                    }
                  }, innerName);
                }
              };
              if (layout) {
                let cmpResult = null;
                const layoutCtx = {
                  ...ctxWithChild,
                  mountRouterView: async (innerEl, _innerName) => {
                    cmpResult = await mount(innerEl, cfg, ctxWithChild);
                  }
                };
                const { destroy: ld } = await mount(el2, { template: layout }, layoutCtx);
                return {
                  destroy: () => {
                    innerCleanup?.();
                    cmpResult?.destroy();
                    ld();
                  },
                  activate: () => cmpResult?.activate(),
                  deactivate: () => cmpResult?.deactivate()
                };
              } else {
                const result2 = await mount(el2, cfg, ctxWithChild);
                return {
                  destroy: () => {
                    innerCleanup?.();
                    result2.destroy();
                  },
                  activate: () => result2.activate(),
                  deactivate: () => result2.deactivate()
                };
              }
            } else {
              if (layout) {
                let cmpResult = null;
                const layoutContext = {
                  ...routeContext,
                  mountRouterView: async (innerEl, _innerName) => {
                    cmpResult = await mount(innerEl, cfg, routeContext);
                  }
                };
                const { destroy: layoutDestroy } = await mount(el2, { template: layout }, layoutContext);
                return {
                  destroy: () => {
                    cmpResult?.destroy();
                    layoutDestroy();
                  },
                  activate: () => cmpResult?.activate(),
                  deactivate: () => cmpResult?.deactivate()
                };
              } else {
                return await mount(el2, cfg, routeContext);
              }
            }
          }, name, resolve2);
        });
      };
    }
    const result = await mount(root, config, appContext);
    destroyFns.push(result.destroy);
    mountRegistry.set(root, result.destroy);
    return result.state;
  };
  const _mount = async (selector) => {
    const root = document.querySelector(selector);
    if (!root) return;
    return _mountEl(root);
  };
  return app;
}

// src/test-utils.ts
async function mount2(config, options = {}) {
  const el = document.createElement("div");
  const container = options.attachTo ?? document.body;
  container.appendChild(el);
  const mergedConfig = {
    ...options.global,
    ...config,
    data: { ...config.data, ...options.data ?? {} }
  };
  const app = createApp(mergedConfig);
  const state = await app.mountEl(el);
  return {
    el,
    get state() {
      return state;
    },
    html: () => el.innerHTML,
    text: () => el.textContent?.trim() ?? "",
    find: (sel) => el.querySelector(sel),
    findAll: (sel) => Array.from(el.querySelectorAll(sel)),
    trigger: async (target, event, opts = {}) => {
      const targetEl = typeof target === "string" ? el.querySelector(target) : target;
      if (!targetEl) return;
      targetEl.dispatchEvent(new Event(event, { bubbles: true, cancelable: true, ...opts }));
      await Promise.resolve();
      await Promise.resolve();
    },
    nextTick: () => new Promise((r) => setTimeout(r, 0)),
    destroy: () => {
      app.destroy();
      el.parentNode?.removeChild(el);
    }
  };
}
export {
  mount2 as mount
};
