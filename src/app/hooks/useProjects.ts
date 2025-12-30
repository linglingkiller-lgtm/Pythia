import { useState, useEffect } from 'react';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { listProjects, ApiContext } from '../lib/api';
import { mockProjects } from '../data/workHubData';

export function useProjects() {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    if (appMode === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProjects(mockProjects);
      setLoading(false);
      return;
    }

    if (!activeOrgId) {
      setLoading(false);
      return;
    }

    try {
      const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
      const { data, error } = await listProjects(ctx);
      if (error) throw error;
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [appMode, activeOrgId]);

  return { projects, loading, error, refetch: fetchProjects };
}
