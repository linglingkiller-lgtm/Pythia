import React, { useState } from 'react';
import { X, Clock, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { NotificationCategory } from './NotificationDropdown';
import { useDashboard } from '../../contexts/DashboardContext';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategorySettings {
  enabled: boolean;
  deliveryMethod: 'in-app' | 'email' | 'slack';
}

export function NotificationSettings({ isOpen, onClose }: NotificationSettingsProps) {
  const { briefingMode, setBriefingMode } = useDashboard();
  const [digestMode, setDigestMode] = useState(false);
  const [digestTime, setDigestTime] = useState('09:00');
  
  const [categorySettings, setCategorySettings] = useState<Record<NotificationCategory, CategorySettings>>({
    Compliance: { enabled: true, deliveryMethod: 'in-app' },
    Legislation: { enabled: true, deliveryMethod: 'in-app' },
    Relationship: { enabled: true, deliveryMethod: 'in-app' },
    Records: { enabled: true, deliveryMethod: 'in-app' },
    Intel: { enabled: true, deliveryMethod: 'in-app' },
    Tasks: { enabled: true, deliveryMethod: 'in-app' },
    Calendar: { enabled: true, deliveryMethod: 'in-app' },
  });

  const toggleCategory = (category: NotificationCategory) => {
    setCategorySettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        enabled: !prev[category].enabled,
      },
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center" 
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000000,
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Notification Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Briefing Mode */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Dashboard Briefing Mode</h3>
                <p className="text-sm text-gray-600">
                  Toggle between morning and evening briefing views for a time-appropriate dashboard experience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <button
                onClick={() => setBriefingMode(null)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  briefingMode === null
                    ? 'border-cyan-600 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${briefingMode === null ? 'bg-cyan-100' : 'bg-gray-200'}`}>
                    <X size={20} className={briefingMode === null ? 'text-cyan-600' : 'text-gray-500'} />
                  </div>
                  <span className={`text-sm font-medium ${briefingMode === null ? 'text-cyan-900' : 'text-gray-700'}`}>
                    Off
                  </span>
                </div>
              </button>

              <button
                onClick={() => setBriefingMode('morning')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  briefingMode === 'morning'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${briefingMode === 'morning' ? 'bg-orange-100' : 'bg-gray-200'}`}>
                    <Sun size={20} className={briefingMode === 'morning' ? 'text-orange-500' : 'text-gray-500'} />
                  </div>
                  <span className={`text-sm font-medium ${briefingMode === 'morning' ? 'text-orange-900' : 'text-gray-700'}`}>
                    Morning
                  </span>
                </div>
              </button>

              <button
                onClick={() => setBriefingMode('evening')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  briefingMode === 'evening'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-2 rounded-full ${briefingMode === 'evening' ? 'bg-indigo-100' : 'bg-gray-200'}`}>
                    <Moon size={20} className={briefingMode === 'evening' ? 'text-indigo-600' : 'text-gray-500'} />
                  </div>
                  <span className={`text-sm font-medium ${briefingMode === 'evening' ? 'text-indigo-900' : 'text-gray-700'}`}>
                    Evening
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Digest Mode */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Digest Mode</h3>
                <p className="text-sm text-gray-600">
                  Bundle low-priority "Info" notifications into a daily digest. Urgent and Action Needed notifications still appear immediately.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={digestMode}
                  onChange={(e) => setDigestMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            {digestMode && (
              <div className="flex items-center gap-3 mt-3">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Deliver daily digest at:</span>
                <input
                  type="time"
                  value={digestTime}
                  onChange={(e) => setDigestTime(e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Category Settings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Notification Categories</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which types of notifications you want to receive.
            </p>

            <div className="space-y-2">
              {(Object.keys(categorySettings) as NotificationCategory[]).map((category) => (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={categorySettings[category].enabled}
                        onChange={() => toggleCategory(category)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                    <span className="font-medium text-gray-900">{category}</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
                    In-app only
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Future Features (Placeholder) */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Filters</h3>
            <p className="text-sm text-gray-600 mb-4">
              Filter notifications by client or jurisdiction (coming soon).
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded opacity-50">
                <input type="checkbox" disabled className="rounded" />
                <span className="text-sm text-gray-600">Filter by client</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded opacity-50">
                <input type="checkbox" disabled className="rounded" />
                <span className="text-sm text-gray-600">Filter by jurisdiction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onClose}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}