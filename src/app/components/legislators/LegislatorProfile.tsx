import React from 'react';
import { Legislator } from './legislatorData';
import { LegislatorProfileHeader } from './LegislatorProfileHeader';
import { OverviewTab } from './tabs/OverviewTab';
import { StaffContactsTab } from './tabs/StaffContactsTab';
import { BillsActivityTab } from './tabs/BillsActivityTab';
import { RecordsInteractionsTab } from './tabs/RecordsInteractionsTab';
import { MediaIntelTab } from './tabs/MediaIntelTab';
import { ElectionDistrictTab } from './tabs/ElectionDistrictTab';
import { PredictiveInsightsTab } from './predictive/PredictiveInsightsTab';
import { useTheme } from '../../contexts/ThemeContext';

interface LegislatorProfileProps {
  legislator: Legislator;
  onLogInteraction: () => void;
  onNavigateToBill?: (billId: string) => void;
  watchedLegislatorIds?: Set<string>;
  onToggleWatch?: (legislatorId: string) => void;
}

type TabType = 'overview' | 'staff' | 'bills' | 'records' | 'media' | 'election' | 'predictive';

export function LegislatorProfile({ legislator, onLogInteraction, onNavigateToBill, watchedLegislatorIds, onToggleWatch }: LegislatorProfileProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<TabType>('overview');

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'staff', label: 'Staff & Contacts' },
    { id: 'bills', label: 'Bills & Activity' },
    { id: 'records', label: 'Records & Interactions' },
    { id: 'election', label: 'Election & District' },
    { id: 'media', label: 'Media & Intel' },
    { id: 'predictive', label: 'Predictive Insights' },
  ];

  return (
    <div className={`transition-colors duration-500 ${isDarkMode ? 'bg-transparent' : 'bg-white'}`}>
      {/* Profile Header */}
      <LegislatorProfileHeader 
        legislator={legislator}
        watchedLegislatorIds={watchedLegislatorIds}
        onToggleWatch={onToggleWatch}
      />

      {/* Tabs Navigation */}
      <div className={`border-b sticky top-0 z-10 transition-colors duration-500 ${
        isDarkMode
          ? 'bg-slate-900/60 backdrop-blur-md border-white/10'
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? isDarkMode
                    ? legislator.party === 'D'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-red-500 text-red-400'
                    : legislator.party === 'D'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-red-600 text-red-600'
                  : isDarkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab legislator={legislator} />}
        {activeTab === 'staff' && <StaffContactsTab legislator={legislator} onLogInteraction={onLogInteraction} />}
        {activeTab === 'bills' && <BillsActivityTab legislator={legislator} onNavigateToBill={onNavigateToBill} />}
        {activeTab === 'records' && <RecordsInteractionsTab legislator={legislator} onLogInteraction={onLogInteraction} />}
        {activeTab === 'election' && <ElectionDistrictTab legislator={legislator} />}
        {activeTab === 'media' && <MediaIntelTab legislator={legislator} />}
        {activeTab === 'predictive' && <PredictiveInsightsTab legislator={legislator} />}
      </div>
    </div>
  );
}