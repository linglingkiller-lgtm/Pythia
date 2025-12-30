import React from 'react';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-3xl max-h-[80vh] rounded-lg shadow-2xl overflow-hidden ${
          isDarkMode
            ? 'bg-slate-900 border border-white/10'
            : 'bg-white border border-gray-200'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Export Predictive Brief
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {legislatorName} • {issue.issue} • {activeSubIssue.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-slate-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={`p-4 overflow-y-auto max-h-[calc(80vh-180px)] ${
          isDarkMode ? 'bg-slate-950' : 'bg-gray-50'
        }`}>
          <pre className={`text-xs font-mono whitespace-pre-wrap ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {briefText}
          </pre>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {copied && (
              <span className="flex items-center gap-1 text-green-500">
                <CheckCircle size={14} />
                Copied to clipboard!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              <Copy size={14} />
              Copy Text
            </button>
            <button
              onClick={handleDownload}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-blue-600/90 text-white hover:bg-blue-600 border border-blue-500/30'
                  : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700/20'
              }`}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
