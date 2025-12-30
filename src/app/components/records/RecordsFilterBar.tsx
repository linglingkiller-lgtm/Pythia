import React from 'react';
import { type RecordFilters, type RecordType } from '../../data/recordsData';
import { mockClients } from '../../data/clientsData';
import { mockTeamMembers } from '../../data/clientsData';

interface RecordsFilterBarProps {
  filters: RecordFilters;
  onUpdateFilters: (filters: Partial<RecordFilters>) => void;
  onClearFilters: () => void;
}

export function RecordsFilterBar({ filters, onUpdateFilters, onClearFilters }: RecordsFilterBarProps) {
  const recordTypes: RecordType[] = [
    'brief',
    'budget',
    'weekly-update',
    'deliverable',
    'export',
    'note',
    'snapshot',
    'compliance-log',
    'canvassing-report',
    'legislative-brief',
    'meeting-minutes',
    'testimony',
    'amendment-memo',
    'qbr-summary'
  ];

  const handleTypeToggle = (type: RecordType) => {
    const currentTypes = filters.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    onUpdateFilters({ types: newTypes });
  };

  const handleClientToggle = (clientId: string) => {
    const currentClients = filters.clientIds || [];
    const newClients = currentClients.includes(clientId)
      ? currentClients.filter(c => c !== clientId)
      : [...currentClients, clientId];
    onUpdateFilters({ clientIds: newClients });
  };

  const handleOwnerToggle = (ownerId: string) => {
    const currentOwners = filters.owners || [];
    const newOwners = currentOwners.includes(ownerId)
      ? currentOwners.filter(o => o !== ownerId)
      : [...currentOwners, ownerId];
    onUpdateFilters({ owners: newOwners });
  };

  const handleDepartmentToggle = (dept: string) => {
    const currentDepts = filters.departments || [];
    const newDepts = currentDepts.includes(dept)
      ? currentDepts.filter(d => d !== dept)
      : [...currentDepts, dept];
    onUpdateFilters({ departments: newDepts });
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-2 gap-6">
        {/* Basic Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Basic Filters</h4>
          
          {/* Date Range */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => onUpdateFilters({ dateFrom: e.target.value })}
                className="flex-1 text-sm border-gray-300 rounded-lg"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => onUpdateFilters({ dateTo: e.target.value })}
                className="flex-1 text-sm border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const sevenDaysAgo = new Date(today);
                  sevenDaysAgo.setDate(today.getDate() - 7);
                  onUpdateFilters({
                    dateFrom: sevenDaysAgo.toISOString().split('T')[0],
                    dateTo: today.toISOString().split('T')[0]
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Last 7 days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today);
                  thirtyDaysAgo.setDate(today.getDate() - 30);
                  onUpdateFilters({
                    dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
                    dateTo: today.toISOString().split('T')[0]
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Last 30 days
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  const ninetyDaysAgo = new Date(today);
                  ninetyDaysAgo.setDate(today.getDate() - 90);
                  onUpdateFilters({
                    dateFrom: ninetyDaysAgo.toISOString().split('T')[0],
                    dateTo: today.toISOString().split('T')[0]
                  });
                }}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Last 90 days
              </button>
            </div>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Type</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {recordTypes.map(type => (
                <label key={type} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.types || []).includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {type.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Client */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Client</label>
            <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {mockClients.map(client => (
                <label key={client.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.clientIds || []).includes(client.id)}
                    onChange={() => handleClientToggle(client.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{client.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Owner</label>
            <div className="space-y-1">
              {mockTeamMembers.map(member => (
                <label key={member.id} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.owners || []).includes(member.id)}
                    onChange={() => handleOwnerToggle(member.id)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{member.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Advanced Filters</h4>
          
          {/* Department */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Department</label>
            <div className="space-y-1">
              {['public-affairs', 'lobbying', 'campaign-services'].map(dept => (
                <label key={dept} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.departments || []).includes(dept)}
                    onChange={() => handleDepartmentToggle(dept)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {dept === 'public-affairs' ? 'Public Affairs' : dept === 'lobbying' ? 'Lobbying' : 'Campaign Services'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
            <div className="space-y-1">
              {['draft', 'final', 'sent', 'archived'].map(status => (
                <label key={status} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.statuses || []).includes(status as any)}
                    onChange={() => {
                      const currentStatuses = filters.statuses || [];
                      const newStatuses = currentStatuses.includes(status as any)
                        ? currentStatuses.filter(s => s !== status)
                        : [...currentStatuses, status as any];
                      onUpdateFilters({ statuses: newStatuses });
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Toggle Filters */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isAIGenerated || false}
                onChange={(e) => onUpdateFilters({ isAIGenerated: e.target.checked ? true : undefined })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Pythia-generated only</span>
            </label>

            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasAttachments || false}
                onChange={(e) => onUpdateFilters({ hasAttachments: e.target.checked ? true : undefined })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Has attachments</span>
            </label>

            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={filters.isStarred || false}
                onChange={(e) => onUpdateFilters({ isStarred: e.target.checked ? true : undefined })}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Starred only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}
