import React, { useState, useRef, useEffect } from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Building2, Check, ChevronDown } from 'lucide-react';

export interface OrgSwitcherProps {
  variant?: 'header' | 'sidebar';
  direction?: 'up' | 'down';
  children?: React.ReactNode;
  collapsed?: boolean;
}

export const OrgSwitcher: React.FC<OrgSwitcherProps> = ({ variant = 'header', direction = 'down', children, collapsed = false }) => {
  const { orgMemberships, activeOrgId, setActiveOrgId, activeRole } = useSupabaseAuth();
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOrg = orgMemberships.find(org => org.org_id === activeOrgId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (orgMemberships.length === 0) {
    return null;
  }

  // Header styles (default)
  let bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
  let textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  let borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  let hoverBg = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';
  
  // Sidebar styles override
  if (variant === 'sidebar') {
    bgColor = 'bg-transparent';
    textColor = 'text-white';
    borderColor = 'border-transparent';
    hoverBg = 'hover:bg-white/10';
  }

  const textMuted = isDarkMode || variant === 'sidebar' ? 'text-gray-400' : 'text-gray-600';
  const dropdownBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const dropdownBorder = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const dropdownText = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const dropdownHover = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'manager':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'staff':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const positionClasses = direction === 'up' 
    ? 'bottom-full mb-2' 
    : 'top-full mt-2';

  // If sidebar is collapsed, position dropdown to the right (popover style)
  // Otherwise default to right-aligned within the sidebar (or header)
  const alignmentClasses = (variant === 'sidebar' && collapsed)
    ? 'left-full ml-2 bottom-0 mb-0' // Pop out to the side
    : 'right-0'; // Default align right edge

  // Override position if collapsed and sidebar variant (to act more like a tooltip/popover)
  const containerClasses = (variant === 'sidebar' && collapsed)
    ? `absolute bottom-0 left-full ml-2 w-72 ${dropdownBg} border ${dropdownBorder} rounded-lg shadow-xl z-50 overflow-hidden`
    : `absolute ${positionClasses} ${alignmentClasses} w-72 ${dropdownBg} border ${dropdownBorder} rounded-lg shadow-xl z-50 overflow-hidden`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={children 
          ? "w-full text-left transition-opacity hover:opacity-90 focus:outline-none" 
          : `w-full flex items-center gap-2 px-3 py-2 rounded-lg border ${borderColor} ${bgColor} ${textColor} ${hoverBg} transition-colors`
        }
      >
        {children ? (
          children
        ) : (
          <>
            <Building2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 text-left overflow-hidden">
              <div className="text-sm font-medium truncate">{activeOrg?.org_name || 'Select Organization'}</div>
              {activeRole && (
                <div className="text-xs text-gray-500 capitalize truncate">{activeRole}</div>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {isOpen && (
        <div className={containerClasses}>
          <div className={`px-3 py-2 border-b ${dropdownBorder}`}>
            <div className={`text-xs font-medium ${textMuted} uppercase tracking-wide`}>
              Switch Organization
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {orgMemberships.map((org) => (
              <button
                key={org.org_id}
                onClick={() => {
                  setActiveOrgId(org.org_id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-3 flex items-center justify-between ${dropdownHover} transition-colors border-b ${dropdownBorder} last:border-b-0`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={`w-4 h-4 ${textMuted}`} />
                  <div className="text-left">
                    <div className={`text-sm font-medium ${dropdownText}`}>{org.org_name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getRoleBadgeColor(org.role)}`}>
                        {org.role}
                      </span>
                    </div>
                  </div>
                </div>
                {org.org_id === activeOrgId && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
