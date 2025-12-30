import React from 'react';
import { X, Calculator } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';

interface ActionMathDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    doorsRemaining: number;
    daysRemaining: number;
    avgDoorsPerDay7: number;
    avgDoorsPerDay14: number;
    avgDoorsPerShift: number;
    requiredDoorsPerDay: number;
  };
  actionType: string;
  incrementalDoors?: number;
}

export const ActionMathDrawer: React.FC<ActionMathDrawerProps> = ({
  isOpen,
  onClose,
  target,
  actionType,
  incrementalDoors = 0
}) => {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`
        relative rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto border
        ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
      `}>
        {/* Header */}
        <div className={`
          sticky top-0 border-b p-4 flex items-center justify-between
          ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}
        `}>
          <div className="flex items-center gap-2">
            <Calculator size={20} className={isDarkMode ? "text-blue-400" : "text-blue-600"} />
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Action Math: {actionType}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className={isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Current Situation */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-blue-900/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>Current Situation</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-blue-300/70' : 'text-blue-700'}`}>Doors Remaining</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>{target.doorsRemaining.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-blue-300/70' : 'text-blue-700'}`}>Days Remaining</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-blue-100' : 'text-blue-900'}`}>{target.daysRemaining}</span>
              </div>
            </div>
          </div>

          {/* Required Pace */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-purple-900/10 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>Required Pace</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-purple-300/70' : 'text-purple-700'}`}>Required Doors/Day</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-purple-100' : 'text-purple-900'}`}>{target.requiredDoorsPerDay}</span>
              </div>
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-purple-300/60' : 'text-purple-600'}`}>
                Calculation: {target.doorsRemaining.toLocaleString()} doors ÷ {target.daysRemaining} days = {target.requiredDoorsPerDay} doors/day
              </div>
            </div>
          </div>

          {/* Current Performance */}
          <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
            <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>Current Performance</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>7-Day Avg Doors/Day</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{target.avgDoorsPerDay7}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>14-Day Avg Doors/Day</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{target.avgDoorsPerDay14}</span>
              </div>
              <div className="flex justify-between">
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>Avg Doors/Shift</span>
                <span className={`text-sm font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{target.avgDoorsPerShift}</span>
              </div>
            </div>
          </div>

          {/* Gap Analysis */}
          <div className={`p-4 rounded-lg border ${
            target.avgDoorsPerDay7 >= target.requiredDoorsPerDay 
              ? (isDarkMode ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-green-50 border-green-200')
              : (isDarkMode ? 'bg-rose-900/10 border-rose-500/20' : 'bg-red-50 border-red-200')
          }`}>
            <h4 className={`text-sm font-medium mb-3 ${
              target.avgDoorsPerDay7 >= target.requiredDoorsPerDay 
                ? (isDarkMode ? 'text-emerald-400' : 'text-green-900')
                : (isDarkMode ? 'text-rose-400' : 'text-red-900')
            }`}>
              Gap Analysis
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`text-sm ${
                  target.avgDoorsPerDay7 >= target.requiredDoorsPerDay 
                    ? (isDarkMode ? 'text-emerald-400/70' : 'text-green-700')
                    : (isDarkMode ? 'text-rose-400/70' : 'text-red-700')
                }`}>
                  Current vs Required
                </span>
                <span className={`text-sm font-bold ${
                  target.avgDoorsPerDay7 >= target.requiredDoorsPerDay 
                    ? (isDarkMode ? 'text-emerald-300' : 'text-green-900')
                    : (isDarkMode ? 'text-rose-300' : 'text-red-900')
                }`}>
                  {target.avgDoorsPerDay7 >= target.requiredDoorsPerDay ? '+' : ''}
                  {target.avgDoorsPerDay7 - target.requiredDoorsPerDay} doors/day
                </span>
              </div>
              {target.avgDoorsPerDay7 < target.requiredDoorsPerDay && (
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-rose-400/80' : 'text-red-600'}`}>
                  Need to increase pace by {Math.abs(target.avgDoorsPerDay7 - target.requiredDoorsPerDay)} doors/day to finish on time
                </div>
              )}
            </div>
          </div>

          {/* Action Impact */}
          {incrementalDoors > 0 && (
            <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-green-50 border-green-200'}`}>
              <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-emerald-400' : 'text-green-900'}`}>Estimated Action Impact</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-emerald-400/70' : 'text-green-700'}`}>Incremental Doors/Day</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-green-900'}`}>+{incrementalDoors}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-emerald-400/70' : 'text-green-700'}`}>New Projected Pace</span>
                  <span className={`text-sm font-bold ${isDarkMode ? 'text-emerald-300' : 'text-green-900'}`}>
                    {target.avgDoorsPerDay7 + incrementalDoors} doors/day
                  </span>
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-emerald-400/60' : 'text-green-600'}`}>
                  Based on historical avg of {target.avgDoorsPerShift} doors per canvasser-shift
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`sticky bottom-0 border-t p-4 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
          <Button variant="secondary" onClick={onClose} className={`w-full ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : ''}`}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
