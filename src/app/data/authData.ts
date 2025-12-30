// Mock data for authentication and user management system

export interface Organization {
  id: string;
  name: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  orgId: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Only for demo purposes
  status: 'invited' | 'active' | 'disabled';
  roleId: string;
  createdAt: string;
  lastLoginAt: string | null;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  orgId: string;
  name: string;
}

export interface UserTeam {
  userId: string;
  teamId: string;
}

export interface ClientAccess {
  userId: string;
  clientId: string;
  level: 'none' | 'read' | 'write' | 'admin';
}

export interface Invite {
  id: string;
  orgId: string;
  email: string;
  roleId: string;
  token: string;
  expiresAt: string;
  createdByUserId: string;
  acceptedAt: string | null;
}

export interface AuditLog {
  id: string;
  orgId: string;
  actorUserId: string;
  actionKey: string;
  targetType: string;
  targetId: string;
  metadata: any;
  createdAt: string;
}

export interface UserFieldPermissions {
  userId: string;
  canViewBackgroundCheck: boolean;
  canViewPricingProfit: boolean;
  canViewInternalRecords: boolean;
  canExportComplianceLogs: boolean;
}

// Mock organization
export const mockOrganization: Organization = {
  id: 'org-1',
  name: 'Echo Canyon Consulting',
  createdAt: '2024-01-01T00:00:00Z'
};

// Permissions list
export const PERMISSIONS = {
  // Module access
  LOBBYING_VIEW: 'lobbying_view',
  LOBBYING_EDIT: 'lobbying_edit',
  PUBLIC_AFFAIRS_VIEW: 'public_affairs_view',
  PUBLIC_AFFAIRS_EDIT: 'public_affairs_edit',
  CANVASSING_VIEW: 'canvassing_view',
  CANVASSING_EDIT: 'canvassing_edit',
  
  // Admin
  USERS_MANAGE: 'users_manage',
  USERS_VIEW: 'users_view',
  
  // Sensitive data
  BUDGET_VIEW_PROFIT: 'budget_view_profit',
  APPLICANTS_VIEW_BACKGROUND_CHECK: 'applicants_view_background_check',
  RECORDS_VIEW_INTERNAL: 'records_view_internal',
  COMPLIANCE_EXPORT: 'compliance_export',
  
  // Client management
  CLIENTS_VIEW_ALL: 'clients_view_all',
  CLIENTS_MANAGE: 'clients_manage',
};

