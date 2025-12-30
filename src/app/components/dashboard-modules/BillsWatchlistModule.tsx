import React from 'react';
import { FileText, TrendingUp, Calendar, ChevronRight, Check } from 'lucide-react';
import { DashboardModule } from '../../contexts/DashboardContext';
import { useTheme } from '../../contexts/ThemeContext';

interface BillsWatchlistModuleProps {
  module: DashboardModule;
}

const DEMO_BILLS = [
  { id: 'HB247', title: 'Clean Energy Transition Act', status: 'committee', nextEvent: 'Hearing Jan 8', newActivity: true },
  { id: 'SB156', title: 'Technology Innovation Funding', status: 'floor', nextEvent: 'Vote Dec 28', newActivity: false },
  { id: 'HB89', title: 'Healthcare Access Expansion', status: 'committee', nextEvent: 'Markup Jan 12', newActivity: true },
  { id: 'SB203', title: 'Education Funding Reform', status: 'passed-chamber', nextEvent: 'Vote Jan 5', newActivity: false },
  { id: 'HB145', title: 'Water Infrastructure Investment', status: 'introduced', newActivity: false },
];

const STAGES = [
  { key: 'introduced', label: 'Filed' },
  { key: 'committee', label: 'Committee' },
  { key: 'floor', label: 'Floor' },
  { key: 'passed-chamber', label: 'Passed' },
  { key: 'second-chamber', label: 'Other' },
  { key: 'governor', label: 'Governor' },
  { key: 'signed', label: 'Law' },
];

export function BillsWatchlistModule({ module }: BillsWatchlistModuleProps) {
  const { isDarkMode } = useTheme();
  
  const getSegmentGradient = (index: number, isCompleted: boolean, isCurrent: boolean) => {
    if (!isCompleted && !isCurrent) {
      return isDarkMode ? 'bg-slate-700' : 'bg-gray-200';
    }
    
    const totalStages = STAGES.length;
    const progress = index / (totalStages - 1);
    
    if (progress < 0.33) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    } else if (progress < 0.66) {
      return 'bg-gradient-to-r from-purple-500 to-purple-600';
    } else {
      return 'bg-gradient-to-r from-red-500 to-red-600';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className={`
          text-xs font-bold uppercase tracking-wide mb-3
          ${isDarkMode ? 'text-gray-400' : 'text-gray-900'}
        `}>
          Top Watched Bills (5)
        </h4>
        <div className="space-y-3">
          {DEMO_BILLS.map(bill => {
            const currentStageIndex = STAGES.findIndex(s => s.key === bill.status);
            
            return (
              <div 
                key={bill.id} 
                className={`
                  border rounded-lg p-3 transition-all duration-300
                  ${isDarkMode 
                    ? 'border-slate-700 hover:border-purple-500/50 hover:bg-slate-700/50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                        {bill.id}
                      </span>
                      {bill.newActivity && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-slow-pulse" />
                      )}
                    </div>
                    <h5 className={`text-sm font-medium mt-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {bill.title}
                    </h5>
                  </div>
                  <span className={`
                    px-2 py-0.5 text-xs rounded-full font-medium
                    ${isDarkMode 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-green-100 text-green-700'
                    }
                  `}>
                    Active
                  </span>
                </div>

                {/* Multi-Stage Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center gap-1 mb-1.5">
                    {STAGES.map((stage, index) => {
                      const isCompleted = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;
                      
                      return (
                        <div key={stage.key} className="flex-1 relative">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                              getSegmentGradient(index, isCompleted, isCurrent)
                            } ${isCurrent ? 'ring-1 ring-purple-300' : ''}`}
                          >
                            {/* Check icon for completed stages */}
                            {isCompleted && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Check size={8} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current: {STAGES.find(s => s.key === bill.status)?.label}
                  </div>
                </div>

                {bill.nextEvent && (
                  <div className={`flex items-center gap-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>Next: {bill.nextEvent}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className={`border-t pt-4 flex items-center justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button className={`
          text-sm font-medium flex items-center gap-1 transition-colors
          ${isDarkMode 
            ? 'text-purple-400 hover:text-purple-300' 
            : 'text-purple-600 hover:text-purple-700'
          }
        `}>
          View All Bills
          <ChevronRight className="w-4 h-4" />
        </button>
        <button className={`
          px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-300
          ${isDarkMode
            ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white shadow-lg shadow-purple-500/30'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
          }
        `}>
          Add Bills
        </button>
      </div>
    </div>
  );
}