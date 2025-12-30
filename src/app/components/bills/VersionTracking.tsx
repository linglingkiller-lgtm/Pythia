import React from 'react';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Bill } from '../../data/billsData';
import { RedlineComparisonModal } from './RedlineComparisonModal';
import { useTheme } from '../../contexts/ThemeContext';

interface VersionTrackingProps {
  bill: Bill;
}

export function VersionTracking({ bill }: VersionTrackingProps) {
  const { isDarkMode } = useTheme();
  const [showRedlineModal, setShowRedlineModal] = React.useState(false);

  const getVersionTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'introduced': 'Introduced',
      'committee-substitute': 'Committee Substitute',
      'amendment': 'Amendment',
      'engrossed': 'Engrossed',
      'enrolled': 'Enrolled',
    };
    return labels[type] || type;
  };

  const hasChanges = bill.versions.length > 1;
  const latestVersion = bill.versions[bill.versions.length - 1];

  return (
    <div className={`p-6 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-lg font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Bill Versions & Changes</h3>
        <Chip variant="neutral" size="sm">{bill.versions.length} Version{bill.versions.length !== 1 ? 's' : ''}</Chip>
      </div>

      {/* What Changed Since Last Visit Banner */}
      {hasChanges && bill.lastViewed && (
        <div className={`mb-5 p-3 border rounded-lg ${
          isDarkMode
            ? 'bg-amber-500/10 border-amber-500/30'
            : 'bg-amber-50 border-amber-300'
        }`}>
          <div className="flex items-start gap-2">
            <AlertCircle size={18} className={isDarkMode ? 'text-amber-400' : 'text-amber-700'} />
            <div>
              <div className={`font-semibold text-sm mb-1 ${
                isDarkMode ? 'text-amber-300' : 'text-amber-900'
              }`}>
                What changed since your last visit ({new Date(bill.lastViewed).toLocaleDateString()}):
              </div>
              <ul className="space-y-1">
                {latestVersion.aiChangeSummary.map((change, index) => (
                  <li key={index} className={`text-sm ${
                    isDarkMode ? 'text-amber-200' : 'text-amber-900'
                  }`}>
                    • {change}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Versions List */}
      <div className="space-y-3">
        {bill.versions.map((version, index) => {
          const isLatest = index === bill.versions.length - 1;
          
          return (
            <div
              key={version.id}
              className={`p-4 rounded-lg border ${
                isLatest
                  ? (isDarkMode
                    ? 'border-purple-500/30 bg-purple-500/10'
                    : 'border-purple-300 bg-purple-50')
                  : (isDarkMode
                    ? 'border-white/10 bg-slate-700/30'
                    : 'border-gray-200 bg-white')
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={16} className={isLatest ? (isDarkMode ? 'text-purple-400' : 'text-purple-700') : (isDarkMode ? 'text-gray-400' : 'text-gray-600')} />
                  <span className={`font-semibold text-sm ${isLatest ? (isDarkMode ? 'text-purple-300' : 'text-purple-900') : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                    {getVersionTypeLabel(version.type)}
                  </span>
                  {isLatest && (
                    <Chip variant="danger" size="sm">Latest</Chip>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(version.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <a
                    href={version.textLink}
                    className={isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('View version text:', version.id);
                    }}
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Revere Change Summary */}
              {version.aiChangeSummary.length > 0 && (
                <div className="mt-2">
                  <div className={`text-xs font-medium mb-1 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Changes in this version:</div>
                  <ul className="space-y-1">
                    {version.aiChangeSummary.map((change, changeIndex) => (
                      <li key={changeIndex} className={`text-sm flex gap-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>▪</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Redline View Button */}
      {hasChanges && (
        <div className={`mt-4 pt-4 border-t ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <button
            className={`w-full px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-slate-700 border-white/10 text-gray-300 hover:bg-slate-600'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setShowRedlineModal(true)}
          >
            View Side-by-Side Redline Comparison
          </button>
        </div>
      )}

      {/* Redline Comparison Modal */}
      {showRedlineModal && (
        <RedlineComparisonModal
          bill={bill}
          onClose={() => setShowRedlineModal(false)}
        />
      )}
    </div>
  );
}