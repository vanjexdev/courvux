import { createApp } from 'courvux';

const STORAGE_KEY = 'courvux-todos';
const loadTodos = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
    catch { return []; }
};

createApp({
    data: {
        todos: loadTodos(),
        newTodo: '',
        filter: 'all',
        editingId: null,
        editText: '',
        _nextId: Date.now(),
    },
    computed: {
        filteredTodos() {
            if (this.filter === 'active')    return this.todos.filter(t => !t.done);
            if (this.filter === 'completed') return this.todos.filter(t => t.done);
            return this.todos;
        },
        remaining() { return this.todos.filter(t => !t.done).length; },
        allDone()   { return this.todos.length > 0 && this.todos.every(t => t.done); },
    },
    watch: {
        todos: {
            deep: true,
            handler(val) { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)); }
        }
    },
    methods: {
        add() {
            const text = this.newTodo.trim();
            if (!text) return;
            this.todos = [...this.todos, { id: this._nextId++, text, done: false }];
            this.newTodo = '';
        },
        toggle(id)        { this.todos = this.todos.map(t => t.id === id ? { ...t, done: !t.done } : t); },
        remove(id)        { this.todos = this.todos.filter(t => t.id !== id); },
        toggleAll()       { const d = this.allDone; this.todos = this.todos.map(t => ({ ...t, done: !d })); },
        clearCompleted()  { this.todos = this.todos.filter(t => !t.done); },
        startEdit(todo)   {
            this.editingId = todo.id;
            this.editText  = todo.text;
            this.$nextTick(() => this.$refs['edit_' + todo.id]?.focus());
        },
        commitEdit(id) {
            const text = this.editText.trim();
            if (text) this.todos = this.todos.map(t => t.id === id ? { ...t, text } : t);
            else      this.remove(id);
            this.editingId = null;
            this.editText  = '';
        },
        cancelEdit() { this.editingId = null; this.editText = ''; },
        setFilter(f) { this.filter = f; },
    },
    template: `
        <section class="todoapp">
            <header>
                <h1>todos</h1>
                <input class="new-todo"
                       cv-model.trim="newTodo"
                       @keydown.enter="add()"
                       placeholder="What needs to be done?" />
            </header>

            <section cv-if="todos.length > 0" class="main">
                <input id="toggle-all" type="checkbox"
                       :checked="allDone" @change="toggleAll()" />
                <label for="toggle-all">Mark all as complete</label>

                <ul class="todo-list">
                    <li cv-for="todo in filteredTodos" :key="todo.id"
                        :class="{ completed: todo.done, editing: editingId === todo.id }">
                        <div cv-if="editingId !== todo.id" class="view">
                            <input class="toggle" type="checkbox"
                                   :checked="todo.done" @change="toggle(todo.id)" />
                            <label @dblclick="startEdit(todo)">{{ todo.text }}</label>
                            <button class="destroy" @click="remove(todo.id)"></button>
                        </div>
                        <input cv-if="editingId === todo.id"
                               class="edit"
                               :cv-ref="'edit_' + todo.id"
                               cv-model="editText"
                               @keydown.enter="commitEdit(todo.id)"
                               @keydown.esc="cancelEdit()"
                               @blur="commitEdit(todo.id)" />
                    </li>
                </ul>
            </section>

            <footer cv-if="todos.length > 0" class="footer">
                <span class="todo-count">
                    <strong>{{ remaining }}</strong>
                    item{{ remaining === 1 ? '' : 's' }} left
                </span>
                <ul class="filters">
                    <li><a :class="{ selected: filter === 'all' }"       @click="setFilter('all')">All</a></li>
                    <li><a :class="{ selected: filter === 'active' }"    @click="setFilter('active')">Active</a></li>
                    <li><a :class="{ selected: filter === 'completed' }" @click="setFilter('completed')">Completed</a></li>
                </ul>
                <button class="clear-completed"
                        cv-show="todos.some(t => t.done)"
                        @click="clearCompleted()">Clear completed</button>
            </footer>
        </section>
    `,
}).mount('#app');
