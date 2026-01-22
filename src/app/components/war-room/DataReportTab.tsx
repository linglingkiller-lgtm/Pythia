import React, { useState } from 'react';
import { Upload, FileDown, Sparkles, Download, Copy, CheckCircle, RefreshCw, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { TargetData } from './competitive-targets/TargetCard';

interface DataReportTabProps {
  target: TargetData;
}

interface DoorKnockingMetrics {
  daily: { doors: number; surveys: number };
  weekly: { doors: number; surveys: number };
  total: { doors: number; surveys: number };
}

interface SupportMetrics {
  daily: { yes: number; no: number; undecided: number };
  weekly: { yes: number; no: number; undecided: number };
  total: { yes: number; no: number; undecided: number };
}

interface YardSignMetrics {
  daily: number;
  weekly: number;
  total: number;
}

export function DataReportTab({ target }: DataReportTabProps) {
  const { isDarkMode } = useTheme();
  const [hasImportedData, setHasImportedData] = useState(false);
  const [isEditingAnecdotes, setIsEditingAnecdotes] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Sample generated data
  const [metrics, setMetrics] = useState<DoorKnockingMetrics>({
    daily: { doors: 786, surveys: 133 },
    weekly: { doors: 3291, surveys: 551 },
    total: { doors: 5781, surveys: 1057 }
  });

  const [supportMetrics, setSupportMetrics] = useState<SupportMetrics>({
    daily: { yes: 52.11, no: 9.15, undecided: 38.73 },
    weekly: { yes: 50.34, no: 10.10, undecided: 39.56 },
    total: { yes: 43.99, no: 8.62, undecided: 47.40 }
  });

  const [yardSigns, setYardSigns] = useState<YardSignMetrics>({
    daily: 1,
    weekly: 1,
    total: 5
  });

  const [anecdotalReport, setAnecdotalReport] = useState(
    `As our metrics continue to increase as planned heading towards Election Day, we project to be knocking over 1,000 doors per day for the remainder of the race.\n\nWe have encountered many voters who have already voted, either via absentee or at an early vote location. ${target.projectName.split(' - ')[0]}'s name ID is increasing throughout the district, with many voters recognizing them from mailers or yard signs. Voters in ${target.geography.split(',')[0]} expressed concerns of new development in the area, and many voiced concerns of local businesses being bought out for luxury apartment developments. Opposition voters voiced concerns over current policy positions, and stated they are committed to supporting the opponent.\n\nField operations continue at strong pace with increasing volunteer engagement. Next report will be Thursday.`
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate CSV processing
      console.log('Processing CSV:', file.name);
      setHasImportedData(true);
      
      // In a real implementation, you would parse the CSV and update metrics
      // For demo purposes, we're using pre-populated sample data
    }
  };

  const handleGenerateReport = () => {
    setHasImportedData(true);
  };

  const handleCopyReport = () => {
    const reportText = generateReportText();
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${target.projectName.replace(/\s+/g, '_')}_Data_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportText = () => {
    const dateRange = getDateRange();
    return `Hello all,

Today we knocked on ${metrics.daily.doors} doors and surveyed ${metrics.daily.surveys} voters. This week we have knocked on ${metrics.weekly.doors} doors and surveyed ${metrics.weekly.surveys} voters. In total we have knocked on ${metrics.total.doors} doors and surveyed ${metrics.total.surveys} voters.

${anecdotalReport}

Please see the data metrics below. Next report will be Thursday.

${target.projectName}
                        Daily       Weekly (${dateRange})    Total
Doors                   ${metrics.daily.doors}        ${metrics.weekly.doors}              ${metrics.total.doors}
Surveys                 ${metrics.daily.surveys}        ${metrics.weekly.surveys}               ${metrics.total.surveys}

Support                 Daily       Weekly (${dateRange})    Total
Yes                     ${supportMetrics.daily.yes.toFixed(2)}%     ${supportMetrics.weekly.yes.toFixed(2)}%           ${supportMetrics.total.yes.toFixed(2)}%
No                      ${supportMetrics.daily.no.toFixed(2)}%      ${supportMetrics.weekly.no.toFixed(2)}%            ${supportMetrics.total.no.toFixed(2)}%
Undecided               ${supportMetrics.daily.undecided.toFixed(2)}%     ${supportMetrics.weekly.undecided.toFixed(2)}%           ${supportMetrics.total.undecided.toFixed(2)}%

Yard Signs              Daily       Weekly (${dateRange})    Total
Yes                     ${yardSigns.daily}           ${yardSigns.weekly}                  ${yardSigns.total}
`;
  };

  const getDateRange = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    return `${weekAgo.getMonth() + 1}/${weekAgo.getDate()}-${today.getMonth() + 1}/${today.getDate()}`;
  };

  if (!hasImportedData) {
    return (
      <div className="space-y-6">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border backdrop-blur-sm p-8 ${
            isDarkMode
              ? 'bg-slate-800/40 border-white/10'
              : 'bg-white/80 border-gray-200'
          }`}
        >
          <div className="text-center max-w-md mx-auto">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <Upload size={28} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Generate Data Report
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Import your door knocking CSV data to automatically generate a comprehensive report with metrics and AI-powered anecdotal insights.
            </p>

            <label className={`block cursor-pointer`}>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className={`
                px-6 py-3 rounded-lg border-2 border-dashed transition-all inline-flex items-center gap-2 font-medium
                ${isDarkMode
                  ? 'border-blue-500/30 hover:border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  : 'border-blue-300 hover:border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100'
                }
              `}>
                <Upload size={18} />
                Upload CSV Data
              </div>
            </label>

            <div className={`my-4 flex items-center gap-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              <div className="flex-1 h-px bg-current opacity-20" />
              <span className="text-xs font-medium">OR</span>
              <div className="flex-1 h-px bg-current opacity-20" />
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={handleGenerateReport}
              className="w-full"
            >
              <Sparkles size={18} className="mr-2" />
              Generate with Sample Data
            </Button>

            <p className={`text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              CSV should include: voter_id, door_result, support_level, yard_sign, survey_notes
            </p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Auto-Generated Metrics', value: 'Daily, Weekly, Total', icon: '📊' },
            { label: 'Support Analysis', value: 'Yes/No/Undecided %', icon: '📈' },
            { label: 'AI Anecdotes', value: 'Editable Insights', icon: '✨' }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-lg border ${
                isDarkMode
                  ? 'bg-slate-800/40 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.label}
              </div>
              <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {item.value}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Data Report Generated
          </h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Report date: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setHasImportedData(false)}>
            <RefreshCw size={16} className="mr-2" />
            New Report
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopyReport}>
            {copied ? <CheckCircle size={16} className="mr-2 text-green-500" /> : <Copy size={16} className="mr-2" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadReport}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </motion.div>

      {/* Metrics Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-lg border backdrop-blur-sm overflow-hidden ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Door Knocking Metrics
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'}>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {target.projectName}
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Weekly ({getDateRange()})
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Doors
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.daily.doors.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.weekly.doors.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.total.doors.toLocaleString()}
                </td>
              </tr>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Surveys
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.daily.surveys.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.weekly.surveys.toLocaleString()}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {metrics.total.surveys.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Support Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-lg border backdrop-blur-sm overflow-hidden ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Support Analysis
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'}>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Support
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Weekly ({getDateRange()})
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Yes
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-green-500`}>
                  {supportMetrics.daily.yes.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-green-500`}>
                  {supportMetrics.weekly.yes.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-green-500`}>
                  {supportMetrics.total.yes.toFixed(2)}%
                </td>
              </tr>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  No
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-red-500`}>
                  {supportMetrics.daily.no.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-red-500`}>
                  {supportMetrics.weekly.no.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-red-500`}>
                  {supportMetrics.total.no.toFixed(2)}%
                </td>
              </tr>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Undecided
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-amber-500`}>
                  {supportMetrics.daily.undecided.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-amber-500`}>
                  {supportMetrics.weekly.undecided.toFixed(2)}%
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold text-amber-500`}>
                  {supportMetrics.total.undecided.toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Yard Signs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`rounded-lg border backdrop-blur-sm overflow-hidden ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <div className={`p-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Yard Signs
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDarkMode ? 'bg-slate-900/40' : 'bg-gray-50'}>
                <th className={`px-4 py-3 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Metric
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Daily
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Weekly ({getDateRange()})
                </th>
                <th className={`px-4 py-3 text-right text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={isDarkMode ? 'border-t border-white/5' : 'border-t border-gray-100'}>
                <td className={`px-4 py-3 text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Yes
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {yardSigns.daily}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {yardSigns.weekly}
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {yardSigns.total}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* AI-Generated Anecdotal Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`rounded-lg border backdrop-blur-sm ${
          isDarkMode
            ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30'
            : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'
        }`}
      >
        <div className={`p-4 border-b flex items-center justify-between ${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Revere-Generated Anecdotal Report
            </h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingAnecdotes(!isEditingAnecdotes)}
          >
            <Edit3 size={14} className="mr-2" />
            {isEditingAnecdotes ? 'Preview' : 'Edit'}
          </Button>
        </div>
        <div className="p-4">
          {isEditingAnecdotes ? (
            <textarea
              value={anecdotalReport}
              onChange={(e) => setAnecdotalReport(e.target.value)}
              className={`
                w-full h-64 p-3 text-sm rounded-lg border focus:ring-2 focus:ring-purple-500/50 focus:border-transparent font-mono
                ${isDarkMode
                  ? 'bg-slate-900/50 border-purple-500/30 text-gray-200'
                  : 'bg-white border-purple-200 text-gray-900'
                }
              `}
            />
          ) : (
            <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {anecdotalReport}
            </div>
          )}
          <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
            <p className={`text-xs ${isDarkMode ? 'text-purple-300/70' : 'text-purple-700'}`}>
              <Sparkles size={12} className="inline mr-1" />
              This anecdotal summary was auto-generated by Revere AI based on survey notes and voter interaction patterns. Edit to add specific details and observations.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
