import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { mockUsers, mockRoles, mockTeams, mockUserTeams, User } from '../../data/authData';
import { Search, UserPlus, Download, MoreVertical, Users } from 'lucide-react';
import { UserProfileAdminDrawer } from './UserProfileAdminDrawer';
import { PageLayout } from '../ui/PageLayout';
import { useTheme } from '../../contexts/ThemeContext';

export const UsersManagementPage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <PageLayout
      title="Users"
      subtitle="Access Management"
      headerIcon={<Users size={28} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />}
      backgroundImage={<Users size={450} color={isDarkMode ? 'white' : '#7C3AED'} strokeWidth={0.5} />}
      accentColor={isDarkMode ? '#A78BFA' : '#7C3AED'}
      pageActions={
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {/* TODO: Invite user modal */}}
            className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <UserPlus size={16} />
            Invite user
          </Button>
          <Button
            disabled
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            title="Demo placeholder"
          >
            <Download size={16} />
            Export users
          </Button>
        </div>
      }
    >
      <div className="p-6">
        <Card className={`border shadow-sm ${isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-white border-gray-200'}`}>
          {/* Search and Filters */}
          <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  placeholder="Search by name, email, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-900 border-white/10 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className={`px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-900 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Roles</option>
                {mockRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-900 border-white/10 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${isDarkMode ? 'bg-slate-900/50' : 'bg-gray-50'} border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <tr>
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
              <tbody className={`divide-y ${isDarkMode ? 'divide-white/10 bg-slate-800' : 'divide-gray-200 bg-white'}`}>
                {filteredUsers.map(user => {
                  const role = getUserRole(user.roleId);
                  const teams = getUserTeams(user.id);
                  const modules = getModulesForRole(user.roleId);

                  return (
                    <tr
                      key={user.id}
                      onClick={() => handleRowClick(user)}
                      className={`cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm ${
                              isDarkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-900'
                          }`}>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(user);
                          }}
                          className={`transition-colors ${isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className={`text-gray-500 ${isDarkMode ? 'text-gray-400' : ''}`}>No users found matching your filters</p>
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
      </div>
    </PageLayout>
  );
};
