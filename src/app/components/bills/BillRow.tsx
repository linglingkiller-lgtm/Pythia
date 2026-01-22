import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Pin, FileText, Calendar, Plus, ChevronRight, TrendingUp, TrendingDown, Minus, Clock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Bill } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface BillRowProps {
  bill: Bill;
  isSelected: boolean;
  onSelect: (billId: string) => void;
  onNavigate: (billId: string) => void;
  // Index and isDarkMode are optional as they are not used but might be passed
  index?: number;
  isDarkMode?: boolean;
}

export const BillRow = forwardRef<HTMLDivElement, BillRowProps & React.ComponentProps<typeof motion.div>>(({ bill, isSelected, onSelect, onNavigate, ...props }, ref) => {
  const { isDarkMode } = useTheme();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case 'support': return 'green';
      case 'oppose': return 'red';
      case 'monitor': return 'amber';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'introduced': 'Introduced',
      'committee': 'Committee',
      'floor': 'Floor',
      'passed-chamber': 'Passed',
      'second-chamber': 'Other Chamber',
      'governor': 'Governor',
      'signed': 'Law',
      'vetoed': 'Vetoed',
    };
    return labels[status] || status;
  };

  const getStatusStageIndex = (status: string): number => {
    const statusMap: { [key: string]: number } = {
      'introduced': 0,
      'committee': 1,
      'floor': 2,
      'passed-chamber': 3,
      'second-chamber': 4,
      'governor': 5,
      'signed': 6,
      'vetoed': 6,
    };
    return statusMap[status] ?? 0;
  };

  const getMomentumColor = () => {
    if (bill.momentumScore >= 70) return isDarkMode ? 'text-green-400' : 'text-green-600';
    if (bill.momentumScore <= 40) return isDarkMode ? 'text-red-400' : 'text-red-600';
    return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
  };

  const getMomentumBgColor = () => {
    if (bill.momentumScore >= 70) return isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200';
    if (bill.momentumScore <= 40) return isDarkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200';
    return isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200';
  };

  const getMomentumIcon = () => {
    if (bill.momentumScore >= 70) return <TrendingUp size={16} />;
    if (bill.momentumScore <= 40) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const daysUntilAction = () => {
    const actionDate = new Date(bill.nextActionDate);
    const today = new Date();
    const diffTime = actionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays}d`;
  };

  const currentStage = getStatusStageIndex(bill.status);
  const stages = ['Intro', 'Cmte', 'Floor', 'Pass', 'Other', 'Gov', 'Law'];

  // Determine if bill is high priority based on various factors
  const isHighPriority = bill.flags.some(f => f.type === 'fast-track' || f.type === 'high-risk') || 
                         bill.stance === 'oppose' ||
                         (bill.momentumScore > 70 && bill.stance === 'support');

  const getSegmentGradient = (index: number, isCompleted: boolean, isCurrent: boolean) => {
    if (!isCompleted && !isCurrent) return isDarkMode ? 'bg-slate-700' : 'bg-gray-200';
    const progress = index / 6;
    if (progress < 0.33) {
      return isDarkMode 
        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
        : 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
    if (progress < 0.66) {
      return isDarkMode 
        ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
        : 'bg-gradient-to-r from-purple-500 to-purple-600';
    }
    return isDarkMode 
      ? 'bg-gradient-to-r from-red-500 to-red-600' 
      : 'bg-gradient-to-r from-red-500 to-red-600';
  };

  const getCurrentStageColor = () => {
    const progress = currentStage / 6;
    if (progress < 0.33) return isDarkMode ? 'ring-blue-400/50' : 'ring-blue-300';
    if (progress < 0.66) return isDarkMode ? 'ring-purple-400/50' : 'ring-purple-300';
    return isDarkMode ? 'ring-red-400/50' : 'ring-red-300';
  };

  const getCurrentStagePulseColor = () => {
    const progress = currentStage / 6;
    if (progress < 0.33) return 'via-blue-300/60';
    if (progress < 0.66) return 'via-purple-300/60';
    return 'via-red-300/60';
  };

  const getCurrentStageTextColor = () => {
    const progress = currentStage / 6;
    if (progress < 0.33) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
    if (progress < 0.66) return isDarkMode ? 'text-purple-400' : 'text-purple-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <motion.div
      ref={ref}
      {...props}
      whileHover={prefersReducedMotion ? {} : { scale: 1.01, x: 4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`
        p-6 rounded-2xl cursor-pointer group relative overflow-hidden backdrop-blur-xl shadow-lg transition-all duration-300
        ${isHighPriority
          ? isDarkMode
            ? 'bg-red-900/20 border-2 border-red-500/30 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/10'
            : 'bg-white border-2 border-red-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-500/10'
          : isDarkMode
            ? 'bg-slate-900/40 border border-white/10 hover:border-white/20 hover:shadow-2xl'
            : 'bg-white/80 border border-gray-200 hover:border-blue-300 hover:shadow-2xl'
        }
      `}
      onClick={() => onNavigate(bill.id)}
    >
      {/* Hover gradient overlay */}
      <div className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
        ${isDarkMode 
          ? 'bg-gradient-to-r from-transparent via-white/5 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-blue-50/50 to-transparent'
        }
      `} />

      {/* Large Watermark - Bill ID */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none select-none">
        <div 
          className={`font-black text-[100px] leading-none tracking-tighter transition-all duration-500 ${
            isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.04]'
          }`}
          style={{ 
            color: isHighPriority 
              ? (isDarkMode ? '#ef4444' : '#dc2626')
              : (isDarkMode ? '#3b82f6' : '#2563eb'),
            textShadow: isHighPriority
              ? (isDarkMode 
                ? '0 0 60px #ef444440, 0 0 100px #ef444420, 0 0 140px #ef444410'
                : '0 0 50px #dc262625, 0 0 80px #dc262615')
              : (isDarkMode 
                ? '0 0 60px #3b82f640, 0 0 100px #3b82f620, 0 0 140px #3b82f610'
                : '0 0 50px #2563eb25, 0 0 80px #2563eb15')
          }}
        >
          {bill.billId.replace(/\s/g, '')}
        </div>
      </div>

      <div className="flex items-start gap-4 relative z-10">
        {/* Checkbox */}
        <div className="flex items-start pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onSelect(bill.id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Bill ID & Header Row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`
                text-xl font-bold tracking-tight transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                {bill.billId}
              </span>
              {bill.isPinned && (
                <Pin size={16} className={`
                  ${isHighPriority ? 'text-red-600 fill-red-600' : isDarkMode ? 'text-blue-400 fill-blue-400' : 'text-blue-600 fill-blue-600'}
                `} />
              )}
              <span className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500
                ${bill.status === 'committee'
                  ? isDarkMode ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  : bill.status === 'floor'
                    ? isDarkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200'
                    : isDarkMode ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-gray-100 text-gray-700 border border-gray-200'
                }
              `}>
                {getStatusLabel(bill.status)}
              </span>
              <span className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500
                ${getStanceColor(bill.stance) === 'green'
                  ? isDarkMode ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'
                  : getStanceColor(bill.stance) === 'red'
                    ? isDarkMode ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'
                    : getStanceColor(bill.stance) === 'amber'
                      ? isDarkMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100 text-amber-700 border border-amber-200'
                      : isDarkMode ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-gray-100 text-gray-700 border border-gray-200'
                }
              `}>
                {bill.stance.charAt(0).toUpperCase() + bill.stance.slice(1)}
              </span>
              {bill.flags.map(flag => (
                <span
                  key={flag.label}
                  className={`
                    px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-500
                    ${flag.type === 'fast-track'
                      ? isDarkMode ? 'bg-red-600/80 text-white border border-red-500' : 'bg-red-600 text-white border border-red-700'
                      : flag.type === 'high-risk'
                        ? isDarkMode ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200'
                        : isDarkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }
                  `}
                >
                  {flag.type === 'fast-track' && <AlertTriangle size={12} />}
                  {flag.label}
                </span>
              ))}
            </div>

            {/* Momentum Score */}
            <div className={`
              flex items-center gap-2 px-3 py-2 rounded-xl border font-bold transition-all duration-500
              ${getMomentumBgColor()}
            `}>
              <span className={getMomentumColor()}>
                {getMomentumIcon()}
              </span>
              <span className={`text-sm ${getMomentumColor()}`}>
                {bill.momentumScore}
              </span>
            </div>
          </div>

          {/* Bill Title */}
          <h4 className={`
            font-semibold mb-3 line-clamp-1 transition-colors duration-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}>
            {bill.shortTitle}
          </h4>

          {/* Revere Summary */}
          <p className={`
            text-sm mb-4 line-clamp-2 transition-colors duration-500
            ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}
          `}>
            {bill.aiSummaryOneLine}
          </p>

          {/* Next Action Alert (if urgent) */}
          {(daysUntilAction() === 'Today' || daysUntilAction() === 'Tomorrow' || bill.nextActionDescription.toLowerCase().includes('vote')) && (
            <div className={`
              mb-4 p-3 rounded-xl border transition-all duration-500
              ${isHighPriority
                ? isDarkMode 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : 'bg-red-50 border-red-200'
                : isDarkMode 
                  ? 'bg-blue-500/10 border-blue-500/30' 
                  : 'bg-blue-50 border-blue-200'
              }
            `}>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className={isHighPriority ? (isDarkMode ? 'text-red-400' : 'text-red-600') : (isDarkMode ? 'text-blue-400' : 'text-blue-600')} />
                <span className={`
                  font-semibold transition-colors duration-500
                  ${isHighPriority 
                    ? isDarkMode ? 'text-red-300' : 'text-red-900'
                    : isDarkMode ? 'text-blue-300' : 'text-blue-900'
                  }
                `}>
                  {bill.nextActionDescription} in {daysUntilAction()}
                </span>
                {bill.committeeName && (
                  <span className={`
                    transition-colors duration-500
                    ${isHighPriority 
                      ? isDarkMode ? 'text-red-400' : 'text-red-700'
                      : isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }
                  `}>
                    • {bill.committeeName}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Issue Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {bill.issueTags.slice(0, 4).map(tag => (
              <span
                key={tag}
                className={`
                  px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-500
                  ${isDarkMode 
                    ? 'bg-slate-700 text-slate-300 border border-slate-600' 
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }
                `}
              >
                {tag}
              </span>
            ))}
            {bill.issueTags.length > 4 && (
              <span className={`
                text-xs transition-colors duration-500
                ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}
              `}>
                +{bill.issueTags.length - 4} more
              </span>
            )}
          </div>

          {/* Bottom Row: Sponsor & Co-sponsors */}
          <div className={`
            flex items-center gap-4 text-xs transition-colors duration-500
            ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}
          `}>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Sponsor:</span>
              <span>{bill.sponsorNames[0]}</span>
              {bill.sponsorNames.length > 1 && (
                <span className={isDarkMode ? 'text-slate-500' : 'text-gray-500'}>
                  +{bill.sponsorNames.length - 1} co-sponsors
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions - Show on hover */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Generate brief for', bill.billId);
            }}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 shadow-lg
              ${isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            <FileText size={14} />
            Brief
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log('Add task for', bill.billId);
            }}
            className={`
              px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2
              ${isDarkMode 
                ? 'bg-white/10 hover:bg-white/15 border border-white/20 text-white' 
                : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-700'
              }
            `}
          >
            <Plus size={14} />
            Task
          </button>
          <ChevronRight size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
        </div>
      </div>
    </motion.div>
  );
});

BillRow.displayName = 'BillRow';
