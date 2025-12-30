import React from 'react';
import { Bell, FileText, Users, Vote, MessageSquare, ExternalLink, Pin, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';

interface FeedItem {
  id: string;
  type: 'hearing' | 'amendment' | 'vote' | 'press';
  timestamp: string;
  description: string;
  whyYouCare: string;
  linkedBill?: string;
}

export function LiveIntelFeed() {
  const feed: FeedItem[] = [
    {
      id: '1',
      type: 'hearing',
      timestamp: '2 hours ago',
      description: 'Energy Committee posted HB90 hearing agenda',
      whyYouCare: 'Your client testimony slot confirmed for 2:30pm tomorrow',
      linkedBill: 'HB90',
    },
    {
      id: '2',
      type: 'amendment',
      timestamp: '4 hours ago',
      description: 'Rep. Martinez filed amendment H24 to HB90',
      whyYouCare: 'Adds enforcement authority that may conflict with client position',
      linkedBill: 'HB90',
    },
    {
      id: '3',
      type: 'vote',
      timestamp: '5 hours ago',
      description: 'HB127 scheduled for floor vote next Tuesday',
      whyYouCare: 'GridTech monitoring bill - prepare vote count and outreach',
      linkedBill: 'HB127',
    },
    {
      id: '4',
      type: 'press',
      timestamp: '6 hours ago',
      description: 'AZ Republic op-ed criticizes solar incentives',
      whyYouCare: 'Negative narrative shift - may affect HB90 committee vote',
      linkedBill: 'HB90',
    },
    {
      id: '5',
      type: 'hearing',
      timestamp: '1 day ago',
      description: 'Senate Energy Committee announces hearing schedule',
      whyYouCare: 'Companion bill SB45 hearing in 2 weeks',
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'hearing':
        return <Users size={14} className="text-blue-600" />;
      case 'amendment':
        return <FileText size={14} className="text-purple-600" />;
      case 'vote':
        return <Vote size={14} className="text-green-600" />;
      case 'press':
        return <MessageSquare size={14} className="text-orange-600" />;
      default:
        return <Bell size={14} className="text-gray-600" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Live Legislative Feed</h3>
        <Chip variant="neutral" className="text-xs">
          {feed.length} updates
        </Chip>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {feed.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-gray-50 border border-gray-200 rounded hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(item.type)}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900">
                    {item.description}
                  </span>
                  <span className="text-xs text-gray-500">{item.timestamp}</span>
                </div>

                {/* AI Why you care */}
                <div className="p-2 bg-blue-50 border border-blue-200 rounded mb-2">
                  <div className="flex items-start gap-1">
                    <Sparkles size={10} className="text-blue-600 mt-0.5" />
                    <div>
                      <div className="text-xs font-medium text-blue-900 mb-0.5">
                        Why you should care:
                      </div>
                      <div className="text-xs text-blue-800">{item.whyYouCare}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {item.linkedBill && (
                    <Chip variant="neutral" className="text-xs">
                      {item.linkedBill}
                    </Chip>
                  )}
                  <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <ExternalLink size={10} />
                    Open
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1">
                    <Pin size={10} />
                    Pin
                  </button>
                  <button className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1">
                    <FileText size={10} />
                    Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
