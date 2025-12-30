import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ExternalLink, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface NarrativeTopic {
  id: string;
  name: string;
  trend: 'up' | 'down' | 'stable';
  sentiment: 'positive' | 'negative' | 'neutral';
  topTalkingPoints: string[];
  topSources: string[];
  suggestedResponses: string[];
}

export function NarrativePulse() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics: NarrativeTopic[] = [
    {
      id: '1',
      name: 'Solar Incentives',
      trend: 'down',
      sentiment: 'negative',
      topTalkingPoints: [
        'Cost to ratepayers',
        'Fairness concerns',
        'Subsidy dependency',
      ],
      topSources: ['AZ Republic op-ed', 'Chamber testimony', 'Talk radio'],
      suggestedResponses: [
        'Emphasize grid reliability benefits',
        'Highlight job creation data',
        'Frame as energy security investment',
      ],
    },
    {
      id: '2',
      name: 'Grid Reliability',
      trend: 'up',
      sentiment: 'positive',
      topTalkingPoints: [
        'Recent outages',
        'Peak demand concerns',
        'Resilience investments',
      ],
      topSources: ['Utility reports', 'Legislative hearings', 'News coverage'],
      suggestedResponses: [
        'Tie to solar + storage solutions',
        'Emphasize distributed generation',
        'Highlight modernization needs',
      ],
    },
    {
      id: '3',
      name: 'Ratepayer Impact',
      trend: 'stable',
      sentiment: 'neutral',
      topTalkingPoints: [
        'Bill affordability',
        'Fixed charges',
        'Rate design',
      ],
      topSources: ['Consumer advocates', 'RUCO hearings', 'Media'],
      suggestedResponses: [
        'Focus on long-term savings',
        'Emphasize choice and control',
        'Highlight efficiency programs',
      ],
    },
    {
      id: '4',
      name: 'Clean Energy Jobs',
      trend: 'up',
      sentiment: 'positive',
      topTalkingPoints: [
        'Economic opportunity',
        'Workforce training',
        'Rural development',
      ],
      topSources: ['Industry reports', 'Labor groups', 'Economic dev orgs'],
      suggestedResponses: [
        'Share job creation stats',
        'Highlight training programs',
        'Emphasize local benefits',
      ],
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={12} className="text-green-600" />;
      case 'down':
        return <TrendingDown size={12} className="text-red-600" />;
      default:
        return <Minus size={12} className="text-gray-600" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Narrative & Media Pulse</h3>
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() =>
              setSelectedTopic(selectedTopic === topic.id ? null : topic.id)
            }
            className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all flex items-center gap-2 ${
              selectedTopic === topic.id
                ? 'bg-blue-100 border-blue-300 text-blue-900'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <span>{topic.name}</span>
            {getTrendIcon(topic.trend)}
            <span className={`px-1.5 py-0.5 rounded ${getSentimentColor(topic.sentiment)}`}>
              {topic.sentiment}
            </span>
          </button>
        ))}
      </div>

      {/* Narrative Pack Modal */}
      {selectedTopicData && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-900">
              Narrative Pack: {selectedTopicData.name}
            </h4>
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-blue-600 hover:text-blue-800 text-xs"
            >
              Close
            </button>
          </div>

          {/* Top Talking Points */}
          <div className="mb-3">
            <div className="text-xs font-medium text-blue-900 mb-1">
              Top Talking Points:
            </div>
            <ul className="space-y-1">
              {selectedTopicData.topTalkingPoints.map((point, idx) => (
                <li key={idx} className="text-xs text-blue-800 pl-3">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Top Sources */}
          <div className="mb-3">
            <div className="text-xs font-medium text-blue-900 mb-1">
              Top Sources Driving Story:
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedTopicData.topSources.map((source, idx) => (
                <Chip key={idx} variant="neutral" className="text-xs">
                  {source}
                </Chip>
              ))}
            </div>
          </div>

          {/* Suggested Responses */}
          <div className="mb-3">
            <div className="text-xs font-medium text-blue-900 mb-1">
              Suggested Response Options:
            </div>
            <ul className="space-y-1">
              {selectedTopicData.suggestedResponses.map((response, idx) => (
                <li key={idx} className="text-xs text-blue-800 pl-3">
                  → {response}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="text-xs">
              <FileText size={10} />
              Generate Brief
            </Button>
            <Button variant="secondary" size="sm" className="text-xs">
              <ExternalLink size={10} />
              View Sources
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
