import React, { useState, useEffect } from 'react';
import { Responsive } from 'react-grid-layout';
import { 
  Plus, Edit3, Save, X, Minimize2, Maximize2, 
  Map as MapIcon, Filter, Activity, List, BarChart3, 
  CheckCircle2, LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { ElectionsMap } from '../elections-hub/overview/ElectionsMap';
import { OverviewFilters } from '../elections-hub/overview/OverviewFilters';
import { CountyIntelPanel } from '../elections-hub/overview/CountyIntelPanel';
import { RacesTable } from '../elections-hub/races/RacesTable';
import { ForecastSimulator } from '../elections-hub/analytics/ForecastSimulator';
import { mockElectionsHub, Race } from '../../data/electionsHubData';

// Reuse styles for consistency
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

export type ElectionsModuleType = 
  | 'map-tracker'
  | 'filters'
  | 'intel-panel'
  | 'race-table'
  | 'forecast-sim';

export interface ElectionsModule {
  id: string;
  type: ElectionsModuleType;
  title: string;
  collapsed: boolean;
}

const AVAILABLE_MODULES: Array<{ type: ElectionsModuleType; title: string; icon: React.ElementType; defaultH: number; defaultW: number }> = [
  { type: 'map-tracker', title: 'Election Map Tracker', icon: MapIcon, defaultH: 12, defaultW: 8 },
  { type: 'filters', title: 'Filters & Controls', icon: Filter, defaultH: 12, defaultW: 2 },
  { type: 'intel-panel', title: 'County Intelligence', icon: Activity, defaultH: 12, defaultW: 2 },
  { type: 'race-table', title: 'All Races', icon: List, defaultH: 10, defaultW: 12 },
  { type: 'forecast-sim', title: 'Forecast Simulator', icon: BarChart3, defaultH: 8, defaultW: 12 },
];

interface ElectionsDashboardProps {
  selectedCountyId: string | null;
  onSelectCounty: (id: string | null) => void;
  onOpenRace: (race: Race) => void;
  onCompareRaces: (raceIds: string[]) => void;
  mapLayer: string;
  setMapLayer: (layer: string) => void;
}

export function ElectionsDashboard({
  selectedCountyId,
  onSelectCounty,
  onOpenRace,
  onCompareRaces,
  mapLayer,
  setMapLayer,
  isEditMode = false
}: ElectionsDashboardProps & { isEditMode?: boolean }) {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const { width, containerRef } = useContainerDimensions();

  // Initial Modules
  const [modules, setModules] = useState<ElectionsModule[]>([
    { id: 'filters-1', type: 'filters', title: 'Filters & Controls', collapsed: false },
    { id: 'map-1', type: 'map-tracker', title: 'Election Map Tracker', collapsed: false },
    { id: 'intel-1', type: 'intel-panel', title: 'County Intelligence', collapsed: false },
    { id: 'races-1', type: 'race-table', title: 'All Races', collapsed: false },
  ]);

  // Initial Layout
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'filters-1', x: 0, y: 0, w: 2, h: 12 },
      { i: 'map-1', x: 2, y: 0, w: 7, h: 12 },
      { i: 'intel-1', x: 9, y: 0, w: 3, h: 12 },
      { i: 'races-1', x: 0, y: 12, w: 12, h: 10 },
    ]
  });

  const handleAddModule = (type: ElectionsModuleType) => {
    const config = AVAILABLE_MODULES.find(m => m.type === type);
    if (!config) return;

    const newId = `${type}-${Date.now()}`;
    const newModule: ElectionsModule = {
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
    <div className="flex flex-col h-full bg-transparent p-6 relative">
      <style>{gridLayoutStyles}</style>

      {/* Add Module Button - Only visible in Edit Mode */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 right-6 z-40 flex justify-end mb-4"
          >
             <button
                onClick={() => setShowAddModal(true)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-lg backdrop-blur-md border transition-all
                    ${isDarkMode 
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/30' 
                    : 'bg-white border-indigo-100 text-indigo-600 hover:bg-indigo-50'
                    }
                `}
              >
                <Plus size={16} />
                Add Module
              </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div ref={containerRef} className={isEditMode ? 'ring-2 ring-indigo-500/20 rounded-xl bg-indigo-500/5 transition-all p-2' : ''}>
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
                  selectedCountyId={selectedCountyId}
                  onSelectCounty={onSelectCounty}
                  onOpenRace={onOpenRace}
                  onCompareRaces={onCompareRaces}
                  mapLayer={mapLayer}
                  setMapLayer={setMapLayer}
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
                    const isUnique = ['map-tracker', 'filters', 'intel-panel'].includes(m.type);
                    const isAdded = modules.some(mod => mod.type === m.type);
                    const disabled = isUnique && isAdded;
                    
                    return (
                        <button
                          key={m.type}
                          disabled={disabled}
                          onClick={() => handleAddModule(m.type)}
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            isDarkMode 
                              ? `border-white/10 ${disabled ? 'bg-white/5 opacity-50 cursor-default' : 'hover:bg-white/5 hover:border-indigo-500/50'}` 
                              : `border-gray-200 ${disabled ? 'bg-gray-50 opacity-50 cursor-default' : 'hover:bg-gray-50 hover:border-indigo-500/50'}`
                          }`}
                        >
                           <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                disabled 
                                    ? (isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-500')
                                    : (isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600')
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
  const Icon = config?.icon || LayoutGrid;

  return (
    <div className={`h-full w-full rounded-xl border overflow-hidden flex flex-col transition-all duration-300 ${
        isDarkMode ? 'bg-[#0a0a0b]/80 border-white/10' : 'bg-white border-gray-200'
    }`}>
       {/* Header */}
       <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'
       } ${isEditMode ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-2">
             <Icon size={16} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
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
                    {...props}
                />
            </div>
          )}
       </div>
    </div>
  );
}

function ModuleContent({ type, isDarkMode, selectedCountyId, onSelectCounty, onOpenRace, onCompareRaces, mapLayer, setMapLayer }: any) {
  const activeCounty = selectedCountyId ? mockElectionsHub.counties.find(c => c.id === selectedCountyId) || null : null;

  switch (type) {
    case 'map-tracker':
      return (
         <div className="h-full flex flex-col relative">
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {['Control', 'Competitiveness', 'Money', 'Narrative'].map(l => (
                    <button
                    key={l}
                    onClick={() => setMapLayer(l)}
                    className={`
                        px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-xl border transition-all shadow-lg
                        ${mapLayer === l 
                        ? isDarkMode 
                            ? 'bg-indigo-600/90 text-white border-indigo-500/50' 
                            : 'bg-indigo-600 text-white border-indigo-500'
                        : isDarkMode 
                            ? 'bg-slate-900/80 text-gray-400 border-white/10 hover:bg-slate-800' 
                            : 'bg-white/80 text-gray-600 border-gray-200 hover:bg-gray-50'
                        }
                    `}
                    >
                    {l}
                    </button>
                ))}
            </div>
            <ElectionsMap 
                counties={mockElectionsHub.counties} 
                selectedCountyId={selectedCountyId} 
                onSelectCounty={onSelectCounty}
                layer={mapLayer}
            />
         </div>
      );
    
    case 'filters':
      return (
        <div className="p-4">
           <OverviewFilters />
        </div>
      );

    case 'intel-panel':
      return (
         <div className="h-full p-4 overflow-y-auto">
             <CountyIntelPanel 
                county={activeCounty} 
                races={mockElectionsHub.races} 
                onOpenRace={onOpenRace}
             />
         </div>
      );

    case 'race-table':
      return (
         <div className="h-full p-6 overflow-y-auto">
             <RacesTable 
                 races={mockElectionsHub.races} 
                 candidates={mockElectionsHub.candidates}
                 onOpenRace={onOpenRace} 
                 onCompare={onCompareRaces}
             />
         </div>
      );

    case 'forecast-sim':
      return (
         <div className="h-full p-4 overflow-y-auto">
             <ForecastSimulator />
         </div>
      );

    default:
      return null;
  }
}
