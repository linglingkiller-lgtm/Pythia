import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from 'react-dom';
import { Mic, Square, Save, CheckCircle, RotateCcw, FileText, Sparkles, Plus, ListTodo, X } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';
import { useTheme } from '../../contexts/ThemeContext';
import { generateMeetingAnalysis, MeetingAnalysis } from '../../utils/meetingIntelligence';
import { toast } from 'sonner';

interface MeetingRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MeetingRecorderModal({ isOpen, onClose }: MeetingRecorderModalProps) {
  const { isDarkMode } = useTheme();
  const { startListening, stopListening, isListening, meetingTranscript, transcript, resetTranscript } = useVoice();
  
  const [step, setStep] = useState<'recording' | 'analyzing' | 'review'>('recording');
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isListening && step === 'recording') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isListening, step]);

  // Initial start
  useEffect(() => {
    if (isOpen && step === 'recording') {
      startListening('meeting');
    } else if (!isOpen) {
      stopListening();
      setElapsedTime(0);
      setStep('recording');
    }
  }, [isOpen]); 

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopRecording = async () => {
    stopListening();
    setStep('analyzing');
    
    // Simulate analyzing the transcript
    const result = await generateMeetingAnalysis(meetingTranscript || "Meeting transcript placeholder.");
    setAnalysis(result);
    setStep('review');
  };

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSave = () => {
    // Logic to save to Records (mock)
    toast.success("Meeting saved to Records");
    
    if (selectedTasks.length > 0) {
      toast.success(`${selectedTasks.length} tasks created`);
    }
    
    onClose();
  };

  const handleDiscard = () => {
    resetTranscript();
    setElapsedTime(0);
    setStep('recording');
    startListening('meeting');
  };

  // Render using Portal for proper z-indexing overlay
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
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
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`
              relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col
              ${isDarkMode ? 'bg-[#0F1115] border border-white/10' : 'bg-white border border-gray-200'}
            `}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                   <Mic size={20} />
                </div>
                <div>
                  <h2 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {step === 'review' ? 'Meeting Intelligence' : 'Meeting Recorder'}
                  </h2>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                     {step === 'review' ? 'AI Analysis & Tasks' : 'Strategic Workflow Engine V2'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 {step === 'recording' && (
                   <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                     <span className="text-sm font-mono font-medium">{formatTime(elapsedTime)}</span>
                   </div>
                 )}
                 <button onClick={onClose} className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors`}>
                    <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                 </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto min-h-[400px]">
               {step === 'recording' && (
                 <div className="flex flex-col h-full p-8 items-center justify-center text-center">
                    <div className="mb-8 relative">
                       {/* Wave Animation */}
                       <div className="flex items-center gap-1 h-16">
                          {[...Array(12)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [10, 40 + Math.random() * 40, 10] }}
                              transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                              className={`w-2 rounded-full ${isDarkMode ? 'bg-indigo-500' : 'bg-indigo-600'}`}
                            />
                          ))}
                       </div>
                    </div>
                    
                    <h3 className={`text-xl font-medium mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Listening...
                    </h3>
                    
                    <div className={`max-w-2xl text-lg leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {meetingTranscript || "Start speaking..."} <span className="opacity-50">{transcript}</span>
                    </div>
                 </div>
               )}

               {step === 'analyzing' && (
                 <div className="flex flex-col h-full items-center justify-center gap-6">
                    <div className="relative w-24 h-24">
                       <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                       <Sparkles className={`absolute inset-0 m-auto ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    </div>
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Analyzing Transcript...
                    </h3>
                 </div>
               )}

               {step === 'review' && analysis && (
                 <div className="flex flex-col lg:flex-row h-full">
                    {/* Left: Transcript & Summary */}
                    <div className={`flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                       <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-4">Executive Summary</h3>
                       <div className={`p-4 rounded-xl mb-8 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-100'}`}>
                          <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {analysis.summary}
                          </p>
                       </div>

                       <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 mb-4">Full Transcript</h3>
                       <div className={`h-[300px] overflow-y-auto p-4 rounded-xl text-sm ${isDarkMode ? 'bg-black/20 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                          {meetingTranscript}
                       </div>
                    </div>

                    {/* Right: Actions & Tasks */}
                    <div className="flex-1 p-6 lg:p-8">
                       <h3 className="text-sm font-bold uppercase tracking-wider text-green-500 mb-4 flex items-center gap-2">
                         <ListTodo size={16} /> Recommended Tasks
                       </h3>
                       
                       <div className="space-y-3 mb-8">
                          {analysis.tasks.map(task => (
                            <div 
                              key={task.id}
                              onClick={() => handleTaskToggle(task.id)}
                              className={`
                                flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all
                                ${selectedTasks.includes(task.id)
                                  ? (isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200')
                                  : (isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-gray-100 hover:bg-gray-50')
                                }
                              `}
                            >
                              <div className={`
                                mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors
                                ${selectedTasks.includes(task.id)
                                  ? 'bg-indigo-500 border-indigo-500 text-white'
                                  : (isDarkMode ? 'border-gray-600' : 'border-gray-300')
                                }
                              `}>
                                {selectedTasks.includes(task.id) && <CheckCircle size={14} />}
                              </div>
                              <div className="flex-1">
                                 <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                                 <div className="flex items-center gap-2 mt-1">
                                   <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{task.priority}</span>
                                   {task.assignee && <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{task.assignee}</span>}
                                 </div>
                              </div>
                            </div>
                          ))}
                       </div>

                       <h3 className="text-sm font-bold uppercase tracking-wider text-purple-500 mb-4 flex items-center gap-2">
                         <Sparkles size={16} /> Key Insights
                       </h3>
                       <ul className="space-y-2">
                          {analysis.insights.map((insight, i) => (
                            <li key={i} className={`flex gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                               <span className="text-purple-500">•</span> {insight}
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>
               )}
            </div>

            {/* Footer Actions */}
            <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-white/5 bg-[#0F1115]' : 'border-gray-100 bg-gray-50'}`}>
               {step === 'recording' ? (
                 <>
                   <button onClick={onClose} className={`px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
                     Cancel
                   </button>
                   <button 
                     onClick={handleStopRecording}
                     className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/20 transition-all"
                   >
                     <Square size={16} fill="currentColor" /> Stop & Analyze
                   </button>
                 </>
               ) : step === 'review' ? (
                 <>
                   <button 
                     onClick={handleDiscard}
                     className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                   >
                     <RotateCcw size={16} /> New Recording
                   </button>
                   <div className="flex items-center gap-3">
                     <button 
                        onClick={handleSave}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}
                     >
                        <Save size={16} /> Save & Create Tasks
                     </button>
                   </div>
                 </>
               ) : (
                 <div />
               )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
