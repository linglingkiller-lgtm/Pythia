import React from 'react';
import { Card } from '../../ui/Card';
import { Switch } from '../../ui/switch';
import { useTheme } from '../../../contexts/ThemeContext';
import { Lock, Shield, Check, X } from 'lucide-react';
import { mockRoles } from '../../../data/authData';

const AdminBadge = () => (
  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    ADMIN
  </span>
);

export function RolesPermissionsTab() {
  const { isDarkMode } = useTheme();
  const [selectedRole, setSelectedRole] = React.useState(mockRoles[0]?.id);

  const permissions = [
    {
      module: 'Client Management',
      items: [
        { id: 'client_view', label: 'View Clients' },
        { id: 'client_create', label: 'Create Clients', admin: true },
        { id: 'client_edit', label: 'Edit Client Details', admin: true },
        { id: 'client_delete', label: 'Delete Clients', admin: true },
      ]
    },
    {
      module: 'Records & Intelligence',
      items: [
        { id: 'record_view', label: 'View Records' },
        { id: 'record_create', label: 'Create Records' },
        { id: 'record_export', label: 'Export Records', admin: true },
        { id: 'record_sensitive', label: 'View Sensitive Data', admin: true },
      ]
    },
    {
      module: 'Task Management',
      items: [
        { id: 'task_view', label: 'View Tasks' },
        { id: 'task_assign', label: 'Assign Tasks' },
        { id: 'task_create', label: 'Create Tasks' },
      ]
    }
  ];

  return (
    <div className="flex h-[calc(100vh-200px)] gap-6">
      {/* Roles List */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Roles</h3>
            <button className={`text-xs font-medium px-2 py-1 rounded ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
              + New Role
            </button>
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Select a role to configure permissions</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {mockRoles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`
                w-full text-left px-3 py-3 rounded-lg flex items-center justify-between group transition-colors
                ${selectedRole === role.id 
                  ? isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  : isDarkMode ? 'text-gray-400 hover:bg-slate-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Shield size={16} className={selectedRole === role.id ? 'opacity-100' : 'opacity-50'} />
                <span className="font-medium text-sm">{role.name}</span>
              </div>
              {role.id === 'admin' && (
                <Lock size={14} className="opacity-50" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Permissions Matrix */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-gray-200'}`}>
           <div>
             <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               Permissions: {mockRoles.find(r => r.id === selectedRole)?.name}
             </h3>
             <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Configure access levels for this role</p>
           </div>
           <div className="flex gap-2">
             <button className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? 'border-slate-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
               Reset to Default
             </button>
             <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700">
               Save Changes
             </button>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {permissions.map((module) => (
            <div key={module.module}>
              <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {module.module}
              </h4>
              <div className="space-y-3">
                {module.items.map((perm) => (
                  <div key={perm.id} className="flex items-center justify-between py-2">
                    <div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {perm.label}
                      </span>
                      {perm.admin && <AdminBadge />}
                    </div>
                    <Switch defaultChecked={selectedRole === 'admin' || !perm.admin} disabled={selectedRole === 'admin'} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
