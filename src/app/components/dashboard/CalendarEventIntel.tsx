import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Calendar, MapPin } from 'lucide-react';
import { GenerateBriefModal } from '../brief/GenerateBriefModal';
import { MeetingBriefViewer } from '../brief/MeetingBriefViewer';
import type { BriefFormData } from '../brief/GenerateBriefModal';

interface Event {
  title: string;
  time: string;
  location: string;
  status: string;
}

export function CalendarEventIntel() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [showBriefViewer, setShowBriefViewer] = React.useState(false);
  const [briefData, setBriefData] = React.useState<BriefFormData | null>(null);

  const events: Event[] = [
    { title: 'Hearing: HB1234', time: '10/28 9:00 AM', location: 'Rm 240B, Senate', status: 'Prep packet ready' },
    { title: 'Meeting: Coalition', time: '10/29 2:00 PM', location: 'Virtual', status: 'Agenda sent' },
  ];

  const handleGenerateBrief = (data: BriefFormData) => {
    setBriefData(data);
    setShowBriefViewer(true);
  };

  const handleCloseBriefViewer = () => {
    setShowBriefViewer(false);
  };

  if (showBriefViewer && briefData) {
    return <MeetingBriefViewer briefData={briefData} onClose={handleCloseBriefViewer} />;
  }
  
  return (
    <>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Meetings</h3>
        </div>
        
        <div className="space-y-3 mb-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="p-3 rounded bg-white/5 border border-white/10"
            >
              <div className="flex items-start gap-2 mb-2">
                <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-medium mb-1">{event.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={12} />
                    {event.location}
                  </div>
                </div>
              </div>
              <Chip variant="success" size="sm">{event.status}</Chip>
            </div>
          ))}
        </div>
        
        <Button 
          variant="accent" 
          size="md" 
          className="w-full mb-2"
          onClick={() => setIsModalOpen(true)}
        >
          One-click "Generate Brief"
        </Button>
        
        <Button variant="secondary" size="sm" className="w-full">
          Add Attendees
        </Button>
      </Card>

      <GenerateBriefModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerateBrief={handleGenerateBrief}
        bill={{
          billId: 'HB90',
          title: 'Solar'
        }}
      />
    </>
  );
}