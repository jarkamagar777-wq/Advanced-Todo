import { CheckCircle, Clock, List, Zap, Search, SortAsc } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setSearchQuery, setSortBy } from '../store/todoSlice';
import { selectSearchQuery, selectSortBy } from '../store/selector';

const TodoFilters = ({currentFilter, stats}) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const sortBy = useSelector(selectSortBy);
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
    <div className='space-y-3'>
      {/* Search bar */}
      <div className="flex items-center gap-2">
        <div className={`flex-1 transition-all duration-300 ${showSearch ? 'visible' : 'hidden'}`}>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={searchQuery}
              onChange={handleSearchChange}
              autoFocus
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            showSearch || searchQuery
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Main filters and sort */}
      <div className='flex items-center justify-between gap-3 flex-wrap'>
        {/* Status filters */}
        <div className='flex items-center gap-2 bg-gray-100 rounded-lg p-1 flex-wrap'>
          {filters.map(({ key, label, icon: Icon, count }) => {
            return (
              <button 
                key={key} 
                onClick={() => handleFilterClick(key)}
                className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentFilter === key 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-700 hover:text-gray-800 hover:bg-gray-200'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
                <span className="bg-gray-300 rounded-full px-2 py-0.5 text-xs font-semibold">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200">
            <SortAsc size={16} />
            <span>Sort</span>
          </button>
          <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSortClick(option.key)}
                className={`w-full text-left px-4 py-2 text-sm transition-all duration-200 ${
                  sortBy === option.key
                    ? 'bg-blue-50 text-blue-600 font-semibold'
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
        <div className='flex items-center gap-2 text-xs'>
          <span className="text-gray-600 font-medium">By Priority:</span>
          <div className='flex gap-2'>
            {priorityFilters.map(({ key, label, count, color }) => (
              <button
                key={key}
                onClick={() => handleFilterClick(key)}
                disabled={count === 0}
                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentFilter === key
                    ? `bg-${color}-100 text-${color}-700 font-semibold`
                    : `bg-gray-100 text-gray-700 hover:bg-gray-200`
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
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-medium">
          ⚠️ {stats.overdue} overdue todo{stats.overdue !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

export default TodoFilters;