import React from 'react';
import { Conversation, Message, ChatPreferences, ConversationIndex, MessageIndex, MessageAttachment, Insight } from './chatTypes';
import { generateSeedConversations, generateSeedMessages } from './chatSeedData';
import { generateMessageId, getCurrentUserInfo } from './chatUtils';
import { ConversationList } from './ConversationList';
import { MessageThread } from './MessageThread';
import { ContextPanel } from './ContextPanel';
import { CheckSquare, Plus, X, Sparkles, MessageSquare } from 'lucide-react';
import { Task } from '../../data/workHubData';
import { useTheme } from '../../contexts/ThemeContext';
import { PageLayout } from '../ui/PageLayout';

export function ChatPage({ initialMessageId, draftRecipient }: { initialMessageId?: string | null, draftRecipient?: string }) {
  const { isDarkMode } = useTheme();
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
  
  // New Message Modal State
  const [showNewMessageModal, setShowNewMessageModal] = React.useState(false);
  const [newMessageRecipient, setNewMessageRecipient] = React.useState('');
  const [newMessageText, setNewMessageText] = React.useState('');

  // Revere Insights State
  const [insights, setInsights] = React.useState<Record<string, Insight[]>>({});

  // Task Creation Modal State
  const [showTaskModal, setShowTaskModal] = React.useState(false);
  const [taskFromMessage, setTaskFromMessage] = React.useState<Message | null>(null);
  const [taskFromInsight, setTaskFromInsight] = React.useState<Insight | null>(null);
  const [draftTaskTitle, setDraftTaskTitle] = React.useState('');
  const [draftTaskDesc, setDraftTaskDesc] = React.useState('');
  const [draftSubtasks, setDraftSubtasks] = React.useState<{id: string, title: string}[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = React.useState('');

  const [showContextPanel, setShowContextPanel] = React.useState(true);

  React.useEffect(() => {
    if (draftRecipient) {
      setNewMessageRecipient(draftRecipient);
      setShowNewMessageModal(true);
    }
  }, [draftRecipient]);

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
    
    // Seed initial insights for demo
    const initialInsights: Record<string, Insight[]> = {
      [seedConversations[0].conversationId]: [
        {
          id: 'insight_demo_1',
          type: 'general',
          title: 'Sentiment Analysis',
          description: 'Team sentiment is high regarding the new initiative.',
          createdAt: new Date().toISOString()
        }
      ]
    };

    // Check for demo trigger message and add insight
    const demoMsg = seedMessages.find(m => m.messageId === 'm_demo_trigger');
    if (demoMsg) {
      if (!initialInsights[demoMsg.conversationId]) initialInsights[demoMsg.conversationId] = [];
      initialInsights[demoMsg.conversationId].push({
          id: 'insight_demo_trigger',
          type: 'task_recommendation',
          title: 'Potential Task Detected',
          description: 'Based on recent message regarding data pulls.',
          sourceMessageId: demoMsg.messageId,
          metadata: { originalText: demoMsg.text },
          createdAt: new Date().toISOString()
      });
    }

    setInsights(initialInsights);

    // Select conversation based on initialMessageId or default
    if (initialMessageId) {
      const foundMsg = seedMessages.find(m => m.messageId === initialMessageId);
      if (foundMsg) {
        setSelectedConversationId(foundMsg.conversationId);
      } else if (seedConversations.length > 0) {
        setSelectedConversationId(seedConversations[0].conversationId);
      }
    } else if (seedConversations.length > 0) {
      setSelectedConversationId(seedConversations[0].conversationId);
    }
  }, [initialMessageId]);

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
    
    // Update conversation preview
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

    // Revere AI Suggestion Logic - now generates Insight in Context Panel
    const taskKeywords = ['due', 'by tomorrow', 'please', 'draft', 'send', 'pull data'];
    const isTaskLike = taskKeywords.some(keyword => text.toLowerCase().includes(keyword));

    if (isTaskLike) {
      setTimeout(() => {
        // Generate Insight
        const newInsight: Insight = {
          id: `insight_${Date.now()}`,
          type: 'task_recommendation',
          title: 'Potential Task Detected',
          description: `Based on your message: "${text.substring(0, 50)}..."`,
          sourceMessageId: newMessage.messageId,
          metadata: { originalText: text },
          createdAt: new Date().toISOString()
        };

        setInsights(prev => ({
          ...prev,
          [selectedConversationId]: [...(prev[selectedConversationId] || []), newInsight]
        }));

        // Also add a general insight occasionally
        if (Math.random() > 0.7) {
           const generalInsight: Insight = {
             id: `insight_gen_${Date.now()}`,
             type: 'general',
             title: 'Conversation Summary',
             description: 'Discussions are focused on Q3 deliverables. Consider scheduling a sync.',
             createdAt: new Date().toISOString()
           };
           setInsights(prev => ({
            ...prev,
            [selectedConversationId]: [...(prev[selectedConversationId] || []), generalInsight]
          }));
        }

      }, 1000);
    }
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
    setTaskFromInsight(null);
    openTaskModalWithText(message.text, message.text);
  };

  const handleActOnInsight = (insight: Insight) => {
    if (insight.type === 'task_recommendation') {
      setTaskFromInsight(insight);
      setTaskFromMessage(null);
      const text = insight.metadata?.originalText || insight.description;
      openTaskModalWithText(text, text);
    }
  };

  const openTaskModalWithText = (titleText: string, bodyText: string) => {
    // Check for Demo Trigger Text
    const demoText = "We need data pulls for CA-45 and CA-92. The memo needs to be drafted with that data and sent to Mike by tomorrow night.";
    
    if (bodyText.includes("CA-45") && bodyText.includes("CA-92")) {
        // Hardcoded Demo Logic
        setDraftTaskTitle("CA-45 & CA-92 Data Pulls");
        setDraftTaskDesc("Data pulls needed for CA-45 and CA-92. Memo needs to be drafted with data and sent to Mike by tomorrow night.");
        setDraftSubtasks([
            { id: 'st_demo_1', title: 'Pull data for CA-45' },
            { id: 'st_demo_2', title: 'Pull data for CA-92' },
            { id: 'st_demo_3', title: 'Draft memo' },
            { id: 'st_demo_4', title: 'Send to Mike' }
        ]);
    } else {
        // Generic Parsing Logic
        const title = titleText.split('.')[0].substring(0, 60);
        setDraftTaskTitle(title);
        setDraftTaskDesc(`Context: ${selectedConversation?.title}\n\n"${bodyText}"`);
        
        const subtasks = bodyText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('- ') || line.startsWith('• ') || /^\d+\./.test(line))
        .map((line, idx) => ({
            id: `st_parsed_${idx}`,
            title: line.replace(/^[-•\d+\.]\s*/, '')
        }));
        setDraftSubtasks(subtasks);
    }

    setShowTaskModal(true);
  };

  const handleLinkMessage = (messageId: string) => {
    console.log('Link message to project/client:', messageId);
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

  // Helper for subtask management in modal
  const addDraftSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setDraftSubtasks([...draftSubtasks, { id: `st_new_${Date.now()}`, title: newSubtaskInput }]);
    setNewSubtaskInput('');
  };

  const removeDraftSubtask = (id: string) => {
    setDraftSubtasks(draftSubtasks.filter(st => st.id !== id));
  };

  const confirmCreateTask = () => {
    if (!selectedConversationId) return;

    const sourceMessage = taskFromMessage || (taskFromInsight?.sourceMessageId 
        ? (messages[selectedConversationId]?.find(m => m.messageId === taskFromInsight.sourceMessageId) || null)
        : null);

    // Create Action Card Message
    const actionCardMessage: Message = {
      messageId: generateMessageId(),
      conversationId: selectedConversationId,
      orgId,
      senderUserId: currentUser.userId,
      senderName: currentUser.name,
      senderAvatarUrl: null,
      kind: 'action_card',
      text: `Task created: "${draftTaskTitle}"\n${draftSubtasks.length} subtasks added.`,
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
      replyToMessageId: sourceMessage?.messageId || null,
      reactions: {},
      pinned: false,
      createdAt: new Date().toISOString(),
      editedAt: null,
      version: 1,
    };
    
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...prev[selectedConversationId], actionCardMessage],
    }));
    
    // Remove the insight if it was used to create the task
    if (taskFromInsight) {
      setInsights(prev => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId].filter(i => i.id !== taskFromInsight.id)
      }));
    }

    // Persist new Task for WeeklyAgenda (Demo Hack)
    const newAgendaTask: Task = {
        id: `t_${Date.now()}`,
        title: draftTaskTitle,
        description: draftTaskDesc,
        status: 'todo',
        priority: 'medium',
        progress: 0,
        assigneeId: currentUser.userId,
        assigneeName: currentUser.name,
        dueDate: '2025-12-15', // Match WeeklyAgenda demo date
        projectId: 'proj-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        linkedBillIds: [], linkedBillNumbers: [], linkedPersonIds: [], linkedPersonNames: [], linkedIssueIds: [], linkedIssueNames: [],
        subtasks: draftSubtasks.map(st => ({ id: st.id, title: st.title, isCompleted: false })),
        
        // Context Source
        sourceMessageId: sourceMessage?.messageId,
        sourceConversationId: selectedConversationId,
        sourceMessagePreview: sourceMessage?.text.substring(0, 80),
        sourceMessageSender: sourceMessage?.senderName
    };

    const existingTasks = JSON.parse(localStorage.getItem('demo_new_tasks') || '[]');
    localStorage.setItem('demo_new_tasks', JSON.stringify([...existingTasks, newAgendaTask]));

    setShowTaskModal(false);
    setTaskFromMessage(null);
    setTaskFromInsight(null);
    setDraftSubtasks([]);
    
    // Ensure Context Panel is open to show results or general insights
    setShowContextPanel(true);
  };

  const selectedConversation = conversations.find(c => c.conversationId === selectedConversationId) || null;
  const currentMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];
  const pinnedMessages = currentMessages.filter(m => m.pinned);
  const currentInsights = selectedConversationId ? insights[selectedConversationId] || [] : [];

  return (
    <PageLayout
      title="Chat"
      subtitle="Messaging"
      headerIcon={<MessageSquare size={28} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
      backgroundImage={<MessageSquare size={450} color={isDarkMode ? 'white' : '#2563EB'} strokeWidth={0.5} />}
      accentColor={isDarkMode ? '#60A5FA' : '#2563EB'}
      headerContent={
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-400">
           <span className="text-xs font-semibold">{conversations.length} Active Channels</span>
        </div>
      }
      pageActions={
         <button 
            onClick={() => {/* Demo: New Chat */}}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
         >
            <Plus size={14} />
            New Message
         </button>
      }
      contentClassName="flex-1 overflow-hidden p-6 gap-6 flex"
    >
      {/* Module 1: Conversation List */}
      <div className={`w-80 flex-shrink-0 flex flex-col rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${
           isDarkMode ? 'bg-[#0a0a0b]/80 border-white/10' : 'bg-white/90 border-gray-200'
      }`}>
          <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={handleSelectConversation}
              currentUserId={currentUser.userId}
              pinnedConversationIds={preferences.pinnedConversationIds}
              onTogglePin={handleTogglePin}
              onMarkAsRead={handleMarkAsRead}
          />
      </div>

      {/* Module 2: Message Thread (Main) */}
      <div className={`flex-1 flex flex-col rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${
           isDarkMode ? 'bg-[#0a0a0b]/80 border-white/10' : 'bg-white/90 border-gray-200'
      }`}>
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
      </div>

      {/* Module 3: Context Panel (Right Sidebar) */}
      {showContextPanel && (
          <div className={`w-80 flex-shrink-0 flex flex-col rounded-xl border overflow-hidden transition-all duration-300 shadow-sm ${
              isDarkMode ? 'bg-[#0a0a0b]/80 border-white/10' : 'bg-white/90 border-gray-200'
          }`}>
              <ContextPanel
                  conversation={selectedConversation}
                  pinnedMessages={pinnedMessages}
                  insights={currentInsights}
                  onJumpToMessage={handleJumpToMessage}
                  onAddParticipants={handleAddParticipants}
                  onLinkToProject={handleLinkToProject}
                  onActOnInsight={handleActOnInsight}
                  onClose={() => setShowContextPanel(false)}
              />
          </div>
      )}

      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold dark:text-white">New Message</h3>
              <button onClick={() => setShowNewMessageModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Recipient</label>
                <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-slate-900">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                    {newMessageRecipient.charAt(0).toUpperCase() || '?'}
                  </div>
                  <input 
                    type="text" 
                    value={newMessageRecipient}
                    onChange={(e) => setNewMessageRecipient(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-sm dark:text-white"
                    placeholder="Type a name..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Message</label>
                <textarea 
                  rows={4}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900/50">
              <button 
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, this would create the conversation
                  setShowNewMessageModal(false);
                  setNewMessageText('');
                  // If we had a toast hook here we'd use it, but for now just close
                }}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/20"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (taskFromMessage || taskFromInsight) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                     <CheckSquare size={20} />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold dark:text-white">Create Task</h3>
                     <p className="text-sm text-gray-500 dark:text-gray-400">Revere AI has pre-filled details</p>
                  </div>
               </div>
               <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X size={24} />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Task Title</label>
                <input
                  type="text"
                  value={draftTaskTitle}
                  onChange={(e) => setDraftTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={draftTaskDesc}
                  onChange={(e) => setDraftTaskDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                />
              </div>

              {/* Subtasks Section */}
              <div>
                 <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Subtasks</label>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                       {draftSubtasks.length} Detected
                    </span>
                 </div>
                 
                 <div className="space-y-2 mb-3">
                    {draftSubtasks.map((st) => (
                       <div key={st.id} className="flex items-center gap-2 group">
                          <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 rounded border border-gray-200 dark:border-white/5 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                             <span className="text-sm dark:text-gray-300">{st.title}</span>
                          </div>
                          <button 
                            onClick={() => removeDraftSubtask(st.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X size={16} />
                          </button>
                       </div>
                    ))}
                 </div>

                 <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Add another subtask..."
                      value={newSubtaskInput}
                      onChange={(e) => setNewSubtaskInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addDraftSubtask()}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-white/10 rounded-lg bg-white dark:bg-slate-900 dark:text-white outline-none focus:border-blue-500"
                    />
                    <button 
                      onClick={addDraftSubtask}
                      className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600"
                    >
                       <Plus size={18} />
                    </button>
                 </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 bg-gray-50 dark:bg-slate-900/50 rounded-b-xl">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-5 py-2.5 font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmCreateTask}
                className="px-5 py-2.5 font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <CheckSquare size={18} />
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
