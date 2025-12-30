import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Loader2, Check, Copy, Download, FileText, ChevronRight, ChevronLeft, 
  Wand2, Save, Plus, Trash2
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { type Client } from '../../data/clientsData';
import { toast } from 'sonner';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { generateClientUpdatePdf } from '../../utils/pdfGenerator';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface ClientUpdateGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

interface UpdateSection {
  id: string;
  title: string;
  items: string[];
}

type Period = 'this-week' | 'last-week' | 'last-30-days' | 'custom';
type Tone = 'neutral' | 'client-friendly' | 'detailed';

export function ClientUpdateGenerator({ isOpen, onClose, client }: ClientUpdateGeneratorProps) {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>('this-week');
  const [tone, setTone] = useState<Tone>('neutral');
  const [draft, setDraft] = useState<UpdateSection[]>([]);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  
  // Export Settings
  const [exportMode, setExportMode] = useState<'compact' | 'expanded'>('compact');
  const [includeBills, setIncludeBills] = useState(true);
  const [includeIssues, setIncludeIssues] = useState(true);
  const [includeLedger, setIncludeLedger] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setDraft([]);
      setPeriod('this-week');
    }
  }, [isOpen]);

  const generatePreview = async () => {
    setLoading(true);
    // Simulate RPC call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock response based on client data
    const mockDraft: UpdateSection[] = [
      {
        id: 'wins',
        title: 'Key Wins & Progress',
        items: [
          `HB 2847 passed House Energy Committee (8-3 vote)`,
          `Secured co-sponsorship from Rep. Martinez`,
          `Positive coverage in Arizona Republic regarding renewable energy standards`
        ]
      },
      {
        id: 'risks',
        title: 'Risks & Challenges',
        items: [
          `Opposition group "Citizens for Affordable Energy" launched digital ad campaign`,
          `Possible amendment to SB 456 delaying implementation timeline`,
          `Budget committee discussions indicate potential cuts to incentive programs`
        ]
      },
      {
        id: 'next-steps',
        title: 'Next Steps (14 Days)',
        items: [
          `Schedule follow-up meetings with 3 swing votes before floor vote`,
          `Draft and submit testimony for Senate hearing on Jan 5`,
          `Finalize coalition letter for distribution to leadership`
        ]
      },
      {
        id: 'asks',
        title: 'Asks & Decisions Needed',
        items: [
          `Review and approve updated talking points for media inquiries`,
          `Confirm availability for legislative reception on Jan 12`,
          `Provide feedback on draft amendment language`
        ]
      }
    ];

    setDraft(mockDraft);
    setLoading(false);
    setStep(2);
  };

  const handleUpdateItem = (sectionId: string, index: number, value: string) => {
    setDraft(prev => prev.map(section => {
      if (section.id === sectionId) {
        const newItems = [...section.items];
        newItems[index] = value;
        return { ...section, items: newItems };
      }
      return section;
    }));
  };

  const handleRemoveItem = (sectionId: string, index: number) => {
    setDraft(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, items: section.items.filter((_, i) => i !== index) };
      }
      return section;
    }));
  };

  const handleAddItem = (sectionId: string) => {
    setDraft(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, items: [...section.items, 'New item...'] };
      }
      return section;
    }));
  };

  const handleFinalize = async () => {
    setLoading(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Client update finalized and saved to deliverables');
    setStep(3);
  };

  const handleExport = async (type: 'email' | 'pdf' | 'docx') => {
    setLoading(true);
    if (type === 'email') {
      const text = draft.map(s => `${s.title}\n${s.items.map(i => `• ${i}`).join('\n')}`).join('\n\n');
      
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        textArea.setAttribute('readonly', '');
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success('Copied to clipboard');
        } else {
          throw new Error('execCommand returned false');
        }
      } catch (err) {
        console.error('Copy failed:', err);
        toast.error('Failed to copy to clipboard');
      }
      setLoading(false);
    } else if (type === 'pdf') {
      try {
        toast.info('Generating PDF Report...');
        await generateClientUpdatePdf({
          clientName: client.name,
          mode: exportMode,
          sections: {
            includeBills,
            includeIssues,
            includeLedger,
            includeOpportunities: false
          },
          draftData: draft
        });
        toast.success('PDF Downloaded');
      } catch (e) {
        console.error(e);
        toast.error('Failed to generate PDF');
      }
      setLoading(false);
    } else if (type === 'docx') {
      try {
        toast.info('Generating DOCX...');
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: `Client Update: ${client.name}`,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 200 },
              }),
              new Paragraph({
                text: `Generated on ${new Date().toLocaleDateString()}`,
                spacing: { after: 400 },
              }),
              ...draft.flatMap(section => [
                new Paragraph({
                  text: section.title,
                  heading: HeadingLevel.HEADING_2,
                  spacing: { before: 400, after: 200 },
                }),
                ...section.items.map(item => new Paragraph({
                  text: item,
                  bullet: {
                    level: 0
                  }
                }))
              ])
            ],
          }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${client.name.replace(/\s+/g, '-').toLowerCase()}-update.docx`);
        toast.success('DOCX Downloaded');
      } catch (e) {
        console.error(e);
        toast.error('Failed to generate DOCX');
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-4xl max-h-[85vh] h-full flex flex-col p-0 gap-0 overflow-hidden border transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-700 text-slate-100' 
          : 'bg-white border-gray-200 text-gray-900'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="w-5 h-5 text-emerald-500" />
            Generate Client Update
          </DialogTitle>
          <DialogDescription className="mt-1">
            {step === 1 && "Select a time period to analyze"}
            {step === 2 && "Review and edit the generated draft"}
            {step === 3 && "Configure export options"}
          </DialogDescription>
          
          <div className="flex items-center gap-2 mt-4 text-sm">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                step >= 1 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>1</div>
              Period
            </div>
            <div className={`w-8 h-px ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                step >= 2 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>2</div>
              Draft
            </div>
            <div className={`w-8 h-px ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                step >= 3 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>3</div>
              Export
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6 max-w-2xl mx-auto py-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'this-week', label: 'This Week', desc: 'Current week activity' },
                  { id: 'last-week', label: 'Last Week', desc: 'Previous week summary' },
                  { id: 'last-30-days', label: 'Last 30 Days', desc: 'Monthly overview' },
                  { id: 'custom', label: 'Custom Range', desc: 'Select dates' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPeriod(opt.id as Period)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      period === opt.id
                        ? isDarkMode 
                          ? 'border-emerald-500 bg-emerald-500/20 ring-1 ring-emerald-500' 
                          : 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                        : isDarkMode
                          ? 'border-slate-700 bg-slate-800 hover:border-slate-600'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-semibold mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{opt.label}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{opt.desc}</div>
                  </button>
                ))}
              </div>

              {period === 'custom' && (
                <div className={`p-4 rounded-lg border flex gap-4 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex-1">
                    <label className="text-xs font-medium mb-1 block">Start Date</label>
                    <input 
                      type="date" 
                      className={`w-full p-2 rounded border ${
                        isDarkMode ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'
                      }`}
                      value={customStartDate}
                      onChange={e => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium mb-1 block">End Date</label>
                    <input 
                      type="date" 
                      className={`w-full p-2 rounded border ${
                        isDarkMode ? 'bg-slate-900 border-slate-600' : 'bg-white border-gray-300'
                      }`}
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tone Preference
                </label>
                <div className={`inline-flex rounded-lg border p-1 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
                  {(['neutral', 'client-friendly', 'detailed'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                        tone === t
                          ? isDarkMode
                            ? 'bg-slate-700 text-white shadow-sm'
                            : 'bg-white text-gray-900 shadow-sm'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-gray-200'
                            : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {t.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-3xl mx-auto">
              {draft.map((section, sectionIndex) => (
                <div key={section.id} className={`p-5 rounded-lg border group ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      {section.title}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddItem(section.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus size={14} /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-3 group/item">
                        <div className={`mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'
                        }`} />
                        <div className="flex-1 relative">
                          <textarea
                            value={item}
                            onChange={(e) => handleUpdateItem(section.id, itemIndex, e.target.value)}
                            className={`w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-sm leading-relaxed ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}
                            rows={Math.max(2, Math.ceil(item.length / 80))}
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(section.id, itemIndex)}
                          className={`opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-500 transition-all ${
                            isDarkMode ? 'text-slate-600' : 'text-gray-400'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {section.items.length === 0 && (
                      <div className={`text-sm italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        No items generated. Add one manually.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 text-center max-w-lg mx-auto">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <Check size={32} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Update Finalized!
                </h3>
                <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  The client update has been saved to your deliverables history. 
                  You can now share it with {client.name}.
                </p>
                
                {/* PDF Configuration */}
                <div className={`w-full p-4 mb-6 rounded-lg border text-left ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <h4 className="font-medium mb-4 text-sm uppercase text-gray-500">PDF Report Settings</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Report Mode</Label>
                        <div className="text-xs text-gray-500">
                          {exportMode === 'compact' ? 'Condensed 2-page summary' : 'Full multi-page report'}
                        </div>
                      </div>
                      <div className={`flex items-center rounded-lg border p-1 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}>
                        <button
                          onClick={() => setExportMode('compact')}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${
                            exportMode === 'compact' 
                              ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'
                              : 'text-gray-500'
                          }`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setExportMode('expanded')}
                          className={`px-3 py-1 text-xs rounded-md transition-all ${
                            exportMode === 'expanded'
                              ? isDarkMode ? 'bg-slate-700 text-white' : 'bg-gray-100 text-gray-900'
                              : 'text-gray-500'
                          }`}
                        >
                          Expanded
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Include Bills</Label>
                      <Switch checked={includeBills} onCheckedChange={setIncludeBills} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include Issues</Label>
                      <Switch checked={includeIssues} onCheckedChange={setIncludeIssues} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Include Engagement Ledger</Label>
                      <Switch checked={includeLedger} onCheckedChange={setIncludeLedger} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 w-full gap-3">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full justify-between"
                    onClick={() => handleExport('email')}
                  >
                    <span className="flex items-center gap-2">
                      <Copy size={18} /> Copy to Email
                    </span>
                    <span className="text-xs opacity-70">Plain text</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="secondary" 
                      className="justify-center"
                      onClick={() => handleExport('pdf')}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <Download size={18} />} PDF Report
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="justify-center"
                      onClick={() => handleExport('docx')}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <FileText size={18} />} DOCX
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className={`p-4 border-t flex justify-between items-center ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-100'
        }`}>
          {step === 1 && (
            <>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={generatePreview} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={16} />}
                Generate Draft
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Back
              </Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toast.success('Draft saved')}>
                  <Save size={16} /> Save Draft
                </Button>
                <Button onClick={handleFinalize} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Check size={16} />}
                  Finalize
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}