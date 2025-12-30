import React from 'react';
import { type ClientBill } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { FileText, ExternalLink, Calendar, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ClientBillRosterProps {
  bills: ClientBill[];
  onNavigateToBill?: (billId: string) => void;
}

export function ClientBillRoster({ bills, onNavigateToBill }: ClientBillRosterProps) {
  const { isDarkMode } = useTheme();
  const pinnedBills = bills.filter(b => b.pinned);
  const monitoringBills = bills.filter(b => !b.pinned);

  return (
    <div className="space-y-6">
      {/* Pinned / Core Bills */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Core Bills (Pinned)</h3>
          <Button variant="secondary" size="sm">
            <Plus size={14} />
            Add Bill
          </Button>
        </div>

        <div className="space-y-3">
          {pinnedBills.map(bill => (
            <BillRow
              key={bill.id}
              bill={bill}
              onNavigateToBill={onNavigateToBill}
            />
          ))}
        </div>
      </Card>

      {/* Monitoring */}
      {monitoringBills.length > 0 && (
        <Card className="p-6">
          <h3 className={`font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Monitoring</h3>
          <div className="space-y-3">
            {monitoringBills.map(bill => (
              <BillRow
                key={bill.id}
                bill={bill}
                onNavigateToBill={onNavigateToBill}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

interface BillRowProps {
  bill: ClientBill;
  onNavigateToBill?: (billId: string) => void;
}

function BillRow({ bill, onNavigateToBill }: BillRowProps) {
  const { isDarkMode } = useTheme();
  
  const getStanceVariant = (stance: string) => {
    switch (stance) {
      case 'support': return 'success';
      case 'oppose': return 'danger';
      default: return 'neutral';
    }
  };

  const getImpactColor = (impact: string) => {
    if (isDarkMode) {
      switch (impact) {
        case 'high': return 'text-red-400 font-semibold';
        case 'medium': return 'text-yellow-400 font-semibold';
        case 'low': return 'text-gray-400';
        default: return 'text-gray-400';
      }
    } else {
      switch (impact) {
        case 'high': return 'text-red-600 font-semibold';
        case 'medium': return 'text-yellow-600 font-semibold';
        case 'low': return 'text-gray-600';
        default: return 'text-gray-600';
      }
    }
  };

  return (
    <div className={`p-4 rounded-lg border transition-colors ${
      isDarkMode
        ? 'bg-slate-700/30 border-white/10 hover:border-emerald-500/50'
        : 'bg-gray-50 border-gray-200 hover:border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{bill.billNumber}</h4>
            <Chip variant={getStanceVariant(bill.stance)} size="sm">
              {bill.stance}
            </Chip>
            <Chip variant="neutral" size="sm">
              {bill.status}
            </Chip>
          </div>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>{bill.billTitle}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className={`flex items-center justify-between text-xs mb-1 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>Legislative Progress</span>
          <span>{bill.statusProgress}%</span>
        </div>
        <div className={`w-full rounded-full h-2 ${
          isDarkMode ? 'bg-slate-600/50' : 'bg-gray-200'
        }`}>
          <div
            className={`h-2 rounded-full ${
              isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
            }`}
            style={{ width: `${bill.statusProgress}%` }}
          />
        </div>
      </div>

      {/* Meta Info */}
      <div className={`flex items-center justify-between text-sm mb-3 pb-3 border-b ${
        isDarkMode ? 'border-white/10' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          {bill.nextActionDate && (
            <div className={`flex items-center gap-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Calendar size={14} />
              <span className="text-xs">Next: {new Date(bill.nextActionDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Owner: <span className="font-medium">{bill.ownerName}</span>
          </div>
          <div className={`text-xs ${getImpactColor(bill.impactRating)}`}>
            {bill.impactRating.toUpperCase()} Impact
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigateToBill?.(bill.billId)}
        >
          <ExternalLink size={14} />
          Open Bill
        </Button>
        <Button variant="secondary" size="sm">
          <FileText size={14} />
          Generate Brief
        </Button>
        <Button variant="secondary" size="sm">
          <Calendar size={14} />
          Add to Calendar
        </Button>
        <Button variant="secondary" size="sm">
          <Plus size={14} />
          Create Task
        </Button>
      </div>
    </div>
  );
}