export interface ChamberSummary {
  chamberName: string;
  totalSeats: number;
  majorityThreshold: number;
  seatsByParty: { party: string; count: number; color: string }[];
  controlParty: string;
  netChange?: { party: string; change: number }[];
  lastUpdated: string;
}

export const chamberData: ChamberSummary[] = [
  {
    chamberName: 'Arizona House',
    totalSeats: 60,
    majorityThreshold: 31,
    seatsByParty: [
      { party: 'Republican', count: 31, color: '#dc2626' },
      { party: 'Democrat', count: 29, color: '#2563eb' },
    ],
    controlParty: 'Republican',
    netChange: [
      { party: 'R', change: 2 },
      { party: 'D', change: -2 },
    ],
    lastUpdated: 'Dec 18, 2024 • 9:45 AM',
  },
  {
    chamberName: 'Arizona Senate',
    totalSeats: 30,
    majorityThreshold: 16,
    seatsByParty: [
      { party: 'Republican', count: 16, color: '#dc2626' },
      { party: 'Democrat', count: 14, color: '#2563eb' },
    ],
    controlParty: 'Republican',
    netChange: [
      { party: 'R', change: 1 },
      { party: 'D', change: -1 },
    ],
    lastUpdated: 'Dec 18, 2024 • 9:45 AM',
  },
];

export interface LeadershipPosition {
  chamber: 'House' | 'Senate';
  role: string;
  legislatorId: string;
  legislatorName: string;
  party: 'R' | 'D';
  district: string;
}

export const leadershipPositions: LeadershipPosition[] = [
  // House Leadership
  {
    chamber: 'House',
    role: 'Speaker of the House',
    legislatorId: 'leg-az-001',
    legislatorName: 'Steve Montenegro',
    party: 'R',
    district: 'LD-29',
  },
  {
    chamber: 'House',
    role: 'House Majority Leader',
    legislatorId: 'leg-az-002',
    legislatorName: 'Michael Carbone',
    party: 'R',
    district: 'LD-25',
  },
  {
    chamber: 'House',
    role: 'House Minority Leader',
    legislatorId: 'leg-az-003',
    legislatorName: 'Oscar De Los Santos',
    party: 'D',
    district: 'LD-16',
  },
  
  // Senate Leadership
  {
    chamber: 'Senate',
    role: 'President of the Senate',
    legislatorId: 'leg-az-006',
    legislatorName: 'Warren Petersen',
    party: 'R',
    district: 'LD-1',
  },
  {
    chamber: 'Senate',
    role: 'Senate Majority Leader',
    legislatorId: 'leg-az-004',
    legislatorName: 'John Kavanagh',
    party: 'R',
    district: 'LD-3',
  },
  {
    chamber: 'Senate',
    role: 'Senate Minority Leader',
    legislatorId: 'leg-az-005',
    legislatorName: 'Priya Sundareshan',
    party: 'D',
    district: 'LD-18',
  },
];