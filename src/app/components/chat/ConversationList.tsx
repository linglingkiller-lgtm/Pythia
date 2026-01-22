import React from 'react';
import { Conversation } from './chatTypes';
import { 
  getConversationIcon, 
  formatMessageTime, 
  getUnreadCount,
  filterConversations,
  sortConversations 
} from './chatUtils';
import { Search, Hash, MessageSquare, FolderOpen, Bot, Pin, MoreVertical, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
  pinnedConversationIds: string[];
  onTogglePin: (conversationId: string) => void;
  onMarkAsRead: (conversationId: string) => void;
}

type FilterType = 'all' | 'dm' | 'channel' | 'project' | 'system';

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId,
  pinnedConversationIds,
  onTogglePin,
  onMarkAsRead,
}: ConversationListProps) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterType, setFilterType] = React.useState<FilterType>('all');
  const [menuOpen, setMenuOpen] = React.useState<string | null>(null);

  const filteredConversations = filterConversations(conversations, searchQuery, filterType);
  const sortedConversations = sortConversations(filteredConversations, pinnedConversationIds);

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const filterButtons: { type: FilterType; icon: any; label: string }[] = [
    { type: 'all', icon: MessageSquare, label: 'All' },
    { type: 'dm', icon: MessageSquare, label: 'DMs' },
    { type: 'channel', icon: Hash, label: 'Channels' },
    { type: 'project', icon: FolderOpen, label: 'Projects' },
    { type: 'system', icon: Bot, label: 'System' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Module Header */}
      <div className={`flex-shrink-0 px-4 py-3 border-b flex items-center justify-between ${
        isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
            <MessageSquare size={14} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <h2 className={`text-xs font-bold uppercase tracking-wider ${textColor}`}>
            Messages
            </h2>
        </div>
      </div>

      {/* Filter/Search Bar (moved out of header to be part of the "body" top section or sticky under header) */}
      <div className={`px-4 py-3 border-b ${
         isDarkMode ? 'bg-[#0a0a0b]/50 border-white/5' : 'bg-gray-50/50 border-gray-200'
      }`}>
        {/* Search */}
        <div className="relative mb-3">
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all border
            ${isDarkMode 
                ? 'bg-[#121214] border-white/5 focus-within:border-blue-500/50' 
                : 'bg-white border-gray-200 focus-within:border-blue-500/50'
            }
          `}>
            <Search size={14} className={textMuted} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                flex-1 bg-transparent text-xs outline-none font-medium
                ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}
              `}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={textMuted}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {filterButtons.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`
                px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all whitespace-nowrap border
                ${filterType === type
                  ? isDarkMode
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-blue-600 text-white border-blue-600'
                  : isDarkMode
                    ? 'bg-transparent border-white/10 text-gray-500 hover:text-gray-300'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List Body (Transparent) */}
      <div className={`flex-1 overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        {sortedConversations.length === 0 ? (
          <div className={`p-8 text-center ${textMuted} text-xs`}>
            No conversations found
          </div>
        ) : (
          sortedConversations.map((conversation) => {
            const unreadCount = getUnreadCount(conversation, currentUserId);
            const isPinned = pinnedConversationIds.includes(conversation.conversationId);
            const isSelected = selectedConversationId === conversation.conversationId;
            const isMenuOpen = menuOpen === conversation.conversationId;

            return (
              <div
                key={conversation.conversationId}
                className={`
                  relative px-4 py-3 cursor-pointer transition-all border-b
                  ${isSelected
                    ? isDarkMode
                      ? 'bg-blue-500/10 border-blue-500/20'
                      : 'bg-blue-50 border-blue-100'
                    : isDarkMode
                      ? 'bg-transparent border-white/5 hover:bg-white/5'
                      : 'bg-transparent border-gray-100 hover:bg-gray-50'
                  }
                `}
                onClick={() => onSelectConversation(conversation.conversationId)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
                    ${conversation.type === 'system'
                      ? 'bg-gradient-to-br from-red-500 to-blue-600 text-white'
                      : isDarkMode
                        ? 'bg-[#1e1e20] text-gray-300 border border-white/10'
                        : 'bg-white text-gray-700 border border-gray-200'
                    }
                  `}>
                    {conversation.type === 'system' ? (
                      <img src={pythiaLogo} alt="Revere" className="w-5 h-5 object-contain brightness-0 invert" />
                    ) : (
                      conversation.title.charAt(0)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h3 className={`text-xs font-bold ${textColor} truncate`}>
                          {conversation.title}
                        </h3>
                        {isPinned && <Pin size={10} className="text-yellow-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-[10px] ${textMuted}`}>
                          {formatMessageTime(conversation.lastMessageAt)}
                        </span>
                        {unreadCount > 0 && (
                          <div className="bg-blue-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-xs ${isSelected ? (isDarkMode ? 'text-blue-200' : 'text-blue-700') : textMuted} truncate`}>
                      {conversation.lastMessagePreview}
                    </p>
                  </div>
                </div>

                {/* Context Menu Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(isMenuOpen ? null : conversation.conversationId);
                  }}
                  className={`
                    absolute top-3 right-3 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                    ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}
                  `}
                >
                  <MoreVertical size={16} className={textMuted} />
                </button>

                {/* Context Menu */}
                {isMenuOpen && (
                  <div
                    className={`
                      absolute right-4 top-12 z-50 w-48 py-1 rounded-lg shadow-xl
                      ${isDarkMode ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-200'}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        onTogglePin(conversation.conversationId);
                        setMenuOpen(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      {isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    <button
                      onClick={() => {
                        onMarkAsRead(conversation.conversationId);
                        setMenuOpen(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${isDarkMode ? 'hover:bg-slate-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
                    >
                      Mark as read
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}