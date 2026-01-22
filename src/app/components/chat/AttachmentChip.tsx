import React from 'react';
import {
  X,
  Paperclip,
  CheckSquare,
  Calendar,
  FileText,
  Link as LinkIcon,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { MessageAttachment } from './chatTypes';

interface AttachmentChipProps {
  attachment: MessageAttachment;
  onRemove: (id: string) => void;
}

const ATTACHMENT_ICONS: Record<string, React.ReactNode> = {
  file: <Paperclip size={14} />,
  task: <CheckSquare size={14} />,
  calendar_invite: <Calendar size={14} />,
  record: <FileText size={14} />,
  link: <LinkIcon size={14} />,
  poll: <BarChart3 size={14} />,
  approval: <CheckCircle2 size={14} />,
  pythia_brief: <Sparkles size={14} />,
};

const ATTACHMENT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  file: { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-300' },
  task: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-300' },
  calendar_invite: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-300' },
  record: { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-300' },
  link: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-300' },
  poll: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-300' },
  approval: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-300' },
  pythia_brief: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-300' },
};

export function AttachmentChip({ attachment, onRemove }: AttachmentChipProps) {
  const { isDarkMode } = useTheme();
  const colors = ATTACHMENT_COLORS[attachment.type];

  return (
    <div
      className={`
        group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border
        ${isDarkMode ? 'bg-[#121214] border-white/20 hover:border-white/40' : `${colors.bg} ${colors.border} hover:shadow-md`}
        transition-all duration-200 hover:scale-105
      `}
    >
      <div className={`
        ${isDarkMode ? 'text-white' : colors.text}
        transition-all duration-200 group-hover:scale-110
      `}>
        {ATTACHMENT_ICONS[attachment.type]}
      </div>
      <div className="flex flex-col min-w-0">
        <span className={`text-[10px] font-bold uppercase tracking-wider truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {attachment.title}
        </span>
        {attachment.subtitle && (
          <span className={`text-[10px] truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {attachment.subtitle}
          </span>
        )}
      </div>
      <button
        onClick={() => onRemove(attachment.id)}
        className={`
          p-0.5 rounded-full flex-shrink-0 transition-all duration-200
          ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/10 text-gray-500 hover:text-gray-700'}
          opacity-70 group-hover:opacity-100 hover:scale-110
        `}
      >
        <X size={12} />
      </button>
    </div>
  );
}