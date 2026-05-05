import { createApp } from 'courvux';

const STORAGE_KEY = 'courvux-kanban-v1';

const defaultBoard = () => ({
    columns: [
        { key: 'backlog',  title: 'Backlog' },
        { key: 'progress', title: 'In Progress' },
        { key: 'done',     title: 'Done' },
    ],
    cards: [
        { id: 1, col: 'backlog',  text: 'Sketch domain model' },
        { id: 2, col: 'backlog',  text: 'Wire authentication' },
        { id: 3, col: 'progress', text: 'Drag-and-drop polish' },
        { id: 4, col: 'done',     text: 'Project skeleton' },
    ],
    nextId: 5,
    draft: { backlog: '', progress: '', done: '' },
});

const loadBoard = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultBoard();
        const saved = JSON.parse(raw);
        return { ...defaultBoard(), ...saved, draft: { backlog: '', progress: '', done: '' } };
    } catch { return defaultBoard(); }
};

const saveBoard = (state) => {
    try {
        const { cards, nextId, columns } = state;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ cards, nextId, columns }));
    } catch { /* quota / private mode — ignore */ }
};

createApp({
    data: {
        ...loadBoard(),
        dragId: null,
        dragFrom: null,
        editingId: null,
    },
    computed: {
        cardsByColumn() {
            const map = {};
            for (const col of this.columns) map[col.key] = [];
            for (const card of this.cards) {
                if (map[card.col]) map[card.col].push(card);
            }
            return map;
        },
    },
    watch: {
        cards:  { handler() { saveBoard(this); }, deep: true },
        nextId: { handler() { saveBoard(this); } },
    },
    methods: {
        addCard(colKey) {
            const text = (this.draft[colKey] || '').trim();
            if (!text) return;
            this.cards.push({ id: this.nextId, col: colKey, text });
            this.nextId++;
            this.draft = { ...this.draft, [colKey]: '' };
        },
        removeCard(id) {
            const i = this.cards.findIndex(c => c.id === id);
            if (i >= 0) this.cards.splice(i, 1);
        },
        startEdit(id) { this.editingId = id; },
        commitEdit(id, ev) {
            const text = ev.target.value.trim();
            if (text) {
                const card = this.cards.find(c => c.id === id);
                if (card) card.text = text;
            } else {
                this.removeCard(id);
            }
            this.editingId = null;
        },
        // Drag & drop — HTML5 native API. We reorder by mutating `cards`
        // in place; the keyed `cv-for` reuses DOM nodes for unchanged rows.
        onDragStart(id, fromCol, ev) {
            this.dragId = id;
            this.dragFrom = fromCol;
            ev.dataTransfer.effectAllowed = 'move';
            ev.dataTransfer.setData('text/plain', String(id));
        },
        onDragEnd() { this.dragId = null; this.dragFrom = null; },
        onColDragOver(ev) { ev.preventDefault(); ev.dataTransfer.dropEffect = 'move'; },
        onColDrop(toCol) {
            if (this.dragId == null) return;
            const card = this.cards.find(c => c.id === this.dragId);
            if (!card) return;
            // If dropped on the column body (not on a card), append to end.
            const fromIdx = this.cards.indexOf(card);
            this.cards.splice(fromIdx, 1);
            card.col = toCol;
            this.cards.push(card);
            this.dragId = null; this.dragFrom = null;
        },
        onCardDrop(targetId, ev) {
            ev.stopPropagation();
            if (this.dragId == null || this.dragId === targetId) return;
            const dragged = this.cards.find(c => c.id === this.dragId);
            const target  = this.cards.find(c => c.id === targetId);
            if (!dragged || !target) return;
            // Move dragged into target's column at target's position.
            this.cards.splice(this.cards.indexOf(dragged), 1);
            dragged.col = target.col;
            this.cards.splice(this.cards.indexOf(target), 0, dragged);
            this.dragId = null; this.dragFrom = null;
        },
        clearAll() {
            if (!confirm('Clear all cards?')) return;
            this.cards = [];
            this.nextId = 1;
        },
    },
}).mount('#app');
