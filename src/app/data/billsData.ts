export interface Bill {
  id: string;
  billId: string;
  title: string;
  shortTitle: string;
  jurisdiction: 'federal' | 'state';
  status: 'introduced' | 'committee' | 'floor' | 'passed-chamber' | 'second-chamber' | 'governor' | 'signed' | 'vetoed';
  nextActionDate: string;
  nextActionDescription: string;
  issueTags: string[];
  sponsorIds: string[];
  sponsorNames: string[];
  committeeIds: string[];
  committeeName?: string;
  versions: BillVersion[];
  aiSummaryOneLine: string;
  flags: BillFlag[];
  stance: 'support' | 'oppose' | 'monitor' | 'neutral';
  momentumScore: number; // 0-100
  heatLevel: 'low' | 'medium' | 'high';
  isPinned: boolean;
  lastViewed?: string;
  clientTags?: string[];
}

export interface BillVersion {
  id: string;
  date: string;
  type: 'introduced' | 'committee-substitute' | 'amendment' | 'engrossed' | 'enrolled';
  textLink: string;
  aiChangeSummary: string[];
}

export interface BillAIReview {
  billId: string;
  summaryBullets: string[];
  impactsByLens: {
    [lens: string]: {
      topImpacts: string[];
      complianceBurdens: string[];
      potentialCosts: string[];
      beneficiaries: string[];
      opponents: string[];
    };
  };
  riskFlags: RiskFlag[];
  talkingPoints: {
    [tone: string]: {
      mainPoints: string[];
      thirtySecondVersion: string;
      qAndA: { question: string; answer: string }[];
    };
  };
  amendmentConcepts: AmendmentConcept[];
  generatedAt: string;
}

export interface RiskFlag {
  severity: 'red' | 'yellow' | 'green';
  label: string;
  explanation: string;
  sectionReference: string;
  mitigation?: string;
}

export interface AmendmentConcept {
  title: string;
  description: string;
  targetSection: string;
  rationale: string;
}

export interface BillFlag {
  type: 'amended' | 'hearing-scheduled' | 'fiscal-impact' | 'high-risk' | 'fast-track' | 'controversial';
  label: string;
  color: string;
}

export interface MemberInsight {
  personId: string;
  billId: string;
  name: string;
  role: string;
  stanceEstimate: 'support' | 'oppose' | 'unknown';
  supportLikelihood: 'low' | 'medium' | 'high';
  supportPercentage?: number;
  factors: string[];
  confidence: 'low' | 'medium' | 'high';
  lastInteractionDate?: string;
  relationshipOwner?: string;
}

export interface BillMomentum {
  billId: string;
  score: number; // 0-100
  trend: 'up' | 'down' | 'steady';
  trendChange: number; // percentage change vs last week
  nextStepGuess: string;
  nextStepConfidence: 'low' | 'medium' | 'high';
  stallRisks: string[];
}

export interface Mention {
  id: string;
  billId: string;
  sourceType: 'news' | 'press-release' | 'social';
  title: string;
  snippet: string;
  url: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
}

export interface BillTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  ownerId: string;
  ownerName: string;
  linkedBillId: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Mock data - 8 Comprehensive Example Bills
