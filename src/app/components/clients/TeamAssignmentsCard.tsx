import React from 'react';
import { type Client } from '../../data/clientsData';
import { mockTeamMembers } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, Plus, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface TeamAssignmentsCardProps {
  client: Client;
}

export function TeamAssignmentsCard({ client }: TeamAssignmentsCardProps) {
  const { isDarkMode } = useTheme();
  const teamMembers = mockTeamMembers.filter(m => client.ownerUserIds.includes(m.id));

  const roles = [
    { label: 'Account Owner', memberId: client.ownerUserIds[0], role: 'Primary contact & strategy' },
    { label: 'Policy Lead', memberId: client.ownerUserIds[1] || client.ownerUserIds[0], role: 'Legislative tracking & testimony' },
    { label: 'Analyst/Support', memberId: client.ownerUserIds[0], role: 'Research & reporting' },
  ];

  return (
    <div className={`p-6 rounded-lg backdrop-blur-xl border ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Internal Team</h3>
        <Button variant="secondary" size="sm">
          <Plus size={14} />
          Assign Member
        </Button>
      </div>

      <div className="space-y-3">
        {roles.map((role, index) => {
          const member = mockTeamMembers.find(m => m.id === role.memberId);
          
          return (
            <div key={index} className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/30 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                    {member?.initials || '??'}
                  </div>
                  <div>
                    <div className={`font-semibold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{member?.name || 'Unassigned'}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{role.label}</div>
                  </div>
                </div>
              </div>
              
              <div className={`text-sm mb-3 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>{role.role}</div>
              
              {member?.workloadSummary && (
                <div className={`text-xs mb-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>{member.workloadSummary}</div>
              )}

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  <Calendar size={14} />
                  View Calendar
                </Button>
                <Button variant="secondary" size="sm">
                  <Plus size={14} />
                  Assign Task
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}