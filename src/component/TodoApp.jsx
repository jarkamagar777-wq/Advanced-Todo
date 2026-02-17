// Importing icons from lucide-react library
import { CheckCircle2, Circle, Filter, Plus, Trash2, Moon, Sun, Zap } from "lucide-react";

// Importing React (needed for JSX)
import React, { useEffect } from "react";

// Importing child components
import TodoFilters from "./TodoFilters";
import TodoForm from "./TodoForm";
import TodoItems from "./TodoItems";

// Importing Redux selectors (these read data from the store)
import {
  selectTodoStats,
  selectFilter,
  selectFilteredAndSearchedTodos,
  selectIsAddingTodo,
  selectTodos,
  selectDarkMode,
} from "../store/selector";

// useSelector lets us read data from Redux store, useDispatch lets us dispatch actions
import { useSelector, useDispatch } from "react-redux";
import {
  setIsAddingTodo,
  clearCompleted,
  markAllCompleted,
  setDarkMode,
} from "../store/todoSlice";

const TodoApp = () => {
  const dispatch = useDispatch();

  // Getting full todos array from Redux store
  const todos = useSelector(selectTodos);

  // Getting filtered todos based on current filter (all / active / completed)
  const filteredTodos = useSelector(selectFilteredAndSearchedTodos);

  // Getting calculated statistics (total, active, completed, percent)
  const stats = useSelector(selectTodoStats);

  // Getting current filter value
  const filter = useSelector(selectFilter);

  // Getting whether add-todo form is visible
  const isAddingTodo = useSelector(selectIsAddingTodo);

  // Getting dark mode state
  const darkMode = useSelector(selectDarkMode);

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
      } catch (error) {
        console.log("Error loading todos from localStorage");
      }
    }
    if (savedDarkMode) {
      dispatch(setDarkMode(JSON.parse(savedDarkMode)));
    }
  }, [dispatch]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Handle Add Todo button click
  const handleAddTodoClick = () => {
    dispatch(setIsAddingTodo(true));
  };

  // Handle Clear Completed button click
  const handleClearCompleted = () => {
    if (
      window.confirm(
        `Delete ${stats.completed} completed todo(s)?`
      )
    ) {
      dispatch(clearCompleted());
    }
  };

  // Handle Mark All Completed button click
  const handleMarkAllCompleted = () => {
    if (
      window.confirm(
        `Mark all ${stats.active} active todo(s) as completed?`
      )
    ) {
      dispatch(markAllCompleted());
    }
  };

  // Handle dark mode toggle
  const handleToggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
  };

  return (
    // Main background wrapper with dynamic dark mode
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
      } py-8 px-4`}
    >
      <div className="max-w-3xl mx-auto">
        {/* ================= HEADER WITH DARK MODE TOGGLE ================= */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl font-bold mb-2 transition-all duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              📋 ToDo App
            </h1>
            <p className={`transition-all duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              やることリスト || Things To Do
            </p>
          </div>
          {/* Dark mode toggle */}
          <button
            onClick={handleToggleDarkMode}
            className={`p-3 rounded-full transition-all duration-300 ${
              darkMode
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-yellow-300"
            }`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* ================= STATS CARD ================= */}
        <div
          className={`rounded-2xl p-6 mb-6 border shadow-lg transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/90 border-gray-700"
              : "bg-white/90 border-gray-300"
          } backdrop-blur-sm`}
        >
          {/* Progress percentage section */}
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold transition-all duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              📊 Progress Overview
            </h2>

            {/* Shows percent completed */}
            <div className="text-2xl font-bold text-green-600">
              {stats.percentCompleted}%
            </div>
          </div>

          {/* Progress bar */}
          <div className={`w-full rounded-full h-3 mb-4 ${
            darkMode ? "bg-gray-700" : "bg-gray-300"
          }`}>
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full
              transition-all duration-500 ease-out"
              style={{ width: `${stats.percentCompleted}%` }}
            ></div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {/* Total todos */}
            <div>
              <div className={`text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.total}
              </div>
              <div className={`text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Total</div>
            </div>

            {/* Active todos */}
            <div>
              <div className={`text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.active}
              </div>
              <div className={`text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Active</div>
            </div>

            {/* Completed todos */}
            <div>
              <div className={`text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.completed}
              </div>
              <div className={`text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Completed</div>
            </div>

            {/* High Priority */}
            <div>
              <div className={`text-2xl font-bold text-red-500 flex items-center justify-center gap-1`}>
                <Zap size={20} />
                {stats.highPriority}
              </div>
              <div className={`text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>High</div>
            </div>
          </div>
        </div>

        {/* ================= MAIN TODO CONTAINER ================= */}
        <div
          className={`rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/90 border-gray-700"
              : "bg-white/90 border-gray-300"
          } backdrop-blur-sm`}
        >
          {/* Top control bar */}
          <div className={`p-6 border-b transition-all duration-300 ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              {/* Add Todo button */}
              <button
                onClick={handleAddTodoClick}
                disabled={isAddingTodo}
                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 
                font-semibold shadow-md hover:shadow-lg"
              >
                <Plus size={20} /> Add Todo
              </button>

              {/* Show these buttons only if todos exist */}
              {stats.total > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Show clear button only if some todos are completed */}
                  {stats.completed > 0 && (
                    <button
                      onClick={handleClearCompleted}
                      className="flex items-center gap-3 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg 
                      transition-all duration-200 text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={16} />
                      Clear Completed
                    </button>
                  )}

                  {/* Show mark-all button only if active todos exist */}
                  {stats.active > 0 && (
                    <button
                      onClick={handleMarkAllCompleted}
                      className="flex items-center gap-3 text-green-600
                      hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 
                      transition-all duration-200 text-sm"
                    >
                      <CheckCircle2 size={16} />
                      Mark all
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Filter buttons component */}
            <TodoFilters currentFilter={filter} stats={stats} />
          </div>

          {/* ================= TODO FORM ================= */}
          {/* Show add form only if isAddingTodo is true */}
          {isAddingTodo && (
            <div className={`p-6 border-b transition-all duration-300 ${
              darkMode
                ? "border-gray-700 bg-gray-700/50"
                : "border-gray-300 bg-gray-50"
            }`}>
              <TodoForm />
            </div>
          )}

          {/* ================= TODO LIST ================= */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* If filtered list is empty */}
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center">
                {/* If there are NO todos at all */}
                {todos.length === 0 ? (
                  <div className={`transition-all duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <Circle size={48} className="mx-auto mb-4 opacity-50" />
                    <p className={`text-lg font-medium mb-2 transition-all duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                      No Todo Yet 🎉
                    </p>
                    <p>Add your first todo to get started!</p>
                  </div>
                ) : (
                  // If todos exist but filter removed them
                  <div className={`transition-all duration-300 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}>
                    <Filter size={48} className="mx-auto mb-4 opacity-50" />
                    <p className={`text-lg font-medium mb-2 transition-all duration-300 ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}>
                      No Todos Found
                    </p>
                    <p>Try changing the filter or search query</p>
                  </div>
                )}
              </div>
            ) : (
              // If filteredTodos has items → show them
              <TodoItems />
            )}
          </div>
        </div>

        {/* ================= STATS FOOTER ================= */}
        {stats.total > 0 && (
          <div className={`mt-6 p-4 rounded-lg text-center transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/50 text-gray-300"
              : "bg-white/50 text-gray-700"
          }`}>
            <p className="text-sm">
              ✨ <strong>{stats.completed}/{stats.total}</strong> tasks completed •
              <strong> {Math.round((stats.completed / stats.total) * 100)}%</strong> progress
            </p>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className={`text-center mt-8 text-sm transition-all duration-300 ${
          darkMode ? "text-gray-400" : "text-gray-700"
        }`}>
          <p>🚀 Built with React & Redux • Stay Productive!</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
