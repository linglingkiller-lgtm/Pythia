import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Singleton Supabase client instance
let supabaseInstance: SupabaseClient | null = null;

/**
 * Get or create a singleton Supabase client instance.
 * This prevents the "Multiple GoTrueClient instances" warning.
 * 
 * CRITICAL: This is the ONLY Supabase client instance for the entire frontend.
 * All queries must use this singleton.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'pythia-supabase-auth', // Stable storage key for consistent session recovery
        },
      }
    );
  }
  return supabaseInstance;
}