import React from 'react';
import { Conversation, Message, Insight } from './chatTypes';
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
  CheckCircle2,
  Sparkles,
  Lightbulb,
  CheckSquare
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getOrgMembers } from './chatUtils';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

interface ContextPanelProps {
  conversation: Conversation | null;
  pinnedMessages: Message[];
  insights: Insight[];
  onJumpToMessage: (messageId: string) => void;
  onAddParticipants: () => void;
  onLinkToProject: () => void;
  onActOnInsight: (insight: Insight) => void;
  onClose: () => void;
}

export function ContextPanel({
  conversation,
  pinnedMessages,
  insights,
  onJumpToMessage,
  onActOnInsight,
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
    <div className="h-full flex flex-col">
      {/* Module Header */}
      <div className={`flex-shrink-0 px-4 py-3 border-b flex items-center justify-between ${
        isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
            <Users size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h3 className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            Details
            </h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors ${
             isDarkMode ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' : 'hover:bg-gray-200 text-gray-400 hover:text-gray-600'
          }`}
        >
          <X size={14} />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-6 custom-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        {/* Conversation Avatar & Info */}
        <div className="flex flex-col items-center text-center">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-3 shadow-lg
            ${conversation.type === 'system'
              ? 'bg-gradient-to-br from-red-500 to-blue-600 text-white'
              : isDarkMode
                ? 'bg-[#1e1e20] text-gray-300 border border-white/10'
                : 'bg-white text-gray-700 border border-gray-200'
            }
          `}>
            {conversation.type === 'system' ? (
              <img src={pythiaLogo} alt="Revere" className="w-8 h-8 object-contain brightness-0 invert" />
            ) : (
              conversation.title.charAt(0)
            )}
          </div>
          <h4 className={`text-base font-bold ${textColor} mb-1`}>
            {conversation.title}
          </h4>
          {conversation.subtitle && (
            <p className={`text-xs ${textMuted}`}>
              {conversation.subtitle}
            </p>
          )}
        </div>

        {/* Revere Insights Section */}
        {insights.length > 0 && (
          <div>
            <h5 className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mb-3 flex items-center gap-2`}>
              <Sparkles size={12} className="text-purple-500" />
              Revere Insights
            </h5>
            <div className="space-y-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id}
                  className={`
                    rounded-xl border p-3 shadow-sm transition-all hover:shadow-md hover:border-purple-500/30
                    ${isDarkMode ? 'bg-[#121214] border-purple-500/20' : 'bg-white border-purple-100'}
                  `}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {insight.type === 'task_recommendation' ? (
                      <CheckSquare size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Lightbulb size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h6 className={`text-xs font-bold ${textColor} leading-tight mb-1`}>
                        {insight.title}
                      </h6>
                      <p className={`text-[11px] ${textMuted} leading-relaxed`}>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                  
                  {insight.type === 'task_recommendation' && (
                    <button
                      onClick={() => onActOnInsight(insight)}
                      className={`
                        w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all
                        ${isDarkMode 
                          ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20' 
                          : 'bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100'
                        }
                      `}
                    >
                      <CheckSquare size={12} />
                      Create Task
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Overview Card - Only show for project conversations */}
        {conversation.type === 'project' && conversation.linked.projectId && (
          <div>
            <h5 className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mb-3`}>
              Project Overview
            </h5>
            <div className={`
              rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all
              ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-gray-200'}
            `}>
              {/* Status Bar */}
              <div className={`
                px-4 py-2 flex items-center justify-between border-b
                ${isDarkMode ? 'border-white/10 bg-[#0a0a0b]' : 'border-gray-200 bg-gray-50'}
              `}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${textColor}`}>
                    In Progress
                  </span>
                </div>
                <span className={`text-[10px] font-medium ${textMuted}`}>
                  65%
                </span>
              </div>

              {/* Key Metrics */}
              <div className="p-4 space-y-3">
                {/* Client */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-[#1e1e20]' : 'bg-gray-100'}
                  `}>
                    <Users size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider ${textMuted} mb-0.5`}>Client</p>
                    <p className={`text-xs font-bold ${textColor}`}>
                      Smith for Senate
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-[#1e1e20]' : 'bg-gray-100'}
                  `}>
                    <Calendar size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider ${textMuted} mb-0.5`}>Timeline</p>
                    <p className={`text-xs font-bold ${textColor}`}>
                      14 days remaining
                    </p>
                    <p className={`text-[10px] ${textMuted}`}>
                      Due Jan 5, 2025
                    </p>
                  </div>
                </div>

                {/* Budget */}
                <div className="flex items-start gap-3">
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${isDarkMode ? 'bg-[#1e1e20]' : 'bg-gray-100'}
                  `}>
                    <DollarSign size={14} className={textMuted} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] uppercase tracking-wider ${textMuted} mb-0.5`}>Budget</p>
                    <p className={`text-xs font-bold ${textColor}`}>
                      $34,500 / $45,000
                    </p>
                    <div className={`
                      w-full h-1 rounded-full mt-2
                      ${isDarkMode ? 'bg-[#1e1e20]' : 'bg-gray-200'}
                    `}>
                      <div 
                        className="h-full rounded-full bg-blue-500"
                        style={{ width: '77%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts Section */}
              <div className={`
                px-4 py-3 border-t
                ${isDarkMode ? 'border-white/10 bg-yellow-500/10' : 'border-gray-200 bg-yellow-50'}
              `}>
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className={`text-xs font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'} mb-1`}>
                      Behind Schedule
                    </p>
                    <p className={`text-[10px] ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                      Door pace is 18% below target.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-3 bg-transparent">
                <button
                  className={`
                    w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-colors
                    ${isDarkMode ? 'bg-transparent border-white/10 text-gray-300 hover:bg-white/5' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}
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
          <h5 className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mb-3`}>
            {participants.length} {participants.length === 1 ? 'Participant' : 'Participants'}
          </h5>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div key={participant.userId} className="flex items-center gap-3 group cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${isDarkMode ? 'bg-[#1e1e20] text-gray-300' : 'bg-gray-100 text-gray-700'}
                `}>
                  {participant.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${textColor}`}>
                    {participant.name}
                  </p>
                  {participant.role && (
                    <p className={`text-[10px] ${textMuted}`}>
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
            <h5 className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} mb-3`}>
              Pinned Messages
            </h5>
            <div className="space-y-2">
              {pinnedMessages.map((message) => (
                <button
                  key={message.messageId}
                  onClick={() => onJumpToMessage(message.messageId)}
                  className={`
                    w-full text-left p-3 rounded-xl transition-all border
                    ${isDarkMode ? 'bg-[#121214] border-white/5 hover:border-white/20' : 'bg-white border-gray-200 hover:border-blue-300'}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <Pin size={12} className="text-yellow-500 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${textColor} mb-1`}>
                        {message.senderName}
                      </p>
                      <p className={`text-[10px] ${textMuted} line-clamp-2`}>
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