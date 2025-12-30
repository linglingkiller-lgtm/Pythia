// Mock data for Issues/Heat Map page

export interface MediaMention {
  source: string;
  title: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  snippet: string;
  urlPlaceholder: string;
}

export interface Representative {
  name: string;
  officeTitle: string;
  positionType: 'state-senator' | 'state-representative' | 'county-supervisor' | 'us-representative' | 'us-senator' | 'mayor' | 'city-council';
  party: 'R' | 'D' | 'I';
  email: string;
  phone: string;
  committees: string[];
  lastInteraction?: string;
  relationshipMeter?: {
    score: number;
    recency: number;
    frequency: number;
    responsiveness: number;
    issueAlignment: number;
    strategicRelevance: number;
  };
}

export interface RevereInsights {
  narrativeShift: string;
  keyPatterns: string[];
  riskFlags: string[];
  recommendedActions: string[];
  confidence: number;
}

// State trend scores (0-100)
export const stateScores: Record<string, number> = {
  AZ: 89,
  CA: 76,
  TX: 82,
  FL: 65,
  NY: 71,
  PA: 54,
  OH: 48,
  GA: 73,
  NC: 67,
  MI: 59,
  VA: 61,
  WA: 78,
  CO: 85,
  NV: 72,
  NM: 68,
  OR: 74,
  UT: 56,
  ID: 42,
  MT: 38,
  WY: 35,
};

// County trend scores (sample for AZ)
export const countyScores: Record<string, number> = {
  '04013': 92, // Maricopa County, AZ
  '04019': 85, // Pima County, AZ
  '04021': 67, // Pinal County, AZ
  '04025': 54, // Yavapai County, AZ
  '04027': 48, // Yuma County, AZ
  '04003': 71, // Cochise County, AZ
  '04005': 63, // Coconino County, AZ
  '04015': 58, // Mohave County, AZ
};

// District trend scores (sample)
export const districtScores: Record<string, number> = {
  '04-01': 88,
  '04-02': 76,
  '04-03': 91,
  '04-04': 82,
  '04-05': 79,
  '04-06': 68,
  '04-07': 85,
  '04-08': 73,
  '04-09': 87,
};

// State-level keywords
export const stateKeywords: Record<string, string[]> = {
  AZ: ['solar incentives', 'grid modernization', 'utility rates', 'renewable portfolio'],
  CA: ['climate goals', 'carbon pricing', 'electric vehicles', 'solar mandates'],
  TX: ['grid reliability', 'wind energy', 'natural gas', 'ERCOT reform'],
  FL: ['solar tax', 'sea level', 'hurricane resilience', 'utility regulation'],
  NY: ['offshore wind', 'climate act', 'green banks', 'building standards'],
};

// County-level keywords (sample for AZ)
export const countyKeywords: Record<string, string[]> = {
  '04013': ['permitting delays', 'zoning changes', 'interconnection', 'community solar'],
  '04019': ['rooftop solar', 'net metering', 'energy storage', 'utility opposition'],
  '04021': ['industrial solar', 'land use', 'water rights', 'transmission'],
};

// District-level keywords (sample)
export const districtKeywords: Record<string, string[]> = {
  '04-01': ['jobs creation', 'manufacturing', 'workforce training', 'economic development'],
  '04-03': ['environmental justice', 'low-income access', 'bill affordability', 'weatherization'],
  '04-07': ['reliability concerns', 'fossil fuel transition', 'grid stability', 'cost impacts'],
};

