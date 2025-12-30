import React, { useState } from 'react';
import { AlertCircle, TrendingUp, Calendar, Info } from 'lucide-react';
import { TargetData } from './TargetCard';
import { RecommendedAction, RecommendedActionData } from './RecommendedAction';
import { ActionMathDrawer } from './ActionMathDrawer';
import { useTheme } from '../../../contexts/ThemeContext';

interface TargetActionConsoleProps {
  target: TargetData | null;
  onExecuteAction: (action: RecommendedActionData) => void;
}

export const TargetActionConsole: React.FC<TargetActionConsoleProps> = ({ target, onExecuteAction }) => {
  const { isDarkMode } = useTheme();
  const [showMathDrawer, setShowMathDrawer] = useState(false);
  const [selectedAction, setSelectedAction] = useState<RecommendedActionData | null>(null);

  if (!target) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <TrendingUp size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className="text-sm">Select a target to view recommended actions</p>
        </div>
      </div>
    );
  }

  // Calculate projection
  const projectedDaysToFinish = target.doorsRemaining / target.avgDoorsPerDay7;
  const projectedFinishDate = new Date();
  projectedFinishDate.setDate(projectedFinishDate.getDate() + projectedDaysToFinish);
  
  const endDate = new Date(target.endDate);
  const daysLateOrEarly = Math.round((projectedFinishDate.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const isOnTime = Math.abs(daysLateOrEarly) <= 1;
  const isEarly = daysLateOrEarly < -1;
  const isLate = daysLateOrEarly > 1;

  const gapDoorsPerDay = target.requiredDoorsPerDay - target.avgDoorsPerDay7;

  // Generate recommended actions based on target state
  const recommendedActions: RecommendedActionData[] = [];

  // Action 1: Add shifts if behind pace
  if (target.paceStatus !== 'on-track' && gapDoorsPerDay > 0) {
    const shiftsNeeded = Math.ceil(gapDoorsPerDay / target.avgDoorsPerShift7);
    recommendedActions.push({
      id: 'add-shifts-1',
      type: 'add-shifts',
      title: `Add ${shiftsNeeded * 7} canvasser-shifts this week`,
      reason: `Current pace is ${target.avgDoorsPerDay7}/day; you need ${target.requiredDoorsPerDay}/day to finish by ${new Date(target.endDate).toLocaleDateString()}.`,
      impact: `+${Math.round(shiftsNeeded * target.avgDoorsPerShift7)}–${Math.round(shiftsNeeded * target.avgDoorsPerShift7 * 1.2)} doors/day (based on avg ${target.avgDoorsPerShift7} doors/shift)`,
      impactDoorsPerDay: Math.round(shiftsNeeded * target.avgDoorsPerShift7),
      suggestedOwner: 'Ben Blaser',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: target.paceStatus === 'at-risk' ? 'high' : 'medium'
    });
  }

  // Action 2: Fill schedule gaps
  if (target.shiftsNext7Days < 14) {
    recommendedActions.push({
      id: 'fill-gaps-1',
      type: 'fill-schedule-gaps',
      title: 'Fill schedule gaps: add shifts Tue/Thu',
      reason: `Only ${target.shiftsNext7Days} shifts scheduled in next 7 days; weekdays are underutilized.`,
      impact: 'Stabilizes daily doors; reduces catch-up risk',
      impactDoorsPerDay: 60,
      suggestedOwner: 'Jordan Hayes',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium'
    });
  }

  // Action 3: Split turf
  if (target.doorsRemaining > 3000) {
    const turfSplits = Math.ceil(target.activeCanvassersCount * 1.2);
    recommendedActions.push({
      id: 'split-turf-1',
      type: 'split-turf',
      title: `Split remaining ${target.doorsRemaining.toLocaleString()} doors into ${turfSplits} equal turfs`,
      reason: 'Current turf distribution is uneven; some canvassers are finishing early.',
      impact: 'Higher utilization; reduces idle time',
      suggestedOwner: 'Sam Chen',
      priority: 'low'
    });
  }

  // Action 4: QA review if at risk
  if (target.paceStatus === 'at-risk' || target.primaryBlocker === 'qa-flags') {
    recommendedActions.push({
      id: 'qa-review-1',
      type: 'qa-review',
      title: 'Run QA review on last 3 days of submissions',
      reason: 'ID rate spike + timestamp anomalies detected.',
      impact: 'Protects deliverable integrity; reduces client risk',
      suggestedOwner: 'Taylor Brooks',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high'
    });
  }

  // Action 5: Request data pull if low density
  if (target.primaryBlocker === 'low-density' || target.primaryBlocker === 'no-turf') {
    recommendedActions.push({
      id: 'data-pull-1',
      type: 'request-data-pull',
      title: 'Request refreshed list for Zone 3',
      reason: 'Zone 3 shows low productivity; likely address quality issue.',
      impact: 'Prevents wasted shifts; stabilizes pace',
      suggestedOwner: 'Ben Blaser',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high'
    });
  }

  // Action 6: Rebalance canvassers if understaffed
  if (target.primaryBlocker === 'understaffed') {
    recommendedActions.push({
      id: 'rebalance-1',
      type: 'rebalance-canvassers',
      title: 'Move 2 canvassers from Project CA-12 → this target',
      reason: 'Project CA-12 is +4 days ahead; this target is projected 2 days late.',
      impact: '+60 doors/day',
      impactDoorsPerDay: 60,
      suggestedOwner: 'Ben Blaser',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high'
    });
  }

  const handleViewDetails = (action: RecommendedActionData) => {
    setSelectedAction(action);
    setShowMathDrawer(true);
  };

  const aiConfidence = target.paceStatus === 'on-track' ? 'High' : 
                       target.paceStatus === 'slightly-behind' ? 'Medium' : 'Low';

  return (
    <div className="h-full flex flex-col">
      {/* Summary Strip */}
      <div className={`
        border-b p-5 transition-colors
        ${isDarkMode 
          ? 'bg-slate-900/50 border-white/10' 
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}
      `}>
        <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {target.projectName} - {target.geography}
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          {/* Projected Finish */}
          <div>
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>PROJECTED FINISH</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-lg font-bold ${
                isOnTime ? (isDarkMode ? 'text-emerald-400' : 'text-green-600') : 
                isEarly ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : 
                (isDarkMode ? 'text-rose-400' : 'text-red-600')
              }`}>
                {projectedFinishDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className={`text-sm ${
                isOnTime ? (isDarkMode ? 'text-emerald-400/80' : 'text-green-600') : 
                isEarly ? (isDarkMode ? 'text-blue-400/80' : 'text-blue-600') : 
                (isDarkMode ? 'text-rose-400/80' : 'text-red-600')
              }`}>
                {isOnTime ? '(on time)' : 
                 isEarly ? `(${Math.abs(daysLateOrEarly)} days early)` : 
                 `(${daysLateOrEarly} days late)`}
              </p>
            </div>
          </div>

          {/* Gap */}
          <div>
            <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>GAP</p>
            <p className={`text-lg font-bold ${
              gapDoorsPerDay > 0 
                ? (isDarkMode ? 'text-rose-400' : 'text-red-600') 
                : (isDarkMode ? 'text-emerald-400' : 'text-green-600')
            }`}>
              {gapDoorsPerDay > 0 ? `Need +${gapDoorsPerDay}` : `Ahead by ${Math.abs(gapDoorsPerDay)}`} doors/day
            </p>
          </div>

          {/* AI Confidence */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>PYTHIA CONFIDENCE</p>
              <button 
                className={`${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                onClick={() => setShowMathDrawer(true)}
              >
                <Info size={14} />
              </button>
            </div>
            <p className={`text-lg font-bold ${
              aiConfidence === 'High' ? (isDarkMode ? 'text-emerald-400' : 'text-green-600') : 
              aiConfidence === 'Medium' ? (isDarkMode ? 'text-amber-400' : 'text-yellow-600') : 
              (isDarkMode ? 'text-rose-400' : 'text-red-600')
            }`}>
              {aiConfidence}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Actions Stack */}
      <div className="flex-1 overflow-auto p-5">
        <div className="mb-4">
          <h3 className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            Recommended Actions
            <span className={`text-sm font-normal ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({recommendedActions.length} actions)</span>
          </h3>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Pythia-ranked actions ordered by impact on door completion
          </p>
        </div>

        {recommendedActions.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recommended actions at this time</p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>This target is on track</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendedActions.map((action) => (
              <RecommendedAction
                key={action.id}
                action={action}
                onExecute={onExecuteAction}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Math Drawer */}
      <ActionMathDrawer
        isOpen={showMathDrawer}
        onClose={() => setShowMathDrawer(false)}
        target={{
          doorsRemaining: target.doorsRemaining,
          daysRemaining: target.daysRemaining,
          avgDoorsPerDay7: target.avgDoorsPerDay7,
          avgDoorsPerDay14: Math.round(target.avgDoorsPerDay7 * 0.95), // Mock 14-day avg
          avgDoorsPerShift: target.avgDoorsPerShift7,
          requiredDoorsPerDay: target.requiredDoorsPerDay
        }}
        actionType={selectedAction?.title || 'Action Analysis'}
        incrementalDoors={selectedAction?.impactDoorsPerDay}
      />
    </div>
  );
};
