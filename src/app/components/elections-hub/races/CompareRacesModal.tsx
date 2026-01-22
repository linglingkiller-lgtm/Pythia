import React from 'react';
import { X, ArrowRightLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Race } from '../../../data/electionsHubData';
import { StatusChip, TrendSparkline } from '../shared/ElectionsSharedComponents';
import { Button } from '../../ui/Button';

interface CompareRacesModalProps {
  races: Race[];
  isOpen: boolean;
  onClose: () => void;
}

export const CompareRacesModal: React.FC<CompareRacesModalProps> = ({ races, isOpen, onClose }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || races.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-8" onClick={onClose}>
      <div 
        className={`w-full max-w-6xl max-h-[90vh] shadow-2xl rounded-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border border-white/10' : 'bg-white border border-gray-200'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex-shrink-0 p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
           <div className="flex items-center gap-3">
             <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
               <ArrowRightLeft size={24} />
             </div>
             <div>
               <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Compare Races</h2>
               <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Side-by-side analysis of {races.length} selected races</p>
             </div>
           </div>
           <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
             <X size={24} />
           </button>
        </div>

        {/* Content Grid */}
        <div className={`flex-1 overflow-auto p-6 ${isDarkMode ? 'bg-slate-950/50' : 'bg-gray-50/50'}`}>
           <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${races.length}, minmax(300px, 1fr))` }}>
              {races.map(race => (
                <div key={race.id} className={`rounded-xl border flex flex-col h-full ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}`}>
                   {/* Race Header */}
                   <div className={`p-5 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{race.district}</h3>
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{race.office}</div>
                        </div>
                        <StatusChip status={race.lean} />
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                         <div className="text-center">
                           <div className="text-[10px] text-gray-500 uppercase mb-1">Competitiveness</div>
                           <div className={`text-3xl font-black ${
                             race.competitivenessScore > 75 ? 'text-red-500' : 
                             race.competitivenessScore > 40 ? 'text-amber-500' : 'text-green-500'
                           }`}>
                             {race.competitivenessScore}
                           </div>
                         </div>
                         <div className="h-10 w-px bg-gray-200 dark:bg-gray-700" />
                         <div className="text-center">
                            <div className="text-[10px] text-gray-500 uppercase mb-1">Trend</div>
                            <div className="w-20">
                              <TrendSparkline data={race.trend.series} color={race.trend.direction === 'worsening' ? 'red' : 'green'} />
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Stats Body */}
                   <div className="p-5 space-y-6 flex-1">
                      {/* Money Heat */}
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Money Heat</div>
                        <div className="flex items-center gap-3">
                           <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500" style={{ width: `${race.moneyHeat}%` }} />
                           </div>
                           <span className="text-sm font-bold text-red-500">{race.moneyHeat}</span>
                        </div>
                      </div>

                      {/* Top Issues */}
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Top Issues</div>
                        <div className="space-y-2">
                          {race.topIssues.map((iss, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{iss.issue}</span>
                              <span className="font-mono text-gray-500">{iss.salience}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* District Profile */}
                      <div>
                        <div className="text-xs font-bold text-gray-500 uppercase mb-2">District Profile</div>
                        <div className={`p-3 rounded-lg text-sm space-y-2 ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                           <div className="flex justify-between">
                             <span className="text-gray-500">Median Income</span>
                             <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>${race.districtProfile.medianIncome.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-500">Urbanicity</span>
                             <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{race.districtProfile.urbanicityIndex}/100</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-gray-500">Ticket Split</span>
                             <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{race.districtProfile.ticketSplitIndex}/100</span>
                           </div>
                        </div>
                      </div>
                      
                      {/* Candidates */}
                      <div>
                         <div className="text-xs font-bold text-gray-500 uppercase mb-2">Candidate Field</div>
                         <div className="flex -space-x-2">
                            {race.candidates.map((cid, i) => (
                              <div key={i} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                                isDarkMode ? 'bg-slate-700 border-slate-900 text-white' : 'bg-gray-200 border-white text-gray-700'
                              }`}>
                                C{i+1}
                              </div>
                            ))}
                            {race.candidates.length === 0 && <span className="text-sm text-gray-500 italic">No candidates filed</span>}
                         </div>
                      </div>
                   </div>

                   {/* Footer Actions */}
                   <div className={`p-4 border-t mt-auto ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                      <Button variant="secondary" className="w-full justify-center">View Full Dossier</Button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
