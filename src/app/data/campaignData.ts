// Campaign Services Central Planner Data Models

export interface CampaignProject {
  id: string;
  clientId: string;
  clientName: string;
  districtId: string;
  districtName: string;
  title: string;
  type: 'candidate-launch' | 'fundraising' | 'persuasion-digital' | 'mail' | 'field-gotv' | 'debate-prep' | 'ballot-chase' | 'custom';
  stage: 'drafting' | 'proposal' | 'build' | 'launch' | 'review' | 'completed' | 'on-hold';
  owners: ProjectOwner[];
  deadlines: ProjectDeadline[];
  linkedDeliverableIds: string[];
  linkedTaskIds: string[];
  kpis?: ProjectKPIs;
  riskFlags: RiskFlag[];
  progress: {
    tasks: number; // percentage
    deliverables: number; // percentage
  };
  budget?: {
    allocated: number;
    spent: number;
    forecast: number;
  };
  createdDate: string;
  lastUpdated: string;
}

export interface ProjectOwner {
  id: string;
  name: string;
  role: 'pm' | 'field-lead' | 'digital-lead' | 'compliance' | 'consultant';
  avatar?: string;
}

export interface ProjectDeadline {
  id: string;
  name: string;
  date: string;
  type: 'milestone' | 'deliverable' | 'event';
  completed: boolean;
}

export interface ProjectKPIs {
  field?: {
    doorsKnocked?: number;
    conversations?: number;
    persuasionRate?: number;
  };
  digital?: {
    ctr?: number;
    cpa?: number;
    conversions?: number;
  };
  fundraising?: {
    callTime?: number;
    pledges?: number;
    avgDonation?: number;
  };
}

