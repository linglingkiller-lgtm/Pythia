import React from 'react';
import { HelpCircle, Clock, Lock, Mail, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface Decision {
  id: string;
  question: string;
  decider: string;
  deadline: string;
  blockedWork: string[];
}

export function DecisionsNeeded() {
  const decisions: Decision[] = [
    {
      id: '1',
      question: 'Client stance on HB90 amendment H24?',
      decider: 'John Davis (SolarCorp)',
      deadline: 'Today 5PM',
      blockedWork: ['Testimony draft', 'Coalition outreach', 'Committee brief'],
    },
    {
      id: '2',
      question: 'Approve GridTech contract renewal terms?',
      decider: 'Alex Thompson (Internal)',
      deadline: 'Tomorrow',
      blockedWork: ['Renewal proposal', 'Client meeting'],
    },
    {
      id: '3',
      question: 'Position on Senate energy package?',
      decider: 'Maria Chen (Clean Energy Alliance)',
      deadline: 'This week',
      blockedWork: ['Press statement', 'Coalition coordination'],
    },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Decisions Needed</h3>
        <Chip variant="warning" className="text-xs">
          {decisions.length} pending
        </Chip>
      </div>

      <div className="space-y-3">
        {decisions.map((decision) => (
          <div key={decision.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-start gap-2 mb-2">
              <HelpCircle size={14} className="text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900 mb-1">
                  {decision.question}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <span className="font-medium">{decision.decider}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {decision.deadline}
                  </div>
                </div>
              </div>
            </div>

            {/* Blocked work */}
            <div className="mb-3 pl-6">
              <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                <Lock size={10} />
                <span className="font-medium">Blocked:</span>
              </div>
              <div className="space-y-1">
                {decision.blockedWork.map((work, idx) => (
                  <div key={idx} className="text-xs text-gray-600 pl-3">
                    • {work}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pl-6">
              <Button variant="primary" size="sm" className="text-xs">
                <FileText size={10} />
                Draft Memo
              </Button>
              <Button variant="secondary" size="sm" className="text-xs">
                <Mail size={10} />
                Request
              </Button>
              <Button variant="secondary" size="sm" className="text-xs">
                Mark Decided
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
