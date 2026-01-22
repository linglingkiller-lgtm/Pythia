// Team & Performance Management Data Model

export interface TeamMember {
  id: string;
  name: 'Jordan Davis' | 'Matt Kenney' | 'Sarah Kim' | 'Emily Chen' | 'Alex Rodriguez' | 'Rachel Morrison';
  email: string;
  role: string;
  title: string;
  departments: ('lobbying' | 'public-affairs' | 'campaign-services')[];
  team?: string;
  managerId?: string;
  avatarUrl?: string;
  
  // Workload metrics
  tasksCount: number;
  tasksDueThisWeek: number;
  deliverablesCount: number;
  deliverablesDueThisWeek: number;
  activeProjectsCount: number;
  meetingsToday: number;
  currentTopClients: string[];
  lastActivityAt: string;
  
  // Computed
  workloadScore: number; // 0-100
  status: 'overloaded' | 'on-track' | 'underutilized';
  
  // Performance tracking
  deliverableCompletionRate: number; // percentage
  avgTimeToComplete: number; // days
  recordsCreatedThisWeek: number;
  clientTouchpoints: number;
  qaFlags: number;
}

export interface EmployeeTask {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  projectId?: string;
  clientId?: string;
  clientName?: string;
}

export interface EmployeeDeliverable {
  id: string;
  userId: string;
  title: string;
  type: string;
  clientId: string;
  clientName: string;
  dueDate: string;
  status: 'draft' | 'in-review' | 'final' | 'sent';
  recordId?: string;
  blockers?: string[];
  collaborators?: string[];
}

export interface QuarterlyReview {
  id: string;
  userId: string;
  userName: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  
  // Review content
  goals: string[];
  outcomes: string[];
  strengths: string[];
  growthAreas: string[];
  clientImpactHighlights: string[];
  managerNotes: string;
  employeeSelfReview?: string;
  
  // Rating (optional)
  rating?: 'exceeds' | 'meets' | 'needs-improvement';
  
  // Metadata
  createdAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
  status: 'draft' | 'completed';
}

export interface PythiaInsight {
  id: string;
  userId: string;
  type: 'deadline-reliability' | 'load-risk' | 'client-concentration' | 'quality-signal' | 'burnout-risk';
  title: string;
  summary: string;
  evidence: string[];
  severity: 'info' | 'warning' | 'critical';
  recommendations: {
    action: string;
    buttonLabel: string;
    actionType: 'reassign' | 'add-collaborator' | 'create-task' | 'schedule-meeting';
  }[];
  createdAt: string;
}

export interface ManagerAction {
  id: string;
  priority: number;
  type: 'reassign' | 'add-collaborator' | 'follow-up' | 'review' | 'deadline';
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  deliverableId?: string;
  taskId?: string;
  dueDate?: string;
  quickActions: {
    label: string;
    action: string;
  }[];
}

export interface WorkloadRebalancePlan {
  id: string;
  createdAt: string;
  createdBy: string;
  timeWindow: string;
  changes: {
    type: 'reassign' | 'add-collaborator' | 'shift-deadline' | 'create-subtask';
    fromUserId: string;
    fromUserName: string;
    toUserId?: string;
    toUserName?: string;
    itemId: string;
    itemTitle: string;
    itemType: 'task' | 'deliverable';
    reason: string;
  }[];
  status: 'proposed' | 'approved' | 'executed';
}

export interface PerformanceGoal {
  id: string;
  userId: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  year: number;
  goal: string;
  target: number;
  current: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'achieved';
}

