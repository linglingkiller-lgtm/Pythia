import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { X, TrendingUp, DollarSign, Target, Clock, Users, FileText, Sparkles, AlertTriangle, CheckCircle, Send, Plus, Calendar } from 'lucide-react';
import { type Opportunity, type OpportunityStage, getOpportunitiesByClient, calculateOpportunityValue } from '../../data/workHubData';

interface OpportunityPipelineModalProps {
  clientId: string;
  clientName: string;
  onClose: () => void;
}

export function OpportunityPipelineModal({ clientId, clientName, onClose }: OpportunityPipelineModalProps) {
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<Opportunity | null>(null);

  const opportunities = getOpportunitiesByClient(clientId);
  const pipelineValue = calculateOpportunityValue(opportunities);

  // Keyboard support
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedOpportunity) {
          setSelectedOpportunity(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOpportunity, onClose]);

  const stages: { id: OpportunityStage; label: string; description: string }[] = [
    { id: 'identified', label: 'Identified', description: 'Potential opportunity spotted' },
    { id: 'qualified', label: 'Qualified', description: 'Validated need and fit' },
    { id: 'proposal', label: 'Proposal', description: 'Proposal sent to client' },
    { id: 'negotiation', label: 'Negotiation', description: 'Discussing terms' },
    { id: 'closed-won', label: 'Closed Won', description: 'Deal signed!' },
    { id: 'closed-lost', label: 'Closed Lost', description: 'Not moving forward' },
  ];

  const getOpportunitiesByStage = (stage: OpportunityStage) => {
    return opportunities.filter(o => o.stage === stage);
  };

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case 'identified': return 'border-gray-300 bg-gray-50';
      case 'qualified': return 'border-blue-300 bg-blue-50';
      case 'proposal': return 'border-purple-300 bg-purple-50';
      case 'negotiation': return 'border-yellow-300 bg-yellow-50';
      case 'closed-won': return 'border-green-300 bg-green-50';
      case 'closed-lost': return 'border-red-300 bg-red-50';
    }
  };

  if (selectedOpportunity) {
    return (
      <OpportunityDetailView
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp size={24} />
              <div>
                <h2 className="text-xl font-bold">Opportunity Pipeline</h2>
                <p className="text-green-100 text-sm">{clientName}</p>
              </div>
            </div>
            
            {/* Pipeline Value */}
            <div className="flex items-center gap-6 mt-4">
              <div>
                <div className="text-xs text-green-100 mb-1">Total Pipeline Value</div>
                <div className="text-2xl font-bold">
                  ${Math.round(pipelineValue.total).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-green-100 mb-1">Monthly Recurring</div>
                <div className="text-lg font-semibold">
                  ${Math.round(pipelineValue.recurring).toLocaleString()}/mo
                </div>
              </div>
              <div>
                <div className="text-xs text-green-100 mb-1">One-Time Projects</div>
                <div className="text-lg font-semibold">
                  ${Math.round(pipelineValue.oneTime).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-green-100 mb-1">Active Opportunities</div>
                <div className="text-lg font-semibold">{opportunities.length}</div>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Action Bar */}
        <div className="border-b border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Chip variant="neutral" size="sm">
              {opportunities.filter(o => o.source === 'pythia-detected').length} Pythia-Detected
            </Chip>
            <Chip variant="neutral" size="sm">
              {opportunities.filter(o => o.source === 'scope-drift').length} Scope Drift
            </Chip>
            <Chip variant="neutral" size="sm">
              {opportunities.filter(o => o.source === 'client-request').length} Client Requested
            </Chip>
          </div>

          <Button variant="primary" size="sm">
            <Plus size={14} />
            Add Opportunity
          </Button>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          <div className="flex gap-4 min-w-max h-full">
            {stages.map(stage => {
              const stageOpps = getOpportunitiesByStage(stage.id);
              const stageValue = calculateOpportunityValue(stageOpps);
              
              return (
                <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col">
                  <div className={`rounded-t px-3 py-2 border-b-2 ${getStageColor(stage.id)}`}>
                    <div className="font-semibold text-sm text-gray-900">
                      {stage.label}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">{stage.description}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">
                        {stageOpps.length} {stageOpps.length === 1 ? 'opportunity' : 'opportunities'}
                      </span>
                      {stageValue.total > 0 && (
                        <span className="text-xs font-semibold text-gray-900">
                          ${Math.round(stageValue.total).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-b p-2 space-y-2 overflow-y-auto">
                    {stageOpps.map(opp => (
                      <OpportunityCard
                        key={opp.id}
                        opportunity={opp}
                        onClick={() => setSelectedOpportunity(opp)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div>
              Weighted pipeline value includes probability adjustments • Recurring value annualized
            </div>
            <div>Press ESC to close</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick: () => void;
}

function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scope-expansion': return 'bg-blue-100 text-blue-800';
      case 'coalition-management': return 'bg-purple-100 text-purple-800';
      case 'crisis-response': return 'bg-red-100 text-red-800';
      case 'strategic-advisory': return 'bg-green-100 text-green-800';
      case 'media-relations': return 'bg-yellow-100 text-yellow-800';
      case 'grassroots': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'pythia-detected': return <Sparkles size={12} className="text-purple-600" />;
      case 'scope-drift': return <AlertTriangle size={12} className="text-yellow-600" />;
      case 'client-request': return <Users size={12} className="text-blue-600" />;
      case 'proactive-pitch': return <TrendingUp size={12} className="text-green-600" />;
      default: return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="p-3 bg-white rounded border border-gray-200 hover:shadow-md hover:border-blue-500 transition-all cursor-pointer"
    >
      <div className="mb-2">
        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
          {opportunity.title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-2">{opportunity.description}</p>
      </div>

      <div className="flex items-center gap-1 mb-2">
        <Chip variant="neutral" size="sm" className={getTypeColor(opportunity.type)}>
          {opportunity.type.replace('-', ' ')}
        </Chip>
      </div>

      <div className="space-y-1.5 mb-2 pb-2 border-b border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Value</span>
          <span className="font-semibold text-gray-900">
            ${opportunity.valueEstimate.toLocaleString()}{opportunity.isRecurring && '/mo'}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Probability</span>
          <span className="font-semibold text-gray-900">{opportunity.probability}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Weighted</span>
          <span className="font-semibold text-green-700">
            ${Math.round(opportunity.valueEstimate * opportunity.probability / 100).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          {getSourceIcon(opportunity.source)}
          <span className="capitalize">{opportunity.source.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Users size={12} />
          {opportunity.ownerName}
        </div>
        {opportunity.expectedCloseDate && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Target size={12} />
            Close: {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

interface OpportunityDetailViewProps {
  opportunity: Opportunity;
  onClose: () => void;
}

function OpportunityDetailView({ opportunity, onClose }: OpportunityDetailViewProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scope-expansion': return 'from-blue-600 to-blue-700';
      case 'coalition-management': return 'from-purple-600 to-purple-700';
      case 'crisis-response': return 'from-red-600 to-red-700';
      case 'strategic-advisory': return 'from-green-600 to-green-700';
      case 'media-relations': return 'from-yellow-600 to-yellow-700';
      case 'grassroots': return 'from-orange-600 to-orange-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r ${getTypeColor(opportunity.type)} text-white p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={24} />
                <Chip variant="neutral" size="sm" className="bg-white/20 text-white border-white/30">
                  {opportunity.stage.replace('-', ' ').toUpperCase()}
                </Chip>
              </div>
              <h2 className="text-xl font-bold mb-1">{opportunity.title}</h2>
              <p className="text-white/90 text-sm">{opportunity.clientName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-white/70 mb-1">Value</div>
              <div className="text-lg font-bold">
                ${opportunity.valueEstimate.toLocaleString()}
                {opportunity.isRecurring && <span className="text-sm">/mo</span>}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Probability</div>
              <div className="text-lg font-bold">{opportunity.probability}%</div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Weighted Value</div>
              <div className="text-lg font-bold">
                ${Math.round(opportunity.valueEstimate * opportunity.probability / 100).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-white/70 mb-1">Type</div>
              <div className="text-sm capitalize">{opportunity.type.replace('-', ' ')}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Description */}
            <section>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{opportunity.description}</p>
            </section>

            {/* Pythia Insights */}
            <section className="bg-purple-50 border border-purple-200 rounded p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-600">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Why This Opportunity Exists</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    Source: {opportunity.source.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {opportunity.reasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sales Info */}
            <section>
              <h3 className="font-semibold text-gray-900 mb-3">Sales Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">Owner</div>
                  <div className="font-medium text-gray-900">{opportunity.ownerName}</div>
                </div>
                {opportunity.expectedCloseDate && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Expected Close</div>
                    <div className="font-medium text-gray-900">
                      {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {opportunity.proposalSent && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Proposal Sent</div>
                    <div className="font-medium text-gray-900">
                      {new Date(opportunity.proposalSent).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {opportunity.lastContact && (
                  <div className="p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Last Contact</div>
                    <div className="font-medium text-gray-900">
                      {new Date(opportunity.lastContact).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Next Action */}
            {opportunity.nextAction && (
              <section className="bg-blue-50 border border-blue-200 rounded p-4">
                <div className="flex items-start gap-3">
                  <Target size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Next Action</h4>
                    <p className="text-sm text-gray-700">{opportunity.nextAction}</p>
                  </div>
                </div>
              </section>
            )}

            {/* Linked Objects */}
            {(opportunity.linkedProjectIds.length > 0 || opportunity.linkedBillIds.length > 0) && (
              <section>
                <h3 className="font-semibold text-gray-900 mb-3">Related</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.linkedProjectIds.length > 0 && (
                    <Chip variant="neutral" size="sm">
                      {opportunity.linkedProjectIds.length} {opportunity.linkedProjectIds.length === 1 ? 'project' : 'projects'}
                    </Chip>
                  )}
                  {opportunity.linkedBillIds.length > 0 && (
                    <Chip variant="neutral" size="sm">
                      {opportunity.linkedBillIds.length} {opportunity.linkedBillIds.length === 1 ? 'bill' : 'bills'}
                    </Chip>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-600">
            Created {new Date(opportunity.createdAt).toLocaleDateString()} • 
            Updated {new Date(opportunity.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm">
              <FileText size={14} />
              Generate Proposal
            </Button>
            <Button variant="secondary" size="sm">
              <Calendar size={14} />
              Schedule Meeting
            </Button>
            <Button variant="primary" size="sm">
              <Send size={14} />
              Advance Stage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
