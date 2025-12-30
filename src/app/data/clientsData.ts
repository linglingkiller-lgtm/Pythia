export interface Client {
  id: string;
  name: string;
  logoInitials?: string; // Company logo initials for watermark
  logoColor?: string; // Brand color for watermark
  tags: string[];
  primaryIssues: string[];
  ownerUserIds: string[];
  
  // Contract
  contractStart: string;
  contractEnd: string;
  contractValueMonthly: number;
  contractValueYTD: number;
  scopeSummary: string;
  
  // Status
  healthStatus: 'green' | 'yellow' | 'red';
  
  // Metrics
  activeIssuesCount: number;
  activeBillsCount: number;
  tasksThisWeekCount: number;
  opportunitiesCount: number;
  
  // Value delivered
  valueDeliveredThisQuarter: {
    briefs: number;
    meetings: number;
    testimony: number;
    amendments: number;
  };
}

export interface ClientIssue {
  id: string;
  clientId: string;
  issueId: string;
  issueName: string;
  priorityLevel: 'high' | 'medium' | 'low';
  heatLevel: number; // 0-100
  relevantBillsCount: number;
  sentimentTrend: 'improving' | 'stable' | 'declining';
  riskOpportunityLabel: 'risk' | 'opportunity' | 'neutral';
  notes?: string;
}

export interface ClientBill {
  id: string;
  clientId: string;
  billId: string;
  billNumber: string;
  billTitle: string;
  status: string;
  statusProgress: number; // 0-100
  stance: 'support' | 'oppose' | 'monitor';
  nextActionDate?: string;
  ownerUserId: string;
  ownerName: string;
  impactRating: 'high' | 'medium' | 'low';
  pinned: boolean;
}

export interface EngagementRecord {
  id: string;
  clientId: string;
  type: 'meeting' | 'call' | 'email' | 'testimony' | 'brief' | 'memo' | 'amendment' | 'coalition';
  date: string;
  time: string;
  summary: string;
  linkedBillIds: string[];
  linkedBillNumbers: string[];
  linkedPersonIds: string[];
  linkedPersonNames: string[];
  linkedIssueIds: string[];
  linkedIssueNames: string[];
  owner: string;
}

export interface Workstream {
  id: string;
  clientId: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'review' | 'complete';
  dueDate?: string;
  progress: number; // 0-100
  ownerUserId: string;
  ownerName: string;
  linkedBillIds: string[];
  linkedIssueIds: string[];
  taskCount: number;
  completedTaskCount: number;
}

export interface Opportunity {
  id: string;
  clientId: string;
  title: string;
  stage: 'identified' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  valueEstimate: number;
  valueType: 'one-time' | 'recurring';
  probability: number; // 0-100
  reasons: string[];
  nextActionTaskId?: string;
  nextActionSummary?: string;
  createdAt: string;
}

export interface AIInsight {
  id: string;
  clientId: string;
  type: 'recommendation' | 'scope-drift' | 'renewal-risk' | 'opportunity' | 'missing-task';
  summary: string;
  reasons: string[];
  confidence: 'high' | 'medium' | 'low';
  createdAt: string;
  actionLabel?: string;
}

export interface ClientContact {
  id: string;
  clientId: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  notes?: string;
  preferences?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  workloadSummary?: string;
}

export interface WeeklyChange {
  id: string;
  message: string;
  type: 'bill' | 'press' | 'meeting' | 'deliverable';
}

