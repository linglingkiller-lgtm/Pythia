// Chat Utilities
import { Conversation, Message, ConversationIndex, MessageIndex, ChatPreferences } from './chatTypes';

const BASE_URL = 'https://placeholder-project-id.supabase.co/functions/v1/make-server-9c2c6866';
const ANON_KEY = 'placeholder-anon-key';

// Generate unique IDs
export function generateConversationId(): string {
  return `c_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessageId(): string {
  return `m_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Format timestamp
export function formatMessageTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Format as date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatMessageTimeFull(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Date separator helper
export function shouldShowDateSeparator(currentMessage: Message, previousMessage: Message | null): boolean {
  if (!previousMessage) return true;
  
  const currentDate = new Date(currentMessage.createdAt).toDateString();
  const previousDate = new Date(previousMessage.createdAt).toDateString();
  
  return currentDate !== previousDate;
}

export function formatDateSeparator(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// Check if user should see consecutive messages grouped
export function shouldGroupWithPrevious(currentMessage: Message, previousMessage: Message | null): boolean {
  if (!previousMessage) return false;
  if (previousMessage.senderUserId !== currentMessage.senderUserId) return false;
  
  const timeDiff = new Date(currentMessage.createdAt).getTime() - new Date(previousMessage.createdAt).getTime();
  return timeDiff < 300000; // 5 minutes
}

// Get conversation icon
export function getConversationIcon(type: Conversation['type']): string {
  switch (type) {
    case 'dm': return '💬';
    case 'channel': return '#';
    case 'project': return '📁';
    case 'system': return '🤖';
    default: return '💬';
  }
}

// Extract mentions from text
export function extractMentions(text: string): string[] {
  const mentionRegex = /@(\w+)/g;
  const mentions: string[] = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
}

// Highlight mentions in text
export function highlightMentions(text: string, currentUserId: string): string {
  return text.replace(/@(\w+)/g, (match, username) => {
    // Simple demo: highlight @Will or matches currentUserId
    if (username.toLowerCase() === 'will' || username === currentUserId) {
      return `<span class="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1 rounded">${match}</span>`;
    }
    return `<span class="text-blue-600 dark:text-blue-400">${match}</span>`;
  });
}

// Search filter
export function filterConversations(
  conversations: Conversation[],
  searchQuery: string,
  filterType: 'all' | 'dm' | 'channel' | 'project' | 'system'
): Conversation[] {
  let filtered = conversations;
  
  // Filter by type
  if (filterType !== 'all') {
    filtered = filtered.filter(c => c.type === filterType);
  }
  
  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(c => 
      c.title.toLowerCase().includes(query) ||
      c.subtitle.toLowerCase().includes(query) ||
      c.lastMessagePreview.toLowerCase().includes(query)
    );
  }
  
  return filtered;
}

// Sort conversations (pinned first, then by last message time)
export function sortConversations(
  conversations: Conversation[],
  pinnedIds: string[]
): Conversation[] {
  return [...conversations].sort((a, b) => {
    const aIsPinned = pinnedIds.includes(a.conversationId);
    const bIsPinned = pinnedIds.includes(b.conversationId);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });
}

// Get unread count for user
export function getUnreadCount(conversation: Conversation, userId: string): number {
  return conversation.unreadBy[userId] || 0;
}

// Demo: Get current user info
export function getCurrentUserInfo() {
  return {
    userId: 'user_current',
    name: 'Will Davis',
    avatarUrl: null,
  };
}

// Demo: Get org members for participant picker
export function getOrgMembers() {
  return [
    { userId: 'user_ops', name: 'Mike Rodriguez', role: 'Operations Manager' },
    { userId: 'user_strategist', name: 'Sarah Chen', role: 'Lead Strategist' },
    { userId: 'user_analyst', name: 'Emma Thompson', role: 'Policy Analyst' },
  ];
}
