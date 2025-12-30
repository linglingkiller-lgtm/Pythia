import React from 'react';
import { type Client } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { AlertTriangle, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ContractBillingPanelProps {
  client: Client;
}

export function ContractBillingPanel({ client }: ContractBillingPanelProps) {
  const { isDarkMode } = useTheme();

  // Calculate contract runway
  const getContractRunway = () => {
    const endDate = new Date(client.contractEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const runwayDays = getContractRunway();

  // Calculate renewal risk
  const getRenewalRisk = () => {
    if (runwayDays <= 30) {
      return { level: 'high', reasons: ['Contract ends in less than 30 days', 'No renewal conversation documented'] };
    } else if (runwayDays <= 60) {
      return { level: 'medium', reasons: ['Contract ends in less than 60 days', 'Should initiate renewal discussion'] };
    }
    return { level: 'low', reasons: ['Contract runway healthy', 'Renewal conversation can be scheduled'] };
  };

  const renewalRisk = getRenewalRisk();

  // Mock utilization data
  const hoursUsed = 145;
  const hoursAllocated = 160;
  const utilizationPercent = Math.round((hoursUsed / hoursAllocated) * 100);

  // Mock scope drift warnings
  const scopeDriftWarnings = [
    {
      id: '1',
      activity: 'Campaign creative design for 2026 races',
      confidence: 'high',
      suggestion: 'This appears outside legislative scope - confirm or create change order',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Contract Details */}
      <Card className="p-6">
        <h3 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Contract Details</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-xs mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Start Date</div>
              <div className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {new Date(client.contractStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>End Date</div>
              <div className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {new Date(client.contractEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div>
            <div className={`text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Term Length</div>
            <div className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {Math.round((new Date(client.contractEnd).getTime() - new Date(client.contractStart).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
            </div>
          </div>

          <div>
            <div className={`text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Contract Runway</div>
            <div className="flex items-center gap-2">
              <div className={`font-bold text-lg ${
                runwayDays <= 30 ? (isDarkMode ? 'text-red-400' : 'text-red-600') :
                runwayDays <= 60 ? (isDarkMode ? 'text-yellow-400' : 'text-yellow-600') :
                (isDarkMode ? 'text-green-400' : 'text-green-600')
              }`}>
                {runwayDays} days
              </div>
              <div className={`flex-1 rounded-full h-2 ${
                isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200'
              }`}>
                <div
                  className={`h-2 rounded-full ${
                    runwayDays <= 30 ? (isDarkMode ? 'bg-red-500' : 'bg-red-600') :
                    runwayDays <= 60 ? (isDarkMode ? 'bg-yellow-500' : 'bg-yellow-600') :
                    (isDarkMode ? 'bg-green-500' : 'bg-green-600')
                  }`}
                  style={{ width: `${Math.min(100, (runwayDays / 365) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className={`pt-4 border-t ${
            isDarkMode ? 'border-white/10' : 'border-gray-200'
          }`}>
            <div className={`text-xs mb-2 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Scope of Work</div>
            <div className={`text-sm p-3 rounded-lg ${
              isDarkMode
                ? 'text-gray-300 bg-slate-700/30'
                : 'text-gray-700 bg-gray-50'
            }`}>
              {client.scopeSummary}
            </div>
          </div>
        </div>
      </Card>

      {/* Billing & Utilization */}
      <Card className="p-6">
        <h3 className={`font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Billing & Utilization</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className={`text-xs mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Monthly Retainer</div>
              <div className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${client.contractValueMonthly.toLocaleString()}
              </div>
            </div>
            <div>
              <div className={`text-xs mb-1 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Revenue YTD</div>
              <div className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                ${client.contractValueYTD.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <div className={`flex items-center justify-between text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Hours Used vs Allocated (This Month)</span>
              <span>{utilizationPercent}%</span>
            </div>
            <div className={`w-full rounded-full h-2 mb-1 ${
              isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200'
            }`}>
              <div
                className={`h-2 rounded-full ${
                  utilizationPercent > 90 ? (isDarkMode ? 'bg-red-500' : 'bg-red-600') :
                  utilizationPercent > 75 ? (isDarkMode ? 'bg-yellow-500' : 'bg-yellow-600') :
                  (isDarkMode ? 'bg-green-500' : 'bg-green-600')
                }`}
                style={{ width: `${utilizationPercent}%` }}
              />
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {hoursUsed} of {hoursAllocated} hours used
            </div>
          </div>
        </div>
      </Card>

      {/* Renewal Risk */}
      <Card className={`p-6 ${
        isDarkMode ? (
          renewalRisk.level === 'high' ? 'bg-red-500/10 border-red-500/30' :
          renewalRisk.level === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
          'bg-green-500/10 border-green-500/30'
        ) : (
          renewalRisk.level === 'high' ? 'bg-red-50 border-red-200' :
          renewalRisk.level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
          'bg-green-50 border-green-200'
        )
      }`}>
        <div className="flex items-start gap-3 mb-3">
          <AlertTriangle size={20} className={
            isDarkMode ? (
              renewalRisk.level === 'high' ? 'text-red-400' :
              renewalRisk.level === 'medium' ? 'text-yellow-400' :
              'text-green-400'
            ) : (
              renewalRisk.level === 'high' ? 'text-red-600' :
              renewalRisk.level === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            )
          } />
          <div className="flex-1">
            <h4 className={`font-semibold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Renewal Risk Assessment</h4>
            <Chip
              variant={
                renewalRisk.level === 'high' ? 'danger' :
                renewalRisk.level === 'medium' ? 'warning' :
                'success'
              }
              size="sm"
            >
              {renewalRisk.level.toUpperCase()} RISK
            </Chip>
          </div>
        </div>

        <div className="space-y-2">
          {renewalRisk.reasons.map((reason, index) => (
            <div key={index} className={`text-sm flex items-start gap-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Scope Drift Detector */}
      {scopeDriftWarnings.length > 0 && (
        <Card className={`p-6 ${
          isDarkMode
            ? 'bg-purple-500/10 border-purple-500/30'
            : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <TrendingUp size={20} className={
              isDarkMode ? 'text-purple-400' : 'text-purple-600'
            } />
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Scope Drift Detector (Revere)</h4>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>Flagged activities that may be outside contracted scope</p>
            </div>
          </div>

          <div className="space-y-3">
            {scopeDriftWarnings.map((warning) => (
              <div key={warning.id} className={`p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10'
                  : 'bg-white border-purple-200'
              }`}>
                <div className={`font-medium text-sm mb-1 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {warning.activity}
                </div>
                <div className={`text-xs mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {warning.suggestion}
                </div>
                <div className="flex items-center gap-2">
                  <Chip variant="info" size="sm">Change Order Opportunity</Chip>
                  <Chip variant="neutral" size="sm">{warning.confidence} confidence</Chip>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}