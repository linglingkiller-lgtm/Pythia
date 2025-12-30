import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, MessageSquare, Plus, CheckSquare } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export function QuickActions() {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <h3 className={`mb-4 font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button variant="accent" size="md" className="w-full">
          <FileText size={16} />
          Generate Brief
        </Button>
        <Button variant="primary" size="md" className="w-full">
          <MessageSquare size={16} />
          Log Interaction
        </Button>
        <Button variant="secondary" size="md" className="w-full">
          <Plus size={16} />
          Add Event
        </Button>
        <Button variant="secondary" size="md" className="w-full">
          <CheckSquare size={16} />
          Create Task
        </Button>
      </div>
    </div>
  );
}