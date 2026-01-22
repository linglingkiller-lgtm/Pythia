import React from 'react';
import { createPortal } from 'react-dom';
import { X, Mic, Command } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface VoiceCommandsReferenceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceCommandsReference({ isOpen, onClose }: VoiceCommandsReferenceProps) {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  const commandCategories = [
    {
      title: "Navigation",
      commands: [
        { phrase: "Go to Dashboard", desc: "Navigates to the main dashboard" },
        { phrase: "Show me Legislators", desc: "Opens the Legislator directory" },
        { phrase: "Open War Room", desc: "Navigates to the War Room view" },
        { phrase: "Go to Settings", desc: "Opens app settings" }
      ]
    },
    {
      title: "Legislative Intelligence",
      commands: [
        { phrase: "Summarize HR 503", desc: "Generates an executive summary of a bill" },
        { phrase: "Decipher Bill [Number]", desc: "Explains bill content in plain English" },
        { phrase: "What happens if Florida flips nay?", desc: "Runs a vote simulation" },
        { phrase: "Compare Senate vs House version", desc: "Shows a redline comparison" }
      ]
    },
    {
      title: "Stakeholder Operations",
      commands: [
        { phrase: "Who is Senator Blackwell?", desc: "Shows a comprehensive dossier" },
        { phrase: "Prepare me for Senator Chen", desc: "Generates a meeting brief" },
        { phrase: "Who knows Representative Smith?", desc: "Finds connection pathways" }
      ]
    },
    {
      title: "Executive Secretariat",
      commands: [
        { phrase: "Create task: Call the donor", desc: "Adds a new item to your task list" },
        { phrase: "Remind me to email the team", desc: "Sets a reminder" },
        { phrase: "Catch me up", desc: "Generates a morning briefing summary" },
        { phrase: "Prep me for the strategy meeting", desc: "Compiles documents and profiles" }
      ]
    },
    {
      title: "Communication",
      commands: [
        { phrase: "Draft a message to Sarah", desc: "Starts a new message draft" },
        { phrase: "Send a message to the team", desc: "Opens the messenger" }
      ]
    }
  ];

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className={`
          relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border flex flex-col
          ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-gray-200'}
        `}
      >
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <Mic size={24} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Voice Command Reference</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Available commands for the Revere Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="space-y-8">
            {commandCategories.map((category, idx) => (
              <div key={idx}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Command size={14} />
                  {category.title}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.commands.map((cmd, cIdx) => (
                    <div 
                      key={cIdx} 
                      className={`
                        p-4 rounded-xl border transition-all hover:scale-[1.01]
                        ${isDarkMode 
                          ? 'bg-white/5 border-white/10 hover:border-purple-500/30' 
                          : 'bg-gray-50 border-gray-200 hover:border-purple-300'
                        }
                      `}
                    >
                      <div className={`font-medium mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                        "{cmd.phrase}"
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {cmd.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-8 p-4 rounded-xl text-center text-sm ${isDarkMode ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
            <span className="font-bold">Pro Tip:</span> You can speak naturally. The Assistant is designed to understand context and intent, not just exact keywords.
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
