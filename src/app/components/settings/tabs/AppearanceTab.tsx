import React from 'react';
import { Sun, Moon, Monitor, Type, Sidebar, Sparkles, Layout } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';

export function AppearanceTab() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => !isDarkMode && toggleDarkMode()}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all
              ${isDarkMode 
                ? 'border-blue-500 bg-slate-800' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className={`w-full h-24 mb-3 rounded-lg bg-gradient-to-br ${isDarkMode ? 'from-slate-900 to-slate-800' : 'from-gray-900 to-gray-800'}`}></div>
            <div className="flex items-center gap-2">
              <Moon size={18} className={isDarkMode ? 'text-blue-400' : 'text-gray-500'} />
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</span>
            </div>
            {isDarkMode && <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full" />}
          </button>

          <button
            onClick={() => isDarkMode && toggleDarkMode()}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all
              ${!isDarkMode 
                ? 'border-blue-500 bg-gray-50' 
                : 'border-gray-700 hover:border-gray-600 bg-slate-800'
              }
            `}
          >
            <div className={`w-full h-24 mb-3 rounded-lg border border-gray-200 bg-gradient-to-br ${isDarkMode ? 'from-white to-gray-100' : 'from-white to-gray-50'}`}></div>
            <div className="flex items-center gap-2">
              <Sun size={18} className={!isDarkMode ? 'text-blue-600' : 'text-gray-400'} />
              <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Light Mode</span>
            </div>
            {!isDarkMode && <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full" />}
          </button>

          <button
            disabled
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all opacity-50 cursor-not-allowed
              ${isDarkMode ? 'border-gray-700 bg-slate-800' : 'border-gray-200 bg-white'}
            `}
          >
            <div className="w-full h-24 mb-3 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300"></div>
            <div className="flex items-center gap-2">
              <Monitor size={18} className="text-gray-400" />
              <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>System</span>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between py-2">
           <div className="flex items-center gap-2">
             <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>High Contrast Mode</span>
           </div>
           <Switch />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Layout size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Interface Density</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Compact Mode</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Show more data with less whitespace</p>
               </div>
               <Switch />
            </div>
            <div className="pt-4 border-t border-gray-200/10">
               <label className={`block text-xs font-medium mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                 Font Size
               </label>
               <div className={`flex rounded-lg border p-1 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                 {['Small', 'Medium', 'Large'].map((size, idx) => (
                   <button
                     key={size}
                     className={`
                       flex-1 py-1.5 text-xs font-medium rounded-md transition-all
                       ${size === 'Medium' 
                         ? isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                         : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                       }
                     `}
                   >
                     {size}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Visual Effects</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Reduced Motion</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Minimize animations and transitions</p>
               </div>
               <Switch />
            </div>
            <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Subtle Background Stars</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Enable atmospheric background effect</p>
               </div>
               <Switch defaultChecked />
            </div>
             <div className="flex items-center justify-between">
               <div>
                 <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Sidebar Behavior</p>
                 <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Always expanded vs Icon-only</p>
               </div>
               <select className={`
                  px-2 py-1 rounded text-xs border outline-none
                  ${isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}>
                  <option>Expanded</option>
                  <option>Icon-only</option>
                </select>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
