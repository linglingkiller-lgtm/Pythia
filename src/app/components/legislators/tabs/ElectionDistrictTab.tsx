import React from 'react';
import { Legislator } from '../legislatorData';
import { Calendar, TrendingUp, AlertCircle, DollarSign, Users, ExternalLink, Mail, Plus, FileText, Download, Target, BarChart3, Sparkles } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface ElectionDistrictTabProps {
  legislator: Legislator;
}

export function ElectionDistrictTab({ legislator }: ElectionDistrictTabProps) {
  const { isDarkMode } = useTheme();
  const { electionIntel, servicesOpportunity } = legislator;

  const getCompetitivenessColor = (rating: string) => {
    switch (rating) {
      case 'safe': return 'bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-300';
      case 'likely': return 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-300';
      case 'lean': return 'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 border-amber-300';
      case 'tossup': return 'bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-300';
      default: return 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getOpportunityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-200';
      case 'medium': return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-200';
      case 'low': return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-200';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-200';
    }
  };

  const getPipelineStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-300';
      case 'contacted': return 'bg-blue-50 text-blue-700 border-blue-300';
      case 'added': return 'bg-amber-50 text-amber-700 border-amber-300';
      case 'none': return 'bg-gray-50 text-gray-700 border-gray-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const handleDraftEmail = () => {
    const email = servicesOpportunity.campaignContactEmail || '';
    const subject = encodeURIComponent(`Campaign support resources for ${legislator.district}`);
    const body = encodeURIComponent(
      `Dear ${legislator.name.split(' ')[0]} Campaign Team,\n\n` +
      `Echo Canyon Consulting specializes in strategic communications and campaign services for legislative races. We'd like to discuss how we can support your ${electionIntel.nextElectionYear} campaign:\n\n` +
      `• Digital strategy and social media management\n` +
      `• Opposition research and rapid response\n` +
      `• Voter targeting and field operations\n\n` +
      `Would you have 15 minutes for a brief introductory call?\n\n` +
      `Best regards,\n` +
      `[Your name]`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const handleExportOnePager = () => {
    // Create a printable one-pager with all key information
    const onePagerContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${legislator.name} - Campaign Intelligence Brief</title>
  <style>
    @media print {
      @page { margin: 0.5in; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1f2937;
      background: white;
      padding: 40px;
      max-width: 8.5in;
      margin: 0 auto;
    }
    .header {
      border-bottom: 4px solid #7c3aed;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
    .legislator-name {
      font-size: 24pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 4px;
    }
    .legislator-info {
      font-size: 11pt;
      color: #6b7280;
      font-weight: 600;
    }
    .party-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 14pt;
      color: white;
      background: ${legislator.party === 'R' ? '#dc2626' : '#2563eb'};
    }
    .opportunity-level {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 9pt;
      color: white;
      margin-top: 8px;
      background: ${
        servicesOpportunity.opportunityLevel === 'high' ? '#dc2626' :
        servicesOpportunity.opportunityLevel === 'medium' ? '#f59e0b' :
        '#6b7280'
      };
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 12pt;
      font-weight: 800;
      color: #7c3aed;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .stat-box {
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
    }
    .stat-label {
      font-size: 8pt;
      font-weight: 700;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .stat-value {
      font-size: 18pt;
      font-weight: 900;
      color: #111827;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 9pt;
      background: #ddd6fe;
      color: #5b21b6;
    }
    .reason-list {
      list-style: none;
      margin-top: 8px;
    }
    .reason-list li {
      padding: 8px 12px;
      background: #f3f4f6;
      border-left: 4px solid #7c3aed;
      margin-bottom: 6px;
      font-size: 10pt;
    }
    .candidate-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .candidate-name {
      font-weight: 700;
      color: #111827;
    }
    .candidate-party {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 6px;
      text-align: center;
      line-height: 28px;
      font-weight: 900;
      color: white;
      background: ${legislator.party === 'R' ? '#dc2626' : '#2563eb'};
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 2px solid #e5e7eb;
      font-size: 8pt;
      color: #9ca3af;
      text-align: center;
    }
    .highlight-box {
      background: #fef3c7;
      border: 2px solid #fbbf24;
      border-radius: 8px;
      padding: 12px;
      margin-top: 12px;
    }
    .highlight-box strong {
      color: #92400e;
    }
    .margin-trend {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
    .margin-box {
      flex: 1;
      text-align: center;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 8px;
    }
    .margin-year {
      font-size: 8pt;
      color: #6b7280;
      font-weight: 700;
    }
    .margin-value {
      font-size: 16pt;
      font-weight: 900;
      color: #111827;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-top">
      <div>
        <div class="legislator-name">${legislator.name}</div>
        <div class="legislator-info">${legislator.district} • ${legislator.body}</div>
        ${legislator.committees.length > 0 ? `<div class="legislator-info" style="margin-top: 4px;">Committees: ${legislator.committees.join(', ')}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <div class="party-badge">${legislator.party}</div>
        <div class="opportunity-level">${servicesOpportunity.opportunityLevel.toUpperCase()} OPPORTUNITY</div>
      </div>
    </div>
  </div>

  <div class="grid">
    <div class="section">
      <div class="section-title">Election Status</div>
      <div class="grid-3">
        <div class="stat-box">
          <div class="stat-label">Next Election</div>
          <div class="stat-value">${electionIntel.nextElectionYear}</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Cycle Status</div>
          <div style="font-size: 11pt; font-weight: 800; color: ${electionIntel.upThisCycle ? '#2563eb' : '#6b7280'}; margin-top: 4px;">
            ${electionIntel.upThisCycle ? 'Up This Cycle' : 'Not This Cycle'}
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Seat Status</div>
          <div style="font-size: 10pt; font-weight: 800; color: #7c3aed; margin-top: 4px;">
            ${electionIntel.seatStatus.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Competitiveness</div>
      <div class="grid-3">
        <div class="stat-box">
          <div class="stat-label">Rating</div>
          <div style="font-size: 14pt; font-weight: 900; margin-top: 4px; color: ${
            electionIntel.competitivenessRating === 'tossup' ? '#dc2626' :
            electionIntel.competitivenessRating === 'lean' ? '#f59e0b' :
            electionIntel.competitivenessRating === 'likely' ? '#2563eb' :
            '#059669'
          };">
            ${electionIntel.competitivenessRating.toUpperCase()}
          </div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Score</div>
          <div class="stat-value" style="font-size: 20pt;">${electionIntel.competitivenessScore}/100</div>
        </div>
        <div class="stat-box">
          <div class="stat-label">Confidence</div>
          <div style="font-size: 11pt; font-weight: 800; margin-top: 4px; color: ${
            electionIntel.confidence === 'high' ? '#059669' :
            electionIntel.confidence === 'medium' ? '#f59e0b' :
            '#dc2626'
          };">
            ${electionIntel.confidence.charAt(0).toUpperCase() + electionIntel.confidence.slice(1)}
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Margin Trend</div>
    <div class="margin-trend">
      ${electionIntel.recentMarginTrend.map(trend => `
        <div class="margin-box">
          <div class="margin-year">${trend.year}</div>
          <div class="margin-value">+${trend.margin}%</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top: 8px; font-size: 9pt; color: #6b7280; font-weight: 600;">
      Last general margin: <strong style="color: #111827;">${electionIntel.lastGeneralMargin}</strong>
    </div>
  </div>

  ${electionIntel.candidateField && electionIntel.candidateField.length > 0 ? `
    <div class="section">
      <div class="section-title">Candidate Field</div>
      ${electionIntel.candidateField.map(candidate => `
        <div class="candidate-row">
          <div>
            <span class="candidate-party">${candidate.party}</span>
            <span class="candidate-name" style="margin-left: 8px;">${candidate.name}</span>
            <span style="margin-left: 8px; font-size: 9pt; color: #6b7280; font-weight: 600; text-transform: capitalize;">(${candidate.status})</span>
          </div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  ${electionIntel.fundraisingStatus ? `
    <div class="section">
      <div class="section-title">Fundraising</div>
      <div style="font-size: 11pt; font-weight: 700; color: #059669; text-transform: capitalize;">
        ${electionIntel.fundraisingStatus}
      </div>
    </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Services Opportunity Analysis</div>
    <div style="margin-bottom: 12px;">
      <strong style="font-size: 10pt;">Pipeline Status:</strong> 
      <span class="badge">${servicesOpportunity.pipelineStatus === 'none' ? 'Not in Pipeline' : servicesOpportunity.pipelineStatus.charAt(0).toUpperCase() + servicesOpportunity.pipelineStatus.slice(1)}</span>
    </div>
    <div style="font-size: 10pt; font-weight: 700; color: #374151; margin-bottom: 8px;">Why Flagged:</div>
    <ul class="reason-list">
      ${servicesOpportunity.reasons.map(reason => `<li>${reason}</li>`).join('')}
    </ul>
    ${servicesOpportunity.campaignContactEmail ? `
      <div class="highlight-box">
        <strong>Campaign Contact:</strong> ${servicesOpportunity.campaignContactEmail}
      </div>
    ` : ''}
  </div>

  <div class="footer">
    Generated by Pythia Intelligence Platform • ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
  </div>
</body>
</html>`;

    // Create a blob and download
    const blob = new Blob([onePagerContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${legislator.name.replace(/\s+/g, '_')}_Campaign_Brief_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Election Status Card */}
      <div className={`rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
        isDarkMode ? 'bg-slate-800/40' : 'bg-white'
      }`}>
        <div className={`border-b px-6 py-4 ${
          isDarkMode
            ? 'bg-blue-900/20 border-blue-500/30'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
        }`}>
          <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calendar size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            Election Status
          </h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/40 border-white/10'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
            }`}>
              <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Next Election</div>
              <div className={`font-black text-4xl tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{electionIntel.nextElectionYear}</div>
            </div>
            <div className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/40 border-white/10'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
            }`}>
              <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cycle Status</div>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-bold shadow-sm border ${
                electionIntel.upThisCycle 
                  ? isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300'
                  : isDarkMode ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {electionIntel.upThisCycle ? 'Up This Cycle' : 'Not This Cycle'}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Seat Status</div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-sm border ${
              isDarkMode
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-purple-100 text-purple-700 border-purple-300'
            }`}>
              <Target size={14} />
              {electionIntel.seatStatus.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </div>
          </div>

          {/* Candidate Field */}
          {electionIntel.candidateField && electionIntel.candidateField.length > 0 && (
            <div>
              <div className={`text-xs font-semibold mb-3 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Candidate Field</div>
              <div className="space-y-2">
                {electionIntel.candidateField.map((candidate, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 group ${
                      isDarkMode
                        ? 'bg-slate-700/40 border-white/10 hover:border-white/20'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-black shadow-sm border ${
                        candidate.party === 'R' 
                          ? isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300'
                          : isDarkMode ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-300'
                      }`}>
                        {candidate.party}
                      </span>
                      <div>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{candidate.name}</div>
                        <div className={`text-xs font-medium capitalize ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{candidate.status}</div>
                      </div>
                    </div>
                    {candidate.sourceUrl && (
                      <a
                        href={candidate.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-lg transition-colors group-hover:opacity-100 opacity-60 ${
                          isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
                        }`}
                      >
                        <ExternalLink size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Competitiveness Card */}
      <div className={`rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden ${
        isDarkMode ? 'bg-slate-800/40' : 'bg-white'
      }`}>
        <div className={`border-b px-6 py-4 ${
          isDarkMode
            ? 'bg-amber-900/20 border-amber-500/30'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'
        }`}>
          <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <BarChart3 size={18} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
            Competitiveness Analysis
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rating</div>
              <div className={`inline-flex items-center px-4 py-2.5 rounded-lg border-2 font-black shadow-sm ${getCompetitivenessColor(electionIntel.competitivenessRating)}`}>
                {electionIntel.competitivenessRating.toUpperCase()}
              </div>
            </div>
            <div>
              <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Confidence</div>
              <div className={`inline-flex items-center px-4 py-2 rounded-lg font-bold shadow-sm border ${
                electionIntel.confidence === 'high' 
                  ? isDarkMode ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-green-100 text-green-700 border-green-300'
                  : electionIntel.confidence === 'medium' 
                  ? isDarkMode ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-100 text-amber-700 border-amber-300'
                  : isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300'
              }`}>
                {electionIntel.confidence.charAt(0).toUpperCase() + electionIntel.confidence.slice(1)}
              </div>
            </div>
          </div>

          {/* Competitiveness Score */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Competitiveness Score</span>
              <span className={`font-black text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{electionIntel.competitivenessScore}<span className="text-gray-500 text-base">/100</span></span>
            </div>
            <div className="relative">
              <div className={`w-full rounded-full h-4 overflow-hidden shadow-inner ${isDarkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-md ${
                    electionIntel.competitivenessScore >= 70 ? 'bg-gradient-to-r from-red-600 to-red-700' :
                    electionIntel.competitivenessScore >= 40 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                    'bg-gradient-to-r from-green-600 to-green-700'
                  }`}
                  style={{ width: `${electionIntel.competitivenessScore}%` }}
                />
              </div>
              {/* Score markers */}
              <div className="absolute -bottom-6 left-0 text-xs text-gray-500 font-medium">0</div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500 font-medium">50</div>
              <div className="absolute -bottom-6 right-0 text-xs text-gray-500 font-medium">100</div>
            </div>
          </div>

          {/* Recent Margin Trend */}
          <div className="mb-6 mt-10">
            <div className={`text-xs font-semibold mb-3 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Margin Trend</div>
            <div className="flex items-center gap-3">
              {electionIntel.recentMarginTrend.map((trend, idx) => (
                <div key={idx} className={`flex-1 text-center p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
                  isDarkMode
                    ? 'bg-slate-700/40 border-white/10'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                }`}>
                  <div className={`text-xs font-semibold mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{trend.year}</div>
                  <div className={`font-black text-2xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>+{trend.margin}%</div>
                </div>
              ))}
            </div>
            <p className={`text-sm mt-3 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Last general margin: <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{electionIntel.lastGeneralMargin}</span>
            </p>
          </div>

          {/* Fundraising Status */}
          {electionIntel.fundraisingStatus && (
            <div className="mb-6">
              <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fundraising Status</div>
              <div className={`flex items-center gap-2 p-3 rounded-lg border ${
                isDarkMode
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-green-50 border-green-200'
              }`}>
                <DollarSign size={18} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                <span className={`font-bold capitalize ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                  {electionIntel.fundraisingStatus}
                </span>
              </div>
            </div>
          )}

          {/* Analysis Basis */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode
              ? 'bg-blue-900/20 border-blue-500/30'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
          }`}>
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className={`mt-0.5 flex-shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className={`text-xs ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                <strong className="font-bold">Based on:</strong> Recent margin trends + incumbency status + district demographics + fundraising signals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Opportunity Card */}
      <div className={`rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border-2 ${
        isDarkMode ? 'bg-slate-800/40 border-purple-500/30' : 'bg-white border-purple-200'
      }`}>
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Services Opportunity</h3>
                <p className="text-purple-100 text-xs mt-0.5">Campaign services revenue potential</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-lg font-black text-sm tracking-wide ${getOpportunityColor(servicesOpportunity.opportunityLevel)}`}>
              {servicesOpportunity.opportunityLevel.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Pipeline Status */}
          <div className="mb-6">
            <div className={`text-xs font-semibold mb-2 uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pipeline Status</div>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold border shadow-sm ${getPipelineStatusColor(servicesOpportunity.pipelineStatus)}`}>
              {servicesOpportunity.pipelineStatus === 'none' ? 'Not in Pipeline' : servicesOpportunity.pipelineStatus.charAt(0).toUpperCase() + servicesOpportunity.pipelineStatus.slice(1)}
            </span>
          </div>

          {/* Why Flagged */}
          <div className="mb-6">
            <div className={`text-xs font-bold mb-3 uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Why Flagged:</div>
            <ul className="space-y-2">
              {servicesOpportunity.reasons.map((reason, idx) => (
                <li key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isDarkMode
                    ? 'bg-purple-900/20 border-purple-500/30'
                    : 'bg-purple-50 border-purple-100'
                }`}>
                  <span className={`font-black mt-0.5 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>•</span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Campaign Contact */}
          {servicesOpportunity.campaignContactEmail && (
            <div className={`mb-6 p-4 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/40 border-white/10'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
            }`}>
              <span className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Campaign Contact: </span>
              <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{servicesOpportunity.campaignContactEmail}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-bold shadow-md hover:shadow-lg">
              <Plus size={16} />
              Add to Pipeline
            </button>
            <button className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all duration-200 font-bold shadow-sm hover:shadow-md ${
              isDarkMode
                ? 'bg-slate-700/50 border-purple-500/50 text-purple-300 hover:bg-slate-600/50'
                : 'bg-white border-purple-300 hover:bg-purple-50'
            }`}>
              <FileText size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-700'} />
              Create Task
            </button>
            <button
              onClick={handleExportOnePager}
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all duration-200 font-bold shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-slate-700/50 border-purple-500/50 text-purple-300 hover:bg-slate-600/50'
                  : 'bg-white border-purple-300 hover:bg-purple-50'
              }`}
            >
              <Download size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-700'} />
              Export One-Pager
            </button>
            <button
              onClick={handleDraftEmail}
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg transition-all duration-200 font-bold shadow-sm hover:shadow-md ${
                isDarkMode
                  ? 'bg-slate-700/50 border-purple-500/50 text-purple-300 hover:bg-slate-600/50'
                  : 'bg-white border-purple-300 hover:bg-purple-50'
              }`}
            >
              <Mail size={16} className={isDarkMode ? 'text-purple-400' : 'text-purple-700'} />
              Draft Intro Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}