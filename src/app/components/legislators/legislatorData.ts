export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  notes?: string;
  lastContacted?: string;
}

export interface Committee {
  name: string;
  role: 'Chair' | 'Vice Chair' | 'Member';
}

export interface Bill {
  id: string;
  number: string;
  title: string;
  status: string;
  nextActionDate?: string;
  stance?: 'support' | 'oppose' | 'neutral';
  riskScore?: number;
  sponsorshipType: 'primary' | 'co-sponsor';
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  title: string;
  date: string;
  time: string;
  owner: string;
  linkedBills?: string[];
  linkedIssues?: string[];
  notes?: string;
  attachments?: string[];
}

export interface MediaMention {
  id: string;
  type: 'news' | 'press-release' | 'social';
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  snippet: string;
}

export interface ElectionIntel {
  nextElectionYear: number;
  upThisCycle: boolean;
  seatStatus: 'incumbent' | 'open' | 'term-limited' | 'appointed';
  competitivenessRating: 'safe' | 'likely' | 'lean' | 'tossup';
  competitivenessScore: number; // 0-100
  confidence: 'high' | 'medium' | 'low';
  recentMarginTrend: Array<{ year: number; margin: number }>;
  lastGeneralMargin: string;
  fundraisingStatus?: 'strong' | 'medium' | 'low';
  candidateField?: Array<{
    name: string;
    status: 'filed' | 'announced' | 'speculative';
    party: string;
    sourceUrl?: string;
  }>;
}

export interface ServicesOpportunity {
  opportunityLevel: 'high' | 'medium' | 'low';
  reasons: string[];
  pipelineStatus: 'none' | 'added' | 'contacted' | 'active';
  campaignContactEmail?: string;
}

export interface Legislator {
  id: string;
  name: string;
  title: string;
  chamber: 'House' | 'Senate';
  district: string;
  party: 'R' | 'D';
  priority: 'A' | 'B' | 'C';
  relationshipStatus: 'warm' | 'cold' | 'needs-follow-up';
  lastInteraction: string;
  nextRecommendedTouch?: string;
  photoUrl?: string;
  initials: string;
  watched: boolean;
  hasNotes: boolean;
  hasUpcomingMeeting: boolean;
  
  // Full profile data
  committees: Committee[];
  issueAffinities: Array<{ issue: string; strength: number }>;
  careAbout: string[];
  districtSnapshot?: string;
  relationshipOwner: string;
  
  // Staff & Contacts
  staff: StaffMember[];
  officePhone?: string;
  capitolOffice?: string;
  districtOffice?: string;
  email?: string;
  preferredContactPath?: string;
  
  // Bills & Activity
  sponsoredBills: Bill[];
  relevantBills: Bill[];
  
  // Records & Interactions
  interactions: Interaction[];
  
  // Media & Intel
  mediaMentions: MediaMention[];
  electionIntel: ElectionIntel;
  servicesOpportunity: ServicesOpportunity;
  
  // Pythia Strategy
  aiStrategy: {
    angle: string;
    avoid: string;
    nextStep: string;
    confidence: 'low' | 'medium' | 'high';
  };
  
  // Alerts
  alerts: Array<{
    type: 'hearing' | 'vote' | 'follow-up' | 'birthday';
    message: string;
    date?: string;
  }>;
}

