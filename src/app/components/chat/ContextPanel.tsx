import React from 'react';
import { Conversation, Message } from './chatTypes';
import { 
  Users, 
  Pin, 
  FolderOpen, 
  ExternalLink, 
  X, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getOrgMembers } from './chatUtils';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

interface ContextPanelProps {
  conversation: Conversation | null;
  pinnedMessages: Message[];
  onJumpToMessage: (messageId: string) => void;
  onAddParticipants: () => void;
  onLinkToProject: () => void;
  onClose: () => void;
}

export function ContextPanel({
  conversation,
  pinnedMessages,
  onJumpToMessage,
  onClose,
}: ContextPanelProps) {
  const { isDarkMode } = useTheme();

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  if (!conversation) {
    return null;
  }

  const orgMembers = getOrgMembers();
  const participants = conversation.participants
    .map(pid => orgMembers.find(m => m.userId === pid) || { userId: pid, name: 'Unknown', role: '' })
    .filter(Boolean);

  return (
    <div className={`
      w-80 flex flex-col h-full
      ${isDarkMode ? 'bg-slate-900 border-l border-white/5' : 'bg-white border-l border-gray-100'}
    `}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h3 className={`text-lg font-semibold ${textColor}`}>
          Details
        </h3>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-full ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'}`}
        >
          <X size={18} className={textMuted} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Conversation Avatar & Info */}
        <div className="flex flex-col items-center text-center py-4">
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-3
            ${conversation.type === 'system'
              ? 'bg-gradient-to-br from-red-500 to-blue-500'
              : isDarkMode
                ? 'bg-slate-800 text-white'
                : 'bg-gray-200 text-gray-700'
            }
          `}>
            {conversation.type === 'system' ? (
              <img src={pythiaLogo} alt="Revere" className="w-12 h-12 object-contain brightness-0 invert" />
            ) : (
              conversation.title.charAt(0)
            )}
          </div>
          <h4 className={`text-lg font-semibold ${textColor} mb-1`}>
            {conversation.title}
          </h4>
          {conversation.subtitle && (
            <p className={`text-sm ${textMuted}`}>
              {conversation.subtitle}
            </p>
          )}
        </div>

        {/* Project Overview Card - Only show for project conversations */}
        {conversation.type === 'project' && conversation.linked.projectId && (
          <div>
            <h5 className={`text-xs font-semibold uppercase tracking-wide ${textMuted} mb-3`}>
              Project Overview
            </h5>
            <div className={`
              rounded-xl border overflow-hidden
              ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-gray-50 border-gray-200'}
            `}>
              {/* Status Bar */}
              <div className={`
                px-4 py-2.5 flex items-center justify-between border-b
                ${isDarkMode ? 'border-white/10 bg-slate-800/50' : 'border-gray-200 bg-white/50'}
              `}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span className={`text-xs font-semibold ${textColor}`}>
                    In Progress
                  </span>
                </div>
                <span className={`text-xs ${textMuted}`}>
                  65% Complete
                </span>
              </div>

              {/* Key Metrics */}
              <div className="p-4 space-y-3">
                {/* Client */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-slate-700' : 'bg-white'}
                  `}>
                    <Users size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${textMuted} mb-0.5`}>Client</p>
                    <p className={`text-sm font-semibold ${textColor}`}>
                      Smith for Senate
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-slate-700' : 'bg-white'}
                  `}>
                    <Calendar size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${textMuted} mb-0.5`}>Timeline</p>
                    <p className={`text-sm font-semibold ${textColor}`}>
                      14 days remaining
                    </p>
                    <p className={`text-xs ${textMuted}`}>
                      Due Jan 5, 2025
                    </p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-slate-700' : 'bg-white'}
                  `}>
                    <DollarSign size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${textMuted} mb-0.5`}>Budget</p>
                    <p className={`text-sm font-semibold ${textColor}`}>
                      $34,500 / $45,000
                    </p>
                    <div className={`
                      w-full h-1.5 rounded-full mt-1.5
                      ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: '77%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Goal/Target */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-slate-700' : 'bg-white'}
                  `}>
                    <Target size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${textMuted} mb-0.5`}>Door Knocking Goal</p>
                    <p className={`text-sm font-semibold ${textColor}`}>
                      2,847 / 15,000 doors
                    </p>
                    <div className={`
                      w-full h-1.5 rounded-full mt-1.5
                      ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-500"
                        style={{ width: '19%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className={`
                px-4 py-3 border-t
                ${isDarkMode ? 'border-white/10 bg-yellow-900/20' : 'border-gray-200 bg-yellow-50'}
              `}>
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'} mb-1`}>
                      Behind Schedule
                    </p>
                    <p className={`text-xs ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                      Door pace is 18% below target. Consider adding resources.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3">
                <button
                  className={`
                    w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
                    ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-200'}
                    transition-colors
                  `}
                >
                  <ExternalLink size={12} />
                  View Full Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Participants */}
        <div>
          <h5 className={`text-xs font-semibold uppercase tracking-wide ${textMuted} mb-3`}>
            {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'}
          </h5>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.userId} className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-700'}
                `}>
                  {participant.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${textColor}`}>
                    {participant.name}
                  </p>
                  {participant.role && (
                    <p className={`text-xs ${textMuted}`}>
                      {participant.role}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pinned Messages */}
        {pinnedMessages.length > 0 && (
          <div>
            <h5 className={`text-xs font-semibold uppercase tracking-wide ${textMuted} mb-3`}>
              Pinned Messages
            </h5>
            <div className="space-y-2">
              {pinnedMessages.map((message) => (
                <button
                  key={message.messageId}
                  onClick={() => onJumpToMessage(message.messageId)}
                  className={`
                    w-full text-left p-3 rounded-xl transition-colors
                    ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-50 hover:bg-gray-100'}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <Pin size={12} className="text-yellow-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${textColor} mb-1`}>
                        {message.senderName}
                      </p>
                      <p className={`text-xs ${textMuted} line-clamp-2`}>
                        {message.text}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}