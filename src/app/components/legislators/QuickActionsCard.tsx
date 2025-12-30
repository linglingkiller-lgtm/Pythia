import React from 'react';
import { Mail, Phone, Briefcase, Calendar, FileText, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Legislator } from './legislatorData';
import { useTheme } from '../../contexts/ThemeContext';

interface QuickActionsCardProps {
  legislator: Legislator;
  onLogInteraction: () => void;
  watchedLegislatorIds?: Set<string>;
  onToggleWatch?: (legislatorId: string) => void;
}

export function QuickActionsCard({ legislator, onLogInteraction, watchedLegislatorIds, onToggleWatch }: QuickActionsCardProps) {
  const { isDarkMode } = useTheme();
  const isWatched = watchedLegislatorIds ? watchedLegislatorIds.has(legislator.id) : legislator.watched;
  const [showEmailDropdown, setShowEmailDropdown] = React.useState(false);
  const [showCallDropdown, setShowCallDropdown] = React.useState(false);

  const handleEmail = (email: string, name: string) => {
    const subject = encodeURIComponent(`Follow-up on [Issue/Bill]`);
    const body = encodeURIComponent(
      `Hi ${name.split(' ')[0]},\n\n` +
      `Following up on [HB90 / Energy issue]...\n\n` +
      `Could we schedule 15 minutes next week?\n\n` +
      `Best regards`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setShowEmailDropdown(false);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
    setShowCallDropdown(false);
  };

  const handleGenerateBrief = () => {
    console.log('Generate Meeting Brief for', legislator.name);
    // TODO: Open brief generation modal
  };

  const handleScheduleMeeting = () => {
    console.log('Schedule meeting with', legislator.name);
    // TODO: Open calendar modal
  };

  const handleToggleWatch = () => {
    if (onToggleWatch) {
      onToggleWatch(legislator.id);
    }
  };

  return (
    <div className={`p-5 rounded-xl backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Quick Actions
      </h3>
      
      <div className="space-y-2">
        {/* Email Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowEmailDropdown(!showEmailDropdown)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg transition-all ${
              isDarkMode
                ? 'bg-red-600/90 text-white hover:bg-red-600 border border-red-500/30'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Mail size={16} />
              <span className="text-sm font-medium">Email</span>
            </div>
            <ChevronDown size={16} />
          </button>
          
          {showEmailDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 ${
              isDarkMode
                ? 'bg-slate-800 border-white/10'
                : 'bg-white border-gray-300'
            }`}>
              {legislator.email && (
                <button
                  onClick={() => handleEmail(legislator.email!, legislator.name)}
                  className={`w-full text-left px-3 py-2 transition-colors text-sm border-b ${
                    isDarkMode
                      ? 'hover:bg-slate-700 border-white/10'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {legislator.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {legislator.email}
                  </div>
                </button>
              )}
              {legislator.staff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleEmail(staff.email, staff.name)}
                  className={`w-full text-left px-3 py-2 transition-colors text-sm border-b last:border-b-0 ${
                    isDarkMode
                      ? 'hover:bg-slate-700 border-white/10'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {staff.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {staff.role}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Call Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCallDropdown(!showCallDropdown)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <span className="text-sm font-medium">Call</span>
            </div>
            <ChevronDown size={16} />
          </button>
          
          {showCallDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 ${
              isDarkMode
                ? 'bg-slate-800 border-white/10'
                : 'bg-white border-gray-300'
            }`}>
              {legislator.officePhone && (
                <button
                  onClick={() => handleCall(legislator.officePhone!)}
                  className={`w-full text-left px-3 py-2 transition-colors text-sm border-b ${
                    isDarkMode
                      ? 'hover:bg-slate-700 border-white/10'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Office
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {legislator.officePhone}
                  </div>
                </button>
              )}
              {legislator.staff.filter(s => s.phone).map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => handleCall(staff.phone!)}
                  className={`w-full text-left px-3 py-2 transition-colors text-sm border-b last:border-b-0 ${
                    isDarkMode
                      ? 'hover:bg-slate-700 border-white/10'
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {staff.name}
                  </div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {staff.phone}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Generate Meeting Brief */}
        <button
          onClick={handleGenerateBrief}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Briefcase size={16} />
          <span className="text-sm font-medium">Generate Meeting Brief</span>
        </button>

        {/* Schedule Meeting */}
        <button
          onClick={handleScheduleMeeting}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Calendar size={16} />
          <span className="text-sm font-medium">Schedule Meeting</span>
        </button>

        {/* Log Interaction */}
        <button
          onClick={onLogInteraction}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText size={16} />
          <span className="text-sm font-medium">Log Interaction</span>
        </button>

        {/* Watch Legislator */}
        <button
          onClick={() => onToggleWatch?.(legislator.id)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg transition-all ${
            isWatched
              ? isDarkMode
                ? 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30'
                : 'bg-red-50 border-red-300 text-red-700 hover:bg-red-100'
              : isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-white hover:bg-slate-700'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {isWatched ? <Eye size={16} /> : <EyeOff size={16} />}
          <span className="text-sm font-medium">{isWatched ? 'Watching' : 'Watch Legislator'}</span>
        </button>
      </div>
    </div>
  );
}