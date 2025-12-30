import React from 'react';
import { AlertTriangle, Sparkles, Plus, UserPlus, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface Risk {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  mitigationTasks: string[];
}

export function RiskRadar() {
  const risks: Risk[] = [
    {
      id: '1',
      title: 'HB90 Amendment H24 adds enforcement authority',
      severity: 'high',
      confidence: 'high',
      reasons: [
        'Client previously opposed similar language',
        'May trigger opposition from industry coalition',
        'Limited time to coordinate response',
      ],
      mitigationTasks: [
        'Draft amendment analysis memo',
        'Schedule client call to confirm position',
        'Coordinate coalition response',
      ],
    },
    {
      id: '2',
      title: 'Opposition coalition forming on solar incentives',
      severity: 'medium',
      confidence: 'medium',
      reasons: [
        'Three lobbying firms hired by utilities',
        'Increased negative media coverage',
        'Committee members expressing concerns',
      ],
      mitigationTasks: [
        'Map opposition stakeholders',
        'Develop counter-messaging',
        'Strengthen committee relationships',
      ],
    },
    {
      id: '3',
      title: 'GridTech contract ends in 45 days; low deliverable cadence',
      severity: 'high',
      confidence: 'high',
      reasons: [
        'Only 3 deliverables this quarter vs 8 planned',
        'No QBR scheduled',
        '$120K annual contract at risk',
      ],
      mitigationTasks: [
        'Complete overdue deliverables ASAP',
        'Schedule urgent QBR',
        'Compile value-add summary',
      ],
    },
    {
      id: '4',
      title: 'Committee chair undecided on HB90 support',
      severity: 'medium',
      confidence: 'medium',
      reasons: [
        'No public position stated',
        'Chair asked critical questions at informational',
        'Relationship with sponsor is strained',
      ],
      mitigationTasks: [
        'Schedule 1:1 meeting with chair',
        'Prepare briefing materials',
        'Identify common ground issues',
      ],
    },
  ];

  const severityColors = {
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
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Risk Radar</h3>
        <Chip variant="warning" className="text-xs">
          {risks.length} risks
        </Chip>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {risks.map((risk) => (
          <div key={risk.id} className="p-3 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">{risk.title}</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        severityColors[risk.severity]
                      }`}
                    >
                      {risk.severity.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Pythia analysis */}
                <div className="p-2 bg-white border border-red-200 rounded mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={10} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">
                      Pythia Analysis
                    </span>
                    <Chip variant={confidenceVariant[risk.confidence]} className="text-xs">
                      {risk.confidence} confidence
                    </Chip>
                  </div>
                  <div className="text-xs text-gray-700">
                    <div className="font-medium mb-1">Reasons:</div>
                    <ul className="space-y-0.5">
                      {risk.reasons.map((reason, idx) => (
                        <li key={idx} className="pl-3">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended mitigation */}
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-900 mb-1">
                    Recommended Mitigation:
                  </div>
                  <ul className="space-y-1">
                    {risk.mitigationTasks.map((task, idx) => (
                      <li key={idx} className="text-xs text-gray-700 pl-3">
                        → {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="text-xs">
                    <Plus size={10} />
                    Create Tasks
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <UserPlus size={10} />
                    Assign
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <Save size={10} />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
