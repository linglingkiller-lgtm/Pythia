import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Target, CheckCircle2, AlertCircle, Filter
} from 'lucide-react';
import { format, addDays, eachDayOfInterval, isSameDay, differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface TimelineTask {
  id: string;
  title: string;
  startDate?: string;
  dueDate?: string;
  status: TaskStatus | string;
  priority: Priority | string;
  projectTitle?: string;
  [key: string]: any;
}

interface MyWorkTimelineProps {
  tasks: TimelineTask[];
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export function MyWorkTimeline({ tasks }: MyWorkTimelineProps) {
  const { isDarkMode } = useTheme();
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week'>('day');
  const [timeRangeStart, setTimeRangeStart] = useState(new Date()); // Start from today
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter tasks that have dates for the timeline
  const timelineTasks = useMemo(() => {
    return tasks.filter(t => t.startDate || t.dueDate).map(t => {
      // Normalize dates
      const start = t.startDate ? new Date(t.startDate) : new Date(t.dueDate!);
      const end = t.dueDate ? new Date(t.dueDate) : start;
      return { ...t, _start: start, _end: end };
    });
  }, [tasks]);

  // Group by project
  const projects = useMemo(() => Array.from(new Set(timelineTasks.map(t => t.projectTitle || 'Unassigned'))), [timelineTasks]);

  // Auto-expand all projects initially
  React.useEffect(() => {
    setExpandedProjects(new Set(projects));
  }, [projects]);

  // Generate Calendar Days
  const daysToShow = 45; 
  const calendarDays = useMemo(() => eachDayOfInterval({
    start: timeRangeStart,
    end: addDays(timeRangeStart, daysToShow - 1)
  }), [timeRangeStart, daysToShow]);

  const cellWidth = zoomLevel === 'day' ? 50 : 30;
  const headerHeight = 48;
  const rowHeight = 52;

  // Calculate Position
  const getPosition = useCallback((date: Date) => {
    const diff = differenceInDays(date, timeRangeStart);
    return diff * cellWidth;
  }, [timeRangeStart, cellWidth]);

  const getWidth = useCallback((start: Date, end: Date) => {
    let diff = differenceInDays(end, start) + 1;
    if (diff < 1) diff = 1;
    return diff * cellWidth;
  }, [cellWidth]);

  const toggleProject = (project: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(project)) {
        newSet.delete(project);
      } else {
        newSet.add(project);
      }
      return newSet;
    });
  };

  const getProjectStats = useCallback((project: string) => {
    const projectTasks = timelineTasks.filter(t => (t.projectTitle || 'Unassigned') === project);
    const completed = projectTasks.filter(t => t.status === 'done').length;
    const total = projectTasks.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, progress };
  }, [timelineTasks]);

  return (
    <div className="flex flex-col h-[500px] bg-transparent border-b border-gray-200 dark:border-white/5">
      
      {/* ---------------- Toolbar ---------------- */}
      <div className={`flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl ${
        isDarkMode 
          ? 'border-white/5 bg-[#0a0a0b]/80' 
          : 'border-gray-200/50 bg-white/80'
      }`}>
        <div className="flex items-center gap-6">
          {/* Date Navigation */}
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setTimeRangeStart(addDays(timeRangeStart, -7))}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'hover:bg-white/5 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
             >
                <ChevronLeft size={18} />
             </button>
             <div className={`px-4 py-2 rounded-lg font-semibold text-sm min-w-[160px] text-center ${
               isDarkMode 
                 ? 'bg-white/5 text-white' 
                 : 'bg-gray-50 text-gray-900'
             }`}>
                {format(timeRangeStart, 'MMMM yyyy')}
             </div>
             <button 
                onClick={() => setTimeRangeStart(addDays(timeRangeStart, 7))}
                className={`p-2 rounded-lg transition-all ${
                  isDarkMode 
                    ? 'hover:bg-white/5 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
             >
                <ChevronRight size={18} />
             </button>
          </div>
          
          <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
          
          {/* Zoom Toggle */}
          <div className={`flex items-center gap-1 p-1 rounded-lg ${
            isDarkMode ? 'bg-white/5' : 'bg-gray-100'
          }`}>
             <button 
                onClick={() => setZoomLevel('day')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  zoomLevel === 'day' 
                    ? (isDarkMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-md')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
             >
                Daily
             </button>
             <button 
                onClick={() => setZoomLevel('week')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  zoomLevel === 'week' 
                    ? (isDarkMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-blue-500 text-white shadow-md')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
                }`}
             >
                Weekly
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2">
            <Filter size={14} />
            Filter
          </Button>
          <Button variant="primary" size="sm" className="gap-2">
            <Plus size={14} />
            Add Task
          </Button>
        </div>
      </div>

      {/* ---------------- Main Content ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Task List */}
        <div className={`w-80 flex-shrink-0 border-r flex flex-col backdrop-blur-xl ${
          isDarkMode ? 'border-white/5 bg-[#0a0a0b]/60' : 'border-gray-200/50 bg-gray-50/60'
        }`}>
            <div 
              className={`px-6 flex items-center font-bold text-[11px] uppercase tracking-widest border-b ${
                isDarkMode ? 'text-gray-500 border-white/5' : 'text-gray-400 border-gray-200/50'
              }`} 
              style={{ height: headerHeight }}
            >
                <Target size={14} className="mr-2 opacity-50" />
                My Projects
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {projects.map(project => {
                  const isExpanded = expandedProjects.has(project);
                  const stats = getProjectStats(project);
                  
                  return (
                    <div key={project} className="mb-1">
                        <button
                          onClick={() => toggleProject(project)}
                          className={`w-full px-6 py-3 flex items-center justify-between group transition-all ${
                            isDarkMode ? 'hover:bg-white/5 border-b border-white/5' : 'hover:bg-gray-100/50 border-b border-gray-200/50'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                            </motion.div>
                            <div className="flex-1 min-w-0 text-left">
                              <div className={`text-xs font-bold truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {project}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.progress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  />
                                </div>
                                <span className={`text-[10px] font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {stats.progress}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {timelineTasks.filter(t => (t.projectTitle || 'Unassigned') === project).map(task => (
                                <div 
                                    key={task.id} 
                                    className={`flex items-center justify-between px-6 pl-12 py-3 border-b group hover:bg-gradient-to-r transition-all cursor-pointer ${
                                      isDarkMode ? 'border-white/5 hover:from-blue-500/5' : 'border-gray-200/50 hover:from-blue-500/5'
                                    }`}
                                    style={{ height: rowHeight }}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                          task.priority === 'high' || task.priority === 'critical' ? 'bg-red-500' : 
                                          task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                                        }`} />
                                        <span className={`text-xs font-medium truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                          {task.title}
                                        </span>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                      {task.status === 'done' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                      {task.status === 'blocked' && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                  );
                })}
            </div>
        </div>

        {/* Right Side: Timeline Grid */}
        <div 
          className={`flex-1 flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-[#0a0a0b]/40' : 'bg-white/40'}`} 
          ref={scrollContainerRef}
        >
            {/* Header */}
            <div 
              className={`flex sticky top-0 z-20 backdrop-blur-xl border-b ${
                isDarkMode ? 'bg-[#0a0a0b]/80 border-white/5' : 'bg-white/80 border-gray-200/50'
              }`} 
              style={{ height: headerHeight }}
            >
                {calendarDays.map((day, i) => {
                    const isToday = isSameDay(day, new Date());
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    
                    return (
                        <div 
                            key={i}
                            className={`flex-shrink-0 flex flex-col items-center justify-center border-r transition-all relative ${
                                isDarkMode ? 'border-white/5' : 'border-gray-200/50'
                            } ${isWeekend ? (isDarkMode ? 'bg-white/[0.02]' : 'bg-gray-50/50') : ''}`}
                            style={{ width: cellWidth }}
                        >
                            {isToday && (
                              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-500" />
                            )}
                            <span className={`text-[10px] font-bold uppercase ${
                              isToday ? 'text-blue-500' : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                            }`}>
                                {format(day, 'EEE')}
                            </span>
                            <span className={`font-semibold text-xs mt-0.5 ${
                              isToday 
                                ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                            }`}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <div className="absolute inset-0 pointer-events-none flex">
                    {calendarDays.map((day, i) => {
                         const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                         const isToday = isSameDay(day, new Date());
                         return (
                            <div 
                                key={i}
                                className={`flex-shrink-0 border-r relative ${
                                    isDarkMode ? 'border-white/5' : 'border-gray-200/50'
                                } ${isWeekend ? (isDarkMode ? 'bg-white/[0.01]' : 'bg-gray-50/30') : ''}`}
                                style={{ width: cellWidth, height: '100%' }}
                            >
                              {isToday && (
                                <div className="absolute inset-0 bg-blue-500/5" />
                              )}
                            </div>
                        )
                    })}
                </div>

                <div className="relative min-w-max pb-20">
                    {projects.map(project => {
                      const isExpanded = expandedProjects.has(project);
                      if (!isExpanded) return null;
                      
                      return (
                        <div key={project}>
                            <div style={{ height: 52 }} /> 
                            
                            {timelineTasks.filter(t => (t.projectTitle || 'Unassigned') === project).map(task => {
                                const left = getPosition(task._start);
                                const width = getWidth(task._start, task._end);
                                
                                return (
                                    <div 
                                        key={task.id}
                                        className="relative group"
                                        style={{ height: rowHeight }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.02, y: -1 }}
                                            className="absolute top-1/2 -translate-y-1/2 rounded-lg flex items-center cursor-pointer overflow-hidden shadow-md h-8 px-3"
                                            style={{ 
                                                left, 
                                                width: Math.max(width, cellWidth),
                                                zIndex: 5,
                                                background: task.status === 'done' 
                                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                                                    : task.status === 'blocked'
                                                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                                      : isDarkMode 
                                                        ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
                                                        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                                            <span className="text-[10px] font-bold text-white truncate relative z-10 drop-shadow">
                                                {task.title}
                                            </span>
                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                      );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
