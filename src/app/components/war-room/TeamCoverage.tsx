import React from 'react';
import { Users, AlertCircle, UserPlus, Mail } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  tasksDueToday: number;
  tasksOverdue: number;
  activeProjects: number;
}

interface CoverageGap {
  id: string;
  area: string;
  description: string;
}

export function TeamCoverage() {
  const team: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      initials: 'SC',
      tasksDueToday: 3,
      tasksOverdue: 0,
      activeProjects: 5,
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      initials: 'MR',
      tasksDueToday: 2,
      tasksOverdue: 1,
      activeProjects: 4,
    },
    {
      id: '3',
      name: 'Alex Thompson',
      initials: 'AT',
      tasksDueToday: 4,
      tasksOverdue: 2,
      activeProjects: 6,
    },
    {
      id: '4',
      name: 'Jamie Lee',
      initials: 'JL',
      tasksDueToday: 1,
      tasksOverdue: 0,
      activeProjects: 3,
    },
  ];

  const gaps: CoverageGap[] = [
    {
      id: '1',
      area: 'Energy Committee',
      description: 'No assigned coverage for tomorrow\'s hearing',
    },
    {
      id: '2',
      area: 'HB90 Whip Count',
      description: 'Vote count needs owner assignment',
    },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Team Load & Coverage</h3>
        <Chip variant="neutral" className="text-xs">
          {team.length} members
        </Chip>
      </div>

      {/* Team members */}
      <div className="space-y-2 mb-4">
        {team.map((member) => (
          <div key={member.id} className="p-2 bg-gray-50 border border-gray-200 rounded">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                {member.initials}
              </div>
              <span className="text-xs font-medium text-gray-900 flex-1">
                {member.name}
              </span>
              {member.tasksOverdue > 0 && (
                <Chip variant="warning" className="text-xs">
                  {member.tasksOverdue} overdue
                </Chip>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 pl-8">
              <div>
                <span className="font-medium">{member.tasksDueToday}</span> due today
              </div>
              <div>
                <span className="font-medium">{member.tasksOverdue}</span> overdue
              </div>
              <div>
                <span className="font-medium">{member.activeProjects}</span> projects
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coverage gaps */}
      {gaps.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-yellow-600" />
            <span className="text-xs font-medium text-gray-900">Coverage Gaps</span>
          </div>
          <div className="space-y-2">
            {gaps.map((gap) => (
              <div key={gap.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="text-xs font-medium text-gray-900 mb-1">{gap.area}</div>
                <div className="text-xs text-gray-600 mb-2">{gap.description}</div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="text-xs">
                    <UserPlus size={10} />
                    Assign Owner
                  </Button>
                  <Button variant="secondary" size="sm" className="text-xs">
                    <Mail size={10} />
                    Request Support
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
