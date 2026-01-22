// Constellation Network Data - Comprehensive stakeholder intelligence network

export interface NetworkNode {
  id: string;
  type: 'bill' | 'legislator' | 'client' | 'committee' | 'issue' | 'stakeholder' | 'staff';
  label: string;
  metadata: {
    name?: string;
    party?: string;
    district?: string;
    committee?: string;
    photoUrl?: string;
    status?: string;
    tier?: number;
    title?: string;
    organization?: string;
    chamber?: string;
  };
  influenceScore: number;
  lastUpdated: Date;
  position?: { x: number; y: number };
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  type: 'sponsor' | 'cosponsor' | 'support' | 'oppose' | 'neutral' | 'client' | 'staff' | 'committee' | 'issue' | 'coalition';
  weight: number; // Relationship strength 1-10
  sentiment: 'positive' | 'negative' | 'neutral';
  interactionHistory: Interaction[];
  lastContact?: Date;
  frequency?: number;
}

export interface Interaction {
  date: Date;
  type: 'meeting' | 'call' | 'email' | 'event' | 'donation' | 'testimony';
  outcome: 'positive' | 'negative' | 'neutral';
  notes?: string;
  participants: string[];
}

export interface PathResult {
  path: string[];
  score: number;
  length: number;
  estimatedTimeline: string;
  recommendations: string[];
  intermediateConnections: Array<{
    from: string;
    to: string;
    relationshipStrength: number;
    context: string;
  }>;
}

