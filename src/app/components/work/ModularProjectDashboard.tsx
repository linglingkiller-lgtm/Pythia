import React, { useState, useEffect, useRef } from 'react';
import { Responsive } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import { 
  X, Maximize2, MoreHorizontal, GripHorizontal, 
  Layout, List, Users, Sparkles, FileText, DollarSign, 
  Plus, LayoutDashboard, Edit3, Save, RotateCcw,
  ChevronDown, ChevronUp, Search, Bell
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { ProjectTimeline } from './ProjectTimeline';
import { mockTasks } from '../../data/workHubData';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { AddProjectModuleModal, ProjectModuleType } from './AddProjectModuleModal';
import { useToast } from '../../contexts/ToastContext';

// ----------------------------------------------------------------------
// Custom Width Provider
// ----------------------------------------------------------------------

const withWidth = (WrappedComponent: any) => {
  return (props: any) => {
    const [width, setWidth] = useState(1200);
    const [mounted, setMounted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setMounted(true);
      if (!ref.current) return;
      
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
           setWidth(entry.contentRect.width);
        }
      });
      
      resizeObserver.observe(ref.current);
      return () => resizeObserver.disconnect();
    }, []);

    return (
      <div ref={ref} className="w-full h-full relative" style={{ minHeight: '600px' }}>
         {mounted && width > 0 && (
           <WrappedComponent {...props} width={width} />
         )}
      </div>
    );
  };
};

const ResponsiveGridLayout = withWidth(Responsive);

// ----------------------------------------------------------------------
// Types & Defaults
// ----------------------------------------------------------------------

interface ModularProjectDashboardProps {
  projectId?: string;
}