// Mock Data
export const mockClients: Client[] = [
  {
    id: 'client-001',
    name: 'SolarTech Alliance',
    logoInitials: 'STA',
    logoColor: '#FFD700',
    tags: ['Energy', 'Trade Association'],
    primaryIssues: ['Clean Energy', 'Grid Modernization', 'Tax Credits'],
    ownerUserIds: ['user-001', 'user-002'],
    contractStart: '2025-01-01',
    contractEnd: '2026-12-31',
    contractValueMonthly: 15000,
    contractValueYTD: 165000,
    scopeSummary: 'Legislative monitoring, advocacy strategy, coalition building, regulatory tracking',
    healthStatus: 'green',
    activeIssuesCount: 3,
    activeBillsCount: 5,
    tasksThisWeekCount: 8,
    opportunitiesCount: 2,
    valueDeliveredThisQuarter: {
      briefs: 12,
      meetings: 18,
      testimony: 3,
      amendments: 2,
    },
  },
  {
    id: 'client-002',
    name: 'Arizona Manufacturing Coalition',
    logoInitials: 'AMC',
    logoColor: '#FF8C00',
    tags: ['Manufacturing', 'Coalition'],
    primaryIssues: ['Workforce Development', 'Tax Reform', 'Infrastructure'],
    ownerUserIds: ['user-003'],
    contractStart: '2024-07-01',
    contractEnd: '2026-06-30',
    contractValueMonthly: 8500,
    contractValueYTD: 93500,
    scopeSummary: 'Bill tracking, testimony support, legislator engagement, quarterly reporting',
    healthStatus: 'yellow',
    activeIssuesCount: 2,
    activeBillsCount: 3,
    tasksThisWeekCount: 4,
    opportunitiesCount: 1,
    valueDeliveredThisQuarter: {
      briefs: 6,
      meetings: 9,
      testimony: 1,
      amendments: 0,
    },
  },
  {
    id: 'client-003',
    name: 'WaterFirst Coalition',
    logoInitials: 'WFC',
    logoColor: '#00BFFF',
    tags: ['Water', 'Coalition'],
    primaryIssues: ['Water Resources', 'Agriculture', 'Environmental'],
    ownerUserIds: ['user-001'],
    contractStart: '2025-03-01',
    contractEnd: '2026-02-28',
    contractValueMonthly: 12000,
    contractValueYTD: 120000,
    scopeSummary: 'Full-service advocacy: monitoring, strategy, testimony, coalition coordination',
    healthStatus: 'green',
    activeIssuesCount: 4,
    activeBillsCount: 7,
    tasksThisWeekCount: 11,
    opportunitiesCount: 3,
    valueDeliveredThisQuarter: {
      briefs: 15,
      meetings: 22,
      testimony: 4,
      amendments: 3,
    },
  },
  {
    id: 'client-004',
    name: 'TechVentures Arizona',
    logoInitials: 'TVA',
    logoColor: '#FF6347',
    tags: ['Technology', 'Corporation'],
    primaryIssues: ['Innovation', 'Tax Credits', 'Workforce'],
    ownerUserIds: ['user-002'],
    contractStart: '2025-06-01',
    contractEnd: '2026-01-15',
    contractValueMonthly: 6000,
    contractValueYTD: 42000,
    scopeSummary: 'Legislative monitoring, quarterly strategy sessions',
    healthStatus: 'red',
    activeIssuesCount: 1,
    activeBillsCount: 2,
    tasksThisWeekCount: 1,
    opportunitiesCount: 1,
    valueDeliveredThisQuarter: {
      briefs: 3,
      meetings: 4,
      testimony: 0,
      amendments: 0,
    },
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-001',
    name: 'Jordan Davis',
    role: 'Senior Strategist',
    initials: 'JD',
    workloadSummary: '3 clients, 24 active tasks',
  },
  {
    id: 'user-002',
    name: 'Matt Kenny',
    role: 'Policy Director',
    initials: 'MK',
    workloadSummary: '2 clients, 16 active tasks',
  },
  {
    id: 'user-003',
    name: 'Sarah Kim',
    role: 'Account Manager',
    initials: 'SK',
    workloadSummary: '2 clients, 12 active tasks',
  },
];

export const mockClientIssues: { [clientId: string]: ClientIssue[] } = {
  'client-001': [
    {
      id: 'ci-001',
      clientId: 'client-001',
      issueId: 'issue-001',
      issueName: 'Clean Energy',
      priorityLevel: 'high',
      heatLevel: 88,
      relevantBillsCount: 3,
      sentimentTrend: 'improving',
      riskOpportunityLabel: 'opportunity',
    },
    {
      id: 'ci-002',
      clientId: 'client-001',
      issueId: 'issue-002',
      issueName: 'Grid Modernization',
      priorityLevel: 'high',
      heatLevel: 72,
      relevantBillsCount: 2,
      sentimentTrend: 'stable',
      riskOpportunityLabel: 'neutral',
    },
    {
      id: 'ci-003',
      clientId: 'client-001',
      issueId: 'issue-003',
      issueName: 'Tax Credits',
      priorityLevel: 'medium',
      heatLevel: 45,
      relevantBillsCount: 1,
      sentimentTrend: 'stable',
      riskOpportunityLabel: 'neutral',
    },
  ],
};

export const mockClientBills: { [clientId: string]: ClientBill[] } = {
  'client-001': [
    {
      id: 'cb-001',
      clientId: 'client-001',
      billId: 'bill-1',
      billNumber: 'HB 2847',
      billTitle: 'Renewable Energy Standards Act',
      status: 'Committee',
      statusProgress: 35,
      stance: 'support',
      nextActionDate: '2025-12-20',
      ownerUserId: 'user-001',
      ownerName: 'Jordan Davis',
      impactRating: 'high',
      pinned: true,
    },
    {
      id: 'cb-002',
      clientId: 'client-001',
      billId: 'bill-002',
      billNumber: 'SB 456',
      billTitle: 'Solar Incentive Program Extension',
      status: 'Senate Floor',
      statusProgress: 65,
      stance: 'support',
      nextActionDate: '2025-12-22',
      ownerUserId: 'user-001',
      ownerName: 'Jordan Davis',
      impactRating: 'high',
      pinned: true,
    },
    {
      id: 'cb-003',
      clientId: 'client-001',
      billId: 'bill-003',
      billNumber: 'HB 789',
      billTitle: 'Utility Rate Reform',
      status: 'Committee',
      statusProgress: 25,
      stance: 'oppose',
      nextActionDate: '2026-01-05',
      ownerUserId: 'user-002',
      ownerName: 'Matt Kenny',
      impactRating: 'medium',
      pinned: false,
    },
  ],
};