// Mock Data
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    name: 'Jordan Davis',
    email: 'jordan@echocanyonconsulting.com',
    role: 'Senior Government Relations Specialist',
    title: 'Senior Specialist',
    departments: ['lobbying', 'public-affairs'],
    team: 'Lobbying Team',
    tasksCount: 14,
    tasksDueThisWeek: 6,
    deliverablesCount: 3,
    deliverablesDueThisWeek: 2,
    activeProjectsCount: 4,
    meetingsToday: 2,
    currentTopClients: ['SolarTech Alliance', 'Clean Energy Fund'],
    lastActivityAt: '2025-12-19T16:30:00Z',
    workloadScore: 78,
    status: 'on-track',
    deliverableCompletionRate: 92,
    avgTimeToComplete: 3.5,
    recordsCreatedThisWeek: 4,
    clientTouchpoints: 8,
    qaFlags: 0
  },
  {
    id: 'user-002',
    name: 'Matt Kenney',
    email: 'matt@echocanyonconsulting.com',
    role: 'Government Relations Specialist',
    title: 'PA President',
    departments: ['lobbying'],
    team: 'Lobbying Team',
    tasksCount: 18,
    tasksDueThisWeek: 9,
    deliverablesCount: 4,
    deliverablesDueThisWeek: 3,
    activeProjectsCount: 5,
    meetingsToday: 3,
    currentTopClients: ['SolarTech Alliance', 'Arizona Manufacturing'],
    lastActivityAt: '2025-12-19T18:15:00Z',
    workloadScore: 89,
    status: 'overloaded',
    deliverableCompletionRate: 85,
    avgTimeToComplete: 4.2,
    recordsCreatedThisWeek: 3,
    clientTouchpoints: 12,
    qaFlags: 1
  },
  {
    id: 'user-003',
    name: 'Sarah Kim',
    email: 'sarah@echocanyonconsulting.com',
    role: 'Policy Analyst',
    title: 'Analyst',
    departments: ['lobbying', 'public-affairs'],
    team: 'Policy Team',
    tasksCount: 8,
    tasksDueThisWeek: 3,
    deliverablesCount: 2,
    deliverablesDueThisWeek: 1,
    activeProjectsCount: 3,
    meetingsToday: 1,
    currentTopClients: ['Arizona Manufacturing', 'Tech Trade Association'],
    lastActivityAt: '2025-12-19T14:45:00Z',
    workloadScore: 52,
    status: 'on-track',
    deliverableCompletionRate: 96,
    avgTimeToComplete: 2.8,
    recordsCreatedThisWeek: 5,
    clientTouchpoints: 6,
    qaFlags: 0
  },
  {
    id: 'user-004',
    name: 'Emily Chen',
    email: 'emily@echocanyonconsulting.com',
    role: 'Field Director',
    title: 'Director',
    departments: ['campaign-services'],
    team: 'Canvassing Operations',
    tasksCount: 22,
    tasksDueThisWeek: 11,
    deliverablesCount: 5,
    deliverablesDueThisWeek: 4,
    activeProjectsCount: 6,
    meetingsToday: 4,
    currentTopClients: ['CA-45 Campaign', 'AZ-06 Campaign'],
    lastActivityAt: '2025-12-19T17:00:00Z',
    workloadScore: 94,
    status: 'overloaded',
    deliverableCompletionRate: 88,
    avgTimeToComplete: 3.9,
    recordsCreatedThisWeek: 6,
    clientTouchpoints: 15,
    qaFlags: 2
  },
  {
    id: 'user-005',
    name: 'Alex Rodriguez',
    email: 'alex@echocanyonconsulting.com',
    role: 'Communications Specialist',
    title: 'Specialist',
    departments: ['public-affairs'],
    team: 'Communications Team',
    tasksCount: 6,
    tasksDueThisWeek: 2,
    deliverablesCount: 1,
    deliverablesDueThisWeek: 0,
    activeProjectsCount: 2,
    meetingsToday: 1,
    currentTopClients: ['Clean Energy Fund'],
    lastActivityAt: '2025-12-19T11:20:00Z',
    workloadScore: 35,
    status: 'underutilized',
    deliverableCompletionRate: 100,
    avgTimeToComplete: 2.1,
    recordsCreatedThisWeek: 2,
    clientTouchpoints: 3,
    qaFlags: 0
  },
  {
    id: 'user-006',
    name: 'Rachel Morrison',
    email: 'rachel@echocanyonconsulting.com',
    role: 'Canvassing Manager',
    title: 'Manager',
    departments: ['campaign-services'],
    team: 'Canvassing Operations',
    tasksCount: 12,
    tasksDueThisWeek: 5,
    deliverablesCount: 3,
    deliverablesDueThisWeek: 2,
    activeProjectsCount: 4,
    meetingsToday: 2,
    currentTopClients: ['CA-45 Campaign'],
    lastActivityAt: '2025-12-19T15:30:00Z',
    workloadScore: 68,
    status: 'on-track',
    deliverableCompletionRate: 91,
    avgTimeToComplete: 3.2,
    recordsCreatedThisWeek: 3,
    clientTouchpoints: 7,
    qaFlags: 0
  },
];

