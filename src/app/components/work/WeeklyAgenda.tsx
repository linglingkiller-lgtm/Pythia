import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { format, addDays, startOfWeek, isSameDay, parseISO, isPast, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Calendar, Clock, AlertTriangle, CheckCircle2, MoreHorizontal, 
  Sparkles, ArrowRight, User, GripVertical, Search, Filter, Plus, Flag,
  ChevronDown, Play, Pause, Zap, X, Layers, CheckSquare, Square, MoreVertical,
  Maximize2, Send, Paperclip, MessageSquare, Trash2, ChevronRight, Link, Tag,
  Coffee, FileText, Image as ImageIcon, Users, Share2, Archive, Check
} from 'lucide-react';
import { mockTasks, type Task, type TaskComment, type TaskAttachment } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

interface WeeklyAgendaProps {
  tasks?: Task[];
  onNavigateToChat?: (messageId: string) => void;
}

const ItemTypes = {
  TASK: 'task'
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export function WeeklyAgenda({ onNavigateToChat }: WeeklyAgendaProps) {
  const { isDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 15)); // Mock current date: Dec 15, 2025
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // New State for Features
  const [showMorningBriefing, setShowMorningBriefing] = useState(true);
  const [energyFilter, setEnergyFilter] = useState<'high' | 'low' | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Load tasks from localStorage (Demo Hack)
  useEffect(() => {
    const demoTasks = JSON.parse(localStorage.getItem('demo_new_tasks') || '[]');
    if (demoTasks.length > 0) {
        setTasks(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTasks = demoTasks.filter((t: Task) => !existingIds.has(t.id));
            return [...prev, ...newTasks];
        });
    }
  }, []);

  // User Filtering
  const [selectedUser, setSelectedUser] = useState<string>('all');
  
  const uniqueUsers = useMemo(() => {
      const userMap = new Map<string, string>();
      tasks.forEach(t => {
          const existing = userMap.get(t.assigneeId);
          if (!existing || t.assigneeName.length > existing.length) {
              userMap.set(t.assigneeId, t.assigneeName);
          }
      });
      return Array.from(userMap.entries()).map(([id, name]) => ({ id, name }));
  }, [tasks]);

  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)), [weekStart]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.assigneeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority ? t.priority === filterPriority : true;
      const matchesUser = selectedUser === 'all' ? true : t.assigneeId === selectedUser;
      const matchesEnergy = energyFilter ? t.energyLevel === energyFilter : true;
      
      return matchesSearch && matchesPriority && matchesUser && matchesEnergy;
    });
  }, [tasks, searchQuery, filterPriority, selectedUser, energyFilter]);

  const moveTask = useCallback((draggedId: string, targetId: string | null, targetDate: Date) => {
    
    const draggedTask = tasks.find(t => t.id === draggedId);
    if (!draggedTask) return;
    const targetDateStr = format(targetDate, 'yyyy-MM-dd');
    
    if (targetId) {
      const targetTask = tasks.find(t => t.id === targetId);
      if (!targetTask) return;
      const isSameDay = draggedTask.dueDate === targetDateStr;
      
      if (isSameDay) {
        const tasksForDay = tasks.filter(t => t.dueDate === targetDateStr);
        const draggedIndexInDay = tasksForDay.findIndex(t => t.id === draggedId);
        const targetIndexInDay = tasksForDay.findIndex(t => t.id === targetId);
        
        if (draggedIndexInDay !== -1 && targetIndexInDay !== -1) {
          const [removed] = tasksForDay.splice(draggedIndexInDay, 1);
          tasksForDay.splice(targetIndexInDay, 0, removed);
          const firstTaskOfDayIndex = tasks.findIndex(t => t.dueDate === targetDateStr);
          const newTasks = [...tasks];
          const filtered = newTasks.filter(t => t.dueDate !== targetDateStr);
          filtered.splice(firstTaskOfDayIndex, 0, ...tasksForDay);
          setTasks(filtered);
        }
      } else {
        const newTasks = [...tasks];
        const draggedIndex = newTasks.findIndex(t => t.id === draggedId);
        newTasks[draggedIndex] = { ...newTasks[draggedIndex], dueDate: targetDateStr };
        const [removed] = newTasks.splice(draggedIndex, 1);
        const targetIndex = newTasks.findIndex(t => t.id === targetId);
        newTasks.splice(targetIndex, 0, removed);
        setTasks(newTasks);
      }
    } else {
      setTasks(prev => prev.map(t => {
        if (t.id === draggedId) {
          return { ...t, dueDate: targetDateStr };
        }
        return t;
      }));
    }
  }, [tasks]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTaskId(null);
  }, []);

  const handleCompleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'done', progress: 100 } : t
    ));
    setTimeout(() => {
      setSelectedTaskId(null);
    }, 1000);
  }, []);

  const handleCreateTask = useCallback(() => {
    const newTask: Task = {
      id: `new-${Date.now()}`,
      title: 'New Task',
      priority: 'medium',
      status: 'todo',
      progress: 0,
      assigneeId: selectedUser === 'all' ? 'user-001' : selectedUser,
      assigneeName: selectedUser === 'all' ? 'Unassigned' : uniqueUsers.find(u => u.id === selectedUser)?.name || 'Unassigned',
      dueDate: format(currentDate, 'yyyy-MM-dd'),
      projectId: 'proj-001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedBillIds: [], linkedBillNumbers: [], linkedPersonIds: [], linkedPersonNames: [], linkedIssueIds: [], linkedIssueNames: []
    };
    setTasks([...tasks, newTask]);
    // setSelectedTaskId(newTask.id); // Don't auto-select to avoid jarring layout shift
  }, [tasks, selectedUser, uniqueUsers, currentDate]);

  const toggleSelect = useCallback((id: string) => {
     setSelectedTaskIds(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
     });
  }, []);

  // Revere AI Suggestions
  const [suggestions, setSuggestions] = useState<{ id: string, text: string, taskId?: string }[]>([
    { id: 's1', text: 'Consider prioritizing "Create marketing plan" - blocking downstream tasks.', taskId: 't1' },
    { id: 's2', text: 'You have 3 high priority tasks on Wednesday. Reschedule one?', taskId: 't3' },
    { id: 's3', text: 'New Opportunity Detected: Follow up on "Solar Alliance" coalition request.' }
  ]);

  const dismissSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;
  const isSplitView = !!selectedTaskId;

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      
      <AnimatePresence>
        {showMorningBriefing && <MorningBriefing onClose={() => setShowMorningBriefing(false)} isDarkMode={isDarkMode} />}
      </AnimatePresence>

      {/* Header / Controls */}
      <div className={`flex items-center justify-between p-4 border-b flex-shrink-0 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setCurrentDate(addDays(currentDate, -7))}>
              <ChevronDown className="rotate-90" size={14} />
            </Button>
            <span className={`text-sm font-bold min-w-[140px] text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button variant="secondary" size="sm" onClick={() => setCurrentDate(addDays(currentDate, 7))}>
              <ChevronDown className="-rotate-90" size={14} />
            </Button>
          </div>
          
          <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
          
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date(2025, 11, 15))}>
            Today
          </Button>

          {/* User Filter Dropdown */}
          <div className="relative group">
             <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isDarkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                <User size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span>{selectedUser === 'all' ? 'All Users' : uniqueUsers.find(u => u.id === selectedUser)?.name}</span>
                <ChevronDown size={14} className="opacity-50" />
             </button>
             <div className="absolute top-full left-0 mt-1 w-48 py-1 rounded-lg border shadow-xl bg-white dark:bg-[#18181b] dark:border-white/10 z-50 hidden group-hover:block">
                <button onClick={() => setSelectedUser('all')} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${selectedUser === 'all' ? 'font-bold text-blue-500' : ''}`}>All Users</button>
                {uniqueUsers.map(user => (
                  <button key={user.id} onClick={() => setSelectedUser(user.id)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-white/5 ${selectedUser === user.id ? 'font-bold text-blue-500' : ''}`}>{user.name}</button>
                ))}
             </div>
          </div>

          {/* Search & Priority & Energy Filter */}
          <div className="flex items-center gap-2 ml-2">
             <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-lg px-2 py-1">
                <Search size={14} className="opacity-50" />
                <input 
                  type="text" 
                  placeholder="Filter tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm outline-none w-32"
                />
             </div>
             
             {/* Priority Dots */}
             <div className="flex items-center gap-1">
                {['high', 'medium', 'low'].map(p => (
                   <button 
                     key={p}
                     onClick={() => setFilterPriority(filterPriority === p ? null : p)}
                     className={`w-2.5 h-2.5 rounded-full ${
                        p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                     } ${filterPriority === p ? 'ring-2 ring-offset-1 ring-black scale-125' : 'opacity-30 hover:opacity-100'}`}
                     title={`Filter ${p}`}
                   />
                ))}
             </div>

             {/* Energy Filter */}
             <div className={`h-4 w-px mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />
             <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg">
                <button
                    onClick={() => setEnergyFilter(energyFilter === 'low' ? null : 'low')}
                    className={`p-1 rounded ${energyFilter === 'low' ? 'bg-white dark:bg-white/10 shadow text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Quick Wins (Low Energy)"
                >
                    <Zap size={12} />
                </button>
                <button
                    onClick={() => setEnergyFilter(energyFilter === 'high' ? null : 'high')}
                    className={`p-1 rounded ${energyFilter === 'high' ? 'bg-white dark:bg-white/10 shadow text-amber-500' : 'text-gray-400 hover:text-gray-600'}`}
                    title="Deep Work (High Energy)"
                >
                    <Zap size={12} fill="currentColor" />
                </button>
             </div>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {suggestions.length > 0 && (
                <motion.div 
                  key={suggestions[0].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer ${
                    isDarkMode ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-700'
                  }`}
                  onClick={() => {
                     if (suggestions[0].taskId) setSelectedTaskId(suggestions[0].taskId);
                  }}
                >
                  <Sparkles size={12} />
                  <span className="truncate max-w-[200px]">{suggestions[0].text}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); dismissSuggestion(suggestions[0].id); }} 
                    className="ml-2 hover:opacity-70"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Button variant="primary" size="sm" className="gap-2" onClick={handleCreateTask}>
                <Plus size={14} />
                Add Task
            </Button>
        </div>
      </div>

      {/* Split Pane Container */}
      <div className="flex-1 flex overflow-hidden relative">
          
          {/* Main List / Grid Area */}
          <div className={`flex-shrink-0 transition-all duration-500 ease-[0.22,1,0.36,1] flex flex-col ${
            isSplitView 
                ? 'w-1/2 border-r border-gray-200 dark:border-white/5' 
                : 'w-full'
          }`}>
             <div className={`flex-1 overflow-y-auto custom-scrollbar ${isSplitView ? 'flex flex-col' : 'flex'}`}>
                {weekDays.map(day => (
                  <DayColumn 
                    key={day.toISOString()} 
                    date={day} 
                    tasks={filteredTasks.filter(t => t.dueDate === format(day, 'yyyy-MM-dd'))}
                    isToday={isSameDay(day, currentDate)}
                    isDarkMode={isDarkMode}
                    onMoveTask={moveTask}
                    onTaskClick={(id) => {
                        // If holding shift/cmd or selection mode active, toggle select
                        if (selectedTaskIds.size > 0) {
                            toggleSelect(id);
                        } else {
                            // If clicking same task, toggle panel off? No, standard behavior usually keeps it open.
                            // If clicking different task, switch.
                            setSelectedTaskId(prev => prev === id ? null : id);
                        }
                    }}
                    selectedTaskIds={selectedTaskIds}
                    onToggleSelect={toggleSelect}
                    isSplitView={isSplitView}
                  />
                ))}
             </div>
          </div>

          {/* Context Panel Area */}
          <div className="flex-1 min-w-0 relative bg-gray-50 dark:bg-black/20">
             <AnimatePresence mode="popLayout">
                {isSplitView && selectedTask ? (
                    <div className="absolute inset-0 z-10">
                        <ContextPanel 
                            key={selectedTask.id}
                            task={selectedTask} 
                            onClose={() => setSelectedTaskId(null)} 
                            isDarkMode={isDarkMode}
                            onUpdate={handleUpdateTask}
                            onComplete={handleCompleteTask}
                            onDelete={handleDeleteTask}
                            onNavigateToChat={onNavigateToChat}
                        />
                    </div>
                ) : (
                    isSplitView && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Layers size={64} className="mb-4" />
                            <p>Select a task to view context</p>
                        </div>
                    )
                )}
             </AnimatePresence>
          </div>
      </div>
      
      {/* Batch Actions Bar */}
      <AnimatePresence>
         {selectedTaskIds.size > 0 && (
            <BatchActionsBar 
                selectedCount={selectedTaskIds.size} 
                onClear={() => setSelectedTaskIds(new Set())}
                isDarkMode={isDarkMode}
            />
         )}
      </AnimatePresence>
      
      {/* Workload / Unscheduled Footer (Hide in split view to save space) */}
      {!isSplitView && (
        <div className={`border-t p-3 flex-shrink-0 ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-4 text-xs">
                <span className={`font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Workload Balance
                </span>
                {uniqueUsers.slice(0, 3).map(user => {
                const count = filteredTasks.filter(t => t.assigneeId === user.id).length;
                const isHigh = count > 5;
                return (
                    <div key={user.id} className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full ${isHigh ? 'bg-red-500' : 'bg-blue-500'}`} 
                                style={{ width: `${Math.min((count / 8) * 100, 100)}%` }} 
                            />
                        </div>
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {user.name}: {count}
                        </span>
                    </div>
                );
                })}
            </div>
        </div>
      )}

      {/* Task Details Modal - Full Screen */}
      {/* Removed as functionality moved to Context Panel */}

    </div>
  );
}

