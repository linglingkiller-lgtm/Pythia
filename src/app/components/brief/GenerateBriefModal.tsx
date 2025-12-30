import React from 'react';
import { X, Loader2 } from 'lucide-react';

interface GenerateBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateBrief: (data: BriefFormData) => void;
  bill?: {
    billId: string;
    title: string;
  };
}

export interface BriefFormData {
  meetingTitle: string;
  dateTime: string;
  location: string;
  attendees: string;
  goal: string;
  includeTalkingPoints: boolean;
  includeQA: boolean;
  includeFollowUpTasks: boolean;
  billId: string;
  billTitle: string;
}

export function GenerateBriefModal({ isOpen, onClose, onGenerateBrief, bill }: GenerateBriefModalProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [formData, setFormData] = React.useState<BriefFormData>({
    meetingTitle: `Meeting Brief — ${bill?.billId} (${bill?.title})`,
    dateTime: '',
    location: 'Capitol Office',
    attendees: 'Will Deiley, A. Rivera, Rep. Jordan Ramirez, Staff',
    goal: 'Secure support',
    includeTalkingPoints: true,
    includeQA: true,
    includeFollowUpTasks: true,
    billId: bill?.billId || '',
    billTitle: bill?.title || '',
  });

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGenerateBrief(formData);
    setIsGenerating(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Brief</h2>
            <p className="text-sm text-gray-500 mt-1">Create a meeting prep packet</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isGenerating}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              value={formData.meetingTitle}
              onChange={(e) => setFormData({ ...formData, meetingTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isGenerating}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isGenerating}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={isGenerating}
              >
                <option>Capitol Office</option>
                <option>District Office</option>
                <option>Zoom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attendees (comma-separated)
            </label>
            <input
              type="text"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Your team, legislator, staff..."
              disabled={isGenerating}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Goal
            </label>
            <select
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={isGenerating}
            >
              <option>Secure support</option>
              <option>Discuss concerns</option>
              <option>Amendment ask</option>
              <option>Information gathering</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Include in Brief
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeTalkingPoints}
                  onChange={(e) => setFormData({ ...formData, includeTalkingPoints: e.target.checked })}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-900">Include Talking Points</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeQA}
                  onChange={(e) => setFormData({ ...formData, includeQA: e.target.checked })}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-900">Include Q&A</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeFollowUpTasks}
                  onChange={(e) => setFormData({ ...formData, includeFollowUpTasks: e.target.checked })}
                  className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  disabled={isGenerating}
                />
                <span className="text-sm text-gray-900">Include Follow-up Tasks</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2 bg-red-900 text-white rounded text-sm hover:bg-red-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating brief...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}