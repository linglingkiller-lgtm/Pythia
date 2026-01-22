import React from 'react';
import { Filter, Check, RotateCcw } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { GlassPanel } from '../shared/ElectionsSharedComponents';

export const OverviewFilters = () => {
  const { isDarkMode } = useTheme();

  const FilterSection = ({ title, options }: { title: string, options: string[] }) => (
    <div className="mb-6">
      <h4 className={`text-xs font-bold uppercase mb-3 tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{title}</h4>
      <div className="space-y-2">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-3 text-sm cursor-pointer group p-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5">
            <div className={`
              w-4 h-4 rounded border flex items-center justify-center transition-all shadow-sm
              ${isDarkMode 
                ? 'border-gray-600 bg-slate-800 group-hover:border-indigo-500' 
                : 'border-gray-300 bg-white group-hover:border-indigo-500'
              }
            `}>
              {/* Fake checked state for demo */}
              {Math.random() > 0.6 && <Check size={10} className="text-indigo-500 stroke-[3px]" />}
            </div>
            <span className={`font-medium transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
              {opt}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 pt-1">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-indigo-500" />
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
        </div>
        <button className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 transition-colors" title="Reset Filters">
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
        <FilterSection 
          title="Political Control" 
          options={['Strong Dem', 'Lean Dem', 'Swing / Tossup', 'Lean Rep', 'Strong Rep']} 
        />

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        <FilterSection 
          title="Race Type" 
          options={['State Senate', 'State House', 'Congressional', 'Local / Muni', 'Ballot Measure']} 
        />

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

        <div className="mb-6">
          <h4 className={`text-xs font-bold uppercase mb-3 tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Competitiveness</h4>
          <div className="px-2">
            <input 
              type="range" 
              className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-medium uppercase">
              <span>Safe</span>
              <span>Battleground</span>
            </div>
          </div>
        </div>

        <GlassPanel className="p-4 mt-8 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <h4 className={`text-xs font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Active Watchlists
          </h4>
          <div className="space-y-1">
             {['At Risk Incumbents', 'Money Surge > $50k', 'Flippable Seats'].map(list => (
               <div key={list} className="flex items-center justify-between text-sm py-1.5 px-2 rounded cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                 <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{list}</span>
                 <span className="text-[10px] font-bold bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500">4</span>
               </div>
             ))}
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};
