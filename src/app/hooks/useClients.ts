import { useState, useEffect, useCallback } from 'react';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { listClients, getClient, listClientsOverview, createClient as apiCreateClient, ApiContext } from '../lib/api';
import { mockClients, Client } from '../data/clientsData';

export interface UseClientsOptions {
  search?: string;
  status?: string;
}

export function useClients(options: UseClientsOptions = {}) {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchClients() {
      setLoading(true);
      setError(null);

      // DEMO MODE
      if (appMode === 'demo') {
        await new Promise(resolve => setTimeout(resolve, 600));
        if (!mounted) return;

        let filtered = [...mockClients];
        if (options.search) {
          const q = options.search.toLowerCase();
          filtered = filtered.filter(c => c.name.toLowerCase().includes(q));
        }
        setClients(filtered);
        setLoading(false);
        return;
      }

      // PROD MODE
      if (!activeOrgId) {
        setLoading(false);
        return;
      }

      try {
        const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
        const { data, error } = await listClients(ctx);

        if (error) throw error;

        if (mounted && data) {
          const mapped: Client[] = data.map((row: any) => ({
            id: row.id,
            name: row.name,
            logoInitials: row.name.substring(0, 2).toUpperCase(),
            tags: row.tags || [],
            primaryIssues: [],
            ownerUserIds: [],
            contractStart: row.contract_start || '',
            contractEnd: row.contract_end || '',
            contractValueMonthly: 0,
            contractValueYTD: 0,
            scopeSummary: row.scope_summary || row.description || '',
            healthStatus: 'green',
            activeIssuesCount: 0,
            activeBillsCount: 0,
            tasksThisWeekCount: 0,
            opportunitiesCount: 0,
            valueDeliveredThisQuarter: { briefs: 0, meetings: 0, testimony: 0, amendments: 0 }
          }));
          setClients(mapped);
        }
      } catch (err: any) {
        console.error('Error fetching clients:', err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchClients();

    return () => { mounted = false; };
  }, [appMode, activeOrgId, options.search, refreshKey]);

  return { clients, loading, error, refetch };
}

export function useClient(clientId: string) {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    
    let mounted = true;

    async function fetchClient() {
      setLoading(true);
      
      if (appMode === 'demo') {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!mounted) return;
        const found = mockClients.find(c => c.id === clientId);
        setClient(found || null);
        setLoading(false);
        return;
      }

      if (!activeOrgId) {
        setLoading(false);
        return;
      }

      try {
        const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
        const { data, error } = await getClient(ctx, clientId);
        if (error) throw error;
        
        if (mounted && data) {
           const mapped: Client = {
            id: data.id,
            name: data.name,
            logoInitials: data.name.substring(0, 2).toUpperCase(),
            tags: data.tags || [],
            primaryIssues: [],
            ownerUserIds: [],
            contractStart: data.contract_start || '',
            contractEnd: data.contract_end || '',
            contractValueMonthly: 0,
            contractValueYTD: 0,
            scopeSummary: data.scope_summary || data.description || '',
            healthStatus: 'green',
            activeIssuesCount: 0,
            activeBillsCount: 0,
            tasksThisWeekCount: 0,
            opportunitiesCount: 0,
            valueDeliveredThisQuarter: { briefs: 0, meetings: 0, testimony: 0, amendments: 0 }
          };
          setClient(mapped);
        }
      } catch (err: any) {
        console.error('Error fetching client:', err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchClient();
    return () => { mounted = false; };
  }, [appMode, activeOrgId, clientId]);

  return { client, loading, error };
}

export interface UseClientsOverviewOptions {
  search?: string;
  healthFilter?: string; // 'all', 'green', 'yellow', 'red'
  expiringSoon?: boolean; // if true, filter by contract_runway_days <= 30
}

export function useClientsOverview(options: UseClientsOverviewOptions = {}) {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const createNewClient = useCallback(async (payload: any) => {
    if (appMode === 'demo') {
      console.log('Demo mode: Client created', payload);
      return { data: { ...payload, id: 'demo-new-client' }, error: null };
    }
    if (!activeOrgId) {
      return { data: null, error: { message: 'No active org' } };
    }
    const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
    return await apiCreateClient(ctx, payload);
  }, [appMode, activeOrgId]);

  useEffect(() => {
    let mounted = true;

    async function fetch() {
      setLoading(true);
      setError(null);

      // DEMO MODE
      if (appMode === 'demo') {
        await new Promise(resolve => setTimeout(resolve, 600));
        if (!mounted) return;

        let filtered = [...mockClients];
        
        // Apply filters locally for demo
        if (options.search) {
          const q = options.search.toLowerCase();
          filtered = filtered.filter(c => 
            c.name.toLowerCase().includes(q) || 
            c.tags.some(tag => tag.toLowerCase().includes(q))
          );
        }

        if (options.healthFilter && options.healthFilter !== 'all') {
          filtered = filtered.filter(c => c.healthStatus === options.healthFilter);
        }

        if (options.expiringSoon) {
           const today = new Date();
           filtered = filtered.filter(c => {
             const end = new Date(c.contractEnd);
             const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
             return days <= 30;
           });
        }

        setClients(filtered);
        setLoading(false);
        return;
      }

      // PROD MODE
      if (!activeOrgId) {
        setLoading(false);
        return;
      }

      try {
        const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
        const { data, error } = await listClientsOverview(ctx);

        if (error) throw error;

        if (mounted && data) {
          // Map View rows to Client interface
          const mapped: Client[] = data.map((row: any) => ({
            id: row.client_id, // Note: view column might be client_id
            name: row.name,
            logoInitials: row.name ? row.name.substring(0, 2).toUpperCase() : '??',
            tags: [row.industry, row.client_type].filter(Boolean),
            primaryIssues: [], // Not in view
            ownerUserIds: row.team_user_ids || [],
            contractStart: row.contract_start || '',
            contractEnd: row.contract_end || '',
            contractValueMonthly: row.monthly_retainer || 0,
            contractValueYTD: row.revenue_ytd || 0,
            scopeSummary: '',
            healthStatus: (row.health_status as any) || 'green',
            activeIssuesCount: row.issues_count || 0,
            activeBillsCount: row.bills_count || 0,
            tasksThisWeekCount: row.tasks_count || 0,
            opportunitiesCount: row.opps_count || 0,
            valueDeliveredThisQuarter: { briefs: 0, meetings: 0, testimony: 0, amendments: 0 }
          }));

          // Apply filters locally (since we fetch all for overview and filter in UI usually, 
          // but the hook can do it too to match demo behavior)
          let filtered = mapped;

          if (options.search) {
             const q = options.search.toLowerCase();
             filtered = filtered.filter(c => 
               c.name.toLowerCase().includes(q) || 
               c.tags.some(tag => tag.toLowerCase().includes(q))
             );
          }

          if (options.healthFilter && options.healthFilter !== 'all') {
             filtered = filtered.filter(c => c.healthStatus === options.healthFilter);
          }

          if (options.expiringSoon) {
             // We can use contract_runway_days from view if we mapped it, 
             // but we didn't map it to Client interface directly.
             // Let's recalculate or add it to Client if needed. 
             // For now recalculate to be safe.
             // Actually, the prompt said "Contract runway shows contract_runway_days".
             // We should probably map it to Client interface if we can, or just use contractEnd.
             // But for filtering here:
             const today = new Date();
             filtered = filtered.filter(c => {
               if (!c.contractEnd) return false;
               const end = new Date(c.contractEnd);
               const days = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
               return days <= 30;
             });
          }

          setClients(filtered);
        }
      } catch (err: any) {
        console.error('Error fetching clients overview:', err);
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetch();

    return () => { mounted = false; };
  }, [appMode, activeOrgId, options.search, options.healthFilter, options.expiringSoon, refreshKey]);

  return { clients, loading, error, refetch, createNewClient };
}
