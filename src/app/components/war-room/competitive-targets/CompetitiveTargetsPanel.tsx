import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { Button } from '../../ui/Button';
import { TargetCard, TargetData } from './TargetCard';
import { useTheme } from '../../../contexts/ThemeContext';

// Mock data
const mockTargets: TargetData[] = [
  {
    id: '1',
    projectName: 'CA-45 Canvassing',
    geography: 'Orange County, CA',
    clientName: 'TGA',
    doorGoalTotal: 15000,
    doorsKnockedToDate: 10240,
    doorsRemaining: 4760,
    startDate: '2026-01-15',
    endDate: '2026-03-01',
    activeCanvassersCount: 17,
    avgDoorsPerDay7: 820,
    avgDoorsPerShift7: 28,
    requiredDoorsPerDay: 950,
    shiftsNext7Days: 18,
    primaryBlocker: 'understaffed',
    paceStatus: 'at-risk',
    projectedFinish: '2026-03-03',
    daysRemaining: 12
  },
  {
    id: '2',
    projectName: 'NJ-11 Door Knock',
    geography: 'Morris County, NJ',
    clientName: 'American Majority',
    doorGoalTotal: 8500,
    doorsKnockedToDate: 6200,
    doorsRemaining: 2300,
    startDate: '2026-01-20',
    endDate: '2026-02-28',
    activeCanvassersCount: 12,
    avgDoorsPerDay7: 480,
    avgDoorsPerShift7: 25,
    requiredDoorsPerDay: 460,
    shiftsNext7Days: 14,
    paceStatus: 'on-track',
    projectedFinish: '2026-02-27',
    daysRemaining: 10
  },
  {
    id: '3',
    projectName: 'VA-24 Outreach',
    geography: 'Loudoun County, VA',
    clientName: 'TGA',
    doorGoalTotal: 12000,
    doorsKnockedToDate: 7500,
    doorsRemaining: 4500,
    startDate: '2026-01-10',
    endDate: '2026-02-25',
    activeCanvassersCount: 14,
    avgDoorsPerDay7: 650,
    avgDoorsPerShift7: 30,
    requiredDoorsPerDay: 720,
    shiftsNext7Days: 12,
    primaryBlocker: 'schedule-gaps',
    paceStatus: 'slightly-behind',
    projectedFinish: '2026-02-27',
    daysRemaining: 7
  },
  {
    id: '4',
    projectName: 'PA-18 Canvass',
    geography: 'Allegheny County, PA',
    clientName: 'American Majority',
    doorGoalTotal: 20000,
    doorsKnockedToDate: 15200,
    doorsRemaining: 4800,
    startDate: '2026-01-05',
    endDate: '2026-03-15',
    activeCanvassersCount: 22,
    avgDoorsPerDay7: 1100,
    avgDoorsPerShift7: 32,
    requiredDoorsPerDay: 960,
    shiftsNext7Days: 21,
    paceStatus: 'on-track',
    projectedFinish: '2026-03-10',
    daysRemaining: 26
  },
  {
    id: '5',
    projectName: 'GA-34 Field Program',
    geography: 'Gwinnett County, GA',
    clientName: 'TGA',
    doorGoalTotal: 10000,
    doorsKnockedToDate: 3200,
    doorsRemaining: 6800,
    startDate: '2026-02-01',
    endDate: '2026-03-20',
    activeCanvassersCount: 8,
    avgDoorsPerDay7: 320,
    avgDoorsPerShift7: 22,
    requiredDoorsPerDay: 425,
    shiftsNext7Days: 8,
    primaryBlocker: 'no-turf',
    paceStatus: 'at-risk',
    projectedFinish: '2026-03-25',
    daysRemaining: 31
  }
];

export type FilterType = 'all' | 'behind-pace' | 'understaffed' | 'data-blocked' | 'qa-risk';

interface CompetitiveTargetsPanelProps {
  // Controlled Props
  selectedTargetId: string | null;
  onSelectTarget: (target: TargetData) => void;
  bulkMode: boolean;
  selectedTargetIds: Set<string>;
  onToggleTargetSelection: (targetId: string, checked: boolean) => void;
}

export const CompetitiveTargetsPanel: React.FC<CompetitiveTargetsPanelProps> = ({ 
  selectedTargetId,
  onSelectTarget,
  bulkMode,
  selectedTargetIds,
  onToggleTargetSelection
}) => {
  const { isDarkMode } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  // Filter targets
  const filteredTargets = mockTargets.filter(target => {
    // Local Search filter
    if (localSearchQuery) {
      const query = localSearchQuery.toLowerCase();
      if (!target.projectName.toLowerCase().includes(query) && 
          !target.geography.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Status filter
    switch (activeFilter) {
      case 'behind-pace':
        return target.paceStatus === 'slightly-behind' || target.paceStatus === 'at-risk';
      case 'understaffed':
        return target.primaryBlocker === 'understaffed';
      case 'data-blocked':
        return target.primaryBlocker === 'no-turf' || target.primaryBlocker === 'low-density';
      case 'qa-risk':
        return target.primaryBlocker === 'qa-flags';
      default:
        return true;
    }
  });

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header: Section Label + Search + Filters */}
      <div className={`
        flex-none p-4 border-b z-10 sticky top-0 backdrop-blur-md
        ${isDarkMode ? 'bg-slate-900/60 border-white/5' : 'bg-white/60 border-gray-200'}
      `}>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Targets
        </h3>

        {/* Search */}
        <div className="relative mb-3">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={14} />
          <input
            type="text"
            placeholder="Search targets, tags, risk types..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className={`
              w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500/50
              ${isDarkMode 
                ? 'bg-slate-800 border-slate-700 text-gray-200 placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
              }
            `}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'behind-pace', 'understaffed', 'data-blocked', 'qa-risk'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors border
                ${activeFilter === filter
                  ? isDarkMode 
                    ? 'bg-blue-600 border-blue-500 text-white' 
                    : 'bg-blue-600 border-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-gray-400 hover:text-gray-200 hover:border-slate-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {filter === 'all' ? 'All' :
               filter === 'behind-pace' ? 'Behind Pace' :
               filter === 'understaffed' ? 'Understaffed' :
               filter === 'data-blocked' ? 'Data Blocked' :
               'QA Risk'}
            </button>
          ))}
        </div>
      </div>

      {/* Targets List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTargets.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No targets match this filter.</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 text-xs"
              onClick={() => setActiveFilter('all')}
            >
              Show all targets
            </Button>
          </div>
        ) : (
          filteredTargets.map((target) => (
            <TargetCard
              key={target.id}
              target={target}
              isSelected={selectedTargetId === target.id}
              onClick={() => onSelectTarget(target)}
              isSelectable={bulkMode}
              isChecked={selectedTargetIds.has(target.id)}
              onCheckChange={(checked) => onToggleTargetSelection(target.id, checked)}
            />
          ))
        )}
      </div>
    </div>
  );
};