// Work Hub Data Model

export type ProjectStage = 'intake' | 'discovery' | 'strategy' | 'execution' | 'review' | 'delivered' | 'on-hold';
export type DeliverableStatus = 'draft' | 'internal-review' | 'client-ready' | 'sent';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  stage: ProjectStage;
  ownerId: string;
  ownerName: string;
  dueDate?: string;
  status: 'on-track' | 'at-risk' | 'overdue';
  progress: number; // 0-100
  
  // Linked objects
  linkedBillIds: string[];
  linkedBillNumbers: string[];
  linkedIssueIds: string[];
  linkedIssueNames: string[];
  linkedPersonIds: string[];
  linkedPersonNames: string[];
  linkedEventIds: string[];
  
  // Metrics
  totalTasks: number;
  completedTasks: number;
  totalDeliverables: number;
  completedDeliverables: number;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  workstreamId?: string;
  
  // Revere V2 Features
  confidenceScore?: number; // 0-100 Pythia Risk Score
  budgetUsed?: number;
  budgetTotal?: number;
  tags?: string[];
  description?: string;
}

export interface ActivityItem {
    id: string;
    type: 'bill' | 'task' | 'file' | 'comment';
    text: string;
    timestamp: string;
    user?: string;
    meta?: string; 
}

export interface Deliverable {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectTitle?: string;
  type: 'weekly-update' | 'bill-tracker' | 'meeting-brief' | 'hearing-prep' | 'amendment-memo' | 'qbr-summary' | 'custom';
  title: string;
  description?: string;
  dueDate?: string;
  status: DeliverableStatus;
  approverId?: string;
  approverName?: string;
  
  // Content references
  linkedBillIds: string[];
  linkedEngagementIds: string[];
  linkedEventIds: string[];
  
  // Export
  lastExported?: string;
  sentToClient?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  progress: number; // 0-100
  
  // Linked to work structure
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  deliverableId?: string;
  deliverableTitle?: string;
  
  // Dependencies & Blocking
  dependencies?: string[]; // IDs of tasks that must be completed first
  blockingTaskIds?: string[]; // IDs of tasks blocked by this one
  isBlocking?: boolean; // Revere AI flag
  blockingAlert?: string; // AI message

  // Linked to content
  linkedBillIds: string[];
  linkedBillNumbers: string[];
  linkedPersonIds: string[];
  linkedPersonNames: string[];
  linkedIssueIds: string[];
  linkedIssueNames: string[];
  eventId?: string;
  
  // Task bundling
  bundleId?: string;
  bundleName?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  
  // Blocking
  blockedReason?: string;
  blockedBy?: string;

  // Expanded fields for Task Details
  subtasks?: Subtask[];
  comments?: TaskComment[];
  attachments?: TaskAttachment[];
  tags?: string[];
  
  // Energy Level
  energyLevel?: 'high' | 'low';
  
  // Ordering
  order?: number; // Relative order within a day
  
  // Execution Status
  executionStatus?: 'working' | 'paused' | 'break';

  // Context
  sourceMessageId?: string;
  sourceConversationId?: string;
  sourceMessagePreview?: string;
  sourceMessageSender?: string;
}

export interface Subtask {
  id: string;
  title: string;
  assigneeName?: string;
  dueDate?: string;
  isCompleted: boolean;
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timestamp: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'other';
  url: string;
  size?: string;
}

export interface TaskBundle {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  projectId?: string;
  taskIds: string[];
  totalTasks: number;
  completedTasks: number;
  dueDate?: string;
}

export interface WorkHubAIInsight {
  id: string;
  scope: 'client' | 'project' | 'deliverable' | 'task';
  scopeId: string;
  type: 'missing-deliverable' | 'project-suggestion' | 'critical-path' | 'scope-drift' | 'renewal-prep' | 'task-extraction';
  summary: string;
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
  actionLabel?: string;
  actionData?: any;
  createdAt: string;
}

export type OpportunityStage = 'identified' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
export type OpportunityType = 'scope-expansion' | 'new-workstream' | 'coalition-management' | 'crisis-response' | 'strategic-advisory' | 'research' | 'amendment-drafting' | 'grassroots' | 'media-relations';

