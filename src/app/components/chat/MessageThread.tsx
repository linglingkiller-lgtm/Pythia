import React from 'react';
import { Message, Conversation, MessageAttachment } from './chatTypes';
import {
  formatMessageTimeFull,
  shouldShowDateSeparator,
  formatDateSeparator,
  getCurrentUserInfo,
} from './chatUtils';
import {
  Send,
  Paperclip,
  MoreVertical,
  CheckSquare,
  Save,
  Sparkles,
  MessageSquare,
  ChevronDown,
  Pin,
  Bold,
  Italic,
  Plus,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import pythiaLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';
import { FormattedMessage } from './chatMarkdown';
import { AttachmentMenu, AttachmentType } from './AttachmentMenu';
import { AttachmentForm } from './AttachmentForms';
import { AttachmentChip } from './AttachmentChip';
import { AttachmentCard } from './AttachmentCard';
import { Confetti } from '../Confetti';

interface MessageThreadProps {
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (text: string, attachments: MessageAttachment[]) => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onPinMessage: (messageId: string) => void;
  onReplyToMessage: (messageId: string) => void;
  onCreateTaskFromMessage: (message: Message) => void;
  onLinkMessage: (messageId: string) => void;
  onSaveToRecord: (messageId: string) => void;
  onJumpToProject: () => void;
  onSaveThreadToRecord: () => void;
}

export function MessageThread({
  conversation,
  messages,
  onSendMessage,
  onReactToMessage,
  onPinMessage,
  onCreateTaskFromMessage,
  onSaveToRecord,
}: MessageThreadProps) {
  const { isDarkMode } = useTheme();
  const [messageText, setMessageText] = React.useState('');
  const [hoveredMessageId, setHoveredMessageId] = React.useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = React.useState<string | null>(null);
  const [showActions, setShowActions] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Attachment system state
  const [showAttachmentMenu, setShowAttachmentMenu] = React.useState(false);
  const [attachmentFormType, setAttachmentFormType] = React.useState<AttachmentType | null>(null);
  const [composerAttachments, setComposerAttachments] = React.useState<MessageAttachment[]>([]);

  // Birthday celebration state 🎉
  const [isCelebrating, setIsCelebrating] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const currentUser = getCurrentUserInfo();

  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  // Scroll to bottom on new messages
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (messageText.trim() || composerAttachments.length > 0) {
      // 🎉 Birthday Easter Egg Detection!
      if (messageText.toLowerCase().includes('happy birthday')) {
        setShowConfetti(true);
        setIsCelebrating(true);
        setTimeout(() => {
          setIsCelebrating(false);
        }, 5000);
      }

      onSendMessage(messageText, composerAttachments);
      setMessageText('');
      setComposerAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = newHeight + 'px';
    }
  }, [messageText]);

  // Handle attachment type selection from menu
  const handleSelectAttachmentType = (type: AttachmentType) => {
    setShowAttachmentMenu(false);
    setAttachmentFormType(type);
  };

  // Handle attachment creation from form
  const handleConfirmAttachment = (attachment: Omit<MessageAttachment, 'id' | 'createdAt'>) => {
    const newAttachment: MessageAttachment = {
      ...attachment,
      id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    setComposerAttachments([...composerAttachments, newAttachment]);
    setAttachmentFormType(null);
  };

  // Handle removing attachment chip
  const handleRemoveAttachment = (attachmentId: string) => {
    setComposerAttachments(composerAttachments.filter(a => a.id !== attachmentId));
  };

  if (!conversation) {
    return (
      <div className={`flex-1 flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <MessageSquare size={64} className={`mx-auto mb-4 ${textMuted} opacity-30`} />
          <p className={`text-lg ${textMuted}`}>Select a conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${isCelebrating ? 'animate-dance' : ''}`}>
      {/* 🎉 Confetti Overlay */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Module Header */}
      <div className={`flex-shrink-0 px-4 py-3 border-b flex items-center justify-between ${isCelebrating ? 'animate-wiggle' : ''} ${
        isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className={`
            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm
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
          
          <div className="flex-1 min-w-0">
            <h2 className={`text-xs font-bold uppercase tracking-wider ${textColor} truncate`}>
              {conversation.title}
            </h2>
            {conversation.subtitle && (
              <p className={`text-[10px] ${textMuted} truncate`}>{conversation.subtitle}</p>
            )}
          </div>
        </div>

        {/* Actions Button */}
        <button
          onClick={() => setShowActions(!showActions)}
          className={`
            p-1.5 rounded-lg transition-colors
            ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}
          `}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Actions Bar (collapsible) */}
      {showActions && (
        <div className={`px-4 py-2 flex items-center gap-2 border-b ${
            isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-gray-50 border-gray-200'
        }`}>
          <button
            onClick={onSaveToRecord}
            className={`
              flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border
              ${isDarkMode ? 'bg-transparent border-white/10 text-white hover:bg-white/5' : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-200'}
            `}
          >
            <Save size={12} />
            Save to Records
          </button>
        </div>
      )}

      {/* Messages Body (Transparent) */}
      <div className={`flex-1 overflow-y-auto px-6 py-4 custom-scrollbar ${isDarkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const showDateSeparator = shouldShowDateSeparator(message, previousMessage);
          const isCurrentUser = message.senderUserId === currentUser.userId;
          const isHovered = hoveredMessageId === message.messageId;
          const isMenuOpen = actionMenuOpen === message.messageId;
          
          // Check if next message is from same sender (for tighter grouping)
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
          const nextFromSameSender = nextMessage?.senderUserId === message.senderUserId;
          const showTimestamp = !nextFromSameSender || showDateSeparator;

          return (
            <div key={message.messageId}>
              {/* Date Separator */}
              {showDateSeparator && (
                <div className="flex items-center justify-center my-6">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    isDarkMode ? 'bg-[#0a0a0b] border-white/10 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}>
                    {formatDateSeparator(message.createdAt)}
                  </div>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex items-end gap-3 mb-1 group ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                onMouseEnter={() => setHoveredMessageId(message.messageId)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                {/* Avatar for received messages (left side) */}
                {!isCurrentUser && !nextFromSameSender && (
                  <div className="flex-shrink-0 w-8 h-8">
                    {message.senderUserId === 'system_revere' ? (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                        <img src={pythiaLogo} alt="Revere" className="w-5 h-5 object-contain brightness-0 invert" />
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                        isDarkMode ? 'bg-[#1e1e20] text-gray-300 border-white/10' : 'bg-white text-gray-700 border-gray-200'
                      }`}>
                        {message.senderName.charAt(0)}
                      </div>
                    )}
                  </div>
                )}
                {!isCurrentUser && nextFromSameSender && <div className="w-8" />}

                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {/* Sender name for group chats (received messages only) */}
                  {!isCurrentUser && conversation.type !== 'dm' && (!previousMessage || previousMessage.senderUserId !== message.senderUserId) && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${textMuted} ml-1 mb-1`}>
                      {message.senderName}
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div className="relative group/bubble">
                    {message.kind === 'pythia_insight' || message.kind === 'action_card' ? (
                      // Special card style for insights and actions
                      <div className={`
                        px-4 py-3 rounded-xl border max-w-md shadow-lg
                        ${message.kind === 'pythia_insight'
                          ? isDarkMode
                            ? 'bg-gradient-to-br from-red-900/10 to-blue-900/10 border-red-500/20 backdrop-blur-md'
                            : 'bg-gradient-to-br from-red-50 to-blue-50 border-red-200'
                          : isDarkMode
                            ? 'bg-[#121214] border-white/10'
                            : 'bg-white border-gray-200'
                        }
                      `}>
                        {message.kind === 'pythia_insight' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={12} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                              Revere Insight
                            </span>
                          </div>
                        )}
                        <FormattedMessage 
                          text={message.text}
                          className={`text-sm ${textColor} whitespace-pre-wrap leading-relaxed`}
                        />
                      </div>
                    ) : message.text ? (
                      // Standard message bubble
                      <div className={`
                        px-4 py-2 rounded-2xl text-sm leading-relaxed break-words shadow-sm
                        ${isCurrentUser
                          ? isDarkMode
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-blue-600 text-white rounded-tr-sm'
                          : isDarkMode
                            ? 'bg-[#1e1e20] text-gray-200 border border-white/5 rounded-tl-sm'
                            : 'bg-white text-gray-900 border border-gray-200 rounded-tl-sm'
                        }
                      `}>
                        <FormattedMessage text={message.text} />
                      </div>
                    ) : null}

                    {/* Hover Actions */}
                    {isHovered && (
                      <div
                        className={`
                          absolute top-0 ${isCurrentUser ? 'right-full mr-2' : 'left-full ml-2'}
                          flex items-center gap-1
                        `}
                      >
                        <button
                          onClick={() => setActionMenuOpen(isMenuOpen ? null : message.messageId)}
                          className={`
                            p-1.5 rounded-lg transition-all opacity-0 group-hover/bubble:opacity-100 border
                            ${isDarkMode ? 'bg-[#0a0a0b] border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}
                          `}
                          title="More"
                        >
                          <MoreVertical size={12} className={textMuted} />
                        </button>

                        {/* Actions Menu */}
                        {isMenuOpen && (
                          <div
                            className={`
                              absolute ${isCurrentUser ? 'right-0' : 'left-0'} top-8 z-50 w-48 py-1 rounded-xl shadow-xl border
                              ${isDarkMode ? 'bg-[#0a0a0b] border-white/10' : 'bg-white border-gray-200'}
                            `}
                          >
                            <button
                              onClick={() => {
                                onPinMessage(message.messageId);
                                setActionMenuOpen(null);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                              <Pin size={12} />
                              {message.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button
                              onClick={() => {
                                onCreateTaskFromMessage(message);
                                setActionMenuOpen(null);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                              <CheckSquare size={12} />
                              Create task
                            </button>
                            <button
                              onClick={() => {
                                onSaveToRecord(message.messageId);
                                setActionMenuOpen(null);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                              <Save size={12} />
                              Save to records
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Attachment Cards */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={`flex flex-col gap-2 mt-2 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      {message.attachments.map((attachment, attIdx) => (
                        <AttachmentCard
                          key={attachment.id || `att-${message.messageId}-${attIdx}`}
                          attachment={attachment}
                          isCurrentUser={isCurrentUser}
                        />
                      ))}
                    </div>
                  )}

                  {/* Reactions */}
                  {Object.keys(message.reactions).length > 0 && (
                    <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
                      {Object.entries(message.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => onReactToMessage(message.messageId, emoji)}
                          className={`
                            flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border
                            ${users.includes(currentUser.userId)
                              ? isDarkMode
                                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                : 'bg-blue-50 border-blue-300 text-blue-600'
                              : isDarkMode
                                ? 'bg-[#1e1e20] border-white/10 hover:bg-white/5 text-gray-400'
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500'
                            }
                          `}
                        >
                          <span>{emoji}</span>
                          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>{users.length}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp (only show for last message in group) */}
                  {showTimestamp && (
                    <span className={`text-[10px] ${textMuted} mt-1 ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
                      {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`px-4 py-4 border-t ${isDarkMode ? 'border-white/10 bg-[#0a0a0b]/50' : 'border-gray-200 bg-gray-50/50'}`}>
        {/* Attachment Chips */}
        {composerAttachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {composerAttachments.map((attachment, idx) => (
              <AttachmentChip
                key={attachment.id || `draft-att-${idx}`}
                attachment={attachment}
                onRemove={handleRemoveAttachment}
              />
            ))}
          </div>
        )}

        <div className="relative">
          <div className={`
            flex items-end gap-2 px-3 py-2 rounded-xl transition-all border
            ${isDarkMode ? 'bg-[#121214] border-white/10' : 'bg-white border-gray-200'}
          `}>
            <button
              className={`
                p-2 rounded-lg transition-all duration-300
                ${showAttachmentMenu 
                  ? isDarkMode 
                    ? 'bg-blue-600 text-white rotate-45' 
                    : 'bg-blue-600 text-white rotate-45'
                  : isDarkMode 
                    ? 'hover:bg-white/10 hover:rotate-90 text-gray-400 hover:text-blue-400' 
                    : 'hover:bg-gray-100 hover:rotate-90 text-gray-500 hover:text-blue-600'
                }
              `}
              title="Attach"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Plus size={16} className="transition-all duration-300" />
            </button>
            
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className={`
                flex-1 bg-transparent text-sm resize-none outline-none py-2 font-medium
                ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}
              `}
              style={{ maxHeight: '120px' }}
            />
            
            <button
              onClick={handleSend}
              disabled={!messageText.trim() && composerAttachments.length === 0}
              className={`
                p-2 rounded-lg transition-all duration-300
                ${messageText.trim() || composerAttachments.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95'
                  : isDarkMode
                    ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }
              `}
            >
              <Send size={16} className={`transition-transform ${messageText.trim() || composerAttachments.length > 0 ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
            </button>
          </div>

          {/* Attachment Menu */}
          {showAttachmentMenu && (
            <AttachmentMenu
              onSelect={handleSelectAttachmentType}
              onClose={() => setShowAttachmentMenu(false)}
            />
          )}
        </div>

        {/* Attachment Form */}
        {attachmentFormType && (
          <AttachmentForm
            type={attachmentFormType}
            draftText={messageText}
            onConfirm={handleConfirmAttachment}
            onCancel={() => setAttachmentFormType(null)}
          />
        )}
      </div>
    </div>
  );
}