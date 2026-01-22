export interface ElectionTeamMember {
  id: string;
  name: string;
  role: string;
}

export interface County {
  id: string;
  name: string;
  lean: 'strong_dem' | 'lean_dem' | 'swing' | 'lean_rep' | 'strong_rep';
}

export interface Candidate {
  id: string;
  raceId: string;
  name: string;
  isIncumbent: boolean;
  status: 'filed' | 'declared' | 'rumored' | 'withdrawn';
  credibility: number;
  website: string | null;
  messagingTags: string[];
  questionnaire: { q: string; a: string }[];
  finance: {
    periodEnd: string;
    raised: number;
    spent: number;
    cash: number;
    debt: number;
  }[];
  endorsements: string[]; // IDs
  // Candidate-specific metrics
  polling: {
    date: string;
    support: number;
    favorable: number;
    unfavorable: number;
  }[];
  trend: { 
    direction: 'improving' | 'stable' | 'worsening'; 
    series: number[]; // Support over time
  };
  nameID: number; // Name recognition percentage
  momentum: number; // -100 to 100 scale
  topVoterGroups: { group: string; support: number }[]; // Key demographic strongholds
  vulnerabilities: string[]; // Key weaknesses
}

export interface Race {
  id: string;
  countyIds: string[];
  office: string;
  district: string;
  stage: 'primary' | 'general' | 'special';
  electionDate: string;
  filingDeadline: string;
  earlyVotingStart: string;
  lean: 'strong_dem' | 'lean_dem' | 'swing' | 'lean_rep' | 'strong_rep';
  competitivenessScore: number;
  trend: { direction: 'improving' | 'stable' | 'worsening'; series: number[] };
  moneyHeat: number;
  outsideSpendSeries: number[];
  topIssues: { issue: string; salience: number }[];
  districtProfile: {
    turnoutPattern: { midterm: number; presidential: number };
    urbanicityIndex: number;
    ticketSplitIndex: number;
    medianIncome: number;
    educationIndex: number;
    ageIndex: { under30: number; age30_49: number; age50_64: number; age65plus: number };
  };
  candidates: string[]; // IDs
  linkedLegislatorId: string | null;
  ourInvolvement: { hasWarRoom: boolean; projectIds: string[]; taskCount: number };
  narratives: { id: string; sentiment: 'positive' | 'neutral' | 'negative'; title: string; volume7d: number }[];
}

export interface Endorsement {
  id: string;
  candidateId: string;
  name: string;
  type: 'org' | 'pac' | 'individual' | 'official';
  date: string;
}

export interface Filing {
  id: string;
  raceId: string;
  candidateId: string;
  type: string;
  received: string;
  link: string | null;
}

export interface MediaEvent {
  id: string;
  raceId: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  title: string;
  source: string;
  link: string | null;
}

export interface FieldProject {
  id: string;
  raceId: string;
  name: string;
  doors: number;
  convos: number;
  shifts: number;
  weeklyReports: { weekOf: string; topObjections: string[]; scriptScore: number; notes: string }[];
}

export interface PlaybookTemplate {
  key: string;
  name: string;
  steps: string[];
}

export interface Opportunity {
  id: string;
  raceId: string;
  type: 'risk_hedge' | 'coalition_leverage' | 'money_heat' | 'narrative_counter' | 'meeting_request';
  title: string;
  urgencyDays: number;
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  playbookKey: string;
  status: 'new' | 'active' | 'snoozed' | 'dismissed';
}

