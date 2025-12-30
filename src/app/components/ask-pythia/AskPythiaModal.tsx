import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, FileText, Building2, Clock, AlertCircle, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useAskPythia, PythiaSource, PythiaAction } from '../../contexts/AskPythiaContext';
import { useToast } from '../../contexts/ToastContext';

export function AskPythiaModal() {
  const { isOpen, closePythia, context, conversation, isLoading, askQuestion, clearConversation, setContext } = useAskPythia();
  const { showToast } = useToast();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setInputValue('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue('');
    await askQuestion(question);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputValue(prompt);
    inputRef.current?.focus();
  };

  const handleRemoveContext = () => {
    setContext({ type: 'global' });
  };

  const handleActionClick = (action: PythiaAction) => {
    if (action.actionType === 'save-record') {
      showToast('Analysis saved to Records', 'success');
    } else if (action.actionType === 'create-task') {
      showToast('Task bundle created', 'success');
    } else if (action.actionType === 'generate-brief') {
      showToast('Brief generated successfully', 'success');
    } else if (action.actionType === 'draft-update') {
      showToast('Client update drafted', 'success');
    } else if (action.actionType === 'pin-warroom') {
      showToast('Pinned to War Room', 'success');
    } else {
      showToast(`Action: ${action.label}`, 'info');
    }
  };

  const handleSourceClick = (source: PythiaSource) => {
    showToast(`Opening: ${source.title}`, 'info');
    // In real implementation, this would navigate to the actual page
  };

  if (!isOpen) return null;

  const suggestedPrompts = [
    "Summarize what changed this week",
    "What deliverables are at risk?",
    "What's the recommended next action on HB 247?",
    "Generate a client update draft"
  ];

  const getContextLabel = () => {
    if (context.type === 'global') return 'Global';
    if (context.label) return context.label;
    if (context.type === 'bill') return `Bill: ${context.id}`;
    if (context.type === 'client') return `Client: ${context.id}`;
    if (context.type === 'warroom') return 'War Room';
    if (context.type === 'records') return 'Records';
    if (context.type === 'tasks') return 'Tasks';
    return 'Context';
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'bill': return <FileText className="w-3.5 h-3.5 text-blue-600" />;
      case 'client': return <Building2 className="w-3.5 h-3.5 text-green-600" />;
      case 'task': return <CheckCircle className="w-3.5 h-3.5 text-purple-600" />;
      case 'record': return <FileText className="w-3.5 h-3.5 text-gray-600" />;
      default: return <FileText className="w-3.5 h-3.5 text-gray-600" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100000] flex items-start justify-center pt-20 px-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={closePythia}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ 
          border: '1px solid rgba(139, 92, 246, 0.2)',
          boxShadow: '0 0 40px rgba(139, 92, 246, 0.15), 0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-bold text-gray-900">Ask Pythia</h2>
            </div>

            {/* Context chip */}
            <div className="flex items-center gap-2">
              <div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: context.type === 'global' ? '#f3f4f6' : '#ede9fe',
                  color: context.type === 'global' ? '#6b7280' : '#7c3aed'
                }}
              >
                {getContextLabel()}
                {context.type !== 'global' && (
                  <button 
                    onClick={handleRemoveContext}
                    className="ml-1 hover:bg-white/50 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={closePythia}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-b border-gray-200">
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about bills, clients, tasks, records…"
              disabled={isLoading}
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
            />
          </form>

          {/* Suggested prompts */}
          {conversation.length === 0 && !isLoading && (
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Two-pane results area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Answer thread */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {conversation.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ask Pythia anything</h3>
                <p className="text-sm text-gray-500 max-w-md">
                  Get intelligent answers with citations from your bills, clients, records, legislators, and tasks. 
                  Try a suggested prompt or ask your own question.
                </p>
              </div>
            )}

            {conversation.map((turn, idx) => (
              <div key={idx} className="mb-6">
                {/* Question */}
                <div className="mb-4">
                  <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{turn.question}</p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-4">
                    {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Answer */}
                <div className="ml-4 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">{turn.answer.answer}</p>
                    </div>
                  </div>

                  {/* Key takeaways */}
                  {turn.answer.keyTakeaways.length > 0 && (
                    <div className="mt-4 bg-purple-50 rounded-lg p-4">
                      <h4 className="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wide">Key Takeaways</h4>
                      <ul className="space-y-1.5">
                        {turn.answer.keyTakeaways.map((takeaway, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-purple-800">
                            <span className="text-purple-500 mt-1">•</span>
                            <span>{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="mb-6">
                <div className="mb-4">
                  <div className="inline-block px-4 py-2 bg-gray-100 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">{inputValue}</p>
                  </div>
                </div>

                <div className="ml-4 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center animate-slow-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Sources + Actions */}
          {conversation.length > 0 && (
            <div className="w-80 border-l border-gray-200 overflow-y-auto bg-gray-50 px-4 py-4">
              {/* Latest answer sources and actions */}
              {conversation.length > 0 && (() => {
                const latestTurn = conversation[conversation.length - 1];
                
                return (
                  <>
                    {/* Recommended actions */}
                    {latestTurn.answer.recommendedActions.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Recommended Actions</h3>
                        <div className="space-y-2">
                          {latestTurn.answer.recommendedActions.map((action, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(action)}
                              className="w-full flex items-center justify-between px-3 py-2.5 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-lg text-left transition-all group"
                            >
                              <span className="text-sm font-medium text-gray-900 group-hover:text-purple-900">
                                {action.label}
                              </span>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Sources used */}
                    {latestTurn.answer.citations.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wide">Sources Used</h3>
                        <div className="space-y-2">
                          {latestTurn.answer.citations.map((source, i) => (
                            <button
                              key={i}
                              onClick={() => handleSourceClick(source)}
                              className="w-full text-left bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-3 transition-all group"
                            >
                              <div className="flex items-start gap-2 mb-1.5">
                                {getSourceIcon(source.objectType)}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-xs font-semibold text-gray-900 group-hover:text-blue-900 leading-snug">
                                      {source.title}
                                    </h4>
                                    <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-0.5" />
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mb-1.5 line-clamp-2 leading-relaxed">
                                {source.snippet}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">
                                {source.metadata}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Related sources */}
                    {latestTurn.answer.relatedSources && latestTurn.answer.relatedSources.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Related (Not Used)</h3>
                        <div className="space-y-2">
                          {latestTurn.answer.relatedSources.map((source, i) => (
                            <button
                              key={i}
                              onClick={() => handleSourceClick(source)}
                              className="w-full text-left bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-3 transition-all opacity-75 hover:opacity-100"
                            >
                              <div className="flex items-start gap-2 mb-1">
                                {getSourceIcon(source.objectType)}
                                <h4 className="text-xs font-semibold text-gray-700 leading-snug flex-1">
                                  {source.title}
                                </h4>
                              </div>
                              <p className="text-xs text-gray-400 font-medium">
                                {source.metadata}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500">
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">⌘</kbd>
                <span className="mx-1">+</span>
                <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-xs font-mono">K</kbd>
                <span className="ml-2">to open</span>
              </p>
              {conversation.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear conversation
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Pythia Intelligence • {conversation.length} {conversation.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}