// Media mentions by region
export const mediaMentionsByState: Record<string, MediaMention[]> = {
  AZ: [
    {
      source: 'Arizona Republic',
      title: 'APS proposes major clean energy expansion for 2025',
      date: '2024-12-18',
      sentiment: 'positive',
      snippet: 'Arizona Public Service unveiled plans to add 1,500 MW of solar and battery storage...',
      urlPlaceholder: '#',
    },
    {
      source: 'Phoenix Business Journal',
      title: 'Solar industry groups challenge new permitting rules',
      date: '2024-12-15',
      sentiment: 'negative',
      snippet: 'Trade associations filed a lawsuit against Maricopa County over expedited review processes...',
      urlPlaceholder: '#',
    },
    {
      source: 'AZ Mirror',
      title: 'Legislature to debate renewable energy standards in January session',
      date: '2024-12-12',
      sentiment: 'neutral',
      snippet: 'Bipartisan group proposes amendments to state renewable portfolio standard...',
      urlPlaceholder: '#',
    },
    {
      source: 'Cronkite News',
      title: 'Tribal leaders advocate for energy sovereignty in renewable projects',
      date: '2024-12-10',
      sentiment: 'neutral',
      snippet: 'Coalition calls for more tribal participation in utility-scale solar development...',
      urlPlaceholder: '#',
    },
    {
      source: 'Verde Independent',
      title: 'Rural communities push back on transmission line expansions',
      date: '2024-12-08',
      sentiment: 'negative',
      snippet: 'Residents express concerns about visual impact and property values...',
      urlPlaceholder: '#',
    },
    {
      source: 'Tucson Sentinel',
      title: 'TEP announces battery storage partnership with local university',
      date: '2024-12-05',
      sentiment: 'positive',
      snippet: 'Tucson Electric Power and University of Arizona team up on grid-scale battery research...',
      urlPlaceholder: '#',
    },
  ],
};

export const mediaMentionsByCounty: Record<string, MediaMention[]> = {
  '04013': [
    {
      source: 'Maricopa County News',
      title: 'County approves fast-track solar permitting pilot program',
      date: '2024-12-17',
      sentiment: 'positive',
      snippet: 'Board of Supervisors votes 4-1 to streamline residential solar installations...',
      urlPlaceholder: '#',
    },
    {
      source: 'East Valley Tribune',
      title: 'Homeowners report delays in interconnection approvals',
      date: '2024-12-14',
      sentiment: 'negative',
      snippet: 'Average wait time for SRP interconnection has increased to 90 days...',
      urlPlaceholder: '#',
    },
    {
      source: 'Phoenix New Times',
      title: 'Community solar program reaches 10,000 subscribers',
      date: '2024-12-11',
      sentiment: 'positive',
      snippet: 'APS community solar initiative exceeds enrollment targets ahead of schedule...',
      urlPlaceholder: '#',
    },
  ],
};

export const mediaMentionsByDistrict: Record<string, MediaMention[]> = {
  '04-03': [
    {
      source: 'District 3 Community Voice',
      title: 'Rep. Gallego tours solar manufacturing facility in district',
      date: '2024-12-16',
      sentiment: 'positive',
      snippet: 'Congressional representative highlights job creation from clean energy investments...',
      urlPlaceholder: '#',
    },
    {
      source: 'Local Energy News',
      title: 'Environmental justice groups demand equitable solar access',
      date: '2024-12-13',
      sentiment: 'neutral',
      snippet: 'Coalition calls for programs targeting low-income neighborhoods in District 3...',
      urlPlaceholder: '#',
    },
  ],
};

