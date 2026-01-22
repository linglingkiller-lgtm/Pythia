import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Save, Sparkles, CheckSquare, Clock, ArrowRight, FileText, Loader2, X } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'sonner';

interface TaskRecommendation {
  id: string;
  title: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  selected: boolean;
}

interface MeetingAnalysis {
  summary: string;
  keyInsights: string[];
  tasks: TaskRecommendation[];
  sentiment: 'Positive' | 'Neutral' | 'Critical';
}

interface MeetingIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingIntelligenceModal({ isOpen, onClose }: MeetingIntelligenceModalProps) {
  const { isDarkMode } = useTheme();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  
  const [step, setStep] = useState<'recording' | 'analyzing' | 'results'>('recording');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isOpen && step === 'recording' && isListening) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, isListening]);

  // Auto-scroll transcript
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  // Start recording on open
  useEffect(() => {
    if (isOpen) {
      setStep('recording');
      setElapsedTime(0);
      setAnalysis(null);
      // Start in dictation mode
      startListening({ mode: 'dictation' });
    } else {
      stopListening();
    }
  }, [isOpen, startListening, stopListening]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopAndAnalyze = async () => {
    stopListening();
    setStep('analyzing');
    
    // Simulate API Analysis Delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock Analysis Generation
    const mockAnalysis: MeetingAnalysis = {
      summary: "This meeting focused on the strategic alignment for the upcoming legislative session, specifically regarding HB 247. The team identified key concerns about the amendment timeline and agreed to prioritize outreach to the Energy Committee swing votes.",
      keyInsights: [
        "Amendment timeline for HB 247 is tighter than expected (Dec 28 deadline).",
        "Senator Thompson is identified as the critical swing vote.",
        "Desert Solar Coalition needs technical briefing materials by Friday."
      ],
      tasks: [
        { id: '1', title: 'Draft technical brief for Sen. Thompson', assignee: 'Policy Team', priority: 'High', selected: true },
        { id: '2', title: 'Schedule follow-up with Desert Solar Coalition', assignee: 'Maria Garcia', priority: 'Medium', selected: true },
        { id: '3', title: 'Review amendment text for Section 4(b)', assignee: 'Legal', priority: 'High', selected: false },
        { id: '4', title: 'Update legislative tracking dashboard', assignee: 'Ops', priority: 'Low', selected: false }
      ],
      sentiment: 'Neutral'
    };
    
    setAnalysis(mockAnalysis);
    setStep('results');
  };

  const handleTaskToggle = (id: string) => {
    if (!analysis) return;
    const updatedTasks = analysis.tasks.map(t => 
      t.id === id ? { ...t, selected: !t.selected } : t
    );
    setAnalysis({ ...analysis, tasks: updatedTasks });
  };

  const handleSaveActions = () => {
    if (!analysis) return;
    const selectedTaskCount = analysis.tasks.filter(t => t.selected).length;
    toast.success(`Generated ${selectedTaskCount} tasks and saved transcript to Records.`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className={`
          relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col
          ${isDarkMode ? 'bg-[#121212] border border-white/10' : 'bg-white border border-gray-200'}
        `}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
              <Mic size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Meeting Intelligence
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {step === 'recording' ? 'Listening & Transcribing...' : 'Analysis & Action Items'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Panel: Transcript / Visualizer */}
          <div className={`flex-1 flex flex-col border-r ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex-1 overflow-y-auto p-8 relative" ref={scrollRef}>
              {transcript ? (
                <p className={`text-lg leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {transcript}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-pulse mb-4" />
                  <p>Waiting for speech...</p>
                </div>
              )}
            </div>

            {/* Bottom Bar (Timer & Controls) */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="font-mono text-xl font-medium">{formatTime(elapsedTime)}</span>
                </div>

                {step === 'recording' && (
                  <button
                    onClick={handleStopAndAnalyze}
                    className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-red-500/25"
                  >
                    <Square size={18} fill="currentColor" />
                    <span>Stop & Analyze</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Analysis Results */}
          <AnimatePresence mode="wait">
            {step === 'analyzing' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full md:w-[400px] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse" />
                  <Loader2 size={48} className="text-indigo-500 animate-spin relative z-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Conversation</h3>
                <p className="text-gray-500">Extracting insights and action items...</p>
              </motion.div>
            )}

            {step === 'results' && analysis && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full md:w-[400px] flex flex-col h-full bg-opacity-50"
              >
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Summary Card */}
                  <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-2 mb-3 text-indigo-500">
                      <Sparkles size={16} />
                      <h4 className="text-xs font-bold uppercase tracking-wider">Executive Summary</h4>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {analysis.summary}
                    </p>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Key Insights</h4>
                    <ul className="space-y-3">
                      {analysis.keyInsights.map((insight, idx) => (
                        <li key={idx} className="flex gap-3 text-sm">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-none" />
                          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tasks */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recommended Tasks</h4>
                    <div className="space-y-2">
                      {analysis.tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => handleTaskToggle(task.id)}
                          className={`
                            p-3 rounded-lg border cursor-pointer transition-all
                            ${task.selected 
                              ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-indigo-50 border-indigo-200') 
                              : (isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-gray-200 hover:bg-gray-50')
                            }
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 ${task.selected ? 'text-indigo-500' : 'text-gray-400'}`}>
                              {task.selected ? <CheckSquare size={18} /> : <Square size={18} />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-gray-500">Assign: {task.assignee}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                                  task.priority === 'High' ? 'bg-red-500/20 text-red-500' : 
                                  task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                                  'bg-blue-500/20 text-blue-500'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className={`p-6 border-t ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                  <button 
                    onClick={handleSaveActions}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/25"
                  >
                    <Save size={18} />
                    <span>Save Transcript & Create Tasks</span>
                  </button>
                  <button 
                    onClick={() => {
                        setStep('recording');
                        setElapsedTime(0);
                        startListening({ mode: 'dictation' });
                    }}
                    className="w-full mt-3 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                  >
                    Discard & Start New Recording
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