// Roles
export const mockRoles: Role[] = [
  {
    id: 'role-superadmin',
    name: 'Super Admin',
    permissions: Object.values(PERMISSIONS)
  },
  {
    id: 'role-admin',
    name: 'Admin',
    permissions: [
      PERMISSIONS.LOBBYING_VIEW,
      PERMISSIONS.LOBBYING_EDIT,
      PERMISSIONS.PUBLIC_AFFAIRS_VIEW,
      PERMISSIONS.PUBLIC_AFFAIRS_EDIT,
      PERMISSIONS.CANVASSING_VIEW,
      PERMISSIONS.CANVASSING_EDIT,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.BUDGET_VIEW_PROFIT,
      PERMISSIONS.APPLICANTS_VIEW_BACKGROUND_CHECK,
      PERMISSIONS.RECORDS_VIEW_INTERNAL,
      PERMISSIONS.COMPLIANCE_EXPORT,
      PERMISSIONS.CLIENTS_VIEW_ALL,
      PERMISSIONS.CLIENTS_MANAGE,
    ]
  },
  {
    id: 'role-lobbying-lead',
    name: 'Lobbying Lead',
    permissions: [
      PERMISSIONS.LOBBYING_VIEW,
      PERMISSIONS.LOBBYING_EDIT,
      PERMISSIONS.BUDGET_VIEW_PROFIT,
      PERMISSIONS.RECORDS_VIEW_INTERNAL,
      PERMISSIONS.CLIENTS_VIEW_ALL,
    ]
  },
  {
    id: 'role-lobbying-analyst',
    name: 'Lobbying Analyst',
    permissions: [
      PERMISSIONS.LOBBYING_VIEW,
      PERMISSIONS.LOBBYING_EDIT,
    ]
  },
  {
    id: 'role-pa-lead',
    name: 'Public Affairs Lead',
    permissions: [
      PERMISSIONS.PUBLIC_AFFAIRS_VIEW,
      PERMISSIONS.PUBLIC_AFFAIRS_EDIT,
      PERMISSIONS.BUDGET_VIEW_PROFIT,
      PERMISSIONS.RECORDS_VIEW_INTERNAL,
      PERMISSIONS.CLIENTS_VIEW_ALL,
    ]
  },
  {
    id: 'role-pa-analyst',
    name: 'Public Affairs Analyst',
    permissions: [
      PERMISSIONS.PUBLIC_AFFAIRS_VIEW,
      PERMISSIONS.PUBLIC_AFFAIRS_EDIT,
    ]
  },
  {
    id: 'role-canvassing-lead',
    name: 'Canvassing Lead',
    permissions: [
      PERMISSIONS.CANVASSING_VIEW,
      PERMISSIONS.CANVASSING_EDIT,
      PERMISSIONS.BUDGET_VIEW_PROFIT,
      PERMISSIONS.APPLICANTS_VIEW_BACKGROUND_CHECK,
      PERMISSIONS.CLIENTS_VIEW_ALL,
    ]
  },
  {
    id: 'role-canvassing-ops',
    name: 'Canvassing Ops',
    permissions: [
      PERMISSIONS.CANVASSING_VIEW,
      PERMISSIONS.CANVASSING_EDIT,
    ]
  },
  {
    id: 'role-readonly',
    name: 'Read-only',
    permissions: [
      PERMISSIONS.LOBBYING_VIEW,
      PERMISSIONS.PUBLIC_AFFAIRS_VIEW,
      PERMISSIONS.CANVASSING_VIEW,
    ]
  },
];

// Mock users
export const mockUsers: User[] = [
  {
    id: 'user-1',
    orgId: 'org-1',
    email: 'admin@echocanyonconsulting.com',
    firstName: 'Alex',
    lastName: 'Martinez',
    password: 'demo123456789',
    status: 'active',
    roleId: 'role-superadmin',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-12-18T10:30:00Z'
  },
  {
    id: 'user-2',
    orgId: 'org-1',
    email: 'sarah.chen@echocanyonconsulting.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    password: 'demo123456789',
    status: 'active',
    roleId: 'role-lobbying-lead',
    createdAt: '2024-02-15T00:00:00Z',
    lastLoginAt: '2024-12-18T09:15:00Z'
  },
  {
    id: 'user-3',
    orgId: 'org-1',
    email: 'james.wilson@echocanyonconsulting.com',
    firstName: 'James',
    lastName: 'Wilson',
    password: 'demo123456789',
    status: 'active',
    roleId: 'role-canvassing-lead',
    createdAt: '2024-03-01T00:00:00Z',
    lastLoginAt: '2024-12-17T16:45:00Z'
  },
  {
    id: 'user-4',
    orgId: 'org-1',
    email: 'maria.garcia@echocanyonconsulting.com',
    firstName: 'Maria',
    lastName: 'Garcia',
    password: 'demo123456789',
    status: 'active',
    roleId: 'role-pa-analyst',
    createdAt: '2024-04-10T00:00:00Z',
    lastLoginAt: '2024-12-18T08:00:00Z'
  },
  {
    id: 'user-5',
    orgId: 'org-1',
    email: 'david.kim@echocanyonconsulting.com',
    firstName: 'David',
    lastName: 'Kim',
    password: 'demo123456789',
    status: 'invited',
    roleId: 'role-lobbying-analyst',
    createdAt: '2024-12-10T00:00:00Z',
    lastLoginAt: null
  },
  {
    id: 'user-6',
    orgId: 'org-1',
    email: 'jessica.brown@echocanyonconsulting.com',
    firstName: 'Jessica',
    lastName: 'Brown',
    password: 'demo123456789',
    status: 'disabled',
    roleId: 'role-canvassing-ops',
    createdAt: '2024-05-20T00:00:00Z',
    lastLoginAt: '2024-11-30T14:20:00Z'
  },
];

