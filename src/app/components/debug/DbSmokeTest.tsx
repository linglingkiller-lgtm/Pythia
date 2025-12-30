import React, { useState, useEffect } from 'react';
import { useAppMode } from '../../contexts/AppModeContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { listClients, listProjects, listTasks, ApiContext } from '../../lib/api';

export function DbSmokeTest() {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for flag
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('show_db_smoke_test') === 'true') {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  // Never render fully in demo mode, just show disabled state if forced visible
  if (appMode === 'demo') {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 text-gray-400 p-4 rounded shadow-lg z-[100] border border-gray-700 text-xs font-mono">
        <div className="flex justify-between items-center gap-4">
          <span className="font-bold">DB Smoke Test</span>
          <button onClick={() => setIsVisible(false)} className="hover:text-white">✕</button>
        </div>
        <div className="mt-2 text-orange-400">Disabled in Demo Mode</div>
      </div>
    );
  }

  const runTest = async () => {
    setLoading(true);
    setResults([]);
    const logs: string[] = [];
    const log = (msg: string) => {
      logs.push(msg);
      setResults([...logs]); // Update realtime-ish
    };

    try {
      log(`Starting DB Smoke Test...`);
      log(`App Mode: ${appMode}`);
      log(`Org ID: ${activeOrgId || 'NONE'}`);

      if (!activeOrgId) {
        log('❌ Aborting: No Active Org ID');
        return;
      }

      const ctx: ApiContext = {
        appMode: 'prod',
        orgId: activeOrgId
      };

      // 1. Clients
      log('------------------------');
      log('Fetching Clients...');
      const { data: clients, error: clientError } = await listClients(ctx);
      if (clientError) {
        // Safe access to error message
        const msg = 'message' in clientError ? clientError.message : JSON.stringify(clientError);
        log(`❌ Clients Error: ${msg}`);
      } else {
        log(`✅ Clients: ${clients?.length ?? 0} found`);
      }

      // 2. Projects
      log('Fetching Projects...');
      const { data: projects, error: projectError } = await listProjects(ctx);
      if (projectError) {
        const msg = 'message' in projectError ? projectError.message : JSON.stringify(projectError);
        log(`❌ Projects Error: ${msg}`);
      } else {
        log(`✅ Projects: ${projects?.length ?? 0} found`);
      }

      // 3. Tasks
      log('Fetching Tasks...');
      const { data: tasks, error: taskError } = await listTasks(ctx);
      if (taskError) {
        const msg = 'message' in taskError ? taskError.message : JSON.stringify(taskError);
        log(`❌ Tasks Error: ${msg}`);
      } else {
        log(`✅ Tasks: ${tasks?.length ?? 0} found`);
      }
      log('------------------------');
      log('Done.');

    } catch (err: any) {
      log(`💥 Exception: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-slate-950 text-white p-4 rounded-lg shadow-2xl z-[100] border border-slate-800 max-w-sm w-full font-mono text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          DB Smoke Test
        </h3>
        <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white transition-colors">✕</button>
      </div>
      
      <div className="mb-3 p-2 bg-slate-900 rounded border border-slate-800 grid grid-cols-2 gap-2 text-[10px] uppercase tracking-wider">
        <div className="text-slate-400">App Mode</div>
        <div className="text-right text-emerald-400 font-bold">{appMode}</div>
        <div className="text-slate-400">Org ID</div>
        <div className="text-right truncate" title={activeOrgId || ''}>{activeOrgId || 'NULL'}</div>
      </div>

      <div className="h-48 overflow-y-auto bg-black/50 p-2 rounded mb-3 border border-slate-800 font-mono scrollbar-thin scrollbar-thumb-slate-700">
        {results.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600 italic">
            Ready to run queries...
          </div>
        ) : (
          results.map((line, i) => (
            <div key={i} className={`mb-1 pb-1 border-b border-white/5 last:border-0 break-words ${line.includes('❌') ? 'text-red-400' : line.includes('✅') ? 'text-green-400' : 'text-slate-300'}`}>
              {line}
            </div>
          ))
        )}
      </div>

      <button
        onClick={runTest}
        disabled={loading || !activeOrgId}
        className={`w-full py-2.5 rounded font-bold transition-all ${
          loading || !activeOrgId
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
        }`}
      >
        {loading ? 'Running Queries...' : 'Run Smoke Test'}
      </button>
    </div>
  );
}