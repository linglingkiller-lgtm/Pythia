import React from 'react';
import { Camera, Clock, Calendar, Globe, Keyboard, Command } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

export function ProfileTab() {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Public Profile</h3>
        
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group cursor-pointer">
              <img 
                src={avatarImage} 
                alt="Profile" 
                className="w-28 h-28 rounded-full object-cover border-4 border-transparent group-hover:border-blue-500 transition-all shadow-lg"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
            <button className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-blue-400' : 'border-gray-200 hover:bg-gray-50 text-blue-600'}`}>
              Change Avatar
            </button>
          </div>

          <div className="flex-1 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  First Name
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.firstName}
                  className={`
                    w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.lastName}
                  className={`
                    w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  Job Title
                </label>
                <input
                  type="text"
                  defaultValue="Senior Government Affairs Manager"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                  Pronouns <span className="text-xs opacity-50 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. they/them"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200/10">
          <Button variant="primary">Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Regional & Format</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <Globe size={14} /> Timezone
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="America/Phoenix"
            >
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Phoenix">Arizona</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <Calendar size={14} /> Date Format
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="MM/DD/YYYY"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Workflow</h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                Default Landing Page
              </label>
              <select
                className={`
                  w-full px-3 py-2.5 rounded-lg border outline-none transition-all
                  ${isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                    : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                  }
                `}
                defaultValue="dashboard"
              >
                <option value="dashboard">Dashboard</option>
                <option value="war_room">War Room</option>
                <option value="records">Records</option>
                <option value="projects">Projects</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                <Clock size={14} /> Working Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  defaultValue="09:00"
                  className={`
                    flex-1 px-3 py-2 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                    }
                  `}
                />
                <span className="text-gray-500">-</span>
                <input
                  type="time"
                  defaultValue="17:00"
                  className={`
                    flex-1 px-3 py-2 rounded-lg border outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                      : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                    }
                  `}
                />
              </div>
              <p className="text-xs text-gray-500">Mon - Fri</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Accessibility</h3>
          </div>
          
          <div className={`p-4 rounded-xl border mb-4 flex items-center justify-between ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-purple-400' : 'bg-white text-purple-600 shadow-sm'}`}>
                <Keyboard size={20} />
              </div>
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Keyboard Shortcuts</p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Speed up your workflow</p>
              </div>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-mono font-medium border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
              ⌘ K
            </div>
          </div>

          <Button variant="secondary" className="w-full">
            <Command size={16} className="mr-2" />
            View Shortcuts
          </Button>
        </Card>
      </div>
    </div>
  );
}