// Demo Network Nodes
export const demoNetworkNodes: NetworkNode[] = [
  // Clients
  {
    id: 'client-1',
    type: 'client',
    label: 'Desert Solar Coalition',
    metadata: {
      name: 'Desert Solar Coalition',
      tier: 1,
      organization: 'Energy Advocacy'
    },
    influenceScore: 8.5,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'client-2',
    type: 'client',
    label: 'Arizona Tech Alliance',
    metadata: {
      name: 'Arizona Tech Alliance',
      tier: 2,
      organization: 'Technology Policy'
    },
    influenceScore: 7.2,
    lastUpdated: new Date('2025-01-18')
  },
  
  // Bills
  {
    id: 'bill-1',
    type: 'bill',
    label: 'HB-847',
    metadata: {
      name: 'Solar Interconnection Standards Act',
      status: 'In Committee',
      chamber: 'House'
    },
    influenceScore: 9.0,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'bill-2',
    type: 'bill',
    label: 'SB-523',
    metadata: {
      name: 'Data Privacy Protection Act',
      status: 'Floor Vote Pending',
      chamber: 'Senate'
    },
    influenceScore: 8.3,
    lastUpdated: new Date('2025-01-19')
  },
  {
    id: 'bill-3',
    type: 'bill',
    label: 'HB-901',
    metadata: {
      name: 'Clean Energy Tax Credits',
      status: 'Passed House',
      chamber: 'House'
    },
    influenceScore: 7.8,
    lastUpdated: new Date('2025-01-15')
  },
  
  // Legislators
  {
    id: 'leg-1',
    type: 'legislator',
    label: 'Sen. Barbara Williams',
    metadata: {
      name: 'Barbara Williams',
      party: 'Democrat',
      district: 'District 18',
      chamber: 'Senate',
      photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400'
    },
    influenceScore: 9.5,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'leg-2',
    type: 'legislator',
    label: 'Rep. Sarah Martinez',
    metadata: {
      name: 'Sarah Martinez',
      party: 'Democrat',
      district: 'District 24',
      chamber: 'House',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'
    },
    influenceScore: 8.8,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'leg-3',
    type: 'legislator',
    label: 'Sen. James Thompson',
    metadata: {
      name: 'James Thompson',
      party: 'Republican',
      district: 'District 12',
      chamber: 'Senate',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400'
    },
    influenceScore: 9.2,
    lastUpdated: new Date('2025-01-19')
  },
  {
    id: 'leg-4',
    type: 'legislator',
    label: 'Rep. Michael Chen',
    metadata: {
      name: 'Michael Chen',
      party: 'Republican',
      district: 'District 8',
      chamber: 'House',
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    },
    influenceScore: 7.9,
    lastUpdated: new Date('2025-01-18')
  },
  {
    id: 'leg-5',
    type: 'legislator',
    label: 'Sen. Patricia Davis',
    metadata: {
      name: 'Patricia Davis',
      party: 'Democrat',
      district: 'District 5',
      chamber: 'Senate',
      photoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
    },
    influenceScore: 8.5,
    lastUpdated: new Date('2025-01-17')
  },
  {
    id: 'leg-6',
    type: 'legislator',
    label: 'Rep. David Anderson',
    metadata: {
      name: 'David Anderson',
      party: 'Republican',
      district: 'District 15',
      chamber: 'House',
      photoUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400'
    },
    influenceScore: 6.8,
    lastUpdated: new Date('2025-01-16')
  },
  
  // Committees
  {
    id: 'comm-1',
    type: 'committee',
    label: 'House Energy Committee',
    metadata: {
      name: 'House Energy & Natural Resources Committee',
      committee: 'Energy',
      chamber: 'House'
    },
    influenceScore: 9.0,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'comm-2',
    type: 'committee',
    label: 'Senate Technology Committee',
    metadata: {
      name: 'Senate Technology & Innovation Committee',
      committee: 'Technology',
      chamber: 'Senate'
    },
    influenceScore: 8.2,
    lastUpdated: new Date('2025-01-19')
  },
  
  // Issues/Topics
  {
    id: 'issue-1',
    type: 'issue',
    label: 'Clean Energy',
    metadata: {
      name: 'Clean Energy Policy'
    },
    influenceScore: 8.7,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'issue-2',
    type: 'issue',
    label: 'Data Privacy',
    metadata: {
      name: 'Data Privacy & Security'
    },
    influenceScore: 7.9,
    lastUpdated: new Date('2025-01-19')
  },
  {
    id: 'issue-3',
    type: 'issue',
    label: 'Tax Policy',
    metadata: {
      name: 'Tax & Economic Policy'
    },
    influenceScore: 7.5,
    lastUpdated: new Date('2025-01-18')
  },
  
  // External Stakeholders
  {
    id: 'stake-1',
    type: 'stakeholder',
    label: 'Solar Industry Association',
    metadata: {
      name: 'Solar Industry Association of Arizona',
      organization: 'Trade Association'
    },
    influenceScore: 7.8,
    lastUpdated: new Date('2025-01-19')
  },
  {
    id: 'stake-2',
    type: 'stakeholder',
    label: 'Utility Coalition',
    metadata: {
      name: 'Arizona Utilities Coalition',
      organization: 'Industry Group'
    },
    influenceScore: 8.5,
    lastUpdated: new Date('2025-01-18')
  },
  {
    id: 'stake-3',
    type: 'stakeholder',
    label: 'Consumer Advocates',
    metadata: {
      name: 'Arizona Consumer Protection Alliance',
      organization: 'Advocacy Group'
    },
    influenceScore: 6.9,
    lastUpdated: new Date('2025-01-17')
  },
  
  // Staff/Intermediaries
  {
    id: 'staff-1',
    type: 'staff',
    label: 'Maria Rodriguez',
    metadata: {
      name: 'Maria Rodriguez',
      title: 'Chief of Staff',
      organization: 'Sen. Williams Office'
    },
    influenceScore: 7.5,
    lastUpdated: new Date('2025-01-20')
  },
  {
    id: 'staff-2',
    type: 'staff',
    label: 'John Smith',
    metadata: {
      name: 'John Smith',
      title: 'Energy Policy Director',
      organization: 'Rep. Martinez Office'
    },
    influenceScore: 6.8,
    lastUpdated: new Date('2025-01-19')
  },
  {
    id: 'staff-3',
    type: 'staff',
    label: 'Emily Johnson',
    metadata: {
      name: 'Emily Johnson',
      title: 'Committee Staff Director',
      organization: 'House Energy Committee'
    },
    influenceScore: 7.2,
    lastUpdated: new Date('2025-01-18')
  }
];

