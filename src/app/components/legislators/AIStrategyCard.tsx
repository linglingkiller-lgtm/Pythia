import React from 'react';
import { Sparkles, AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Legislator } from './legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface AIStrategyCardProps {
  legislator: Legislator;
}

export function AIStrategyCard({ legislator }: AIStrategyCardProps) {
  const { isDarkMode } = useTheme();
  const [showSources, setShowSources] = React.useState(false);

  const getConfidenceColor = (confidence: string) => {
    if (isDarkMode) {
      switch (confidence) {
        case 'high':
          return 'bg-green-500/20 text-green-300 border border-green-500/30';
        case 'medium':
          return 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
        case 'low':
          return 'bg-red-500/20 text-red-300 border border-red-500/30';
        default:
          return 'bg-slate-700/50 text-gray-300 border border-white/10';
      }
    } else {
      switch (confidence) {
        case 'high':
          return 'bg-green-100 text-green-700';
        case 'medium':
          return 'bg-amber-100 text-amber-700';
        case 'low':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }
  };

  return (
    <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20'
        : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <Sparkles size={16} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
          Revere Strategy
        </h3>
        <span className={`text-xs px-2 py-1 rounded-md ${getConfidenceColor(legislator.aiStrategy.confidence)}`}>
          {legislator.aiStrategy.confidence.charAt(0).toUpperCase() + legislator.aiStrategy.confidence.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        {/* Angle */}
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
        }`}>
          <div className="flex items-start gap-2 mb-1">
            <ArrowRight size={14} className={`mt-0.5 flex-shrink-0 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`} />
            <div>
              <div className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Recommended Angle
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                {legislator.aiStrategy.angle}
              </p>
            </div>
          </div>
        </div>

        {/* Avoid */}
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
        }`}>
          <div className="flex items-start gap-2 mb-1">
            <AlertTriangle size={14} className={`mt-0.5 flex-shrink-0 ${
              isDarkMode ? 'text-red-400' : 'text-red-600'
            }`} />
            <div>
              <div className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Avoid
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                {legislator.aiStrategy.avoid}
              </p>
            </div>
          </div>
        </div>

        {/* Next Step */}
        <div className={`p-3 rounded-lg ${
          isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'
        }`}>
          <div className="flex items-start gap-2 mb-1">
            <ArrowRight size={14} className={`mt-0.5 flex-shrink-0 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <div className={`text-xs font-semibold mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Suggested Next Step
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}`}>
                {legislator.aiStrategy.nextStep}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Show Sources Button */}
      <button
        onClick={() => setShowSources(!showSources)}
        className={`mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
          isDarkMode
            ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
            : 'bg-white/80 border-purple-300 hover:bg-white'
        }`}
      >
        <Info size={14} />
        {showSources ? 'Hide Sources' : 'Show Sources'}
      </button>

      {/* Sources Modal Content */}
      {showSources && (
        <div className={`mt-3 p-3 rounded-lg border text-xs ${
          isDarkMode
            ? 'bg-slate-800/50 border-white/10 text-gray-400'
            : 'bg-white border-purple-300 text-gray-700'
        }`}>
          <div className={`font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-900'
          }`}>
            Analysis based on:
          </div>
          <ul className="space-y-1">
            <li>• 3 recent bills sponsored</li>
            <li>• 5 committee assignments</li>
            <li>• 12 recorded interactions</li>
            <li>• 8 media mentions</li>
            <li>• District demographic profile</li>
          </ul>
        </div>
      )}
    </div>
  );
}