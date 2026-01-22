import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { X, RefreshCw, Shield, User, Activity, AlertCircle, CheckCircle } from 'lucide-react';

interface MsalAuthDebuggerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MsalAuthDebugger: React.FC<MsalAuthDebuggerProps> = ({ isOpen, onClose }) => {
  const { instance, accounts, inProgress } = useMsal();
  const { currentUser, isAuthenticated, isAuthInProgress } = useAuth();
  const { isDarkMode } = useTheme();
  const [manualCheckResult, setManualCheckResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-300';
  const bgMuted = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  const checkRedirectPromise = async () => {
    setManualCheckResult('Checking redirect promise...');
    try {
        const response = await instance.handleRedirectPromise();
        if (response) {
            setManualCheckResult(`Redirect handled! User: ${response.account?.username}`);
        } else {
            setManualCheckResult('No redirect promise to handle (null response).');
        }
    } catch (e: any) {
        setManualCheckResult(`Error handling redirect: ${e.message}`);
    }
  };

  const forceRefreshToken = async () => {
      setManualCheckResult('Attempting silent token acquisition...');
      if (accounts.length > 0) {
          try {
              const response = await instance.acquireTokenSilent({
                  scopes: ["User.Read", "openid", "profile", "email"],
                  account: accounts[0]
              });
              setManualCheckResult(`Token acquired! Scopes: ${response.scopes.join(', ')}`);
          } catch (e: any) {
              setManualCheckResult(`Token acquisition failed: ${e.message}`);
          }
      } else {
          setManualCheckResult('No active account to acquire token for.');
      }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]"
        onClick={onClose}
      />
      <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl ${bgColor} rounded-xl shadow-2xl border ${borderColor} z-[99999] max-h-[90vh] overflow-y-auto`}>
        <div className={`flex items-center justify-between p-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <h2 className={`text-xl font-bold ${textColor}`}>MSAL Auth Debugger</h2>
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

        <div className="p-6 space-y-6">
          {/* Status Overview */}
          <div className={`grid grid-cols-2 gap-4`}>
             <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
                <div className={`text-xs font-semibold ${textMuted} mb-1`}>Interaction Status</div>
                <div className="flex items-center gap-2">
                    <Activity className={`w-4 h-4 ${inProgress === InteractionStatus.None ? 'text-green-500' : 'text-yellow-500'}`} />
                    <span className={`text-sm font-mono font-bold ${textColor}`}>{inProgress}</span>
                </div>
             </div>
             <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
                <div className={`text-xs font-semibold ${textMuted} mb-1`}>Accounts Detected</div>
                <div className="flex items-center gap-2">
                    <User className={`w-4 h-4 ${accounts.length > 0 ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-sm font-mono font-bold ${textColor}`}>{accounts.length}</span>
                </div>
             </div>
             <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
                <div className={`text-xs font-semibold ${textMuted} mb-1`}>Auth Context Authenticated</div>
                <div className="flex items-center gap-2">
                    {isAuthenticated ? <CheckCircle className="w-4 h-4 text-green-500"/> : <AlertCircle className="w-4 h-4 text-red-500"/>}
                    <span className={`text-sm font-mono font-bold ${textColor}`}>{isAuthenticated ? 'YES' : 'NO'}</span>
                </div>
             </div>
             <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
                <div className={`text-xs font-semibold ${textMuted} mb-1`}>Auth In Progress (Ctx)</div>
                <div className="flex items-center gap-2">
                    {isAuthInProgress ? <Activity className="w-4 h-4 text-yellow-500"/> : <CheckCircle className="w-4 h-4 text-green-500"/>}
                    <span className={`text-sm font-mono font-bold ${textColor}`}>{isAuthInProgress ? 'YES' : 'NO'}</span>
                </div>
             </div>
          </div>

          {/* Current User Info */}
          <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
             <h3 className={`text-sm font-bold ${textColor} mb-3`}>Current User Context</h3>
             {currentUser ? (
                 <pre className={`text-xs font-mono overflow-auto p-2 rounded ${isDarkMode ? 'bg-black/30' : 'bg-white/50'}`}>
                     {JSON.stringify(currentUser, null, 2)}
                 </pre>
             ) : (
                 <div className={`text-sm ${textMuted} italic`}>No user in context</div>
             )}
          </div>

          {/* MSAL Accounts Detail */}
          <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
             <h3 className={`text-sm font-bold ${textColor} mb-3`}>MSAL Accounts Raw Data</h3>
             {accounts.length > 0 ? (
                 <div className="space-y-2">
                     {accounts.map((acc, idx) => (
                         <div key={idx} className={`p-2 rounded border ${isDarkMode ? 'border-gray-700 bg-black/20' : 'border-gray-200 bg-white/50'}`}>
                             <div className="text-xs font-mono">
                                 <div><strong>Username:</strong> {acc.username}</div>
                                 <div><strong>Name:</strong> {acc.name}</div>
                                 <div><strong>Home Account ID:</strong> {acc.homeAccountId}</div>
                                 <div><strong>Environment:</strong> {acc.environment}</div>
                                 <div><strong>Tenant ID:</strong> {acc.tenantId}</div>
                             </div>
                         </div>
                     ))}
                 </div>
             ) : (
                 <div className={`text-sm ${textMuted} italic`}>No accounts found in MSAL instance</div>
             )}
          </div>

           {/* Manual Actions */}
           <div className={`p-4 rounded-lg border ${borderColor} ${bgMuted}`}>
             <h3 className={`text-sm font-bold ${textColor} mb-3`}>Troubleshooting Actions</h3>
             <div className="flex gap-2 flex-wrap">
                 <button 
                    onClick={checkRedirectPromise}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium flex items-center gap-2"
                 >
                     <RefreshCw className="w-3 h-3" />
                     Check Redirect Promise
                 </button>
                 <button 
                    onClick={forceRefreshToken}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium flex items-center gap-2"
                 >
                     <RefreshCw className="w-3 h-3" />
                     Force Token Silent
                 </button>
                 <button 
                    onClick={() => {
                        sessionStorage.clear();
                        window.location.reload();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium flex items-center gap-2"
                 >
                     <X className="w-3 h-3" />
                     Clear Session & Reload
                 </button>
             </div>
             {manualCheckResult && (
                 <div className={`mt-3 p-2 rounded text-xs font-mono border ${isDarkMode ? 'bg-black/30 border-gray-700' : 'bg-white border-gray-200'}`}>
                     {manualCheckResult}
                 </div>
             )}
          </div>
          
          <div className={`text-xs ${textMuted} p-2 bg-yellow-500/10 border border-yellow-500/20 rounded`}>
              <strong>Note:</strong> If "Interaction Status" is not "None", the app considers auth to be in progress and may block rendering. 
              If "Accounts Detected" is 0 but you just signed in, the redirect might not have been processed correctly.
          </div>
        </div>
      </div>
    </>
  );
};
