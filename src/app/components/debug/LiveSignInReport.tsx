import React, { useState } from 'react';
import { X, Copy, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';

interface LiveSignInReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSignInReport: React.FC<LiveSignInReportProps> = ({ isOpen, onClose }) => {
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
    const membershipsList = orgMemberships.map(m => 
      `  • ${m.org_slug} (${m.role})`
    ).join('\n');

    const errorsList = [];
    if (connectionStatus === 'disconnected') {
      errorsList.push('Connection status: disconnected');
    }
    if (appMode === 'prod' && !user) {
      errorsList.push('User not authenticated in Live mode');
    }
    if (appMode === 'prod' && user && orgMemberships.length === 0) {
      errorsList.push('User authenticated but no org memberships found');
      errorsList.push('⚠️ CHECK: Verify org_memberships table has entries for this user');
      errorsList.push('⚠️ CHECK: Verify RLS policies on org_memberships table (error code 42P17 = infinite recursion)');
    }

    return `LIVE SIGN-IN VERIFICATION REPORT
===========================================
App Mode: ${appMode}
Session Exists: ${session ? 'yes' : 'no'}
User ID: ${user?.id || 'none'}
User Email: ${user?.email || 'none'}

Org Memberships Count: ${orgMemberships.length}
Memberships List:
${membershipsList || '  (none)'}

Active Org ID: ${activeOrgId || 'none'}
Active Org Name: ${activeOrg?.org_name || 'none'}
Active Org Slug: ${activeOrg?.org_slug || 'none'}
Active Role: ${activeRole || 'none'}

Connection Status: ${connectionStatus}

Errors:
${errorsList.length > 0 ? errorsList.map(e => `  • ${e}`).join('\n') : '  (none)'}

BACKEND SETUP CHECKLIST (Phase 1 Bootstrapping):
===========================================
If you're seeing RLS errors or no memberships, follow these steps:

1. CREATE USER IN SUPABASE AUTH:
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User" 
   - Enter email & password (or use SQL below)
   
   SQL Example:
   SELECT auth.uid();  -- Note this UUID for step 2

2. ADD ORG TO orgs TABLE:
   INSERT INTO orgs (id, name, slug, is_demo)
   VALUES (
     gen_random_uuid(),
     'Your Organization Name',
     'your-org-slug',
     false
   )
   RETURNING id;  -- Note this UUID for step 3

3. ADD ORG MEMBERSHIP:
   INSERT INTO org_memberships (user_id, org_id, role, is_active)
   VALUES (
     'USER_UUID_FROM_STEP_1',
     'ORG_UUID_FROM_STEP_2',
     'admin',
     true
   );

4. FIX RLS POLICIES (if seeing error code 42P17):
   -- Simple policy for org_memberships table:
   CREATE POLICY "Users can view their own memberships"
   ON org_memberships FOR SELECT
   USING (auth.uid() = user_id);
   
   -- Policy for orgs table:
   CREATE POLICY "Users can view orgs they belong to"
   ON orgs FOR SELECT
   USING (
     EXISTS (
       SELECT 1 FROM org_memberships
       WHERE org_memberships.org_id = orgs.id
       AND org_memberships.user_id = auth.uid()
       AND org_memberships.is_active = true
     )
   );

5. VERIFY:
   - Sign in with the created user
   - Check this report for memberships count > 0
   - Check console for any RLS errors

Notes:
- This report verifies Live mode authentication and org membership setup
- RLS error code 42P17 means infinite recursion - fix policies above
- Active org should be a valid UUID matching an org in the orgs table
- After backend setup, refresh the page to test authentication`;
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
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] ${bgColor} rounded-xl shadow-2xl border ${borderColor} z-50 flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div>
            <h2 className={`text-xl font-bold ${textColor}`}>Live Sign-In Verification Report</h2>
            <p className={`text-sm ${textMuted} mt-1`}>Real-time authentication & membership status</p>
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
          {/* Quick Status Cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${textMuted} mb-1`}>Mode</div>
              <div className={`text-lg font-bold ${textColor}`}>{appMode}</div>
            </div>
            <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${textMuted} mb-1`}>Memberships</div>
              <div className={`text-lg font-bold ${textColor}`}>{orgMemberships.length}</div>
            </div>
            <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-xs ${textMuted} mb-1`}>Active Role</div>
              <div className={`text-lg font-bold ${textColor} capitalize`}>{activeRole || 'None'}</div>
            </div>
          </div>

          {/* Memberships List */}
          {orgMemberships.length > 0 && (
            <div className={`mb-6 p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className={`text-sm font-semibold ${textColor} mb-3`}>Organization Memberships</div>
              <div className="space-y-2">
                {orgMemberships.map((m, idx) => (
                  <div key={idx} className={`flex items-center justify-between text-sm ${textColor}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.org_id === activeOrgId ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="font-mono text-xs">{m.org_slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${
                        m.role === 'admin' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' :
                        m.role === 'manager' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                        m.role === 'staff' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' :
                        'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
                      } capitalize`}>{m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Report */}
          <div className={`text-xs font-semibold ${textMuted} mb-2`}>FULL VERIFICATION REPORT</div>
          <pre className={`${codeBg} ${textColor} p-4 rounded-lg text-xs font-mono whitespace-pre-wrap break-words border ${borderColor}`}>
            {reportText}
          </pre>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${borderColor} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${textMuted}`}>
            Copy this report to verify Live mode authentication setup
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