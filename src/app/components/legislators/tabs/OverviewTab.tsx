import React from 'react';
import { Legislator } from '../legislatorData';
import { Users, MapPin, Sparkles, Clock } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface OverviewTabProps {
  legislator: Legislator;
}

export function OverviewTab({ legislator }: OverviewTabProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="space-y-6">
      {/* Committee Assignments */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Committee Assignments</h3>
        <div className="grid grid-cols-2 gap-3">
          {legislator.committees.map((committee, idx) => (
            <div key={idx} className={`p-3 rounded border ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{committee.name}</div>
                  <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{committee.role}</div>
                </div>
                {committee.role !== 'Member' && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    isDarkMode
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {committee.role}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issue Affinity */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Issue Affinities</h3>
        <div className="space-y-3">
          {legislator.issueAffinities.map((affinity, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{affinity.issue}</span>
                <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{affinity.strength}%</span>
              </div>
              <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-2 rounded-full transition-all ${
                    isDarkMode
                      ? legislator.party === 'D' ? 'bg-blue-500' : 'bg-red-500'
                      : legislator.party === 'D' ? 'bg-blue-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${affinity.strength}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What They Care About */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>What They Care About</h3>
        <ul className="space-y-2">
          {legislator.careAbout.map((item, idx) => (
            <li key={idx} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <span className={`mt-1 ${
                isDarkMode
                  ? legislator.party === 'D' ? 'text-blue-400' : 'text-red-400'
                  : legislator.party === 'D' ? 'text-blue-600' : 'text-red-600'
              }`}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* District Snapshot */}
      {legislator.districtSnapshot && (
        <div>
          <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <MapPin size={16} />
            District Snapshot
          </h3>
          <p className={`text-sm p-3 rounded border ${
            isDarkMode
              ? 'text-gray-300 bg-blue-900/20 border-blue-500/30'
              : 'text-gray-700 bg-blue-50 border-blue-200'
          }`}>
            {legislator.districtSnapshot}
          </p>
        </div>
      )}

      {/* Relationship Intelligence */}
      <div>
        <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Sparkles size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
          Relationship Intelligence
        </h3>
        <div className={`p-4 rounded border ${
          isDarkMode
            ? 'bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 border-emerald-500/30'
            : 'bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-200'
        }`}>
          <div className="mb-3">
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Relationship Warmth</div>
            <div className="flex items-center gap-2">
              <div className={`flex-1 rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-2 rounded-full ${
                    legislator.relationshipStatus === 'warm' ? 'bg-emerald-500' :
                    legislator.relationshipStatus === 'needs-follow-up' ? 'bg-amber-500' :
                    'bg-gray-400'
                  }`}
                  style={{
                    width: legislator.relationshipStatus === 'warm' ? '75%' :
                           legislator.relationshipStatus === 'needs-follow-up' ? '45%' :
                           '25%'
                  }}
                />
              </div>
              <span className={`text-sm font-medium capitalize ${
                legislator.relationshipStatus === 'warm' ? 'text-emerald-600' :
                legislator.relationshipStatus === 'needs-follow-up' ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                {legislator.relationshipStatus.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className={`text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Priorities Based on Recent Activity</div>
            <ul className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {legislator.issueAffinities.slice(0, 3).map((affinity, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}>{idx + 1}.</span>
                  {affinity.issue} ({affinity.strength}% affinity)
                </li>
              ))}
            </ul>
          </div>

          <div className={`pt-3 border-t ${isDarkMode ? 'border-emerald-500/30' : 'border-emerald-200'}`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Strategic Outreach Window</div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {legislator.nextRecommendedTouch || '2-5 days before key committee votes'}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Status */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Engagement Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded border ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Touch</div>
            <div className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.lastInteraction}</div>
          </div>
          <div className={`p-4 rounded border ${
            isDarkMode
              ? 'bg-amber-900/20 border-amber-500/30'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className={`text-xs mb-1 flex items-center gap-1 ${
              isDarkMode ? 'text-amber-400' : 'text-amber-700'
            }`}>
              <Clock size={12} />
              Recommended Next Touch
            </div>
            <div className={`font-semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-900'}`}>
              {legislator.nextRecommendedTouch || 'TBD'}
            </div>
          </div>
          <div className={`p-4 rounded border ${
            isDarkMode
              ? 'bg-blue-900/20 border-blue-500/30'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`text-xs mb-1 flex items-center gap-1 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-700'
            }`}>
              <Users size={12} />
              Relationship Owner
            </div>
            <div className={`font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>{legislator.relationshipOwner}</div>
          </div>
        </div>
      </div>
    </div>
  );
}