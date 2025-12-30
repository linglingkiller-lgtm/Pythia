import React from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { Shield, ShieldCheck, User, Eye } from 'lucide-react';

export const RoleDisplay: React.FC = () => {
  const { activeRole } = useSupabaseAuth();

  if (!activeRole) {
    return null;
  }

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin',
          icon: ShieldCheck,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-200',
        };
      case 'manager':
        return {
          label: 'Manager',
          icon: Shield,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200',
        };
      case 'staff':
        return {
          label: 'Staff',
          icon: User,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-200',
        };
      case 'viewer':
        return {
          label: 'Viewer',
          icon: Eye,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
      default:
        return {
          label: role,
          icon: User,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200',
        };
    }
  };

  const config = getRoleConfig(activeRole);
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};
