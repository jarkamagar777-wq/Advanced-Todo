import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
    filter: "all",
    isAddingTodo: false,
    editingId: null,
    searchQuery: "",
    darkMode: false,
    sortBy: "date", // "date", "priority", "name"
}

const todoSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        // Toggle add todo form visibility
        setIsAddingTodo: (state, action) => {
            state.isAddingTodo = action.payload;
            if (!action.payload) {
                state.editingId = null;
            }
        },

        // Set which todo is being edited
        setEditingId: (state, action) => {
            state.editingId = action.payload;
        },

        // Add a new todo with priority and due date
        addTodo: (state, action) => {
            const { text, priority = "medium", dueDate = null, notes = "" } = action.payload;
            const newTodo = {
                id: Date.now(),
                text,
                notes,
                completed: false,
                priority, // "low", "medium", "high"
                dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            state.items.push(newTodo);
            state.isAddingTodo = false;
            state.editingId = null;
        },

        // Delete a todo by ID
        deleteTodo: (state, action) => {
            state.items = state.items.filter(
                (todo) => todo.id !== action.payload
            );
        },

        // Update a todo's text, priority, dueDate, notes
        updateTodo: (state, action) => {
            const { id, text, priority, dueDate, notes } = action.payload;
            const todo = state.items.find((t) => t.id === id);
            if (todo) {
                if (text !== undefined) todo.text = text;
                if (priority !== undefined) todo.priority = priority;
                if (dueDate !== undefined) todo.dueDate = dueDate;
                if (notes !== undefined) todo.notes = notes;
                todo.updatedAt = new Date().toISOString();
            }
            state.isAddingTodo = false;
            state.editingId = null;
        },

        // Toggle todo completed status
        toggleTodo: (state, action) => {
            const todo = state.items.find((t) => t.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
                todo.updatedAt = new Date().toISOString();
            }
        },

        // Set filter (all, active, completed)
        setFilter: (state, action) => {
            state.filter = action.payload;
        },

        // Set search query
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },

        // Toggle dark mode
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },

        // Set sort order
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
        },

        // Clear all completed todos
        clearCompleted: (state) => {
            state.items = state.items.filter((todo) => !todo.completed);
        },

        // Mark all todos as completed
        markAllCompleted: (state) => {
            state.items.forEach((todo) => {
                todo.completed = true;
                todo.updatedAt = new Date().toISOString();
            });
        },

        // Load todos from localStorage
        loadTodos: (state, action) => {
            state.items = action.payload;
        },
    },
})

export const {
    setIsAddingTodo,
    setEditingId,
    addTodo,
    deleteTodo,
    updateTodo,
    toggleTodo,
    setFilter,
    setSearchQuery,
    setDarkMode,
    setSortBy,
    clearCompleted,
    markAllCompleted,
    loadTodos,
} = todoSlice.actions;

export default todoSlice.reducer; 