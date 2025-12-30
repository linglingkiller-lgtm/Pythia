import React from 'react';
import { Card } from '../../ui/Card';
import { useTheme } from '../../../contexts/ThemeContext';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

export function CalendarTimeTab() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Calendar Preferences</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Week Start Day
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="monday"
            >
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Default Meeting Duration
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="30"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>

           <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Time Log Rounding
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="15"
            >
              <option value="none">No Rounding</option>
              <option value="5">Nearest 5 minutes</option>
              <option value="15">Nearest 15 minutes</option>
            </select>
            <p className="text-xs text-gray-500">Applied when logging time on tasks</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Calendar Sync</h3>
        </div>
        
        <div className={`p-4 rounded-lg border flex items-center justify-between ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
             </div>
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Google Calendar</p>
               <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Synced • Last updated 5m ago</p>
               </div>
             </div>
          </div>
          <button className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${isDarkMode ? 'border-slate-600 hover:bg-slate-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600'}`}>
            Manage
          </button>
        </div>
      </Card>
    </div>
  );
}
