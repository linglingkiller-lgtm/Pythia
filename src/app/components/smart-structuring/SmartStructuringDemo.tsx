import React, { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { useSmartStructuring } from '../../contexts/SmartStructuringContext';

export function SmartStructuringDemo() {
  const { openStructuring } = useSmartStructuring();
  const [demoText, setDemoText] = useState('');

  const exampleTexts = {
    meeting: `Met with Sen. Thompson and Rep. Williams this morning to discuss HB 247 (Clean Energy Transition Act). Both legislators expressed concerns about the implementation timeline but are open to supporting the bill if we can address rural infrastructure challenges.

Key points discussed:
- Need technical briefing on grid integration costs
- Desert Solar Coalition willing to fund feasibility study
- Committee hearing scheduled for January 8, 2025
- Testimony preparation deadline: December 28

Action items:
- Schedule follow-up meetings with both offices by Dec 23
- Prepare technical briefing materials (David to lead research)
- Draft committee testimony with legal review
- Send client update to Desert Solar Coalition by Friday
- File quarterly lobbying compliance report by Dec 22`,

    billAnalysis: `HB 247 amendment analysis - Energy Committee markup session Dec 18, 2024

The committee adopted three substantive amendments:
1. Section 4(b): Extended solar panel installation timeline from 18 to 24 months
2. Section 7: Added rural exemption clause for municipalities under 50,000 population  
3. Section 12: Increased state grant allocation by $15M

Impact on Desert Solar Coalition:
- Timeline extension is favorable, reduces implementation pressure
- Rural exemption may limit market reach but removes political opposition
- Grant increase creates new funding opportunities

Next steps:
- Brief client on amendments by Dec 20
- Update advocacy strategy based on new timeline
- Coordinate with TechForward Initiative on grant application process
- Research rural coalition building opportunities`,

    clientCall: `Client call notes - TechForward Initiative - December 18, 2024

Participants: Sarah Martinez (TechForward), Maria Garcia (our team), David Kim

Discussion topics:
1. Q4 deliverables status
2. SB 156 (Technology Innovation Funding) progress update
3. Budget planning for 2025 contract renewal

Client feedback:
- Very satisfied with legislative tracking and committee testimony
- Requested more frequent updates on SB 156 committee actions
- Interested in expanding scope to include Education Committee bills

Follow-up actions:
- Complete Q4 impact report by Dec 22 (Maria leading)
- Schedule meeting with Education Committee chair's staff
- Draft 2025 contract proposal with expanded scope
- Send weekly SB 156 updates starting next week
- Research education technology legislation for scope expansion`,
  };

  const handleProcessExample = (key: keyof typeof exampleTexts) => {
    const text = exampleTexts[key];
    setDemoText(text);
    openStructuring(text, {
      type: 'general',
      name: key === 'meeting' ? 'Meeting Notes' : key === 'billAnalysis' ? 'Bill Analysis' : 'Client Call'
    });
  };

  const handleProcessCustom = () => {
    if (demoText.trim()) {
      openStructuring(demoText, { type: 'general' });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Smart Structuring Demo</h3>
          <p className="text-xs text-gray-500">Turn messy notes into structured tasks</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Try an example or paste your own notes:
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => handleProcessExample('meeting')}
              className="px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
            >
              Legislator Meeting Notes
            </button>
            <button
              onClick={() => handleProcessExample('billAnalysis')}
              className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Bill Analysis
            </button>
            <button
              onClick={() => handleProcessExample('clientCall')}
              className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
            >
              Client Call Notes
            </button>
          </div>

          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Paste meeting notes, call logs, bill snippets, or any unstructured text here..."
            rows={8}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 font-mono"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleProcessCustom}
            disabled={!demoText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            Process Text
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500">
            <strong>What you'll get:</strong> Structured summary with entity detection, editable action items with owners/dates, 
            complete task bundles with dependencies, and follow-up email drafts.
          </p>
        </div>
      </div>
    </div>
  );
}
