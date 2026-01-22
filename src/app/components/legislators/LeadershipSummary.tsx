import React from 'react';
import { LeadershipPosition } from './chamberData';
import { Crown, Users, ChevronRight, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LeadershipSummaryProps {
  positions: LeadershipPosition[];
  onSelectLegislator: (legislatorId: string) => void;
  isEmbedded?: boolean;
}

export function LeadershipSummary({ positions, onSelectLegislator, isEmbedded = false }: LeadershipSummaryProps) {
  const { isDarkMode } = useTheme();
  const houseLeadership = positions.filter(p => p.chamber === 'House');
  const senateLeadership = positions.filter(p => p.chamber === 'Senate');

  // If embedded, we rely on the parent container (OverviewDashboard) for the main shell/header.
  // We just render the content list.
  if (isEmbedded) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-4">
             {/* House Column */}
             <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>House</div>
                <div className="space-y-1">
                   {houseLeadership.map((position, idx) => (
                      <LeadershipCard
                         key={idx}
                         position={position}
                         onClick={() => onSelectLegislator(position.legislatorId)}
                         isEmbedded={true}
                      />
                   ))}
                </div>
             </div>
             
             {/* Senate Column */}
             <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Senate</div>
                <div className="space-y-1">
                   {senateLeadership.map((position, idx) => (
                      <LeadershipCard
                         key={idx}
                         position={position}
                         onClick={() => onSelectLegislator(position.legislatorId)}
                         isEmbedded={true}
                      />
                   ))}
                </div>
             </div>
         </div>
      </div>
    );
  }

  // Standalone Version (original)
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
                  isEmbedded={false}
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
                  isEmbedded={false}
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
  isEmbedded: boolean;
}

function LeadershipCard({ position, onClick, isEmbedded }: LeadershipCardProps) {
  const { isDarkMode } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const embeddedClasses = `
    w-full text-left p-3 rounded-lg border transition-all duration-200 group flex items-start justify-between
    ${isDarkMode ? 'bg-white/5 border-transparent hover:bg-white/10' : 'bg-gray-50 border-transparent hover:bg-gray-100'}
  `;
  
  const standardClasses = `
    w-full text-left p-4 rounded-lg border transition-all duration-200 group
    ${isDarkMode 
        ? 'bg-slate-800/50 hover:bg-slate-800 border-white/10 hover:border-white/20 hover:shadow-lg' 
        : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
    }
  `;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isEmbedded ? embeddedClasses : standardClasses}
    >
       <div className="min-w-0">
          <div className={`font-bold truncate ${
             isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'
          } ${isEmbedded ? 'text-xs' : ''}`}>
             {position.legislatorName}
          </div>
          <div className={`truncate ${
             isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } ${isEmbedded ? 'text-[10px]' : 'text-sm font-medium'}`}>
             {position.role}
          </div>
       </div>
       
       <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ml-2 ${
           position.party === 'R' 
             ? isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
             : isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
       }`}>
           {position.party}-{position.district}
       </span>
    </button>
  );
}
