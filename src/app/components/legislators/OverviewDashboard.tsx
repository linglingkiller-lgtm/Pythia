import React, { useState, useEffect } from 'react';
import * as RGL from 'react-grid-layout';
import { 
  TrendingUp, Users, Calendar, CheckCircle, AlertCircle, Sparkles,
  Phone, Mail, MessageSquare, Clock, Target, Zap, Award, Activity,
  Eye, ChevronRight, TrendingDown, Minus, Briefcase,
  Edit3, Save, RotateCcw, X, Plus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Legislator } from './legislatorData';
import { LeadershipPosition } from './chamberData';
import { ChamberControlCards } from './ChamberControlCards';
import { ChamberSummary } from './chamberData';
import { 
  HeroStatsModule, 
  IntelligenceModule, 
  PriorityLegislatorsModule, 
  CommitteeInfluenceModule, 
  RecentActivityModule,
  LeadershipModuleWrapper
} from './LegislatorOverviewModules';
import { motion, AnimatePresence } from 'motion/react';

// Handle React Grid Layout imports safely for Vite/ESM
const Responsive = RGL.Responsive || (RGL as any).default?.Responsive;
// We don't use WidthProvider here because we are calculating width manually
// to ensure stability across different environments where HOC might fail.

// Custom Styles for Grid Layout
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

// --- Types ---

interface OverviewDashboardProps {
  legislators: Legislator[];
  watchedLegislatorIds?: Set<string>;
  onSelectLegislator: (legislatorId: string) => void;
  chamberData: ChamberSummary[];
  leadershipPositions: LeadershipPosition[];
}

interface ModuleConfig {
  id: string;
  type: 'stats' | 'leadership' | 'intelligence' | 'priority' | 'committees' | 'activity';
  title: string;
  enabled: boolean;
}

// --- Default Layouts ---

const defaultLayouts = {
  lg: [
    { i: 'stats', x: 0, y: 0, w: 12, h: 4, minH: 4 },
    { i: 'leadership', x: 0, y: 4, w: 8, h: 10, minH: 8 },
    { i: 'intelligence', x: 8, y: 4, w: 4, h: 10, minH: 6 },
    { i: 'priority', x: 0, y: 14, w: 4, h: 9, minH: 6 },
    { i: 'committees', x: 4, y: 14, w: 4, h: 9, minH: 6 },
    { i: 'activity', x: 8, y: 14, w: 4, h: 9, minH: 6 },
  ],
  md: [
    { i: 'stats', x: 0, y: 0, w: 10, h: 4 },
    { i: 'leadership', x: 0, y: 4, w: 10, h: 10 },
    { i: 'intelligence', x: 0, y: 14, w: 10, h: 8 },
    { i: 'priority', x: 0, y: 22, w: 5, h: 8 },
    { i: 'committees', x: 5, y: 22, w: 5, h: 8 },
    { i: 'activity', x: 0, y: 30, w: 10, h: 6 },
  ]
};

const initialModules: ModuleConfig[] = [
  { id: 'stats', type: 'stats', title: 'Quick Stats', enabled: true },
  { id: 'leadership', type: 'leadership', title: 'Leadership Summary', enabled: true },
  { id: 'intelligence', type: 'intelligence', title: 'Intelligence Panel', enabled: true },
  { id: 'priority', type: 'priority', title: 'Priority Legislators', enabled: true },
  { id: 'committees', type: 'committees', title: 'Committee Influence', enabled: true },
  { id: 'activity', type: 'activity', title: 'Recent Activity', enabled: true },
];

// Custom hook for responsive width (borrowed from ModularMyWorkTab)
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

