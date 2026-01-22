import React from 'react';
import { Legislator } from '../legislatorData';
import { legislatorPredictiveInsightsDemo, Issue, SubIssue } from '../../../../demo/legislatorPredictiveInsightsDemo';
import { useTheme } from '../../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { IssueConstellation } from './IssueConstellation';
import { EvidencePanel } from './EvidencePanel';
import { ExportBriefModal } from './ExportBriefModal';
import { AlertTriangle, Sparkles } from 'lucide-react';

interface PredictiveInsightsTabProps {
  legislator: Legislator;
}

export function PredictiveInsightsTab({ legislator }: PredictiveInsightsTabProps) {
  const { isDarkMode } = useTheme();
  const [selectedIssue, setSelectedIssue] = React.useState<string | null>(null);
  const [selectedSubIssue, setSelectedSubIssue] = React.useState<string | null>(null);
  const [showExportModal, setShowExportModal] = React.useState(false);
  const [followedIssues, setFollowedIssues] = React.useState<Set<string>>(() => {
    const saved = localStorage.getItem('revere_watchlist_issues');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Find predictive profile for this legislator
  const predictiveProfile = legislatorPredictiveInsightsDemo.legislators.find(
    l => l.id === legislator.id
  );

  // Auto-select first issue on mount
  React.useEffect(() => {
    if (predictiveProfile && predictiveProfile.issueProfile.length > 0 && !selectedIssue) {
      setSelectedIssue(predictiveProfile.issueProfile[0].issue);
    }
  }, [predictiveProfile, selectedIssue]);

  if (!predictiveProfile) {
    return (
      <div className={`rounded-lg border backdrop-blur-sm p-8 ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="text-center">
          <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Predictive Data Available
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Predictive insights have not been generated for this legislator yet.
          </p>
          <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Demo data is available for select legislators only.
          </p>
        </div>
      </div>
    );
  }

  const currentIssue = predictiveProfile.issueProfile.find(i => i.issue === selectedIssue) || null;
  const currentSubIssue = currentIssue && selectedSubIssue
    ? currentIssue.subissues.find(si => si.name === selectedSubIssue) || null
    : null;

  const handleSelectIssue = (issue: string) => {
    setSelectedIssue(issue);
    setSelectedSubIssue(null);
  };

  const handleFollow = () => {
    if (!selectedIssue) return;
    
    const key = `${legislator.id}-${selectedIssue}`;
    const newFollowed = new Set(followedIssues);
    
    if (newFollowed.has(key)) {
      newFollowed.delete(key);
    } else {
      newFollowed.add(key);
    }
    
    setFollowedIssues(newFollowed);
    localStorage.setItem('revere_watchlist_issues', JSON.stringify(Array.from(newFollowed)));
  };

  const isFollowing = selectedIssue ? followedIssues.has(`${legislator.id}-${selectedIssue}`) : false;

  return (
    <div>
      {/* Demo Disclaimer Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-4 rounded-lg border p-4 ${
          isDarkMode
            ? 'bg-purple-500/10 border-purple-400/20'
            : 'bg-purple-50 border-purple-200'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
            <Sparkles size={20} className="text-purple-500" />
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
              Demo Predictions • Sample Evidence Only
            </h4>
            <p className={`text-xs ${isDarkMode ? 'text-purple-200/70' : 'text-purple-700'}`}>
              {legislatorPredictiveInsightsDemo.meta.disclaimer}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Layout - Two Columns */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-4">
          {/* Issue Constellation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <IssueConstellation
              issues={predictiveProfile.issueProfile}
              selectedIssue={selectedIssue}
              onSelectIssue={handleSelectIssue}
              legislatorName={legislator.name}
              legislatorPhotoUrl={legislator.photoUrl}
              legislatorParty={legislator.party}
              followedIssues={followedIssues}
              legislatorId={legislator.id}
            />
          </motion.div>

          {/* Issue Position Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-lg border backdrop-blur-sm overflow-hidden ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Issue Position Matrix
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                All predicted positions at a glance
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <tr>
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Issue
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Stance
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Confidence
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Salience
                    </th>
                    <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Sub-Issues
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
                  {predictiveProfile.issueProfile
                    .sort((a, b) => b.salience - a.salience)
                    .map((issue) => (
                      <tr
                        key={issue.issue}
                        onClick={() => handleSelectIssue(issue.issue)}
                        className={`cursor-pointer transition-colors ${
                          selectedIssue === issue.issue
                            ? isDarkMode
                              ? 'bg-blue-500/10'
                              : 'bg-blue-50'
                            : isDarkMode
                            ? 'hover:bg-slate-700/30'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {issue.issue}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                            issue.stance === 'Strong Support' ? 'bg-green-500/20 text-green-500' :
                            issue.stance === 'Lean Support' ? 'bg-teal-500/20 text-teal-500' :
                            issue.stance === 'Mixed/Unclear' ? 'bg-gray-500/20 text-gray-500' :
                            issue.stance === 'Lean Oppose' ? 'bg-orange-500/20 text-orange-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {issue.stance}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <div className="flex items-center justify-center gap-2">
                            <div className={`w-16 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                              <div
                                className={`h-full ${
                                  issue.confidence >= 80 ? 'bg-green-500' :
                                  issue.confidence >= 60 ? 'bg-blue-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ width: `${issue.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold">{issue.confidence}%</span>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-center text-sm font-semibold ${
                          issue.salience >= 80 ? 'text-red-500' :
                          issue.salience >= 60 ? 'text-orange-500' :
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {issue.salience}%
                        </td>
                        <td className={`px-4 py-3 text-center text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {issue.subissues.length}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Column - 1/3 width */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <EvidencePanel
            issue={currentIssue}
            selectedSubIssue={selectedSubIssue}
            onSelectSubIssue={setSelectedSubIssue}
            onFollow={handleFollow}
            onExportBrief={() => setShowExportModal(true)}
            isFollowing={isFollowing}
          />
        </motion.div>
      </div>

      {/* Export Modal */}
      {showExportModal && currentIssue && (
        <ExportBriefModal
          issue={currentIssue}
          subIssue={currentSubIssue}
          legislatorName={legislator.name}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}