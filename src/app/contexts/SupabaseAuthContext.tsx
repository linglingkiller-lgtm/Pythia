import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { getSupabaseClient } from '../../utils/supabase/client';
import { useAppMode } from './AppModeContext';

interface OrgMembership {
  org_id: string;
  org_name: string;
  org_slug: string;
  is_demo: boolean;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  is_active: boolean;
}

interface SupabaseAuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  authReady: boolean; // True once initial session check completes
  membershipsLoading: boolean;
  membershipsLoaded: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  orgMemberships: OrgMembership[];
  activeOrgId: string | null;
  activeOrg: OrgMembership | null;
  setActiveOrgId: (orgId: string) => void;
  activeRole: string | null;
  connectionStatus: 'connected' | 'disconnected' | 'checking';
  membershipError: string | null;
  retryMembershipFetch: () => Promise<void>;
}

const defaultContext: SupabaseAuthContextType = {
  user: null,
  session: null,
  authReady: false,
  membershipsLoading: false,
  membershipsLoaded: false,
  signIn: async () => ({ success: false, error: 'Not initialized' }),
  signOut: async () => {},
  signInWithOtp: async () => ({ success: false, error: 'Not initialized' }),
  orgMemberships: [],
  activeOrgId: null,
  activeOrg: null,
  setActiveOrgId: () => {},
  activeRole: null,
  connectionStatus: 'checking',
  membershipError: null,
  retryMembershipFetch: async () => {},
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>(defaultContext);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appMode } = useAppMode();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  // Split loading states
  const [authReady, setAuthReady] = useState(false);
  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [membershipsLoaded, setMembershipsLoaded] = useState(false);
  
  const [orgMemberships, setOrgMemberships] = useState<OrgMembership[]>([]);
  const [activeOrgId, setActiveOrgIdState] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [membershipError, setMembershipError] = useState<string | null>(null);

  const membershipsFetchInFlight = React.useRef(false);
  const lastFetchedUserId = React.useRef<string | null>(null);
  
  // 1. Add instance ID for diagnosis
  const instanceId = React.useRef(typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(7)).current;

  const supabase = getSupabaseClient();

  // Log on mount/unmount
  useEffect(() => {
    console.log(`[SupabaseAuth][${instanceId}] 🟢 Provider MOUNTED`);
    return () => {
      console.log(`[SupabaseAuth][${instanceId}] 🔴 Provider UNMOUNTED`);
    };
  }, []);

  // Load active org from localStorage
  useEffect(() => {
    const storedOrgId = localStorage.getItem('pythia_active_org_id');
    if (storedOrgId) {
      setActiveOrgIdState(storedOrgId);
    }
  }, []);

  // Initialize session and set up auth listener
  useEffect(() => {
    // Reset state whenever appMode changes to prevent cross-contamination
    // This ensures 'demo-user-123' doesn't persist into 'prod' mode logic
    setUser(null);
    setSession(null);
    setAuthReady(false);
    setMembershipsLoaded(false);
    setOrgMemberships([]);
    setMembershipError(null);
    lastFetchedUserId.current = null;
    membershipsFetchInFlight.current = false;
    
    // Demo mode: fake session + resolve demo org UUID
    if (appMode === 'demo') {
      const initDemoMode = async () => {
        // Explicitly clear any Supabase session to prevent RLS issues with previous tokens
        await supabase.auth.signOut().catch(() => {});

        setUser({
          id: 'demo-user-123',
          email: 'admin@echocanyonconsulting.com',
          app_metadata: {},
          user_metadata: { name: 'Demo Admin' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as SupabaseUser);
        setSession({
          access_token: 'demo-token',
          refresh_token: 'demo-refresh',
          expires_in: 3600,
          token_type: 'bearer',
          user: {} as SupabaseUser,
        } as Session);
        setConnectionStatus('connected');
        setAuthReady(true);
        setMembershipsLoading(true);
        setMembershipError(null); // Ensure no error is shown

        // Try to resolve demo org UUID from database
        try {
          const { data, error } = await supabase
            .from('orgs')
            .select('id, name, slug, is_demo')
            .eq('slug', 'ecc-demo')
            .maybeSingle();

          if (data && !error) {
            // Found demo org in DB, use its UUID
            console.log('✅ Demo org found in database:', data.name);
            setOrgMemberships([
              {
                org_id: data.id,
                org_name: data.name || 'Echo Canyon Consulting (Demo)',
                org_slug: data.slug,
                is_demo: data.is_demo,
                role: 'admin',
                is_active: true,
              },
            ]);
            setActiveOrgIdState(data.id);
            localStorage.setItem('pythia_active_org_id', data.id);
          } else {
            // Demo org doesn't exist in DB yet - use placeholder
            console.log('ℹ️ Demo org not in database, using placeholder (this is normal for new installations)');
            setOrgMemberships([
              {
                org_id: 'demo-org-uuid-placeholder',
                org_name: 'Echo Canyon Consulting (Demo)',
                org_slug: 'ecc-demo',
                is_demo: true,
                role: 'admin',
                is_active: true,
              },
            ]);
            setActiveOrgIdState('demo-org-uuid-placeholder');
          }
        } catch (err) {
          console.log('ℹ️ Could not query demo org from database, using placeholder (this is normal)');
          // Fallback: use placeholder
          setOrgMemberships([
            {
              org_id: 'demo-org-uuid-placeholder',
              org_name: 'Echo Canyon Consulting (Demo)',
              org_slug: 'ecc-demo',
              is_demo: true,
              role: 'admin',
              is_active: true,
            },
          ]);
          setActiveOrgIdState('demo-org-uuid-placeholder');
        } finally {
          setMembershipsLoading(false);
          setMembershipsLoaded(true);
        }
      };

      initDemoMode();
      return;
    }

    // Live mode: real Supabase session
    let mounted = true;

    const initSession = async () => {
      console.log('🔄 [SupabaseAuth] Initializing session check...');
      try {
        setConnectionStatus('checking');
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          if (mounted) setConnectionStatus('disconnected');
        } else {
          // Connection successful (we got a response from Supabase)
          // Even if there's no session, the connection works
          if (mounted) {
            setConnectionStatus('connected');
            setSession(currentSession);
            setUser(currentSession?.user || null);
            
            // Mark auth as ready immediately after session check
            setAuthReady(true);
            console.log('✅ [SupabaseAuth] Session check complete. Auth ready. Session:', !!currentSession);
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        if (mounted) setConnectionStatus('disconnected');
      } finally {
        if (mounted) setAuthReady(true); // Ensure we always flip this switch
      }
    };

    initSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      
      console.log('🔐 Auth state changed:', event, 'Session:', newSession ? 'exists' : 'none');
      
      setSession(newSession);
      setUser(newSession?.user || null);
      
      if (event === 'SIGNED_OUT') {
        console.log('ℹ️ User signed out');
        setOrgMemberships([]);
        setActiveOrgIdState(null);
        setMembershipsLoaded(false); 
        lastFetchedUserId.current = null;
      } 
      
      setAuthReady(true);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [appMode]);

  // Fetch org memberships from database
  const fetchOrgMemberships = async (userId: string) => {
    // SKIP if in demo mode - we handle this in initDemoMode
    if (appMode === 'demo') {
      console.log(`[SupabaseAuth][${instanceId}] ⚡ Skipping fetch in demo mode`);
      return;
    }

    // Guard: Prevent concurrent fetches
    if (membershipsFetchInFlight.current) {
      console.log(`[SupabaseAuth][${instanceId}] 🛡️ Fetch skipped: Already in flight for user ${userId}`);
      return;
    }
    
    // Guard: Prevent re-fetching same user if already loaded
    if (lastFetchedUserId.current === userId && membershipsLoaded) {
      console.log(`[SupabaseAuth][${instanceId}] 🛡️ Fetch skipped: Already loaded for user ${userId}`);
      return;
    }

    membershipsFetchInFlight.current = true;
    setMembershipsLoading(true);

    const fetchStartTime = Date.now();
    console.log(`[SupabaseAuth][${instanceId}] 🔍 Starting two-step membership fetch for user: ${userId}`);
    
    try {
      // Validate UUID to prevent 22P02 error
      // Strictly reject demo user ID or non-UUIDs
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (userId === 'demo-user-123') {
          console.log(`[SupabaseAuth][${instanceId}] ℹ️ Skipping fetch for demo user (detected in prod flow).`);
          setMembershipsLoading(false);
          setMembershipsLoaded(true);
          membershipsFetchInFlight.current = false;
          return;
      }

      if (!uuidRegex.test(userId)) {
        console.warn(`[SupabaseAuth][${instanceId}] ⚠️ Invalid UUID format: ${userId}. Skipping fetch.`);
        
        // In demo mode, we should NOT set an error.
        // In prod mode, if we have an invalid UUID, it's weird but we shouldn't crash.
        
        setMembershipsLoading(false);
        setMembershipsLoaded(true); // Treat as loaded empty
        membershipsFetchInFlight.current = false;
        
        if (appMode === 'demo') {
           setMembershipError(null);
        }
        return;
      }

      // STEP 1: Fetch memberships directly (no JOIN to avoid RLS complications)
      console.log(`[SupabaseAuth][${instanceId}] 📊 Step 1: Fetching memberships...`);
      const step1Start = Date.now();
      
      const { data: membershipRows, error: membershipError } = await supabase
        .from('org_memberships')
        .select('org_id, role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true);

      const step1Duration = Date.now() - step1Start;
      console.log(`[SupabaseAuth][${instanceId}] ⏱️ Step 1 took ${step1Duration}ms`);

      if (membershipError) {
        console.error(`[SupabaseAuth][${instanceId}] ❌ Error fetching org memberships:`, membershipError);
        
        // Handle RLS infinite recursion error specifically
        if (membershipError.code === '42P17') {
          console.error('\n');
          console.error('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
          console.error('🚨                                                    🚨');
          console.error('🚨  BACKEND RLS RECURSION DETECTED (Code 42P17)     🚨');
          console.error('🚨                                                    🚨');
          console.error('🚨  Backend RLS recursion detected.                  🚨');
          console.error('🚨  Ask admin to fix org_memberships policies.       🚨');
          console.error('🚨                                                    🚨');
          console.error('🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨');
          console.error('\n');
          console.error('📋 REQUIRED FIX: Update RLS policies in Supabase to avoid circular references.');
          console.error('💡 SUGGESTED POLICY: Enable simple policy like "allow select if auth.uid() = user_id"');
          console.error('📖 See: https://supabase.com/docs/guides/auth/row-level-security');
        } else {
          // Show raw error message for non-RLS errors
          console.error(`[SupabaseAuth][${instanceId}] ❌ Org memberships fetch error:`, membershipError.message || JSON.stringify(membershipError));
        }
        
        // NON-BLOCKING: Show warning but don't prevent app from rendering
        console.warn('⚠️ Memberships fetch failed, but continuing app load.');
        setMembershipError(membershipError.message || 'Unknown error fetching org memberships');
        return;
      }

      console.log(`[SupabaseAuth][${instanceId}] ✅ Step 1 complete: ${membershipRows?.length || 0} memberships found`);

      if (!membershipRows || membershipRows.length === 0) {
        console.warn(`[SupabaseAuth][${instanceId}] ⚠️ No memberships returned — check auth token / RLS / query`);
        console.warn('User authenticated but has no active org memberships in database.');
        // NON-BLOCKING: Allow app to render
        setOrgMemberships([]);
        return;
      }

      // STEP 2: Fetch orgs separately
      const orgIds = membershipRows.map((m: any) => m.org_id);
      console.log(`[SupabaseAuth][${instanceId}] 📊 Step 2: Fetching orgs for IDs:`, orgIds);
      const step2Start = Date.now();
      
      const { data: orgRows, error: orgError } = await supabase
        .from('orgs')
        .select('id, name, slug, is_demo')
        .in('id', orgIds);

      const step2Duration = Date.now() - step2Start;
      console.log(`[SupabaseAuth][${instanceId}] ⏱️ Step 2 took ${step2Duration}ms`);

      if (orgError) {
        console.error(`[SupabaseAuth][${instanceId}] ❌ Error fetching orgs:`, orgError);
        console.error('Org fetch error:', orgError.message || JSON.stringify(orgError));
        // NON-BLOCKING: Continue with partial data
        setOrgMemberships([]);
        return;
      }

      console.log(`[SupabaseAuth][${instanceId}] ✅ Step 2 complete: ${orgRows?.length || 0} orgs found`);

      // STEP 3: Merge client-side
      console.log(`[SupabaseAuth][${instanceId}] 🔗 Step 3: Merging memberships with org data...`);
      const memberships: OrgMembership[] = membershipRows.map((membership: any) => {
        const org = orgRows?.find((o: any) => o.id === membership.org_id);
        return {
          org_id: membership.org_id,
          org_name: org?.name || 'Unknown Organization',
          org_slug: org?.slug || 'unknown',
          is_demo: org?.is_demo || false,
          role: membership.role,
          is_active: membership.is_active,
        };
      });
      
      const totalDuration = Date.now() - fetchStartTime;
      console.log(`[SupabaseAuth][${instanceId}] ✅ Step 3 complete: ${memberships.length} enriched memberships ready`);
      console.log(`[SupabaseAuth][${instanceId}] ⏱️ Total fetch time: ${totalDuration}ms`);
      console.log(`[SupabaseAuth][${instanceId}] 📋 Memberships:`, memberships.map(m => `${m.org_name} (${m.role})`).join(', '));
      
      setOrgMemberships(memberships);
      
      // Auto-select active org with proper logic
      const storedOrgId = localStorage.getItem('pythia_active_org_id');
      
      // Validate stored ID: Must exist in memberships and be a UUID
      const validStoredOrg = storedOrgId 
          ? memberships.find(m => m.org_id === storedOrgId) 
          : undefined;
      
      if (validStoredOrg) {
        // Use stored org if it's in memberships
        console.log(`[SupabaseAuth][${instanceId}] ✅ Using stored active org:`, validStoredOrg.org_name);
        setActiveOrgIdState(storedOrgId);
      } else {
        // Select first org, preferring non-demo in prod mode
        let selectedOrg = memberships[0];
        
        if (appMode === 'prod' && memberships.length > 1) {
          const nonDemoOrg = memberships.find(m => !m.is_demo);
          if (nonDemoOrg) {
            selectedOrg = nonDemoOrg;
            console.log(`[SupabaseAuth][${instanceId}] ✅ Prod mode: Auto-selecting first non-demo org:`, selectedOrg.org_name);
          }
        }
        
        if (selectedOrg) {
            console.log(`[SupabaseAuth][${instanceId}] ✅ Auto-selecting org:`, selectedOrg.org_name);
            setActiveOrgIdState(selectedOrg.org_id);
            localStorage.setItem('pythia_active_org_id', selectedOrg.org_id);
        } else {
            console.warn(`[SupabaseAuth][${instanceId}] ⚠️ No valid org found to select.`);
            setActiveOrgIdState(null);
        }
      }
      
    } catch (err) {
      const totalDuration = Date.now() - fetchStartTime;
      console.error(`[SupabaseAuth][${instanceId}] 💥 Unexpected error fetching org memberships after ${totalDuration}ms:`, err);
      // NON-BLOCKING: Allow app to render even on unexpected errors
    } finally {
        membershipsFetchInFlight.current = false;
        lastFetchedUserId.current = userId;
        setMembershipsLoading(false);
        setMembershipsLoaded(true);
    }
  };

  // Dedicated effect for membership fetching
  useEffect(() => {
    // Only run if auth is ready and we have a user
    if (!authReady || !user?.id) {
        return;
    }

    if (appMode === 'demo') {
      console.log(`[SupabaseAuth][${instanceId}] ⚡ Skipping membership fetch (Demo Mode)`);
      return;
    }

    // Guard against stale demo user state during mode switch
    if (user.id === 'demo-user-123') {
       console.log(`[SupabaseAuth][${instanceId}] ⚡ Skipping membership fetch (Stale Demo User)`);
       return;
    }

    // Call the guarded fetch
    console.log(`[SupabaseAuth][${instanceId}] ⚡ Triggering membership fetch for user: ${user.id}`);
    fetchOrgMemberships(user.id);
  }, [authReady, user?.id, appMode]);

  const retryMembershipFetch = async () => {
    setMembershipError(null); // Clear previous error
    if (user) {
      console.log('[SupabaseAuth] Retrying membership fetch for user:', user.email);
      // Force retry by resetting the guard
      lastFetchedUserId.current = null;
      await fetchOrgMemberships(user.id);
    } else {
      console.warn('[SupabaseAuth] Cannot retry membership fetch - no user logged in');
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (appMode === 'demo') {
      return { success: false, error: 'Demo mode does not support sign-in. Switch to Live mode.' };
    }

    console.log('🔐 [SupabaseAuthContext] signIn() called - Checking for duplicate calls...');
    const callStack = new Error().stack;
    console.log('📍 [SupabaseAuthContext] Call stack:', callStack);

    try {
    //  setLoading(true); // Removed generic loading
      
      console.log('🔐 [SupabaseAuthContext] Calling supabase.auth.signInWithPassword...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [SupabaseAuthContext] signInWithPassword failed:', error.message);
    //    setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.session) {
        // Sign-in successful - onAuthStateChange will handle membership fetch and loading state
        console.log('✅ [SupabaseAuthContext] Sign-in successful, auth state change will trigger membership fetch...');
        
        // Give onAuthStateChange a moment to process (it will manage loading state)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true };
      }

      console.warn('⚠️ [SupabaseAuthContext] signInWithPassword returned no session');
    //  setLoading(false);
      return { success: false, error: 'Unknown error occurred' };
    } catch (err: any) {
      console.error('💥 [SupabaseAuthContext] Exception in signIn:', err);
    //  setLoading(false);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const signOut = async (): Promise<void> => {
    if (appMode === 'demo') {
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setOrgMemberships([]);
      setActiveOrgIdState(null);
      localStorage.removeItem('pythia_active_org_id');
      setMembershipsLoaded(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const signInWithOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    if (appMode === 'demo') {
      return { success: false, error: 'Demo mode does not support OTP sign-in. Switch to Live mode.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const setActiveOrgId = (orgId: string) => {
    setActiveOrgIdState(orgId);
    localStorage.setItem('pythia_active_org_id', orgId);
  };

  const activeOrg = activeOrgId ? orgMemberships.find(m => m.org_id === activeOrgId) || null : null;
  const activeRole = activeOrg?.role || null;

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        session,
        authReady,
        membershipsLoading,
        membershipsLoaded,
        signIn,
        signOut,
        signInWithOtp,
        orgMemberships,
        activeOrgId,
        activeOrg,
        setActiveOrgId,
        activeRole,
        connectionStatus,
        membershipError,
        retryMembershipFetch,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  return useContext(SupabaseAuthContext);
};