export const selectTodos = (state) => state.todos.items;
export const selectFilter = (state) => state.todos.filter;
export const selectIsAddingTodo = (state) => state.todos.isAddingTodo;
export const selectEditingId = (state) => state.todos.editingId;
export const selectSearchQuery = (state) => state.todos.searchQuery;
export const selectDarkMode = (state) => state.todos.darkMode;
export const selectSortBy = (state) => state.todos.sortBy;

// Filter and search todos
export const selectFilteredAndSearchedTodos = (state) => {
    let todos = state.todos.items;
    const filter = state.todos.filter;
    const searchQuery = state.todos.searchQuery.toLowerCase();
    const sortBy = state.todos.sortBy;

    // Apply filter
    switch(filter) {
        case "active":
            todos = todos.filter((todo) => !todo.completed);
            break;
        case "completed":
            todos = todos.filter((todo) => todo.completed);
            break;
        case "high":
            todos = todos.filter((todo) => todo.priority === "high");
            break;
        case "medium":
            todos = todos.filter((todo) => todo.priority === "medium");
            break;
        case "low":
            todos = todos.filter((todo) => todo.priority === "low");
            break;
        default:
            break;
    }

    // Apply search
    if (searchQuery) {
        todos = todos.filter((todo) =>
            todo.text.toLowerCase().includes(searchQuery) ||
            (todo.notes && todo.notes.toLowerCase().includes(searchQuery))
        );
    }

    // Apply sorting
    const sortedTodos = [...todos];
    switch(sortBy) {
        case "priority":
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            sortedTodos.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
            break;
        case "name":
            sortedTodos.sort((a, b) => a.text.localeCompare(b.text));
            break;
        case "date":
            sortedTodos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        default:
            break;
    }

    return sortedTodos;
}

export const selectFilteredTodos = (state) => {
    const todos = state.todos.items;
    const filter = state.todos.filter;

    switch(filter) {
        case "active":
            return todos.filter((todo) => !todo.completed);
        case "completed":
            return todos.filter((todo) => todo.completed);
        default:
            return todos;
    }
}

export const selectTodoStats = (state) => {
    const todos = state.todos.items;
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const active = total - completed;
    const percentCompleted = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Priority breakdown
    const highPriority = todos.filter((todo) => !todo.completed && todo.priority === "high").length;
    const mediumPriority = todos.filter((todo) => !todo.completed && todo.priority === "medium").length;
    const lowPriority = todos.filter((todo) => !todo.completed && todo.priority === "low").length;
    
    // Overdue todos
    const overdue = todos.filter((todo) => {
        if (!todo.dueDate || todo.completed) return false;
        return new Date(todo.dueDate) < new Date();
    }).length;

    return {todos, total, completed, active, percentCompleted, highPriority, mediumPriority, lowPriority, overdue}
}