function MorningBriefing({ onClose, isDarkMode }: { onClose: () => void, isDarkMode: boolean }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className={`border-b overflow-hidden relative ${
        isDarkMode 
            ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-white/5' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
      }`}
    >
      <div className="px-6 py-4 flex items-start justify-between gap-4 relative z-10">
        <div className="flex gap-4">
          <div className={`p-2 rounded-lg mt-1 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
            <Sparkles size={18} />
          </div>
          <div>
             <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Morning Briefing</h3>
             <p className={`text-sm mt-1 max-w-2xl ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Good morning. You have <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>4 critical deadlines</span> today. 
                Completing <span className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>"Q3 Report"</span> will unblock 2 teammates.
             </p>
          </div>
        </div>
        <button onClick={onClose} className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
           <X size={18} />
        </button>
      </div>
    </motion.div>
  )
}

function ContextPanel({ task, onClose, isDarkMode, onUpdate, onComplete, onDelete, onNavigateToChat }: { 
    task: Task, 
    onClose: () => void, 
    isDarkMode: boolean,
    onUpdate: (task: Task) => void,
    onComplete: (id: string) => void,
    onDelete: (id: string) => void,
    onNavigateToChat?: (id: string) => void
}) {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const handleStatusChange = (status: Task['status']) => {
        const updated = { ...task, status };
        if (status === 'done') {
          updated.progress = 100;
          onComplete(task.id); 
        }
        onUpdate(updated);
        setShowStatusDropdown(false);
    };

    const handleExecutionStatusChange = (status: Task['executionStatus']) => {
        const updated = { ...task, executionStatus: status };
        onUpdate(updated);
    };

    const toggleSubtask = (subtaskId: string) => {
        const updatedSubtasks = task.subtasks?.map(st => 
          st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
        ) || [];
        
        const completed = updatedSubtasks.filter(s => s.isCompleted).length;
        const progress = Math.round((completed / updatedSubtasks.length) * 100);
        
        onUpdate({ ...task, subtasks: updatedSubtasks, progress });
    };

    const addSubtask = () => {
        if (!newSubtaskTitle.trim()) return;
        const newSubtask = {
          id: `st-${Date.now()}`,
          title: newSubtaskTitle,
          isCompleted: false
        };
        const updatedSubtasks = [...(task.subtasks || []), newSubtask];
        const completed = updatedSubtasks.filter(s => s.isCompleted).length;
        const progress = Math.round((completed / updatedSubtasks.length) * 100);
    
        onUpdate({ ...task, subtasks: updatedSubtasks, progress });
        setNewSubtaskTitle('');
    };

    const addComment = () => {
        if (!newComment.trim()) return;
        const newCommentObj: TaskComment = {
            id: `c_${Date.now()}`,
            userId: 'user-001', 
            userName: 'You',
            text: newComment,
            timestamp: new Date().toISOString()
        };
        onUpdate({ ...task, comments: [...(task.comments || []), newCommentObj] });
        setNewComment('');
    };

    const handleAddAttachment = () => {
        alert('Google Drive integration would open here.');
        const newAttachment: TaskAttachment = {
            id: `att_${Date.now()}`,
            name: 'Campaign_Brief_Final.gdoc',
            type: 'document',
            url: '#',
            size: 'Google Doc'
        };
        onUpdate({ ...task, attachments: [...(task.attachments || []), newAttachment] });
    };

    const statusColors = {
        'todo': 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
        'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
        'blocked': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
        'review': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
        'done': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
    };
  
    const getStatusColor = (status: string) => {
      const colors = statusColors[status as keyof typeof statusColors];
      if (colors) return colors;
      return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'; 
    };
  
    const handleMarkAsComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        origin: { x, y },
        particleCount: 150,
        spread: 60,
        zIndex: 9999 
      });
  
      handleStatusChange('done');
    };

  return (
     <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`h-full flex flex-col border-l shadow-2xl relative z-20 ${
            isDarkMode ? 'bg-[#18181b] border-white/10 text-gray-100' : 'bg-white border-gray-200 text-gray-900'
        }`}
     >
        {/* Header */}
        <div className={`flex-shrink-0 px-6 py-4 flex items-center justify-between border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
             <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                {task.id}
             </div>
             {task.projectTitle && (
               <>
                 <span className="text-gray-400">/</span>
                 <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                   {task.projectTitle}
                 </span>
               </>
             )}
          </div>

          <div className="flex items-center gap-2">
             <button className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <Share2 size={18} />
             </button>
             <button onClick={() => onDelete(task.id)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
                <Trash2 size={18} />
             </button>
             <div className={`h-4 w-[1px] mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />
             <button onClick={onClose} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <X size={20} />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           
           {/* Hero / Cover Area */}
           <div className={`px-8 pt-8 pb-4 relative`}>
              {/* Task Title */}
              <h1 className={`text-3xl font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                 {task.title}
              </h1>

              {/* Primary Action Bar */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                  {/* Status Dropdown */}
                  <div className="relative z-50">
                      <button 
                          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95 ${getStatusColor(task.status)}`}
                      >
                          {task.status.replace('-', ' ')}
                          <ChevronDown size={14} />
                      </button>
                      {showStatusDropdown && (
                          <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-xl z-[60] overflow-hidden border ${isDarkMode ? 'bg-[#252529] border-white/10' : 'bg-white border-gray-200'}`}>
                              {['todo', 'in-progress', 'review', 'blocked', 'done'].map((s) => (
                                  <button
                                      key={s}
                                      onClick={() => handleStatusChange(s as Task['status'])}
                                      className={`w-full text-left px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 capitalize flex items-center gap-3 ${task.status === s ? 'font-bold' : ''} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                                  >
                                      <div className={`w-2.5 h-2.5 rounded-full ${s === 'done' ? 'bg-green-500' : s === 'blocked' ? 'bg-red-500' : s === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400'}`} />
                                      {s.replace('-', ' ')}
                                      {task.status === s && <Check size={14} className="ml-auto opacity-50" />}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  {/* Mark as Complete (Big Button) */}
                  <button 
                    onClick={handleMarkAsComplete}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all bg-green-600 hover:bg-green-700 active:scale-95 text-white shadow-lg shadow-green-500/20"
                  >
                    <CheckCircle2 size={18} />
                    Mark as complete
                  </button>

                  <div className={`h-6 w-[1px] mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                  {/* Time Tracking Controls */}
                  <div className="relative">
                    <div className="flex flex-col items-center gap-1.5 absolute top-1/2 -translate-y-1/2">
                        <div className={`flex items-center rounded-lg p-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                            <button 
                            onClick={() => handleExecutionStatusChange('working')}
                            className={`p-2 rounded-md transition-all ${task.executionStatus === 'working' ? 'bg-white shadow text-blue-600 dark:bg-white/10 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            title="Start Working"
                            >
                            <Play size={18} fill={task.executionStatus === 'working' ? "currentColor" : "none"} />
                            </button>
                            <button 
                            onClick={() => handleExecutionStatusChange(undefined)}
                            className={`p-2 rounded-md transition-all ${!task.executionStatus ? 'bg-white shadow text-gray-600 dark:bg-white/10 dark:text-gray-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            title="Clear Status"
                            type="button"
                            >
                            <X size={18} />
                            </button>
                            <button 
                            onClick={() => handleExecutionStatusChange('paused')}
                            className={`p-2 rounded-md transition-all ${task.executionStatus === 'paused' ? 'bg-white shadow text-orange-500 dark:bg-white/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                            title="Pause"
                            >
                            <Pause size={18} fill={task.executionStatus === 'paused' ? "currentColor" : "none"} />
                            </button>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider absolute top-full mt-1 whitespace-nowrap ${
                            task.executionStatus === 'working' ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') :
                            task.executionStatus === 'paused' ? (isDarkMode ? 'text-orange-400' : 'text-orange-500') :
                            (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                        }`}>
                            {task.executionStatus === 'working' ? 'Working' : task.executionStatus === 'paused' ? 'Paused' : 'No Status'}
                        </span>
                    </div>
                    {/* Invisible Spacer to reserve width since absolute positioning removes it from flow */}
                    <div className="opacity-0 pointer-events-none flex flex-col items-center gap-1.5">
                        <div className="flex items-center rounded-lg p-1">
                            <button className="p-2"><Play size={18} /></button>
                            <button className="p-2"><X size={18} /></button>
                            <button className="p-2"><Pause size={18} /></button>
                        </div>
                    </div>
                  </div>
              </div>
           </div>

           <div className="px-8 pb-8 space-y-8">
              
              {/* Context Source */}
              {task.sourceMessageId && (
                 <div className={`p-4 rounded-xl border flex items-start gap-4 ${isDarkMode ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-full text-blue-600 dark:text-blue-400">
                       <MessageSquare size={18} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-60">Created from message</span>
                            {task.sourceMessageSender && <span className="text-xs opacity-50">from {task.sourceMessageSender}</span>}
                        </div>
                        <p className={`text-sm italic mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            "{task.sourceMessagePreview || 'Message content unavailable'}"
                        </p>
                        <button 
                            onClick={() => onNavigateToChat?.(task.sourceMessageId!)}
                            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            View context in Chat <ChevronRight size={12} />
                        </button>
                    </div>
                 </div>
              )}

              {/* Description */}
              {task.description && (
                  <div>
                      <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 block">Description</label>
                      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {task.description}
                      </p>
                  </div>
              )}

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-6">
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 block">Assignee</label>
                    <div className="flex items-center gap-2">
                        {task.assigneeAvatar ? (
                            <img src={task.assigneeAvatar} className="w-6 h-6 rounded-full" />
                        ) : (
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                                {task.assigneeName.charAt(0)}
                            </div>
                        )}
                        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.assigneeName}</span>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 block">Due Date</label>
                    <div className="flex items-center gap-2 text-sm font-medium">
                       <Calendar size={16} className="opacity-50" />
                       {format(new Date(task.dueDate || new Date()), 'MMMM d, yyyy')}
                    </div>
                 </div>
              </div>

              {/* Shared With (Mock) */}
              <div>
                  <label className="text-xs font-bold uppercase tracking-wider opacity-50 mb-2 block">Shared With</label>
                  <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#18181b] bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700">JD</div>
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#18181b] bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700">MK</div>
                          <div className="w-8 h-8 rounded-full border-2 border-white dark:border-[#18181b] bg-green-200 flex items-center justify-center text-xs font-bold text-green-700">SK</div>
                      </div>
                      <button className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center transition-colors ${isDarkMode ? 'border-gray-600 hover:border-blue-500 text-gray-500' : 'border-gray-400 hover:border-blue-500 text-gray-400'}`}>
                          <Plus size={14} />
                      </button>
                  </div>
              </div>

              {/* Subtasks */}
              <div>
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                       <CheckCircle2 size={20} className="text-blue-500" />
                       Subtasks
                    </h3>
                    <span className="text-sm font-medium opacity-50">{task.progress}% Complete</span>
                 </div>
                 
                 <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-6">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${task.progress}%` }}
                    />
                 </div>

                 <div className="space-y-2">
                    {task.subtasks?.map(st => (
                       <div 
                         key={st.id}
                         className={`
                           group flex items-center gap-3 p-3 rounded-lg border transition-all
                           ${st.isCompleted 
                             ? (isDarkMode ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200') 
                             : (isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200')
                           }
                         `}
                       >
                          <button 
                            onClick={() => toggleSubtask(st.id)}
                            className={`
                              w-5 h-5 rounded border flex items-center justify-center transition-all
                              ${st.isCompleted 
                                ? 'bg-blue-500 border-blue-500 text-white' 
                                : 'border-gray-400 hover:border-blue-500'
                              }
                            `}
                          >
                             {st.isCompleted && <CheckCircle2 size={14} />}
                          </button>
                          <span className={`flex-1 font-medium ${st.isCompleted ? 'line-through opacity-50' : ''}`}>
                             {st.title}
                          </span>
                       </div>
                    ))}

                    <div className="flex items-center gap-3 mt-4">
                       <Plus size={20} className="text-gray-400" />
                       <input 
                         type="text" 
                         placeholder="Add a subtask..."
                         value={newSubtaskTitle}
                         onChange={(e) => setNewSubtaskTitle(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                         className={`flex-1 bg-transparent outline-none py-2 ${isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
                       />
                    </div>
                 </div>
              </div>

              {/* Attachments */}
              <div>
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                          <Paperclip size={20} className="text-orange-500" />
                          Attachments
                      </h3>
                      <button 
                        onClick={handleAddAttachment}
                        className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                      >
                          <Plus size={12} /> Add from Drive
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                      {task.attachments?.map(att => (
                          <div key={att.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                              <div className={`w-10 h-10 rounded flex items-center justify-center ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                  {att.type === 'image' ? <ImageIcon size={20} /> : <FileText size={20} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{att.name}</div>
                                  <div className="text-xs opacity-50">{att.size}</div>
                              </div>
                              <button className="text-gray-400 hover:text-red-500 p-2">
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ))}
                      {(!task.attachments || task.attachments.length === 0) && (
                          <div className={`text-sm italic opacity-50 p-4 text-center border border-dashed rounded-lg ${isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
                              No attachments yet
                          </div>
                      )}
                  </div>
              </div>

              {/* Comments */}
              <div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                      <MessageSquare size={20} className="text-purple-500" />
                      Comments
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                      {task.comments?.map(comment => (
                          <div key={comment.id} className="flex gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                                  {comment.userName.charAt(0)}
                              </div>
                              <div className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                  <div className="flex justify-between items-baseline mb-1">
                                      <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{comment.userName}</span>
                                      <span className="text-[10px] opacity-50">{format(new Date(comment.timestamp), 'MMM d, h:mm a')}</span>
                                  </div>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{comment.text}</p>
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className={`flex items-center gap-3 p-2 rounded-lg border ${isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
                      <input 
                          type="text" 
                          placeholder="Write a comment..." 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addComment()}
                          className={`flex-1 bg-transparent outline-none text-sm px-2 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                      />
                      <button 
                        onClick={addComment}
                        className={`p-2 rounded-md ${newComment.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-500'}`}
                      >
                          <Send size={16} />
                      </button>
                  </div>
              </div>

           </div>
        </div>
     </motion.div>
  )
}

function BatchActionsBar({ selectedCount, onClear, isDarkMode }: { selectedCount: number, onClear: () => void, isDarkMode: boolean }) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
            <div className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl border backdrop-blur-xl ${
                isDarkMode ? 'bg-gray-900/90 border-white/10 text-white' : 'bg-white/90 border-gray-200 text-gray-900'
            }`}>
                <div className="flex items-center gap-2 pr-4 border-r border-gray-500/20">
                    <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {selectedCount}
                    </span>
                    <span className="text-sm font-medium">Selected</span>
                </div>
                
                <div className="flex items-center gap-1">
                    <button className={`p-2 rounded-full hover:bg-gray-500/10 transition-colors tooltip-trigger`}>
                        <Calendar size={18} />
                    </button>
                    <button className={`p-2 rounded-full hover:bg-gray-500/10 transition-colors`}>
                        <User size={18} />
                    </button>
                    <button className={`p-2 rounded-full hover:bg-gray-500/10 transition-colors`}>
                        <Layers size={18} />
                    </button>
                    <div className="w-px h-4 bg-gray-500/20 mx-1" />
                    <button onClick={onClear} className={`p-2 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors`}>
                        <X size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Sub-components (Memoized for performance)
// ----------------------------------------------------------------------

interface DayColumnProps {
  date: Date;
  tasks: Task[];
  isToday: boolean;
  isDarkMode: boolean;
  onMoveTask: (draggedId: string, targetId: string | null, targetDate: Date) => void;
  onTaskClick: (taskId: string) => void;
  selectedTaskIds: Set<string>;
  onToggleSelect: (taskId: string) => void;
  isSplitView: boolean;
}

const DayColumn = React.memo(function DayColumn({ date, tasks, isToday, isDarkMode, onMoveTask, onTaskClick, selectedTaskIds, onToggleSelect, isSplitView }: DayColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string }, monitor) => {
      // Only handle drop if it wasn't handled by a nested drop target (TaskCard)
      if (!monitor.didDrop()) {
        onMoveTask(item.id, null, date);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true }), // Shallow only checks drop on column itself, not children
    }),
  }));

  // If in split view and no tasks, render minimal placeholder
  if (isSplitView && tasks.length === 0) {
      return null; 
  }

  return (
    <div 
      ref={drop}
      className={`
        flex-col min-w-[200px] border-r transition-all duration-500 relative group/col
        ${isSplitView ? 'w-full border-r-0 border-b min-h-[100px] flex-none' : 'flex-1 flex min-w-[200px]'}
        ${isDarkMode ? 'border-white/5' : 'border-gray-200'}
        ${isOver ? (isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50') : ''}
        ${isToday ? (isDarkMode ? 'bg-white/[0.02]' : 'bg-blue-50/30') : ''}
      `}
    >
      {/* Date Header */}
      <div className={`p-3 border-b flex items-center justify-between ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex flex-col">
           <span className={`text-xs font-medium uppercase ${isToday ? 'text-blue-500' : (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`}>
             {format(date, 'EEE')}
           </span>
           <span className={`text-lg font-bold ${isToday ? 'text-blue-500' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
             {format(date, 'd')}
           </span>
        </div>
        {isToday && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">TODAY</span>}
      </div>

      {/* Task List */}
      <div className={`p-2 space-y-2 relative ${isSplitView ? '' : 'flex-1 overflow-y-auto custom-scrollbar'}`}>
        {tasks.map((task, index) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              index={index}
              isFirst={index === 0}
              isToday={isToday}
              isDarkMode={isDarkMode} 
              onClick={() => onTaskClick(task.id)}
              onMoveTask={(draggedId, targetId) => onMoveTask(draggedId, targetId, date)}
              selected={selectedTaskIds.has(task.id)}
              onToggleSelect={() => onToggleSelect(task.id)}
            />
        ))}
        
        {/* Hover Add Button */}
        {!isSplitView && (
            <div className="opacity-0 group-hover/col:opacity-100 transition-opacity flex justify-center mt-2">
                <button className="text-xs text-gray-400 hover:text-blue-500 flex items-center gap-1">
                    <Plus size={12} /> Add
                </button>
            </div>
        )}
      </div>
      
      {/* Total Hours Estimation (Mock) */}
      {!isSplitView && (
          <div className={`p-2 text-center text-[10px] font-medium border-t ${isDarkMode ? 'border-white/5 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
             {tasks.length > 0 ? `${tasks.length * 2}h Est.` : '-'}
          </div>
      )}
    </div>
  );
});

interface TaskCardProps {
  task: Task;
  index: number;
  isFirst: boolean;
  isToday: boolean;
  isDarkMode: boolean;
  onClick: () => void;
  onMoveTask: (draggedId: string, targetId: string) => void;
  selected: boolean;
  onToggleSelect: () => void;
}

const TaskCard = React.memo(function TaskCard({ task, index, isFirst, isToday, isDarkMode, onClick, onMoveTask, selected, onToggleSelect }: TaskCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: { id: string }) => {
      if (item.id !== task.id) {
        onMoveTask(item.id, task.id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drag(drop(ref));
  
  // Status Colors
  const statusColor = task.status === 'blocked' ? 'border-l-red-500' : 
                      task.status === 'done' ? 'border-l-green-500' : 
                      'border-l-blue-500';
  
  const isBlocking = task.isBlocking;
  const isCurrentFocus = isFirst && isToday && task.status !== 'done' && task.status !== 'blocked';
  const isWorking = task.executionStatus === 'working';
  const isPaused = task.executionStatus === 'paused';
  
  // Liquid Progress Calculation
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.isCompleted).length;
  const progressPercent = subtasks.length > 0 ? (completedSubtasks / subtasks.length) * 100 : 0;
  
  const hasLiquidProgress = subtasks.length > 0 && progressPercent > 0 && progressPercent < 100;

  return (
    <motion.div
        ref={ref}
        onClick={onClick}
        layoutId={task.id}
        initial={{ opacity: 0, y: 5 }}
        animate={isWorking ? {
          opacity: 1,
          y: 0,
          scale: 1.02,
          boxShadow: isDarkMode 
            ? ["0 0 0px rgba(59, 130, 246, 0)", "0 0 15px rgba(59, 130, 246, 0.3)", "0 0 0px rgba(59, 130, 246, 0)"]
            : ["0 0 0px rgba(59, 130, 246, 0)", "0 0 15px rgba(59, 130, 246, 0.4)", "0 0 0px rgba(59, 130, 246, 0)"],
          transition: { 
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.2 }
          }
        } : { 
          opacity: 1, 
          y: 0, 
          scale: isCurrentFocus ? 1.02 : 1,
          boxShadow: isCurrentFocus ? (isDarkMode ? '0 0 20px rgba(59, 130, 246, 0.15)' : '0 0 15px rgba(59, 130, 246, 0.1)') : 'none'
        }}
        className={`
            relative p-3 rounded-lg border-l-[3px] border-t border-r border-b cursor-grab active:cursor-grabbing group transition-all overflow-hidden
            ${statusColor}
            ${isDragging ? 'opacity-50' : 'opacity-100'}
            ${isOver ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-transparent' : ''}
            ${isDarkMode 
                ? 'bg-[#18181b] border-t-white/5 border-r-white/5 border-b-white/5 hover:bg-[#202023]' 
                : 'bg-white border-t-gray-100 border-r-gray-100 border-b-gray-100 hover:shadow-md'
            }
            ${isCurrentFocus ? 'ring-1 ring-blue-500/30' : ''}
            ${selected ? (isDarkMode ? 'ring-1 ring-blue-400 bg-blue-900/10' : 'ring-1 ring-blue-500 bg-blue-50') : ''}
        `}
    >
        {/* Working Overlay (Blue, Animated) */}
        {isWorking && (
            <motion.div 
                className="absolute inset-0 z-0 pointer-events-none"
                initial={{ backgroundPosition: '0 0' }}
                animate={{ backgroundPosition: '28px 0' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                style={{
                    backgroundSize: '28px 28px',
                    backgroundImage: isDarkMode 
                        ? 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%, transparent 50%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.1) 75%, transparent 75%, transparent)'
                        : 'linear-gradient(45deg, rgba(37, 99, 235, 0.1) 25%, transparent 25%, transparent 50%, rgba(37, 99, 235, 0.1) 50%, rgba(37, 99, 235, 0.1) 75%, transparent 75%, transparent)'
                }}
            />
        )}

        {/* Paused Overlay (Orange, Static) */}
        {isPaused && (
            <div 
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundSize: '28px 28px',
                    backgroundImage: isDarkMode
                        ? 'linear-gradient(45deg, rgba(249, 115, 22, 0.25) 25%, transparent 25%, transparent 50%, rgba(249, 115, 22, 0.25) 50%, rgba(249, 115, 22, 0.25) 75%, transparent 75%, transparent)'
                        : 'linear-gradient(45deg, rgba(249, 115, 22, 0.2) 25%, transparent 25%, transparent 50%, rgba(249, 115, 22, 0.2) 50%, rgba(249, 115, 22, 0.2) 75%, transparent 75%, transparent)'
                }}
            />
        )}

        {/* Liquid Progress Background */}
        {hasLiquidProgress && (
            <div 
                className="absolute bottom-0 left-0 right-0 bg-blue-500/5 dark:bg-blue-400/10 pointer-events-none transition-all duration-1000 ease-in-out"
                style={{ height: `${progressPercent}%` }}
            />
        )}
        
        {/* Checkbox (Visible on hover or selected) */}
        <div 
            onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
            className={`absolute top-3 right-3 z-20 transition-opacity ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
            {selected ? (
                <CheckSquare size={16} className="text-blue-500 fill-blue-500/20" />
            ) : (
                <Square size={16} className="text-gray-400 hover:text-blue-500" />
            )}
        </div>

        {/* Working Indicator Badge */}
        {isWorking && (
           <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg z-10 flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              Working
           </div>
        )}

        {/* Paused Indicator Badge */}
        {isPaused && (
           <div className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg z-10 flex items-center gap-1">
              <Pause size={8} fill="currentColor" />
              Paused
           </div>
        )}

        {/* Energy Level Indicator */}
        {task.energyLevel && (
            <div className={`absolute top-3 left-1 flex items-center justify-center`}>
                <Zap 
                    size={10} 
                    className={task.energyLevel === 'high' ? 'text-amber-500' : 'text-blue-400'} 
                    fill={task.energyLevel === 'high' ? 'currentColor' : 'none'}
                />
            </div>
        )}

        {/* Current Focus Badge - Only show if not working/paused to avoid clutter */}
        {isCurrentFocus && !isWorking && !isPaused && (
           <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-blue-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-lg z-10">
              Current Focus
           </div>
        )}

        {/* Revere Blocking Alert */}
        {isBlocking && (
            <div className="absolute -top-1.5 -right-1.5">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            </div>
        )}

        <div className="flex justify-between items-start gap-2 mb-1.5 mt-1 pl-3">
            <span className={`text-xs font-medium leading-snug line-clamp-2 text-left relative z-10 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {task.title}
            </span>
            <div className="flex items-center gap-1 mr-4">
               {/* Priority Indicator */}
               {task.priority === 'urgent' && <Flag size={10} className="text-red-500 flex-shrink-0" fill="currentColor" />}
               {task.priority === 'high' && <Flag size={10} className="text-orange-500 flex-shrink-0" />}
            </div>
        </div>

        <div className="flex items-center justify-between mt-2 pl-3">
             <div className="flex items-center gap-1.5">
                 {task.assigneeAvatar ? (
                     <img src={task.assigneeAvatar} className="w-4 h-4 rounded-full" />
                 ) : (
                     <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                         {task.assigneeName.charAt(0)}
                     </div>
                 )}
                 <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{task.assigneeName}</span>
             </div>
             
             {task.status === 'blocked' && (
                 <AlertTriangle size={12} className="text-red-500" />
             )}
             {task.status === 'done' && (
                 <CheckCircle2 size={12} className="text-green-500" />
             )}
        </div>

        {/* Progress Bar or Tags */}
        {!hasLiquidProgress && task.status === 'in-progress' && (
            <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${task.progress}%` }} />
            </div>
        )}
        
        {/* AI Insight Tooltip on Hover */}
        {(task.blockingAlert || task.blockedReason) && (
             <div className="hidden group-hover:block absolute z-50 left-0 right-0 top-full mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/30 text-[10px] text-red-600 dark:text-red-300 shadow-xl pointer-events-none">
                 <div className="flex items-center gap-1 mb-1 font-bold">
                     <Sparkles size={10} />
                     Revere Alert
                 </div>
                 {task.blockingAlert || task.blockedReason}
             </div>
        )}

    </motion.div>
  );
});