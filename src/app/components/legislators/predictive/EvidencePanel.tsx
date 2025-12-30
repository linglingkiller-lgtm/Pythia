import React from 'react';
import { Issue, SubIssue, EvidenceVote } from '../../../../demo/legislatorPredictiveInsightsDemo';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Star, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { Chip } from '../../ui/Chip';

interface EvidencePanelProps {
  issue: Issue | null;
  selectedSubIssue: string | null;
  onSelectSubIssue: (subIssueName: string) => void;
  onFollow: () => void;
  onExportBrief: () => void;
  isFollowing: boolean;
}

export function EvidencePanel({
  issue,
  selectedSubIssue,
  onSelectSubIssue,
  onFollow,
  onExportBrief,
  isFollowing
}: EvidencePanelProps) {
  const { isDarkMode } = useTheme();
  const [expandedEvidence, setExpandedEvidence] = React.useState<Set<string>>(new Set());

  if (!issue) {
    return (
      <div className={`rounded-lg border backdrop-blur-sm p-6 h-full flex items-center justify-center ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="text-center">
          <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select an issue to view evidence and predictions
          </p>
        </div>
      </div>
    );
  }

  const activeSubIssue = selectedSubIssue 
    ? issue.subissues.find(si => si.name === selectedSubIssue) 
    : issue.subissues[0];

  const toggleEvidence = (label: string) => {
    const newSet = new Set(expandedEvidence);
    if (newSet.has(label)) {
      newSet.delete(label);
    } else {
      newSet.add(label);
    }
    setExpandedEvidence(newSet);
  };

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'Strong Support': return 'success';
      case 'Lean Support': return 'info';
      case 'Mixed/Unclear': return 'neutral';
      case 'Lean Oppose': return 'warning';
      case 'Strong Oppose': return 'danger';
      default: return 'neutral';
    }
  };

  const getVoteColor = (vote: string) => {
    if (vote === 'Yea') return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (vote === 'Nay') return isDarkMode ? 'text-red-400' : 'text-red-600';
    return isDarkMode ? 'text-gray-400' : 'text-gray-600';
  };

  return (
    <div className={`rounded-lg border backdrop-blur-sm overflow-hidden ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      {/* Header - Stance & Confidence */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {issue.issue}
            </h3>
            <div className="flex items-center gap-2">
              <Chip variant={getStanceColor(activeSubIssue?.stance || issue.stance)} size="sm">
                {activeSubIssue?.stance || issue.stance}
              </Chip>
            </div>
          </div>
          <button
            onClick={onFollow}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isFollowing
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                : isDarkMode
                ? 'border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                : 'border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            <Star size={12} className={isFollowing ? 'fill-current' : ''} />
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Confidence meter */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Confidence Level
            </span>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeSubIssue?.confidence || issue.confidence}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${activeSubIssue?.confidence || issue.confidence}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full rounded-full ${
                (activeSubIssue?.confidence || issue.confidence) >= 80 ? 'bg-green-500' :
                (activeSubIssue?.confidence || issue.confidence) >= 60 ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Key Takeaways */}
      <div className={`p-4 border-b ${isDarkMode ? 'border-white/10 bg-slate-900/30' : 'border-gray-200 bg-gray-50'}`}>
        <h4 className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Key Takeaway
        </h4>
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {activeSubIssue?.summary || `Predicted ${issue.stance.toLowerCase()} based on ${issue.subissues.reduce((acc, si) => acc + si.evidence.length, 0)} vote signals.`}
        </p>
      </div>

      {/* Sub-issues chips */}
      {issue.subissues.length > 1 && (
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h4 className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sub-Issues
          </h4>
          <div className="flex flex-wrap gap-2">
            {issue.subissues.map((subIssue) => (
              <button
                key={subIssue.name}
                onClick={() => onSelectSubIssue(subIssue.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeSubIssue?.name === subIssue.name
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                    : isDarkMode
                    ? 'bg-slate-700/50 text-gray-400 border border-white/5 hover:border-white/10'
                    : 'bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {subIssue.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Evidence Cards - Scrollable */}
      <div className="p-4 max-h-[400px] overflow-y-auto">
        <h4 className={`text-xs font-bold uppercase tracking-wide mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Sample Evidence ({activeSubIssue?.evidence.length || 0})
        </h4>
        <div className="space-y-2">
          {activeSubIssue?.evidence.map((ev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg border overflow-hidden ${
                isDarkMode
                  ? 'bg-slate-900/50 border-white/5 hover:border-white/10'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              } transition-all`}
            >
              <button
                onClick={() => toggleEvidence(ev.label)}
                className="w-full p-3 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {ev.label}
                      </span>
                      {expandedEvidence.has(ev.label) ? (
                        <ChevronDown size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      ) : (
                        <ChevronRight size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`text-xs font-semibold ${getVoteColor(ev.vote)}`}>
                        {ev.vote}
                      </span>
                      <Chip 
                        variant={ev.weight === 'high' ? 'danger' : ev.weight === 'med' ? 'warning' : 'neutral'} 
                        size="sm"
                      >
                        {ev.weight.toUpperCase()} WEIGHT
                      </Chip>
                    </div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedEvidence.has(ev.label) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}
                  >
                    <div className={`p-3 ${isDarkMode ? 'bg-slate-950/50' : 'bg-gray-50'}`}>
                      <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-semibold">Why it matters:</span> {ev.why_it_matters}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {ev.tags.map((tag, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-xs ${
                              isDarkMode
                                ? 'bg-slate-700 text-gray-300'
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explainability */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-white/10 bg-purple-500/5' : 'border-gray-200 bg-purple-50'}`}>
        <h4 className={`text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1 ${
          isDarkMode ? 'text-purple-400' : 'text-purple-700'
        }`}>
          <TrendingUp size={12} />
          Explainability
        </h4>
        <p className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {activeSubIssue?.evidence.filter(e => e.vote === 'Yea').length || 0} supportive votes, 
          {' '}{activeSubIssue?.evidence.filter(e => e.vote === 'Nay').length || 0} opposing votes
          {' '}→ predicted {activeSubIssue?.stance || issue.stance}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            Consistency: {Math.floor(Math.random() * 20) + 75}%
          </span>
          <span className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
            Party Alignment: {Math.floor(Math.random() * 30) + 60}%
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={`p-4 border-t flex gap-2 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button
          onClick={onExportBrief}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            isDarkMode
              ? 'bg-blue-600/90 text-white hover:bg-blue-600 border border-blue-500/30'
              : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700/20'
          }`}
        >
          <FileText size={14} />
          Export Brief
        </button>
      </div>
    </div>
  );
}
