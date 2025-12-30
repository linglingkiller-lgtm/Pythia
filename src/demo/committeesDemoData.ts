// Committees Demo Data for Revere Platform
// Demo-only mock data for committees feature

export interface CommitteeMember {
  legislatorId: string;
  legislatorName: string;
  chamber: 'House' | 'Senate';
  party: 'R' | 'D';
  district: string;
  photoUrl?: string;
  roleInCommittee: 'Chair' | 'Vice Chair' | 'Member';
  priorityTag?: string;
  relationshipStatus: 'warm' | 'cold' | 'needs-follow-up';
}

export interface PredictedFocus {
  topic: string;
  confidence: number;
  summary: string;
  evidenceSignals: string[];
}

export interface MonthlyForecast {
  month: string;
  themes: string[];
  note: string;
}

export interface MediaIntel {
  id: string;
  headline: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  snippet: string;
}

export interface BillInPipeline {
  billId: string;
  billNumber: string;
  title: string;
  stage: 'Drafting' | 'Introduced' | 'In Committee' | 'Likely Hearing' | 'Advancing';
  issueTags: string[];
  committeeNotes: string;
  sponsor?: string;
  confidence?: number;
}

export interface Committee {
  id: string;
  name: string;
  chamber: 'House' | 'Senate' | 'Joint';
  description: string;
  chairId: string;
  viceChairId: string;
  members: CommitteeMember[];
  tags: string[];
  activityScore: number;
  predictedFocus: PredictedFocus[];
  nextMeeting: string;
  monthlyForecast: MonthlyForecast[];
  mediaIntel: MediaIntel[];
  billsPipeline: BillInPipeline[];
}

