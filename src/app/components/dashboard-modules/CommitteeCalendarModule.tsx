import React from 'react';
import { Calendar, MapPin, Users, ChevronRight, Clock } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AgendaItem } from '../../services/AiBriefingService';

interface CommitteeCalendarModuleProps {
  module: DashboardModule;
  agenda?: AgendaItem[];
}

export function CommitteeCalendarModule({ module, agenda = [] }: CommitteeCalendarModuleProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {agenda.length > 0 ? (
          <div className="relative border-l-2 border-dashed ml-3 pl-6 space-y-6 pb-2" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
            {agenda.map((item, index) => (
              <div key={item.id} className="relative group">
                {/* Timeline Dot */}
                <div className={`
                  absolute -left-[29px] top-1.5 w-3.5 h-3.5 rounded-full border-2 transition-all duration-300
                  ${index === 0 
                    ? (isDarkMode ? 'bg-purple-500 border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-purple-600 border-purple-500 shadow-md')
                    : (isDarkMode ? 'bg-slate-900 border-slate-600 group-hover:border-purple-500' : 'bg-white border-gray-300 group-hover:border-purple-500')
                  }
                `} />
                
                <div className={`
                  p-3 rounded-xl border transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' 
                    : 'bg-gray-50 border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm'
                  }
                `}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`
                      text-xs font-bold px-2 py-0.5 rounded
                      ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}
                    `}>
                      {item.time}
                    </span>
                    <span className={`text-[10px] uppercase font-medium tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {item.type}
                    </span>
                  </div>
                  
                  <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                  
                  <div className="flex flex-col gap-1.5 mt-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {item.location}
                      </span>
                    </div>
                    
                    {item.attendees && (
                      <div className="flex items-center gap-2">
                        <Users size={12} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {item.attendees.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Calendar size={32} className={`mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No agenda items scheduled for this period.
            </p>
          </div>
        )}
      </div>
      
      <div className={`mt-4 pt-3 border-t flex justify-end ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <button className={`
          text-xs font-medium flex items-center gap-1 transition-colors
          ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}
        `}>
          Full Calendar
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
