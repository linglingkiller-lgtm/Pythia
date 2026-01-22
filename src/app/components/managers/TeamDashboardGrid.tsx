import React, { useState, useEffect } from 'react';
import { Responsive } from 'react-grid-layout';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit3, Save, X, Minimize2, Maximize2, 
  LayoutDashboard, Target, Users, AlertCircle, Calendar, 
  Activity, Zap, BarChart3, Clock, CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { TeamKpiStrip } from './TeamKpiStrip';
import { ManagerActionCenter } from './ManagerActionCenter';
import { TeamWorkloadTable } from './TeamWorkloadTable';
import { mockTeamMembers, mockManagerActions, getTeamKPIs } from '../../data/teamData';

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

// Custom Styles (Same as ModularMyWorkTab)
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

export type TeamModuleType = 
  | 'kpi-overview'
  | 'workload-table'
  | 'action-center'
  | 'capacity-heatmap'
  | 'leave-calendar'
  | 'recent-activity';

export interface TeamModule {
  id: string;
  type: TeamModuleType;
  title: string;
  collapsed: boolean;
}

const AVAILABLE_MODULES: Array<{ type: TeamModuleType; title: string; icon: React.ElementType; defaultH: number; defaultW: number }> = [
  { type: 'kpi-overview', title: 'Team KPIs', icon: Target, defaultH: 4, defaultW: 12 },
  { type: 'workload-table', title: 'Workload Overview', icon: Users, defaultH: 10, defaultW: 8 },
  { type: 'action-center', title: 'Action Center', icon: Zap, defaultH: 10, defaultW: 4 },
  { type: 'capacity-heatmap', title: 'Capacity Heatmap', icon: BarChart3, defaultH: 6, defaultW: 6 },
  { type: 'leave-calendar', title: 'Upcoming Leave', icon: Calendar, defaultH: 6, defaultW: 6 },
  { type: 'recent-activity', title: 'Recent Activity', icon: Activity, defaultH: 6, defaultW: 12 },
];

export function TeamDashboardGrid({ members, onSelectEmployee }: { members: any[], onSelectEmployee: (employee: any) => void }) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Container Width Hook
  const { width, containerRef } = useContainerDimensions();

  // Initial Modules
  const [modules, setModules] = useState<TeamModule[]>([
    { id: 'kpi-1', type: 'kpi-overview', title: 'Team KPIs', collapsed: false },
    { id: 'workload-1', type: 'workload-table', title: 'Workload Overview', collapsed: false },
    { id: 'action-1', type: 'action-center', title: 'Action Center', collapsed: false },
    { id: 'capacity-1', type: 'capacity-heatmap', title: 'Capacity Heatmap', collapsed: false },
  ]);

  // Initial Layout
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'kpi-1', x: 0, y: 0, w: 12, h: 4 },
      { i: 'workload-1', x: 0, y: 4, w: 8, h: 10 },
      { i: 'action-1', x: 8, y: 4, w: 4, h: 10 },
      { i: 'capacity-1', x: 0, y: 14, w: 6, h: 6 },
    ]
  });

  const handleAddModule = (type: TeamModuleType) => {
    const config = AVAILABLE_MODULES.find(m => m.type === type);
    if (!config) return;

    const newId = `${type}-${Date.now()}`;
    const newModule: TeamModule = {
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
      
      // Update height in layout
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
    <div className="flex flex-col h-full bg-transparent">
      <style>{gridLayoutStyles}</style>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Team Overview
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Manage your dashboard layout
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
                members={members}
                isEditMode={isEditMode}
                isDarkMode={isDarkMode}
                onToggleCollapse={() => handleToggleCollapse(module.id)}
                onRemove={() => handleRemoveModule(module.id)}
                onSelectEmployee={onSelectEmployee}
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
                    const isAdded = modules.some(mod => mod.type === m.type);
                    return (
                        <button
                          key={m.type}
                          disabled={isAdded}
                          onClick={() => handleAddModule(m.type)}
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            isDarkMode 
                              ? `border-white/10 ${isAdded ? 'bg-white/5 opacity-50 cursor-default' : 'hover:bg-white/5 hover:border-purple-500/50'}` 
                              : `border-gray-200 ${isAdded ? 'bg-gray-50 opacity-50 cursor-default' : 'hover:bg-gray-50 hover:border-purple-500/50'}`
                          }`}
                        >
                           <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                isAdded 
                                    ? (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-500')
                                    : (isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600')
                              }`}>
                                 <m.icon size={20} />
                              </div>
                              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{m.title}</span>
                           </div>
                           <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                             {isAdded ? (
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

function ModuleCard({ module, members, isEditMode, isDarkMode, onToggleCollapse, onRemove, onSelectEmployee }: any) {
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
            <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                <ModuleContent 
                    type={module.type} 
                    isDarkMode={isDarkMode} 
                    members={members} 
                    onSelectEmployee={onSelectEmployee}
                />
            </div>
          )}
       </div>
    </div>
  );
}

