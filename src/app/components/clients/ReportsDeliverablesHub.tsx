import React from 'react';
import { type Client } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Download, Mail, BarChart, FileCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ReportsDeliverablesHubProps {
  client: Client;
  onOpenGenerator?: () => void;
}

export function ReportsDeliverablesHub({ client, onOpenGenerator }: ReportsDeliverablesHubProps) {
  const { isDarkMode } = useTheme();
  
  const reports = [
    {
      id: '1',
      name: 'Weekly Update',
      description: 'Comprehensive weekly legislative activity summary',
      icon: Mail,
      lastGenerated: '2024-12-15',
    },
    {
      id: '2',
      name: 'Bill Status Report',
      description: 'Current status of all tracked bills with impact analysis',
      icon: FileText,
      lastGenerated: '2024-12-14',
    },
    {
      id: '3',
      name: 'QBR Summary',
      description: 'Quarterly business review slide-style summary',
      icon: BarChart,
      lastGenerated: '2024-10-01',
    },
    {
      id: '4',
      name: 'Compliance Activity Log',
      description: 'Detailed log of all lobbying and engagement activities',
      icon: FileCheck,
      lastGenerated: '2024-12-01',
    },
  ];

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-slate-800/40 border-white/10'
          : 'bg-white/80 border-gray-200'
      }`}>
        <h3 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Client-Ready Reports</h3>
        <p className={`text-sm mb-4 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          Generate and export professional reports for client delivery
        </p>

        <div className="space-y-3">
          {reports.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className={`p-4 rounded-lg border transition-colors ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10 hover:border-emerald-500/30'
                  : 'bg-gray-50 border-gray-200 hover:border-emerald-300'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded ${
                    isDarkMode
                      ? 'bg-emerald-500/20'
                      : 'bg-emerald-100'
                  }`}>
                    <Icon size={20} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                  </div>

                  <div className="flex-1">
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{report.name}</div>
                    <div className={`text-sm mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{report.description}</div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Last generated: {new Date(report.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="primary" size="sm">
                      Generate
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revere Client Update Generator */}
      <div className={`p-6 rounded-lg backdrop-blur-xl border ${
        isDarkMode
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded ${
            isDarkMode
              ? 'bg-emerald-500'
              : 'bg-emerald-600'
          }`}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-900'
            }`}>Revere Client Update Generator</h4>
            <p className={`text-sm ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
            }`}>
              Automatically converts internal notes, bill movement, and engagement records into a clean, neutral client email/report
            </p>
          </div>
        </div>

        <div className={`space-y-3 mb-4 p-4 rounded-lg border ${
          isDarkMode
            ? 'bg-slate-800/50 border-emerald-500/20'
            : 'bg-white border-emerald-200'
        }`}>
          <div>
            <div className={`text-xs font-semibold mb-1 ${
              isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
            }`}>What's included:</div>
            <ul className={`text-sm space-y-1 list-disc list-inside ${
              isDarkMode ? 'text-emerald-200' : 'text-emerald-700'
            }`}>
              <li>Wins (bills advanced, supportive votes secured)</li>
              <li>Risks (opposition activity, unfavorable amendments)</li>
              <li>Next steps (upcoming hearings, recommended actions)</li>
              <li>Asks/decisions needed from client</li>
            </ul>
          </div>
        </div>

        <Button variant="primary" onClick={onOpenGenerator}>
          <Mail size={16} />
          Generate Client Update Now
        </Button>
      </div>
    </div>
  );
}