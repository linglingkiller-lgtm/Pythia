// Comprehensive mock data for Issues Intelligence Hub
// This file contains structured data that can be easily replaced with real API calls

export type Sentiment = 'pos' | 'neu' | 'neg';
export type MentionType = 'news' | 'social' | 'press' | 'committee';
export type TimeWindow = '7d' | '30d' | 'session';
export type Issue = 'clean-energy' | 'education' | 'healthcare' | 'tech';

// ========== State/County/District Scores ==========
export const stateScores: Record<string, number> = {
  'California': 92,
  'Texas': 78,
  'New York': 85,
  'Florida': 71,
  'Pennsylvania': 68,
  'Ohio': 64,
  'Illinois': 73,
  'Michigan': 59,
  'Georgia': 55,
  'North Carolina': 52,
  'Arizona': 48,
  'Washington': 62,
  'Massachusetts': 58,
  'Virginia': 51,
  'Wisconsin': 47,
  'Colorado': 54,
  'Minnesota': 49,
  'Nevada': 44,
  'Tennessee': 41,
  'Oregon': 46,
};

export const countyScores: Record<string, number> = {
  '06037': 88, // Los Angeles County, CA
  '06073': 76, // San Diego County, CA
  '48201': 65, // Harris County, TX
  '36061': 82, // New York County, NY
};

export const districtScores: Record<string, number> = {
  '06-12': 87, // CA-12
  '06-13': 91, // CA-13
  '48-02': 68, // TX-02
  '36-12': 84, // NY-12
};

// ========== Keywords by Region ==========
export const stateKeywords: Record<string, string[]> = {
  'California': ['solar', 'grid modernization', 'clean energy jobs'],
  'Texas': ['cost concerns', 'grid reliability', 'fossil fuel'],
  'New York': ['renewable', 'climate action', 'offshore wind'],
};

export const countyKeywords: Record<string, string[]> = {
  '06037': ['EV charging', 'solar panels', 'green jobs'],
};

export const districtKeywords: Record<string, string[]> = {
  '06-12': ['clean energy mandate', 'carbon tax'],
};

// ========== Mentions (unified across regions) ==========
export interface Mention {
  id: string;
  type: MentionType;
  regionKey: string; // state name, county FIPS, or district key
  topicId?: string;
  narrativeId?: string;
  source: string;
  titleOrText: string;
  dateISO: string;
  sentiment: Sentiment;
  snippet: string;
  relevanceScore: number; // 0-100
  urlPlaceholder: string;
}

export const mentions: Mention[] = [
  {
    id: 'm001',
    type: 'news',
    regionKey: 'California',
    topicId: 't01',
    narrativeId: 'n01',
    source: 'Los Angeles Times',
    titleOrText: 'California pushes forward with ambitious clean energy timeline',
    dateISO: '2024-12-20T10:30:00Z',
    sentiment: 'pos',
    snippet: 'State officials announced accelerated deployment of solar infrastructure...',
    relevanceScore: 94,
    urlPlaceholder: '#',
  },
  {
    id: 'm002',
    type: 'social',
    regionKey: 'Texas',
    topicId: 't01',
    narrativeId: 'n02',
    source: 'Twitter/X',
    titleOrText: '@TexasEnergy: Grid reliability must come first before renewable mandates',
    dateISO: '2024-12-20T08:15:00Z',
    sentiment: 'neg',
    snippet: 'Concerns raised about winter storm preparedness...',
    relevanceScore: 78,
    urlPlaceholder: '#',
  },
];

// ========== Topics ==========
export interface Topic {
  topicId: string;
  name: string;
  descriptionShort: string;
  tags: string[];
  icon: string;
  sampleKeywords: string[];
  heatScore: number; // 0-100
  mentionCountLastWeek: number;
  sentimentNetPercent: number; // -100 to +100
  momentumDelta: number; // % change
}

export const topicsByIssue: Record<Issue, Topic[]> = {
  'clean-energy': [
    {
      topicId: 't01',
      name: 'Solar Energy Expansion',
      descriptionShort: 'Large-scale solar deployment and residential incentives',
      tags: ['solar', 'renewable', 'grid'],
      icon: 'sun',
      sampleKeywords: ['solar panels', 'photovoltaic', 'solar farm'],
      heatScore: 87,
      mentionCountLastWeek: 342,
      sentimentNetPercent: 24,
      momentumDelta: 18,
    },
    {
      topicId: 't02',
      name: 'Grid Modernization',
      descriptionShort: 'Smart grid technology and infrastructure upgrades',
      tags: ['infrastructure', 'technology', 'reliability'],
      icon: 'zap',
      sampleKeywords: ['smart grid', 'transmission', 'energy storage'],
      heatScore: 72,
      mentionCountLastWeek: 218,
      sentimentNetPercent: 12,
      momentumDelta: 9,
    },
    {
      topicId: 't03',
      name: 'Clean Energy Jobs',
      descriptionShort: 'Workforce development and job creation in renewable sector',
      tags: ['jobs', 'workforce', 'training'],
      icon: 'briefcase',
      sampleKeywords: ['green jobs', 'training programs', 'workforce'],
      heatScore: 65,
      mentionCountLastWeek: 184,
      sentimentNetPercent: 31,
      momentumDelta: -4,
    },
  ],
  'education': [],
  'healthcare': [],
  'tech': [],
};

