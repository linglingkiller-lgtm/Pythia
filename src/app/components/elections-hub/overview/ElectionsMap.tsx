import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { County } from '../../../data/electionsHubData';
import { ArizonaMap } from './ArizonaMap';

interface ElectionsMapProps {
  counties: County[];
  selectedCountyId: string | null;
  onSelectCounty: (id: string) => void;
  layer: string;
}

export const ElectionsMap: React.FC<ElectionsMapProps> = ({ counties, selectedCountyId, onSelectCounty, layer }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl border bg-slate-50/50 dark:bg-slate-900/50 border-gray-200 dark:border-white/5 shadow-inner">
       {/* Background Grid */}
       <div 
         className="absolute inset-0 opacity-[0.03] pointer-events-none" 
         style={{ 
            backgroundImage: `linear-gradient(90deg, currentColor 1px, transparent 1px), linear-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            color: isDarkMode ? '#ffffff' : '#000000'
         }} 
       />

       {/* Map Container */}
       <div className="relative w-full h-full z-10">
          <ArizonaMap 
            counties={counties} 
            selectedCountyId={selectedCountyId} 
            onSelectCounty={onSelectCounty}
            layer={layer}
          />
       </div>
       
       {/* Legend Overlay */}
       <div className="absolute bottom-6 left-6 p-4 rounded-xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-white/10 text-xs shadow-lg z-20">
          <div className="font-bold mb-3 uppercase tracking-wider text-gray-500">Layer: {layer}</div>
          <div className="space-y-2">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" /> 
               <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Strong Dem</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm" /> 
               <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Lean Dem</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" /> 
               <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Swing / Tossup</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" /> 
               <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Lean Rep</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm" /> 
               <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Strong Rep</span>
             </div>
          </div>
       </div>
    </div>
  );
};
