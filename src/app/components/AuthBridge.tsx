import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useAppMode } from '../contexts/AppModeContext';

/**
 * AuthBridge - Syncs SupabaseAuthContext with legacy AuthContext
 * 
 * In Live mode, when a user signs in via Supabase, this component ensures
 * the legacy AuthContext is updated so isAuthenticated becomes true.
 */
export function AuthBridge() {
  const { syncWithSupabase } = useAuth();
  const { user, session } = useSupabaseAuth();
  const { appMode } = useAppMode();

  useEffect(() => {
    // Only sync in Live mode
    if (appMode === 'prod') {
      console.log('[AuthBridge] Syncing Supabase user to legacy AuthContext:', user?.email || 'null');
      syncWithSupabase(user?.id || null, user?.email || null);
    }
  }, [user, session, appMode, syncWithSupabase]);

  return null; // This is a headless component
}
