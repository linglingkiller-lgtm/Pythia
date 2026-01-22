import React, { useState, useRef, useEffect } from 'react';
import { Layout, ChevronDown, Inbox, Search, Plus, Grid3x3, LayoutGrid, Eye, EyeOff, Lock, Unlock, Edit2, GripVertical, Settings, Maximize2, TrendingUp, Users, Calendar, FileText, AlertCircle, DollarSign, Target, Zap, LayoutDashboard, ChevronUp, Edit3, Save, RotateCcw, X, Menu, CheckCircle2, Clock, Sparkles, User, LogOut, Mic, Sun, Moon } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Responsive } from 'react-grid-layout';
import { useTheme } from '../../contexts/ThemeContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';
import { getPageTheme, getThemeStyles, hexToRgba } from '../../config/pageThemes';
import { WarRoomModule } from './WarRoomModule';
import { TasksModule } from './TasksModule';
import { AlertsModule } from './AlertsModule';
import { CommitteeCalendarModule } from './CommitteeCalendarModule';
import { BillsWatchlistModule } from './BillsWatchlistModule';
import { LegislatorWatchlistModule } from './LegislatorWatchlistModule';
import { PlaceholderModule } from './PlaceholderModule';
import { ModuleCard } from './ModuleCard';
import { CustomizeDashboardModal } from './CustomizeDashboardModal';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { generateBriefingContent, BriefingContent } from '../../services/AiBriefingService';
import { PageLayout } from '../ui/PageLayout';
import { sampleNotifications } from '../../data/sampleNotifications';

// Custom Styles for Grid Layout
const gridLayoutStyles = `
  .react-grid-layout {
    position: relative;
    transition: height 200ms ease;
  }
  .react-grid-item {
    transition: all 200ms ease;
    transition-property: left, top, width, height;
  }
  .react-grid-item.cssTransforms {
    transition-property: transform, width, height;
  }
  .react-grid-item.resizing {
    z-index: 100;
    will-change: width, height;
  }
  .react-grid-item.react-draggable-dragging {
    transition: none;
    z-index: 100;
    will-change: transform;
  }
  .react-grid-item.dropping {
    visibility: hidden;
  }
  .react-grid-item.react-grid-placeholder {
    background: rgba(147, 51, 234, 0.15) !important;
    opacity: 0.8 !important;
    transition-duration: 100ms;
    z-index: 2;
    border-radius: 12px !important;
    border: 2px dashed rgba(147, 51, 234, 0.4) !important;
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
    border-right: 2px solid rgba(147, 51, 234, 0.5);
    border-bottom: 2px solid rgba(147, 51, 234, 0.5);
  }
`;

interface ModularDashboardProps {
  watchedLegislatorIds: Set<string>;
  onNavigateToLegislator: (id: string) => void;
  createAlertTopic?: string;
}

// Custom hook for responsive width
const MorningBriefingHero = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm border transition-all duration-500
      ${isDarkMode 
        ? 'bg-orange-500/10 border-orange-500/20 text-orange-200' 
        : 'bg-orange-50 border-orange-200 text-orange-800'
      }
    `}>
      <Sparkles size={12} className={isDarkMode ? 'text-orange-400' : 'text-orange-500'} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Morning Briefing Active</span>
    </div>
  );
};

const EveningBriefingHero = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-sm border transition-all duration-500
      ${isDarkMode 
        ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200' 
        : 'bg-indigo-50 border-indigo-200 text-indigo-800'
      }
    `}>
      <Sparkles size={12} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} />
      <span className="text-[10px] font-bold uppercase tracking-widest">Evening Briefing Active</span>
    </div>
  );
};

// Twinkling Stars Component
const TwinklingStars = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 60,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

function useContainerDimensions() {
  const [width, setWidth] = useState(1200);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = gridContainerRef.current;
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

  return { width, gridContainerRef };
}

