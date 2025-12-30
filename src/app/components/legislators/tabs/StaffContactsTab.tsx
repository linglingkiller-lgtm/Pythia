import React, { useState } from 'react';
import { Legislator, StaffMember } from '../legislatorData';
import { Copy, Mail, Phone, CheckCircle, Building2, MapPin, User, FileText, Calendar } from 'lucide-react';
import { copyToClipboard } from '../../../utils/clipboard';
import { useTheme } from '../../../contexts/ThemeContext';

interface StaffContactsTabProps {
  legislator: Legislator;
  onLogInteraction: () => void;
}

export function StaffContactsTab({ legislator, onLogInteraction }: StaffContactsTabProps) {
  const { isDarkMode } = useTheme();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleEmailStaff = (staff: StaffMember) => {
    const subject = encodeURIComponent(`Follow-up on [Issue/Bill]`);
    const body = encodeURIComponent(
      `Hi ${staff.name.split(' ')[0]},\n\n` +
      `Following up on [HB90 / Energy issue]...\n\n` +
      `Could we schedule 15 minutes next week?\n\n` +
      `Best regards`
    );
    window.location.href = `mailto:${staff.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6">
      {/* Staff Directory */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Staff Directory</h3>
        <div className="space-y-3">
          {legislator.staff.map((staff) => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onEmail={() => handleEmailStaff(staff)}
              onLogInteraction={onLogInteraction}
              onCopy={handleCopy}
              copiedField={copiedField}
            />
          ))}
        </div>
      </div>

      {/* Legislator Contact Info */}
      <div>
        <h3 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Legislator Contact Information</h3>
        <div className={`p-4 rounded border space-y-3 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-gray-50 border-gray-200'
        }`}>
          {/* Office Phone */}
          {legislator.officePhone && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Phone size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Office Phone:</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.officePhone}</span>
              </div>
              <button
                onClick={() => handleCopy(legislator.officePhone!, `phone-${legislator.id}`)}
                className={`p-1.5 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
                }`}
                title="Copy phone"
              >
                {copiedField === `phone-${legislator.id}` ? (
                  <CheckCircle size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                )}
              </button>
            </div>
          )}

          {/* Email */}
          {legislator.email && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Email:</span>
                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.email}</span>
              </div>
              <button
                onClick={() => handleCopy(legislator.email!, `email-${legislator.id}`)}
                className={`p-1.5 rounded transition-colors ${
                  isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'
                }`}
                title="Copy email"
              >
                {copiedField === `email-${legislator.id}` ? (
                  <CheckCircle size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                )}
              </button>
            </div>
          )}

          {/* Capitol Office */}
          {legislator.capitolOffice && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Capitol Office:</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.capitolOffice}</span>
            </div>
          )}

          {/* District Office */}
          {legislator.districtOffice && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>District Office:</span>
              <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{legislator.districtOffice}</span>
            </div>
          )}

          {/* Preferred Contact Path */}
          {legislator.preferredContactPath && (
            <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-300'}`}>
              <div className="flex items-start gap-2 text-sm">
                <User size={16} className={`mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                  <span className={`font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Preferred Contact Path: </span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{legislator.preferredContactPath}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StaffCardProps {
  staff: StaffMember;
  onEmail: () => void;
  onLogInteraction: () => void;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
}

function StaffCard({ staff, onEmail, onLogInteraction, onCopy, copiedField }: StaffCardProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`p-4 border rounded transition-colors ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10 hover:border-white/20'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{staff.name}</h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{staff.role}</p>
        </div>
        {staff.lastContacted && (
          <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Last: {staff.lastContacted}
          </span>
        )}
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-3">
        {/* Email */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{staff.email}</span>
          </div>
          <button
            onClick={() => onCopy(staff.email, `staff-email-${staff.id}`)}
            className={`p-1 rounded transition-colors ${
              isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
            }`}
            title="Copy email"
          >
            {copiedField === `staff-email-${staff.id}` ? (
              <CheckCircle size={14} className="text-green-600" />
            ) : (
              <Copy size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
            )}
          </button>
        </div>

        {/* Phone */}
        {staff.phone && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{staff.phone}</span>
            </div>
            <button
              onClick={() => onCopy(staff.phone!, `staff-phone-${staff.id}`)}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
              }`}
              title="Copy phone"
            >
              {copiedField === `staff-phone-${staff.id}` ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Notes */}
      {staff.notes && (
        <p className={`text-xs p-2 rounded mb-3 italic ${
          isDarkMode
            ? 'text-gray-400 bg-slate-700/50'
            : 'text-gray-600 bg-gray-50'
        }`}>
          {staff.notes}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onEmail}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded transition-colors text-sm ${
            isDarkMode
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Mail size={14} />
          Email
        </button>
        <button
          onClick={onLogInteraction}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border rounded transition-colors text-sm ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FileText size={14} />
          Log
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 border rounded transition-colors text-sm ${
            isDarkMode
              ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Calendar size={14} />
          Schedule
        </button>
      </div>
    </div>
  );
}