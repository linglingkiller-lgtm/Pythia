import React from 'react';
import { ShieldCheck, Clock, User, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface ComplianceItem {
  id: string;
  title: string;
  dueDate: string;
  owner: string;
  type: 'registration' | 'reporting' | 'disclosure';
}

export function ComplianceDeadlines() {
  const items: ComplianceItem[] = [
    {
      id: '1',
      title: 'Quarterly lobbying report',
      dueDate: 'Dec 31',
      owner: 'Sarah Chen',
      type: 'reporting',
    },
    {
      id: '2',
      title: 'Lobbyist registration renewal',
      dueDate: 'Jan 15',
      owner: 'Mike Rodriguez',
      type: 'registration',
    },
    {
      id: '3',
      title: 'Client disclosure filing',
      dueDate: 'Jan 31',
      owner: 'Alex Thompson',
      type: 'disclosure',
    },
  ];

  const typeColors = {
    registration: 'bg-blue-100 text-blue-800',
    reporting: 'bg-purple-100 text-purple-800',
    disclosure: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Compliance & Deadlines</h3>
        <Chip variant="neutral" className="text-xs">
          {items.length} pending
        </Chip>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="p-2 bg-gray-50 border border-gray-200 rounded">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900 mb-1">{item.title}</div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {item.dueDate}
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <User size={10} />
                    {item.owner}
                  </div>
                </div>
              </div>
              <div className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[item.type]}`}>
                {item.type}
              </div>
            </div>
            <Button variant="primary" size="sm" className="w-full text-xs">
              <Plus size={10} />
              Create Task Bundle
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
