import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

export function RecommendedActions() {
  const [activeTab, setActiveTab] = useState<'summary' | 'impacts' | 'risk'>('summary');
  
  const content = {
    summary: 'Based on recent legislative activity, we recommend scheduling briefings with Energy Committee staff before the 11/2 hearing and coordinating with coalition partners on amendment strategy.',
    impacts: 'The proposed amendment would require quarterly reporting instead of annual, affecting 12 of your active programs. Estimated compliance cost increase: $85K annually.',
    risk: 'Risk assessment: MEDIUM-HIGH. Timeline compressed by 2 weeks. Key stakeholder (Chair Martinez) position unclear. Recommend immediate outreach and position paper by 10/30.'
  };
  
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <h4 className="text-gray-900">Recommended Actions</h4>
        <Chip variant="neutral" size="sm">Auto</Chip>
      </div>
      
      <div className="flex gap-2 mb-4">
        {(['summary', 'impacts', 'risk'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              px-3 py-1.5 rounded text-sm transition-all
              ${activeTab === tab 
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <p className="text-sm text-gray-400 leading-relaxed">
        {content[activeTab]}
      </p>
    </Card>
  );
}