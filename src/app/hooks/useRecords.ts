import { useState, useEffect, useCallback } from 'react';
import { useAppMode } from '../contexts/AppModeContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useOrg } from '../contexts/OrgContext';
import { 
  mockRecords, 
  type Record, 
  type RecordFilters,
  type RecordType 
} from '../data/recordsData';
import { 
  listRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord, 
  uploadRecordAttachment, 
  listRecordAttachments,
  getAttachmentDownloadUrl
} from '../lib/api';
import { toast } from 'sonner';

// Mapper to convert DB snake_case to app camelCase
const mapDbRecordToAppRecord = (dbRecord: any): Record => {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    type: dbRecord.type as RecordType,
    status: dbRecord.status || 'draft',
    visibility: dbRecord.visibility,
    contentText: dbRecord.content_text || dbRecord.body,
    fileUrl: dbRecord.file_url,
    fileType: dbRecord.file_type,
    summary: dbRecord.summary,
    clientId: dbRecord.client_id,
    clientName: dbRecord.client_name, // Assumes joined or denormalized
    projectId: dbRecord.project_id,
    projectTitle: dbRecord.project_title,
    linkedBillIds: [], // dbRecord.linked_bill_ids || [],
    linkedBillNumbers: [], // dbRecord.linked_bill_numbers || [],
    linkedPersonIds: [], // dbRecord.linked_person_ids || [],
    linkedPersonNames: [], // dbRecord.linked_person_names || [],
    linkedIssueIds: [], // dbRecord.linked_issue_ids || [],
    linkedIssueNames: [], // dbRecord.linked_issue_names || [],
    linkedWatchlistIds: dbRecord.linked_watchlist_ids || [],
    tags: dbRecord.tags || [],
    department: dbRecord.department,
    version: dbRecord.version,
    parentRecordId: dbRecord.parent_record_id,
    createdBy: dbRecord.created_by, // UUID
    createdByName: dbRecord.created_by_name || 'Unknown User', // Needs join or separate fetch
    createdAt: dbRecord.created_at,
    lastModifiedAt: dbRecord.updated_at || dbRecord.created_at,
    lastModifiedBy: dbRecord.updated_by,
    isStarred: dbRecord.is_starred || false,
    isPinned: dbRecord.is_pinned || false,
    viewCount: dbRecord.view_count || 0,
    downloadCount: dbRecord.download_count || 0,
    activityLog: dbRecord.activity_log || [], // JSONB
    isAIGenerated: dbRecord.is_ai_generated || false,
    generatedFromTemplate: dbRecord.generated_from_template
  };
};

// Inverse Mapper for mutations
const mapAppRecordToDbPayload = (record: Partial<Record>) => {
  const payload: any = {};
  if (record.title !== undefined) payload.title = record.title;
  if (record.type !== undefined) payload.type = record.type;
  // Status removed as not in DB schema yet
  // if (record.status !== undefined) payload.status = record.status;
  if (record.visibility !== undefined) payload.visibility = record.visibility;
  if (record.contentText !== undefined) payload.body = record.contentText;
  if (record.summary !== undefined) payload.summary = record.summary;
  if (record.clientId !== undefined) payload.client_id = record.clientId;
  if (record.projectId !== undefined) payload.project_id = record.projectId;
  if (record.department !== undefined) payload.department = record.department;
  if (record.tags !== undefined) payload.tags = record.tags;
  if (record.isAIGenerated !== undefined) payload.is_ai_generated = record.isAIGenerated;
  // OccurredAt removed as not in DB schema yet
  // if (record.occurredAt) payload.occurred_at = record.occurredAt;
  
  return payload;
};

export function useRecords(filters?: RecordFilters) {
  const { appMode } = useAppMode();
  // Migration: Use SupabaseAuthContext as the single source of truth for org ID (UUID)
  const { activeOrgId } = useSupabaseAuth();
  
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the authoritative UUID
  const orgId = activeOrgId;

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (appMode === 'demo') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let results = [...mockRecords];
        // Basic filtering for demo
        if (filters?.types?.length) results = results.filter(r => filters.types?.includes(r.type));
        
        setRecords(results);
      } else {
        if (!orgId) {
          setRecords([]); // Wait for org
          return;
        }

        const { data, error } = await listRecords(
          { appMode: 'prod', orgId },
          filters
        );

        if (error) throw error;
        
        setRecords(data ? data.map(mapDbRecordToAppRecord) : []);
      }
    } catch (err: any) {
      console.error('Failed to fetch records:', err);
      setError(err.message || 'Failed to load records');
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [appMode, orgId, JSON.stringify(filters)]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return { records, loading, error, refresh: fetchRecords };
}

