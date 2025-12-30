import React from 'react';
import { Check } from 'lucide-react';
import { Bill } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface BillTimelineProps {
  bill: Bill;
}

export function BillTimeline({ bill }: BillTimelineProps) {
  const { isDarkMode } = useTheme();
  const stages = [
    { key: 'introduced', label: 'Filed', date: bill.versions[0]?.date },
    { key: 'committee', label: 'Committee' },
    { key: 'floor', label: 'Floor' },
    { key: 'passed-chamber', label: 'Passed' },
    { key: 'second-chamber', label: 'Other Chamber' },
    { key: 'governor', label: 'Governor' },
    { key: 'signed', label: 'Law' },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === bill.status);

  const getSegmentGradient = (index: number, isCompleted: boolean, isCurrent: boolean) => {
    if (!isCompleted && !isCurrent) {
      return isDarkMode ? 'bg-slate-700' : 'bg-gray-200';
    }
    
    // Create a gradient progression through blue/purple/red colors for bills
    const totalStages = stages.length;
    const progress = index / (totalStages - 1);
    
    if (progress < 0.33) {
      // Blue shades for early stages
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    } else if (progress < 0.66) {
      // Purple/transition for middle stages
      return 'bg-gradient-to-r from-purple-500 to-purple-600';
    } else {
      // Red shades for final stages
      return 'bg-gradient-to-r from-red-500 to-red-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Progress Bar */}
      <div className="flex items-center gap-2">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isActive = isCompleted || isCurrent;
          
          return (
            <div key={stage.key} className="flex-1 relative">
              {/* Segment */}
              <div
                className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                  getSegmentGradient(index, isCompleted, isCurrent)
                } ${isCurrent ? (isDarkMode ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-slate-800' : 'ring-2 ring-red-300 ring-offset-1') : ''}`}
              >
                {/* Shimmer effect for current stage */}
                {isCurrent && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/60 to-transparent"
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 4s infinite'
                    }}
                  />
                )}
                
                {/* Check icon for completed stages */}
                {isCompleted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage labels */}
      <div className="flex justify-between">
        {stages.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          
          return (
            <div 
              key={stage.key} 
              className="flex flex-col items-center"
              style={{ width: `${100 / stages.length}%` }}
            >
              <div
                className={`text-xs font-semibold transition-colors duration-300 text-center ${
                  isCurrent
                    ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                    : isCompleted
                    ? (isDarkMode ? 'text-white' : 'text-gray-900')
                    : (isDarkMode ? 'text-gray-500' : 'text-gray-400')
                }`}
              >
                {stage.label}
              </div>
              {stage.date && (
                <div className={`text-xs mt-0.5 transition-colors duration-300 ${
                  isCurrent 
                    ? (isDarkMode ? 'text-red-300' : 'text-red-500')
                    : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                }`}>
                  {new Date(stage.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}