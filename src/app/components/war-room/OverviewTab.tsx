import React, { useState } from 'react';
import { LayoutGrid, AlertCircle, TrendingUp, Calendar, Users, Plus, Sparkles, UserPlus, ClipboardCheck, History, FileText, ChevronRight, Activity, ChevronDown, CheckSquare } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiWeeklyPlan } from '../../data/campaignData';
import { CompetitiveTargetsPanel } from './competitive-targets/CompetitiveTargetsPanel';
import { TargetActionConsole } from './competitive-targets/TargetActionConsole';
import { TargetData } from './competitive-targets/TargetCard';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';

interface OverviewTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  bulkMode: boolean;
  setBulkMode: (mode: boolean) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  filters, 
  setFilters,
  bulkMode,
  setBulkMode
}) => {
  const { isDarkMode } = useTheme();
  const [selectedTarget, setSelectedTarget] = useState<TargetData | null>(null);
  const [activeTab, setActiveTab] = useState<'actions' | 'drivers' | 'history' | 'notes'>('actions');
  const [selectedTargetIds, setSelectedTargetIds] = useState<Set<string>>(new Set());

  // Bulk Mode Helpers
  const handleToggleTargetSelection = (targetId: string, checked: boolean) => {
    const newSelection = new Set(selectedTargetIds);
    if (checked) {
      newSelection.add(targetId);
    } else {
      newSelection.delete(targetId);
    }
    setSelectedTargetIds(newSelection);
  };

  const handleExecuteAction = (action: any) => {
    console.log('Executing action:', action);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Column 1: Targets List */}
      <div className={`
        w-[380px] flex-shrink-0 border-r flex flex-col
        ${isDarkMode ? 'border-white/10 bg-slate-900/10' : 'border-gray-200 bg-white/30'}
      `}>
        <CompetitiveTargetsPanel 
          selectedTargetId={selectedTarget?.id || null}
          onSelectTarget={setSelectedTarget}
          bulkMode={bulkMode}
          selectedTargetIds={selectedTargetIds}
          onToggleTargetSelection={handleToggleTargetSelection}
        />
      </div>

      {/* Column 2: Insight Detail */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {selectedTarget ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className={`flex-none px-6 py-4 border-b ${isDarkMode ? 'border-white/10 bg-slate-900/20' : 'border-gray-100 bg-white/50'}`}>
              <div className="flex items-start justify-between">
                 <div>
                    <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedTarget.projectName}
                    </h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{selectedTarget.geography}</span>
                      <span className={isDarkMode ? 'text-gray-600' : 'text-gray-300'}>•</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                         selectedTarget.paceStatus === 'on-track' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                         selectedTarget.paceStatus === 'slightly-behind' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                         'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {selectedTarget.paceStatus.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedTarget(null)}>
                      Close
                    </Button>
                 </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-6 mt-6 border-b border-transparent">
                {[
                  { id: 'actions', label: 'Actions', icon: Sparkles },
                  { id: 'drivers', label: 'Drivers', icon: Activity },
                  { id: 'history', label: 'History', icon: History },
                  { id: 'notes', label: 'Notes', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`
                        pb-2 text-sm font-medium flex items-center gap-2 transition-all relative
                        ${activeTab === tab.id 
                          ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                          : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800'
                        }
                      `}
                    >
                      <Icon size={14} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? 'bg-slate-950/30' : 'bg-gray-50/30'}`}>
              {activeTab === 'actions' && (
                <TargetActionConsole target={selectedTarget} onExecuteAction={handleExecuteAction} />
              )}
              {activeTab === 'drivers' && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'}`}>
                    <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Primary Pace Driver</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {selectedTarget.primaryBlocker 
                        ? `Identified blocker: ${selectedTarget.primaryBlocker.replace('-', ' ')} is impacting daily throughput.` 
                        : 'No primary blockers identified.'}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'history' && (
                <div className={`flex items-center justify-center h-48 rounded-lg border border-dashed ${isDarkMode ? 'border-slate-700 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                  History Trend UI Placeholder
                </div>
              )}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <textarea 
                    className={`
                      w-full h-32 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
                      ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}
                    `}
                    placeholder="Add internal notes about this target..."
                  />
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm">Save Note</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State: War Room Briefing */
          <div className="flex-1 flex flex-col p-8 items-center justify-center text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              <LayoutGrid size={32} />
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>War Room Briefing</h2>
            <p className={`text-sm max-w-md mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select a target from the left to view detailed insights, recommended actions, and performance drivers.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
              {[
                { label: 'Targets at Risk', value: '3', color: 'text-rose-500' },
                { label: 'Understaffed', value: '5', color: 'text-amber-500' },
                { label: 'Data Blocked', value: '2', color: 'text-blue-500' }
              ].map((stat, i) => (
                <div key={i} className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                  <div className={`text-2xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Column 3: This Week's Plan */}
      <div className={`
        w-[350px] flex-shrink-0 border-l flex flex-col overflow-hidden
        ${isDarkMode ? 'border-white/10 bg-slate-900/30' : 'border-gray-200 bg-gray-50/50'}
      `}>
        <div className={`flex-none p-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-200/50'}`}>
          <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>This Week's Plan</h3>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Priorities for {new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {aiWeeklyPlan.map((category, idx) => {
            const isExpanded = category.category === 'Win-Now Actions'; // Default expand first one
            
            return (
              <div key={idx} className={`rounded-lg border overflow-hidden ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-gray-200'}`}>
                 <div className={`px-3 py-2 flex items-center justify-between cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                       {category.category === 'Win-Now Actions' && <TrendingUp size={14} className="text-rose-500" />}
                       {category.category === 'Hiring & Recruitment' && <UserPlus size={14} className="text-emerald-500" />}
                       {category.category === 'Field Schedule Priorities' && <Calendar size={14} className="text-blue-500" />}
                       <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{category.category}</span>
                    </div>
                    {/* Simplified accordion: always expanded for demo or collapsible logic needed. Using default open for now. */}
                 </div>
                 
                 <div className="px-3 pb-3 space-y-3">
                   {category.items.map((item: any) => (
                     <div key={item.id} className="space-y-2 pt-2 border-t border-dashed first:border-0 border-gray-200/20">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-snug ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{item.text}</p>
                          <span className={`flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase
                            ${item.priority === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                              item.priority === 'high' ? 'bg-amber-500/10 text-amber-500' :
                              'bg-blue-500/10 text-blue-500'}
                          `}>
                            {item.priority}
                          </span>
                        </div>
                        {item.estimatedImpact && (
                           <p className={`text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                             {item.estimatedImpact}
                           </p>
                        )}
                        <Button variant="ghost" size="sm" className={`w-full justify-start h-7 text-xs ${isDarkMode ? 'text-blue-400 hover:bg-blue-500/10' : 'text-blue-600 hover:bg-blue-50'}`}>
                           <Plus size={12} className="mr-1.5" />
                           Add to Tasks
                        </Button>
                     </div>
                   ))}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};