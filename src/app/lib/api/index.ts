import { getSupabaseClient } from '../../../utils/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { v5 as uuidv5 } from 'uuid';

// Namespace for hashing org IDs to UUIDs to satisfy DB constraints
const ORG_ID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

// Helper to get a stable UUID for an Org ID string
function getStableOrgUuid(orgId: string): string {
  // If it's already a valid UUID, return it
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orgId)) {
    return orgId;
  }
  // Otherwise hash it
  return uuidv5(orgId, ORG_ID_NAMESPACE);
}

// Types
export interface ApiContext {
  appMode: 'prod' | 'demo';
  orgId: string | null;
}

export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | { message: string } | null;
}

const RECORDS_COLUMNS = 'id, org_id, title, body, type, tags, created_at, updated_at';

const supabase = getSupabaseClient();

const validateContext = (ctx: ApiContext) => {
  if (ctx.appMode !== 'prod') {
    return { valid: false, error: { message: 'Operation only allowed in production mode' } };
  }
  if (!ctx.orgId) {
    return { valid: false, error: { message: 'Organization ID is required' } };
  }
  return { valid: true, error: null };
};

// --- Clients ---

export async function listClients(ctx: ApiContext): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('clients')
    .select('*')
    .eq('org_id', ctx.orgId)
    .order('name');
}

export async function listClientsOverview(ctx: ApiContext, filters?: any): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  let query = supabase
    .from('client_overview_v')
    .select('*')
    .eq('org_id', ctx.orgId);

  // If created_at is available in the view, sort by it (descending). Otherwise by name.
  // We'll assume created_at might be there from the underlying table, but if the view doesn't expose it,
  // we default to name. The prompt asks to "Sort by created_at if available; otherwise sort by name".
  // Since we don't know for sure if the view has it without checking, we will try to order by name for safety
  // OR we can try to order by created_at and fallback. But Supabase client throws if column doesn't exist.
  // Let's stick to name for now unless we are sure, OR we can check the prompt again.
  // Prompt: "Sort by created_at if available; otherwise sort by name"
  // I will assume created_at is NOT in the list of fields provided in the prompt:
  // "client_id, org_id, name, industry, client_type, health_status, monthly_retainer, revenue_ytd, contract_start, contract_end, contract_runway_days, tasks_count, bills_count, issues_count, opps_count, team_user_ids."
  // So I will sort by name.
  query = query.order('name');

  return await query;
}

export async function createClient(ctx: ApiContext, payload: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('clients')
    .insert({
      ...payload,
      org_id: ctx.orgId,
    })
    .select()
    .single();
}

export async function getClient(ctx: ApiContext, clientId: string): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .eq('org_id', ctx.orgId)
    .single();
}

// --- Projects ---

export async function listProjects(ctx: ApiContext): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('projects')
    .select('*')
    .eq('org_id', ctx.orgId)
    .order('created_at', { ascending: false });
}

export async function createProject(ctx: ApiContext, payload: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('projects')
    .insert({
      ...payload,
      org_id: ctx.orgId,
    })
    .select()
    .single();
}

/**
 * Attempts to bootstrap an organization with default data using RPC,
 * or falls back to client-side insertion if RPC fails or is unavailable.
 */
export async function ensureOrgBootstrap(ctx: ApiContext): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // 1. Try RPC first
  const { data, error } = await supabase.rpc('ensure_org_bootstrap', { p_org_id: ctx.orgId });
  
  // If successful or if error is NOT "function not found", return result
  // (We assume if it fails with something else, we might not want to double-write, but strictly speaking
  // fallback is safest for "function not found" or general failure if we want to ensure existence)
  if (!error) return { data, error: null };
  
  // 2. Fallback: Client-side bootstrap (Inbox Project)
  console.warn('RPC ensure_org_bootstrap failed, attempting client-side fallback:', error);

  try {
    // Check if Inbox exists
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('org_id', ctx.orgId)
      .eq('title', 'Inbox')
      .maybeSingle();

    if (existing) return { data: existing, error: null };

    // Create Inbox
    return await createProject(ctx, {
      title: 'Inbox',
      status: 'active',
      description: 'Default project for incoming tasks'
    });
  } catch (err: any) {
    return { data: null, error: { message: err.message } };
  }
}

// --- Tasks ---

interface TaskFilters {
  assigneeId?: string;
  status?: string;
}

export async function listTasks(ctx: ApiContext, filters?: TaskFilters): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  let query = supabase
    .from('tasks')
    .select('*')
    .eq('org_id', ctx.orgId);

  if (filters?.assigneeId) {
    query = query.eq('assignee_user_id', filters.assigneeId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  return await query.order('due_at', { ascending: true, nullsFirst: false });
}

export async function createTask(ctx: ApiContext, payload: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('tasks')
    .insert({
      ...payload,
      org_id: ctx.orgId,
    })
    .select()
    .single();
}

export async function updateTask(ctx: ApiContext, taskId: string, patch: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('tasks')
    .update(patch)
    .eq('id', taskId)
    .eq('org_id', ctx.orgId) // Security: Ensure task belongs to org
    .select()
    .single();
}

// --- Comments ---

export async function listTaskComments(ctx: ApiContext, taskId: string): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('task_comments')
    .select('*')
    .eq('task_id', taskId)
    .eq('org_id', ctx.orgId)
    .order('created_at', { ascending: true });
}

