import React from 'react';
import { User, ChevronRight, MoreVertical } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { type TeamMember } from '../../data/teamData';
import { useTheme } from '../../contexts/ThemeContext';

interface TeamWorkloadTableProps {
  members: TeamMember[];
  viewMode: 'table' | 'kanban';
  onSelectEmployee: (member: TeamMember) => void;
}

export function TeamWorkloadTable({ members, viewMode, onSelectEmployee }: TeamWorkloadTableProps) {
  if (viewMode === 'kanban') {
    return <KanbanView members={members} onSelectEmployee={onSelectEmployee} />;
  }

  return <TableView members={members} onSelectEmployee={onSelectEmployee} />;
}

function TableView({ members, onSelectEmployee }: { members: TeamMember[]; onSelectEmployee: (member: TeamMember) => void }) {
  const { isDarkMode } = useTheme();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overloaded': return 'danger';
      case 'on-track': return 'success';
      case 'underutilized': return 'warning';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'overloaded': return 'Overloaded';
      case 'on-track': return 'On Track';
      case 'underutilized': return 'Underutilized';
      default: return status;
    }
  };

  return (
    <div className={`rounded-lg border overflow-hidden flex flex-col h-full ${
      isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`border-b px-4 py-3 ${
        isDarkMode ? 'border-white/10 bg-slate-700/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Team Workload ({members.length})
        </h2>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className={`border-b sticky top-0 ${
            isDarkMode ? 'bg-slate-700/50 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Employee
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Department
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-32 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Workload
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-24 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Tasks Due
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-28 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Deliverables Due
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Top Clients
              </th>
              <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-32 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Last Activity
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-32 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Status
              </th>
              <th className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wider w-20 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-white/10' : 'divide-gray-100'}`}>
            {members.map((member) => (
              <tr
                key={member.id}
                className={`cursor-pointer transition-colors ${
                  isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectEmployee(member)}
              >
                {/* Employee */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {member.name}
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {member.title}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Department */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {member.departments.map((dept, idx) => (
                      <Chip key={idx} variant="neutral" size="sm" className="text-xs">
                        {dept === 'lobbying' ? 'LOB' : dept === 'public-affairs' ? 'PA' : 'CANV'}
                      </Chip>
                    ))}
                  </div>
                </td>

                {/* Workload Meter */}
                <td className="px-4 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {member.workloadScore}%
                    </div>
                    <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-2 rounded-full transition-all ${
                          member.workloadScore >= 80
                            ? 'bg-red-500'
                            : member.workloadScore >= 60
                            ? 'bg-green-500'
                            : member.workloadScore >= 40
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${member.workloadScore}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Tasks Due */}
                <td className="px-4 py-4 text-center">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.tasksDueThisWeek}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    of {member.tasksCount}
                  </div>
                </td>

                {/* Deliverables Due */}
                <td className="px-4 py-4 text-center">
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {member.deliverablesDueThisWeek}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    of {member.deliverablesCount}
                  </div>
                </td>

                {/* Top Clients */}
                <td className="px-4 py-4">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {member.currentTopClients.slice(0, 2).join(', ')}
                    {member.currentTopClients.length > 2 && (
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {' '}+{member.currentTopClients.length - 2}
                      </span>
                    )}
                  </div>
                </td>

                {/* Last Activity */}
                <td className="px-4 py-4">
                  <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {new Date(member.lastActivityAt).toLocaleDateString()}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {new Date(member.lastActivityAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">
                  <Chip variant={getStatusColor(member.status)} size="sm">
                    {getStatusLabel(member.status)}
                  </Chip>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEmployee(member);
                    }}
                    className={`p-1 rounded transition-colors ${
                      isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                    }`}
                  >
                    <ChevronRight size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <User size={48} className={isDarkMode ? 'text-gray-600 mb-4' : 'text-gray-300 mb-4'} />
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No team members found
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function KanbanView({ members, onSelectEmployee }: { members: TeamMember[]; onSelectEmployee: (member: TeamMember) => void }) {
  const { isDarkMode } = useTheme();
  const overloaded = members.filter(m => m.status === 'overloaded');
  const onTrack = members.filter(m => m.status === 'on-track');
  const underutilized = members.filter(m => m.status === 'underutilized');

  const renderMemberCard = (member: TeamMember) => (
    <div
      key={member.id}
      onClick={() => onSelectEmployee(member)}
      className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
        isDarkMode ? 'bg-slate-700/50 border-white/10' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {member.name}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {member.title}
            </div>
          </div>
        </div>
        <button className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'}`}>
          <MoreVertical size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
        </button>
      </div>

      {/* Workload Score */}
      <div className="mb-3">
        <div className={`flex items-center justify-between text-xs mb-1 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          <span>Workload</span>
          <span className="font-semibold">{member.workloadScore}%</span>
        </div>
        <div className={`w-full rounded-full h-1.5 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'}`}>
          <div
            className={`h-1.5 rounded-full ${
              member.workloadScore >= 80
                ? 'bg-red-500'
                : member.workloadScore >= 60
                ? 'bg-green-500'
                : member.workloadScore >= 40
                ? 'bg-blue-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${member.workloadScore}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-slate-600/50' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {member.tasksDueThisWeek}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Tasks Due
          </div>
        </div>
        <div className={`text-center p-2 rounded ${isDarkMode ? 'bg-slate-600/50' : 'bg-gray-50'}`}>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {member.deliverablesDueThisWeek}
          </div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Deliverables
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="flex flex-wrap gap-1 mb-2">
        {member.departments.map((dept, idx) => (
          <Chip key={idx} variant="neutral" size="sm" className="text-xs">
            {dept === 'lobbying' ? 'LOB' : dept === 'public-affairs' ? 'PA' : 'CANV'}
          </Chip>
        ))}
      </div>

      {/* Top Client */}
      <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {member.currentTopClients[0] || 'No active clients'}
      </div>
    </div>
  );

  return (
    <div className={`rounded-lg border overflow-hidden h-full flex flex-col ${
      isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`border-b px-4 py-3 ${
        isDarkMode ? 'border-white/10 bg-slate-700/50' : 'border-gray-200 bg-gray-50'
      }`}>
        <h2 className={`text-sm font-semibold uppercase tracking-wider ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Team Workload - Kanban View
        </h2>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* Overloaded Column */}
          <div className="flex flex-col">
            <div className={`border rounded-lg p-3 mb-3 ${
              isDarkMode 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-900'}`}>
                  Overloaded
                </h3>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  isDarkMode 
                    ? 'text-red-300 bg-red-500/20' 
                    : 'text-red-700 bg-red-100'
                }`}>
                  {overloaded.length}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                ≥ 80% capacity
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {overloaded.map(renderMemberCard)}
              {overloaded.length === 0 && (
                <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No overloaded team members
                </div>
              )}
            </div>
          </div>

          {/* On Track Column */}
          <div className="flex flex-col">
            <div className={`border rounded-lg p-3 mb-3 ${
              isDarkMode 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-900'}`}>
                  On Track
                </h3>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  isDarkMode 
                    ? 'text-green-300 bg-green-500/20' 
                    : 'text-green-700 bg-green-100'
                }`}>
                  {onTrack.length}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                40-79% capacity
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {onTrack.map(renderMemberCard)}
              {onTrack.length === 0 && (
                <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No team members on track
                </div>
              )}
            </div>
          </div>

          {/* Underutilized Column */}
          <div className="flex flex-col">
            <div className={`border rounded-lg p-3 mb-3 ${
              isDarkMode 
                ? 'bg-yellow-500/10 border-yellow-500/30' 
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-900'}`}>
                  Underutilized
                </h3>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  isDarkMode 
                    ? 'text-yellow-300 bg-yellow-500/20' 
                    : 'text-yellow-700 bg-yellow-100'
                }`}>
                  {underutilized.length}
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                &lt; 40% capacity
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {underutilized.map(renderMemberCard)}
              {underutilized.length === 0 && (
                <div className={`text-center py-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  No underutilized team members
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
