import React from 'react';
import { 
  LayoutGrid, 
  ListChecks, 
  Calendar, 
  DollarSign, 
  Users, 
  Database,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { TabType } from './types';

import { useAppMode } from '../../contexts/AppModeContext';

interface WarRoomSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function WarRoomSidebar({ activeTab, onTabChange }: WarRoomSidebarProps) {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutGrid, description: 'Command center dashboard' },
    { id: 'projects' as TabType, label: 'Projects', icon: ListChecks, description: 'Task & milestone tracking' },
    { id: 'field-events' as TabType, label: 'Field & Events', icon: Calendar, description: 'Calendar & logistics' },
    { id: 'budget' as TabType, label: 'Budget & Resources', icon: DollarSign, description: 'Financial allocation' },
    { id: 'applicants' as TabType, label: 'Applicants', icon: Users, description: 'Onboarding & pipeline' },
    { id: 'data-pulls' as TabType, label: 'Data Pulls', icon: Database, description: 'Reporting & analytics' }
  ];

  return (
    <div className={`
      w-full md:w-72 flex-shrink-0 h-full flex flex-col md:border-r overflow-y-auto
      ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white/50'}
      backdrop-blur-sm
    `}>
      {/* Org Header - Removed per request */}

      <div className="p-4 space-y-1">
        <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Modules
        </div>
        
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full text-left group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? isDarkMode 
                    ? 'bg-blue-600/10 text-blue-400 ring-1 ring-blue-500/20' 
                    : 'bg-blue-50 text-blue-600 ring-1 ring-blue-200'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive 
                    ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                    : isDarkMode ? 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-gray-300' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                  }
                `}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className={`text-xs ${isActive ? 'opacity-80' : 'opacity-50 group-hover:opacity-70'}`}>
                    {tab.description}
                  </div>
                </div>
              </div>
              
              {isActive && (
                <ChevronRight size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick Stats or Info Box at bottom */}
      <div className="mt-auto p-4">
        <div className={`
          p-4 rounded-xl border
          ${isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
          }
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Active Cycle</span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-gray-600 shadow-sm'}`}>2026</span>
          </div>
          <div className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Campaign operations are running on schedule. Next major milestone in 14 days.
          </div>
        </div>
      </div>
    </div>
  );
}
