import React from 'react';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useAppMode } from '../contexts/AppModeContext';
import { useTheme } from '../contexts/ThemeContext';
import { Lock, AlertCircle } from 'lucide-react';

interface LiveModeGateProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export const LiveModeGate: React.FC<LiveModeGateProps> = ({ 
  children, 
  requireAuth = true,
  fallback 
}) => {
  const { appMode } = useAppMode();
  const { user, authReady } = useSupabaseAuth();
  const { isDarkMode } = useTheme();

  // Demo mode: always allow
  if (appMode === 'demo') {
    return <>{children}</>;
  }

  // Live mode: check auth
  if (appMode === 'prod') {
    if (!authReady) {
      return fallback || (
        <div className="flex items-center justify-center p-8">
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Checking authentication...
          </div>
        </div>
      );
    }

    if (requireAuth && !user) {
      return fallback || (
        <div className={`flex flex-col items-center justify-center p-8 rounded-lg border ${
          isDarkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <Lock className={`w-12 h-12 mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Authentication Required
          </h3>
          <p className={`text-sm text-center max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Please sign in to use Live mode. This action requires authentication to access real data and perform write operations.
          </p>
          <div className={`mt-4 flex items-center gap-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <AlertCircle className="w-3 h-3" />
            <span>Switch to Demo mode to explore the platform</span>
          </div>
          {/* Live Login Help */}
          <div className={`mt-3 px-4 py-2 rounded-md text-xs ${
            isDarkMode 
              ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' 
              : 'bg-blue-50 text-blue-700 border border-blue-200'
          }`}>
            <span className="font-medium">Live Login Help:</span> If you don't have a Live account yet, ask an admin to add you in Supabase Auth (Phase 1 bootstrapping).
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};