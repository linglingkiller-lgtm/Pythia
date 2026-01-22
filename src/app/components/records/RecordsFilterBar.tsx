import React from 'react';
import { Search, Filter, X, LayoutGrid, List } from 'lucide-react';
import { type RecordFilters, type RecordType } from '../../data/recordsData';
import { mockClients } from '../../data/clientsData';
import { mockTeamMembers } from '../../data/clientsData';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';

interface RecordsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: RecordFilters;
  onUpdateFilters: (filters: Partial<RecordFilters>) => void;
  onClearFilters: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  sortBy: string;
  onSortChange: (sort: any) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function RecordsFilterBar({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onUpdateFilters, 
  onClearFilters,
  showFilters,
  onToggleFilters,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCount
}: RecordsFilterBarProps) {
  const { isDarkMode } = useTheme();

  const recordTypes: RecordType[] = [
    'brief', 'budget', 'weekly-update', 'deliverable', 'export', 'note',
    'snapshot', 'compliance-log', 'canvassing-report', 'legislative-brief',
    'meeting-minutes', 'testimony', 'amendment-memo', 'qbr-summary'
  ];

  const handleTypeToggle = (type: RecordType) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onUpdateFilters({ types: newTypes });
  };

  const handleClientToggle = (clientId: string) => {
    const currentClients = filters.clientIds || [];
    const newClients = currentClients.includes(clientId)
      ? currentClients.filter(c => c !== clientId)
      : [...currentClients, clientId];
    onUpdateFilters({ clientIds: newClients });
  };

  const handleOwnerToggle = (ownerId: string) => {
    const currentOwners = filters.owners || [];
    const newOwners = currentOwners.includes(ownerId)
      ? currentOwners.filter(o => o !== ownerId)
      : [...currentOwners, ownerId];
    onUpdateFilters({ owners: newOwners });
  };

  const handleDepartmentToggle = (dept: string) => {
    const currentDepts = filters.departments || [];
    const newDepts = currentDepts.includes(dept)
      ? currentDepts.filter(d => d !== dept)
      : [...currentDepts, dept];
    onUpdateFilters({ departments: newDepts });
  };

  const activeFiltersCount = [
    filters.types?.length || 0,
    filters.clientIds?.length || 0,
    filters.owners?.length || 0,
    filters.departments?.length || 0,
    filters.statuses?.length || 0,
    filters.dateFrom ? 1 : 0,
    filters.isStarred ? 1 : 0,
    filters.hasAttachments ? 1 : 0,
    filters.isAIGenerated ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className={`border-b z-20 relative ${isDarkMode ? 'bg-[#09090b]/90 border-white/5' : 'bg-white/90 border-gray-200'} backdrop-blur-md`}>
      {/* Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search records, tags, or content..." 
            className={`
              w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border transition-all
              ${isDarkMode 
                ? 'bg-white/5 border-white/10 text-white focus:border-white/20 placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
              }
            `}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Filters Toggle */}
          <button 
            onClick={onToggleFilters}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all
              ${showFilters 
                ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900')
              }
            `}
          >
            <Filter size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>
                {activeFiltersCount}
              </span>
            )}
          </button>

          <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

          {/* View Toggle */}
          <div className={`flex items-center p-1 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm') : (isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')}`}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className={`
              pl-3 pr-8 py-2 rounded-lg text-sm border outline-none appearance-none cursor-pointer bg-no-repeat bg-[right_0.75rem_center]
              ${isDarkMode 
                ? 'bg-white/5 border-white/10 text-gray-300 hover:text-white' 
                : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900'
              }
            `}
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
          >
            <option value="recent">Recent</option>
            <option value="relevance">Relevance</option>
            <option value="client">Client</option>
            <option value="type">Type</option>
          </select>
        </div>
      </div>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-t overflow-hidden ${isDarkMode ? 'border-white/5 bg-[#09090b]' : 'border-gray-200 bg-gray-50/50'}`}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Basic Filters */}
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Date Range</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={filters.dateFrom || ''}
                          onChange={(e) => onUpdateFilters({ dateFrom: e.target.value })}
                          className={`flex-1 text-sm rounded-lg px-2 py-1.5 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="date"
                          value={filters.dateTo || ''}
                          onChange={(e) => onUpdateFilters({ dateTo: e.target.value })}
                          className={`flex-1 text-sm rounded-lg px-2 py-1.5 border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-300'}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '7d', days: 7 },
                          { label: '30d', days: 30 },
                          { label: '90d', days: 90 },
                        ].map(preset => (
                          <button
                            key={preset.label}
                            onClick={() => {
                              const today = new Date();
                              const past = new Date(today);
                              past.setDate(today.getDate() - preset.days);
                              onUpdateFilters({
                                dateFrom: past.toISOString().split('T')[0],
                                dateTo: today.toISOString().split('T')[0]
                              });
                            }}
                            className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'border-white/10 hover:bg-white/5 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-600'}`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Attributes</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'isAIGenerated', label: 'AI Generated' },
                        { key: 'hasAttachments', label: 'Has Attachments' },
                        { key: 'isStarred', label: 'Starred Only' },
                      ].map(attr => (
                        <label key={attr.key} className="flex items-center gap-2 cursor-pointer group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            // @ts-ignore
                            filters[attr.key] 
                              ? (isDarkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-600 border-indigo-600') 
                              : (isDarkMode ? 'border-white/20 group-hover:border-white/40' : 'border-gray-300 group-hover:border-gray-400')
                          }`}>
                            {/* @ts-ignore */}
                            {filters[attr.key] && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          {/* @ts-ignore */}
                          <input type="checkbox" className="hidden" checked={filters[attr.key] || false} onChange={(e) => onUpdateFilters({ [attr.key]: e.target.checked ? true : undefined })} />
                          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{attr.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Type */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Type</h4>
                  <div className={`rounded-lg border p-1 max-h-60 overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    {recordTypes.map(type => (
                      <label key={type} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          (filters.types || []).includes(type)
                            ? (isDarkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-600 border-indigo-600')
                            : (isDarkMode ? 'border-white/20' : 'border-gray-300')
                        }`}>
                          {(filters.types || []).includes(type) && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={(filters.types || []).includes(type)}
                          onChange={() => handleTypeToggle(type)}
                        />
                        <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {type.replace(/-/g, ' ')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clients */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Client</h4>
                  <div className={`rounded-lg border p-1 max-h-60 overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    {mockClients.map(client => (
                      <label key={client.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          (filters.clientIds || []).includes(client.id)
                            ? (isDarkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-600 border-indigo-600')
                            : (isDarkMode ? 'border-white/20' : 'border-gray-300')
                        }`}>
                          {(filters.clientIds || []).includes(client.id) && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={(filters.clientIds || []).includes(client.id)}
                          onChange={() => handleClientToggle(client.id)}
                        />
                        <span className={`text-sm truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {client.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Advanced */}
                <div className="space-y-6">
                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Department</h4>
                    <div className="space-y-1">
                      {['public-affairs', 'lobbying', 'campaign-services'].map(dept => (
                        <label key={dept} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            (filters.departments || []).includes(dept)
                              ? (isDarkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-600 border-indigo-600')
                              : (isDarkMode ? 'border-white/20' : 'border-gray-300')
                          }`}>
                            {(filters.departments || []).includes(dept) && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={(filters.departments || []).includes(dept)}
                            onChange={() => handleDepartmentToggle(dept)}
                          />
                          <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {dept.replace('-', ' ')}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status</h4>
                    <div className="space-y-1">
                      {['draft', 'final', 'sent', 'archived'].map(status => (
                        <label key={status} className={`flex items-center gap-2 p-1.5 rounded cursor-pointer ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            (filters.statuses || []).includes(status as any)
                              ? (isDarkMode ? 'bg-indigo-500 border-indigo-500' : 'bg-indigo-600 border-indigo-600')
                              : (isDarkMode ? 'border-white/20' : 'border-gray-300')
                          }`}>
                            {(filters.statuses || []).includes(status as any) && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={(filters.statuses || []).includes(status as any)}
                            onChange={() => {
                              const currentStatuses = filters.statuses || [];
                              const newStatuses = currentStatuses.includes(status as any)
                                ? currentStatuses.filter(s => s !== status)
                                : [...currentStatuses, status as any];
                              onUpdateFilters({ statuses: newStatuses });
                            }}
                          />
                          <span className={`text-sm capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {status}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <div className={`mt-6 pt-4 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <button
                  onClick={onClearFilters}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <X size={14} />
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}