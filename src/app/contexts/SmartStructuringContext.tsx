import React, { createContext, useContext, useState } from 'react';

export interface DetectedEntity {
  type: 'bill' | 'legislator' | 'client' | 'committee' | 'project';
  id: string;
  name: string;
  startIndex: number;
  endIndex: number;
}

export interface ActionItem {
  id: string;
  text: string;
  priority: 'low' | 'medium' | 'high';
  suggestedOwner: string;
  suggestedDueDate: string;
  linkedObjects: Array<{ type: string; id: string; name: string }>;
  selected: boolean;
}

export interface TaskBundleSection {
  name: string;
  tasks: TaskBundleTask[];
}

export interface TaskBundleTask {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  dependency?: string;
  linkedObject?: { type: string; id: string; name: string };
}

export interface FollowUpDraft {
  type: 'email' | 'client-update' | 'status-update';
  title: string;
  content: string;
}

export interface StructuringResult {
  summary: {
    bullets: string[];
    entities: DetectedEntity[];
  };
  actionItems: ActionItem[];
  taskBundle: {
    name: string;
    sections: TaskBundleSection[];
  };
  followUpDrafts: FollowUpDraft[];
}

interface SmartStructuringContextType {
  isOpen: boolean;
  sourceText: string;
  sourceContext: {
    type: 'record' | 'bill' | 'client' | 'general';
    id?: string;
    name?: string;
  };
  result: StructuringResult | null;
  isProcessing: boolean;
  openStructuring: (text: string, context: { type: 'record' | 'bill' | 'client' | 'general'; id?: string; name?: string }) => void;
  closeStructuring: () => void;
  processText: () => Promise<void>;
}

const SmartStructuringContext = createContext<SmartStructuringContextType>({
  isOpen: false,
  sourceText: '',
  sourceContext: { type: 'general' },
  result: null,
  isProcessing: false,
  openStructuring: () => {},
  closeStructuring: () => {},
  processText: async () => {},
});

export const SmartStructuringProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [sourceContext, setSourceContext] = useState<{ type: 'record' | 'bill' | 'client' | 'general'; id?: string; name?: string }>({ type: 'general' });
  const [result, setResult] = useState<StructuringResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openStructuring = (text: string, context: { type: 'record' | 'bill' | 'client' | 'general'; id?: string; name?: string }) => {
    setSourceText(text);
    setSourceContext(context);
    setIsOpen(true);
    setResult(null);
  };

  const closeStructuring = () => {
    setIsOpen(false);
    setResult(null);
    setSourceText('');
  };

  const processText = async () => {
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

    const structuredResult = generateStructuredResult(sourceText, sourceContext);
    setResult(structuredResult);
    setIsProcessing(false);
  };

  return (
    <SmartStructuringContext.Provider
      value={{
        isOpen,
        sourceText,
        sourceContext,
        result,
        isProcessing,
        openStructuring,
        closeStructuring,
        processText,
      }}
    >
      {children}
    </SmartStructuringContext.Provider>
  );
};

export const useSmartStructuring = () => {
  return useContext(SmartStructuringContext);
};

