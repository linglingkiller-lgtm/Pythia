import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter,
  Database,
  Calendar,
  User,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  ChevronRight,
  Users
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { DataPull } from './types';
import { getAllDataPulls } from './dataPullsKV';
import { DataPullFormEnhanced } from './DataPullFormEnhanced';
import { DataPullDetail } from './DataPullDetail';

interface DataPullsHubProps {
  searchQuery?: string;
  filters?: any;
}

export function DataPullsHub({ searchQuery: externalSearchQuery, filters: externalFilters }: DataPullsHubProps) {
  const { isDarkMode } = useTheme();
  const [dataPulls, setDataPulls] = useState<DataPull[]>([]);
  const [filteredPulls, setFilteredPulls] = useState<DataPull[]>([]);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [selectedPull, setSelectedPull] = useState<DataPull | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string[]>(externalFilters?.status || []);
  const [projectFilter, setProjectFilter] = useState<string[]>(externalFilters?.project || []);
  const [stateFilter, setStateFilter] = useState<string[]>(externalFilters?.state || []);
  const [priorityFilter, setPriorityFilter] = useState<string[]>(externalFilters?.priority || []);

  // Theme colors
  const bgColor = isDarkMode ? 'bg-slate-800/40' : 'bg-white/40';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-slate-800/60' : 'bg-white/60';
  const cardHoverBg = isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-white/80';

  useEffect(() => {
    loadDataPulls();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dataPulls, searchQuery, statusFilter, projectFilter, stateFilter, priorityFilter]);

  async function loadDataPulls() {
    const pulls = await getAllDataPulls();
    setDataPulls(pulls);
  }

  function applyFilters() {
    let filtered = [...dataPulls];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pull =>
        pull.name.toLowerCase().includes(query) ||
        pull.state?.toLowerCase().includes(query) ||
        pull.projectName?.toLowerCase().includes(query) ||
        pull.geography.counties?.some(c => c.toLowerCase().includes(query)) ||
        pull.requesterUserName?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(pull => statusFilter.includes(pull.status));
    }

    // Project filter
    if (projectFilter.length > 0) {
      filtered = filtered.filter(pull => pull.projectId && projectFilter.includes(pull.projectId));
    }

    // State filter
    if (stateFilter.length > 0) {
      filtered = filtered.filter(pull => stateFilter.includes(pull.state));
    }

    // Priority filter
    if (priorityFilter.length > 0) {
      filtered = filtered.filter(pull => priorityFilter.includes(pull.priority));
    }

    setFilteredPulls(filtered);
  }

  function handleCreatePull(pull: DataPull) {
    setDataPulls(prev => [pull, ...prev]);
    setShowCreateForm(false);
  }

  function handleUpdatePull(updated: DataPull) {
    setDataPulls(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelectedPull(updated);
  }

  function toggleFilter(filterArray: string[], setFilter: React.Dispatch<React.SetStateAction<string[]>>, value: string) {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter(v => v !== value));
    } else {
      setFilter([...filterArray, value]);
    }
  }

  // Get unique values for filters
  const uniqueProjects = Array.from(new Set(dataPulls.map(p => p.projectName).filter(Boolean))) as string[];
  const uniqueStates = Array.from(new Set(dataPulls.map(p => p.state).filter(Boolean))) as string[];

  if (showCreateForm) {
    return (
      <DataPullFormEnhanced
        onSave={handleCreatePull}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  if (selectedPull) {
    return (
      <DataPullDetail
        pull={selectedPull}
        onUpdate={handleUpdatePull}
        onClose={() => setSelectedPull(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 
              className={`text-3xl font-black ${textColor} mb-2`}
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              DATA PULLS
            </h1>
            <p className={`text-sm ${textMuted}`}>
              Manage voter universe and data pull requests
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Plus size={20} />
            New Data Pull Request
          </button>
        </div>

        {/* Search & Filters */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${textMuted}`} size={20} />
            <input
              type="text"
              placeholder="Search by universe name, county, project, requester..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 ${isDarkMode ? 'bg-slate-900/60 text-white' : 'bg-white text-gray-900'} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className={textMuted} />
            
            {/* Status filters */}
            <FilterChip
              label="Requested"
              active={statusFilter.includes('requested')}
              onClick={() => toggleFilter(statusFilter, setStatusFilter, 'requested')}
              color="blue"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="In Progress"
              active={statusFilter.includes('in-progress')}
              onClick={() => toggleFilter(statusFilter, setStatusFilter, 'in-progress')}
              color="amber"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="Delivered"
              active={statusFilter.includes('delivered')}
              onClick={() => toggleFilter(statusFilter, setStatusFilter, 'delivered')}
              color="green"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="Revised"
              active={statusFilter.includes('revised')}
              onClick={() => toggleFilter(statusFilter, setStatusFilter, 'revised')}
              color="purple"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="Archived"
              active={statusFilter.includes('archived')}
              onClick={() => toggleFilter(statusFilter, setStatusFilter, 'archived')}
              color="gray"
              isDarkMode={isDarkMode}
            />

            {/* Priority filters */}
            <div className={`w-px h-6 ${borderColor} mx-2`} />
            <FilterChip
              label="High Priority"
              active={priorityFilter.includes('high')}
              onClick={() => toggleFilter(priorityFilter, setPriorityFilter, 'high')}
              color="red"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="Medium"
              active={priorityFilter.includes('medium')}
              onClick={() => toggleFilter(priorityFilter, setPriorityFilter, 'medium')}
              color="amber"
              isDarkMode={isDarkMode}
            />
            <FilterChip
              label="Low"
              active={priorityFilter.includes('low')}
              onClick={() => toggleFilter(priorityFilter, setPriorityFilter, 'low')}
              color="gray"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Pulls"
          value={dataPulls.length}
          icon={Database}
          color="blue"
          isDarkMode={isDarkMode}
          textColor={textColor}
          textMuted={textMuted}
          bgColor={bgColor}
          borderColor={borderColor}
        />
        <StatCard
          title="In Progress"
          value={dataPulls.filter(p => p.status === 'in-progress').length}
          icon={Clock}
          color="amber"
          isDarkMode={isDarkMode}
          textColor={textColor}
          textMuted={textMuted}
          bgColor={bgColor}
          borderColor={borderColor}
        />
        <StatCard
          title="Delivered"
          value={dataPulls.filter(p => p.status === 'delivered').length}
          icon={CheckCircle2}
          color="green"
          isDarkMode={isDarkMode}
          textColor={textColor}
          textMuted={textMuted}
          bgColor={bgColor}
          borderColor={borderColor}
        />
        <StatCard
          title="This Month"
          value={dataPulls.filter(p => {
            const created = new Date(p.createdAt);
            const now = new Date();
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length}
          icon={TrendingUp}
          color="purple"
          isDarkMode={isDarkMode}
          textColor={textColor}
          textMuted={textMuted}
          bgColor={bgColor}
          borderColor={borderColor}
        />
      </div>

      {/* Data Pulls List */}
      <div className="space-y-3">
        {filteredPulls.length === 0 ? (
          <div className={`${cardBg} ${borderColor} backdrop-blur-md border rounded-xl p-12 text-center`}>
            <Database size={48} className={`${textMuted} mx-auto mb-4`} />
            <h3 className={`text-xl font-bold ${textColor} mb-2`}>
              {dataPulls.length === 0 ? 'No data pulls yet' : 'No results found'}
            </h3>
            <p className={`${textMuted} mb-6`}>
              {dataPulls.length === 0 
                ? 'Create your first data pull request to get started'
                : 'Try adjusting your search or filters'
              }
            </p>
            {dataPulls.length === 0 && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Create First Data Pull
              </button>
            )}
          </div>
        ) : (
          filteredPulls.map(pull => (
            <DataPullCard
              key={pull.id}
              pull={pull}
              onClick={() => setSelectedPull(pull)}
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              cardBg={cardBg}
              cardHoverBg={cardHoverBg}
              borderColor={borderColor}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Filter Chip Component
interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  color: 'blue' | 'amber' | 'green' | 'purple' | 'gray' | 'red';
  isDarkMode: boolean;
}

function FilterChip({ label, active, onClick, color, isDarkMode }: FilterChipProps) {
  const colors = {
    blue: active 
      ? (isDarkMode ? 'bg-blue-950/60 text-blue-400 border-blue-500/50' : 'bg-blue-100 text-blue-700 border-blue-300')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
    amber: active
      ? (isDarkMode ? 'bg-amber-950/60 text-amber-400 border-amber-500/50' : 'bg-amber-100 text-amber-700 border-amber-300')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
    green: active
      ? (isDarkMode ? 'bg-green-950/60 text-green-400 border-green-500/50' : 'bg-green-100 text-green-700 border-green-300')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
    purple: active
      ? (isDarkMode ? 'bg-purple-950/60 text-purple-400 border-purple-500/50' : 'bg-purple-100 text-purple-700 border-purple-300')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
    gray: active
      ? (isDarkMode ? 'bg-gray-700/60 text-gray-300 border-gray-500/50' : 'bg-gray-200 text-gray-700 border-gray-400')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
    red: active
      ? (isDarkMode ? 'bg-red-950/60 text-red-400 border-red-500/50' : 'bg-red-100 text-red-700 border-red-300')
      : (isDarkMode ? 'bg-slate-700/40 text-gray-400 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'),
  };

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${colors[color]} hover:scale-105`}
    >
      {label}
    </button>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'amber' | 'green' | 'purple';
  isDarkMode: boolean;
  textColor: string;
  textMuted: string;
  bgColor: string;
  borderColor: string;
}

function StatCard({ title, value, icon: Icon, color, isDarkMode, textColor, textMuted, bgColor, borderColor }: StatCardProps) {
  const colorClasses = {
    blue: isDarkMode ? 'bg-blue-950/30 text-blue-400' : 'bg-blue-50 text-blue-600',
    amber: isDarkMode ? 'bg-amber-950/30 text-amber-400' : 'bg-amber-50 text-amber-600',
    green: isDarkMode ? 'bg-green-950/30 text-green-400' : 'bg-green-50 text-green-600',
    purple: isDarkMode ? 'bg-purple-950/30 text-purple-400' : 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`${bgColor} ${borderColor} backdrop-blur-md border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
      <div className={`text-3xl font-black ${textColor} mb-1`} style={{ fontFamily: '"Corpline", sans-serif' }}>
        {value}
      </div>
      <div className={`text-sm ${textMuted} font-semibold uppercase tracking-wide`}>
        {title}
      </div>
    </div>
  );
}

// Data Pull Card Component
interface DataPullCardProps {
  pull: DataPull;
  onClick: () => void;
  isDarkMode: boolean;
  textColor: string;
  textMuted: string;
  cardBg: string;
  cardHoverBg: string;
  borderColor: string;
}

function DataPullCard({ pull, onClick, isDarkMode, textColor, textMuted, cardBg, cardHoverBg, borderColor }: DataPullCardProps) {
  const statusConfig = {
    'requested': { label: 'Requested', color: isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-100 text-blue-700', icon: AlertCircle },
    'in-progress': { label: 'In Progress', color: isDarkMode ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-100 text-amber-700', icon: Clock },
    'delivered': { label: 'Delivered', color: isDarkMode ? 'bg-green-950/40 text-green-400' : 'bg-green-100 text-green-700', icon: CheckCircle2 },
    'revised': { label: 'Revised', color: isDarkMode ? 'bg-purple-950/40 text-purple-400' : 'bg-purple-100 text-purple-700', icon: TrendingUp },
    'archived': { label: 'Archived', color: isDarkMode ? 'bg-gray-700/40 text-gray-400' : 'bg-gray-100 text-gray-600', icon: Archive },
  };

  const status = statusConfig[pull.status];
  const StatusIcon = status.icon;

  const priorityConfig = {
    'high': isDarkMode ? 'text-red-400' : 'text-red-600',
    'medium': isDarkMode ? 'text-amber-400' : 'text-amber-600',
    'low': isDarkMode ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full ${cardBg} ${cardHoverBg} ${borderColor} backdrop-blur-md border rounded-xl p-6 text-left transition-all duration-200 hover:shadow-xl group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-bold ${textColor} group-hover:text-blue-600 transition-colors`}>
              {pull.name}
            </h3>
            {pull.priority === 'high' && (
              <div className={`px-2 py-0.5 rounded text-xs font-bold ${priorityConfig[pull.priority]}`}>
                HIGH
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${status.color} flex items-center gap-1`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
            {pull.projectName && (
              <span className={`text-xs ${textMuted} flex items-center gap-1`}>
                <Users size={12} />
                {pull.projectName}
              </span>
            )}
            <span className={`text-xs ${textMuted} flex items-center gap-1`}>
              <MapPin size={12} />
              {pull.state}
            </span>
            {pull.deliverable.dropDate && (
              <span className={`text-xs ${textMuted} flex items-center gap-1`}>
                <Calendar size={12} />
                Due: {new Date(pull.deliverable.dropDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={20} className={`${textMuted} group-hover:translate-x-1 transition-transform`} />
      </div>

      <div className={`text-sm ${textMuted} mb-4`}>
        {pull.geography.mode === 'counties' && pull.geography.counties && pull.geography.counties.length > 0
          ? pull.geography.counties.slice(0, 3).join(', ') + (pull.geography.counties.length > 3 ? ` +${pull.geography.counties.length - 3} more` : '')
          : 'Statewide'
        }
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {pull.stats && (
            <>
              {pull.stats.totalVoters !== undefined && (
                <div className="flex items-center gap-1">
                  <Users size={14} className={textMuted} />
                  <span className={`text-sm font-semibold ${textColor}`}>
                    {pull.stats.totalVoters.toLocaleString()}
                  </span>
                  <span className={`text-xs ${textMuted}`}>voters</span>
                </div>
              )}
              {pull.stats.countiesCount !== undefined && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} className={textMuted} />
                  <span className={`text-sm font-semibold ${textColor}`}>
                    {pull.stats.countiesCount}
                  </span>
                  <span className={`text-xs ${textMuted}`}>counties</span>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pull.outputs && pull.outputs.length > 0 && (
            <div className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} flex items-center gap-1`}>
              <FileSpreadsheet size={14} />
              {pull.outputs.length} output{pull.outputs.length > 1 ? 's' : ''}
            </div>
          )}
          {pull.requesterUserName && (
            <span className={`text-xs ${textMuted}`}>
              by {pull.requesterUserName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}