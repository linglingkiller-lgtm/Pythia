
export interface ElectionLegislator {
  id: string;
  name: string;
  chamber: string;
  district: string;
  party: string;
  photoUrl: string;
  roles: string[];
  contact: { office: string; phone: string; email: string };
}

export interface ElectionDriver {
  driver: string;
  impact: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface ElectionProfile {
  nextElectionDate: string;
  termLimited: boolean;
  ambitionFlag: string;
  vulnerability: { score: number; trend: 'improving' | 'stable' | 'worsening'; confidence: number };
  manualOverride: { enabled: boolean; score: number; notes: string };
  drivers: ElectionDriver[];
}

export interface ElectionRace {
  id: string;
  stage: 'primary' | 'general' | 'special';
  electionDate: string;
  filingDeadline: string;
  earlyVotingStart: string;
  officeName: string;
  competitiveness: { rating: 'solid' | 'likely' | 'lean' | 'tossup'; trend: 'improving' | 'stable' | 'worsening' };
  isIncumbentRunning: boolean;
  notes: string;
}

export interface QuestionnaireItem {
  q: string;
  a: string;
}

export interface ElectionCandidate {
  id: string;
  raceId: string;
  fullName: string;
  isIncumbent: boolean;
  status: 'filed' | 'declared' | 'rumored' | 'withdrawn';
  websiteUrl: string | null;
  bioSummary: string;
  questionnaireStatus: 'published' | 'received' | 'requested' | 'not_requested';
  questionnaire: QuestionnaireItem[];
  credibleChallengerFlag: boolean;
}

export interface FinanceSnapshot {
  id: string;
  candidateId: string;
  periodEnd: string;
  totalRaised: number;
  totalSpent: number;
  cashOnHand: number;
  debt: number;
  sourceId: string;
}

export interface Endorsement {
  id: string;
  candidateId: string;
  endorserName: string;
  endorserType: 'org' | 'pac' | 'individual' | 'official';
  date: string;
  stance: 'endorses' | 'opposes' | 'neutral';
  sourceId: string;
}

export interface ElectionEvent {
  id: string;
  raceId: string;
  type: 'poll_release' | 'endorsement' | 'major_spend' | 'scandal' | 'debate' | 'filing' | 'other';
  severity: 'info' | 'warning' | 'critical' | 'positive';
  date: string;
  title: string;
  description: string;
  sourceId: string;
}

export interface PolicyIssue {
  id: string;
  name: string;
  sensitivity: 'high' | 'medium' | 'low';
}

export interface LinkedBill {
  id: string;
  number: string;
  title: string;
  stance: 'support' | 'oppose' | 'monitor';
  sensitivity: 'high' | 'medium' | 'low';
}

export interface LinkedPolicy {
  issues: PolicyIssue[];
  bills: LinkedBill[];
}

export interface Opportunity {
  id: string;
  type: 'meeting_request' | 'sponsor_push' | 'narrative_counter' | 'coalition_validator' | 'risk_hedge' | 'timing_window' | 'coalition_leverage';
  title: string;
  summary: string;
  urgencyDays: number;
  expectedImpact: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  playbookKey: string;
  status: 'new' | 'active' | 'snoozed' | 'dismissed' | 'converted';
}

export interface Playbook {
  key: string;
  name: string;
  steps: string[];
}

export interface Source {
  id: string;
  title: string;
  type: 'finance_report' | 'news' | 'official' | 'internal_note';
  url: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export interface MockElectionIntel {
  legislator: ElectionLegislator;
  electionProfile: ElectionProfile;
  races: ElectionRace[];
  candidates: ElectionCandidate[];
  financeSnapshots: FinanceSnapshot[];
  endorsements: Endorsement[];
  events: ElectionEvent[];
  linkedPolicy: LinkedPolicy;
  opportunities: Opportunity[];
  playbooks: Playbook[];
  sources: Source[];
  team: TeamMember[];
}

export const mockElectionIntel: MockElectionIntel = {
  legislator: {
    id: "leg-az-012",
    name: "Sen. Alex Martinez",
    chamber: "Senate",
    district: "SD-12",
    party: "R",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    roles: ["Committee Vice Chair", "Majority Caucus"],
    contact: { office: "Capitol 3rd Floor", phone: "(602) 555-0182", email: "amartinez@leg.gov" }
  },

  electionProfile: {
    nextElectionDate: "2026-11-03",
    termLimited: false,
    ambitionFlag: "higher_office",
    vulnerability: { score: 67, trend: "worsening", confidence: 72 },
    manualOverride: { enabled: false, score: 67, notes: "" },
    drivers: [
      { driver: "Tossup general environment", impact: "high", explanation: "Recent indicators show tighter margins than last cycle." },
      { driver: "Fundraising gap vs top challenger", impact: "high", explanation: "Cash-on-hand is trending behind the challenger." },
      { driver: "Narrative heat rising", impact: "medium", explanation: "More critical coverage events in the last 30 days." },
      { driver: "Primary threat credible", impact: "medium", explanation: "A challenger with establishment validators has entered." },
      { driver: "High-visibility votes upcoming", impact: "medium", explanation: "Two salient bills likely to attract local press." }
    ]
  },

  races: [
    {
      id: "race-prim-012",
      stage: "primary",
      electionDate: "2026-08-04",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-07-02",
      officeName: "State Senate District 12",
      competitiveness: { rating: "lean", trend: "worsening" },
      isIncumbentRunning: true,
      notes: "Primary challenger emerged with local endorsements."
    },
    {
      id: "race-gen-012",
      stage: "general",
      electionDate: "2026-11-03",
      filingDeadline: "2026-04-10",
      earlyVotingStart: "2026-10-01",
      officeName: "State Senate District 12",
      competitiveness: { rating: "tossup", trend: "worsening" },
      isIncumbentRunning: true,
      notes: "General appears tighter than last cycle; outside groups sniffing around."
    }
  ],

  candidates: [
    {
      id: "cand-inc-012",
      raceId: "race-gen-012",
      fullName: "Alex Martinez",
      isIncumbent: true,
      status: "filed",
      websiteUrl: "https://example.com/martinez",
      bioSummary: "Incumbent senator focused on infrastructure, business climate, and public safety.",
      questionnaireStatus: "published",
      questionnaire: [
        { q: "Top 3 priorities?", a: "Economic development, water reliability, workforce training." },
        { q: "What would you compromise on?", a: "Implementation details, not outcomes." },
        { q: "What won’t you compromise on?", a: "Public safety and fiscal guardrails." }
      ],
      credibleChallengerFlag: false
    },
    {
      id: "cand-chal-1",
      raceId: "race-prim-012",
      fullName: "Jordan Pierce",
      isIncumbent: false,
      status: "declared",
      websiteUrl: "https://example.com/pierce",
      bioSummary: "Former city council member positioning as a reform conservative.",
      questionnaireStatus: "received",
      questionnaire: [
        { q: "Why are you running?", a: "To bring transparency and results to the district." },
        { q: "Top issue?", a: "Cost of living and government accountability." }
      ],
      credibleChallengerFlag: true
    },
    {
      id: "cand-chal-2",
      raceId: "race-gen-012",
      fullName: "Taylor Nguyen",
      isIncumbent: false,
      status: "declared",
      websiteUrl: "https://example.com/nguyen",
      bioSummary: "Business leader with a bipartisan brand; strong education messaging.",
      questionnaireStatus: "requested",
      questionnaire: [],
      credibleChallengerFlag: true
    },
    {
      id: "cand-chal-3",
      raceId: "race-gen-012",
      fullName: "Casey Rios",
      isIncumbent: false,
      status: "rumored",
      websiteUrl: null,
      bioSummary: "Community organizer with potential grassroots support.",
      questionnaireStatus: "not_requested",
      questionnaire: [],
      credibleChallengerFlag: false
    }
  ],

  financeSnapshots: [
    // Candidate finance: time series
    { id: "fin-1", candidateId: "cand-inc-012", periodEnd: "2025-12-31", totalRaised: 180000, totalSpent: 120000, cashOnHand: 95000, debt: 0, sourceId: "src-2" },
    { id: "fin-2", candidateId: "cand-inc-012", periodEnd: "2026-03-31", totalRaised: 90000, totalSpent: 110000, cashOnHand: 65000, debt: 15000, sourceId: "src-3" },
    { id: "fin-3", candidateId: "cand-chal-2", periodEnd: "2025-12-31", totalRaised: 210000, totalSpent: 80000, cashOnHand: 140000, debt: 0, sourceId: "src-4" },
    { id: "fin-4", candidateId: "cand-chal-2", periodEnd: "2026-03-31", totalRaised: 120000, totalSpent: 90000, cashOnHand: 170000, debt: 0, sourceId: "src-5" }
  ],

  endorsements: [
    { id: "end-1", candidateId: "cand-inc-012", endorserName: "Regional Builders Association", endorserType: "org", date: "2026-01-18", stance: "endorses", sourceId: "src-6" },
    { id: "end-2", candidateId: "cand-chal-2", endorserName: "Education Leaders PAC", endorserType: "pac", date: "2026-02-02", stance: "endorses", sourceId: "src-7" },
    { id: "end-3", candidateId: "cand-chal-1", endorserName: "Former Mayor (Name)", endorserType: "individual", date: "2026-02-10", stance: "endorses", sourceId: "src-8" },
    { id: "end-4", candidateId: "cand-inc-012", endorserName: "Public Safety Coalition", endorserType: "org", date: "2026-03-05", stance: "endorses", sourceId: "src-9" }
  ],

  events: [
    { id: "evt-1", raceId: "race-gen-012", type: "poll_release", severity: "warning", date: "2026-02-14", title: "Internal poll shows tightening margin", description: "Topline within MOE; undecideds high.", sourceId: "src-10" },
    { id: "evt-2", raceId: "race-prim-012", type: "endorsement", severity: "info", date: "2026-02-10", title: "Notable endorsement for challenger", description: "Signals credible lane in the primary.", sourceId: "src-8" },
    { id: "evt-3", raceId: "race-gen-012", type: "major_spend", severity: "warning", date: "2026-03-01", title: "Outside group ad buy rumored", description: "Potential narrative framing risk.", sourceId: "src-11" },
    { id: "evt-4", raceId: "race-gen-012", type: "scandal", severity: "critical", date: "2026-03-12", title: "Negative story begins circulating", description: "Local coverage spike; fact pattern unclear.", sourceId: "src-12" },
    { id: "evt-5", raceId: "race-gen-012", type: "debate", severity: "info", date: "2026-09-22", title: "First district debate scheduled", description: "Prep needed; question themes likely education + cost of living.", sourceId: "src-13" }
  ],

  linkedPolicy: {
    issues: [
      { id: "iss-1", name: "Water Reliability", sensitivity: "high" },
      { id: "iss-2", name: "Education Funding", sensitivity: "high" },
      { id: "iss-3", name: "Small Business Tax Credits", sensitivity: "medium" }
    ],
    bills: [
      { id: "bill-101", number: "SB 1432", title: "Water Infrastructure Acceleration", stance: "monitor", sensitivity: "high" },
      { id: "bill-102", number: "HB 2210", title: "Education Transparency & Outcomes", stance: "support", sensitivity: "high" },
      { id: "bill-103", number: "SB 1601", title: "Regulatory Fee Adjustments", stance: "oppose", sensitivity: "medium" }
    ]
  },

  opportunities: [
    {
      id: "opp-1",
      type: "risk_hedge",
      title: "Risk hedge: move sensitive outreach to private channel",
      summary: "Vulnerability rising + narrative heat spike. Recommend private staff meeting and neutral framing.",
      urgencyDays: 10,
      expectedImpact: "high",
      confidence: 74,
      evidence: ["evt-4", "evt-1"],
      playbookKey: "risk_hedge_quiet_diplomacy",
      status: "new"
    },
    {
      id: "opp-2",
      type: "coalition_leverage",
      title: "Coalition validator: local business voice needed",
      summary: "Opposition framing may stick. Add validator endorsement from trusted local org.",
      urgencyDays: 21,
      expectedImpact: "medium",
      confidence: 62,
      evidence: ["end-1", "evt-3"],
      playbookKey: "coalition_validator_outreach",
      status: "new"
    },
    {
      id: "opp-3",
      type: "meeting_request",
      title: "Meeting request: staff alignment before debate season",
      summary: "Debate scheduled; align on safe messaging lanes now.",
      urgencyDays: 30,
      expectedImpact: "medium",
      confidence: 58,
      evidence: ["evt-5"],
      playbookKey: "persuasion_meeting_plan",
      status: "active"
    }
  ],

  playbooks: [
    {
      key: "persuasion_meeting_plan",
      name: "Persuasion Meeting Plan",
      steps: [
        "Create meeting brief record",
        "Assign outreach lead",
        "Draft 1-pager tailored to incentive lens",
        "Schedule prep block",
        "Schedule staff meeting",
        "Post summary to chat thread",
        "Create follow-up tasks"
      ]
    },
    {
      key: "risk_hedge_quiet_diplomacy",
      name: "Risk Hedge (Quiet Diplomacy)",
      steps: [
        "Create risk memo record",
        "Draft neutral framing points",
        "Schedule private staff meeting",
        "Prepare validator list",
        "Create monitoring alerts",
        "Generate client-facing update draft"
      ]
    },
    {
      key: "coalition_validator_outreach",
      name: "Coalition Validator Outreach",
      steps: [
        "Build validator target list",
        "Assign outreach tasks",
        "Draft outreach email",
        "Log responses",
        "Update narrative kit",
        "Schedule coalition call"
      ]
    }
  ],

  sources: [
    { id: "src-2", title: "Campaign finance report Q4 2025 (incumbent)", type: "finance_report", url: "https://example.com/finance-q4-inc" },
    { id: "src-3", title: "Campaign finance report Q1 2026 (incumbent)", type: "finance_report", url: "https://example.com/finance-q1-inc" },
    { id: "src-4", title: "Campaign finance report Q4 2025 (Nguyen)", type: "finance_report", url: "https://example.com/finance-q4-nguyen" },
    { id: "src-5", title: "Campaign finance report Q1 2026 (Nguyen)", type: "finance_report", url: "https://example.com/finance-q1-nguyen" },
    { id: "src-6", title: "Endorsement press release — Regional Builders Association", type: "news", url: "https://example.com/endorsement-builders" },
    { id: "src-7", title: "PAC endorsement memo — Education Leaders PAC", type: "news", url: "https://example.com/endorsement-elpac" },
    { id: "src-8", title: "Local coverage — Former Mayor backs Pierce", type: "news", url: "https://example.com/mayor-backs-pierce" },
    { id: "src-9", title: "Coalition statement — Public Safety Coalition", type: "news", url: "https://example.com/psc-statement" },
    { id: "src-10", title: "Internal poll topline (summary)", type: "internal_note", url: null },
    { id: "src-11", title: "Media report — outside spend expected", type: "news", url: "https://example.com/outside-spend" },
    { id: "src-12", title: "Media report — negative story circulating", type: "news", url: "https://example.com/negative-story" },
    { id: "src-13", title: "Debate announcement", type: "official", url: "https://example.com/debate" }
  ],

  team: [
    { id: "u-1", name: "Jordan (Account Lead)", role: "Manager" },
    { id: "u-2", name: "Sam (Policy)", role: "Staff" },
    { id: "u-3", name: "Riley (Comms)", role: "Staff" }
  ]
};
