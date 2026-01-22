import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Edit3, Save, X, ChevronUp, ChevronDown, LayoutDashboard,
  FolderKanban, ListChecks, TrendingUp, Calendar, Users, Target,
  FileText, Clock, Minimize2, Maximize2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '../../contexts/ToastContext';
import { ProjectTimeline } from './ProjectTimeline';
import { mockProjects, mockTasks } from '../../data/workHubData';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type TimelineModuleType = 
  | 'projects-list'
  | 'tasks-queue'
  | 'analytics'
  | 'team-activity'
  | 'milestones';

export interface TimelineModule {
  id: string;
  type: TimelineModuleType;
  title: string;
  collapsed: boolean;
  position: number;
}

export const AVAILABLE_MODULES: Array<{ type: TimelineModuleType; title: string; icon: React.ElementType; description: string }> = [
  { 
    type: 'projects-list', 
    title: 'Projects List', 
    icon: FolderKanban,
    description: 'Quick overview of active projects with status'
  },
  { 
    type: 'tasks-queue', 
    title: 'Tasks Queue', 
    icon: ListChecks,
    description: 'Upcoming tasks and deadlines'
  },
  { 
    type: 'analytics', 
    title: 'Analytics', 
    icon: TrendingUp,
    description: 'Project statistics and metrics'
  },
  { 
    type: 'team-activity', 
    title: 'Team Activity', 
    icon: Users,
    description: 'Recent updates from team members'
  },
  { 
    type: 'milestones', 
    title: 'Milestones', 
    icon: Target,
    description: 'Upcoming project milestones'
  },
];

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

interface ModularTimelineViewProps {
  onNavigateToBill?: (billId: string) => void;
  onProjectClick?: (project: any) => void;
  
