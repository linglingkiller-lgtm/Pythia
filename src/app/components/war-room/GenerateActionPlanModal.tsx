import React, { useState } from 'react';
import { X, Loader2, Sparkles, Target, Calendar, Users, CheckSquare, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

interface GenerateActionPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTargets: string[];
  allTargets: any[];
}

export interface ActionPlanFormData {
  planName: string;
  timeframe: 'next-7-days' | 'next-14-days' | 'next-30-days';
  priorityFocus: 'all' | 'at-risk-only' | 'understaffed-only' | 'data-blocked-only';
  includeShiftRecommendations: boolean;
  includeStaffingPlans: boolean;
  includeTurfRequests: boolean;
  includeQACheckins: boolean;
  autoAssignOwners: boolean;
  sendNotifications: boolean;
}

export const GenerateActionPlanModal: React.FC<GenerateActionPlanModalProps> = ({
  isOpen,
  onClose,
  selectedTargets,
  allTargets
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ActionPlanFormData>({
    planName: `Action Plan — Week of ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    timeframe: 'next-7-days',
    priorityFocus: 'all',
    includeShiftRecommendations: true,
    includeStaffingPlans: true,
    includeTurfRequests: true,
    includeQACheckins: true,
    autoAssignOwners: true,
    sendNotifications: false
  });

  if (!isOpen) return null;

  const targetCount = selectedTargets.length > 0 ? selectedTargets.length : allTargets.length;
  const targetText = selectedTargets.length > 0 
    ? `${selectedTargets.length} selected project${selectedTargets.length > 1 ? 's' : ''}`
    : `all ${allTargets.length} projects`;

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('Generating action plan with data:', formData);
    console.log('For targets:', selectedTargets.length > 0 ? selectedTargets : 'all');
    setIsGenerating(false);
    onClose();
    // Show success message
    alert(`✓ Action Plan Generated!\n\n"${formData.planName}" has been created for ${targetText}.\n\nThe plan includes ${estimateTaskCount()} recommended actions.`);
  };

  const estimateTaskCount = () => {
    let count = 0;
    if (formData.includeShiftRecommendations) count += targetCount * 2;
    if (formData.includeStaffingPlans) count += targetCount;
    if (formData.includeTurfRequests) count += Math.ceil(targetCount * 0.4);
    if (formData.includeQACheckins) count += targetCount;
    return count;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={24} className="text-blue-600" />
              <h2 className="text-gray-900">Generate Action Plan</h2>
            </div>
            <p className="text-sm text-gray-500">
              Pythia will analyze {targetText} and create a prioritized action plan
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isGenerating}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Plan Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plan Name
            </label>
            <input
              type="text"
              value={formData.planName}
              onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGenerating}
            />
          </div>

          {/* Timeframe and Priority Focus */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={14} className="inline mr-1" />
                Timeframe
              </label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({ ...formData, timeframe: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating}
              >
                <option value="next-7-days">Next 7 Days</option>
                <option value="next-14-days">Next 14 Days</option>
                <option value="next-30-days">Next 30 Days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target size={14} className="inline mr-1" />
                Priority Focus
              </label>
              <select
                value={formData.priorityFocus}
                onChange={(e) => setFormData({ ...formData, priorityFocus: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isGenerating}
              >
                <option value="all">All Projects</option>
                <option value="at-risk-only">At-Risk Only</option>
                <option value="understaffed-only">Understaffed Only</option>
                <option value="data-blocked-only">Data-Blocked Only</option>
              </select>
            </div>
          </div>

          {/* Action Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <CheckSquare size={14} className="inline mr-1" />
              Include in Action Plan
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.includeShiftRecommendations}
                  onChange={(e) => setFormData({ ...formData, includeShiftRecommendations: e.target.checked })}
                  className="mt-0.5"
                  disabled={isGenerating}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Shift Recommendations</div>
                  <div className="text-xs text-gray-600">Pythia-suggested shift schedules to hit pace targets</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.includeStaffingPlans}
                  onChange={(e) => setFormData({ ...formData, includeStaffingPlans: e.target.checked })}
                  className="mt-0.5"
                  disabled={isGenerating}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Staffing & Recruitment Plans</div>
                  <div className="text-xs text-gray-600">Canvasser hiring needs and lead assignment recommendations</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.includeTurfRequests}
                  onChange={(e) => setFormData({ ...formData, includeTurfRequests: e.target.checked })}
                  className="mt-0.5"
                  disabled={isGenerating}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">Turf & Data Pull Requests</div>
                  <div className="text-xs text-gray-600">Automated requests for missing walk lists and turf allocations</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.includeQACheckins}
                  onChange={(e) => setFormData({ ...formData, includeQACheckins: e.target.checked })}
                  className="mt-0.5"
                  disabled={isGenerating}
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">QA Check-ins & Spot Audits</div>
                  <div className="text-xs text-gray-600">Scheduled quality assurance tasks based on project risk scores</div>
                </div>
              </label>
            </div>
          </div>

          {/* Automation Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Users size={14} className="inline mr-1" />
              Automation Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.autoAssignOwners}
                  onChange={(e) => setFormData({ ...formData, autoAssignOwners: e.target.checked })}
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-700">Auto-assign action owners based on project teams</span>
              </label>

              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendNotifications}
                  onChange={(e) => setFormData({ ...formData, sendNotifications: e.target.checked })}
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-700">Send email notifications to assigned team members</span>
              </label>
            </div>
          </div>

          {/* Estimated Output Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-blue-600 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-900 mb-1">Estimated Plan Output</div>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>• {targetCount} project{targetCount > 1 ? 's' : ''} will be analyzed</div>
                  <div>• Approximately {estimateTaskCount()} actions will be generated</div>
                  <div>• {formData.autoAssignOwners ? 'Actions will be auto-assigned' : 'You will need to assign action owners'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <AlertTriangle size={12} className="inline mr-1" />
              This will create tasks in the Projects tab
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
