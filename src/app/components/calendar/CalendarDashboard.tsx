import React, { useState, useEffect } from 'react';
import { Responsive } from 'react-grid-layout';
import { 
  Plus, Edit3, Save, X, Minimize2, Maximize2, 
  LayoutDashboard, Target, Calendar, 
  Activity, Zap, BarChart3, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { CalendarGrid } from './CalendarGrid';
import { DayAgenda } from './DayAgenda';
import { AIOpportunities } from './AIOpportunities';
import { DeadlinesCompliance } from './DeadlinesCompliance';
import { QuickActions } from './QuickActions';
import { CalendarEvent } from './CalendarPage';

// Reuse styles from TeamDashboardGrid for consistency
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
`;

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
    
    if (element.clientWidth > 0) {
        setWidth(element.clientWidth);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return { width, containerRef };
}

export type CalendarModuleType = 
  | 'main-calendar'
  | 'day-agenda'
  | 'ai-opportunities'
  | 'deadlines'
  | 'quick-actions';

export interface CalendarModule {
  id: string;
  type: CalendarModuleType;
  title: string;
  collapsed: boolean;
}

const AVAILABLE_MODULES: Array<{ type: CalendarModuleType; title: string; icon: React.ElementType; defaultH: number; defaultW: number }> = [
  { type: 'main-calendar', title: 'Calendar View', icon: Calendar, defaultH: 14, defaultW: 8 },
  { type: 'day-agenda', title: 'Day Agenda', icon: Activity, defaultH: 8, defaultW: 4 },
  { type: 'ai-opportunities', title: 'AI Opportunities', icon: Zap, defaultH: 8, defaultW: 4 },
  { type: 'deadlines', title: 'Compliance & Deadlines', icon: CheckCircle2, defaultH: 6, defaultW: 4 },
  { type: 'quick-actions', title: 'Quick Actions', icon: LayoutDashboard, defaultH: 4, defaultW: 4 },
];

interface CalendarDashboardProps {
  currentDate: Date;
  events: CalendarEvent[];
  viewMode: 'Month' | 'Week' | 'Agenda';
  selectedDay: Date | null;
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (opportunity: any) => void;
}

export function CalendarDashboard({
  currentDate,
  events,
  viewMode,
  selectedDay,
  onDayClick,
  onEventClick,
  onAddEvent
}: CalendarDashboardProps) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { width, containerRef } = useContainerDimensions();

  // Initial Modules
  const [modules, setModules] = useState<CalendarModule[]>([
    { id: 'cal-1', type: 'main-calendar', title: 'Calendar View', collapsed: false },
    { id: 'agenda-1', type: 'day-agenda', title: 'Day Agenda', collapsed: false },
    { id: 'ai-1', type: 'ai-opportunities', title: 'AI Opportunities', collapsed: false },
    { id: 'deadlines-1', type: 'deadlines', title: 'Compliance & Deadlines', collapsed: false },
    { id: 'actions-1', type: 'quick-actions', title: 'Quick Actions', collapsed: false },
  ]);

  // Initial Layout
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'cal-1', x: 0, y: 0, w: 8, h: 14 },
      { i: 'agenda-1', x: 8, y: 0, w: 4, h: 8 },
      { i: 'ai-1', x: 8, y: 8, w: 4, h: 8 },
      { i: 'deadlines-1', x: 0, y: 14, w: 4, h: 6 },
      { i: 'actions-1', x: 4, y: 14, w: 4, h: 4 },
    ]
  });

  const handleAddModule = (type: CalendarModuleType) => {
    const config = AVAILABLE_MODULES.find(m => m.type === type);
    if (!config) return;

    const newId = `${type}-${Date.now()}`;
    const newModule: CalendarModule = {
      id: newId,
      type,
      title: config.title,
      collapsed: false
    };

    setModules([...modules, newModule]);
    setLayouts(prev => ({
      ...prev,
      lg: [...(prev.lg || []), { i: newId, x: 0, y: Infinity, w: config.defaultW, h: config.defaultH }]
    }));
    setShowAddModal(false);
    showToast(`Added ${config.title}`, 'success');
  };

  const handleRemoveModule = (id: string) => {
    setModules(modules.filter(m => m.id !== id));
    showToast('Module removed', 'info');
  };

  const handleToggleCollapse = (id: string) => {
    setModules(modules.map(m => {
      if (m.id !== id) return m;
      const collapsed = !m.collapsed;
      
      setLayouts(prev => {
        const layout = prev.lg || [];
        const item = layout.find(l => l.i === id);
        if (!item) return prev;
        
        const config = AVAILABLE_MODULES.find(mod => mod.type === m.type);
        const defaultH = config?.defaultH || 6;

        return {
          ...prev,
          lg: layout.map(l => l.i === id ? { ...l, h: collapsed ? 2 : defaultH } : l)
        };
      });

      return { ...m, collapsed };
    }));
  };

  return (
    <div className="flex flex-col h-full bg-transparent p-6">
      <style>{gridLayoutStyles}</style>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Calendar Dashboard
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Manage your schedule and event tracking
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <>
              <button
                onClick={() => setShowAddModal(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    isDarkMode
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Plus size={14} />
                Add Module
              </button>
              <button
                onClick={() => setIsEditMode(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    isDarkMode
                    ? 'border-white/10 bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <Edit3 size={14} />
                Customize
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all"
            >
              <Save size={14} />
              Done Editing
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div ref={containerRef}>
        <Responsive
            width={width}
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts)}
            margin={[20, 20]}
        >
            {modules.map(module => (
            <div key={module.id} className="relative group">
                <ModuleCard
                  module={module}
                  isEditMode={isEditMode}
                  isDarkMode={isDarkMode}
                  onToggleCollapse={() => handleToggleCollapse(module.id)}
                  onRemove={() => handleRemoveModule(module.id)}
                  
                  // Pass through props
                  currentDate={currentDate}
                  events={events}
                  viewMode={viewMode}
                  selectedDay={selectedDay}
                  onDayClick={onDayClick}
                  onEventClick={onEventClick}
                  onAddEvent={onAddEvent}
                />
            </div>
            ))}
        </Responsive>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className={`w-full max-w-2xl rounded-xl border shadow-2xl overflow-hidden ${isDarkMode ? 'bg-[#1a1a1d] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="p-4 border-b flex justify-between items-center">
                 <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Add Module</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                 {AVAILABLE_MODULES.map(m => {
                    // Check if unique modules like Calendar are already added
                    const isUnique = ['main-calendar'].includes(m.type);
                    const isAdded = modules.some(mod => mod.type === m.type);
                    const disabled = isUnique && isAdded;
                    
                    return (
                        <button
                          key={m.type}
                          disabled={disabled}
                          onClick={() => handleAddModule(m.type)}
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            isDarkMode 
                              ? `border-white/10 ${disabled ? 'bg-white/5 opacity-50 cursor-default' : 'hover:bg-white/5 hover:border-purple-500/50'}` 
                              : `border-gray-200 ${disabled ? 'bg-gray-50 opacity-50 cursor-default' : 'hover:bg-gray-50 hover:border-purple-500/50'}`
                          }`}
                        >
                           <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                disabled 
                                    ? (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-500')
                                    : (isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600')
                              }`}>
                                 <m.icon size={20} />
                              </div>
                              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{m.title}</span>
                           </div>
                           <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                             {disabled ? (
                                <span className="text-emerald-500 font-medium flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    Added
                                </span>
                             ) : (
                                "Click to add to dashboard"
                             )}
                           </p>
                        </button>
                    );
                 })}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function ModuleCard({ module, isEditMode, isDarkMode, onToggleCollapse, onRemove, ...props }: any) {
  const config = AVAILABLE_MODULES.find(m => m.type === module.type);
  const Icon = config?.icon || Target;

  return (
    <div className={`h-full w-full rounded-xl border overflow-hidden flex flex-col transition-all duration-300 ${
        isDarkMode ? 'bg-[#0a0a0b]/80 border-white/10' : 'bg-white border-gray-200'
    }`}>
       {/* Header */}
       <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
       } ${isEditMode ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-2">
             <Icon size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
             <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {module.title}
             </span>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={onToggleCollapse} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {module.collapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
             </button>
             {isEditMode && (
               <button onClick={onRemove} className="p-1 rounded hover:bg-red-100 text-red-500">
                  <X size={14} />
               </button>
             )}
          </div>
       </div>

       {/* Content */}
       <div className="flex-1 overflow-hidden relative">
          {!module.collapsed && (
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-2">
                <ModuleContent 
                    type={module.type} 
                    {...props}
                />
            </div>
          )}
       </div>
    </div>
  );
}

function ModuleContent({ type, currentDate, events, viewMode, selectedDay, onDayClick, onEventClick, onAddEvent }: any) {
  switch (type) {
    case 'main-calendar':
      return (
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          viewMode={viewMode}
          onDayClick={onDayClick}
          onEventClick={onEventClick}
          selectedDay={selectedDay}
        />
      );
    
    case 'day-agenda':
      return (
        <DayAgenda
          selectedDay={selectedDay || currentDate} // Fallback to current date if no day selected
          events={events}
          onEventClick={onEventClick}
        />
      );

    case 'ai-opportunities':
      return <AIOpportunities onAddEvent={onAddEvent} />;

    case 'deadlines':
      return <DeadlinesCompliance />;

    case 'quick-actions':
      return <QuickActions />;

    default:
      return null;
  }
}