export const mockEmployeeTasks: { [userId: string]: EmployeeTask[] } = {
  'user-001': [
    {
      id: 'task-001',
      userId: 'user-001',
      title: 'Prepare HB 2847 floor vote talking points',
      dueDate: '2025-12-20T17:00:00Z',
      priority: 'high',
      status: 'in-progress',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance'
    },
    {
      id: 'task-002',
      userId: 'user-001',
      title: 'Schedule meetings with 3 swing vote legislators',
      dueDate: '2025-12-22T17:00:00Z',
      priority: 'high',
      status: 'pending',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance'
    },
  ],
  'user-002': [
    {
      id: 'task-003',
      userId: 'user-002',
      title: 'Draft opposition testimony for HB 789',
      dueDate: '2025-12-21T12:00:00Z',
      priority: 'high',
      status: 'in-progress',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance'
    },
  ],
};

export const mockEmployeeDeliverables: { [userId: string]: EmployeeDeliverable[] } = {
  'user-001': [
    {
      id: 'deliv-001',
      userId: 'user-001',
      title: 'HB 2847 Committee Hearing Prep Packet',
      type: 'hearing-prep',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance',
      dueDate: '2025-12-20T10:00:00Z',
      status: 'final',
      recordId: 'rec-001'
    },
    {
      id: 'deliv-002',
      userId: 'user-001',
      title: 'Weekly Legislative Update',
      type: 'weekly-update',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance',
      dueDate: '2025-12-23T17:00:00Z',
      status: 'draft',
      collaborators: ['user-002']
    },
  ],
  'user-002': [
    {
      id: 'deliv-003',
      userId: 'user-002',
      title: 'Coalition Strategy Session Brief',
      type: 'meeting-brief',
      clientId: 'client-001',
      clientName: 'SolarTech Alliance',
      dueDate: '2025-12-26T14:00:00Z',
      status: 'in-review',
      recordId: 'rec-002'
    },
  ],
};

export const mockQuarterlyReviews: QuarterlyReview[] = [
  {
    id: 'review-001',
    userId: 'user-001',
    userName: 'Jordan Davis',
    quarter: 'Q4',
    year: 2025,
    goals: [
      'Achieve HB 2847 passage through House committee',
      'Maintain 90%+ on-time deliverable completion rate',
      'Build relationships with 5 new legislative offices',
      'Lead coalition strategy for Clean Energy Alliance'
    ],
    outcomes: [
      'HB 2847 passed House Energy Committee 9-2',
      '92% on-time completion rate achieved',
      'Established working relationships with 7 legislative offices',
      'Successfully coordinated 12-member coalition strategy session'
    ],
    strengths: [
      'Strategic thinking and long-term planning',
      'Strong client relationships and communication',
      'Effective coalition building and stakeholder management',
      'Consistent quality in deliverable production'
    ],
    growthAreas: [
      'Delegation and workload management during high-volume periods',
      'Time management for administrative tasks',
      'Increase use of templates and automation tools'
    ],
    clientImpactHighlights: [
      'SolarTech Alliance: Secured critical HB 2847 committee passage',
      'Clean Energy Fund: Expanded coalition from 8 to 12 member organizations',
      'Delivered 18 client-facing reports and briefs, all rated "excellent" by clients'
    ],
    managerNotes: 'Jordan continues to be a top performer and client favorite. Strategic thinking and relationship building are exceptional. Consider promotion to Principal level in Q1 2026. Work on delegation to prevent burnout during peak legislative periods.',
    rating: 'exceeds',
    createdAt: '2025-12-01T10:00:00Z',
    lastUpdatedAt: '2025-12-15T14:30:00Z',
    completedAt: '2025-12-15T14:30:00Z',
    status: 'completed'
  },
];