export async function createTaskComment(ctx: ApiContext, taskId: string, body: string): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  return await supabase
    .from('task_comments')
    .insert({
      task_id: taskId,
      org_id: ctx.orgId,
      body: body,
      // user_id is typically handled by RLS defaults using auth.uid(), 
      // but if schema requires it explicitly we might need to pass it in payload.
      // For now assume Supabase auth context handles it or RLS.
    })
    .select()
    .single();
}

// --- Records ---

export async function listRecords(ctx: ApiContext, filters?: any): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // Use stable UUID for org_id to satisfy DB UUID constraint
  const orgUuid = getStableOrgUuid(ctx.orgId!);

  let query = supabase
    .from('records')
    .select(RECORDS_COLUMNS)
    .eq('org_id', orgUuid);

  // Apply filters if mapped to DB columns
  if (filters?.clientId) query = query.eq('client_id', filters.clientId);
  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.department) query = query.eq('department', filters.department);
  if (filters?.isStarred) query = query.eq('is_starred', true);

  return await query.order('created_at', { ascending: false });
}

export async function createRecord(ctx: ApiContext, payload: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // Explicitly verify session exists before attempting write
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    console.error('[Records] Create failed: No active session');
    return { data: null, error: { message: 'Authentication required' } as any };
  }

  // Strict: Expect valid UUID from context. Do not map/hash.
  const orgUuid = ctx.orgId!;

  // --- GUARD: Membership Check ---
  // Verify user has active membership in target org before attempting insert
  const user = session.user;
  
  console.log('--- [Records Create Guard] ---');
  console.log('ActiveOrg ID (ctx):', ctx.orgId);
  console.log('Computed UUID:', orgUuid);
  console.log('User ID:', user.id);

  // Check org_memberships table (correct table name)
  const { data: membership, error: memberCheckError } = await supabase
    .from('org_memberships')
    .select('org_id, role, is_active')
    .eq('org_id', orgUuid)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  console.log('Membership check result:', membership);
  
  if (memberCheckError) {
      console.error('Membership check failed DB error:', memberCheckError);
      // We don't block on DB error to avoid blocking on transient failures, but likely RLS will fail anyway.
  }

  if (!membership) {
      console.error('Blocking insert: User is not an active member of target org.');
      return { 
          data: null, 
          error: { message: "You're not a member of the selected organization. Please switch orgs." } as any 
      };
  }
  console.log('------------------------------');
  // --- GUARD END ---

  // Verify orgUuid is a valid UUID
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orgUuid)) {
    console.error('[Records] Create failed: Invalid Org UUID', orgUuid);
    return { data: null, error: { message: 'Invalid Organization ID format' } as any };
  }

  // Explicit insert payload - strict contract
  const insertPayload = {
    org_id: orgUuid,
    title: payload.title,
    body: payload.body ?? null,
    type: payload.type ?? 'brief',
    tags: payload.tags ?? null
  };

  console.log('[Records] Attempting insert. OrgID:', orgUuid, 'Keys:', Object.keys(insertPayload));

  return await supabase
    .from('records')
    .insert(insertPayload)
    .select(RECORDS_COLUMNS)
    .single();
}

export async function updateRecord(ctx: ApiContext, recordId: string, patch: any): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  const orgUuid = getStableOrgUuid(ctx.orgId!);

  return await supabase
    .from('records')
    .update(patch)
    .eq('id', recordId)
    .eq('org_id', orgUuid)
    .select()
    .single();
}

