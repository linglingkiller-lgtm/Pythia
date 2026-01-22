import React from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskComment, TaskAttachment } from '../../data/workHubData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Calendar, User, Clock, Flag, CheckCircle2, AlertTriangle, 
  Paperclip, MessageSquare, Plus, Trash2, MoreHorizontal, 
  ChevronRight, ChevronDown, Sparkles, Link, Tag, Send,
  Play, Pause, Coffee, FileText, Image as ImageIcon, Users,
  Share2, Archive, Check
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';

interface TaskDetailsModalProps {
  taskId: string;
  task?: Task; // Optional prop to avoid refetching
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  onNavigateToChat?: (messageId: string) => void;
}

export function TaskDetailsModal({ taskId, task: initialTask, onClose, onUpdate, onDelete, onComplete, onNavigateToChat }: TaskDetailsModalProps) {
  const { isDarkMode } = useTheme();
  const [task, setTask] = React.useState<Task | null>(initialTask || null);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [newComment, setNewComment] = React.useState('');
  const [showStatusDropdown, setShowStatusDropdown] = React.useState(false);

  // Fetch Task (Mock) if not provided
  React.useEffect(() => {
    if (!initialTask) {
      const { mockTasks } = require('../../data/workHubData'); 
      const found = mockTasks.find((t: Task) => t.id === taskId);
      if (found) setTask({ ...found });
    } else {
        setTask(initialTask);
    }
  }, [taskId, initialTask]);

  if (!task) return null;

  const handleStatusChange = (status: Task['status']) => {
    const updated = { ...task, status };
    if (status === 'done') {
      updated.progress = 100;
      onComplete(task.id); 
    }
    setTask(updated);
    onUpdate(updated);
    setShowStatusDropdown(false);
  };

  const handleExecutionStatusChange = (status: Task['executionStatus']) => {
    const updated = { ...task, executionStatus: status };
    setTask(updated);
    onUpdate(updated);
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
    ) || [];
    
    // Auto-update progress
    const completed = updatedSubtasks.filter(s => s.isCompleted).length;
    const progress = Math.round((completed / updatedSubtasks.length) * 100);
    
    const updated = { ...task, subtasks: updatedSubtasks, progress };
    setTask(updated);
    onUpdate(updated);
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

    const updated = { ...task, subtasks: updatedSubtasks, progress };
    setTask(updated);
    onUpdate(updated);
    setNewSubtaskTitle('');
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const newCommentObj: TaskComment = {
        id: `c_${Date.now()}`,
        userId: 'user-001', // Mock current user
        userName: 'You',
        text: newComment,
        timestamp: new Date().toISOString()
    };
    const updatedComments = [...(task.comments || []), newCommentObj];
    const updated = { ...task, comments: updatedComments };
    setTask(updated);
    onUpdate(updated);
    setNewComment('');
  };

  const handleAddAttachment = () => {
      // Mock logic for Google Drive integration
      alert('Google Drive integration would open here.');
      const newAttachment: TaskAttachment = {
          id: `att_${Date.now()}`,
          name: 'Campaign_Brief_Final.gdoc',
          type: 'document',
          url: '#',
          size: 'Google Doc'
      };
      const updatedAttachments = [...(task.attachments || []), newAttachment];
      const updated = { ...task, attachments: updatedAttachments };
      setTask(updated);
      onUpdate(updated);
  };

  const statusColors = {
      'todo': 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300',
      'in-progress': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300',
      'blocked': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
      'review': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
      'done': 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
  };

  // Safe status color lookup
  const getStatusColor = (status: string) => {
    const colors = statusColors[status as keyof typeof statusColors];
    if (colors) return colors;
    return 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300'; // Default
  };

  const handleMarkAsComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger confetti from button position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      origin: { x, y },
      particleCount: 150,
      spread: 60,
      zIndex: 9999 // Ensure it's on top of everything
    });

    handleStatusChange('done');
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
      />

      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`
          fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] z-[70] shadow-2xl overflow-hidden flex flex-col
          ${isDarkMode ? 'bg-[#18181b]' : 'bg-white'}
        `}
      >
        {/* Simplified Header - Window Controls Only */}
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

              {/* Primary Action Bar - MOVED HERE FOR VISIBILITY */}
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
                  <div className={`flex items-center rounded-lg p-1 ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                     <button 
                       onClick={() => handleExecutionStatusChange('working')}
                       className={`p-2 rounded-md transition-all ${task.executionStatus === 'working' ? 'bg-white shadow text-blue-600 dark:bg-white/10 dark:text-blue-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                       title="Start Working"
                     >
                       <Play size={18} fill={task.executionStatus === 'working' ? "currentColor" : "none"} />
                     </button>
                     <button 
                       onClick={() => handleExecutionStatusChange('paused')}
                       className={`p-2 rounded-md transition-all ${task.executionStatus === 'paused' ? 'bg-white shadow text-orange-500 dark:bg-white/10' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                       title="Pause"
                     >
                       <Pause size={18} fill={task.executionStatus === 'paused' ? "currentColor" : "none"} />
                     </button>
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
                              <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
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
                        className={`p-2 rounded-md ${newComment.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400 dark:bg-white/10 dark:text-gray-600'}`}
                      >
                          <Send size={16} />
                      </button>
                  </div>
              </div>

           </div>
        </div>
      </motion.div>
    </>
  );
}
