import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  CheckSquare,
  Calendar,
  FileText,
  Link as LinkIcon,
  BarChart3,
  CheckCircle2,
  Sparkles,
  X,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type AttachmentType = 'file' | 'task' | 'calendar_invite' | 'record' | 'link' | 'poll' | 'approval' | 'pythia_brief';

interface AttachmentMenuItem {
  type: AttachmentType;
  icon: React.ReactNode;
  label: string;
  color: string;
}

interface AttachmentMenuProps {
  onSelect: (type: AttachmentType) => void;
  onClose: () => void;
}

const ATTACHMENT_ITEMS: AttachmentMenuItem[] = [
  {
    type: 'file',
    icon: <Paperclip size={18} />,
    label: 'Files',
    color: 'text-gray-500',
  },
  {
    type: 'task',
    icon: <CheckSquare size={18} />,
    label: 'Tasks',
    color: 'text-blue-500',
  },
  {
    type: 'calendar_invite',
    icon: <Calendar size={18} />,
    label: 'Calendar',
    color: 'text-purple-500',
  },
  {
    type: 'record',
    icon: <FileText size={18} />,
    label: 'Record',
    color: 'text-green-500',
  },
  {
    type: 'link',
    icon: <LinkIcon size={18} />,
    label: 'Link',
    color: 'text-cyan-500',
  },
  {
    type: 'poll',
    icon: <BarChart3 size={18} />,
    label: 'Poll',
    color: 'text-orange-500',
  },
  {
    type: 'approval',
    icon: <CheckCircle2 size={18} />,
    label: 'Approval',
    color: 'text-emerald-500',
  },
  {
    type: 'pythia_brief',
    icon: <Sparkles size={18} />,
    label: 'Revere Brief',
    color: 'text-red-500',
  },
];

export function AttachmentMenu({ onSelect, onClose }: AttachmentMenuProps) {
  const { isDarkMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className={`
        absolute bottom-full left-0 mb-2 w-64 rounded-xl shadow-2xl border overflow-hidden
        ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}
        animate-in fade-in slide-in-from-bottom-2 duration-200
      `}
    >
      {/* Header */}
      <div className={`
        px-4 py-3 flex items-center justify-between border-b
        ${isDarkMode ? 'border-white/10' : 'border-gray-100'}
      `}>
        <h4 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Add to message
        </h4>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
        >
          <X size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        </button>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-2 gap-1 p-2">
        {ATTACHMENT_ITEMS.map((item) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            className={`
              group flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-200
              ${isDarkMode
                ? 'hover:bg-slate-700 hover:scale-105'
                : 'hover:bg-gray-50 hover:scale-105'
              }
              hover:shadow-lg
            `}
          >
            <div className={`
              ${item.color} transition-all duration-200 group-hover:scale-110
              ${isDarkMode ? 'group-hover:brightness-125' : 'group-hover:brightness-110'}
            `}>
              {item.icon}
            </div>
            <span className={`
              text-xs font-medium transition-all duration-200
              ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}
            `}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}