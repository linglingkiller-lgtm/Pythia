import React, { useState } from 'react';
import { X, Database, PlayCircle, PlusCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getSupabaseClient } from '../../../utils/supabase/client';

// Get singleton Supabase client
const supabase = getSupabaseClient();

interface SmokeTestRow {
  id: string;
  name: string;
  created_at: string;
}

export function SmokeTestDebugPanel() {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState<SmokeTestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [insertName, setInsertName] = useState('Inserted from Figma Make');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Check connection on mount
  React.useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const { error } = await supabase.from('smoke_test').select('count').limit(1);
      if (error) {
        setConnectionStatus('error');
        setError(`Connection failed: ${error.message}`);
      } else {
        setConnectionStatus('connected');
        setError(null);
      }
    } catch (err) {
      setConnectionStatus('error');
      setError(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleRunSelect = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { data, error } = await supabase
        .from('smoke_test')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setRows(data || []);
      setSuccessMessage(`Successfully retrieved ${data?.length || 0} rows`);
    } catch (err) {
      setError(`SELECT Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertRow = async () => {
    if (!insertName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await supabase
        .from('smoke_test')
        .insert([{ name: insertName }])
        .select();

      if (error) throw error;

      setSuccessMessage(`Successfully inserted row: ${data?.[0]?.name}`);
      
      // Auto-refresh the list
      await handleRunSelect();
    } catch (err) {
      setError(`INSERT Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 px-4 py-2 rounded-lg font-semibold text-sm shadow-lg transition-all flex items-center gap-2 ${
          isDarkMode
            ? 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
            : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Database className="w-4 h-4" />
        DB Debug
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 w-[600px] max-h-[80vh] overflow-hidden rounded-xl shadow-2xl border ${
        isDarkMode
          ? 'bg-slate-900 border-slate-700'
          : 'bg-white border-gray-300'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Debug: Supabase Smoke Test
          </h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className={`p-1 rounded hover:bg-opacity-10 transition-colors ${
            isDarkMode ? 'hover:bg-white' : 'hover:bg-black'
          }`}
        >
          <X className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(80vh-60px)]">
        {/* Status Indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          connectionStatus === 'connected'
            ? isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
            : connectionStatus === 'error'
            ? isDarkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'
            : isDarkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            connectionStatus === 'connected'
              ? 'bg-green-500 animate-pulse'
              : connectionStatus === 'error'
              ? 'bg-red-500'
              : 'bg-yellow-500 animate-pulse'
          }`} />
          <span className={`text-xs font-semibold ${
            connectionStatus === 'connected'
              ? isDarkMode ? 'text-green-400' : 'text-green-700'
              : connectionStatus === 'error'
              ? isDarkMode ? 'text-red-400' : 'text-red-700'
              : isDarkMode ? 'text-yellow-400' : 'text-yellow-700'
          }`}>
            {connectionStatus === 'connected'
              ? 'Connected'
              : connectionStatus === 'error'
              ? 'Error'
              : 'Checking...'}
          </span>
        </div>

        {/* Insert Section */}
        <div className="space-y-2">
          <label className={`block text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Insert Test Row
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={insertName}
              onChange={(e) => setInsertName(e.target.value)}
              placeholder="Row name..."
              className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
              }`}
            />
            <button
              onClick={handleInsertRow}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                isLoading
                  ? isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400'
                  : isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Insert
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRunSelect}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-gray-200 text-gray-400'
                : isDarkMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            {isLoading ? 'Running...' : 'Run SELECT'}
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className={`px-3 py-2 rounded-lg border ${
            isDarkMode ? 'bg-green-900/20 border-green-500/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
          }`}>
            <p className="text-xs font-semibold">{successMessage}</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className={`px-3 py-2 rounded-lg border ${
            isDarkMode ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <p className="text-xs font-mono whitespace-pre-wrap">{error}</p>
          </div>
        )}

        {/* Results Table */}
        {rows.length > 0 && (
          <div className="space-y-2">
            <h4 className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
              Results ({rows.length} rows)
            </h4>
            <div className={`overflow-x-auto rounded-lg border ${
              isDarkMode ? 'border-slate-700' : 'border-gray-200'
            }`}>
              <table className="w-full text-xs">
                <thead className={isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}>
                  <tr>
                    <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Name
                    </th>
                    <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      Created At
                    </th>
                    <th className={`px-3 py-2 text-left font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      ID
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                  {rows.map((row) => (
                    <tr key={row.id} className={isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                      <td className={`px-3 py-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-900'}`}>
                        {row.name}
                      </td>
                      <td className={`px-3 py-2 font-mono ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className={`px-3 py-2 font-mono text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        {row.id.substring(0, 8)}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}