export const committeesDemoData: Committee[] = [
  {
    id: 'house-appropriations',
    name: 'House Appropriations Committee',
    chamber: 'House',
    description: 'Responsible for state budget allocation, fiscal policy, and oversight of state spending across all departments and agencies.',
    chairId: 'steve-montenegro',
    viceChairId: 'michael-carbone',
    members: [
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Leadership',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Vice Chair',
        priorityTag: 'Budget Lead',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Ranking Member',
        relationshipStatus: 'needs-follow-up'
      }
    ],
    tags: ['Budget', 'Fiscal Policy', 'State Spending'],
    activityScore: 95,
    predictedFocus: [
      {
        topic: 'Education Funding',
        confidence: 92,
        summary: 'Major budget debates expected around K-12 funding formulas and teacher pay increases.',
        evidenceSignals: [
          'HB 2801 - Education Funding Reform introduced',
          'Governor\'s budget proposal prioritizes education',
          'Chair Montenegro recent statements on education investment',
          '3 stakeholder meetings scheduled with education groups'
        ]
      },
      {
        topic: 'Healthcare Budget Allocation',
        confidence: 88,
        summary: 'AHCCCS expansion and rural healthcare infrastructure likely focal points.',
        evidenceSignals: [
          'Federal matching funds available for Medicaid expansion',
          'Rural hospital closures driving urgency',
          'Bipartisan interest signals from members',
          'Healthcare lobby active outreach'
        ]
      },
      {
        topic: 'Water Infrastructure Investment',
        confidence: 85,
        summary: 'Colorado River shortage driving major infrastructure appropriations.',
        evidenceSignals: [
          'Emergency drought declarations in 4 counties',
          'Federal infrastructure bill matching opportunities',
          'Cross-party support for water projects',
          'Multiple water bills awaiting funding'
        ]
      },
      {
        topic: 'Tax Reform & Revenue',
        confidence: 78,
        summary: 'Discussions on tax credits, business incentives, and revenue forecasting.',
        evidenceSignals: [
          'Economic downturn affecting revenue projections',
          'Business community pushing for incentives',
          'Conservative members seeking tax cuts',
          'JLBC reports showing revenue concerns'
        ]
      },
      {
        topic: 'Public Safety Funding',
        confidence: 72,
        summary: 'Border security and law enforcement funding expected to be contentious.',
        evidenceSignals: [
          'Border crisis rhetoric from leadership',
          'Law enforcement unions lobbying hard',
          'DPS requesting budget increase',
          'Competing priorities with other agencies'
        ]
      }
    ],
    nextMeeting: '2025-01-15T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Budget overview hearings', 'Agency presentations', 'Revenue forecasts'],
        note: 'Foundation month - agency heads present budget requests'
      },
      {
        month: 'February 2025',
        themes: ['Education funding debates', 'Healthcare allocation', 'Committee markups begin'],
        note: 'Heavy negotiation period on top priorities'
      },
      {
        month: 'March 2025',
        themes: ['Final appropriations bills', 'Conference committees', 'Budget reconciliation'],
        note: 'Crunch time - final deals and compromises'
      },
      {
        month: 'April 2025',
        themes: ['Budget passage', 'Supplemental appropriations', 'Cleanup bills'],
        note: 'Finishing touches and addressing gaps'
      }
    ],
    mediaIntel: [
      {
        id: 'media-1',
        headline: 'House Appropriations Chair Signals Education as Top Budget Priority',
        source: 'Arizona Capitol Times',
        sentiment: 'positive',
        date: '2024-12-20',
        snippet: 'Speaker Montenegro, chairing Appropriations, indicated education funding will lead budget discussions in the upcoming session.'
      },
      {
        id: 'media-2',
        headline: 'Budget Showdown Looms Over Healthcare Expansion',
        source: 'Phoenix Business Journal',
        sentiment: 'neutral',
        date: '2024-12-18',
        snippet: 'Appropriations committee members divided on Medicaid expansion funding levels, setting up potential floor fight.'
      },
      {
        id: 'media-3',
        headline: 'Water Crisis Drives Emergency Infrastructure Funding Push',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-15',
        snippet: 'Bipartisan coalition in Appropriations seeks $450M for water infrastructure in response to Colorado River cuts.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2801',
        billNumber: 'HB 2801',
        title: 'Education Funding Reform Act',
        stage: 'In Committee',
        issueTags: ['Education', 'Budget'],
        committeeNotes: 'Hearing scheduled for Jan 22. Strong support from chair.',
        sponsor: 'Montenegro',
        confidence: 85
      },
      {
        billId: 'hb-2802',
        billNumber: 'HB 2802',
        title: 'Rural Healthcare Infrastructure Fund',
        stage: 'Likely Hearing',
        issueTags: ['Healthcare', 'Rural Development'],
        committeeNotes: 'Bipartisan interest. Awaiting cost analysis.',
        sponsor: 'Carbone',
        confidence: 72
      },
      {
        billId: 'hb-2803',
        billNumber: 'HB 2803',
        title: 'Water Infrastructure Emergency Appropriation',
        stage: 'Drafting',
        issueTags: ['Water', 'Infrastructure'],
        committeeNotes: 'Coalition building in progress. Federal match available.',
        confidence: 68
      }
    ]
  },
  {
    id: 'senate-appropriations',
    name: 'Senate Appropriations Committee',
    chamber: 'Senate',
    description: 'Senate counterpart for budget and fiscal policy. Works closely with House Appropriations on final budget reconciliation.',
    chairId: 'warren-petersen',
    viceChairId: 'john-kavanagh',
    members: [
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Leadership',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Vice Chair',
        priorityTag: 'Fiscal Hawk',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Ranking Member',
        relationshipStatus: 'needs-follow-up'
      }
    ],
    tags: ['Budget', 'Fiscal Policy', 'Appropriations'],
    activityScore: 93,
    predictedFocus: [
      {
        topic: 'Tax Policy & Revenue',
        confidence: 90,
        summary: 'Conservative push for tax cuts balanced against revenue needs.',
        evidenceSignals: [
          'Senate leadership prioritizing tax relief',
          'Chair Petersen vocal on reducing tax burden',
          'Revenue shortfall concerns from fiscal staff',
          'Business groups lobbying for incentives'
        ]
      },
      {
        topic: 'Infrastructure Spending',
        confidence: 86,
        summary: 'Transportation and water infrastructure major focal points.',
        evidenceSignals: [
          'Federal infrastructure dollars available',
          'State match requirements driving discussions',
          'Bipartisan support for projects',
          'Multiple infrastructure bills in pipeline'
        ]
      },
      {
        topic: 'Border Security Funding',
        confidence: 82,
        summary: 'Majority pushing for significant border security appropriations.',
        evidenceSignals: [
          'Governor requesting border security funds',
          'Party platform priority',
          'Recent border incidents driving urgency',
          'Federal-state coordination discussions'
        ]
      },
      {
        topic: 'Education Capital Projects',
        confidence: 75,
        summary: 'School construction and facility upgrades expected.',
        evidenceSignals: [
          'Aging school infrastructure reports',
          'Growing student populations in suburbs',
          'School district requests accumulating',
          'Bipartisan support for capital projects'
        ]
      },
      {
        topic: 'Rainy Day Fund Policy',
        confidence: 70,
        summary: 'Debate over budget stabilization fund levels and usage.',
        evidenceSignals: [
          'Economic uncertainty driving caution',
          'Conservative members want preservation',
          'Progressive members want strategic use',
          'JLBC providing analysis and recommendations'
        ]
      }
    ],
    nextMeeting: '2025-01-16T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Revenue forecasting', 'Tax policy discussions', 'Budget framework'],
        note: 'Setting fiscal parameters for session'
      },
      {
        month: 'February 2025',
        themes: ['Infrastructure priorities', 'Border security funding', 'Committee votes'],
        note: 'Major policy battles and allocations'
      },
      {
        month: 'March 2025',
        themes: ['Conference negotiations', 'House reconciliation', 'Final budget'],
        note: 'Working with House to finalize budget'
      }
    ],
    mediaIntel: [
      {
        id: 'media-4',
        headline: 'Senate Budget Chair Calls for Conservative Fiscal Approach',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-21',
        snippet: 'Warren Petersen outlined priorities emphasizing tax cuts and fiscal restraint ahead of budget season.'
      },
      {
        id: 'media-5',
        headline: 'Infrastructure Push Gains Bipartisan Support in Senate',
        source: 'Arizona Republic',
        sentiment: 'positive',
        date: '2024-12-19',
        snippet: 'Senate Appropriations members from both parties rally around infrastructure investments using federal matching funds.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-1401',
        billNumber: 'SB 1401',
        title: 'Tax Relief and Economic Growth Act',
        stage: 'Introduced',
        issueTags: ['Tax Policy', 'Economic Development'],
        committeeNotes: 'Leadership priority. Fast-track expected.',
        sponsor: 'Petersen',
        confidence: 88
      },
      {
        billId: 'sb-1402',
        billNumber: 'SB 1402',
        title: 'Border Security Appropriation',
        stage: 'Likely Hearing',
        issueTags: ['Public Safety', 'Border Security'],
        committeeNotes: 'Contentious. Party-line likely.',
        sponsor: 'Kavanagh',
        confidence: 75
      }
    ]
  },
  {
    id: 'house-education',
    name: 'House Education Committee',
    chamber: 'House',
    description: 'Jurisdiction over K-12 education policy, school choice, teacher certification, curriculum standards, and education funding mechanisms.',
    chairId: 'michael-carbone',
    viceChairId: 'steve-montenegro',
    members: [
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Education Focus',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Ranking Member',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Education', 'K-12', 'School Choice'],
    activityScore: 88,
    predictedFocus: [
      {
        topic: 'School Choice Expansion',
        confidence: 94,
        summary: 'ESA expansion and charter school policy expected to dominate.',
        evidenceSignals: [
          'Leadership priority per party platform',
          'Multiple school choice bills pre-filed',
          'Education advocacy groups highly active',
          'Chair Carbone stated priority in pre-session'
        ]
      },
      {
        topic: 'Teacher Pay & Retention',
        confidence: 87,
        summary: 'Bipartisan concern over teacher shortage and compensation.',
        evidenceSignals: [
          'Teacher shortage reaching crisis levels',
          'Public pressure for pay increases',
          'Competing proposals from both parties',
          'Budget implications being negotiated'
        ]
      },
      {
        topic: 'Curriculum & Parental Rights',
        confidence: 82,
        summary: 'Cultural issues around curriculum transparency and parental control.',
        evidenceSignals: [
          'National trend influencing local policy',
          'Conservative groups pushing legislation',
          'School board controversies statewide',
          'Media attention on education culture wars'
        ]
      },
      {
        topic: 'School Safety & Security',
        confidence: 76,
        summary: 'Post-pandemic security concerns and mental health resources.',
        evidenceSignals: [
          'School safety incidents driving urgency',
          'Bipartisan support for security funding',
          'Mental health integration discussions',
          'Law enforcement coordination proposals'
        ]
      },
      {
        topic: 'Special Education Funding',
        confidence: 68,
        summary: 'Inadequate special ed funding creating pressure for reform.',
        evidenceSignals: [
          'Federal mandates unfunded at state level',
          'Parent advocacy groups active',
          'School districts reporting deficits',
          'Lawsuit threats from advocacy organizations'
        ]
      }
    ],
    nextMeeting: '2025-01-17T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['ESA policy hearings', 'Teacher pay proposals', 'Stakeholder input'],
        note: 'High-profile hearings expected to draw crowds'
      },
      {
        month: 'February 2025',
        themes: ['Curriculum battles', 'School safety legislation', 'Committee votes'],
        note: 'Contentious culture war debates likely'
      },
      {
        month: 'March 2025',
        themes: ['Funding formula changes', 'Charter school policy', 'Final passage push'],
        note: 'Legislative sprint to floor'
      }
    ],
    mediaIntel: [
      {
        id: 'media-6',
        headline: 'House Education Chair Vows School Choice Expansion',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-22',
        snippet: 'Rep. Carbone promises aggressive push for ESA expansion and charter school deregulation this session.'
      },
      {
        id: 'media-7',
        headline: 'Teacher Unions Rally for Pay Increases Ahead of Session',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-20',
        snippet: 'Educators demand minimum $50K starting salary, putting pressure on Education Committee.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2101',
        billNumber: 'HB 2101',
        title: 'Empowerment Scholarship Account Expansion Act',
        stage: 'In Committee',
        issueTags: ['Education', 'School Choice'],
        committeeNotes: 'Top priority. Hearing Jan 24. Contentious.',
        sponsor: 'Carbone',
        confidence: 90
      },
      {
        billId: 'hb-2102',
        billNumber: 'HB 2102',
        title: 'Teacher Compensation Reform',
        stage: 'Likely Hearing',
        issueTags: ['Education', 'Teacher Pay'],
        committeeNotes: 'Bipartisan interest. Funding source TBD.',
        confidence: 78
      }
    ]
  },
  {
    id: 'senate-judiciary',
    name: 'Senate Judiciary Committee',
    chamber: 'Senate',
    description: 'Criminal justice reform, courts, civil litigation, gun rights, sentencing policy, and constitutional amendments.',
    chairId: 'john-kavanagh',
    viceChairId: 'warren-petersen',
    members: [
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Law & Order',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Criminal Justice Reform',
        relationshipStatus: 'needs-follow-up'
      }
    ],
    tags: ['Judiciary', 'Criminal Justice', 'Constitutional Law'],
    activityScore: 91,
    predictedFocus: [
      {
        topic: 'Criminal Sentencing Reform',
        confidence: 89,
        summary: 'Debate over mandatory minimums and sentencing enhancements.',
        evidenceSignals: [
          'Prison overcrowding creating pressure',
          'Justice reform advocates mobilizing',
          'Conservative tough-on-crime pushback',
          'Fiscal implications of incarceration costs'
        ]
      },
      {
        topic: 'Gun Rights Legislation',
        confidence: 85,
        summary: 'Second Amendment expansions and concealed carry laws.',
        evidenceSignals: [
          'Gun rights groups lobbying heavily',
          'Constitutional carry expansion proposed',
          'National gun rights trends',
          'Chair Kavanagh strong 2A supporter'
        ]
      },
      {
        topic: 'Border Enforcement Authority',
        confidence: 83,
        summary: 'State law enforcement powers at border under consideration.',
        evidenceSignals: [
          'Texas SB4-style proposals circulating',
          'Constitutional questions anticipated',
          'Governor seeking enforcement tools',
          'Federal preemption concerns from Dems'
        ]
      },
      {
        topic: 'Civil Asset Forfeiture Reform',
        confidence: 71,
        summary: 'Bipartisan interest in forfeiture reform due to abuse concerns.',
        evidenceSignals: [
          'Institute for Justice advocacy campaign',
          'Cross-partisan coalition forming',
          'Law enforcement opposition expected',
          'High-profile forfeiture cases in media'
        ]
      },
      {
        topic: 'Judicial Selection & Retention',
        confidence: 66,
        summary: 'Potential changes to merit selection system for judges.',
        evidenceSignals: [
          'Conservative dissatisfaction with judicial appointments',
          'Legislative power vs judicial independence debate',
          'Bar association opposition expected',
          'Constitutional amendment possibility'
        ]
      }
    ],
    nextMeeting: '2025-01-18T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Sentencing reform hearings', 'Gun rights bills', 'Stakeholder testimony'],
        note: 'High-intensity debates expected'
      },
      {
        month: 'February 2025',
        themes: ['Border enforcement policy', 'Civil liberties concerns', 'Committee markup'],
        note: 'Constitutional questions will dominate'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Floor amendments', 'Conference committees'],
        note: 'Pushing bills to passage'
      }
    ],
    mediaIntel: [
      {
        id: 'media-8',
        headline: 'Senate Judiciary Gears Up for Criminal Justice Battles',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-23',
        snippet: 'Chair Kavanagh signals tough-on-crime approach while reform advocates prepare pushback.'
      },
      {
        id: 'media-9',
        headline: 'Gun Rights Expansion Bills Expected in Judiciary Committee',
        source: 'Arizona Daily Star',
        sentiment: 'neutral',
        date: '2024-12-21',
        snippet: 'Second Amendment advocates preparing slate of bills to expand concealed carry rights.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-1201',
        billNumber: 'SB 1201',
        title: 'Enhanced Sentencing for Violent Crimes',
        stage: 'Introduced',
        issueTags: ['Criminal Justice', 'Sentencing'],
        committeeNotes: 'Chair priority. Reform groups opposed.',
        sponsor: 'Kavanagh',
        confidence: 84
      },
      {
        billId: 'sb-1202',
        billNumber: 'SB 1202',
        title: 'Constitutional Carry Expansion Act',
        stage: 'Likely Hearing',
        issueTags: ['Gun Rights', '2nd Amendment'],
        committeeNotes: 'Strong Republican support. Hearing Jan 25.',
        sponsor: 'Petersen',
        confidence: 82
      }
    ]
  },
  {
    id: 'house-health',
    name: 'House Health & Human Services Committee',
    chamber: 'House',
    description: 'Healthcare policy, Medicaid, public health, mental health services, long-term care, and social services programs.',
    chairId: 'steve-montenegro',
    viceChairId: 'michael-carbone',
    members: [
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Healthcare Expansion',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Healthcare', 'Medicaid', 'Public Health'],
    activityScore: 86,
    predictedFocus: [
      {
        topic: 'AHCCCS/Medicaid Policy',
        confidence: 91,
        summary: 'Medicaid expansion, eligibility, and reimbursement rates under review.',
        evidenceSignals: [
          'Federal matching funds changes',
          'Provider shortages driving reimbursement debate',
          'Eligibility redeterminations post-pandemic',
          'Budget implications major factor'
        ]
      },
      {
        topic: 'Mental Health & Substance Abuse',
        confidence: 88,
        summary: 'Crisis response system and treatment access expansion.',
        evidenceSignals: [
          'Opioid crisis ongoing concern',
          'Mental health crisis calls overwhelming systems',
          'Bipartisan support for crisis intervention',
          'Federal dollars available for programs'
        ]
      },
      {
        topic: 'Rural Healthcare Access',
        confidence: 80,
        summary: 'Hospital closures and provider shortages in rural areas.',
        evidenceSignals: [
          'Multiple rural hospital closures last year',
          'Physician recruitment challenges',
          'Telehealth expansion discussions',
          'Federal rural health grants available'
        ]
      },
      {
        topic: 'Long-Term Care Reform',
        confidence: 74,
        summary: 'Nursing home quality and home-based care alternatives.',
        evidenceSignals: [
          'Pandemic exposed long-term care issues',
          'Aging population driving demand',
          'Family caregiver support proposals',
          'Quality oversight reform discussions'
        ]
      },
      {
        topic: 'Reproductive Healthcare',
        confidence: 69,
        summary: 'Post-Dobbs abortion policy debates expected.',
        evidenceSignals: [
          'National abortion debate influencing state policy',
          'Ballot initiative threats from pro-choice groups',
          'Conservative members seeking restrictions',
          'High public attention and mobilization'
        ]
      }
    ],
    nextMeeting: '2025-01-20T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Medicaid policy hearings', 'Mental health system review', 'Stakeholder input'],
        note: 'Foundation setting for major healthcare debates'
      },
      {
        month: 'February 2025',
        themes: ['Rural healthcare solutions', 'Long-term care reform', 'Budget alignment'],
        note: 'Coordinating with Appropriations on funding'
      },
      {
        month: 'March 2025',
        themes: ['Reproductive health debates', 'Final votes', 'Emergency measures'],
        note: 'Contentious social issues likely'
      }
    ],
    mediaIntel: [
      {
        id: 'media-10',
        headline: 'Rural Hospital Closures Put Pressure on Health Committee',
        source: 'Arizona Republic',
        sentiment: 'negative',
        date: '2024-12-24',
        snippet: 'Three rural hospitals closed in 2024, creating urgency for Health Committee action on access.'
      },
      {
        id: 'media-11',
        headline: 'Mental Health Crisis Response System Needs Expansion',
        source: 'Phoenix New Times',
        sentiment: 'neutral',
        date: '2024-12-22',
        snippet: 'Advocates push for mobile crisis teams and expanded treatment capacity as committee considers bills.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2301',
        billNumber: 'HB 2301',
        title: 'Rural Healthcare Access Initiative',
        stage: 'Drafting',
        issueTags: ['Healthcare', 'Rural Development'],
        committeeNotes: 'Bipartisan support. Awaiting fiscal note.',
        confidence: 76
      },
      {
        billId: 'hb-2302',
        billNumber: 'HB 2302',
        title: 'Mental Health Crisis Response Expansion',
        stage: 'Likely Hearing',
        issueTags: ['Mental Health', 'Public Safety'],
        committeeNotes: 'Strong advocacy support. Hearing Feb 1.',
        confidence: 82
      }
    ]
  },
  {
    id: 'house-elections',
    name: 'House Elections Committee',
    chamber: 'House',
    description: 'Election administration, voter registration, ballot access, campaign finance, redistricting, and election integrity measures.',
    chairId: 'michael-carbone',
    viceChairId: 'steve-montenegro',
    members: [
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Election Integrity',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Voting Rights',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Elections', 'Voting Rights', 'Campaign Finance'],
    activityScore: 84,
    predictedFocus: [
      {
        topic: 'Election Integrity Measures',
        confidence: 93,
        summary: 'Voter ID, signature verification, and audit procedures expected.',
        evidenceSignals: [
          'Republican party platform priority',
          'Chair Carbone stated commitment to election security',
          '2020/2022 election controversies still resonating',
          'Multiple election integrity bills pre-filed'
        ]
      },
      {
        topic: 'Early Voting & Mail Ballot Policy',
        confidence: 81,
        summary: 'Debates over mail ballot timelines and verification processes.',
        evidenceSignals: [
          'County recorders requesting clarification',
          'Partisan divide on mail voting access',
          'Maricopa County issues driving attention',
          'Litigation concerns influencing drafting'
        ]
      },
      {
        topic: 'Voter Registration Procedures',
        confidence: 76,
        summary: 'List maintenance, registration deadlines, and proof of citizenship.',
        evidenceSignals: [
          'Federal-state coordination issues',
          'Motor Voter policy debates',
          'Citizenship verification proposals',
          'ERIC system participation discussions'
        ]
      },
      {
        topic: 'Campaign Finance Reform',
        confidence: 68,
        summary: 'Disclosure requirements and contribution limits under review.',
        evidenceSignals: [
          'Dark money concerns from reform advocates',
          'First Amendment considerations',
          'Clean Elections system discussions',
          'Federal coordination questions'
        ]
      },
      {
        topic: 'Ranked Choice Voting',
        confidence: 62,
        summary: 'Local RCV bans being considered by conservative members.',
        evidenceSignals: [
          'National conservative campaign against RCV',
          'Some cities considering RCV adoption',
          'Preemption legislation expected',
          'Partisan split on voting methods'
        ]
      }
    ],
    nextMeeting: '2025-01-21T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Election integrity hearings', 'Stakeholder testimony', 'Bill introductions'],
        note: 'Contentious partisan debates expected'
      },
      {
        month: 'February 2025',
        themes: ['Mail ballot policy', 'Voter registration rules', 'Committee votes'],
        note: 'Likely party-line votes on key issues'
      },
      {
        month: 'March 2025',
        themes: ['Campaign finance bills', 'Final passage push', 'Emergency measures'],
        note: 'Rush to pass before election cycle heats up'
      }
    ],
    mediaIntel: [
      {
        id: 'media-12',
        headline: 'House Elections Chair Promises Stricter Ballot Verification',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-25',
        snippet: 'Rep. Carbone outlines plan for enhanced signature verification and audit procedures.'
      },
      {
        id: 'media-13',
        headline: 'Voting Rights Groups Brace for Restrictive Legislation',
        source: 'Arizona Mirror',
        sentiment: 'negative',
        date: '2024-12-23',
        snippet: 'Advocates fear Republican-led Elections Committee will limit ballot access and early voting.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2501',
        billNumber: 'HB 2501',
        title: 'Enhanced Ballot Signature Verification Act',
        stage: 'In Committee',
        issueTags: ['Elections', 'Voter ID'],
        committeeNotes: 'Chair priority. Partisan divide. Hearing Jan 28.',
        sponsor: 'Carbone',
        confidence: 88
      },
      {
        billId: 'hb-2502',
        billNumber: 'HB 2502',
        title: 'Ranked Choice Voting Prohibition',
        stage: 'Drafting',
        issueTags: ['Elections', 'Local Government'],
        committeeNotes: 'Preemption bill. Republican support.',
        confidence: 72
      }
    ]
  },
  {
    id: 'senate-transportation',
    name: 'Senate Transportation & Infrastructure Committee',
    chamber: 'Senate',
    description: 'Transportation infrastructure, highways, public transit, autonomous vehicles, infrastructure funding, and ADOT oversight.',
    chairId: 'warren-petersen',
    viceChairId: 'john-kavanagh',
    members: [
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Transit Expansion',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Transportation', 'Infrastructure', 'Public Transit'],
    activityScore: 79,
    predictedFocus: [
      {
        topic: 'Highway Infrastructure Investment',
        confidence: 87,
        summary: 'Federal infrastructure dollars driving major highway projects.',
        evidenceSignals: [
          'Bipartisan infrastructure law funds available',
          'State match requirements being negotiated',
          'I-10 and I-17 expansion priorities',
          'ADOT project list awaiting funding'
        ]
      },
      {
        topic: 'Public Transit Expansion',
        confidence: 79,
        summary: 'Phoenix metro transit and rural transit service debates.',
        evidenceSignals: [
          'Phoenix light rail expansion proposals',
          'Rural transit funding shortfalls',
          'Federal transit grants available',
          'Urban-rural divide on priorities'
        ]
      },
      {
        topic: 'Autonomous Vehicle Regulation',
        confidence: 72,
        summary: 'Self-driving vehicle testing and deployment framework.',
        evidenceSignals: [
          'Waymo and other AV companies active in state',
          'Safety concerns from incidents',
          'Economic development opportunity',
          'Regulatory clarity needed for industry'
        ]
      },
      {
        topic: 'Transportation Funding Mechanisms',
        confidence: 68,
        summary: 'Gas tax alternatives and electric vehicle fees.',
        evidenceSignals: [
          'Gas tax revenue declining with EV adoption',
          'Road usage charge pilot programs nationally',
          'Conservative opposition to new taxes/fees',
          'Infrastructure funding gap growing'
        ]
      },
      {
        topic: 'Rural Road Maintenance',
        confidence: 64,
        summary: 'County road funding and maintenance backlog issues.',
        evidenceSignals: [
          'Rural counties requesting state support',
          'Deferred maintenance creating safety issues',
          'Federal rural infrastructure programs',
          'Limited local revenue sources'
        ]
      }
    ],
    nextMeeting: '2025-01-22T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['ADOT presentations', 'Federal funding overview', 'Project prioritization'],
        note: 'Setting infrastructure agenda for session'
      },
      {
        month: 'February 2025',
        themes: ['Transit policy debates', 'AV regulation', 'Funding bills'],
        note: 'Balancing urban and rural priorities'
      },
      {
        month: 'March 2025',
        themes: ['Bonding authority', 'Final project approvals', 'Emergency measures'],
        note: 'Finalizing funding mechanisms'
      }
    ],
    mediaIntel: [
      {
        id: 'media-14',
        headline: 'Senate Committee Prioritizes Highway Expansion with Federal Funds',
        source: 'Phoenix Business Journal',
        sentiment: 'positive',
        date: '2024-12-26',
        snippet: 'Chair Petersen announces plan to leverage federal infrastructure dollars for I-10 widening.'
      },
      {
        id: 'media-15',
        headline: 'Autonomous Vehicle Industry Seeks Regulatory Clarity',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-24',
        snippet: 'AV companies lobby Transportation Committee for clear rules as testing expands statewide.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-1601',
        billNumber: 'SB 1601',
        title: 'Highway Infrastructure Modernization Act',
        stage: 'Likely Hearing',
        issueTags: ['Transportation', 'Infrastructure'],
        committeeNotes: 'Bipartisan. Federal match coordination. Hearing Feb 5.',
        confidence: 84
      },
      {
        billId: 'sb-1602',
        billNumber: 'SB 1602',
        title: 'Autonomous Vehicle Safety Framework',
        stage: 'Drafting',
        issueTags: ['Transportation', 'Technology'],
        committeeNotes: 'Industry input ongoing. Committee interest high.',
        confidence: 71
      }
    ]
  },
  {
    id: 'joint-rules',
    name: 'Joint Rules Committee',
    chamber: 'Joint',
    description: 'Legislative procedures, chamber rules, bill assignment, committee structure, and session operations. High-power gatekeeping committee.',
    chairId: 'steve-montenegro',
    viceChairId: 'warren-petersen',
    members: [
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Leadership',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Vice Chair',
        priorityTag: 'Leadership',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Minority Rep',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Minority Rep',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Procedures', 'Rules', 'Operations'],
    activityScore: 96,
    predictedFocus: [
      {
        topic: 'Bill Assignment Strategy',
        confidence: 94,
        summary: 'Strategic assignment of bills to friendly vs hostile committees.',
        evidenceSignals: [
          'Leadership control over committee referrals',
          'Contentious bills requiring strategic routing',
          'Minority party complaints about process',
          'Historical patterns of strategic assignments'
        ]
      },
      {
        topic: 'Session Calendar Management',
        confidence: 88,
        summary: 'Floor time allocation and bill scheduling priorities.',
        evidenceSignals: [
          'Leadership agenda setting underway',
          'Competing priorities requiring sequencing',
          'Deadline management for bills',
          'Emergency measures requiring fast-tracking'
        ]
      },
      {
        topic: 'Committee Structure Changes',
        confidence: 76,
        summary: 'Potential reshuffling of committee jurisdictions or membership.',
        evidenceSignals: [
          'New session requires committee assignments',
          'Freshman legislators need placement',
          'Policy priorities may drive reorganization',
          'Leadership prerogative on structure'
        ]
      },
      {
        topic: 'Rules Changes',
        confidence: 70,
        summary: 'Procedural rules modifications to facilitate majority agenda.',
        evidenceSignals: [
          'Efficiency concerns from leadership',
          'Minority party procedural obstruction concerns',
          'National trends toward majority rule',
          'Previous session procedural issues'
        ]
      },
      {
        topic: 'Ethics & Conduct Rules',
        confidence: 64,
        summary: 'Member conduct standards and enforcement procedures.',
        evidenceSignals: [
          'Recent ethics controversies',
          'Gift ban discussions',
          'Transparency advocacy from reform groups',
          'Bipartisan interest in updates'
        ]
      }
    ],
    nextMeeting: '2025-01-13T08:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Committee assignments', 'Bill referral procedures', 'Session calendar'],
        note: 'Critical foundation work for entire session'
      },
      {
        month: 'February 2025',
        themes: ['Bill flow management', 'Emergency measures', 'Procedural disputes'],
        note: 'High-stakes gatekeeping decisions'
      },
      {
        month: 'March 2025',
        themes: ['Final bill scheduling', 'Sine die planning', 'Rules enforcement'],
        note: 'End-of-session sprint management'
      }
    ],
    mediaIntel: [
      {
        id: 'media-16',
        headline: 'Rules Committee to Control Bill Fate in Divided Legislature',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-27',
        snippet: 'Leadership\'s grip on Rules Committee will determine which bills advance to floor votes.'
      },
      {
        id: 'media-17',
        headline: 'Democrats Cry Foul Over Committee Assignment Process',
        source: 'Arizona Mirror',
        sentiment: 'negative',
        date: '2024-12-25',
        snippet: 'Minority members claim Rules Committee stacking key committees with partisan majorities.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hjr-2001',
        billNumber: 'HJR 2001',
        title: 'Rules of the House 2025',
        stage: 'In Committee',
        issueTags: ['Procedures', 'Rules'],
        committeeNotes: 'Annual rules package. Passage required for session start.',
        confidence: 98
      },
      {
        billId: 'sjr-1001',
        billNumber: 'SJR 1001',
        title: 'Rules of the Senate 2025',
        stage: 'In Committee',
        issueTags: ['Procedures', 'Rules'],
        committeeNotes: 'Annual rules package. Non-controversial.',
        confidence: 98
      }
    ]
  },
  {
    id: 'house-energy',
    name: 'House Energy & Water Committee',
    chamber: 'House',
    description: 'Energy policy, utilities regulation, renewable energy, water resources, drought management, and Colorado River issues.',
    chairId: 'michael-carbone',
    viceChairId: 'steve-montenegro',
    members: [
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Climate Focus',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Energy', 'Water', 'Utilities', 'Environment'],
    activityScore: 90,
    predictedFocus: [
      {
        topic: 'Colorado River Water Crisis',
        confidence: 96,
        summary: 'Urgent action needed on water cuts and conservation measures.',
        evidenceSignals: [
          'Historic Colorado River shortages',
          'Federal cuts mandated',
          'Agriculture sector under pressure',
          'Urban growth vs water availability tension'
        ]
      },
      {
        topic: 'Renewable Energy Mandates',
        confidence: 84,
        summary: 'Debates over clean energy standards and utility obligations.',
        evidenceSignals: [
          'ACC renewable mandates under legislative scrutiny',
          'Solar industry lobbying heavily',
          'Ratepayer cost concerns',
          'Conservative pushback on mandates'
        ]
      },
      {
        topic: 'Groundwater Management',
        confidence: 81,
        summary: 'Rural groundwater pumping and aquifer sustainability.',
        evidenceSignals: [
          'Rural vs urban water rights conflicts',
          'Agriculture water use debates',
          'Residential development restrictions',
          'Active Management Area expansions proposed'
        ]
      },
      {
        topic: 'Electric Grid Reliability',
        confidence: 75,
        summary: 'Grid modernization and capacity planning for growth.',
        evidenceSignals: [
          'Summer blackout risks',
          'Data center energy demands',
          'Transmission infrastructure needs',
          'Fossil fuel plant retirements'
        ]
      },
      {
        topic: 'Utility Rate Reform',
        confidence: 69,
        summary: 'Rate structures, solar credits, and affordability concerns.',
        evidenceSignals: [
          'Rising utility rates concerning voters',
          'Net metering policy under review',
          'Fixed charges vs volumetric rates debate',
          'Low-income assistance programs'
        ]
      }
    ],
    nextMeeting: '2025-01-23T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Water crisis hearings', 'Drought response plans', 'Stakeholder input'],
        note: 'Water will dominate early session'
      },
      {
        month: 'February 2025',
        themes: ['Renewable energy debates', 'Grid reliability', 'Rate reform'],
        note: 'Energy policy battles intensify'
      },
      {
        month: 'March 2025',
        themes: ['Groundwater legislation', 'Final votes', 'Emergency measures'],
        note: 'Pushing critical water bills to passage'
      }
    ],
    mediaIntel: [
      {
        id: 'media-18',
        headline: 'Water Crisis Tops Legislature\'s Priority List',
        source: 'Arizona Republic',
        sentiment: 'negative',
        date: '2024-12-28',
        snippet: 'Colorado River shortages force emergency legislative action on conservation and allocation.'
      },
      {
        id: 'media-19',
        headline: 'Solar Industry Battles Conservative Pushback in Energy Committee',
        source: 'Phoenix Business Journal',
        sentiment: 'neutral',
        date: '2024-12-26',
        snippet: 'Renewable energy mandates face resistance from House leadership amid cost concerns.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2701',
        billNumber: 'HB 2701',
        title: 'Colorado River Shortage Emergency Response Act',
        stage: 'In Committee',
        issueTags: ['Water', 'Drought', 'Agriculture'],
        committeeNotes: 'Critical priority. Bipartisan urgency. Hearing Jan 29.',
        confidence: 92
      },
      {
        billId: 'hb-2702',
        billNumber: 'HB 2702',
        title: 'Groundwater Management Reform',
        stage: 'Drafting',
        issueTags: ['Water', 'Rural Development'],
        committeeNotes: 'Contentious. Rural-urban divide. Complex negotiations.',
        confidence: 74
      }
    ]
  },
  {
    id: 'senate-commerce',
    name: 'Senate Commerce & Economic Development Committee',
    chamber: 'Senate',
    description: 'Business regulation, economic development, occupational licensing, banking, insurance, and corporate governance.',
    chairId: 'warren-petersen',
    viceChairId: 'john-kavanagh',
    members: [
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Pro-Business',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Worker Protections',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Commerce', 'Business', 'Economic Development'],
    activityScore: 82,
    predictedFocus: [
      {
        topic: 'Occupational Licensing Reform',
        confidence: 89,
        summary: 'Deregulation push to reduce licensing barriers to employment.',
        evidenceSignals: [
          'Conservative priority to reduce regulations',
          'National licensing reform movement',
          'Workforce shortage driving urgency',
          'Business groups supporting reform'
        ]
      },
      {
        topic: 'Economic Development Incentives',
        confidence: 86,
        summary: 'Tax credits and incentives for business attraction and expansion.',
        evidenceSignals: [
          'Competition with other states for projects',
          'Recent high-profile business relocations',
          'TSMC and semiconductor industry focus',
          'Revenue implications being debated'
        ]
      },
      {
        topic: 'Cryptocurrency & Blockchain Regulation',
        confidence: 78,
        summary: 'Emerging tech regulation and state banking law updates.',
        evidenceSignals: [
          'Crypto industry seeking regulatory clarity',
          'National regulatory uncertainty',
          'Arizona positioning as crypto-friendly',
          'Banking law modernization needed'
        ]
      },
      {
        topic: 'Non-Compete Agreement Reform',
        confidence: 72,
        summary: 'Restrictions on non-compete clauses for workers.',
        evidenceSignals: [
          'National trend toward limiting non-competes',
          'Worker mobility concerns',
          'Business community resistance',
          'Bipartisan interest in reform'
        ]
      },
      {
        topic: 'Insurance Market Regulation',
        confidence: 67,
        summary: 'Health insurance, property insurance, and market reforms.',
        evidenceSignals: [
          'Property insurance availability issues',
          'Health insurance cost concerns',
          'Climate risks affecting insurers',
          'Consumer protection advocacy'
        ]
      }
    ],
    nextMeeting: '2025-01-24T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Licensing reform hearings', 'Economic development presentations', 'Stakeholder testimony'],
        note: 'Pro-business agenda setting'
      },
      {
        month: 'February 2025',
        themes: ['Tax incentive bills', 'Regulatory rollbacks', 'Crypto legislation'],
        note: 'Deregulation push accelerates'
      },
      {
        month: 'March 2025',
        themes: ['Insurance reform', 'Final votes', 'Business community priorities'],
        note: 'Wrapping up pro-growth agenda'
      }
    ],
    mediaIntel: [
      {
        id: 'media-20',
        headline: 'Senate Commerce Chair Seeks to Cut Red Tape for Business',
        source: 'Phoenix Business Journal',
        sentiment: 'positive',
        date: '2024-12-27',
        snippet: 'Chair Petersen announces agenda to reduce occupational licensing and regulatory burdens.'
      },
      {
        id: 'media-21',
        headline: 'Arizona Positions as Crypto-Friendly State with New Legislation',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-25',
        snippet: 'Commerce Committee considering blockchain-friendly regulations to attract fintech companies.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-1801',
        billNumber: 'SB 1801',
        title: 'Occupational Licensing Modernization Act',
        stage: 'Introduced',
        issueTags: ['Commerce', 'Occupational Licensing'],
        committeeNotes: 'Chair priority. Business community support. Hearing Feb 7.',
        sponsor: 'Petersen',
        confidence: 86
      },
      {
        billId: 'sb-1802',
        billNumber: 'SB 1802',
        title: 'Economic Development Incentive Package',
        stage: 'Drafting',
        issueTags: ['Economic Development', 'Tax Policy'],
        committeeNotes: 'Coordinating with Appropriations on fiscal impact.',
        confidence: 78
      }
    ]
  },
  {
    id: 'house-public-safety',
    name: 'House Public Safety Committee',
    chamber: 'House',
    description: 'Law enforcement, corrections, emergency services, border security, and criminal justice administration.',
    chairId: 'steve-montenegro',
    viceChairId: 'michael-carbone',
    members: [
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Border Security',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Justice Reform',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Public Safety', 'Law Enforcement', 'Corrections'],
    activityScore: 87,
    predictedFocus: [
      {
        topic: 'Border Security Enforcement',
        confidence: 95,
        summary: 'State-level border enforcement powers and funding.',
        evidenceSignals: [
          'Governor top priority',
          'Federal-state tensions high',
          'Texas SB4 model being studied',
          'Chair Montenegro border security focus'
        ]
      },
      {
        topic: 'Law Enforcement Funding',
        confidence: 83,
        summary: 'Police recruitment, retention, and equipment funding.',
        evidenceSignals: [
          'Officer shortage crisis',
          'Law enforcement unions lobbying',
          'Recruiting and retention bonuses proposed',
          'Bipartisan support for police funding'
        ]
      },
      {
        topic: 'Fentanyl Crisis Response',
        confidence: 80,
        summary: 'Trafficking penalties and overdose prevention measures.',
        evidenceSignals: [
          'Fentanyl deaths at record highs',
          'Bipartisan urgency on opioid crisis',
          'Border connection to trafficking',
          'Enhanced penalties being proposed'
        ]
      },
      {
        topic: 'Prison Capacity & Reform',
        confidence: 74,
        summary: 'Corrections facility capacity and rehabilitation programs.',
        evidenceSignals: [
          'Prison overcrowding concerns',
          'Private prison contracts under review',
          'Rehabilitation vs incarceration debate',
          'Budget implications significant'
        ]
      },
      {
        topic: 'Emergency Services Funding',
        confidence: 68,
        summary: 'Fire, EMS, and disaster response infrastructure.',
        evidenceSignals: [
          'Rural fire service challenges',
          'Wildfire season preparations',
          'EMS provider shortages',
          'Federal grant opportunities'
        ]
      }
    ],
    nextMeeting: '2025-01-27T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Border security hearings', 'Law enforcement testimony', 'Fentanyl crisis'],
        note: 'High-profile public safety agenda'
      },
      {
        month: 'February 2025',
        themes: ['Corrections reform', 'Emergency services', 'Funding bills'],
        note: 'Coordinating with Appropriations'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Emergency measures', 'Enforcement expansions'],
        note: 'Pushing tough-on-crime agenda'
      }
    ],
    mediaIntel: [
      {
        id: 'media-22',
        headline: 'Border Security Bills Dominate House Public Safety Agenda',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-28',
        snippet: 'Chair Montenegro promises aggressive state-level border enforcement legislation this session.'
      },
      {
        id: 'media-23',
        headline: 'Fentanyl Deaths Drive Bipartisan Push for Stricter Trafficking Laws',
        source: 'Arizona Capitol Times',
        sentiment: 'positive',
        date: '2024-12-26',
        snippet: 'Public Safety Committee members unite around enhanced penalties for fentanyl trafficking.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-2901',
        billNumber: 'HB 2901',
        title: 'Border Security Enhancement Act',
        stage: 'In Committee',
        issueTags: ['Public Safety', 'Border Security'],
        committeeNotes: 'Governor priority. Hearing Jan 30. Constitutional questions.',
        sponsor: 'Montenegro',
        confidence: 89
      },
      {
        billId: 'hb-2902',
        billNumber: 'HB 2902',
        title: 'Fentanyl Trafficking Enhanced Penalties',
        stage: 'Likely Hearing',
        issueTags: ['Public Safety', 'Opioid Crisis'],
        committeeNotes: 'Bipartisan. Strong support. Hearing Feb 3.',
        confidence: 91
      }
    ]
  },
  {
    id: 'senate-natural-resources',
    name: 'Senate Natural Resources & Environment Committee',
    chamber: 'Senate',
    description: 'Environmental policy, water resources, public lands, mining, forestry, wildlife management, and climate issues.',
    chairId: 'john-kavanagh',
    viceChairId: 'warren-petersen',
    members: [
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Climate Action',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Environment', 'Water', 'Public Lands'],
    activityScore: 77,
    predictedFocus: [
      {
        topic: 'Water Rights & Allocation',
        confidence: 92,
        summary: 'Colorado River, groundwater, and inter-state water compacts.',
        evidenceSignals: [
          'Historic water shortage',
          'Competing demands from sectors',
          'Federal compact negotiations',
          'Agriculture vs urban tensions'
        ]
      },
      {
        topic: 'Federal Lands Management',
        confidence: 79,
        summary: 'State authority over federal lands and resource extraction.',
        evidenceSignals: [
          'States\' rights movement on federal lands',
          'Mining and grazing permit concerns',
          'National monument debates',
          'Conservation vs development tensions'
        ]
      },
      {
        topic: 'Wildfire Management',
        confidence: 76,
        summary: 'Forest health, prevention, and emergency response.',
        evidenceSignals: [
          'Increasing wildfire frequency and severity',
          'Forest management policy debates',
          'Federal-state coordination issues',
          'Insurance implications for homeowners'
        ]
      },
      {
        topic: 'Mining & Resource Extraction',
        confidence: 71,
        summary: 'Copper mining, lithium extraction, and permitting.',
        evidenceSignals: [
          'Critical minerals demand for EVs',
          'Arizona copper industry lobbying',
          'Environmental review streamlining',
          'Tribal consultation requirements'
        ]
      },
      {
        topic: 'Climate Policy Rollbacks',
        confidence: 65,
        summary: 'Conservative pushback on climate regulations.',
        evidenceSignals: [
          'Republican majority skeptical of climate policy',
          'Federal EPA rule challenges',
          'Business community seeking regulatory relief',
          'National conservative climate skepticism'
        ]
      }
    ],
    nextMeeting: '2025-01-29T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Water policy hearings', 'Federal lands issues', 'Stakeholder testimony'],
        note: 'Water will dominate committee time'
      },
      {
        month: 'February 2025',
        themes: ['Mining policy', 'Wildfire management', 'Regulatory rollbacks'],
        note: 'Pro-development agenda advancing'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Climate policy battles', 'Emergency measures'],
        note: 'Environmental groups fighting defensive battles'
      }
    ],
    mediaIntel: [
      {
        id: 'media-24',
        headline: 'Senate Panel Prioritizes Water Over Environmental Concerns',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-27',
        snippet: 'Natural Resources Committee signals water supply will trump conservation in policy debates.'
      },
      {
        id: 'media-25',
        headline: 'Mining Industry Seeks Permitting Reform from Legislature',
        source: 'Arizona Daily Star',
        sentiment: 'neutral',
        date: '2024-12-24',
        snippet: 'Copper producers lobby committee for streamlined environmental reviews and faster permits.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-2001',
        billNumber: 'SB 2001',
        title: 'Water Rights Modernization Act',
        stage: 'Likely Hearing',
        issueTags: ['Water', 'Agriculture'],
        committeeNotes: 'Complex negotiations. Multiple stakeholders. Hearing Feb 8.',
        confidence: 77
      },
      {
        billId: 'sb-2002',
        billNumber: 'SB 2002',
        title: 'Mining Permit Streamlining',
        stage: 'Drafting',
        issueTags: ['Mining', 'Economic Development'],
        committeeNotes: 'Industry priority. Environmental opposition expected.',
        confidence: 72
      }
    ]
  },
  {
    id: 'joint-ethics',
    name: 'Joint Legislative Ethics Committee',
    chamber: 'Joint',
    description: 'Legislative ethics, member conduct, gift rules, financial disclosure, conflicts of interest, and ethics investigations.',
    chairId: 'priya-sundaresan',
    viceChairId: 'john-kavanagh',
    members: [
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Ethics Reform',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Ethics', 'Transparency', 'Conduct'],
    activityScore: 62,
    predictedFocus: [
      {
        topic: 'Gift Ban Enforcement',
        confidence: 76,
        summary: 'Strengthening gift rules and enforcement mechanisms.',
        evidenceSignals: [
          'Recent ethics controversies',
          'Public pressure for transparency',
          'Bipartisan reform interest',
          'Loopholes in current rules'
        ]
      },
      {
        topic: 'Financial Disclosure Rules',
        confidence: 72,
        summary: 'Enhanced disclosure requirements for members\' finances.',
        evidenceSignals: [
          'Transparency advocacy group campaigns',
          'Conflicts of interest concerns',
          'National trend toward disclosure',
          'Resistance from some members'
        ]
      },
      {
        topic: 'Ethics Investigation Procedures',
        confidence: 68,
        summary: 'Fair and effective investigation and discipline processes.',
        evidenceSignals: [
          'Complaints about biased investigations',
          'Due process concerns',
          'Public accountability demands',
          'Balancing fairness with transparency'
        ]
      },
      {
        topic: 'Lobbying Activity Disclosure',
        confidence: 64,
        summary: 'Enhanced disclosure of lobbying contacts and spending.',
        evidenceSignals: [
          'Dark money concerns',
          'Public interest in lobbying transparency',
          'Lobbyist registration updates needed',
          'First Amendment balance considerations'
        ]
      },
      {
        topic: 'Social Media Conduct Standards',
        confidence: 58,
        summary: 'Ethics rules for legislators\' social media activity.',
        evidenceSignals: [
          'Controversial social media posts by members',
          'Constituent harassment via social media',
          'Free speech vs professionalism balance',
          'Modern ethics challenges'
        ]
      }
    ],
    nextMeeting: '2025-01-31T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Annual ethics training', 'Rule review', 'Complaint intake'],
        note: 'Routine business and training'
      },
      {
        month: 'February 2025',
        themes: ['Gift ban discussions', 'Disclosure requirements', 'Policy updates'],
        note: 'Reform proposals being considered'
      },
      {
        month: 'March 2025',
        themes: ['Investigation oversight', 'Complaint resolutions', 'Annual report'],
        note: 'Wrapping up investigations and reporting'
      }
    ],
    mediaIntel: [
      {
        id: 'media-26',
        headline: 'Ethics Committee Considers Stricter Gift Ban Rules',
        source: 'Arizona Capitol Times',
        sentiment: 'positive',
        date: '2024-12-26',
        snippet: 'Bipartisan support emerging for tougher gift restrictions following recent controversies.'
      },
      {
        id: 'media-27',
        headline: 'Transparency Groups Push for Enhanced Financial Disclosure',
        source: 'Arizona Mirror',
        sentiment: 'neutral',
        date: '2024-12-23',
        snippet: 'Reform advocates urge Ethics Committee to require more detailed financial disclosures from legislators.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hjr-2101',
        billNumber: 'HJR 2101',
        title: 'Legislative Gift Ban Enhancement',
        stage: 'Drafting',
        issueTags: ['Ethics', 'Transparency'],
        committeeNotes: 'Bipartisan interest. Details being negotiated.',
        confidence: 71
      }
    ]
  },
  {
    id: 'house-regulatory',
    name: 'House Regulatory Affairs Committee',
    chamber: 'House',
    description: 'Professional licensing boards, regulatory agencies, administrative law, and occupational regulation oversight.',
    chairId: 'michael-carbone',
    viceChairId: 'steve-montenegro',
    members: [
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Deregulation',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Consumer Protection',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Regulation', 'Licensing', 'Administrative Law'],
    activityScore: 71,
    predictedFocus: [
      {
        topic: 'Occupational Licensing Reduction',
        confidence: 87,
        summary: 'Eliminating or reducing licensing requirements for various professions.',
        evidenceSignals: [
          'Conservative deregulation agenda',
          'Workforce shortage driving reform',
          'National licensing reform trend',
          'Chair Carbone strong deregulation advocate'
        ]
      },
      {
        topic: 'Regulatory Agency Oversight',
        confidence: 79,
        summary: 'Legislative oversight and sunset review of regulatory boards.',
        evidenceSignals: [
          'Sunset review process underway',
          'Agency accountability concerns',
          'Budget pressures on agencies',
          'Eliminating obsolete boards'
        ]
      },
      {
        topic: 'Administrative Law Reform',
        confidence: 73,
        summary: 'Rulemaking processes and judicial review of agency actions.',
        evidenceSignals: [
          'Business community seeking streamlined processes',
          'Concerns about regulatory overreach',
          'Due process improvements',
          'Balancing efficiency with fairness'
        ]
      },
      {
        topic: 'Professional Board Composition',
        confidence: 66,
        summary: 'Reforming membership and appointment of regulatory boards.',
        evidenceSignals: [
          'Industry capture concerns',
          'Public member representation',
          'Governor appointment authority',
          'Legislative vs executive control'
        ]
      },
      {
        topic: 'Telehealth & Remote Services Regulation',
        confidence: 61,
        summary: 'Licensing and regulation of telehealth providers.',
        evidenceSignals: [
          'Pandemic accelerated telehealth adoption',
          'Interstate licensing compacts',
          'Consumer protection vs access balance',
          'Technology outpacing regulation'
        ]
      }
    ],
    nextMeeting: '2025-02-03T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Sunset reviews', 'Licensing reform proposals', 'Agency presentations'],
        note: 'Setting deregulation agenda'
      },
      {
        month: 'February 2025',
        themes: ['Board oversight hearings', 'Administrative law reforms', 'Committee votes'],
        note: 'Active deregulation push'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Board reauthorizations', 'Regulatory rollbacks'],
        note: 'Finalizing regulatory reform package'
      }
    ],
    mediaIntel: [
      {
        id: 'media-28',
        headline: 'Regulatory Committee Targets Occupational Licensing for Overhaul',
        source: 'Phoenix Business Journal',
        sentiment: 'positive',
        date: '2024-12-25',
        snippet: 'Chair Carbone announces plan to eliminate or reduce licensing for dozens of professions.'
      },
      {
        id: 'media-29',
        headline: 'Consumer Groups Warn Against Excessive Deregulation',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-22',
        snippet: 'Advocates urge Regulatory Affairs Committee to maintain consumer protections amid reform push.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-3101',
        billNumber: 'HB 3101',
        title: 'Occupational Licensing Modernization Act',
        stage: 'Introduced',
        issueTags: ['Regulation', 'Licensing'],
        committeeNotes: 'Chair priority. Eliminates 15+ license requirements. Hearing Feb 10.',
        sponsor: 'Carbone',
        confidence: 84
      },
      {
        billId: 'hb-3102',
        billNumber: 'HB 3102',
        title: 'Regulatory Board Sunset and Review',
        stage: 'Drafting',
        issueTags: ['Regulation', 'Administrative Law'],
        committeeNotes: 'Annual sunset review package. Multiple boards affected.',
        confidence: 79
      }
    ]
  },
  {
    id: 'senate-veterans',
    name: 'Senate Military & Veterans Affairs Committee',
    chamber: 'Senate',
    description: 'Military installations, veterans services, National Guard, military families, and veteran-owned businesses.',
    chairId: 'warren-petersen',
    viceChairId: 'john-kavanagh',
    members: [
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Military', 'Veterans', 'National Guard'],
    activityScore: 68,
    predictedFocus: [
      {
        topic: 'Veterans Healthcare Access',
        confidence: 81,
        summary: 'VA facility capacity and state veterans home improvements.',
        evidenceSignals: [
          'VA wait times concerning',
          'Veterans advocacy groups active',
          'Bipartisan priority',
          'Federal-state coordination'
        ]
      },
      {
        topic: 'Military Base Support',
        confidence: 78,
        summary: 'Luke AFB, Davis-Monthan, Fort Huachuca support and expansion.',
        evidenceSignals: [
          'Economic impact of bases substantial',
          'BRAC concerns always present',
          'Community relations important',
          'Training range access issues'
        ]
      },
      {
        topic: 'Veteran-Owned Business Support',
        confidence: 72,
        summary: 'Procurement preferences and economic opportunities for veterans.',
        evidenceSignals: [
          'Veteran business community lobbying',
          'State contracting set-asides',
          'Economic development opportunity',
          'Bipartisan support typical'
        ]
      },
      {
        topic: 'Veterans Benefits & Services',
        confidence: 69,
        summary: 'State-level benefits, property tax exemptions, license plates.',
        evidenceSignals: [
          'Veterans service organizations active',
          'Property tax relief popular',
          'Recognition programs valued',
          'Fiscal impact usually modest'
        ]
      },
      {
        topic: 'National Guard Readiness',
        confidence: 64,
        summary: 'Guard deployment support and family assistance programs.',
        evidenceSignals: [
          'Guard deployments ongoing',
          'Family support services needed',
          'Border mission implications',
          'Federal-state coordination'
        ]
      }
    ],
    nextMeeting: '2025-02-05T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Veterans services review', 'Base support hearings', 'Stakeholder input'],
        note: 'Bipartisan cooperation typical'
      },
      {
        month: 'February 2025',
        themes: ['Benefits legislation', 'Economic development', 'Committee votes'],
        note: 'Moving veteran support bills'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Guard support measures', 'Recognition bills'],
        note: 'Non-controversial bills moving'
      }
    ],
    mediaIntel: [
      {
        id: 'media-30',
        headline: 'Committee Prioritizes Veterans Healthcare Access Improvements',
        source: 'Arizona Capitol Times',
        sentiment: 'positive',
        date: '2024-12-24',
        snippet: 'Bipartisan push to expand state veterans homes and improve VA coordination.'
      },
      {
        id: 'media-31',
        headline: 'Military Bases Contribute $15B to Arizona Economy, Committee Hears',
        source: 'Arizona Republic',
        sentiment: 'positive',
        date: '2024-12-21',
        snippet: 'Testimony highlights economic importance of protecting and expanding military installations.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-2301',
        billNumber: 'SB 2301',
        title: 'Veterans Healthcare Access Enhancement',
        stage: 'Drafting',
        issueTags: ['Veterans', 'Healthcare'],
        committeeNotes: 'Bipartisan. Expanding state veterans homes. Coordinating with VA.',
        confidence: 79
      },
      {
        billId: 'sb-2302',
        billNumber: 'SB 2302',
        title: 'Veteran Business Procurement Preference',
        stage: 'Drafting',
        issueTags: ['Veterans', 'Economic Development'],
        committeeNotes: 'Veteran business community priority. Strong support.',
        confidence: 74
      }
    ]
  },
  {
    id: 'house-government',
    name: 'House Government & Higher Education Committee',
    chamber: 'House',
    description: 'State government operations, higher education policy, universities, community colleges, and state employee issues.',
    chairId: 'steve-montenegro',
    viceChairId: 'michael-carbone',
    members: [
      {
        legislatorId: 'steve-montenegro',
        legislatorName: 'Steve Montenegro',
        chamber: 'House',
        party: 'R',
        district: 'LD-29',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        roleInCommittee: 'Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'michael-carbone',
        legislatorName: 'Michael Carbone',
        chamber: 'House',
        party: 'R',
        district: 'LD-25',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        roleInCommittee: 'Vice Chair',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'oscar-delosantos',
        legislatorName: 'Oscar De Los Santos',
        chamber: 'House',
        party: 'D',
        district: 'LD-16',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300',
        roleInCommittee: 'Member',
        priorityTag: 'Higher Ed Funding',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Government Operations', 'Higher Education', 'State Employees'],
    activityScore: 74,
    predictedFocus: [
      {
        topic: 'University Funding & Tuition',
        confidence: 84,
        summary: 'State appropriations to universities and tuition policy debates.',
        evidenceSignals: [
          'Universities requesting funding increases',
          'Tuition affordability concerns',
          'Enrollment declining at some schools',
          'Competing priorities in state budget'
        ]
      },
      {
        topic: 'Free Speech on Campus',
        confidence: 80,
        summary: 'Conservative push for free speech protections at universities.',
        evidenceSignals: [
          'National conservative campaign',
          'Speaker events controversies',
          'Academic freedom vs campus climate',
          'Model legislation circulating'
        ]
      },
      {
        topic: 'Community College Workforce Programs',
        confidence: 76,
        summary: 'Expanding workforce training and career technical education.',
        evidenceSignals: [
          'Workforce shortage driving urgency',
          'Bipartisan support for CTE',
          'Industry partnerships growing',
          'Federal workforce development funds'
        ]
      },
      {
        topic: 'State Employee Compensation',
        confidence: 70,
        summary: 'Pay raises and benefits for state workforce.',
        evidenceSignals: [
          'Recruitment and retention challenges',
          'Employee unions advocating',
          'Budget constraints limiting raises',
          'Competitiveness with private sector'
        ]
      },
      {
        topic: 'Government Efficiency & Modernization',
        confidence: 66,
        summary: 'Technology upgrades and process improvements in state agencies.',
        evidenceSignals: [
          'Legacy IT systems problematic',
          'Cybersecurity concerns',
          'Service delivery improvements needed',
          'Budget trade-offs with modernization'
        ]
      }
    ],
    nextMeeting: '2025-02-07T09:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['University budget presentations', 'Campus free speech', 'Stakeholder input'],
        note: 'Higher ed policy battles expected'
      },
      {
        month: 'February 2025',
        themes: ['Community college workforce programs', 'State employee issues', 'Committee votes'],
        note: 'Coordinating with Appropriations on funding'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Government operations bills', 'Tuition policy'],
        note: 'Wrapping up higher ed and government agenda'
      }
    ],
    mediaIntel: [
      {
        id: 'media-32',
        headline: 'Universities Request Major Funding Increase Amid Budget Constraints',
        source: 'Arizona Republic',
        sentiment: 'neutral',
        date: '2024-12-23',
        snippet: 'ASU, U of A, NAU seeking 8% funding boost while committee grapples with limited resources.'
      },
      {
        id: 'media-33',
        headline: 'Free Speech Legislation for Campuses Expected in House',
        source: 'Arizona Capitol Times',
        sentiment: 'neutral',
        date: '2024-12-20',
        snippet: 'Conservative lawmakers preparing bills to mandate free speech protections at state universities.'
      }
    ],
    billsPipeline: [
      {
        billId: 'hb-3301',
        billNumber: 'HB 3301',
        title: 'Campus Free Speech Protection Act',
        stage: 'Likely Hearing',
        issueTags: ['Higher Education', 'Free Speech'],
        committeeNotes: 'Conservative priority. University opposition. Hearing Feb 12.',
        confidence: 78
      },
      {
        billId: 'hb-3302',
        billNumber: 'HB 3302',
        title: 'Community College Workforce Expansion',
        stage: 'Drafting',
        issueTags: ['Higher Education', 'Workforce Development'],
        committeeNotes: 'Bipartisan. Industry support. Federal match available.',
        confidence: 81
      }
    ]
  },
  {
    id: 'senate-technology',
    name: 'Senate Technology & Innovation Committee',
    chamber: 'Senate',
    description: 'Technology policy, cybersecurity, data privacy, broadband expansion, and emerging technology regulation.',
    chairId: 'warren-petersen',
    viceChairId: 'priya-sundaresan',
    members: [
      {
        legislatorId: 'warren-petersen',
        legislatorName: 'Warren Petersen',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-1',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
        roleInCommittee: 'Chair',
        priorityTag: 'Tech Innovation',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'priya-sundaresan',
        legislatorName: 'Priya Sundaresan',
        chamber: 'Senate',
        party: 'D',
        district: 'LD-18',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
        roleInCommittee: 'Vice Chair',
        priorityTag: 'Privacy Advocate',
        relationshipStatus: 'warm'
      },
      {
        legislatorId: 'john-kavanagh',
        legislatorName: 'John Kavanagh',
        chamber: 'Senate',
        party: 'R',
        district: 'LD-3',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300',
        roleInCommittee: 'Member',
        relationshipStatus: 'warm'
      }
    ],
    tags: ['Technology', 'Cybersecurity', 'Privacy', 'Innovation'],
    activityScore: 76,
    predictedFocus: [
      {
        topic: 'Data Privacy Legislation',
        confidence: 86,
        summary: 'Comprehensive consumer data privacy law under consideration.',
        evidenceSignals: [
          'National trend toward state privacy laws',
          'Tech companies seeking clarity',
          'Consumer advocates pushing for protections',
          'Bipartisan interest in privacy'
        ]
      },
      {
        topic: 'Broadband Expansion',
        confidence: 83,
        summary: 'Rural broadband infrastructure and digital divide solutions.',
        evidenceSignals: [
          'Federal broadband dollars available',
          'Rural areas underserved',
          'Economic development necessity',
          'Bipartisan priority'
        ]
      },
      {
        topic: 'Cybersecurity Standards',
        confidence: 79,
        summary: 'State agency and critical infrastructure cybersecurity requirements.',
        evidenceSignals: [
          'Increasing cyber threats to government',
          'Critical infrastructure vulnerabilities',
          'Federal guidance on state standards',
          'Recent high-profile breaches'
        ]
      },
      {
        topic: 'AI & Emerging Technology Regulation',
        confidence: 74,
        summary: 'Artificial intelligence oversight and emerging tech policy.',
        evidenceSignals: [
          'Rapid AI adoption across sectors',
          'Concerns about bias and accountability',
          'Economic opportunity vs risk balance',
          'National regulatory uncertainty'
        ]
      },
      {
        topic: 'Children\'s Online Safety',
        confidence: 71,
        summary: 'Age verification, content moderation, and youth protection online.',
        evidenceSignals: [
          'Social media harms to children',
          'Parental concern driving action',
          'Tech industry pushback',
          'Constitutional questions present'
        ]
      }
    ],
    nextMeeting: '2025-02-10T10:00:00',
    monthlyForecast: [
      {
        month: 'January 2025',
        themes: ['Broadband expansion planning', 'Privacy law overview', 'Stakeholder input'],
        note: 'Foundation for tech policy agenda'
      },
      {
        month: 'February 2025',
        themes: ['Cybersecurity standards', 'AI regulation debates', 'Committee votes'],
        note: 'Balancing innovation with protection'
      },
      {
        month: 'March 2025',
        themes: ['Final votes', 'Children\'s safety bills', 'Privacy legislation'],
        note: 'Moving comprehensive tech policy package'
      }
    ],
    mediaIntel: [
      {
        id: 'media-34',
        headline: 'Bipartisan Push for Arizona Consumer Data Privacy Law',
        source: 'Arizona Capitol Times',
        sentiment: 'positive',
        date: '2024-12-22',
        snippet: 'Technology Committee leaders from both parties collaborate on comprehensive privacy legislation.'
      },
      {
        id: 'media-35',
        headline: 'Rural Broadband Expansion Key Priority for Tech Committee',
        source: 'Arizona Republic',
        sentiment: 'positive',
        date: '2024-12-19',
        snippet: 'Federal infrastructure funds create opportunity to bridge digital divide in rural Arizona.'
      }
    ],
    billsPipeline: [
      {
        billId: 'sb-2501',
        billNumber: 'SB 2501',
        title: 'Arizona Consumer Privacy Act',
        stage: 'Drafting',
        issueTags: ['Technology', 'Privacy'],
        committeeNotes: 'Bipartisan collaboration. Comprehensive approach. Hearing Feb 14.',
        confidence: 82
      },
      {
        billId: 'sb-2502',
        billNumber: 'SB 2502',
        title: 'Rural Broadband Expansion Initiative',
        stage: 'Likely Hearing',
        issueTags: ['Technology', 'Infrastructure'],
        committeeNotes: 'Federal match required. Strong support. Hearing Feb 17.',
        confidence: 87
      }
    ]
  }
];

// Helper to get committee by ID
export function getCommitteeById(id: string): Committee | undefined {
  return committeesDemoData.find(c => c.id === id);
}

// Helper to get committees by chamber
export function getCommitteesByChamber(chamber: 'House' | 'Senate' | 'Joint'): Committee[] {
  return committeesDemoData.filter(c => c.chamber === chamber);
}

// Helper to get committees for a specific legislator
export function getCommitteesForLegislator(legislatorId: string): Committee[] {
  return committeesDemoData.filter(c => 
    c.members.some(m => m.legislatorId === legislatorId)
  );
}

// Helper to search committees
export function searchCommittees(query: string, filters?: {
  chamber?: 'House' | 'Senate' | 'Joint';
  tags?: string[];
}): Committee[] {
  let results = committeesDemoData;
  
  // Apply chamber filter
  if (filters?.chamber) {
    results = results.filter(c => c.chamber === filters.chamber);
  }
  
  // Apply tag filters
  if (filters?.tags && filters.tags.length > 0) {
    results = results.filter(c => 
      filters.tags!.some(tag => c.tags.includes(tag))
    );
  }
  
  // Apply search query
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  return results;
}
