// Analytics & Performance Data Model

export interface ClientPerformanceMetric {
  clientId: string;
  clientName: string;
  clientType: 'lobbying' | 'public-affairs' | 'campaign-services';
  
  // Outcomes
  billsSupported: number;
  billsPassed: number;
  billsDefeated: number;
  winRate: number; // percentage
  
  // Activity
  deliverablesCompleted: number;
  meetingsHeld: number;
  legislatorEngagements: number;
  coalitionEvents: number;
  
  // Financials (mock ROI)
  contractValue: number;
  hoursInvested: number;
  estimatedROI: number; // percentage
  
  // Team
  primaryOwner: string;
  teamMembersAssigned: number;
  avgResponseTime: number; // hours
}

export interface BillTypePerformance {
  billType: string;
  totalBills: number;
  passed: number;
  failed: number;
  pending: number;
  winRate: number;
}

export interface LegislatorInfluence {
  legislatorId: string;
  legislatorName: string;
  district: string;
  party: string;
  
  // Engagement
  meetingsHeld: number;
  billsSponsored: number;
  votesAligned: number;
  votesOpposed: number;
  alignmentRate: number; // percentage
  
  // Influence
  committeeMemberships: number;
  leadershipPosition?: string;
  influenceScore: number; // 0-100
}

export interface TeamUtilizationMetric {
  userId: string;
  userName: string;
  department: string;
  
  // Capacity
  avgWorkloadScore: number;
  peakWorkloadScore: number;
  daysOverloaded: number;
  daysUnderutilized: number;
  
  // Output
  deliverablesCompleted: number;
  recordsCreated: number;
  clientTouchpoints: number;
  onTimeRate: number; // percentage
  
  // Clients
  activeClients: number;
  primaryClients: string[];
}

export interface PythiaAccuracyMetric {
  insightType: string;
  totalInsights: number;
  actedUpon: number;
  dismissed: number;
  successfulOutcomes: number;
  accuracyRate: number; // percentage
}

export interface TimeSeriesMetric {
  date: string;
  value: number;
  label?: string;
}

// Mock Data
export const mockClientPerformance: ClientPerformanceMetric[] = [
  {
    clientId: 'client-001',
    clientName: 'SolarTech Alliance',
    clientType: 'lobbying',
    billsSupported: 8,
    billsPassed: 6,
    billsDefeated: 1,
    winRate: 75,
    deliverablesCompleted: 24,
    meetingsHeld: 42,
    legislatorEngagements: 67,
    coalitionEvents: 8,
    contractValue: 180000,
    hoursInvested: 850,
    estimatedROI: 340,
    primaryOwner: 'Jordan Davis',
    teamMembersAssigned: 3,
    avgResponseTime: 2.3
  },
  {
    clientId: 'client-002',
    clientName: 'Clean Energy Fund',
    clientType: 'public-affairs',
    billsSupported: 5,
    billsPassed: 4,
    billsDefeated: 0,
    winRate: 80,
    deliverablesCompleted: 18,
    meetingsHeld: 28,
    legislatorEngagements: 45,
    coalitionEvents: 12,
    contractValue: 120000,
    hoursInvested: 520,
    estimatedROI: 280,
    primaryOwner: 'Sarah Kim',
    teamMembersAssigned: 2,
    avgResponseTime: 1.8
  },
  {
    clientId: 'client-003',
    clientName: 'Arizona Manufacturing Coalition',
    clientType: 'lobbying',
    billsSupported: 12,
    billsPassed: 8,
    billsDefeated: 2,
    winRate: 67,
    deliverablesCompleted: 32,
    meetingsHeld: 56,
    legislatorEngagements: 89,
    coalitionEvents: 6,
    contractValue: 240000,
    hoursInvested: 1120,
    estimatedROI: 295,
    primaryOwner: 'Matt Kenney',
    teamMembersAssigned: 4,
    avgResponseTime: 3.1
  },
  {
    clientId: 'client-004',
    clientName: 'CA-45 Campaign',
    clientType: 'campaign-services',
    billsSupported: 0,
    billsPassed: 0,
    billsDefeated: 0,
    winRate: 0,
    deliverablesCompleted: 45,
    meetingsHeld: 18,
    legislatorEngagements: 0,
    coalitionEvents: 0,
    contractValue: 95000,
    hoursInvested: 680,
    estimatedROI: 185,
    primaryOwner: 'Emily Chen',
    teamMembersAssigned: 5,
    avgResponseTime: 4.2
  },
  {
    clientId: 'client-005',
    clientName: 'Tech Trade Association',
    clientType: 'lobbying',
    billsSupported: 6,
    billsPassed: 5,
    billsDefeated: 0,
    winRate: 83,
    deliverablesCompleted: 16,
    meetingsHeld: 34,
    legislatorEngagements: 52,
    coalitionEvents: 4,
    contractValue: 150000,
    hoursInvested: 590,
    estimatedROI: 310,
    primaryOwner: 'Jordan Davis',
    teamMembersAssigned: 2,
    avgResponseTime: 2.1
  }
];

