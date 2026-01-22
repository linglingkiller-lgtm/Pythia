import React from 'react';
import { Star, FileText, Calendar, Eye } from 'lucide-react';
import { Legislator } from './legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface LegislatorListProps {
  legislators: Legislator[];
  selectedLegislator: Legislator | null;
  onSelectLegislator: (legislator: Legislator) => void;
  watchedLegislatorIds?: Set<string>;
}

export const LegislatorList = React.memo(function LegislatorList({ legislators, selectedLegislator, onSelectLegislator, watchedLegislatorIds }: LegislatorListProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-gray-200'}`}>
      {legislators.map((legislator) => (
        <LegislatorListItem
          key={legislator.id}
          legislator={legislator}
          isSelected={selectedLegislator?.id === legislator.id}
          onClick={() => onSelectLegislator(legislator)}
          watchedLegislatorIds={watchedLegislatorIds}
        />
      ))}
    </div>
  );
});

interface LegislatorListItemProps {
  legislator: Legislator;
  isSelected: boolean;
  onClick: () => void;
  watchedLegislatorIds?: Set<string>;
}

function LegislatorListItem({ legislator, isSelected, onClick, watchedLegislatorIds }: LegislatorListItemProps) {
  const { isDarkMode } = useTheme();
  
  const getPriorityColor = (priority: string) => {
    if (isDarkMode) {
      switch (priority) {
        case 'A': return 'bg-red-500/20 text-red-300 border border-red-500/30';
        case 'B': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
        case 'C': return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      }
    } else {
      switch (priority) {
        case 'A': return 'bg-red-100 text-red-700';
        case 'B': return 'bg-amber-100 text-amber-700';
        case 'C': return 'bg-gray-100 text-gray-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    }
  };

  const getRelationshipColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'warm': return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'cold': return 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
        case 'needs-follow-up': return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border border-gray-500/30';
      }
    } else {
      switch (status) {
        case 'warm': return 'bg-green-100 text-green-700';
        case 'cold': return 'bg-blue-100 text-blue-700';
        case 'needs-follow-up': return 'bg-amber-100 text-amber-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    }
  };

  const getRelationshipLabel = (status: string) => {
    switch (status) {
      case 'warm': return 'Warm';
      case 'cold': return 'Cold';
      case 'needs-follow-up': return 'Follow-up';
      default: return status;
    }
  };

  const getPartyColor = (party: string) => {
    if (isDarkMode) {
      return party === 'R' ? 'text-red-400' : 'text-blue-400';
    }
    return party === 'R' ? 'text-red-600' : 'text-blue-600';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 ${
        isDarkMode
          ? `hover:bg-white/5 ${
              isSelected 
                ? legislator.party === 'D'
                  ? 'bg-blue-900/30 border-l-4 border-blue-500'
                  : 'bg-red-900/30 border-l-4 border-red-500'
                : ''
            }`
          : `hover:bg-gray-50 ${
              isSelected 
                ? legislator.party === 'D'
                  ? 'bg-blue-50 border-l-4 border-blue-600'
                  : 'bg-red-50 border-l-4 border-red-600'
                : ''
            }`
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold ${
          isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
        }`}>
          {legislator.photoUrl ? (
            <img src={legislator.photoUrl} alt={legislator.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            legislator.initials
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold truncate ${getPartyColor(legislator.party)}`}>
                {legislator.name}
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {legislator.title} • {legislator.district} • {legislator.chamber}
              </p>
            </div>
          </div>

          {/* Chips */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityColor(legislator.priority)}`}>
              Priority {legislator.priority}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${getRelationshipColor(legislator.relationshipStatus)}`}>
              {getRelationshipLabel(legislator.relationshipStatus)}
            </span>
          </div>

          {/* Last Interaction */}
          <div className={`flex items-center justify-between text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <span>Last: {legislator.lastInteraction}</span>
            
            {/* Icons */}
            <div className="flex items-center gap-1.5">
              {watchedLegislatorIds?.has(legislator.id) && (
                <Eye size={14} className={isDarkMode ? 'text-red-400' : 'text-red-600'} title="Watching" />
              )}
              {legislator.hasNotes && (
                <FileText size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} title="Has notes" />
              )}
              {legislator.hasUpcomingMeeting && (
                <Calendar size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} title="Upcoming meeting" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}