export function useRecordMutations() {
  const { appMode } = useAppMode();
  // Migration: Use SupabaseAuthContext as the single source of truth for org ID (UUID)
  const { activeOrgId, activeOrg } = useSupabaseAuth();
  // const { activeOrgId: legacyOrgId, activeOrgMeta } = useOrg(); // Deprecated
  const { user: supabaseUser } = useSupabaseAuth();
  
  // Strict: We MUST have the UUID from SupabaseAuthContext to perform writes. 
  const orgId = activeOrgId;

  const create = async (payload: Partial<Record>, file?: File) => {
    if (appMode === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newRecord: Record = {
        ...mockRecords[0],
        id: `rec-${Date.now()}`,
        title: payload.title || 'New Record',
        type: payload.type || 'note',
        createdAt: new Date().toISOString(),
        createdBy: 'user-current',
        createdByName: 'Current User',
        ...payload
      } as Record;
      return newRecord;
    }
    
    // --- INSTRUMENTATION START ---
    if (!orgId) {
      console.error('[useRecordMutations] Cannot create record: No activeOrgId from SupabaseAuthContext.');
      throw new Error('No active organization selected. Please reload or switch orgs.');
    }
    
    // Log for verification
    console.log('[useRecordMutations] Create Record using Org UUID:', orgId);
    console.log('[useRecordMutations] Active Org Name:', activeOrg?.org_name);
    // --- INSTRUMENTATION END ---

    // --- NORMALIZATION START ---
    // Ensure type satisfies DB constraint: ('meeting','brief','compliance','weekly_update')
    let finalType = payload.type;
    const typeStr = (payload.type || 'brief').toString().toLowerCase().trim();

    if (typeStr === 'weekly update' || typeStr === 'weekly-update' || typeStr === 'update') {
      finalType = 'weekly_update';
    } else if (['meeting', 'brief', 'compliance', 'weekly_update'].includes(typeStr)) {
      finalType = typeStr as RecordType;
    } else {
      // Fallback for unauthorized types (e.g. legacy 'note', 'budget')
      console.warn(`[Records] Type '${typeStr}' not allowed in prod. Mapping to 'brief'.`);
      finalType = 'brief';
    }

    console.log("[Records] Insert payload type:", finalType);
    
    const normalizedPayload = { ...payload, type: finalType };
    // --- NORMALIZATION END ---

    // 1. Create Record Entry
    const dbPayload = mapAppRecordToDbPayload(normalizedPayload);
    // Add display names that might be missing in relational DB but useful for UI immediate update
    // In a real app, triggers or joins handle this. For now we trust the client provided names if any.
    if (payload.clientName) dbPayload.client_name = payload.clientName;

    console.log("[Records] insert payload keys:", Object.keys(dbPayload));

    const { data: record, error: createError } = await createRecord(
      { appMode: 'prod', orgId },
      dbPayload
    );

    if (createError) throw createError;
    if (!record) throw new Error('Failed to create record');

    // 2. Upload File if present
    if (file) {
      const { error: uploadError } = await uploadRecordAttachment(
        { appMode: 'prod', orgId },
        record.id,
        file
      );

      if (uploadError) {
        toast.error('Record created but file upload failed');
        console.error('File upload error:', uploadError);
      } else {
        // Optimistically update the record if needed, or rely on refresh
        toast.success('File uploaded successfully');
      }
    }

    return mapDbRecordToAppRecord(record);
  };

  const update = async (id: string, payload: Partial<Record>) => {
    if (appMode === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...mockRecords.find(r => r.id === id), ...payload } as Record;
    }

    if (!orgId) throw new Error('No active organization');

    const dbPayload = mapAppRecordToDbPayload(payload);
    const { data, error } = await updateRecord(
      { appMode: 'prod', orgId },
      id,
      dbPayload
    );

    if (error) throw error;
    return mapDbRecordToAppRecord(data);
  };

  const remove = async (id: string) => {
    if (appMode === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simulate delete from mock store (session only)
      const index = mockRecords.findIndex(r => r.id === id);
      if (index > -1) {
        mockRecords.splice(index, 1);
        toast.success('Record deleted (Demo)');
      }
      return;
    }

    if (!orgId) throw new Error('No active organization');

    const { error } = await deleteRecord(
      { appMode: 'prod', orgId },
      id
    );

    if (error) throw error;
  };

  const getAttachments = async (recordId: string) => {
     if (appMode === 'demo') {
       return [];
     }
     
     if (!orgId) return [];

     const { data, error } = await listRecordAttachments(
       { appMode: 'prod', orgId },
       recordId
     );
     
     if (error) {
       console.error('Error fetching attachments:', error);
       return [];
     }
     return data || [];
  };

  const downloadAttachment = async (filePath: string) => {
    if (appMode === 'demo') {
      toast.info('Demo mode: Fake download started');
      return;
    }

    if (!orgId) return;

    const { data, error } = await getAttachmentDownloadUrl(
      { appMode: 'prod', orgId },
      filePath
    );

    if (error || !data?.signedUrl) {
      toast.error('Failed to generate download URL');
      return;
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = data.signedUrl;
    link.target = '_blank';
    link.download = filePath.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { create, update, remove, getAttachments, downloadAttachment };
}
