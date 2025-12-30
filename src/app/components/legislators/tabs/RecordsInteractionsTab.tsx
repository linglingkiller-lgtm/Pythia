import React from 'react';
import { Legislator, Interaction } from '../legislatorData';
import { Phone, Mail, Video, FileText, Edit, Plus, Filter } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface RecordsInteractionsTabProps {
  legislator: Legislator;
  onLogInteraction: () => void;
}

export function RecordsInteractionsTab({ legislator, onLogInteraction }: RecordsInteractionsTabProps) {
  const { isDarkMode } = useTheme();
  const [filterType, setFilterType] = React.useState<string>('all');

  const filteredInteractions = filterType === 'all' 
    ? legislator.interactions 
    : legislator.interactions.filter(i => i.type === filterType);

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onLogInteraction}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            Log Interaction
          </button>
          <button className={`flex items-center gap-2 px-4 py-2 border rounded transition-colors ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}>
            <FileText size={16} />
            Save Note
          </button>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${
              isDarkMode
                ? 'bg-slate-800 border-white/10 text-gray-300'
                : 'border-gray-300'
            }`}
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="note">Notes</option>
          </select>
        </div>
      </div>

      {/* Timeline Feed */}
      <div className="space-y-3">
        {filteredInteractions.length > 0 ? (
          filteredInteractions.map((interaction) => (
            <InteractionCard key={interaction.id} interaction={interaction} />
          ))
        ) : (
          <div className={`text-sm p-8 rounded text-center ${
            isDarkMode
              ? 'text-gray-400 bg-slate-800/40'
              : 'text-gray-500 bg-gray-50'
          }`}>
            No interactions recorded yet. Log your first interaction above.
          </div>
        )}
      </div>
    </div>
  );
}

interface InteractionCardProps {
  interaction: Interaction;
}

function InteractionCard({ interaction }: InteractionCardProps) {
  const { isDarkMode } = useTheme();
  
  const getTypeIcon = (type: string) => {
    const iconClass = isDarkMode ? 'text-blue-400' : 'text-blue-600';
    const grayIconClass = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const purpleIconClass = isDarkMode ? 'text-purple-400' : 'text-purple-600';
    const amberIconClass = isDarkMode ? 'text-amber-400' : 'text-amber-600';
    
    switch (type) {
      case 'call':
        return <Phone size={16} className={iconClass} />;
      case 'email':
        return <Mail size={16} className={grayIconClass} />;
      case 'meeting':
        return <Video size={16} className={purpleIconClass} />;
      case 'note':
        return <FileText size={16} className={amberIconClass} />;
      default:
        return <FileText size={16} className={grayIconClass} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'call':
        return 'Call';
      case 'email':
        return 'Email';
      case 'meeting':
        return 'Meeting';
      case 'note':
        return 'Note';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'call':
          return 'bg-blue-500/20 text-blue-300';
        case 'email':
          return 'bg-gray-500/20 text-gray-300';
        case 'meeting':
          return 'bg-purple-500/20 text-purple-300';
        case 'note':
          return 'bg-amber-500/20 text-amber-300';
        default:
          return 'bg-gray-500/20 text-gray-300';
      }
    }
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-700';
      case 'email':
        return 'bg-gray-100 text-gray-700';
      case 'meeting':
        return 'bg-purple-100 text-purple-700';
      case 'note':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`p-4 border rounded transition-colors ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10 hover:border-white/20'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon(interaction.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{interaction.title}</h4>
              <div className={`flex items-center gap-2 mt-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <span className={`px-2 py-0.5 rounded ${getTypeBadgeColor(interaction.type)}`}>
                  {getTypeLabel(interaction.type)}
                </span>
                <span>{interaction.date} at {interaction.time}</span>
                <span>•</span>
                <span>by {interaction.owner}</span>
              </div>
            </div>
            <button className={`p-1 rounded transition-colors ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}>
              <Edit size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>

          {/* Tags */}
          {(interaction.linkedBills || interaction.linkedIssues) && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {interaction.linkedBills?.map((bill, idx) => (
                <span key={idx} className={`text-xs px-2 py-0.5 rounded border ${
                  isDarkMode
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {bill}
                </span>
              ))}
              {interaction.linkedIssues?.map((issue, idx) => (
                <span key={idx} className={`text-xs px-2 py-0.5 rounded border ${
                  isDarkMode
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {issue}
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {interaction.notes && (
            <p className={`text-sm mt-2 p-2 rounded ${
              isDarkMode
                ? 'text-gray-300 bg-slate-700/50'
                : 'text-gray-700 bg-gray-50'
            }`}>
              {interaction.notes}
            </p>
          )}

          {/* Attachments */}
          {interaction.attachments && interaction.attachments.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <FileText size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {interaction.attachments.length} attachment{interaction.attachments.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}