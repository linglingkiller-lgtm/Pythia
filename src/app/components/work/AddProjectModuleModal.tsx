import React, { useState } from 'react';
import { X, Search, Target, FileText, List, Users, DollarSign, Sparkles, Layout } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type ProjectModuleType = 'timeline' | 'tasks' | 'team' | 'ai-alerts' | 'budget' | 'files';

interface AddProjectModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddModule: (type: ProjectModuleType) => void;
  activeModules: string[];
}

interface ModuleTemplate {
  type: ProjectModuleType;
  title: string;
  description: string;
  icon: React.FC<{ className?: string; size?: number }>;
  defaultSize: 'small' | 'medium' | 'large';
}

const PROJECT_MODULE_TEMPLATES: ModuleTemplate[] = [
  {
    type: 'timeline',
    title: 'Project Timeline',
    description: 'Gantt chart view of project milestones and dependencies',
    icon: Layout,
    defaultSize: 'large',
  },
  {
    type: 'ai-alerts',
    title: 'Revere AI Alerts',
    description: 'Intelligent risk detection and optimization suggestions',
    icon: Sparkles,
    defaultSize: 'medium',
  },
  {
    type: 'tasks',
    title: 'Task Breakdown',
    description: 'List of current tasks, priorities, and assignees',
    icon: List,
    defaultSize: 'medium',
  },
  {
    type: 'team',
    title: 'Team Availability',
    description: 'Workload distribution and capacity tracking',
    icon: Users,
    defaultSize: 'medium',
  },
  {
    type: 'budget',
    title: 'Budget Tracker',
    description: 'Financial overview, burn rate, and remaining budget',
    icon: DollarSign,
    defaultSize: 'medium',
  },
  {
    type: 'files',
    title: 'Project Files',
    description: 'Quick access to key project documents and assets',
    icon: FileText,
    defaultSize: 'medium',
  },
];

export function AddProjectModuleModal({ isOpen, onClose, onAddModule, activeModules }: AddProjectModuleModalProps) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ModuleTemplate | null>(null);

  const filteredTemplates = PROJECT_MODULE_TEMPLATES.filter(template => {
    return template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           template.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectTemplate = (template: ModuleTemplate) => {
    setSelectedTemplate(template);
  };

  const handleAdd = () => {
    if (selectedTemplate) {
      onAddModule(selectedTemplate.type);
      onClose();
      setSelectedTemplate(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] transition-opacity duration-500">
        <div className={`absolute inset-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/60' : 'bg-white/60'}`} onClick={onClose} />
      </div>

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
        <div className={`
          pointer-events-auto
          rounded-2xl shadow-2xl w-full max-w-4xl h-[550px] flex flex-col overflow-hidden transition-all duration-300
          ${isDarkMode 
            ? 'bg-[#18181b] border border-white/10 shadow-black/50' 
            : 'bg-white border border-gray-200 shadow-xl'
          }
        `}>
          {/* Header */}
          <div className={`
            flex items-center justify-between px-6 py-4 border-b
            ${isDarkMode ? 'border-white/10' : 'border-gray-100'}
          `}>
            <div>
              <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add Project Module
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Enhance your project dashboard with specialized widgets
              </p>
            </div>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode 
                  ? 'hover:bg-white/10 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
                }
              `}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: List */}
            <div className={`w-[45%] border-r flex flex-col ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="p-4">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                      w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none border transition-all
                      ${isDarkMode
                        ? 'bg-white/5 border-white/5 focus:border-white/20 text-white placeholder-gray-500'
                        : 'bg-gray-50 border-gray-200 focus:border-purple-500 text-gray-900 placeholder-gray-400'
                      }
                    `}
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2">
                {filteredTemplates.map(template => {
                  const Icon = template.icon;
                  const isActive = activeModules.includes(template.type);
                  const isSelected = selectedTemplate?.type === template.type;
                  
                  return (
                    <button
                      key={template.type}
                      onClick={() => handleSelectTemplate(template)}
                      disabled={isActive}
                      className={`
                        w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-center gap-3 group
                        ${isActive 
                           ? (isDarkMode ? 'opacity-50 grayscale border-transparent' : 'opacity-50 grayscale border-transparent')
                           : isSelected
                             ? (isDarkMode ? 'bg-purple-500/10 border-purple-500/50' : 'bg-purple-50 border-purple-200')
                             : (isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50')
                        }
                      `}
                    >
                      <div className={`
                        p-2 rounded-lg transition-colors
                        ${isSelected 
                          ? (isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600')
                          : (isDarkMode ? 'bg-white/5 text-gray-400 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:text-gray-900')
                        }
                      `}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <h4 className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                            {template.title}
                            </h4>
                            {isActive && <span className="text-[10px] uppercase font-bold text-green-500">Added</span>}
                        </div>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {template.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Preview */}
            <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-[#121214]' : 'bg-gray-50/50'}`}>
              {selectedTemplate ? (
                <div className="flex-1 flex flex-col p-8">
                   <div className={`
                      flex-1 rounded-xl border flex flex-col items-center justify-center text-center p-8 mb-6
                      ${isDarkMode ? 'bg-[#18181b] border-white/10' : 'bg-white border-gray-200'}
                   `}>
                      <div className={`p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>
                         <selectedTemplate.icon size={48} />
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {selectedTemplate.title}
                      </h3>
                      <p className={`text-sm max-w-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {selectedTemplate.description}
                      </p>
                      <div className="mt-6 flex gap-2">
                         <span className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                            Size: {selectedTemplate.defaultSize}
                         </span>
                         <span className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'border-white/10 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                            Interactive
                         </span>
                      </div>
                   </div>

                   <button
                     onClick={handleAdd}
                     disabled={activeModules.includes(selectedTemplate.type)}
                     className={`
                        w-full py-3 rounded-xl font-medium transition-all shadow-lg
                        ${activeModules.includes(selectedTemplate.type)
                            ? (isDarkMode ? 'bg-white/10 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed')
                            : (isDarkMode 
                                ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' 
                                : 'bg-gray-900 text-white hover:bg-black shadow-gray-900/20')
                        }
                     `}
                   >
                     {activeModules.includes(selectedTemplate.type) ? 'Already Added' : 'Add Module'}
                   </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <Layout size={32} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
                    </div>
                    <p className={`font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Select a module to view details
                    </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
