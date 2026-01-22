import React, { useState } from 'react';
import { X, Search, Target, Sparkles, Flame, Calendar, Pause, Layers, LayoutGrid } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { WorkModuleType } from './ModularMyWorkTab';

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: WorkModuleType) => void;
  activeModuleTypes: WorkModuleType[];
  isDarkMode: boolean;
}

interface ModuleTemplate {
  type: WorkModuleType;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
  defaultSize: string;
}

const WORK_MODULE_TEMPLATES: ModuleTemplate[] = [
  { 
    type: 'stats', 
    title: 'Quick Stats', 
    icon: Target,
    description: 'Overview of your productivity and task status',
    defaultSize: 'Wide'
  },
  { 
    type: 'priority-queue', 
    title: 'Priority Queue', 
    icon: Sparkles,
    description: 'Top priority tasks sorted by urgency',
    defaultSize: 'Medium'
  },
  { 
    type: 'due-today', 
    title: 'Due Today', 
    icon: Flame,
    description: 'Tasks that must be completed today',
    defaultSize: 'Medium'
  },
  { 
    type: 'upcoming', 
    title: 'Upcoming Tasks', 
    icon: Calendar,
    description: 'Tasks due in the next 7 days',
    defaultSize: 'Medium'
  },
  { 
    type: 'blocked', 
    title: 'Blocked Items', 
    icon: Pause,
    description: 'Tasks waiting on dependencies',
    defaultSize: 'Small'
  },
  { 
    type: 'bundles', 
    title: 'Task Bundles', 
    icon: Layers,
    description: 'Grouped tasks for specific workflows',
    defaultSize: 'Wide'
  },
];

export function AddModuleModal({ isOpen, onClose, onAdd, activeModuleTypes, isDarkMode }: AddModuleModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ModuleTemplate | null>(null);

  const filteredTemplates = WORK_MODULE_TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddModule = () => {
    if (!selectedTemplate) return;
    onAdd(selectedTemplate.type);
    // Reset state
    setSelectedTemplate(null);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 z-[100] transition-opacity duration-500 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
        <div className={`
          pointer-events-auto
          rounded-2xl shadow-2xl w-full max-w-4xl h-[550px] flex flex-col transition-all duration-500 transform scale-100
          ${isDarkMode 
            ? 'bg-slate-900 border border-white/10 shadow-purple-500/10' 
            : 'bg-white border border-gray-200'
          }
        `}>
          {/* Header */}
          <div className={`
            flex items-center justify-between px-6 py-4 border-b
            ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
          `}>
            <div>
              <h2 className={`
                text-xl font-bold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                Add Work Module
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose a widget to add to your personal workspace
              </p>
            </div>
            <button
              onClick={onClose}
              className={`
                transition-colors p-1 rounded-lg
                ${isDarkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex">
            {/* Left Column - Module List */}
            <div className={`
              w-1/2 border-r flex flex-col
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}>
              <div className={`
                p-4 border-b
                ${isDarkMode ? 'border-white/5' : 'border-gray-100'}
              `}>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-all duration-300
                      focus:outline-none
                      ${isDarkMode
                        ? 'bg-slate-800 border-slate-600 text-white placeholder-gray-500 focus:border-blue-500'
                        : 'bg-white border-gray-200 text-gray-900 focus:border-blue-500'
                      }
                    `}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredTemplates.map(template => {
                  const Icon = template.icon;
                  const isActive = activeModuleTypes.includes(template.type); // Just for info, allow adding multiple if desired, or disable
                  const isSelected = selectedTemplate?.type === template.type;

                  return (
                    <button
                      key={template.type}
                      onClick={() => setSelectedTemplate(template)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? isDarkMode
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-blue-500 bg-blue-50'
                          : isDarkMode
                            ? 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-600 text-white'
                            : isDarkMode
                              ? 'bg-slate-800 text-gray-400'
                              : 'bg-gray-100 text-gray-600'
                        }`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {template.title}
                          </h4>
                          <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No modules found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="w-1/2 flex flex-col">
              {selectedTemplate ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                    <div className={`
                      w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-xl
                      ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}
                    `}>
                      {React.createElement(selectedTemplate.icon, { size: 48 })}
                    </div>
                    
                    <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedTemplate.title}
                    </h3>
                    
                    <p className={`text-base mb-6 max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedTemplate.description}
                    </p>

                    <div className={`
                      px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider
                      ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}
                    `}>
                      Default Size: {selectedTemplate.defaultSize}
                    </div>
                  </div>

                  <div className={`p-6 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <button
                      onClick={handleAddModule}
                      className={`
                        w-full py-3 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02]
                        ${isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                        }
                      `}
                    >
                      Add Module
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6 text-center">
                  <div>
                    <div className={`
                      w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4
                      ${isDarkMode ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-300'}
                    `}>
                      <LayoutGrid size={32} />
                    </div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Select a module to view details
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
