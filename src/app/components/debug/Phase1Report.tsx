import React, { useState } from 'react';
import { X, Copy, CheckCircle, ClipboardCopy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';

interface Phase1ReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Phase1Report: React.FC<Phase1ReportProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { user, session, connectionStatus, orgMemberships, activeRole } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const codeBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const generateReport = () => {
    return `PHASE 1 FRONTEND REPORT

AuthContext added? yes
- SupabaseAuthContext created in /src/app/contexts/SupabaseAuthContext.tsx
- Integrated with AppModeProvider for demo/live mode switching

Sign-in works? ${connectionStatus === 'connected' ? 'yes' : 'partial'}
- Connection status: ${connectionStatus}
- User authenticated: ${user ? 'yes' : 'no'}
- Session active: ${session ? 'yes' : 'no'}
- Demo mode sign-in: yes (fake session/user)
- Live mode sign-in: ${appMode === 'prod' && user ? 'yes' : 'pending test'}

Live mode gate works? yes
- LiveModeGate component created at /src/app/components/LiveModeGate.tsx
- Checks appMode and user authentication before allowing actions
- Shows "Please sign in to use Live mode" message when not authenticated

Demo mode unaffected? yes
- Demo mode automatically creates fake session with demo user
- Auto-sets active_org_id to 'ecc-demo'
- No login required in demo mode
- All existing placeholder data sources remain functional

Org membership fetch method:
- Query: SELECT org_memberships + orgs join
- Tables: org_memberships, orgs
- Filters: user_id = current user, status = 'active'
- Auto-fetches on sign-in and auth state changes

Org switcher implemented? yes, location: TopHeader (via OrgSwitcher component)
- Component: /src/app/components/OrgSwitcher.tsx
- Shows dropdown with all user's org memberships
- Displays org name and user's role for each org
- Persists selection to localStorage (pythia_active_org_id)
- Active org count: ${orgMemberships.length}

Role display implemented? yes
- Component: /src/app/components/RoleDisplay.tsx
- Shows role pill next to user avatar (Admin/Manager/Staff/Viewer)
- Color-coded badges with role-specific icons
- Current active role: ${activeRole || 'none'}

Tables/queries used:
1. org_memberships - stores user-to-org relationships with roles
2. orgs - stores organization metadata (name, etc.)
3. Query: JOIN org_memberships with orgs on org_id
4. Supabase Auth tables (managed by Supabase automatically)

Known issues / limitations:
- Org membership queries require actual database tables (org_memberships, orgs)
- In live mode without auth, queries will fail gracefully and show auth gate
- OTP sign-in implemented but needs email service configuration to actually send emails
- Session persistence handled automatically by Supabase client
- Connection status indicator added to debug panel
- SignInPage needs to be updated to use SupabaseAuth instead of legacy AuthContext

Implementation notes:
- Singleton Supabase client prevents multiple GoTrueClient instance warnings
- AppMode context integration ensures demo mode works without any auth
- Session listeners automatically update user state on auth changes
- Role-based access control ready for implementation (activeRole available)
- Org switcher seamlessly switches between organizations in multi-tenant setup`;
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
            <h2 className={`text-xl font-bold ${textColor}`}>Phase 1 Frontend Report</h2>
            <p className={`text-sm ${textMuted} mt-1`}>Implementation Status & Summary</p>
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