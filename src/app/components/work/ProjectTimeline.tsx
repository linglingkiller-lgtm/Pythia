import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar, ChevronRight, ChevronLeft, Plus, MoreHorizontal, 
  Flag, Clock, AlertCircle, CheckCircle2, User, Search, Filter,
  ZoomIn, ZoomOut, ArrowRight, Layout, Link as LinkIcon, Paperclip, MessageSquare, Sparkles,
  TrendingUp, Target, Zap, Gavel, Users, FileText
} from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, differenceInDays, parseISO, isWithinInterval } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { mockProjects, mockTasks, Project, Task, ProjectStage } from '../../data/workHubData';

// ----------------------------------------------------------------------
// Types & Helper Functions
// ----------------------------------------------------------------------

type TimelineZoomLevel = 'day' | 'week';

// Stage Colors - Matching ProjectsBoard
const STAGE_COLORS: Record<ProjectStage, string> = {
  'intake': 'bg-gray-500',
  'discovery': 'bg-blue-500',
  'strategy': 'bg-purple-500',
  'execution': 'bg-indigo-500',
  'review': 'bg-orange-500',
  'delivered': 'bg-emerald-500',
  'on-hold': 'bg-slate-500'
};

const STAGE_LABELS: Record<ProjectStage, string> = {
  'intake': 'Concept',
  'discovery': 'Drafting',
  'strategy': 'Proposal',
  'execution': 'Execution',
  'review': 'Review',
  'delivered': 'Delivered',
  'on-hold': 'On Hold'
};

