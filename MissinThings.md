# Courvux — Roadmap & Known Bugs

---

## ✅ Bugs Resueltos

| Bug | Archivo | Fix |
|---|---|---|
| Nested routes con parent path `/` no cargaban hijos | `src/router.ts` → `matchRoutePrefix()` | Caso especial: `pattern === '/'` retorna `path` completo como `remaining` |
| `cv-model` no funcionaba en `contenteditable` | `src/dom.ts` → rama cv-model | Detectar `hasAttribute('contenteditable')`, leer/escribir `innerText` |

---

## Fase 1 — Medio impacto / Esfuerzo bajo

### ✅ 1. `$router.back()` / `$router.replace()` / `$router.forward()`

**Estado:** resuelto

**Qué falta:**
- `navigate()` solo hace `pushState`. No hay `replaceState` (navegar sin agregar al historial), ni `back()` / `forward()` que llamen a `history.back/forward`.
- Casos de uso: login redirect sin que el usuario pueda volver con el botón atrás, wizard steps, etc.

**Scope:**
- Agregar `replace(path)`, `back()`, `forward()` al objeto `Router`
- Exponer en `$router` dentro de componentes

---

### 2. Async components con fallback (Suspense básico)

**Estado:** pendiente

**Qué falta:**
- `<component :is="LazyComp">` muestra nada mientras carga. Falta slot de fallback visible.
- Propuesta: atributo `loading-template` en `<component>` o config `fallback` en la definición del componente lazy.

**Scope:**
- Detectar componente async en `mountDynamic`
- Mostrar fallback HTML mientras el import resuelve
- Reemplazar fallback con componente real al montar

---

### ✅ 3. `cv-model` en `contenteditable`

**Estado:** resuelto

**Qué falta:**
- `cv-model` solo maneja `input`, `textarea`, `select`, `checkbox`, `radio`.
- `contenteditable` usa evento `input` pero `element.value` no existe — hay que leer `element.innerText` o `element.innerHTML`.

**Scope:**
- En el branch de `cv-model` en `dom.ts`, detectar `element.hasAttribute('contenteditable')`
- Bind en `input` leyendo `innerText`
- Actualizar el DOM con `innerText = value` en vez de `.value`

---

## Fase 2 — Alto impacto / Esfuerzo medio

### ✅ 4. Múltiples instancias `createApp` (islas reactivas)

**Estado:** resuelto

**Qué falta:**
- Hoy `createApp` asume una sola raíz. Para MPA / WordPress / páginas server-rendered se necesitan múltiples islas independientes en la misma página.
- Cada isla tiene su propio estado, store local, y ciclo de vida.

**Scope:**
- `createApp()` debe poder llamarse N veces con distintos selectores
- Asegurar que stores y provided no se filtren entre islas
- Documentar patrón de isla con `data-courvux` o selector explícito

---

### ✅ 5. `cv-for` con diffing por `:key`

**Estado:** resuelto

**Qué falta:**
- Hoy cualquier cambio en la lista destruye y re-crea todos los nodos DOM.
- Con `:key` definido, el runtime puede mapear nodos existentes → mover/patchear en lugar de recrear.
- Impacto real en listas largas (>50 items), inputs dentro de listas, animaciones.

**Scope:**
- Al re-render de `cv-for`, comparar keys anterior vs nueva lista
- Reusar nodos DOM cuya key no cambió (mover en DOM)
- Solo crear/destruir nodos nuevos/eliminados
- Warn en consola si `:key` produce duplicados (ya existe, mantener)

---

### ✅ 6. `subscribeExpr` con `collectDeps` real

**Estado:** resuelto

**Qué falta:**
- `subscribeDeps` usa regex para extraer identificadores de la expresión. Falla con expresiones complejas: ternarios anidados, optional chaining, computed keys.
- `collectDeps` ya existe en `reactivity.ts` y funciona correctamente por ejecución real.

**Scope:**
- Reemplazar el regex extractor en `subscribeDeps` por `collectDeps(() => evaluate(expr, state))`
- Unsubscribir deps anteriores en cada re-evaluación (igual que computed)
- Beneficio: reactivity correcta en cualquier expresión arbitraria

---

## Fase 3 — Ambicioso / Esfuerzo alto

### ✅ 7. Plugin de Vite — compilador de templates (fase 1)

**Estado:** resuelto (inline templateUrl)

**Qué hace:**
- `plugin/vite-plugin-courvux.js` — reemplaza `templateUrl: './foo.html'` con `template: \`...\`` en build time.
- Elimina los `fetch()` de runtime; HTML inlinado en el bundle.
- Archivos HTML vigilados para HMR en modo dev.

**Pendiente (fase 2):**
- Compilación de expresiones `{{ expr }}` a funciones JS puras para eliminar `unsafe-eval` CSP.
- Requiere un parser de expresiones completo (scope futuro).

---

### ✅ 8. SSR básico (Node.js)

**Estado:** resuelto (base)

**Qué hace:**
- `src/ssr.ts` → `renderToString(config, { data? })` — renderiza a string en Node.js con jsdom.
- Inyecta `data-courvux-ssr="true"` en el elemento raíz del output.
- `mount()` detecta el atributo y salta el paso `innerHTML` (hidratación: solo conecta reactividad al DOM existente).

**Requisito:** jsdom o happy-dom como peer dep en el servidor. Ver docs en `src/ssr.ts`.

---

### ✅ 9. DevTools (hook global)

**Estado:** resuelto (hook + inspector en demo app)

**Qué hace:**
- `src/devtools.ts` → `setupDevTools()` — inicializa `window.__COURVUX_DEVTOOLS__` automáticamente al llamar `createApp()`.
- Expone `instances[]`, `on('mount'|'update'|'destroy', cb)`, `getState()`, `setState()` por instancia.
- Demo en `/devtools` — inspector visual del árbol, edición de estado en caliente, log de eventos.

**Pendiente:** extensión Chrome/Firefox que se conecta al hook (scope futuro independiente).

---