export const mockBills: Bill[] = [
  // Bill 1: Clean Energy Grid Modernization
  {
    id: 'bill-001',
    billId: 'HB 2847',
    title: 'An Act Relating to Clean Energy Grid Modernization and Renewable Portfolio Standards Enhancement',
    shortTitle: 'Clean Energy Grid Modernization Act',
    jurisdiction: 'state',
    status: 'committee',
    nextActionDate: '2025-12-20',
    nextActionDescription: 'Committee Hearing - Energy & Environment',
    issueTags: ['Energy', 'Environment', 'Infrastructure', 'Climate'],
    sponsorIds: ['leg-001', 'leg-002'],
    sponsorNames: ['Rep. Sarah Martinez (D-14)', 'Sen. James Chen (D-22)'],
    committeeIds: ['comm-energy'],
    committeeName: 'Energy & Environment Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-11-15',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Original bill introduced with 100% renewable energy target by 2045'],
      },
      {
        id: 'v2',
        date: '2025-12-08',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Amended renewable target to 85% by 2045',
          'Added $500M grid modernization fund',
          'Included nuclear energy in "clean" definition',
          'Extended compliance deadline for rural utilities by 3 years'
        ],
      },
    ],
    aiSummaryOneLine: 'Requires 85% renewable energy by 2045 with $500M grid modernization fund and nuclear inclusion.',
    flags: [
      { type: 'amended', label: 'Amended in Committee', color: 'blue' },
      { type: 'hearing-scheduled', label: 'Hearing Dec 20', color: 'purple' },
      { type: 'fiscal-impact', label: '$500M Appropriation', color: 'orange' },
    ],
    stance: 'support',
    momentumScore: 72,
    heatLevel: 'high',
    isPinned: true,
    lastViewed: '2025-12-17',
    clientTags: ['Phoenix Energy Coalition', 'Clean Energy Now'],
  },

  // Bill 2: Healthcare Workforce Development
  {
    id: 'bill-002',
    billId: 'SB 1205',
    title: 'An Act to Address Healthcare Workforce Shortages Through Education Incentives and Loan Forgiveness',
    shortTitle: 'Healthcare Workforce Expansion Act',
    jurisdiction: 'state',
    status: 'floor',
    nextActionDate: '2025-12-19',
    nextActionDescription: 'Third Reading - Senate Floor',
    issueTags: ['Healthcare', 'Education', 'Workforce Development'],
    sponsorIds: ['leg-003', 'leg-004'],
    sponsorNames: ['Sen. Michael Torres (R-18)', 'Rep. Jennifer Park (D-9)'],
    committeeIds: ['comm-health'],
    committeeName: 'Health & Human Services Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-10-22',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Initial introduction with $200M in loan forgiveness programs'],
      },
      {
        id: 'v2',
        date: '2025-11-30',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Increased funding to $350M over 5 years',
          'Added rural practice requirements for loan forgiveness eligibility',
          'Expanded eligible professions to include mental health counselors',
          'Created residency match bonus for underserved areas'
        ],
      },
      {
        id: 'v3',
        date: '2025-12-10',
        type: 'amendment',
        textLink: '#',
        aiChangeSummary: [
          'Added sunset provision for 2030 program review',
          'Included reporting requirements on geographic distribution'
        ],
      },
    ],
    aiSummaryOneLine: 'Creates $350M loan forgiveness program for healthcare workers serving in rural and underserved areas.',
    flags: [
      { type: 'fiscal-impact', label: '$350M Over 5 Years', color: 'orange' },
      { type: 'fast-track', label: 'Fast-Tracked', color: 'green' },
    ],
    stance: 'support',
    momentumScore: 85,
    heatLevel: 'high',
    isPinned: true,
    lastViewed: '2025-12-18',
    clientTags: ['Arizona Hospital Association'],
  },

  // Bill 3: Data Privacy & Consumer Protection
  {
    id: 'bill-003',
    billId: 'HB 90',
    title: 'An Act Concerning Consumer Data Privacy Rights and Technology Company Accountability',
    shortTitle: 'Data Privacy & Consumer Protection Act',
    jurisdiction: 'state',
    status: 'committee',
    nextActionDate: '2025-12-21',
    nextActionDescription: 'Markup Session - Technology & Commerce Committee',
    issueTags: ['Technology', 'Privacy', 'Consumer Protection', 'Business Regulation'],
    sponsorIds: ['leg-005', 'leg-006'],
    sponsorNames: ['Rep. David Kim (D-11)', 'Sen. Rachel Goldman (D-25)'],
    committeeIds: ['comm-tech'],
    committeeName: 'Technology & Commerce Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-11-01',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Comprehensive consumer data rights modeled after GDPR'],
      },
      {
        id: 'v2',
        date: '2025-12-05',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Narrowed scope to businesses with 50,000+ consumers (down from 10,000)',
          'Extended compliance timeline from 180 days to 18 months',
          'Removed private right of action, enforcement limited to AG',
          'Added safe harbor for good-faith compliance efforts'
        ],
      },
    ],
    aiSummaryOneLine: 'Establishes consumer data privacy rights with 18-month compliance timeline for businesses serving 50,000+ consumers.',
    flags: [
      { type: 'controversial', label: 'Industry Opposition', color: 'red' },
      { type: 'amended', label: 'Significant Changes', color: 'blue' },
    ],
    stance: 'oppose',
    momentumScore: 48,
    heatLevel: 'high',
    isPinned: true,
    lastViewed: '2025-12-16',
    clientTags: ['TechCorp Industries', 'Arizona Tech Council'],
  },

  // Bill 4: Water Rights & Drought Management
  {
    id: 'bill-004',
    billId: 'SB 3891',
    title: 'An Act to Establish a Comprehensive Water Conservation and Drought Resilience Framework',
    shortTitle: 'Water Conservation & Drought Resilience Act',
    jurisdiction: 'state',
    status: 'second-chamber',
    nextActionDate: '2025-12-23',
    nextActionDescription: 'House Committee Assignment',
    issueTags: ['Water', 'Agriculture', 'Environment', 'Infrastructure'],
    sponsorIds: ['leg-007', 'leg-008', 'leg-009'],
    sponsorNames: ['Sen. Maria Rodriguez (D-7)', 'Sen. Tom Bradford (R-29)', 'Rep. Linda Foster (R-16)'],
    committeeIds: ['comm-natural-resources'],
    committeeName: 'Natural Resources Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-09-18',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Framework for mandatory water use reduction in drought conditions'],
      },
      {
        id: 'v2',
        date: '2025-11-12',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Created tiered drought response system (Levels 1-4)',
          'Agricultural exemptions for critical food crops',
          'Residential lawn watering restrictions during Level 3+',
          'Industrial user reporting requirements',
          '$250M infrastructure improvement fund for water recycling'
        ],
      },
      {
        id: 'v3',
        date: '2025-12-04',
        type: 'engrossed',
        textLink: '#',
        aiChangeSummary: [
          'Passed Senate 28-12',
          'Floor amendment adding Colorado River Compact considerations'
        ],
      },
    ],
    aiSummaryOneLine: 'Creates 4-tier drought response system with mandatory conservation measures and $250M water infrastructure fund.',
    flags: [
      { type: 'fiscal-impact', label: '$250M Infrastructure Fund', color: 'orange' },
      { type: 'controversial', label: 'Agriculture Concerns', color: 'red' },
    ],
    stance: 'monitor',
    momentumScore: 63,
    heatLevel: 'medium',
    isPinned: false,
    lastViewed: '2025-12-12',
    clientTags: ['Southwest Water Alliance'],
  },

  // Bill 5: Education Funding Reform
  {
    id: 'bill-005',
    billId: 'HB 4512',
    title: 'An Act to Reform K-12 Education Funding Formula and Increase Teacher Compensation',
    shortTitle: 'Education Funding & Teacher Pay Act',
    jurisdiction: 'state',
    status: 'committee',
    nextActionDate: '2025-12-27',
    nextActionDescription: 'Committee Hearing - Education & Appropriations Joint Session',
    issueTags: ['Education', 'Budget', 'Teacher Pay', 'School Funding'],
    sponsorIds: ['leg-010', 'leg-011'],
    sponsorNames: ['Rep. Angela Morrison (D-5)', 'Rep. Kevin Zhang (D-20)'],
    committeeIds: ['comm-education', 'comm-appropriations'],
    committeeName: 'Education Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-11-20',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Proposes new weighted student funding formula and $10,000 average teacher raise'],
      },
    ],
    aiSummaryOneLine: 'Overhauls school funding formula with equity-based weighting and mandates $10,000 average teacher salary increase.',
    flags: [
      { type: 'fiscal-impact', label: '$1.2B Annual Impact', color: 'orange' },
      { type: 'high-risk', label: 'Major Budget Impact', color: 'red' },
    ],
    stance: 'support',
    momentumScore: 41,
    heatLevel: 'medium',
    isPinned: false,
    lastViewed: '2025-12-15',
    clientTags: ['Arizona Education First'],
  },

  // Bill 6: Transportation Infrastructure & Transit
  {
    id: 'bill-006',
    billId: 'SB 2156',
    title: 'An Act to Modernize Public Transportation Infrastructure and Expand Regional Transit Networks',
    shortTitle: 'Regional Transit Expansion Act',
    jurisdiction: 'state',
    status: 'committee',
    nextActionDate: '2025-01-08',
    nextActionDescription: 'Committee Hearing - Transportation & Infrastructure',
    issueTags: ['Transportation', 'Infrastructure', 'Transit', 'Urban Planning'],
    sponsorIds: ['leg-012', 'leg-013'],
    sponsorNames: ['Sen. Christopher Lee (D-3)', 'Rep. Samantha Rivera (D-24)'],
    committeeIds: ['comm-transportation'],
    committeeName: 'Transportation & Infrastructure Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-12-01',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['$800M bonding authority for light rail expansion and bus rapid transit'],
      },
      {
        id: 'v2',
        date: '2025-12-14',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Reduced bonding to $600M with phased implementation',
          'Added cost-sharing requirements for local jurisdictions (25% match)',
          'Prioritizes transit corridors serving low-income communities',
          'Creates Transit-Oriented Development zoning incentives'
        ],
      },
    ],
    aiSummaryOneLine: 'Authorizes $600M in bonds for light rail and BRT expansion with local cost-sharing and TOD incentives.',
    flags: [
      { type: 'fiscal-impact', label: '$600M Bonds', color: 'orange' },
      { type: 'amended', label: 'Reduced Scope', color: 'blue' },
    ],
    stance: 'neutral',
    momentumScore: 55,
    heatLevel: 'low',
    isPinned: false,
    lastViewed: '2025-12-14',
    clientTags: [],
  },

  // Bill 7: Cybersecurity & Critical Infrastructure
  {
    id: 'bill-007',
    billId: 'HB 7823',
    title: 'An Act Concerning Cybersecurity Standards for Critical Infrastructure and Government Systems',
    shortTitle: 'Cybersecurity Standards Act',
    jurisdiction: 'state',
    status: 'introduced',
    nextActionDate: '2025-01-15',
    nextActionDescription: 'Committee Referral Pending',
    issueTags: ['Cybersecurity', 'Technology', 'Critical Infrastructure', 'Government Operations'],
    sponsorIds: ['leg-014', 'leg-015'],
    sponsorNames: ['Rep. Brian Mitchell (R-12)', 'Sen. Patricia Wong (R-8)'],
    committeeIds: [],
    committeeName: undefined,
    versions: [
      {
        id: 'v1',
        date: '2025-12-12',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Mandatory cybersecurity standards for utilities, healthcare, and government contractors'],
      },
    ],
    aiSummaryOneLine: 'Establishes mandatory cybersecurity frameworks for critical infrastructure operators and government contractors.',
    flags: [
      { type: 'fiscal-impact', label: 'Compliance Costs TBD', color: 'orange' },
    ],
    stance: 'monitor',
    momentumScore: 32,
    heatLevel: 'low',
    isPinned: false,
    lastViewed: '2024-12-13',
    clientTags: ['TechCorp Industries'],
  },

  // Bill 8: Affordable Housing & Zoning Reform
  {
    id: 'bill-008',
    billId: 'HB 6104',
    title: 'An Act to Promote Affordable Housing Development Through Zoning Reform and Incentive Programs',
    shortTitle: 'Affordable Housing & Zoning Reform Act',
    jurisdiction: 'state',
    status: 'committee',
    nextActionDate: '2025-01-10',
    nextActionDescription: 'Public Hearing - Housing & Local Government Committee',
    issueTags: ['Housing', 'Zoning', 'Urban Development', 'Affordability'],
    sponsorIds: ['leg-016', 'leg-017', 'leg-018'],
    sponsorNames: ['Rep. Marcus Johnson (D-6)', 'Sen. Emily Davis (D-15)', 'Rep. Carlos Mendez (D-19)'],
    committeeIds: ['comm-housing'],
    committeeName: 'Housing & Local Government Committee',
    versions: [
      {
        id: 'v1',
        date: '2024-11-25',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Requires cities to allow fourplexes in all residential zones and ADUs by-right'],
      },
      {
        id: 'v2',
        date: '2024-12-16',
        type: 'amendment',
        textLink: '#',
        aiChangeSummary: [
          'Narrowed fourplex requirement to cities over 75,000 population',
          'Added 3-year phase-in period for local zoning updates',
          'Created $150M affordable housing development fund',
          'Density bonus provisions for projects with 20%+ affordable units'
        ],
      },
    ],
    aiSummaryOneLine: 'Mandates fourplex zoning in large cities with 3-year phase-in and creates $150M affordable housing fund.',
    flags: [
      { type: 'controversial', label: 'Local Control Debate', color: 'red' },
      { type: 'fiscal-impact', label: '$150M Fund', color: 'orange' },
      { type: 'hearing-scheduled', label: 'Public Hearing Jan 10', color: 'purple' },
    ],
    stance: 'neutral',
    momentumScore: 58,
    heatLevel: 'medium',
    isPinned: false,
    lastViewed: '2024-12-17',
    clientTags: [],
  },

  // Bill 9: State Infrastructure Investment Priorities Resolution
  {
    id: 'bill-009',
    billId: 'SCR 1001',
    title: 'A Concurrent Resolution Establishing State Infrastructure Investment Priorities and Green Bonds Authorization',
    shortTitle: 'Infrastructure Investment Priorities Resolution',
    jurisdiction: 'state',
    status: 'second-chamber',
    nextActionDate: '2025-12-22',
    nextActionDescription: 'House Floor Consideration - Second Reading',
    issueTags: ['Infrastructure', 'Finance', 'Economic Development', 'Energy', 'Transportation'],
    sponsorIds: ['leg-021', 'leg-022', 'leg-023'],
    sponsorNames: ['Sen. Katherine Hayes (D-11)', 'Sen. David Richardson (R-29)', 'Rep. Angela Foster (D-7)'],
    committeeIds: ['comm-finance', 'comm-appropriations'],
    committeeName: 'Senate Finance Committee',
    versions: [
      {
        id: 'v1',
        date: '2025-11-01',
        type: 'introduced',
        textLink: '#',
        aiChangeSummary: ['Proposes $2.5B green bonds for infrastructure with broad project categories'],
      },
      {
        id: 'v2',
        date: '2025-11-28',
        type: 'committee-substitute',
        textLink: '#',
        aiChangeSummary: [
          'Reduced authorization to $1.8B based on debt capacity analysis',
          'Narrowed eligible projects to clean energy, water, and transit infrastructure only',
          'Added 5-year sunset provision requiring reauthorization',
          'Established oversight commission with legislative, executive, and citizen members',
          'Required annual economic impact reporting to Legislature'
        ],
      },
      {
        id: 'v3',
        date: '2025-12-12',
        type: 'engrossed',
        textLink: '#',
        aiChangeSummary: [
          'Passed Senate 28-12 with bipartisan support',
          'Added prevailing wage requirements for bond-funded projects',
          'Required 30% of contracts to go to small businesses or disadvantaged business enterprises',
          'Clarified that bonds cannot fund ongoing operational expenses'
        ],
      },
    ],
    aiSummaryOneLine: 'Authorizes $1.8B in green bonds for clean energy, water, and transit infrastructure with oversight commission and equity provisions.',
    flags: [
      { type: 'fiscal-impact', label: '$1.8B Bonds', color: 'orange' },
      { type: 'passed-senate', label: 'Passed Senate 28-12', color: 'green' },
      { type: 'bipartisan', label: 'Bipartisan Support', color: 'blue' },
      { type: 'hearing-scheduled', label: 'House Floor Dec 22', color: 'purple' },
    ],
    stance: 'support',
    momentumScore: 78,
    heatLevel: 'high',
    isPinned: true,
    lastViewed: '2025-12-18',
    clientTags: ['Infrastructure Coalition', 'Green Finance Initiative', 'Phoenix Energy Coalition'],
  },
];

