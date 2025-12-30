import React from 'react';
import { TrendingUp, HelpCircle, Info, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { MemberInsight } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface VotingPatternsProps {
  memberInsights: MemberInsight[];
}

export function VotingPatterns({ memberInsights }: VotingPatternsProps) {
  const { isDarkMode } = useTheme();
  
  const getLikelihoodColor = (likelihood: string) => {
    if (isDarkMode) {
      switch (likelihood) {
        case 'high': return 'text-green-300 bg-green-500/20';
        case 'medium': return 'text-amber-300 bg-amber-500/20';
        case 'low': return 'text-red-300 bg-red-500/20';
        default: return 'text-gray-300 bg-gray-500/20';
      }
    } else {
      switch (likelihood) {
        case 'high': return 'text-green-700 bg-green-100';
        case 'medium': return 'text-amber-700 bg-amber-100';
        case 'low': return 'text-red-700 bg-red-100';
        default: return 'text-gray-700 bg-gray-100';
      }
    }
  };

  const getConfidenceLabel = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'High confidence';
      case 'medium': return 'Medium confidence';
      case 'low': return 'Low confidence';
      default: return confidence;
    }
  };

  // Separate members into categories
  const swingVotes = memberInsights.filter(m => m.supportLikelihood === 'medium');
  const oppositionAnchors = memberInsights.filter(m => m.supportLikelihood === 'low');

  return (
    <div className={`p-5 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Likely Voting Patterns</h3>
      </div>

      <p className={`text-xs mb-4 flex items-center gap-1.5 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <Sparkles size={12} />
        Revere predictions based on voting history, committee behavior, and district interests
      </p>

      {/* All Members */}
      <div className="space-y-3 mb-5">
        {memberInsights.map((insight) => (
          <div
            key={insight.personId}
            className={`p-3 border rounded-lg ${
              isDarkMode
                ? 'border-white/10 bg-slate-700/30'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className={`font-medium text-sm mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {insight.role}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getLikelihoodColor(insight.supportLikelihood)}`}>
                    {insight.supportPercentage ? `${insight.supportPercentage}%` : insight.supportLikelihood} support
                  </span>
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {getConfidenceLabel(insight.confidence)}
                  </span>
                </div>
              </div>
            </div>

            {/* Contributing Factors */}
            {insight.factors.length > 0 && (
              <div className="mt-2">
                <div className={`text-xs mb-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Key factors:</div>
                <div className="flex flex-wrap gap-1">
                  {insight.factors.map((factor, index) => (
                    <Chip key={index} variant="neutral" size="sm">
                      {factor}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Swing Votes */}
      {swingVotes.length > 0 && (
        <div className={`mb-4 pb-4 border-b ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 flex items-center gap-1 ${
            isDarkMode ? 'text-amber-300' : 'text-amber-900'
          }`}>
            <HelpCircle size={14} />
            Key Swing Votes ({swingVotes.length})
          </h4>
          <div className="space-y-1">
            {swingVotes.map((insight) => (
              <div key={insight.personId} className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                • {insight.role}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opposition Anchors */}
      {oppositionAnchors.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-red-300' : 'text-red-900'
          }`}>
            Opposition to Neutralize ({oppositionAnchors.length})
          </h4>
          <div className="space-y-1">
            {oppositionAnchors.map((insight) => (
              <div key={insight.personId} className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                • {insight.role}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className={`mt-4 pt-4 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className={`flex items-start gap-2 text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <Info size={12} className="flex-shrink-0 mt-0.5" />
          <p>
            These are probabilistic estimates, not guarantees. You can manually override any prediction.
          </p>
        </div>
      </div>
    </div>
  );
}