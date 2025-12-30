import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Chip } from '../../ui/Chip';
import { mockUsers, mockRoles, mockTeams, mockUserTeams, User } from '../../../data/authData';
import { Search, UserPlus, Download, MoreVertical, Copy, Mail, CheckSquare, Tag } from 'lucide-react';
import { UserProfileAdminDrawer } from '../../admin/UserProfileAdminDrawer';
import { InviteUserModal } from '../InviteUserModal';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';

export function UserManagementTab() {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());

  const getUserRole = (roleId: string) => {
    return mockRoles.find(r => r.id === roleId);
  };

  const getUserTeams = (userId: string) => {
    const userTeamIds = mockUserTeams.filter(ut => ut.userId === userId).map(ut => ut.teamId);
    return mockTeams.filter(t => userTeamIds.includes(t.id));
  };

  const getModulesForRole = (roleId: string) => {
    const role = getUserRole(roleId);
    if (!role) return [];
    
    const modules: string[] = [];
    if (role.permissions.some(p => p.includes('lobbying'))) modules.push('LOBBY');
    if (role.permissions.some(p => p.includes('public_affairs'))) modules.push('PA');
    if (role.permissions.some(p => p.includes('canvassing'))) modules.push('CANVASS');
    
    return modules;
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserRole(user.roleId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.roleId === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleInvite = (data: any) => {
    console.log('Inviting user:', data);
    showToast(`Invitation sent to ${data.email}`, 'success');
  };

  const toggleUserSelection = (userId: string) => {
    const newSet = new Set(selectedUserIds);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    setSelectedUserIds(newSet);
  };

  const toggleAllSelection = () => {
    if (selectedUserIds.size === filteredUsers.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(filteredUsers.map(u => u.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return isDarkMode 
          ? 'bg-green-900/30 text-green-400 border-green-800'
          : 'bg-green-100 text-green-800 border-green-200';
      case 'invited':
        return isDarkMode
          ? 'bg-blue-900/30 text-blue-400 border-blue-800'
          : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'disabled':
        return isDarkMode
          ? 'bg-gray-800 text-gray-400 border-gray-700'
          : 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div>
              <div className="flex items-center gap-2">
                 <h2 className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Team Members</h2>
                 <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    ADMIN
                 </span>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage user access and permissions</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setInviteModalOpen(true)}
                className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <UserPlus size={16} />
                Invite user
              </Button>
              <Button
                variant="secondary"
                disabled
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`
                  w-full pl-10 pr-4 py-2 border rounded-md text-sm outline-none transition-all
                  ${isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                  }
                `}
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className={`
                px-4 py-2 border rounded-md text-sm outline-none transition-all
                ${isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }
              `}
            >
              <option value="all">All Roles</option>
              {mockRoles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`
                px-4 py-2 border rounded-md text-sm outline-none transition-all
                ${isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }
              `}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          
          {/* Bulk Actions Bar */}
          {selectedUserIds.size > 0 && (
            <div className={`mt-4 px-4 py-2 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
               <span className={`text-sm font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                 {selectedUserIds.size} users selected
               </span>
               <div className="flex items-center gap-2">
                 <Button size="sm" variant="ghost" className="text-xs h-8">
                   <Tag size={14} className="mr-1.5" />
                   Add Tag
                 </Button>
                 <Button size="sm" variant="ghost" className="text-xs h-8">
                   <Mail size={14} className="mr-1.5" />
                   Resend Invite
                 </Button>
                 <Button size="sm" variant="ghost" className="text-xs text-red-500 hover:text-red-600 h-8">
                   Disable
                 </Button>
               </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
              <tr>
                <th className="px-6 py-3 w-10">
                   <div className="flex items-center justify-center">
                     <button 
                       onClick={toggleAllSelection}
                       className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                         selectedUserIds.size > 0 && selectedUserIds.size === filteredUsers.length
                           ? 'bg-blue-500 border-blue-500 text-white'
                           : isDarkMode ? 'border-slate-600' : 'border-gray-300'
                       }`}
                     >
                       {selectedUserIds.size > 0 && selectedUserIds.size === filteredUsers.length && <CheckSquare size={10} />}
                     </button>
                   </div>
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Name
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Email
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Role
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Teams
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Modules
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Last Sign-in
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800 bg-slate-900' : 'divide-gray-200 bg-white'}`}>
              {filteredUsers.map(user => {
                const role = getUserRole(user.roleId);
                const teams = getUserTeams(user.id);
                const modules = getModulesForRole(user.roleId);
                const isSelected = selectedUserIds.has(user.id);

                return (
                  <tr
                    key={user.id}
                    onClick={() => handleRowClick(user)}
                    className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'} ${isSelected ? (isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50') : ''}`}
                  >
                     <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                       <div className="flex items-center justify-center">
                         <button 
                           onClick={() => toggleUserSelection(user.id)}
                           className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                             isSelected
                               ? 'bg-blue-500 border-blue-500 text-white'
                               : isDarkMode ? 'border-slate-600' : 'border-gray-300'
                           }`}
                         >
                           {isSelected && <CheckSquare size={10} />}
                         </button>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm ${isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-900'}`}>
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="ml-3">
                          <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{role?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {teams.slice(0, 2).map(team => (
                          <Chip
                            key={team.id}
                            label={team.name}
                            variant="neutral"
                            className="text-xs"
                          />
                        ))}
                        {teams.length > 2 && (
                          <Chip label={`+${teams.length - 2}`} variant="neutral" className="text-xs" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {modules.map(module => (
                          <Chip
                            key={module}
                            label={module}
                            variant={module === 'LOBBY' ? 'blue' : module === 'PA' ? 'purple' : 'green'}
                            className="text-xs font-mono"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Chip
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        className={`text-xs ${getStatusColor(user.status)}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatDate(user.lastLoginAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {user.status === 'invited' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showToast('Invite link copied', 'success');
                            }}
                            className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-slate-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                            title="Copy Invite Link"
                          >
                            <Copy size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(user);
                          }}
                          className={`p-1.5 rounded transition-colors ${isDarkMode ? 'text-gray-500 hover:bg-slate-800 hover:text-gray-300' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                        >
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>No users found matching your filters</p>
          </div>
        )}
      </Card>

      {/* User Drawer */}
      {selectedUser && (
        <UserProfileAdminDrawer
          user={selectedUser}
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setTimeout(() => setSelectedUser(null), 300);
          }}
        />
      )}

      {/* Invite Modal */}
      <InviteUserModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
}
