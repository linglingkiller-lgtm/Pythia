import React, { useState } from 'react';
import { X, Database, CheckCircle, XCircle, AlertTriangle, RefreshCw, Copy, Activity } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { getSupabaseClient } from '../../../utils/supabase/client';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface SupabaseEnvCheckProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QueryResult {
  status: 'success' | 'error' | 'timeout';
  data?: any;
  error?: string;
  timeMs: number;
  hint?: string;
}

interface RestPingResult {
  status: number | null;
  ok: boolean;
  timeMs: number;
  body: string;
  error?: string;
}

export function SupabaseEnvCheck({ isOpen, onClose }: SupabaseEnvCheckProps) {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const [loading, setLoading] = useState(false);
  const [restPingLoading, setRestPingLoading] = useState(false);
  const [restPingResult, setRestPingResult] = useState<RestPingResult | null>(null);
  const [results, setResults] = useState<{
    appEnvironment: QueryResult | null;
    orgs: QueryResult | null;
    orgEnvironments: QueryResult | null;
    sessionInfo: {
      supabaseUrl: string;
      anonKeyPresent: boolean;
      appMode: string;
      sessionExists: boolean;
      userId: string | null;
    };
  } | null>(null);

  const runRestPing = async () => {
    setRestPingLoading(true);
    const startTime = Date.now();
    
    try {
      const supabase = getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'apikey': publicAnonKey,
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(
        `https://${projectId}.supabase.co/rest/v1/app_environment?select=key&limit=1`,
        { headers }
      );
      
      const timeMs = Date.now() - startTime;
      const bodyText = await response.text();
      const truncatedBody = bodyText.length > 500 ? bodyText.substring(0, 500) + '...' : bodyText;
      
      setRestPingResult({
        status: response.status,
        ok: response.ok,
        timeMs,
        body: truncatedBody,
      });
    } catch (error: any) {
      const timeMs = Date.now() - startTime;
      setRestPingResult({
        status: null,
        ok: false,
        timeMs,
        body: '',
        error: error.message || 'Unknown error',
      });
    }
    
    setRestPingLoading(false);
  };

  const runCheck = async () => {
    setLoading(true);
    
    const supabase = getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Capture session info
    const sessionInfo = {
      supabaseUrl: `${projectId}.supabase.co`,
      anonKeyPresent: !!publicAnonKey,
      appMode: appMode,
      sessionExists: !!session,
      userId: session?.user?.id || null,
    };

    // Determine timeout based on mode
    const timeoutDuration = appMode === 'prod' ? 30000 : 15000;

    let appEnvironment: QueryResult | null = null;
    let orgs: QueryResult | null = null;
    let orgEnvironments: QueryResult | null = null;

    // Sequential queries
    // Query 1: app_environment
    appEnvironment = await runQueryWithTimeout(
      () => supabase.from('app_environment').select('*'),
      timeoutDuration,
      'app_environment'
    );

    // Query 2: orgs
    orgs = await runQueryWithTimeout(
      () => supabase.from('orgs').select('*').order('created_at', { ascending: false }).limit(10),
      timeoutDuration,
      'orgs'
    );

    // Query 3: org_environments
    orgEnvironments = await runQueryWithTimeout(
      () => supabase.from('org_environments').select('*').order('created_at', { ascending: false }).limit(10),
      timeoutDuration,
      'org_environments'
    );

    setResults({ 
      appEnvironment, 
      orgs, 
      orgEnvironments,
      sessionInfo,
    });
    setLoading(false);
  };

  const runQueryWithTimeout = async (
    queryFn: () => any,
    timeoutMs: number,
    queryName: string
  ): Promise<QueryResult> => {
    const startTime = Date.now();
    let timedOut = false;

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          timedOut = true;
          reject(new Error(`Query timeout after ${timeoutMs / 1000}s`));
        }, timeoutMs);
      });

      const queryPromise = queryFn();
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      const timeMs = Date.now() - startTime;

      if (error) {
        return {
          status: 'error',
          error: error.message,
          timeMs,
          hint: error.hint || error.details || undefined,
        };
      }

      return {
        status: 'success',
        data,
        timeMs,
      };
    } catch (e: any) {
      const timeMs = Date.now() - startTime;
      return {
        status: timedOut ? 'timeout' : 'error',
        error: e.message || 'Unknown error',
        timeMs,
      };
    }
  };

  const copyReport = () => {
    if (!results) return;

    const report = generateReport(results, restPingResult);
    navigator.clipboard.writeText(report).then(() => {
      alert('Report copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy report');
    });
  };

  const generateReport = (
    results: NonNullable<typeof results>,
    restPing: RestPingResult | null
  ): string => {
    let report = '=== SUPABASE CONNECTIVITY REPORT ===\n\n';
    
    report += `supabaseUrl: ${results.sessionInfo.supabaseUrl}\n`;
    report += `anonKey present: ${results.sessionInfo.anonKeyPresent}\n`;
    report += `appMode: ${results.sessionInfo.appMode}\n`;
    report += `session exists: ${results.sessionInfo.sessionExists}\n`;
    report += `user id: ${results.sessionInfo.userId || 'N/A'}\n\n`;
    
    if (restPing) {
      report += '--- REST Ping ---\n';
      report += `status: ${restPing.status}\n`;
      report += `ok: ${restPing.ok}\n`;
      report += `time_ms: ${restPing.timeMs}\n`;
      report += `body: ${restPing.body}\n`;
      if (restPing.error) {
        report += `error: ${restPing.error}\n`;
      }
      report += '\n';
    }
    
    report += '--- app_environment query ---\n';
    report += `status: ${results.appEnvironment?.status}\n`;
    report += `time_ms: ${results.appEnvironment?.timeMs}\n`;
    if (results.appEnvironment?.error) {
      report += `error: ${results.appEnvironment.error}\n`;
    }
    if (results.appEnvironment?.hint) {
      report += `hint: ${results.appEnvironment.hint}\n`;
    }
    if (results.appEnvironment?.data) {
      report += `rows: ${results.appEnvironment.data.length}\n`;
    }
    report += '\n';
    
    report += '--- orgs query ---\n';
    report += `status: ${results.orgs?.status}\n`;
    report += `time_ms: ${results.orgs?.timeMs}\n`;
    if (results.orgs?.error) {
      report += `error: ${results.orgs.error}\n`;
    }
    if (results.orgs?.hint) {
      report += `hint: ${results.orgs.hint}\n`;
    }
    if (results.orgs?.data) {
      report += `rows: ${results.orgs.data.length}\n`;
    }
    report += '\n';
    
    report += '--- org_environments query ---\n';
    report += `status: ${results.orgEnvironments?.status}\n`;
    report += `time_ms: ${results.orgEnvironments?.timeMs}\n`;
    if (results.orgEnvironments?.error) {
      report += `error: ${results.orgEnvironments.error}\n`;
    }
    if (results.orgEnvironments?.hint) {
      report += `hint: ${results.orgEnvironments.hint}\n`;
    }
    if (results.orgEnvironments?.data) {
      report += `rows: ${results.orgEnvironments.data.length}\n`;
    }
    
    return report;
  };

  React.useEffect(() => {
    if (isOpen && !results) {
      runCheck();
    }
  }, [isOpen, results]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border ${
          isDarkMode
            ? 'bg-slate-900 border-white/10'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <Database className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Supabase Environment Check
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <button
                onClick={copyReport}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm ${
                  isDarkMode
                    ? 'hover:bg-white/5 text-slate-300 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <Copy className="w-4 h-4" />
                Copy Report
              </button>
            )}
            <button
              onClick={runCheck}
              disabled={loading}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-white/5 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-white/5 text-slate-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className={`w-8 h-8 animate-spin ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  Checking Supabase environment...
                </p>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-6">
              {/* Connectivity Deep Check Section */}
              <div className={`p-4 rounded-lg border ${
                isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <Activity className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Connectivity Deep Check
                  </h3>
                </div>
                <div className={`space-y-2 text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  <div className="flex justify-between">
                    <span className="font-semibold">Supabase URL:</span>
                    <span className="font-mono">{results.sessionInfo.supabaseUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Anon Key Present:</span>
                    <span className={results.sessionInfo.anonKeyPresent ? 'text-green-500' : 'text-red-500'}>
                      {results.sessionInfo.anonKeyPresent ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">App Mode:</span>
                    <span className={`font-semibold ${
                      results.sessionInfo.appMode === 'prod' ? 'text-green-500' : 'text-orange-500'
                    }`}>
                      {results.sessionInfo.appMode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Session Exists:</span>
                    <span className={results.sessionInfo.sessionExists ? 'text-green-500' : 'text-yellow-500'}>
                      {results.sessionInfo.sessionExists ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">User ID:</span>
                    <span className="font-mono text-xs">
                      {results.sessionInfo.userId || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* REST Ping Button */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={runRestPing}
                    disabled={restPingLoading}
                    className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } ${restPingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Activity className={`w-4 h-4 ${restPingLoading ? 'animate-pulse' : ''}`} />
                    {restPingLoading ? 'Pinging...' : 'Run REST Ping'}
                  </button>
                </div>

                {/* REST Ping Results */}
                {restPingResult && (
                  <div className={`mt-4 p-3 rounded border text-xs space-y-1 ${
                    restPingResult.ok
                      ? isDarkMode
                        ? 'bg-green-900/20 border-green-500/30 text-green-400'
                        : 'bg-green-50 border-green-200 text-green-700'
                      : isDarkMode
                        ? 'bg-red-900/20 border-red-500/30 text-red-400'
                        : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span>{restPingResult.status || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">OK:</span>
                      <span>{restPingResult.ok ? 'true' : 'false'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Time:</span>
                      <span>{restPingResult.timeMs}ms</span>
                    </div>
                    {restPingResult.error && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <span className="font-semibold">Error:</span>
                        <div className="mt-1 font-mono">{restPingResult.error}</div>
                      </div>
                    )}
                    {restPingResult.body && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <span className="font-semibold">Response Body:</span>
                        <div className="mt-1 font-mono break-all">{restPingResult.body}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Query 1: app_environment */}
              <EnhancedQuerySection
                title="app_environment"
                result={results.appEnvironment}
                isDarkMode={isDarkMode}
              />

              {/* Query 2: orgs */}
              <EnhancedQuerySection
                title="orgs (latest 10)"
                result={results.orgs}
                isDarkMode={isDarkMode}
              />

              {/* Query 3: org_environments */}
              <EnhancedQuerySection
                title="org_environments (latest 10)"
                result={results.orgEnvironments}
                isDarkMode={isDarkMode}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                Click the refresh button to check environment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EnhancedQuerySection({
  title,
  result,
  isDarkMode,
}: {
  title: string;
  result: QueryResult | null;
  isDarkMode: boolean;
}) {
  if (!result) return null;

  const isError = result.status === 'error' || result.status === 'timeout';
  const data = result.data;

  return (
    <div className={`p-4 rounded-lg border ${
      isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {result.timeMs}ms {result.status === 'timeout' ? '(timeout)' : ''}
          </span>
          {isError ? (
            <div className="flex items-center gap-1.5">
              <XCircle className={`w-4 h-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
                {result.status === 'timeout' ? 'Timeout' : 'Error'}
              </span>
            </div>
          ) : data ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                {data.length} row{data.length !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AlertTriangle className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                No data
              </span>
            </div>
          )}
        </div>
      </div>

      {isError ? (
        <div className={`p-3 rounded border text-xs space-y-1 ${
          isDarkMode
            ? 'bg-red-900/20 border-red-500/30 text-red-400'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div>
            <span className="font-semibold">Error: </span>
            {result.error}
          </div>
          {result.hint && (
            <div>
              <span className="font-semibold">Hint: </span>
              {result.hint}
            </div>
          )}
        </div>
      ) : data && data.length > 0 ? (
        <div className={`overflow-x-auto rounded border ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <table className="w-full text-xs">
            <thead>
              <tr className={isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}>
                {Object.keys(data[0]).map((key) => (
                  <th
                    key={key}
                    className={`px-3 py-2 text-left font-semibold ${
                      isDarkMode ? 'text-slate-300' : 'text-gray-700'
                    }`}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, idx: number) => (
                <tr
                  key={idx}
                  className={
                    isDarkMode
                      ? 'border-t border-white/5 hover:bg-white/5'
                      : 'border-t border-gray-100 hover:bg-gray-50'
                  }
                >
                  {Object.values(row).map((value: any, cellIdx) => (
                    <td
                      key={cellIdx}
                      className={`px-3 py-2 ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-600'
                      }`}
                    >
                      {value === null ? (
                        <span className="italic opacity-50">null</span>
                      ) : typeof value === 'object' ? (
                        JSON.stringify(value)
                      ) : (
                        String(value)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={`text-xs italic ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
          No data returned
        </p>
      )}
    </div>
  );
}