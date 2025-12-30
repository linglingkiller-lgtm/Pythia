import React from 'react';
import { type AIInsight } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp, ListTodo } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface AIRecommendationsPanelProps {
  insights: AIInsight[];
}

export function AIRecommendationsPanel({ insights }: AIRecommendationsPanelProps) {
  const { isDarkMode } = useTheme();
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return Lightbulb;
      case 'scope-drift': return AlertTriangle;
      case 'renewal-risk': return TrendingUp;
      case 'opportunity': return TrendingUp;
      case 'missing-task': return ListTodo;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'recommendation': return 'text-blue-400';
        case 'scope-drift': return 'text-yellow-400';
        case 'renewal-risk': return 'text-red-400';
        case 'opportunity': return 'text-green-400';
        case 'missing-task': return 'text-purple-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (type) {
        case 'recommendation': return 'text-blue-600';
        case 'scope-drift': return 'text-yellow-600';
        case 'renewal-risk': return 'text-red-600';
        case 'opportunity': return 'text-green-600';
        case 'missing-task': return 'text-purple-600';
        default: return 'text-gray-600';
      }
    }
  };

  const getConfidenceVariant = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
        <h4 className={`font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Revere Recommendations</h4>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 6).map((insight) => {
          const Icon = getTypeIcon(insight.type);
          
          return (
            <div key={insight.id} className={`p-3 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/30 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start gap-2 mb-2">
                <Icon size={14} className={`mt-0.5 ${getTypeColor(insight.type)}`} />
                <div className="flex-1">
                  <div className={`text-sm font-medium mb-1 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {insight.summary}
                  </div>
                  <Chip variant={getConfidenceVariant(insight.confidence)} size="sm">
                    {insight.confidence} confidence
                  </Chip>
                </div>
              </div>

              {/* Reasons */}
              <div className={`text-xs mb-2 ml-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="font-medium mb-1">Why flagged:</div>
                <ul className="space-y-0.5">
                  {insight.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              {insight.actionLabel && (
                <div className="ml-6">
                  <Button variant="secondary" size="sm">
                    {insight.actionLabel}
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {insights.length === 0 && (
          <div className={`text-center py-6 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Sparkles size={32} className={`mx-auto mb-2 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            No active recommendations
          </div>
        )}
      </div>
    </Card>
  );
}