import React from 'react';
import { type Workstream } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Plus, CheckCircle, Circle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WorkstreamsBoardProps {
  workstreams: Workstream[];
}

export function WorkstreamsBoard({ workstreams }: WorkstreamsBoardProps) {
  const { isDarkMode } = useTheme();
  
  const getStatusColor = (status: string) => {
    if (isDarkMode) {
      switch (status) {
        case 'complete': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'review': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'not-started': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    } else {
      switch (status) {
        case 'complete': return 'bg-green-100 text-green-800 border-green-200';
        case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return CheckCircle;
      case 'in-progress': return Clock;
      case 'review': return AlertTriangle;
      case 'not-started': return Circle;
      default: return Circle;
    }
  };

  // Check if any workstream is overdue or has upcoming deadline
  const aiSuggestions = workstreams.filter(ws => {
    if (!ws.dueDate) return false;
    const dueDate = new Date(ws.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3 && ws.status !== 'complete';
  });

  return (
    <div className="space-y-6">
      {/* Revere AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className={`p-4 rounded-lg backdrop-blur-xl border ${
          isDarkMode
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
            <h4 className={`font-semibold text-sm ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
            }`}>Revere Workload Insights</h4>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map(ws => (
              <div key={ws.id} className={`text-sm ${
                isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
              }`}>
                <span className="font-medium">{ws.name}</span> is due in{' '}
                {Math.ceil((new Date(ws.dueDate!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                {' • '}
                Consider prioritizing {ws.taskCount - ws.completedTaskCount} remaining tasks
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workstreams */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Active Workstreams</h3>
          <Button variant="secondary" size="sm">
            <Plus size={14} />
            New Workstream
          </Button>
        </div>

        <div className="space-y-3">
          {workstreams.map((workstream) => {
            const StatusIcon = getStatusIcon(workstream.status);
            const daysUntilDue = workstream.dueDate 
              ? Math.ceil((new Date(workstream.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div key={workstream.id} className={`p-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusIcon size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      <h4 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{workstream.name}</h4>
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Owner: {workstream.ownerName}
                    </div>
                  </div>
                  <Chip
                    variant={workstream.status === 'complete' ? 'success' : 'neutral'}
                    size="sm"
                  >
                    {workstream.status.replace('-', ' ')}
                  </Chip>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className={`flex items-center justify-between text-xs mb-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>Progress: {workstream.completedTaskCount} of {workstream.taskCount} tasks</span>
                    <span>{workstream.progress}%</span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-2 rounded-full ${
                        workstream.progress === 100 
                          ? (isDarkMode ? 'bg-green-500' : 'bg-green-600')
                          : (isDarkMode ? 'bg-emerald-500' : 'bg-blue-600')
                      }`}
                      style={{ width: `${workstream.progress}%` }}
                    />
                  </div>
                </div>

                {/* Due Date */}
                {workstream.dueDate && (
                  <div className={`text-xs ${
                    daysUntilDue && daysUntilDue <= 3 
                      ? (isDarkMode ? 'text-red-400 font-semibold' : 'text-red-600 font-semibold')
                      : daysUntilDue && daysUntilDue <= 7 
                      ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600')
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-600')
                  }`}>
                    Due: {new Date(workstream.dueDate).toLocaleDateString()}
                    {daysUntilDue !== null && daysUntilDue > 0 && ` (${daysUntilDue} days)`}
                    {daysUntilDue !== null && daysUntilDue === 0 && ' (Today!)'}
                    {daysUntilDue !== null && daysUntilDue < 0 && ` (${Math.abs(daysUntilDue)} days overdue)`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}