export interface ScenarioNode {
  id: string;
  parentId?: string;
  label: string;
  description: string;
  probability: number; // 0-100
  type: 'root' | 'event' | 'outcome' | 'decision';
  impacts: {
    entity: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

export const mockScenarios: ScenarioNode[] = [
  {
    id: 'root',
    label: 'HB 247 Floor Vote',
    description: 'Scheduled for Dec 20th',
    probability: 100,
    type: 'root',
    impacts: []
  },
  {
    id: 'pass',
    parentId: 'root',
    label: 'Bill Passes',
    description: 'Passes with >31 votes',
    probability: 65,
    type: 'event',
    impacts: [
      { entity: 'Phoenix Energy', impact: 'positive', description: 'Immediate stock value increase', severity: 'high' },
      { entity: 'Mining Assoc', impact: 'negative', description: 'New regulations trigger audit', severity: 'medium' }
    ]
  },
  {
    id: 'fail',
    parentId: 'root',
    label: 'Bill Fails',
    description: 'Fails <31 votes',
    probability: 35,
    type: 'event',
    impacts: [
      { entity: 'Phoenix Energy', impact: 'negative', description: 'Delays project start by 1 year', severity: 'high' }
    ]
  },
  {
    id: 'pass-amend',
    parentId: 'pass',
    label: 'Gov Vetoes',
    description: 'Governor cites budget concerns',
    probability: 15,
    type: 'outcome',
    impacts: [
      { entity: 'Phoenix Energy', impact: 'negative', description: 'Requires override campaign', severity: 'high' }
    ]
  },
  {
    id: 'pass-sign',
    parentId: 'pass',
    label: 'Gov Signs',
    description: 'Standard enactment',
    probability: 85,
    type: 'outcome',
    impacts: [
      { entity: 'State of AZ', impact: 'positive', description: 'Federal grant eligibility unlocked', severity: 'medium' }
    ]
  }
];