const StatusBadge = React.memo(({ status }: { status: Task['status'] }) => {
  const styles = {
    'todo': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'blocked': 'bg-red-500/10 text-red-400 border-red-500/20',
    'review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'done': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const labels = {
    'todo': 'Not Started',
    'in-progress': 'In Progress',
    'blocked': 'Blocked',
    'review': 'In Review',
    'done': 'Completed',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
});

interface ProjectTimelineProps {
  onProjectClick?: (project: Project) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function ProjectTimeline({ onProjectClick, onNavigateToBill }: ProjectTimelineProps) {
  const { isDarkMode } = useTheme();
  const [zoomLevel, setZoomLevel] = useState<TimelineZoomLevel>('day');
  const [timeRangeStart, setTimeRangeStart] = useState(new Date(2025, 11, 1)); // Dec 1, 2025
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set(mockProjects.map(p => p.id)));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter & Sort Projects by Stage Order
  const stageOrder: ProjectStage[] = ['intake', 'discovery', 'strategy', 'execution', 'review', 'delivered'];
  
  const sortedProjects = useMemo(() => {
    return [...mockProjects].sort((a, b) => {
      return stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage);
    });
  }, []);

  // Generate Calendar Days
  const daysToShow = zoomLevel === 'day' ? 45 : 90; 
  const calendarDays = useMemo(() => eachDayOfInterval({
    start: timeRangeStart,
    end: addDays(timeRangeStart, daysToShow - 1)
  }), [timeRangeStart, daysToShow]);

  const cellWidth = zoomLevel === 'day' ? 50 : 30;
  const headerHeight = 56;
  const rowHeight = 52;

  // Calculate Position
  const getPosition = useCallback((dateStr?: string) => {
    if (!dateStr) return 0;
    const date = new Date(dateStr);
    const diff = differenceInDays(date, timeRangeStart);
    return diff * cellWidth;
  }, [timeRangeStart, cellWidth]);

  const getWidth = useCallback((startStr?: string, endStr?: string) => {
    if (!startStr) return cellWidth;
    const start = new Date(startStr);
    // If no end date, default to 1 day width
    const end = endStr ? new Date(endStr) : start;
    const diff = differenceInDays(end, start) + 1;
    return Math.max(diff * cellWidth, cellWidth); // Minimum 1 cell width
  }, [cellWidth]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      
      {/* ---------------- Toolbar ---------------- */}
      <div className={`flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl transition-colors duration-300 ${
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
                    ? (isDarkMode 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-blue-600 shadow-sm')
                    : (isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50')
                }`}
             >
                Daily
             </button>
             <button 
                onClick={() => setZoomLevel('week')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  zoomLevel === 'week' 
                    ? (isDarkMode 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-white text-blue-600 shadow-sm')
                    : (isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50')
                }`}
             >
                Weekly
             </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${!isDarkMode ? 'text-gray-600 hover:bg-gray-100' : ''}`}
          >
            <Filter size={14} />
            Filter
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            className="gap-2 shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} />
            New Project
          </Button>
        </div>
      </div>

      {/* ---------------- Main Timeline Area ---------------- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT SIDEBAR: Project Hierarchy */}
        <div className={`w-96 flex-shrink-0 border-r flex flex-col backdrop-blur-xl z-20 ${
          isDarkMode 
            ? 'border-white/5 bg-[#0a0a0b]/60' 
            : 'border-gray-200/50 bg-gray-50/60'
        }`}>
            {/* Header */}
            <div 
              className={`px-6 flex items-center justify-between font-bold text-[11px] uppercase tracking-widest border-b ${
                isDarkMode 
                  ? 'text-gray-500 border-white/5' 
                  : 'text-gray-400 border-gray-200/50'
              }`} 
              style={{ height: headerHeight }}
            >
                <div className="flex items-center gap-2">
                   <Target size={14} className="opacity-50" />
                   Projects & Stages
                </div>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {sortedProjects.map(project => {
                  const isExpanded = expandedProjects.has(project.id);
                  const projectTasks = mockTasks.filter(t => t.projectId === project.id);
                  
                  return (
                    <div key={project.id} className="mb-1">
                        {/* Project Row */}
                        <div
                          className={`w-full px-4 py-3 flex items-center justify-between group transition-all border-b cursor-pointer ${
                            isDarkMode 
                              ? 'hover:bg-white/5 border-white/5' 
                              : 'hover:bg-white border-gray-100 bg-gray-50/30'
                          }`}
                          onClick={() => onProjectClick && onProjectClick(project)}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Expand Toggle */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); toggleProject(project.id); }}
                                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 transition-colors`}
                            >
                                <motion.div
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                                </motion.div>
                            </button>

                            {/* Project Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-2 h-2 rounded-full ${STAGE_COLORS[project.stage]}`} />
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {STAGE_LABELS[project.stage]}
                                  </span>
                                  {project.confidenceScore && (
                                    <div className="flex items-center gap-1 ml-auto">
                                        <Zap size={10} className={project.confidenceScore > 80 ? 'text-emerald-500' : 'text-amber-500'} fill="currentColor" />
                                        <span className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {project.confidenceScore}%
                                        </span>
                                    </div>
                                  )}
                              </div>
                              <h4 className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {project.title}
                              </h4>
                            </div>
                          </div>
                        </div>
                        
                        {/* Task Rows (Nested) */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {projectTasks.map(task => (
                                <motion.div 
                                    key={task.id} 
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className={`flex items-center justify-between px-6 pl-14 py-2 border-b group transition-all cursor-pointer ${
                                      isDarkMode 
                                        ? 'border-white/5 hover:bg-white/5' 
                                        : 'border-gray-100 hover:bg-gray-50'
                                    }`}
                                    style={{ height: rowHeight }}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                            task.priority === 'high' ? 'bg-orange-500' : 'bg-gray-400'
                                        }`} />
                                        
                                        <span className={`text-xs font-medium truncate ${
                                          isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-gray-900'
                                        }`}>
                                          {task.title}
                                        </span>

                                        {/* Context Icons */}
                                        <div className="flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            {task.linkedBillIds?.length > 0 && <Gavel size={12} className="text-purple-500" />}
                                            {task.linkedPersonIds?.length > 0 && <Users size={12} className="text-blue-500" />}
                                        </div>
                                    </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                  );
                })}
            </div>
        </div>

        {/* RIGHT SIDE: Timeline Grid */}
        <div 
          className={`flex-1 flex flex-col overflow-hidden relative ${
            isDarkMode ? 'bg-[#0a0a0b]/40' : 'bg-white/40'
          }`} 
          ref={scrollContainerRef}
        >
            
            {/* Calendar Header */}
            <div 
              className={`flex sticky top-0 z-10 backdrop-blur-xl border-b ${
                isDarkMode 
                  ? 'bg-[#0a0a0b]/80 border-white/5' 
                  : 'bg-white/80 border-gray-200/50'
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
                              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              isToday 
                                ? 'text-blue-500' 
                                : (isDarkMode ? 'text-gray-600' : 'text-gray-400')
                            }`}>
                                {format(day, 'EEE')}
                            </span>
                            <span className={`font-semibold text-xs mt-0.5 ${
                              isToday 
                                ? 'bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30' 
                                : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                            }`}>
                                {format(day, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                
                {/* Background Grid Lines */}
                <div className="absolute inset-0 pointer-events-none flex h-full">
                    {calendarDays.map((day, i) => {
                         const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                         const isToday = isSameDay(day, new Date());
                         return (
                            <div 
                                key={i}
                                className={`flex-shrink-0 border-r relative h-full ${
                                    isDarkMode ? 'border-white/5' : 'border-gray-200/50'
                                } ${isWeekend ? (isDarkMode ? 'bg-white/[0.01]' : 'bg-gray-50/30') : ''}`}
                                style={{ width: cellWidth }}
                            >
                              {isToday && (
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
                              )}
                            </div>
                        )
                    })}
                </div>

                {/* Bars Container */}
                <div className="relative min-w-max pb-32">
                    {sortedProjects.map(project => {
                      const isExpanded = expandedProjects.has(project.id);
                      const projectTasks = mockTasks.filter(t => t.projectId === project.id);
                      
                      return (
                        <div key={project.id} className="relative">
                            {/* Project Duration Bar (Summary) */}
                            <div 
                                className={`relative border-b flex items-center ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}
                                style={{ height: 65 }} // Matches sidebar row height roughly
                            >
                                {/* Only show a bar if we have a valid start/end for project or its tasks */}
                                {(() => {
                                   // Determine project range from tasks
                                   if (projectTasks.length === 0) return null;
                                   
                                   const startDates = projectTasks.map(t => t.dueDate ? new Date(t.createdAt).getTime() : 0).filter(d => d > 0);
                                   const endDates = projectTasks.map(t => t.dueDate ? new Date(t.dueDate).getTime() : 0).filter(d => d > 0);
                                   
                                   if (startDates.length === 0 || endDates.length === 0) return null;
                                   
                                   const minDate = new Date(Math.min(...startDates));
                                   const maxDate = new Date(Math.max(...endDates));
                                   
                                   const left = getPosition(minDate.toISOString());
                                   const width = getWidth(minDate.toISOString(), maxDate.toISOString());

                                   return (
                                       <motion.div
                                          initial={{ opacity: 0, scaleX: 0 }}
                                          animate={{ opacity: 1, scaleX: 1 }}
                                          className={`absolute h-2 rounded-full opacity-60 ${STAGE_COLORS[project.stage]}`}
                                          style={{ 
                                              left, 
                                              width, 
                                              top: '50%', 
                                              marginTop: -1 
                                          }}
                                       />
                                   );
                                })()}
                            </div>
                            
                            {/* Task Bars */}
                            <AnimatePresence>
                                {isExpanded && projectTasks.map(task => {
                                    const left = getPosition(task.createdAt); // Using createdAt as start for demo
                                    const width = getWidth(task.createdAt, task.dueDate);
                                    const isMilestone = false; // Add milestone logic if needed, treating all as tasks for now based on data

                                    return (
                                        <div 
                                            key={task.id}
                                            className={`relative border-b ${isDarkMode ? 'border-white/5' : 'border-gray-50'}`}
                                            style={{ height: rowHeight }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                whileHover={{ scale: 1.02 }}
                                                className={`absolute top-1/2 -translate-y-1/2 rounded-md shadow-sm border border-white/10 cursor-pointer flex items-center px-2 gap-2 overflow-hidden ${
                                                    task.status === 'done' 
                                                        ? 'bg-emerald-500/80' 
                                                        : task.status === 'blocked'
                                                            ? 'bg-red-500/80'
                                                            : isDarkMode ? 'bg-blue-600/80' : 'bg-blue-500'
                                                }`}
                                                style={{ left, width: Math.max(width, 40), height: 28 }}
                                            >
                                                {/* Graphic overlay */}
                                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                                                
                                                {/* Progress Fill (only for tasks) */}
                                                {!isMilestone && task.status !== 'done' && (
                                                    <div 
                                                        className="absolute top-0 left-0 bottom-0 bg-white/20" 
                                                        style={{ width: `${task.progress}%` }}
                                                    />
                                                )}
                                                
                                                {/* Label */}
                                                {!isMilestone && width > 80 && (
                                                    <span className="text-[10px] font-bold text-white truncate relative z-10 drop-shadow">
                                                        {task.title}
                                                    </span>
                                                )}

                                                {/* Linked Context Icons on Bar */}
                                                {width > 120 && (
                                                    <div className="flex items-center gap-1 ml-auto flex-shrink-0 relative z-10">
                                                        {task.linkedBillIds?.length > 0 && <Gavel size={10} className="text-white/90" />}
                                                        {task.linkedPersonIds?.length > 0 && <Users size={10} className="text-white/90" />}
                                                    </div>
                                                )}
                                                
                                                {/* Premium Hover Tooltip */}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 p-5 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 backdrop-blur-xl">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                          {task.priority === 'high' && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                          )}
                                                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                                              task.priority === 'high' 
                                                                ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                                                                : task.priority === 'medium'
                                                                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                  : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                          }`}>
                                                              {task.priority} Priority
                                                          </span>
                                                        </div>
                                                        <StatusBadge status={task.status} />
                                                    </div>
                                                    
                                                    {/* Title */}
                                                    <h4 className={`font-bold mb-3 text-sm leading-snug ${
                                                      isDarkMode ? 'text-white' : 'text-gray-900'
                                                    }`}>
                                                      {task.title}
                                                    </h4>
                                                    
                                                    {/* Details Grid */}
                                                    <div className="space-y-2.5 mb-3">
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <User size={13} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                              Assigned to
                                                            </span>
                                                            <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                              {task.assigneeName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs">
                                                            <Clock size={13} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                            <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                                                {task.dueDate ? format(parseISO(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                                                            </span>
                                                        </div>
                                                        {!isMilestone && (
                                                          <div className="flex items-center gap-2 text-xs">
                                                              <TrendingUp size={13} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                                                              <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-white/10">
                                                                <div 
                                                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                                                  style={{ width: `${task.progress}%` }}
                                                                />
                                                              </div>
                                                              <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                                                {task.progress}%
                                                              </span>
                                                          </div>
                                                        )}
                                                    </div>
                                                    
                                                    {/* AI Insight */}
                                                    {task.status === 'blocked' && (
                                                        <div className={`p-3 rounded-lg flex items-start gap-2 border ${
                                                          isDarkMode 
                                                            ? 'bg-purple-500/5 border-purple-500/20' 
                                                            : 'bg-purple-50 border-purple-200'
                                                        }`}>
                                                            <Sparkles size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                              <p className={`text-[10px] font-bold mb-1 ${
                                                                isDarkMode ? 'text-purple-400' : 'text-purple-700'
                                                              }`}>
                                                                Revere Insight
                                                              </p>
                                                              <p className={`text-[10px] leading-relaxed ${
                                                                isDarkMode ? 'text-purple-300' : 'text-purple-600'
                                                              }`}>
                                                                Task is currently blocked. Consider reassigning or checking dependencies.
                                                              </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            </motion.div>
                                        </div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
            </div>

            {/* Premium Floating Legend */}
            <div className={`absolute bottom-6 right-6 p-4 rounded-xl backdrop-blur-xl border shadow-2xl ${
              isDarkMode 
                ? 'bg-black/60 border-white/10' 
                : 'bg-white/90 border-gray-200'
            }`}>
                <div className="flex items-center gap-4 text-xs font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-emerald-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-blue-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-red-500" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Blocked</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rotate-45 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm shadow-lg shadow-purple-500/50" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Milestone</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        }
      `}</style>
    </div>
  );
}