function ModuleContent({ type, isDarkMode, members, onSelectEmployee }: { type: TeamModuleType, isDarkMode: boolean, members: any[], onSelectEmployee: (emp: any) => void }) {
  const kpis = getTeamKPIs(members);

  switch (type) {
    case 'kpi-overview':
      return <TeamKpiStrip kpis={kpis} />;
    
    case 'workload-table':
      return (
        <div className="h-full">
           <TeamWorkloadTable 
             members={members} 
             viewMode="table" 
             onSelectEmployee={onSelectEmployee} 
           />
        </div>
      );

    case 'action-center':
      return (
        <ManagerActionCenter 
           actions={mockManagerActions}
           onActionClick={() => {}} 
        />
      );

    case 'capacity-heatmap':
      return <CapacityHeatmap isDarkMode={isDarkMode} members={members} />;

    case 'leave-calendar':
      return <LeaveCalendar isDarkMode={isDarkMode} />;

    case 'recent-activity':
      return <RecentActivity isDarkMode={isDarkMode} />;

    default:
      return null;
  }
}

// New Module Components

function CapacityHeatmap({ isDarkMode, members }: { isDarkMode: boolean, members: any[] }) {
   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
   return (
      <div className="p-4 h-full flex flex-col">
         <div className="grid grid-cols-6 gap-2 mb-2 text-xs font-bold opacity-50">
            <div>Member</div>
            {days.map(d => <div key={d} className="text-center">{d}</div>)}
         </div>
         <div className="flex-1 overflow-y-auto space-y-2">
            {members.slice(0, 8).map(m => (
               <div key={m.id} className="grid grid-cols-6 gap-2 items-center">
                  <div className="text-xs truncate font-medium">{m.name.split(' ')[0]}</div>
                  {days.map((d, i) => {
                     // Mock random capacity
                     const load = Math.random();
                     let color = 'bg-green-500';
                     if (load > 0.6) color = 'bg-yellow-500';
                     if (load > 0.8) color = 'bg-red-500';
                     return (
                        <div key={i} className={`h-6 rounded-md ${color}/20 flex items-center justify-center`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
                        </div>
                     );
                  })}
               </div>
            ))}
         </div>
      </div>
   );
}

function LeaveCalendar({ isDarkMode }: { isDarkMode: boolean }) {
   const leaves = [
      { name: 'Sarah Miller', date: 'Oct 24-25', type: 'PTO' },
      { name: 'James Wilson', date: 'Oct 28', type: 'Sick' },
      { name: 'Elena Rodriguez', date: 'Nov 1-5', type: 'Vacation' },
   ];
   
   return (
      <div className="p-4">
         <div className="space-y-3">
            {leaves.map((l, i) => (
               <div key={i} className={`flex items-center justify-between p-3 rounded-lg border ${
                  isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
               }`}>
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                     }`}>
                        <Calendar size={14} />
                     </div>
                     <div>
                        <div className="text-sm font-bold">{l.name}</div>
                        <div className="text-xs opacity-60">{l.type}</div>
                     </div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 rounded bg-white/10">
                     {l.date}
                  </div>
               </div>
            ))}
            <div className="text-center mt-4">
               <button className="text-xs text-purple-500 font-bold hover:underline">
                  View Full Calendar
               </button>
            </div>
         </div>
      </div>
   );
}

function RecentActivity({ isDarkMode }: { isDarkMode: boolean }) {
   const activities = [
      { user: 'Michael Chang', action: 'completed review for', target: 'Campaign Strategy', time: '10m ago' },
      { user: 'Sarah Miller', action: 'uploaded deliverable', target: 'Q3 Report', time: '1h ago' },
      { user: 'David Kim', action: 'updated status of', target: 'Lobbying Init', time: '2h ago' },
      { user: 'Elena R', action: 'commented on', target: 'Team Sync', time: '4h ago' },
   ];

   return (
      <div className="p-4">
         <div className="space-y-4">
            {activities.map((a, i) => (
               <div key={i} className="flex gap-3 text-sm">
                  <div className={`mt-1 min-w-[6px] w-[6px] h-[6px] rounded-full ${
                     isDarkMode ? 'bg-purple-500' : 'bg-purple-600'
                  }`} />
                  <div>
                     <span className="font-bold">{a.user}</span>{' '}
                     <span className="opacity-70">{a.action}</span>{' '}
                     <span className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        {a.target}
                     </span>
                     <div className="text-xs opacity-50 mt-0.5">{a.time}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
