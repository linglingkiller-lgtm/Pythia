import React from 'react';
import { Search, Filter, Layout, RotateCcw, Calendar, Eye, EyeOff } from 'lucide-react';

interface NetworkControlsProps {
  activeFilters: {
    bills: boolean;
    legislators: boolean;
    clients: boolean;
    committees: boolean;
    issues: boolean;
    stakeholders: boolean;
    staff: boolean;
    sponsors: boolean;
    supporters: boolean;
    opponents: boolean;
    neutral: boolean;
  };
  toggleFilter: (key: keyof NetworkControlsProps['activeFilters']) => void;
  layoutMode: 'force' | 'hierarchical' | 'circular' | 'cluster';
  setLayoutMode: (mode: 'force' | 'hierarchical' | 'circular' | 'cluster') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  timeRange: 'all' | '30' | '60' | '90';
  setTimeRange: (range: 'all' | '30' | '60' | '90') => void;
  isDarkMode: boolean;
  onResetView: () => void;
}

export function NetworkControls({
  activeFilters,
  toggleFilter,
  layoutMode,
  setLayoutMode,
  searchQuery,
  setSearchQuery,
  timeRange,
  setTimeRange,
  isDarkMode,
  onResetView
}: NetworkControlsProps) {
  return (
    <div className={`w-80 border-r overflow-y-auto ${
      isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
    }`}>
      <div className="p-4 space-y-6">
        {/* Search */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <Search size={16} className="inline mr-2" />
            Search Network
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className={`w-full px-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />
        </div>
        
        {/* Layout Mode */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <Layout size={16} className="inline mr-2" />
            Layout
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['force', 'hierarchical', 'circular', 'cluster'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  layoutMode === mode
                    ? 'bg-purple-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Time Range */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <Calendar size={16} className="inline mr-2" />
            Time Range
          </label>
          <div className="flex gap-2">
            {(['all', '30', '60', '90'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-purple-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'all' ? 'All' : `${range}d`}
              </button>
            ))}
          </div>
        </div>
        
        {/* Entity Type Filters */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            <Filter size={16} className="inline mr-2" />
            Entity Types
          </label>
          <div className="space-y-2">
            {[
              { key: 'bills', label: 'Bills', color: 'blue' },
              { key: 'legislators', label: 'Legislators', color: 'green' },
              { key: 'clients', label: 'Clients', color: 'purple' },
              { key: 'committees', label: 'Committees', color: 'amber' },
              { key: 'issues', label: 'Issues', color: 'pink' },
              { key: 'stakeholders', label: 'Stakeholders', color: 'cyan' },
              { key: 'staff', label: 'Staff', color: 'indigo' }
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeFilters[key as keyof typeof activeFilters]}
                  onChange={() => toggleFilter(key as keyof typeof activeFilters)}
                  className="w-4 h-4 rounded"
                />
                <div className={`w-3 h-3 rounded-full bg-${color}-600`} />
                <span className={`text-sm ${
                  isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Relationship Type Filters */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            isDarkMode ? 'text-slate-300' : 'text-gray-700'
          }`}>
            Relationships
          </label>
          <div className="space-y-2">
            {[
              { key: 'sponsors', label: 'Sponsors' },
              { key: 'supporters', label: 'Supporters' },
              { key: 'opponents', label: 'Opponents' },
              { key: 'neutral', label: 'Neutral' }
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={activeFilters[key as keyof typeof activeFilters]}
                  onChange={() => toggleFilter(key as keyof typeof activeFilters)}
                  className="w-4 h-4 rounded"
                />
                <span className={`text-sm ${
                  isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Actions */}
        <div className="pt-4 border-t border-slate-700">
          <button
            onClick={onResetView}
            className={`w-full px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
            }`}
          >
            <RotateCcw size={16} />
            Reset View
          </button>
        </div>
      </div>
    </div>
  );
}
