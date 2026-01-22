import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigation } from './NavigationContext';
import { mockLegislators } from '../components/legislators/legislatorData';

export interface PythiaContext {
  type: 'global' | 'bill' | 'client' | 'warroom' | 'records' | 'tasks' | 'legislator' | 'issue';
  id?: string;
  label?: string;
}

export interface PythiaSource {
  objectType: 'bill' | 'client' | 'record' | 'task' | 'legislator' | 'issue' | 'project';
  objectId: string;
  title: string;
  snippet: string;
  metadata: string;
}

export interface PythiaAction {
  actionType: 'create-task' | 'generate-brief' | 'draft-update' | 'pin-warroom' | 'save-record' | 'navigate';
  label: string;
  payload?: any;
}

export interface PythiaAnswer {
  answer: string;
  keyTakeaways: string[];
  citations: PythiaSource[];
  recommendedActions: PythiaAction[];
  relatedSources?: PythiaSource[];
}

export interface PythiaConversationTurn {
  question: string;
  answer: PythiaAnswer;
  timestamp: string;
}

interface AskPythiaContextType {
  isOpen: boolean;
  context: PythiaContext;
  conversation: PythiaConversationTurn[];
  isLoading: boolean;
  isListening: boolean; // Keeping interface but will always be false
  openPythia: (ctx?: PythiaContext) => void;
  closePythia: () => void;
  askQuestion: (question: string) => Promise<void>;
  clearConversation: () => void;
  setContext: (ctx: PythiaContext) => void;
  toggleVoice: () => void; // Deprecated but kept for interface compatibility
}

const defaultContext: PythiaContext = {
  type: 'global'
};

const AskPythiaContext = createContext<AskPythiaContextType>({
  isOpen: false,
  context: defaultContext,
  conversation: [],
  isLoading: false,
  isListening: false,
  openPythia: () => {},
  closePythia: () => {},
  askQuestion: async () => {},
  clearConversation: () => {},
  setContext: () => {},
  toggleVoice: () => {},
});

export const AskPythiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<PythiaContext>(defaultContext);
  const [conversation, setConversation] = useState<PythiaConversationTurn[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cleaned up conflicting speech recognition - VoiceContext now handles all voice input
  const isListening = false;

  const { navigateToPage, navigateToLegislator } = useNavigation();

  // Deprecated: Voice logic moved to VoiceContext
  const toggleVoice = () => {
    console.warn("AskPythiaContext: toggleVoice is deprecated. Use VoiceContext instead.");
  };

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openPythia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openPythia = (ctx?: PythiaContext) => {
    if (ctx) {
      setContext(ctx);
    }
    setIsOpen(true);
  };

  const closePythia = () => {
    setIsOpen(false);
  };

  const clearConversation = () => {
    setConversation([]);
  };

  const askQuestion = async (question: string) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));

    // Demo response engine
    const answer = generateDemoResponse(question, context);

    const turn: PythiaConversationTurn = {
      question,
      answer,
      timestamp: new Date().toISOString(),
    };

    setConversation(prev => [...prev, turn]);
    setIsLoading(false);
  };

  return (
    <AskPythiaContext.Provider
      value={{
        isOpen,
        context,
        conversation,
        isLoading,
        isListening,
        openPythia,
        closePythia,
        askQuestion,
        clearConversation,
        setContext,
        toggleVoice,
      }}
    >
      {children}
    </AskPythiaContext.Provider>
  );
};

export const useAskPythia = () => {
  return useContext(AskPythiaContext);
};

