import React, { useState } from 'react';
import {
  ExternalLink,
  CheckSquare,
  Calendar,
  FileText,
  Link as LinkIcon,
  BarChart3,
  CheckCircle2,
  Sparkles,
  Download,
  UserCheck,
  X as XIcon,
  Check,
  Clock,
  Paperclip,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageAttachment } from './chatTypes';
import { FormattedMessage } from './chatMarkdown';

interface AttachmentCardProps {
  attachment: MessageAttachment;
  isCurrentUser: boolean;
}

export function AttachmentCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  switch (attachment.type) {
    case 'file':
      return <FileCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'task':
      return <TaskCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'calendar_invite':
      return <CalendarCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'record':
      return <RecordCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'link':
      return <LinkCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'poll':
      return <PollCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'approval':
      return <ApprovalCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    case 'pythia_brief':
      return <PythiaBriefCard attachment={attachment} isCurrentUser={isCurrentUser} />;
    default:
      return null;
  }
}

function FileCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { fileType, description } = attachment.preview;
  const { url } = attachment.payload;

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}
          `}>
            <Paperclip size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <div className="flex items-center gap-2">
              <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
              `}>
                {fileType}
              </span>
            </div>
            {description && (
              <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex gap-2`}>
        <button className={`
          flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}
          transition-all duration-200 hover:scale-105 hover:shadow-lg
        `}>
          <ExternalLink size={12} />
          Open File
        </button>
        <button className={`
          flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
          transition-all duration-200 hover:scale-105
        `}>
          <Download size={12} />
        </button>
      </div>
    </div>
  );
}

function TaskCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { status, priority, dueDate, assigneeName } = attachment.preview;
  const [taskStatus, setTaskStatus] = useState(status);

  const statusColors: Record<string, string> = {
    todo: isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700',
    in_progress: isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700',
    blocked: isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700',
    done: isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700',
  };

  const priorityColors: Record<string, string> = {
    low: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    medium: isDarkMode ? 'text-yellow-400' : 'text-yellow-600',
    high: isDarkMode ? 'text-red-400' : 'text-red-600',
  };

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}
          `}>
            <CheckSquare size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[taskStatus]}`}>
                {taskStatus.replace('_', ' ')}
              </span>
              <span className={`text-xs font-medium ${priorityColors[priority]}`}>
                {priority} priority
              </span>
            </div>
            {assigneeName && (
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Assigned to {assigneeName}
              </p>
            )}
            {dueDate && (
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Due {dueDate}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex gap-2`}>
        <button
          onClick={() => setTaskStatus(taskStatus === 'done' ? 'todo' : 'done')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
            ${taskStatus === 'done'
              ? isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              : isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'
            }
            transition-colors
          `}
        >
          <Check size={12} />
          {taskStatus === 'done' ? 'Reopen' : 'Mark Done'}
        </button>
        <button className={`
          flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
          transition-colors
        `}>
          <ExternalLink size={12} />
          Open
        </button>
      </div>
    </div>
  );
}

function CalendarCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { date, startTime, endTime, location, attendeeNames } = attachment.preview;

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}
          `}>
            <Calendar size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <div className="space-y-1">
              <p className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <Clock size={12} />
                {date} • {startTime} - {endTime}
              </p>
              {location && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  📍 {location}
                </p>
              )}
              {attendeeNames && attendeeNames.length > 0 && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {attendeeNames.length} attendee{attendeeNames.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex gap-2`}>
        <button className={`
          flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-500 text-white hover:bg-purple-600'}
          transition-colors
        `}>
          <Check size={12} />
          Add to Calendar
        </button>
        <button className={`
          flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
          transition-colors
        `}>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}

function RecordCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { recordType, tags } = attachment.preview;

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}
          `}>
            <FileText size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={`
                px-2 py-0.5 rounded text-xs font-medium
                ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
              `}>
                {recordType?.replace('_', ' ')}
              </span>
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className={`
                      px-1.5 py-0.5 rounded text-[10px] font-medium
                      ${isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'}
                    `}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <button className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}
          transition-colors
        `}>
          <ExternalLink size={12} />
          Open Record
        </button>
      </div>
    </div>
  );
}

function LinkCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const url = attachment.payload?.url || '';

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'}
          `}>
            <LinkIcon size={20} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-1 truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {attachment.subtitle}
            </p>
          </div>
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <button
          onClick={() => url && window.open(url, '_blank')}
          className={`
            w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
            ${isDarkMode ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-cyan-500 text-white hover:bg-cyan-600'}
            transition-colors
          `}
        >
          <ExternalLink size={12} />
          Open Link
        </button>
      </div>
    </div>
  );
}

function PollCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { options, allowMultiple } = attachment.preview;
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<string[]>([]);

  const totalVotes = Object.values(votes).reduce((sum, v) => sum + v, 0);

  const handleVote = (option: string) => {
    if (allowMultiple) {
      if (userVotes.includes(option)) {
        setUserVotes(userVotes.filter(v => v !== option));
        setVotes({ ...votes, [option]: (votes[option] || 0) - 1 });
      } else {
        setUserVotes([...userVotes, option]);
        setVotes({ ...votes, [option]: (votes[option] || 0) + 1 });
      }
    } else {
      if (userVotes.includes(option)) return;
      const newVotes = { ...votes };
      userVotes.forEach(v => {
        newVotes[v] = Math.max(0, (newVotes[v] || 0) - 1);
      });
      newVotes[option] = (newVotes[option] || 0) + 1;
      setVotes(newVotes);
      setUserVotes([option]);
    }
  };

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'}
          `}>
            <BarChart3 size={20} className={isDarkMode ? 'text-orange-400' : 'text-orange-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} • {allowMultiple ? 'Multiple choice' : 'Single choice'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {options.map((option: string, i: number) => {
            const voteCount = votes[option] || 0;
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
            const hasVoted = userVotes.includes(option);

            return (
              <button
                key={i}
                onClick={() => handleVote(option)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all relative overflow-hidden
                  ${hasVoted
                    ? isDarkMode ? 'border-orange-500/50 bg-orange-900/20' : 'border-orange-300 bg-orange-50'
                    : isDarkMode ? 'border-white/10 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                <div
                  className={`absolute inset-0 ${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-100'} transition-all`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex items-center justify-between">
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {option}
                  </span>
                  <span className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {voteCount} ({Math.round(percentage)}%)
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { approverName, deadline } = attachment.preview;
  const [status, setStatus] = useState(attachment.preview.status);

  const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: {
      bg: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
      text: isDarkMode ? 'text-yellow-400' : 'text-yellow-700',
      icon: <Clock size={14} />,
    },
    approved: {
      bg: isDarkMode ? 'bg-green-900/30' : 'bg-green-100',
      text: isDarkMode ? 'text-green-400' : 'text-green-700',
      icon: <Check size={14} />,
    },
    rejected: {
      bg: isDarkMode ? 'bg-red-900/30' : 'bg-red-100',
      text: isDarkMode ? 'text-red-400' : 'text-red-700',
      icon: <XIcon size={14} />,
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`
      max-w-sm rounded-2xl border overflow-hidden
      ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}
          `}>
            <CheckCircle2 size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${config.bg} ${config.text}`}>
                {config.icon}
                {status}
              </span>
            </div>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Approver: {approverName}
            </p>
            {deadline && (
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Deadline: {deadline}
              </p>
            )}
          </div>
        </div>
      </div>
      {status === 'pending' && (
        <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'} flex gap-2`}>
          <button
            onClick={() => setStatus('approved')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
              ${isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-500 text-white hover:bg-green-600'}
              transition-colors
            `}
          >
            <Check size={12} />
            Approve
          </button>
          <button
            onClick={() => setStatus('rejected')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
              ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}
              transition-colors
            `}
          >
            <XIcon size={12} />
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function PythiaBriefCard({ attachment, isCurrentUser }: AttachmentCardProps) {
  const { isDarkMode } = useTheme();
  const { content } = attachment.payload;

  return (
    <div className={`
      max-w-md rounded-2xl border overflow-hidden
      ${isDarkMode
        ? 'bg-gradient-to-br from-red-900/30 to-blue-900/30 border-red-500/20'
        : 'bg-gradient-to-br from-red-50 to-blue-50 border-red-200'
      }
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={12} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
              <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                Revere Brief
              </span>
            </div>
            <h4 className={`font-semibold text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {attachment.title}
            </h4>
          </div>
        </div>
        <div className={`
          p-3 rounded-xl mb-3
          ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}
        `}>
          <FormattedMessage
            text={content}
            className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          />
        </div>
      </div>
      <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
        <button className={`
          w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg
          ${isDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-500 text-white hover:bg-red-600'}
          transition-colors
        `}>
          <ExternalLink size={12} />
          Open Full Brief
        </button>
      </div>
    </div>
  );
}