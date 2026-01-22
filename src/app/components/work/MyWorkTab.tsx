import React, { useState } from 'react';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Clock, AlertCircle, Pause, CheckCircle, Calendar as CalendarIcon, FileText, Users, Sparkles, Plus, RefreshCw, Layers, ArrowRight, Target, Flame, List as ListIcon } from 'lucide-react';
import { mockTaskBundles, type Task } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { CreateTaskModal } from './CreateTaskModal';
import { WeeklyAgenda } from './WeeklyAgenda';
import { ensureOrgBootstrap, ApiContext } from '../../lib/api';
import { motion } from 'motion/react';

interface MyWorkTabProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToChat?: (messageId: string) => void;
}

export function MyWorkTab({ onNavigateToClient, onNavigateToBill, onNavigateToChat }: MyWorkTabProps) {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [scope, setScope] = useState<'my' | 'team'>('my');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { tasks: myTasks, loading: loadingTasks, error: taskError, refetch: refetchTasks } = useTasks({ scope });
  const { projects, loading: loadingProjects, refetch: refetchProjects } = useProjects();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(false);
  
  // -- Derived State --

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
        refetchProjects();
        refetchTasks();
    } catch (e) {
        console.error("Bootstrap failed", e);
    } finally {
        setBootstrapping(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loadingTasks || loadingProjects) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4" />
        <p className={`text-sm font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loading Data...</p>
      </div>
    );
  }

  // Check for empty projects in PROD mode only
  if (appMode === 'prod' && projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
            <div className={`p-6 rounded-full mb-6 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
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
        <div className={`p-6 border border-l-4 border-l-red-500 ${isDarkMode ? 'bg-red-950/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={20} />
            <h3 className="font-bold uppercase tracking-wider">System Error</h3>
          </div>
          <p className="text-sm font-mono mb-4 opacity-80">{taskError}</p>
          <button 
            onClick={refetchTasks}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors ${
                isDarkMode ? 'bg-red-500/20 hover:bg-red-500/40 text-red-200' : 'bg-white border border-red-200 hover:bg-red-50 text-red-700'
            }`}
          >
            <RefreshCw size={14} /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="pb-32 space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Actions & HUD */}
      <motion.div variants={item} className="flex flex-col gap-6">
        
        <div className="flex justify-between items-center border-b pb-4 border-gray-200 dark:border-white/10">
           {/* Scope Toggle - Technical style */}
            <div className="flex gap-1">
              {['my', 'team'].map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s as 'my' | 'team')}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    scope === s
                      ? isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                      : isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {s === 'my' ? 'My Tasks' : 'Team Tasks'}
                </button>
              ))}
            </div>

            {/* View Toggle + Actions */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className={`flex items-center gap-1 p-1 rounded-lg border ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100/80 border-gray-200/50'
              }`}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'list'
                      ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : (isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <ListIcon size={16} />
                  List
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === 'calendar'
                      ? (isDarkMode ? 'bg-white/10 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                      : (isDarkMode ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100')
                  }`}
                >
                  <CalendarIcon size={16} />
                  Calendar
                </button>
              </div>

              {appMode === 'prod' && (
               <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-2 transition-all font-bold text-xs uppercase tracking-wider border ${
                    isDarkMode 
                    ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500' 
                    : 'bg-black text-white border-black hover:bg-gray-800'
                }`}
               >
                 <Plus size={16} /> New Task
               </button>
              )}
            </div>
        </div>

        {/* HUD Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 md:divide-x divide-gray-200 dark:divide-white/10">
          <StatBox 
            label="Total Active" 
            value={myTasks.filter(t => t.status !== 'done').length} 
            subValue={`${myTasks.filter(t => t.status === 'done').length} Archived`}
            icon={Target}
            isDarkMode={isDarkMode}
          />
          <StatBox 
            label="Due Today" 
            value={tasksDueToday.length} 
            subValue="Requires Action"
            icon={Flame}
            color="red"
            isDarkMode={isDarkMode}
          />
          <StatBox 
            label="This Week" 
            value={upcomingTasks.length} 
            subValue="Upcoming"
            icon={CalendarIcon}
            color="blue"
            isDarkMode={isDarkMode}
          />
           <StatBox 
            label="Blocked" 
            value={tasksBlocked.length} 
            subValue="Waiting"
            icon={Pause}
            color="yellow"
            isDarkMode={isDarkMode}
          />
        </div>
      </motion.div>

      {/* Conditional View Rendering */}
      {viewMode === 'calendar' ? (
        // Calendar View - Weekly Agenda
        <motion.div
          key="calendar"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`h-[calc(100vh-360px)] rounded-xl border overflow-hidden shadow-2xl ${
            isDarkMode ? 'border-white/10 shadow-black/50' : 'border-gray-200 shadow-gray-200/50'
          }`}
        >
          <WeeklyAgenda onNavigateToChat={onNavigateToChat} />
        </motion.div>
      ) : (
        // List View - Original task lists
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Queue - Left Column */}
        <motion.div variants={item} className="lg:col-span-2 space-y-8">
          
          {/* Priority Queue */}
          <div className={`border ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-gray-50'}`}>
             <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3">
                   <Sparkles size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                   <h2 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Priority Queue
                   </h2>
                </div>
                <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                   TOP {calmQueue.length}
                </span>
             </div>
             
             <div className="divide-y divide-gray-200 dark:divide-white/5">
                {calmQueue.length > 0 ? (
                  calmQueue.map((task, index) => (
                    <TaskRow 
                      key={task.id} 
                      task={task} 
                      index={index + 1} 
                      onNavigateToBill={onNavigateToBill} 
                      isDarkMode={isDarkMode}
                      isPriority
                    />
                  ))
                ) : (
                  <EmptyState isDarkMode={isDarkMode} onCreate={() => setIsCreateModalOpen(true)} appMode={appMode} />
                )}
             </div>
          </div>

          {/* Due Today */}
          {tasksDueToday.length > 0 && (
             <div className={`border ${isDarkMode ? 'border-red-900/30 bg-red-900/[0.05]' : 'border-red-200 bg-red-50/30'}`}>
                <div className="p-4 border-b border-red-200 dark:border-red-900/30 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Clock size={16} className="text-red-500" />
                      <h2 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-red-200' : 'text-red-900'}`}>
                         Due Today
                      </h2>
                   </div>
                </div>
                <div className="divide-y divide-red-200/50 dark:divide-red-900/20">
                   {tasksDueToday.map(task => (
                     <TaskRow key={task.id} task={task} onNavigateToBill={onNavigateToBill} isDarkMode={isDarkMode} />
                   ))}
                </div>
             </div>
          )}

           {/* Upcoming */}
           {upcomingTasks.length > 0 && (
             <div className={`border ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
                   <div className="flex items-center gap-3">
                      <CalendarIcon size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                      <h2 className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                         Upcoming (7 Days)
                      </h2>
                   </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-white/5">
                   {upcomingTasks.map(task => (
                     <TaskRow key={task.id} task={task} onNavigateToBill={onNavigateToBill} isDarkMode={isDarkMode} />
                   ))}
                </div>
             </div>
          )}

        </motion.div>

        {/* Sidebar - Right Column */}
        <motion.div variants={item} className="lg:col-span-1 space-y-6">
           
           {/* Bundles */}
           {(appMode === 'demo' || myBundles.length > 0) && (
              <div className={`border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                 <div className={`p-3 border-b ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-100'} flex justify-between items-center`}>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Task Bundles
                    </h3>
                    {appMode === 'prod' && <span className="text-[10px] uppercase bg-blue-600 text-white px-1.5 py-0.5 font-bold">Soon</span>}
                 </div>
                 <div className="p-4 space-y-4">
                    {myBundles.map(bundle => (
                       <BundleCard key={bundle.id} bundle={bundle} myTasks={myTasks} isDarkMode={isDarkMode} />
                    ))}
                 </div>
              </div>
           )}

           {/* Blocked Tasks */}
           {tasksBlocked.length > 0 && (
              <div className={`border ${isDarkMode ? 'border-yellow-500/30' : 'border-yellow-200'}`}>
                 <div className={`p-3 border-b ${isDarkMode ? 'border-yellow-500/30 bg-yellow-900/10' : 'border-yellow-200 bg-yellow-50'} flex items-center gap-2`}>
                    <Pause size={14} className="text-yellow-500" />
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                      Blocked Items
                    </h3>
                 </div>
                 <div className="divide-y divide-yellow-500/20">
                    {tasksBlocked.map(task => (
                       <div key={task.id} className="p-3">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                          {task.blockedReason && (
                             <div className={`mt-2 text-xs p-2 border-l-2 ${
                                isDarkMode 
                                ? 'border-yellow-500 bg-yellow-500/10 text-yellow-200' 
                                : 'border-yellow-600 bg-yellow-50 text-yellow-800'
                             }`}>
                                <span className="font-bold uppercase mr-1">Reason:</span>
                                {task.blockedReason}
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           )}
        </motion.div>

      </div>
      )}

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
            refetchTasks();
            refetchProjects();
        }}
      />
    </motion.div>
  );
}