// ========== Narratives ==========
export interface Narrative {
  narrativeId: string;
  name: string;
  frameType: 'supportive' | 'oppositional' | 'neutral';
  descriptionShort: string;
  sampleClaims: string[];
  responseFrames: string[];
  strength: number; // 0-100
  trajectory: 'rising' | 'stable' | 'declining';
  reachEstimate: string;
  topRegions: string[];
  dominantFrame: string;
}

export const narrativesByIssue: Record<Issue, Narrative[]> = {
  'clean-energy': [
    {
      narrativeId: 'n01',
      name: 'Economic Opportunity Frame',
      frameType: 'supportive',
      descriptionShort: 'Clean energy as job creator and economic driver',
      sampleClaims: [
        'Clean energy creates more jobs per dollar than fossil fuels',
        'Renewable energy is the fastest-growing sector',
      ],
      responseFrames: [
        'Highlight local job creation statistics',
        'Showcase successful workforce development programs',
      ],
      strength: 85,
      trajectory: 'rising',
      reachEstimate: '2.4M',
      topRegions: ['California', 'Texas', 'New York', 'Florida', 'Pennsylvania'],
      dominantFrame: 'Jobs & Economy',
    },
    {
      narrativeId: 'n02',
      name: 'Cost Concerns Frame',
      frameType: 'oppositional',
      descriptionShort: 'Focus on upfront costs and rate impacts',
      sampleClaims: [
        'Renewable energy will raise electricity rates',
        'Transition costs will burden consumers',
      ],
      responseFrames: [
        'Present long-term cost savings data',
        'Emphasize declining technology costs',
      ],
      strength: 62,
      trajectory: 'declining',
      reachEstimate: '1.8M',
      topRegions: ['Texas', 'Ohio', 'Pennsylvania', 'Michigan', 'Wisconsin'],
      dominantFrame: 'Economic Burden',
    },
    {
      narrativeId: 'n03',
      name: 'Energy Independence',
      frameType: 'supportive',
      descriptionShort: 'Renewable energy reduces foreign energy dependence',
      sampleClaims: [
        'Domestic renewable energy strengthens national security',
        'Reduces reliance on foreign oil',
      ],
      responseFrames: [
        'Link to national security messaging',
        'Highlight bipartisan support',
      ],
      strength: 73,
      trajectory: 'stable',
      reachEstimate: '1.9M',
      topRegions: ['Texas', 'Arizona', 'Nevada', 'New Mexico', 'Colorado'],
      dominantFrame: 'National Security',
    },
    {
      narrativeId: 'n04',
      name: 'Grid Reliability Concerns',
      frameType: 'oppositional',
      descriptionShort: 'Questions about intermittent renewable power',
      sampleClaims: [
        'Wind and solar cannot provide baseload power',
        'Grid stability requires fossil fuel backup',
      ],
      responseFrames: [
        'Showcase battery storage advancements',
        'Present grid modernization solutions',
      ],
      strength: 58,
      trajectory: 'declining',
      reachEstimate: '1.5M',
      topRegions: ['Texas', 'California', 'Arizona', 'Nevada', 'New Mexico'],
      dominantFrame: 'Technical Feasibility',
    },
  ],
  'education': [],
  'healthcare': [],
  'tech': [],
};

// ========== Bills ==========
export interface Bill {
  billId: string;
  title: string;
  chamber: 'house' | 'senate' | 'state_house' | 'state_senate';
  status: 'active' | 'dead' | 'passed';
  stage: 'Introduced' | 'Committee' | 'Floor' | 'Governor' | 'Enacted';
  progressPct: number; // 0-100
  sponsors: string[];
  keyMembers: string[];
  lastActionDateISO: string;
  summaryBullets: string[];
  redFlags: string[];
}

export const billsByTopic: Record<string, Bill[]> = {
  't01': [
    {
      billId: 'CA-SB-100',
      title: 'Clean Energy and Pollution Reduction Act',
      chamber: 'state_senate',
      status: 'active',
      stage: 'Committee',
      progressPct: 45,
      sponsors: ['Sen. Wiener', 'Sen. Stern'],
      keyMembers: ['Sen. Allen (Chair)', 'Sen. Grove'],
      lastActionDateISO: '2024-12-18T00:00:00Z',
      summaryBullets: [
        'Requires 100% clean electricity by 2045',
        'Establishes interim targets of 60% by 2030',
        'Creates clean energy jobs fund',
      ],
      redFlags: ['Potential floor vote delayed', 'Opposition from utilities'],
    },
  ],
};