export const mockBillTypePerformance: BillTypePerformance[] = [
  {
    billType: 'Energy & Environment',
    totalBills: 15,
    passed: 11,
    failed: 2,
    pending: 2,
    winRate: 73
  },
  {
    billType: 'Technology & Innovation',
    totalBills: 8,
    passed: 6,
    failed: 1,
    pending: 1,
    winRate: 75
  },
  {
    billType: 'Manufacturing & Trade',
    totalBills: 12,
    passed: 8,
    failed: 2,
    pending: 2,
    winRate: 67
  },
  {
    billType: 'Healthcare',
    totalBills: 6,
    passed: 4,
    failed: 1,
    pending: 1,
    winRate: 67
  },
  {
    billType: 'Transportation',
    totalBills: 4,
    passed: 3,
    failed: 0,
    pending: 1,
    winRate: 75
  }
];

export const mockLegislatorInfluence: LegislatorInfluence[] = [
  {
    legislatorId: 'leg-001',
    legislatorName: 'Rep. Sarah Martinez',
    district: 'District 12',
    party: 'Democrat',
    meetingsHeld: 18,
    billsSponsored: 4,
    votesAligned: 15,
    votesOpposed: 3,
    alignmentRate: 83,
    committeeMemberships: 3,
    leadershipPosition: 'Vice Chair, Energy Committee',
    influenceScore: 87
  },
  {
    legislatorId: 'leg-002',
    legislatorName: 'Sen. Michael Chen',
    district: 'District 8',
    party: 'Democrat',
    meetingsHeld: 12,
    billsSponsored: 6,
    votesAligned: 20,
    votesOpposed: 2,
    alignmentRate: 91,
    committeeMemberships: 4,
    leadershipPosition: 'Chair, Technology Committee',
    influenceScore: 94
  },
  {
    legislatorId: 'leg-003',
    legislatorName: 'Rep. David Thompson',
    district: 'District 23',
    party: 'Republican',
    meetingsHeld: 8,
    billsSponsored: 2,
    votesAligned: 5,
    votesOpposed: 7,
    alignmentRate: 42,
    committeeMemberships: 2,
    influenceScore: 62
  },
  {
    legislatorId: 'leg-004',
    legislatorName: 'Rep. Amanda Rodriguez',
    district: 'District 15',
    party: 'Democrat',
    meetingsHeld: 14,
    billsSponsored: 5,
    votesAligned: 18,
    votesOpposed: 1,
    alignmentRate: 95,
    committeeMemberships: 3,
    leadershipPosition: 'Majority Whip',
    influenceScore: 91
  },
  {
    legislatorId: 'leg-005',
    legislatorName: 'Sen. Robert Kim',
    district: 'District 5',
    party: 'Republican',
    meetingsHeld: 6,
    billsSponsored: 3,
    votesAligned: 8,
    votesOpposed: 10,
    alignmentRate: 44,
    committeeMemberships: 2,
    influenceScore: 58
  }
];

