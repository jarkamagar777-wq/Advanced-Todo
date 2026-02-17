import { Check, X, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo, setIsAddingTodo, setEditingId } from "../store/todoSlice";
import { selectEditingId, selectTodos, selectDarkMode } from "../store/selector";

const TodoForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const dispatch = useDispatch();
  const editingId = useSelector(selectEditingId);
  const todos = useSelector(selectTodos);
  const darkMode = useSelector(selectDarkMode);

  // Load existing todo data if editing
  useEffect(() => {
    if (editingId) {
      const todoToEdit = todos.find((t) => t.id === editingId);
      if (todoToEdit) {
        setInputValue(todoToEdit.text);
        setPriority(todoToEdit.priority || "medium");
        setDueDate(todoToEdit.dueDate || "");
        setNotes(todoToEdit.notes || "");
        setShowAdvanced(true);
      }
    }
  }, [editingId, todos]);

  // Handle save button click
  const handleSave = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue.length === 0) return;

    if (editingId) {
      // Update existing todo
      dispatch(
        updateTodo({
          id: editingId,
          text: trimmedValue,
          priority,
          dueDate,
          notes,
        })
      );
    } else {
      // Add new todo
      dispatch(
        addTodo({
          text: trimmedValue,
          priority,
          dueDate,
          notes,
        })
      );
    }
    resetForm();
  };

  // Reset form to initial state
  const resetForm = () => {
    setInputValue("");
    setPriority("medium");
    setDueDate("");
    setNotes("");
    setShowAdvanced(false);
  };

  // Handle cancel button click
  const handleCancel = () => {
    resetForm();
    dispatch(setIsAddingTodo(false));
    dispatch(setEditingId(null));
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-2 md:space-y-4">
      {/* Main todo input */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <input
            className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm md:text-base ${
              darkMode
                ? "bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-500/60 focus:ring-amber-600 focus:border-transparent"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-blue-500 focus:border-transparent"
            }`}
            type="text"
            placeholder={editingId ? "Update your todo..." : "What needs to be done?"}
            maxLength={500}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {/* Priority selector */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={`px-2 md:px-3 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 font-semibold text-xs md:text-sm shrink-0 ${
            priority === "high"
              ? darkMode
                ? "border-red-700/50 bg-red-950/40 text-red-300"
                : "border-red-300 bg-red-50 text-red-700"
              : priority === "medium"
              ? darkMode
                ? "border-yellow-700/50 bg-yellow-950/40 text-yellow-300"
                : "border-amber-300 bg-amber-50 text-amber-700"
              : darkMode
              ? "border-emerald-700/50 bg-emerald-950/40 text-emerald-300"
              : "border-emerald-300 bg-emerald-50 text-emerald-700"
          }`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={`text-xs md:text-sm font-medium transition-colors ${
          darkMode
            ? "text-amber-400 hover:text-amber-300"
            : "text-blue-600 hover:text-blue-700"
        }`}
      >
        {showAdvanced ? "▼ Hide" : "▶ Show"} Advanced Options
      </button>

      {/* Advanced options */}
      {showAdvanced && (
        <div className={`space-y-2 md:space-y-3 p-2 md:p-3 rounded-lg border ${
          darkMode
            ? "bg-slate-800/30 border-amber-700/30"
            : "bg-gray-50 border-gray-200"
        }`}>
          {/* Due date input */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1 ${
              darkMode ? "text-slate-300" : "text-gray-700"
            }`}>
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className={`w-full px-3 md:px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-xs md:text-sm ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700/50 text-slate-100 focus:ring-amber-600"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
              }`}
            />
          </div>

          {/* Notes input */}
          <div>
            <label className={`block text-xs md:text-sm font-medium mb-1 ${
              darkMode ? "text-slate-300" : "text-gray-700"
            }`}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
              placeholder="Add notes or details..."
              className={`w-full px-3 md:px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none transition-all duration-200 text-xs md:text-sm ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-500/60 focus:ring-amber-600"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500"
              }`}
              rows="2"
            />
            <p className={`text-xs mt-1 ${
              darkMode ? "text-slate-400/60" : "text-gray-500"
            }`}>{notes.length}/200</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={inputValue.trim().length === 0}
          className={`flex items-center justify-center flex-1 gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 font-semibold disabled:cursor-not-allowed text-xs md:text-sm ${
            darkMode
              ? "bg-amber-700 hover:bg-amber-600 disabled:bg-slate-600 text-amber-50 hover:shadow-lg hover:shadow-amber-700/30"
              : "bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white"
          }`}
          title="Save todo (Ctrl+Enter)"
        >
          <Check size={16} className="md:w-5 md:h-5" /> Save
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className={`flex items-center justify-center gap-1 md:gap-2 px-3 md:px-4 py-2 rounded-lg transition-all duration-200 font-semibold text-xs md:text-sm ${
            darkMode
              ? "bg-slate-700 hover:bg-slate-600 text-slate-100"
              : "bg-gray-400 hover:bg-gray-500 text-white"
          }`}
          title="Cancel (Esc)"
        >
          <X size={16} className="md:w-5 md:h-5" /> Cancel
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className={`text-xs flex items-center gap-1 ${
        darkMode ? "text-slate-400/60" : "text-gray-500"
      }`}>
        <AlertCircle size={12} />
        <span>Ctrl+Enter to save • Esc to cancel</span>
      </div>
    </div>
  );
};

export default TodoForm;
