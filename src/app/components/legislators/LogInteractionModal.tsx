import React from 'react';
import { createPortal } from 'react-dom';
import { X, Phone, Mail, Video, FileText, Upload } from 'lucide-react';
import { Legislator } from './legislatorData';

interface LogInteractionModalProps {
  legislator: Legislator;
  onClose: () => void;
}

export function LogInteractionModal({ legislator, onClose }: LogInteractionModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = React.useState({
    type: 'call' as 'call' | 'email' | 'meeting' | 'note',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    participants: [] as string[],
    linkedBills: '',
    linkedIssues: '',
    notes: '',
  });

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Log interaction:', formData);
    // TODO: Save interaction to state/backend
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={16} />;
      case 'email':
        return <Mail size={16} />;
      case 'meeting':
        return <Video size={16} />;
      case 'note':
        return <FileText size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">Log Interaction</h2>
            <p className="text-sm text-gray-600 mt-1">
              Recording interaction with {legislator.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interaction Type *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['call', 'email', 'meeting', 'note'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex flex-col items-center gap-2 p-3 border rounded transition-colors ${
                    formData.type === type
                      ? 'bg-red-50 border-red-300 text-red-700'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {getTypeIcon(type)}
                  <span className="text-sm capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants (Legislator + Staff)
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.participants.includes(legislator.name)}
                  onChange={(e) => {
                    const newParticipants = e.target.checked
                      ? [...formData.participants, legislator.name]
                      : formData.participants.filter(p => p !== legislator.name);
                    setFormData({ ...formData, participants: newParticipants });
                  }}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm">{legislator.name} (Legislator)</span>
              </label>
              {legislator.staff.map((staff) => (
                <label key={staff.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(staff.name)}
                    onChange={(e) => {
                      const newParticipants = e.target.checked
                        ? [...formData.participants, staff.name]
                        : formData.participants.filter(p => p !== staff.name);
                      setFormData({ ...formData, participants: newParticipants });
                    }}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm">{staff.name} ({staff.role})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Linked Bills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Bills
            </label>
            <input
              type="text"
              value={formData.linkedBills}
              onChange={(e) => setFormData({ ...formData, linkedBills: e.target.value })}
              placeholder="e.g., HB 2145, SB 1501"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated bill numbers</p>
          </div>

          {/* Linked Issues */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Linked Issues
            </label>
            <input
              type="text"
              value={formData.linkedIssues}
              onChange={(e) => setFormData({ ...formData, linkedIssues: e.target.value })}
              placeholder="e.g., Clean Energy, Water Resources"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated issue tags</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes *
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter detailed notes about this interaction..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <Upload size={16} />
              <span>Upload Files</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Save Interaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
