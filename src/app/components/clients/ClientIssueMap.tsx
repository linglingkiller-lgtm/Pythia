import React from 'react';
import { type ClientIssue } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Flame, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientIssueMapProps {
  issues: ClientIssue[];
}

export function ClientIssueMap({ issues }: ClientIssueMapProps) {
  const { isDarkMode } = useTheme();
  
  const getHeatColor = (level: number) => {
    if (level >= 80) return 'from-red-500 to-orange-500';
    if (level >= 60) return 'from-orange-500 to-yellow-500';
    if (level >= 40) return 'from-yellow-500 to-green-500';
    return 'from-green-500 to-blue-500';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return TrendingUp;
      case 'declining': return TrendingDown;
      default: return Minus;
    }
  };

  const getTrendColor = (trend: string) => {
    if (isDarkMode) {
      switch (trend) {
        case 'improving': return 'text-green-400';
        case 'declining': return 'text-red-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (trend) {
        case 'improving': return 'text-green-600';
        case 'declining': return 'text-red-600';
        default: return 'text-gray-600';
      }
    }
  };

  const getRiskLabel = (label: string) => {
    switch (label) {
      case 'risk': return { text: 'Risk', variant: 'danger' as const };
      case 'opportunity': return { text: 'Opportunity', variant: 'success' as const };
      default: return { text: 'Neutral', variant: 'neutral' as const };
    }
  };

  return (
    <Card className="p-6">
      <h3 className={`font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Issue Map</h3>
      <div className="grid grid-cols-3 gap-4">
        {issues.map((issue) => {
          const TrendIcon = getTrendIcon(issue.sentimentTrend);
          const riskLabel = getRiskLabel(issue.riskOpportunityLabel);
          
          return (
            <button
              key={issue.id}
              className={`p-4 rounded-lg border transition-all text-left ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10 hover:border-emerald-500/50 hover:bg-slate-700/50'
                  : 'bg-white border-gray-200 hover:border-blue-500 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{issue.issueName}</h4>
                  <Chip variant={riskLabel.variant} size="sm">{riskLabel.text}</Chip>
                </div>
                <div className={`p-2 rounded-lg ${getHeatColor(issue.heatLevel)} bg-gradient-to-br`}>
                  <Flame size={16} className="text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Heat Level</span>
                  <span className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{issue.heatLevel}%</span>
                </div>
                
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${getHeatColor(issue.heatLevel)}`}
                    style={{ width: `${issue.heatLevel}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {issue.relevantBillsCount} {issue.relevantBillsCount === 1 ? 'bill' : 'bills'}
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${getTrendColor(issue.sentimentTrend)}`}>
                    <TrendIcon size={12} />
                    {issue.sentimentTrend}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}