import { Calendar, Check, Edit, Trash2, AlertCircle, FileText } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, toggleTodo, setIsAddingTodo, setEditingId } from "../store/todoSlice";
import { selectFilteredAndSearchedTodos, selectDarkMode } from "../store/selector";

const TodoItems = () => {
  const dispatch = useDispatch();
  const filteredTodos = useSelector(selectFilteredAndSearchedTodos);
  const darkMode = useSelector(selectDarkMode);
  const [expandedNotes, setExpandedNotes] = useState(null);

  // Handle toggle todo completion
  const handleToggle = (id) => {
    dispatch(toggleTodo(id));
  };

  // Handle delete todo
  const handleDelete = (id) => {
    if (window.confirm("Delete this todo?")) {
      dispatch(deleteTodo(id));
    }
  };

  // Handle edit todo
  const handleEdit = (id) => {
    dispatch(setEditingId(id));
    dispatch(setIsAddingTodo(true));
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if due date is overdue
  const isOverdue = (dueDate, completed) => {
    if (!dueDate || completed) return false;
    return new Date(dueDate) < new Date();
  };

  // Get priority badge color with samurai style
  const getPriorityColor = (priority) => {
    if (darkMode) {
      switch(priority) {
        case "high":
          return "bg-red-950/40 text-red-300 border-red-700/50";
        case "medium":
          return "bg-yellow-900/40 text-yellow-300 border-yellow-700/50";
        case "low":
          return "bg-emerald-900/40 text-emerald-300 border-emerald-700/50";
        default:
          return "bg-slate-700/40 text-slate-300 border-slate-600";
      }
    } else {
      switch(priority) {
        case "high":
          return "bg-red-100 text-red-700 border-red-300";
        case "medium":
          return "bg-amber-100 text-amber-700 border-amber-300";
        case "low":
          return "bg-emerald-100 text-emerald-700 border-emerald-300";
        default:
          return "bg-gray-100 text-gray-700 border-gray-300";
      }
    }
  };

  return (
    <>
      {filteredTodos.map((todo) => {
        const overdue = isOverdue(todo.dueDate, todo.completed);
        return (
          <div
            key={todo.id}
            className={`group p-3 md:p-4 transition-all duration-200 ${
              darkMode
                ? `border-b border-slate-700/30 hover:bg-slate-800/40 ${
                    todo.completed ? "bg-slate-900/20" : ""
                  }`
                : `border-b border-gray-200 hover:bg-gray-50 ${
                    todo.completed ? "bg-gray-50" : ""
                  }`
            } ${overdue ? "border-l-4 border-l-red-600" : ""}`}
          >
            {/* Main row */}
            <div className="flex items-start gap-2 md:gap-3">
              {/* Toggle completion button */}
              <button
                onClick={() => handleToggle(todo.id)}
                className={`shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 hover:scale-110 ${
                  todo.completed
                    ? darkMode
                      ? "bg-amber-600 border-amber-600"
                      : "bg-green-500 border-green-500"
                    : darkMode
                    ? "border-slate-600 hover:border-amber-500"
                    : "border-gray-300 hover:border-green-500"
                }`}
              >
                {todo.completed && <Check size={14} className="text-white" />}
              </button>

              {/* Todo content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`leading-relaxed break-word text-sm md:text-base ${
                    todo.completed
                      ? darkMode
                        ? "text-slate-400/60 line-through"
                        : "text-gray-500 line-through"
                      : darkMode
                      ? "text-slate-100"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </div>

                {/* Tags row - Priority and due date */}
                <div className="flex items-center gap-1 md:gap-2 mt-2 flex-wrap">
                  {/* Priority badge */}
                  <span
                    className={`text-xs font-semibold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full border ${getPriorityColor(
                      todo.priority
                    )}`}
                  >
                    <span className="hidden sm:inline">{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority</span>
                    <span className="sm:hidden">{todo.priority.charAt(0).toUpperCase()}</span>
                  </span>

                  {/* Due date */}
                  {todo.dueDate && (
                    <span
                      className={`flex items-center gap-0.5 text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${
                        overdue
                          ? darkMode
                            ? "bg-red-950/40 text-red-300 border border-red-700/50"
                            : "bg-red-100 text-red-700"
                          : darkMode
                          ? "bg-blue-950/40 text-blue-300 border border-blue-700/50"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Calendar size={12} />
                      {overdue && <AlertCircle size={11} />}
                      {new Date(todo.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  )}

                  {/* Notes indicator */}
                  {todo.notes && (
                    <button
                      onClick={() =>
                        setExpandedNotes(
                          expandedNotes === todo.id ? null : todo.id
                        )
                      }
                      className={`text-xs font-medium px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-all duration-200 ${
                        darkMode
                          ? "bg-slate-700/40 text-slate-300 hover:bg-slate-700/60 border border-slate-700/50"
                          : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                      }`}
                    >
                      <FileText size={11} className="inline md:mr-1" />
                      <span className="hidden sm:inline">Notes</span>
                    </button>
                  )}
                </div>

                {/* Expanded notes section */}
                {expandedNotes === todo.id && todo.notes && (
                  <div className={`mt-2 p-2 md:p-3 rounded-lg border ${
                    darkMode
                      ? "bg-slate-800/40 border-slate-700/50"
                      : "bg-purple-50 border-purple-200"
                  }`}>
                    <p className={`text-xs md:text-sm whitespace-pre-wrap ${
                      darkMode ? "text-slate-200" : "text-gray-700"
                    }`}>{todo.notes}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className={`flex items-center gap-1 md:gap-3 mt-2 text-xs justify-between flex-wrap ${
                  darkMode ? "text-slate-400/60" : "text-gray-500"
                }`}>
                  <span className="hidden sm:inline">Created: {formatDate(todo.createdAt)}</span>
                  {todo.updatedAt !== todo.createdAt && (
                    <span className="hidden md:inline">Updated: {formatDate(todo.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Action buttons (visible on hover) */}
              <div className="flex items-center gap-0.5 md:gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                <button
                  onClick={() => handleEdit(todo.id)}
                  disabled={todo.completed}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 disabled:cursor-not-allowed hover:scale-110 ${
                    darkMode
                      ? "text-slate-400 hover:text-blue-400 hover:bg-blue-900/40 disabled:text-slate-600"
                      : "text-gray-500 hover:text-blue-600 hover:bg-blue-100 disabled:text-gray-400"
                  }`}
                  title="Edit todo"
                >
                  <Edit size={14} className="md:w-4 md:h-4" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className={`p-1.5 md:p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode
                      ? "text-slate-400 hover:text-red-400 hover:bg-red-900/40"
                      : "text-gray-500 hover:text-red-600 hover:bg-red-100"
                  }`}
                  title="Delete todo"
                >
                  <Trash2 size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default TodoItems;
