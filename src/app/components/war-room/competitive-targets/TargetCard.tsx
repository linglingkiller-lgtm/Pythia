import React from 'react';
import { AlertTriangle, Users, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export interface TargetData {
  id: string;
  projectName: string;
  geography: string;
  clientName: string;
  doorGoalTotal: number;
  doorsKnockedToDate: number;
  doorsRemaining: number;
  startDate: string;
  endDate: string;
  activeCanvassersCount: number;
  avgDoorsPerDay7: number;
  avgDoorsPerShift7: number;
  requiredDoorsPerDay: number;
  shiftsNext7Days: number;
  primaryBlocker?: 'understaffed' | 'no-turf' | 'low-density' | 'qa-flags' | 'schedule-gaps';
  paceStatus: 'on-track' | 'slightly-behind' | 'at-risk';
  projectedFinish: string;
  daysRemaining: number;
}

interface TargetCardProps {
  target: TargetData;
  isSelected: boolean;
  onClick: () => void;
  isSelectable?: boolean;
  isChecked?: boolean;
  onCheckChange?: (checked: boolean) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({ 
  target, 
  isSelected, 
  onClick, 
  isSelectable = false,
  isChecked = false,
  onCheckChange
}) => {
  const { isDarkMode } = useTheme();
  const progressPercent = (target.doorsKnockedToDate / target.doorGoalTotal) * 100;
  
  const blockerLabels = {
    'understaffed': 'Understaffed',
    'no-turf': 'No Turf',
    'low-density': 'Low Density',
    'qa-flags': 'QA Flags',
    'schedule-gaps': 'Schedule Gaps'
  };

  const blockerColors = {
    'understaffed': 'bg-red-500/10 text-red-500 border-red-500/20',
    'no-turf': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    'low-density': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    'qa-flags': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'schedule-gaps': 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  };

  const paceStatusColors = {
    'on-track': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    'slightly-behind': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'at-risk': 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  const paceStatusLabels = {
    'on-track': 'On Track',
    'slightly-behind': 'Slightly Behind',
    'at-risk': 'At Risk'
  };

  return (
    <div 
      className={`
        relative rounded-xl border p-4 cursor-pointer transition-all duration-200 group
        ${isSelected 
          ? isDarkMode 
            ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
            : 'bg-blue-50 border-blue-500 shadow-md'
          : isDarkMode
            ? 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-slate-600'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
        }
      `}
      onClick={onClick}
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          {isSelectable && (
            <div className="pt-1" onClick={(e) => e.stopPropagation()}>
              <input 
                type="checkbox" 
                checked={isChecked}
                onChange={(e) => onCheckChange?.(e.target.checked)}
                className="rounded border-gray-500 text-blue-600 focus:ring-blue-500/50 bg-transparent"
              />
            </div>
          )}
          
          <div>
            <h4 className={`text-sm font-semibold mb-0.5 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {target.projectName}
            </h4>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {target.geography}
            </div>
          </div>
        </div>

        <div className={`
          px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider
          ${paceStatusColors[target.paceStatus]}
        `}>
          {paceStatusLabels[target.paceStatus]}
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-700/50 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
          {target.clientName}
        </span>
        {target.primaryBlocker && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded border ${blockerColors[target.primaryBlocker]}`}>
            {blockerLabels[target.primaryBlocker]}
          </span>
        )}
      </div>

      {/* Progress Section */}
      <div className="mb-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Progress</span>
          <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              target.paceStatus === 'at-risk' ? 'bg-rose-500' :
              target.paceStatus === 'slightly-behind' ? 'bg-amber-500' :
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        <div className={`flex justify-between text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span>{target.doorsKnockedToDate.toLocaleString()} / {target.doorGoalTotal.toLocaleString()} doors</span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {target.daysRemaining} days left
          </span>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className={`pt-2 border-t grid grid-cols-2 gap-4 ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <div className={`text-[10px] mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Active Staff
          </div>
          <div className={`text-xs font-medium flex items-center gap-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Users size={12} className="text-blue-500" />
            {target.activeCanvassersCount} active
          </div>
        </div>
        <div>
           <div className={`text-[10px] mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Daily Pace
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <TrendingUp size={12} className={target.avgDoorsPerDay7 < target.requiredDoorsPerDay ? 'text-rose-500' : 'text-emerald-500'} />
            <span className={`font-medium ${
              target.avgDoorsPerDay7 < target.requiredDoorsPerDay 
                ? 'text-rose-500' 
                : isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}>
              {target.avgDoorsPerDay7}
            </span>
            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>
              / {target.requiredDoorsPerDay} needed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};