const DEFAULT_LAYOUT = {
  lg: [
    { i: 'timeline', x: 0, y: 0, w: 12, h: 8, minW: 6, minH: 4 },
    { i: 'ai-alerts', x: 0, y: 8, w: 4, h: 6 },
    { i: 'tasks', x: 4, y: 8, w: 4, h: 6 },
    { i: 'team', x: 8, y: 8, w: 4, h: 6 },
    { i: 'budget', x: 0, y: 14, w: 6, h: 5 },
    { i: 'files', x: 6, y: 14, w: 6, h: 5 },
  ]
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function ModularProjectDashboard({ projectId }: ModularProjectDashboardProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const [activeModules, setActiveModules] = useState<string[]>(['timeline', 'ai-alerts', 'tasks', 'team', 'budget', 'files']);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get Dashboard page theme (reusing 'Projects' theme but styling like Dashboard)
  const dashboardTheme = getPageTheme('Projects');

  // Handle scroll for header effect
  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      const handleScroll = () => {
        setIsScrolled(currentRef.scrollTop > 0);
      };
      currentRef.addEventListener('scroll', handleScroll);
      return () => {
        currentRef.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const handleAddModule = (type: ProjectModuleType) => {
    if (activeModules.includes(type)) {
      showToast(`${type} module is already active`, 'info');
      return;
    }

    // Determine new position (bottom of layout)
    const currentLayout = layout.lg;
    const maxY = currentLayout.length > 0 
      ? Math.max(...currentLayout.map(item => item.y + item.h)) 
      : 0;

    const defaultSize = type === 'timeline' ? { w: 12, h: 8 } : { w: 4, h: 6 };

    const newItem = {
      i: type,
      x: 0,
      y: maxY,
      w: defaultSize.w,
      h: defaultSize.h
    };

    setLayout(prev => ({
      ...prev,
      lg: [...prev.lg, newItem]
    }));
    setActiveModules(prev => [...prev, type]);
    showToast(`Added ${type} module`, 'success');
  };

  const removeModule = (id: string) => {
    setActiveModules(prev => prev.filter(m => m !== id));
    setLayout(prev => ({
      ...prev,
      lg: prev.lg.filter(item => item.i !== id)
    }));
  };

  const handleLayoutChange = (currentLayout: any) => {
    setLayout({ lg: currentLayout });
  };

  const handleSave = () => {
    setIsEditMode(false);
    showToast('Dashboard layout saved', 'success');
  };

  const handleReset = () => {
    setLayout(DEFAULT_LAYOUT);
    setActiveModules(['timeline', 'ai-alerts', 'tasks', 'team', 'budget', 'files']);
    showToast('Reset to default layout', 'success');
  };

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 rounded-xl ${
      isDarkMode
        ? 'bg-[#09090b]'
        : 'bg-white'
    }`}>
      
      {/* Header - Sticky with Glassmorphism */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 px-6 py-4 border-b ${
          isDarkMode
            ? 'bg-slate-900/40 border-white/[0.08]'
            : 'bg-white/60 border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="flex items-center justify-between">
            {/* Left: Title */}
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                 <LayoutDashboard size={20} />
              </div>
              <div>
                <h2 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Project Dashboard
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activeModules.length} Active Modules
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
               {!isEditMode ? (
                 <>
                   <button
                     onClick={() => setShowAddModal(true)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                       isDarkMode
                         ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                         : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                     }`}
                   >
                     <Plus size={16} />
                     Add Module
                   </button>
                   <button
                     onClick={() => setIsEditMode(true)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                       isDarkMode
                         ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                         : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                     }`}
                   >
                     <Edit3 size={16} />
                     Customize
                   </button>
                 </>
               ) : (
                 <>
                   <button
                     onClick={handleSave}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                       isDarkMode
                         ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                         : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                     }`}
                   >
                     <Save size={16} />
                     Save Layout
                   </button>
                   <button
                     onClick={handleReset}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                       isDarkMode
                         ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                         : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                     }`}
                   >
                     <RotateCcw size={16} />
                     Reset
                   </button>
                   <button
                     onClick={() => setIsEditMode(false)}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-200 text-sm font-medium ${
                       isDarkMode
                         ? 'border-white/10 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 text-gray-400'
                         : 'border-gray-200 hover:bg-red-50 hover:text-red-600 text-gray-600'
                     }`}
                   >
                     <X size={16} />
                     Cancel
                   </button>
                 </>
               )}
            </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6" ref={containerRef}>
        
        {/* Edit Mode Banner */}
        {isEditMode && (
          <div className={`
            mb-6 p-4 border rounded-xl relative overflow-hidden
            ${isDarkMode 
              ? 'bg-blue-500/10 border-blue-500/30' 
              : 'bg-blue-50 border-blue-200'
            }
          `}>
            <div className="flex items-start gap-3 relative z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}
              `}>
                <Edit3 size={14} />
              </div>
              <div>
                <h3 className={`font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  Customizing Dashboard
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-blue-300/80' : 'text-blue-700'}`}>
                  Drag and drop modules to reorder. Resize them using the handle at the bottom right.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Layout */}
        <ResponsiveGridLayout
          className="layout"
          layouts={layout}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          draggableHandle=".drag-handle"
          isResizable={isEditMode}
          isDraggable={isEditMode}
          onLayoutChange={handleLayoutChange}
          margin={[24, 24]}
        >
          {activeModules.includes('timeline') && (
            <div key="timeline" className="h-full">
               <DashboardModule title="Project Timeline" icon={Layout} isDarkMode={isDarkMode} onRemove={() => removeModule('timeline')} isEditMode={isEditMode}>
                  <div className="h-full w-full overflow-hidden rounded-b-xl bg-white dark:bg-[#1e1e22]">
                      <ProjectTimeline />
                  </div>
               </DashboardModule>
            </div>
          )}

          {activeModules.includes('tasks') && (
            <div key="tasks">
               <DashboardModule title="Task Breakdown" icon={List} isDarkMode={isDarkMode} onRemove={() => removeModule('tasks')} isEditMode={isEditMode}>
                  <div className="p-0 overflow-y-auto h-full custom-scrollbar">
                      {mockTasks.slice(0, 5).map(task => (
                          <div key={task.id} className={`p-3 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                  <div className="flex flex-col">
                                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{task.title}</span>
                                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{task.assigneeName} • {task.dueDate}</span>
                                  </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                  task.status === 'done' ? (isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700') :
                                  task.status === 'blocked' ? (isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700') :
                                  (isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700')
                              }`}>
                                  {task.status}
                              </span>
                          </div>
                      ))}
                  </div>
               </DashboardModule>
            </div>
          )}

          {activeModules.includes('ai-alerts') && (
            <div key="ai-alerts">
               <DashboardModule title="Revere AI Alerts" icon={Sparkles} isDarkMode={isDarkMode} onRemove={() => removeModule('ai-alerts')} isEditMode={isEditMode}>
                  <div className="p-4 space-y-3">
                      <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-red-900/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex items-start gap-2">
                              <Sparkles size={14} className="text-red-500 mt-0.5" />
                              <div>
                                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-800'}`}>Critical Block Detected</h4>
                                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                                      "Coordinate with influencers" is blocked by Finance. Delay risk: High.
                                  </p>
                                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-red-200 text-red-700 dark:border-red-500/30 dark:text-red-300">
                                      View Blocker
                                  </Button>
                              </div>
                          </div>
                      </div>
                      
                      <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-purple-900/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                          <div className="flex items-start gap-2">
                              <Sparkles size={14} className="text-purple-500 mt-0.5" />
                              <div>
                                  <h4 className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-800'}`}>Optimization Opportunity</h4>
                                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                      Matt has capacity this week. Consider reassigning tasks from Jordan.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </div>
               </DashboardModule>
            </div>
          )}

          {activeModules.includes('team') && (
            <div key="team">
               <DashboardModule title="Team Availability" icon={Users} isDarkMode={isDarkMode} onRemove={() => removeModule('team')} isEditMode={isEditMode}>
                  <div className="p-4 space-y-4">
                      {['Jordan', 'Matt', 'Sarah', 'Kelly'].map(name => (
                          <div key={name} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                      {name[0]}
                                  </div>
                                  <div>
                                      <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{name}</div>
                                      <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>3 active tasks</div>
                                  </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                  <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                      <div className={`h-full rounded-full ${name === 'Jordan' ? 'bg-red-500 w-[90%]' : 'bg-green-500 w-[40%]'}`} />
                                  </div>
                                  <span className="text-[10px] text-gray-400">{name === 'Jordan' ? 'Overloaded' : 'Available'}</span>
                              </div>
                          </div>
                      ))}
                  </div>
               </DashboardModule>
            </div>
          )}
          
          {activeModules.includes('budget') && (
            <div key="budget">
                <DashboardModule title="Budget Tracker" icon={DollarSign} isDarkMode={isDarkMode} onRemove={() => removeModule('budget')} isEditMode={isEditMode}>
                    <div className="p-6 flex flex-col items-center justify-center h-full">
                        <div className="relative w-32 h-32 rounded-full border-8 border-gray-100 dark:border-white/5 flex items-center justify-center">
                            <div className="text-center">
                                <span className={`block text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>72%</span>
                                <span className="text-xs text-gray-500">Used</span>
                            </div>
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="4"
                                    strokeDasharray="72, 100"
                                />
                            </svg>
                        </div>
                        <div className="mt-4 w-full flex justify-between text-xs">
                            <div className="text-center">
                                <div className="text-gray-500">Total</div>
                                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$50,000</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500">Spent</div>
                                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$36,000</div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-500">Remaining</div>
                                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>$14,000</div>
                            </div>
                        </div>
                    </div>
                </DashboardModule>
            </div>
          )}

          {activeModules.includes('files') && (
            <div key="files">
                <DashboardModule title="Project Files" icon={FileText} isDarkMode={isDarkMode} onRemove={() => removeModule('files')} isEditMode={isEditMode}>
                    <div className="p-0">
                         {['Campaign Brief.pdf', 'Budget_v3.xlsx', 'Asset_Pack_Final.zip', 'Contract_Signed.pdf'].map(file => (
                             <div key={file} className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-100 hover:bg-gray-50'}`}>
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                         <FileText size={14} />
                                     </div>
                                     <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{file}</span>
                                 </div>
                                 <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                     <MoreHorizontal size={14} />
                                 </Button>
                             </div>
                         ))}
                    </div>
                </DashboardModule>
            </div>
          )}

        </ResponsiveGridLayout>

        {/* Styles for RGL Customization */}
        <style>{`
          .react-grid-layout { position: relative; transition: height 200ms ease; }
          .react-grid-item { transition: all 200ms ease; transition-property: left, top; }
          .react-grid-item.cssTransforms { transition-property: transform; }
          .react-grid-item.resizing { z-index: 100; box-shadow: 0 0 10px rgba(0,0,0,0.5); }
          .react-grid-item.react-grid-placeholder { background: ${isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)'} !important; border-radius: 12px; opacity: 0.5; z-index: 2; border: 2px dashed ${isDarkMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.5)'}; }
          .react-resizable-handle { position: absolute; width: 20px; height: 20px; bottom: 0; right: 0; cursor: se-resize; }
          .react-resizable-handle::after { content: ""; position: absolute; right: 3px; bottom: 3px; width: 6px; height: 6px; border-right: 2px solid ${isDarkMode ? '#555' : '#ccc'}; border-bottom: 2px solid ${isDarkMode ? '#555' : '#ccc'}; opacity: 0; transition: opacity 0.2s; }
          ${isEditMode ? '.react-resizable-handle::after { opacity: 1; }' : ''}
          ${isEditMode ? '.drag-handle { cursor: grab; }' : ''}
          ${isEditMode ? '.drag-handle:active { cursor: grabbing; }' : ''}
        `}</style>
      </div>

      <AddProjectModuleModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAddModule={handleAddModule}
        activeModules={activeModules}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

function DashboardModule({ title, icon: Icon, children, isDarkMode, onRemove, isEditMode }: any) {
    return (
        <div className={`h-full w-full rounded-xl border flex flex-col overflow-hidden shadow-sm transition-all group ${
            isDarkMode ? 'bg-[#18181b] border-white/10 shadow-black/40' : 'bg-white border-gray-200 shadow-gray-200/50'
        }`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 border-b drag-handle ${
              isDarkMode 
                ? 'border-white/5 bg-[#202023] group-hover:bg-[#252528]' 
                : 'border-gray-100 bg-gray-50/50 group-hover:bg-gray-100/80'
              } transition-colors
            `}>
                <div className="flex items-center gap-2">
                    <Icon size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <Maximize2 size={12} />
                    </button>
                    {isEditMode && (
                      <button 
                          onClick={onRemove}
                          className={`p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                      >
                          <X size={12} />
                      </button>
                    )}
                </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {children}
            </div>
        </div>
    );
}
