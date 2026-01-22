export interface MeetingAnalysis {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Contentious';
  keyTopics: string[];
  tasks: {
    id: string;
    title: string;
    assignee?: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'pending' | 'created';
  }[];
  insights: string[];
  entities: {
    name: string;
    type: 'Person' | 'Bill' | 'Organization' | 'Date';
  }[];
}

export const generateMeetingAnalysis = (transcript: string): Promise<MeetingAnalysis> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        summary: "The meeting focused on the strategic approach for HB 247. Concerns were raised regarding the amendment timeline and its impact on the Desert Solar Coalition. The team agreed to prioritize scheduling meetings with swing voters on the Energy Committee and to finalize the technical briefing document by Friday.",
        sentiment: 'Neutral',
        keyTopics: ['HB 247', 'Desert Solar Coalition', 'Energy Committee', 'Technical Briefing'],
        tasks: [
          {
            id: 'task-1',
            title: 'Schedule meeting with Sen. Thompson',
            assignee: 'Legislative Team',
            priority: 'High',
            status: 'pending'
          },
          {
            id: 'task-2',
            title: 'Finalize technical briefing for HB 247',
            assignee: 'Policy Research',
            priority: 'High',
            status: 'pending'
          },
          {
            id: 'task-3',
            title: 'Draft client update for Desert Solar',
            assignee: 'Account Manager',
            priority: 'Medium',
            status: 'pending'
          }
        ],
        insights: [
          "Sen. Thompson is identified as a critical swing vote requiring immediate attention.",
          "The timeline for HB 247 amendments is tighter than anticipated.",
          "Client expectations regarding the technical briefing need to be managed."
        ],
        entities: [
          { name: 'HB 247', type: 'Bill' },
          { name: 'Desert Solar Coalition', type: 'Organization' },
          { name: 'Sen. Thompson', type: 'Person' },
          { name: 'Friday', type: 'Date' }
        ]
      });
    }, 2000);
  });
};
