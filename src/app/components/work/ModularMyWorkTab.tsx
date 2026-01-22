import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit3, Save, X, 
  ListChecks, Calendar, AlertCircle, Layers, Target, Flame,
  Clock, ArrowRight, CheckCircle2, Pause, Sparkles, Minimize2, Maximize2,
  LayoutDashboard, List, MoreHorizontal, Link as LinkIcon
} from 'lucide-react';
import _ from 'lodash';
import { Responsive } from 'react-grid-layout';

import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { useTasks } from '../../hooks/useTasks';
import { useAppMode } from '../../contexts/AppModeContext';
import { MyWorkTimeline } from './MyWorkTimeline';
import { mockTaskBundles, type Task } from '../../data/workHubData';
import { CreateTaskModal } from './CreateTaskModal';
import { WeeklyAgenda } from './WeeklyAgenda';
import { AddModuleModal } from './AddModuleModal';

// ----------------------------------------------------------------------
// Grid Layout Setup
// ----------------------------------------------------------------------

const gridLayoutStyles = `
  .react-grid-layout {
    position: relative;
    transition: height 200ms ease;
  }
  .react-grid-item {
    transition: all 200ms ease;
    transition-property: left, top;
  }
  .react-grid-item.cssTransforms {
    transition-property: transform;
  }
  .react-grid-item.resizing {
    z-index: 100;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .react-grid-item.react-grid-placeholder {
    background: rgba(128, 128, 128, 0.1) !important;
    opacity: 0.5 !important;
    border-radius: 12px !important;
  }
  .react-resizable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    cursor: se-resize;
    z-index: 100;
  }
  .react-resizable-handle::after {
    content: "";
    position: absolute;
    right: 6px;
    bottom: 6px;
    width: 8px;
    height: 8px;
    border-right: 2px solid rgba(128,128,128,0.4);
    border-bottom: 2px solid rgba(128,128,128,0.4);
  }
`;

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type WorkModuleType = 
  | 'priority-queue'
  | 'due-today'
  | 'upcoming'
  | 'blocked'
  | 'bundles'
  | 'stats';

export interface WorkModule {
  id: string;
  type: WorkModuleType;
  title: string;
  collapsed: boolean;
}

const AVAILABLE_MODULES: Array<{ type: WorkModuleType; title: string; icon: React.ElementType; description: string; defaultH: number; defaultW: number }> = [
  { 
    type: 'stats', 
    title: 'Quick Stats', 
    icon: Target,
    description: 'Overview of your productivity',
    defaultH: 4,
    defaultW: 12 
  },
  { 
    type: 'priority-queue', 
    title: 'Priority Queue', 
    icon: Sparkles,
    description: 'Top priority tasks sorted by urgency',
    defaultH: 8,
    defaultW: 6
  },
  { 
    type: 'due-today', 
    title: 'Due Today', 
    icon: Flame,
    description: 'Tasks that must be completed today',
    defaultH: 8,
    defaultW: 6
  },
  { 
    type: 'upcoming', 
    title: 'Upcoming Tasks', 
    icon: Calendar,
    description: 'Tasks due in the next 7 days',
    defaultH: 8,
    defaultW: 6
  },
  { 
    type: 'blocked', 
    title: 'Blocked Items', 
    icon: Pause,
    description: 'Tasks waiting on dependencies',
    defaultH: 6,
    defaultW: 6
  },
  { 
    type: 'bundles', 
    title: 'Task Bundles', 
    icon: Layers,
    description: 'Grouped tasks for specific workflows',
    defaultH: 6,
    defaultW: 12
  },
];

// Custom hook for responsive width
function useContainerDimensions() {
  const [width, setWidth] = useState(1200);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setWidth(entry.contentRect.width);
        }
      }
    });

    resizeObserver.observe(element);
    
    // Initial measure
    if (element.clientWidth > 0) {
        setWidth(element.clientWidth);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return { width, containerRef };
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

interface ModularMyWorkTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToChat?: (messageId: string) => void;
  isEditMode?: boolean;
  setIsEditMode?: (mode: boolean) => void;
}