export async function deleteRecord(ctx: ApiContext, recordId: string): Promise<ApiResponse<void>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // Strict: Expect valid UUID from context.
  const orgUuid = ctx.orgId!;
  
  console.log(`[Records] Deleting record ${recordId}...`);

  // --- GUARD: Membership Check ---
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { data: null, error: { message: 'Authentication required' } as any };
  }
  
  const user = session.user;
  const { data: membership } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('org_id', orgUuid)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (!membership) {
    console.error('[Delete] Blocked: User not member of org', orgUuid);
    return { data: null, error: { message: "You're not a member of the selected organization." } as any };
  }
  // --- GUARD END ---

  try {
    // 1. Fetch attachments to identify storage objects
    const { data: attachments, error: fetchError } = await supabase
      .from('record_attachments')
      .select('storage_bucket, storage_path')
      .eq('record_id', recordId)
      .eq('org_id', orgUuid);

    if (fetchError) throw fetchError;

    // 2. Delete from Storage
    if (attachments && attachments.length > 0) {
      console.log(`[Records] Removing ${attachments.length} storage objects...`);
      const pathsToDelete = attachments.map(a => a.storage_path);
      // Assuming all are in the same bucket 'record_attachments'
      const { error: storageError } = await supabase.storage
        .from('record_attachments')
        .remove(pathsToDelete);

      if (storageError) {
        console.error('Storage deletion failed:', storageError);
        // Decision: Stop and report error to prevent orphan DB rows vs missing files
        throw new Error(`Failed to delete associated files: ${storageError.message}`);
      }
    }

    // 3. Delete attachment rows
    // (If cascade is set up, this might be redundant but safe to do explicit delete or let cascade handle it. 
    // Requirement says "Delete attachment rows: delete from record_attachments...")
    const { error: attachDelError } = await supabase
      .from('record_attachments')
      .delete()
      .eq('record_id', recordId)
      .eq('org_id', orgUuid);
    
    if (attachDelError) throw attachDelError;

    // 4. Delete the record
    console.log('[Records] Deleting record row...');
    const { error: recordDelError } = await supabase
      .from('records')
      .delete()
      .eq('id', recordId)
      .eq('org_id', orgUuid); // Security: Ensure ownership

    if (recordDelError) throw recordDelError;

    return { data: null, error: null };
  } catch (err: any) {
    console.error('[Records] Delete operation failed:', err);
    return { data: null, error: { message: err.message || 'Delete operation failed' } };
  }
}

// --- Attachments (Storage + DB) ---

export async function uploadRecordAttachment(ctx: ApiContext, recordId: string, file: File): Promise<ApiResponse<any>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // Explicitly verify session exists
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { data: null, error: { message: 'Authentication required' } as any };
  }

  const user = session.user;
  const orgUuid = ctx.orgId!; // Strict UUID

  // --- GUARD: Membership Check ---
  // Ensure user is allowed to upload to this org
  const { data: membership, error: memberCheckError } = await supabase
    .from('org_memberships')
    .select('org_id')
    .eq('org_id', orgUuid)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle();

  if (!membership) {
    console.error('[Upload] Blocked: User not member of org', orgUuid);
    return { 
        data: null, 
        error: { message: "You're not a member of the selected organization." } as any 
    };
  }
  // --- GUARD END ---

  try {
    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${recordId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${orgUuid}/${fileName}`; // Scope by Org UUID

    console.log('[Upload] Uploading to storage:', filePath);

    const { error: uploadError } = await supabase.storage
      .from('record_attachments')
      .upload(filePath, file);

    if (uploadError) {
      console.error('[Upload] Storage upload failed:', uploadError);
      throw uploadError;
    }

    // 2. Create DB Entry
    console.log('[Upload] Creating DB entry for attachment...');

    const { data: attachment, error: dbError } = await supabase
      .from('record_attachments')
      .insert({
        org_id: orgUuid,
        record_id: recordId,
        storage_bucket: 'record_attachments',
        storage_path: filePath,
        filename: file.name,
        size_bytes: file.size,
        mime_type: file.type,
      })
      .select()
      .single();

    if (dbError) {
      console.error('[Upload] DB insert failed:', dbError);
      throw dbError;
    }

    // Map response to match frontend expectations
    const mappedAttachment = {
      ...attachment,
      file_name: attachment.filename,
      file_size: attachment.size_bytes,
      file_type: attachment.mime_type,
      file_path: attachment.storage_path
    };

    return { data: mappedAttachment, error: null };
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Upload failed' } };
  }
}

export async function listRecordAttachments(ctx: ApiContext, recordId: string): Promise<ApiResponse<any[]>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  const orgUuid = ctx.orgId!; // Strict UUID

  const { data, error } = await supabase
    .from('record_attachments')
    .select('*')
    .eq('record_id', recordId)
    .eq('org_id', orgUuid)
    .order('created_at', { ascending: false });

  if (error) return { data: null, error };

  // Map DB columns (snake_case new schema) to App expected keys (legacy)
  const mappedData = data?.map(item => ({
    ...item,
    file_name: item.filename || item.file_name,
    file_size: item.size_bytes || item.file_size,
    file_type: item.mime_type || item.file_type,
    file_path: item.storage_path || item.file_path,
  })) || [];

  return { data: mappedData, error: null };
}

export async function getAttachmentDownloadUrl(ctx: ApiContext, filePath: string): Promise<ApiResponse<{ signedUrl: string }>> {
  const check = validateContext(ctx);
  if (!check.valid) return { data: null, error: check.error };

  // No DB check here, just storage signing. Storage will validate token signature if needed, 
  // but usually createSignedUrl is a server-side op that succeeds if the caller (service role or authenticated user) has permission.
  // Actually, createSignedUrl checks RLS permissions for the user.
  
  const { data, error } = await supabase.storage
    .from('record_attachments')
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  return { data: data as any, error };
}