export const mockEngagementRecords: { [clientId: string]: EngagementRecord[] } = {
  'client-001': [
    {
      id: 'er-001',
      clientId: 'client-001',
      type: 'meeting',
      date: '2025-12-15',
      time: '2:00 PM',
      summary: 'Strategy session with Rep. Martinez re: HB 2847 amendments',
      linkedBillIds: ['bill-1'],
      linkedBillNumbers: ['HB 2847'],
      linkedPersonIds: ['leg-001'],
      linkedPersonNames: ['Sarah Martinez'],
      linkedIssueIds: ['issue-001'],
      linkedIssueNames: ['Clean Energy'],
      owner: 'Jordan Davis',
    },
    {
      id: 'er-002',
      clientId: 'client-001',
      type: 'testimony',
      date: '2025-12-12',
      time: '10:00 AM',
      summary: 'Submitted written testimony supporting HB 2847 in House Energy Committee',
      linkedBillIds: ['bill-1'],
      linkedBillNumbers: ['HB 2847'],
      linkedPersonIds: [],
      linkedPersonNames: [],
      linkedIssueIds: ['issue-001'],
      linkedIssueNames: ['Clean Energy'],
      owner: 'Matt Kenny',
    },
    {
      id: 'er-003',
      clientId: 'client-001',
      type: 'brief',
      date: '2025-12-10',
      time: '9:00 AM',
      summary: 'Created and delivered weekly legislative brief to client stakeholders',
      linkedBillIds: ['bill-1', 'bill-2'],
      linkedBillNumbers: ['HB 2847', 'SB 456'],
      linkedPersonIds: [],
      linkedPersonNames: [],
      linkedIssueIds: ['issue-001'],
      linkedIssueNames: ['Clean Energy'],
      owner: 'Jordan Davis',
    },
    {
      id: 'er-004',
      clientId: 'client-001',
      type: 'amendment',
      date: '2025-12-08',
      time: '3:00 PM',
      summary: 'Drafted and submitted amendment proposal for HB 2847 timeline extension',
      linkedBillIds: ['bill-1'],
      linkedBillNumbers: ['HB 2847'],
      linkedPersonIds: ['leg-001'],
      linkedPersonNames: ['Sarah Martinez'],
      linkedIssueIds: ['issue-001'],
      linkedIssueNames: ['Clean Energy'],
      owner: 'Matt Kenny',
    },
    {
      id: 'er-005',
      clientId: 'client-001',
      type: 'call',
      date: '2025-12-05',
      time: '11:30 AM',
      summary: 'Phone call with Rebecca Torres (Energy LA) discussing committee strategy',
      linkedBillIds: ['bill-1'],
      linkedBillNumbers: ['HB 2847'],
      linkedPersonIds: [],
      linkedPersonNames: [],
      linkedIssueIds: ['issue-001'],
      linkedIssueNames: ['Clean Energy'],
      owner: 'Jordan Davis',
    },
  ],
};

export const mockWorkstreams: { [clientId: string]: Workstream[] } = {
  'client-001': [
    {
      id: 'ws-001',
      clientId: 'client-001',
      name: 'HB 2847 Hearing Prep',
      status: 'in-progress',
      dueDate: '2025-12-20',
      progress: 75,
      ownerUserId: 'user-001',
      ownerName: 'Jordan Davis',
      linkedBillIds: ['bill-1'],
      linkedIssueIds: ['issue-001'],
      taskCount: 8,
      completedTaskCount: 6,
    },
    {
      id: 'ws-002',
      clientId: 'client-001',
      name: 'Coalition Alignment - Clean Energy Coalition',
      status: 'in-progress',
      dueDate: '2025-12-28',
      progress: 45,
      ownerUserId: 'user-002',
      ownerName: 'Matt Kenny',
      linkedBillIds: ['bill-1', 'bill-2'],
      linkedIssueIds: ['issue-001'],
      taskCount: 5,
      completedTaskCount: 2,
    },
    {
      id: 'ws-003',
      clientId: 'client-001',
      name: 'Client Weekly Updates (December)',
      status: 'in-progress',
      dueDate: '2025-12-31',
      progress: 60,
      ownerUserId: 'user-001',
      ownerName: 'Jordan Davis',
      linkedBillIds: [],
      linkedIssueIds: [],
      taskCount: 4,
      completedTaskCount: 2,
    },
  ],
};