export const mockElectionsHub = {
  meta: { cycle: "2026", lastSync: "2026-03-18T09:12:00Z" },

  team: [
    { id: "u1", name: "Jordan (Account Lead)", role: "Manager" },
    { id: "u2", name: "Sam (Policy)", role: "Staff" },
    { id: "u3", name: "Riley (Comms)", role: "Staff" },
    { id: "u4", name: "Avery (Field)", role: "Staff" }
  ],

  counties: [
    { id: "maricopa", name: "Maricopa", lean: "swing" },
    { id: "pima", name: "Pima", lean: "strong_dem" },
    { id: "pinal", name: "Pinal", lean: "lean_rep" },
    { id: "yavapai", name: "Yavapai", lean: "strong_rep" },
    { id: "coconino", name: "Coconino", lean: "lean_dem" },
    { id: "mohave", name: "Mohave", lean: "strong_rep" },
    { id: "yuma", name: "Yuma", lean: "lean_rep" }
  ] as County[],

  races: [
    {
      id: "race-sd12",
      countyIds: ["maricopa", "pinal"],
      office: "State Senate",
      district: "SD-12",
      stage: "general",
      electionDate: "2026-11-03",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-10-01",
      lean: "swing",
      competitivenessScore: 78,
      trend: { direction: "worsening", series: [62, 64, 66, 70, 74, 78] },
      moneyHeat: 81,
      outsideSpendSeries: [10, 14, 18, 26, 55, 81],
      topIssues: [
        { issue: "Water Reliability", salience: 88 },
        { issue: "Education Funding", salience: 84 },
        { issue: "Cost of Living", salience: 79 }
      ],
      districtProfile: {
        turnoutPattern: { midterm: 0.49, presidential: 0.62 },
        urbanicityIndex: 61,
        ticketSplitIndex: 42,
        medianIncome: 69000,
        educationIndex: 58,
        ageIndex: { under30: 21, age30_49: 34, age50_64: 28, age65plus: 17 }
      },
      candidates: ["cand-inc-012", "cand-chal-2"],
      linkedLegislatorId: "leg-az-012",
      ourInvolvement: { hasWarRoom: true, projectIds: ["proj-sd12-field"], taskCount: 12 },
      narratives: [
        { id: "nar1", sentiment: "negative", title: "Cost-shift narrative rising", volume7d: 34 },
        { id: "nar2", sentiment: "neutral", title: "Water reliability framing", volume7d: 21 }
      ]
    },
    {
      id: "race-hd7",
      countyIds: ["maricopa"],
      office: "State House",
      district: "HD-07",
      stage: "general",
      electionDate: "2026-11-03",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-10-01",
      lean: "lean_dem",
      competitivenessScore: 63,
      trend: { direction: "improving", series: [70, 68, 66, 65, 64, 63] },
      moneyHeat: 54,
      outsideSpendSeries: [6, 8, 10, 13, 20, 54],
      topIssues: [
        { issue: "Healthcare Access", salience: 82 },
        { issue: "Education", salience: 76 },
        { issue: "Housing", salience: 71 }
      ],
      districtProfile: { turnoutPattern: { midterm: 0.44, presidential: 0.58 }, urbanicityIndex: 74, ticketSplitIndex: 38, medianIncome: 72000, educationIndex: 63,
        ageIndex: { under30: 25, age30_49: 33, age50_64: 26, age65plus: 16 } },
      candidates: ["cand-hd7-a", "cand-hd7-b"],
      linkedLegislatorId: null,
      ourInvolvement: { hasWarRoom: false, projectIds: [], taskCount: 0 },
      narratives: []
    },
    {
      id: "race-sd4",
      countyIds: ["maricopa"],
      office: "State Senate",
      district: "SD-04",
      stage: "general",
      electionDate: "2026-11-03",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-10-01",
      lean: "lean_dem",
      competitivenessScore: 58,
      trend: { direction: "stable", series: [55, 56, 57, 57, 58, 58] },
      moneyHeat: 42,
      outsideSpendSeries: [5, 8, 12, 15, 20, 42],
      topIssues: [
        { issue: "Abortion Access", salience: 91 },
        { issue: "Education Funding", salience: 85 },
        { issue: "Air Quality", salience: 72 }
      ],
      districtProfile: { turnoutPattern: { midterm: 0.51, presidential: 0.65 }, urbanicityIndex: 82, ticketSplitIndex: 28, medianIncome: 62000, educationIndex: 68,
        ageIndex: { under30: 28, age30_49: 36, age50_64: 22, age65plus: 14 } },
      candidates: [],
      linkedLegislatorId: null,
      ourInvolvement: { hasWarRoom: false, projectIds: [], taskCount: 0 },
      narratives: []
    },
    {
      id: "race-hd12",
      countyIds: ["maricopa", "pinal"],
      office: "State House",
      district: "HD-12",
      stage: "general",
      electionDate: "2026-11-03",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-10-01",
      lean: "swing",
      competitivenessScore: 82,
      trend: { direction: "worsening", series: [65, 68, 72, 75, 79, 82] },
      moneyHeat: 76,
      outsideSpendSeries: [10, 15, 25, 35, 50, 76],
      topIssues: [
        { issue: "Border Security", salience: 88 },
        { issue: "Cost of Living", salience: 85 },
        { issue: "Water", salience: 80 }
      ],
      districtProfile: { turnoutPattern: { midterm: 0.50, presidential: 0.63 }, urbanicityIndex: 60, ticketSplitIndex: 45, medianIncome: 68000, educationIndex: 56,
        ageIndex: { under30: 20, age30_49: 33, age50_64: 29, age65plus: 18 } },
      candidates: [],
      linkedLegislatorId: null,
      ourInvolvement: { hasWarRoom: true, projectIds: ["proj-hd12-canvass"], taskCount: 8 },
      narratives: []
    }
  ] as Race[],

  candidates: [
    {
      id: "cand-inc-012",
      raceId: "race-sd12",
      name: "Alex Martinez",
      isIncumbent: true,
      status: "filed",
      credibility: 72,
      website: "https://example.com/martinez",
      messagingTags: ["public safety", "business climate", "infrastructure"],
      questionnaire: [
        { q: "Top priorities?", a: "Economic development, water reliability, workforce training." },
        { q: "Non-negotiables?", a: "Fiscal guardrails and public safety." }
      ],
      finance: [
        { periodEnd: "2025-12-31", raised: 180000, spent: 120000, cash: 95000, debt: 0 },
        { periodEnd: "2026-03-31", raised: 90000, spent: 110000, cash: 65000, debt: 15000 }
      ],
      endorsements: ["end-1", "end-4"],
      polling: [
        { date: "2025-12-01", support: 48, favorable: 52, unfavorable: 38 },
        { date: "2026-01-01", support: 45, favorable: 50, unfavorable: 40 },
        { date: "2026-02-01", support: 42, favorable: 48, unfavorable: 43 },
        { date: "2026-03-01", support: 40, favorable: 46, unfavorable: 45 },
        { date: "2026-03-15", support: 38, favorable: 44, unfavorable: 47 },
        { date: "2026-03-25", support: 35, favorable: 42, unfavorable: 49 }
      ],
      trend: { 
        direction: "worsening", 
        series: [48, 45, 42, 40, 38, 35] // Declining support - worsening
      },
      nameID: 60,
      momentum: -15,
      topVoterGroups: [
        { group: "Business Owners", support: 68 },
        { group: "Age 65+", support: 62 },
        { group: "Suburban Voters", support: 51 }
      ],
      vulnerabilities: ["Perceived as out of touch", "Campaign finance concerns", "Negative local news coverage"]
    },
    {
      id: "cand-chal-2",
      raceId: "race-sd12",
      name: "Taylor Nguyen",
      isIncumbent: false,
      status: "declared",
      credibility: 81,
      website: "https://example.com/nguyen",
      messagingTags: ["education outcomes", "cost of living", "accountability"],
      questionnaire: [],
      finance: [
        { periodEnd: "2025-12-31", raised: 210000, spent: 80000, cash: 140000, debt: 0 },
        { periodEnd: "2026-03-31", raised: 120000, spent: 90000, cash: 170000, debt: 0 }
      ],
      endorsements: ["end-2"],
      polling: [
        { date: "2025-12-01", support: 38, favorable: 41, unfavorable: 28 },
        { date: "2026-01-01", support: 40, favorable: 43, unfavorable: 27 },
        { date: "2026-02-01", support: 42, favorable: 46, unfavorable: 26 },
        { date: "2026-03-01", support: 44, favorable: 48, unfavorable: 25 },
        { date: "2026-03-15", support: 46, favorable: 51, unfavorable: 24 },
        { date: "2026-03-25", support: 48, favorable: 53, unfavorable: 23 }
      ],
      trend: { 
        direction: "improving", 
        series: [38, 40, 42, 44, 46, 48] // Rising support - improving
      },
      nameID: 55,
      momentum: 10,
      topVoterGroups: [
        { group: "Young Professionals", support: 71 },
        { group: "Parents with School-Age Children", support: 65 },
        { group: "College-Educated Voters", support: 58 }
      ],
      vulnerabilities: ["First-time candidate", "Lower name recognition in rural areas", "Less established donor network"]
    },
    {
      id: "cand-hd7-a",
      raceId: "race-hd7",
      name: "Maria Gonzalez",
      isIncumbent: true,
      status: "filed",
      credibility: 85,
      website: null,
      messagingTags: ["healthcare", "families", "jobs"],
      questionnaire: [],
      finance: [],
      endorsements: [],
      polling: [
        { date: "2025-12-01", support: 52, favorable: 58, unfavorable: 31 },
        { date: "2026-01-01", support: 53, favorable: 59, unfavorable: 30 },
        { date: "2026-02-01", support: 54, favorable: 60, unfavorable: 29 },
        { date: "2026-03-01", support: 55, favorable: 61, unfavorable: 28 }
      ],
      trend: { 
        direction: "improving", 
        series: [52, 53, 54, 55] // Steady growth
      },
      nameID: 78,
      momentum: 5,
      topVoterGroups: [
        { group: "Hispanic/Latino Voters", support: 74 },
        { group: "Healthcare Workers", support: 69 },
        { group: "Women", support: 61 }
      ],
      vulnerabilities: ["Less funding than expected", "Suburban outreach needs work"]
    },
    {
      id: "cand-hd7-b",
      raceId: "race-hd7",
      name: "Robert Smith",
      isIncumbent: false,
      status: "declared",
      credibility: 60,
      website: null,
      messagingTags: ["freedom", "low taxes"],
      questionnaire: [],
      finance: [],
      endorsements: [],
      polling: [
        { date: "2025-12-01", support: 35, favorable: 38, unfavorable: 41 },
        { date: "2026-01-01", support: 34, favorable: 37, unfavorable: 42 },
        { date: "2026-02-01", support: 33, favorable: 36, unfavorable: 43 },
        { date: "2026-03-01", support: 32, favorable: 35, unfavorable: 44 }
      ],
      trend: { 
        direction: "worsening", 
        series: [35, 34, 33, 32] // Declining support
      },
      nameID: 42,
      momentum: -8,
      topVoterGroups: [
        { group: "Small Business Owners", support: 54 },
        { group: "Rural Voters", support: 48 },
        { group: "Men 50+", support: 45 }
      ],
      vulnerabilities: ["Very low name recognition", "Struggling to raise funds", "Weak messaging discipline"]
    }
  ] as Candidate[],

  endorsements: [
    { id: "end-1", candidateId: "cand-inc-012", name: "Regional Builders Association", type: "org", date: "2026-01-18" },
    { id: "end-2", candidateId: "cand-chal-2", name: "Education Leaders PAC", type: "pac", date: "2026-02-02" },
    { id: "end-4", candidateId: "cand-inc-012", name: "Public Safety Coalition", type: "org", date: "2026-03-05" }
  ] as Endorsement[],

  filings: [
    { id: "f1", raceId: "race-sd12", candidateId: "cand-inc-012", type: "Q1 Finance Report", received: "2026-04-02", link: "https://example.com/filing-inc-q1" },
    { id: "f2", raceId: "race-sd12", candidateId: "cand-chal-2", type: "Q1 Finance Report", received: "2026-04-02", link: "https://example.com/filing-nguyen-q1" }
  ] as Filing[],

  mediaEvents: [
    { id: "m1", raceId: "race-sd12", date: "2026-03-12", sentiment: "negative", title: "Negative story circulating", source: "Local outlet", link: "https://example.com/story" },
    { id: "m2", raceId: "race-sd12", date: "2026-02-14", sentiment: "neutral", title: "Internal poll shows tightening margin", source: "Internal note", link: null }
  ] as MediaEvent[],

  fieldProjects: [
    { id: "proj-sd12-field", raceId: "race-sd12", name: "SD-12 Canvassing Push", doors: 4120, convos: 830, shifts: 96,
      weeklyReports: [
        { weekOf: "2026-03-03", topObjections: ["cost", "trust"], scriptScore: 74, notes: "Water framing improves persuasion among undecideds." },
        { weekOf: "2026-03-10", topObjections: ["education", "taxes"], scriptScore: 69, notes: "Opposition narrative is sticking; validators needed." }
      ]
    }
  ] as FieldProject[],

  playbooks: [
    { key: "rapid_response", name: "Rapid Response (Negative Story)", steps: ["Create comms brief", "Assign spokesperson", "Draft talking points", "Schedule press outreach", "Create monitoring alerts"] },
    { key: "money_surge", name: "Money Surge Monitoring", steps: ["Create spend report", "Identify spender orgs", "Draft counter narrative", "Escalate to leadership", "Update race brief"] },
    { key: "debate_prep", name: "Debate Prep Sprint", steps: ["Compile opponent dossier", "Draft Q&A", "Build message box", "Schedule mock debate", "Create briefing packet"] },
    { key: "canvass_ramp", name: "Canvassing Ramp", steps: ["Set weekly goals", "Recruit shifts", "Update scripts", "Track objections", "Weekly recap record"] }
  ] as PlaybookTemplate[],

  opportunities: [
    { id: "o1", raceId: "race-sd12", type: "risk_hedge", title: "Risk hedge: move sensitive work private", urgencyDays: 10, impact: "high", confidence: 74, evidence: ["m1"], playbookKey: "rapid_response", status: "new" },
    { id: "o2", raceId: "race-sd12", type: "coalition_leverage", title: "Validator needed to blunt opposition narrative", urgencyDays: 21, impact: "medium", confidence: 62, evidence: ["proj-sd12-field"], playbookKey: "canvass_ramp", status: "active" },
    { id: "o3", raceId: "race-sd12", type: "money_heat", title: "Money heat spike: monitor outside spend", urgencyDays: 7, impact: "medium", confidence: 68, evidence: ["f1","f2"], playbookKey: "money_surge", status: "new" }
  ] as Opportunity[]
};