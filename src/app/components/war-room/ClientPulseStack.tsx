import React from 'react';
import { Building2, DollarSign, Calendar, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

interface ClientPulse {
  id: string;
  name: string;
  revenue: string;
  retainer: string;
  runwayDays: number;
  health: 'excellent' | 'good' | 'warning' | 'critical';
  deliverablesThisWeek: number;
  topRisk: string;
  topOpportunity: string;
}

export function ClientPulseStack() {
  const clients: ClientPulse[] = [
    {
      id: '1',
      name: 'GridTech Solutions',
      revenue: '$120K',
      retainer: '$10K/mo',
      runwayDays: 45,
      health: 'warning',
      deliverablesThisWeek: 2,
      topRisk: 'Low deliverable cadence, contract renewal at risk',
      topOpportunity: 'EV infrastructure expansion opportunity',
    },
    {
      id: '2',
      name: 'SolarCorp Energy',
      revenue: '$180K',
      retainer: '$15K/mo',
      runwayDays: 120,
      health: 'excellent',
      deliverablesThisWeek: 4,
      topRisk: 'HB90 amendment may conflict with position',
      topOpportunity: 'Grid reliability framing gaining traction',
    },
    {
      id: '3',
      name: 'Clean Energy Alliance',
      revenue: '$90K',
      retainer: '$7.5K/mo',
      runwayDays: 180,
      health: 'good',
      deliverablesThisWeek: 3,
      topRisk: 'Opposition coalition forming',
      topOpportunity: 'Coalition expansion into Senate',
    },
  ];

  const healthColors = {
    excellent: 'bg-green-100 text-green-800 border-green-300',
    good: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const runwayColor = (days: number) => {
    if (days < 60) return 'text-red-600';
    if (days < 120) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Client Pulse</h3>
        <Chip variant="neutral" className="text-xs">
          {clients.length} clients
        </Chip>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-3 bg-gray-50 border border-gray-200 rounded hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building2 size={14} className="text-gray-600" />
                <span className="text-xs font-semibold text-gray-900">{client.name}</span>
              </div>
              <div
                className={`px-2 py-0.5 rounded text-xs font-medium border ${
                  healthColors[client.health]
                }`}
              >
                {client.health.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
              <div className="flex items-center gap-1 text-gray-600">
                <DollarSign size={10} />
                <span className="font-medium">{client.revenue}</span>
                <span className="text-gray-500">YTD</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <span className="font-medium">{client.retainer}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={10} className="text-gray-600" />
                <span className={`font-medium ${runwayColor(client.runwayDays)}`}>
                  {client.runwayDays} days
                </span>
                <span className="text-gray-500">runway</span>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{client.deliverablesThisWeek}</span>
                <span className="text-gray-500"> deliverables</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-1 text-xs">
                <AlertTriangle size={10} className="text-red-600 mt-0.5" />
                <span className="text-red-700 flex-1">{client.topRisk}</span>
              </div>
              <div className="flex items-start gap-1 text-xs">
                <Lightbulb size={10} className="text-green-600 mt-0.5" />
                <span className="text-green-700 flex-1">{client.topOpportunity}</span>
              </div>
            </div>

            <button className="text-xs text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1">
              <ExternalLink size={10} />
              View client page
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
