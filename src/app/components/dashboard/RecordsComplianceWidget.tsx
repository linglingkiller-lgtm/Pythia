import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Check, AlertCircle, Download } from 'lucide-react';

export function RecordsComplianceWidget() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">Records Compliance Widget</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded bg-white/5 border border-white/10 text-center">
          <div className="text-2xl font-semibold text-gray-900 mb-1">127</div>
          <div className="text-xs text-gray-500">Logged interactions</div>
          <div className="text-xs text-gray-500 mt-1">Oct-Dec</div>
        </div>
        <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle size={16} className="text-amber-400" />
            <div className="text-2xl font-semibold text-amber-400">4</div>
          </div>
          <div className="text-xs text-gray-500">Missing fields</div>
        </div>
        <div className="p-3 rounded bg-green-500/10 border border-green-500/30 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Check size={16} className="text-green-400" />
            <div className="text-2xl font-semibold text-green-400">✓</div>
          </div>
          <div className="text-xs text-gray-500">Export-ready</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Button variant="accent" size="sm" className="w-full">
          <Download size={16} />
          Export quarterly report
        </Button>
        <Button variant="secondary" size="sm" className="w-full">
          Review gaps
        </Button>
      </div>
    </Card>
  );
}