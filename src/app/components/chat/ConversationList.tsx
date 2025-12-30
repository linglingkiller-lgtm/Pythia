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
    <div className={`w-80 flex flex-col h-full ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      {/* Header */}
      <div className="p-4">
        <h2 className={`text-2xl font-bold ${textColor} mb-4`} style={{ fontFamily: '"Corpline", sans-serif' }}>
          Messages
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <div className={`
            flex items-center gap-2 px-4 py-2.5 rounded-full transition-all
            ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}
          `}>
            <Search size={16} className={textMuted} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                flex-1 bg-transparent text-sm outline-none
                ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}
              `}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className={textMuted}>
                <X size={16} />
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
                px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap
                ${filterType === type
                  ? isDarkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className={`p-8 text-center ${textMuted} text-sm`}>
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
                  relative px-4 py-3 cursor-pointer transition-all group
                  ${isSelected
                    ? isDarkMode
                      ? 'bg-slate-800'
                      : 'bg-gray-100'
                    : isDarkMode
                      ? 'hover:bg-slate-800/50'
                      : 'hover:bg-gray-50'
                  }
                `}
                onClick={() => onSelectConversation(conversation.conversationId)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold
                    ${conversation.type === 'system'
                      ? 'bg-gradient-to-br from-red-500 to-blue-500'
                      : isDarkMode
                        ? 'bg-slate-700 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {conversation.type === 'system' ? (
                      <img src={pythiaLogo} alt="Revere" className="w-7 h-7 object-contain brightness-0 invert" />
                    ) : (
                      conversation.title.charAt(0)
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h3 className={`text-sm font-semibold ${textColor} truncate`}>
                          {conversation.title}
                        </h3>
                        {isPinned && <Pin size={12} className="text-yellow-500 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        <span className={`text-xs ${textMuted}`}>
                          {formatMessageTime(conversation.lastMessageAt)}
                        </span>
                        {unreadCount > 0 && (
                          <div className="bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm ${textMuted} truncate`}>
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