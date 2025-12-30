import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Check, ChevronRight } from 'lucide-react';
import profileImage from 'figma:asset/ab508a7b4f2fc147191dd1c662261b383e406712.png';
import { UserProfilePopover } from '../UserProfilePopover';

interface Task {
  id: number;
  completed: boolean;
  title: string;
  description: string;
  owner: string;
}

// Mock user data
const mockUsers: Record<string, any> = {
  'JD': {
    id: 'jd-001',
    name: 'Jordan Davis',
    title: 'Field Manager',
    initials: 'JD',
    email: 'jordan.davis@echocanyonconsulting.com',
    phone: '(602) 555-0142',
    location: 'Phoenix',
    timezone: 'MST',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1658605580075-6ff70c7ce156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0ZSUyMGNhcGl0b2wlMjBkb21lfGVufDF8fHx8MTc2NjA1NjUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'available',
    teams: ['Client A', 'Energy', 'AZ Legislature'],
    workStats: {
      openTasksCount: 12,
      dueThisWeekCount: 4,
      overdueCount: 1,
      activeIssuesCount: 6,
    },
    recentActivity: [
      { type: 'meeting', title: 'Logged meeting note — HB90', timestamp: 'Today 2:14 PM' },
      { type: 'brief', title: 'Generated brief — Clean Energy Town Hall', timestamp: 'Today 11:23 AM' },
      { type: 'call', title: 'Called Rep. Ortiz\'s LA', timestamp: 'Yesterday 4:45 PM' },
      { type: 'note', title: 'Added note to SB211', timestamp: 'Yesterday 2:30 PM' },
      { type: 'task', title: 'Completed testimony draft', timestamp: 'Dec 16 3:15 PM' },
    ],
    upcomingEvents: [
      { startTime: 'Today 4:00 PM', title: 'Energy Committee Hearing', location: 'Capitol Room 302', prepStatus: 'ready' },
      { startTime: 'Tomorrow 10:30 AM', title: 'Client A Strategy Call', prepStatus: 'ready' },
      { startTime: 'Dec 20 2:00 PM', title: 'Stakeholder Roundtable', location: 'Virtual', prepStatus: 'needs-brief' },
      { startTime: 'Dec 21 9:00 AM', title: 'Legislative Staff Meeting', prepStatus: 'needs-brief' },
    ],
    currentFocus: ['HB90 — Solar', 'SB211 — Clean Energy', 'Energy & Environment Committee', 'Clean Energy Town Hall'],
    internalNotes: 'Prefers morning meetings, quick follow-ups via email. Owns Energy client workstream.',
  },
  'SK': {
    id: 'sk-001',
    name: 'Sarah Kim',
    title: 'Policy Associate',
    initials: 'SK',
    email: 'sarah.kim@echocanyonconsulting.com',
    phone: '(602) 555-0198',
    location: 'Phoenix',
    timezone: 'MST',
    status: 'meeting',
    teams: ['Healthcare', 'Education'],
    workStats: {
      openTasksCount: 8,
      dueThisWeekCount: 2,
      overdueCount: 0,
      activeIssuesCount: 4,
    },
    recentActivity: [
      { type: 'brief', title: 'Completed testimony outline', timestamp: 'Today 1:45 PM' },
      { type: 'meeting', title: 'Met with Education Committee staff', timestamp: 'Today 9:00 AM' },
      { type: 'email', title: 'Sent HB234 analysis', timestamp: 'Yesterday 3:30 PM' },
      { type: 'note', title: 'Updated Healthcare bill tracker', timestamp: 'Dec 16 11:15 AM' },
      { type: 'call', title: 'Spoke with stakeholder group', timestamp: 'Dec 15 2:00 PM' },
    ],
    upcomingEvents: [
      { startTime: 'Today 3:30 PM', title: 'Healthcare Stakeholder Meeting', prepStatus: 'ready' },
      { startTime: 'Tomorrow 1:00 PM', title: 'Education Committee Hearing', location: 'Capitol Room 401', prepStatus: 'ready' },
      { startTime: 'Dec 19 10:00 AM', title: 'Client Check-in', prepStatus: 'needs-brief' },
    ],
    currentFocus: ['HB234 — Education Funding', 'SB156 — School Choice', 'Healthcare Task Force'],
    internalNotes: 'Detail-oriented, excellent at policy analysis. Strong relationships with Education Committee staff.',
  },
  'RP': {
    id: 'rp-001',
    name: 'Robert Patel',
    title: 'Account Lead',
    initials: 'RP',
    email: 'robert.patel@echocanyonconsulting.com',
    phone: '(602) 555-0176',
    location: 'Phoenix',
    timezone: 'MST',
    status: 'focus',
    teams: ['Client B', 'Technology'],
    workStats: {
      openTasksCount: 15,
      dueThisWeekCount: 6,
      overdueCount: 2,
      activeIssuesCount: 8,
    },
    recentActivity: [
      { type: 'task', title: 'Created task for testimony review', timestamp: 'Today 3:00 PM' },
      { type: 'email', title: 'Sent AskOroper #59 follow-up', timestamp: 'Today 1:15 PM' },
      { type: 'meeting', title: 'Tech Committee strategy session', timestamp: 'Today 10:00 AM' },
      { type: 'brief', title: 'Prepared HB456 brief', timestamp: 'Yesterday 4:00 PM' },
      { type: 'call', title: 'Client B weekly check-in', timestamp: 'Yesterday 2:30 PM' },
    ],
    upcomingEvents: [
      { startTime: 'Tomorrow 9:00 AM', title: 'Technology Committee Hearing', location: 'Capitol Room 201', prepStatus: 'ready' },
      { startTime: 'Dec 19 3:00 PM', title: 'Client B Quarterly Review', prepStatus: 'needs-brief' },
      { startTime: 'Dec 20 11:00 AM', title: 'Industry Roundtable', location: 'Virtual', prepStatus: 'needs-brief' },
    ],
    currentFocus: ['HB456 — Data Privacy', 'SB789 — Cybersecurity', 'Technology Committee', 'Client B Portfolio'],
    internalNotes: 'Manages largest client account. Prefers structured agendas. Available for urgent matters anytime.',
  },
  'ML': {
    id: 'mk-001',
    name: 'Matt Kenny',
    title: 'President of Echo Canyon Public Affairs',
    initials: 'MK',
    email: 'matt.kenny@echocanyonconsulting.com',
    phone: '(512) 555-0147',
    location: 'Phoenix, AZ',
    timezone: 'MST',
    avatarUrl: 'https://images.squarespace-cdn.com/content/v1/66578126cd326c133100f6fa/1ab4bf6d-0acb-47e2-8d2b-07f155d12449/Matt+Kenney+Headshot+Final.png?format=2500w',
    coverPhotoUrl: 'https://images.unsplash.com/photo-1658605580075-6ff70c7ce156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGF0ZSUyMGNhcGl0b2wlMjBkb21lfGVufDF8fHx8MTc2NjA1NjUyOXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'focus',
    teams: ['State Affairs', 'Energy'],
    workStats: {
      openTasksCount: 10,
      dueThisWeekCount: 3,
      overdueCount: 0,
      activeIssuesCount: 5,
    },
    recentActivity: [
      { type: 'email', title: 'Prepared follow-up email with redline', timestamp: 'Today 2:30 PM' },
      { type: 'meeting', title: 'Housing Committee briefing', timestamp: 'Today 11:00 AM' },
      { type: 'brief', title: 'Generated HB567 analysis', timestamp: 'Yesterday 3:45 PM' },
      { type: 'note', title: 'Updated Transportation tracker', timestamp: 'Dec 16 1:00 PM' },
      { type: 'call', title: 'Spoke with Rep. Martinez', timestamp: 'Dec 15 4:15 PM' },
    ],
    upcomingEvents: [
      { startTime: 'Tomorrow 2:00 PM', title: 'Housing Policy Forum', location: 'Downtown Conference Center', prepStatus: 'ready' },
      { startTime: 'Dec 19 9:30 AM', title: 'Transportation Committee', location: 'Capitol Room 105', prepStatus: 'ready' },
      { startTime: 'Dec 20 1:00 PM', title: 'Client Strategy Session', prepStatus: 'needs-brief' },
    ],
    currentFocus: ['HB567 — Affordable Housing', 'SB432 — Transit Funding', 'HB321 — Infrastructure'],
    internalNotes: 'Senior team member with deep legislative experience. Point person for Housing and Transportation.',
  },
};