// Mock teams
export const mockTeams: Team[] = [
  { id: 'team-1', orgId: 'org-1', name: 'Lobbying' },
  { id: 'team-2', orgId: 'org-1', name: 'Public Affairs' },
  { id: 'team-3', orgId: 'org-1', name: 'Canvassing Operations' },
  { id: 'team-4', orgId: 'org-1', name: 'Research & Intelligence' },
];

// Mock user-team assignments
export const mockUserTeams: UserTeam[] = [
  { userId: 'user-1', teamId: 'team-1' },
  { userId: 'user-1', teamId: 'team-2' },
  { userId: 'user-2', teamId: 'team-1' },
  { userId: 'user-3', teamId: 'team-3' },
  { userId: 'user-4', teamId: 'team-2' },
  { userId: 'user-5', teamId: 'team-1' },
  { userId: 'user-6', teamId: 'team-3' },
];

// Mock field-level permissions
export const mockUserFieldPermissions: UserFieldPermissions[] = [
  {
    userId: 'user-1',
    canViewBackgroundCheck: true,
    canViewPricingProfit: true,
    canViewInternalRecords: true,
    canExportComplianceLogs: true,
  },
  {
    userId: 'user-2',
    canViewBackgroundCheck: false,
    canViewPricingProfit: true,
    canViewInternalRecords: true,
    canExportComplianceLogs: true,
  },
  {
    userId: 'user-3',
    canViewBackgroundCheck: true,
    canViewPricingProfit: true,
    canViewInternalRecords: false,
    canExportComplianceLogs: false,
  },
  {
    userId: 'user-4',
    canViewBackgroundCheck: false,
    canViewPricingProfit: false,
    canViewInternalRecords: false,
    canExportComplianceLogs: false,
  },
  {
    userId: 'user-5',
    canViewBackgroundCheck: false,
    canViewPricingProfit: false,
    canViewInternalRecords: false,
    canExportComplianceLogs: false,
  },
  {
    userId: 'user-6',
    canViewBackgroundCheck: true,
    canViewPricingProfit: false,
    canViewInternalRecords: false,
    canExportComplianceLogs: false,
  },
];

// Mock invites
export const mockInvites: Invite[] = [
  {
    id: 'invite-1',
    orgId: 'org-1',
    email: 'newuser@echocanyonconsulting.com',
    roleId: 'role-lobbying-analyst',
    token: 'abc123xyz789',
    expiresAt: '2024-12-25T00:00:00Z',
    createdByUserId: 'user-1',
    acceptedAt: null,
  },
];

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'audit-1',
    orgId: 'org-1',
    actorUserId: 'user-1',
    actionKey: 'USER_ROLE_CHANGED',
    targetType: 'user',
    targetId: 'user-6',
    metadata: { from: 'role-canvassing-lead', to: 'role-canvassing-ops' },
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    id: 'audit-2',
    orgId: 'org-1',
    actorUserId: 'user-1',
    actionKey: 'USER_DISABLED',
    targetType: 'user',
    targetId: 'user-6',
    metadata: { reason: 'Left organization' },
    createdAt: '2024-12-16T14:30:00Z',
  },
  {
    id: 'audit-3',
    orgId: 'org-1',
    actorUserId: 'user-2',
    actionKey: 'BUDGET_VIEWED',
    targetType: 'project',
    targetId: 'proj-1',
    metadata: { section: 'Pricing & Profitability' },
    createdAt: '2024-12-17T09:15:00Z',
  },
];