// Representative lookup by county - now supports multiple officials per county
export const repsByCounty: Record<string, Representative[]> = {
  '04013': [ // Maricopa County, AZ
    {
      name: 'Sen. Maria Gonzalez',
      officeTitle: 'State Senator, District 17',
      positionType: 'state-senator',
      party: 'D',
      email: 'mgonzalez@azleg.gov',
      phone: '(602) 926-5550',
      committees: ['Commerce', 'Natural Resources & Energy', 'Transportation'],
      lastInteraction: '2024-11-28',
      relationshipMeter: {
        score: 76,
        recency: 25,
        frequency: 16,
        responsiveness: 13,
        issueAlignment: 12,
        strategicRelevance: 10,
      },
    },
    {
      name: 'Rep. Jennifer Pawlik',
      officeTitle: 'State Representative, District 17',
      positionType: 'state-representative',
      party: 'D',
      email: 'jpawlik@azleg.gov',
      phone: '(602) 926-5551',
      committees: ['Commerce', 'Government & Elections'],
      lastInteraction: '2024-12-05',
      relationshipMeter: {
        score: 68,
        recency: 22,
        frequency: 14,
        responsiveness: 11,
        issueAlignment: 11,
        strategicRelevance: 10,
      },
    },
    {
      name: 'Thomas Galvin',
      officeTitle: 'Maricopa County Supervisor, District 1',
      positionType: 'county-supervisor',
      party: 'R',
      email: 'thomas.galvin@maricopa.gov',
      phone: '(602) 506-3401',
      committees: ['Planning & Zoning', 'Transportation', 'Public Safety'],
      lastInteraction: '2024-11-15',
      relationshipMeter: {
        score: 62,
        recency: 18,
        frequency: 12,
        responsiveness: 10,
        issueAlignment: 9,
        strategicRelevance: 13,
      },
    },
    {
      name: 'Jack Sellers',
      officeTitle: 'Maricopa County Supervisor, District 3 (Board Chairman)',
      positionType: 'county-supervisor',
      party: 'R',
      email: 'jack.sellers@maricopa.gov',
      phone: '(602) 506-3403',
      committees: ['Finance', 'Public Works', 'Health & Human Services'],
      lastInteraction: '2024-10-30',
      relationshipMeter: {
        score: 58,
        recency: 15,
        frequency: 10,
        responsiveness: 9,
        issueAlignment: 10,
        strategicRelevance: 14,
      },
    },
    {
      name: 'Kate Gallego',
      officeTitle: 'Mayor of Phoenix',
      positionType: 'mayor',
      party: 'D',
      email: 'mayor.gallego@phoenix.gov',
      phone: '(602) 262-7111',
      committees: ['City Council', 'Regional Transportation Committee'],
      lastInteraction: '2024-12-12',
      relationshipMeter: {
        score: 81,
        recency: 27,
        frequency: 17,
        responsiveness: 14,
        issueAlignment: 13,
        strategicRelevance: 10,
      },
    },
  ],
  '04019': [ // Pima County, AZ
    {
      name: 'Sen. Justine Wadsack',
      officeTitle: 'State Senator, District 17',
      positionType: 'state-senator',
      party: 'R',
      email: 'jwadsack@azleg.gov',
      phone: '(602) 926-5566',
      committees: ['Transportation & Technology', 'Commerce'],
      lastInteraction: '2024-09-18',
    },
    {
      name: 'Sharon Bronson',
      officeTitle: 'Pima County Supervisor, District 3',
      positionType: 'county-supervisor',
      party: 'D',
      email: 'sharon.bronson@pima.gov',
      phone: '(520) 724-8094',
      committees: ['Energy & Environment', 'Economic Development', 'Health'],
      lastInteraction: '2024-10-22',
      relationshipMeter: {
        score: 73,
        recency: 23,
        frequency: 15,
        responsiveness: 12,
        issueAlignment: 12,
        strategicRelevance: 11,
      },
    },
    {
      name: 'Regina Romero',
      officeTitle: 'Mayor of Tucson',
      positionType: 'mayor',
      party: 'D',
      email: 'mayor@tucsonaz.gov',
      phone: '(520) 791-4201',
      committees: ['City Council', 'Regional Council'],
      lastInteraction: '2024-11-08',
      relationshipMeter: {
        score: 85,
        recency: 28,
        frequency: 18,
        responsiveness: 14,
        issueAlignment: 14,
        strategicRelevance: 11,
      },
    },
  ],
};

// Keep old single-rep lookups for backwards compatibility
export const repByCounty: Record<string, Representative> = {
  '04013': repsByCounty['04013'][0],
  '04019': repsByCounty['04019'][0],
};

// Representative lookup by district
export const repByDistrict: Record<string, Representative> = {
  '04-01': {
    name: 'David Schweikert',
    officeTitle: 'U.S. Representative, AZ-01',
    positionType: 'us-representative',
    party: 'R',
    email: 'rep.schweikert@mail.house.gov',
    phone: '(202) 225-2190',
    committees: ['Ways and Means', 'Joint Economic Committee'],
    relationshipMeter: {
      score: 68,
      recency: 22,
      frequency: 15,
      responsiveness: 12,
      issueAlignment: 11,
      strategicRelevance: 8,
    },
  },
  '04-03': {
    name: 'Ruben Gallego',
    officeTitle: 'U.S. Representative, AZ-03',
    positionType: 'us-representative',
    party: 'D',
    email: 'rep.gallego@mail.house.gov',
    phone: '(202) 225-4065',
    committees: ['Armed Services', 'Natural Resources'],
    relationshipMeter: {
      score: 82,
      recency: 28,
      frequency: 18,
      responsiveness: 14,
      issueAlignment: 13,
      strategicRelevance: 9,
    },
  },
  '04-07': {
    name: 'Raúl Grijalva',
    officeTitle: 'U.S. Representative, AZ-07',
    positionType: 'us-representative',
    party: 'D',
    email: 'rep.grijalva@mail.house.gov',
    phone: '(202) 225-2435',
    committees: ['Natural Resources (Chair)', 'Education and Labor'],
    relationshipMeter: {
      score: 91,
      recency: 30,
      frequency: 20,
      responsiveness: 15,
      issueAlignment: 15,
      strategicRelevance: 11,
    },
  },
};

