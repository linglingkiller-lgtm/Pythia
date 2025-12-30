import React from 'react';
import { Activity, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { BillMomentum } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface BillMomentumCardProps {
  momentum: BillMomentum;
}

export function BillMomentumCard({ momentum }: BillMomentumCardProps) {
  const { isDarkMode } = useTheme();
  
  const getTrendIcon = () => {
    switch (momentum.trend) {
      case 'up':
        return <TrendingUp size={18} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />;
      case 'down':
        return <TrendingDown size={18} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />;
      default:
        return <Activity size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getTrendColor = () => {
    if (isDarkMode) {
      switch (momentum.trend) {
        case 'up': return 'text-green-400';
        case 'down': return 'text-red-400';
        default: return 'text-gray-300';
      }
    } else {
      switch (momentum.trend) {
        case 'up': return 'text-green-700';
        case 'down': return 'text-red-700';
        default: return 'text-gray-700';
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (isDarkMode) {
      if (score >= 70) return 'text-green-300 bg-green-500/20';
      if (score >= 40) return 'text-amber-300 bg-amber-500/20';
      return 'text-red-300 bg-red-500/20';
    } else {
      if (score >= 70) return 'text-green-700 bg-green-100';
      if (score >= 40) return 'text-amber-700 bg-amber-100';
      return 'text-red-700 bg-red-100';
    }
  };

  const getConfidenceVariant = (confidence: string): 'success' | 'warning' | 'neutral' => {
    switch (confidence) {
      case 'high': return 'success';
      case 'medium': return 'warning';
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
        <Activity size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Bill Momentum</h3>
      </div>

      {/* Momentum Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Momentum Score</span>
          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className={`text-2xl font-bold ${getTrendColor()}`}>
              {momentum.score}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className={`w-full h-2 rounded-full overflow-hidden ${
          isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
        }`}>
          <div
            className={`h-full transition-all ${
              momentum.score >= 70
                ? 'bg-green-500'
                : momentum.score >= 40
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${momentum.score}%` }}
          />
        </div>

        {/* Trend Change */}
        {momentum.trendChange !== 0 && (
          <div className={`text-xs mt-1 ${getTrendColor()}`}>
            {momentum.trendChange > 0 ? '+' : ''}{momentum.trendChange}% vs last week
          </div>
        )}
      </div>

      {/* Next Step Prediction */}
      <div className={`mb-4 p-3 border rounded-lg ${
        isDarkMode
          ? 'bg-blue-500/10 border-blue-500/30'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-semibold ${
            isDarkMode ? 'text-blue-300' : 'text-blue-900'
          }`}>Likely Next Step:</span>
          <Chip variant={getConfidenceVariant(momentum.nextStepConfidence)} size="sm">
            {momentum.nextStepConfidence} confidence
          </Chip>
        </div>
        <p className={`text-sm ${
          isDarkMode ? 'text-blue-200' : 'text-blue-900'
        }`}>{momentum.nextStepGuess}</p>
      </div>

      {/* Stall Risks */}
      {momentum.stallRisks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle size={14} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
            <span className={`text-sm font-semibold ${
              isDarkMode ? 'text-amber-300' : 'text-amber-900'
            }`}>Risk of Stall:</span>
          </div>
          <ul className="space-y-1">
            {momentum.stallRisks.map((risk, index) => (
              <li key={index} className={`text-sm flex gap-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className={isDarkMode ? 'text-amber-400' : 'text-amber-600'}>•</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explanation Note */}
      <div className={`mt-4 pt-4 border-t ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <p className={`text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Score based on committee velocity, sponsor power, co-sponsor count, and scheduling patterns
        </p>
      </div>
    </div>
  );
}