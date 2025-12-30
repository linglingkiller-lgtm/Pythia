import React, { useState } from 'react';
import { ChevronRight, ChevronDown, AlertTriangle, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface CriticalChain {
  id: string;
  title: string;
  steps: string[];
  progress: number;
  blockingStep: number;
  riskIfDelayed: string;
}

export function CriticalPathBoard() {
  const [expandedChains, setExpandedChains] = useState<Set<string>>(new Set());

  const chains: CriticalChain[] = [
    {
      id: '1',
      title: 'HB90 Hearing Prep',
      steps: ['Draft testimony', 'Client approval', 'Coordinate supporters', 'Brief staff'],
      progress: 25,
      blockingStep: 0,
      riskIfDelayed: 'Miss testimony submission deadline, lose amendment opportunity',
    },
    {
      id: '2',
      title: 'GridTech Weekly Update',
      steps: ['Compile updates', 'Internal review', 'Client approval', 'Send'],
      progress: 50,
      blockingStep: 2,
      riskIfDelayed: 'Client perception of low engagement, contract renewal risk',
    },
    {
      id: '3',
      title: 'Clean Energy Coalition',
      steps: ['ID stakeholders', 'Outreach calls', 'Town hall prep', 'Follow-ups'],
      progress: 75,
      blockingStep: 2,
      riskIfDelayed: 'Miss networking window with key decision-makers',
    },
  ];

  const toggleChain = (chainId: string) => {
    const newExpanded = new Set(expandedChains);
    if (newExpanded.has(chainId)) {
      newExpanded.delete(chainId);
    } else {
      newExpanded.add(chainId);
    }
    setExpandedChains(newExpanded);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Critical Path Board</h3>
      </div>

      <div className="space-y-3">
        {chains.map((chain) => {
          const isExpanded = expandedChains.has(chain.id);
          return (
            <div key={chain.id} className="border border-gray-200 rounded overflow-hidden">
              {/* Chain header */}
              <div
                onClick={() => toggleChain(chain.id)}
                className="p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <span className="text-xs font-medium text-gray-900">{chain.title}</span>
                </div>
                <div className="text-xs text-gray-600">{chain.progress}%</div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${chain.progress}%` }}
                />
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="p-3 bg-white">
                  {/* Steps */}
                  <div className="mb-3 space-y-2">
                    {chain.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 text-xs ${
                          idx === chain.blockingStep
                            ? 'text-red-600 font-medium'
                            : idx < chain.blockingStep
                            ? 'text-gray-400 line-through'
                            : 'text-gray-600'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                            idx === chain.blockingStep
                              ? 'border-red-500 bg-red-50'
                              : idx < chain.blockingStep
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300'
                          }`}
                        >
                          {idx < chain.blockingStep && '✓'}
                          {idx === chain.blockingStep && '!'}
                        </div>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>

                  {/* Risk */}
                  <div className="p-2 bg-red-50 border border-red-200 rounded mb-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={12} className="text-red-600 mt-0.5" />
                      <div>
                        <div className="text-xs font-medium text-red-900 mb-0.5">
                          Risk if delayed:
                        </div>
                        <div className="text-xs text-red-700">{chain.riskIfDelayed}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1 text-xs">
                      Open Chain
                    </Button>
                    <Button variant="secondary" size="sm" className="text-xs">
                      <Plus size={12} />
                      Add Tasks
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