// Revere Insights by region
export const revereInsightsByState: Record<string, RevereInsights> = {
  AZ: {
    narrativeShift: 'Arizona media coverage has shifted from grid reliability concerns to proactive clean energy expansion. Utility opposition to rooftop solar has decreased as major utilities pivot to storage and renewables.',
    keyPatterns: [
      'Bipartisan support emerging for battery storage incentives',
      'Tribal energy sovereignty becoming central to policy discussions',
      'Rural counties showing increased skepticism toward transmission projects',
      'Solar manufacturing attracting significant legislative attention',
    ],
    riskFlags: [
      'Pending litigation on county permitting rules could delay projects',
      'Grid interconnection queue backlog growing 15% month-over-month',
      'Opposition groups filing complaints with Corporation Commission',
    ],
    recommendedActions: [
      'Brief key legislators on manufacturing job creation metrics before January session',
      'Engage tribal leadership early on energy sovereignty provisions',
      'Prepare proactive messaging on grid reliability benefits of battery storage',
      'Coordinate with county supervisors on permitting streamlining solutions',
    ],
    confidence: 87,
  },
};

export const revereInsightsByCounty: Record<string, RevereInsights> = {
  '04013': {
    narrativeShift: 'Maricopa County discourse has moved from opposition to enabling policies. County supervisors responding positively to industry proposals for streamlined processes.',
    keyPatterns: [
      'Supervisor Galvin softening stance on solar development',
      'Permitting delays becoming top constituent complaint',
      'Community solar programs exceeding expectations',
      'Commercial developers seeking larger project pipelines',
    ],
    riskFlags: [
      'Legal challenge to permitting pilot could halt implementation',
      'SRP interconnection delays affecting customer satisfaction',
    ],
    recommendedActions: [
      'Schedule meeting with Supervisor Galvin to discuss permitting solutions',
      'Provide Board of Supervisors with economic impact data',
      'Engage SRP leadership on interconnection process improvements',
    ],
    confidence: 82,
  },
};

export const revereInsightsByDistrict: Record<string, RevereInsights> = {
  '04-03': {
    narrativeShift: 'District 3 coverage increasingly focused on jobs and economic development rather than environmental benefits. Rep. Gallego positioning clean energy as workforce development opportunity.',
    keyPatterns: [
      'Manufacturing jobs narrative gaining traction',
      'Environmental justice groups becoming vocal stakeholders',
      'Low-income energy access emerging as policy priority',
      'Labor unions supporting solar manufacturing expansion',
    ],
    riskFlags: [
      'Equity concerns could slow project approvals without proactive engagement',
      'Some constituents concerned about energy costs',
    ],
    recommendedActions: [
      'Coordinate with Rep. Gallego on manufacturing facility tour opportunities',
      'Develop targeted programs for low-income solar access in district',
      'Partner with local workforce development organizations',
      'Schedule meeting with environmental justice coalition',
    ],
    confidence: 85,
  },
};

// Top states by score for Overview panel
export const topStatesByScore = Object.entries(stateScores)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([state, score]) => ({ state, score }));

// Biggest movers (mock)
export const biggestMovers = [
  { state: 'AZ', change: +12, period: '30d' },
  { state: 'CO', change: +8, period: '30d' },
  { state: 'WA', change: +7, period: '30d' },
  { state: 'TX', change: -5, period: '30d' },
  { state: 'FL', change: -3, period: '30d' },
];