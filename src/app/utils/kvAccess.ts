/**
 * KV Access Module with Role-Based Permissions
 * 
 * SECURITY LIMITATION:
 * This implements application-layer permissions only. Since the KV store is accessible
 * from the frontend, this is NOT a final security model. Acceptable for demo/alpha,
 * but production would require server-side enforcement and proper database ACLs.
 */

import { api } from '../../utils/api';

// ============================================
// TYPES
// ============================================

export type Role = 'owner' | 'admin' | 'manager' | 'staff' | 'client_viewer';
export type MemberStatus = 'active' | 'invited' | 'disabled';

export type Action =
  | 'ORG_VIEW'
  | 'ORG_EDIT'
  | 'ORG_INVITE_CREATE'
  | 'ORG_MEMBER_EDIT_ROLE'
  | 'ORG_MEMBER_REMOVE'
  | 'TASK_CREATE'
  | 'TASK_EDIT'
  | 'TASK_DELETE'
  | 'RECORD_CREATE'
  | 'RECORD_EDIT'
  | 'RECORD_DELETE'
  | 'READ_ONLY_MODE';

export interface AuditLogEntry {
  ts: string;
  actorUserId: string;
  actorEmail: string;
  action: string;
  entity: 'task' | 'record' | 'org' | 'member' | 'invite';
  entityId?: string;
  summary: string;
  meta?: Record<string, any>;
}

// ============================================
// PERMISSION MATRIX
// ============================================

const PERMISSIONS: Record<Role, Action[]> = {
  owner: [
    'ORG_VIEW',
    'ORG_EDIT',
    'ORG_INVITE_CREATE',
    'ORG_MEMBER_EDIT_ROLE',
    'ORG_MEMBER_REMOVE',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_DELETE',
    'RECORD_CREATE',
    'RECORD_EDIT',
    'RECORD_DELETE',
  ],
  admin: [
    'ORG_VIEW',
    'ORG_EDIT',
    'ORG_INVITE_CREATE',
    'ORG_MEMBER_EDIT_ROLE',
    'ORG_MEMBER_REMOVE',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_DELETE',
    'RECORD_CREATE',
    'RECORD_EDIT',
    'RECORD_DELETE',
  ],
  manager: [
    'ORG_VIEW',
    'ORG_INVITE_CREATE',
    'TASK_CREATE',
    'TASK_EDIT',
    'TASK_DELETE',
    'RECORD_CREATE',
    'RECORD_EDIT',
    'RECORD_DELETE',
  ],
  staff: [
    'ORG_VIEW',
    'TASK_CREATE',
    'TASK_EDIT',
    'RECORD_CREATE',
    'RECORD_EDIT',
  ],
  client_viewer: [
    'ORG_VIEW',
    'READ_ONLY_MODE',
  ],
};

/**
 * Check if a role has permission for an action
 */
export function can(role: Role | null | undefined, action: Action): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(action) || false;
}

/**
 * Assert permission (throws error if not permitted)
 */
export function requirePermission(role: Role | null | undefined, action: Action): void {
  if (!can(role, action)) {
    throw new Error(`Permission denied: ${action} requires higher privileges`);
  }
}

// ============================================
// SESSION HELPERS
// ============================================

export interface SessionInfo {
  userId: string;
  email: string;
}

/**
 * Get current user session from auth context
 * This should be called from components that have access to useAuth
 */
export function getSessionFromAuth(currentUser: any): SessionInfo {
  if (!currentUser) {
    throw new Error('Not authenticated');
  }
  return {
    userId: currentUser.id,
    email: currentUser.email,
  };
}

/**
 * Get active organization ID from org context
 */
export function getActiveOrgFromContext(activeOrgId: string | null): string {
  if (!activeOrgId) {
    throw new Error('No active organization');
  }
  return activeOrgId;
}

// ============================================
// VERSIONING HELPERS
// ============================================

export interface Versioned {
  version: number;
  updatedAt: string;
}

export function initVersion(): Versioned {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

export function incrementVersion(obj: Versioned): Versioned {
  return {
    version: (obj.version || 0) + 1,
    updatedAt: new Date().toISOString(),
  };
}

// ============================================
// AUDIT LOG HELPERS
// ============================================

/**
 * Write an audit log entry
 * Stores in monthly buckets: org:{orgId}:audit:{YYYY-MM}
 */
export async function auditLogWrite(
  orgId: string,
  actorUserId: string,
  actorEmail: string,
  action: string,
  entity: AuditLogEntry['entity'],
  summary: string,
  entityId?: string,
  meta?: Record<string, any>
): Promise<void> {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const entry: AuditLogEntry = {
    ts: now.toISOString(),
    actorUserId,
    actorEmail,
    action,
    entity,
    entityId,
    summary,
    meta,
  };

  try {
    await api.auditLogAppend(orgId, monthKey, entry);
  } catch (error) {
    console.error('Failed to write audit log:', error);
    // Don't block the main operation if audit fails
  }
}

// ============================================
// ID GENERATORS
// ============================================

export function generateId(prefix: string): string {
  const randomStr = Math.random().toString(36).substring(2, 12);
  const timestamp = Date.now().toString(36);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// ============================================
// UTILITY EXPORTS
// ============================================

export const kvUtils = {
  can,
  requirePermission,
  getSessionFromAuth,
  getActiveOrgFromContext,
  initVersion,
  incrementVersion,
  auditLogWrite,
  generateId,
  generateToken,
};