export const mockLegislators: Legislator[] = [
  // ARIZONA LEADERSHIP
  {
    id: 'leg-az-001',
    name: 'Steve Montenegro',
    title: 'Speaker of the House',
    chamber: 'House',
    district: 'LD-29',
    party: 'R',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 10, 2025',
    nextRecommendedTouch: 'Jan 5, 2026',
    photoUrl: 'https://azleg.gov/alisImages/MemberPhotos/57leg/House/MONTENEGRO.jpg',
    initials: 'SM',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Rules', role: 'Chair' },
      { name: 'Leadership', role: 'Chair' },
    ],
    
    issueAffinities: [
      { issue: 'Border Security', strength: 95 },
      { issue: 'Public Safety', strength: 90 },
      { issue: 'Education', strength: 82 },
      { issue: 'Economic Development', strength: 78 },
    ],
    
    careAbout: [
      'Border security and immigration enforcement',
      'Public safety and law enforcement support',
      'School choice and parental rights',
      'Small business growth',
    ],
    
    districtSnapshot: 'LD-29 includes Litchfield Park and parts of Goodyear in the West Valley.',
    relationshipOwner: 'Marcus Johnson',
    
    staff: [
      {
        id: 'staff-az-001',
        name: 'Jennifer Smith',
        role: 'Chief of Staff',
        email: 'jennifer.smith@azleg.gov',
        phone: '(602) 926-3200',
        notes: 'Coordinates all Speaker priorities and schedule',
        lastContacted: 'Dec 10, 2025',
      },
      {
        id: 'staff-az-002',
        name: 'Robert Garcia',
        role: 'Policy Director',
        email: 'robert.garcia@azleg.gov',
        phone: '(602) 926-3201',
        notes: 'Handles legislative strategy and committee assignments',
      },
    ],
    
    officePhone: '(602) 926-3200',
    capitolOffice: 'State Capitol, Speaker\'s Office',
    districtOffice: '13250 W McDowell Rd, Goodyear, AZ 85395',
    email: 'smontenegro@azleg.gov',
    preferredContactPath: 'Route through Chief of Staff for all meeting requests',
    
    sponsoredBills: [
      {
        id: 'bill-001',
        number: 'HB 2847',
        title: 'Clean Energy Grid Modernization Act',
        status: 'Committee',
        nextActionDate: 'Dec 26, 2024',
        stance: 'neutral',
        riskScore: 6,
        sponsorshipType: 'primary',
      },
      {
        id: 'bill-002',
        number: 'HB 3124',
        title: 'Border Security Enhancement Act',
        status: 'Committee',
        nextActionDate: 'Dec 28, 2024',
        stance: 'support',
        riskScore: 3,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-005',
        number: 'HB 4512',
        title: 'Education Funding & Teacher Pay Act',
        status: 'Committee',
        nextActionDate: 'Dec 27, 2024',
        stance: 'neutral',
        riskScore: 7,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-001',
        type: 'meeting',
        title: 'Meeting: Legislative session priorities',
        date: 'Dec 10, 2025',
        time: '9:00 AM',
        owner: 'Marcus Johnson',
        notes: 'Discussed session calendar and priority bills. Speaker focused on education and border security.',
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-001',
        type: 'news',
        title: 'Speaker Montenegro Outlines Legislative Agenda',
        source: 'Arizona Capitol Times',
        timestamp: 'Dec 25, 2024',
        sentiment: 'neutral',
        snippet: 'House Speaker Steve Montenegro outlined his priorities for the upcoming session...',
      },
      {
        id: 'media-az-002',
        type: 'news',
        title: 'Montenegro Pushes Border Security Bill',
        source: 'Arizona Republic',
        timestamp: 'Dec 26, 2024',
        sentiment: 'positive',
        snippet: 'Speaker Montenegro announced new border security legislation...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 80,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 18 },
        { year: 2022, margin: 16 },
      ],
      lastGeneralMargin: '16 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'high',
      reasons: [
        'Speaker position highly influential for all legislative priorities',
        'Safe seat but leadership role requires strong fundraising',
        'West Valley growth area with increasing campaign sophistication',
      ],
      pipelineStatus: 'added',
      campaignContactEmail: 'contact@montenegroforaz.com',
    },
    
    aiStrategy: {
      angle: 'Position issues through lens of border security and public safety. Emphasize economic growth for West Valley.',
      avoid: 'Avoid partisan framing. Focus on practical solutions and constituent impact.',
      nextStep: 'Schedule briefing on bills affecting LD-29. Coordinate with Policy Director on committee strategy.',
      confidence: 'medium',
    },
    
    alerts: [
      {
        type: 'hearing',
        message: 'Session organization meeting',
        date: 'Jan 8, 2025',
      },
    ],
  },
  
  {
    id: 'leg-az-002',
    name: 'Michael Carbone',
    title: 'House Majority Leader',
    chamber: 'House',
    district: 'LD-25',
    party: 'R',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 14, 2025',
    nextRecommendedTouch: 'Jan 3, 2026',
    photoUrl: 'https://azleg.gov/alisImages/MemberPhotos/57leg/House/CARBONE.jpg',
    initials: 'MC',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: false,
    
    committees: [
      { name: 'Ways & Means', role: 'Member' },
      { name: 'Commerce', role: 'Vice Chair' },
      { name: 'Leadership', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Tax Policy', strength: 92 },
      { issue: 'Business Regulation', strength: 88 },
      { issue: 'Healthcare', strength: 76 },
      { issue: 'Technology', strength: 71 },
    ],
    
    careAbout: [
      'Tax relief and economic competitiveness',
      'Reducing regulatory burdens on business',
      'Healthcare cost reduction',
      'Technology sector growth',
    ],
    
    districtSnapshot: 'LD-25 covers North Phoenix and Cave Creek with affluent suburban voters and small business owners.',
    relationshipOwner: 'Sarah Chen',
    
    staff: [
      {
        id: 'staff-az-003',
        name: 'Katherine Moore',
        role: 'Chief of Staff',
        email: 'katherine.moore@azleg.gov',
        phone: '(602) 926-3300',
        notes: 'Manages leadership operations and caucus coordination',
        lastContacted: 'Dec 14, 2025',
      },
      {
        id: 'staff-az-004',
        name: 'David Thompson',
        role: 'Legislative Director',
        email: 'david.thompson@azleg.gov',
        phone: '(602) 926-3301',
      },
    ],
    
    officePhone: '(602) 926-3300',
    capitolOffice: 'State Capitol, Room 301',
    districtOffice: '40202 N 7th St, Phoenix, AZ 85086',
    email: 'mcarbone@azleg.gov',
    preferredContactPath: 'Email Chief of Staff for meeting requests',
    
    sponsoredBills: [
      {
        id: 'bill-003',
        number: 'HB 90',
        title: 'Data Privacy & Consumer Protection Act',
        status: 'Committee',
        nextActionDate: 'Dec 25, 2024',
        stance: 'oppose',
        riskScore: 8,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-007',
        number: 'HB 7823',
        title: 'Cybersecurity Standards Act',
        status: 'Introduced',
        nextActionDate: 'Jan 15, 2025',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-002',
        type: 'meeting',
        title: 'Meeting: Business roundtable on regulatory reform',
        date: 'Dec 14, 2025',
        time: '2:00 PM',
        owner: 'Sarah Chen',
        linkedIssues: ['Business Regulation', 'Technology'],
        notes: 'Discussed HB 90 concerns. Leader receptive to business arguments about compliance costs.',
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-002',
        type: 'news',
        title: 'House Majority Leader Carbone Champions Tax Relief',
        source: 'Phoenix Business Journal',
        timestamp: 'Dec 24, 2024',
        sentiment: 'positive',
        snippet: 'House Majority Leader Michael Carbone announced a package of tax relief measures...',
      },
      {
        id: 'media-az-003',
        type: 'press-release',
        title: 'Carbone Announces Technology Innovation Task Force',
        source: 'Office of the Majority Leader',
        timestamp: 'Dec 26, 2024',
        sentiment: 'positive',
        snippet: 'Majority Leader Carbone unveils new bipartisan technology task force...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 82,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 20 },
        { year: 2022, margin: 18 },
      ],
      lastGeneralMargin: '18 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'high',
      reasons: [
        'Majority Leader role critical for Republican caucus strategy',
        'Business-friendly district needs sophisticated digital presence',
        'High-dollar donor base requires professional campaign infrastructure',
      ],
      pipelineStatus: 'contacted',
      campaignContactEmail: 'team@carboneforaz.com',
    },
    
    aiStrategy: {
      angle: 'Lead with economic impact and business competitiveness. Use data-driven arguments.',
      avoid: 'Avoid social issues framing. Stick to fiscal and economic angles.',
      nextStep: 'Provide economic analysis on HB 90. Offer to arrange business stakeholder meetings.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'vote',
        message: 'HB 90 markup session',
        date: 'Dec 21, 2025',
      },
    ],
  },
  
  {
    id: 'leg-az-003',
    name: 'Oscar De Los Santos',
    title: 'House Minority Leader',
    chamber: 'House',
    district: 'LD-16',
    party: 'D',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 16, 2025',
    nextRecommendedTouch: 'Jan 2, 2026',
    photoUrl: 'https://azleg.gov/alisImages/MemberPhotos/57leg/House/DE_LOS_SANTOS.jpg',
    initials: 'OD',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Education', role: 'Member' },
      { name: 'Health & Human Services', role: 'Member' },
      { name: 'Leadership', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Education', strength: 96 },
      { issue: 'Healthcare', strength: 91 },
      { issue: 'Immigration', strength: 85 },
      { issue: 'Housing', strength: 79 },
    ],
    
    careAbout: [
      'K-12 funding and teacher support',
      'Healthcare access for underserved communities',
      'Immigration reform and family unity',
      'Affordable housing development',
    ],
    
    districtSnapshot: 'LD-16 includes Maryvale and West Phoenix with diverse, working-class Latino communities.',
    relationshipOwner: 'Jennifer Martinez',
    
    staff: [
      {
        id: 'staff-az-005',
        name: 'Maria Rodriguez',
        role: 'Chief of Staff',
        email: 'maria.rodriguez@azleg.gov',
        phone: '(602) 926-3400',
        notes: 'Coordinates minority caucus strategy and community outreach',
        lastContacted: 'Dec 16, 2025',
      },
      {
        id: 'staff-az-006',
        name: 'Carlos Mendoza',
        role: 'Policy Director',
        email: 'carlos.mendoza@azleg.gov',
        phone: '(602) 926-3401',
        notes: 'Focuses on education and healthcare policy',
      },
    ],
    
    officePhone: '(602) 926-3400',
    capitolOffice: 'State Capitol, Room 205',
    districtOffice: '5050 W Thomas Rd, Phoenix, AZ 85031',
    email: 'odelossantos@azleg.gov',
    preferredContactPath: 'Email or call Chief of Staff directly',
    
    sponsoredBills: [
      {
        id: 'bill-002',
        number: 'SB 1205',
        title: 'Healthcare Workforce Expansion Act',
        status: 'Floor',
        nextActionDate: 'Dec 27, 2024',
        stance: 'support',
        riskScore: 2,
        sponsorshipType: 'primary',
      },
      {
        id: 'bill-005',
        number: 'HB 4512',
        title: 'Education Funding & Teacher Pay Act',
        status: 'Committee',
        nextActionDate: 'Dec 26, 2024',
        stance: 'support',
        riskScore: 4,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-008',
        number: 'HB 6104',
        title: 'Affordable Housing & Zoning Reform Act',
        status: 'Committee',
        nextActionDate: 'Jan 10, 2025',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-003',
        type: 'meeting',
        title: 'Meeting: Education funding coalition briefing',
        date: 'Dec 16, 2025',
        time: '10:30 AM',
        owner: 'Jennifer Martinez',
        linkedBills: ['HB 4512'],
        linkedIssues: ['Education'],
        notes: 'Leader committed to pushing HB 4512. Seeking Republican co-sponsors.',
      },
      {
        id: 'int-az-004',
        type: 'call',
        title: 'Call: Healthcare workforce strategy',
        date: 'Dec 12, 2025',
        time: '3:00 PM',
        owner: 'Jennifer Martinez',
        linkedBills: ['SB 1205'],
        notes: 'Discussed floor strategy for healthcare bill. Strong bipartisan support.',
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-003',
        type: 'press-release',
        title: 'House Democrats Unveil Education Investment Plan',
        source: 'House Democratic Caucus',
        timestamp: 'Dec 23, 2024',
        sentiment: 'positive',
        snippet: 'House Minority Leader Oscar De Los Santos unveiled a comprehensive education funding proposal...',
      },
      {
        id: 'media-az-004',
        type: 'news',
        title: 'De Los Santos Champions Healthcare Bill Ahead of Floor Vote',
        source: 'Arizona Daily Star',
        timestamp: 'Dec 25, 2024',
        sentiment: 'positive',
        snippet: 'Minority Leader rallies support for healthcare workforce expansion...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 88,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 28 },
        { year: 2022, margin: 26 },
      ],
      lastGeneralMargin: '26 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'medium',
      reasons: [
        'Minority Leader position influential for Democratic priorities',
        'District has high voter turnout needs for base mobilization',
        'Community organizing infrastructure could be strengthened',
      ],
      pipelineStatus: 'added',
      campaignContactEmail: 'contact@delossantosforaz.com',
    },
    
    aiStrategy: {
      angle: 'Emphasize community impact and equity. Connect to economic mobility and family stability.',
      avoid: 'Don\'t be overly technical. Use accessible language and local examples.',
      nextStep: 'Provide district-specific data on education funding impacts. Offer community stakeholder connections.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'vote',
        message: 'SB 1205 floor vote',
        date: 'Dec 19, 2025',
      },
      {
        type: 'hearing',
        message: 'HB 4512 committee hearing',
        date: 'Dec 27, 2025',
      },
    ],
  },
  
  {
    id: 'leg-az-004',
    name: 'John Kavanagh',
    title: 'Senate Majority Leader',
    chamber: 'Senate',
    district: 'LD-3',
    party: 'R',
    priority: 'A',
    relationshipStatus: 'needs-follow-up',
    lastInteraction: 'Nov 20, 2025',
    nextRecommendedTouch: 'Dec 20, 2025',
    photoUrl: 'https://www.azleg.gov/alisImages/MemberPhotos/57leg/Senate/KAVANAGH.jpg',
    initials: 'JK',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: false,
    
    committees: [
      { name: 'Appropriations', role: 'Chair' },
      { name: 'Judiciary', role: 'Member' },
      { name: 'Leadership', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Public Safety', strength: 94 },
      { issue: 'Budget & Finance', strength: 90 },
      { issue: 'Criminal Justice', strength: 87 },
      { issue: 'Government Reform', strength: 73 },
    ],
    
    careAbout: [
      'Law enforcement funding and support',
      'Fiscal responsibility and balanced budgets',
      'Sentencing reform and crime reduction',
      'Government efficiency and accountability',
    ],
    
    districtSnapshot: 'LD-3 covers Fountain Hills and Northeast Scottsdale with conservative, affluent voters.',
    relationshipOwner: 'Marcus Johnson',
    
    staff: [
      {
        id: 'staff-az-007',
        name: 'Patricia Johnson',
        role: 'Chief of Staff',
        email: 'patricia.johnson@azleg.gov',
        phone: '(602) 926-5200',
        notes: 'Very selective with Senator\'s schedule. Requires detailed briefing materials.',
        lastContacted: 'Nov 20, 2025',
      },
      {
        id: 'staff-az-008',
        name: 'Michael Stevens',
        role: 'Appropriations LA',
        email: 'michael.stevens@azleg.gov',
        phone: '(602) 926-5201',
        notes: 'Primary contact for all budget-related matters',
      },
    ],
    
    officePhone: '(602) 926-5200',
    capitolOffice: 'State Capitol, Room 302',
    districtOffice: '16838 E Palisades Blvd, Fountain Hills, AZ 85268',
    email: 'jkavanagh@azleg.gov',
    preferredContactPath: 'Submit written requests to Chief of Staff with detailed agenda',
    
    sponsoredBills: [
      {
        id: 'bill-007',
        number: 'HB 7823',
        title: 'Cybersecurity Standards Act',
        status: 'Introduced',
        nextActionDate: 'Jan 15, 2025',
        stance: 'support',
        riskScore: 4,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-003',
        number: 'HB 90',
        title: 'Data Privacy & Consumer Protection Act',
        status: 'Committee',
        nextActionDate: 'Dec 21, 2025',
        stance: 'oppose',
        riskScore: 7,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-005',
        type: 'meeting',
        title: 'Meeting: Budget outlook briefing',
        date: 'Nov 20, 2025',
        time: '11:00 AM',
        owner: 'Marcus Johnson',
        notes: 'Senator outlined fiscal priorities for session. Emphasized need for budget discipline.',
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-004',
        type: 'news',
        title: 'Senate Leader Kavanagh Takes Hard Line on Budget',
        source: 'Arizona Republic',
        timestamp: 'Dec 2, 2025',
        sentiment: 'neutral',
        snippet: 'Senate Majority Leader John Kavanagh signaled he will oppose new spending without revenue offsets...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 85,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 22 },
        { year: 2022, margin: 20 },
      ],
      lastGeneralMargin: '20 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'medium',
      reasons: [
        'Majority Leader position strategically important',
        'Safe seat but leadership role requires strong fundraising apparatus',
        'District demographics stable but aging',
      ],
      pipelineStatus: 'none',
      campaignContactEmail: 'info@kavanaghforaz.com',
    },
    
    aiStrategy: {
      angle: 'Frame through fiscal responsibility lens. Emphasize cost savings and efficiency.',
      avoid: 'Avoid requests for new spending without clear ROI. Don\'t rush the decision process.',
      nextStep: 'Schedule follow-up meeting. Provide comprehensive fiscal analysis with CBO-style scoring.',
      confidence: 'medium',
    },
    
    alerts: [
      {
        type: 'follow-up',
        message: 'Follow-up from Nov 20 budget meeting',
        date: 'Dec 20, 2025',
      },
    ],
  },
  
  {
    id: 'leg-az-005',
    name: 'Priya Sundareshan',
    title: 'Senate Minority Leader',
    chamber: 'Senate',
    district: 'LD-18',
    party: 'D',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 15, 2025',
    nextRecommendedTouch: 'Jan 8, 2026',
    photoUrl: 'https://www.azleg.gov/alisImages/MemberPhotos/57leg/Senate/SUNDARESHAN.jpg',
    initials: 'PS',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Judiciary', role: 'Member' },
      { name: 'Commerce & Public Safety', role: 'Member' },
      { name: 'Leadership', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Civil Rights', strength: 98 },
      { issue: 'Criminal Justice Reform', strength: 93 },
      { issue: 'Environmental Justice', strength: 87 },
      { issue: 'Labor Rights', strength: 84 },
    ],
    
    careAbout: [
      'Criminal justice reform and sentencing equity',
      'Voting rights and access',
      'Environmental protection and climate action',
      'Workers\' rights and wage fairness',
    ],
    
    districtSnapshot: 'LD-18 includes University of Arizona area in Tucson with young, progressive voters and strong activist community.',
    relationshipOwner: 'Sarah Chen',
    
    staff: [
      {
        id: 'staff-az-009',
        name: 'Rachel Kim',
        role: 'Chief of Staff',
        email: 'rachel.kim@azleg.gov',
        phone: '(602) 926-5300',
        notes: 'Coordinates minority caucus strategy and coalition building',
        lastContacted: 'Dec 15, 2025',
      },
      {
        id: 'staff-az-010',
        name: 'Daniel Martinez',
        role: 'Policy Director',
        email: 'daniel.martinez@azleg.gov',
        phone: '(602) 926-5301',
        notes: 'Handles judiciary and civil rights issues',
      },
    ],
    
    officePhone: '(602) 926-5300',
    capitolOffice: 'State Capitol, Room 208',
    districtOffice: '200 E Congress St, Tucson, AZ 85701',
    email: 'psundareshan@azleg.gov',
    preferredContactPath: 'Email preferred. Chief of Staff very responsive.',
    
    sponsoredBills: [
      {
        id: 'bill-003',
        number: 'HB 90',
        title: 'Data Privacy & Consumer Protection Act',
        status: 'Committee',
        nextActionDate: 'Dec 21, 2025',
        stance: 'support',
        riskScore: 3,
        sponsorshipType: 'co-sponsor',
      },
      {
        id: 'bill-008',
        number: 'HB 6104',
        title: 'Affordable Housing & Zoning Reform Act',
        status: 'Committee',
        nextActionDate: 'Jan 10, 2025',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-001',
        number: 'HB 2847',
        title: 'Clean Energy Grid Modernization Act',
        status: 'Committee',
        nextActionDate: 'Dec 20, 2025',
        stance: 'support',
        riskScore: 3,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-006',
        type: 'meeting',
        title: 'Meeting: Climate policy coalition meeting',
        date: 'Dec 15, 2025',
        time: '1:30 PM',
        owner: 'Sarah Chen',
        linkedBills: ['HB 2847'],
        linkedIssues: ['Climate', 'Energy'],
        notes: 'Senator committed to supporting clean energy bill. Discussed amendment strategies.',
      },
      {
        id: 'int-az-007',
        type: 'email',
        title: 'Email: Privacy bill stakeholder feedback',
        date: 'Dec 10, 2025',
        time: '9:45 AM',
        owner: 'Sarah Chen',
        linkedBills: ['HB 90'],
        linkedIssues: ['Privacy', 'Consumer Protection'],
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-005',
        type: 'press-release',
        title: 'Senate Democrats Announce Progressive Policy Agenda',
        source: 'Senate Democratic Caucus',
        timestamp: 'Dec 8, 2025',
        sentiment: 'positive',
        snippet: 'Senate Minority Leader Priya Sundareshan outlined an ambitious agenda focused on justice and equity...',
      },
      {
        id: 'media-az-006',
        type: 'news',
        title: 'Sundareshan Leads Push for Criminal Justice Reform',
        source: 'Arizona Daily Star',
        timestamp: 'Dec 3, 2025',
        sentiment: 'positive',
        snippet: 'Senator Priya Sundareshan is spearheading efforts to reform sentencing guidelines...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 90,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 32 },
        { year: 2022, margin: 30 },
      ],
      lastGeneralMargin: '30 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'high',
      reasons: [
        'Minority Leader position critical for Democratic strategy',
        'Progressive district requires strong digital and organizing infrastructure',
        'Youth voter mobilization essential for maintaining margins',
      ],
      pipelineStatus: 'contacted',
      campaignContactEmail: 'contact@sundareshanforaz.com',
    },
    
    aiStrategy: {
      angle: 'Lead with equity and justice framing. Emphasize community voices and grassroots support.',
      avoid: 'Don\'t use corporate or business-first language. Focus on people and communities.',
      nextStep: 'Coordinate with coalition partners. Provide community impact analysis and stakeholder testimonials.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'hearing',
        message: 'HB 90 committee markup',
        date: 'Dec 21, 2025',
      },
      {
        type: 'meeting',
        message: 'Climate coalition strategy session',
        date: 'Jan 8, 2025',
      },
    ],
  },
  
  {
    id: 'leg-az-006',
    name: 'Warren Petersen',
    title: 'President of the Senate',
    chamber: 'Senate',
    district: 'LD-1',
    party: 'R',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 11, 2025',
    nextRecommendedTouch: 'Jan 6, 2026',
    photoUrl: 'https://www.azleg.gov/alisImages/MemberPhotos/57leg/Senate/PETERSEN.jpg',
    initials: 'WP',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Rules', role: 'Chair' },
      { name: 'Finance', role: 'Member' },
      { name: 'Leadership', role: 'Chair' },
    ],
    
    issueAffinities: [
      { issue: 'Election Integrity', strength: 95 },
      { issue: 'Property Rights', strength: 88 },
      { issue: 'Water Policy', strength: 82 },
      { issue: 'Tax Policy', strength: 79 },
    ],
    
    careAbout: [
      'Election security and voter integrity',
      'Property rights and local control',
      'Water rights for rural communities',
      'Tax relief and government efficiency',
    ],
    
    districtSnapshot: 'LD-1 covers Gilbert and East Mesa with conservative suburban families and small business owners.',
    relationshipOwner: 'Marcus Johnson',
    
    staff: [
      {
        id: 'staff-az-011',
        name: 'Thomas Anderson',
        role: 'Chief of Staff',
        email: 'thomas.anderson@azleg.gov',
        phone: '(602) 926-5400',
        notes: 'Manages Senate operations and President\'s schedule. Very organized and responsive.',
        lastContacted: 'Dec 11, 2025',
      },
      {
        id: 'staff-az-012',
        name: 'Elizabeth Wilson',
        role: 'Policy Director',
        email: 'elizabeth.wilson@azleg.gov',
        phone: '(602) 926-5401',
        notes: 'Coordinates committee assignments and legislative strategy',
      },
    ],
    
    officePhone: '(602) 926-5400',
    capitolOffice: 'State Capitol, Senate President\'s Office',
    districtOffice: '2900 E Baseline Rd, Gilbert, AZ 85234',
    email: 'wpetersen@azleg.gov',
    preferredContactPath: 'Route all requests through Chief of Staff',
    
    sponsoredBills: [
      {
        id: 'bill-004',
        number: 'SB 3891',
        title: 'Water Conservation & Drought Resilience Act',
        status: 'Second Chamber',
        nextActionDate: 'Dec 23, 2025',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-006',
        number: 'SB 2156',
        title: 'Regional Transit Expansion Act',
        status: 'Committee',
        nextActionDate: 'Jan 8, 2025',
        stance: 'neutral',
        riskScore: 6,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-az-008',
        type: 'meeting',
        title: 'Meeting: Legislative session planning',
        date: 'Dec 11, 2025',
        time: '10:00 AM',
        owner: 'Marcus Johnson',
        notes: 'President outlined session priorities. Water policy and election integrity top of list.',
      },
      {
        id: 'int-az-009',
        type: 'call',
        title: 'Call: Water conservation bill discussion',
        date: 'Dec 5, 2025',
        time: '2:30 PM',
        owner: 'Marcus Johnson',
        linkedBills: ['SB 3891'],
        linkedIssues: ['Water'],
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-az-007',
        type: 'news',
        title: 'Senate President Petersen Sets Session Agenda',
        source: 'Arizona Capitol Times',
        timestamp: 'Dec 7, 2025',
        sentiment: 'neutral',
        snippet: 'Senate President Warren Petersen laid out his priorities for the upcoming legislative session...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'safe',
      competitivenessScore: 83,
      confidence: 'high',
      recentMarginTrend: [
        { year: 2020, margin: 19 },
        { year: 2022, margin: 17 },
      ],
      lastGeneralMargin: '17 points',
      fundraisingStatus: 'strong',
    },
    
    servicesOpportunity: {
      opportunityLevel: 'high',
      reasons: [
        'Senate President position most influential in chamber',
        'East Valley growth area with increasing campaign sophistication needs',
        'Leadership role requires robust fundraising and digital infrastructure',
      ],
      pipelineStatus: 'added',
      campaignContactEmail: 'team@petersenforaz.com',
    },
    
    aiStrategy: {
      angle: 'Frame through property rights and local control. Emphasize constituent impact in Gilbert/Mesa.',
      avoid: 'Avoid federal government comparisons. Focus on state sovereignty and local issues.',
      nextStep: 'Provide district-specific water usage data. Schedule briefing with Policy Director.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'hearing',
        message: 'Session organization meeting',
        date: 'Jan 6, 2025',
      },
      {
        type: 'vote',
        message: 'SB 3891 House committee assignment',
        date: 'Dec 23, 2025',
      },
    ],
  },
  
  // EXISTING LEGISLATORS
  {
    id: 'leg-001',
    name: 'Sarah Martinez',
    title: 'Representative',
    chamber: 'House',
    district: 'LD-15',
    party: 'D',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 12, 2025',
    nextRecommendedTouch: 'Dec 20, 2025',
    initials: 'SM',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Energy & Environment', role: 'Chair' },
      { name: 'Appropriations', role: 'Member' },
      { name: 'Commerce', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Clean Energy', strength: 95 },
      { issue: 'Water Resources', strength: 82 },
      { issue: 'Economic Development', strength: 71 },
      { issue: 'Education', strength: 65 },
    ],
    
    careAbout: [
      'Solar expansion and grid reliability',
      'Water conservation in drought-prone districts',
      'Small business incentives',
      'K-12 funding equity',
    ],
    
    districtSnapshot: 'LD-15 includes East Phoenix suburbs with strong solar industry presence and growing tech sector.',
    relationshipOwner: 'Jordan Davis',
    
    staff: [
      {
        id: 'staff-001',
        name: 'Michael Chen',
        role: 'Chief of Staff',
        email: 'michael.chen@azleg.gov',
        phone: '(602) 926-4321',
        notes: 'Handles all scheduling and high-level strategy',
        lastContacted: 'Dec 10, 2025',
      },
      {
        id: 'staff-002',
        name: 'Rebecca Torres',
        role: 'Energy & Environment LA',
        email: 'rebecca.torres@azleg.gov',
        phone: '(602) 926-4322',
        notes: 'Primary contact for HB-series energy bills',
        lastContacted: 'Dec 12, 2025',
      },
      {
        id: 'staff-003',
        name: 'David Kim',
        role: 'District Director',
        email: 'david.kim@azleg.gov',
        phone: '(480) 555-0190',
        notes: 'Manages constituent services and local events',
      },
    ],
    
    officePhone: '(602) 926-4320',
    capitolOffice: 'State Capitol, Room 341',
    districtOffice: '1850 E Southern Ave, Mesa, AZ 85204',
    email: 'smartinez@azleg.gov',
    preferredContactPath: 'Route through Energy LA (Rebecca Torres)',
    
    sponsoredBills: [
      {
        id: 'bill-1',
        number: 'HB 2847',
        title: 'Renewable Energy Standards Act',
        status: 'Committee',
        nextActionDate: 'Dec 20, 2025',
        stance: 'support',
        riskScore: 4,
        sponsorshipType: 'co-sponsor',
      },
      {
        id: 'bill-006',
        number: 'SB 1789',
        title: 'State Budget Stabilization',
        status: 'Committee',
        nextActionDate: 'Jan 15, 2025',
        sponsorshipType: 'primary',
      },
      {
        id: 'bill-007',
        number: 'SB 1654',
        title: 'Energy Infrastructure Tax Credits',
        status: 'Draft',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-004',
        number: 'SB 1501',
        title: 'Renewable Energy Standards Update',
        status: 'Senate Committee',
        nextActionDate: 'Dec 21, 2025',
        stance: 'support',
        riskScore: 4,
        sponsorshipType: 'co-sponsor',
      },
      {
        id: 'bill-005',
        number: 'HB 2234',
        title: 'Energy Choice Act',
        status: 'Committee',
        stance: 'oppose',
        riskScore: 8,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-001',
        type: 'meeting',
        title: 'Meeting note: HB 2145 strategy session',
        date: 'Dec 12, 2025',
        time: '2:30 PM',
        owner: 'Jordan Davis',
        linkedBills: ['HB 2145'],
        linkedIssues: ['Clean Energy'],
        notes: 'Discussed amendment language for solar permitting streamline. Rep. Martinez receptive to industry input.',
      },
      {
        id: 'int-002',
        type: 'call',
        title: 'Call with Rebecca Torres (Energy LA)',
        date: 'Dec 10, 2025',
        time: '11:15 AM',
        owner: 'Jordan Davis',
        linkedBills: ['HB 2145'],
        notes: 'Confirmed committee hearing date. Discussed witness list.',
      },
      {
        id: 'int-003',
        type: 'email',
        title: 'Email: Grid modernization briefing materials',
        date: 'Dec 5, 2025',
        time: '9:00 AM',
        owner: 'Matt Kenney',
        linkedBills: ['HB 2098'],
        linkedIssues: ['Clean Energy'],
      },
      {
        id: 'int-004',
        type: 'meeting',
        title: 'Coffee meeting at Capitol (annual catch-up)',
        date: 'Nov 28, 2025',
        time: '8:00 AM',
        owner: 'Matt Kenney',
        notes: 'Relationship building. Discussed session priorities.',
      },
      {
        id: 'int-005',
        type: 'note',
        title: 'Research note: LD-15 solar installation data',
        date: 'Nov 20, 2025',
        time: '3:45 PM',
        owner: 'Jordan Davis',
        linkedIssues: ['Clean Energy'],
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-001',
        type: 'news',
        title: 'Rep. Martinez Leads Push for Solar Expansion',
        source: 'Arizona Republic',
        timestamp: 'Dec 14, 2025',
        sentiment: 'positive',
        snippet: 'House Energy Chair Sarah Martinez announced new legislation to accelerate solar deployment...',
      },
      {
        id: 'media-002',
        type: 'press-release',
        title: 'Martinez: "Clean Energy is Economic Growth"',
        source: 'Rep. Martinez Press Office',
        timestamp: 'Dec 10, 2025',
        sentiment: 'positive',
        snippet: 'Representative Martinez released a statement supporting HB 2145...',
      },
      {
        id: 'media-003',
        type: 'social',
        title: 'Twitter: Committee hearing update',
        source: '@RepMartinezAZ',
        timestamp: 'Dec 8, 2025',
        sentiment: 'neutral',
        snippet: 'Looking forward to our Energy Committee hearing next week on grid modernization...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'lean',
      competitivenessScore: 65,
      confidence: 'medium',
      recentMarginTrend: [
        { year: 2020, margin: 12 },
        { year: 2022, margin: 10 },
      ],
      lastGeneralMargin: '12 points',
      fundraisingStatus: 'strong',
      candidateField: [
        {
          name: 'Sarah Martinez',
          status: 'filed',
          party: 'D',
          sourceUrl: 'https://martinezforaz.com',
        },
        {
          name: 'John Doe',
          status: 'announced',
          party: 'R',
          sourceUrl: 'https://doeforaz.com',
        },
      ],
    },
    
    servicesOpportunity: {
      opportunityLevel: 'high',
      reasons: [
        'Competitive district with shifting demographics',
        'Incumbent vulnerability based on recent margin trends',
        'Strong fundraising needed to maintain seat',
      ],
      pipelineStatus: 'added',
      campaignContactEmail: 'campaign@martinezforaz.com',
    },
    
    aiStrategy: {
      angle: 'Frame as reliability + consumer protection. Emphasize job creation in LD-15.',
      avoid: 'Don\'t frame as mandate. She\'s sensitive to rural district concerns.',
      nextStep: 'Ask Energy LA for amendment concerns; offer draft language on permitting timeline.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'hearing',
        message: 'Energy Committee hearing on HB 2145',
        date: 'Dec 19, 2025',
      },
      {
        type: 'vote',
        message: 'Floor vote window opens for HB 2098',
        date: 'Jan 8, 2025',
      },
    ],
  },
  
  {
    id: 'leg-002',
    name: 'James Patterson',
    title: 'Senator',
    chamber: 'Senate',
    district: 'LD-23',
    party: 'R',
    priority: 'A',
    relationshipStatus: 'needs-follow-up',
    lastInteraction: 'Nov 15, 2025',
    nextRecommendedTouch: 'Dec 18, 2025',
    initials: 'JP',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: false,
    
    committees: [
      { name: 'Appropriations', role: 'Chair' },
      { name: 'Finance', role: 'Vice Chair' },
      { name: 'Energy & Environment', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Fiscal Policy', strength: 98 },
      { issue: 'Energy', strength: 75 },
      { issue: 'Tax Reform', strength: 88 },
      { issue: 'Infrastructure', strength: 70 },
    ],
    
    careAbout: [
      'Budget discipline and fiscal restraint',
      'Market-based energy solutions',
      'Tax competitiveness',
      'Infrastructure investment ROI',
    ],
    
    districtSnapshot: 'LD-23 covers North Scottsdale and Cave Creek with affluent, fiscally conservative voters.',
    relationshipOwner: 'Matt Kenney',
    
    staff: [
      {
        id: 'staff-004',
        name: 'Amanda Richards',
        role: 'Chief of Staff',
        email: 'amanda.richards@azleg.gov',
        phone: '(602) 926-5100',
        notes: 'Gate-keeper. Very protective of Senator\'s time.',
        lastContacted: 'Nov 15, 2025',
      },
      {
        id: 'staff-005',
        name: 'Tom Schneider',
        role: 'Budget & Finance LA',
        email: 'tom.schneider@azleg.gov',
        phone: '(602) 926-5101',
        notes: 'Handles all appropriations and fiscal analysis',
      },
      {
        id: 'staff-006',
        name: 'Lisa Mendez',
        role: 'Policy Director',
        email: 'lisa.mendez@azleg.gov',
        phone: '(602) 926-5102',
      },
    ],
    
    officePhone: '(602) 926-5100',
    capitolOffice: 'State Capitol, Room 205',
    districtOffice: '8687 E Via de Ventura, Scottsdale, AZ 85258',
    email: 'jpatterson@azleg.gov',
    preferredContactPath: 'CoS screens all meeting requests',
    
    sponsoredBills: [
      {
        id: 'bill-006',
        number: 'SB 1789',
        title: 'State Budget Stabilization',
        status: 'Committee',
        nextActionDate: 'Jan 15, 2025',
        sponsorshipType: 'primary',
      },
      {
        id: 'bill-007',
        number: 'SB 1654',
        title: 'Energy Infrastructure Tax Credits',
        status: 'Draft',
        stance: 'support',
        riskScore: 5,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [
      {
        id: 'bill-008',
        number: 'HB 2145',
        title: 'Solar Deployment Acceleration Act',
        status: 'Committee',
        nextActionDate: 'Dec 19, 2025',
        stance: 'neutral',
        riskScore: 6,
        sponsorshipType: 'co-sponsor',
      },
    ],
    
    interactions: [
      {
        id: 'int-006',
        type: 'meeting',
        title: 'Meeting note: Budget priorities discussion',
        date: 'Nov 15, 2025',
        time: '10:00 AM',
        owner: 'Matt Kenney',
        linkedBills: ['SB 1789'],
        notes: 'Covered session budget outlook. Senator open to energy infrastructure spending if framed as economic development.',
      },
      {
        id: 'int-007',
        type: 'email',
        title: 'Email: Tax credit analysis for renewable energy',
        date: 'Oct 28, 2025',
        time: '2:15 PM',
        owner: 'Matt Kenney',
        linkedIssues: ['Energy', 'Fiscal Policy'],
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-004',
        type: 'news',
        title: 'Senate Budget Chair Unveils Fiscal Plan',
        source: 'Phoenix Business Journal',
        timestamp: 'Dec 1, 2025',
        sentiment: 'neutral',
        snippet: 'Senator James Patterson outlined a conservative approach to the state budget...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'lean',
      competitivenessScore: 65,
      confidence: 'medium',
      recentMarginTrend: [
        { year: 2020, margin: 12 },
        { year: 2022, margin: 10 },
      ],
      lastGeneralMargin: '12 points',
      fundraisingStatus: 'strong',
      candidateField: [
        {
          name: 'James Patterson',
          status: 'filed',
          party: 'R',
          sourceUrl: 'https://pattersonforaz.com',
        },
        {
          name: 'Jane Smith',
          status: 'announced',
          party: 'D',
          sourceUrl: 'https://smithforaz.com',
        },
      ],
    },
    
    servicesOpportunity: {
      opportunityLevel: 'medium',
      reasons: [
        'Safe R seat but Appropriations Chair influence high',
        'Campaign could use digital strategy refresh',
      ],
      pipelineStatus: 'none',
      campaignContactEmail: 'contact@pattersonforaz.com',
    },
    
    aiStrategy: {
      angle: 'Frame as fiscally responsible investment with measurable ROI. Emphasize private sector partnership.',
      avoid: 'Don\'t use "green" language. Focus on economics, not environment.',
      nextStep: 'Schedule follow-up meeting through CoS. Provide economic impact analysis.',
      confidence: 'medium',
    },
    
    alerts: [
      {
        type: 'follow-up',
        message: 'Overdue follow-up from Nov 15 meeting',
        date: 'Dec 18, 2025',
      },
    ],
  },
  
  {
    id: 'leg-003',
    name: 'Robert "Bob" Johnson',
    title: 'Representative',
    chamber: 'House',
    district: 'LD-08',
    party: 'R',
    priority: 'B',
    relationshipStatus: 'cold',
    lastInteraction: 'Sep 22, 2025',
    nextRecommendedTouch: 'Dec 22, 2025',
    initials: 'BJ',
    watched: false,
    hasNotes: false,
    hasUpcomingMeeting: false,
    
    committees: [
      { name: 'Agriculture & Water', role: 'Vice Chair' },
      { name: 'Natural Resources', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Water Rights', strength: 92 },
      { issue: 'Agriculture', strength: 85 },
      { issue: 'Property Rights', strength: 78 },
    ],
    
    careAbout: [
      'Protecting agricultural water rights',
      'Rural economic development',
      'Property rights and local control',
    ],
    
    districtSnapshot: 'LD-08 is rural Yuma County with extensive agriculture and border issues.',
    relationshipOwner: 'Unassigned',
    
    staff: [
      {
        id: 'staff-007',
        name: 'Carol Stevens',
        role: 'Chief of Staff',
        email: 'carol.stevens@azleg.gov',
        phone: '(602) 926-3456',
      },
    ],
    
    officePhone: '(602) 926-3456',
    capitolOffice: 'State Capitol, Room 128',
    districtOffice: '78 S Main St, Yuma, AZ 85364',
    
    sponsoredBills: [],
    relevantBills: [],
    interactions: [],
    mediaMentions: [],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'lean',
      competitivenessScore: 65,
      confidence: 'medium',
      recentMarginTrend: [
        { year: 2020, margin: 12 },
        { year: 2022, margin: 10 },
      ],
      lastGeneralMargin: '12 points',
      fundraisingStatus: 'strong',
      candidateField: [
        {
          name: 'Robert "Bob" Johnson',
          status: 'filed',
          party: 'R',
          sourceUrl: 'https://johnsonforaz.com',
        },
        {
          name: 'Alice Brown',
          status: 'announced',
          party: 'D',
          sourceUrl: 'https://brownforaz.com',
        },
      ],
    },
    
    servicesOpportunity: {
      opportunityLevel: 'low',
      reasons: ['Safe R seat', 'Rural district with limited campaign infrastructure needs'],
      pipelineStatus: 'none',
    },
    
    aiStrategy: {
      angle: 'Focus on water security and agricultural economic impact.',
      avoid: 'Urban-focused examples. Keep language simple and direct.',
      nextStep: 'Initial outreach to CoS. Offer rural district analysis.',
      confidence: 'low',
    },
    
    alerts: [],
  },
  
  {
    id: 'leg-004',
    name: 'Dr. Michelle Tran',
    title: 'Senator',
    chamber: 'Senate',
    district: 'LD-18',
    party: 'D',
    priority: 'A',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 15, 2025',
    nextRecommendedTouch: 'Jan 5, 2025',
    initials: 'MT',
    watched: true,
    hasNotes: true,
    hasUpcomingMeeting: true,
    
    committees: [
      { name: 'Health & Human Services', role: 'Chair' },
      { name: 'Education', role: 'Member' },
      { name: 'Commerce', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Healthcare', strength: 96 },
      { issue: 'Education', strength: 89 },
      { issue: 'Workforce Development', strength: 74 },
    ],
    
    careAbout: [
      'Healthcare access and affordability',
      'STEM education funding',
      'Workforce training programs',
      'Mental health services',
    ],
    
    districtSnapshot: 'LD-18 includes Tempe and ASU campus with young, educated voters.',
    relationshipOwner: 'Jordan Davis',
    
    staff: [
      {
        id: 'staff-008',
        name: 'Kevin Park',
        role: 'Chief of Staff',
        email: 'kevin.park@azleg.gov',
        phone: '(602) 926-7890',
        lastContacted: 'Dec 15, 2025',
      },
      {
        id: 'staff-009',
        name: 'Sarah Williams',
        role: 'Healthcare LA',
        email: 'sarah.williams@azleg.gov',
        phone: '(602) 926-7891',
        notes: 'Point person for all health policy',
        lastContacted: 'Dec 10, 2025',
      },
    ],
    
    officePhone: '(602) 926-7890',
    capitolOffice: 'State Capitol, Room 412',
    districtOffice: '1955 E Southern Ave, Tempe, AZ 85282',
    email: 'mtran@azleg.gov',
    preferredContactPath: 'Email first, then follow up with CoS',
    
    sponsoredBills: [
      {
        id: 'bill-009',
        number: 'SB 1423',
        title: 'Mental Health Parity Act',
        status: 'Committee',
        nextActionDate: 'Jan 12, 2025',
        stance: 'support',
        riskScore: 2,
        sponsorshipType: 'primary',
      },
    ],
    
    relevantBills: [],
    
    interactions: [
      {
        id: 'int-008',
        type: 'meeting',
        title: 'Meeting: Healthcare stakeholder roundtable',
        date: 'Dec 15, 2025',
        time: '1:00 PM',
        owner: 'Jordan Davis',
        linkedBills: ['SB 1423'],
        notes: 'Senator hosted roundtable. Strong support for mental health initiatives.',
      },
    ],
    
    mediaMentions: [
      {
        id: 'media-005',
        type: 'press-release',
        title: 'Sen. Tran Introduces Mental Health Legislation',
        source: 'Sen. Tran Press Office',
        timestamp: 'Dec 12, 2025',
        sentiment: 'positive',
        snippet: 'Calling it a "critical step forward," Senator Tran introduced SB 1423...',
      },
    ],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'lean',
      competitivenessScore: 65,
      confidence: 'medium',
      recentMarginTrend: [
        { year: 2020, margin: 12 },
        { year: 2022, margin: 10 },
      ],
      lastGeneralMargin: '12 points',
      fundraisingStatus: 'strong',
      candidateField: [
        {
          name: 'Dr. Michelle Tran',
          status: 'filed',
          party: 'D',
          sourceUrl: 'https://tranforaz.com',
        },
        {
          name: 'Tom Johnson',
          status: 'announced',
          party: 'R',
          sourceUrl: 'https://johnsonforaz.com',
        },
      ],
    },
    
    servicesOpportunity: {
      opportunityLevel: 'medium',
      reasons: ['Safe D seat', 'Healthcare focus could use messaging support'],
      pipelineStatus: 'none',
      campaignContactEmail: 'contact@tranforaz.com',
    },
    
    aiStrategy: {
      angle: 'Connect to workforce development and economic productivity. Cite evidence-based outcomes.',
      avoid: 'Political framing. She prefers data and research.',
      nextStep: 'Provide research brief on mental health ROI. Offer expert witness.',
      confidence: 'high',
    },
    
    alerts: [
      {
        type: 'hearing',
        message: 'Health Committee hearing on SB 1423',
        date: 'Jan 12, 2025',
      },
      {
        type: 'birthday',
        message: 'Senator Tran\'s birthday',
        date: 'Dec 28, 2025',
      },
    ],
  },
  
  {
    id: 'leg-005',
    name: 'Marcus Williams',
    title: 'Representative',
    chamber: 'House',
    district: 'LD-27',
    party: 'D',
    priority: 'B',
    relationshipStatus: 'warm',
    lastInteraction: 'Dec 8, 2025',
    nextRecommendedTouch: 'Jan 3, 2026',
    initials: 'MW',
    watched: false,
    hasNotes: true,
    hasUpcomingMeeting: false,
    
    committees: [
      { name: 'Education', role: 'Chair' },
      { name: 'Government & Elections', role: 'Member' },
    ],
    
    issueAffinities: [
      { issue: 'Education', strength: 94 },
      { issue: 'Voting Rights', strength: 81 },
      { issue: 'Criminal Justice Reform', strength: 72 },
    ],
    
    careAbout: [
      'K-12 teacher pay and retention',
      'School infrastructure funding',
      'Voting access expansion',
      'Youth programs',
    ],
    
    districtSnapshot: 'LD-27 covers West Phoenix with diverse working-class communities.',
    relationshipOwner: 'Jordan Davis',
    
    staff: [
      {
        id: 'staff-010',
        name: 'Jennifer Lopez',
        role: 'Chief of Staff',
        email: 'jennifer.lopez@azleg.gov',
        phone: '(602) 926-4567',
      },
    ],
    
    officePhone: '(602) 926-4567',
    capitolOffice: 'State Capitol, Room 215',
    districtOffice: '3840 W Bethany Home Rd, Phoenix, AZ 85019',
    
    sponsoredBills: [],
    relevantBills: [],
    interactions: [],
    mediaMentions: [],
    
    electionIntel: {
      nextElectionYear: 2026,
      upThisCycle: true,
      seatStatus: 'incumbent',
      competitivenessRating: 'lean',
      competitivenessScore: 65,
      confidence: 'medium',
      recentMarginTrend: [
        { year: 2020, margin: 12 },
        { year: 2022, margin: 10 },
      ],
      lastGeneralMargin: '12 points',
      fundraisingStatus: 'strong',
      candidateField: [
        {
          name: 'Marcus Williams',
          status: 'filed',
          party: 'D',
          sourceUrl: 'https://williamsforaz.com',
        },
        {
          name: 'Chris Lee',
          status: 'announced',
          party: 'R',
          sourceUrl: 'https://leeforaz.com',
        },
      ],
    },
    
    servicesOpportunity: {
      opportunityLevel: 'medium',
      reasons: ['Working-class district needs grassroots outreach', 'Education messaging could use amplification'],
      pipelineStatus: 'none',
      campaignContactEmail: 'contact@williamsforaz.com',
    },
    
    aiStrategy: {
      angle: 'Emphasize community impact and equity. Use local examples.',
      avoid: 'Top-down approach. He values grassroots input.',
      nextStep: 'Invite to community event. Share constituent stories.',
      confidence: 'medium',
    },
    
    alerts: [],
  },
];