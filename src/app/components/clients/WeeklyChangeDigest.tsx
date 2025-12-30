import React from 'react';
import { type WeeklyChange } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { FileText, Newspaper, Users, CheckCircle, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface WeeklyChangeDigestProps {
  changes: WeeklyChange[];
}

export function WeeklyChangeDigest({ changes }: WeeklyChangeDigestProps) {
  const { isDarkMode } = useTheme();
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'bill': return FileText;
      case 'press': return Newspaper;
      case 'meeting': return Users;
      case 'deliverable': return CheckCircle;
      default: return Sparkles;
    }
  };

  const getIconColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'bill': return 'text-blue-400';
        case 'press': return 'text-purple-400';
        case 'meeting': return 'text-green-400';
        case 'deliverable': return 'text-indigo-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (type) {
        case 'bill': return 'text-blue-600';
        case 'press': return 'text-purple-600';
        case 'meeting': return 'text-green-600';
        case 'deliverable': return 'text-indigo-600';
        default: return 'text-gray-600';
      }
    }
  };

  return (
    <Card className="p-6">
      <h3 className={`font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>What Changed This Week</h3>
      <div className="space-y-3">
        {changes.map((change) => {
          const Icon = getIcon(change.type);
          return (
            <div key={change.id} className="flex items-start gap-3">
              <div className={`mt-0.5 ${getIconColor(change.type)}`}>
                <Icon size={16} />
              </div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>{change.message}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}