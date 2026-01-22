import React, { useState } from 'react';
import { MoreVertical, GripVertical, Maximize2, Minimize2, Copy, Trash2, Edit2, Pin, PinOff } from 'lucide-react';
import { useDashboard, DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ModuleCardProps {
  module: DashboardModule;
  children: React.ReactNode;
}

export function ModuleCard({ module, children }: ModuleCardProps) {
  const { isEditMode, updateModule, removeModule, duplicateModule } = useDashboard();
  const { isDarkMode } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const handleResize = () => {
    const newSize = module.size === 'small' ? 'medium' : module.size === 'medium' ? 'large' : 'small';
    updateModule(module.id, { size: newSize });
  };

  const handleTogglePin = () => {
    updateModule(module.id, { pinned: !module.pinned });
  };

  return (
    <div className={`
      rounded-xl shadow-sm h-full flex flex-col overflow-hidden backdrop-blur-md transition-all duration-300
      ${isDarkMode 
        ? 'bg-slate-900/80 border border-slate-700/50 hover:border-slate-600/50' 
        : 'bg-white/80 border border-slate-200 hover:border-slate-300'
      }
      ${isEditMode ? 'cursor-move' : ''}
    `}>
      {/* Header */}
      <div className={`
        flex items-center justify-between px-4 py-3 border-b transition-colors duration-500
        ${isDarkMode ? 'border-white/10' : 'border-gray-100'}
        ${isEditMode ? 'cursor-move' : ''}
      `}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-semibold truncate transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>{module.title}</h3>
            {module.filters.department && module.filters.department !== 'all' && (
              <span className={`
                text-xs capitalize transition-colors duration-500
                ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
              `}>
                {module.filters.department.replace('-', ' ')}
              </span>
            )}
          </div>
          {module.pinned && (
            <Pin className="w-3 h-3 text-purple-600 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-1 relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`
              p-1.5 rounded transition-colors duration-500
              ${isDarkMode 
                ? 'text-gray-400 hover:text-gray-200 hover:bg-white/10' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showSettings && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSettings(false)}
              />
              <div className={`
                absolute right-0 top-8 w-48 rounded-lg shadow-lg py-1 z-20 transition-colors duration-500
                ${isDarkMode 
                  ? 'bg-slate-800 border border-white/10' 
                  : 'bg-white border border-gray-200'
                }
              `}>
                <button
                  onClick={() => {
                    handleResize();
                    setShowSettings(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-500
                    ${isDarkMode 
                      ? 'text-gray-300 hover:bg-white/5' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {module.size === 'large' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  Resize ({module.size === 'small' ? 'to Medium' : module.size === 'medium' ? 'to Large' : 'to Small'})
                </button>
                <button
                  onClick={() => {
                    handleTogglePin();
                    setShowSettings(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-500
                    ${isDarkMode 
                      ? 'text-gray-300 hover:bg-white/5' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {module.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                  {module.pinned ? 'Unpin' : 'Pin to Top'}
                </button>
                <button
                  onClick={() => {
                    duplicateModule(module.id);
                    setShowSettings(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-500
                    ${isDarkMode 
                      ? 'text-gray-300 hover:bg-white/5' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Module
                </button>
                <div className={`
                  border-t my-1 transition-colors duration-500
                  ${isDarkMode ? 'border-white/10' : 'border-gray-100'}
                `} />
                <button
                  onClick={() => {
                    removeModule(module.id);
                    setShowSettings(false);
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm text-red-600 flex items-center gap-2 transition-colors duration-500
                    ${isDarkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}
                  `}
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Module
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
}