// Demo response generation engine
function generateDemoResponse(question: string, context: PythiaContext): PythiaAnswer {
  const lowerQ = question.toLowerCase();

  // Pattern matching for different question types
  if (lowerQ.includes('week') || lowerQ.includes('changed') || lowerQ.includes('summary')) {
    return {
      answer: "Based on analysis of recent legislative activity and client communications, this week has seen significant movement across three key areas. HB 247 (Clean Energy Transition) advanced out of committee with amendments that may impact Desert Solar Coalition's timeline. The Technology & Innovation caucus held two strategy sessions, and three new compliance records were filed related to ongoing lobbying efforts.",
      keyTakeaways: [
        "HB 247 committee advancement creates new timeline pressure for Desert Solar Coalition",
        "Technology caucus momentum building — 2 strategy sessions held",
        "3 compliance filings completed on schedule"
      ],
      citations: [
        {
          objectType: 'bill',
          objectId: 'bill-1',
          title: 'HB 247 - Clean Energy Transition Act',
          snippet: 'Committee vote: 8-3 in favor with amendments to Section 4(b) regarding solar panel installation timelines...',
          metadata: 'Bill • Committee action • Dec 18'
        },
        {
          objectType: 'client',
          objectId: 'client-1',
          title: 'Desert Solar Coalition',
          snippet: 'Primary advocacy target: HB 247 passage. Recent activity: 3 legislator meetings scheduled...',
          metadata: 'Client • Lobbying • Active contract'
        },
        {
          objectType: 'record',
          objectId: 'record-1',
          title: 'Q4 2024 Lobbying Registration - December Filing',
          snippet: 'Filed on schedule with Secretary of State. Covered activities: HB 247 advocacy, caucus coordination...',
          metadata: 'Record • Compliance • Dec 15'
        }
      ],
      recommendedActions: [
        {
          actionType: 'generate-brief',
          label: 'Generate Weekly Brief',
          payload: { timeRange: 'week' }
        },
        {
          actionType: 'draft-update',
          label: 'Draft Client Updates',
          payload: { clients: ['client-1', 'client-2'] }
        },
        {
          actionType: 'pin-warroom',
          label: 'Pin to War Room',
          payload: { summary: true }
        }
      ],
      relatedSources: [
        {
          objectType: 'legislator',
          objectId: 'leg-1',
          title: 'Sen. Maria Gonzalez',
          snippet: 'Chair, Energy Committee. Recent activity on HB 247...',
          metadata: 'Legislator • Energy Committee'
        }
      ]
    };
  }

  if (lowerQ.includes('deliverable') || lowerQ.includes('risk') || lowerQ.includes('at risk')) {
    return {
      answer: "Analysis of current project timelines and dependencies identifies two deliverables requiring immediate attention. The Q4 Impact Report for TechForward Initiative is due December 22 with research still in progress. Additionally, the Desert Solar Coalition testimony preparation for the January 8 committee hearing needs legislative counsel review by December 28.",
      keyTakeaways: [
        "Q4 Impact Report (TechForward) — Due Dec 22, research 60% complete",
        "Desert Solar testimony — Needs legal review by Dec 28",
        "Both items flagged for accelerated workflow"
      ],
      citations: [
        {
          objectType: 'task',
          objectId: 'task-1',
          title: 'Complete Q4 Impact Report - TechForward Initiative',
          snippet: 'Status: In Progress (60%). Owner: Maria Garcia. Due: Dec 22, 2024...',
          metadata: 'Task • Public Affairs • High priority'
        },
        {
          objectType: 'task',
          objectId: 'task-2',
          title: 'Prepare Committee Testimony - Desert Solar Coalition',
          snippet: 'Status: Draft complete, awaiting legal review. Due: Dec 28, 2024...',
          metadata: 'Task • Lobbying • Critical path'
        },
        {
          objectType: 'client',
          objectId: 'client-1',
          title: 'Desert Solar Coalition',
          snippet: 'Contract deliverables: Monthly reports, testimony preparation, committee tracking...',
          metadata: 'Client • Lobbying • Active'
        }
      ],
      recommendedActions: [
        {
          actionType: 'create-task',
          label: 'Create Task Bundle',
          payload: { tasks: ['task-1', 'task-2'] }
        },
        {
          actionType: 'draft-update',
          label: 'Alert Project Manager',
          payload: { alert: 'timeline-risk' }
        },
        {
          actionType: 'save-record',
          label: 'Save to Records',
          payload: { type: 'risk-assessment' }
        }
      ]
    };
  }

  if (lowerQ.includes('next action') || lowerQ.includes('recommend') || lowerQ.includes('should')) {
    return {
      answer: "Based on current bill status, legislator positions, and client priorities, the recommended next action is to schedule direct meetings with three swing-vote legislators on the Energy Committee before the January 8 hearing. Sen. Thompson and Rep. Williams have expressed interest but require detailed technical briefings. Additionally, coordinate with Desert Solar Coalition's policy team to finalize testimony talking points by December 28.",
      keyTakeaways: [
        "Priority: Schedule meetings with Sen. Thompson and Rep. Williams (swing votes)",
        "Action item: Coordinate technical briefing materials with client policy team",
        "Deadline: Finalize testimony talking points by Dec 28"
      ],
      citations: [
        {
          objectType: 'legislator',
          objectId: 'leg-2',
          title: 'Sen. David Thompson',
          snippet: 'Position: Undecided on HB 247. Recent statement: "Need more technical data on grid integration costs"...',
          metadata: 'Legislator • Energy Committee • Swing vote'
        },
        {
          objectType: 'legislator',
          objectId: 'leg-3',
          title: 'Rep. Jennifer Williams',
          snippet: 'Position: Leaning support but concerned about rural implementation timeline...',
          metadata: 'Legislator • Energy Committee • Key target'
        },
        {
          objectType: 'client',
          objectId: 'client-1',
          title: 'Desert Solar Coalition',
          snippet: 'Strategic goal: Pass HB 247 with favorable amendments. Budget allocated for technical briefings...',
          metadata: 'Client • Lobbying • Active'
        }
      ],
      recommendedActions: [
        {
          actionType: 'create-task',
          label: 'Create Meeting Tasks',
          payload: { legislators: ['leg-2', 'leg-3'] }
        },
        {
          actionType: 'generate-brief',
          label: 'Generate Briefing Materials',
          payload: { audience: 'legislators' }
        },
        {
          actionType: 'pin-warroom',
          label: 'Pin to War Room',
          payload: { actionPlan: true }
        }
      ]
    };
  }

  if (context.type === 'bill' && context.id) {
    return {
      answer: `This bill is currently in committee review with a scheduled hearing on January 8, 2025. Recent amendments have modified the implementation timeline, which may impact client strategies. Three legislators have indicated support, two are undecided, and one has expressed opposition. The bill aligns with Desert Solar Coalition's advocacy priorities and requires continued monitoring.`,
      keyTakeaways: [
        "Committee hearing scheduled: January 8, 2025",
        "Recent amendments affect implementation timeline",
        "Legislative support: 3 yes, 2 undecided, 1 no"
      ],
      citations: [
        {
          objectType: 'bill',
          objectId: context.id,
          title: 'Current bill under analysis',
          snippet: 'Status: In committee. Next action: Hearing scheduled...',
          metadata: 'Bill • Active tracking'
        },
        {
          objectType: 'client',
          objectId: 'client-1',
          title: 'Desert Solar Coalition',
          snippet: 'Position: Strong support. Advocacy activities: legislator outreach, testimony preparation...',
          metadata: 'Client • Stakeholder'
        }
      ],
      recommendedActions: [
        {
          actionType: 'generate-brief',
          label: 'Generate Bill Brief',
          payload: { billId: context.id }
        },
        {
          actionType: 'create-task',
          label: 'Track Committee Actions',
          payload: { billId: context.id }
        },
        {
          actionType: 'draft-update',
          label: 'Draft Client Update',
          payload: { billId: context.id }
        }
      ]
    };
  }

  if (context.type === 'client' && context.id) {
    return {
      answer: `This client is currently engaged in active lobbying efforts focused on clean energy legislation. The contract includes monthly strategic consultations, testimony preparation, and legislative tracking. Recent activity shows strong progress on HB 247 advocacy with three legislator meetings completed this week. Budget utilization is on track at 68% with deliverables meeting expected timelines.`,
      keyTakeaways: [
        "Contract status: Active, deliverables on track",
        "Recent progress: 3 legislator meetings completed this week",
        "Budget utilization: 68% (on target)"
      ],
      citations: [
        {
          objectType: 'client',
          objectId: context.id,
          title: 'Client profile and contract details',
          snippet: 'Service line: Lobbying. Contract value: $180K. Period: Jan-Dec 2024...',
          metadata: 'Client • Active contract'
        },
        {
          objectType: 'record',
          objectId: 'record-2',
          title: 'December Activity Report - Client Meetings',
          snippet: 'Completed: 3 legislator meetings. Topics: HB 247 support, technical briefings...',
          metadata: 'Record • Activity log • Dec 18'
        }
      ],
      recommendedActions: [
        {
          actionType: 'draft-update',
          label: 'Draft Client Update',
          payload: { clientId: context.id }
        },
        {
          actionType: 'navigate',
          label: 'View Client Dashboard',
          payload: { clientId: context.id }
        },
        {
          actionType: 'save-record',
          label: 'Save Analysis to Records',
          payload: { clientId: context.id }
        }
      ]
    };
  }

  if (context.type === 'warroom') {
    return {
      answer: "Today's situation shows moderate activity with three priority items requiring attention. The Energy Committee hearing prep is on schedule for next week. Two client check-ins are scheduled for this afternoon. One compliance deadline is approaching on December 22. Overall team capacity is healthy with no critical blockers identified.",
      keyTakeaways: [
        "Energy Committee hearing prep: On track for Jan 8",
        "Today's schedule: 2 client check-ins this afternoon",
        "Upcoming deadline: Compliance filing due Dec 22"
      ],
      citations: [
        {
          objectType: 'task',
          objectId: 'task-3',
          title: 'Energy Committee Hearing Preparation',
          snippet: 'Status: In Progress. All materials drafted, awaiting final review...',
          metadata: 'Task • High priority • Due Jan 8'
        },
        {
          objectType: 'record',
          objectId: 'record-3',
          title: 'Q4 Compliance Filing Reminder',
          snippet: 'Due: December 22, 2024. Status: Materials gathered, pending final review...',
          metadata: 'Record • Compliance • Upcoming'
        }
      ],
      recommendedActions: [
        {
          actionType: 'create-task',
          label: 'Create Daily Task Bundle',
          payload: { date: 'today' }
        },
        {
          actionType: 'generate-brief',
          label: 'Generate Daily Brief',
          payload: { date: 'today' }
        }
      ]
    };
  }

  // Default general response
  return {
    answer: "I've analyzed the current state of Pythia's workspace data to address your question. The system contains active information across bills, clients, legislators, tasks, and records. For more specific insights, try asking about a particular area such as upcoming deadlines, client status, bill tracking, or workload analysis. I can also help generate briefs, create task bundles, or identify risks and opportunities.",
    keyTakeaways: [
      "Pythia workspace contains comprehensive legislative and client intelligence",
      "Ask context-specific questions for more detailed insights",
      "Available actions: generate briefs, create tasks, analyze risks"
    ],
    citations: [
      {
        objectType: 'record',
        objectId: 'system-guide',
        title: 'Pythia System Guide',
        snippet: 'Pythia provides intelligent insights across all legislative affairs operations including bill tracking, client management, and compliance monitoring...',
        metadata: 'Demo Source • System Guide'
      }
    ],
    recommendedActions: [
      {
        actionType: 'generate-brief',
        label: 'Generate Weekly Summary',
        payload: { timeRange: 'week' }
      },
      {
        actionType: 'save-record',
        label: 'Save to Records',
        payload: { type: 'analysis' }
      }
    ],
    relatedSources: [
      {
        objectType: 'bill',
        objectId: 'bill-1',
        title: 'HB 247 - Clean Energy Transition Act',
        snippet: 'Active tracking. Status: In committee...',
        metadata: 'Bill • Energy'
      },
      {
        objectType: 'client',
        objectId: 'client-1',
        title: 'Desert Solar Coalition',
        snippet: 'Active lobbying contract...',
        metadata: 'Client • Lobbying'
      }
    ]
  };
}
