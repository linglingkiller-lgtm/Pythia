import React, { useState } from 'react';
import { X, Mail, Shield, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Switch } from '../ui/switch';
import { useTheme } from '../../contexts/ThemeContext';
import { mockRoles } from '../../data/authData';

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (data: { email: string; roleId: string; modules: string[] }) => void;
}

export function InviteUserModal({ open, onClose, onInvite }: InviteUserModalProps) {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState(mockRoles[0]?.id || '');
  const [modules, setModules] = useState<string[]>(['lobbying']);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !roleId) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onInvite({ email, roleId, modules });
      setLoading(false);
      onClose();
    }, 1000);
  };

  const toggleModule = (module: string) => {
    setModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full max-w-lg rounded-xl shadow-2xl overflow-hidden
        ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white'}
      `}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Invite Team Member</h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    }
                  `}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  required
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none
                    ${isDarkMode 
                      ? 'bg-slate-800 border-slate-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                    }
                  `}
                >
                  {mockRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <p className={`text-xs mt-1.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                This determines their default permissions and access level.
              </p>
            </div>

            <div className="pt-2">
              <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Module Access
              </label>
              <div className={`rounded-lg border divide-y ${isDarkMode ? 'border-slate-700 divide-slate-700' : 'border-gray-200 divide-gray-100'}`}>
                {[
                  { id: 'lobbying', name: 'Lobbying Intelligence' },
                  { id: 'public_affairs', name: 'Public Affairs' },
                  { id: 'canvassing', name: 'Canvassing & Field' }
                ].map((mod) => (
                  <div key={mod.id} className="flex items-center justify-between p-3">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mod.name}</span>
                    <Switch 
                      checked={modules.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`p-3 rounded-lg flex gap-3 ${isDarkMode ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-700'}`}>
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
            <p className="text-xs">
              The user will receive an email invitation to set up their account. The invitation link expires in 48 hours.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