export const mockPythiaInsights: { [userId: string]: PythiaInsight[] } = {
  'user-002': [
    {
      id: 'insight-001',
      userId: 'user-002',
      type: 'load-risk',
      title: 'High workload next 7 days',
      summary: 'Matt has 9 tasks and 3 deliverables due in the next 7 days, creating overload risk.',
      evidence: [
        'Draft opposition testimony for HB 789 (due Dec 21)',
        'Coalition Strategy Brief (due Dec 26)',
        'Weekly update for Arizona Manufacturing (due Dec 24)',
        '9 tasks across 5 different projects'
      ],
      severity: 'warning',
      recommendations: [
        {
          action: 'Reassign Weekly Update to Sarah Kim (currently at 52% capacity)',
          buttonLabel: 'Reassign',
          actionType: 'reassign'
        },
        {
          action: 'Add Jordan Davis as collaborator on Coalition Brief',
          buttonLabel: 'Add Collaborator',
          actionType: 'add-collaborator'
        }
      ],
      createdAt: '2025-12-19T09:00:00Z'
    },
    {
      id: 'insight-002',
      userId: 'user-002',
      type: 'client-concentration',
      title: 'Client concentration risk',
      summary: '70% of workload focused on SolarTech Alliance, creating potential bottleneck.',
      evidence: [
        '3 of 4 deliverables for SolarTech Alliance',
        '6 of 9 tasks for SolarTech Alliance projects',
        'Single point of contact for 2 critical bills'
      ],
      severity: 'warning',
      recommendations: [
        {
          action: 'Assign Sarah Kim as backup on HB 2847',
          buttonLabel: 'Assign Backup',
          actionType: 'add-collaborator'
        },
        {
          action: 'Create handoff documentation',
          buttonLabel: 'Create Doc',
          actionType: 'create-task'
        }
      ],
      createdAt: '2025-12-19T09:00:00Z'
    }
  ],
  'user-004': [
    {
      id: 'insight-003',
      userId: 'user-004',
      type: 'quality-signal',
      title: 'QA flags increased on CA-45 project',
      summary: 'QA flags increased from 0 to 2 in the last week on canvassing operations.',
      evidence: [
        'Door data entry errors on Dec 15 shift',
        'Incomplete canvasser checklist on Dec 17'
      ],
      severity: 'warning',
      recommendations: [
        {
          action: 'Add QA review step before data submission',
          buttonLabel: 'Update Process',
          actionType: 'create-task'
        },
        {
          action: 'Schedule training session with canvassing team',
          buttonLabel: 'Schedule Training',
          actionType: 'schedule-meeting'
        }
      ],
      createdAt: '2025-12-19T08:00:00Z'
    }
  ],
  'user-001': [
    {
      id: 'insight-004',
      userId: 'user-001',
      type: 'deadline-reliability',
      title: 'Excellent deadline performance',
      summary: '92% of deliverables completed on-time this quarter, exceeding team average of 88%.',
      evidence: [
        '11 of 12 deliverables delivered on or before deadline',
        'Average completion time: 3.5 days (vs team average 3.6)',
        'Zero client complaints about timeliness'
      ],
      severity: 'info',
      recommendations: [
        {
          action: 'Document time management best practices for team',
          buttonLabel: 'Create Guide',
          actionType: 'create-task'
        }
      ],
      createdAt: '2025-12-18T10:00:00Z'
    }
  ]
};

