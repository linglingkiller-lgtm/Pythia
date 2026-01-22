import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, CheckCircle2, Circle, AlertCircle, Clock, 
  Users, FileText, ChevronRight, Zap, TrendingUp, Link as LinkIcon,
  MessageSquare, LayoutList, Activity, ArrowRight, ChevronLeft,
  Building2, Gavel, Search, Plus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Project, Task, mockTasks } from '../../data/workHubData';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface ProjectCommandDrawerProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBill?: (billId: string) => void;
  onTriggerNotification?: (notification: any) => void;
}

type DrawerView = 'project-overview' | 'task-detail';
type TabType = 'plan' | 'context' | 'pulse';

// ----------------------------------------------------------------------
// Main Drawer Component
// ----------------------------------------------------------------------

export function ProjectCommandDrawer({ project, isOpen, onClose, onNavigateToBill, onTriggerNotification }: ProjectCommandDrawerProps) {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState<DrawerView>('project-overview');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Project View State
  const [activeTab, setActiveTab] = useState<TabType>('plan');

  // Reset state when drawer closes or project changes
  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setView('project-overview');
        setSelectedTask(null);
        setActiveTab('plan');
      }, 300);
    }
  }, [isOpen]);

  if (!project) return null;

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setView('task-detail');
  };

  const handleBackToProject = () => {
    setView('project-overview');
    setSelectedTask(null);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed inset-y-0 right-0 z-[100] w-full max-w-3xl shadow-2xl border-l flex flex-col overflow-hidden
              ${isDarkMode ? 'bg-[#09090b] border-white/10' : 'bg-white border-gray-200'}
            `}
          >
            <AnimatePresence mode="wait" initial={false}>
                {view === 'project-overview' ? (
                    <ProjectOverview 
                        key="project-overview"
                        project={project}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        onClose={onClose}
                        onTaskClick={handleTaskClick}
                        isDarkMode={isDarkMode}
                        onTriggerNotification={onTriggerNotification}
                    />
                ) : (
                    <TaskDetailView 
                        key="task-detail"
                        task={selectedTask!}
                        project={project}
                        onBack={handleBackToProject}
                        onClose={onClose}
                        isDarkMode={isDarkMode}
                        onTriggerNotification={onTriggerNotification}
                    />
                )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ----------------------------------------------------------------------
// Sub-Views
// ----------------------------------------------------------------------

function ProjectOverview({ 
    project, activeTab, setActiveTab, onClose, onTaskClick, isDarkMode, onTriggerNotification 
}: any) {
    return (
        <motion.div 
            className="flex flex-col h-full"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {/* 1. Header Section */}
            <div className={`flex-none p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        {project.clientName}
                      </span>
                      <div className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {project.stage.toUpperCase()}
                      </span>
                   </div>
                   <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                     {project.title}
                   </h2>
                   <p className={`text-sm max-w-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                     {project.description}
                   </p>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Header Metrics */}
              <div className="flex items-center gap-6 mt-6">
                 {/* Pythia Score */}
                 <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={isDarkMode ? '#333' : '#eee'}
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={project.confidenceScore && project.confidenceScore > 80 ? '#10b981' : '#f59e0b'}
                            strokeWidth="3"
                            strokeDasharray={`${project.confidenceScore}, 100`}
                          />
                       </svg>
                       <Zap size={16} className={`absolute ${project.confidenceScore && project.confidenceScore > 80 ? 'text-emerald-500' : 'text-amber-500'}`} fill="currentColor" />
                    </div>
                    <div>
                       <div className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pythia Score</div>
                       <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                         {project.confidenceScore}% <span className="text-sm font-normal text-gray-500">Confidence</span>
                       </div>
                    </div>
                 </div>

                 <div className={`w-px h-10 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                 {/* Budget */}
                 <div>
                    <div className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Budget Used</div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      ${(project.budgetUsed || 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">/ ${(project.budgetTotal || 0).toLocaleString()}</span>
                    </div>
                 </div>

                 <div className={`w-px h-10 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                 {/* Days Left */}
                 <div>
                    <div className={`text-xs font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Time Remaining</div>
                    <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      12 <span className="text-sm font-normal text-gray-500">Days</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* 2. Navigation Tabs */}
            <div className={`flex items-center px-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
               <DrawerTab 
                 label="The Plan" 
                 icon={LayoutList} 
                 isActive={activeTab === 'plan'} 
                 onClick={() => setActiveTab('plan')} 
                 isDarkMode={isDarkMode} 
               />
               <DrawerTab 
                 label="Context" 
                 icon={LinkIcon} 
                 isActive={activeTab === 'context'} 
                 onClick={() => setActiveTab('context')} 
                 isDarkMode={isDarkMode} 
               />
               <DrawerTab 
                 label="Pulse" 
                 icon={Activity} 
                 isActive={activeTab === 'pulse'} 
                 onClick={() => setActiveTab('pulse')} 
                 isDarkMode={isDarkMode} 
               />
            </div>

            {/* 3. Content Area */}
            <div className="flex-1 overflow-y-auto p-6 relative">
              {activeTab === 'plan' && <PlanTab project={project} isDarkMode={isDarkMode} onTriggerNotification={onTriggerNotification} onTaskClick={onTaskClick} />}
              {activeTab === 'context' && <ContextTab project={project} isDarkMode={isDarkMode} onTriggerNotification={onTriggerNotification} />}
              {activeTab === 'pulse' && <PulseTab project={project} isDarkMode={isDarkMode} />}
            </div>

            {/* 4. Footer Actions */}
            <div className={`flex-none p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'bg-[#09090b] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
               <Button 
                  variant="secondary"
                  onClick={() => {
                    onTriggerNotification?.({
                      text: `Project '${project.title}' marked as complete`,
                      icon: CheckCircle2,
                      color: 'text-green-500'
                    });
                    onClose();
                  }}
               >
                  Mark as Complete
               </Button>
               <Button variant="primary">Edit Project</Button>
            </div>
        </motion.div>
    );
}

function TaskDetailView({ task, project, onBack, onClose, isDarkMode, onTriggerNotification }: any) {
    // Local state for the "Context Rail"
    const [contextQuery, setContextQuery] = useState('');
    
    return (
        <motion.div 
            className="flex flex-col h-full"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            {/* Header */}
            <div className={`flex-none p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex items-center gap-4 mb-4">
                    <button 
                        onClick={onBack}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {project.title}
                    </div>
                    <div className="flex-1" />
                    <button 
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                task.status === 'done' ? 'bg-emerald-500/20 text-emerald-500' :
                                task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-500' :
                                task.status === 'blocked' ? 'bg-red-500/20 text-red-500' :
                                'bg-gray-500/20 text-gray-500'
                            }`}>
                                {task.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                task.priority === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                'bg-gray-500/20 text-gray-500'
                            }`}>
                                {task.priority} Priority
                            </span>
                        </div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {task.title}
                        </h2>
                    </div>
                    
                    {/* Assignee Avatar */}
                    <div className="text-center">
                        <div className={`w-12 h-12 rounded-full mb-1 flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg`}>
                            {task.assigneeName?.[0] || 'U'}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {task.assigneeName}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Split View */}
            <div className="flex-1 flex overflow-hidden">
                
                {/* Left: Task Details */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Description */}
                    <section>
                        <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Description
                        </h3>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {task.description || "No description provided."}
                        </p>
                    </section>

                    {/* Subtasks */}
                    <section>
                         <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Subtasks
                        </h3>
                        <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            {(task.subtasks || []).length > 0 ? (
                                task.subtasks.map((st: any, i: number) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 border-b last:border-0 ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                                        <div className={`w-4 h-4 rounded-full border-2 ${st.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-400'}`} />
                                        <span className={`text-sm ${st.isCompleted ? 'line-through opacity-50' : ''} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                            {st.title}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className={`p-8 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    No subtasks defined
                                </div>
                            )}
                            <button className={`w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                                isDarkMode ? 'bg-white/5 hover:bg-white/10 text-gray-400' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                            }`}>
                                <Plus size={14} /> Add Subtask
                            </button>
                        </div>
                    </section>

                    {/* Activity / Comments */}
                    <section>
                         <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            Activity
                        </h3>
                        <div className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-500 text-white text-xs`}>
                                YOU
                            </div>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    placeholder="Write a comment..." 
                                    className={`w-full px-4 py-2 rounded-lg text-sm border outline-none ${
                                        isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-300'
                                    }`}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Context Rail */}
                <div className={`w-80 border-l flex flex-col ${isDarkMode ? 'border-white/10 bg-[#0c0c0e]' : 'border-gray-100 bg-gray-50'}`}>
                    <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <LinkIcon size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                            <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Context Rail
                            </h3>
                        </div>
                        <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            Link Bills, People, and Docs to this task
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* 1. Active Links */}
                        {task.linkedBillNumbers && task.linkedBillNumbers.length > 0 && (
                             <div className="space-y-2">
                                <h4 className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Linked Assets</h4>
                                {task.linkedBillNumbers.map((bill: string) => (
                                    <div key={bill} className={`flex items-center gap-2 p-2 rounded-lg border ${
                                        isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-white border-gray-200 text-blue-700 shadow-sm'
                                    }`}>
                                        <Gavel size={14} />
                                        <span className="text-xs font-medium">{bill}</span>
                                        <button className="ml-auto opacity-50 hover:opacity-100"><X size={12} /></button>
                                    </div>
                                ))}
                             </div>
                        )}

                        {/* 2. Search / Add */}
                        <div className="space-y-3">
                             <h4 className={`text-[10px] font-bold uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Add Context</h4>
                             
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search bills, people..."
                                    value={contextQuery}
                                    onChange={(e) => setContextQuery(e.target.value)}
                                    className={`w-full pl-8 pr-3 py-2 text-xs rounded-lg border outline-none ${
                                        isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-200'
                                    }`}
                                />
                             </div>

                             {/* Suggestions */}
                             <div className="space-y-1">
                                <div className={`p-2 rounded-lg border border-dashed cursor-pointer transition-colors group ${
                                    isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-white'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <Building2 size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Solar Tax Credit Ext.</div>
                                            <div className="text-[10px] text-gray-500">HB 450 • Committee</div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-6 w-6 p-0"
                                            onClick={() => onTriggerNotification?.({
                                                text: "Linked 'HB 450' to task",
                                                icon: LinkIcon,
                                                color: 'text-purple-500'
                                            })}
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>

                                <div className={`p-2 rounded-lg border border-dashed cursor-pointer transition-colors group ${
                                    isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-white'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        <Users size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                                        <div className="flex-1 min-w-0">
                                            <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sen. Michael Ray</div>
                                            <div className="text-[10px] text-gray-500">Key Stakeholder</div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="h-6 w-6 p-0"
                                            onClick={() => onTriggerNotification?.({
                                                text: "Linked 'Sen. Michael Ray' to task",
                                                icon: LinkIcon,
                                                color: 'text-purple-500'
                                            })}
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>

            </div>

             {/* Footer */}
             <div className={`flex-none p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'bg-[#09090b] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
               <Button 
                  variant="secondary"
                  onClick={() => {
                    onTriggerNotification?.({
                      text: `Task '${task.title}' marked as complete`,
                      icon: CheckCircle2,
                      color: 'text-green-500'
                    });
                    onBack();
                  }}
               >
                  Mark Complete
               </Button>
               <Button variant="primary">Save Changes</Button>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Helper Components
// ----------------------------------------------------------------------

function DrawerTab({ label, icon: Icon, isActive, onClick, isDarkMode }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors
        ${isActive 
           ? (isDarkMode ? 'border-blue-500 text-blue-400' : 'border-blue-600 text-blue-700')
           : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

// --- PLAN TAB ---
function PlanTab({ project, isDarkMode, onTriggerNotification, onTaskClick }: { project: Project, isDarkMode: boolean, onTriggerNotification?: any, onTaskClick: (task: Task) => void }) {
  // Mock filter tasks by project (In real app, we'd filter effectively)
  // Just grabbing the first 4 tasks as demos
  const projectTasks = mockTasks.slice(0, 5).map(t => ({...t, projectId: project.id}));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Execution Roadmap
         </h3>
         <Button variant="ghost" size="sm" className="gap-2">
            <Clock size={14} /> View Timeline
         </Button>
      </div>

      <div className="space-y-2">
         {projectTasks.map((task, i) => (
            <div 
              key={i}
              onClick={() => onTaskClick(task)}
              className={`group flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                 isDarkMode 
                   ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30' 
                   : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300'
              }`}
            >
               <button className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === 'done' 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : (isDarkMode ? 'border-gray-600 hover:border-gray-400' : 'border-gray-300 hover:border-gray-400')
               }`}>
                  {task.status === 'done' && <CheckCircle2 size={12} className="text-white" />}
               </button>

               <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${task.status === 'done' ? 'line-through opacity-50' : ''} ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                     {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                     <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{task.assigneeName}</span>
                     <span className={`text-xs px-1.5 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                     }`}>
                        {task.priority}
                     </span>
                  </div>
               </div>

               <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {task.dueDate}
               </div>
               
               <ChevronRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
         ))}

         <button 
            onClick={() => {
               onTriggerNotification?.({
                  text: "New task added to plan",
                  icon: LayoutList,
                  color: 'text-blue-500'
               });
            }}
            className={`w-full py-2 flex items-center justify-center gap-2 border border-dashed rounded-lg transition-colors ${
            isDarkMode ? 'border-white/10 hover:bg-white/5 text-gray-500' : 'border-gray-300 hover:bg-gray-50 text-gray-600'
         }`}>
            <LayoutList size={16} />
            <span className="text-sm font-medium">Add new task</span>
         </button>
      </div>
    </div>
  );
}

// --- CONTEXT TAB ---
function ContextTab({ project, isDarkMode, onTriggerNotification }: { project: Project, isDarkMode: boolean, onTriggerNotification?: any }) {
  return (
    <div className="space-y-8">
       {/* 1. Linked Legislation */}
       <section>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
             Active Legislation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
             {project.linkedBillNumbers.map((bill, i) => (
                <div key={i} className={`p-4 rounded-xl border flex items-center justify-between group cursor-pointer ${
                   isDarkMode ? 'bg-white/5 border-white/5 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-500'
                }`}>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                         {bill.split(' ')[0]}
                      </div>
                      <div>
                         <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bill}</div>
                         <div className="text-xs text-gray-500">In Committee</div>
                      </div>
                   </div>
                   <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
             ))}
             <button 
                onClick={() => {
                   onTriggerNotification?.({
                      text: "Bill linking mode activated",
                      icon: LinkIcon,
                      color: 'text-purple-500'
                   });
                }}
                className={`p-4 rounded-xl border border-dashed flex items-center justify-center gap-2 ${
                isDarkMode ? 'border-white/10 hover:bg-white/5 text-gray-500' : 'border-gray-300 hover:bg-gray-50 text-gray-600'
             }`}>
                <LinkIcon size={16} />
                <span className="text-sm font-medium">Link Bill</span>
             </button>
          </div>
       </section>

       {/* 2. Stakeholders */}
       <section>
          <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
             Key Stakeholders
          </h3>
          <div className="flex flex-wrap gap-2">
             {['Sen. Smith', 'Rep. Jones', 'Dir. Johnson', 'Sarah M.'].map((person, i) => (
                <Chip key={i} variant="outline" className="pl-1 pr-3 py-1">
                   <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[8px] text-white font-bold mr-2">
                      {person[0]}
                   </div>
                   {person}
                </Chip>
             ))}
             <button className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center ${
                isDarkMode ? 'border-white/20 hover:bg-white/10 text-gray-400' : 'border-gray-300 hover:bg-gray-100 text-gray-600'
             }`}>
                <Users size={14} />
             </button>
          </div>
       </section>
    </div>
  );
}

// --- PULSE TAB ---
function PulseTab({ project, isDarkMode }: { project: Project, isDarkMode: boolean }) {
  const events = [
    { icon: FileText, color: 'text-blue-500', title: 'New deliverable drafted', user: 'Jordan Davis', time: '2h ago' },
    { icon: MessageSquare, color: 'text-purple-500', title: 'Commented on strategy', user: 'Matt Kenney', time: '4h ago' },
    { icon: CheckCircle2, color: 'text-emerald-500', title: 'Completed "Initial Research"', user: 'Sarah Kim', time: 'Yesterday' },
    { icon: AlertCircle, color: 'text-amber-500', title: 'Flagged as "At Risk"', user: 'Pythia AI', time: '2 days ago' },
  ];

  return (
    <div className="relative pl-4 space-y-8">
       {/* Vertical Line */}
       <div className={`absolute top-0 bottom-0 left-[23px] w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

       {events.map((event, i) => (
          <div key={i} className="relative flex items-start gap-4">
             <div className={`relative z-10 w-10 h-10 rounded-full border-4 flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-[#09090b] border-[#09090b] shadow-xl' 
                  : 'bg-white border-white shadow-sm ring-1 ring-gray-100'
             }`}>
                <event.icon size={16} className={event.color} />
             </div>
             
             <div className={`flex-1 p-3 rounded-lg border ${
                isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'
             }`}>
                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                   {event.title}
                </div>
                <div className="flex items-center gap-2 mt-1">
                   <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{event.user}</span>
                   <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
                   <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{event.time}</span>
                </div>
             </div>
          </div>
       ))}
    </div>
  );
}

