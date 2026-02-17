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
      className={`min-h-screen flex flex-col transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-black"
          : "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300"
      } py-4 md:py-8 px-3 md:px-4`}
    >
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        {/* ================= HEADER WITH DARK MODE TOGGLE ================= */}
        <div className="flex items-center justify-between gap-3 mb-6 md:mb-8 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 transition-all duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              📋 ToDo App
            </h1>
            <p className={`text-xs md:text-sm transition-all duration-300 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              やることリスト || Things To Do
            </p>
          </div>
          {/* Dark mode toggle */}
          <button
            onClick={handleToggleDarkMode}
            className={`p-2 md:p-3 rounded-full transition-all duration-300 shrink-0 ${
              darkMode
                ? "bg-amber-900 hover:bg-amber-800 text-amber-300 shadow-lg shadow-amber-900/30 border border-amber-700/50"
                : "bg-gray-800 hover:bg-gray-700 text-yellow-300"
            }`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* ================= STATS CARD ================= */}
        <div
          className={`rounded-2xl p-4 md:p-6 mb-4 md:mb-6 border shadow-lg transition-all duration-300 ${
            darkMode
              ? "bg-slate-900/60 border-amber-700/30 backdrop-blur-xl"
              : "bg-white/90 border-gray-300 backdrop-blur-sm"
          }`}
        >
          {/* Progress percentage section */}
          <div className="flex items-center justify-between mb-3 md:mb-4 flex-wrap gap-2">
            <h2 className={`text-base md:text-lg font-semibold transition-all duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              📊 Progress Overview
            </h2>

            {/* Shows percent completed */}
            <div className={`text-xl md:text-2xl font-bold ${
              darkMode ? "text-amber-400" : "text-green-600"
            }`}>
              {stats.percentCompleted}%
            </div>
          </div>

          {/* Progress bar */}
          <div className={`w-full rounded-full h-2 md:h-3 mb-3 md:mb-4 ${
            darkMode ? "bg-slate-800/50" : "bg-gray-300"
          }`}>
            <div
              className={`h-2 md:h-3 rounded-full transition-all duration-500 ease-out ${
                darkMode
                  ? "bg-gradient-to-r from-amber-600 to-amber-500"
                  : "bg-gradient-to-r from-green-500 to-green-600"
              }`}
              style={{ width: `${stats.percentCompleted}%` }}
            ></div>
          </div>

          {/* Stats grid - responsive 2x2 on mobile, 1x4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-center">
            {/* Total todos */}
            <div className="p-2">
              <div className={`text-lg md:text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.total}
              </div>
              <div className={`text-xs md:text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Total</div>
            </div>

            {/* Active todos */}
            <div className="p-2">
              <div className={`text-lg md:text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.active}
              </div>
              <div className={`text-xs md:text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Active</div>
            </div>

            {/* Completed todos */}
            <div className="p-2">
              <div className={`text-lg md:text-2xl font-bold transition-all duration-300 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {stats.completed}
              </div>
              <div className={`text-xs md:text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>Completed</div>
            </div>

            {/* High Priority */}
            <div className="p-2">
              <div className={`text-lg md:text-2xl font-bold text-red-500 flex items-center justify-center gap-1`}>
                <Zap size={16} className="md:w-5 md:h-5" />
                {stats.highPriority}
              </div>
              <div className={`text-xs md:text-sm transition-all duration-300 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>High</div>
            </div>
          </div>
        </div>

        {/* ================= MAIN TODO CONTAINER ================= */}
        <div
          className={`rounded-2xl border shadow-lg overflow-hidden transition-all duration-300 flex flex-col flex-1 ${
            darkMode
              ? "bg-slate-900/60 border-amber-700/30 backdrop-blur-xl"
              : "bg-white/90 border-gray-300 backdrop-blur-sm"
          }`}
        >
          {/* Top control bar */}
          <div className={`p-3 md:p-6 border-b transition-all duration-300 ${
            darkMode ? "border-amber-700/20" : "border-gray-300"
          }`}>
            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2 flex-wrap">
              {/* Add Todo button */}
              <button
                onClick={handleAddTodoClick}
                disabled={isAddingTodo}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2 rounded-lg transition-all duration-200 
                font-semibold shadow-md hover:shadow-lg disabled:cursor-not-allowed text-sm md:text-base ${
                  darkMode
                    ? "bg-amber-700 hover:bg-amber-600 disabled:bg-slate-600 text-amber-100"
                    : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
                }`}
              >
                <Plus size={18} className="md:w-5 md:h-5" /> Add Todo
              </button>

              {/* Show these buttons only if todos exist */}
              {stats.total > 0 && (
                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                  {/* Show clear button only if some todos are completed */}
                  {stats.completed > 0 && (
                    <button
                      onClick={handleClearCompleted}
                      className="flex items-center gap-1 md:gap-2 text-red-600 hover:text-red-700 px-2 md:px-3 py-1 md:py-2 rounded-lg 
                      transition-all duration-200 text-xs md:text-sm hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Clear Completed</span>
                      <span className="sm:hidden">Clear</span>
                    </button>
                  )}

                  {/* Show mark-all button only if active todos exist */}
                  {stats.active > 0 && (
                    <button
                      onClick={handleMarkAllCompleted}
                      className="flex items-center gap-1 md:gap-2 text-green-600
                      hover:text-green-700 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 
                      transition-all duration-200 text-xs md:text-sm"
                    >
                      <CheckCircle2 size={14} className="md:w-4 md:h-4" />
                      <span className="hidden sm:inline">Mark all</span>
                      <span className="sm:hidden">Mark</span>
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
            <div className={`p-3 md:p-6 border-b transition-all duration-300 ${
              darkMode
                ? "border-amber-700/20 bg-slate-800/30"
                : "border-gray-300 bg-gray-50"
            }`}>
              <TodoForm />
            </div>
          )}

          {/* ================= TODO LIST ================= */}
          <div className="flex-1 overflow-y-auto">
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
          <div className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg text-center transition-all duration-300 ${
            darkMode
              ? "bg-slate-900/60 border border-amber-700/30 text-amber-200"
              : "bg-white/50 text-gray-700"
          }`}>
            <p className="text-xs md:text-sm">
              ✨ <strong>{stats.completed}/{stats.total}</strong> tasks completed •
              <strong> {Math.round((stats.completed / stats.total) * 100)}%</strong> progress
            </p>
          </div>
        )}

        {/* ================= FOOTER ================= */}
        <div className={`text-center mt-4 md:mt-8 text-xs md:text-sm transition-all duration-300 ${
          darkMode ? "text-gray-400" : "text-gray-700"
        }`}>
          <p>🚀 Built with React & Redux • Stay Productive!</p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