export interface Opportunity {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  description: string;
  type: OpportunityType;
  stage: OpportunityStage;
  valueEstimate: number; // Monthly retainer increase or one-time fee
  isRecurring: boolean; // Monthly retainer vs one-time
  probability: number; // 0-100
  
  // Why this opportunity exists
  source: 'pythia-detected' | 'scope-drift' | 'client-request' | 'proactive-pitch' | 'renewal-expansion';
  reasons: string[];
  
  // Related objects
  linkedProjectIds: string[];
  linkedBillIds: string[];
  linkedIssueIds: string[];
  
  // Sales data
  ownerId: string;
  ownerName: string;
  expectedCloseDate?: string;
  proposalSent?: string;
  lastContact?: string;
  nextAction?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  closedReason?: string;
}

// Mock Data
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'HB 2847 Legislative Strategy',
    stage: 'execution',
    ownerId: 'user-001',
    ownerName: 'Jordan Davis',
    dueDate: '2025-12-20',
    status: 'on-track',
    progress: 75,
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sarah Martinez'],
    linkedEventIds: ['event-001'],
    totalTasks: 8,
    completedTasks: 6,
    totalDeliverables: 3,
    completedDeliverables: 2,
    createdAt: '2025-11-01',
    updatedAt: '2025-12-17',
    // New Fields
    confidenceScore: 88,
    budgetUsed: 12500,
    budgetTotal: 15000,
    description: 'Passing HB 2847 through Senate committee before EOY.',
    tags: ['Legislative', 'High Priority']
  },
  {
    id: 'proj-002',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'Q4 Coalition Building',
    stage: 'strategy',
    ownerId: 'user-002',
    ownerName: 'Matt Kenney',
    dueDate: '2025-12-31',
    status: 'on-track',
    progress: 45,
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedBillNumbers: ['HB 2847', 'SB 456'],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedEventIds: [],
    totalTasks: 5,
    completedTasks: 2,
    totalDeliverables: 2,
    completedDeliverables: 0,
    createdAt: '2025-11-15',
    updatedAt: '2025-12-16',
    // New Fields
    confidenceScore: 92,
    budgetUsed: 4200,
    budgetTotal: 10000,
    description: 'Aligning 12 partner orgs for 2026 session push.',
    tags: ['Coalition', 'Outreach']
  },
  {
    id: 'proj-003',
    clientId: 'client-002',
    clientName: 'Arizona Mfg Coalition',
    title: 'Workforce Development Monitoring',
    stage: 'execution',
    ownerId: 'user-003',
    ownerName: 'Sarah Kim',
    dueDate: '2026-01-15',
    status: 'at-risk',
    progress: 30,
    linkedBillIds: ['bill-4'],
    linkedBillNumbers: ['HB 567'],
    linkedIssueIds: ['issue-004'],
    linkedIssueNames: ['Workforce'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedEventIds: [],
    totalTasks: 6,
    completedTasks: 1,
    totalDeliverables: 2,
    completedDeliverables: 0,
    createdAt: '2025-12-01',
    updatedAt: '2025-12-17',
    // New Fields
    confidenceScore: 45,
    budgetUsed: 8000,
    budgetTotal: 8500,
    description: 'Monitoring key workforce bills for potential amendments.',
    tags: ['Monitoring', 'Risk']
  },
  {
    id: 'proj-004',
    clientId: 'client-003',
    clientName: 'WaterFirst Coalition',
    title: 'Water Rights Package',
    stage: 'discovery',
    ownerId: 'user-001',
    ownerName: 'Jordan Davis',
    dueDate: '2026-02-01',
    status: 'on-track',
    progress: 20,
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedIssueIds: ['issue-005'],
    linkedIssueNames: ['Water Resources'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedEventIds: [],
    totalTasks: 4,
    completedTasks: 1,
    totalDeliverables: 1,
    completedDeliverables: 0,
    createdAt: '2025-12-10',
    updatedAt: '2025-12-15',
    // New Fields
    confidenceScore: 78,
    budgetUsed: 1500,
    budgetTotal: 25000,
    description: 'Drafting initial language for water conservation bill.',
    tags: ['Policy', 'Drafting']
  },
];

export const mockDeliverables: Deliverable[] = [
  {
    id: 'deliv-001',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    type: 'hearing-prep',
    title: 'HB 2847 Committee Hearing Prep Packet',
    description: 'Full hearing preparation package including testimony, talking points, and Q&A',
    dueDate: '2025-12-19',
    status: 'internal-review',
    approverId: 'user-001',
    approverName: 'Jordan Davis',
    linkedBillIds: ['bill-1'],
    linkedEngagementIds: ['er-001', 'er-002'],
    linkedEventIds: ['event-001'],
    createdAt: '2025-12-10',
    updatedAt: '2025-12-17',
  },
  {
    id: 'deliv-002',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    type: 'weekly-update',
    title: 'Weekly Legislative Update - Dec 20',
    description: 'Weekly summary of bill movement and engagement activities',
    dueDate: '2025-12-20',
    status: 'draft',
    approverId: 'user-001',
    approverName: 'Jordan Davis',
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedEngagementIds: ['er-003', 'er-004'],
    linkedEventIds: [],
    createdAt: '2025-12-16',
    updatedAt: '2025-12-17',
  },
  {
    id: 'deliv-003',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-002',
    projectTitle: 'Q4 Coalition Building - Clean Energy Alliance',
    type: 'meeting-brief',
    title: 'Coalition Strategy Session Brief',
    description: 'Brief for coalition coordination meeting',
    dueDate: '2025-12-22',
    status: 'draft',
    approverId: 'user-002',
    approverName: 'Matt Kenney',
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedEngagementIds: [],
    linkedEventIds: [],
    createdAt: '2025-12-15',
    updatedAt: '2025-12-16',
  },
  {
    id: 'deliv-004',
    clientId: 'client-002',
    clientName: 'Arizona Manufacturing Coalition',
    projectId: 'proj-003',
    projectTitle: 'Workforce Development Bill Monitoring',
    type: 'bill-tracker',
    title: 'Workforce Bills Status Report',
    description: 'Monthly status update on workforce development legislation',
    dueDate: '2025-12-31',
    status: 'draft',
    approverId: 'user-003',
    approverName: 'Sarah Kim',
    linkedBillIds: ['bill-4'],
    linkedEngagementIds: [],
    linkedEventIds: [],
    createdAt: '2025-12-12',
    updatedAt: '2025-12-17',
  },
];

export const mockTasks: Task[] = [
  // Project 1: Marketing Campaign Launch
  {
    id: 't1',
    title: 'Create marketing plan',
    description: 'Develop comprehensive strategy including channels and budget',
    dueDate: '2025-12-15',
    priority: 'high',
    status: 'in-progress',
    progress: 60,
    assigneeId: 'user-001',
    assigneeName: 'Jordan',
    projectId: 'proj-001',
    projectTitle: 'Marketing Campaign Launch',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: ['leg-001'],
    linkedPersonNames: ['Sen. Smith'],
    linkedIssueIds: [],
    linkedIssueNames: [],
    dependencies: [],
    blockingTaskIds: ['t3'],
    isBlocking: true,
    blockingAlert: 'Blocking "Write campaign copy" - Delaying project by 2 days',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-08',
    tags: ['Urgent', 'Strategy'],
    order: 0,
    subtasks: [
      { id: 'st1', title: 'Research competitor pricing', isCompleted: true, assigneeName: 'Jordan' },
      { id: 'st2', title: 'Define target audience personas', isCompleted: false, assigneeName: 'Jordan', dueDate: '2025-12-14' }
    ],
    comments: [
      { id: 'c1', userId: 'user-002', userName: 'Matt', text: 'Draft looks good, but needs more budget detail.', timestamp: '2025-12-05T10:30:00Z' }
    ],
    attachments: [
      { id: 'a1', name: 'Competitor_Analysis_2025.pdf', type: 'document', url: '#', size: '2.4 MB' }
    ]
  },
  {
    id: 't2',
    title: 'Design campaign assets',
    description: 'Create social media graphics and email banners',
    dueDate: '2025-12-10',
    priority: 'medium',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-002',
    assigneeName: 'Matt',
    projectId: 'proj-001',
    projectTitle: 'Marketing Campaign Launch',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    createdAt: '2025-12-02',
    updatedAt: '2025-12-02',
    order: 1,
  },
  {
    id: 't3',
    title: 'Write campaign copy',
    description: 'Draft copy for emails, social posts, and landing page',
    dueDate: '2025-12-12',
    priority: 'high',
    status: 'done',
    progress: 100,
    assigneeId: 'user-003',
    assigneeName: 'Sarah',
    projectId: 'proj-001',
    projectTitle: 'Marketing Campaign Launch',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    dependencies: ['t1'],
    createdAt: '2025-12-03',
    updatedAt: '2025-12-11',
    completedAt: '2025-12-11',
    order: 2,
  },
  {
    id: 't4',
    title: 'Coordinate with influencers',
    description: 'Outreach to top 10 influencers for launch promotion',
    dueDate: '2025-12-17',
    priority: 'high',
    status: 'blocked',
    progress: 20,
    assigneeId: 'user-004',
    assigneeName: 'Kelly',
    projectId: 'proj-001',
    projectTitle: 'Marketing Campaign Launch',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    blockedReason: 'Waiting for budget approval',
    blockedBy: 'Finance Dept',
    createdAt: '2025-12-05',
    updatedAt: '2025-12-08',
    order: 3,
  },
  
  // Project 2: Website Redesign
  {
    id: 'p2-t1',
    title: 'Finalize wireframes',
    description: 'Complete high-fidelity wireframes for homepage and pricing',
    dueDate: '2025-12-14',
    priority: 'medium',
    status: 'in-progress',
    progress: 45,
    assigneeId: 'user-005',
    assigneeName: 'Rachel',
    projectId: 'proj-002',
    projectTitle: 'Website Redesign',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    createdAt: '2025-12-06',
    updatedAt: '2025-12-09',
  },
  {
    id: 'p2-t2',
    title: 'Design website homepage',
    description: 'Visual design phase based on approved wireframes',
    dueDate: '2025-12-16',
    priority: 'high',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-006',
    assigneeName: 'Olivia',
    projectId: 'proj-002',
    projectTitle: 'Website Redesign',
    dependencies: ['p2-t1'],
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    createdAt: '2025-12-07',
    updatedAt: '2025-12-07',
  },
  {
    id: 'p2-t3',
    title: 'Implement CMS',
    description: 'Setup and configure headless CMS',
    dueDate: '2025-12-20',
    priority: 'low',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-007',
    assigneeName: 'Leo',
    projectId: 'proj-002',
    projectTitle: 'Website Redesign',
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    createdAt: '2025-12-08',
    updatedAt: '2025-12-08',
  },
  {
    id: 'p2-t4',
    title: 'Test website for bugs',
    description: 'QA testing across browsers and devices',
    dueDate: '2025-12-22',
    priority: 'medium',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-008',
    assigneeName: 'Tom',
    projectId: 'proj-002',
    projectTitle: 'Website Redesign',
    dependencies: ['p2-t3'],
    linkedBillIds: [],
    linkedBillNumbers: [],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: [],
    linkedIssueNames: [],
    createdAt: '2025-12-09',
    updatedAt: '2025-12-09',
  },

  // HB 2847 Hearing Prep Bundle (Legacy Mock Data Preserved)
  {
    id: 'task-001',
    title: 'Draft testimony for HB 2847 committee hearing',
    description: 'Prepare written testimony supporting HB 2847',
    dueDate: '2025-12-19',
    priority: 'urgent',
    status: 'in-progress',
    progress: 75,
    assigneeId: 'user-002',
    assigneeName: 'Matt Kenney',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    deliverableId: 'deliv-001',
    deliverableTitle: 'HB 2847 Committee Hearing Prep Packet',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    bundleId: 'bundle-001',
    bundleName: 'HB 2847 Hearing Prep',
    createdAt: '2025-12-10',
    updatedAt: '2025-12-17',
  },
  {
    id: 'task-002',
    title: 'Coordinate with Rep. Martinez on amendment strategy',
    description: 'Schedule and prep for amendment discussion meeting',
    dueDate: '2025-12-19',
    priority: 'high',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-001',
    assigneeName: 'Jordan Davis',
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
    bundleId: 'bundle-001',
    bundleName: 'HB 2847 Hearing Prep',
    createdAt: '2025-12-10',
    updatedAt: '2025-12-16',
  },
  {
    id: 'task-003',
    title: 'Prepare Q&A document for committee members',
    description: 'Anticipated questions and talking points',
    dueDate: '2025-12-19',
    priority: 'high',
    status: 'todo',
    progress: 0,
    assigneeId: 'user-001',
    assigneeName: 'Jordan Davis',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    projectId: 'proj-001',
    projectTitle: 'HB 2847 Legislative Strategy & Passage',
    deliverableId: 'deliv-001',
    deliverableTitle: 'HB 2847 Committee Hearing Prep Packet',
    linkedBillIds: ['bill-1'],
    linkedBillNumbers: ['HB 2847'],
    linkedPersonIds: [],
    linkedPersonNames: [],
    linkedIssueIds: ['issue-001'],
    linkedIssueNames: ['Clean Energy'],
    bundleId: 'bundle-001',
    bundleName: 'HB 2847 Hearing Prep',
    createdAt: '2025-12-11',
    updatedAt: '2025-12-16',
  },
];

export const mockTaskBundles: TaskBundle[] = [
  {
    id: 'bundle-001',
    name: 'HB 2847 Hearing Prep',
    description: 'All tasks related to Dec 20 committee hearing',
    clientId: 'client-001',
    projectId: 'proj-001',
    taskIds: ['task-001', 'task-002', 'task-003'],
    totalTasks: 3,
    completedTasks: 0,
    dueDate: '2025-12-19',
  },
  {
    id: 'bundle-002',
    name: 'Client Weekly Update',
    description: 'Weekly report compilation tasks',
    clientId: 'client-001',
    projectId: 'proj-001',
    taskIds: ['task-004', 'task-005'],
    totalTasks: 2,
    completedTasks: 0,
    dueDate: '2025-12-20',
  },
];

export const mockWorkHubAIInsights: WorkHubAIInsight[] = [
  {
    id: 'whai-001',
    scope: 'project',
    scopeId: 'proj-001',
    type: 'critical-path',
    summary: 'HB 2847 hearing in 2 days - 3 tasks must complete before hearing',
    reasons: [
      'Committee hearing scheduled for Dec 20',
      'Testimony draft, amendment strategy, and Q&A prep are on critical path',
      'Current pace suggests risk of missing deadline',
    ],
    confidence: 'high',
    actionLabel: 'View Critical Path',
    createdAt: '2025-12-17',
  },
  {
    id: 'whai-002',
    scope: 'client',
    scopeId: 'client-001',
    type: 'missing-deliverable',
    summary: 'No QBR deliverable scheduled - contract ends in 378 days',
    reasons: [
      'Contract includes quarterly business reviews',
      'Q4 QBR not yet scheduled or created',
      'Last QBR was 90+ days ago',
    ],
    confidence: 'medium',
    actionLabel: 'Create QBR Project',
    createdAt: '2025-12-16',
  },
  {
    id: 'whai-003',
    scope: 'project',
    scopeId: 'proj-002',
    type: 'project-suggestion',
    summary: 'Coalition work expanding beyond scope - consider adding workstream',
    reasons: [
      'Coalition coordination tasks now 40% of project time',
      'Original scope was bill-focused, not coalition management',
      'Client has requested additional coalition support 3 times',
    ],
    confidence: 'high',
    actionLabel: 'Create Opportunity',
    createdAt: '2025-12-15',
  },
  {
    id: 'whai-004',
    scope: 'task',
    scopeId: 'task-006',
    type: 'renewal-prep',
    summary: 'Task blocked on client decision for 5 days - reach out',
    reasons: [
      'Messaging framework approval needed from client',
      'Blocking downstream opposition strategy work',
      'Client typically responds within 2 business days',
    ],
    confidence: 'high',
    actionLabel: 'Draft Follow-up',
    createdAt: '2025-12-17',
  },
];

// Helper functions
export function getProjectsByStage(stage: ProjectStage): Project[] {
  return mockProjects.filter(p => p.stage === stage);
}

export function getProjectsByClient(clientId: string): Project[] {
  return mockProjects.filter(p => p.clientId === clientId);
}

export function getDeliverablesByClient(clientId: string): Deliverable[] {
  return mockDeliverables.filter(d => d.clientId === clientId);
}

export function getTasksByAssignee(assigneeId: string): Task[] {
  return mockTasks.filter(t => t.assigneeId === assigneeId);
}

export function getTasksByProject(projectId: string): Task[] {
  return mockTasks.filter(t => t.projectId === projectId);
}

export function getTasksByStatus(status: TaskStatus): Task[] {
  return mockTasks.filter(t => t.status === status);
}

export function getTasksDueToday(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => t.dueDate === today);
}

