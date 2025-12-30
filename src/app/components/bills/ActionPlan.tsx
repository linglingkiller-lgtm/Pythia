import React from 'react';
import { Target, CheckCircle, Clock, AlertCircle, Plus, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { useTheme } from '../../contexts/ThemeContext';

interface ActionPlanProps {
  billId: string;
}

export function ActionPlan({ billId }: ActionPlanProps) {
  const { isDarkMode } = useTheme();
  
  const recommendedTasks = [
    {
      id: 1,
      title: 'Schedule meeting with Committee Chair',
      priority: 'high',
      dueDate: '2024-12-19',
      rationale: 'Hearing scheduled in 2 days',
    },
    {
      id: 2,
      title: 'Prepare amendment language for cost recovery',
      priority: 'high',
      dueDate: '2024-12-20',
      rationale: 'Risk flag identified in Revere review',
    },
    {
      id: 3,
      title: 'Draft coalition support letter',
      priority: 'medium',
      dueDate: '2024-12-23',
      rationale: 'Build broader stakeholder support',
    },
    {
      id: 4,
      title: 'Research similar bills in other states',
      priority: 'low',
      dueDate: '2024-12-27',
      rationale: 'Strengthen talking points with precedent',
    },
  ];

  const recentInteractions = [
    { date: '2024-12-15', type: 'meeting', description: 'Met with Committee Chair staff', linkedTo: 'Rep. Sarah Martinez' },
    { date: '2024-12-14', type: 'email', description: 'Sent analysis to client', linkedTo: 'Arizona Energy Corp' },
    { date: '2024-12-12', type: 'call', description: 'Discussed amendments with sponsor', linkedTo: 'Rep. Sarah Martinez' },
  ];

  const taskTemplates = [
    'Committee Hearing Prep',
    'Sponsor Outreach',
    'Amendment Negotiation',
    'Coalition Letter',
    'Opposition Research',
    'Client Briefing',
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'amber';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <CheckCircle size={14} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />;
      case 'email':
        return <FileText size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />;
      case 'call':
        return <Clock size={14} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />;
      default:
        return <AlertCircle size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  return (
    <div className={`p-5 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Action Plan</h3>
      </div>

      {/* Recommended Tasks */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Recommended Tasks</h4>
          <Button variant="secondary" size="sm">
            <Plus size={14} />
            Custom
          </Button>
        </div>

        <div className="space-y-2">
          {recommendedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 border rounded-lg transition-all cursor-pointer group ${
                isDarkMode
                  ? 'border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
              }`}
            >
              <div className="flex items-start gap-2 mb-1">
                <input
                  type="checkbox"
                  className={`mt-0.5 w-4 h-4 border rounded focus:ring-purple-500 ${
                    isDarkMode
                      ? 'text-purple-500 bg-slate-700 border-gray-500'
                      : 'text-purple-600 border-gray-300'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{task.title}</div>
                  <div className={`text-xs mt-0.5 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{task.rationale}</div>
                </div>
                <Chip variant={getPriorityColor(task.priority) as any} size="sm">
                  {task.priority}
                </Chip>
              </div>
              <div className={`text-xs ml-6 flex items-center gap-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Clock size={12} />
                Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Templates */}
      <div className={`mb-5 pb-5 border-b ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Task Templates:</h4>
        <div className="flex flex-wrap gap-2">
          {taskTemplates.map((template, index) => (
            <button
              key={index}
              className={`px-2.5 py-1 text-xs font-medium border rounded transition-colors ${
                isDarkMode
                  ? 'bg-slate-700 border-white/10 text-gray-300 hover:bg-slate-600 hover:border-purple-500/30'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-purple-300'
              }`}
              onClick={() => console.log('Apply template:', template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Interactions */}
      <div>
        <h4 className={`text-sm font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Recent Activity:</h4>
        <div className="space-y-2">
          {recentInteractions.map((interaction, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 p-2 border rounded text-sm ${
                isDarkMode
                  ? 'border-white/10 bg-slate-700/30'
                  : 'border-gray-200'
              }`}
            >
              {getInteractionIcon(interaction.type)}
              <div className="flex-1">
                <div className={isDarkMode ? 'text-gray-300' : 'text-gray-900'}>{interaction.description}</div>
                <div className={`text-xs mt-0.5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date(interaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {interaction.linkedTo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing Fields Warning (compliance) */}
      <div className={`mt-5 p-3 border rounded-lg ${
        isDarkMode
          ? 'bg-amber-500/10 border-amber-500/30'
          : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-700'} />
          <div>
            <div className={`text-xs font-semibold mb-1 ${
              isDarkMode ? 'text-amber-300' : 'text-amber-900'
            }`}>Compliance Note:</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-amber-200' : 'text-amber-900'
            }`}>
              Last interaction logged 3 days ago. Consider logging recent activity for compliance tracking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}