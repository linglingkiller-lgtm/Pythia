import React from 'react';
import { createPortal } from 'react-dom';
import { Issue, SubIssue } from '../../../../demo/legislatorPredictiveInsightsDemo';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { X, Copy, CheckCircle, Download } from 'lucide-react';

interface ExportBriefModalProps {
  issue: Issue;
  subIssue: SubIssue | null;
  legislatorName: string;
  onClose: () => void;
}

export function ExportBriefModal({ issue, subIssue, legislatorName, onClose }: ExportBriefModalProps) {
  const { isDarkMode } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const activeSubIssue = subIssue || issue.subissues[0];

  const briefText = `
PREDICTIVE BRIEF - ${issue.issue}
Legislator: ${legislatorName}
Sub-Issue: ${activeSubIssue.name}
Generated: ${new Date().toLocaleDateString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PREDICTED STANCE
${activeSubIssue.stance} (${activeSubIssue.confidence}% confidence)

SUMMARY
${activeSubIssue.summary}

SUPPORTING EVIDENCE (${activeSubIssue.evidence.length} votes analyzed)

${activeSubIssue.evidence.map((ev, i) => `
${i + 1}. ${ev.label}
   Date: ${new Date(ev.date).toLocaleDateString()}
   Vote: ${ev.vote}
   Weight: ${ev.weight.toUpperCase()}
   Tags: ${ev.tags.join(', ')}
   
   Why it matters: ${ev.why_it_matters}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DISCLAIMER
This is a DEMO prediction based on sample data. Not for actual advocacy use.
Replace with real vote records and validated models before deployment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([briefText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `predictive-brief-${legislatorName.replace(/\s+/g, '-')}-${issue.issue.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full modal-responsive-lg rounded-2xl shadow-2xl overflow-hidden relative ${
          isDarkMode
            ? 'bg-slate-900/95 border border-white/10'
            : 'bg-white/95 border border-gray-200'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Gradient Overlay */}
        <div 
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.08) 50%, transparent 100%)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.04) 50%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div className={`relative flex items-start justify-between p-6 border-b backdrop-blur-xl ${
          isDarkMode ? 'border-white/10 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'
        }`}>
          <div className="flex items-start gap-4">
            {/* Icon Badge */}
            <div 
              className={`flex items-center justify-center w-12 h-12 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30' 
                  : 'bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 0 20px rgba(59, 130, 246, 0.15)' 
                  : '0 0 12px rgba(59, 130, 246, 0.1)'
              }}
            >
              <Download className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            
            <div>
              <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Predictive Intelligence Brief
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {legislatorName}
                </span>
                <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {issue.issue}
                </span>
                {activeSubIssue && (
                  <>
                    <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activeSubIssue.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all hover:scale-105 ${
              isDarkMode
                ? 'hover:bg-slate-700/50 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-8 overflow-y-auto max-h-[calc(90vh-200px)] scroll-smooth ${
          isDarkMode ? 'bg-slate-950/50' : 'bg-gray-50/30'
        }`}>
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Info Card */}
            <div className={`rounded-xl border p-6 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Legislator
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {legislatorName}
                  </div>
                </div>
                <div>
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Generated
                  </div>
                  <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>

            {/* Predicted Stance Section */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Predicted Stance
              </h3>
              <div className={`rounded-xl border p-6 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activeSubIssue.stance}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      on {activeSubIssue.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {activeSubIssue.confidence}%
                    </div>
                    <div className={`text-xs uppercase tracking-wide ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Confidence
                    </div>
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-full transition-all ${
                      activeSubIssue.confidence >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      activeSubIssue.confidence >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                      'bg-gradient-to-r from-yellow-500 to-orange-500'
                    }`}
                    style={{ width: `${activeSubIssue.confidence}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                isDarkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                Executive Summary
              </h3>
              <div className={`rounded-xl border p-6 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activeSubIssue.summary}
                </p>
              </div>
            </div>

            {/* Evidence Section */}
            <div>
              <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                Supporting Evidence
                <span className={`ml-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  ({activeSubIssue.evidence.length} votes analyzed)
                </span>
              </h3>
              <div className="space-y-4">
                {activeSubIssue.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-5 ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-white/10' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {i + 1}. {ev.label}
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {new Date(ev.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                          ev.vote === 'Yea' 
                            ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                            : ev.vote === 'Nay'
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : 'bg-gray-500/20 text-gray-500 border border-gray-500/30'
                        }`}>
                          {ev.vote}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                          ev.weight === 'strong' 
                            ? isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                            : isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ev.weight}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-sm mb-3 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {ev.why_it_matters}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {ev.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            isDarkMode 
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className={`rounded-xl border p-6 ${
              isDarkMode 
                ? 'bg-yellow-500/5 border-yellow-500/20' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className={`text-sm font-bold uppercase tracking-wider mb-2 ${
                isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
              }`}>
                ⚠️ Disclaimer
              </div>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-yellow-200/80' : 'text-yellow-800'}`}>
                This is a <strong>DEMO prediction</strong> based on sample data. Not for actual advocacy use.
                Replace with real vote records and validated models before deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-6 border-t backdrop-blur-xl ${
          isDarkMode ? 'border-white/10 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {copied && (
              <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-green-500 font-medium"
              >
                <CheckCircle size={16} />
                Copied to clipboard!
              </motion.span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                isDarkMode
                  ? 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border border-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Copy size={16} />
              Copy Text
            </button>
            <button
              onClick={handleDownload}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
                isDarkMode
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-blue-500/30'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border border-blue-700/20'
              }`}
              style={{
                boxShadow: isDarkMode 
                  ? '0 4px 16px rgba(59, 130, 246, 0.25)' 
                  : '0 2px 12px rgba(59, 130, 246, 0.2)'
              }}
            >
              <Download size={16} />
              Download Brief
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}