export function getTasksOverdue(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return mockTasks.filter(t => t.dueDate && t.dueDate < today && t.status !== 'done');
}

export function getTasksBlocked(): Task[] {
  return mockTasks.filter(t => t.status === 'blocked');
}

// Mock Opportunities
export const mockOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'Coalition Management Workstream',
    description: 'Dedicated coalition coordination and management services for Clean Energy Alliance. Client has requested coalition support 3 times outside original scope.',
    type: 'coalition-management',
    stage: 'qualified',
    valueEstimate: 8000,
    isRecurring: true,
    probability: 75,
    source: 'scope-drift',
    reasons: [
      'Coalition coordination tasks now represent 40% of project time',
      'Original scope was bill-focused, not coalition management',
      'Client has explicitly requested additional coalition support 3 times',
      'Clean Energy Alliance has 12 member organizations requiring ongoing coordination',
      'Coalition strategy session scheduled Dec 26 indicates long-term need',
    ],
    linkedProjectIds: ['proj-002'],
    linkedBillIds: ['bill-1', 'bill-2'],
    linkedIssueIds: ['issue-001'],
    ownerId: 'user-002',
    ownerName: 'Matt Kenney',
    expectedCloseDate: '2026-01-15',
    lastContact: '2025-12-15',
    nextAction: 'Send coalition management proposal with scope and pricing',
    createdAt: '2025-12-10',
    updatedAt: '2025-12-17',
  },
  {
    id: 'opp-002',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'Opposition Research & Counter-Strategy (HB 789)',
    description: 'Comprehensive opposition research and counter-messaging strategy for HB 789, which threatens solar development with new restrictions. Bill gaining momentum with 3 new co-sponsors.',
    type: 'crisis-response',
    stage: 'proposal',
    valueEstimate: 15000,
    isRecurring: false,
    probability: 85,
    source: 'pythia-detected',
    reasons: [
      'HB 789 identified as high-risk opposition bill',
      'Bill has gained 3 new co-sponsors in past week',
      'Committee hearing scheduled for Jan 10',
      'Current scope does not include comprehensive opposition research',
      'Client expressed concern about HB 789 in last weekly call',
    ],
    linkedProjectIds: ['proj-001'],
    linkedBillIds: ['bill-3'],
    linkedIssueIds: ['issue-001'],
    ownerId: 'user-001',
    ownerName: 'Jordan Davis',
    expectedCloseDate: '2025-12-23',
    proposalSent: '2025-12-16',
    lastContact: '2025-12-17',
    nextAction: 'Follow up on proposal sent 12/16',
    createdAt: '2025-12-12',
    updatedAt: '2025-12-17',
  },
  {
    id: 'opp-003',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: '2026 Legislative Package Development',
    description: 'Proactive development of comprehensive 2026 legislative package including 3-5 bills covering solar workforce development, grid modernization, and community solar expansion.',
    type: 'strategic-advisory',
    stage: 'identified',
    valueEstimate: 25000,
    isRecurring: false,
    probability: 60,
    source: 'proactive-pitch',
    reasons: [
      '2025 session ending soon - natural time to plan 2026 strategy',
      'Client achieved major wins with HB 2847 and SB 456',
      'Momentum and political capital should be leveraged',
      'Coalition partners have expressed interest in broader package',
      'Early development allows for 2026 Q1 introduction',
    ],
    linkedProjectIds: [],
    linkedBillIds: [],
    linkedIssueIds: ['issue-001'],
    ownerId: 'user-001',
    ownerName: 'Jordan Davis',
    expectedCloseDate: '2026-01-31',
    lastContact: '2025-12-10',
    nextAction: 'Schedule strategy session for 2026 planning',
    createdAt: '2025-12-08',
    updatedAt: '2025-12-17',
  },
  {
    id: 'opp-004',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'Media Relations & Communications Support',
    description: 'Media training, press release drafting, and spokesperson coordination for HB 2847 passage and ongoing legislative wins.',
    type: 'media-relations',
    stage: 'negotiation',
    valueEstimate: 5000,
    isRecurring: true,
    probability: 70,
    source: 'client-request',
    reasons: [
      'State Journal reached out for interview about HB 2847',
      'Client lacks in-house communications capacity',
      'Legislative wins create media opportunities',
      'Client asked for help coordinating media response',
      'Ongoing media presence would strengthen advocacy position',
    ],
    linkedProjectIds: ['proj-001'],
    linkedBillIds: ['bill-1'],
    linkedIssueIds: ['issue-001'],
    ownerId: 'user-001',
    ownerName: 'Jordan Davis',
    expectedCloseDate: '2026-01-10',
    proposalSent: '2025-12-14',
    lastContact: '2025-12-17',
    nextAction: 'Negotiate scope and monthly retainer amount',
    createdAt: '2025-12-13',
    updatedAt: '2025-12-17',
  },
  {
    id: 'opp-005',
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    title: 'Grassroots Mobilization Campaign',
    description: 'Grassroots advocacy campaign including member action alerts, testimony recruitment, and legislative district outreach for 2026 legislative priorities.',
    type: 'grassroots',
    stage: 'identified',
    valueEstimate: 12000,
    isRecurring: true,
    probability: 50,
    source: 'proactive-pitch',
    reasons: [
      'Legislative success in 2025 shows value of coordinated advocacy',
      'Client has large membership base (2,500+ members) not currently mobilized',
      'Grassroots pressure proved effective on HB 2847',
      'Coalition partners could amplify grassroots reach',
      'District-level advocacy would complement lobbying efforts',
    ],
    linkedProjectIds: [],
    linkedBillIds: [],
    linkedIssueIds: ['issue-001'],
    ownerId: 'user-002',
    ownerName: 'Matt Kenney',
    expectedCloseDate: '2026-02-15',
    lastContact: '2025-12-05',
    nextAction: 'Develop grassroots campaign proposal and pricing',
    createdAt: '2025-12-01',
    updatedAt: '2025-12-17',
  },
];

export function getOpportunitiesByClient(clientId: string): Opportunity[] {
  return mockOpportunities.filter(o => o.clientId === clientId);
}

export function getOpportunitiesByStage(stage: OpportunityStage): Opportunity[] {
  return mockOpportunities.filter(o => o.stage === stage);
}

export function calculateOpportunityValue(opportunities: Opportunity[]): { total: number; recurring: number; oneTime: number } {
  const recurring = opportunities
    .filter(o => o.isRecurring && o.stage !== 'closed-lost')
    .reduce((sum, o) => sum + (o.valueEstimate * o.probability / 100), 0);
  
  const oneTime = opportunities
    .filter(o => !o.isRecurring && o.stage !== 'closed-lost')
    .reduce((sum, o) => sum + (o.valueEstimate * o.probability / 100), 0);
  
  return {
    total: recurring * 12 + oneTime, // Annualized recurring + one-time
    recurring,
    oneTime,
  };
}