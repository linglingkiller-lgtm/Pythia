import React, { useState, useRef, useEffect } from 'react';
import { Layout, ChevronDown, Bell, Search, Plus, Grid3x3, LayoutGrid, Eye, EyeOff, Lock, Unlock, Edit2, GripVertical, Settings, Maximize2, TrendingUp, Users, Calendar, FileText, AlertCircle, DollarSign, Target, Zap, LayoutDashboard, ChevronUp, Edit3, Save, RotateCcw, X } from 'lucide-react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { useToast } from '../../contexts/ToastContext';
import { getPageTheme, getThemeStyles, hexToRgba } from '../../config/pageThemes';
import { WarRoomModule } from './WarRoomModule';
import { TasksModule } from './TasksModule';
import { BillsWatchlistModule } from './BillsWatchlistModule';
import { LegislatorWatchlistModule } from './LegislatorWatchlistModule';
import { PlaceholderModule } from './PlaceholderModule';
import { ModuleCard } from './ModuleCard';
import { AddModuleModal } from './AddModuleModal';

interface ModularDashboardProps {
  watchedLegislatorIds: Set<string>;
  onNavigateToLegislator: (id: string) => void;
}

export function ModularDashboard({
  watchedLegislatorIds,
  onNavigateToLegislator,
}: ModularDashboardProps) {
  const { layout, isEditMode, setEditMode, resetToPreset, saveLayout, updateModule } = useDashboard();
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresetSelector, setShowPresetSelector] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get Dashboard page theme
  const dashboardTheme = getPageTheme('Dashboard');

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

  const handleMoveUp = (moduleId: string) => {
    const moduleIndex = layout.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex > 0) {
      const modules = [...layout.modules];
      const temp = modules[moduleIndex];
      modules[moduleIndex] = modules[moduleIndex - 1];
      modules[moduleIndex - 1] = temp;
      // Update y positions to maintain order
      modules.forEach((m, idx) => {
        updateModule(m.id, { position: { ...m.position, y: idx * 2 } });
      });
    }
  };

  const handleMoveDown = (moduleId: string) => {
    const moduleIndex = layout.modules.findIndex(m => m.id === moduleId);
    if (moduleIndex < layout.modules.length - 1) {
      const modules = [...layout.modules];
      const temp = modules[moduleIndex];
      modules[moduleIndex] = modules[moduleIndex + 1];
      modules[moduleIndex + 1] = temp;
      // Update y positions to maintain order
      modules.forEach((m, idx) => {
        updateModule(m.id, { position: { ...m.position, y: idx * 2 } });
      });
    }
  };

  // Sort modules by y position
  const sortedModules = [...layout.modules].sort((a, b) => a.position.y - b.position.y);

  // Render module content based on type
  const renderModuleContent = (module: typeof layout.modules[0]) => {
    switch (module.type) {
      case 'war-room':
        return <WarRoomModule module={module} />;
      case 'tasks':
        return <TasksModule module={module} />;
      case 'bills-watchlist':
        return <BillsWatchlistModule module={module} />;
      case 'legislator-watchlist':
        return <LegislatorWatchlistModule module={module} watchedLegislatorIds={watchedLegislatorIds} onNavigateToLegislator={onNavigateToLegislator} />;
      default:
        return <PlaceholderModule module={module} />;
    }
  };

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

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30'
    }`}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-purple-900/20 to-transparent'
          : 'bg-gradient-to-b from-purple-50/40 to-transparent'
      }`} />

      {/* Header - Sticky with Glassmorphism */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/40 border-b border-white/[0.08]'
            : 'bg-white/40 border-b border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        animate={{
          paddingTop: isScrolled ? '12px' : '24px',
          paddingBottom: isScrolled ? '12px' : '16px',
        }}
      >
        {/* Subtle gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Dashboard" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(dashboardTheme.gradientFrom, 0.12)}, ${hexToRgba(dashboardTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(dashboardTheme.gradientFrom, 0.08)}, ${hexToRgba(dashboardTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(dashboardTheme.accent, 0.25)
                    : hexToRgba(dashboardTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(dashboardTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(dashboardTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(dashboardTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(dashboardTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <LayoutDashboard
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? dashboardTheme.glow : dashboardTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: dashboardTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? dashboardTheme.glow : dashboardTheme.accent,
                  }}
                >
                  Dashboard
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Dashboard
                </motion.h1>
                <motion.p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {layout.modules.length} Modules • Intelligence Overview
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              {!isEditMode && (
                <>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                    }`}
                  >
                    <Plus size={16} />
                    <span className="text-sm font-medium">Add Module</span>
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isDarkMode
                        ? 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Edit3 size={16} />
                    <span className="text-sm font-medium">Customize</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowPresetSelector(!showPresetSelector)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        isDarkMode
                          ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300'
                          : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <RotateCcw size={16} />
                      <span className="text-sm font-medium">Preset</span>
                    </button>
                    {showPresetSelector && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowPresetSelector(false)}
                        />
                        <div className={`absolute right-0 top-12 w-56 rounded-lg py-2 z-20 backdrop-blur-sm ${
                          isDarkMode
                            ? 'bg-slate-800/95 border border-purple-500/20 shadow-2xl'
                            : 'bg-white border border-gray-200 shadow-lg'
                        }`}>
                          <div className={`px-3 py-2 border-b ${isDarkMode ? 'border-purple-500/20' : 'border-gray-100'}`}>
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-gray-500'}`}>
                              Dashboard Presets
                            </p>
                          </div>
                          {(['executive', 'lobbying', 'campaign-services', 'public-affairs'] as const).map(preset => (
                            <button
                              key={preset}
                              onClick={() => handleResetToPreset(preset)}
                              className={`w-full px-3 py-2 text-left text-sm capitalize transition-all duration-200 ${
                                isDarkMode
                                  ? 'text-gray-300 hover:bg-purple-500/20 hover:text-purple-200'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {preset.replace('-', ' ')}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {isEditMode && (
                <>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/20'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    <Save size={16} />
                    <span className="text-sm font-medium">Save Layout</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isDarkMode
                        ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-gray-300 hover:border-red-500/50 hover:text-red-400'
                        : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <X size={16} />
                    <span className="text-sm font-medium">Cancel</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10" ref={containerRef}>
        {isEditMode && (
          <div className={`
            mb-6 p-4 border rounded-lg relative overflow-hidden
            ${isDarkMode 
              ? 'bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-blue-900/30 border-purple-500/30 backdrop-blur-sm' 
              : 'bg-purple-50 border-purple-200'
            }
          `}>
            {isDarkMode && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5" />
            )}
            <div className="flex items-start gap-3 relative z-10">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                ${isDarkMode
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50'
                  : 'bg-purple-600'
                }
              `}>
                <Edit3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${isDarkMode ? 'text-purple-200' : 'text-purple-900'}`}>
                  Edit Mode Active
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-purple-300/90' : 'text-purple-700'}`}>
                  Use up/down arrows to reorder modules, or click \"Save Layout\" when done.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="mb-4">
          <p className={`
            text-xs flex items-center gap-2
            ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}
          `}>
            {isDarkMode && <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-slow-pulse" />}
            Last updated: {new Date().toLocaleString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </p>
        </div>

        {/* Simple Flex Layout (replaces react-grid-layout) */}
        <div className="space-y-4">
          {sortedModules.map((module, index) => (
            <div key={module.id} className="relative">
              {isEditMode && (
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
                  <button
                    onClick={() => handleMoveUp(module.id)}
                    disabled={index === 0}
                    className={`
                      p-1 rounded transition-colors
                      ${index === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : isDarkMode
                          ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveDown(module.id)}
                    disabled={index === sortedModules.length - 1}
                    className={`
                      p-1 rounded transition-colors
                      ${index === sortedModules.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : isDarkMode
                          ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }
                    `}
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
              <ModuleCard module={module}>
                {renderModuleContent(module)}
              </ModuleCard>
            </div>
          ))}
        </div>

        {layout.modules.length === 0 && (
          <div className="text-center py-16">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative
              ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-700 shadow-xl shadow-purple-500/10' : 'bg-gray-100'}
            `}>
              {isDarkMode && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-transparent" />
              )}
              <Plus className={`w-8 h-8 relative z-10 ${isDarkMode ? 'text-purple-400' : 'text-gray-400'}`} />
            </div>
            <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No modules added yet
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Get started by adding modules to your dashboard
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className={`
                px-6 py-2.5 rounded-lg font-medium transition-all duration-300
                ${isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }
              `}
            >
              Add Your First Module
            </button>
          </div>
        )}

        {/* Add Module Modal */}
        <AddModuleModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </div>
  );
}