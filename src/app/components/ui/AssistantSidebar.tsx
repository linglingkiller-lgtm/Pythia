import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, Radio, FileText, Bell, Calendar, ArrowRight, 
  Bot, Sparkles, MessageSquare, Zap, CheckCircle2, 
  AlertCircle, ChevronRight, Clock, Search, Send, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useAuth } from '../../contexts/AuthContext';
import { sampleNotifications } from '../../data/sampleNotifications';
import { createPortal } from 'react-dom';
import { 
  BillSummaryCard, VoteSimulationCard, StakeholderBriefCard, 
  TaskCard, MeetingPrepCard 
} from './AssistantCards';
import { demoBills, demoStakeholders } from '../../data/demoAssistantData';
import { parseVoiceCommand } from '../../utils/voiceCommandParser';

interface AssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordMeeting: () => void;
  onOpenPythia: () => void;
  initialIntent?: any;
  onClearIntent?: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  component?: React.ReactNode;
  timestamp: number;
  keyTakeaways?: string[];
  recommendedActions?: { label: string; action: string }[];
  sources?: { title: string; snippet: string; metadata: string; type: string }[];
}

export function AssistantSidebar({ isOpen, onClose, onRecordMeeting, onOpenPythia, initialIntent, onClearIntent }: AssistantSidebarProps) {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuth();
  const { isListening, startListening, stopListening, transcript, lastIntent, lastCommand } = useVoice();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'chat'>('overview');
  const [quickNote, setQuickNote] = useState('');
  const [notes, setNotes] = useState<{id: string, text: string, date: Date}[]>([
    { id: '1', text: 'Follow up with Senator Ray regarding the amendment proposal.', date: new Date(Date.now() - 86400000) },
    { id: '2', text: 'Draft a summary of the Energy Committee hearing for the client briefing.', date: new Date(Date.now() - 172800000) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      text: 'Hello! I am your executive assistant. I can help you manage your workflow, track legislation, and draft communications. How can I assist you today?',
      timestamp: Date.now()
    }
  ]);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastProcessedIntentRef = useRef<any>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat' && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, activeTab]);

  // Handle Voice Intents
  useEffect(() => {
    if (lastIntent && lastIntent !== lastProcessedIntentRef.current) {
      lastProcessedIntentRef.current = lastIntent;
      
      // We only care about specific intents here
      const assistantIntents = [
        'SUMMARIZE_BILL', 'SIMULATE_VOTE', 'COMPARE_BILLS', 
        'GET_STAKEHOLDER_BRIEF', 'FIND_PATH_TO_STAKEHOLDER', 
        'CREATE_TASK', 'PREP_MEETING', 'GET_MORNING_BRIEF',
        'DRAFT_MESSAGE'
      ];

      if (assistantIntents.includes(lastIntent.type)) {
        setActiveTab('chat');
        // Add user message representing the command
        if (lastCommand) {
             setChatHistory(prev => [...prev, { role: 'user', text: lastCommand, timestamp: Date.now() }]);
        }
        
        // Process the intent
        processIntent(lastIntent);
      }
    }
  }, [lastIntent, lastCommand]);

  const processIntent = (intent: any) => {
    let responseText = '';
    let responseComponent: React.ReactNode | undefined;
    let keyTakeaways: string[] | undefined;
    let recommendedActions: { label: string; action: string }[] | undefined;
    let sources: { title: string; snippet: string; metadata: string; type: string }[] | undefined;

    switch (intent.type) {
      case 'SUMMARIZE_BILL': {
        const bill = demoBills.find(b => b.id === intent.billIdOrNumber || b.number.includes(intent.billIdOrNumber) || intent.billIdOrNumber === 'current');
        const targetBill = bill || demoBills[0]; // Fallback to first bill
        responseText = `Here is the executive summary for ${targetBill.number}. I've highlighted 3 potential risks.`;
        responseComponent = <BillSummaryCard bill={targetBill} isDarkMode={isDarkMode} />;
        keyTakeaways = [
          'Bill aims to reduce carbon emissions by 50% by 2030.',
          'Includes provisions for renewable energy incentives.',
          'Potential conflict with fossil fuel industry.'
        ];
        recommendedActions = [
          { label: 'Review Bill Details', action: 'Open Bill Summary' },
          { label: 'Contact Stakeholders', action: 'Find Path to Stakeholder' }
        ];
        sources = [
          { title: 'Energy Policy Brief', snippet: 'Bill aims to reduce carbon emissions by 50% by 2030.', metadata: '2023-09-15', type: 'Document' }
        ];
        break;
      }
      case 'SIMULATE_VOTE': {
        responseText = `Running war game simulation for "${intent.scenario}". Based on current whip counts, the bill fails by a narrow margin.`;
        responseComponent = <VoteSimulationCard scenario={intent.scenario || "Florida Delegation Flip"} isDarkMode={isDarkMode} />;
        keyTakeaways = [
          'Bill fails by a narrow margin in the simulation.',
          'Key swing voters are undecided.',
          'Need to strengthen coalition.'
        ];
        break;
      }
      case 'GET_STAKEHOLDER_BRIEF': {
        const sh = demoStakeholders.find(s => s.name.toLowerCase().includes(intent.name.toLowerCase()));
        const targetSh = sh || demoStakeholders[0];
        responseText = `I've prepared a dossier for ${targetSh.name}. Note the recent interaction and potential conflict of interest.`;
        responseComponent = <StakeholderBriefCard stakeholder={targetSh} isDarkMode={isDarkMode} />;
        break;
      }
      case 'CREATE_TASK': {
        responseText = `I've added that to your high-priority task list for today.`;
        responseComponent = <TaskCard task={intent.task} isDarkMode={isDarkMode} />;
        break;
      }
      case 'PREP_MEETING': {
        responseText = `I've assembled a briefing kit for the "${intent.meetingContext}" meeting. It includes the latest strategy deck and attendee profiles.`;
        responseComponent = <MeetingPrepCard context={intent.meetingContext} isDarkMode={isDarkMode} />;
        break;
      }
      case 'GET_MORNING_BRIEF': {
        responseText = "Good morning. Here's what you missed: 2 committee votes advanced, and we have an urgent request from Senator Blackwell's office.";
        responseComponent = (
          <div className="mt-2 space-y-2">
            {sampleNotifications.slice(0,2).map(n => (
              <div key={n.id} className={`p-3 rounded-lg border text-xs ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <span className="font-bold text-red-500 mr-2">URGENT</span>
                {n.message}
              </div>
            ))}
          </div>
        );
        break;
      }
      case 'DRAFT_MESSAGE': {
        responseText = `I've started a draft to ${intent.recipient}. You can review it in the secure messenger.`;
        break;
      }
      default:
        responseText = "I'm not sure how to help with that specific request yet.";
    }

    // Simulate "thinking" delay
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        text: responseText, 
        component: responseComponent,
        timestamp: Date.now(),
        keyTakeaways: keyTakeaways,
        recommendedActions: recommendedActions,
        sources: sources
      }]);
    }, 600);
  };

  // Handle Initial Intent (e.g. from Toast)
  useEffect(() => {
    if (isOpen && initialIntent) {
      setActiveTab('chat');
      
      // Add a user message for context if needed
      if (initialIntent.type === 'GET_MORNING_BRIEF') {
         setChatHistory(prev => [...prev, { role: 'user', text: "Show me what I've missed.", timestamp: Date.now() }]);
      }

      processIntent(initialIntent);
      
      if (onClearIntent) {
        onClearIntent();
      }
    }
  }, [isOpen, initialIntent]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg, timestamp: Date.now() }]);
    setChatInput('');

    // Parse the text input using the same logic as voice
    const intent = parseVoiceCommand(userMsg);
    
    if (intent.type !== 'UNKNOWN' && intent.type !== 'NAVIGATE_PAGE') {
      processIntent(intent);
    } else {
      // Fallback simple keyword matching if parser returns unknown (or for simple chat)
      setTimeout(() => {
        let response = "I've noted that. Is there anything else?";
        if (userMsg.toLowerCase().includes('schedule')) response = "I'll check your calendar. It looks like you have a slot open at 2 PM on Tuesday. Shall I send the invite?";
        else if (userMsg.toLowerCase().includes('bill')) response = "I'm tracking 4 new updates on the Energy Infrastructure Bill. Would you like a summary?";
        else if (userMsg.toLowerCase().includes('email')) response = "I can draft that email for you. Who is the recipient?";
        
        setChatHistory(prev => [...prev, { role: 'assistant', text: response, timestamp: Date.now() }]);
      }, 1000);
    }
  };

  const handleAddNote = () => {
    if (!quickNote.trim()) return;
    setNotes(prev => [{ id: Date.now().toString(), text: quickNote, date: new Date() }, ...prev]);
    setQuickNote('');
  };

  const highPriorityUpdates = sampleNotifications.filter(n => n.priority === 'Urgent' || n.priority === 'ActionNeeded').slice(0, 3);

  const sidebarContent = (
    <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/5 backdrop-blur-[1px] pointer-events-auto"
            />

            {/* Sidebar */}
            <motion.div
              ref={sidebarRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`
                w-full max-w-md h-full shadow-2xl pointer-events-auto flex flex-col border-l
                ${isDarkMode ? 'bg-[#0F172A]/95 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-900'}
              `}
              style={{ backdropFilter: 'blur(12px)' }}
            >
              {/* Header */}
              <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg leading-tight">Revere Assistant</h2>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Always on. Always ready.</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className={`flex border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview' 
                      ? (isDarkMode ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-700')
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'chat'
                      ? (isDarkMode ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-700')
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'notes'
                      ? (isDarkMode ? 'border-purple-500 text-purple-400' : 'border-purple-600 text-purple-700')
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Greeting */}
                    <div>
                      <h3 className="text-2xl font-light mb-1">Good afternoon, <span className="font-semibold">{currentUser?.firstName || 'User'}</span>.</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        You have {highPriorityUpdates.length} urgent updates pending your review.
                      </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={isListening ? stopListening : () => startListening('assistant')}
                        className={`
                          p-4 rounded-xl border flex flex-col gap-3 transition-all hover:scale-[1.02]
                          ${isListening
                            ? (isDarkMode ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-red-50 border-red-200 text-red-600')
                            : (isDarkMode ? 'bg-white/5 border-white/10 hover:border-purple-500/30' : 'bg-gray-50 border-gray-200 hover:border-purple-300')
                          }
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
                          {isListening && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-sm">Voice Command</div>
                          <div className="text-xs opacity-70">{isListening ? 'Listening...' : 'Tap to speak'}</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => { onClose(); onRecordMeeting(); }}
                        className={`
                          p-4 rounded-xl border flex flex-col gap-3 transition-all hover:scale-[1.02]
                          ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-purple-500/30' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}
                        `}
                      >
                        <Radio size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Record Meeting</div>
                          <div className="text-xs opacity-70">Transcribe & analyze</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => { onClose(); onOpenPythia(); }}
                        className={`
                          p-4 rounded-xl border flex flex-col gap-3 transition-all hover:scale-[1.02]
                          ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-purple-500/30' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}
                        `}
                      >
                        <Sparkles size={20} className="text-amber-400" />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Ask Revere</div>
                          <div className="text-xs opacity-70">Deep intelligence</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => setActiveTab('notes')}
                        className={`
                          p-4 rounded-xl border flex flex-col gap-3 transition-all hover:scale-[1.02]
                          ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-purple-500/30' : 'bg-gray-50 border-gray-200 hover:border-purple-300'}
                        `}
                      >
                        <FileText size={20} />
                        <div className="text-left">
                          <div className="font-semibold text-sm">Draft Note</div>
                          <div className="text-xs opacity-70">Quick capture</div>
                        </div>
                      </button>
                    </div>

                    {/* Missed Updates Section */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">Missed Updates</h4>
                        <button className="text-xs text-purple-500 hover:underline">View All</button>
                      </div>
                      <div className="space-y-3">
                        {highPriorityUpdates.map(update => (
                          <div 
                            key={update.id}
                            className={`
                              p-3 rounded-lg border flex gap-3 transition-colors
                              ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50'}
                            `}
                          >
                            <div className={`
                              mt-1 min-w-[8px] h-2 rounded-full
                              ${update.priority === 'Urgent' ? 'bg-red-500' : 'bg-amber-500'}
                            `} />
                            <div>
                              <div className="text-sm font-medium leading-snug mb-1">{update.message}</div>
                              <div className="text-xs opacity-60 flex items-center gap-2">
                                <Clock size={10} />
                                <span>{update.time}</span>
                                <span>•</span>
                                <span>{update.source}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'chat' && (
                  <div className="h-full flex flex-col -mx-6 -my-6">
                    {/* Chat Messages Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
                      {chatHistory.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className={`w-16 h-16 rounded-2xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} flex items-center justify-center mb-4`}>
                            <Sparkles className="w-8 h-8 text-purple-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">Start a conversation</h3>
                          <p className="text-sm text-gray-500 max-w-md text-center">
                            Ask me anything or use voice commands to get started.
                          </p>
                        </div>
                      )}

                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className="mb-6">
                          {msg.role === 'user' ? (
                            // User Question
                            <div className="mb-4">
                              <div className={`inline-block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {msg.text}
                                </p>
                              </div>
                              <p className={`text-xs mt-1 ml-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ) : (
                            // Assistant Response
                            <div className={`ml-4 pl-4 border-l-2 ${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
                              <div className="flex items-start gap-2 mb-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {msg.text}
                                  </p>
                                </div>
                              </div>

                              {/* Component Card if present */}
                              {msg.component && (
                                <div className="mt-3 animate-in fade-in zoom-in-95 duration-300">
                                  {msg.component}
                                </div>
                              )}

                              {/* Key Takeaways */}
                              {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
                                <div className={`mt-4 rounded-lg p-4 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                                  <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-purple-400' : 'text-purple-900'}`}>
                                    Key Takeaways
                                  </h4>
                                  <ul className="space-y-1.5">
                                    {msg.keyTakeaways.map((takeaway, i) => (
                                      <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                        <span className={`mt-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`}>•</span>
                                        <span>{takeaway}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Recommended Actions */}
                              {msg.recommendedActions && msg.recommendedActions.length > 0 && (
                                <div className="mt-4">
                                  <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                                    Recommended Actions
                                  </h4>
                                  <div className="space-y-2">
                                    {msg.recommendedActions.map((action, i) => (
                                      <button
                                        key={i}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all group border ${
                                          isDarkMode 
                                            ? 'bg-white/5 hover:bg-purple-500/10 border-white/10 hover:border-purple-500/30' 
                                            : 'bg-white hover:bg-purple-50 border-gray-200 hover:border-purple-300'
                                        }`}
                                      >
                                        <span className={`text-sm font-medium ${
                                          isDarkMode 
                                            ? 'text-white group-hover:text-purple-400' 
                                            : 'text-gray-900 group-hover:text-purple-900'
                                        }`}>
                                          {action.label}
                                        </span>
                                        <ArrowRight className={`w-4 h-4 ${
                                          isDarkMode 
                                            ? 'text-gray-500 group-hover:text-purple-400' 
                                            : 'text-gray-400 group-hover:text-purple-600'
                                        }`} />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Sources Used */}
                              {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4">
                                  <h4 className={`text-xs font-bold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                                    Sources Used
                                  </h4>
                                  <div className="space-y-2">
                                    {msg.sources.map((source, i) => (
                                      <button
                                        key={i}
                                        className={`w-full text-left rounded-lg p-3 transition-all group border ${
                                          isDarkMode 
                                            ? 'bg-white/5 hover:bg-blue-500/10 border-white/10 hover:border-blue-500/30' 
                                            : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                                        }`}
                                      >
                                        <div className="flex items-start gap-2 mb-1.5">
                                          <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                          }`} />
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                              <h4 className={`text-xs font-semibold leading-snug ${
                                                isDarkMode 
                                                  ? 'text-white group-hover:text-blue-400' 
                                                  : 'text-gray-900 group-hover:text-blue-900'
                                              }`}>
                                                {source.title}
                                              </h4>
                                              <ExternalLink className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                                                isDarkMode 
                                                  ? 'text-gray-500 group-hover:text-blue-400' 
                                                  : 'text-gray-400 group-hover:text-blue-600'
                                              }`} />
                                            </div>
                                          </div>
                                        </div>
                                        <p className={`text-xs mb-1.5 line-clamp-2 leading-relaxed ${
                                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                          {source.snippet}
                                        </p>
                                        <p className={`text-xs font-medium ${
                                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                          {source.metadata}
                                        </p>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input Footer */}
                    <div className={`px-6 py-4 border-t ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="relative">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          placeholder="Type a command..."
                          className={`
                            w-full pl-4 pr-12 py-3 rounded-xl outline-none border transition-all
                            ${isDarkMode 
                              ? 'bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder-gray-500' 
                              : 'bg-white border-gray-200 focus:border-purple-500 text-gray-900 placeholder-gray-400'
                            }
                          `}
                        />
                        <button 
                          onClick={handleSendChat}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-purple-500 hover:bg-purple-500/10 transition-colors"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <kbd className={`px-2 py-0.5 rounded text-xs font-mono ${
                            isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-600'
                          }`}>⌘</kbd>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>+</span>
                          <kbd className={`px-2 py-0.5 rounded text-xs font-mono ${
                            isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-600'
                          }`}>K</kbd>
                          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>to open</span>
                        </div>
                        <button 
                          onClick={() => setChatHistory([{
                            role: 'assistant',
                            text: 'Hello! I am your executive assistant. I can help you manage your workflow, track legislation, and draft communications. How can I assist you today?',
                            timestamp: Date.now()
                          }])}
                          className="text-xs text-purple-500 hover:underline"
                        >
                          Clear conversation
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                     <div className="relative">
                      <textarea
                        value={quickNote}
                        onChange={(e) => setQuickNote(e.target.value)}
                        placeholder="Jot down a quick note..."
                        rows={3}
                        className={`
                          w-full p-4 rounded-xl outline-none border resize-none transition-all
                          ${isDarkMode 
                            ? 'bg-white/5 border-white/10 focus:border-purple-500 text-white placeholder-gray-500' 
                            : 'bg-white border-gray-200 focus:border-purple-500 text-gray-900 placeholder-gray-400'
                          }
                        `}
                      />
                      <div className="flex justify-end mt-2">
                        <button 
                          onClick={handleAddNote}
                          disabled={!quickNote.trim()}
                          className={`
                            px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all
                            ${quickNote.trim()
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-white/10 dark:text-gray-600'
                            }
                          `}
                        >
                          Save Note
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider opacity-70">Saved Notes</h4>
                      {notes.length === 0 ? (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          <FileText size={32} className="mx-auto mb-2 opacity-50" />
                          <p>No notes yet.</p>
                        </div>
                      ) : (
                        notes.map(note => (
                          <div 
                            key={note.id} 
                            className={`p-4 rounded-xl border relative group ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                          >
                            <p className="text-sm leading-relaxed mb-2">{note.text}</p>
                            <p className="text-xs opacity-50">{note.date.toLocaleDateString()} • {note.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            <button 
                              onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
                              className="absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                 <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                    <span className="text-xs font-medium opacity-70">
                      {isListening ? 'Listening for commands...' : 'System Operational'}
                    </span>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(sidebarContent, document.body);
}
