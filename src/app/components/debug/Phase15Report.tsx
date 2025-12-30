import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';

interface Phase15ReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Phase15Report: React.FC<Phase15ReportProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { user, session, connectionStatus, orgMemberships, activeOrgId, activeRole } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const codeBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const activeOrg = orgMemberships.find(m => m.org_id === activeOrgId);

  const generateReport = () => {
    // Check if UUID format
    const isUuidFormat = (id: string | null) => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    return `PHASE 1.5 FRONTEND REPORT
- Live sign-in tested? ${appMode === 'prod' && user ? 'yes (currently signed in)' : 'no (demo mode or not signed in)'}
  Result: ${user ? `User ${user.email} authenticated` : 'No user signed in'}
- org_memberships uses is_active? yes
  Query: .eq('is_active', true) instead of .eq('status', 'active')
- active_org_id stored as UUID? ${activeOrgId ? (isUuidFormat(activeOrgId) ? 'yes' : `no (current: ${activeOrgId})`) : 'no (not set)'}
- demo mode resolves demo org UUID? ${appMode === 'demo' ? (isUuidFormat(activeOrgId) ? 'yes' : `partial (using fallback: ${activeOrgId})`) : 'n/a (live mode)'}
- OrgSwitcher options count: ${orgMemberships.length}
- Active org name + id: ${activeOrg ? `${activeOrg.org_name} (${activeOrgId})` : 'none'}
- Active role: ${activeRole || 'none'}
- Errors (verbatim): ${connectionStatus === 'disconnected' ? 'Connection disconnected' : 'none'}
- Notes / TODO:
  • SignInPage updated to use SupabaseAuthContext.signIn for Live mode
  • Demo mode queries orgs table for slug='ecc-demo' to resolve UUID
  • If demo org query fails, fallbacks to placeholder UUID
  • OrgSwitcher stores UUID in localStorage (pythia_active_org_id)
  • RoleDisplay derives role from membership matching active org UUID`;
  };

  const reportText = generateReport();

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first (only if available and secure)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      // Silently fall through to fallback method
    }

    // Fallback method using textarea
    try {
      const textArea = document.createElement('textarea');
      textArea.value = reportText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (fallbackErr) {
      console.error('Copy failed:', fallbackErr);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] ${bgColor} rounded-xl shadow-2xl border ${borderColor} z-50 flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div>
            <h2 className={`text-xl font-bold ${textColor}`}>Phase 1.5 Frontend Report</h2>
            <p className={`text-sm ${textMuted} mt-1`}>Org Membership & UUID Alignment</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Report
                </>
              )}
            </button>
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre className={`${codeBg} ${textColor} p-6 rounded-lg text-sm font-mono whitespace-pre-wrap break-words border ${borderColor}`}>
            {reportText}
          </pre>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${borderColor} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${textMuted}`}>
            Copy this report and paste it back to ChatGPT for Phase 2 planning
          </div>
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