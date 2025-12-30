import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ExternalLink, ListChecks, Package } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface MomentCardProps {
  title: string;
  countdown: string;
  impact: 'high' | 'medium' | 'low';
  whyItMatters: string;
  owners: string[];
  linkedObjects: { type: string; label: string }[];
  criticalPath: string[];
  aiRecommendation: string;
  confidence: 'high' | 'medium' | 'low';
}

function MomentCard({
  title,
  countdown,
  impact,
  whyItMatters,
  owners,
  linkedObjects,
  criticalPath,
  aiRecommendation,
  confidence,
}: MomentCardProps) {
  const impactColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  };

  const confidenceVariant = {
    high: 'success' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  };

  return (
    <Card className="p-4 min-w-[320px] hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <Chip variant="neutral" className="text-xs">
            <Clock size={12} />
            {countdown}
          </Chip>
          <div className={`px-2 py-0.5 rounded text-xs font-medium border ${impactColors[impact]}`}>
            {impact.toUpperCase()}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3">{whyItMatters}</p>

      {/* Owners */}
      <div className="flex items-center gap-1 mb-3">
        {owners.map((owner, idx) => (
          <div
            key={idx}
            className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium"
            title={owner}
          >
            {owner[0]}
          </div>
        ))}
      </div>

      {/* Linked Objects */}
      <div className="flex flex-wrap gap-1 mb-3">
        {linkedObjects.map((obj, idx) => (
          <Chip key={idx} variant="neutral" className="text-xs">
            {obj.label}
          </Chip>
        ))}
      </div>

      {/* Critical Path */}
      <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-1">Critical Path:</div>
        <div className="space-y-1">
          {criticalPath.map((task, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
              <div className="w-4 h-4 rounded-sm border border-gray-300 mt-0.5" />
              <span>{task}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-blue-900">Pythia recommends:</span>
          <Chip variant={confidenceVariant[confidence]} className="text-xs">
            {confidence} confidence
          </Chip>
        </div>
        <p className="text-xs text-blue-800">{aiRecommendation}</p>
        <button className="text-xs text-blue-600 hover:text-blue-800 mt-1 flex items-center gap-1">
          <ExternalLink size={10} />
          View sources
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="primary" size="sm" className="flex-1 text-xs">
          <Package size={12} />
          Open Prep Pack
        </Button>
        <Button variant="secondary" size="sm" className="flex-1 text-xs">
          <ListChecks size={12} />
          Create Tasks
        </Button>
        <Button variant="secondary" size="sm" className="text-xs">
          <CheckCircle2 size={12} />
        </Button>
      </div>
    </Card>
  );
}

export function DecisiveMomentsRow() {
  const moments: MomentCardProps[] = [
    {
      title: 'HB90 — Energy Committee Hearing',
      countdown: 'In 18h',
      impact: 'high',
      whyItMatters: 'Final opportunity to present solar + storage amendments before committee vote next week.',
      owners: ['Sarah Chen', 'Mike Rodriguez'],
      linkedObjects: [
        { type: 'bill', label: 'HB90' },
        { type: 'client', label: 'SolarCorp' },
        { type: 'committee', label: 'Energy' },
      ],
      criticalPath: [
        'Finalize testimony draft (due 2pm)',
        'Client approval (due 5pm)',
        'Coordinate supporter testimony',
        'Brief committee staff',
      ],
      aiRecommendation: 'Prioritize grid reliability framing based on recent committee questions and sponsor feedback.',
      confidence: 'high',
    },
    {
      title: 'Clean Energy Town Hall — Networking',
      countdown: 'In 3 days',
      impact: 'medium',
      whyItMatters: 'Key stakeholders and decision-makers attending. Opportunity to build coalition support.',
      owners: ['Jamie Lee'],
      linkedObjects: [
        { type: 'event', label: 'Town Hall' },
        { type: 'client', label: 'Clean Energy Alliance' },
      ],
      criticalPath: [
        'Confirm client attendance',
        'Prepare talking points',
        'Schedule 1:1 meetings',
      ],
      aiRecommendation: 'Target Senate Energy chair and ranking member for informal discussions on HB90.',
      confidence: 'medium',
    },
    {
      title: 'GridTech Contract Renewal',
      countdown: 'In 45 days',
      impact: 'high',
      whyItMatters: 'Major revenue client. Low deliverable cadence this quarter may impact renewal.',
      owners: ['Alex Thompson'],
      linkedObjects: [
        { type: 'client', label: 'GridTech' },
        { type: 'contract', label: 'Q4 Renewal' },
      ],
      criticalPath: [
        'Complete overdue deliverables',
        'Schedule QBR meeting',
        'Prepare renewal proposal',
        'Demonstrate value-add',
      ],
      aiRecommendation: 'Schedule immediate catch-up meeting and compile recent wins (HB90 monitoring, media tracking).',
      confidence: 'high',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Decisive Moments</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {moments.map((moment, idx) => (
          <MomentCard key={idx} {...moment} />
        ))}
      </div>
    </div>
  );
}
