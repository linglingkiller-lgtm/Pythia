import React from 'react';
import { Card } from '../../ui/Card';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { Workflow, List, CheckSquare, Sparkles, FileText } from 'lucide-react';

export function WorkflowTab() {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Workflow size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Task & Project Defaults</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Default Task View
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="my_tasks"
            >
              <option value="my_tasks">My Tasks</option>
              <option value="team_tasks">Team Tasks</option>
              <option value="kanban">Kanban Board</option>
            </select>
          </div>
          
          <div className="space-y-1.5">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              Default Record Type
            </label>
            <select
              className={`
                w-full px-3 py-2.5 rounded-lg border outline-none transition-all appearance-none
                ${isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700 focus:border-blue-500 text-white' 
                  : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900'
                }
              `}
              defaultValue="meeting"
            >
              <option value="meeting">Meeting Note</option>
              <option value="brief">Policy Brief</option>
              <option value="compliance">Compliance Log</option>
              <option value="update">Weekly Update</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Auto-save Drafts</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Automatically save records while typing</p>
             </div>
             <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Delete Confirmation</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Require confirmation before deleting items</p>
             </div>
             <Switch defaultChecked />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Intelligence</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Revere Recommendations</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Suggest actions based on legislative updates</p>
             </div>
             <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
             <div>
               <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Show Confidence Labels</p>
               <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Display AI confidence scores on analysis</p>
             </div>
             <Switch defaultChecked />
          </div>
        </div>
      </Card>
    </div>
  );
}
