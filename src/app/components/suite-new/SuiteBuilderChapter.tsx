import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Search } from 'lucide-react';
import { Button } from '../ui/Button';

const MODES = [
  { id: 'lobbying', label: 'Lobbying' },
  { id: 'affairs', label: 'Public Affairs' },
  { id: 'campaign', label: 'Campaign Services (Door-to-door)' },
  { id: 'executive', label: 'Executive (All)' },
];

const ASSISTANTS = [
  { id: 'ask', label: 'Ask Revere', desc: 'Workspace Q&A' },
  { id: 'brief', label: 'Brief Builder', desc: 'Generate briefs' },
  { id: 'bill', label: 'Bill Reviewer', desc: 'AI analysis' },
  { id: 'workplan', label: 'Workplan Generator', desc: 'Auto-planning' },
  { id: 'opportunity', label: 'Opportunity Spotter', desc: 'Pattern detection' },
  { id: 'relationship', label: 'Relationship Advisor', desc: 'Engagement insights' },
  { id: 'pace', label: 'Pace Analyst', desc: 'Doors forecasting' },
  { id: 'compliance', label: 'Compliance Recorder', desc: 'Audit trails' },
];

const OUTCOMES = [
  'Summarize legislation instantly',
  'Generate meeting briefs',
  'Turn notes into tasks',
  'Surface opportunities & risks',
  'Coordinate teams across silos',
  'Forecast pace to goal (doors)',
];

const KNOWLEDGE = [
  'Bills & Actions',
  'Legislators & Staff',
  'Clients & Contracts',
  'Projects & Tasks',
  'Records & Reports',
  'Door metrics & staffing',
];

export function SuiteBuilderChapter() {
  const [selectedMode, setSelectedMode] = useState<string>('executive');
  const [selectedAssistants, setSelectedAssistants] = useState<string[]>(['ask', 'brief', 'opportunity']);
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([OUTCOMES[0], OUTCOMES[3]]);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([KNOWLEDGE[0], KNOWLEDGE[1]]);
  const [searchQuery, setSearchQuery] = useState('');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toggleAssistant = (id: string) => {
    setSelectedAssistants(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const toggleOutcome = (outcome: string) => {
    setSelectedOutcomes(prev =>
      prev.includes(outcome) ? prev.filter(o => o !== outcome) : [...prev, outcome]
    );
  };

  const toggleKnowledge = (knowledge: string) => {
    setSelectedKnowledge(prev =>
      prev.includes(knowledge) ? prev.filter(k => k !== knowledge) : [...prev, knowledge]
    );
  };

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
            Make Revere yours.
          </h2>
          <p className="text-xl text-gray-600">
            Choose your mode, assistants, and outcomes—see it come together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Builder controls */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="space-y-8"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Step A: Mode */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Step 1: Choose your mode
              </h3>
              <div className="space-y-2">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={`w-full px-4 py-3 rounded-xl text-left transition-all ${
                      selectedMode === mode.id
                        ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                        : 'bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step B: Assistants */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Step 2: Choose AI assistants
              </h3>
              <div className="space-y-2">
                {ASSISTANTS.map((assistant) => {
                  const isSelected = selectedAssistants.includes(assistant.id);
                  return (
                    <button
                      key={assistant.id}
                      onClick={() => toggleAssistant(assistant.id)}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-start gap-3 transition-all ${
                        isSelected
                          ? 'bg-red-50 border-2 border-red-600'
                          : 'bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${
                        isSelected ? 'bg-red-600' : 'bg-gray-200'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{assistant.label}</div>
                        <div className="text-sm text-gray-500">{assistant.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step C: Outcomes */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Step 3: Choose outcomes
              </h3>
              <div className="space-y-2">
                {OUTCOMES.map((outcome) => {
                  const isSelected = selectedOutcomes.includes(outcome);
                  return (
                    <button
                      key={outcome}
                      onClick={() => toggleOutcome(outcome)}
                      className={`w-full px-4 py-3 rounded-xl text-left flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-600'
                          : 'bg-white/50 backdrop-blur-sm border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-200'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium text-gray-900">{outcome}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step D: Knowledge */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Step 4: Connected knowledge
              </h3>
              <div className="flex flex-wrap gap-2">
                {KNOWLEDGE.map((knowledge) => {
                  const isSelected = selectedKnowledge.includes(knowledge);
                  return (
                    <button
                      key={knowledge}
                      onClick={() => toggleKnowledge(knowledge)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white'
                          : 'bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {knowledge}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right: Live preview */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Your Revere Setup
              </h3>

              {/* Mode */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">Mode</div>
                <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-blue-600 text-white inline-block">
                  {MODES.find(m => m.id === selectedMode)?.label}
                </div>
              </div>

              {/* Assistants */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  AI Assistants ({selectedAssistants.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedAssistants.map(id => {
                    const assistant = ASSISTANTS.find(a => a.id === id);
                    return (
                      <div key={id} className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm">
                        {assistant?.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Outcomes ({selectedOutcomes.length})
                </div>
                <div className="space-y-2">
                  {selectedOutcomes.map(outcome => (
                    <div key={outcome} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Knowledge */}
              <div className="mb-8">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Connected Data ({selectedKnowledge.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedKnowledge.map(knowledge => (
                    <div key={knowledge} className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm">
                      {knowledge}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <Button variant="primary" size="lg" className="w-full">
                Start with this setup
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}