export const mockTeamUtilization: TeamUtilizationMetric[] = [
  {
    userId: 'user-001',
    userName: 'Jordan Davis',
    department: 'Lobbying',
    avgWorkloadScore: 72,
    peakWorkloadScore: 89,
    daysOverloaded: 12,
    daysUnderutilized: 3,
    deliverablesCompleted: 24,
    recordsCreated: 18,
    clientTouchpoints: 67,
    onTimeRate: 92,
    activeClients: 2,
    primaryClients: ['SolarTech Alliance', 'Tech Trade Association']
  },
  {
    userId: 'user-002',
    userName: 'Matt Kenney',
    department: 'Lobbying',
    avgWorkloadScore: 84,
    peakWorkloadScore: 96,
    daysOverloaded: 18,
    daysUnderutilized: 1,
    deliverablesCompleted: 32,
    recordsCreated: 22,
    clientTouchpoints: 89,
    onTimeRate: 85,
    activeClients: 1,
    primaryClients: ['Arizona Manufacturing Coalition']
  },
  {
    userId: 'user-003',
    userName: 'Sarah Kim',
    department: 'Policy',
    avgWorkloadScore: 56,
    peakWorkloadScore: 74,
    daysOverloaded: 4,
    daysUnderutilized: 8,
    deliverablesCompleted: 18,
    recordsCreated: 24,
    clientTouchpoints: 45,
    onTimeRate: 96,
    activeClients: 2,
    primaryClients: ['Clean Energy Fund', 'Tech Trade Association']
  },
  {
    userId: 'user-004',
    userName: 'Emily Chen',
    department: 'Campaign Services',
    avgWorkloadScore: 88,
    peakWorkloadScore: 98,
    daysOverloaded: 22,
    daysUnderutilized: 0,
    deliverablesCompleted: 45,
    recordsCreated: 38,
    clientTouchpoints: 156,
    onTimeRate: 88,
    activeClients: 2,
    primaryClients: ['CA-45 Campaign', 'AZ-06 Campaign']
  },
  {
    userId: 'user-005',
    userName: 'Alex Rodriguez',
    department: 'Public Affairs',
    avgWorkloadScore: 38,
    peakWorkloadScore: 52,
    daysOverloaded: 0,
    daysUnderutilized: 24,
    deliverablesCompleted: 8,
    recordsCreated: 6,
    clientTouchpoints: 22,
    onTimeRate: 100,
    activeClients: 1,
    primaryClients: ['Clean Energy Fund']
  }
];

export const mockPythiaAccuracy: PythiaAccuracyMetric[] = [
  {
    insightType: 'Bill Vote Prediction',
    totalInsights: 45,
    actedUpon: 38,
    dismissed: 7,
    successfulOutcomes: 34,
    accuracyRate: 89
  },
  {
    insightType: 'Workload Rebalancing',
    totalInsights: 28,
    actedUpon: 22,
    dismissed: 6,
    successfulOutcomes: 20,
    accuracyRate: 91
  },
  {
    insightType: 'Legislator Outreach',
    totalInsights: 52,
    actedUpon: 41,
    dismissed: 11,
    successfulOutcomes: 36,
    accuracyRate: 88
  },
  {
    insightType: 'Client Risk Detection',
    totalInsights: 18,
    actedUpon: 15,
    dismissed: 3,
    successfulOutcomes: 13,
    accuracyRate: 87
  },
  {
    insightType: 'Coalition Opportunities',
    totalInsights: 34,
    actedUpon: 28,
    dismissed: 6,
    successfulOutcomes: 25,
    accuracyRate: 89
  }
];

export const mockWinRateTrend: TimeSeriesMetric[] = [
  { date: '2025-07', value: 68, label: 'Jul' },
  { date: '2025-08', value: 72, label: 'Aug' },
  { date: '2025-09', value: 71, label: 'Sep' },
  { date: '2025-10', value: 75, label: 'Oct' },
  { date: '2025-11', value: 78, label: 'Nov' },
  { date: '2025-12', value: 76, label: 'Dec' }
];

export const mockDeliverablesTrend: TimeSeriesMetric[] = [
  { date: '2025-07', value: 32, label: 'Jul' },
  { date: '2025-08', value: 38, label: 'Aug' },
  { date: '2025-09', value: 42, label: 'Sep' },
  { date: '2025-10', value: 45, label: 'Oct' },
  { date: '2025-11', value: 48, label: 'Nov' },
  { date: '2025-12', value: 52, label: 'Dec' }
];

// Helper functions
export function getTopPerformingClients(limit: number = 5): ClientPerformanceMetric[] {
  return [...mockClientPerformance]
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, limit);
}

export function getOverallWinRate(): number {
  const lobbying = mockClientPerformance.filter(c => c.clientType === 'lobbying');
  const totalBills = lobbying.reduce((sum, c) => sum + c.billsSupported, 0);
  const passedBills = lobbying.reduce((sum, c) => sum + c.billsPassed, 0);
  return totalBills > 0 ? Math.round((passedBills / totalBills) * 100) : 0;
}

export function getTotalRevenue(): number {
  return mockClientPerformance.reduce((sum, c) => sum + c.contractValue, 0);
}

export function getAverageROI(): number {
  const totalROI = mockClientPerformance.reduce((sum, c) => sum + c.estimatedROI, 0);
  return Math.round(totalROI / mockClientPerformance.length);
}
