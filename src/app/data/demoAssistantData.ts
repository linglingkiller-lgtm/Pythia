
// Demo data for Revere Assistant features

export interface DemoBill {
  id: string;
  number: string;
  title: string;
  summary: string;
  risks: string[];
  status: 'Committee' | 'Floor' | 'Passed' | 'Vetoed';
  lastAction: string;
  sponsors: string[];
}

export interface DemoStakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  party?: string;
  state?: string;
  influence: number; // 0-100
  lastInteraction: string;
  topDonors: string[];
  conflicts: string[];
  avatarUrl?: string;
}

export const demoBills: DemoBill[] = [
  {
    id: 'bill-1',
    number: 'HR 503',
    title: 'Renewable Energy Infrastructure Act',
    summary: 'A bill to provide tax incentives for renewable energy projects and modernize the electrical grid.',
    risks: [
      'Clause 4b conflicts with our client\'s fossil fuel portfolio.',
      'Requires 50% union labor, potentially increasing project costs.',
      'Strict environmental review timelines could delay implementation.'
    ],
    status: 'Committee',
    lastAction: 'Referred to House Energy Committee',
    sponsors: ['Rep. Sarah Chen', 'Sen. Marcus Thorne']
  },
  {
    id: 'bill-2',
    number: 'S 1290',
    title: 'Digital Privacy & Security Framework',
    summary: 'Establishes new standards for data collection and user privacy for large technology platforms.',
    risks: [
      'Data localization requirements increase operational overhead.',
      'Potential conflicts with GDPR compliance measures.',
      'Ambiguous definition of "sensitive data" in Section 12.'
    ],
    status: 'Floor',
    lastAction: 'Scheduled for Senate Vote',
    sponsors: ['Sen. Elizabeth Warren', 'Sen. Josh Hawley']
  }
];

export const demoStakeholders: DemoStakeholder[] = [
  {
    id: 'sh-1',
    name: 'Senator Arthur Blackwell',
    role: 'Chair, Energy Committee',
    organization: 'US Senate',
    party: 'Republican',
    state: 'Texas',
    influence: 95,
    lastInteraction: '2025-05-15 (Dinner)',
    topDonors: ['ExxonMobil', 'Chevron', 'Koch Industries'],
    conflicts: ['Son sits on board of GreenTech Inc.', 'Opposes carbon tax initiatives'],
    avatarUrl: 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png' // Placeholder
  },
  {
    id: 'sh-2',
    name: 'Representative Sarah Chen',
    role: 'Member',
    organization: 'US House',
    party: 'Democrat',
    state: 'California',
    influence: 78,
    lastInteraction: '2025-06-02 (Phone Call)',
    topDonors: ['Sierra Club', 'SolarCity', 'Google'],
    conflicts: ['Staunch opponent of offshore drilling'],
    avatarUrl: 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png' // Placeholder
  },
  {
    id: 'sh-3',
    name: 'Elena Rodriguez',
    role: 'Chief of Staff',
    organization: 'Office of Sen. Blackwell',
    influence: 88,
    lastInteraction: '2025-06-10 (Email)',
    topDonors: [],
    conflicts: [],
    avatarUrl: 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png' // Placeholder
  }
];

export const demoPathways = [
  {
    targetId: 'sh-2', // Rep Chen
    path: [
      { name: 'You', title: 'Strategist' },
      { name: 'Michael Ross', title: 'Board Member', connection: 'College Roommate' },
      { name: 'Rep. Sarah Chen', title: 'Target', connection: 'Campaign Donor' }
    ]
  }
];