export function ModularDashboard({
  watchedLegislatorIds,
  onNavigateToLegislator,
  createAlertTopic,
}: ModularDashboardProps) {
  const { layout, isEditMode, isMorningBriefing, briefingMode, setEditMode, resetToPreset, saveLayout, updateModule, toggleMorningBriefing } = useDashboard();
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const { width, gridContainerRef } = useContainerDimensions();
  const [showCustomizeOptions, setShowCustomizeOptions] = useState(false);
  
  // Alert Creation State
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTopic, setAlertTopic] = useState('');

  useEffect(() => {
    if (createAlertTopic) {
      setAlertTopic(createAlertTopic);
      setShowAlertModal(true);
    }
  }, [createAlertTopic]);

  // Get Dashboard page theme
  const dashboardTheme = getPageTheme('Dashboard');

  // Convert dashboard modules to grid layout format
  const generateLayout = (cols: number) => {
    return layout.modules.map((module) => {
       const w = module.size === 'small' ? 4 : module.size === 'medium' ? 6 : 12;
       return {
        i: module.id,
        x: module.position.x,
        y: module.position.y,
        w: Math.min(w, cols),
        h: module.size === 'small' ? 6 : module.size === 'medium' ? 8 : 10,
        minW: 3,
        minH: 4,
      };
    });
  };

  const [gridLayouts, setGridLayouts] = useState<ReactGridLayout.Layouts>({
    lg: generateLayout(12),
    md: generateLayout(10),
    sm: generateLayout(6),
    xs: generateLayout(4),
    xxs: generateLayout(2),
  });

  // Update grid layouts when modules change
  useEffect(() => {
    setGridLayouts({
      lg: generateLayout(12),
      md: generateLayout(10),
      sm: generateLayout(6),
      xs: generateLayout(4),
      xxs: generateLayout(2),
    });
  }, [layout.modules.length]);

  const handleSave = () => {
    saveLayout();
    showToast('Dashboard layout saved', 'success');
  };

  const handleCancel = () => {
    setEditMode(false);
  };

  const handleResetToPreset = (preset: 'executive' | 'lobbying' | 'campaign-services' | 'public-affairs') => {
    resetToPreset(preset);
    setShowPresetSelector(false);
    showToast(`Dashboard reset to ${preset} preset`, 'success');
  };

  const handleLayoutChange = (currentLayout: ReactGridLayout.Layout[], allLayouts: ReactGridLayout.Layouts) => {
    if (isEditMode) {
      // Update module positions based on grid layout
      currentLayout.forEach(layoutItem => {
        const module = layout.modules.find(m => m.id === layoutItem.i);
        if (module) {
          // Determine size based on width
          let size: 'small' | 'medium' | 'large' = 'medium';
          if (layoutItem.w <= 4) size = 'small';
          else if (layoutItem.w >= 10) size = 'large';
          
          updateModule(module.id, {
            position: { x: layoutItem.x, y: layoutItem.y },
            size: size
          });
        }
      });
      setGridLayouts(allLayouts);
    }
  };

  // Generate AI Briefing Content (memoized)
  const briefingContent = React.useMemo<BriefingContent | null>(() => {
    if (isMorningBriefing) {
      return generateBriefingContent();
    }
    return null;
  }, [isMorningBriefing]);

  // Dashboard stats
  const totalModules = layout.modules.length;
  const activeModules = layout.modules.filter(m => m.enabled).length;
  
  // Get user's first name
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  
  // Determine PageLayout props based on briefing mode
  const getPageLayoutProps = () => {
    if (briefingMode === 'morning') {
      return {
        title: 'Morning Briefing',
        subtitle: `Good morning, ${firstName}`,
        headerIcon: (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun size={28} className={isDarkMode ? 'text-orange-400' : 'text-orange-500'} />
          </motion.div>
        ),
        backgroundImage: (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <Sun size={450} color={isDarkMode ? '#fb923c' : '#f97316'} strokeWidth={0.5} />
          </motion.div>
        ),
        accentColor: '#f97316', // orange-500
        backgroundPosition: 'center' as const,
        briefingMode: 'morning' as const,
      };
    } else if (briefingMode === 'evening') {
      return {
        title: 'Evening Briefing',
        subtitle: `Good evening, ${firstName}`,
        headerIcon: (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon size={28} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-500'} />
          </motion.div>
        ),
        backgroundImage: (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon size={450} color={isDarkMode ? '#818cf8' : '#6366f1'} strokeWidth={0.5} />
          </motion.div>
        ),
        accentColor: '#6366f1', // indigo-500
        backgroundPosition: 'center' as const,
        briefingMode: 'evening' as const,
      };
    } else {
      // Normal dashboard
      return {
        title: 'Dashboard',
        subtitle: `${activeModules} active modules • ${layout.preset ? `${layout.preset.replace('-', ' ')} view` : 'Custom view'}`,
        headerIcon: <LayoutDashboard size={28} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />,
        backgroundImage: (
          <LayoutDashboard size={450} color={isDarkMode ? 'white' : dashboardTheme.accent} strokeWidth={0.5} />
        ),
        accentColor: dashboardTheme.accent,
        backgroundPosition: 'left' as const,
        briefingMode: undefined,
      };
    }
  };
  
  const pageLayoutProps = getPageLayoutProps();

  // Render module content based on type
  const renderModuleContent = (module: typeof layout.modules[0]) => {
    // Handle Morning Briefing overrides
    if (isMorningBriefing && briefingContent) {
      if (module.id === 'briefing-alerts') {
        return <AlertsModule module={module} alerts={briefingContent.alerts} />;
      }
      if (module.id === 'briefing-agenda') {
        return <CommitteeCalendarModule module={module} agenda={briefingContent.agenda} />;
      }
      if (module.id === 'briefing-tasks') {
        return <TasksModule module={module} tasks={briefingContent.tasks} />;
      }
    }

    switch (module.type) {
      case 'war-room':
        return <WarRoomModule module={module} />;
      case 'tasks':
        return <TasksModule module={module} />;
      case 'bills-watchlist':
        return <BillsWatchlistModule module={module} />;
      case 'legislator-watchlist':
        return <LegislatorWatchlistModule module={module} watchedLegislatorIds={watchedLegislatorIds} onNavigateToLegislator={onNavigateToLegislator} />;
      case 'notifications':
        return <AlertsModule module={module} alerts={sampleNotifications} />;
      case 'committee-calendar':
        // Pass empty or standard agenda if not briefing
        return <CommitteeCalendarModule module={module} />;
      default:
        return <PlaceholderModule module={module} />;
    }
  };

  return (
    <PageLayout
      title={pageLayoutProps.title}
      subtitle={pageLayoutProps.subtitle}
      headerIcon={pageLayoutProps.headerIcon}
      backgroundImage={pageLayoutProps.backgroundImage}
      backgroundPosition={pageLayoutProps.backgroundPosition}
      accentColor={pageLayoutProps.accentColor}
      contentClassName="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative"
      headerContent={
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
            <Grid3x3 size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{totalModules} Modules</span>
          </div>
        </div>
      }
      
      // Customization Props hooked to Header
      onCustomize={() => setEditMode(true)}
      isCustomizing={isEditMode}
      onSaveCustomization={handleSave}
      onCancelCustomization={handleCancel}
    >
      <style>{gridLayoutStyles}</style>
      
      {/* Remove briefing overlays - visuals are now in the header */}

      <div className="p-6 relative z-10">
        <div ref={gridContainerRef} style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Responsive
            className="layout"
            layouts={gridLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={60}
            width={width}
            onLayoutChange={handleLayoutChange}
            isDraggable={isEditMode}
            isResizable={isEditMode}
            draggableHandle=".drag-handle"
            margin={[24, 24]}
          >
            {layout.modules.map(module => (
              <div key={module.id} className={isEditMode ? 'cursor-grab active:cursor-grabbing' : ''}>
                <ModuleCard
                  module={module}
                >
                  {renderModuleContent(module)}
                </ModuleCard>
              </div>
            ))}
          </Responsive>

          {/* Add Module Placeholders in Edit Mode */}
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
        </div>
      </div>

      {/* Add Module Modal */}
      {showAddModal && (
        <CustomizeDashboardModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onPresetSelect={handleResetToPreset}
        />
      )}

      {/* Create Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <AlertCircle className="text-amber-500" size={20} />
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create New Alert</h3>
              </div>
              <button onClick={() => setShowAlertModal(false)} className={`p-1 rounded-lg hover:bg-gray-100 ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'text-gray-500'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Alert Topic</label>
                <input 
                  type="text" 
                  value={alertTopic}
                  onChange={(e) => setAlertTopic(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500 ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Frequency</label>
                <select className={`w-full px-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-amber-500 ${isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <option>Real-time</option>
                  <option>Daily Digest</option>
                  <option>Weekly Summary</option>
                </select>
              </div>
            </div>
            <div className={`p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-100 bg-gray-50'}`}>
              <button 
                onClick={() => setShowAlertModal(false)}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  showToast(`Alert created for "${alertTopic}"`, 'success');
                  setShowAlertModal(false);
                }}
                className="px-4 py-2 rounded-lg font-medium bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}