// Demo Network Edges (Relationships)
export const demoNetworkEdges: NetworkEdge[] = [
  // Client to Bill relationships
  {
    id: 'edge-1',
    source: 'client-1',
    target: 'bill-1',
    type: 'support',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [
      {
        date: new Date('2025-01-15'),
        type: 'testimony',
        outcome: 'positive',
        notes: 'Testified in favor of bill at committee hearing',
        participants: ['client-1', 'comm-1']
      }
    ],
    lastContact: new Date('2025-01-15'),
    frequency: 5
  },
  {
    id: 'edge-2',
    source: 'client-1',
    target: 'bill-3',
    type: 'support',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-10'),
    frequency: 3
  },
  {
    id: 'edge-3',
    source: 'client-2',
    target: 'bill-2',
    type: 'support',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-12'),
    frequency: 4
  },
  
  // Client to Legislator relationships
  {
    id: 'edge-4',
    source: 'client-1',
    target: 'leg-2',
    type: 'client',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [
      {
        date: new Date('2025-01-15'),
        type: 'meeting',
        outcome: 'positive',
        notes: 'Discussed solar policy priorities',
        participants: ['client-1', 'leg-2']
      },
      {
        date: new Date('2024-12-10'),
        type: 'event',
        outcome: 'positive',
        notes: 'Attended facility tour',
        participants: ['client-1', 'leg-2']
      }
    ],
    lastContact: new Date('2025-01-15'),
    frequency: 6
  },
  {
    id: 'edge-5',
    source: 'client-1',
    target: 'leg-3',
    type: 'client',
    weight: 7,
    sentiment: 'neutral',
    interactionHistory: [
      {
        date: new Date('2024-12-05'),
        type: 'meeting',
        outcome: 'neutral',
        notes: 'Initial meeting, cautious response',
        participants: ['client-1', 'leg-3']
      }
    ],
    lastContact: new Date('2024-12-05'),
    frequency: 2
  },
  
  // Legislator to Bill relationships (Sponsors)
  {
    id: 'edge-6',
    source: 'leg-2',
    target: 'bill-1',
    type: 'sponsor',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-18')
  },
  {
    id: 'edge-7',
    source: 'leg-1',
    target: 'bill-2',
    type: 'sponsor',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-17')
  },
  {
    id: 'edge-8',
    source: 'leg-3',
    target: 'bill-3',
    type: 'cosponsor',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-12')
  },
  {
    id: 'edge-9',
    source: 'leg-4',
    target: 'bill-1',
    type: 'cosponsor',
    weight: 7,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-10')
  },
  {
    id: 'edge-10',
    source: 'leg-5',
    target: 'bill-3',
    type: 'support',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-09')
  },
  {
    id: 'edge-11',
    source: 'leg-6',
    target: 'bill-1',
    type: 'oppose',
    weight: 6,
    sentiment: 'negative',
    interactionHistory: [],
    lastContact: new Date('2025-01-08')
  },
  
  // Legislator to Committee relationships
  {
    id: 'edge-12',
    source: 'leg-2',
    target: 'comm-1',
    type: 'committee',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-13',
    source: 'leg-4',
    target: 'comm-1',
    type: 'committee',
    weight: 9,
    sentiment: 'neutral',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-14',
    source: 'leg-1',
    target: 'comm-2',
    type: 'committee',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-19')
  },
  {
    id: 'edge-15',
    source: 'leg-3',
    target: 'comm-1',
    type: 'committee',
    weight: 9,
    sentiment: 'neutral',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  
  // Legislator to Legislator relationships (Colleague/Influence)
  {
    id: 'edge-16',
    source: 'leg-2',
    target: 'leg-3',
    type: 'coalition',
    weight: 7,
    sentiment: 'neutral',
    interactionHistory: [
      {
        date: new Date('2024-12-15'),
        type: 'meeting',
        outcome: 'neutral',
        notes: 'Committee colleague, working relationship',
        participants: ['leg-2', 'leg-3']
      }
    ],
    lastContact: new Date('2024-12-15'),
    frequency: 3
  },
  {
    id: 'edge-17',
    source: 'leg-3',
    target: 'leg-1',
    type: 'coalition',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [
      {
        date: new Date('2025-01-10'),
        type: 'meeting',
        outcome: 'positive',
        notes: 'Strong cross-chamber relationship',
        participants: ['leg-3', 'leg-1']
      }
    ],
    lastContact: new Date('2025-01-10'),
    frequency: 4
  },
  {
    id: 'edge-18',
    source: 'leg-2',
    target: 'leg-5',
    type: 'coalition',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-05'),
    frequency: 5
  },
  
  // Bill to Issue relationships
  {
    id: 'edge-19',
    source: 'bill-1',
    target: 'issue-1',
    type: 'issue',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-20',
    source: 'bill-2',
    target: 'issue-2',
    type: 'issue',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-19')
  },
  {
    id: 'edge-21',
    source: 'bill-3',
    target: 'issue-1',
    type: 'issue',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-15')
  },
  {
    id: 'edge-22',
    source: 'bill-3',
    target: 'issue-3',
    type: 'issue',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-15')
  },
  
  // Stakeholder relationships
  {
    id: 'edge-23',
    source: 'stake-1',
    target: 'bill-1',
    type: 'support',
    weight: 9,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-14'),
    frequency: 4
  },
  {
    id: 'edge-24',
    source: 'stake-2',
    target: 'bill-1',
    type: 'oppose',
    weight: 7,
    sentiment: 'negative',
    interactionHistory: [],
    lastContact: new Date('2025-01-12'),
    frequency: 3
  },
  {
    id: 'edge-25',
    source: 'stake-1',
    target: 'client-1',
    type: 'coalition',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-16'),
    frequency: 5
  },
  {
    id: 'edge-26',
    source: 'stake-3',
    target: 'leg-1',
    type: 'coalition',
    weight: 7,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-11'),
    frequency: 3
  },
  
  // Staff relationships
  {
    id: 'edge-27',
    source: 'staff-1',
    target: 'leg-1',
    type: 'staff',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-28',
    source: 'staff-2',
    target: 'leg-2',
    type: 'staff',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-29',
    source: 'staff-3',
    target: 'comm-1',
    type: 'staff',
    weight: 10,
    sentiment: 'positive',
    interactionHistory: [],
    lastContact: new Date('2025-01-20')
  },
  {
    id: 'edge-30',
    source: 'client-1',
    target: 'staff-2',
    type: 'client',
    weight: 8,
    sentiment: 'positive',
    interactionHistory: [
      {
        date: new Date('2025-01-13'),
        type: 'meeting',
        outcome: 'positive',
        notes: 'Policy briefing on solar standards',
        participants: ['client-1', 'staff-2']
      }
    ],
    lastContact: new Date('2025-01-13'),
    frequency: 4
  },
  {
    id: 'edge-31',
    source: 'staff-2',
    target: 'leg-3',
    type: 'coalition',
    weight: 6,
    sentiment: 'neutral',
    interactionHistory: [
      {
        date: new Date('2024-12-20'),
        type: 'meeting',
        outcome: 'neutral',
        notes: 'Cross-office coordination',
        participants: ['staff-2', 'leg-3']
      }
    ],
    lastContact: new Date('2024-12-20'),
    frequency: 2
  }
];

// Network Analytics Data
export interface NetworkMetrics {
  networkDensity: number;
  clusteringCoefficient: number;
  averagePathLength: number;
  isolatedNodes: number;
  healthScore: number;
  totalConnections: number;
  strongConnections: number;
  weakConnections: number;
  recentActivity: number;
}

export const demoNetworkMetrics: NetworkMetrics = {
  networkDensity: 0.45,
  clusteringCoefficient: 0.68,
  averagePathLength: 2.8,
  isolatedNodes: 0,
  healthScore: 78,
  totalConnections: 31,
  strongConnections: 18,
  weakConnections: 13,
  recentActivity: 12
};

// Helper functions for path finding (Dijkstra's algorithm implementation)
export function findShortestPaths(
  sourceId: string,
  targetId: string,
  maxPaths: number = 5
): PathResult[] {
  // This is a simplified path-finding implementation
  // In a real app, you'd implement proper Dijkstra's or A* algorithm
  const paths: PathResult[] = [];
  
  // Mock paths for demo
  if (sourceId === 'client-1' && targetId === 'leg-1') {
    paths.push({
      path: ['client-1', 'leg-2', 'leg-3', 'leg-1'],
      score: 85,
      length: 3,
      estimatedTimeline: '2 weeks',
      recommendations: [
        'Schedule Martinez-Thompson coffee meeting',
        'Prepare Thompson talking points on grid modernization',
        'Leverage Thompson-Williams cross-chamber relationship'
      ],
      intermediateConnections: [
        {
          from: 'Desert Solar Coalition',
          to: 'Rep. Sarah Martinez',
          relationshipStrength: 9,
          context: 'Client liaison, met 12/15, strong alignment'
        },
        {
          from: 'Rep. Sarah Martinez',
          to: 'Sen. James Thompson',
          relationshipStrength: 7,
          context: 'Committee colleagues, working relationship'
        },
        {
          from: 'Sen. James Thompson',
          to: 'Sen. Barbara Williams',
          relationshipStrength: 8,
          context: 'Strong cross-chamber relationship'
        }
      ]
    });
    
    paths.push({
      path: ['client-1', 'staff-2', 'leg-3', 'leg-1'],
      score: 78,
      length: 3,
      estimatedTimeline: '2.5 weeks',
      recommendations: [
        'Brief John Smith (Martinez staff) on Williams priorities',
        'Coordinate staff-level meeting with Thompson office',
        'Follow up with direct outreach to Williams'
      ],
      intermediateConnections: [
        {
          from: 'Desert Solar Coalition',
          to: 'John Smith (Martinez Staff)',
          relationshipStrength: 8,
          context: 'Regular policy briefings, strong rapport'
        },
        {
          from: 'John Smith',
          to: 'Sen. James Thompson',
          relationshipStrength: 6,
          context: 'Cross-office coordination'
        },
        {
          from: 'Sen. James Thompson',
          to: 'Sen. Barbara Williams',
          relationshipStrength: 8,
          context: 'Strong cross-chamber relationship'
        }
      ]
    });
    
    paths.push({
      path: ['client-1', 'leg-5', 'leg-1'],
      score: 72,
      length: 2,
      estimatedTimeline: '1 week (but lower success probability)',
      recommendations: [
        'Leverage Davis-Williams party alignment',
        'Note: Davis relationship needs strengthening first',
        'Consider as backup route'
      ],
      intermediateConnections: [
        {
          from: 'Desert Solar Coalition',
          to: 'Sen. Patricia Davis',
          relationshipStrength: 6,
          context: 'Limited contact, shared policy interests'
        },
        {
          from: 'Sen. Patricia Davis',
          to: 'Sen. Barbara Williams',
          relationshipStrength: 9,
          context: 'Strong party colleagues'
        }
      ]
    });
  }
  
  return paths;
}

// Calculate influence cascade
export function calculateInfluenceCascade(nodeId: string): Array<{
  nodeId: string;
  probability: number;
  tier: number;
}> {
  // Mock influence cascade data
  return [
    { nodeId: 'leg-4', probability: 0.73, tier: 1 },
    { nodeId: 'leg-5', probability: 0.68, tier: 1 },
    { nodeId: 'leg-6', probability: 0.45, tier: 2 },
  ];
}

// Get relationship history
export function getRelationshipHistory(sourceId: string, targetId: string): Interaction[] {
  const edge = demoNetworkEdges.find(
    e => (e.source === sourceId && e.target === targetId) || 
         (e.source === targetId && e.target === sourceId)
  );
  return edge?.interactionHistory || [];
}

// Legacy types for backward compatibility with ConstellationMap component
export interface LegacyNetworkNode {
  id: string;
  label: string;
  type: 'legislator' | 'bill' | 'client' | 'interest-group' | 'donor';
  x: number;
  y: number;
  radius: number;
  group?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  type: string;
}

// Legacy export for backward compatibility
export const mockConstellationData = {
  nodes: [
    { id: 'leg-1', label: 'Sen. Williams', type: 'legislator' as const, x: 200, y: 150, radius: 20, group: 'Senate' },
    { id: 'leg-2', label: 'Rep. Martinez', type: 'legislator' as const, x: 350, y: 180, radius: 18, group: 'House' },
    { id: 'leg-3', label: 'Sen. Thompson', type: 'legislator' as const, x: 250, y: 300, radius: 18, group: 'Senate' },
    { id: 'bill-1', label: 'HB-847', type: 'bill' as const, x: 450, y: 250, radius: 16 },
    { id: 'bill-2', label: 'SB-523', type: 'bill' as const, x: 300, y: 400, radius: 16 },
    { id: 'client-1', label: 'Desert Solar', type: 'client' as const, x: 150, y: 400, radius: 22 },
    { id: 'client-2', label: 'AZ Tech', type: 'client' as const, x: 500, y: 150, radius: 18 },
    { id: 'interest-1', label: 'Solar Industry', type: 'interest-group' as const, x: 400, y: 350, radius: 15 },
    { id: 'donor-1', label: 'Clean Energy PAC', type: 'donor' as const, x: 250, y: 200, radius: 14 },
  ],
  links: [
    { source: 'client-1', target: 'leg-2', type: 'client-relationship' },
    { source: 'leg-2', target: 'bill-1', type: 'sponsor' },
    { source: 'leg-1', target: 'bill-2', type: 'sponsor' },
    { source: 'leg-3', target: 'bill-1', type: 'cosponsor' },
    { source: 'client-2', target: 'leg-1', type: 'client-relationship' },
    { source: 'interest-1', target: 'bill-1', type: 'support' },
    { source: 'donor-1', target: 'leg-1', type: 'donation' },
    { source: 'donor-1', target: 'leg-2', type: 'donation' },
    { source: 'leg-2', target: 'leg-3', type: 'coalition' },
    { source: 'client-1', target: 'bill-1', type: 'support' },
  ]
};