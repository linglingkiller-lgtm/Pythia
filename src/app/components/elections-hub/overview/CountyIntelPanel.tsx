import React from 'react';
import { ChevronRight, ArrowRight, TrendingUp, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { County, Race } from '../../../data/electionsHubData';
import { GlassPanel, StatusChip } from '../shared/ElectionsSharedComponents';
import { Button } from '../../ui/Button';

interface CountyIntelPanelProps {
  county: County | null;
  races: Race[];
  onOpenRace: (race: Race) => void;
}

export const CountyIntelPanel: React.FC<CountyIntelPanelProps> = ({ county, races, onOpenRace }) => {
  const { isDarkMode } = useTheme();

  if (!county) {
    return (
      <div className={`h-full flex flex-col items-center justify-center text-center p-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 animate-pulse">
          <ArrowRight size={32} className="opacity-50" />
        </div>
        <h3 className="text-lg font-bold mb-2">Select a Region</h3>
        <p className="text-sm max-w-[200px]">Click on any county on the map to view real-time intelligence briefing.</p>
      </div>
    );
  }

  const countyRaces = races.filter(r => r.countyIds.includes(county.id));
  const avgComp = Math.round(countyRaces.reduce((acc, r) => acc + r.competitivenessScore, 0) / (countyRaces.length || 1));

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
           <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{county.name} County</h2>
           <StatusChip status={county.lean} size="md" variant="lean" />
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
           <span className="flex items-center gap-1"><Users size={12} /> {countyRaces.length} Active Races</span>
           <span className="flex items-center gap-1"><AlertTriangle size={12} /> 2 Critical Risks</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
        {/* Pulse Card */}
        <GlassPanel className="p-0 overflow-hidden bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5">
          <div className="p-4 border-b border-gray-100 dark:border-white/5">
            <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Regional Pulse</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-1">Avg Competitiveness</div>
                <div className="flex items-end gap-2">
                  <div className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{avgComp}</div>
                  <div className={`text-xs font-bold mb-1 ${avgComp > 50 ? 'text-red-500' : 'text-green-500'}`}>High</div>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase mb-1">Net Money Flow</div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-black text-green-500">+$1.2M</div>
                  <TrendingUp size={16} className="text-green-500 mb-1.5" />
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50/50 dark:bg-black/20">
             <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">Top Narratives</div>
             <div className="flex flex-wrap gap-1.5">
               {['Cost of Living', 'Water Rights', 'Border Security'].map(tag => (
                 <span key={tag} className={`text-[10px] px-2 py-1 rounded border font-medium ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : 'border-gray-200 bg-white text-gray-600'}`}>
                   {tag}
                 </span>
               ))}
             </div>
          </div>
        </GlassPanel>

        {/* Races List */}
        <div>
          <div className="flex items-center justify-between mb-3">
             <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key Races</h3>
             <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400">VIEW ALL</button>
          </div>
          
          <div className="space-y-3">
            {countyRaces.map(race => (
              <GlassPanel 
                key={race.id} 
                className="group p-4 cursor-pointer hover:border-indigo-500/30 hover:shadow-lg transition-all"
                onClick={() => onOpenRace(race)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{race.office}</span>
                        {race.ourInvolvement.hasWarRoom && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        )}
                     </div>
                     <div className={`font-black text-lg leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{race.district}</div>
                  </div>
                  <div className={`text-xl font-bold ${
                    race.competitivenessScore > 70 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {race.competitivenessScore}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-white/5 opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Users size={10} /> {race.candidates.length}</span>
                      <span className="flex items-center gap-1"><DollarSign size={10} /> {race.moneyHeat}% Heat</span>
                   </div>
                   <div className="text-xs font-bold text-indigo-500 flex items-center">
                     Open <ChevronRight size={10} />
                   </div>
                </div>
              </GlassPanel>
            ))}
            {countyRaces.length === 0 && (
               <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                 No key races tracked in this county.
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