export interface RiskFlag {
  type: 'overdue' | 'under-resourced' | 'blocked' | 'budget-risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

export interface FieldShift {
  id: string;
  projectId: string;
  projectName: string;
  dateTime: string;
  turfId: string;
  turfName: string;
  leadId: string;
  leadName: string;
  roster: string[];
  goalMetrics: {
    doors: number;
    contacts: number;
  };
  materialsStatus: 'ready' | 'pending' | 'not-started';
  actualResults?: {
    doorsKnocked: number;
    conversations: number;
    persuasionIds: number;
  };
}

export interface CampaignEvent {
  id: string;
  districtId: string;
  districtName: string;
  title: string;
  dateTime: string;
  location: string;
  type: 'town-hall' | 'civic-meeting' | 'forum' | 'fundraiser' | 'conference' | 'community-event';
  aiScore: number; // 0-100
  relevance: 'high' | 'medium' | 'low';
  recommendedObjective: string;
  assignedStaffIds: string[];
  linkedProjectId?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  expectedInfluence: number; // 0-100
}

export interface DataPullRequest {
  id: string;
  clientId: string;
  clientName: string;
  projectId?: string;
  projectName?: string;
  districtId: string;
  districtName: string;
  universeType: 'likely-voters' | 'persuasion' | 'donors' | 'volunteers' | 'absentee' | 'custom';
  constraints?: string;
  outputType: 'walk-list' | 'call-list' | 'mail-universe' | 'analysis';
  status: 'requested' | 'in-progress' | 'delivered' | 'in-field';
  requestedBy: string;
  requestedDate: string;
  deliveredDate?: string;
  deliveredRef?: string;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectId: string; // e.g., "NJ-11", "VA-24"
  source: 'referral' | 'ad' | 'event' | 'website' | 'walk-in';
  stage: 'new' | 'contacted' | 'interview-scheduled' | 'interviewed' | 'offer-sent' | 'accepted' | 'background-check' | 'cleared' | 'training-scheduled' | 'onboarded' | 'rejected';
  assignedRecruiterId: string;
  assignedRecruiterName: string;
  appliedDate: string;
  notes: string;
  backgroundCheckStatus: 'not-started' | 'in-progress' | 'cleared' | 'review-needed' | 'not-eligible';
  trainingStatus: {
    paperwork: boolean;
    appSetup: boolean;
    scriptTraining: boolean;
    turfTraining: boolean;
    firstShiftScheduled: boolean;
  };
  nextStep?: string;
  nextStepDate?: string;
}

export interface DistrictPulse {
  id: string;
  districtName: string;
  raceType: 'state-house' | 'state-senate' | 'city-council' | 'mayor' | 'other';
  competitiveness: number; // 0-100
  confidence: number; // 0-100
  clientStatus: 'prospect' | 'active' | 'paused' | 'completed';
  clientName?: string;
  nextDeadline: {
    type: string;
    date: string;
    name: string;
  };
  recommendedActions: string[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  type: CampaignProject['type'];
  icon: string;
  stages: string[];
  defaultDeliverables: TemplateDeliverable[];
  defaultTasks: TemplateTask[];
  defaultOwners: string[];
  estimatedDuration: number; // days
}

export interface TemplateDeliverable {
  name: string;
  type: string;
  stage: string;
  daysFromStart: number;
}

export interface TemplateTask {
  name: string;
  stage: string;
  owner: string;
  daysFromStart: number;
  estimatedHours: number;
}

export interface AIInsight {
  id: string;
  scope: 'district' | 'project' | 'client' | 'system';
  scopeId: string;
  type: 'risk' | 'opportunity' | 'recommendation' | 'alert';
  summary: string;
  reasons: string[];
  confidence: number; // 0-100
  sources: string[];
  createdDate: string;
}

// Seed Data

export const campaignProjects: CampaignProject[] = [
  {
    id: 'ca-45',
    clientId: 'client-tga',
    clientName: 'TGA',
    districtId: 'ca-45',
    districtName: 'CA-45 (Orange County)',
    title: 'CA-45 Canvassing',
    type: 'field-gotv',
    stage: 'launch',
    owners: [
      { id: 'owner-1', name: 'Ben Blaser', role: 'field-lead' },
      { id: 'owner-2', name: 'Jordan Hayes', role: 'pm' }
    ],
    deadlines: [
      { id: 'dl-1', name: 'Hire 8 additional canvassers', date: '2026-02-22', type: 'milestone', completed: false },
      { id: 'dl-2', name: 'Hit 15,000 door goal', date: '2026-03-01', type: 'milestone', completed: false },
      { id: 'dl-3', name: 'Final turf allocation', date: '2026-02-20', type: 'deliverable', completed: false }
    ],
    linkedDeliverableIds: ['deliv-001', 'deliv-002'],
    linkedTaskIds: ['task-101', 'task-102', 'task-103'],
    kpis: {
      field: {
        doorsKnocked: 10240,
        conversations: 1946,
        persuasionRate: 19
      }
    },
    riskFlags: [
      {
        type: 'under-resourced',
        severity: 'critical',
        message: 'Behind pace by 950 doors/day - need 8 more canvassers'
      }
    ],
    progress: {
      tasks: 68,
      deliverables: 65
    },
    budget: {
      allocated: 85000,
      spent: 52000,
      forecast: 88000
    },
    createdDate: '2026-01-15',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'nj-11',
    clientId: 'client-ammaj',
    clientName: 'American Majority',
    districtId: 'nj-11',
    districtName: 'NJ-11 (Morris County)',
    title: 'NJ-11 Door Knock',
    type: 'field-gotv',
    stage: 'launch',
    owners: [
      { id: 'owner-3', name: 'Sam Chen', role: 'field-lead' },
      { id: 'owner-1', name: 'Ben Blaser', role: 'pm' }
    ],
    deadlines: [
      { id: 'dl-4', name: 'Assign field lead', date: '2026-02-20', type: 'milestone', completed: false },
      { id: 'dl-5', name: 'Complete 8,500 doors', date: '2026-02-28', type: 'milestone', completed: false },
      { id: 'dl-6', name: 'QA spot check', date: '2026-02-23', type: 'deliverable', completed: false }
    ],
    linkedDeliverableIds: ['deliv-010', 'deliv-011'],
    linkedTaskIds: ['task-201', 'task-202'],
    kpis: {
      field: {
        doorsKnocked: 6200,
        conversations: 1178,
        persuasionRate: 19
      }
    },
    riskFlags: [],
    progress: {
      tasks: 73,
      deliverables: 70
    },
    budget: {
      allocated: 48000,
      spent: 35000,
      forecast: 47500
    },
    createdDate: '2026-01-20',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'va-24',
    clientId: 'client-tga',
    clientName: 'TGA',
    districtId: 'va-24',
    districtName: 'VA-24 (Loudoun County)',
    title: 'VA-24 Outreach',
    type: 'field-gotv',
    stage: 'launch',
    owners: [
      { id: 'owner-2', name: 'Jordan Hayes', role: 'field-lead' },
      { id: 'owner-4', name: 'Taylor Brooks', role: 'pm' }
    ],
    deadlines: [
      { id: 'dl-7', name: 'Fill 4 weekend shift gaps', date: '2026-02-21', type: 'milestone', completed: false },
      { id: 'dl-8', name: 'Complete 12,000 doors', date: '2026-02-25', type: 'milestone', completed: false },
      { id: 'dl-9', name: 'Schedule 6 additional weekend shifts', date: '2026-02-22', type: 'deliverable', completed: false }
    ],
    linkedDeliverableIds: ['deliv-020'],
    linkedTaskIds: ['task-301', 'task-302', 'task-303', 'task-304'],
    kpis: {
      field: {
        doorsKnocked: 7500,
        conversations: 1425,
        persuasionRate: 19
      }
    },
    riskFlags: [
      {
        type: 'under-resourced',
        severity: 'medium',
        message: '4 shift gaps causing 70 doors/day shortfall'
      }
    ],
    progress: {
      tasks: 63,
      deliverables: 60
    },
    budget: {
      allocated: 62000,
      spent: 38000,
      forecast: 64000
    },
    createdDate: '2026-01-10',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'pa-18',
    clientId: 'client-ammaj',
    clientName: 'American Majority',
    districtId: 'pa-18',
    districtName: 'PA-18 (Allegheny County)',
    title: 'PA-18 Canvass',
    type: 'field-gotv',
    stage: 'launch',
    owners: [
      { id: 'owner-5', name: 'Morgan Kim', role: 'field-lead' },
      { id: 'owner-1', name: 'Ben Blaser', role: 'pm' }
    ],
    deadlines: [
      { id: 'dl-10', name: 'Complete 20,000 doors', date: '2026-03-15', type: 'milestone', completed: false },
      { id: 'dl-11', name: 'Walk list refresh zones 4-7', date: '2026-02-25', type: 'deliverable', completed: false },
      { id: 'dl-12', name: 'Maintain 21 shifts/week', date: '2026-02-28', type: 'milestone', completed: false }
    ],
    linkedDeliverableIds: ['deliv-030'],
    linkedTaskIds: ['task-401'],
    kpis: {
      field: {
        doorsKnocked: 15200,
        conversations: 2888,
        persuasionRate: 19
      }
    },
    riskFlags: [],
    progress: {
      tasks: 76,
      deliverables: 75
    },
    budget: {
      allocated: 105000,
      spent: 72000,
      forecast: 103000
    },
    createdDate: '2026-01-05',
    lastUpdated: '2026-02-18'
  },
  {
    id: 'ga-34',
    clientId: 'client-tga',
    clientName: 'TGA',
    districtId: 'ga-34',
    districtName: 'GA-34 (Gwinnett County)',
    title: 'GA-34 Field Program',
    type: 'field-gotv',
    stage: 'build',
    owners: [
      { id: 'owner-6', name: 'Alex Rivera', role: 'field-lead' },
      { id: 'owner-2', name: 'Jordan Hayes', role: 'pm' }
    ],
    deadlines: [
      { id: 'dl-13', name: 'Urgent turf pull request', date: '2026-02-20', type: 'deliverable', completed: false },
      { id: 'dl-14', name: 'Recruit 3 additional canvassers', date: '2026-02-25', type: 'milestone', completed: false },
      { id: 'dl-15', name: 'Complete 10,000 doors', date: '2026-03-20', type: 'milestone', completed: false }
    ],
    linkedDeliverableIds: ['deliv-040'],
    linkedTaskIds: ['task-501', 'task-502'],
    kpis: {
      field: {
        doorsKnocked: 3200,
        conversations: 608,
        persuasionRate: 19
      }
    },
    riskFlags: [
      {
        type: 'blocked',
        severity: 'critical',
        message: 'No walk lists - team idle for next 5 days'
      },
      {
        type: 'under-resourced',
        severity: 'high',
        message: 'Need 3 more canvassers to hit 425 doors/day pace'
      }
    ],
    progress: {
      tasks: 32,
      deliverables: 28
    },
    budget: {
      allocated: 55000,
      spent: 18000,
      forecast: 58000
    },
    createdDate: '2026-02-01',
    lastUpdated: '2026-02-18'
  }
];

export const fieldShifts: FieldShift[] = [
  {
    id: 'shift-001',
    projectId: 'proj-001',
    projectName: 'Martinez for HD-12 - Candidate Launch',
    dateTime: '2026-02-08T10:00:00',
    turfId: 'turf-north-12',
    turfName: 'North Precinct 12',
    leadId: 'lead-jordan',
    leadName: 'Jordan Hayes',
    roster: ['volunteer-1', 'volunteer-2', 'volunteer-3', 'volunteer-4'],
    goalMetrics: {
      doors: 200,
      contacts: 80
    },
    materialsStatus: 'ready',
    actualResults: {
      doorsKnocked: 185,
      conversations: 72,
      persuasionIds: 28
    }
  },
  {
    id: 'shift-002',
    projectId: 'proj-003',
    projectName: 'Thompson GOTV Push',
    dateTime: '2026-02-10T14:00:00',
    turfId: 'turf-central-45',
    turfName: 'Central District 45',
    leadId: 'lead-taylor',
    leadName: 'Taylor Brooks',
    roster: ['volunteer-5', 'volunteer-6'],
    goalMetrics: {
      doors: 150,
      contacts: 60
    },
    materialsStatus: 'pending'
  },
  {
    id: 'shift-003',
    projectId: 'proj-001',
    projectName: 'Martinez for HD-12',
    dateTime: '2026-02-12T09:00:00',
    turfId: 'turf-south-12',
    turfName: 'South Precinct 12',
    leadId: 'lead-jordan',
    leadName: 'Jordan Hayes',
    roster: ['volunteer-7', 'volunteer-8', 'volunteer-9'],
    goalMetrics: {
      doors: 180,
      contacts: 70
    },
    materialsStatus: 'ready'
  }
];

export const campaignEvents: CampaignEvent[] = [
  {
    id: 'event-001',
    districtId: 'hd-12',
    districtName: 'House District 12',
    title: 'City Council Town Hall - Infrastructure',
    dateTime: '2026-02-15T18:30:00',
    location: 'Community Center, Main St',
    type: 'town-hall',
    aiScore: 92,
    relevance: 'high',
    recommendedObjective: 'Collect supporter IDs, identify volunteers',
    assignedStaffIds: ['staff-alex'],
    linkedProjectId: 'proj-001',
    riskLevel: 'low',
    expectedInfluence: 85
  },
  {
    id: 'event-002',
    districtId: 'sd-8',
    districtName: 'Senate District 8',
    title: 'Chamber of Commerce Candidate Forum',
    dateTime: '2026-02-20T12:00:00',
    location: 'Chamber Building Downtown',
    type: 'forum',
    aiScore: 88,
    relevance: 'high',
    recommendedObjective: 'Meet business leaders, prep debate talking points',
    assignedStaffIds: ['staff-sam'],
    linkedProjectId: 'proj-002',
    riskLevel: 'medium',
    expectedInfluence: 78
  },
  {
    id: 'event-003',
    districtId: 'hd-45',
    districtName: 'House District 45',
    title: 'Neighborhood Association Meeting',
    dateTime: '2026-02-18T19:00:00',
    location: 'Oak Ridge Library',
    type: 'civic-meeting',
    aiScore: 75,
    relevance: 'medium',
    recommendedObjective: 'Build precinct chair relationship',
    assignedStaffIds: [],
    riskLevel: 'low',
    expectedInfluence: 65
  },
  {
    id: 'event-004',
    districtId: 'hd-12',
    districtName: 'House District 12',
    title: 'Martinez Campaign Fundraiser',
    dateTime: '2026-02-14T17:30:00',
    location: 'Private Residence',
    type: 'fundraiser',
    aiScore: 95,
    relevance: 'high',
    recommendedObjective: 'Raise $15K, identify major donor prospects',
    assignedStaffIds: ['staff-morgan'],
    linkedProjectId: 'proj-004',
    riskLevel: 'low',
    expectedInfluence: 90
  }
];

export const dataPullRequests: DataPullRequest[] = [
  {
    id: 'data-001',
    clientId: 'client-martinez',
    clientName: 'Sarah Martinez',
    projectId: 'proj-001',
    projectName: 'Martinez for HD-12',
    districtId: 'hd-12',
    districtName: 'House District 12',
    universeType: 'persuasion',
    constraints: 'Age 25-55, High Turnout Score',
    outputType: 'walk-list',
    status: 'delivered',
    requestedBy: 'Jordan Hayes',
    requestedDate: '2026-02-01',
    deliveredDate: '2026-02-03',
    deliveredRef: 'WL-HD12-PERS-001'
  },
  {
    id: 'data-002',
    clientId: 'client-chen',
    clientName: 'David Chen',
    projectId: 'proj-002',
    projectName: 'Chen Digital Program',
    districtId: 'sd-8',
    districtName: 'Senate District 8',
    universeType: 'likely-voters',
    constraints: 'Digital targeting: Facebook Custom Audience',
    outputType: 'analysis',
    status: 'in-progress',
    requestedBy: 'Sam Chen',
    requestedDate: '2026-02-05'
  },
  {
    id: 'data-003',
    clientId: 'client-thompson',
    clientName: 'Jennifer Thompson',
    projectId: 'proj-003',
    projectName: 'Thompson GOTV',
    districtId: 'hd-45',
    districtName: 'House District 45',
    universeType: 'absentee',
    constraints: 'Requested absentee ballot, not yet returned',
    outputType: 'call-list',
    status: 'requested',
    requestedBy: 'Taylor Brooks',
    requestedDate: '2026-02-06'
  }
];

export const applicants: Applicant[] = [
  {
    id: 'app-001',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 234-5678',
    projectId: 'NJ-11',
    source: 'referral',
    stage: 'cleared',
    assignedRecruiterId: 'rec-jordan',
    assignedRecruiterName: 'Jordan Hayes',
    appliedDate: '2026-01-28',
    notes: 'Strong referral from county party. Previous field experience.',
    backgroundCheckStatus: 'cleared',
    trainingStatus: {
      paperwork: true,
      appSetup: true,
      scriptTraining: true,
      turfTraining: false,
      firstShiftScheduled: false
    },
    nextStep: 'Schedule turf training',
    nextStepDate: '2026-02-09'
  },
  {
    id: 'app-002',
    name: 'Marcus Williams',
    email: 'marcus.w@email.com',
    phone: '(555) 345-6789',
    projectId: 'VA-24',
    source: 'ad',
    stage: 'background-check',
    assignedRecruiterId: 'rec-taylor',
    assignedRecruiterName: 'Taylor Brooks',
    appliedDate: '2026-02-01',
    notes: 'Responded to Facebook ad. Enthusiastic, no prior experience.',
    backgroundCheckStatus: 'in-progress',
    trainingStatus: {
      paperwork: true,
      appSetup: false,
      scriptTraining: false,
      turfTraining: false,
      firstShiftScheduled: false
    },
    nextStep: 'Background check completion',
    nextStepDate: '2026-02-10'
  },
  {
    id: 'app-003',
    name: 'Aisha Patel',
    email: 'aisha.patel@email.com',
    phone: '(555) 456-7890',
    projectId: 'NJ-11',
    source: 'event',
    stage: 'interview-scheduled',
    assignedRecruiterId: 'rec-jordan',
    assignedRecruiterName: 'Jordan Hayes',
    appliedDate: '2026-02-04',
    notes: 'Met at volunteer recruitment event. Local teacher.',
    backgroundCheckStatus: 'not-started',
    trainingStatus: {
      paperwork: false,
      appSetup: false,
      scriptTraining: false,
      turfTraining: false,
      firstShiftScheduled: false
    },
    nextStep: 'Phone interview',
    nextStepDate: '2026-02-08'
  },
  {
    id: 'app-004',
    name: 'Jake Thompson',
    email: 'jake.t@email.com',
    phone: '(555) 567-8901',
    projectId: 'VA-24',
    source: 'website',
    stage: 'onboarded',
    assignedRecruiterId: 'rec-taylor',
    assignedRecruiterName: 'Taylor Brooks',
    appliedDate: '2026-01-20',
    notes: 'Fully trained and active. Strong performer.',
    backgroundCheckStatus: 'cleared',
    trainingStatus: {
      paperwork: true,
      appSetup: true,
      scriptTraining: true,
      turfTraining: true,
      firstShiftScheduled: true
    }
  },
  {
    id: 'app-005',
    name: 'Sofia Nguyen',
    email: 'sofia.n@email.com',
    phone: '(555) 678-9012',
    projectId: 'NJ-11',
    source: 'referral',
    stage: 'contacted',
    assignedRecruiterId: 'rec-jordan',
    assignedRecruiterName: 'Jordan Hayes',
    appliedDate: '2026-02-06',
    notes: 'Left initial voicemail. Follow-up needed.',
    backgroundCheckStatus: 'not-started',
    trainingStatus: {
      paperwork: false,
      appSetup: false,
      scriptTraining: false,
      turfTraining: false,
      firstShiftScheduled: false
    },
    nextStep: 'Second contact attempt',
    nextStepDate: '2026-02-07'
  }
];

export const districtPulses: DistrictPulse[] = [
  {
    id: 'pulse-001',
    districtName: 'House District 12',
    raceType: 'state-house',
    competitiveness: 88,
    confidence: 82,
    clientStatus: 'active',
    clientName: 'American Majority',
    nextDeadline: {
      type: 'Campaign kickoff',
      date: '2026-02-15',
      name: 'Launch event'
    },
    recommendedActions: [
      'Finalize field plan for launch week',
      'Schedule Martinez for 3 community events',
      'Lock volunteer commitments (target: 50)'
    ]
  },
  {
    id: 'pulse-002',
    districtName: 'Senate District 8',
    raceType: 'state-senate',
    competitiveness: 92,
    confidence: 78,
    clientStatus: 'active',
    clientName: 'TGA',
    nextDeadline: {
      type: 'Digital optimization',
      date: '2026-02-15',
      name: 'Mid-flight review'
    },
    recommendedActions: [
      'Analyze digital performance data',
      'Adjust targeting to reduce CPA',
      'Test new creative variants'
    ]
  },
  {
    id: 'pulse-003',
    districtName: 'House District 45',
    raceType: 'state-house',
    competitiveness: 95,
    confidence: 85,
    clientStatus: 'active',
    clientName: 'American Majority',
    nextDeadline: {
      type: 'Volunteer recruitment',
      date: '2026-02-12',
      name: 'Recruitment deadline'
    },
    recommendedActions: [
      'Launch volunteer recruitment push (need 25 more)',
      'Secure walk packet printing',
      'Coordinate with county party for volunteer sharing'
    ]
  },
  {
    id: 'pulse-004',
    districtName: 'City Council District 3',
    raceType: 'city-council',
    competitiveness: 76,
    confidence: 72,
    clientStatus: 'prospect',
    nextDeadline: {
      type: 'Filing deadline',
      date: '2026-03-01',
      name: 'Candidate filing'
    },
    recommendedActions: [
      'Schedule pitch meeting with potential candidate',
      'Prepare competitiveness analysis',
      'Develop preliminary budget proposal'
    ]
  },
  {
    id: 'pulse-005',
    districtName: 'House District 23',
    raceType: 'state-house',
    competitiveness: 68,
    confidence: 65,
    clientStatus: 'prospect',
    nextDeadline: {
      type: 'Exploratory meeting',
      date: '2026-02-25',
      name: 'Initial consultation'
    },
    recommendedActions: [
      'Research incumbent vulnerabilities',
      'Identify potential candidate recruitment targets',
      'Map key stakeholder landscape'
    ]
  }
];

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'template-001',
    name: 'Candidate Launch',
    description: 'Full launch program from announcement through first 60 days',
    type: 'candidate-launch',
    icon: 'rocket',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Campaign plan', type: 'document', stage: 'Proposal', daysFromStart: 10 },
      { name: 'Launch video', type: 'video', stage: 'Build', daysFromStart: 25 },
      { name: 'Website', type: 'digital', stage: 'Build', daysFromStart: 30 },
      { name: 'Field plan', type: 'document', stage: 'Proposal', daysFromStart: 15 },
      { name: 'Launch event plan', type: 'document', stage: 'Build', daysFromStart: 20 }
    ],
    defaultTasks: [
      { name: 'Drafting meeting with candidate', stage: 'Drafting', owner: 'pm', daysFromStart: 1, estimatedHours: 2 },
      { name: 'Develop campaign message', stage: 'Proposal', owner: 'pm', daysFromStart: 7, estimatedHours: 8 },
      { name: 'Script launch video', stage: 'Build', owner: 'digital-lead', daysFromStart: 18, estimatedHours: 6 },
      { name: 'Recruit launch volunteers', stage: 'Build', owner: 'field-lead', daysFromStart: 15, estimatedHours: 12 }
    ],
    defaultOwners: ['pm', 'field-lead', 'digital-lead'],
    estimatedDuration: 60
  },
  {
    id: 'template-002',
    name: 'Fundraising Sprint',
    description: 'Intensive fundraising program for critical deadlines',
    type: 'fundraising',
    icon: 'dollar-sign',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Donor prospect list', type: 'list', stage: 'Proposal', daysFromStart: 5 },
      { name: 'Call time script', type: 'document', stage: 'Build', daysFromStart: 7 },
      { name: 'Event plan', type: 'document', stage: 'Build', daysFromStart: 10 },
      { name: 'Donor dashboard', type: 'report', stage: 'Launch', daysFromStart: 15 }
    ],
    defaultTasks: [
      { name: 'Build donor universe', stage: 'Proposal', owner: 'pm', daysFromStart: 3, estimatedHours: 6 },
      { name: 'Schedule call time blocks', stage: 'Build', owner: 'pm', daysFromStart: 5, estimatedHours: 4 },
      { name: 'Plan fundraiser event', stage: 'Build', owner: 'consultant', daysFromStart: 8, estimatedHours: 10 }
    ],
    defaultOwners: ['pm', 'consultant'],
    estimatedDuration: 30
  },
  {
    id: 'template-003',
    name: 'Persuasion Digital Program',
    description: 'Targeted digital advertising for persuasion voters',
    type: 'persuasion-digital',
    icon: 'target',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Targeting strategy', type: 'document', stage: 'Proposal', daysFromStart: 7 },
      { name: 'Creative assets', type: 'digital', stage: 'Build', daysFromStart: 14 },
      { name: 'Ad copy variants', type: 'document', stage: 'Build', daysFromStart: 12 },
      { name: 'Performance dashboard', type: 'report', stage: 'Launch', daysFromStart: 20 }
    ],
    defaultTasks: [
      { name: 'Define target universes', stage: 'Proposal', owner: 'digital-lead', daysFromStart: 5, estimatedHours: 8 },
      { name: 'Develop creative brief', stage: 'Proposal', owner: 'digital-lead', daysFromStart: 6, estimatedHours: 4 },
      { name: 'Design ads', stage: 'Build', owner: 'digital-lead', daysFromStart: 10, estimatedHours: 16 },
      { name: 'Set up tracking', stage: 'Build', owner: 'digital-lead', daysFromStart: 15, estimatedHours: 6 }
    ],
    defaultOwners: ['pm', 'digital-lead'],
    estimatedDuration: 45
  },
  {
    id: 'template-004',
    name: 'Mail Program',
    description: 'Direct mail persuasion or GOTV program',
    type: 'mail',
    icon: 'mail',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Universe analysis', type: 'document', stage: 'Proposal', daysFromStart: 5 },
      { name: 'Mail plan', type: 'document', stage: 'Proposal', daysFromStart: 10 },
      { name: 'Creative concepts', type: 'design', stage: 'Build', daysFromStart: 15 },
      { name: 'Print-ready files', type: 'design', stage: 'Build', daysFromStart: 25 }
    ],
    defaultTasks: [
      { name: 'Analyze target universe', stage: 'Proposal', owner: 'pm', daysFromStart: 3, estimatedHours: 8 },
      { name: 'Develop mail calendar', stage: 'Proposal', owner: 'pm', daysFromStart: 8, estimatedHours: 4 },
      { name: 'Create design concepts', stage: 'Build', owner: 'digital-lead', daysFromStart: 12, estimatedHours: 12 }
    ],
    defaultOwners: ['pm', 'digital-lead', 'compliance'],
    estimatedDuration: 40
  },
  {
    id: 'template-005',
    name: 'Field/GOTV Program',
    description: 'Canvassing and Get Out The Vote ground game',
    type: 'field-gotv',
    icon: 'users',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Field plan', type: 'document', stage: 'Proposal', daysFromStart: 7 },
      { name: 'Turf maps', type: 'document', stage: 'Build', daysFromStart: 10 },
      { name: 'Walk packets', type: 'print', stage: 'Build', daysFromStart: 15 },
      { name: 'Volunteer roster', type: 'list', stage: 'Build', daysFromStart: 12 }
    ],
    defaultTasks: [
      { name: 'Define field universes', stage: 'Proposal', owner: 'field-lead', daysFromStart: 5, estimatedHours: 6 },
      { name: 'Recruit volunteers', stage: 'Build', owner: 'field-lead', daysFromStart: 8, estimatedHours: 20 },
      { name: 'Create turf assignments', stage: 'Build', owner: 'field-lead', daysFromStart: 10, estimatedHours: 8 },
      { name: 'Schedule shifts', stage: 'Build', owner: 'field-lead', daysFromStart: 12, estimatedHours: 6 }
    ],
    defaultOwners: ['pm', 'field-lead'],
    estimatedDuration: 30
  },
  {
    id: 'template-006',
    name: 'Debate Prep / Rapid Response',
    description: 'Preparation and response system for debates and attacks',
    type: 'debate-prep',
    icon: 'shield',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Briefing book', type: 'document', stage: 'Build', daysFromStart: 10 },
      { name: 'Q&A prep', type: 'document', stage: 'Build', daysFromStart: 12 },
      { name: 'Attack response plan', type: 'document', stage: 'Proposal', daysFromStart: 8 }
    ],
    defaultTasks: [
      { name: 'Research opponent', stage: 'Proposal', owner: 'pm', daysFromStart: 3, estimatedHours: 12 },
      { name: 'Develop talking points', stage: 'Build', owner: 'pm', daysFromStart: 8, estimatedHours: 8 },
      { name: 'Mock debate prep', stage: 'Build', owner: 'pm', daysFromStart: 12, estimatedHours: 6 }
    ],
    defaultOwners: ['pm', 'consultant'],
    estimatedDuration: 20
  },
  {
    id: 'template-007',
    name: 'Ballot Chase / Absentee Program',
    description: 'Tracking and chasing absentee/early voters',
    type: 'ballot-chase',
    icon: 'check-circle',
    stages: ['Drafting', 'Proposal', 'Build', 'Launch', 'Review', 'Completed'],
    defaultDeliverables: [
      { name: 'Absentee universe', type: 'list', stage: 'Proposal', daysFromStart: 5 },
      { name: 'Chase script', type: 'document', stage: 'Build', daysFromStart: 8 },
      { name: 'Tracking dashboard', type: 'report', stage: 'Launch', daysFromStart: 12 }
    ],
    defaultTasks: [
      { name: 'Build absentee target list', stage: 'Proposal', owner: 'field-lead', daysFromStart: 3, estimatedHours: 6 },
      { name: 'Set up tracking system', stage: 'Build', owner: 'pm', daysFromStart: 7, estimatedHours: 8 },
      { name: 'Recruit phone bankers', stage: 'Build', owner: 'field-lead', daysFromStart: 8, estimatedHours: 10 }
    ],
    defaultOwners: ['pm', 'field-lead'],
    estimatedDuration: 25
  }
];