// ========== People (Legislators/Contacts) ==========
export interface Person {
  personId: string;
  name: string;
  officeTitle: string;
  chamber: 'house' | 'senate' | 'state_house' | 'state_senate';
  party: 'D' | 'R' | 'I';
  committees: string[];
  emailPlaceholder: string;
  phonePlaceholder: string;
  districtLabel: string;
  relationshipMeter: {
    score0to100: number;
    tier: 'strong' | 'moderate' | 'developing' | 'none';
    breakdown: {
      recency: number;
      frequency: number;
      responsiveness: number;
      alignment: number;
      relevance: number;
    };
  };
  lastInteractionDateISO: string;
}

export const peopleByTopic: Record<string, Person[]> = {
  't01': [
    {
      personId: 'p001',
      name: 'Sen. Maria Gonzalez',
      officeTitle: 'State Senator, District 24',
      chamber: 'state_senate',
      party: 'D',
      committees: ['Energy & Utilities', 'Environmental Quality'],
      emailPlaceholder: 'maria.gonzalez@senate.ca.gov',
      phonePlaceholder: '(916) 555-0001',
      districtLabel: 'CA-SD-24',
      relationshipMeter: {
        score0to100: 82,
        tier: 'strong',
        breakdown: {
          recency: 90,
          frequency: 75,
          responsiveness: 88,
          alignment: 92,
          relevance: 85,
        },
      },
      lastInteractionDateISO: '2024-12-15T00:00:00Z',
    },
  ],
};

// ========== Pythia Insights ==========
export interface PythiaInsight {
  narrativeShift?: string;
  keyPatterns: string[];
  riskFlags: string[];
  recommendedActions: string[];
  confidence0to100: number;
}

export const pythiaInsightsByRegionTopic: Record<string, PythiaInsight> = {
  'California_t01': {
    narrativeShift: 'Solar energy expansion narrative gaining 34% momentum in last 72 hours',
    keyPatterns: [
      'Increased mentions of "grid modernization" coinciding with solar discussion',
      'Job creation language appearing in 68% of supportive coverage',
    ],
    riskFlags: [
      'Cost concern narrative emerging in suburban districts',
      'Utility opposition coordinating messaging',
    ],
    recommendedActions: [
      'Brief allied legislators on coordinated jobs messaging',
      'Prep stakeholder talking points on cost savings',
      'Schedule media hits in swing districts within 48 hours',
    ],
    confidence0to100: 87,
  },
};

export const pythiaInsightsByRegionNarrative: Record<string, PythiaInsight> = {
  'California_n01': {
    keyPatterns: [
      'Economic opportunity frame resonating in manufacturing districts',
      'Bipartisan support forming around job creation angle',
    ],
    riskFlags: [],
    recommendedActions: [
      'Amplify job creation statistics from trusted local sources',
      'Engage labor unions for coalition building',
    ],
    confidence0to100: 91,
  },
};

// ========== Pins, Saved Views, Alerts ==========
export interface Pin {
  id: string;
  type: 'region' | 'topic' | 'narrative' | 'bill' | 'mention' | 'person';
  itemId: string;
  label: string;
  timestamp: string;
}

export const pins: Pin[] = [
  {
    id: 'pin001',
    type: 'topic',
    itemId: 't01',
    label: 'Solar Energy Expansion',
    timestamp: '2024-12-20T12:00:00Z',
  },
];

export interface SavedView {
  id: string;
  name: string;
  issueId: Issue;
  timeWindow: TimeWindow;
  tab: string;
  selectedRegion: string | null;
  selectedTopic: string | null;
  selectedNarrative: string | null;
  filters: {
    sources: MentionType[];
    sentiment: Sentiment[];
  };
  compareSelections: string[];
}

export const savedViews: SavedView[] = [];

export interface Alert {
  id: string;
  type: 'mention_spike' | 'sentiment_drop' | 'bill_stage';
  threshold: number;
  isActive: boolean;
  lastTriggered: string | null;
}

export const alerts: Alert[] = [];

// ========== Top States (for leaderboards) ==========
export const topStatesByScore = Object.entries(stateScores)
  .map(([state, score]) => ({ state, score }))
  .sort((a, b) => b.score - a.score);

// ========== Biggest Movers (mock time-series change) ==========
export const biggestMovers = [
  { state: 'Arizona', change: +12, score: 48 },
  { state: 'Georgia', change: +9, score: 55 },
  { state: 'Nevada', change: -5, score: 44 },
];