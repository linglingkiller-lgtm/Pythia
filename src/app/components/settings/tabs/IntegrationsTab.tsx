import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../contexts/ThemeContext';
import { Check, Plus, Webhook, Mail } from 'lucide-react';

const AdminBadge = () => (
  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
    ADMIN
  </span>
);

export function IntegrationsTab() {
  const { isDarkMode } = useTheme();

  const integrations = [
    {
      id: 'google',
      name: 'Google Workspace',
      desc: 'Sync calendar events and contacts org-wide.',
      icon: 'https://www.google.com/favicon.ico',
      connected: true,
      admin: true
    },
    {
      id: 'slack',
      name: 'Slack',
      desc: 'Send notifications to designated channels.',
      icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
      connected: false,
      admin: true
    },
    {
      id: 'outlook',
      name: 'Microsoft 365',
      desc: 'Email and calendar integration.',
      icon: 'https://res-1.cdn.office.net/files/fabric-cdn-prod_20221209.001/assets/brand-icons/product/svg/office-365_48x1.svg',
      connected: false,
      admin: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((app) => (
          <Card key={app.id} className="p-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between mb-4">
                <img src={app.icon} alt={app.name} className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm" />
                {app.connected ? (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                    <Check size={12} />
                    Connected
                  </span>
                ) : (
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? 'bg-slate-800 text-gray-400 border-slate-700' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    Not Connected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.name}</h3>
                 {app.admin && <AdminBadge />}
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {app.desc}
              </p>
            </div>
            
            <Button 
              variant={app.connected ? "secondary" : "primary"}
              className="w-full justify-center"
            >
              {app.connected ? 'Manage Connection' : 'Connect'}
            </Button>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <Mail size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
             <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Email Relay <AdminBadge /></h3>
           </div>
           <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
             Configure SMTP relay settings for system emails.
           </p>
           <Button variant="secondary" className="w-full">Configure Relay</Button>
        </Card>

        <Card className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <Webhook size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
             <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Webhooks <AdminBadge /></h3>
           </div>
           <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
             Manage outbound webhook endpoints for event notifications.
           </p>
           <Button variant="secondary" className="w-full">Manage Endpoints</Button>
        </Card>
      </div>
    </div>
  );
}
