import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Users, Edit, Vote } from 'lucide-react';

interface FeedItem {
  icon: React.ReactNode;
  status: 'green' | 'yellow' | 'red';
  headline: string;
  description: string;
  timestamp: string;
}

export function LiveLegislativeFeed() {
  const feedItems: FeedItem[] = [
    {
      icon: <Edit size={18} />,
      status: 'yellow',
      headline: 'Amendment filed',
      description: 'HB1234: Amendment H24 filed changing enforcement mechanisms in Clean Air Act',
      timestamp: '10/28'
    },
    {
      icon: <Users size={18} />,
      status: 'green',
      headline: 'Hearing posted',
      description: 'Energy Committee scheduled hearing for SB567 on renewable tax credits',
      timestamp: '10/27'
    },
    {
      icon: <Vote size={18} />,
      status: 'red',
      headline: 'Committee vote scheduled',
      description: 'HB890 moving to floor vote earlier than expected - stakeholder outreach needed',
      timestamp: '10/27'
    },
    {
      icon: <FileText size={18} />,
      status: 'green',
      headline: 'Bill introduced',
      description: 'New education funding bill SB999 introduced with bipartisan support',
      timestamp: '10/26'
    },
  ];
  
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500'
  };
  
  return (
    <Card className="p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 tracking-tight">Live Legislative Feed</h3>
      </div>
      
      <div className="space-y-3">
        {feedItems.map((item, index) => (
          <div
            key={index}
            className="p-4 rounded bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center text-gray-400 flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${statusColors[item.status]}`}></div>
                  <h4 className="text-gray-900 font-medium">{item.headline}</h4>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
              <div className="text-xs text-gray-500 flex-shrink-0">{item.timestamp}</div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="secondary" size="sm">Open Bill</Button>
              <Button variant="secondary" size="sm">Generate Brief</Button>
              <Button variant="secondary" size="sm">Assign Task</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}