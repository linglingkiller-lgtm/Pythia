import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Clock, AlertCircle, Pause, CheckCircle, Calendar, FileText, Users, Sparkles, Plus, RefreshCw, Layers } from 'lucide-react';
import { mockTaskBundles, type Task } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { CreateTaskModal } from './CreateTaskModal';
import { ensureOrgBootstrap, ApiContext } from '../../lib/api';

interface MyWorkTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function MyWorkTab({ onNavigateToClient, onNavigateToBill }: MyWorkTabProps) {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [scope, setScope] = useState<'my' | 'team'>('my');
  const { tasks: myTasks, loading: loadingTasks, error: taskError, refetch: refetchTasks } = useTasks({ scope });
  const { projects, loading: loadingProjects, refetch: refetchProjects } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  
  // -- Derived State (replacing mock helper functions) --

  const tasksDueToday = myTasks.filter(t => {
    if (!t.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.dueDate === today && t.status !== 'done';
  });

  const tasksBlocked = myTasks.filter(t => t.status === 'blocked');
  
  // Upcoming tasks (next 7 days, not today)
  const todayDate = new Date();
  const nextWeek = new Date(todayDate);
  nextWeek.setDate(todayDate.getDate() + 7);
  
  const upcomingTasks = myTasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false;
    const dueDate = new Date(t.dueDate);
    // Reset time components for comparison
    const todayStart = new Date(todayDate.setHours(0,0,0,0));
    return dueDate > todayStart && dueDate <= nextWeek;
  }).sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Work Queue - Priority Sort
  const calmQueue = myTasks
    .filter(t => t.status !== 'done' && t.status !== 'blocked')
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const pA = priorityOrder[a.priority] ?? 2;
      const pB = priorityOrder[b.priority] ?? 2;
      
      if (pA !== pB) return pA - pB;
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    })
    .slice(0, 5);

  // Task bundles (Demo only feature for now, or match by ID if we implemented bundles)
  // For prod, we'll just hide bundles if no matching IDs found, or show empty
  const myBundles = appMode === 'demo' ? mockTaskBundles.filter(bundle => 
    bundle.taskIds.some(taskId => 
      myTasks.find(t => t.id === taskId)
    )
  ) : []; 

  const handleBootstrap = async () => {
    if (!activeOrgId) return;
    setBootstrapping(true);
    try {
        const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
        await ensureOrgBootstrap(ctx);
        // Refresh everything
        refetchProjects();
        refetchTasks();
    } catch (e) {
        console.error("Bootstrap failed", e);
    } finally {
        setBootstrapping(false);
    }
  };

  if (loadingTasks || loadingProjects) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading workspace...</p>
      </div>
    );
  }

  // Check for empty projects in PROD mode only
  if (appMode === 'prod' && projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                <Layers size={48} className="text-blue-500" />
            </div>
            <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Welcome to Tasks
            </h2>
            <p className={`max-w-md mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                To get started with tasks, you need at least one project. Create a default "Inbox" project to track your work.
            </p>
            <Button 
                onClick={handleBootstrap} 
                disabled={bootstrapping}
                variant="primary"
                size="lg"
            >
                {bootstrapping ? 'Creating...' : 'Create default Inbox project'}
            </Button>
        </div>
      );
  }

  if (taskError) {
     return (
      <div className="p-6">
        <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <h3 className="font-bold">Error loading tasks</h3>
          </div>
          <p className="text-sm mb-4">{taskError}</p>
          <button 
            onClick={refetchTasks}
            className={`px-4 py-2 rounded text-sm font-medium flex items-center gap-2 ${
                isDarkMode ? 'bg-red-500/20 hover:bg-red-500/30' : 'bg-white border border-red-200 hover:bg-red-50'
            }`}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32">
      <div className="mx-auto space-y-6">
        
        {/* Header Actions (Prod Only) */}
        <div className="flex justify-between items-center">
            {/* Scope Toggle */}
            <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setScope('my')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  scope === 'my'
                    ? isDarkMode ? 'bg-slate-700 text-white shadow' : 'bg-white text-gray-900 shadow'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                My Tasks
              </button>
              <button
                onClick={() => setScope('team')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  scope === 'team'
                    ? isDarkMode ? 'bg-slate-700 text-white shadow' : 'bg-white text-gray-900 shadow'
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Team Tasks
              </button>
            </div>

             {appMode === 'prod' && (
             <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-500/20 transition-all font-medium text-sm"
             >
               <Plus size={16} /> New Task
             </button>
             )}
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Tasks */}
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          } shadow-lg`}>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              My Tasks
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {myTasks.filter(t => t.status !== 'done').length}
            </div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {myTasks.filter(t => t.status === 'done').length} completed
            </div>
          </div>

          {/* Due Today */}
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-red-50/80 border-red-200'
          } shadow-lg`}>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              Due Today
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {tasksDueToday.length}
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`}>
              <Clock size={12} />
              Needs attention
            </div>
          </div>

          {/* Upcoming */}
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-blue-50/80 border-blue-200'
          } shadow-lg`}>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              This Week
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {upcomingTasks.length}
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              <Calendar size={12} />
              Next 7 days
            </div>
          </div>

          {/* Blocked */}
          <div className={`p-4 rounded-xl backdrop-blur-xl border transition-all ${
            isDarkMode
              ? 'bg-yellow-500/10 border-yellow-500/30'
              : 'bg-yellow-50/80 border-yellow-200'
          } shadow-lg`}>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              Blocked
            </div>
            <div className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {tasksBlocked.length}
            </div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              <Pause size={12} />
              Waiting
            </div>
          </div>
        </div>

        {/* Main Content Grid - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Work Queue (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Work Queue */}
            <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
              isDarkMode
                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30'
                : 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-blue-200'
            } shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-blue-500/30' : 'bg-blue-600'
                  }`}>
                    <Sparkles size={20} className={isDarkMode ? 'text-blue-300' : 'text-white'} />
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Work Queue
                    </h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your top 5 priorities, Revere-ranked
                    </p>
                  </div>
                </div>
                <Chip variant="info" size="sm">{calmQueue.length} tasks</Chip>
              </div>

              <div className="space-y-3">
                {calmQueue.length > 0 ? (
                  calmQueue.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index + 1} onNavigateToBill={onNavigateToBill} isDarkMode={isDarkMode} />
                  ))
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <CheckCircle size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <p className="font-medium">All caught up!</p>
                    <p className="text-sm mt-1">No priority tasks at the moment</p>
                    {appMode === 'prod' && (
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-4 text-blue-500 hover:text-blue-400 text-sm font-medium"
                        >
                            + Create a task to get started
                        </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Due Today Section - Full Width */}
            {tasksDueToday.length > 0 && (
              <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
                isDarkMode
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-red-50/80 border-red-200'
              } shadow-lg`}>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Due Today
                  </h3>
                  <Chip variant="danger" size="sm">{tasksDueToday.length}</Chip>
                </div>
                <div className="space-y-2">
                  {tasksDueToday.map(task => (
                    <TaskCard key={task.id} task={task} onNavigateToBill={onNavigateToBill} isDarkMode={isDarkMode} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Section - Full Width */}
            {upcomingTasks.length > 0 && (
              <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
                isDarkMode
                  ? 'bg-slate-800/40 border-white/10'
                  : 'bg-white/80 border-gray-200'
              } shadow-lg`}>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Upcoming (Next 7 Days)
                  </h3>
                  <Chip variant="info" size="sm">{upcomingTasks.length}</Chip>
                </div>
                <div className="space-y-2">
                  {upcomingTasks.map(task => (
                    <TaskCard key={task.id} task={task} onNavigateToBill={onNavigateToBill} isDarkMode={isDarkMode} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Task Bundles (Hidden in Prod if empty) */}
            {(appMode === 'demo' || myBundles.length > 0) && (
              <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
                isDarkMode
                  ? 'bg-slate-800/40 border-white/10'
                  : 'bg-white/80 border-gray-200'
              } shadow-lg`}>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Task Bundles {appMode === 'prod' ? '(Coming Soon)' : ''}
                </h3>
                <div className="space-y-3">
                  {myBundles.map(bundle => {
                    const bundleTasks = myTasks.filter(t => t.bundleId === bundle.id);
                    const completedCount = bundleTasks.filter(t => t.status === 'done').length;
                    const progress = bundleTasks.length > 0 ? (completedCount / bundleTasks.length) * 100 : 0;

                    return (
                      <div key={bundle.id} className={`p-4 rounded border ${
                        isDarkMode
                          ? 'bg-slate-900/50 border-white/10'
                          : 'bg-gray-50/80 border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {bundle.name}
                            </h4>
                            {bundle.description && (
                              <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {bundle.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {bundle.dueDate && (
                          <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Due {new Date(bundle.dueDate).toLocaleDateString()}
                          </div>
                        )}

                        <div className="mb-3">
                          <div className={`flex items-center justify-between text-xs mb-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <span>{completedCount}/{bundleTasks.length}</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className={`w-full rounded-full h-2 ${
                            isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                          }`}>
                            <div
                              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {bundleTasks.slice(0, 3).map(task => (
                            <div key={task.id} className="flex items-center gap-2 text-xs">
                              {task.status === 'done' ? (
                                <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                              ) : (
                                <div className={`w-3 h-3 rounded border-2 flex-shrink-0 ${
                                  isDarkMode ? 'border-gray-500' : 'border-gray-400'
                                }`} />
                              )}
                              <span className={task.status === 'done' 
                                ? `line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}` 
                                : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }>
                                {task.title}
                              </span>
                            </div>
                          ))}
                          {bundleTasks.length > 3 && (
                            <div className={`text-xs ml-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              +{bundleTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Blocked / Waiting */}
            {tasksBlocked.length > 0 && (
              <div className={`p-6 rounded-xl backdrop-blur-xl border transition-all ${
                isDarkMode
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-yellow-50/80 border-yellow-200'
              } shadow-lg`}>
                <div className="flex items-center gap-2 mb-4">
                  <Pause size={20} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
                  <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Blocked
                  </h3>
                  <Chip variant="warning" size="sm">{tasksBlocked.length}</Chip>
                </div>
                <div className="space-y-3">
                  {tasksBlocked.map(task => (
                    <div key={task.id} className={`p-3 rounded border ${
                      isDarkMode
                        ? 'bg-slate-900/50 border-yellow-500/30'
                        : 'bg-white/80 border-yellow-200'
                    }`}>
                      <div className="mb-2">
                        <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </div>
                        {task.description && (
                          <p className={`text-xs mt-1 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.blockedReason && (
                        <div className={`p-2 rounded text-xs ${
                          isDarkMode
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-yellow-50 text-yellow-800'
                        }`}>
                          <span className="font-medium">Blocked:</span> {task.blockedReason}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
            refetchTasks();
            refetchProjects(); // In case a project was created via other means, though unlikely here
        }}
      />

    </div>
  );
}

interface TaskCardProps {
  task: Task;
  index?: number;
  onNavigateToBill?: (billId: string) => void;
  isDarkMode?: boolean;
}

function TaskCard({ task, index, onNavigateToBill, isDarkMode }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle size={16} className="text-green-500" />;
      case 'in-progress': return <Clock size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />;
      case 'blocked': return <Pause size={16} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />;
      default: return <div className={`w-4 h-4 rounded border-2 ${isDarkMode ? 'border-gray-500' : 'border-gray-400'}`} />;
    }
  };

  return (
    <div className={`p-3 rounded border transition-all ${
      isDarkMode
        ? 'bg-slate-900/60 border-white/10 hover:border-blue-400/50 hover:bg-slate-900/80'
        : 'bg-white/90 border-gray-200 hover:border-blue-500 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-3">
        {index && (
          <div className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center flex-shrink-0 ${
            isDarkMode
              ? 'bg-blue-500/30 text-blue-300'
              : 'bg-blue-600 text-white'
          }`}>
            {index}
          </div>
        )}
        {!index && getStatusIcon(task.status)}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {task.title}
            </h4>
            <Chip variant="neutral" size="sm" className={getPriorityColor(task.priority)}>
              {task.priority}
            </Chip>
          </div>

          {task.description && (
            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          <div className={`flex items-center gap-3 flex-wrap text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
            {task.clientName && (
              <div className="flex items-center gap-1">
                <Users size={12} />
                {task.clientName}
              </div>
            )}
            {task.linkedBillNumbers.length > 0 && (
              <div className="flex items-center gap-1">
                <FileText size={12} />
                {task.linkedBillNumbers.map(billNum => (
                  <button
                    key={billNum}
                    className={`hover:underline ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                    onClick={() => onNavigateToBill?.(billNum)}
                  >
                    {billNum}
                  </button>
                ))}
              </div>
            )}
          </div>

          {task.projectTitle && (
            <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Project: {task.projectTitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
