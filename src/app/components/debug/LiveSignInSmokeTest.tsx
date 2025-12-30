import React, { useState, useEffect } from 'react';
import { X, Copy, CheckCircle, PlayCircle, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { getSupabaseClient } from '../../../utils/supabase/client';

interface LiveSignInSmokeTestProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TestResult {
  step: string;
  success: boolean;
  data: any;
  error: any;
  executionTime: number;
}

export const LiveSignInSmokeTest: React.FC<LiveSignInSmokeTestProps> = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { user, session, orgMemberships, activeOrgId } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  // Auto-run test when modal opens
  useEffect(() => {
    if (isOpen && results.length === 0 && !running) {
      runSmokeTest();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const codeBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const runSmokeTest = async () => {
    setRunning(true);
    const testResults: TestResult[] = [];
    const supabase = getSupabaseClient();

    // Step 1: Get session
    const start1 = Date.now();
    let sessionUserId: string | null = null;
    try {
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      sessionUserId = currentSession?.user?.id || null;
      testResults.push({
        step: '1. Get Session',
        success: !sessionError && !!currentSession,
        data: currentSession ? {
          user_id: currentSession.user.id,
          email: currentSession.user.email,
          expires_at: currentSession.expires_at
        } : null,
        error: sessionError,
        executionTime: Date.now() - start1
      });
    } catch (err) {
      testResults.push({
        step: '1. Get Session',
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start1
      });
    }

    // Step 2: Query org_memberships
    const start2 = Date.now();
    let membershipOrgIds: string[] = [];
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
        .eq('user_id', sessionUserId || '00000000-0000-0000-0000-000000000000')
        .eq('is_active', true);
      
      if (data) {
        membershipOrgIds = data.map((m: any) => m.org_id);
      }

      testResults.push({
        step: '2. Query org_memberships',
        success: !error,
        data: data,
        error: error,
        executionTime: Date.now() - start2
      });
    } catch (err) {
      testResults.push({
        step: '2. Query org_memberships',
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start2
      });
    }

    // Step 3: Query orgs for those org_ids
    const start3 = Date.now();
    try {
      if (membershipOrgIds.length > 0) {
        const { data, error } = await supabase
          .from('orgs')
          .select('*')
          .in('id', membershipOrgIds);
        
        testResults.push({
          step: '3. Query orgs',
          success: !error,
          data: data,
          error: error,
          executionTime: Date.now() - start3
        });
      } else {
        testResults.push({
          step: '3. Query orgs',
          success: false,
          data: null,
          error: { message: 'No org_ids to query (memberships query returned 0 results)' },
          executionTime: Date.now() - start3
        });
      }
    } catch (err) {
      testResults.push({
        step: '3. Query orgs',
        success: false,
        data: null,
        error: err,
        executionTime: Date.now() - start3
      });
    }

    setResults(testResults);
    setRunning(false);
  };

  const generateReport = () => {
    const sessionResult = results[0];
    const membershipsResult = results[1];
    const orgsResult = results[2];

    const sessionOk = sessionResult?.success || false;
    const userId = sessionResult?.data?.user_id || 'none';
    const membershipsCount = membershipsResult?.success && Array.isArray(membershipsResult.data) 
      ? membershipsResult.data.length 
      : 0;
    const orgIds = membershipsResult?.success && Array.isArray(membershipsResult.data)
      ? membershipsResult.data.map((m: any) => m.org_id).join(', ')
      : 'none';
    const orgsCount = orgsResult?.success && Array.isArray(orgsResult.data)
      ? orgsResult.data.length
      : 0;
    const orgNames = orgsResult?.success && Array.isArray(orgsResult.data)
      ? orgsResult.data.map((o: any) => o.name).join(', ')
      : 'none';
    const activeOrgSelected = activeOrgId ? 'yes' : 'no';
    const spinnerStopped = !running ? 'yes' : 'no';

    const allStepsPassed = results.every(r => r.success);
    const testStatus = allStepsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED';

    return `PHASE 1.5 LIVE SIGN-IN SMOKE TEST REPORT
===========================================
App Mode: ${appMode}
Test Status: ${testStatus}
Timestamp: ${new Date().toLocaleString()}

SESSION CHECK:
===========================================
Session OK? ${sessionOk ? 'YES ✅' : 'NO ❌'}
User ID: ${userId}
User Email: ${sessionResult?.data?.email || 'none'}
Execution Time: ${sessionResult?.executionTime || 0}ms

ORG MEMBERSHIPS CHECK:
===========================================
Memberships Count: ${membershipsCount}
Org IDs: ${orgIds}
Query Success? ${membershipsResult?.success ? 'YES ✅' : 'NO ❌'}
Execution Time: ${membershipsResult?.executionTime || 0}ms
${membershipsResult?.error ? `Error: ${JSON.stringify(membershipsResult.error, null, 2)}` : ''}

ORGS CHECK:
===========================================
Orgs Count: ${orgsCount}
Org Names: ${orgNames}
Query Success? ${orgsResult?.success ? 'YES ✅' : 'NO ❌'}
Execution Time: ${orgsResult?.executionTime || 0}ms
${orgsResult?.error ? `Error: ${JSON.stringify(orgsResult.error, null, 2)}` : ''}

FRONTEND STATE CHECK:
===========================================
Active Org Selected? ${activeOrgSelected}
Active Org ID: ${activeOrgId || 'none'}
Context Memberships Count: ${orgMemberships.length}
Did Spinner Stop? ${spinnerStopped}

RLS POLICY CHECK:
===========================================
${membershipsResult?.error?.code === '42P17' 
  ? `❌ BACKEND RLS RECURSION DETECTED (Code 42P17)
Backend RLS recursion detected. Ask admin to fix org_memberships policies.
The org_memberships table has circular RLS policy references.` 
  : membershipsResult?.success 
  ? `✅ No RLS recursion detected
Memberships query succeeded without errors.`
  : membershipsResult?.error
  ? `⚠️ Query Error:
${JSON.stringify(membershipsResult.error, null, 2)}`
  : '(not yet run)'}

FULL DATA DUMPS:
===========================================

Session Data:
${JSON.stringify(sessionResult?.data, null, 2)}

Memberships Data:
${JSON.stringify(membershipsResult?.data, null, 2)}

Orgs Data:
${JSON.stringify(orgsResult?.data, null, 2)}

CONCLUSION:
===========================================
${allStepsPassed 
  ? `✅ LIVE SIGN-IN IS WORKING CORRECTLY
All smoke tests passed. The RLS policies appear to be fixed.
User can successfully:
- Authenticate with Supabase
- Query their org memberships
- Load organization data
- Select an active organization`
  : `❌ LIVE SIGN-IN HAS ISSUES
Some smoke tests failed. Review the errors above.
${membershipsResult?.error?.code === '42P17' 
  ? 'PRIMARY ISSUE: RLS infinite recursion (42P17) - Backend policies need fixing.'
  : 'Check the error details in each failed step.'}`}`;
  };

  const handleCopy = async () => {
    const reportText = generateReport();
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (err) {
      // Fall through to fallback
    }

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

  const allStepsPassed = results.length > 0 && results.every(r => r.success);

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
            <h2 className={`text-xl font-bold ${textColor}`}>Live Sign-In Smoke Test</h2>
            <p className={`text-sm ${textMuted} mt-1`}>Verify session, memberships, and orgs queries</p>
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
          {/* Loading State */}
          {running && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <PlayCircle className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-blue-500 animate-pulse' : 'text-blue-600 animate-pulse'}`} />
              <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Running Smoke Test...</h3>
              <p className={`text-sm ${textMuted} text-center max-w-md`}>
                Testing session, org memberships, and orgs queries
              </p>
              <div className={`mt-4 text-xs ${textMuted}`}>
                This may take 5-15 seconds depending on network conditions
              </div>
            </div>
          )}

          {/* Run Button (if not running and no results) */}
          {!running && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <PlayCircle className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
              <h3 className={`text-lg font-medium mb-2 ${textColor}`}>Ready to Run Smoke Test</h3>
              <p className={`text-sm ${textMuted} mb-6 text-center max-w-md`}>
                This will verify Live sign-in by testing session, org memberships, and orgs queries
              </p>
              <button
                onClick={runSmokeTest}
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
                {running ? 'Running Tests...' : 'Run Live Sign-In Smoke Test'}
              </button>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-6">
              {/* Overall Status Banner */}
              <div className={`p-4 rounded-lg border-2 ${
                allStepsPassed 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                  : 'bg-red-50 dark:bg-red-900/20 border-red-500'
              }`}>
                <div className="flex items-center gap-3">
                  {allStepsPassed ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  )}
                  <div>
                    <div className={`font-bold ${allStepsPassed ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      {allStepsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}
                    </div>
                    <div className={`text-sm ${allStepsPassed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {allStepsPassed 
                        ? 'Live sign-in is working correctly. RLS policies appear to be fixed.'
                        : 'Review the failed steps below and check error messages.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Step Results */}
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
                          {result.step}: {result.success ? 'Success' : 'Failed'}
                        </div>
                        <div className={`text-xs ${textMuted} mt-0.5`}>
                          {result.executionTime}ms
                        </div>
                      </div>
                    </div>
                  </div>

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
                        <div className={`mt-3 p-4 rounded-lg border-2 ${isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300'}`}>
                          <div className={`font-bold text-lg ${isDarkMode ? 'text-red-300' : 'text-red-800'} mb-2`}>
                            🚨 BACKEND RLS RECURSION DETECTED
                          </div>
                          <div className={`${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                            Backend RLS recursion detected. Ask admin to fix org_memberships policies.
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Context State Summary */}
              <div className={`p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className={`text-sm font-semibold ${textColor} mb-3`}>Frontend Context State</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className={`${textMuted}`}>Active Org Selected:</div>
                    <div className={`${textColor} font-medium`}>{activeOrgId ? 'Yes ✅' : 'No ❌'}</div>
                  </div>
                  <div>
                    <div className={`${textMuted}`}>Active Org ID:</div>
                    <div className={`${textColor} font-mono text-xs`}>{activeOrgId || 'none'}</div>
                  </div>
                  <div>
                    <div className={`${textMuted}`}>Memberships in Context:</div>
                    <div className={`${textColor} font-medium`}>{orgMemberships.length}</div>
                  </div>
                  <div>
                    <div className={`${textMuted}`}>Spinner Stopped:</div>
                    <div className={`${textColor} font-medium`}>{!running ? 'Yes ✅' : 'No ❌'}</div>
                  </div>
                </div>
              </div>

              {/* Re-run button */}
              <button
                onClick={runSmokeTest}
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
                {running ? 'Running...' : 'Re-run Smoke Test'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${borderColor} ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
          <div className={`text-xs ${textMuted}`}>
            {results.length > 0 ? 'Copy report to verify Live sign-in is working' : 'Run test to verify RLS policy fixes'}
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