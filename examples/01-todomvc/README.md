# 01 — TodoMVC

The classic [TodoMVC](https://todomvc.com) reference app, written in Courvux.

## Run

No build step. From the repo root:

```bash
npx serve .
```

Open http://localhost:3000/examples/01-todomvc/

The page uses an import map pointing at `../../dist/index.js`, so as long as the framework's `dist/` is present (it is — committed), the example runs as-is.

## What it shows

- **Reactive state with `data`**: `todos`, `newTodo`, `filter`, edit-mode tracking.
- **`computed` properties**: `filteredTodos`, `remaining`, `allDone` re-run only when their deps change.
- **Deep `watch`**: persists every mutation to `localStorage` automatically.
- **Keyed `cv-for`**: `:key="todo.id"` enables stable reordering and minimal DOM diffing.
- **Dynamic `:cv-ref`**: `:cv-ref="'edit_' + todo.id"` creates a per-row ref so the edit input can be focused on demand.
- **`cv-model.trim`**: trim modifier strips whitespace.
- **Key modifiers on events**: `@keydown.enter`, `@keydown.esc`.
- **Conditional rendering**: `cv-if` for view/edit modes, `cv-show` for the "Clear completed" button.
- **`$nextTick` for focus**: after switching to edit mode, focus the new input on the next DOM flush.

## Code

| File | Purpose |
|---|---|
| `index.html` | Page shell + import map |
| `main.js`    | The component (data, computed, watch, methods, template) |
| `style.css`  | TodoMVC styling |
