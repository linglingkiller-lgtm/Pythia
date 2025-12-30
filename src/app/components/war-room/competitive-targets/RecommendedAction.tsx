import React from 'react';
import { Calendar, Users, MapPin, FileText, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';

export type ActionType = 
  | 'add-shifts' 
  | 'rebalance-canvassers' 
  | 'split-turf' 
  | 'request-data-pull' 
  | 'qa-review' 
  | 'fill-schedule-gaps';

export interface RecommendedActionData {
  id: string;
  type: ActionType;
  title: string;
  reason: string;
  impact: string;
  suggestedOwner?: string;
  dueDate?: string;
  impactDoorsPerDay?: number;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedActionProps {
  action: RecommendedActionData;
  onExecute: (action: RecommendedActionData) => void;
  onViewDetails: (action: RecommendedActionData) => void;
  onOwnerChange?: (actionId: string, owner: string) => void;
}

export const RecommendedAction: React.FC<RecommendedActionProps> = ({
  action,
  onExecute,
  onViewDetails,
  onOwnerChange
}) => {
  const { isDarkMode } = useTheme();

  const getActionIcon = (type: ActionType) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'add-shifts': return <Calendar {...iconProps} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />;
      case 'rebalance-canvassers': return <Users {...iconProps} className={isDarkMode ? "text-purple-400" : "text-purple-600"} />;
      case 'split-turf': return <MapPin {...iconProps} className={isDarkMode ? "text-green-400" : "text-green-600"} />;
      case 'request-data-pull': return <FileText {...iconProps} className={isDarkMode ? "text-orange-400" : "text-orange-600"} />;
      case 'qa-review': return <AlertTriangle {...iconProps} className={isDarkMode ? "text-rose-400" : "text-red-600"} />;
      case 'fill-schedule-gaps': return <TrendingUp {...iconProps} className={isDarkMode ? "text-indigo-400" : "text-indigo-600"} />;
    }
  };

  const getActionColors = (type: ActionType) => {
    switch (type) {
      case 'add-shifts': return isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200';
      case 'rebalance-canvassers': return isDarkMode ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-200';
      case 'split-turf': return isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
      case 'request-data-pull': return isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200';
      case 'qa-review': return isDarkMode ? 'bg-rose-500/10 border-rose-500/20' : 'bg-red-50 border-red-200';
      case 'fill-schedule-gaps': return isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200';
    }
  };

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'high': return isDarkMode ? 'bg-rose-500/20 text-rose-300' : 'bg-red-100 text-red-700';
      case 'medium': return isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-yellow-100 text-yellow-700';
      case 'low': return isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700';
      default: return '';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getActionColors(action.type)} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getActionIcon(action.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h4 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{action.title}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{action.reason}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${getPriorityColors(action.priority)}`}>
              {action.priority}
            </span>
          </div>

          {/* Impact */}
          <div className={`mb-3 p-2 rounded-md ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}`}>
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>EXPECTED IMPACT</p>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{action.impact}</p>
            {action.impactDoorsPerDay && (
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-emerald-400' : 'text-green-600'}`}>
                +{action.impactDoorsPerDay} doors/day
              </p>
            )}
          </div>

          {/* Owner & Due Date */}
          <div className="flex items-center gap-3 mb-3">
            {action.suggestedOwner && (
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Owner:</span>
                <select 
                  className={`text-xs px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 
                    ${isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-white border-gray-300 text-gray-900'}`}
                  value={action.suggestedOwner}
                  onChange={(e) => onOwnerChange?.(action.id, e.target.value)}
                >
                  <option value={action.suggestedOwner}>{action.suggestedOwner}</option>
                  <option value="Ben Blaser">Ben Blaser</option>
                  <option value="Jordan Hayes">Jordan Hayes</option>
                  <option value="Sam Chen">Sam Chen</option>
                  <option value="Taylor Brooks">Taylor Brooks</option>
                </select>
              </div>
            )}
            {action.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Calendar size={12} />
                <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => onExecute(action)}
            >
              {action.type === 'add-shifts' && 'Create Shifts'}
              {action.type === 'rebalance-canvassers' && 'Propose Reassignment'}
              {action.type === 'split-turf' && 'Split Turf'}
              {action.type === 'request-data-pull' && 'Create Data Pull'}
              {action.type === 'qa-review' && 'Create QA Tasks'}
              {action.type === 'fill-schedule-gaps' && 'Auto-Schedule'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onViewDetails(action)}
              className={isDarkMode ? 'text-gray-300 hover:text-white hover:bg-white/10' : ''}
            >
              Details
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
