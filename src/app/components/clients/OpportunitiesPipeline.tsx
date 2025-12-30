import React from 'react';
import { type Opportunity } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Plus, DollarSign, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface OpportunitiesPipelineProps {
  opportunities: Opportunity[];
}

export function OpportunitiesPipeline({ opportunities }: OpportunitiesPipelineProps) {
  const { isDarkMode } = useTheme();
  const stages: Array<Opportunity['stage']> = ['identified', 'contacted', 'proposal', 'negotiation', 'won', 'lost'];
  
  const stageLabels = {
    identified: 'Identified',
    contacted: 'Contacted',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    won: 'Won',
    lost: 'Lost',
  };

  const opportunitiesByStage = stages.reduce((acc, stage) => {
    acc[stage] = opportunities.filter(o => o.stage === stage);
    return acc;
  }, {} as Record<Opportunity['stage'], Opportunity[]>);

  const totalValue = opportunities
    .filter(o => o.stage !== 'lost')
    .reduce((sum, o) => sum + o.valueEstimate, 0);

  const weightedValue = opportunities
    .filter(o => o.stage !== 'lost')
    .reduce((sum, o) => sum + (o.valueEstimate * o.probability / 100), 0);

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Opportunities Pipeline</h3>
          <Button variant="primary" size="sm">
            <Plus size={14} />
            Add Opportunity
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>Total Pipeline Value</div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-blue-300' : 'text-blue-900'
            }`}>${totalValue.toLocaleString()}</div>
          </div>
          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-green-500/10 border-green-500/30'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDarkMode ? 'text-green-400' : 'text-green-600'
            }`}>Weighted Value</div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-green-300' : 'text-green-900'
            }`}>${Math.round(weightedValue).toLocaleString()}</div>
          </div>
          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className={`text-xs font-medium mb-1 ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
            }`}>Active Opportunities</div>
            <div className={`text-2xl font-bold ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
            }`}>{opportunities.filter(o => o.stage !== 'won' && o.stage !== 'lost').length}</div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 min-w-max pb-4">
            {stages.filter(stage => stage !== 'won' && stage !== 'lost').map(stage => (
              <div key={stage} className="w-64 flex-shrink-0">
                <div className={`rounded-t px-3 py-2 border-b-2 ${
                  isDarkMode
                    ? 'bg-slate-700/50 border-emerald-500/30'
                    : 'bg-gray-100 border-gray-300'
                }`}>
                  <div className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {stageLabels[stage]}
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {opportunitiesByStage[stage].length} {opportunitiesByStage[stage].length === 1 ? 'opportunity' : 'opportunities'}
                  </div>
                </div>
                <div className={`rounded-b p-2 space-y-2 min-h-[200px] ${
                  isDarkMode
                    ? 'bg-slate-700/20'
                    : 'bg-gray-50'
                }`}>
                  {opportunitiesByStage[stage].map(opp => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revere Opportunity Finder */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <Sparkles size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
            }`}>Revere Opportunity Finder</h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
            }`}>
              Revere scans client activity and automatically flags growth opportunities
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-slate-800/50 border-emerald-500/20'
              : 'bg-white border-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${
                isDarkMode
                  ? 'bg-green-500/20'
                  : 'bg-green-100'
              }`}>
                <DollarSign size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Contract renewal + expansion package
                </div>
                <div className={`text-xs mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className="font-semibold mb-1">Why flagged:</div>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Contract ends in 14 days</li>
                    <li>Delivered 40 touchpoints this quarter (above average)</li>
                    <li>Client has initiated 3 new priority areas</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Chip variant="success" size="sm">$18,000/mo recurring</Chip>
                  <Chip variant="info" size="sm">High confidence</Chip>
                </div>
                <div className="mt-3">
                  <Button variant="primary" size="sm">
                    Add to Pipeline
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-slate-800/50 border-emerald-500/20'
              : 'bg-white border-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded ${
                isDarkMode
                  ? 'bg-blue-500/20'
                  : 'bg-blue-100'
              }`}>
                <TrendingUp size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Add grassroots mobilization services
                </div>
                <div className={`text-xs mb-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className="font-semibold mb-1">Why flagged:</div>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Client mentioned "constituent outreach" 3 times in recent meetings</li>
                    <li>Competitive district battles on priority issues</li>
                    <li>Currently underutilized grassroots arm</li>
                  </ul>
                </div>
                <div className="flex items-center gap-2">
                  <Chip variant="success" size="sm">$12,000 one-time</Chip>
                  <Chip variant="info" size="sm">Medium confidence</Chip>
                </div>
                <div className="mt-3">
                  <Button variant="primary" size="sm">
                    Add to Pipeline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer ${
      isDarkMode
        ? 'bg-slate-800/60 border-white/10 hover:border-emerald-500/30'
        : 'bg-white border-gray-200 hover:border-emerald-300'
    }`}>
      <div className={`font-medium text-sm mb-2 line-clamp-2 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {opportunity.title}
      </div>
      
      <div className="flex items-center gap-1 mb-2">
        <Chip
          variant={opportunity.valueType === 'recurring' ? 'success' : 'info'}
          size="sm"
        >
          ${opportunity.valueEstimate.toLocaleString()}
        </Chip>
      </div>

      <div className={`text-xs mb-2 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {opportunity.probability}% likely • {opportunity.valueType}
      </div>

      {opportunity.nextActionSummary && (
        <div className={`text-xs p-2 rounded ${
          isDarkMode
            ? 'text-blue-300 bg-blue-500/20'
            : 'text-gray-600 bg-blue-50'
        }`}>
          <span className="font-medium">Next:</span> {opportunity.nextActionSummary}
        </div>
      )}
    </div>
  );
}