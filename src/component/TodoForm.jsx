import { Check, X, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, updateTodo, setIsAddingTodo, setEditingId } from "../store/todoSlice";
import { selectEditingId, selectTodos } from "../store/selector";

const TodoForm = () => {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const dispatch = useDispatch();
  const editingId = useSelector(selectEditingId);
  const todos = useSelector(selectTodos);

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
    <div className="space-y-4">
      {/* Main todo input */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
            focus:border-transparent transition-all duration-200 bg-white text-gray-800 placeholder-gray-500"
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
          className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 font-semibold text-sm ${
            priority === "high"
              ? "border-red-300 bg-red-50 text-red-700"
              : priority === "medium"
              ? "border-yellow-300 bg-yellow-50 text-yellow-700"
              : "border-green-300 bg-green-50 text-green-700"
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
        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        {showAdvanced ? "▼ Hide" : "▶ Show"} Advanced Options
      </button>

      {/* Advanced options */}
      {showAdvanced && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {/* Due date input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notes input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={200}
              placeholder="Add notes or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <p className="text-xs text-gray-500 mt-1">{notes.length}/200</p>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={inputValue.trim().length === 0}
          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 bg-green-600
        hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg
        transition-colors duration-200 font-semibold"
          title="Save todo (Ctrl+Enter)"
        >
          <Check size={18} /> Save
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-400
        hover:bg-gray-500 text-white rounded-lg
        transition-colors duration-200 font-semibold"
          title="Cancel (Esc)"
        >
          <X size={18} /> Cancel
        </button>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <AlertCircle size={14} />
        <span>Ctrl+Enter to save • Esc to cancel</span>
      </div>
    </div>
  );
};

export default TodoForm;
