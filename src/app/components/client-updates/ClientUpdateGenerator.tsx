import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Loader2, Check, Copy, Download, FileText, ChevronRight, ChevronLeft, 
  Wand2, Save, Plus, Trash2, Settings, Zap, DollarSign
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
      <DialogContent className={`sm:max-w-4xl max-h-[85vh] h-full flex flex-col p-0 gap-0 overflow-hidden border transition-colors duration-300 backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-slate-900/80 border-white/10 text-slate-100 shadow-2xl' 
          : 'bg-white/80 border-gray-200 text-gray-900 shadow-xl'
      }`}>
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
              <Wand2 className="w-5 h-5 text-emerald-500" />
            </div>
            Generate Client Update
          </DialogTitle>
          <DialogDescription className="mt-1">
            {step === 1 && "Select a time period to analyze"}
            {step === 2 && "Review and edit the generated draft"}
            {step === 3 && "Configure export options"}
          </DialogDescription>
          
          <div className="flex items-center gap-2 mt-6 text-sm">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                step >= 1 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>1</div>
              Period
            </div>
            <div className={`w-12 h-px ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                step >= 2 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>2</div>
              Draft
            </div>
            <div className={`w-12 h-px ${step >= 3 ? 'bg-emerald-500' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-emerald-500 font-medium' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${
                step >= 3 ? 'border-emerald-500 bg-emerald-500/10' : 'border-gray-300'
              }`}>3</div>
              Export
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0 bg-transparent">
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-8 max-w-3xl mx-auto">
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
                    className={`p-5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                      period === opt.id
                        ? isDarkMode 
                          ? 'border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/50' 
                          : 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                        : isDarkMode
                          ? 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`font-semibold mb-1 text-lg ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{opt.label}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{opt.desc}</div>
                    
                    {period === opt.id && (
                      <div className="absolute top-3 right-3 text-emerald-500">
                        <Check size={18} />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {period === 'custom' && (
                <div className={`p-6 rounded-xl border flex gap-6 ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-70">Start Date</label>
                    <input 
                      type="date" 
                      className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                        isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-300'
                      }`}
                      value={customStartDate}
                      onChange={e => setCustomStartDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-70">End Date</label>
                    <input 
                      type="date" 
                      className={`w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                        isDarkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-gray-300'
                      }`}
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="mt-10">
                <label className={`block text-sm font-bold uppercase tracking-wider mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Tone Preference
                </label>
                <div className={`inline-flex rounded-xl border p-1.5 w-full ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                  {(['neutral', 'client-friendly', 'detailed'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all capitalize ${
                        tone === t
                          ? isDarkMode
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                            : 'bg-white text-gray-900 shadow-sm'
                          : isDarkMode
                            ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
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
              <div className="space-y-6 max-w-4xl mx-auto">
              {draft.map((section, sectionIndex) => (
                <div key={section.id} className={`p-6 rounded-xl border group transition-all duration-300 hover:shadow-lg ${
                  isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/[0.07]' : 'bg-white border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
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
                      <div key={itemIndex} className="flex gap-4 group/item">
                        <div className={`mt-2.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'
                        }`} />
                        <div className="flex-1 relative">
                          <textarea
                            value={item}
                            onChange={(e) => handleUpdateItem(section.id, itemIndex, e.target.value)}
                            className={`w-full bg-transparent border-none resize-none focus:ring-0 p-0 text-base leading-relaxed font-light ${
                              isDarkMode ? 'text-gray-200 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'
                            }`}
                            rows={Math.max(2, Math.ceil(item.length / 80))}
                            placeholder="Type update here..."
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(section.id, itemIndex)}
                          className={`opacity-0 group-hover/item:opacity-100 p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all ${
                            isDarkMode ? 'text-slate-600' : 'text-gray-400'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {section.items.length === 0 && (
                      <div className={`text-sm italic p-4 rounded-lg border border-dashed text-center ${isDarkMode ? 'text-gray-500 border-white/10' : 'text-gray-400 border-gray-200'}`}>
                        No items generated. Click "Add Item" to start writing.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center justify-center py-8 text-center max-w-lg mx-auto">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 relative ${
                  isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                }`}>
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-400'}`}></div>
                  <Check size={40} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
                </div>
                <h3 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Update Finalized!
                </h3>
                <p className={`mb-10 text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  The client update has been saved to your deliverables history. 
                  You can now share it with <span className="font-semibold text-emerald-500">{client.name}</span>.
                </p>
                
                {/* PDF Configuration */}
                <div className={`w-full p-6 mb-8 rounded-xl border text-left shadow-lg ${
                  isDarkMode ? 'bg-slate-900/50 border-white/10' : 'bg-white border-gray-200'
                }`}>
                  <h4 className="font-bold mb-6 text-xs uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <Settings size={14} /> PDF Report Settings
                  </h4>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Report Mode</Label>
                        <div className="text-sm text-gray-500">
                          {exportMode === 'compact' ? 'Condensed 2-page summary' : 'Full multi-page report'}
                        </div>
                      </div>
                      <div className={`flex items-center rounded-lg border p-1 ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
                        <button
                          onClick={() => setExportMode('compact')}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            exportMode === 'compact' 
                              ? isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          Compact
                        </button>
                        <button
                          onClick={() => setExportMode('expanded')}
                          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                            exportMode === 'expanded'
                              ? isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-500 hover:text-gray-400'
                          }`}
                        >
                          Expanded
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-500/5 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                             <FileText size={16} />
                           </div>
                           <Label className="cursor-pointer">Include Bills</Label>
                        </div>
                        <Switch checked={includeBills} onCheckedChange={setIncludeBills} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-500/5 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                             <Zap size={16} />
                           </div>
                           <Label className="cursor-pointer">Include Issues</Label>
                        </div>
                        <Switch checked={includeIssues} onCheckedChange={setIncludeIssues} />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-500/5 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`p-2 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                             <DollarSign size={16} />
                           </div>
                           <Label className="cursor-pointer">Include Engagement Ledger</Label>
                        </div>
                        <Switch checked={includeLedger} onCheckedChange={setIncludeLedger} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 w-full gap-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full justify-between h-14 text-lg shadow-xl shadow-emerald-500/20"
                    onClick={() => handleExport('email')}
                  >
                    <span className="flex items-center gap-3">
                      <Copy size={20} /> Copy to Email
                    </span>
                    <span className="text-sm opacity-70 font-normal bg-white/20 px-2 py-0.5 rounded">Plain text</span>
                  </Button>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="secondary" 
                      className="justify-center h-12 border-2"
                      onClick={() => handleExport('pdf')}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <Download size={18} className="mr-2" />} PDF Report
                    </Button>
                    <Button 
                      variant="secondary" 
                      className="justify-center h-12 border-2"
                      onClick={() => handleExport('docx')}
                      disabled={loading}
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : <FileText size={18} className="mr-2" />} DOCX
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className={`p-6 border-t flex justify-between items-center backdrop-blur-md ${
          isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/90 border-gray-100'
        }`}>
          {step === 1 && (
            <>
              <Button variant="ghost" onClick={onClose} className="hover:bg-red-500/10 hover:text-red-500">Cancel</Button>
              <Button onClick={generatePreview} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 size={18} className="mr-2" />}
                Generate Draft
              </Button>
            </>
          )}
          
          {step === 2 && (
            <>
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ChevronLeft size={16} className="mr-2" /> Back
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => toast.success('Draft saved')}>
                  <Save size={16} className="mr-2" /> Save Draft
                </Button>
                <Button onClick={handleFinalize} disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                  {loading ? <Loader2 className="animate-spin mr-2" /> : <Check size={18} className="mr-2" />}
                  Finalize
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-lg shadow-emerald-500/20" onClick={onClose}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}