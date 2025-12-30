// Data Pull Types

export interface DataPullCriteria {
  // Legacy fields (keeping for backwards compatibility)
  partisanshipModel?: string;
  turnoutRule?: string;
  pvfSegment?: string;
  ageRange?: { min?: number; max?: number };
  religionTag?: string;
  issueTags?: string[];
  exclusions?: string[];
  
  // DEMOGRAPHIC
  demographic?: {
    birthYear?: string[];
    ageRange?: string[];
    wideAgeRange?: string[];
    reportedEthnicity?: string[];
    gender?: string[];
    ethnicity?: string[];
    religion?: string[];
    education?: string[];
    educationCollegePlus?: boolean;
  };
  
  // GEOGRAPHY
  geography?: {
    congressionalDistrict?: string[];
    stateSenateDistrict?: string[];
    stateHouseDistrict?: string[];
    county?: string[];
    city?: string[];
    precinctName?: string[];
    precinctNumber?: string[];
    zipCode?: string[];
    jurisdiction?: string[];
    mediaMarket?: string[];
    townCode?: string[];
    ward?: string[];
    stateHouseSubdivision?: string[];
    metroType?: string[];
    countyCommissioner?: string[];
    schoolBoard?: string[];
    schoolDistrict?: string[];
  };
  
  // POLITICAL
  political?: {
    modeledParty?: string[];
    reportedParty?: string[];
    partyRollup?: string[];
  };
  
  // CONTACT
  contact?: {
    hasCellPhone?: boolean;
    cellPhoneReliability?: string[];
    hasLandLine?: boolean;
    landLineReliability?: string[];
    doNotCallLandline?: boolean;
    doNotCallCell?: boolean;
  };
  
  // TURNOUT
  turnout?: {
    voteHistoryByYear?: string[];
    primary2012?: boolean;
    presidentialPrimary2012?: boolean;
    general2012?: boolean;
    primary2013?: boolean;
    general2013?: boolean;
    primary2014?: boolean;
    general2014?: boolean;
    primary2016?: boolean;
    presidentialPrimary2016?: boolean;
    general2016?: boolean;
    primary2017?: boolean;
    general2017?: boolean;
    primary2018?: boolean;
    general2018?: boolean;
    primary2019?: boolean;
    general2019?: boolean;
    primary2020?: boolean;
    presidentialPrimary2020?: boolean;
    general2020?: boolean;
    primary2021?: boolean;
    general2021?: boolean;
    primary2022?: boolean;
    general2022?: boolean;
    primary2023?: boolean;
    general2023?: boolean;
    primary2024?: boolean;
    presidentialPrimary2024?: boolean;
    general2024?: boolean;
    primary2025?: boolean;
    general2025?: boolean;
    votingFrequencyGeneral?: string[];
    votingFrequencyPrimary?: string[];
    registrationDate?: { from?: string; to?: string };
    voterStatus?: string[];
    permanentAbsentee?: boolean;
  };
  
  outputPrefs?: {
    hhRollups?: boolean;
    includePhones?: boolean;
    includeEmails?: boolean;
    includeWalkFields?: boolean;
  };
  notes?: string;
}

export interface Geography {
  mode: 'statewide' | 'counties' | 'custom';
  counties?: string[];
  notes?: string;
}

export interface Deliverable {
  type: 'sheet-summary' | 'walk-list-csv' | 'universe-only' | 'both';
  requiredColumns?: string[];
  dropDate?: string;
  distributionToggles?: {
    shareWithTeam?: boolean;
    shareToRecords?: boolean;
    createFollowUpTask?: boolean;
  };
}

export interface Approval {
  required: boolean;
  approverUserId?: string;
  status?: 'pending' | 'approved' | 'rejected';
  comments?: string;
}

export interface DataPullOutput {
  id: string;
  type: 'sheet' | 'file';
  title: string;
  url?: string;
  fileMeta?: {
    name: string;
    size: number;
    type: string;
  };
  uploadedBy: string;
  createdAt: string;
  notes?: string;
}

export interface CountyRow {
  countyName: string;
  voterCount: number;
  hhCount: number;
}

export interface ActivityEntry {
  type: 'created' | 'status-changed' | 'output-attached' | 'delivered' | 'revised' | 'edited';
  byUserId: string;
  byUserName?: string;
  timestamp: string;
  meta?: any;
}

export interface DataPull {
  id: string;
  orgId: string;
  name: string;
  projectId?: string;
  projectName?: string;
  clientId?: string;
  clientName?: string;
  state: string;
  geography: Geography;
  criteria: DataPullCriteria;
  deliverable: Deliverable;
  approval?: Approval;
  status: 'requested' | 'in-progress' | 'delivered' | 'revised' | 'archived';
  priority: 'low' | 'medium' | 'high';
  requesterUserId: string;
  requesterUserName?: string;
  assigneeUserId?: string;
  assigneeUserName?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  parentPullId?: string;
  revisionIds?: string[];
  outputs?: DataPullOutput[];
  stats?: {
    totalVoters?: number;
    totalHH?: number;
    countiesCount?: number;
  };
  countyTable?: CountyRow[];
  activity?: ActivityEntry[];
}

export interface DataPullTemplate {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  criteria: DataPullCriteria;
  state?: string;
  geography?: Geography;
  createdAt: string;
  createdBy: string;
}