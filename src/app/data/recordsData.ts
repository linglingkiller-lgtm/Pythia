// Records Data Model - Institutional Memory System

export type RecordType = 
  | 'brief' 
  | 'budget' 
  | 'weekly-update' 
  | 'weekly_update'
  | 'deliverable' 
  | 'export' 
  | 'note' 
  | 'snapshot'
  | 'compliance-log'
  | 'compliance'
  | 'canvassing-report'
  | 'legislative-brief'
  | 'meeting-minutes'
  | 'meeting'
  | 'testimony'
  | 'amendment-memo'
  | 'qbr-summary';

export type RecordStatus = 'draft' | 'final' | 'sent' | 'archived';
export type RecordVisibility = 'private' | 'team' | 'organization';

export interface Record {
  id: string;
  title: string;
  type: RecordType;
  status: RecordStatus;
  visibility: RecordVisibility;
  
  // Content
  contentText?: string; // For text-based records
  fileUrl?: string; // For file uploads
  fileType?: string; // pdf, docx, xlsx, etc.
  summary?: string; // Short description/snippet
  
  // Linked objects
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  linkedBillIds: string[];
  linkedBillNumbers: string[];
  linkedPersonIds: string[];
  linkedPersonNames: string[];
  linkedIssueIds: string[];
  linkedIssueNames: string[];
  linkedWatchlistIds: string[];
  
  // Organization
  tags: string[];
  department?: 'public-affairs' | 'lobbying' | 'campaign-services';
  
  // Versioning
  version: number;
  parentRecordId?: string; // For versioned records
  
  // Metadata
  createdBy: string;
  createdByName: string;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy?: string;
  
  // User actions
  isStarred?: boolean;
  isPinned?: boolean;
  viewCount?: number;
  downloadCount?: number;
  
  // Audit trail
  activityLog: RecordActivity[];
  
  // AI generation flag
  isAIGenerated: boolean;
  generatedFromTemplate?: string;
}

export interface RecordActivity {
  id: string;
  recordId: string;
  action: 'created' | 'viewed' | 'downloaded' | 'edited' | 'sent' | 'archived' | 'starred' | 'version-created';
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  filters: RecordFilters;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  createdBy: string;
  createdAt: string;
  isShared: boolean;
}

export interface RecordFilters {
  searchQuery?: string;
  types?: RecordType[];
  statuses?: RecordStatus[];
  clientIds?: string[];
  projectIds?: string[];
  billNumbers?: string[];
  personIds?: string[];
  departments?: string[];
  owners?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  hasAttachments?: boolean;
  isAIGenerated?: boolean;
  isStarred?: boolean;
}

