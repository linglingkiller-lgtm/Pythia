import React from 'react';

export interface Legislator {
  id: string;
  name: string;
  party: 'R' | 'D';
  district: string;
  chamber: 'House' | 'Senate';
  priority: 'A' | 'B' | 'C';
  watched: boolean;
  relationshipStatus: 'warm' | 'needs-follow-up' | 'neutral' | 'hostile' | 'unknown';
  committees: { name: string; role?: string }[];
  image?: string;
  email?: string;
  phone?: string;
  nextElection?: string;
  bio?: string;
}

export const mockLegislators: Legislator[] = [
  {
    id: 'leg-001',
    name: 'Ben Toma',
    party: 'R',
    district: '27',
    chamber: 'House',
    priority: 'A',
    watched: true,
    relationshipStatus: 'warm',
    committees: [{ name: 'Rules', role: 'Chair' }],
    email: 'btoma@azleg.gov',
    phone: '(602) 926-3298',
    bio: 'Speaker of the House. Represents District 27 covering parts of Peoria and Glendale.'
  },
  {
    id: 'leg-002',
    name: 'Leo Biasiucci',
    party: 'R',
    district: '30',
    chamber: 'House',
    priority: 'B',
    watched: false,
    relationshipStatus: 'neutral',
    committees: [{ name: 'Rules' }],
    email: 'lbiasiucci@azleg.gov',
    phone: '(602) 926-3018'
  },
  {
    id: 'leg-003',
    name: 'Lupe Contreras',
    party: 'D',
    district: '22',
    chamber: 'House',
    priority: 'A',
    watched: true,
    relationshipStatus: 'needs-follow-up',
    committees: [{ name: 'Rules' }],
    email: 'lcontreras@azleg.gov',
    phone: '(602) 926-4862'
  },
  {
    id: 'leg-004',
    name: 'Warren Petersen',
    party: 'R',
    district: '14',
    chamber: 'Senate',
    priority: 'A',
    watched: true,
    relationshipStatus: 'warm',
    committees: [{ name: 'Rules', role: 'Chair' }],
    email: 'wpetersen@azleg.gov',
    phone: '(602) 926-4136'
  },
  {
    id: 'leg-005',
    name: 'Sonny Borrelli',
    party: 'R',
    district: '30',
    chamber: 'Senate',
    priority: 'B',
    watched: false,
    relationshipStatus: 'hostile',
    committees: [{ name: 'Rules', role: 'Vice-Chair' }],
    email: 'sborrelli@azleg.gov',
    phone: '(602) 926-5051'
  },
  {
    id: 'leg-006',
    name: 'Mitzi Epstein',
    party: 'D',
    district: '12',
    chamber: 'Senate',
    priority: 'A',
    watched: true,
    relationshipStatus: 'warm',
    committees: [{ name: 'Rules' }],
    email: 'mepstein@azleg.gov',
    phone: '(602) 926-4870'
  },
  {
    id: 'leg-007',
    name: 'Sarah Martinez',
    party: 'D',
    district: '18',
    chamber: 'House',
    priority: 'B',
    watched: false,
    relationshipStatus: 'neutral',
    committees: [{ name: 'Energy & Environment' }],
    email: 'smartinez@azleg.gov',
    phone: '(602) 926-3333'
  },
  {
    id: 'leg-008',
    name: 'David Chen',
    party: 'R',
    district: '15',
    chamber: 'House',
    priority: 'C',
    watched: false,
    relationshipStatus: 'unknown',
    committees: [{ name: 'Appropriations' }],
    email: 'dchen@azleg.gov',
    phone: '(602) 926-4444'
  },
  {
    id: 'leg-009',
    name: 'Lisa Thompson',
    party: 'R',
    district: '11',
    chamber: 'Senate',
    priority: 'A',
    watched: true,
    relationshipStatus: 'needs-follow-up',
    committees: [{ name: 'Health & Human Services', role: 'Chair' }],
    email: 'lthompson@azleg.gov',
    phone: '(602) 926-5555'
  },
  {
    id: 'leg-010',
    name: 'Robert Garcia',
    party: 'D',
    district: '08',
    chamber: 'Senate',
    priority: 'B',
    watched: true,
    relationshipStatus: 'neutral',
    committees: [{ name: 'Education' }],
    email: 'rgarcia@azleg.gov',
    phone: '(602) 926-6666'
  }
];
