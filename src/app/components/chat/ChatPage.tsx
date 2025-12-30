import React from 'react';
import { Conversation, Message, ChatPreferences, ConversationIndex, MessageIndex, MessageAttachment } from './chatTypes';
import { generateSeedConversations, generateSeedMessages } from './chatSeedData';
import { generateMessageId, getCurrentUserInfo } from './chatUtils';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';
import { ContextPanel } from './ContextPanel';

export function ChatPage() {
  const currentUser = getCurrentUserInfo();
  const orgId = 'org_demo'; // Demo org
  
  // State
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [messages, setMessages] = React.useState<Record<string, Message[]>>({});
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>(null);
  const [preferences, setPreferences] = React.useState<ChatPreferences>({
    mutedConversationIds: [],
    pinnedConversationIds: [],
    readState: {},
    version: 1,
  });
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [taskFromMessage, setTaskFromMessage] = React.useState<Message | null>(null);
  const [showContextPanel, setShowContextPanel] = React.useState(false);

  // Load seed data on mount
  React.useEffect(() => {
    const seedConversations = generateSeedConversations(orgId, currentUser.userId);
    const seedMessages = generateSeedMessages(orgId, currentUser.userId);
    
    setConversations(seedConversations);
    
    // Group messages by conversation
    const messagesByConversation: Record<string, Message[]> = {};
    seedMessages.forEach(msg => {
      if (!messagesByConversation[msg.conversationId]) {
        messagesByConversation[msg.conversationId] = [];
      }
      messagesByConversation[msg.conversationId].push(msg);
    });
    
    // Sort messages by createdAt
    Object.keys(messagesByConversation).forEach(convId => {
      messagesByConversation[convId].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    
    setMessages(messagesByConversation);
    
    // Select first conversation
    if (seedConversations.length > 0) {
      setSelectedConversationId(seedConversations[0].conversationId);
    }
  }, []);

  // Handlers
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    
    // Mark as read
    setConversations(prev => prev.map(c => 
      c.conversationId === conversationId
        ? { ...c, unreadBy: { ...c.unreadBy, [currentUser.userId]: 0 } }
        : c
    ));
  };

  const handleSendMessage = (text: string, attachments: MessageAttachment[] = []) => {
    if (!selectedConversationId) return;
    
    const newMessage: Message = {
      messageId: generateMessageId(),
      conversationId: selectedConversationId,
      orgId,
      senderUserId: currentUser.userId,
      senderName: currentUser.name,
      senderAvatarUrl: currentUser.avatarUrl,
      kind: 'text',
      text,
      attachments,
      mentions: [],
      tags: [],
      linked: {
        projectId: null,
        taskId: null,
        billId: null,
        legislatorId: null,
        recordId: null,
      },
      replyToMessageId: null,
      reactions: {},
      pinned: false,
      createdAt: new Date().toISOString(),
      editedAt: null,
      version: 1,
    };
    
    // Add message
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage],
    }));
    
    // Update conversation preview - prioritize text, or show attachment type
    const previewText = text || (attachments.length > 0 ? `[${attachments[0].type}] ${attachments[0].title}` : '');
    setConversations(prev => prev.map(c => 
      c.conversationId === selectedConversationId
        ? {
            ...c,
            lastMessageAt: newMessage.createdAt,
            lastMessagePreview: previewText.substring(0, 100),
            updatedAt: newMessage.createdAt,
          }
        : c
    ));
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    if (!selectedConversationId) return;
    
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: prev[selectedConversationId].map(msg => {
        if (msg.messageId === messageId) {
          const reactions = { ...msg.reactions };
          
          if (reactions[emoji]) {
            // Toggle reaction
            if (reactions[emoji].includes(currentUser.userId)) {
              reactions[emoji] = reactions[emoji].filter(uid => uid !== currentUser.userId);
              if (reactions[emoji].length === 0) {
                delete reactions[emoji];
              }
            } else {
              reactions[emoji] = [...reactions[emoji], currentUser.userId];
            }
          } else {
            reactions[emoji] = [currentUser.userId];
          }
          
          return { ...msg, reactions };
        }
        return msg;
      }),
    }));
  };

  const handlePinMessage = (messageId: string) => {
    if (!selectedConversationId) return;
    
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: prev[selectedConversationId].map(msg => 
        msg.messageId === messageId ? { ...msg, pinned: !msg.pinned } : msg
      ),
    }));
  };

  const handleReplyToMessage = (messageId: string) => {
    console.log('Reply to message:', messageId);
    // TODO: Implement reply UI
  };

  const handleCreateTaskFromMessage = (message: Message) => {
    setTaskFromMessage(message);
    setShowTaskModal(true);
  };

  const handleLinkMessage = (messageId: string) => {
    console.log('Link message to project/client:', messageId);
    // TODO: Implement link modal
    alert('Demo: Link message to Project/Client modal would open here');
  };

  const handleSaveToRecord = (messageId: string) => {
    console.log('Save message to record:', messageId);
    alert('Demo: Message saved to Records successfully!');
  };

  const handleJumpToProject = () => {
    console.log('Jump to project');
    alert('Demo: Would navigate to Project Detail page');
  };

  const handleSaveThreadToRecord = () => {
    console.log('Save thread to record');
    alert('Demo: Conversation thread saved to Records successfully!');
  };

  const handleTogglePin = (conversationId: string) => {
    setPreferences(prev => {
      const isPinned = prev.pinnedConversationIds.includes(conversationId);
      return {
        ...prev,
        pinnedConversationIds: isPinned
          ? prev.pinnedConversationIds.filter(id => id !== conversationId)
          : [...prev.pinnedConversationIds, conversationId],
      };
    });
  };

  const handleMarkAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(c => 
      c.conversationId === conversationId
        ? { ...c, unreadBy: { ...c.unreadBy, [currentUser.userId]: 0 } }
        : c
    ));
  };

  const handleAddParticipants = () => {
    console.log('Add participants');
    alert('Demo: Add participants modal would open here');
  };

  const handleLinkToProject = () => {
    console.log('Link conversation to project');
    alert('Demo: Link to Project modal would open here');
  };

  const handleJumpToMessage = (messageId: string) => {
    console.log('Jump to message:', messageId);
    // TODO: Scroll to message
  };

  const selectedConversation = conversations.find(c => c.conversationId === selectedConversationId) || null;
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];
  const pinnedMessages = currentMessages.filter(m => m.pinned);

  return (
    <div className="h-full flex">
      {/* Left: Conversation List */}
      <ConversationList
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        currentUserId={currentUser.userId}
        pinnedConversationIds={preferences.pinnedConversationIds}
        onTogglePin={handleTogglePin}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Center: Message Thread */}
      <MessageThread
        conversation={selectedConversation}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        onReactToMessage={handleReactToMessage}
        onPinMessage={handlePinMessage}
        onReplyToMessage={handleReplyToMessage}
        onCreateTaskFromMessage={handleCreateTaskFromMessage}
        onLinkMessage={handleLinkMessage}
        onSaveToRecord={handleSaveToRecord}
        onJumpToProject={handleJumpToProject}
        onSaveThreadToRecord={handleSaveThreadToRecord}
      />

      {/* Right: Context Panel */}
      <ContextPanel
        conversation={selectedConversation}
        pinnedMessages={pinnedMessages}
        onJumpToMessage={handleJumpToMessage}
        onAddParticipants={handleAddParticipants}
        onLinkToProject={handleLinkToProject}
        onClose={() => setShowContextPanel(false)}
      />

      {/* Task Creation Modal */}
      {showTaskModal && taskFromMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4 dark:text-white">Create Task from Message</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Task Title</label>
                <input
                  type="text"
                  defaultValue={taskFromMessage.text.substring(0, 60)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 dark:text-white">Description</label>
                <textarea
                  rows={4}
                  defaultValue={`From conversation: ${selectedConversation?.title}\n\n"${taskFromMessage.text}"\n\n— ${taskFromMessage.senderName}`}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 rounded bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 rounded hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Demo: Create task and post action card
                  const actionCardMessage: Message = {
                    messageId: generateMessageId(),
                    conversationId: selectedConversationId!,
                    orgId,
                    senderUserId: currentUser.userId,
                    senderName: currentUser.name,
                    senderAvatarUrl: null,
                    kind: 'action_card',
                    text: `Task created: "${taskFromMessage.text.substring(0, 60)}..."`,
                    attachments: [],
                    mentions: [],
                    tags: [],
                    linked: {
                      projectId: selectedConversation?.linked.projectId || null,
                      taskId: 'task_' + Date.now(),
                      billId: null,
                      legislatorId: null,
                      recordId: null,
                    },
                    replyToMessageId: taskFromMessage.messageId,
                    reactions: {},
                    pinned: false,
                    createdAt: new Date().toISOString(),
                    editedAt: null,
                    version: 1,
                  };
                  
                  setMessages(prev => ({
                    ...prev,
                    [selectedConversationId!]: [...prev[selectedConversationId!], actionCardMessage],
                  }));
                  
                  setShowTaskModal(false);
                  setTaskFromMessage(null);
                  alert('Demo: Task created successfully!');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}