// -- Sub Components --

function StatBox({ label, value, subValue, icon: Icon, color = 'neutral', isDarkMode }: any) {
  const getColor = () => {
    switch(color) {
      case 'red': return isDarkMode ? 'text-red-400' : 'text-red-600';
      case 'blue': return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'yellow': return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default: return isDarkMode ? 'text-white' : 'text-black';
    }
  };

  return (
    <div className={`p-4 flex flex-col justify-between h-24 ${isDarkMode ? 'bg-white/[0.02]' : 'bg-white'}`}>
      <div className="flex justify-between items-start">
        <span className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {label}
        </span>
        <Icon size={14} className={`${getColor()} opacity-50`} />
      </div>
      <div>
        <div className={`text-3xl font-light leading-none mb-1 ${getColor()}`}>
          {value}
        </div>
        <div className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          {subValue}
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, index, onNavigateToBill, isDarkMode, isPriority }: any) {
   const priorityColors: Record<string, string> = {
      critical: 'text-red-500',
      high: 'text-orange-500',
      medium: 'text-yellow-500',
      low: 'text-gray-500'
   };

   return (
      <div className={`group p-4 flex items-start gap-4 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]`}>
         {/* Status / Index */}
         <div className="pt-1">
            {isPriority && index ? (
               <div className={`w-5 h-5 flex items-center justify-center text-xs font-bold font-mono border ${
                  isDarkMode ? 'border-blue-500 text-blue-400' : 'border-black text-black'
               }`}>
                  {index}
               </div>
            ) : (
               <div className={`w-3 h-3 border ${
                  task.status === 'done' 
                     ? 'bg-green-500 border-green-500' 
                     : isDarkMode ? 'border-gray-600' : 'border-gray-400'
               }`} />
            )}
         </div>

         {/* Content */}
         <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-4">
               <h3 className={`font-medium text-sm leading-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-900'} ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
                  {task.title}
               </h3>
               {task.dueDate && (
                  <span className={`flex-shrink-0 text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} ${
                     new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'text-red-500 font-bold' : ''
                  }`}>
                     {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
               )}
            </div>
            
            <div className="mt-2 flex items-center gap-4 text-xs">
               <span className={`uppercase font-bold tracking-wider text-[10px] ${priorityColors[task.priority] || 'text-gray-500'}`}>
                  {task.priority}
               </span>
               
               {task.projectTitle && (
                  <span className={`truncate max-w-[120px] ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                     {task.projectTitle}
                  </span>
               )}

               {task.linkedBillNumbers?.length > 0 && (
                  <div className="flex gap-2">
                     {task.linkedBillNumbers.map((bill: string) => (
                        <button 
                           key={bill}
                           onClick={(e) => { e.stopPropagation(); onNavigateToBill?.(bill); }}
                           className={`hover:underline font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                        >
                           {bill}
                        </button>
                     ))}
                  </div>
               )}
            </div>
         </div>
         
         <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
            <ArrowRight size={14} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
         </div>
      </div>
   );
}

function BundleCard({ bundle, myTasks, isDarkMode }: any) {
  const bundleTasks = myTasks.filter((t: Task) => t.bundleId === bundle.id);
  const completedCount = bundleTasks.filter((t: Task) => t.status === 'done').length;
  const progress = bundleTasks.length > 0 ? (completedCount / bundleTasks.length) * 100 : 0;

  return (
    <div className={`p-3 border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
       <div className="flex justify-between items-start mb-2">
          <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{bundle.name}</h4>
          <span className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
             {Math.round(progress)}%
          </span>
       </div>
       
       {/* Progress Bar */}
       <div className={`h-1 w-full mb-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
          <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
       </div>

       <div className="space-y-1">
          {bundleTasks.slice(0, 3).map((task: Task) => (
             <div key={task.id} className="flex items-center gap-2 text-xs">
                <div className={`w-1.5 h-1.5 ${task.status === 'done' ? 'bg-green-500' : 'bg-gray-500'}`} />
                <span className={`truncate ${task.status === 'done' ? 'line-through opacity-50' : ''} ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                   {task.title}
                </span>
             </div>
          ))}
       </div>
    </div>
  );
}

function EmptyState({ isDarkMode, onCreate, appMode }: any) {
   return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
         <div className={`p-4 rounded-full mb-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
            <CheckCircle size={32} className={isDarkMode ? 'text-green-500/50' : 'text-green-600/50'} />
         </div>
         <h3 className={`font-bold uppercase tracking-wider text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            All Clear
         </h3>
         <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            You have no priority tasks in the queue.
         </p>
         {appMode === 'prod' && (
            <button 
               onClick={onCreate}
               className={`text-xs font-bold uppercase tracking-wide border-b border-blue-500 pb-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
            >
               Create New Task
            </button>
         )}
      </div>
   );
}