export const mockManagerActions: ManagerAction[] = [
  {
    id: 'action-001',
    priority: 1,
    type: 'reassign',
    title: 'Reassign Weekly Update',
    description: 'Weekly update for Arizona Manufacturing due in 5 days - Matt Kenney is overloaded',
    userId: 'user-002',
    userName: 'Matt Kenney',
    deliverableId: 'deliv-weekly-001',
    dueDate: '2025-12-24T17:00:00Z',
    quickActions: [
      { label: 'Reassign to Sarah', action: 'reassign-user-003' },
      { label: 'Add Collaborator', action: 'add-collab' },
      { label: 'Extend Deadline', action: 'extend-deadline' }
    ]
  },
  {
    id: 'action-002',
    priority: 2,
    type: 'follow-up',
    title: 'Follow up on overdue record',
    description: 'Emily Chen has not submitted door tracker snapshot for CA-45 (due Dec 18)',
    userId: 'user-004',
    userName: 'Emily Chen',
    quickActions: [
      { label: 'Send Reminder', action: 'send-reminder' },
      { label: 'Create Task', action: 'create-task' },
      { label: 'Schedule Check-in', action: 'schedule-meeting' }
    ]
  },
  {
    id: 'action-003',
    priority: 3,
    type: 'add-collaborator',
    title: 'Add backup to HB 2847',
    description: 'Matt Kenney is sole owner of critical HB 2847 work - assign backup',
    userId: 'user-002',
    userName: 'Matt Kenney',
    quickActions: [
      { label: 'Assign Sarah Kim', action: 'assign-user-003' },
      { label: 'Assign Jordan Davis', action: 'assign-user-001' }
    ]
  },
  {
    id: 'action-004',
    priority: 4,
    type: 'deadline',
    title: 'Coalition Brief due in 7 days',
    description: 'Coalition Strategy Session Brief needs final review before Dec 26 meeting',
    userId: 'user-002',
    userName: 'Matt Kenney',
    deliverableId: 'deliv-003',
    dueDate: '2025-12-26T14:00:00Z',
    quickActions: [
      { label: 'Request Status', action: 'status-update' },
      { label: 'Mark for Review', action: 'mark-review' }
    ]
  },
  {
    id: 'action-005',
    priority: 5,
    type: 'review',
    title: 'Complete Q4 reviews',
    description: '3 team members still need Q4 quarterly reviews completed by Dec 31',
    quickActions: [
      { label: 'Start Reviews', action: 'start-reviews' },
      { label: 'Generate Drafts', action: 'generate-drafts' }
    ]
  }
];

export const mockPerformanceGoals: { [userId: string]: PerformanceGoal[] } = {
  'user-001': [
    {
      id: 'goal-001',
      userId: 'user-001',
      quarter: 'Q4',
      year: 2025,
      goal: 'Complete client deliverables on time',
      target: 12,
      current: 11,
      unit: 'deliverables',
      status: 'on-track'
    },
    {
      id: 'goal-002',
      userId: 'user-001',
      quarter: 'Q4',
      year: 2025,
      goal: 'Maintain on-time completion rate above 90%',
      target: 90,
      current: 92,
      unit: '%',
      status: 'achieved'
    }
  ]
};

// Helper functions
export function calculateWorkloadScore(member: TeamMember): number {
  let score = 0;
  
  // Deliverables due 0-3 days
  score += member.deliverablesDueThisWeek * 12;
  
  // Tasks due 0-7 days
  score += member.tasksDueThisWeek * 5;
  
  // Active projects
  score += Math.min(member.activeProjectsCount * 4, 20); // cap at 20
  
  // Meetings today
  score += member.meetingsToday * 2;
  
  // Normalize to 0-100
  return Math.min(Math.round(score), 100);
}

export function getWorkloadStatus(score: number): 'overloaded' | 'on-track' | 'underutilized' {
  if (score >= 80) return 'overloaded';
  if (score <= 40) return 'underutilized';
  return 'on-track';
}

export function getTeamKPIs(members: TeamMember[]): {
  activeDeliverablesThisWeek: number;
  overdueDeliverables: number;
  workloadBalanceScore: number;
  avgTimeToComplete: number;
  recordsCreatedThisWeek: number;
  clientTouchpoints: number;
  qaFlags: number;
  burnoutRiskCount: number;
} {
  const totalMembers = members.length;
  
  return {
    activeDeliverablesThisWeek: members.reduce((sum, m) => sum + m.deliverablesDueThisWeek, 0),
    overdueDeliverables: 3, // Mock value
    workloadBalanceScore: Math.round(
      100 - (members.reduce((sum, m) => sum + Math.abs(m.workloadScore - 65), 0) / totalMembers)
    ),
    avgTimeToComplete: Number((members.reduce((sum, m) => sum + m.avgTimeToComplete, 0) / totalMembers).toFixed(1)),
    recordsCreatedThisWeek: members.reduce((sum, m) => sum + m.recordsCreatedThisWeek, 0),
    clientTouchpoints: members.reduce((sum, m) => sum + m.clientTouchpoints, 0),
    qaFlags: members.reduce((sum, m) => sum + m.qaFlags, 0),
    burnoutRiskCount: members.filter(m => m.workloadScore >= 85 && m.status === 'overloaded').length
  };
}