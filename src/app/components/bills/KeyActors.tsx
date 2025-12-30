import React from 'react';
import { Users, Mail, Calendar, FileText, UserPlus, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { MemberInsight } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface KeyActorsProps {
  sponsorIds: string[];
  sponsorNames: string[];
  committeeName?: string;
  memberInsights: MemberInsight[];
  onNavigateToLegislator?: (legislatorId: string) => void;
}

export function KeyActors({ sponsorIds, sponsorNames, committeeName, memberInsights, onNavigateToLegislator }: KeyActorsProps) {
  const { isDarkMode } = useTheme();
  
  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'support': return 'green';
      case 'oppose': return 'red';
      case 'unknown': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <div className={`p-5 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Key Actors</h3>
      </div>

      {/* Sponsors */}
      <div className="mb-5">
        <h4 className={`text-sm font-semibold mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Sponsors:</h4>
        <div className="space-y-2">
          {sponsorNames.map((name, index) => (
            <div key={index} className={`text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-900'
            }`}>
              {index === 0 && <span className="font-medium">Primary: </span>}
              {index > 0 && <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Co-sponsor: </span>}
              <button 
                className={`hover:underline ${
                  isDarkMode
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-700'
                }`}
                onClick={() => onNavigateToLegislator && sponsorIds[index] && onNavigateToLegislator(sponsorIds[index])}
              >
                {name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Committee */}
      {committeeName && (
        <div className={`mb-5 pb-5 border-b ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <h4 className={`text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Committee:</h4>
          <button className={`text-sm hover:underline ${
            isDarkMode
              ? 'text-purple-400 hover:text-purple-300'
              : 'text-purple-600 hover:text-purple-700'
          }`}>
            {committeeName}
          </button>
        </div>
      )}

      {/* Committee Members with Insights */}
      {memberInsights.length > 0 && (
        <div>
          <h4 className={`text-sm font-semibold mb-3 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Committee Members:</h4>
          <div className="space-y-3">
            {memberInsights.map((insight) => (
              <div
                key={insight.personId}
                className={`p-3 border rounded-lg transition-all group ${
                  isDarkMode
                    ? 'border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <button
                      onClick={() => onNavigateToLegislator && onNavigateToLegislator(insight.personId)}
                      className={`font-semibold text-sm hover:underline text-left ${
                        isDarkMode
                          ? 'text-purple-400 hover:text-purple-300'
                          : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      {insight.name}
                    </button>
                    <div className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {insight.role}
                    </div>
                  </div>
                  <Chip variant={getStanceColor(insight.stanceEstimate) as any} size="sm">
                    {insight.stanceEstimate}
                  </Chip>
                </div>

                <div className={`flex items-center gap-4 text-xs mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {insight.lastInteractionDate && (
                    <div>
                      <span className="font-medium">Last contact:</span> {new Date(insight.lastInteractionDate).toLocaleDateString()}
                    </div>
                  )}
                  {insight.relationshipOwner && (
                    <div>
                      <span className="font-medium">Owner:</span> {insight.relationshipOwner}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => onNavigateToLegislator && onNavigateToLegislator(insight.personId)}
                  >
                    <FileText size={12} />
                    Profile
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Mail size={12} />
                    Email
                  </Button>
                  <Button variant="secondary" size="sm">
                    <Calendar size={12} />
                    Schedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revere Recommendation */}
      <div className={`mt-5 pt-5 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className={`p-3 border rounded-lg ${
          isDarkMode
            ? 'bg-blue-500/10 border-blue-500/30'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className={`text-xs font-semibold mb-2 flex items-center gap-1.5 ${
            isDarkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>
            <Sparkles size={14} />
            Who should we talk to next?
          </div>
          <div className={`text-sm mb-2 ${
            isDarkMode ? 'text-blue-200' : 'text-blue-900'
          }`}>
            Revere recommends focusing on Committee Vice Chair (persuadable swing vote with manufacturing district interests)
          </div>
          <div className={`text-xs ${
            isDarkMode ? 'text-blue-300' : 'text-blue-700'
          }`}>
            Suggested goal: Request amendment feedback on cost recovery provisions
          </div>
        </div>
      </div>
    </div>
  );
}