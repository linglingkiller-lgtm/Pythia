import { mockLegislators } from '../components/legislators/legislatorData';

export type VoiceCommandIntent = 
  | { type: 'NAVIGATE_PAGE'; page: string }
  | { type: 'NAVIGATE_LEGISLATOR'; legislatorId: string }
  | { type: 'NAVIGATE_BILL'; billId: string } // Placeholder
  | { type: 'FILTER_LEGISLATORS'; filters: { party?: string; chamber?: string; state?: string } }
  | { type: 'DRAFT_MESSAGE'; recipient: string }
  | { type: 'CREATE_ALERT'; topic: string }
  | { type: 'SUMMARIZE_BILL'; billIdOrNumber: string }
  | { type: 'SIMULATE_VOTE'; billIdOrNumber: string; scenario?: string }
  | { type: 'COMPARE_BILLS'; billA: string; billB: string }
  | { type: 'GET_STAKEHOLDER_BRIEF'; name: string }
  | { type: 'FIND_PATH_TO_STAKEHOLDER'; name: string }
  | { type: 'CREATE_TASK'; task: string }
  | { type: 'PREP_MEETING'; meetingContext: string }
  | { type: 'GET_MORNING_BRIEF' }
  | { type: 'UNKNOWN'; transcript: string };

export const parseVoiceCommand = (transcript: string): VoiceCommandIntent => {
  const lowerTranscript = transcript.toLowerCase().trim();

  // --- Legislative Intelligence ---

  // Summarize Bill: "Summarize HR 503", "Decipher bill [id]"
  if (lowerTranscript.startsWith('summarize') || lowerTranscript.startsWith('decipher') || lowerTranscript.startsWith('explain')) {
    const billRef = lowerTranscript.replace(/^(summarize|decipher|explain)/, '').replace('bill', '').trim();
    if (billRef.length > 0) return { type: 'SUMMARIZE_BILL', billIdOrNumber: billRef };
  }

  // Vote Simulation: "What happens if Florida flips nay?"
  if (lowerTranscript.includes('what happens if') || lowerTranscript.includes('simulate') || lowerTranscript.includes('war game')) {
     const scenario = lowerTranscript.replace(/^(what happens if|simulate|war game)/, '').trim();
     return { type: 'SIMULATE_VOTE', billIdOrNumber: 'current', scenario };
  }

  // Compare Bills: "Compare Senate version vs House version"
  if (lowerTranscript.startsWith('compare')) {
     return { type: 'COMPARE_BILLS', billA: 'Senate Version', billB: 'House Version' }; // Simplified for demo
  }

  // --- Stakeholder Operations ---

  // Instant Dossier: "Prepare me for [Name]", "Who is [Name]"
  if (lowerTranscript.startsWith('prepare me for') || lowerTranscript.startsWith('who is') || lowerTranscript.startsWith('brief me on')) {
     const name = lowerTranscript.replace(/^(prepare me for|who is|brief me on)/, '').trim();
     return { type: 'GET_STAKEHOLDER_BRIEF', name };
  }

  // Pathfinding: "Who knows [Name]?", "Connection to [Name]"
  if (lowerTranscript.includes('who knows') || lowerTranscript.includes('connection to') || lowerTranscript.includes('path to')) {
     const name = lowerTranscript.split(/(who knows|connection to|path to)/).pop()?.trim() || '';
     return { type: 'FIND_PATH_TO_STAKEHOLDER', name };
  }

  // --- Executive Secretariat ---

  // Create Task: "Remind me to [Task]", "Add task [Task]"
  if (lowerTranscript.startsWith('remind me to') || lowerTranscript.startsWith('add task') || lowerTranscript.startsWith('create task')) {
     const task = lowerTranscript.replace(/^(remind me to|add task|create task)/, '').trim();
     return { type: 'CREATE_TASK', task };
  }

  // Meeting Prep: "Prep me for [Meeting]"
  if (lowerTranscript.startsWith('prep me for') && lowerTranscript.includes('meeting')) {
     const meeting = lowerTranscript.replace('prep me for', '').trim();
     return { type: 'PREP_MEETING', meetingContext: meeting };
  }

  // Morning Briefing: "Catch me up", "What did I miss"
  if (lowerTranscript.includes('catch me up') || lowerTranscript.includes('morning briefing') || lowerTranscript.includes('what did i miss')) {
     return { type: 'GET_MORNING_BRIEF' };
  }

  // --- Existing Logic ---


  // Drafting Message: "Draft a message to [Name]"
  if (lowerTranscript.startsWith('draft a message to') || lowerTranscript.startsWith('message') || lowerTranscript.startsWith('send a message to')) {
    let recipient = lowerTranscript
      .replace('draft a message to', '')
      .replace('send a message to', '')
      .replace('message', '')
      .trim();
    
    // Clean up "the"
    if (recipient.startsWith('the ')) recipient = recipient.substring(4);

    return { type: 'DRAFT_MESSAGE', recipient };
  }

  // Creating Alert: "Alert me when [Topic]"
  if (lowerTranscript.startsWith('alert me when') || lowerTranscript.startsWith('create alert for')) {
    let topic = lowerTranscript
      .replace('alert me when', '')
      .replace('create alert for', '')
      .trim();
    
    return { type: 'CREATE_ALERT', topic };
  }

  // Complex Filtering: "Show me Republicans in the Senate"
  if (lowerTranscript.includes('republican') || lowerTranscript.includes('democrat') || lowerTranscript.includes('senate') || lowerTranscript.includes('house')) {
    const filters: { party?: string; chamber?: string } = {};

    if (lowerTranscript.includes('republican')) filters.party = 'Republican';
    if (lowerTranscript.includes('democrat')) filters.party = 'Democrat';
    if (lowerTranscript.includes('senate')) filters.chamber = 'Senate';
    if (lowerTranscript.includes('house')) filters.chamber = 'House';

    // Only return if we found at least one filter
    if (Object.keys(filters).length > 0) {
        return { type: 'FILTER_LEGISLATORS', filters };
    }
  }

  // Show Legislator: "Show me [Name]" or "Go to [Name]"
  // Moved up to prioritize specific legislator over page navigation if name conflicts with page keywords
  if (lowerTranscript.startsWith('show me') || lowerTranscript.startsWith('go to') || lowerTranscript.startsWith('find') || lowerTranscript.startsWith('open')) {
    // Remove the command prefix to get the name
    let nameQuery = lowerTranscript
      .replace('show me', '')
      .replace('go to', '')
      .replace('find', '')
      .replace('open', '')
      .trim();
    
    // Remove "the" if present (e.g. "Show me the Steve Montenegro")
    if (nameQuery.startsWith('the ')) {
      nameQuery = nameQuery.substring(4);
    }

    // Remove common suffixes like "'s profile" or "profile"
    nameQuery = nameQuery.replace(/'s profile$/, '').replace(/ profile$/, '').trim();

    if (nameQuery.length > 2) {
      // Fuzzy search in mockLegislators
      const found = mockLegislators.find(leg => 
        leg.name.toLowerCase().includes(nameQuery) || 
        leg.district.toLowerCase().includes(nameQuery)
      );

      if (found) {
        return { type: 'NAVIGATE_LEGISLATOR', legislatorId: found.id };
      }
    }
  }

  // Navigation: "Go to [Page]" or "Open [Page]" or "Take me to [Page]"
  if (
    lowerTranscript.includes('go to') || 
    lowerTranscript.includes('open') || 
    lowerTranscript.includes('show me the') || 
    lowerTranscript.includes('take me to')
  ) {
    if (lowerTranscript.includes('dashboard')) return { type: 'NAVIGATE_PAGE', page: 'Dashboard' };
    if (lowerTranscript.includes('legislator') || lowerTranscript.includes('members')) return { type: 'NAVIGATE_PAGE', page: 'Legislators' };
    if (lowerTranscript.includes('bill')) return { type: 'NAVIGATE_PAGE', page: 'Bills' };
    if (lowerTranscript.includes('calendar')) return { type: 'NAVIGATE_PAGE', page: 'Calendar' };
    if (lowerTranscript.includes('client')) return { type: 'NAVIGATE_PAGE', page: 'Clients' };
    if (lowerTranscript.includes('project') || lowerTranscript.includes('work')) return { type: 'NAVIGATE_PAGE', page: 'Projects' };
    if (lowerTranscript.includes('team') || lowerTranscript.includes('manager')) return { type: 'NAVIGATE_PAGE', page: 'Team' };
    if (lowerTranscript.includes('setting')) return { type: 'NAVIGATE_PAGE', page: 'Settings' };
    if (lowerTranscript.includes('chat') || lowerTranscript.includes('message')) return { type: 'NAVIGATE_PAGE', page: 'Chat' };
    if (lowerTranscript.includes('election')) return { type: 'NAVIGATE_PAGE', page: 'Elections' };
    if (lowerTranscript.includes('analytic')) return { type: 'NAVIGATE_PAGE', page: 'Analytics' };
    if (lowerTranscript.includes('record')) return { type: 'NAVIGATE_PAGE', page: 'Records' };
    if (lowerTranscript.includes('war room')) return { type: 'NAVIGATE_PAGE', page: 'War Room' };
  }

  return { type: 'UNKNOWN', transcript };
};
