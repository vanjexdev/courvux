# 06 — Kanban (real-world)

Three-column drag-and-drop board with inline editing, persisted to `localStorage`. Single ES module, no bundler. ~115 lines of JS, ~75 lines of template.

## Run

```bash
npx serve .
```

Open http://localhost:3000/examples/06-realworld-kanban/

## What it shows

- **Reactive arrays under heavy mutation** — `splice`/`push` for drag-reorder and column moves trigger keyed `cv-for` updates that reuse DOM nodes for unchanged cards.
- **Computed grouping** — `cardsByColumn` derives a `{ colKey → cards[] }` map from a flat `cards` array. Cheap because the framework only re-evaluates when `cards` mutates.
- **Deep `watch` for persistence** — `watch.cards` with `deep: true` writes to `localStorage` after every change. No `cvStorage` here on purpose: it would fight the component's reactive scope on nested mutations. See `useCounter` in `examples/05-composables/` for a simpler reactive object.
- **Inline editing** — `cv-if/cv-else` swaps a `<span>` for an `<input cv-focus>` on double-click; commit on Enter or blur, delete the card if the input is left empty.
- **HTML5 native drag-and-drop** — `@dragstart` / `@dragover.prevent` / `@drop` on cards and columns. Reorder within a column, move between columns, drop on the column body to append.
- **`@submit.prevent`** with `cv-model` for the per-column "add card" form.

## Code

| File | Purpose |
|---|---|
| `index.html` | Shell, styles, full template |
| `main.js`    | App data + computed + watch + drag/drop methods |
