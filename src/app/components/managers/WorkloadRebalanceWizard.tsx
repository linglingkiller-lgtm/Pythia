import React from 'react';
import { X, RefreshCw, Users, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { type TeamMember, type WorkloadRebalancePlan } from '../../data/teamData';

interface WorkloadRebalanceWizardProps {
  members: TeamMember[];
  onClose: () => void;
  onSave: (plan: WorkloadRebalancePlan) => void;
}

export function WorkloadRebalanceWizard({ members, onClose, onSave }: WorkloadRebalanceWizardProps) {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [timeWindow, setTimeWindow] = React.useState<'7' | '14' | '30'>('7');
  const [selectedChanges, setSelectedChanges] = React.useState<any[]>([]);

  const overloadedMembers = members.filter(m => m.status === 'overloaded');
  const underutilizedMembers = members.filter(m => m.status === 'underutilized' || (m.status === 'on-track' && m.workloadScore < 60));

  // Generate suggested transfers
  const suggestedTransfers = overloadedMembers.flatMap(overloaded => {
    const candidates = underutilizedMembers.filter(u => 
      u.departments.some(d => overloaded.departments.includes(d))
    );

    return [
      {
        fromUserId: overloaded.id,
        fromUserName: overloaded.name,
        fromWorkload: overloaded.workloadScore,
        toUserId: candidates[0]?.id || '',
        toUserName: candidates[0]?.name || 'No candidate',
        toWorkload: candidates[0]?.workloadScore || 0,
        itemTitle: `Weekly Update for ${overloaded.currentTopClients[0]}`,
        itemType: 'deliverable' as const,
        reason: 'High workload (89%) + Underutilized team member available (35%)',
        impact: {
          from: overloaded.workloadScore - 12,
          to: (candidates[0]?.workloadScore || 0) + 12
        }
      }
    ];
  });

  const handleToggleChange = (change: any) => {
    if (selectedChanges.find(c => c.fromUserId === change.fromUserId && c.itemTitle === change.itemTitle)) {
      setSelectedChanges(selectedChanges.filter(c => !(c.fromUserId === change.fromUserId && c.itemTitle === change.itemTitle)));
    } else {
      setSelectedChanges([...selectedChanges, change]);
    }
  };

  const handleSave = () => {
    const plan: WorkloadRebalancePlan = {
      id: `rebalance-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: 'current-manager',
      timeWindow: `Next ${timeWindow} days`,
      changes: selectedChanges.map(c => ({
        type: 'reassign',
        fromUserId: c.fromUserId,
        fromUserName: c.fromUserName,
        toUserId: c.toUserId,
        toUserName: c.toUserName,
        itemId: `item-${Date.now()}`,
        itemTitle: c.itemTitle,
        itemType: c.itemType,
        reason: c.reason
      })),
      status: 'proposed'
    };
    onSave(plan);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RefreshCw size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Workload Rebalance Wizard</h2>
              <p className="text-sm text-gray-600">
                Redistribute tasks and deliverables to optimize team capacity
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className="text-sm font-medium">Select Time Window</span>
            </div>
            <ArrowRight size={20} className="text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <Check size={16} /> : '2'}
              </div>
              <span className="text-sm font-medium">Review Suggestions</span>
            </div>
            <ArrowRight size={20} className="text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirm & Execute</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Time Window</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose the timeframe for workload analysis and redistribution.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTimeWindow('7')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timeWindow === '7'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">7</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </button>
                  <button
                    onClick={() => setTimeWindow('14')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timeWindow === '14'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">14</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </button>
                  <button
                    onClick={() => setTimeWindow('30')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      timeWindow === '30'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-1">30</div>
                    <div className="text-sm text-gray-600">Days</div>
                  </button>
                </div>
              </div>

              {/* Current Workload Overview */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Current Workload Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-600 mb-1">{overloadedMembers.length}</div>
                    <div className="text-sm text-gray-700">Overloaded</div>
                    <div className="text-xs text-gray-500 mt-1">≥ 80% capacity</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {members.filter(m => m.status === 'on-track').length}
                    </div>
                    <div className="text-sm text-gray-700">On Track</div>
                    <div className="text-xs text-gray-500 mt-1">40-79% capacity</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {members.filter(m => m.status === 'underutilized').length}
                    </div>
                    <div className="text-sm text-gray-700">Underutilized</div>
                    <div className="text-xs text-gray-500 mt-1">&lt; 40% capacity</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Suggested Redistributions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select the changes you want to apply. System has identified {suggestedTransfers.length} potential transfers.
                </p>
              </div>

              {suggestedTransfers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No rebalancing needed</p>
                  <p className="text-xs mt-1">Team workload is well-balanced</p>
                </div>
              ) : (
                suggestedTransfers.map((transfer, idx) => (
                  <div
                    key={idx}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedChanges.find(c => c.fromUserId === transfer.fromUserId && c.itemTitle === transfer.itemTitle)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleToggleChange(transfer)}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={!!selectedChanges.find(c => c.fromUserId === transfer.fromUserId && c.itemTitle === transfer.itemTitle)}
                        onChange={() => handleToggleChange(transfer)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-2">{transfer.itemTitle}</div>
                        
                        {/* From/To */}
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">From</div>
                            <div className="font-medium text-gray-900">{transfer.fromUserName}</div>
                            <Chip variant="danger" size="sm" className="mt-1">
                              {transfer.fromWorkload}% load
                            </Chip>
                          </div>
                          <div className="flex items-center justify-center">
                            <ArrowRight size={20} className="text-gray-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">To</div>
                            <div className="font-medium text-gray-900">{transfer.toUserName}</div>
                            <Chip variant="success" size="sm" className="mt-1">
                              {transfer.toWorkload}% load
                            </Chip>
                          </div>
                        </div>

                        {/* Impact */}
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs font-semibold text-gray-700 mb-1">Impact:</div>
                          <div className="text-xs text-gray-600">
                            {transfer.fromUserName}: {transfer.fromWorkload}% → {transfer.impact.from}% 
                            ({transfer.fromWorkload - transfer.impact.from > 0 ? '↓' : '↑'} {Math.abs(transfer.fromWorkload - transfer.impact.from)}%)
                          </div>
                          <div className="text-xs text-gray-600">
                            {transfer.toUserName}: {transfer.toWorkload}% → {transfer.impact.to}% 
                            (↑ {transfer.impact.to - transfer.toWorkload}%)
                          </div>
                        </div>

                        {/* Reason */}
                        <div className="mt-2 text-xs text-gray-600">
                          <strong>Reason:</strong> {transfer.reason}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Ready to Execute</h4>
                    <p className="text-sm text-green-800">
                      Review the changes below. A "Rebalance Plan" record will be created in the Records system with full audit trail.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Summary ({selectedChanges.length} changes)
                </h3>
                <div className="space-y-3">
                  {selectedChanges.map((change, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <RefreshCw size={16} className="text-blue-600" />
                        <span className="font-medium text-gray-900">{change.itemTitle}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {change.fromUserName} → {change.toUserName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between flex-shrink-0">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep((step - 1) as 1 | 2 | 3)}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                variant="primary" 
                onClick={() => setStep((step + 1) as 1 | 2 | 3)}
                disabled={step === 2 && selectedChanges.length === 0}
              >
                Next
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={handleSave}
                disabled={selectedChanges.length === 0}
              >
                Execute Rebalance
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
