import React, { useState } from 'react';
import { X, Copy, CheckCircle, PlayCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { getSupabaseClient } from '../../../utils/supabase/client';

interface LiveAuthMembershipCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueryResult {
  query: string;
  success: boolean;
  data: any;
  error: any;
  executionTime: number;
}

export const LiveAuthMembershipCheck: React.FC<LiveAuthMembershipCheckProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { user, session } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<QueryResult[]>([]);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const codeBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const runChecks = async () => {
    setRunning(true);
    const queryResults: QueryResult[] = [];
    const supabase = getSupabaseClient();

    // Query 1: Get auth.uid()
    const start1 = Date.now();
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      queryResults.push({
        query: 'SELECT auth.uid() -- via supabase.auth.getUser()',
        success: !authError,
        data: authUser ? { uid: authUser.id, email: authUser.email } : null,
        error: authError,
        executionTime: Date.now() - start1
      });
    } catch (err) {
      queryResults.push({
        query: 'SELECT auth.uid() -- via supabase.auth.getUser()',
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start1
      });
    }

    // Query 2: Get org_memberships for current user
    const start2 = Date.now();
    try {
      const { data, error } = await supabase
        .from('org_memberships')
        .select(`
          *,
          orgs:org_id (
            id,
            name,
            slug,
            is_demo
          )
        `)
        .eq('user_id', user?.id || '00000000-0000-0000-0000-000000000000')
        .eq('is_active', true);
      
      queryResults.push({
        query: `SELECT * FROM org_memberships WHERE user_id = auth.uid() AND is_active = true`,
        success: !error,
        data: data,
        error: error,
        executionTime: Date.now() - start2
      });
    } catch (err) {
      queryResults.push({
        query: `SELECT * FROM org_memberships WHERE user_id = auth.uid() AND is_active = true`,
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start2
      });
    }

    // Query 3: Get orgs (limit 10)
    const start3 = Date.now();
    try {
      const { data, error } = await supabase
        .from('orgs')
        .select('*')
        .limit(10);
      
      queryResults.push({
        query: 'SELECT * FROM orgs LIMIT 10',
        success: !error,
        data: data,
        error: error,
        executionTime: Date.now() - start3
      });
    } catch (err) {
      queryResults.push({
        query: 'SELECT * FROM orgs LIMIT 10',
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start3
      });
    }

    setResults(queryResults);
    setRunning(false);
  };

  const generateReport = () => {
    const authResult = results[0];
    const membershipsResult = results[1];
    const orgsResult = results[2];

    const membershipCount = membershipsResult?.success ? (Array.isArray(membershipsResult.data) ? membershipsResult.data.length : 0) : 0;
    const orgsCount = orgsResult?.success ? (Array.isArray(orgsResult.data) ? orgsResult.data.length : 0) : 0;

    const errorsList = [];
    if (!session) errorsList.push('No active session');
    if (!user) errorsList.push('No user authenticated');
    if (authResult && !authResult.success) {
      errorsList.push(`Auth UID query failed: ${JSON.stringify(authResult.error, null, 2)}`);
    }
    if (membershipsResult && !membershipsResult.success) {
      errorsList.push(`Memberships query failed: ${JSON.stringify(membershipsResult.error, null, 2)}`);
    }
    if (orgsResult && !orgsResult.success) {
      errorsList.push(`Orgs query failed: ${JSON.stringify(orgsResult.error, null, 2)}`);
    }

    const membershipDetails = membershipsResult?.success && Array.isArray(membershipsResult.data)
      ? membershipsResult.data.map(m => `  • ${m.orgs?.slug || 'unknown'} (${m.role}) - org_id: ${m.org_id}`).join('\n')
      : '  (none)';

    const orgDetails = orgsResult?.success && Array.isArray(orgsResult.data)
      ? orgsResult.data.map(o => `  • ${o.slug} - ${o.name} (is_demo: ${o.is_demo})`).join('\n')
      : '  (none)';

    return `FRONTEND LIVE AUTH / MEMBERSHIP CHECK
===========================================
App Mode: ${appMode}
Live Sign-In Status: ${session && user ? 'SIGNED IN' : 'NOT SIGNED IN'}
Session Exists: ${session ? 'yes' : 'no'}
User ID: ${user?.id || 'none'}
User Email: ${user?.email || 'none'}

QUERY RESULTS:
===========================================

1. AUTH UID CHECK:
   Status: ${authResult?.success ? 'SUCCESS' : 'FAILED'}
   UID: ${authResult?.data?.uid || 'none'}
   Email: ${authResult?.data?.email || 'none'}
   Execution Time: ${authResult?.executionTime || 0}ms

2. ORG MEMBERSHIPS CHECK:
   Status: ${membershipsResult?.success ? 'SUCCESS' : 'FAILED'}
   Memberships Returned Count: ${membershipCount}
   Execution Time: ${membershipsResult?.executionTime || 0}ms
   
   Memberships Detail:
${membershipDetails}

3. ORGS TABLE CHECK:
   Status: ${orgsResult?.success ? 'SUCCESS' : 'FAILED'}
   Orgs Returned Count: ${orgsCount}
   Execution Time: ${orgsResult?.executionTime || 0}ms
   
   Orgs Detail:
${orgDetails}

ERRORS:
===========================================
${errorsList.length > 0 ? errorsList.join('\n\n') : '(none)'}

RLS POLICY CHECK:
===========================================
${membershipsResult?.error?.code === '42P17' ? 
`❌ INFINITE RECURSION DETECTED (Code 42P17)
   The org_memberships RLS policy has circular references.
   Backend needs to update policies to break the cycle.
   
   Suggested Fix:
   - Simple policy: auth.uid() = user_id
   - Avoid referencing orgs table in org_memberships policy` :
membershipsResult?.success ? 
`✅ No RLS recursion detected
   Memberships query succeeded` :
membershipsResult?.error ?
`⚠️ Error: ${membershipsResult.error.message || 'Unknown error'}
   Code: ${membershipsResult.error.code || 'N/A'}` :
'(not yet run)'}

FULL DATA DUMPS:
===========================================

Auth Data:
${JSON.stringify(authResult?.data, null, 2)}

Memberships Data:
${JSON.stringify(membershipsResult?.data, null, 2)}

Orgs Data:
${JSON.stringify(orgsResult?.data, null, 2)}`;
  };

  const handleCopy = async () => {
    const reportText = generateReport();
    
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

  const authResult = results[0];
  const membershipsResult = results[1];
  const orgsResult = results[2];

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
            <h2 className={`text-xl font-bold ${textColor}`}>Live Auth / Membership Check</h2>
            <p className={`text-sm ${textMuted} mt-1`}>Direct database query verification for Live mode</p>
          </div>
          <div className="flex items-center gap-2">
            {results.length > 0 && (
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
            )}
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
          {/* Run Button */}
          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <PlayCircle className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Ready to Run Checks</h3>
              <p className={`text-sm ${textMuted} mb-6 text-center max-w-md`}>
                This will execute 3 queries to verify authentication and membership data from Supabase
              </p>
              <button
                onClick={runChecks}
                disabled={running}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium ${
                  running
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <PlayCircle className="w-5 h-5" />
                {running ? 'Running Checks...' : 'Run Auth & Membership Checks'}
              </button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className={`text-xs ${textMuted} mb-1`}>Auth Status</div>
                  <div className={`text-lg font-bold ${authResult?.success ? 'text-green-500' : 'text-red-500'}`}>
                    {authResult?.success ? 'Connected' : 'Failed'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className={`text-xs ${textMuted} mb-1`}>Memberships</div>
                  <div className={`text-lg font-bold ${textColor}`}>
                    {membershipsResult?.success ? (Array.isArray(membershipsResult.data) ? membershipsResult.data.length : 0) : '❌'}
                  </div>
                </div>
                <div className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className={`text-xs ${textMuted} mb-1`}>Orgs</div>
                  <div className={`text-lg font-bold ${textColor}`}>
                    {orgsResult?.success ? (Array.isArray(orgsResult.data) ? orgsResult.data.length : 0) : '❌'}
                  </div>
                </div>
              </div>

              {/* Individual Query Results */}
              {results.map((result, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                      <div>
                        <div className={`text-sm font-semibold ${textColor}`}>
                          Query {idx + 1}: {result.success ? 'Success' : 'Failed'}
                        </div>
                        <div className={`text-xs ${textMuted} mt-0.5`}>
                          {result.executionTime}ms
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <pre className={`${codeBg} ${textColor} p-3 rounded text-xs font-mono mb-3 overflow-x-auto`}>
                    {result.query}
                  </pre>

                  {result.success ? (
                    <div className="space-y-2">
                      <div className={`text-xs font-semibold ${textMuted}`}>RESULT:</div>
                      <pre className={`${codeBg} ${textColor} p-3 rounded text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto`}>
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className={`text-xs font-semibold text-red-500`}>ERROR:</div>
                      <pre className={`bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded text-xs font-mono overflow-x-auto`}>
                        {JSON.stringify(result.error, null, 2)}
                      </pre>
                      {result.error?.code === '42P17' && (
                        <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/20 border border-yellow-800/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                          <div className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'} mb-1`}>
                            🔄 RLS Infinite Recursion Detected
                          </div>
                          <div className={`text-xs ${isDarkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                            Backend is updating RLS policies. Please wait for confirmation and re-run this check.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Re-run button */}
              <button
                onClick={runChecks}
                disabled={running}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                  running
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <PlayCircle className="w-4 h-4" />
                {running ? 'Running...' : 'Re-run All Checks'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${borderColor} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${textMuted}`}>
            {results.length > 0 ? 'Copy report to share with backend team' : 'Run checks to verify Live mode database access'}
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