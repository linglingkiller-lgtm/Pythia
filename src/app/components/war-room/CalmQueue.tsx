import React from 'react';
import { Clock, CheckCircle2, Pause, UserPlus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

interface Task {
  id: string;
  title: string;
  dueTime: string;
  owner: string;
  linkedObjects: string[];
  urgency: 'now' | 'next';
}

export function CalmQueue() {
  const tasks: Task[] = [
    {
      id: '1',
      title: 'Finalize HB90 testimony draft',
      dueTime: '2:00 PM',
      owner: 'SC',
      linkedObjects: ['HB90', 'SolarCorp'],
      urgency: 'now',
    },
    {
      id: '2',
      title: 'Send weekly client update to GridTech',
      dueTime: '4:00 PM',
      owner: 'AT',
      linkedObjects: ['GridTech'],
      urgency: 'now',
    },
    {
      id: '3',
      title: 'Review HB127 amendments',
      dueTime: '5:00 PM',
      owner: 'MR',
      linkedObjects: ['HB127'],
      urgency: 'now',
    },
    {
      id: '4',
      title: 'Schedule stakeholder calls for next week',
      dueTime: 'Tomorrow',
      owner: 'JL',
      linkedObjects: [],
      urgency: 'next',
    },
    {
      id: '5',
      title: 'Update bill tracking spreadsheet',
      dueTime: 'Tomorrow',
      owner: 'SC',
      linkedObjects: [],
      urgency: 'next',
    },
  ];

  const doNow = tasks.filter((t) => t.urgency === 'now');
  const doNext = tasks.filter((t) => t.urgency === 'next');

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Calm Queue</h3>
        <Chip variant="neutral" className="text-xs">
          {tasks.length} tasks
        </Chip>
      </div>

      {/* Do Now */}
      <div className="mb-4">
        <div className="text-xs font-medium text-red-600 mb-2">DO NOW</div>
        <div className="space-y-2">
          {doNow.map((task) => (
            <div
              key={task.id}
              className="p-2 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-gray-900">{task.title}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-red-200 rounded" title="Complete">
                    <CheckCircle2 size={12} className="text-green-600" />
                  </button>
                  <button className="p-1 hover:bg-red-200 rounded" title="Snooze">
                    <Pause size={12} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-red-200 rounded" title="Reassign">
                    <UserPlus size={12} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={10} />
                  {task.dueTime}
                </div>
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {task.owner}
                </div>
                {task.linkedObjects.map((obj, idx) => (
                  <Chip key={idx} variant="neutral" className="text-xs py-0">
                    {obj}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Do Next */}
      <div>
        <div className="text-xs font-medium text-blue-600 mb-2">DO NEXT</div>
        <div className="space-y-2">
          {doNext.map((task) => (
            <div
              key={task.id}
              className="p-2 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-medium text-gray-900">{task.title}</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-200 rounded" title="Complete">
                    <CheckCircle2 size={12} className="text-green-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Snooze">
                    <Pause size={12} className="text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded" title="Reassign">
                    <UserPlus size={12} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={10} />
                  {task.dueTime}
                </div>
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {task.owner}
                </div>
                {task.linkedObjects.map((obj, idx) => (
                  <Chip key={idx} variant="neutral" className="text-xs py-0">
                    {obj}
                  </Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
