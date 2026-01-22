// Chat Type Definitions

export type ConversationType = 'dm' | 'channel' | 'project' | 'system';
export type MessageKind = 'text' | 'action_card' | 'pythia_insight';

export interface Conversation {
  conversationId: string;
  orgId: string;
  type: ConversationType;
  title: string;
  subtitle: string;
  participants: string[];
  linked: {
    projectId: string | null;
    clientId: string | null;
    taskId: string | null;
    recordId: string | null;
  };
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadBy: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MessageAttachment {
  id: string;
  type: 'file' | 'task' | 'calendar_invite' | 'record' | 'link' | 'poll' | 'approval' | 'pythia_brief';
  title: string;
  subtitle?: string;
  preview: {
    // Type-specific preview data for rendering cards
    [key: string]: any;
  };
  linked: {
    taskId?: string | null;
    recordId?: string | null;
    eventId?: string | null;
    projectId?: string | null;
    clientId?: string | null;
  };
  payload: {
    // Full form data for the attachment
    [key: string]: any;
  };
  createdAt: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderUserId: string;
  senderName: string;
  text: string;
  kind: MessageKind;
  reactions: { [emoji: string]: string[] }; // emoji -> array of userIds who reacted
  pinned: boolean;
  replyToMessageId: string | null;
  attachments: MessageAttachment[];
  linked: {
    projectId: string | null;
    clientId: string | null;
    taskId: string | null;
    recordId: string | null;
  };
  createdAt: string;
  version: number;
}

export interface ChatPreferences {
  mutedConversationIds: string[];
  pinnedConversationIds: string[];
  readState: Record<string, string>;
  version: number;
}

export interface ConversationIndex {
  conversationIds: string[];
  version: number;
}

export interface MessageIndex {
  messageIds: string[];
  version: number;
}

export interface Insight {
  id: string;
  type: 'task_recommendation' | 'general';
  title: string;
  description: string;
  sourceMessageId?: string;
  metadata?: any;
  createdAt: string;
}