  // Controlled Props
  modules: TimelineModule[];
  isEditMode: boolean;
  onRemoveModule: (id: string) => void;
  onToggleCollapse: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export function ModularTimelineView({ 
  onNavigateToBill, 
  onProjectClick,
  modules,
  isEditMode,
  onRemoveModule,
  onToggleCollapse,
  onMoveUp,
  onMoveDown
}: ModularTimelineViewProps) {
  const { isDarkMode } = useTheme();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        
        {/* Timeline - Natural on Page (Not in Container) */}
        <div className={`w-full border-b ${
          isDarkMode ? 'border-white/5' : 'border-gray-200'
        }`}>
          <ProjectTimeline onProjectClick={onProjectClick} onNavigateToBill={onNavigateToBill} />
        </div>

        {/* Productivity Modules Below Timeline */}
        <div className="px-8 py-6">
          
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
                    Edit Mode Active
                  </h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-blue-400/80' : 'text-blue-700'}`}>
                    Use up/down arrows to reorder modules, or collapse/remove them as needed.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {modules.map((module, index) => (
              <div key={module.id} className="relative">
                {isEditMode && (
                  <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-10">
                    <button
                      onClick={() => onMoveUp(module.id)}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${
                        index === 0
                          ? 'opacity-30 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => onMoveDown(module.id)}
                      disabled={index === modules.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === modules.length - 1
                          ? 'opacity-30 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                )}
                
                <ModuleCard
                  module={module}
                  isEditMode={isEditMode}
                  onToggleCollapse={() => onToggleCollapse(module.id)}
                  onRemove={() => onRemoveModule(module.id)}
                  isDarkMode={isDarkMode}
                  onNavigateToBill={onNavigateToBill}
                  onProjectClick={onProjectClick}
                />
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-white/5' : 'bg-gray-100'
              }`}>
                <Plus className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No modules added yet
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Add productivity modules to enhance your timeline view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Module Card Component
// ----------------------------------------------------------------------

interface ModuleCardProps {
  module: TimelineModule;
  isEditMode: boolean;
  onToggleCollapse: () => void;
  onRemove: () => void;
  isDarkMode: boolean;
  onNavigateToBill?: (billId: string) => void;
  onProjectClick?: (project: any) => void;
}

function ModuleCard({ 
  module, 
  isEditMode, 
  onToggleCollapse, 
  onRemove, 
  isDarkMode,
  onNavigateToBill,
  onProjectClick 
}: ModuleCardProps) {
  const moduleConfig = AVAILABLE_MODULES.find(m => m.type === module.type);
  const Icon = moduleConfig?.icon || FolderKanban;

  return (
    <div className={`rounded-xl border overflow-hidden backdrop-blur-sm transition-all ${
      isDarkMode 
        ? 'bg-[#0d0d0f]/90 border-white/10 shadow-xl' 
        : 'bg-white/90 border-gray-200 shadow-lg'
    }`}>
      
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50/50'
      }`}>
        <div className="flex items-center gap-2">
          <Icon size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {module.title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            }`}
          >
            {module.collapsed ? (
              <Maximize2 size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            ) : (
              <Minimize2 size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
            )}
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
      {!module.collapsed && (
        <div className="p-4">
          <ModuleContent 
            moduleType={module.type} 
            isDarkMode={isDarkMode} 
            onNavigateToBill={onNavigateToBill}
            onProjectClick={onProjectClick}
          />
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Module Content Renderer
// ----------------------------------------------------------------------

interface ModuleContentProps {
  moduleType: TimelineModuleType;
  isDarkMode: boolean;
  onNavigateToBill?: (billId: string) => void;
  onProjectClick?: (project: any) => void;
}

function ModuleContent({ moduleType, isDarkMode, onNavigateToBill, onProjectClick }: ModuleContentProps) {
  switch (moduleType) {
    case 'projects-list':
      return <ProjectsListModule projects={mockProjects} isDarkMode={isDarkMode} onProjectClick={onProjectClick} />;
    
    case 'tasks-queue':
      return <TasksQueueModule tasks={mockTasks} isDarkMode={isDarkMode} onNavigateToBill={onNavigateToBill} />;
    
    case 'analytics':
      return <AnalyticsModule projects={mockProjects} isDarkMode={isDarkMode} />;
    
    case 'team-activity':
      return <TeamActivityModule isDarkMode={isDarkMode} />;
    
    case 'milestones':
      return <MilestonesModule projects={mockProjects} isDarkMode={isDarkMode} />;
    
    default:
      return null;
  }
}

// ----------------------------------------------------------------------
// Module Content Components
// ----------------------------------------------------------------------

function ProjectsListModule({ projects, isDarkMode, onProjectClick }: any) {
  return (
    <div className="space-y-2">
      {projects.slice(0, 6).map((project: any) => (
        <div
          key={project.id}
          onClick={() => onProjectClick && onProjectClick(project)}
          className={`p-3 rounded-lg border transition-all cursor-pointer ${
            isDarkMode 
              ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' 
              : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold truncate ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {project.title}
              </h4>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {project.clientName}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
              project.status === 'on-track' 
                ? 'bg-green-500/20 text-green-500'
                : project.status === 'at-risk'
                ? 'bg-orange-500/20 text-orange-500'
                : 'bg-red-500/20 text-red-500'
            }`}>
              {project.progress}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TasksQueueModule({ tasks, isDarkMode, onNavigateToBill }: any) {
  const activeTasks = tasks.filter((t: any) => t.status !== 'done').slice(0, 8);

  return (
    <div className="space-y-2">
      {activeTasks.map((task: any) => (
        <div
          key={task.id}
          className={`p-3 rounded-lg transition-colors ${
            isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-4 h-4 rounded-sm border-2 flex-shrink-0 ${
              task.status === 'done'
                ? 'bg-green-500 border-green-500'
                : isDarkMode
                ? 'border-gray-600'
                : 'border-gray-300'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {task.priority && (
                  <span className={`text-xs font-bold uppercase ${
                    task.priority === 'critical' ? 'text-red-500' :
                    task.priority === 'high' ? 'text-orange-500' :
                    task.priority === 'medium' ? 'text-yellow-500' :
                    'text-gray-500'
                  }`}>
                    {task.priority}
                  </span>
                )}
                {task.dueDate && (
                  <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsModule({ projects, isDarkMode }: any) {
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p: any) => !['delivered', 'archived'].includes(p.stage)).length;
  const onTrack = projects.filter((p: any) => p.status === 'on-track').length;
  const atRisk = projects.filter((p: any) => p.status === 'at-risk' || p.status === 'overdue').length;

  const stats = [
    { label: 'Total Projects', value: totalProjects, color: 'blue' },
    { label: 'Active', value: activeProjects, color: 'purple' },
    { label: 'On Track', value: onTrack, color: 'green' },
    { label: 'At Risk', value: atRisk, color: 'red' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`p-4 rounded-lg border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className={`text-3xl font-bold mb-1 ${
            stat.color === 'blue' ? 'text-blue-500' :
            stat.color === 'purple' ? 'text-purple-500' :
            stat.color === 'green' ? 'text-green-500' :
            'text-red-500'
          }`}>
            {stat.value}
          </div>
          <div className={`text-xs font-medium uppercase tracking-wider ${
            isDarkMode ? 'text-gray-500' : 'text-gray-500'
          }`}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamActivityModule({ isDarkMode }: any) {
  const activities = [
    { user: 'Sarah Chen', action: 'updated', item: 'Healthcare Bill Analysis', time: '5m ago' },
    { user: 'Mike Johnson', action: 'completed', item: 'Q4 Lobbying Report', time: '1h ago' },
    { user: 'Emma Davis', action: 'commented on', item: 'Budget Proposal', time: '2h ago' },
    { user: 'Alex Kim', action: 'created', item: 'New Campaign Strategy', time: '3h ago' },
  ];

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
          }`}>
            {activity.user[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className="font-semibold">{activity.user}</span> {activity.action}{' '}
              <span className="font-medium">{activity.item}</span>
            </p>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              {activity.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MilestonesModule({ projects, isDarkMode }: any) {
  const milestones = [
    { project: 'Healthcare Reform', milestone: 'Committee Review', date: '2026-01-15' },
    { project: 'Budget Analysis', milestone: 'Final Report Due', date: '2026-01-20' },
    { project: 'Education Policy', milestone: 'Stakeholder Meeting', date: '2026-01-25' },
  ];

  return (
    <div className="space-y-3">
      {milestones.map((milestone, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {milestone.milestone}
              </h4>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                {milestone.project}
              </p>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-700'
            }`}>
              {new Date(milestone.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------
// Add Module Modal
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
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {module.title}
                    </h3>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                      {module.description}
                    </p>
                    {isActive && (
                      <span className={`text-xs mt-2 inline-block ${
                        isDarkMode ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        Already added
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
