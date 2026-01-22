import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { 
  LayoutGrid, List, Calendar as CalendarIcon, Plus, Filter, 
  Search, Edit3, Save, X, Target, Minimize2, Maximize2, Layers
} from 'lucide-react';
import { mockProjects } from '../../data/workHubData';
import { ProjectsBoard } from './ProjectsBoard';
import { ModularTimelineView, AVAILABLE_MODULES, type TimelineModule, type TimelineModuleType } from './ModularTimelineView';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { motion, AnimatePresence } from 'motion/react';

import { ProjectCommandDrawer } from './ProjectCommandDrawer';

interface ProjectsTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToChat?: (messageId: string) => void;
  onTriggerNotification?: (notification: any) => void;
  // Lifted props
  isEditMode?: boolean;
  setIsEditMode?: (mode: boolean) => void;
}

export function ProjectsTab({ 
  onNavigateToClient, 
  onNavigateToBill, 
  onNavigateToChat, 
  onTriggerNotification,
  isEditMode = false,
  setIsEditMode
}: ProjectsTabProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'board' | 'timeline'>('board');

  // Lifted state for Project Drawer (so it works across views)
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // ----------------------------------------------------------------------
  // Modular Timeline State
  // ----------------------------------------------------------------------
  const [modules, setModules] = useState<TimelineModule[]>([
    { id: 'projects-1', type: 'projects-list', title: 'Projects List', collapsed: false, position: 0 },
    { id: 'tasks-1', type: 'tasks-queue', title: 'Tasks Queue', collapsed: false, position: 1 },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddModule = (type: TimelineModuleType) => {
    const moduleConfig = AVAILABLE_MODULES.find(m => m.type === type);
    if (!moduleConfig) return;

    const newModule: TimelineModule = {
      id: `${type}-${Date.now()}`,
      type,
      title: moduleConfig.title,
      collapsed: false,
      position: modules.length,
    };

    setModules([...modules, newModule]);
    setShowAddModal(false);
    showToast(`Added ${moduleConfig.title}`, 'success');
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    showToast('Module removed', 'info');
  };

  const handleToggleCollapse = (id: string) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, collapsed: !m.collapsed } : m
    ));
  };

  const handleMoveUp = (id: string) => {
    const index = modules.findIndex(m => m.id === id);
    if (index <= 0) return;

    const newModules = [...modules];
    [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    newModules.forEach((m, idx) => m.position = idx);
    setModules(newModules);
  };

  const handleMoveDown = (id: string) => {
    const index = modules.findIndex(m => m.id === id);
    if (index >= modules.length - 1) return;

    const newModules = [...modules];
    [newModules[index], newModules[index + 1]] = [newModules[index + 1], newModules[index]];
    newModules.forEach((m, idx) => m.position = idx);
    setModules(newModules);
  };

  return (
      <div className="flex flex-col min-h-full bg-transparent">
        
        {/* 1. Sticky Sub-Header */}
        <div className={`sticky top-0 z-40 flex-shrink-0 border-b backdrop-blur-xl transition-colors duration-200 -mx-8 md:-mx-12 -mt-10 mb-8 ${
          isDarkMode ? 'bg-[#0a0a0b]/80 border-white/5' : 'bg-gray-50/80 border-gray-200'
        }`}>
          <div className="px-8 md:px-12 py-4 flex items-center justify-between">
              
              {/* Left: Title & Context */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                    <Layers className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Projects & Workflows
                  </h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {mockProjects.length} active campaigns
                  </p>
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex items-center gap-4">
                  
                  {/* View Switcher (Segmented) */}
                  <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-200/50 border border-gray-200'}`}>
                      <button
                          onClick={() => setViewMode('board')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                              viewMode === 'board'
                              ? isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-sm'
                              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                          }`}
                      >
                          <LayoutGrid size={14} />
                          Stages
                      </button>
                      <button
                          onClick={() => setViewMode('timeline')}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                              viewMode === 'timeline'
                              ? isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-sm'
                              : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                          }`}
                      >
                          <CalendarIcon size={14} />
                          Timeline
                      </button>
                  </div>

                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

                  {/* Actions - Customize Buttons removed as they are now in header */}
                  {viewMode === 'timeline' && isEditMode && (
                     <div className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Editing Layout...
                     </div>
                  )}

                  {viewMode !== 'timeline' && (
                      <>
                        <div className="relative group">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                                isDarkMode ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-blue-500'
                            }`} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className={`
                                    pl-9 pr-4 py-1.5 text-sm rounded-lg outline-none border transition-all w-48
                                    ${isDarkMode 
                                        ? 'bg-white/5 border-white/10 focus:border-blue-500/50 focus:bg-white/10 text-white placeholder:text-gray-600' 
                                        : 'bg-white border-gray-300 focus:border-blue-500/50 text-gray-900 placeholder:text-gray-400'
                                    }
                                `}
                            />
                        </div>
                        <Button 
                            variant="primary" 
                            className={`gap-2 shadow-lg shadow-blue-500/20 px-4 py-1.5 h-auto text-sm ${
                                !isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white border-transparent' : ''
                            }`}
                        >
                            <Plus size={14} />
                            New Project
                        </Button>
                      </>
                  )}
              </div>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 relative">
          
          {/* Animated View Transition */}
          <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
          >
              {viewMode === 'board' && (
                  <div className="pb-32">
                      <ProjectsBoard 
                        projects={mockProjects} 
                        onNavigateToBill={onNavigateToBill} 
                        onProjectClick={setSelectedProject}
                      />
                  </div>
              )}

              {viewMode === 'timeline' && (
                  <div className="flex flex-col gap-6">
                      {isEditMode && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setShowAddModal(true)}
                                className={`
                                    flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all w-full max-w-2xl
                                    ${isDarkMode 
                                    ? 'border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 text-gray-500 hover:text-purple-400' 
                                    : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50 text-gray-400 hover:text-purple-600'
                                    }
                                `}
                            >
                                <div className={`p-4 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                    <Plus size={32} />
                                </div>
                                <span className="font-medium">Add Module</span>
                            </button>
                        </div>
                      )}

                      <ModularTimelineView 
                        onNavigateToBill={onNavigateToBill} 
                        onProjectClick={setSelectedProject}
                        // Controlled Props
                        modules={modules}
                        isEditMode={isEditMode}
                        onRemoveModule={handleRemoveModule}
                        onToggleCollapse={handleToggleCollapse}
                        onMoveUp={handleMoveUp}
                        onMoveDown={handleMoveDown}
                      />
                  </div>
              )}
          </motion.div>

        </div>

        {/* Global Project Command Drawer (Works for both views) */}
        <ProjectCommandDrawer 
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigateToBill={onNavigateToBill}
          onTriggerNotification={onTriggerNotification}
        />

        {/* Add Module Modal */}
        <AddModuleModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddModule}
            activeModuleTypes={modules.map(m => m.type)}
            isDarkMode={isDarkMode}
        />
      </div>
  );
}

// ----------------------------------------------------------------------
// Add Module Modal (Re-implemented here)
// ----------------------------------------------------------------------

interface AddModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: TimelineModuleType) => void;
  activeModuleTypes: TimelineModuleType[];
  isDarkMode: boolean;
}

function AddModuleModal({ isOpen, onClose, onAdd, activeModuleTypes, isDarkMode }: AddModuleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative max-w-2xl w-full rounded-xl border shadow-2xl ${
          isDarkMode 
            ? 'bg-[#1a1a1d] border-white/10' 
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Add Productivity Module
            </h2>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Choose a module to add to your timeline view
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        </div>

        {/* Module Grid */}
        <div className="p-6 grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {AVAILABLE_MODULES.map((module) => {
            const Icon = module.icon;
            const isActive = activeModuleTypes.includes(module.type);
            
            return (
              <button
                key={module.type}
                onClick={() => !isActive && onAdd(module.type)}
                disabled={isActive}
                className={`p-4 rounded-lg border text-left transition-all ${
                  isActive
                    ? isDarkMode
                      ? 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/50'
                    : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Icon size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-bold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {module.title}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {module.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="text-blue-500">
                      <Target size={16} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
