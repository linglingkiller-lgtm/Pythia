import React from 'react';
import { Legislator } from '../legislatorData';
import { Users, MapPin, Sparkles, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface OverviewTabProps {
  legislator: Legislator;
  onNavigateToPredictive?: () => void;
}

export function OverviewTab({ legislator, onNavigateToPredictive }: OverviewTabProps) {
  const { isDarkMode } = useTheme();
  
  // Get top 4 issue affinities
  const topIssues = legislator.issueAffinities.slice(0, 4);
  
  // Determine stance based on strength (this is a simplified interpretation)
  const getStanceFromStrength = (strength: number) => {
    if (strength >= 90) return { label: 'Strong Support', color: '#10b981' }; // green
    if (strength >= 75) return { label: 'Lean Support', color: '#14b8a6' }; // teal
    if (strength >= 60) return { label: 'Mixed/Moderate', color: '#6b7280' }; // gray
    if (strength >= 45) return { label: 'Lean Oppose', color: '#f97316' }; // orange
    return { label: 'Strong Oppose', color: '#ef4444' }; // red
  };
  
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
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Issue Affinities</h3>
          {onNavigateToPredictive && (
            <button
              onClick={onNavigateToPredictive}
              className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                isDarkMode
                  ? 'text-blue-400 hover:text-blue-300'
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              View All Insights
              <ChevronRight size={14} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {topIssues.map((affinity, idx) => {
            const stance = getStanceFromStrength(affinity.strength);
            return (
              <button
                key={idx}
                onClick={onNavigateToPredictive}
                className={`p-4 rounded-lg border backdrop-blur-sm text-left transition-all hover:scale-[1.02] group ${
                  isDarkMode
                    ? 'bg-slate-800/40 border-white/10 hover:border-white/20 hover:bg-slate-800/60'
                    : 'bg-white/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {affinity.issue}
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform group-hover:translate-x-0.5 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                </div>
                
                <div className="mb-2">
                  <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${affinity.strength}%`,
                        backgroundColor: stance.color
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stance.label}
                  </div>
                  <div 
                    className="text-xs font-bold"
                    style={{ color: stance.color }}
                  >
                    {affinity.strength}%
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Click any issue to view detailed predictive insights and evidence
        </p>
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

      {/* Predictive Analytics */}
      {onNavigateToPredictive && (
        <div className="mt-6">
          <button
            className={`w-full p-3 rounded border flex items-center justify-center ${
              isDarkMode
                ? 'bg-blue-900/20 border-blue-500/30 text-blue-300'
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}
            onClick={onNavigateToPredictive}
          >
            <TrendingUp size={16} className="mr-2" />
            Predictive Analytics
            <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}