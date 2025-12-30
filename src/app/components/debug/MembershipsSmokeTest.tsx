import React, { useState } from 'react';
import { X, Play, Users, CheckCircle, XCircle, Copy } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { copyToClipboard } from '../../utils/clipboard';

interface MembershipsSmokeTestProps {
  userId: string | undefined;
}

interface TestResult {
  sessionExists: boolean;
  accessTokenPresent: boolean;
  userId: string;
  rawMembershipRows: number;
  orgRows: number;
  mergedMemberships: number;
  errors: string[];
  rawData: {
    memberships: any[];
    orgs: any[];
  };
}

export const MembershipsSmokeTest: React.FC<MembershipsSmokeTestProps> = ({ userId }) => {
  const { isDarkMode } = useTheme();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const codeBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

  const runTest = async () => {
    setIsRunning(true);
    const supabase = useSupabaseAuth();
    const errors: string[] = [];

    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      const sessionExists = !!session;
      const accessTokenPresent = !!session?.access_token;
      const currentUserId = session?.user?.id || 'none';

      if (sessionError) {
        errors.push(`Session error: ${sessionError.message}`);
      }

      // Step 1: Fetch memberships
      const { data: membershipRows, error: membershipError } = await supabase
        .from('org_memberships')
        .select('org_id, role, is_active')
        .eq('user_id', currentUserId)
        .eq('is_active', true);

      if (membershipError) {
        errors.push(`Memberships fetch error: ${membershipError.message} (code: ${membershipError.code || 'unknown'})`);
      }

      // Step 2: Fetch orgs
      let orgRows: any[] = [];
      if (membershipRows && membershipRows.length > 0) {
        const orgIds = membershipRows.map((m: any) => m.org_id);
        const { data, error: orgError } = await supabase
          .from('orgs')
          .select('id, name, slug, is_demo')
          .in('id', orgIds);

        if (orgError) {
          errors.push(`Orgs fetch error: ${orgError.message}`);
        } else {
          orgRows = data || [];
        }
      }

      // Step 3: Merge
      const merged = membershipRows?.map((membership: any) => {
        const org = orgRows.find((o: any) => o.id === membership.org_id);
        return {
          ...membership,
          org_name: org?.name,
          org_slug: org?.slug,
          is_demo: org?.is_demo,
        };
      }) || [];

      setTestResult({
        sessionExists,
        accessTokenPresent,
        userId: currentUserId,
        rawMembershipRows: membershipRows?.length || 0,
        orgRows: orgRows.length,
        mergedMemberships: merged.length,
        errors,
        rawData: {
          memberships: membershipRows || [],
          orgs: orgRows,
        },
      });
    } catch (err: any) {
      errors.push(`Unexpected error: ${err.message || 'Unknown error'}`);
      setTestResult({
        sessionExists: false,
        accessTokenPresent: false,
        userId: 'error',
        rawMembershipRows: 0,
        orgRows: 0,
        mergedMemberships: 0,
        errors,
        rawData: {
          memberships: [],
          orgs: [],
        },
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyReport = async () => {
    if (!testResult) return;

    const report = `=== MEMBERSHIPS SMOKE TEST REPORT ===
Generated: ${new Date().toLocaleString()}

Session Exists: ${testResult.sessionExists ? 'YES' : 'NO'}
Access Token Present: ${testResult.accessTokenPresent ? 'YES' : 'NO'}
User ID: ${testResult.userId}

Raw Memberships Rows Count: ${testResult.rawMembershipRows}
Orgs Rows Count: ${testResult.orgRows}
Merged Memberships Count: ${testResult.mergedMemberships}

ERRORS:
${testResult.errors.length > 0 ? testResult.errors.join('\n') : 'None'}

RAW DATA:
Memberships: ${JSON.stringify(testResult.rawData.memberships, null, 2)}
Orgs: ${JSON.stringify(testResult.rawData.orgs, null, 2)}

DIAGNOSIS:
${testResult.sessionExists ? '✅' : '❌'} Session exists
${testResult.accessTokenPresent ? '✅' : '❌'} Access token present
${testResult.rawMembershipRows > 0 ? '✅' : '❌'} Memberships query returned data
${testResult.orgRows > 0 ? '✅' : '❌'} Orgs query returned data
${testResult.mergedMemberships > 0 ? '✅' : '❌'} Successfully merged data

${!testResult.sessionExists ? '⚠️ Query likely ran as anonymous user' : ''}
${testResult.sessionExists && testResult.rawMembershipRows === 0 ? '⚠️ Query ran as authenticated but returned 0 rows - check RLS policies' : ''}
${testResult.errors.length > 0 ? '❌ Query errors detected - see above' : ''}
`;

    const success = await copyToClipboard(report);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`mt-4 p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${textColor}`}>Memberships Smoke Test</h3>
        <div className="flex items-center gap-2">
          {testResult && (
            <button
              onClick={handleCopyReport}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 inline mr-1" />
                  Copy
                </>
              )}
            </button>
          )}
          <button
            onClick={runTest}
            disabled={isRunning}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              isRunning
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : isDarkMode
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Play className="w-3 h-3" />
            {isRunning ? 'Running...' : 'Run Test'}
          </button>
        </div>
      </div>

      {testResult && (
        <div className="space-y-3">
          {/* Summary Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {testResult.sessionExists ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={textMuted}>Session Exists:</span>
              <span className={`font-mono ${textColor}`}>{testResult.sessionExists ? 'yes' : 'no'}</span>
            </div>

            <div className="flex items-center gap-2">
              {testResult.accessTokenPresent ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={textMuted}>Access Token:</span>
              <span className={`font-mono ${textColor}`}>{testResult.accessTokenPresent ? 'yes' : 'no'}</span>
            </div>

            <div className="col-span-2">
              <span className={textMuted}>User ID:</span>
              <span className={`ml-2 font-mono text-xs ${textColor}`}>{testResult.userId}</span>
            </div>

            <div>
              <span className={textMuted}>Memberships Rows:</span>
              <span className={`ml-2 font-mono ${textColor}`}>{testResult.rawMembershipRows}</span>
            </div>

            <div>
              <span className={textMuted}>Orgs Rows:</span>
              <span className={`ml-2 font-mono ${textColor}`}>{testResult.orgRows}</span>
            </div>

            <div>
              <span className={textMuted}>Merged Count:</span>
              <span className={`ml-2 font-mono ${textColor}`}>{testResult.mergedMemberships}</span>
            </div>
          </div>

          {/* Errors */}
          {testResult.errors.length > 0 && (
            <div className={`p-2 rounded border ${borderColor} bg-red-50 dark:bg-red-900/20`}>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-red-700 dark:text-red-300 mb-1">Errors:</div>
                  {testResult.errors.map((error, idx) => (
                    <div key={idx} className="text-xs text-red-600 dark:text-red-400 font-mono">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div className={`p-2 rounded border ${borderColor} ${codeBg}`}>
            <div className="text-xs font-semibold mb-2 ${textColor}">Diagnosis:</div>
            <div className="space-y-1 text-xs">
              {!testResult.sessionExists && (
                <div className="text-yellow-600 dark:text-yellow-400">
                  ⚠️ Query likely ran as anonymous user (no session)
                </div>
              )}
              {testResult.sessionExists && testResult.rawMembershipRows === 0 && (
                <div className="text-yellow-600 dark:text-yellow-400">
                  ⚠️ Authenticated but returned 0 rows - check RLS policies
                </div>
              )}
              {testResult.sessionExists && testResult.rawMembershipRows > 0 && testResult.orgRows > 0 && (
                <div className="text-green-600 dark:text-green-400">
                  ✅ Queries successful - memberships loaded correctly
                </div>
              )}
              {testResult.errors.length > 0 && (
                <div className="text-red-600 dark:text-red-400">
                  ❌ Query errors detected - see above
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!testResult && (
        <div className={`text-xs ${textMuted} text-center py-4`}>
          Click "Run Test" to diagnose membership loading issues
        </div>
      )}
    </div>
  );
};