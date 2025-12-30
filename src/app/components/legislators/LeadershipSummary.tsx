import React from 'react';
import { LeadershipPosition } from './chamberData';
import { Crown, Users, ChevronRight, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LeadershipSummaryProps {
  positions: LeadershipPosition[];
  onSelectLegislator: (legislatorId: string) => void;
}

export function LeadershipSummary({ positions, onSelectLegislator }: LeadershipSummaryProps) {
  const { isDarkMode } = useTheme();
  const houseLeadership = positions.filter(p => p.chamber === 'House');
  const senateLeadership = positions.filter(p => p.chamber === 'Senate');

  return (
    <div className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
      isDarkMode
        ? 'bg-slate-900/40 backdrop-blur-sm border border-white/10'
        : 'bg-white shadow-sm'
    }`}>
      {/* Header with gradient */}
      <div className={`border-b px-8 py-6 ${
        isDarkMode
          ? 'bg-gradient-to-r from-purple-900/30 to-violet-900/30 border-purple-500/20'
          : 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shadow-sm ${
            isDarkMode
              ? 'bg-slate-800/50 border border-purple-500/20'
              : 'bg-white'
          }`}>
            <Crown size={24} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
          </div>
          <div>
            <h3 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Leadership</h3>
            <p className={`text-sm mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Key positions across both chambers</p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-2 gap-8">
          {/* House Leadership */}
          <div>
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <Users size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <h4 className={`font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>House Leadership</h4>
            </div>
            <div className="space-y-2">
              {houseLeadership.map((position, idx) => (
                <LeadershipCard
                  key={idx}
                  position={position}
                  onClick={() => onSelectLegislator(position.legislatorId)}
                />
              ))}
            </div>
          </div>

          {/* Senate Leadership */}
          <div>
            <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <Users size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <h4 className={`font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Senate Leadership</h4>
            </div>
            <div className="space-y-2">
              {senateLeadership.map((position, idx) => (
                <LeadershipCard
                  key={idx}
                  position={position}
                  onClick={() => onSelectLegislator(position.legislatorId)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LeadershipCardProps {
  position: LeadershipPosition;
  onClick: () => void;
}

function LeadershipCard({ position, onClick }: LeadershipCardProps) {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 group ${
        isDarkMode
          ? 'bg-slate-800/50 hover:bg-slate-800 border-white/10 hover:border-white/20 hover:shadow-lg hover:shadow-red-500/10'
          : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`font-bold transition-colors duration-200 ${
          isDarkMode
            ? 'text-white group-hover:text-red-400'
            : 'text-gray-900 group-hover:text-red-700'
        }`}>
          {position.legislatorName}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded-md font-bold shadow-sm ${
            position.party === 'R' 
              ? isDarkMode
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-red-100 text-red-700 border border-red-200'
              : isDarkMode
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {position.party}-{position.district}
          </span>
          <ChevronRight 
            size={16} 
            className={`transition-transform duration-200 ${
              isHovered 
                ? isDarkMode
                  ? 'translate-x-1 text-red-400'
                  : 'translate-x-1 text-red-700'
                : isDarkMode
                ? 'text-gray-500'
                : 'text-gray-400'
            }`}
          />
        </div>
      </div>
      <div className={`text-sm font-medium mb-2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>{position.role}</div>
      {position.role.includes('Chair') && (
        <div className="flex items-center gap-1">
          <Star size={12} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
          <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${
            isDarkMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            Leadership
          </span>
        </div>
      )}
    </button>
  );
}