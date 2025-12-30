import React from 'react';
import { Newspaper, TrendingUp, ExternalLink, Plus, Save } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Mention } from '../../data/billsData';
import { useTheme } from '../../contexts/ThemeContext';

interface MediaNarrativeProps {
  mentions: Mention[];
  billId: string;
}

export function MediaNarrative({ mentions, billId }: MediaNarrativeProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<'all' | 'news' | 'press-release' | 'social'>('all');

  const filteredMentions = activeTab === 'all'
    ? mentions
    : mentions.filter(m => m.sourceType === activeTab);

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'green';
      case 'negative': return 'red';
      default: return 'neutral';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
  };

  // Calculate narrative summary
  const sentimentCounts = mentions.reduce((acc, m) => {
    acc[m.sentiment] = (acc[m.sentiment] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const topPhrases = ['renewable energy mandate', 'rate impacts', 'clean energy jobs', 'grid modernization'];

  return (
    <div className={`p-6 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-700'} />
        <h3 className={`font-bold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Media & Narrative</h3>
      </div>

      {/* Narrative Summary */}
      <div className={`mb-5 p-4 border rounded-lg ${
        isDarkMode
          ? 'bg-slate-700/30 border-white/10'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <h4 className={`text-sm font-semibold mb-3 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Narrative Summary:</h4>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{sentimentCounts.positive || 0}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Positive</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{sentimentCounts.neutral || 0}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Neutral</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{sentimentCounts.negative || 0}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Negative</div>
          </div>
        </div>

        <div>
          <div className={`text-xs font-medium mb-1 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Top Phrases:</div>
          <div className="flex flex-wrap gap-2">
            {topPhrases.map((phrase, index) => (
              <Chip key={index} variant="neutral" size="sm">{phrase}</Chip>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`mb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex gap-4">
          {[
            { key: 'all', label: 'All', count: mentions.length },
            { key: 'news', label: 'News', count: mentions.filter(m => m.sourceType === 'news').length },
            { key: 'press-release', label: 'Press', count: mentions.filter(m => m.sourceType === 'press-release').length },
            { key: 'social', label: 'Social', count: mentions.filter(m => m.sourceType === 'social').length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-2 px-1 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? (isDarkMode 
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-purple-700 border-b-2 border-purple-700')
                  : (isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Mentions Feed */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredMentions.map((mention) => (
          <div
            key={mention.id}
            className={`p-3 border rounded-lg transition-all ${
              isDarkMode
                ? 'border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50/30'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <a
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`font-medium text-sm flex items-center gap-1 ${
                    isDarkMode
                      ? 'text-white hover:text-purple-400'
                      : 'text-gray-900 hover:text-purple-700'
                  } hover:underline`}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Open mention:', mention.url);
                  }}
                >
                  {mention.title}
                  <ExternalLink size={12} />
                </a>
                <div className={`text-xs mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {new Date(mention.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <Chip variant={getSentimentColor(mention.sentiment) as any} size="sm">
                {getSentimentLabel(mention.sentiment)}
              </Chip>
            </div>

            <p className={`text-sm mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>{mention.snippet}</p>

            {/* Tags */}
            {mention.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {mention.tags.map((tag, index) => (
                  <Chip key={index} variant="neutral" size="sm">{tag}</Chip>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">
                <Plus size={12} />
                Add to Brief
              </Button>
              <Button variant="secondary" size="sm">
                <Save size={12} />
                Save to Records
              </Button>
            </div>
          </div>
        ))}

        {filteredMentions.length === 0 && (
          <div className={`text-center py-6 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Newspaper size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No mentions found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}