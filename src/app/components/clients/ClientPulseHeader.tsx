import React from 'react';
import { type Client } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { DollarSign, Calendar, AlertTriangle, FileText, Award, TrendingUp } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientPulseHeaderProps {
  client: Client;
}

export function ClientPulseHeader({ client }: ClientPulseHeaderProps) {
  const { isDarkMode } = useTheme();
  
  // Calculate contract runway
  const getContractRunway = () => {
    if (!client.contractEnd) return 0;
    const endDate = new Date(client.contractEnd);
    if (isNaN(endDate.getTime())) return 0;
    
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const runwayDays = getContractRunway();
  
  const formattedContractEnd = client.contractEnd 
    ? new Date(client.contractEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'N/A';
    
  if (formattedContractEnd === 'Invalid Date') {
      // Just in case
  }
  
  const totalDeliverables = 
    client.valueDeliveredThisQuarter.briefs +
    client.valueDeliveredThisQuarter.meetings +
    client.valueDeliveredThisQuarter.testimony +
    client.valueDeliveredThisQuarter.amendments;

  const getIconColor = (baseColor: string) => {
    if (isDarkMode) {
      const darkColors: {[key: string]: string} = {
        'text-green-600': 'text-green-400',
        'text-blue-600': 'text-blue-400',
        'text-gray-600': 'text-gray-400',
        'text-purple-600': 'text-purple-400',
        'text-indigo-600': 'text-indigo-400',
        'text-yellow-600': 'text-yellow-400',
        'text-red-600': 'text-red-400',
      };
      return darkColors[baseColor] || baseColor;
    }
    return baseColor;
  };

  const kpis = [
    {
      label: 'Revenue YTD',
      value: `$${client.contractValueYTD.toLocaleString()}`,
      sublabel: `$${client.contractValueMonthly.toLocaleString()}/mo retainer`,
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      label: 'Profitability',
      value: '64%',
      sublabel: 'Est. margin',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      label: 'Contract Runway',
      value: `${runwayDays} days`,
      sublabel: client.contractEnd ? `Ends ${new Date(client.contractEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No end date',
      icon: Calendar,
      color: runwayDays <= 30 ? 'text-red-600' : runwayDays <= 60 ? 'text-yellow-600' : 'text-gray-600',
    },
    {
      label: 'Active Issues',
      value: client.activeIssuesCount.toString(),
      sublabel: 'Priority areas',
      icon: AlertTriangle,
      color: 'text-purple-600',
    },
    {
      label: 'Active Bills',
      value: client.activeBillsCount.toString(),
      sublabel: 'Under management',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Value Delivered Q4',
      value: totalDeliverables.toString(),
      sublabel: `${client.valueDeliveredThisQuarter.briefs}B • ${client.valueDeliveredThisQuarter.meetings}M • ${client.valueDeliveredThisQuarter.testimony}T • ${client.valueDeliveredThisQuarter.amendments}A`,
      icon: Award,
      color: 'text-indigo-600',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Client Pulse</h2>
        <div className={`text-xs ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/30 border-white/10'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-start justify-between mb-2">
                <div className={`text-xs font-medium uppercase tracking-wide ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {kpi.label}
                </div>
                <Icon size={16} className={getIconColor(kpi.color)} />
              </div>
              <div className={`text-2xl font-bold mb-1 ${getIconColor(kpi.color)}`}>
                {kpi.value}
              </div>
              <div className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {kpi.sublabel}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}