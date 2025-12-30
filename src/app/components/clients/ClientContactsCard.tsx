import React from 'react';
import { type ClientContact } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Mail, Phone, Plus, StickyNote } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientContactsCardProps {
  contacts: ClientContact[];
}

export function ClientContactsCard({ contacts }: ClientContactsCardProps) {
  const { isDarkMode } = useTheme();
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Client Contacts</h3>
        <Button variant="secondary" size="sm">
          <Plus size={14} />
          Add Contact
        </Button>
      </div>

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div key={contact.id} className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-slate-700/30 border-white/10'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>{contact.name}</div>
                <div className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{contact.role}</div>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2">
                <Mail size={14} className={
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } />
                <a
                  href={`mailto:${contact.email}`}
                  className={`text-sm hover:underline ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} className={
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } />
                  <a
                    href={`tel:${contact.phone}`}
                    className={`text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    {contact.phone}
                  </a>
                </div>
              )}
            </div>

            {contact.notes && (
              <div className={`mb-3 p-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-start gap-2">
                  <StickyNote size={14} className={`mt-0.5 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`} />
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{contact.notes}</div>
                </div>
              </div>
            )}

            {contact.preferences && (
              <div className={`text-xs mb-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <span className="font-medium">Preferences:</span> {contact.preferences}
              </div>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = `mailto:${contact.email}`}
            >
              <Mail size={14} />
              Email
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}