// AI Reviews for each bill
export const mockBillAIReviews: { [billId: string]: BillAIReview } = {
  'bill-001': {
    billId: 'bill-001',
    summaryBullets: [
      'Requires investor-owned utilities to achieve 85% renewable energy by 2045, with interim targets of 50% by 2030 and 70% by 2037',
      'Creates $500M Grid Modernization Fund for transmission upgrades, battery storage, and smart grid technology',
      'Expands "clean energy" definition to include nuclear, large-scale hydroelectric, and emerging technologies like green hydrogen',
      'Extends compliance deadline for rural electric cooperatives by 3 years due to infrastructure challenges',
      'Establishes independent technical advisory committee to review feasibility and recommend adjustments',
      'Allows utilities to recover prudent grid modernization costs through rate base with PUC approval',
    ],
    impactsByLens: {
      'Energy Sector': {
        topImpacts: [
          'Accelerated renewable energy deployment creating $12B+ investment opportunity through 2045',
          'Coal and natural gas plant retirements accelerated, affecting 2,400 jobs in traditional energy sectors',
          'Major transmission infrastructure buildout required in rural areas',
          'Battery storage mandate creates new revenue streams for utilities',
        ],
        complianceBurdens: [
          'Annual compliance reporting to Public Utilities Commission',
          'Third-party verification of renewable energy credits (RECs)',
          'Grid reliability and resource adequacy planning requirements',
          'Public stakeholder engagement process for integrated resource plans',
        ],
        potentialCosts: [
          'Estimated $8-12B in total infrastructure investment across all utilities',
          'Rate impacts of 2-4% annually for residential customers during peak buildout (2026-2032)',
          'Early retirement costs for existing fossil fuel assets',
          'Grid modernization costs: $500M state fund + additional $2B+ utility investment',
        ],
        beneficiaries: [
          'Solar and wind energy developers',
          'Battery storage manufacturers and installers',
          'Electric utilities through cost recovery mechanisms',
          'Construction and skilled trades workers (8,000+ new jobs projected)',
          'Rural communities receiving grid infrastructure upgrades',
        ],
        opponents: [
          'Traditional fossil fuel industry stakeholders',
          'Ratepayer advocacy groups concerned about cost impacts',
          'Some industrial users facing competitiveness concerns',
          'Coal mining communities facing economic transition',
        ],
      },
      'Environmental Groups': {
        topImpacts: [
          'Significant reduction in CO2 emissions: estimated 45 million metric tons avoided by 2045',
          'Air quality improvements in communities near fossil fuel plants',
          'Reduced water consumption from thermoelectric generation',
          'Potential habitat impacts from renewable energy facility siting',
        ],
        complianceBurdens: [
          'Environmental impact assessments for new renewable projects',
          'Wildlife and habitat mitigation requirements',
          'Water rights considerations for solar thermal or cooling systems',
        ],
        potentialCosts: [
          'Mitigation costs for desert habitat affected by solar farms',
          'Transmission line routing to avoid sensitive ecosystems',
        ],
        beneficiaries: [
          'Climate advocacy organizations',
          'Environmental justice communities near fossil fuel plants',
          'Public health through reduced air pollution',
          'Future generations benefiting from emissions reductions',
        ],
        opponents: [
          'Some conservation groups concerned about desert habitat for solar',
          'Wildlife advocates concerned about bird and bat impacts from wind',
        ],
      },
    },
    riskFlags: [
      {
        severity: 'red',
        label: 'Rate Impact Risk',
        explanation: 'Residential electricity rates could increase 2-4% annually during peak buildout years, potentially causing affordability concerns for low-income households',
        sectionReference: 'Section 7(c) - Cost Recovery Provisions',
        mitigation: 'Consider low-income customer assistance program funded by portion of carbon reduction revenues',
      },
      {
        severity: 'yellow',
        label: 'Grid Reliability Concerns',
        explanation: 'Rapid transition may strain grid reliability during high renewable penetration periods without adequate storage or backup capacity',
        sectionReference: 'Section 4(a) - Renewable Portfolio Targets',
        mitigation: 'Technical advisory committee can recommend target adjustments based on reliability metrics',
      },
      {
        severity: 'yellow',
        label: 'Worker Transition',
        explanation: 'Coal and natural gas workers (est. 2,400 jobs) face displacement without robust transition support',
        sectionReference: 'Section 12 - Workforce Provisions',
        mitigation: 'Amendment to add dedicated just transition fund and worker retraining programs',
      },
      {
        severity: 'green',
        label: 'Economic Development Opportunity',
        explanation: 'Bill positions state as leader in clean energy, attracting manufacturing and technology investment',
        sectionReference: 'Section 3 - Legislative Findings',
      },
    ],
    talkingPoints: {
      Support: {
        mainPoints: [
          'Positions our state as a national leader in clean energy innovation, attracting billions in private investment and thousands of new jobs',
          'Reduces harmful air pollution in communities that have borne disproportionate health impacts from fossil fuel generation',
          'The $500M grid modernization fund ensures rural communities get long-overdue infrastructure upgrades',
          'Flexible compliance timeline and technical advisory committee provide safety valves to ensure reliability and affordability',
          'Including nuclear and emerging tech keeps all options on the table for reliable, carbon-free electricity',
        ],
        thirtySecondVersion: 'This bill positions us as a clean energy leader while protecting grid reliability and ratepayers. It brings billions in investment, thousands of new jobs, and cleaner air—with built-in safeguards to ensure affordability and keep the lights on.',
        qAndA: [
          {
            question: "Won't this raise electricity rates?",
            answer: "Some rate increase is likely during peak buildout years (2-4% annually), but the technical advisory committee can adjust targets if costs become unreasonable. Long-term, renewable energy has lower fuel costs than fossil fuels, potentially stabilizing rates.",
          },
          {
            question: "Can the grid handle this much renewable energy?",
            answer: "The bill includes $500M for grid modernization, battery storage mandates, and an independent technical committee to monitor reliability. If grid concerns arise, targets can be adjusted. Other states have successfully integrated similar levels of renewables.",
          },
          {
            question: "What about jobs in coal and natural gas?",
            answer: "The transition will affect about 2,400 traditional energy jobs, which is why we support amendments to add worker transition assistance and retraining programs. Meanwhile, the bill creates an estimated 8,000 new jobs in renewable energy and construction.",
          },
        ],
      },
      Oppose: {
        mainPoints: [
          'Ratepayers will face significant cost increases—potentially 2-4% annually—at a time when families are already struggling with inflation',
          'The aggressive timeline risks grid reliability, particularly during extreme weather events when renewable generation may be insufficient',
          'Thousands of workers in traditional energy sectors face job loss without adequate transition support in the current bill',
          'The state is rushing into unproven technologies without understanding true costs or reliability impacts',
          'Rural communities and industrial users will be disproportionately harmed by rate increases that threaten economic competitiveness',
        ],
        thirtySecondVersion: 'This bill gambles with grid reliability and affordability in pursuit of an overly aggressive timeline. It will raise rates on struggling families, cost thousands of good-paying jobs, and risk blackouts—all without proven benefits.',
        qAndA: [
          {
            question: "Don't we need to address climate change?",
            answer: "We support clean energy, but this timeline is too aggressive and costly. A more gradual approach would achieve environmental goals without risking reliability or affordability. Let market forces and technology improvements drive the transition naturally.",
          },
          {
            question: "Doesn't the technical committee provide safeguards?",
            answer: "The committee has limited authority to adjust targets, and by the time problems emerge, utilities will have already made billions in investments they'll recover from ratepayers. The mandate itself is the problem, not something a committee can fix.",
          },
          {
            question: "What about the jobs created in renewable energy?",
            answer: "Many of those jobs are temporary construction positions, not the permanent, high-paying careers our workers have in traditional energy. We shouldn't sacrifice certain jobs today for speculative jobs tomorrow without real worker protections.",
          },
        ],
      },
    },
    amendmentConcepts: [
      {
        title: 'Low-Income Rate Protection Amendment',
        description: 'Create automatic rate freeze or discount for households below 200% federal poverty level, funded by portion of utility cost recovery.',
        targetSection: 'Section 7 - Cost Recovery',
        rationale: 'Protects vulnerable households from affordability impacts while maintaining clean energy progress.',
      },
      {
        title: 'Worker Transition Fund',
        description: 'Establish $50M fund for worker retraining, job placement, and bridge income support for displaced fossil fuel workers.',
        targetSection: 'Section 12 - Workforce Development',
        rationale: 'Addresses just transition concerns and builds labor support for bill.',
      },
      {
        title: 'Enhanced Technical Committee Authority',
        description: 'Expand technical committee authority to recommend target delays up to 3 years if reliability or affordability metrics exceed thresholds.',
        targetSection: 'Section 9 - Technical Advisory Committee',
        rationale: 'Provides stronger safety valve to address reliability and cost concerns from opponents.',
      },
    ],
    generatedAt: '2024-12-18T10:30:00Z',
  },

  'bill-002': {
    billId: 'bill-002',
    summaryBullets: [
      'Creates comprehensive loan forgiveness program for healthcare professionals serving in rural and underserved areas',
      'Appropriates $350M over 5 years ($70M annually) for loan forgiveness, residency incentives, and scholarships',
      'Eligible professions include physicians, nurses, mental health counselors, dentists, pharmacists, and allied health',
      'Requires 3-year minimum service commitment in designated Health Professional Shortage Area (HPSA)',
      'Loan forgiveness up to $200,000 for physicians, $100,000 for nurses and allied health professionals',
      'Creates residency match bonus ($50,000) for medical residents choosing rural practice',
      'Establishes reporting requirements to track geographic distribution and program effectiveness',
      'Includes sunset provision requiring legislative review and reauthorization in 2030',
    ],
    impactsByLens: {
      'Healthcare System': {
        topImpacts: [
          'Expected to recruit 400-600 healthcare professionals to underserved areas over 5 years',
          'Addresses critical shortage: 45 rural counties currently have no primary care physician',
          'Mental health counselor expansion addresses suicide prevention crisis in rural communities',
          'Residency match bonuses may shift physician training patterns toward rural practice',
        ],
        complianceBurdens: [
          'Annual reporting on participant demographics, retention rates, and geographic distribution',
          'Service verification requirements for loan forgiveness recipients',
          'HPSA designation maintenance and updates',
          'Coordination with federal programs (NHSC, NURSE Corps) to avoid duplication',
        ],
        potentialCosts: [
          '$350M state appropriation over 5 years',
          'Administrative costs for Department of Health Services: $2M annually',
          'Evaluation and reporting costs: $500K annually',
        ],
        beneficiaries: [
          'Healthcare professionals receiving loan forgiveness (projected 800+ participants)',
          'Rural and underserved communities gaining access to care',
          'Hospitals and clinics in shortage areas able to recruit staff',
          'Patients in HPSAs with improved access to primary care and mental health services',
        ],
        opponents: [
          'Some fiscal conservatives concerned about program costs',
          'Stakeholders preferring market-based solutions over government programs',
          'Urban healthcare systems concerned about provider redistribution',
        ],
      },
      'Medical Education': {
        topImpacts: [
          'Medical schools may adjust curricula to emphasize rural health competencies',
          'Increased enrollment interest from students seeking loan forgiveness',
          'Nursing schools may expand rural health clinical rotation programs',
          'Potential partnership opportunities between universities and rural healthcare systems',
        ],
        complianceBurdens: [
          'Verification of degree completion and professional licensure for applicants',
          'Coordination with financial aid offices on loan documentation',
        ],
        potentialCosts: [
          'Minimal - primarily documentation and verification processes',
        ],
        beneficiaries: [
          'Medical and nursing students graduating with high debt burdens',
          'Healthcare education programs gaining recruitment tool',
          'Rural training sites receiving influx of professionals',
        ],
        opponents: [
          'Minimal opposition from education sector',
        ],
      },
    },
    riskFlags: [
      {
        severity: 'yellow',
        label: 'Retention Risk',
        explanation: 'Participants may leave rural areas immediately after 3-year commitment ends, limiting long-term impact',
        sectionReference: 'Section 5(b) - Service Commitment',
        mitigation: 'Consider tiered incentives that increase for longer service commitments (e.g., 5-7 years)',
      },
      {
        severity: 'yellow',
        label: 'Geographic Clustering',
        explanation: 'Participants may cluster in "less rural" shortage areas, leaving most remote communities unserved',
        sectionReference: 'Section 3(a) - HPSA Designation',
        mitigation: 'Add bonus payments for highest-need/most remote designated areas',
      },
      {
        severity: 'green',
        label: 'Bipartisan Support',
        explanation: 'Bill has strong bipartisan backing and addresses widely acknowledged healthcare crisis',
        sectionReference: 'N/A',
      },
      {
        severity: 'green',
        label: 'Federal Coordination',
        explanation: 'Complements federal programs, potentially unlocking matching funds or federal qualification',
        sectionReference: 'Section 8 - Federal Program Coordination',
      },
    ],
    talkingPoints: {
      Support: {
        mainPoints: [
          'Forty-five counties in our state have zero primary care physicians—this bill directly addresses that crisis',
          'For $70M per year, we can recruit hundreds of healthcare professionals to communities that desperately need them',
          'Mental health counselor provision addresses rural suicide rates that are 2x higher than urban areas',
          'Three-year commitment requirement ensures real community impact, not just short-term fixes',
          'Sunset provision and reporting requirements ensure accountability and allow course corrections',
        ],
        thirtySecondVersion: 'Forty-five of our counties have no primary care doctor. This bill recruits hundreds of healthcare workers to underserved communities for $70M a year—a small investment to save lives and ensure everyone has access to care.',
        qAndA: [
          {
            question: "Why not just let the market solve this problem?",
            answer: "The market has failed rural healthcare for decades. Private practice isn't financially viable in low-population areas, and without intervention, shortages will worsen. This program makes rural practice economically feasible for new graduates.",
          },
          {
            question: "Will participants actually stay after 3 years?",
            answer: "Research shows that healthcare professionals who practice in rural areas for 3+ years often develop roots and stay longer-term. The program also includes reporting requirements so we can track retention and adjust if needed.",
          },
          {
            question: "How does this differ from federal programs?",
            answer: "This complements federal efforts like the National Health Service Corps but is more generous and tailored to our state's specific needs. Participants can potentially stack state and federal benefits, making rural practice even more attractive.",
          },
        ],
      },
    },
    amendmentConcepts: [
      {
        title: 'Enhanced Retention Incentive',
        description: 'Add tiered loan forgiveness that increases for service beyond 3 years (e.g., additional $25K for years 4-5).',
        targetSection: 'Section 5 - Loan Forgiveness Amounts',
        rationale: 'Encourages longer-term rural practice and addresses retention concerns.',
      },
      {
        title: 'Remote Area Bonus',
        description: 'Create supplementary payment ($15K annually) for practice in counties with population under 10,000.',
        targetSection: 'Section 6 - Service Requirements',
        rationale: 'Prevents clustering in "less rural" shortage areas and directs providers to highest-need communities.',
      },
      {
        title: 'Behavioral Health Expansion',
        description: 'Increase mental health counselor allocation from 20% to 30% of program funds.',
        targetSection: 'Section 4(b) - Professional Category Allocations',
        rationale: 'Addresses acute rural mental health and suicide prevention crisis.',
      },
    ],
    generatedAt: '2024-12-18T11:15:00Z',
  },

  'bill-003': {
    billId: 'bill-003',
    summaryBullets: [
      'Grants consumers right to access, delete, and correct personal data held by businesses',
      'Applies to businesses that collect data from 50,000+ state residents or derive 50%+ revenue from data sales',
      'Requires opt-in consent for sale of personal data; opt-out for sensitive data processing',
      'Mandates privacy notices, data inventory practices, and regular risk assessments',
      'Removes private right of action—enforcement exclusively through Attorney General',
      'Provides 18-month implementation period from effective date',
      'Creates safe harbor for businesses demonstrating good-faith compliance efforts',
      'Exempts HIPAA-covered entities, financial institutions under GLBA, and small businesses',
    ],
    impactsByLens: {
      'Technology Companies': {
        topImpacts: [
          'Major compliance infrastructure buildout required for data access/deletion requests',
          'Consumer opt-in requirement for data sales fundamentally changes advertising-based business models',
          'Risk assessment and documentation burdens increase operational complexity',
          'Potential competitive disadvantage vs. companies in states without similar laws',
        ],
        complianceBurdens: [
          'Build systems to respond to consumer data requests within 45 days',
          'Implement consent management platforms for opt-in/opt-out preferences',
          'Conduct and document annual privacy risk assessments',
          'Maintain detailed data inventory showing all personal data collection/use/sharing',
          'Update privacy policies and customer-facing notices',
          'Train staff on privacy compliance procedures',
        ],
        potentialCosts: [
          'Large tech companies: $5-15M in compliance infrastructure and ongoing costs',
          'Mid-sized companies: $500K-2M for implementation',
          'Annual compliance costs: 10-20% of initial investment',
          'Potential revenue reduction from restricted data monetization',
        ],
        beneficiaries: [
          'Privacy technology vendors and consultants',
          'Legal and compliance professionals',
          'Companies already GDPR-compliant (lower incremental costs)',
        ],
        opponents: [
          'Tech industry trade associations (TechNet, Chamber of Commerce)',
          'Advertising technology companies dependent on data sales',
          'Small tech companies concerned about compliance costs',
          'Out-of-state companies arguing for federal preemption',
        ],
      },
      'Consumer Advocates': {
        topImpacts: [
          'Consumers gain meaningful control over personal data for first time',
          'Transparency requirements expose data practices previously hidden',
          'Opt-in consent requirement for data sales provides strong protection',
          'However, lack of private right of action limits enforcement and consumer remedies',
        ],
        complianceBurdens: [
          'Consumers must affirmatively exercise rights (no automatic protections)',
          'May face difficulties getting companies to respond to requests',
        ],
        potentialCosts: [
          'No direct costs to consumers',
        ],
        beneficiaries: [
          "State residents concerned about data privacy",
          "Victims of data breaches gaining deletion rights",
          "Parents controlling children's data",
        ],
        opponents: [
          'Consumer advocates wanted private right of action (removed in committee)',
          'Some argue 50,000 consumer threshold excludes too many businesses',
        ],
      },
    },
    riskFlags: [
      {
        severity: 'red',
        label: 'Strong Industry Opposition',
        explanation: 'Tech industry coalition actively lobbying against bill; major companies threatening legal challenges and job relocation',
        sectionReference: 'Entire Bill',
        mitigation: 'Committee already made significant concessions (removed private right of action, raised threshold, extended timeline)',
      },
      {
        severity: 'red',
        label: 'Preemption Risk',
        explanation: 'Industry arguing for federal preemption; if federal bill passes, could invalidate state law',
        sectionReference: 'Section 15 - Relationship to Federal Law',
        mitigation: 'Include severability clause and federal floor (not ceiling) language',
      },
      {
        severity: 'yellow',
        label: 'Enforcement Capacity',
        explanation: 'Attorney General office may lack resources to enforce against thousands of companies',
        sectionReference: 'Section 12 - Enforcement',
        mitigation: 'Consider appropriating dedicated enforcement funding or creating specialized privacy unit',
      },
      {
        severity: 'yellow',
        label: 'Compliance Uncertainty',
        explanation: 'Ambiguous definitions and novel requirements create litigation risk as courts interpret law',
        sectionReference: 'Section 2 - Definitions',
        mitigation: 'Direct AG to issue detailed implementing regulations and safe harbor guidelines',
      },
    ],
    talkingPoints: {
      Support: {
        mainPoints: [
          "Companies collect massive amounts of personal data—browsing history, location, purchases, communications—and consumers have no control or transparency",
          "This bill gives residents basic rights to know what data is collected, delete it, and stop companies from selling it without permission",
          "We've made significant compromises: removed private lawsuits, raised thresholds to protect small businesses, gave companies 18 months to comply",
          "California, Virginia, Colorado, and other states have similar laws—we're not experimenting, we're following proven models",
          "Safe harbor provision protects good-faith businesses while holding bad actors accountable",
        ],
        thirtySecondVersion: 'Companies know everything about us, but we have no control over our own data. This bill gives residents basic privacy rights while protecting small businesses and providing reasonable compliance timelines.',
        qAndA: [
          {
            question: "Won't this hurt our tech economy and drive away jobs?",
            answer: "Other tech hub states like California and Colorado have similar laws without experiencing tech exodus. The 18-month timeline and safe harbor provisions give businesses reasonable transition time. Companies that respect privacy will thrive.",
          },
          {
            question: "Why not wait for federal legislation?",
            answer: "Congress has debated federal privacy legislation for over a decade without passing anything. Meanwhile, our residents' data is being collected and sold every day. States must act to protect their citizens.",
          },
          {
            question: "Will this actually be enforced?",
            answer: "The Attorney General has subpoena power and can impose civil penalties. The safe harbor provision means good-faith businesses won't be punished, but bad actors face consequences. We should appropriate dedicated enforcement funding.",
          },
        ],
      },
      Oppose: {
        mainPoints: [
          "This creates a complex, costly regulatory regime that will hurt our state's economic competitiveness and innovation",
          "Compliance costs will force small businesses to cut jobs or exit the state market entirely",
          "Patchwork of state laws creates impossible compliance burden—we need federal solution, not 50 different state standards",
          "The 50,000 consumer threshold still captures mid-sized companies that lack resources for compliance",
          "Ambiguous definitions create litigation risk and uncertainty that will chill business investment",
        ],
        thirtySecondVersion: 'This bill imposes California-style regulations that will cost jobs, hurt small businesses, and create legal chaos. We need federal privacy legislation, not a patchwork of state laws that make compliance impossible.',
        qAndA: [
          {
            question: "Don't consumers deserve privacy protection?",
            answer: "We support reasonable privacy protections, but this bill goes too far, too fast. Industry-led privacy initiatives and federal legislation are better approaches than state-by-state mandates.",
          },
          {
            question: "Haven't other states passed similar laws?",
            answer: "Yes, and the patchwork is exactly the problem. A company operating in 10 states faces 10 different compliance regimes. This fragmentation hurts businesses and doesn't meaningfully help consumers.",
          },
          {
            question: "Didn't the committee remove the private right of action?",
            answer: "That was an improvement, but the underlying mandates remain problematic. The AG enforcement model still exposes businesses to penalties and doesn't address the core compliance burden and cost issues.",
          },
        ],
      },
    },
    amendmentConcepts: [
      {
        title: 'Enforcement Funding Appropriation',
        description: "Appropriate $5M annually to AG office for dedicated privacy enforcement unit and technology.",
        targetSection: "Section 12 - Enforcement",
        rationale: "Addresses concern that law won't be enforced; demonstrates state commitment to implementation.",
      },
      {
        title: 'Small Business Exemption Enhancement',
        description: 'Raise threshold to 100,000 consumers for businesses with revenue under $25M annually.',
        targetSection: 'Section 3 - Applicability',
        rationale: 'Provides additional relief for small-to-mid-sized businesses while maintaining coverage of major data collectors.',
      },
      {
        title: 'Regulatory Clarity Directive',
        description: 'Require AG to issue implementing regulations within 12 months addressing key definitions and safe harbor standards.',
        targetSection: 'Section 14 - Rulemaking Authority',
        rationale: 'Reduces compliance uncertainty and provides clearer guidance for businesses.',
      },
    ],
    generatedAt: '2024-12-18T09:45:00Z',
  },

  // Continue with remaining bills (004-008)...
  'bill-004': {
    billId: 'bill-004',
    summaryBullets: [
      'Establishes 4-tier drought response framework (Levels 1-4) tied to reservoir levels and precipitation data',
      'Level 3+ triggers mandatory residential lawn watering restrictions and industrial reporting requirements',
      'Exempts agricultural water for critical food crop production from mandatory reductions',
      'Creates $250M infrastructure fund for water recycling, desalination, and efficiency projects',
      'Requires municipal water conservation plans updated every 5 years',
      'Incorporates Colorado River Compact obligations into state drought planning',
      'Empowers state water resources agency to declare drought levels and enforce restrictions',
    ],
    impactsByLens: {},
    riskFlags: [],
    talkingPoints: {},
    amendmentConcepts: [],
    generatedAt: '2024-12-18T10:00:00Z',
  },

  'bill-005': {
    billId: 'bill-005',
    summaryBullets: [
      'Overhauls K-12 funding formula from enrollment-based to weighted student formula accounting for student needs',
      'Weighting factors include poverty (1.4x), English learners (1.25x), special education (varies), and rural isolation (1.15x)',
      'Mandates minimum $10,000 across-the-board teacher salary increase over 3 years',
      'Fiscal note estimates $1.2B annual cost when fully implemented',
      'Hold-harmless provision ensures no district receives less than prior year for 5 years',
      'Creates transparency portal showing per-pupil spending by district and school',
    ],
    impactsByLens: {},
    riskFlags: [],
    talkingPoints: {},
    amendmentConcepts: [],
    generatedAt: '2024-12-18T11:30:00Z',
  },

  'bill-006': {
    billId: 'bill-006',
    summaryBullets: [
      'Authorizes $600M in general obligation bonds for light rail and bus rapid transit expansion',
      'Requires 25% local match from jurisdictions receiving transit improvements',
      'Prioritizes transit corridors serving communities where 40%+ households are low-income',
      'Creates Transit-Oriented Development (TOD) zoning overlay incentives near stations',
      'Establishes regional transit planning authority to coordinate multi-jurisdictional projects',
      'Phased implementation over 8 years with milestones for bond issuance',
    ],
    impactsByLens: {},
    riskFlags: [],
    talkingPoints: {},
    amendmentConcepts: [],
    generatedAt: '2024-12-18T10:15:00Z',
  },

  'bill-007': {
    billId: 'bill-007',
    summaryBullets: [
      'Mandates cybersecurity framework compliance for critical infrastructure operators (utilities, healthcare, transportation)',
      'Requires government contractors handling sensitive data to achieve certification within 24 months',
      'Based on NIST Cybersecurity Framework with state-specific customizations',
      'Creates incident reporting requirements within 72 hours of breach discovery',
      'Establishes state cybersecurity office to provide technical assistance and oversee compliance',
      'Penalties for non-compliance: up to $100K per violation for covered entities',
    ],
    impactsByLens: {},
    riskFlags: [],
    talkingPoints: {},
    amendmentConcepts: [],
    generatedAt: '2024-12-18T09:30:00Z',
  },

  'bill-008': {
    billId: 'bill-008',
    summaryBullets: [
      'Requires cities over 75,000 population to allow fourplexes in all residential zones',
      'Mandates accessory dwelling units (ADUs) be permitted by-right on single-family parcels',
      'Provides 3-year phase-in for local governments to update zoning codes',
      'Creates $150M affordable housing development fund for projects with 20%+ affordable units',
      'Density bonus provisions: up to 50% additional units for deeply affordable projects',
      'Overrides local design review for projects meeting objective standards',
      'Preempts local parking minimums near transit (within 1/2 mile of major station)',
    ],
    impactsByLens: {},
    riskFlags: [],
    talkingPoints: {},
    amendmentConcepts: [],
    generatedAt: '2024-12-18T11:00:00Z',
  },

  'bill-009': {
    billId: 'bill-009',
    summaryBullets: [
      'Authorizes $1.8B in state green bonds for infrastructure investments over 5 years with sunset provision',
      'Eligible projects limited to clean energy infrastructure, water systems, and public transit expansion',
      'Creates 9-member Infrastructure Oversight Commission (3 legislative, 3 executive, 3 citizens)',
      'Requires 30% of bond-funded contracts go to small businesses or disadvantaged business enterprises',
      'Prevailing wage requirements apply to all bond-funded construction projects',
      'Annual economic impact reporting to Legislature including job creation and emissions reductions',
      'Prohibits use of bond proceeds for ongoing operational expenses or maintenance',
      'Establishes competitive application process for local governments and utilities to access funds',
    ],
    impactsByLens: {
      'Energy Sector': {
        topImpacts: [
          'Provides capital for clean energy projects including solar, wind, and grid modernization',
          'Complements HB 2847 renewable energy mandates with direct funding mechanism',
          'Could accelerate utility compliance with renewable portfolio standards',
          'Bond funding reduces need for rate increases to finance clean energy transition',
        ],
        complianceBurdens: [
          'Utilities must compete for funds through application process',
          'Projects must meet prevailing wage and small business contracting requirements',
          'Annual reporting requirements on project outcomes and emissions reductions',
        ],
        potentialCosts: [
          'Debt service on $1.8B bonds approximately $90-120M annually depending on interest rates',
          'Administrative costs for oversight commission and application review process',
        ],
        beneficiaries: [
          'Utilities gaining access to low-cost capital for renewable energy projects',
          'Construction and clean energy industries receiving new project funding',
          'Small businesses and DBEs guaranteed 30% of contract value',
        ],
        opponents: [
          'Fiscal conservatives concerned about increasing state debt',
          'Some Republicans prefer private sector financing over government bonds',
        ],
      },
      'Transportation Sector': {
        topImpacts: [
          'Provides funding stream for transit expansion projects in SB 2156',
          'Could finance light rail, bus rapid transit, and electric vehicle infrastructure',
          'Reduces local match burden for transit agencies seeking federal funding',
        ],
        complianceBurdens: [
          'Transit agencies must demonstrate emissions reduction benefits',
          'Project applications require detailed economic and ridership projections',
        ],
        potentialCosts: [
          'Portion of $1.8B allocated to transit reduces funds available for energy projects',
        ],
        beneficiaries: [
          'Transit agencies in growing metropolitan areas',
          'Communities along proposed transit corridors',
          'Construction companies specializing in transit infrastructure',
        ],
        opponents: [
          'Rural legislators prefer highway funding over urban transit',
          'Auto industry groups concerned about transit subsidies',
        ],
      },
      'Municipal Government': {
        topImpacts: [
          'Local governments can access bond funds for water infrastructure upgrades',
          'Enables compliance with federal clean water mandates without local tax increases',
          'Creates opportunity for regional water recycling and conservation projects',
        ],
        complianceBurdens: [
          '30% small business contracting requirement may extend project timelines',
          'Prevailing wage increases labor costs 15-25% above market rates',
          'Competitive application process creates winners and losers among municipalities',
        ],
        potentialCosts: [
          'Application preparation costs for engineering studies and economic analysis',
          'Long-term debt service shared across state taxpayers',
        ],
        beneficiaries: [
          'Cities with aging water infrastructure needing capital investment',
          'Communities facing federal clean water compliance deadlines',
          'Local contractors and small businesses guaranteed contract share',
        ],
        opponents: [
          'Wealthy communities able to self-finance preferring tax policy over bonds',
          'Anti-debt advocacy groups opposing any new state borrowing',
        ],
      },
    },
    riskFlags: [
      {
        severity: 'medium',
        category: 'Fiscal',
        title: 'Debt Service Impact on State Budget',
        description: "Annual debt service of $90-120M will consume portion of general fund, potentially limiting flexibility for other priorities.",
        affectedProvisions: ['Section 3 - Bond Authorization'],
        mitigationStrategies: [
          '5-year sunset provision limits long-term debt exposure',
          'Strong credit rating should keep interest costs manageable',
          'Economic growth from infrastructure investment may offset debt costs',
        ],
      },
      {
        severity: 'medium',
        category: 'Implementation',
        title: 'Competitive Application Process Could Delay Projects',
        description: 'Creating new competitive process for $1.8B in funds will require significant administrative capacity and may delay urgent projects.',
        affectedProvisions: ['Section 5 - Project Selection Process'],
        mitigationStrategies: [
          'Phase 1 funding (first $600M) could prioritize shovel-ready projects',
          'Oversight commission can streamline application requirements after initial round',
          'Partner with existing state infrastructure bank for administrative support',
        ],
      },
      {
        severity: 'low',
        category: 'Political',
        title: 'House Republicans May Resist Despite Senate Passage',
        description: 'Some House conservatives oppose new debt despite bipartisan Senate vote. Prevailing wage provision particularly controversial.',
        affectedProvisions: ['Section 4 - Labor Standards', 'Section 3 - Bond Authorization'],
        mitigationStrategies: [
          'Emphasize job creation and economic development benefits',
          'Highlight bipartisan Senate vote (28-12) showing Republican support',
          'Consider technical amendment softening prevailing wage for rural projects',
        ],
      },
    ],
    talkingPoints: {
      Support: {
        mainPoints: [
          "This resolution provides critical funding for infrastructure modernization without raising taxes—bond financing spreads costs over time while projects deliver immediate economic benefits",
          "$1.8B investment will create an estimated 15,000 jobs in construction, clean energy, and transit sectors while accelerating our clean energy transition",
          "Bipartisan Senate passage (28-12) demonstrates this is smart fiscal policy, not partisan politics—Republicans and Democrats agree we need infrastructure investment",
          "Strong oversight and accountability measures including independent commission, annual reporting, and 5-year sunset ensure responsible use of taxpayer dollars",
          "30% small business contracting requirement and prevailing wage standards ensure benefits reach working families and local communities, not just large corporations",
        ],
        thirtySecondVersion: "This bipartisan resolution invests $1.8B in clean energy, water, and transit infrastructure—creating 15,000 jobs without raising taxes. It's smart financing with strong oversight, job quality standards, and support for small businesses.",
        qAndA: [
          {
            question: "Why bonds instead of pay-as-you-go financing?",
            answer: "Infrastructure assets last 30-50 years, so bond financing spreads costs fairly across generations who benefit. Current low interest rates make this financially advantageous, and immediate investment creates jobs now when economy needs boost.",
          },
          {
            question: "Won't this increase state debt to dangerous levels?",
            answer: "Our state has AAA credit rating and debt-to-GDP ratio well below national average. $1.8B represents less than 0.5% of state GDP and includes 5-year sunset requiring reauthorization. This is responsible borrowing for essential infrastructure.",
          },
          {
            question: "How do we know funds will be spent wisely?",
            answer: "The oversight commission includes legislative, executive, and citizen members providing checks and balances. Competitive application process ensures best projects get funded. Annual reporting creates transparency and accountability to Legislature and public.",
          },
        ],
      },
      Oppose: {
        mainPoints: [
          "Adding $1.8B in debt burdens future taxpayers with $90-120M in annual debt service that could instead fund education, healthcare, or tax relief",
          "Private sector and existing federal programs should finance infrastructure—government doesn't need to compete with private capital markets",
          "Prevailing wage mandates increase costs 15-25%, meaning we'll build fewer projects with same money—taxpayers deserve maximum value, not union giveaways",
          "Sunset provision is meaningless—once created, these programs never actually sunset and debt becomes permanent fixture of state budget",
          "Better approach is to fix existing infrastructure first before building new projects—maintenance backlog exceeds $3B statewide",
        ],
        thirtySecondVersion: "This adds $1.8B in debt that our children will repay, with union wage mandates that inflate costs 25%. We should fix existing infrastructure with current resources, not borrow for new projects and burden future generations.",
        qAndA: [
          {
            question: "Don't we need infrastructure investment?",
            answer: "Yes, but not by mortgaging our future. We should prioritize existing resources better, pursue federal grants more aggressively, and let private sector finance projects through public-private partnerships without adding state debt.",
          },
          {
            question: "Didn't this pass the Senate with bipartisan support?",
            answer: "12 Senators opposed it, and House has different concerns. Senate version is better than original $2.5B, but fundamental problem remains—we're adding debt instead of making tough budget choices within existing resources.",
          },
          {
            question: "What about the oversight and accountability measures?",
            answer: "Oversight commissions can't change the underlying problem of $90-120M in annual debt service. That money comes from taxpayers regardless of how well commission monitors spending. We're creating bureaucracy to justify debt we shouldn't take on.",
          },
        ],
      },
    },
    amendmentConcepts: [
      {
        title: 'Rural Prevailing Wage Exemption',
        description: 'Exempt projects in counties under 100,000 population from prevailing wage requirements to reduce costs.',
        targetSection: 'Section 4 - Labor Standards',
        rationale: 'Could gain House Republican votes while reducing project costs in rural areas where prevailing wage premium is highest.',
      },
      {
        title: 'Debt Service Appropriation Lock',
        description: 'Create dedicated revenue stream (e.g., portion of existing sales tax) to ensure debt service is paid before other appropriations.',
        targetSection: 'Section 3 - Bond Authorization',
        rationale: 'Addresses fiscal conservative concerns about debt service competing with other priorities; improves bond rating.',
      },
      {
        title: 'Maintenance-First Requirement',
        description: 'Require 25% of bond proceeds fund maintenance and repair of existing infrastructure before new construction.',
        targetSection: 'Section 6 - Eligible Projects',
        rationale: 'Addresses concern about building new projects while maintenance backlog grows; ensures existing assets protected.',
      },
    ],
    generatedAt: '2024-12-18T14:30:00Z',
  },
};