export function OverviewDashboard({ 
  legislators, 
  watchedLegislatorIds, 
  onSelectLegislator,
  chamberData,
  leadershipPositions
}: OverviewDashboardProps) {
  const { isDarkMode } = useTheme();
  
  // State
  const [isEditMode, setIsEditMode] = useState(false);
  const [modules, setModules] = useState<ModuleConfig[]>(initialModules);
  const [layouts, setLayouts] = useState(defaultLayouts);
  
  // Handlers
  const handleLayoutChange = (currentLayout: any, allLayouts: any) => {
    setLayouts(allLayouts);
  };

  const toggleModule = (id: string) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  };

  const resetLayout = () => {
    setLayouts(defaultLayouts);
    setModules(initialModules);
    setIsEditMode(false);
  };
  
  // Calculate container width manually
  const { width, containerRef } = useContainerDimensions();

  const renderModuleContent = (type: string) => {
    const props = {
      legislators,
      watchedLegislatorIds,
      onSelectLegislator,
      leadershipPositions,
      isDarkMode
    };

    switch (type) {
      case 'stats': return <HeroStatsModule {...props} />;
      case 'leadership': return <LeadershipModuleWrapper {...props} />;
      case 'intelligence': return <IntelligenceModule isDarkMode={isDarkMode} />;
      case 'priority': return <PriorityLegislatorsModule {...props} />;
      case 'committees': return <CommitteeInfluenceModule isDarkMode={isDarkMode} />;
      case 'activity': return <RecentActivityModule isDarkMode={isDarkMode} />;
      default: return <div>Unknown Module</div>;
    }
  };

  return (
    <div className="animate-fadeIn pb-12">
      <style>{gridLayoutStyles}</style>
      
      {/* Fixed Anchor Section: Chamber Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
           {/* Section Title */}
           <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Chamber Breakdown
           </h2>
           
           {/* Edit Controls */}
           <div className="flex items-center gap-2">
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all
                    ${isDarkMode 
                      ? 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10' 
                      : 'bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-900 border border-gray-200 shadow-sm'
                    }
                  `}
                >
                  <Edit3 size={14} />
                  Customize View
                </button>
              ) : (
                <>
                  <button
                    onClick={resetLayout}
                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    title="Reset Layout"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className={`
                      flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all
                      bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-105
                    `}
                  >
                    <Save size={14} />
                    Save Layout
                  </button>
                </>
              )}
           </div>
        </div>
        <ChamberControlCards chambers={chamberData} />
      </div>

      {/* Grid Layout Section */}
      <div className="relative" ref={containerRef}>
         {/* Edit Mode Overlay / Grid Guidelines could go here */}
         
         <Responsive
            width={width}
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={40}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            onLayoutChange={handleLayoutChange}
            margin={[16, 16]}
            draggableHandle=".drag-handle"
         >
            {modules.filter(m => m.enabled).map(module => (
              <div key={module.id} className="relative group/module h-full">
                 <div className={`
                    h-full w-full rounded-xl overflow-hidden flex flex-col transition-all duration-300
                    ${isEditMode ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent shadow-2xl' : ''}
                    ${isDarkMode 
                       ? 'bg-slate-900/40 border border-white/10 shadow-sm backdrop-blur-md' 
                       : 'bg-white border border-gray-200 shadow-sm'
                    }
                 `}>
                    {/* Header (Always Visible) */}
                    <div className={`
                       px-4 py-3 border-b flex items-center justify-between cursor-move drag-handle flex-shrink-0
                       ${isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'}
                    `}>
                       <div className="flex items-center gap-3">
                          {/* Icon based on module type */}
                          {module.type === 'stats' && <Target size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
                          {module.type === 'leadership' && <Users size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />}
                          {module.type === 'intelligence' && <Sparkles size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />}
                          {module.type === 'priority' && <Target size={16} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />}
                          {module.type === 'committees' && <Briefcase size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />}
                          {module.type === 'activity' && <Activity size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
                          
                          <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                             {module.title}
                          </span>
                       </div>
                       
                       <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
                          {isEditMode && (
                             <button 
                                onClick={() => toggleModule(module.id)}
                                className={`p-1.5 rounded hover:bg-red-500/10 hover:text-red-500 transition-colors ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
                             >
                                <X size={14} />
                             </button>
                          )}
                       </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative">
                       {renderModuleContent(module.type)}
                    </div>
                 </div>
              </div>
            ))}
         </Responsive>

         {/* Add Module Placeholders (Only in Edit Mode) */}
         {isEditMode && modules.some(m => !m.enabled) && (
            <div className="mt-8 p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-4 animate-fadeIn">
               <h3 className={`font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available Modules</h3>
               <div className="flex flex-wrap justify-center gap-4">
                  {modules.filter(m => !m.enabled).map(module => (
                     <button
                        key={module.id}
                        onClick={() => toggleModule(module.id)}
                        className={`
                           flex items-center gap-2 px-4 py-2 rounded-lg border transition-all
                           ${isDarkMode 
                              ? 'bg-slate-800 border-white/10 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' 
                              : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
                           }
                        `}
                     >
                        <Plus size={16} />
                        {module.title}
                     </button>
                  ))}
               </div>
            </div>
         )}
      </div>
    </div>
  );
}