// Demo entity detection engine
function detectEntities(text: string): DetectedEntity[] {
  const entities: DetectedEntity[] = [];
  
  // Detect bills (HB/SB + number)
  const billPattern = /\b(HB|SB)\s*(\d+)/gi;
  let match;
  while ((match = billPattern.exec(text)) !== null) {
    entities.push({
      type: 'bill',
      id: `${match[1]}${match[2]}`,
      name: `${match[1].toUpperCase()} ${match[2]}`,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // Detect legislators (Sen./Rep. + name)
  const legislatorPattern = /\b(Sen\.|Senator|Rep\.|Representative)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g;
  while ((match = legislatorPattern.exec(text)) !== null) {
    const name = match[2];
    entities.push({
      type: 'legislator',
      id: `leg-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name,
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  // Detect known clients (demo list)
  const knownClients = [
    'Desert Solar Coalition',
    'TechForward Initiative',
    'Arizona Healthcare Alliance',
    'Mountain Water District',
    'Valley Transit Authority'
  ];

  knownClients.forEach(clientName => {
    const index = text.indexOf(clientName);
    if (index !== -1) {
      entities.push({
        type: 'client',
        id: `client-${clientName.toLowerCase().replace(/\s+/g, '-')}`,
        name: clientName,
        startIndex: index,
        endIndex: index + clientName.length,
      });
    }
  });

  // Detect committees
  const committeePattern = /\b(Energy|Education|Finance|Appropriations|Healthcare|Transportation|Judiciary)\s+Committee/gi;
  while ((match = committeePattern.exec(text)) !== null) {
    entities.push({
      type: 'committee',
      id: `committee-${match[1].toLowerCase()}`,
      name: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return entities;
}

// Demo result generation engine
function generateStructuredResult(text: string, context: { type: string; id?: string; name?: string }): StructuringResult {
  const entities = detectEntities(text);
  const textLower = text.toLowerCase();

  // Generate summary bullets based on content
  const summaryBullets: string[] = [];
  
  if (textLower.includes('meeting') || textLower.includes('discussed')) {
    summaryBullets.push('Meeting held to discuss legislative strategy and upcoming committee actions');
  }
  if (entities.some(e => e.type === 'bill')) {
    const bills = entities.filter(e => e.type === 'bill').map(e => e.name).join(', ');
    summaryBullets.push(`Key bills addressed: ${bills}`);
  }
  if (textLower.includes('deadline') || textLower.includes('due')) {
    summaryBullets.push('Multiple deadlines identified requiring immediate team coordination');
  }
  if (entities.some(e => e.type === 'client')) {
    const clients = entities.filter(e => e.type === 'client').map(e => e.name).join(', ');
    summaryBullets.push(`Client stakeholders: ${clients}`);
  }
  if (textLower.includes('testimony') || textLower.includes('hearing')) {
    summaryBullets.push('Committee hearing preparation and testimony development required');
  }
  if (textLower.includes('amendment') || textLower.includes('change')) {
    summaryBullets.push('Legislative amendments and strategic adjustments discussed');
  }

  // Fallback summary if no specific patterns detected
  if (summaryBullets.length === 0) {
    summaryBullets.push('Strategic discussion covering legislative priorities and action items');
    summaryBullets.push('Multiple stakeholders and workstreams identified for coordination');
    summaryBullets.push('Follow-up tasks assigned with clear ownership and timelines');
  }

  // Generate action items
  const actionItems: ActionItem[] = [];
  let actionId = 1;

  if (textLower.includes('schedule') || textLower.includes('meeting')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Schedule follow-up meetings with key stakeholders',
      priority: 'high',
      suggestedOwner: 'Current User',
      suggestedDueDate: getDateOffset(3),
      linkedObjects: entities.filter(e => e.type === 'legislator' || e.type === 'client').slice(0, 2).map(e => ({
        type: e.type,
        id: e.id,
        name: e.name
      })),
      selected: true
    });
  }

  if (textLower.includes('testimony') || textLower.includes('hearing')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Draft and finalize committee testimony materials',
      priority: 'high',
      suggestedOwner: 'Maria Garcia',
      suggestedDueDate: getDateOffset(7),
      linkedObjects: entities.filter(e => e.type === 'bill').slice(0, 1).map(e => ({
        type: e.type,
        id: e.id,
        name: e.name
      })),
      selected: true
    });
  }

  if (textLower.includes('brief') || textLower.includes('summary')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Prepare executive briefing document',
      priority: 'medium',
      suggestedOwner: 'Current User',
      suggestedDueDate: getDateOffset(5),
      linkedObjects: [],
      selected: true
    });
  }

  if (textLower.includes('research') || textLower.includes('analysis')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Conduct policy research and impact analysis',
      priority: 'medium',
      suggestedOwner: 'David Kim',
      suggestedDueDate: getDateOffset(10),
      linkedObjects: entities.filter(e => e.type === 'bill').map(e => ({
        type: e.type,
        id: e.id,
        name: e.name
      })),
      selected: false
    });
  }

  if (textLower.includes('client') || textLower.includes('update')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Send client status update and next steps',
      priority: 'medium',
      suggestedOwner: 'Current User',
      suggestedDueDate: getDateOffset(2),
      linkedObjects: entities.filter(e => e.type === 'client').slice(0, 1).map(e => ({
        type: e.type,
        id: e.id,
        name: e.name
      })),
      selected: true
    });
  }

  if (textLower.includes('compliance') || textLower.includes('filing')) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Complete compliance filing and documentation',
      priority: 'high',
      suggestedOwner: 'Sarah Martinez',
      suggestedDueDate: getDateOffset(14),
      linkedObjects: [],
      selected: false
    });
  }

  // Fallback actions if none detected
  if (actionItems.length === 0) {
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Review notes and identify follow-up actions',
      priority: 'medium',
      suggestedOwner: 'Current User',
      suggestedDueDate: getDateOffset(2),
      linkedObjects: [],
      selected: true
    });
    actionItems.push({
      id: `action-${actionId++}`,
      text: 'Coordinate with team on next steps',
      priority: 'low',
      suggestedOwner: 'Current User',
      suggestedDueDate: getDateOffset(5),
      linkedObjects: [],
      selected: false
    });
  }

  // Generate task bundle
  const bundleName = context.type === 'bill' && context.name
    ? `${context.name} Work Plan`
    : context.type === 'client' && context.name
    ? `${context.name} Action Bundle`
    : 'Strategic Work Bundle';

  const taskBundle: TaskBundleSection[] = [];

  // Outreach tasks
  if (entities.some(e => e.type === 'legislator' || e.type === 'client')) {
    taskBundle.push({
      name: 'Outreach Tasks',
      tasks: [
        {
          id: 'task-outreach-1',
          title: 'Schedule meetings with key legislators',
          owner: 'Current User',
          dueDate: getDateOffset(5),
          linkedObject: entities.find(e => e.type === 'legislator') ? {
            type: 'legislator',
            id: entities.find(e => e.type === 'legislator')!.id,
            name: entities.find(e => e.type === 'legislator')!.name
          } : undefined
        },
        {
          id: 'task-outreach-2',
          title: 'Send client briefing and status update',
          owner: 'Maria Garcia',
          dueDate: getDateOffset(3),
          dependency: 'task-research-1',
          linkedObject: entities.find(e => e.type === 'client') ? {
            type: 'client',
            id: entities.find(e => e.type === 'client')!.id,
            name: entities.find(e => e.type === 'client')!.name
          } : undefined
        }
      ]
    });
  }

  // Research tasks
  taskBundle.push({
    name: 'Research Tasks',
    tasks: [
      {
        id: 'task-research-1',
        title: 'Policy analysis and impact assessment',
        owner: 'David Kim',
        dueDate: getDateOffset(7),
        linkedObject: entities.find(e => e.type === 'bill') ? {
          type: 'bill',
          id: entities.find(e => e.type === 'bill')!.id,
          name: entities.find(e => e.type === 'bill')!.name
        } : undefined
      },
      {
        id: 'task-research-2',
        title: 'Gather supporting data and precedents',
        owner: 'David Kim',
        dueDate: getDateOffset(6),
      }
    ]
  });

  // Drafting tasks
  taskBundle.push({
    name: 'Drafting Tasks',
    tasks: [
      {
        id: 'task-draft-1',
        title: 'Draft committee testimony',
        owner: 'Maria Garcia',
        dueDate: getDateOffset(10),
        dependency: 'task-research-1',
        linkedObject: entities.find(e => e.type === 'bill') ? {
          type: 'bill',
          id: entities.find(e => e.type === 'bill')!.id,
          name: entities.find(e => e.type === 'bill')!.name
        } : undefined
      },
      {
        id: 'task-draft-2',
        title: 'Prepare executive briefing materials',
        owner: 'Current User',
        dueDate: getDateOffset(8),
      }
    ]
  });

  // Compliance tasks (if relevant)
  if (textLower.includes('compliance') || textLower.includes('filing') || textLower.includes('registration')) {
    taskBundle.push({
      name: 'Compliance Tasks',
      tasks: [
        {
          id: 'task-compliance-1',
          title: 'Complete quarterly lobbying registration',
          owner: 'Sarah Martinez',
          dueDate: getDateOffset(14),
        },
        {
          id: 'task-compliance-2',
          title: 'File activity reports with Secretary of State',
          owner: 'Sarah Martinez',
          dueDate: getDateOffset(14),
        }
      ]
    });
  }

  // Generate follow-up drafts
  const followUpDrafts: FollowUpDraft[] = [];

  // Follow-up email
  const clientName = entities.find(e => e.type === 'client')?.name || 'the client';
  const billName = entities.find(e => e.type === 'bill')?.name || 'the legislation';
  
  followUpDrafts.push({
    type: 'email',
    title: 'Follow-Up Email',
    content: `Subject: Follow-Up on Recent Discussion\n\nDear Team,\n\nThank you for the productive discussion. As discussed, we've identified several key action items that require coordination:\n\n• Schedule meetings with key stakeholders to advance our strategic objectives\n• Complete policy analysis and prepare supporting materials\n• Draft testimony and briefing documents for upcoming committee hearings\n\nI'll be coordinating with each of you on specific deliverables and timelines. Please let me know if you have any questions or need additional resources.\n\nBest regards`
  });

  // Client update
  if (entities.some(e => e.type === 'client')) {
    followUpDrafts.push({
      type: 'client-update',
      title: 'Client Update Blurb',
      content: `${clientName} Update — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\nWe made significant progress this week on your legislative priorities. Our team has identified key opportunities for engagement and is coordinating strategic outreach to advance ${billName}.\n\nNext Steps:\n• Stakeholder meetings scheduled for next week\n• Policy analysis and testimony preparation underway\n• Timeline on track for committee hearing preparation\n\nWe'll provide a detailed briefing by ${getDateOffset(7)}.`
    });
  }

  // Internal status update
  followUpDrafts.push({
    type: 'status-update',
    title: 'Internal Status Update',
    content: `Project Status Update\n\nProgress Summary:\n${summaryBullets.map(b => `• ${b}`).join('\n')}\n\nAction Items Assigned:\n${actionItems.slice(0, 3).map((a, i) => `${i + 1}. ${a.text} (Owner: ${a.suggestedOwner}, Due: ${a.suggestedDueDate})`).join('\n')}\n\nRisks & Blockers: None identified at this time\n\nNext Review: ${getDateOffset(7)}`
  });

  return {
    summary: {
      bullets: summaryBullets,
      entities
    },
    actionItems,
    taskBundle: {
      name: bundleName,
      sections: taskBundle
    },
    followUpDrafts
  };
}

// Helper function to get date offset
function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}
