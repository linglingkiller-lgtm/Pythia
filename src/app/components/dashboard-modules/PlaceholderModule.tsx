import React from 'react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';

interface PlaceholderModuleProps {
  module: DashboardModule;
}

export function PlaceholderModule({ module }: PlaceholderModuleProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="space-y-4">
      <div className="text-center py-8">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3
          ${isDarkMode 
            ? 'bg-purple-500/20' 
            : 'bg-purple-100'
          }
        `}>
          <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Module Content
        </p>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {module.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} data will appear here
        </p>
      </div>

      {/* Sample Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className={`
          p-3 rounded-lg border
          ${isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            12
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Active Items
          </div>
        </div>
        <div className={`
          p-3 rounded-lg border
          ${isDarkMode 
            ? 'bg-slate-800/50 border-slate-700' 
            : 'bg-gray-50 border-gray-200'
          }
        `}>
          <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            3
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Needs Action
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t pt-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button className={`
          text-sm font-medium flex items-center gap-1 transition-colors
          ${isDarkMode 
            ? 'text-purple-400 hover:text-purple-300' 
            : 'text-purple-600 hover:text-purple-700'
          }
        `}>
          View Full Page
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}