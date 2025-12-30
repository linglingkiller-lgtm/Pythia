import { useState } from 'react';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { createTask as apiCreateTask, ApiContext } from '../lib/api';

export function useTaskMutations() {
  const { appMode } = useAppMode();
  const { activeOrgId } = useSupabaseAuth();
  const [creating, setCreating] = useState(false);

  const createTask = async (payload: any) => {
    if (appMode === 'demo') {
      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true, data: { ...payload, id: `temp-${Date.now()}` } };
    }

    if (!activeOrgId) return { success: false, error: 'No active organization' };

    setCreating(true);
    try {
      const ctx: ApiContext = { appMode: 'prod', orgId: activeOrgId };
      
      // Transform payload to snake_case for Supabase
      const dbPayload = {
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        due_at: payload.dueDate ? new Date(payload.dueDate).toISOString() : null,
        assignee_user_id: payload.assigneeId,
        project_id: payload.projectId || null
      };

      const { data, error } = await apiCreateTask(ctx, dbPayload);
      
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.error('Failed to create task:', err);
      return { success: false, error: err.message };
    } finally {
      setCreating(false);
    }
  };

  return { createTask, creating };
}
