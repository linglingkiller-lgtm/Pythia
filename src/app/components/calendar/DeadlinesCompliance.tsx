import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { AlertCircle, Calendar, FileText, CheckSquare, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function DeadlinesCompliance() {
  const { isDarkMode } = useTheme();
  const deadlines = [
    {
      id: '1',
      title: 'Arizona Lobbyist Registration Renewal',
      type: 'compliance',
      dueDate: 'Dec 31, 2024',
      daysUntil: 13,
      urgency: 'high',
      description: 'Annual registration renewal required by year-end',
      action: 'Open Compliance',
    },
    {
      id: '2',
      title: 'Q4 Lobbying Activity Report',
      type: 'compliance',
      dueDate: 'Jan 15, 2025',
      daysUntil: 28,
      urgency: 'medium',
      description: 'Quarterly expenditure and activity disclosure',
      action: 'Start Report',
    },
    {
      id: '3',
      title: 'HB90 Testimony Submission',
      type: 'legislative',
      dueDate: 'Dec 19, 2024',
      daysUntil: 1,
      urgency: 'high',
      description: 'Written testimony deadline for floor vote',
      action: 'Submit',
    },
    {
      id: '4',
      title: 'Amendment Proposal Cutoff',
      type: 'legislative',
      dueDate: 'Dec 21, 2024',
      daysUntil: 3,
      urgency: 'medium',
      description: 'Last day to submit amendments for HB90',
      action: 'Create Task',
    },
    {
      id: '5',
      title: 'Brief Finalization',
      type: 'internal',
      dueDate: 'Dec 19, 2024',
      daysUntil: 1,
      urgency: 'high',
      description: 'Brief must be ready 24h before HB90 hearing',
      action: 'Review',
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'compliance':
        return <CheckSquare size={16} className="text-red-600" />;
      case 'legislative':
        return <FileText size={16} className="text-blue-600" />;
      case 'internal':
        return <Calendar size={16} className="text-purple-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getDaysUntilText = (days: number) => {
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return `${days} days`;
  };

  return (
    <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`flex items-center gap-2 font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <AlertCircle size={18} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
          Deadlines & Compliance
        </h3>
        <Chip variant="error" size="sm">
          {deadlines.filter((d) => d.urgency === 'high').length} urgent
        </Chip>
      </div>

      <div className="space-y-3">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className={`p-3 rounded-lg border ${
              deadline.urgency === 'high'
                ? isDarkMode
                  ? 'bg-red-500/20 border-red-500/30'
                  : 'bg-red-50 border-red-200'
                : deadline.urgency === 'medium'
                ? isDarkMode
                  ? 'bg-amber-500/20 border-amber-500/30'
                  : 'bg-amber-50 border-amber-200'
                : isDarkMode
                ? 'bg-slate-700/30 border-white/10'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {getTypeIcon(deadline.type)}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{deadline.title}</h4>
                <p className={`text-xs mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{deadline.description}</p>
                <div className="flex items-center gap-2">
                  <Chip variant={getUrgencyColor(deadline.urgency) as any} size="sm">
                    {getDaysUntilText(deadline.daysUntil)}
                  </Chip>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>Due {deadline.dueDate}</span>
                </div>
              </div>
            </div>
            <Button
              variant={deadline.urgency === 'high' ? 'error' : 'secondary'}
              size="sm"
              className="w-full"
            >
              {deadline.action}
            </Button>
          </div>
        ))}
      </div>

      <div className={`mt-4 pt-4 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <Button variant="link" size="sm" className="w-full">
          View All Deadlines
          <ExternalLink size={14} />
        </Button>
      </div>
    </div>
  );
}