export const aiWeeklyPlan = [
  {
    category: 'Win-Now Actions',
    items: [
      {
        id: 'wn-1',
        text: 'CA-45: Add 8 canvassers immediately - 4,760 doors behind pace by 950/day',
        priority: 'critical',
        linkedProjectId: 'ca-45-canvassing',
        estimatedImpact: 'Project will miss deadline by 2 days without action'
      },
      {
        id: 'wn-2',
        text: 'GA-34: Urgent turf pull request - team has no walk lists for next 5 days',
        priority: 'critical',
        linkedProjectId: 'ga-34-field',
        estimatedImpact: 'Team will be idle without turf allocation'
      },
      {
        id: 'wn-3',
        text: 'VA-24: Fill 4 weekend shift gaps to get back on pace (currently 70 doors/day short)',
        priority: 'high',
        linkedProjectId: 'va-24-outreach',
        estimatedImpact: 'Will delay completion by 2 days'
      }
    ]
  },
  {
    category: 'Hiring & Recruitment',
    items: [
      {
        id: 'hr-1',
        text: 'CA-45: Post canvasser openings for Orange County - target 8-10 hires by Feb 22',
        priority: 'critical',
        linkedProjectId: 'ca-45-canvassing',
        dueDate: '2026-02-22'
      },
      {
        id: 'hr-2',
        text: 'GA-34: Recruit 3 additional canvassers for Gwinnett County to hit 425 doors/day pace',
        priority: 'high',
        linkedProjectId: 'ga-34-field',
        dueDate: '2026-02-25'
      },
      {
        id: 'hr-3',
        text: 'NJ-11: Assign field lead for Morris County team (Ben Blaser suggested)',
        priority: 'medium',
        linkedProjectId: 'nj-11-doorknock',
        dueDate: '2026-02-20'
      }
    ]
  },
  {
    category: 'Field Schedule Priorities',
    items: [
      {
        id: 'fs-1',
        text: 'PA-18: Schedule 21 shifts for next 7 days - on track, maintain momentum',
        priority: 'medium',
        linkedProjectId: 'pa-18-canvass',
        linkedShifts: ['shift-pa-001', 'shift-pa-002']
      },
      {
        id: 'fs-2',
        text: 'VA-24: Add 6 weekend shifts to close 4,500 door gap by Feb 25 deadline',
        priority: 'high',
        linkedProjectId: 'va-24-outreach'
      },
      {
        id: 'fs-3',
        text: 'CA-45: Bundle 18 shifts with new hires once recruited (3 shifts/day for 6 days)',
        priority: 'high',
        linkedProjectId: 'ca-45-canvassing'
      }
    ]
  },
  {
    category: 'Quality & Operations',
    items: [
      {
        id: 'qo-1',
        text: 'NJ-11: Schedule QA spot check - averaging 25 doors/shift (check data quality)',
        priority: 'medium',
        linkedProjectId: 'nj-11-doorknock',
        dueDate: '2026-02-23'
      },
      {
        id: 'qo-2',
        text: 'PA-18: Request walk list refresh for Allegheny County zones 4-7',
        priority: 'low',
        linkedProjectId: 'pa-18-canvass'
      },
      {
        id: 'qo-3',
        text: 'All Projects: Run weekly performance review - identify underperforming shifts',
        priority: 'medium',
        dueDate: '2026-02-21'
      }
    ]
  }
];