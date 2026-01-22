import React from 'react';
import { 
  AlertCircle, 
  Calendar, 
  ChevronRight,
  UserPlus,
  RefreshCw,
  Send,
  Clock
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { type ManagerAction } from '../../data/teamData';
import { useTheme } from '../../contexts/ThemeContext';

interface ManagerActionCenterProps {
  actions: ManagerAction[];
  onActionClick: (action: ManagerAction) => void;
}

export function ManagerActionCenter({ actions, onActionClick }: ManagerActionCenterProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'suggested' | 'overdue' | 'upcoming'>('suggested');

  const suggestedActions = actions.filter(a => a.priority <= 3);
  const overdueActions = actions.filter(a => a.type === 'follow-up');
  const upcomingActions = actions.filter(a => a.type === 'deadline');

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'reassign': return <RefreshCw size={16} className="text-blue-600" />;
      case 'add-collaborator': return <UserPlus size={16} className="text-green-600" />;
      case 'follow-up': return <Send size={16} className="text-orange-600" />;
      case 'deadline': return <Clock size={16} className="text-purple-600" />;
      case 'review': return <AlertCircle size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const renderActionCard = (action: ManagerAction) => (
    <div
      key={action.id}
      className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
        isDarkMode ? 'bg-slate-700/50 border-white/10' : 'bg-white border-gray-200'
      }`}
      onClick={() => onActionClick(action)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-600/50' : 'bg-gray-50'}`}>
          {getActionIcon(action.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {action.title}
          </h4>
          <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {action.description}
          </p>
        </div>
      </div>

      {/* Employee & Due Date */}
      {action.userName && (
        <div className="flex items-center gap-2 mb-3">
          <Chip variant="neutral" size="sm" className="text-xs">
            {action.userName}
          </Chip>
          {action.dueDate && (
            <Chip variant="warning" size="sm" className="text-xs">
              Due {new Date(action.dueDate).toLocaleDateString()}
            </Chip>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {action.quickActions.slice(0, 2).map((qa, idx) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Quick action:', qa.action);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              isDarkMode
                ? 'text-blue-400 bg-blue-500/20 hover:bg-blue-500/30'
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {qa.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className={`flex-shrink-0 px-4 py-3 border-b ${
        isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <h2 className={`text-xs font-bold uppercase tracking-wider ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Manager Actions
        </h2>
      </div>

      {/* Tabs */}
      <div className={`border-b flex ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('suggested')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'suggested'
              ? isDarkMode
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-blue-600 text-blue-600 bg-blue-50'
              : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Suggested
          {suggestedActions.length > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              isDarkMode
                ? 'bg-blue-500/20 text-blue-300'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {suggestedActions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('overdue')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'overdue'
              ? isDarkMode
                ? 'border-red-500 text-red-400 bg-red-500/10'
                : 'border-red-600 text-red-600 bg-red-50'
              : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Overdue
          {overdueActions.length > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              isDarkMode
                ? 'bg-red-500/20 text-red-300'
                : 'bg-red-100 text-red-700'
            }`}>
              {overdueActions.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'upcoming'
              ? isDarkMode
                ? 'border-purple-500 text-purple-400 bg-purple-500/10'
                : 'border-purple-600 text-purple-600 bg-purple-50'
              : isDarkMode
              ? 'border-transparent text-gray-400 hover:text-gray-300 hover:bg-slate-700/50'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          Upcoming
          {upcomingActions.length > 0 && (
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              isDarkMode
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {upcomingActions.length}
            </span>
          )}
        </button>
      </div>

      {/* Action List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'suggested' && (
          <>
            {suggestedActions.length === 0 ? (
              <div className={`text-center py-12 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <AlertCircle size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p>No suggested actions</p>
                <p className="text-xs mt-1">Everything looks good!</p>
              </div>
            ) : (
              suggestedActions.map(renderActionCard)
            )}
          </>
        )}

        {activeTab === 'overdue' && (
          <>
            {overdueActions.length === 0 ? (
              <div className={`text-center py-12 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p>No overdue items</p>
                <p className="text-xs mt-1">Team is on track!</p>
              </div>
            ) : (
              overdueActions.map(renderActionCard)
            )}
          </>
        )}

        {activeTab === 'upcoming' && (
          <>
            {upcomingActions.length === 0 ? (
              <div className={`text-center py-12 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Calendar size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p>No upcoming deadlines</p>
                <p className="text-xs mt-1">Next 7 days are clear</p>
              </div>
            ) : (
              upcomingActions.map(renderActionCard)
            )}
          </>
        )}
      </div>

      {/* Footer - Quick Stats */}
      <div className={`border-t p-4 ${
        isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {suggestedActions.length}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Suggested
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {overdueActions.length}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overdue
            </div>
          </div>
          <div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {upcomingActions.length}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Upcoming
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}