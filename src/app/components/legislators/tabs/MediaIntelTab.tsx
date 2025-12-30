import React from 'react';
import { Legislator, MediaMention } from '../legislatorData';
import { Newspaper, FileText, Twitter, ExternalLink, Briefcase, Save } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface MediaIntelTabProps {
  legislator: Legislator;
}

export function MediaIntelTab({ legislator }: MediaIntelTabProps) {
  const { isDarkMode } = useTheme();
  const [filterType, setFilterType] = React.useState<string>('all');

  const filteredMentions = filterType === 'all'
    ? legislator.mediaMentions
    : legislator.mediaMentions.filter(m => m.type === filterType);

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filterType === 'all'
                ? 'bg-red-600 text-white'
                : isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({legislator.mediaMentions.length})
          </button>
          <button
            onClick={() => setFilterType('news')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filterType === 'news'
                ? 'bg-red-600 text-white'
                : isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            News ({legislator.mediaMentions.filter(m => m.type === 'news').length})
          </button>
          <button
            onClick={() => setFilterType('press-release')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filterType === 'press-release'
                ? 'bg-red-600 text-white'
                : isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Press Releases ({legislator.mediaMentions.filter(m => m.type === 'press-release').length})
          </button>
          <button
            onClick={() => setFilterType('social')}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              filterType === 'social'
                ? 'bg-red-600 text-white'
                : isDarkMode
                ? 'bg-slate-700/50 border border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Social ({legislator.mediaMentions.filter(m => m.type === 'social').length})
          </button>
        </div>
      </div>

      {/* Mentions Feed */}
      <div className="space-y-3">
        {filteredMentions.length > 0 ? (
          filteredMentions.map((mention) => (
            <MediaMentionCard key={mention.id} mention={mention} />
          ))
        ) : (
          <div className={`text-sm p-8 rounded text-center ${
            isDarkMode
              ? 'text-gray-400 bg-slate-800/40'
              : 'text-gray-500 bg-gray-50'
          }`}>
            No {filterType === 'all' ? '' : filterType} mentions found
          </div>
        )}
      </div>
    </div>
  );
}

interface MediaMentionCardProps {
  mention: MediaMention;
}

function MediaMentionCard({ mention }: MediaMentionCardProps) {
  const { isDarkMode } = useTheme();
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <Newspaper size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />;
      case 'press-release':
        return <FileText size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />;
      case 'social':
        return <Twitter size={16} className={isDarkMode ? 'text-sky-400' : 'text-sky-500'} />;
      default:
        return <FileText size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'news':
        return 'News';
      case 'press-release':
        return 'Press Release';
      case 'social':
        return 'Social Media';
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'news':
          return 'bg-blue-500/20 text-blue-300';
        case 'press-release':
          return 'bg-purple-500/20 text-purple-300';
        case 'social':
          return 'bg-sky-500/20 text-sky-300';
        default:
          return 'bg-gray-500/20 text-gray-300';
      }
    }
    switch (type) {
      case 'news':
        return 'bg-blue-100 text-blue-700';
      case 'press-release':
        return 'bg-purple-100 text-purple-700';
      case 'social':
        return 'bg-sky-100 text-sky-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    if (isDarkMode) {
      switch (sentiment) {
        case 'positive':
          return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'neutral':
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        case 'negative':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    }
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className={`p-4 border rounded transition-colors ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10 hover:border-white/20'
        : 'bg-white border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getTypeIcon(mention.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 className={`font-semibold flex-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mention.title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded border ml-2 ${getSentimentColor(mention.sentiment)}`}>
              {mention.sentiment.charAt(0).toUpperCase() + mention.sentiment.slice(1)}
            </span>
          </div>

          <div className={`flex items-center gap-2 mb-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`px-2 py-0.5 rounded ${getTypeBadgeColor(mention.type)}`}>
              {getTypeLabel(mention.type)}
            </span>
            <span>{mention.source}</span>
            <span>•</span>
            <span>{mention.timestamp}</span>
          </div>

          <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{mention.snippet}</p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
              isDarkMode
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}>
              <ExternalLink size={14} />
              View Source
            </button>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
              isDarkMode
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}>
              <Briefcase size={14} />
              Add to Brief
            </button>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 border rounded transition-colors text-sm ${
              isDarkMode
                ? 'bg-slate-700/50 border-white/10 text-gray-300 hover:bg-slate-600/50'
                : 'bg-white border-gray-300 hover:bg-gray-50'
            }`}>
              <Save size={14} />
              Save to Records
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}