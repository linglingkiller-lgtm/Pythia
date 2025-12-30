import React from 'react';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export function AlertsRedFlags() {
  return (
    <Card className="p-5 border-red-500/30 bg-red-500/5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={20} className="text-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-gray-900">High risk: Amendment H24</h3>
            <Chip variant="oppose">7/10</Chip>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Amendment H24 changes enforcement mechanisms in "Clean Air Act" merrillands provisions. 
            This impacts your client's compliance timeline and may require immediate regulatory review.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="accent" size="sm">Open Redline</Button>
            <Button variant="secondary" size="sm">Assign Outreach</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}