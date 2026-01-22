export interface DossierSection {
  title: string;
  icon: string;
  content: string; // Markdown supported
  riskLevel: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface LegislatorDossier {
  legislatorId: string;
  generatedAt: string;
  overallVulnerability: 'low' | 'medium' | 'high';
  sections: DossierSection[];
}

export const mockDossiers: Record<string, LegislatorDossier> = {
  'leg-009': { // Rep. Linda Foster
    legislatorId: 'leg-009',
    generatedAt: '2025-12-16',
    overallVulnerability: 'high',
    sections: [
      {
        title: 'Voting Contradictions',
        icon: 'Scale',
        content: `
**Energy Policy Flip-Flop:**
*   Voted **YES** on HB 204 (2022) creating coal subsidies.
*   Publicly stated support for "100% Green Future" in 2024 campaign speech.
*   Current undecided stance on HB 247 puts her in a "lose-lose" with base vs. donors.
        `,
        riskLevel: 'high',
        tags: ['Hypocrisy', 'Energy']
      },
      {
        title: 'Donor Conflicts',
        icon: 'DollarSign',
        content: `
*   Top Donor: **Western Mining Corp** ($15k in 2024).
*   Constituent Pressure: District 16 polling shows 68% support for environmental protections.
*   *Strategy:* Highlight mining contributions if she votes NO to create primary challenge wedge.
        `,
        riskLevel: 'high',
        tags: ['Money in Politics', 'Mining']
      },
      {
        title: 'Public Statements',
        icon: 'MessageSquare',
        content: `
*   "We must balance economic growth with stewardship." (Town Hall, Nov 2024)
*   *Analysis:* Uses "balance" as code for inaction. Press on specific definition of "stewardship."
        `,
        riskLevel: 'medium',
        tags: ['Quotes']
      }
    ]
  }
};
