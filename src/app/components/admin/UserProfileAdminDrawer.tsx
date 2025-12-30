import React, { useState } from 'react';
import { User, mockRoles, mockUserFieldPermissions, mockTeams, mockUserTeams, mockAuditLogs, mockOrganization } from '../../data/authData';
import { X, Shield, Users, Lock, History, AlertCircle, Power, RotateCcw, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { mockClients } from '../../data/clientsData';

interface UserProfileAdminDrawerProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export const UserProfileAdminDrawer: React.FC<UserProfileAdminDrawerProps> = ({ user, open, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'access' | 'clients' | 'fields' | 'audit'>('overview');

  const role = mockRoles.find(r => r.id === user.roleId);
  const fieldPerms = mockUserFieldPermissions.find(fp => fp.userId === user.id);
  const userTeamIds = mockUserTeams.filter(ut => ut.userId === user.id).map(ut => ut.teamId);
  const teams = mockTeams.filter(t => userTeamIds.includes(t.id));
  const userAuditLogs = mockAuditLogs.filter(log => log.actorUserId === user.id || log.targetId === user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invited':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disabled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-[101] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-screen w-[600px] bg-white shadow-2xl z-[102] transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-900 font-medium text-lg">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h3 className="text-gray-900 font-medium">{user.firstName} {user.lastName}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Chip label={role?.name || 'Unknown'} variant="neutral" className="text-xs" />
            <Chip label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} className={`text-xs ${getStatusColor(user.status)}`} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 bg-white">
          <div className="flex gap-6">
            {[
              { id: 'overview', label: 'Overview', icon: Shield },
              { id: 'access', label: 'Access & Roles', icon: Users },
              { id: 'clients', label: 'Client Access', icon: Shield },
              { id: 'fields', label: 'Field Permissions', icon: Lock },
              { id: 'audit', label: 'Audit & Activity', icon: History },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-1 border-b-2 transition-colors text-sm font-medium flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 220px)' }}>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Account Controls</h4>
                <div className="space-y-2">
                  <Button
                    disabled
                    className="w-full justify-start border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Demo placeholder"
                  >
                    <Power size={16} />
                    {user.status === 'active' ? 'Disable account' : 'Enable account'}
                  </Button>
                  <Button
                    disabled
                    className="w-full justify-start border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Demo placeholder"
                  >
                    <RotateCcw size={16} />
                    Reset password
                  </Button>
                  <Button
                    disabled
                    className="w-full justify-start border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    title="Demo placeholder"
                  >
                    <LogOut size={16} />
                    Force sign-out all sessions
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Stats (Last 30 Days)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">24</div>
                    <div className="text-xs text-gray-600">Records Created</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">18</div>
                    <div className="text-xs text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">7</div>
                    <div className="text-xs text-gray-600">Deliverables Shipped</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-xs text-gray-600">Compliance Items</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Account Details</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Organization</dt>
                    <dd className="text-gray-900 font-medium">{mockOrganization.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Created</dt>
                    <dd className="text-gray-900">{formatDate(user.createdAt)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Last Login</dt>
                    <dd className="text-gray-900">{formatDate(user.lastLoginAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Access & Roles Tab */}
          {activeTab === 'access' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Role</h4>
                <select
                  disabled
                  value={user.roleId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demo placeholder"
                >
                  {mockRoles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">Changes to roles are disabled in demo mode</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Module Access</h4>
                <div className="space-y-2">
                  {[
                    { name: 'Lobbying Module', enabled: role?.permissions.some(p => p.includes('lobbying')) },
                    { name: 'Public Affairs Module', enabled: role?.permissions.some(p => p.includes('public_affairs')) },
                    { name: 'Canvassing Module', enabled: role?.permissions.some(p => p.includes('canvassing')) },
                  ].map(module => (
                    <div key={module.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                      <span className="text-sm text-gray-700">{module.name}</span>
                      <div className={`w-10 h-6 rounded-full transition-colors ${module.enabled ? 'bg-green-500' : 'bg-gray-300'} relative`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${module.enabled ? 'translate-x-4' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Teams</h4>
                <div className="flex flex-wrap gap-2">
                  {teams.map(team => (
                    <Chip key={team.id} label={team.name} variant="neutral" />
                  ))}
                  {teams.length === 0 && (
                    <p className="text-sm text-gray-500">No team assignments</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Client Access Tab */}
          {activeTab === 'clients' && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  disabled
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demo placeholder"
                >
                  Grant access to all clients
                </Button>
                <Button
                  disabled
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Demo placeholder"
                >
                  Remove all access
                </Button>
              </div>

              <div className="space-y-2">
                {mockClients.map(client => {
                  // Mock access levels for demo
                  const accessLevel = user.roleId.includes('admin') || user.roleId.includes('lead') 
                    ? 'admin' 
                    : user.roleId.includes('analyst') || user.roleId.includes('ops')
                    ? 'write'
                    : 'read';

                  return (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.industry}</div>
                      </div>
                      <select
                        disabled
                        value={accessLevel}
                        className="px-3 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Demo placeholder"
                      >
                        <option value="none">None</option>
                        <option value="read">Read</option>
                        <option value="write">Write</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Field Permissions Tab */}
          {activeTab === 'fields' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md flex gap-2">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-xs text-amber-800">
                  <p className="font-medium mb-1">Sensitive Data Protection</p>
                  <p>Control access to sensitive fields across the platform. Changes take effect immediately.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { 
                    key: 'canViewBackgroundCheck', 
                    label: 'Can view background check status',
                    description: 'Access to applicant background check results in Canvassing module'
                  },
                  { 
                    key: 'canViewPricingProfit', 
                    label: 'Can view pricing/profit',
                    description: 'Access to budget pricing and profit calculations in Project Hub'
                  },
                  { 
                    key: 'canViewInternalRecords', 
                    label: 'Can view internal-only records',
                    description: 'Access to records marked as internal or confidential'
                  },
                  { 
                    key: 'canExportComplianceLogs', 
                    label: 'Can export compliance logs',
                    description: 'Ability to export audit trails and compliance records'
                  },
                ].map(field => {
                  const enabled = fieldPerms?.[field.key as keyof typeof fieldPerms] || false;
                  return (
                    <div key={field.key} className="p-4 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{field.label}</div>
                          <div className="text-xs text-gray-500 mt-1">{field.description}</div>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'} relative flex-shrink-0 ml-3`}>
                          <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-4' : ''}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Audit & Activity Tab */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-3">
                  {userAuditLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="flex items-start justify-between mb-1">
                        <div className="text-sm font-medium text-gray-900">
                          {log.actionKey.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">{formatRelativeDate(log.createdAt)}</div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {log.targetType} • {log.targetId}
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                          {JSON.stringify(log.metadata, null, 2)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                disabled
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Demo placeholder"
              >
                Export full audit trail
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