// Mock Data
export const mockRecords: Record[] = [
  {
    id: 'rec-001',
    title: 'HB 2847 Committee Hearing Prep Packet',
    type: 'deliverable',
    status: 'final',
    visibility: 'organization',
    summary: 'Complete hearing preparation package including testimony, talking points, Q&A, and vote count strategy for Dec 20 committee hearing.',
    contentText: 'Full hearing prep content...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sarah Martinez'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['hearing-prep', 'testimony', 'clean-energy', 'high-priority'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-001',
    createdByName: 'Jordan Davis',
    createdAt: '2025-12-17T14:30:00Z',
    lastModifiedAt: '2025-12-18T09:15:00Z',
    lastModifiedBy: 'user-002',
    isStarred: true,
    isPinned: true,
    viewCount: 12,
    downloadCount: 3,
    activityLog: [
      {
        id: 'act-001',
        recordId: 'rec-001',
        action: 'created',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-17T14:30:00Z',
        details: 'Auto-generated from deliverable deliv-001'
      },
      {
        id: 'act-002',
        recordId: 'rec-001',
        action: 'edited',
        userId: 'user-002',
        userName: 'Matt Kenney',
        timestamp: '2025-12-18T09:15:00Z',
        details: 'Updated Q&A section'
      },
      {
        id: 'act-003',
        recordId: 'rec-001',
        action: 'downloaded',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-18T16:45:00Z'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'hearing-prep-packet'
  },
  {
    id: 'rec-002',
    title: 'Coalition Strategy Session Brief',
    type: 'brief',
    status: 'draft',
    visibility: 'organization',
    summary: 'Meeting brief for Clean Energy Alliance strategy session covering 2026 priorities, member coordination, and advocacy planning.',
    contentText: 'Coalition brief content...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-002',
    projectTitle: 'Q4 Coalition Building - Clean Energy Alliance',
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedBillNumbers: ['HB 2847', 'SB 456'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['coalition', 'strategy', 'meeting-brief', '2026-planning'],
    department: 'public-affairs',
    version: 1,
    createdBy: 'user-002',
    createdByName: 'Matt Kenney',
    createdAt: '2025-12-16T11:00:00Z',
    lastModifiedAt: '2025-12-16T11:00:00Z',
    isStarred: false,
    isPinned: false,
    viewCount: 5,
    downloadCount: 0,
    activityLog: [
      {
        id: 'act-004',
        recordId: 'rec-002',
        action: 'created',
        userId: 'user-002',
        userName: 'Matt Kenney',
        timestamp: '2025-12-16T11:00:00Z',
        details: 'Auto-generated from deliverable deliv-003'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'coalition-brief'
  },
  {
    id: 'rec-003',
    title: 'Workforce Bills Status Report — December 2025',
    type: 'legislative-brief',
    status: 'final',
    visibility: 'organization',
    summary: 'Monthly tracking report covering 8 workforce development bills with status updates, advocacy activity, and January priorities.',
    contentText: 'Workforce bills report content...',
    clientId: 'client-002',
    clientName: 'Arizona Manufacturing Coalition',
    projectId: 'proj-003',
    projectTitle: 'Workforce Development Bill Monitoring',
    linkedBillIds: ['bill-4'],
    linkedBillNumbers: ['HB 567', 'SB 223', 'HB 892', 'SB 445', 'HB 334', 'SB 556', 'HB 778', 'SB 667'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: ['issue-004'],
    linkedIssueNames: ['Workforce Development'],
    linkedWatchlistIds: [],
    tags: ['workforce', 'monthly-report', 'bill-tracking', 'manufacturing'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-003',
    createdByName: 'Sarah Kim',
    createdAt: '2025-12-15T16:00:00Z',
    lastModifiedAt: '2025-12-15T16:00:00Z',
    isStarred: true,
    isPinned: false,
    viewCount: 8,
    downloadCount: 2,
    activityLog: [
      {
        id: 'act-005',
        recordId: 'rec-003',
        action: 'created',
        userId: 'user-003',
        userName: 'Sarah Kim',
        timestamp: '2025-12-15T16:00:00Z',
        details: 'Auto-generated from deliverable deliv-004'
      },
      {
        id: 'act-006',
        recordId: 'rec-003',
        action: 'sent',
        userId: 'user-003',
        userName: 'Sarah Kim',
        timestamp: '2025-12-15T17:30:00Z',
        details: 'Sent to client stakeholders'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'bill-tracker-monthly'
  },
  {
    id: 'rec-004',
    title: 'CA-45 Canvassing Budget — Q1 2026 (v2)',
    type: 'budget',
    status: 'final',
    visibility: 'team',
    summary: '3-month canvassing budget covering 50,000 doors with staffing, materials, and projected completion timeline.',
    fileUrl: '/exports/ca45-budget-q1-v2.pdf',
    fileType: 'pdf',
    clientId: 'client-004',
    clientName: 'CA-45 Campaign',
    projectId: 'proj-camp-001',
    projectTitle: 'CA-45 District Canvassing',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    linkedWatchlistIds: [],
    tags: ['budget', 'canvassing', 'q1-2026', 'campaign-services'],
    department: 'campaign-services',
    version: 2,
    parentRecordId: 'rec-004-v1',
    createdBy: 'user-004',
    createdByName: 'Emily Chen',
    createdAt: '2025-12-14T10:00:00Z',
    lastModifiedAt: '2025-12-18T14:20:00Z',
    isStarred: false,
    isPinned: true,
    viewCount: 15,
    downloadCount: 6,
    activityLog: [
      {
        id: 'act-007',
        recordId: 'rec-004',
        action: 'version-created',
        userId: 'user-004',
        userName: 'Emily Chen',
        timestamp: '2025-12-18T14:20:00Z',
        details: 'Updated staffing costs and door count projections'
      }
    ],
    isAIGenerated: false
  },
  {
    id: 'rec-005',
    title: 'Weekly Legislative Update — SolarTech Alliance (Dec 20)',
    type: 'weekly-update',
    status: 'sent',
    visibility: 'organization',
    summary: 'Weekly client update covering HB 2847 progress, SB 456 floor vote, upcoming hearings, and engagement summary.',
    contentText: 'Weekly update content...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    linkedBillIds: ['bill-1', 'bill-2', 'bill-3'],
    linkedBillNumbers: ['HB 2847', 'SB 456', 'HB 789'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sarah Martinez'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['weekly-update', 'client-deliverable', 'clean-energy'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-001',
    createdByName: 'Jordan Davis',
    createdAt: '2025-12-20T08:00:00Z',
    lastModifiedAt: '2025-12-20T08:30:00Z',
    isStarred: false,
    isPinned: false,
    viewCount: 3,
    downloadCount: 1,
    activityLog: [
      {
        id: 'act-008',
        recordId: 'rec-005',
        action: 'created',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-20T08:00:00Z',
        details: 'Auto-generated weekly update'
      },
      {
        id: 'act-009',
        recordId: 'rec-005',
        action: 'sent',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-20T08:30:00Z',
        details: 'Sent to client via email'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'weekly-update'
  },
  {
    id: 'rec-006',
    title: 'Door Tracker Snapshot — CA-45 — Dec 19, 2025',
    type: 'snapshot',
    status: 'final',
    visibility: 'organization',
    summary: 'Point-in-time snapshot: 32,450 doors knocked, 17,550 remaining, pace tracking, staffing levels, projected completion Feb 8.',
    fileUrl: '/exports/ca45-door-snapshot-dec19.pdf',
    fileType: 'pdf',
    clientId: 'client-004',
    clientName: 'CA-45 Campaign',
    projectId: 'proj-camp-001',
    projectTitle: 'CA-45 District Canvassing',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    linkedWatchlistIds: [],
    tags: ['snapshot', 'door-tracker', 'canvassing', 'progress-report'],
    department: 'campaign-services',
    version: 1,
    createdBy: 'user-004',
    createdByName: 'Emily Chen',
    createdAt: '2025-12-19T18:00:00Z',
    lastModifiedAt: '2025-12-19T18:00:00Z',
    isStarred: false,
    isPinned: false,
    viewCount: 4,
    downloadCount: 1,
    activityLog: [
      {
        id: 'act-010',
        recordId: 'rec-006',
        action: 'created',
        userId: 'user-004',
        userName: 'Emily Chen',
        timestamp: '2025-12-19T18:00:00Z',
        details: 'Auto-generated snapshot from door tracker'
      }
    ],
    isAIGenerated: false
  },
  {
    id: 'rec-007',
    title: 'HB 2847 Testimony — House Energy Committee',
    type: 'testimony',
    status: 'final',
    visibility: 'organization',
    summary: 'Prepared testimony supporting HB 2847 for Dec 20 House Energy Committee hearing.',
    contentText: 'Chair Thompson and members...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sarah Martinez'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['testimony', 'house-energy', 'clean-energy', 'committee-hearing'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-002',
    createdByName: 'Matt Kenney',
    createdAt: '2025-12-17T13:00:00Z',
    lastModifiedAt: '2025-12-18T10:30:00Z',
    isStarred: true,
    isPinned: false,
    viewCount: 18,
    downloadCount: 5,
    activityLog: [
      {
        id: 'act-011',
        recordId: 'rec-007',
        action: 'created',
        userId: 'user-002',
        userName: 'Matt Kenney',
        timestamp: '2025-12-17T13:00:00Z'
      },
      {
        id: 'act-012',
        recordId: 'rec-007',
        action: 'edited',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-18T10:30:00Z',
        details: 'Added rural cooperative exemption talking point'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'testimony'
  },
  {
    id: 'rec-008',
    title: 'Q4 2025 Quarterly Business Review — SolarTech Alliance',
    type: 'qbr-summary',
    status: 'final',
    visibility: 'organization',
    summary: 'Comprehensive quarterly review covering legislative wins, advocacy metrics, budget performance, and 2026 outlook.',
    fileUrl: '/exports/solartech-qbr-q4-2025.pdf',
    fileType: 'pdf',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedBillNumbers: ['HB 2847', 'SB 456'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['qbr', 'quarterly-review', 'client-meeting', 'performance'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-001',
    createdByName: 'Jordan Davis',
    createdAt: '2025-12-10T09:00:00Z',
    lastModifiedAt: '2025-12-10T09:00:00Z',
    isStarred: true,
    isPinned: false,
    viewCount: 22,
    downloadCount: 8,
    activityLog: [
      {
        id: 'act-013',
        recordId: 'rec-008',
        action: 'created',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-10T09:00:00Z',
        details: 'Generated for Q4 QBR meeting'
      },
      {
        id: 'act-014',
        recordId: 'rec-008',
        action: 'sent',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-10T14:00:00Z',
        details: 'Presented in QBR meeting with client leadership'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'qbr-summary'
  },
  {
    id: 'rec-009',
    title: 'Amendment Analysis — HB 2847 Rural Cooperative Exemption',
    type: 'amendment-memo',
    status: 'final',
    visibility: 'organization',
    summary: 'Detailed analysis of proposed Amendment 1 extending compliance timeline for rural electric cooperatives.',
    contentText: 'Amendment analysis content...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sarah Martinez'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedWatchlistIds: [],
    tags: ['amendment', 'policy-analysis', 'rural-cooperatives'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-002',
    createdByName: 'Matt Kenney',
    createdAt: '2025-12-12T15:00:00Z',
    lastModifiedAt: '2025-12-12T15:00:00Z',
    isStarred: false,
    isPinned: false,
    viewCount: 7,
    downloadCount: 2,
    activityLog: [
      {
        id: 'act-015',
        recordId: 'rec-009',
        action: 'created',
        userId: 'user-002',
        userName: 'Matt Kenney',
        timestamp: '2025-12-12T15:00:00Z'
      }
    ],
    isAIGenerated: true,
    generatedFromTemplate: 'amendment-memo'
  },
  {
    id: 'rec-010',
    title: 'Client Meeting Notes — Jennifer Rodriguez (SolarTech)',
    type: 'note',
    status: 'final',
    visibility: 'team',
    summary: 'Strategy discussion covering HB 2847 floor vote timing, media opportunities, and 2026 planning.',
    contentText: 'Meeting with Jennifer Rodriguez, Executive Director...',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    linkedWatchlistIds: [],
    tags: ['meeting-notes', 'client-call', 'strategy'],
    department: 'lobbying',
    version: 1,
    createdBy: 'user-001',
    createdByName: 'Jordan Davis',
    createdAt: '2025-12-18T11:00:00Z',
    lastModifiedAt: '2025-12-18T11:00:00Z',
    isStarred: false,
    isPinned: false,
    viewCount: 2,
    downloadCount: 0,
    activityLog: [
      {
        id: 'act-016',
        recordId: 'rec-010',
        action: 'created',
        userId: 'user-001',
        userName: 'Jordan Davis',
        timestamp: '2025-12-18T11:00:00Z'
      }
    ],
    isAIGenerated: false
  },
];

export const mockSavedViews: SavedView[] = [
  {
    id: 'view-001',
    name: 'My Client Deliverables',
    description: 'All deliverables I created for clients',
    filters: {
      types: ['deliverable', 'brief', 'weekly-update'],
      owners: ['user-001']
    },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    createdBy: 'user-001',
    createdAt: '2025-12-01T10:00:00Z',
    isShared: false
  },
  {
    id: 'view-002',
    name: 'HB 2847 + Clean Energy (Last 30 Days)',
    description: 'All records related to HB 2847 and clean energy',
    filters: {
      billNumbers: ['HB 2847'],
      tags: ['clean-energy'],
      dateFrom: '2025-11-20T00:00:00Z'
    },
    sortBy: 'createdAt',
    sortDirection: 'desc',
    createdBy: 'user-001',
    createdAt: '2025-12-05T14:00:00Z',
    isShared: true
  },
  {
    id: 'view-003',
    name: 'Active Canvassing Budgets',
    description: 'All budgets for active canvassing projects',
    filters: {
      types: ['budget'],
      departments: ['campaign-services'],
      statuses: ['draft', 'final']
    },
    sortBy: 'lastModifiedAt',
    sortDirection: 'desc',
    createdBy: 'user-004',
    createdAt: '2025-12-08T09:00:00Z',
    isShared: false
  }
];

// Helper functions
export function getRecordsByClient(clientId: string): Record[] {
  return mockRecords.filter(r => r.clientId === clientId);
}

export function getRecordsByType(type: RecordType): Record[] {
  return mockRecords.filter(r => r.type === type);
}

export function getStarredRecords(): Record[] {
  return mockRecords.filter(r => r.isStarred);
}

export function getPinnedRecords(): Record[] {
  return mockRecords.filter(r => r.isPinned);
}

export function getRecentRecords(limit: number = 10): Record[] {
  return [...mockRecords]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function searchRecords(query: string, filters?: RecordFilters): Record[] {
  let results = [...mockRecords];

  // Apply text search
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(r =>
      r.title.toLowerCase().includes(lowerQuery) ||
      r.summary?.toLowerCase().includes(lowerQuery) ||
      r.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      r.clientName?.toLowerCase().includes(lowerQuery) ||
      r.linkedBillNumbers.some(bill => bill.toLowerCase().includes(lowerQuery))
    );
  }

  // Apply filters
  if (filters) {
    if (filters.types && filters.types.length > 0) {
      results = results.filter(r => filters.types!.includes(r.type));
    }
    if (filters.statuses && filters.statuses.length > 0) {
      results = results.filter(r => filters.statuses!.includes(r.status));
    }
    if (filters.clientIds && filters.clientIds.length > 0) {
      results = results.filter(r => r.clientId && filters.clientIds!.includes(r.clientId));
    }
    if (filters.departments && filters.departments.length > 0) {
      results = results.filter(r => r.department && filters.departments!.includes(r.department));
    }
    if (filters.owners && filters.owners.length > 0) {
      results = results.filter(r => filters.owners!.includes(r.createdBy));
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter(r => r.tags.some(tag => filters.tags!.includes(tag)));
    }
    if (filters.isAIGenerated !== undefined) {
      results = results.filter(r => r.isAIGenerated === filters.isAIGenerated);
    }
    if (filters.isStarred) {
      results = results.filter(r => r.isStarred);
    }
    if (filters.dateFrom) {
      results = results.filter(r => new Date(r.createdAt) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      results = results.filter(r => new Date(r.createdAt) <= new Date(filters.dateTo!));
    }
  }

  return results;
}

export function getRecordTypeLabel(type: RecordType): string {
  const labels: Record<RecordType, string> = {
    'brief': 'Brief',
    'budget': 'Budget',
    'weekly-update': 'Weekly Update',
    'weekly_update': 'Weekly Update',
    'deliverable': 'Deliverable',
    'export': 'Export',
    'note': 'Note',
    'snapshot': 'Snapshot',
    'compliance-log': 'Compliance Log',
    'compliance': 'Compliance',
    'canvassing-report': 'Canvassing Report',
    'legislative-brief': 'Legislative Brief',
    'meeting-minutes': 'Meeting Minutes',
    'meeting': 'Meeting',
    'testimony': 'Testimony',
    'amendment-memo': 'Amendment Memo',
    'qbr-summary': 'QBR Summary'
  };
  return labels[type];
}

export function getRecordTypeColor(type: RecordType): string {
  const colors: Record<RecordType, string> = {
    'brief': 'blue',
    'budget': 'green',
    'weekly-update': 'purple',
    'weekly_update': 'purple',
    'deliverable': 'indigo',
    'export': 'gray',
    'note': 'yellow',
    'snapshot': 'orange',
    'compliance-log': 'red',
    'compliance': 'red',
    'canvassing-report': 'teal',
    'legislative-brief': 'blue',
    'meeting-minutes': 'gray',
    'meeting': 'blue',
    'testimony': 'purple',
    'amendment-memo': 'indigo',
    'qbr-summary': 'green'
  };
  return colors[type];
}
