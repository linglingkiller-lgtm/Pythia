import { pdf } from '@react-pdf/renderer';
import React from 'react';
import { ClientUpdateReportPdf } from '../components/pdf/ClientUpdateReportPdf';
import { saveAs } from 'file-saver';

// Define the interface for the input
interface GeneratorOptions {
  clientName: string;
  mode: 'compact' | 'expanded';
  sections: {
    includeBills: boolean;
    includeIssues: boolean;
    includeLedger: boolean;
    includeOpportunities: boolean; // mapped to something else or unused
  };
  draftData: any; // Using any for now, should be specific type
}

export const generateClientUpdatePdf = async ({ 
  clientName, 
  mode, 
  sections, 
  draftData 
}: GeneratorOptions) => {
  
  // Transform draftData into PdfData structure
  // This is where you'd map your Supabase results to the PDF structure
  // For now, we mock some parts and use draftData for others
  
  const pdfData = {
    clientName: clientName,
    dateRange: 'Last 30 Days', // Or passed in range
    metrics: {
      issues: 12,
      bills: 5,
      engagements: 8,
      deadlines: 3,
    },
    summary: "Strategic engagement has intensified over the last reporting period. Key milestones were reached with the Energy Committee, though opposition activity has notably increased. The focus for the next 14 days shifts to securing swing votes.",
    wins: draftData.find((s: any) => s.id === 'wins')?.items || [],
    risks: draftData.find((s: any) => s.id === 'risks')?.items || [],
    actions: [
      { action: 'Schedule follow-up meetings', owner: 'J. Smith', due: 'Jan 5', confidence: 'High' },
      { action: 'Draft Senate testimony', owner: 'M. Doe', due: 'Jan 7', confidence: 'Medium' },
      { action: 'Finalize coalition letter', owner: 'Team', due: 'Jan 10', confidence: 'High' }
    ],
    outlook: "The legislative session is entering a critical phase. We expect SB 456 to move to the floor next week. Opposition ads may increase public scrutiny, requiring a rapid response strategy.",
    engagementHighlights: [
      "Meeting with Rep. Martinez (Positive)",
      "Testimony at House Energy Committee",
      "Coalition strategy lunch"
    ],
    // Expanded data
    bills: [
      { number: 'HB 2847', title: 'Renewable Energy Standards Act', status: 'In Committee' },
      { number: 'SB 456', title: 'Grid Modernization Funding', status: 'Floor Vote' }
    ],
    issues: [
      { name: 'Solar Incentives', priority: 'High' },
      { name: 'Grid Reliability', priority: 'Medium' }
    ],
    engagementLedger: [
      { date: '2023-12-28', type: 'Meeting', summary: 'Discussed amendment language with Chair' },
      { date: '2023-12-20', type: 'Hearing', summary: 'Provided expert testimony on grid stability' },
      { date: '2023-12-15', type: 'Call', summary: 'Weekly sync with coalition partners' }
    ]
  };

  try {
    const blob = await pdf(
      <ClientUpdateReportPdf 
        data={pdfData} 
        mode={mode} 
        options={{
          includeBills: sections.includeBills,
          includeIssues: sections.includeIssues,
          includeLedger: sections.includeLedger
        }} 
      />
    ).toBlob();
    
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Revere_ClientUpdate_${clientName.replace(/\s+/g, '_')}_${dateStr}.pdf`;
    
    saveAs(blob, filename);
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    throw error;
  }
};
