import { Notification } from '../components/notifications/NotificationDropdown';

export interface BriefingContent {
  alerts: Notification[];
  agenda: AgendaItem[];
  tasks: TaskItem[];
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'hearing' | 'meeting' | 'deadline';
  attendees?: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  due: string;
  priority: 'high' | 'medium' | 'low';
  owner: string;
}

export const generateBriefingContent = (): BriefingContent => {
  return {
    alerts: [
      {
        id: 'brief-1',
        title: 'HB 247 Amendment Filed',
        message: 'Unexpected amendment filed at 2:00 AM regarding solar tax credits. Requires immediate review.',
        time: '2:00 AM',
        read: false,
        type: 'alert',
        priority: 'Urgent',
        link: '/bills/hb-247'
      },
      {
        id: 'brief-2',
        title: 'Press Inquiry: Desert Solar',
        message: 'AZ Republic reporter requesting comment on committee vote. Deadline: 10:00 AM.',
        time: '6:30 AM',
        read: false,
        type: 'message',
        priority: 'Urgent',
        link: '/clients/desert-solar'
      },
      {
        id: 'brief-3',
        title: 'Committee Schedule Change',
        message: 'Energy Committee hearing moved to Room 204. Start time delayed 30 mins.',
        time: '7:15 AM',
        read: false,
        type: 'update',
        priority: 'ActionNeeded',
        link: '/calendar'
      }
    ],
    agenda: [
      {
        id: 'agenda-1',
        time: '09:00 AM',
        title: 'Team Standup',
        location: 'War Room A',
        type: 'meeting',
        attendees: ['All Hands']
      },
      {
        id: 'agenda-2',
        time: '10:00 AM',
        title: 'Energy & Natural Resources Committee',
        location: 'Senate Hearing Room 3',
        type: 'hearing',
        attendees: ['Sen. Thompson', 'Sen. Gonzalez']
      },
      {
        id: 'agenda-3',
        time: '01:30 PM',
        title: 'Lunch with Rep. Williams',
        location: 'Capital Grille',
        type: 'meeting',
        attendees: ['Rep. Williams', 'Client: TechForward']
      }
    ],
    tasks: [
      {
        id: 'task-brief-1',
        title: 'Analyze HB 247 Amendment',
        due: '2025-12-19T10:00:00',
        priority: 'high',
        owner: 'You'
      },
      {
        id: 'task-brief-2',
        title: 'Draft Press Response',
        due: '2025-12-19T09:30:00',
        priority: 'high',
        owner: 'You'
      },
      {
        id: 'task-brief-3',
        title: 'Print Committee Packets',
        due: '2025-12-19T08:45:00',
        priority: 'medium',
        owner: 'Sarah Martinez'
      }
    ]
  };
};
