import React from 'react';

export interface ChamberSummary {
  chamberName: string;
  lastUpdated: string;
  totalSeats: number;
  majorityThreshold: number;
  controlParty: string;
  seatsByParty: {
    party: string;
    count: number;
    color: string;
  }[];
  netChange?: {
    party: string;
    change: number;
  }[];
}

export interface LeadershipPosition {
  legislatorId: string;
  legislatorName: string;
  chamber: 'House' | 'Senate';
  role: string;
  party: 'R' | 'D';
  district: string;
}

export const chamberData: ChamberSummary[] = [
  {
    chamberName: 'Arizona House of Representatives',
    lastUpdated: 'Jan 16, 2026',
    totalSeats: 60,
    majorityThreshold: 31,
    controlParty: 'Republican',
    seatsByParty: [
      { party: 'Republican', count: 31, color: '#DC2626' },
      { party: 'Democrat', count: 29, color: '#2563EB' }
    ],
    netChange: [
      { party: 'R', change: 0 },
      { party: 'D', change: 0 }
    ]
  },
  {
    chamberName: 'Arizona State Senate',
    lastUpdated: 'Jan 16, 2026',
    totalSeats: 30,
    majorityThreshold: 16,
    controlParty: 'Republican',
    seatsByParty: [
      { party: 'Republican', count: 16, color: '#DC2626' },
      { party: 'Democrat', count: 14, color: '#2563EB' }
    ],
    netChange: [
      { party: 'R', change: 0 },
      { party: 'D', change: 0 }
    ]
  }
];

export const leadershipPositions: LeadershipPosition[] = [
  {
    legislatorId: 'leg-001',
    legislatorName: 'Ben Toma',
    chamber: 'House',
    role: 'Speaker of the House',
    party: 'R',
    district: '27'
  },
  {
    legislatorId: 'leg-002',
    legislatorName: 'Leo Biasiucci',
    chamber: 'House',
    role: 'Majority Leader',
    party: 'R',
    district: '30'
  },
  {
    legislatorId: 'leg-003',
    legislatorName: 'Lupe Contreras',
    chamber: 'House',
    role: 'Minority Leader',
    party: 'D',
    district: '22'
  },
  {
    legislatorId: 'leg-004',
    legislatorName: 'Warren Petersen',
    chamber: 'Senate',
    role: 'President of the Senate',
    party: 'R',
    district: '14'
  },
  {
    legislatorId: 'leg-005',
    legislatorName: 'Sonny Borrelli',
    chamber: 'Senate',
    role: 'Majority Leader',
    party: 'R',
    district: '30'
  },
  {
    legislatorId: 'leg-006',
    legislatorName: 'Mitzi Epstein',
    chamber: 'Senate',
    role: 'Minority Leader',
    party: 'D',
    district: '12'
  }
];
