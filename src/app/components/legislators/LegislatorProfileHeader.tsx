import React from 'react';
import { Eye, EyeOff, FileText, Users, TrendingUp, Calendar } from 'lucide-react';
import { Legislator } from './legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface LegislatorProfileHeaderProps {
  legislator: Legislator;
  watchedLegislatorIds?: Set<string>;
  onToggleWatch?: (legislatorId: string) => void;
}

export function LegislatorProfileHeader({ legislator, watchedLegislatorIds, onToggleWatch }: LegislatorProfileHeaderProps) {
  const { isDarkMode } = useTheme();
  const isWatched = watchedLegislatorIds ? watchedLegislatorIds.has(legislator.id) : legislator.watched;

  const getPartyColor = (party: string) => {
    if (isDarkMode) {
      return party === 'R' ? 'text-red-400' : 'text-blue-400';
    }
    return party === 'R' ? 'text-red-600' : 'text-blue-600';
  };

  const getPartyBadge = (party: string) => {
    if (isDarkMode) {
      return party === 'R' 
        ? 'bg-red-500/20 text-red-300 border-red-500/30'
        : 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
    return party === 'R' 
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  return (
    <div className={`border-b p-6 transition-colors duration-500 ${
      isDarkMode
        ? 'bg-slate-900/40 backdrop-blur-sm border-white/10'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xl ${
            isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-700'
          }`}>
            {legislator.photoUrl ? (
              <img src={legislator.photoUrl} alt={legislator.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              legislator.initials
            )}
          </div>

          {/* Name & Title */}
          <div>
            <h1 className={`text-2xl font-semibold mb-1 ${getPartyColor(legislator.party)}`}>
              {legislator.name}
            </h1>
            <div className={`flex items-center gap-2 mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>{legislator.title}</span>
              <span>•</span>
              <span>{legislator.district}</span>
              <span>•</span>
              <span>{legislator.chamber}</span>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`text-xs px-2 py-1 rounded border ${getPartyBadge(legislator.party)}`}>
                {legislator.party === 'R' ? 'Republican' : 'Democrat'}
              </span>
              
              {legislator.committees.slice(0, 2).map((committee, idx) => (
                <span key={idx} className={`text-xs px-2 py-1 rounded border ${
                  isDarkMode
                    ? 'bg-slate-700/50 text-gray-300 border-white/10'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}>
                  {committee.name}
                  {committee.role !== 'Member' && ` (${committee.role})`}
                </span>
              ))}
              
              {legislator.committees.length > 2 && (
                <span className={`text-xs px-2 py-1 rounded ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-400'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  +{legislator.committees.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Watch Button */}
        <button
          onClick={() => onToggleWatch?.(legislator.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
            isWatched
              ? isDarkMode
                ? 'bg-red-900/30 border-red-500/30 text-red-300 hover:bg-red-900/40'
                : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
              : isDarkMode
              ? 'bg-slate-800/50 border-white/10 text-gray-300 hover:bg-slate-700/50'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isWatched ? <Eye size={16} /> : <EyeOff size={16} />}
          {isWatched ? 'Watching' : 'Watch'}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className={`p-4 rounded border transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <FileText size={16} />
            <span>Bills Sponsored</span>
          </div>
          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.sponsoredBills.length}</div>
        </div>

        <div className={`p-4 rounded border transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <TrendingUp size={16} />
            <span>Relevant Bills</span>
          </div>
          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.relevantBills.length}</div>
        </div>

        <div className={`p-4 rounded border transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Users size={16} />
            <span>Last Interaction</span>
          </div>
          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.lastInteraction}</div>
        </div>

        <div className={`p-4 rounded border transition-colors duration-500 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`flex items-center gap-2 text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <Calendar size={16} />
            <span>Next Touch</span>
          </div>
          <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {legislator.nextRecommendedTouch || 'None scheduled'}
          </div>
        </div>
      </div>
    </div>
  );
}