export const mockOpportunities: { [clientId: string]: Opportunity[] } = {
  'client-001': [
    {
      id: 'opp-001',
      clientId: 'client-001',
      title: 'Expand to campaign services for 2026 solar champion races',
      stage: 'identified',
      valueEstimate: 35000,
      valueType: 'one-time',
      probability: 65,
      reasons: [
        'Client has 3 legislators in competitive races',
        'Strong alignment with client mission',
        'Contract renewal conversation upcoming',
      ],
      nextActionSummary: 'Schedule pitch meeting with client leadership',
      createdAt: '2025-12-14',
    },
    {
      id: 'opp-002',
      clientId: 'client-001',
      title: 'Add regulatory tracking module (Corporation Commission)',
      stage: 'contacted',
      valueEstimate: 3500,
      valueType: 'recurring',
      probability: 80,
      reasons: [
        'Client asked about Corp Comm proceedings twice this month',
        'Utility rate cases directly impact client priorities',
        'Easy add-on to existing scope',
      ],
      nextActionSummary: 'Send proposal and pricing',
      createdAt: '2025-12-10',
    },
  ],
};

export const mockAIInsights: { [clientId: string]: AIInsight[] } = {
  'client-001': [
    {
      id: 'ai-001',
      clientId: 'client-001',
      type: 'recommendation',
      summary: 'Schedule amendment strategy session with Sen. Patterson before Jan 5',
      reasons: [
        'SB 456 floor vote window opens Jan 8',
        'Patterson has requested amendments per last interaction',
        'No meeting currently scheduled',
      ],
      confidence: 'high',
      createdAt: '2025-12-17',
      actionLabel: 'Create Task',
    },
    {
      id: 'ai-002',
      clientId: 'client-001',
      type: 'missing-task',
      summary: 'HB 2847 hearing in 3 days - no testimony draft task exists',
      reasons: [
        'Committee hearing scheduled for Dec 20',
        'Testimony typically required 48 hours in advance',
        'No related task found in system',
      ],
      confidence: 'high',
      createdAt: '2025-12-17',
      actionLabel: 'Create Task',
    },
    {
      id: 'ai-003',
      clientId: 'client-001',
      type: 'opportunity',
      summary: 'High activity + contract ending soon = renewal packaging opportunity',
      reasons: [
        'Contract ends in 378 days',
        'Delivered 40 touchpoints this quarter (above average)',
        'Client has initiated 3 new priority areas',
      ],
      confidence: 'medium',
      createdAt: '2025-12-16',
      actionLabel: 'Add to Pipeline',
    },
  ],
};

export const mockClientContacts: { [clientId: string]: ClientContact[] } = {
  'client-001': [
    {
      id: 'cc-001',
      clientId: 'client-001',
      name: 'Jennifer Rodriguez',
      role: 'Executive Director',
      email: 'jrodriguez@solartechalliance.org',
      phone: '(602) 555-1234',
      notes: 'Primary decision-maker. Prefers email over calls.',
      preferences: 'Weekly updates on Fridays by 3 PM',
    },
    {
      id: 'cc-002',
      clientId: 'client-001',
      name: 'Marcus Thompson',
      role: 'Policy Director',
      email: 'mthompson@solartechalliance.org',
      phone: '(602) 555-1235',
      notes: 'Day-to-day contact for legislative matters',
      preferences: 'Available for calls Mon-Thu mornings',
    },
    {
      id: 'cc-003',
      clientId: 'client-001',
      name: 'Lisa Chen',
      role: 'Communications Manager',
      email: 'lchen@solartechalliance.org',
      phone: '(602) 555-1236',
      notes: 'Handles all media and messaging',
    },
  ],
};

export const mockWeeklyChanges: { [clientId: string]: WeeklyChange[] } = {
  'client-001': [
    {
      id: 'wc-001',
      message: 'HB 2847 moved to committee agenda for Dec 20 hearing',
      type: 'bill',
    },
    {
      id: 'wc-002',
      message: '2 new mentions in Arizona Republic coverage',
      type: 'press',
    },
    {
      id: 'wc-003',
      message: '1 meeting logged with Energy Committee Chair',
      type: 'meeting',
    },
    {
      id: 'wc-004',
      message: 'Draft testimony created and submitted for review',
      type: 'deliverable',
    },
    {
      id: 'wc-005',
      message: 'Amendment proposal delivered to sponsor office',
      type: 'deliverable',
    },
  ],
};