export function ActionQueue() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, completed: false, title: 'Call staff: Ortiz\'s LA', description: 'Due: 08/29', owner: 'JD' },
    { id: 2, completed: true, title: 'Draft testimony: leg outline', description: 'Client sign off', owner: 'SK' },
    { id: 3, completed: false, title: 'Send testimony outline', description: 'AskOroper #59', owner: 'RP' },
    { id: 4, completed: false, title: 'Send follow-up email', description: 'Auto-attach redline', owner: 'ML' },
  ]);

  const [selectedUser, setSelectedUser] = React.useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAvatarClick = (owner: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Always center the popover on screen for reliable positioning
    const POPOVER_WIDTH = 400;
    const POPOVER_HEIGHT = 600;
    
    const x = Math.max(20, (window.innerWidth - POPOVER_WIDTH) / 2);
    const y = Math.max(20, (window.innerHeight - POPOVER_HEIGHT) / 2);
    
    setPopoverPosition({ x, y });
    setSelectedUser(owner);
  };
  
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-tight">Action Queue</h3>
      </div>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${task.completed 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-500 hover:border-gray-400'
                }
              `}
            >
              {task.completed && <Check size={14} className="text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className={`font-medium truncate ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                {task.title}
              </div>
              <div className="text-xs text-gray-500 truncate">{task.description}</div>
            </div>
            {task.owner === 'ML' ? (
              <img 
                src={profileImage} 
                alt="ML" 
                className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-red-500 transition-all" 
                onClick={(e) => handleAvatarClick(task.owner, e)}
              />
            ) : (
              <div 
                onClick={(e) => handleAvatarClick(task.owner, e)}
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <Chip variant="neutral" size="sm">{task.owner}</Chip>
              </div>
            )}
            <ChevronRight size={16} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        ))}
      </div>

      {/* User Profile Popover */}
      {selectedUser && mockUsers[selectedUser] && (
        <UserProfilePopover
          user={mockUsers[selectedUser]}
          workStats={mockUsers[selectedUser].workStats}
          recentActivity={mockUsers[selectedUser].recentActivity}
          upcomingEvents={mockUsers[selectedUser].upcomingEvents}
          currentFocus={mockUsers[selectedUser].currentFocus}
          internalNotes={mockUsers[selectedUser].internalNotes}
          position={popoverPosition}
          context={{ type: 'action-queue' }}
          onClose={() => setSelectedUser(null)}
          onAssignTask={() => {
            console.log('Assign task to', selectedUser);
            // TODO: Open assign task modal
          }}
          onViewCalendar={() => {
            console.log('View calendar for', selectedUser);
            // TODO: Open calendar filtered to user
          }}
          onScheduleMeeting={() => {
            console.log('Schedule meeting with', selectedUser);
            // TODO: Open schedule modal
          }}
          onEditNotes={() => {
            console.log('Edit notes for', selectedUser);
            // TODO: Open notes editor
          }}
        />
      )}
    </Card>
  );
}