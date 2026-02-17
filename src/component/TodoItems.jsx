import { Calendar, Check, Edit, Trash2, AlertCircle, FileText } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo, toggleTodo, setIsAddingTodo, setEditingId } from "../store/todoSlice";
import { selectFilteredAndSearchedTodos } from "../store/selector";

const TodoItems = () => {
  const dispatch = useDispatch();
  const filteredTodos = useSelector(selectFilteredAndSearchedTodos);
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

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <>
      {filteredTodos.map((todo) => {
        const overdue = isOverdue(todo.dueDate, todo.completed);
        return (
          <div
            key={todo.id}
            className={`group p-4 border-b border-gray-200 hover:bg-gray-50 transition-all duration-200 ${
              todo.completed ? "bg-gray-50" : ""
            } ${overdue ? "border-l-4 border-l-red-500" : ""}`}
          >
            {/* Main row */}
            <div className="flex items-start gap-3">
              {/* Toggle completion button */}
              <button
                onClick={() => handleToggle(todo.id)}
                className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                  todo.completed
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300 hover:border-green-500"
                }`}
              >
                {todo.completed && <Check size={14} className="text-white" />}
              </button>

              {/* Todo content */}
              <div className="flex-1 min-w-0">
                <div
                  className={`leading-relaxed break-word ${
                    todo.completed
                      ? "text-gray-500 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </div>

                {/* Tags row - Priority and due date */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {/* Priority badge */}
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${getPriorityColor(
                      todo.priority
                    )}`}
                  >
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                  </span>

                  {/* Due date */}
                  {todo.dueDate && (
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        overdue
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      <Calendar size={12} />
                      {overdue && <AlertCircle size={12} />}
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
                      className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all duration-200"
                    >
                      <FileText size={12} className="inline mr-1" />
                      Notes
                    </button>
                  )}
                </div>

                {/* Expanded notes section */}
                {expandedNotes === todo.id && todo.notes && (
                  <div className="mt-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{todo.notes}</p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>Created: {formatDate(todo.createdAt)}</span>
                  {todo.updatedAt !== todo.createdAt && (
                    <span>Updated: {formatDate(todo.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* Action buttons (visible on hover) */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0">
                <button
                  onClick={() => handleEdit(todo.id)}
                  disabled={todo.completed}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 disabled:text-gray-400 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
                  title="Edit todo"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200"
                  title="Delete todo"
                >
                  <Trash2 size={16} />
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
