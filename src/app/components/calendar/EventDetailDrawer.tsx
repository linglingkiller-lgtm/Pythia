import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { CalendarEvent } from './CalendarPage';
import { useTheme } from '../../contexts/ThemeContext';
import {
  X,
  FileText,
  Paperclip,
  CheckSquare,
  TrendingUp,
  MessageSquare,
  MoreVertical,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Sparkles,
  Building,
} from 'lucide-react';

interface EventDetailDrawerProps {
  event: CalendarEvent;
  onClose: () => void;
  onGenerateBrief: () => void;
}

export function EventDetailDrawer({ event, onClose, onGenerateBrief }: EventDetailDrawerProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <>
      {/* Overlay */}
      <div className={`fixed inset-0 z-40 ${
        isDarkMode ? 'bg-black/60' : 'bg-black/30'
      }`} onClick={onClose}></div>

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-[500px] shadow-2xl z-50 overflow-y-auto ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <h2 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{event.title}</h2>
                {event.type === 'Networking' && (
                  <Chip variant="info" size="sm">
                    Pythia-identified
                  </Chip>
                )}
              </div>
              <div className={`space-y-1 text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {event.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  {event.location}
                </div>
                {event.host && (
                  <div className="flex items-center gap-2">
                    <Building size={16} />
                    Host: {event.host}
                  </div>
                )}
                {event.strategicValue && (
                  <div className="flex items-center gap-2 mt-2">
                    <div
                      className={`text-sm font-medium ${
                        event.strategicValue >= 8 
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : event.strategicValue >= 6 
                          ? isDarkMode ? 'text-amber-400' : 'text-amber-600'
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      Strategic Value: {event.strategicValue}/10
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded transition-colors ${
                isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              }`}>
                <MoreVertical size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              <button onClick={onClose} className={`p-2 rounded transition-colors ${
                isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
              }`}>
                <X size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
          </div>

          {/* Linked Objects */}
          {(event.linkedObjects.bills?.length ||
            event.linkedObjects.issues?.length ||
            event.linkedObjects.committees?.length ||
            event.linkedObjects.people?.length) && (
            <div className="mb-6">
              <h4 className={`text-sm font-medium mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Linked Objects</h4>
              <div className="flex flex-wrap gap-2">
                {event.linkedObjects.bills?.map((bill) => (
                  <Chip key={bill} variant="info" size="sm">
                    {bill}
                  </Chip>
                ))}
                {event.linkedObjects.issues?.map((issue) => (
                  <Chip key={issue} variant="neutral" size="sm">
                    {issue}
                  </Chip>
                ))}
                {event.linkedObjects.committees?.map((committee) => (
                  <Chip key={committee} variant="info" size="sm">
                    {committee}
                  </Chip>
                ))}
                {event.linkedObjects.people?.map((person) => (
                  <Chip key={person} variant="neutral" size="sm">
                    {person}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="accent" size="md" className="w-full" onClick={onGenerateBrief}>
              <FileText size={16} />
              Generate Brief
            </Button>
            <Button variant="primary" size="md" className="w-full">
              <MessageSquare size={16} />
              Log Interaction
            </Button>
          </div>

          {/* Prep Packet Block */}
          <Card className="p-4 mb-4">
            <h4 className={`text-sm font-medium mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Prep Packet</h4>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Brief</span>
                <Chip
                  variant={
                    event.prepStatus === 'Ready'
                      ? 'success'
                      : event.prepStatus === 'Draft brief'
                      ? 'warning'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {event.prepStatus === 'Not started' ? 'Not generated' : event.prepStatus}
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Tasks</span>
                <Chip variant="neutral" size="sm">
                  Not created
                </Chip>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Record</span>
                <Chip variant={event.recordStatus === 'Logged' ? 'success' : 'neutral'} size="sm">
                  {event.recordStatus}
                </Chip>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={onGenerateBrief}>
                <FileText size={14} />
                Generate Brief
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                <CheckSquare size={14} />
                Create Tasks
              </Button>
            </div>
          </Card>

          {/* Pythia Opportunity Notes - only for Networking events */}
          {event.type === 'Networking' && event.description && (
            <div className={`p-4 mb-4 rounded-lg border ${
              isDarkMode
                ? 'bg-purple-500/20 border-purple-500/30'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <Sparkles size={16} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />
                Pythia Opportunity Notes
              </h4>
              <div className={`space-y-2 text-sm ${
                isDarkMode ? 'text-purple-200' : 'text-purple-900'
              }`}>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                  }`}></div>
                  <p>Arrive early for informal conversations; target staffers near the registration table.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                  }`}></div>
                  <p>Listen for narrative keywords: 'rate impact', 'reliability', 'jobs'.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                    isDarkMode ? 'bg-purple-400' : 'bg-purple-600'
                  }`}></div>
                  <p>Goal: secure follow-up meeting request with energy LA.</p>
                </div>
              </div>
              <div className={`mt-3 pt-3 border-t ${
                isDarkMode ? 'border-purple-500/30' : 'border-purple-200'
              }`}>
                <div className={`text-xs font-medium mb-1 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-900'
                }`}>Why it matters:</div>
                <p className={`text-xs ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-800'
                }`}>{event.description}</p>
              </div>
            </div>
          )}

          {/* Linked Intelligence Block */}
          <Card className="p-4 mb-4">
            <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <TrendingUp size={16} />
              Linked Intelligence
            </h4>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Latest bill status:</span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}> HB90 passed committee 7-2</span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>New amendment:</span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}> Floor amendment filed by Sen. Martinez</span>
                  </div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <span className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>Narrative trend:</span>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}> Rising support (media mentions +32%)</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tasks Block */}
          <Card className="p-4 mb-4">
            <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <CheckSquare size={16} />
              Tasks
            </h4>
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Review committee analysis</span>
                <span className={`text-xs ml-auto ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>Due today</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Prepare testimony outline</span>
                <span className={`text-xs ml-auto ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>Due Dec 19</span>
              </div>
            </div>
            <Button variant="secondary" size="sm" className="w-full">
              Create Tasks from Template
            </Button>
          </Card>

          {/* Records Block */}
          <div className={`p-4 border rounded-lg ${
            isDarkMode
              ? 'border-amber-500/30 bg-amber-500/20'
              : 'border-amber-200 bg-amber-50'
          }`}>
            <h4 className={`text-sm font-medium mb-3 flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              <MessageSquare size={16} />
              Records
            </h4>
            {event.recordStatus === 'Not logged' ? (
              <>
                <div className="flex items-start gap-2 mb-3">
                  <AlertCircle size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                  <div className={`text-sm ${
                    isDarkMode ? 'text-amber-300' : 'text-amber-800'
                  }`}>
                    No interaction record logged yet. Remember to log this event after it occurs.
                  </div>
                </div>
                <Button variant="warning" size="sm" className="w-full">
                  Log Interaction
                </Button>
              </>
            ) : (
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Record logged on {new Date().toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}