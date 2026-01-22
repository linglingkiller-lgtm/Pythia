import React from 'react';
import { Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';

import { TaskItem } from '../../services/AiBriefingService';

interface TasksModuleProps {
  module: DashboardModule;
  tasks?: TaskItem[];
}

const DEMO_TASKS = [
  { id: '1', title: 'Review HB 247 testimony draft', due: '2025-12-23', priority: 'high', owner: 'You' },
  { id: '2', title: 'Send Valley Transit weekly update', due: '2025-12-22', priority: 'medium', owner: 'You' },
  { id: '3', title: 'Schedule Q1 planning with team', due: '2025-12-26', priority: 'low', owner: 'Maria Garcia' },
  { id: '4', title: 'Complete lobbying registration renewal', due: '2025-12-22', priority: 'high', owner: 'Sarah Martinez' },
  { id: '5', title: 'Draft Desert Solar client brief', due: '2025-12-27', priority: 'medium', owner: 'You' },
];

export function TasksModule({ module, tasks: overrideTasks }: TasksModuleProps) {
  const { isDarkMode } = useTheme();
  
  // Use override tasks if provided (for AI Briefing), otherwise use demo tasks filtered by module settings
  const displayTasks = overrideTasks || (module.filters.showOnlyMine 
    ? DEMO_TASKS.filter(t => t.owner === 'You')
    : DEMO_TASKS);
    
  // Simple overdue check (just for demo purposes)
  const overdue = overrideTasks ? 0 : 1;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex gap-3">
        <div className={`
          flex-1 p-3 border rounded-lg
          ${isDarkMode 
            ? 'bg-red-500/20 border-red-500/30' 
            : 'bg-red-50 border-red-200'
          }
        `}>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
            {overdue}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            Overdue
          </div>
        </div>
        <div className={`
          flex-1 p-3 border rounded-lg
          ${isDarkMode 
            ? 'bg-blue-500/20 border-blue-500/30' 
            : 'bg-blue-50 border-blue-200'
          }
        `}>
          <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
            {displayTasks.length}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Next 7 Days
          </div>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h4 className={`
          text-xs font-bold uppercase tracking-wide mb-3
          ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}
        `}>
          {module.filters.showOnlyMine ? 'My Focus Today' : 'Team Tasks'}
        </h4>
        <div className="space-y-2">
          {displayTasks.slice(0, 5).map(task => (
            <div 
              key={task.id} 
              className={`
                flex items-start gap-3 p-2 rounded transition-colors
                ${isDarkMode 
                  ? 'hover:bg-slate-700/50' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <input 
                type="checkbox" 
                className={`
                  mt-0.5 w-4 h-4 rounded
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-purple-500' 
                    : 'text-purple-600'
                  }
                `} 
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    task.priority === 'high' 
                      ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                      : task.priority === 'medium' 
                        ? isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                        : isDarkMode ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    <Calendar className="w-3 h-3" />
                    {new Date(task.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t pt-4 flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button className={`
          text-sm font-medium flex items-center gap-1 transition-colors
          ${isDarkMode 
            ? 'text-purple-400 hover:text-purple-300' 
            : 'text-purple-600 hover:text-purple-700'
          }
        `}>
          View All Tasks
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className={`
          px-3 py-1.5 text-sm border rounded-lg font-medium transition-colors
          ${isDarkMode 
            ? 'border-slate-600 hover:bg-slate-700 text-gray-300' 
            : 'border-gray-300 hover:bg-gray-50 text-gray-900'
          }
        `}>
          Add Task
        </button>
      </div>
    </div>
  );
}