export function ModularMyWorkTab({ 
  onNavigateToClient, 
  onNavigateToBill, 
  onNavigateToChat,
  isEditMode = false,
  setIsEditMode
}: ModularMyWorkTabProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const { appMode } = useAppMode();
  
  // Data Fetching
  const { tasks: myTasks, loading, refetch: refetchTasks } = useTasks({ scope: 'my' });
  
  // View State
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modules State
  const [modules, setModules] = useState<WorkModule[]>([
    { id: 'stats-1', type: 'stats', title: 'Quick Stats', collapsed: false },
    { id: 'priority-1', type: 'priority-queue', title: 'Priority Queue', collapsed: false },
    { id: 'today-1', type: 'due-today', title: 'Due Today', collapsed: false },
    { id: 'upcoming-1', type: 'upcoming', title: 'Upcoming Tasks', collapsed: false },
  ]);

  // Layout State
  const [layouts, setLayouts] = useState<ReactGridLayout.Layouts>({
    lg: [
      { i: 'stats-1', x: 0, y: 0, w: 12, h: 4 },
      { i: 'priority-1', x: 0, y: 4, w: 6, h: 8 },
      { i: 'today-1', x: 6, y: 4, w: 6, h: 8 },
      { i: 'upcoming-1', x: 0, y: 12, w: 6, h: 8 },
    ]
  });

  // Container Width Hook
  const { width, containerRef } = useContainerDimensions();

  // Module Logic
  const handleAddModule = (type: WorkModuleType) => {
    const moduleConfig = AVAILABLE_MODULES.find(m => m.type === type);
    if (!moduleConfig) return;

    const newId = `${type}-${Date.now()}`;
    const newModule: WorkModule = {
      id: newId,
      type,
      title: moduleConfig.title,
      collapsed: false,
    };

    setModules([...modules, newModule]);
    
    // Add to layout
    setLayouts(prev => ({
      ...prev,
      lg: [
        ...(prev.lg || []),
        { i: newId, x: 0, y: Infinity, w: moduleConfig.defaultW, h: moduleConfig.defaultH }
      ]
    }));

    setShowAddModal(false);
    showToast(`Added ${moduleConfig.title}`, 'success');
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    setLayouts(prev => ({
      ...prev,
      lg: (prev.lg || []).filter(l => l.i !== id)
    }));
    showToast('Module removed', 'info');
  };

  const handleToggleCollapse = (id: string) => {
    setModules(modules.map(m => {
        if (m.id !== id) return m;
        const newCollapsed = !m.collapsed;
        
        // Update layout height when collapsing
        setLayouts(prev => {
            const currentLayout = prev.lg || [];
            const item = currentLayout.find(l => l.i === id);
            if (!item) return prev;

            const moduleConfig = AVAILABLE_MODULES.find(mod => mod.type === m.type);
            const defaultH = moduleConfig?.defaultH || 6;

            return {
                ...prev,
                lg: currentLayout.map(l => 
                    l.i === id ? { ...l, h: newCollapsed ? 2 : defaultH } : l
                )
            };
        });

        return { ...m, collapsed: newCollapsed };
    }));
  };

  const onLayoutChange = (currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
    setLayouts(allLayouts);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <style>{gridLayoutStyles}</style>
      
      {/* ---------------- Header Actions ---------------- */}
      <div className={`sticky top-0 z-40 flex-shrink-0 border-b backdrop-blur-xl transition-all duration-200 -mx-8 md:-mx-12 -mt-10 mb-8 ${
        isDarkMode ? 'bg-[#0a0a0b]/80 border-white/5' : 'bg-gray-50/80 border-gray-200'
      }`}>
        <div className="px-8 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} flex-shrink-0`} />
            <div>
              <h2 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Work & Tasks
              </h2>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {myTasks.length} active tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* View Switcher */}
            <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-200/50 border border-gray-200'}`}>
                <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                        currentView === 'dashboard'
                        ? isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-sm'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    <LayoutDashboard size={14} />
                    Dashboard
                </button>
                <button
                    onClick={() => setCurrentView('tasks')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                        currentView === 'tasks'
                        ? isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-blue-600 shadow-sm'
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                    <List size={14} />
                    All Tasks
                </button>
            </div>

            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Action Buttons */}
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                <Plus size={14} />
                New Task
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- Content Views ---------------- */}
      
      {currentView === 'tasks' ? (
          <div className="flex-1 overflow-hidden relative h-full">
             <WeeklyAgenda 
                 onNavigateToChat={onNavigateToChat}
             />
          </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* Timeline View - Hero Element */}
            <div className={`w-full border-b ${
            isDarkMode ? 'border-white/5' : 'border-gray-200'
            }`}>
                <MyWorkTimeline tasks={myTasks} />
            </div>

            {/* Modular Grid Widgets */}
            <div className="px-8 py-8 pb-32 w-full">
            
            {isEditMode && (
                <div className={`mb-6 p-4 rounded-xl border ${
                isDarkMode 
                    ? 'bg-blue-500/10 border-blue-500/20' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                <div className="flex items-start gap-3">
                    <Edit3 size={16} className={isDarkMode ? 'text-blue-400 mt-0.5' : 'text-blue-600 mt-0.5'} />
                    <div>
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        Customizing Dashboard
                    </h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400/80' : 'text-blue-700'}`}>
                        Drag modules to reposition. Drag the bottom-right corner to resize.
                    </p>
                    </div>
                </div>
                </div>
            )}

            <div ref={containerRef}>
                <Responsive
                    width={width}
                    className="layout"
                    layouts={layouts}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    rowHeight={60}
                    isDraggable={isEditMode}
                    isYZResizable={isEditMode}
                    isResizable={isEditMode}
                    onLayoutChange={onLayoutChange}
                    margin={[20, 20]}
                >
                    {modules.map((module) => (
                        <div key={module.id} className="relative group">
                            <ModuleCard
                                module={module}
                                isEditMode={isEditMode}
                                onToggleCollapse={() => handleToggleCollapse(module.id)}
                                onRemove={() => handleRemoveModule(module.id)}
                                isDarkMode={isDarkMode}
                                myTasks={myTasks}
                                onNavigateToBill={onNavigateToBill}
                                appMode={appMode}
                            />
                        </div>
                    ))}
                </Responsive>
            </div>
            
            {/* Add Module Button inside Grid when in Edit Mode */}
            {isEditMode && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className={`
                            flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all
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
            
            {modules.length === 0 && !isEditMode && (
                <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400">No modules added. Enter customization mode to start.</p>
                </div>
            )}

            </div>
        </div>
      )}

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddModule}
        activeModuleTypes={modules.map(m => m.type)}
        isDarkMode={isDarkMode}
      />

      {/* Create Task Modal */}
      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetchTasks}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// Module Card & Content
// ----------------------------------------------------------------------

interface ModuleCardProps {
  module: WorkModule;
  isEditMode: boolean;
  onToggleCollapse: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
  myTasks: Task[];
  onNavigateToBill?: (billId: string) => void;
  appMode: string;
}

function ModuleCard({ 
  module, isEditMode, onToggleCollapse, onRemove, isDarkMode, myTasks, onNavigateToBill, appMode 
}: ModuleCardProps) {
  const moduleConfig = AVAILABLE_MODULES.find(m => m.type === module.type);
  const Icon = moduleConfig?.icon || ListChecks;

  return (
    <div className={`h-full w-full rounded-xl border overflow-hidden transition-all duration-300 flex flex-col ${
      isDarkMode 
        ? 'bg-transparent border-white/10' 
        : 'bg-transparent border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex-shrink-0 flex items-center justify-between px-4 py-3 border-b cursor-move ${
        isDarkMode ? 'border-white/10 bg-[#0a0a0b]' : 'border-gray-200 bg-gray-50'
      } ${isEditMode ? 'cursor-move' : ''}`}>
        <div className="flex items-center gap-3 min-w-0">
          <Icon size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          <h3 className={`text-xs font-bold uppercase tracking-wider truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {module.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0" onMouseDown={e => e.stopPropagation()}>
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
            }`}
          >
            {module.collapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          {isEditMode && (
            <button
              onClick={onRemove}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-50 text-red-500'
              }`}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
            {!module.collapsed ? (
                <motion.div
                    key="expanded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-y-auto custom-scrollbar"
                >
                    <div className="p-4">
                        <ModuleContent 
                            type={module.type}
                            myTasks={myTasks}
                            isDarkMode={isDarkMode}
                            onNavigateToBill={onNavigateToBill}
                            appMode={appMode}
                        />
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="collapsed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 overflow-hidden"
                >
                    <div className="px-4 pb-2 h-full">
                        <ModuleSummary 
                            type={module.type}
                            myTasks={myTasks}
                            isDarkMode={isDarkMode}
                            appMode={appMode}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ModuleSummary({ type, myTasks, isDarkMode, appMode }: any) {
  const activeCount = myTasks.filter((t: any) => t.status !== 'done').length;
  
  switch (type) {
    case 'stats':
      const highPriority = myTasks.filter((t: any) => t.priority === 'high' || t.priority === 'critical').length;
      return (
        <div className="flex items-center justify-around h-full">
          <div className="text-center">
             <span className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeCount}</span>
             <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Active</span>
          </div>
          <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
          <div className="text-center">
             <span className={`block text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{highPriority}</span>
             <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Critical</span>
          </div>
        </div>
      );

    case 'priority-queue':
    case 'due-today':
    case 'upcoming':
    case 'blocked':
      let filteredTasks = [];
      let label = "";
      
      if (type === 'priority-queue') {
         filteredTasks = myTasks.filter((t: any) => t.status !== 'done' && (t.priority === 'high' || t.priority === 'critical'));
         label = "Critical Tasks";
      } else if (type === 'due-today') {
         const today = new Date().toISOString().split('T')[0];
         filteredTasks = myTasks.filter((t: any) => t.dueDate === today && t.status !== 'done');
         label = "Due Today";
      } else if (type === 'upcoming') {
         const nextWeek = new Date();
         nextWeek.setDate(nextWeek.getDate() + 7);
         filteredTasks = myTasks.filter((t: any) => {
            if (!t.dueDate || t.status === 'done') return false;
            const d = new Date(t.dueDate);
            return d > new Date() && d <= nextWeek;
         });
         label = "Next 7 Days";
      } else {
         filteredTasks = myTasks.filter((t: any) => t.status === 'blocked');
         label = "Blocked Items";
      }

      return (
        <div className="flex flex-col justify-center h-full">
            <div className="flex items-center justify-between mb-1">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {filteredTasks.length}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    {label}
                </span>
            </div>
            {filteredTasks.length > 0 && (
                <div className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Next: <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{filteredTasks[0].title}</span>
                </div>
            )}
        </div>
      );

    case 'bundles':
      const bundles = appMode === 'demo' ? mockTaskBundles : [];
      const activeBundles = bundles.length;
      return (
        <div className="flex items-center gap-4 h-full">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Layers size={20} />
            </div>
            <div>
                <span className={`block text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{activeBundles}</span>
                <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Active Bundles</span>
            </div>
        </div>
      );
      
    default:
      return null;
  }
}

function ModuleContent({ type, myTasks, isDarkMode, onNavigateToBill, appMode }: any) {
  switch (type) {
    case 'stats':
      return <StatsModule tasks={myTasks} isDarkMode={isDarkMode} />;
    case 'priority-queue':
      const priorityTasks = myTasks
        .filter((t: Task) => t.status !== 'done' && t.status !== 'blocked')
        .sort((a: Task, b: Task) => {
          const p = { critical: 0, high: 1, medium: 2, low: 3 };
          return (p[a.priority as keyof typeof p] || 2) - (p[b.priority as keyof typeof p] || 2);
        })
        .slice(0, 10);
      return <TaskList tasks={priorityTasks} isDarkMode={isDarkMode} onNavigateToBill={onNavigateToBill} />;
    
    case 'due-today':
      const today = new Date().toISOString().split('T')[0];
      const dueToday = myTasks.filter((t: Task) => t.dueDate === today && t.status !== 'done');
      return <TaskList tasks={dueToday} isDarkMode={isDarkMode} onNavigateToBill={onNavigateToBill} emptyMessage="No tasks due today" />;

    case 'upcoming':
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcoming = myTasks.filter((t: Task) => {
        if (!t.dueDate || t.status === 'done') return false;
        const d = new Date(t.dueDate);
        return d > new Date() && d <= nextWeek;
      });
      return <TaskList tasks={upcoming} isDarkMode={isDarkMode} onNavigateToBill={onNavigateToBill} emptyMessage="No upcoming tasks" />;

    case 'blocked':
      const blocked = myTasks.filter((t: Task) => t.status === 'blocked');
      return <TaskList tasks={blocked} isDarkMode={isDarkMode} onNavigateToBill={onNavigateToBill} isBlocked emptyMessage="No blocked tasks" />;

    case 'bundles':
      const bundles = appMode === 'demo' ? mockTaskBundles : [];
      return <BundlesList bundles={bundles} tasks={myTasks} isDarkMode={isDarkMode} />;

    default:
      return null;
  }
}

// ----------------------------------------------------------------------
// Specific Module Renderers
// ----------------------------------------------------------------------

function StatsModule({ tasks, isDarkMode }: any) {
  const active = tasks.filter((t: any) => t.status !== 'done').length;
  const completed = tasks.filter((t: any) => t.status === 'done').length;
  const highPriority = tasks.filter((t: any) => t.priority === 'high' || t.priority === 'critical').length;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
      <div className={`p-4 rounded-xl flex flex-col justify-center items-center ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
        <span className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{active}</span>
        <span className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Active</span>
      </div>
      <div className={`p-4 rounded-xl flex flex-col justify-center items-center ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
        <span className={`text-3xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{completed}</span>
        <span className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Done</span>
      </div>
      <div className={`p-4 rounded-xl flex flex-col justify-center items-center ${isDarkMode ? 'bg-red-500/10' : 'bg-red-50'}`}>
        <span className={`text-3xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{highPriority}</span>
        <span className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>Critical</span>
      </div>
      <div className={`p-4 rounded-xl flex flex-col justify-center items-center ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
        <span className={`text-3xl font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>94%</span>
        <span className={`text-xs font-medium uppercase tracking-wider mt-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>On Track</span>
      </div>
    </div>
  );
}

function TaskList({ tasks, isDarkMode, onNavigateToBill, isBlocked = false, emptyMessage = "No tasks found" }: any) {
  if (tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center p-4">
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task: any) => (
        <div 
          key={task.id} 
          className={`
            p-3 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer group
            ${isDarkMode 
              ? 'bg-slate-800/50 border-white/5 hover:bg-slate-800' 
              : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
            }
          `}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${
              task.priority === 'critical' ? 'text-red-500' :
              task.priority === 'high' ? 'text-orange-500' :
              'text-blue-500'
            }`}>
              {isBlocked ? <Pause size={16} /> : <CheckCircle2 size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-medium truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {task.title}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                {task.relatedBillId && (
                  <span 
                    onClick={(e) => { e.stopPropagation(); onNavigateToBill?.(task.relatedBillId); }}
                    className={`
                      text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 hover:underline
                      ${isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-50 text-blue-700'}
                    `}
                  >
                    <LinkIcon size={8} />
                    Bill
                  </span>
                )}
                {task.dueDate && (
                  <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 transition-all ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function BundlesList({ bundles, tasks, isDarkMode }: any) {
  if (bundles.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-center p-4">
        <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No task bundles active</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bundles.map((bundle: any) => {
        const bundleTasks = tasks.filter((t: any) => bundle.tasks.includes(t.id));
        const progress = Math.round((bundleTasks.filter((t: any) => t.status === 'done').length / bundleTasks.length) * 100) || 0;
        
        return (
          <div 
            key={bundle.id} 
            className={`
              p-4 rounded-xl border transition-all
              ${isDarkMode 
                ? 'bg-slate-800/30 border-white/5 hover:bg-slate-800/50' 
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Layers size={18} />
                </div>
                <div>
                  <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bundle.title}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{bundleTasks.length} tasks</p>
                </div>
              </div>
              <span className={`text-xs font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{progress}%</span>
            </div>
            
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
