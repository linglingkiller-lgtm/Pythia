export type Stance =
  | "Strong Support"
  | "Lean Support"
  | "Mixed/Unclear"
  | "Lean Oppose"
  | "Strong Oppose";

export type EvidenceVote = {
  label: string;
  date: string; // YYYY-MM-DD
  vote: "Yea" | "Nay" | "Absent";
  weight: "high" | "med" | "low";
  tags: string[];
  why_it_matters: string;
};

export type SubIssue = {
  name: string;
  stance: Stance;
  confidence: number; // 0-100
  summary: string;
  evidence: EvidenceVote[];
};

export type Issue = {
  issue: string;
  stance: Stance;
  confidence: number;
  salience: number;
  related?: string[]; // for constellation links
  subissues: SubIssue[];
};

export type LegislatorPredictiveProfile = {
  id: string;
  name: string;
  title: string;
  chamber: "House" | "Senate";
  district: string;
  tags: string[];
  lastContact?: string | null;
  photoUrl?: string; // optional
  issueProfile: Issue[];
};

export const legislatorPredictiveInsightsDemo: {
  meta: { disclaimer: string };
  legislators: LegislatorPredictiveProfile[];
} = {
  meta: {
    disclaimer:
      "DEMO DATA ONLY. Predictions are illustrative and not based on live legislative records. Replace with real vote data/model outputs later."
  },
  legislators: [
    {
      id: "leg-az-001", // Steve Montenegro
      name: "Steve Montenegro",
      title: "Speaker of the House",
      chamber: "House",
      district: "LD-29",
      tags: ["Priority A", "Warm"],
      lastContact: "2025-12-10",
      issueProfile: [
        {
          issue: "Education",
          stance: "Strong Support",
          confidence: 88,
          salience: 92,
          related: ["Taxes & Budget", "Elections"],
          subissues: [
            {
              name: "ESAs / School Choice",
              stance: "Strong Support",
              confidence: 90,
              summary:
                "Consistent support for ESA-style mechanisms and expanding school choice pathways.",
              evidence: [
                {
                  label: "HB 2311 – ESA Expansion",
                  date: "2025-03-18",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Education", "School Choice", "ESAs"],
                  why_it_matters:
                    "Direct expansion vote; high signal for school choice posture."
                },
                {
                  label: "HB 2204 – Charter Growth Framework",
                  date: "2025-02-11",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Education", "Charters"],
                  why_it_matters:
                    "Supports non-district options; reinforces choice alignment."
                }
              ]
            },
            {
              name: "Teacher Pay",
              stance: "Mixed/Unclear",
              confidence: 62,
              summary:
                "Signals suggest preference for targeted/structured increases rather than broad raises.",
              evidence: [
                {
                  label: "HB 2140 – Teacher Pay Increase (Broad)",
                  date: "2025-01-29",
                  vote: "Nay",
                  weight: "med",
                  tags: ["Education", "Teacher Pay"],
                  why_it_matters:
                    "Opposition to broad raise suggests fiscal or design constraints."
                },
                {
                  label: "HB 2402 – Targeted Pay Incentives",
                  date: "2025-04-09",
                  vote: "Yea",
                  weight: "low",
                  tags: ["Education", "Teacher Pay"],
                  why_it_matters:
                    "Support for structured incentives indicates nuance."
                }
              ]
            }
          ]
        },
        {
          issue: "Border Security",
          stance: "Strong Support",
          confidence: 85,
          salience: 86,
          related: ["Law Enforcement", "Elections"],
          subissues: [
            {
              name: "State Enforcement",
              stance: "Strong Support",
              confidence: 87,
              summary:
                "Supports increasing state enforcement capacity and operational funding.",
              evidence: [
                {
                  label: "HB 2010 – Border Operations Funding",
                  date: "2025-02-21",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Border", "Funding", "Law Enforcement"],
                  why_it_matters:
                    "Operational funding is high-salience and high signal."
                }
              ]
            }
          ]
        },
        {
          issue: "Gun Policy",
          stance: "Lean Support",
          confidence: 72,
          salience: 65,
          related: ["Law Enforcement"],
          subissues: [
            {
              name: "Permitless Carry",
              stance: "Lean Support",
              confidence: 70,
              summary:
                "Generally aligned with expanded carry rights; occasional procedural caution.",
              evidence: [
                {
                  label: "HB 2099 – Carry Simplification",
                  date: "2025-03-03",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Guns", "Public Safety"],
                  why_it_matters:
                    "Supports fewer restrictions on legal carry mechanics."
                }
              ]
            }
          ]
        },
        {
          issue: "Taxes & Budget",
          stance: "Lean Support",
          confidence: 68,
          salience: 58,
          related: ["Education"],
          subissues: [
            {
              name: "Spending Restraint",
              stance: "Lean Support",
              confidence: 66,
              summary:
                "Supports restraint frameworks; evidence limited in this demo dataset.",
              evidence: [
                {
                  label: "HB 2330 – Budget Growth Limit",
                  date: "2025-03-27",
                  vote: "Yea",
                  weight: "low",
                  tags: ["Budget", "Rules"],
                  why_it_matters:
                    "Low-weight but aligned signal for predictable spending growth."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "leg-az-002", // Michael Carbone
      name: "Michael Carbone",
      title: "House Majority Leader",
      chamber: "House",
      district: "LD-25",
      tags: ["Priority A", "Warm"],
      lastContact: "2025-12-14",
      issueProfile: [
        {
          issue: "Taxes & Budget",
          stance: "Strong Support",
          confidence: 84,
          salience: 90,
          related: ["Energy", "Education"],
          subissues: [
            {
              name: "Tax Cuts",
              stance: "Strong Support",
              confidence: 86,
              summary: "Reliable support for rate reductions and broad relief packages.",
              evidence: [
                {
                  label: "HB 2101 – Income Tax Rate Reduction",
                  date: "2025-02-05",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Taxes", "Budget"],
                  why_it_matters:
                    "High-impact fiscal vote; strong direction signal."
                }
              ]
            },
            {
              name: "Spending Caps",
              stance: "Lean Support",
              confidence: 74,
              summary:
                "Supports restraint frameworks; pragmatic on carve-outs.",
              evidence: [
                {
                  label: "HB 2330 – Budget Growth Limit",
                  date: "2025-03-27",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Budget", "Rules"],
                  why_it_matters: "Consistent with a restraint posture."
                }
              ]
            }
          ]
        },
        {
          issue: "Energy",
          stance: "Lean Support",
          confidence: 68,
          salience: 62,
          related: ["Taxes & Budget"],
          subissues: [
            {
              name: "Grid Modernization",
              stance: "Lean Support",
              confidence: 70,
              summary:
                "Support increases when framed as reliability and cost stability.",
              evidence: [
                {
                  label: "HB 2250 – Grid Reliability Package",
                  date: "2025-04-02",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Energy", "Infrastructure"],
                  why_it_matters:
                    "Reliability framing aligns with support despite mixed coalition."
                }
              ]
            }
          ]
        },
        {
          issue: "Education",
          stance: "Lean Support",
          confidence: 71,
          salience: 66,
          related: ["Taxes & Budget"],
          subissues: [
            {
              name: "ESAs / School Choice",
              stance: "Lean Support",
              confidence: 73,
              summary:
                "Supportive, but secondary priority to fiscal agenda.",
              evidence: [
                {
                  label: "HB 2311 – ESA Expansion",
                  date: "2025-03-18",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Education", "ESAs"],
                  why_it_matters:
                    "Supportive vote; salience lower than primary fiscal profile."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "leg-az-003", // Oscar De Los Santos
      name: "Oscar De Los Santos",
      title: "House Minority Leader",
      chamber: "House",
      district: "LD-16",
      tags: ["Priority A", "Warm"],
      lastContact: "2025-12-16",
      issueProfile: [
        {
          issue: "Healthcare",
          stance: "Strong Support",
          confidence: 86,
          salience: 88,
          related: ["Abortion Policy", "Education"],
          subissues: [
            {
              name: "Coverage Expansion",
              stance: "Strong Support",
              confidence: 88,
              summary:
                "Consistent support for expanding eligibility and access.",
              evidence: [
                {
                  label: "HB 2188 – Coverage Expansion Pilot",
                  date: "2025-02-14",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Healthcare", "Coverage"],
                  why_it_matters:
                    "Direct access-oriented policy signal."
                }
              ]
            }
          ]
        },
        {
          issue: "Education",
          stance: "Lean Oppose",
          confidence: 74,
          salience: 70,
          related: ["Healthcare"],
          subissues: [
            {
              name: "ESAs / School Choice",
              stance: "Strong Oppose",
              confidence: 82,
              summary:
                "Opposes ESA expansion framing; preference for public-system funding.",
              evidence: [
                {
                  label: "HB 2311 – ESA Expansion",
                  date: "2025-03-18",
                  vote: "Nay",
                  weight: "high",
                  tags: ["Education", "ESAs"],
                  why_it_matters:
                    "High-weight opposition is a strong stance signal."
                }
              ]
            }
          ]
        },
        {
          issue: "Abortion Policy",
          stance: "Lean Support",
          confidence: 69,
          salience: 64,
          related: ["Healthcare"],
          subissues: [
            {
              name: "Access Protections",
              stance: "Lean Support",
              confidence: 70,
              summary:
                "Supports access protections with some tactical variance.",
              evidence: [
                {
                  label: "HB 2222 – Access Safeguards",
                  date: "2025-04-10",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Abortion", "Healthcare"],
                  why_it_matters:
                    "Access-protection vote supports predicted direction."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "leg-az-004", // John Kavanagh
      name: "John Kavanagh",
      title: "Senate Majority Leader",
      chamber: "Senate",
      district: "LD-3",
      tags: ["Priority A", "Follow-up"],
      lastContact: "2025-11-20",
      issueProfile: [
        {
          issue: "Border Security",
          stance: "Strong Support",
          confidence: 90,
          salience: 92,
          related: ["Gun Policy", "Elections"],
          subissues: [
            {
              name: "State Enforcement",
              stance: "Strong Support",
              confidence: 92,
              summary:
                "Repeated support for enforcement and funding measures.",
              evidence: [
                {
                  label: "SB 1100 – Border Enforcement Authority",
                  date: "2025-02-07",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Border", "Law Enforcement"],
                  why_it_matters:
                    "High-impact enforcement authority expansion."
                },
                {
                  label: "SB 1142 – Operational Funding Increase",
                  date: "2025-03-22",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Border", "Budget"],
                  why_it_matters:
                    "Reinforces priority via budget allocation vote."
                }
              ]
            }
          ]
        },
        {
          issue: "Gun Policy",
          stance: "Strong Support",
          confidence: 85,
          salience: 78,
          related: ["Border Security"],
          subissues: [
            {
              name: "Second Amendment Protections",
              stance: "Strong Support",
              confidence: 86,
              summary: "Consistent expansion/protection voting pattern.",
              evidence: [
                {
                  label: "SB 1201 – Firearm Preemption Strengthening",
                  date: "2025-04-01",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Guns", "Local Control"],
                  why_it_matters:
                    "Supports limiting local restrictions; strong directional signal."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "leg-az-005", // Priya Sundaresan
      name: "Priya Sundaresan",
      title: "Senate Minority Leader",
      chamber: "Senate",
      district: "LD-18",
      tags: ["Priority A", "Warm"],
      lastContact: "2025-12-15",
      issueProfile: [
        {
          issue: "Education",
          stance: "Lean Support",
          confidence: 76,
          salience: 84,
          related: ["Healthcare"],
          subissues: [
            {
              name: "Teacher Pay",
              stance: "Strong Support",
              confidence: 82,
              summary: "Strong support for broad compensation measures.",
              evidence: [
                {
                  label: "SB 1302 – Teacher Pay Increase",
                  date: "2025-02-26",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Education", "Teacher Pay"],
                  why_it_matters:
                    "High-weight vote consistent with education investment posture."
                }
              ]
            },
            {
              name: "ESAs / School Choice",
              stance: "Lean Oppose",
              confidence: 73,
              summary:
                "Skeptical of expansion; preference for public-system funding.",
              evidence: [
                {
                  label: "HB 2311 – ESA Expansion",
                  date: "2025-03-18",
                  vote: "Nay",
                  weight: "med",
                  tags: ["Education", "ESAs"],
                  why_it_matters:
                    "Opposition vote suggests preference against ESA expansion framing."
                }
              ]
            }
          ]
        },
        {
          issue: "Healthcare",
          stance: "Strong Support",
          confidence: 84,
          salience: 76,
          related: ["Education"],
          subissues: [
            {
              name: "Coverage Expansion",
              stance: "Strong Support",
              confidence: 85,
              summary:
                "Consistent support for access/coverage expansion initiatives.",
              evidence: [
                {
                  label: "SB 1401 – Coverage Expansion Framework",
                  date: "2025-04-06",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Healthcare", "Coverage"],
                  why_it_matters:
                    "Direct signal toward expanding eligibility or support structures."
                }
              ]
            }
          ]
        }
      ]
    },

    {
      id: "leg-az-006", // Warren Petersen
      name: "Warren Petersen",
      title: "President of the Senate",
      chamber: "Senate",
      district: "LD-1",
      tags: [],
      lastContact: null,
      issueProfile: [
        {
          issue: "Taxes & Budget",
          stance: "Strong Support",
          confidence: 87,
          salience: 90,
          related: ["Elections", "Energy"],
          subissues: [
            {
              name: "Tax Relief",
              stance: "Strong Support",
              confidence: 88,
              summary: "High confidence support for broad relief initiatives.",
              evidence: [
                {
                  label: "SB 1005 – Tax Relief Package",
                  date: "2025-01-30",
                  vote: "Yea",
                  weight: "high",
                  tags: ["Taxes", "Budget"],
                  why_it_matters:
                    "High-impact tax vote; strong directional evidence."
                }
              ]
            }
          ]
        },
        {
          issue: "Elections",
          stance: "Lean Support",
          confidence: 70,
          salience: 66,
          related: ["Border Security", "Taxes & Budget"],
          subissues: [
            {
              name: "Election Integrity Rules",
              stance: "Lean Support",
              confidence: 71,
              summary:
                "Supports tighter procedural frameworks; confidence moderate due to limited signals.",
              evidence: [
                {
                  label: "SB 1050 – Ballot Process Standards",
                  date: "2025-03-12",
                  vote: "Yea",
                  weight: "med",
                  tags: ["Elections", "Rules"],
                  why_it_matters:
                    "Procedural vote suggests preference for standardized controls."
                }
              ]
            }
          ]
        },
        {
          issue: "Energy",
          stance: "Mixed/Unclear",
          confidence: 58,
          salience: 54,
          related: ["Taxes & Budget"],
          subissues: [
            {
              name: "Renewables Targets",
              stance: "Mixed/Unclear",
              confidence: 55,
              summary:
                "Signals are limited; keep stance neutral until more evidence.",
              evidence: [
                {
                  label: "SB 1500 – Energy Portfolio Study",
                  date: "2025-04-12",
                  vote: "Yea",
                  weight: "low",
                  tags: ["Energy"],
                  why_it_matters:
                    "Study votes are low signal; avoid overconfident stance."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};