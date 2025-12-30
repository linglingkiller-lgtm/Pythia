import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, User, AlignLeft, Flag, Briefcase } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTaskMutations } from '../../hooks/useTaskMutations';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { listProjects, ApiContext } from '../../lib/api';
import { mockProjects } from '../../data/workHubData';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Project {
  id: string;
  title: string;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const { isDarkMode } = useTheme();
  const { createTask, creating } = useTaskMutations();
  const { user, activeOrgId } = useSupabaseAuth();
  const { appMode } = useAppMode();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      status: 'todo',
      assigneeId: user?.id || '',
      projectId: ''
    }
  });

  // Load projects on mount
  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      setLoadingProjects(true);
      
      if (appMode === 'demo') {
        const mapped = mockProjects.map(p => ({ id: p.id, title: p.title }));
        setProjects(mapped);
        setLoadingProjects(false);
        return;
      }

      // Prod mode
      if (activeOrgId) {
        try {
          const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
          const { data, error } = await listProjects(ctx);
          if (data && !error) {
            const mapped = data.map((p: any) => ({ id: p.id, title: p.title || p.name }));
            setProjects(mapped);
            
            // Auto-select "Inbox" if available and nothing selected
            const inbox = mapped.find(p => p.title === 'Inbox');
            if (inbox) {
                setValue('projectId', inbox.id);
            }
            
          } else {
            console.error('Failed to load projects:', error);
          }
        } catch (err) {
          console.error('Exception loading projects:', err);
        }
      }
      setLoadingProjects(false);
    };

    fetchProjects();
  }, [isOpen, appMode, activeOrgId, setValue]);

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      assigneeId: data.assigneeId || user?.id,
    };

    const result = await createTask(payload);
    if (result.success) {
      reset();
      onSuccess();
      onClose();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={`w-full max-w-lg rounded-xl shadow-2xl overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isDarkMode ? 'border-slate-800' : 'border-gray-100'
        }`}>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New Task
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full hover:bg-opacity-10 ${
              isDarkMode ? 'hover:bg-white text-slate-400' : 'hover:bg-black text-gray-500'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className={`text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              Task Title
            </label>
            <input
              {...register('title', { required: 'Title is required' })}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="e.g., Draft amendment for HB 2847"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message as string}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <AlignLeft size={14} /> Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
              placeholder="Add details..."
            />
          </div>

          {/* Project Selection */}
          <div className="space-y-1.5">
             <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
              isDarkMode ? 'text-slate-400' : 'text-gray-500'
            }`}>
              <Briefcase size={14} /> Project {appMode === 'prod' && <span className="text-red-500">*</span>}
            </label>
            <select
              {...register('projectId', { 
                  required: appMode === 'prod' ? 'Project is required' : false 
              })}
              disabled={loadingProjects}
              className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white disabled:opacity-50' 
                  : 'bg-white border-gray-300 text-gray-900 disabled:opacity-50'
              }`}
            >
              <option value="">Select a project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
             {errors.projectId && <p className="text-red-500 text-xs">{errors.projectId.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <Calendar size={14} /> Due Date
              </label>
              <input
                type="date"
                {...register('dueDate')}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <Flag size={14} /> Priority
              </label>
              <select
                {...register('priority')}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className={`text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Status
              </label>
              <select
                {...register('status')}
                className={`w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
              </select>
            </div>

             {/* Assignee - Hidden/Fixed for now or simple select */}
             <div className="space-y-1.5 opacity-60 pointer-events-none">
              <label className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                <User size={14} /> Assignee
              </label>
              <div className={`px-3 py-2 rounded-lg border ${
                 isDarkMode ? 'bg-slate-800 border-slate-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'
              }`}>
                Me ({user?.email || 'Demo User'})
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isDarkMode 
                  ? 'text-slate-300 hover:bg-slate-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2 rounded-lg text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? 'Creating...' : 'Create Task'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
