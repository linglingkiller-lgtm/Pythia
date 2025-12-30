import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { CalendarEvent } from './CalendarPage';
import { Button } from '../ui/Button';
import { MeetingBriefViewer } from '../brief/MeetingBriefViewer';
import { NetworkingBriefViewer } from '../brief/NetworkingBriefViewer';
import { BriefFormData } from '../brief/GenerateBriefModal';

interface GenerateEventBriefModalProps {
  event: CalendarEvent;
  onClose: () => void;
}

export function GenerateEventBriefModal({ event, onClose }: GenerateEventBriefModalProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [showBriefViewer, setShowBriefViewer] = React.useState(false);
  const [formData, setFormData] = React.useState({
    meetingTitle: event.title,
    dateTime: event.date.toISOString().slice(0, 16),
    location: event.location,
    attendees: event.linkedObjects.people?.join(', ') || '',
    goal: 'Strategic engagement and relationship building',
    includeTalkingPoints: true,
    includeQA: true,
    includeFollowUpTasks: true,
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
    setShowBriefViewer(true);
  };

  const handleCloseBriefViewer = () => {
    setShowBriefViewer(false);
    onClose();
  };

  if (showBriefViewer) {
    // For Networking events, use the NetworkingBriefViewer
    if (event.type === 'Networking') {
      return <NetworkingBriefViewer event={event} onClose={handleCloseBriefViewer} />;
    }

    // For other event types, use the MeetingBriefViewer
    const briefData: BriefFormData = {
      ...formData,
      billId: event.linkedObjects.bills?.[0] || 'N/A',
      billTitle: event.linkedObjects.issues?.join(', ') || event.title,
      // Split attendees string into proper structure
      attendees: {
        yourTeam: ['Will Deiley', 'A. Rivera'],
        legislatorOffice: formData.attendees
          .split(',')
          .map((a) => a.trim())
          .filter((a) => a.length > 0),
      } as any,
      // Add includeOptions structure
      includeOptions: {
        talkingPoints: formData.includeTalkingPoints,
        qa: formData.includeQA,
        taskChecklist: formData.includeFollowUpTasks,
      } as any,
    };
    return <MeetingBriefViewer briefData={briefData} onClose={handleCloseBriefViewer} />;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Generate Event Brief</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Event Info Summary */}
            <div className="p-4 bg-gray-50 rounded border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div><strong>Event:</strong> {event.title}</div>
                <div><strong>Type:</strong> {event.type}</div>
                <div><strong>Date:</strong> {event.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })} at {event.time}</div>
                <div><strong>Location:</strong> {event.location}</div>
                {event.description && <div><strong>Description:</strong> {event.description}</div>}
              </div>
            </div>

            {/* Meeting Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brief Title
              </label>
              <input
                type="text"
                value={formData.meetingTitle}
                onChange={(e) => setFormData({ ...formData, meetingTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Attendees
              </label>
              <textarea
                value={formData.attendees}
                onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="List key attendees..."
              />
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Goal
              </label>
              <textarea
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="What do you want to achieve?"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeTalkingPoints}
                  onChange={(e) =>
                    setFormData({ ...formData, includeTalkingPoints: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Include talking points</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeQA}
                  onChange={(e) => setFormData({ ...formData, includeQA: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Include Q&A preparation</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.includeFollowUpTasks}
                  onChange={(e) =>
                    setFormData({ ...formData, includeFollowUpTasks: e.target.checked })
                  }
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Include follow-up tasks</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <Button variant="secondary" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Brief'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}