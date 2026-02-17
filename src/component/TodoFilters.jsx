import { CheckCircle, Clock, List, Zap, Search, SortAsc } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSearchQuery, setSortBy } from '../store/todoSlice';
import { selectSearchQuery, selectSortBy, selectDarkMode } from '../store/selector';

const TodoFilters = ({currentFilter, stats}) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const sortBy = useSelector(selectSortBy);
  const darkMode = useSelector(selectDarkMode);
  const [showSearch, setShowSearch] = useState(false);

  const filters = [
    {key: "all", label:"All", icon:List, count: stats.total},
    {key: "active", label:"Active", icon:Clock, count: stats.active},
    {key: "completed", label:"Completed", icon:CheckCircle, count: stats.completed}
  ]

  const priorityFilters = [
    {key: "high", label:"High", icon:Zap, count: stats.highPriority, color: "red"},
    {key: "medium", label:"Medium", icon:Zap, count: stats.mediumPriority, color: "yellow"},
    {key: "low", label:"Low", icon:Zap, count: stats.lowPriority, color: "green"},
  ]

  const sortOptions = [
    {key: "date", label: "Newest First"},
    {key: "priority", label: "By Priority"},
    {key: "name", label: "Alphabetically"},
  ]

  const handleFilterClick = (filterKey) => {
    dispatch(setFilter(filterKey));
  };

  const handleSortClick = (sortKey) => {
    dispatch(setSortBy(sortKey));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <div className='space-y-2 md:space-y-3'>
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 transition-all duration-300 ${showSearch ? 'visible' : 'hidden'}`}>
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-2.5 md:top-3 ${
              darkMode ? "text-slate-500" : "text-gray-400"
            }`} />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-xs md:text-sm transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder-slate-500/60 focus:ring-amber-600"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500"
              }`}
            />
          </div>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-2 rounded-lg transition-all duration-200 shrink-0 ${
            showSearch || searchQuery
              ? darkMode
                ? 'bg-amber-900/30 text-amber-400 border border-amber-700/50'
                : 'bg-blue-100 text-blue-600'
              : darkMode
              ? 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Search"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Main filters and sort */}
      <div className='flex items-center gap-2 flex-wrap'>
        {/* Status filters */}
        <div className={`flex items-center gap-1 rounded-lg p-1 flex-wrap ${
          darkMode
            ? 'bg-slate-800/30 border border-slate-700/30'
            : 'bg-gray-100'
        }`}>
          {filters.map(({ key, label, icon: Icon, count }) => {
            return (
              <button 
                key={key} 
                onClick={() => handleFilterClick(key)}
                className={`flex items-center gap-1 px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                  currentFilter === key 
                    ? darkMode
                      ? 'bg-amber-700/50 text-amber-200 shadow-lg shadow-amber-900/30 border border-amber-600/50'
                      : 'bg-white text-gray-800 shadow-sm'
                    : darkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/40'
                    : 'text-gray-700 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Icon size={14} className="md:w-4 md:h-4" />
                <span>{label}</span>
                <span className={`rounded-full px-1.5 md:px-2 py-0.5 text-xs font-semibold ${
                  currentFilter === key
                    ? darkMode
                      ? 'bg-amber-600/40 text-amber-200'
                      : 'bg-gray-300'
                    : darkMode
                    ? 'bg-slate-700/50 text-slate-300'
                    : 'bg-gray-300'
                }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="relative group">
          <button className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
            darkMode
              ? 'bg-slate-800/30 hover:bg-slate-800/50 text-slate-400'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}>
            <SortAsc size={14} className="md:w-4 md:h-4" />
            <span className="hidden sm:inline">Sort</span>
          </button>
          <div className={`absolute right-0 mt-1 w-40 md:w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 ${
            darkMode
              ? 'bg-slate-800/90 border border-slate-700/50'
              : 'bg-white'
          }`}>
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSortClick(option.key)}
                className={`w-full text-left px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm transition-all duration-200 ${
                  sortBy === option.key
                    ? darkMode
                      ? 'bg-amber-700/30 text-amber-300 font-semibold border-l-2 border-l-amber-600'
                      : 'bg-blue-50 text-blue-600 font-semibold'
                    : darkMode
                    ? 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Priority filters (only show if there are active todos) */}
      {stats.active > 0 && (
        <div className={`flex items-center gap-1 md:gap-2 text-xs ${
          darkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          <span className={`font-medium text-xs ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Priority:</span>
          <div className='flex gap-1 md:gap-2 flex-wrap'>
            {priorityFilters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => handleFilterClick(key)}
                disabled={count === 0}
                className={`flex items-center gap-0.5 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs ${
                  currentFilter === key
                    ? darkMode
                      ? 'bg-amber-700/50 text-amber-200 font-semibold border border-amber-600/50'
                      : 'bg-blue-100 text-blue-700 font-semibold'
                    : darkMode
                    ? 'bg-slate-800/30 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{label}</span>
                {count > 0 && <span className="text-xs font-bold">({count})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overdue indicator */}
      {stats.overdue > 0 && (
        <div className={`p-2 border rounded-lg text-xs md:text-sm font-medium transition-all duration-300 ${
          darkMode
            ? "bg-red-950/40 border-red-700/50 text-red-300"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          ⚠️ {stats.overdue} overdue todo{stats.overdue !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default TodoFilters;