// Member Insights (Legislator positions on bills)
export const mockMemberInsights: { [billId: string]: MemberInsight[] } = {
  'bill-001': [
    {
      personId: 'leg-001',
      billId: 'bill-001',
      name: 'Rep. Sarah Martinez (D-14)',
      role: 'Primary Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 100,
      factors: [
        'Primary sponsor and bill champion',
        'Chairs Energy & Environment Committee',
        'Strong environmental voting record',
        'Represents district with solar manufacturing jobs',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-15',
      relationshipOwner: 'Sarah Chen',
    },
    {
      personId: 'leg-019',
      billId: 'bill-001',
      name: 'Sen. Robert Williams (R-31)',
      role: 'Committee Member',
      stanceEstimate: 'oppose',
      supportLikelihood: 'low',
      supportPercentage: 15,
      factors: [
        'Represents coal mining district',
        'Voted against similar legislation in past',
        'Expressed concerns about rate impacts',
        'Close ties to traditional energy industry',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-10',
      relationshipOwner: 'Michael Santos',
    },
    {
      personId: 'leg-020',
      billId: 'bill-001',
      name: 'Rep. Lisa Thompson (R-8)',
      role: 'Committee Member',
      stanceEstimate: 'unknown',
      supportLikelihood: 'medium',
      supportPercentage: 55,
      factors: [
        'Swing vote - moderate Republican',
        'Represents suburban district concerned about climate',
        'Also concerned about utility rate impacts',
        'Voted for nuclear inclusion amendment',
      ],
      confidence: 'medium',
      lastInteractionDate: '2024-12-12',
      relationshipOwner: 'Sarah Chen',
    },
  ],

  'bill-002': [
    {
      personId: 'leg-003',
      billId: 'bill-002',
      name: 'Sen. Michael Torres (R-18)',
      role: 'Primary Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 100,
      factors: [
        'Primary sponsor',
        'Represents rural district with physician shortage',
        'Bipartisan coalition builder',
        'Healthcare is signature issue',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-16',
      relationshipOwner: 'Jennifer Martinez',
    },
  ],

  'bill-003': [
    {
      personId: 'leg-005',
      billId: 'bill-003',
      name: 'Rep. David Kim (D-11)',
      role: 'Primary Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 100,
      factors: [
        'Primary sponsor and privacy advocate',
        'Tech background (former software engineer)',
        'Consumer protection champion',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-14',
      relationshipOwner: 'Emma Rodriguez',
    },
    {
      personId: 'leg-021',
      billId: 'bill-003',
      name: 'Sen. Andrew Foster (R-26)',
      role: 'Committee Member',
      stanceEstimate: 'oppose',
      supportLikelihood: 'low',
      supportPercentage: 20,
      factors: [
        'Pro-business voting record',
        'Received tech industry campaign contributions',
        'Expressed concerns about compliance costs',
        'Prefers federal approach',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-11',
      relationshipOwner: 'Marcus Johnson',
    },
  ],

  'bill-009': [
    {
      personId: 'leg-021',
      billId: 'bill-009',
      name: 'Sen. Katherine Hayes (D-11)',
      role: 'Primary Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 100,
      factors: [
        'Lead sponsor and architect of the resolution',
        'Chairs Senate Finance Committee',
        'Long track record on infrastructure investment',
        'Successfully shepherded bill through Senate 28-12',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-18',
      relationshipOwner: 'Sarah Chen',
    },
    {
      personId: 'leg-022',
      billId: 'bill-009',
      name: 'Sen. David Richardson (R-29)',
      role: 'Co-Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 85,
      factors: [
        'Republican co-sponsor providing bipartisan credibility',
        'Represents district with aging water infrastructure',
        'Fiscal conservative but supports infrastructure investment',
        'Helped negotiate reduction from $2.5B to $1.8B',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-17',
      relationshipOwner: 'Michael Santos',
    },
    {
      personId: 'leg-023',
      billId: 'bill-009',
      name: 'Rep. Angela Foster (D-7)',
      role: 'House Sponsor',
      stanceEstimate: 'support',
      supportLikelihood: 'high',
      supportPercentage: 95,
      factors: [
        'Leading House effort for resolution passage',
        'Represents urban district benefiting from transit funding',
        'Strong advocate for green jobs and clean energy',
        'Working vote count shows 61-62 likely House supporters',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-18',
      relationshipOwner: 'Sarah Chen',
    },
    {
      personId: 'leg-024',
      billId: 'bill-009',
      name: 'Rep. Thomas Bradley (R-42)',
      role: 'House Appropriations Chair',
      stanceEstimate: 'unknown',
      supportLikelihood: 'medium',
      supportPercentage: 50,
      factors: [
        'Key swing vote as Appropriations Chair',
        'Concerned about debt service impact on state budget',
        'Supports infrastructure but skeptical of prevailing wage requirement',
        'May negotiate for rural prevailing wage exemption amendment',
      ],
      confidence: 'medium',
      lastInteractionDate: '2024-12-16',
      relationshipOwner: 'Marcus Johnson',
    },
    {
      personId: 'leg-025',
      billId: 'bill-009',
      name: 'Rep. Elizabeth Warren (R-35)',
      role: 'Committee Member',
      stanceEstimate: 'oppose',
      supportLikelihood: 'low',
      supportPercentage: 25,
      factors: [
        'Fiscal hawk opposed to new state debt',
        'Represents rural district skeptical of transit funding',
        'Prefers pay-as-you-go infrastructure financing',
        'Leading opposition effort among House conservatives',
      ],
      confidence: 'high',
      lastInteractionDate: '2024-12-15',
      relationshipOwner: 'Michael Santos',
    },
  ],
};

// Bill Momentum Scores
export const mockBillMomentum: { [billId: string]: BillMomentum } = {
  'bill-001': {
    billId: 'bill-001',
    score: 72,
    trend: 'up',
    trendChange: 8,
    nextStepGuess: 'Committee vote expected Dec 20 with amendments; likely passes committee 7-5',
    nextStepConfidence: 'high',
    stallRisks: [
      'Utility industry lobbying for further delays',
      'Competing budget priorities may limit appetite for rate impacts',
    ],
  },
  'bill-002': {
    billId: 'bill-002',
    score: 85,
    trend: 'up',
    trendChange: 12,
    nextStepGuess: 'Floor passage expected with strong bipartisan support; moves to House within week',
    nextStepConfidence: 'high',
    stallRisks: [
      'Minimal - strong momentum and bipartisan support',
    ],
  },
  'bill-003': {
    billId: 'bill-003',
    score: 48,
    trend: 'down',
    trendChange: -6,
    nextStepGuess: 'Committee markup Dec 21 likely to add further industry-friendly amendments or stall',
    nextStepConfidence: 'medium',
    stallRisks: [
      'Heavy tech industry lobbying and campaign pressure',
      'Republican committee members may push to table bill',
      'Concerns about preemption if federal bill emerges',
    ],
  },
  'bill-004': {
    billId: 'bill-004',
    score: 63,
    trend: 'steady',
    trendChange: 2,
    nextStepGuess: 'House committee assignment then hearings in January; passage uncertain',
    nextStepConfidence: 'medium',
    stallRisks: [
      'Agricultural lobby concerns about crop exemptions',
      'House may have different priorities than Senate',
    ],
  },
  'bill-005': {
    billId: 'bill-005',
    score: 41,
    trend: 'down',
    trendChange: -5,
    nextStepGuess: 'Committee hearing Dec 27 but fiscal concerns likely delay or reduce scope',
    nextStepConfidence: 'medium',
    stallRisks: [
      '$1.2B price tag faces major budget headwinds',
      'Governor has not signaled support',
      'Competing education funding proposals',
    ],
  },
  'bill-006': {
    billId: 'bill-006',
    score: 55,
    trend: 'steady',
    trendChange: 0,
    nextStepGuess: 'January hearings; moderate support but needs local government coalition',
    nextStepConfidence: 'low',
    stallRisks: [
      'Local match requirement may lose city support',
      'Competing infrastructure priorities',
    ],
  },
  'bill-007': {
    billId: 'bill-007',
    score: 32,
    trend: 'steady',
    trendChange: 1,
    nextStepGuess: 'Awaiting committee referral; low priority in current session',
    nextStepConfidence: 'low',
    stallRisks: [
      'Not yet referred to committee',
      'Industry compliance cost concerns',
      'Low legislative priority',
    ],
  },
  'bill-008': {
    billId: 'bill-008',
    score: 58,
    trend: 'up',
    trendChange: 4,
    nextStepGuess: 'Public hearing Jan 10; amendments likely to narrow local preemption scope',
    nextStepConfidence: 'medium',
    stallRisks: [
      'Local government opposition to preemption',
      'Single-family neighborhood advocacy groups mobilizing',
      'May be watered down significantly in committee',
    ],
  },
  'bill-009': {
    billId: 'bill-009',
    score: 78,
    trend: 'up',
    trendChange: 6,
    nextStepGuess: 'House floor vote Dec 22 expected to pass 62-58; prevailing wage debate will be intense',
    nextStepConfidence: 'high',
    stallRisks: [
      'Prevailing wage opposition from House Republicans could flip 3-5 votes',
      'Last-minute fiscal concerns if state revenue projections revised downward',
      'Conservative groups launching media campaign against "government debt"',
    ],
  },
};

// Media mentions and press coverage
export const mockMentions: { [billId: string]: Mention[] } = {
  'bill-001': [
    {
      id: 'mention-001-1',
      billId: 'bill-001',
      sourceType: 'news',
      title: 'Clean Energy Bill Clears Major Hurdle With Committee Amendments',
      snippet: 'After weeks of negotiations, the Clean Energy Grid Modernization Act passed out of committee with key compromises including nuclear energy inclusion and extended timelines for rural utilities...',
      url: 'https://example.com/news/clean-energy-committee',
      timestamp: '2024-12-09T14:30:00Z',
      sentiment: 'positive',
      tags: ['Energy', 'Legislature'],
    },
    {
      id: 'mention-001-2',
      billId: 'bill-001',
      sourceType: 'press-release',
      title: 'Environmental Coalition Applauds Clean Energy Progress',
      snippet: 'A coalition of environmental groups praised lawmakers for advancing HB 2847, calling it a "historic step forward" for climate action while acknowledging concerns about implementation timeline...',
      url: 'https://example.com/pr/enviro-coalition',
      timestamp: '2024-12-10T09:15:00Z',
      sentiment: 'positive',
      tags: ['Environment', 'Advocacy'],
    },
    {
      id: 'mention-001-3',
      billId: 'bill-001',
      sourceType: 'news',
      title: "Utility Companies Warn Of Rate Impacts From Renewable Mandate",
      snippet: "Major utility providers cautioned that HB 2847's renewable energy requirements could increase residential electricity rates by 2-4% annually during peak infrastructure buildout years...",
      url: "https://example.com/news/utility-concerns",
      timestamp: '2024-12-11T16:45:00Z',
      sentiment: 'negative',
      tags: ['Energy', 'Utilities', 'Rates'],
    },
  ],

  'bill-002': [
    {
      id: 'mention-002-1',
      billId: 'bill-002',
      sourceType: 'news',
      title: 'Healthcare Workforce Bill Gains Momentum With Bipartisan Support',
      snippet: 'SB 1205 is on track for Senate floor passage after clearing committee with strong bipartisan backing. Rural lawmakers from both parties emphasized the urgent need for healthcare providers...',
      url: 'https://example.com/news/healthcare-workforce',
      timestamp: '2024-12-12T11:20:00Z',
      sentiment: 'positive',
      tags: ['Healthcare', 'Bipartisan'],
    },
  ],

  'bill-003': [
    {
      id: 'mention-003-1',
      billId: 'bill-003',
      sourceType: 'news',
      title: 'Tech Industry Lobbying Intensifies Against Data Privacy Bill',
      snippet: 'Major technology companies are mounting an aggressive lobbying campaign against HB 90, arguing the data privacy requirements would impose unreasonable compliance costs and hurt innovation...',
      url: 'https://example.com/news/tech-lobbying',
      timestamp: '2024-12-08T13:30:00Z',
      sentiment: 'negative',
      tags: ['Technology', 'Lobbying'],
    },
    {
      id: 'mention-003-2',
      billId: 'bill-003',
      sourceType: 'press-release',
      title: 'Consumer Groups Push For Stronger Privacy Protections',
      snippet: 'Consumer advocacy organizations are calling for legislators to restore the private right of action that was removed from HB 90 in committee, arguing enforcement will be inadequate without it...',
      url: 'https://example.com/pr/consumer-advocates',
      timestamp: '2024-12-13T10:00:00Z',
      sentiment: 'neutral',
      tags: ['Privacy', 'Consumer Protection'],
    },
  ],

  'bill-009': [
    {
      id: 'mention-009-1',
      billId: 'bill-009',
      sourceType: 'news',
      title: 'Senate Passes $1.8B Infrastructure Bond Resolution With Bipartisan Support',
      snippet: 'In a rare show of bipartisan cooperation, the Senate approved SCR 1001 authorizing green bonds for infrastructure investment by a vote of 28-12. The resolution now heads to the House where passage is expected but not guaranteed...',
      url: 'https://example.com/news/senate-passes-infrastructure',
      timestamp: '2024-12-12T17:45:00Z',
      sentiment: 'positive',
      tags: ['Infrastructure', 'Bipartisan', 'Finance'],
    },
    {
      id: 'mention-009-2',
      billId: 'bill-009',
      sourceType: 'editorial',
      title: 'Editorial: Infrastructure Bonds Are Smart Investment For State Future',
      snippet: 'The State Journal editorial board endorses SCR 1001, arguing that low interest rates and urgent infrastructure needs make this the right time for bond financing. The resolution includes appropriate oversight and accountability measures...',
      url: 'https://example.com/editorial/infrastructure-endorsement',
      timestamp: '2024-12-14T06:00:00Z',
      sentiment: 'positive',
      tags: ['Infrastructure', 'Editorial', 'Economy'],
    },
    {
      id: 'mention-009-3',
      billId: 'bill-009',
      sourceType: 'press-release',
      title: 'Construction Industry Coalition Supports Infrastructure Investment',
      snippet: 'A coalition of construction companies, labor unions, and engineering firms announced support for SCR 1001, projecting the bond program would create 15,000 jobs and generate $3.2B in economic activity...',
      url: 'https://example.com/pr/construction-coalition',
      timestamp: '2024-12-15T11:30:00Z',
      sentiment: 'positive',
      tags: ['Infrastructure', 'Jobs', 'Labor'],
    },
    {
      id: 'mention-009-4',
      billId: 'bill-009',
      sourceType: 'news',
      title: 'Conservative Groups Launch Campaign Against Infrastructure Debt',
      snippet: 'Fiscal conservative organizations are running digital ads targeting House members, calling SCR 1001 "reckless borrowing" that will burden future generations. The campaign focuses on rural and suburban Republican districts...',
      url: 'https://example.com/news/conservative-opposition',
      timestamp: '2024-12-17T14:20:00Z',
      sentiment: 'negative',
      tags: ['Infrastructure', 'Opposition', 'Politics'],
    },
    {
      id: 'mention-009-5',
      billId: 'bill-009',
      sourceType: 'blog',
      title: 'Analysis: Why Prevailing Wage Could Sink Infrastructure Bonds',
      snippet: 'Political analyst breaks down House vote math on SCR 1001, identifying 8-10 Republicans who support infrastructure investment but oppose prevailing wage mandates. An amendment exempting rural projects could be key to passage...',
      url: 'https://example.com/blog/infrastructure-analysis',
      timestamp: '2024-12-18T09:45:00Z',
      sentiment: 'neutral',
      tags: ['Infrastructure', 'Analysis', 'Labor'],
    },
  ],
};

// Bill-related tasks
export const mockBillTasks: BillTask[] = [
  {
    id: 'task-001',
    title: 'Prepare testimony for HB 2847 committee hearing',
    description: 'Draft and review testimony supporting clean energy bill with focus on grid modernization benefits',
    dueDate: '2024-12-19',
    ownerId: 'user-001',
    ownerName: 'Sarah Chen',
    linkedBillId: 'bill-001',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 'task-002',
    title: 'Coordinate coalition sign-on letter for SB 1205',
    description: 'Gather signatures from healthcare organizations supporting workforce development bill',
    dueDate: '2024-12-18',
    ownerId: 'user-002',
    ownerName: 'Jennifer Martinez',
    linkedBillId: 'bill-002',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 'task-003',
    title: 'Schedule meetings with swing voters on HB 90',
    description: 'Set up briefings with moderate Republicans on technology committee to address privacy bill concerns',
    dueDate: '2024-12-20',
    ownerId: 'user-003',
    ownerName: 'Marcus Johnson',
    linkedBillId: 'bill-003',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'task-004',
    title: 'Monitor HB 6104 public hearing',
    description: 'Attend Jan 10 public hearing on housing bill and report on testimony themes',
    dueDate: '2025-01-10',
    ownerId: 'user-004',
    ownerName: 'David Park',
    linkedBillId: 'bill-008',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'task-009',
    title: 'Whip count for SCR 1001 House floor vote',
    description: 'Contact swing House Republicans to secure votes for infrastructure bond resolution; focus on rural prevailing wage concerns',
    dueDate: '2024-12-21',
    ownerId: 'user-003',
    ownerName: 'Marcus Johnson',
    linkedBillId: 'bill-009',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: 'task-010',
    title: 'Prepare fact sheet on SCR 1001 economic impact',
    description: 'Compile data on job creation, economic multipliers, and debt service impacts for House members',
    dueDate: '2024-12-20',
    ownerId: 'user-001',
    ownerName: 'Sarah Chen',
    linkedBillId: 'bill-009',
    status: 'in-progress',
    priority: 'high',
  },
];
