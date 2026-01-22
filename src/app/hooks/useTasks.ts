import { useState, useEffect, useCallback, useRef } from 'react';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { listTasks, ApiContext } from '../lib/api';
import { mockTasks, Task } from '../data/workHubData';

export interface UseTasksOptions {
  scope?: 'my' | 'team';
  status?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { appMode } = useAppMode();
  const { activeOrgId, user, authReady } = useSupabaseAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Ref to track if a fetch is in progress to prevent double-firing
  const isFetching = useRef(false);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadTasks() {
      // 1. DEMO MODE
      if (appMode === 'demo') {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        if (!mounted) return;

        let filtered = [...mockTasks];
        
        // Merge with localStorage tasks (Demo Hack)
        try {
            const localTasks = JSON.parse(localStorage.getItem('demo_new_tasks') || '[]');
            if (localTasks.length > 0) {
                const existingIds = new Set(filtered.map(t => t.id));
                const newTasks = localTasks.filter((t: any) => !existingIds.has(t.id));
                filtered = [...filtered, ...newTasks];
            }
        } catch (e) {
            console.error('Failed to load demo tasks', e);
        }
        
        // Apply scope filter
        if (options.scope === 'my') {
          // In demo, current user is 'user-001'
          filtered = filtered.filter(t => t.assigneeId === 'user-001');
        }

        // Apply status filter
        if (options.status) {
          filtered = filtered.filter(t => t.status === options.status);
        }

        setTasks(filtered);
        setLoading(false);
        return;
      }

      // 2. PROD MODE
      if (appMode === 'prod') {
        if (!authReady || !activeOrgId) {
            // Still initializing auth, keep loading or do nothing
            return; 
        }

        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        setError(null);

        try {
          const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
          const filters: any = {};
          
          if (options.scope === 'my' && user?.id) {
            filters.assigneeId = user.id;
          }
          if (options.status) {
            filters.status = options.status;
          }

          const { data, error: apiError } = await listTasks(ctx, filters);

          if (apiError) {
             throw new Error('message' in apiError ? apiError.message : 'Failed to fetch tasks');
          }

          if (mounted && data) {
            // Map Supabase rows to Task interface
            const mappedTasks: Task[] = data.map(row => ({
              id: row.id,
              title: row.title,
              description: row.description,
              status: row.status,
              priority: row.priority,
              dueDate: row.due_at ? row.due_at.split('T')[0] : undefined,
              assigneeId: row.assignee_user_id,
              // Simple assignee name fallback
              assigneeName: row.assignee_user_id === user?.id ? 'Me' : 'Unknown',
              projectId: row.project_id,
              
              // Defaults/Placeholders for now
              linkedBillIds: [],
              linkedBillNumbers: [],
              linkedPersonIds: [],
              linkedPersonNames: [],
              linkedIssueIds: [],
              linkedIssueNames: [],
              createdAt: row.created_at,
              updatedAt: row.updated_at
            }));
            setTasks(mappedTasks);
          }
        } catch (err: any) {
          if (mounted) {
            console.error('Error loading tasks:', err);
            setError(err.message);
          }
        } finally {
          if (mounted) {
            setLoading(false);
            isFetching.current = false;
          }
        }
      }
    }

    loadTasks();

    return () => {
      mounted = false;
    };
  }, [appMode, activeOrgId, user?.id, authReady, options.scope, options.status, refreshKey]);

  return { tasks, loading, error, refetch };
}
