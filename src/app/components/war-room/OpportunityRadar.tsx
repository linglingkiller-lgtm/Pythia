import React from 'react';
import { Lightbulb, Sparkles, TrendingUp, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface Opportunity {
  id: string;
  title: string;
  potential: 'high' | 'medium' | 'low';
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  recommendedNextStep: string;
}

export function OpportunityRadar() {
  const opportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Committee sponsor likely receptive to grid reliability framing',
      potential: 'high',
      confidence: 'high',
      reasons: [
        'Recent public statements emphasize reliability',
        'District experienced outages last summer',
        'Strong relationship with utility sector',
      ],
      recommendedNextStep:
        'Schedule 1:1 meeting to present solar + storage as reliability solution',
    },
    {
      id: '2',
      title: 'Open House seat 12 candidate needs field program support',
      potential: 'medium',
      confidence: 'medium',
      reasons: [
        'Pro-clean energy platform',
        'Competitive race in swing district',
        'Campaign manager seeking consultants',
      ],
      recommendedNextStep:
        'Pitch campaign services proposal; highlight energy policy expertise',
    },
    {
      id: '3',
      title: 'Client issue expanding into EV infrastructure policy area',
      potential: 'high',
      confidence: 'high',
      reasons: [
        'New EV bills filed this session',
        'Client expressed interest in adjacent markets',
        'Overlap with grid modernization work',
      ],
      recommendedNextStep:
        'Prepare EV policy brief; propose expanded scope of work',
    },
    {
      id: '4',
      title: 'Coalition partner seeking co-sponsors for companion bill',
      potential: 'medium',
      confidence: 'medium',
      reasons: [
        'Senate version of HB90 needs sponsors',
        'Coalition has strong Senate relationships',
        'Opportunity to expand advocacy reach',
      ],
      recommendedNextStep:
        'Coordinate coalition strategy; identify Senate champions',
    },
  ];

  const potentialColors = {
    high: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const confidenceVariant = {
    high: 'success' as const,
    medium: 'warning' as const,
    low: 'neutral' as const,
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Opportunity Radar</h3>
        <Chip variant="success" className="text-xs">
          {opportunities.length} opportunities
        </Chip>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {opportunities.map((opp) => (
          <div key={opp.id} className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="flex items-start gap-2 mb-2">
              <Lightbulb size={14} className="text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-medium text-gray-900">{opp.title}</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        potentialColors[opp.potential]
                      }`}
                    >
                      {opp.potential.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Pythia analysis */}
                <div className="p-2 bg-white border border-green-200 rounded mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={10} className="text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">
                      Pythia Analysis
                    </span>
                    <Chip variant={confidenceVariant[opp.confidence]} className="text-xs">
                      {opp.confidence} confidence
                    </Chip>
                  </div>
                  <div className="text-xs text-gray-700">
                    <div className="font-medium mb-1">Why this matters:</div>
                    <ul className="space-y-0.5">
                      {opp.reasons.map((reason, idx) => (
                        <li key={idx} className="pl-3">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommended next step */}
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
                  <div className="flex items-start gap-2">
                    <TrendingUp size={12} className="text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-blue-900 mb-0.5">
                        Recommended Next Step:
                      </div>
                      <div className="text-xs text-blue-800">{opp.recommendedNextStep}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="text-xs">
                    <Plus size={10} />
                    Add to Pipeline
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    Create Tasks
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
