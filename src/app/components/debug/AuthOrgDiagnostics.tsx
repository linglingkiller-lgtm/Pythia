import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { MembershipsSmokeTest } from './MembershipsSmokeTest';

interface AuthOrgDiagnosticsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthOrgDiagnostics: React.FC<AuthOrgDiagnosticsProps> = ({ isOpen, onClose }) => {
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { isDarkMode } = useTheme();
  const { user, session, connectionStatus, orgMemberships, activeOrgId, activeRole } = useSupabaseAuth();
  const { appMode } = useAppMode();

  // NOW we can do conditional return
  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const bgMuted = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';

  const activeOrg = orgMemberships.find(m => m.org_id === activeOrgId);

  const isUuidFormat = (id: string | null) => {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl ${bgColor} rounded-xl shadow-2xl border ${borderColor} z-50 max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h2 className={`text-xl font-bold ${textColor}`}>Auth + Org Diagnostics</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className={`grid grid-cols-2 gap-4 p-4 rounded-lg ${bgMuted} border ${borderColor}`}>
            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>App Mode</div>
              <div className={`text-sm font-mono ${textColor}`}>{appMode}</div>
            </div>
            
            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>User ID</div>
              <div className={`text-sm font-mono ${textColor} truncate`}>{user?.id || 'none'}</div>
            </div>

            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Session Exists</div>
              <div className="flex items-center gap-2">
                {session ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${textColor}`}>yes</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className={`text-sm ${textColor}`}>no</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Connection Status</div>
              <div className="flex items-center gap-2">
                {connectionStatus === 'connected' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${textColor}`}>connected</span>
                  </>
                ) : connectionStatus === 'disconnected' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className={`text-sm ${textColor}`}>disconnected</span>
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4 text-yellow-500" />
                    <span className={`text-sm ${textColor}`}>checking</span>
                  </>
                )}
              </div>
            </div>

            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Memberships Count</div>
              <div className={`text-sm font-mono ${textColor}`}>{orgMemberships.length}</div>
            </div>

            <div>
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Active Role</div>
              <div className={`text-sm font-mono ${textColor} capitalize`}>{activeRole || 'none'}</div>
            </div>

            <div className="col-span-2">
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Active Org ID (UUID)</div>
              <div className="flex items-center gap-2">
                <div className={`text-sm font-mono ${textColor} truncate flex-1`}>{activeOrgId || 'none'}</div>
                {activeOrgId && (
                  isUuidFormat(activeOrgId) ? (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" title="Valid UUID" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" title="Not a UUID format" />
                  )
                )}
              </div>
            </div>

            <div className="col-span-2">
              <div className={`text-xs font-semibold ${textMuted} mb-2`}>Active Org Name</div>
              <div className={`text-sm font-mono ${textColor}`}>{activeOrg?.org_name || 'none'}</div>
            </div>
          </div>

          {connectionStatus === 'disconnected' && appMode === 'prod' && (
            <div className={`mt-4 flex items-start gap-2 p-3 rounded-lg border ${borderColor} bg-red-50 dark:bg-red-900/20`}>
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                <div className="font-semibold mb-1">Connection Error</div>
                <div>Unable to connect to Supabase. Check your network connection and credentials.</div>
              </div>
            </div>
          )}

          {orgMemberships.length === 0 && user && appMode === 'prod' && (
            <div className={`mt-4 flex items-start gap-2 p-3 rounded-lg border ${borderColor} bg-yellow-50 dark:bg-yellow-900/20`}>
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                <div className="font-semibold mb-1">No Org Memberships</div>
                <div>User is authenticated but has no organization memberships. Check the org_memberships table.</div>
              </div>
            </div>
          )}

          {/* Memberships Smoke Test */}
          <MembershipsSmokeTest userId={user?.id} />
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-end p-4 border-t ${borderColor} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};
