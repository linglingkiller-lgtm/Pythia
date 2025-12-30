import React from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, AlertCircle, ChevronDown, ChevronUp, FileEdit, Copy, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { BillAIReview } from '../../data/billsData';
import { copyToClipboard } from '../../utils/clipboard';
import { useTheme } from '../../contexts/ThemeContext';

interface AIBillReviewProps {
  billId: string;
  review: BillAIReview;
}

export function AIBillReview({ billId, review }: AIBillReviewProps) {
  const { isDarkMode } = useTheme();
  const [selectedLens, setSelectedLens] = React.useState<string>(Object.keys(review.impactsByLens)[0] || 'Energy Utilities');
  const [selectedTone, setSelectedTone] = React.useState<string>('supportive');
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['summary', 'impacts']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'red':
        return <AlertTriangle size={16} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />;
      case 'yellow':
        return <AlertCircle size={16} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />;
      case 'green':
        return <CheckCircle size={16} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />;
      default:
        return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    if (isDarkMode) {
      switch (severity) {
        case 'red': return 'border-red-500/30 bg-red-500/10';
        case 'yellow': return 'border-amber-500/30 bg-amber-500/10';
        case 'green': return 'border-green-500/30 bg-green-500/10';
        default: return 'border-gray-500/30 bg-gray-500/10';
      }
    } else {
      switch (severity) {
        case 'red': return 'border-red-300 bg-red-50';
        case 'yellow': return 'border-amber-300 bg-amber-50';
        case 'green': return 'border-green-300 bg-green-50';
        default: return 'border-gray-300 bg-gray-50';
      }
    }
  };

  const impactData = review.impactsByLens[selectedLens];
  const talkingPointsData = review.talkingPoints[selectedTone];

  const generatedTime = new Date(review.generatedAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className={`p-6 shadow-sm border rounded-lg backdrop-blur-xl ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
            <h3 className={`text-lg font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Revere Bill Review</h3>
          </div>
          <p className={`text-xs mt-0.5 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Last generated: {generatedTime}</p>
        </div>
        <Button variant="secondary" size="sm">
          <RefreshCw size={14} />
          Regenerate
        </Button>
      </div>

      {/* Plain-English Summary */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('summary')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Plain-English Summary</h4>
          {expandedSections.has('summary') ? (
            <ChevronUp size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {expandedSections.has('summary') && (
          <ul className="space-y-2">
            {review.summaryBullets.map((bullet, index) => (
              <li key={index} className={`flex gap-2 text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Impact Analysis */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('impacts')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Impact Analysis</h4>
          {expandedSections.has('impacts') ? (
            <ChevronUp size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {expandedSections.has('impacts') && (
          <>
            {/* Lens Selector */}
            <div className="mb-4">
              <label className={`block text-xs font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Select Perspective:</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(review.impactsByLens).map(lens => (
                  <button
                    key={lens}
                    onClick={() => setSelectedLens(lens)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedLens === lens
                        ? 'bg-purple-600 text-white'
                        : (isDarkMode
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                  >
                    {lens}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Details */}
            {impactData && (
              <div className="space-y-4">
                <div>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Top Impacts:</h5>
                  <ul className="space-y-1.5">
                    {impactData.topImpacts.map((impact, index) => (
                      <li key={index} className={`flex gap-2 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>▪</span>
                        <span>{impact}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Compliance Burdens:</h5>
                  <ul className="space-y-1.5">
                    {impactData.complianceBurdens.map((burden, index) => (
                      <li key={index} className={`flex gap-2 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={isDarkMode ? 'text-amber-400' : 'text-amber-600'}>▪</span>
                        <span>{burden}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Potential Costs:</h5>
                  <ul className="space-y-1.5">
                    {impactData.potentialCosts.map((cost, index) => (
                      <li key={index} className={`flex gap-2 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>$</span>
                        <span>{cost}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-green-400' : 'text-green-700'
                    }`}>Likely Beneficiaries:</h5>
                    <ul className="space-y-1">
                      {impactData.beneficiaries.map((b, index) => (
                        <li key={index} className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className={`text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-red-400' : 'text-red-700'
                    }`}>Likely Opponents:</h5>
                    <ul className="space-y-1">
                      {impactData.opponents.map((o, index) => (
                        <li key={index} className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>• {o}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Risk Flags */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('risks')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Risk Flags ({review.riskFlags.length})</h4>
          {expandedSections.has('risks') ? (
            <ChevronUp size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {expandedSections.has('risks') && (
          <div className="space-y-3">
            {review.riskFlags.map((flag, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${getSeverityColor(flag.severity)}`}
              >
                <div className="flex items-start gap-2 mb-2">
                  {getSeverityIcon(flag.severity)}
                  <div className="flex-1">
                    <div className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{flag.label}</div>
                    <div className={`text-xs mt-0.5 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>Section: {flag.sectionReference}</div>
                  </div>
                </div>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{flag.explanation}</p>
                {flag.mitigation && (
                  <div className={`mt-2 pt-2 border-t ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <span className={`text-xs font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Recommended Mitigation: </span>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>{flag.mitigation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Talking Points Generator */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('talking-points')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Talking Points</h4>
          {expandedSections.has('talking-points') ? (
            <ChevronUp size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {expandedSections.has('talking-points') && (
          <>
            {/* Tone Selector */}
            <div className="mb-4">
              <label className={`block text-xs font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Select Tone:</label>
              <div className="flex gap-2">
                {Object.keys(review.talkingPoints).map(tone => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedTone === tone
                        ? 'bg-purple-600 text-white'
                        : (isDarkMode
                          ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200')
                    }`}
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Talking Points Content */}
            {talkingPointsData && (
              <div className="space-y-4">
                {/* Main Points */}
                <div>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Key Messages:</h5>
                  <ul className="space-y-2">
                    {talkingPointsData.mainPoints.map((point, index) => (
                      <li key={index} className={`flex gap-2 text-sm ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className={isDarkMode ? 'text-purple-400 font-bold' : 'text-purple-600 font-bold'}>{index + 1}.</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 30-Second Version */}
                <div className={`p-3 border rounded-lg ${
                  isDarkMode
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <h5 className={`text-sm font-semibold mb-2 flex items-center gap-2 ${
                    isDarkMode ? 'text-blue-300' : 'text-blue-900'
                  }`}>
                    30-Second Summary
                    <Button variant="secondary" size="sm" onClick={() => copyToClipboard(talkingPointsData.thirtySecondVersion)}>
                      <Copy size={12} />
                    </Button>
                  </h5>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-blue-200' : 'text-blue-900'
                  }`}>{talkingPointsData.thirtySecondVersion}</p>
                </div>

                {/* Q&A */}
                <div>
                  <h5 className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>Committee Hearing Q&A:</h5>
                  <div className="space-y-3">
                    {talkingPointsData.qAndA.map((qa, index) => (
                      <div key={index} className={`border-l-2 pl-3 ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}>
                        <div className={`text-sm font-medium mb-1 ${
                          isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Q: {qa.question}</div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>A: {qa.answer}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Amendment Suggestions */}
      <div>
        <button
          onClick={() => toggleSection('amendments')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h4 className={`font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Amendment Concepts ({review.amendmentConcepts.length})</h4>
          {expandedSections.has('amendments') ? (
            <ChevronUp size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          ) : (
            <ChevronDown size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
          )}
        </button>
        {expandedSections.has('amendments') && (
          <div className="space-y-3">
            {review.amendmentConcepts.map((concept, index) => (
              <div key={index} className={`p-3 border rounded-lg ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div className={`font-semibold text-sm ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{concept.title}</div>
                  <Chip variant="neutral" size="sm">{concept.targetSection}</Chip>
                </div>
                <p className={`text-sm mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>{concept.description}</p>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <span className="font-medium">Rationale: </span>
                  {concept.rationale}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}