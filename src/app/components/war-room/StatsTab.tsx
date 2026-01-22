import React from 'react';
import { Home, Phone, MessageSquare, BarChart3, Mic, Zap, Tag, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatsTabProps {
  projectId: string;
  projectName: string;
}

// Mock data based on the provided image
const mockStatsData: Record<string, any> = {
  'ca-45': {
    totalDoors: 10240,
    calls: 0,
    texts: 0,
    textSurveys: 0,
    ivrs: 0,
    surveys: 2145,
    tags: 8523,
    relationalTexts: 0,
    breakdown: {
      notHome: { count: 6862, percentage: 67 },
      canvassed: { count: 1946, percentage: 19 },
      refused: { count: 819, percentage: 8 },
      inaccessible: { count: 512, percentage: 5 },
      droppedLit: { count: 61, percentage: 1 },
      wrongAddress: { count: 40, percentage: 0 }
    },
    leaderboard: [
      { name: 'Sarah Martinez', doors: 1847, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 412, tags: 1523, relationalTexts: 0 },
      { name: 'James Chen', doors: 1654, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 389, tags: 1342, relationalTexts: 0 },
      { name: 'Maria Rodriguez', doors: 1432, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 298, tags: 1156, relationalTexts: 0 },
      { name: 'David Kim', doors: 1289, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 267, tags: 1089, relationalTexts: 0 },
      { name: 'Lisa Johnson', doors: 1156, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 234, tags: 934, relationalTexts: 0 }
    ]
  },
  'nj-11': {
    totalDoors: 6200,
    calls: 0,
    texts: 0,
    textSurveys: 0,
    ivrs: 0,
    surveys: 1302,
    tags: 5167,
    relationalTexts: 0,
    breakdown: {
      notHome: { count: 4154, percentage: 67 },
      canvassed: { count: 1178, percentage: 19 },
      refused: { count: 496, percentage: 8 },
      inaccessible: { count: 310, percentage: 5 },
      droppedLit: { count: 37, percentage: 1 },
      wrongAddress: { count: 25, percentage: 0 }
    },
    leaderboard: [
      { name: 'Emily Wilson', doors: 1142, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 241, tags: 945, relationalTexts: 0 },
      { name: 'Michael Brown', doors: 1024, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 216, tags: 832, relationalTexts: 0 },
      { name: 'Jennifer Lee', doors: 891, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 187, tags: 723, relationalTexts: 0 },
      { name: 'Robert Taylor', doors: 756, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 159, tags: 612, relationalTexts: 0 }
    ]
  },
  'va-24': {
    totalDoors: 7500,
    calls: 0,
    texts: 0,
    textSurveys: 0,
    ivrs: 0,
    surveys: 1575,
    tags: 6250,
    relationalTexts: 0,
    breakdown: {
      notHome: { count: 5025, percentage: 67 },
      canvassed: { count: 1425, percentage: 19 },
      refused: { count: 600, percentage: 8 },
      inaccessible: { count: 375, percentage: 5 },
      droppedLit: { count: 45, percentage: 1 },
      wrongAddress: { count: 30, percentage: 0 }
    },
    leaderboard: [
      { name: 'Amanda Foster', doors: 1387, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 291, tags: 1156, relationalTexts: 0 },
      { name: 'Chris Anderson', doors: 1245, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 262, tags: 1039, relationalTexts: 0 },
      { name: 'Nicole Parker', doors: 1089, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 229, tags: 908, relationalTexts: 0 }
    ]
  },
  'pa-18': {
    totalDoors: 15200,
    calls: 0,
    texts: 0,
    textSurveys: 0,
    ivrs: 0,
    surveys: 3192,
    tags: 12667,
    relationalTexts: 0,
    breakdown: {
      notHome: { count: 10184, percentage: 67 },
      canvassed: { count: 2888, percentage: 19 },
      refused: { count: 1216, percentage: 8 },
      inaccessible: { count: 760, percentage: 5 },
      droppedLit: { count: 91, percentage: 1 },
      wrongAddress: { count: 61, percentage: 0 }
    },
    leaderboard: [
      { name: 'Brandon Hall', doors: 2234, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 469, tags: 1862, relationalTexts: 0 },
      { name: 'Jessica Moore', doors: 2012, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 423, tags: 1678, relationalTexts: 0 },
      { name: 'Tyler Scott', doors: 1891, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 397, tags: 1576, relationalTexts: 0 },
      { name: 'Ashley Wright', doors: 1756, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 369, tags: 1464, relationalTexts: 0 },
      { name: 'Kevin Torres', doors: 1623, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 341, tags: 1353, relationalTexts: 0 }
    ]
  },
  'ga-34': {
    totalDoors: 3200,
    calls: 0,
    texts: 0,
    textSurveys: 0,
    ivrs: 0,
    surveys: 672,
    tags: 2667,
    relationalTexts: 0,
    breakdown: {
      notHome: { count: 2144, percentage: 67 },
      canvassed: { count: 608, percentage: 19 },
      refused: { count: 256, percentage: 8 },
      inaccessible: { count: 160, percentage: 5 },
      droppedLit: { count: 19, percentage: 1 },
      wrongAddress: { count: 13, percentage: 0 }
    },
    leaderboard: [
      { name: 'Marcus Johnson', doors: 891, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 187, tags: 742, relationalTexts: 0 },
      { name: 'Tiffany White', doors: 756, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 159, tags: 630, relationalTexts: 0 },
      { name: 'Carlos Rivera', doors: 634, calls: 0, texts: 0, textSurveys: 0, ivrs: 0, surveys: 133, tags: 528, relationalTexts: 0 }
    ]
  }
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

export const StatsTab: React.FC<StatsTabProps> = ({ projectId, projectName }) => {
  const { isDarkMode } = useTheme();
  const stats = mockStatsData[projectId] || mockStatsData['ca-45'];

  const statCards = [
    { icon: Home, label: 'Doors', value: stats.totalDoors, color: 'text-orange-600', bgColor: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50' },
    { icon: Phone, label: 'Calls', value: stats.calls, color: 'text-green-600', bgColor: isDarkMode ? 'bg-green-500/10' : 'bg-green-50' },
    { icon: MessageSquare, label: 'Texts', value: stats.texts, color: 'text-blue-600', bgColor: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50' },
    { icon: BarChart3, label: 'Text Surveys', value: stats.textSurveys, color: 'text-yellow-600', bgColor: isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-50' },
    { icon: Mic, label: 'IVRs', value: stats.ivrs, color: 'text-purple-600', bgColor: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50' },
    { icon: Zap, label: 'Surveys', value: stats.surveys, color: 'text-amber-600', bgColor: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50' },
    { icon: Tag, label: 'Tags', value: stats.tags, color: 'text-gray-600', bgColor: isDarkMode ? 'bg-gray-500/10' : 'bg-gray-50' },
    { icon: Users, label: 'Relational Texts', value: stats.relationalTexts, color: 'text-indigo-600', bgColor: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50' }
  ];

  return (
    <div className="space-y-6">
      {/* Team Overview Stats */}
      <div>
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Team Overview</h3>
        <div className="grid grid-cols-4 gap-3">
          {statCards.map((card, idx) => (
            <div key={idx} className={`rounded-lg p-4 border ${
              isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <div className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center mb-3`}>
                <card.icon size={20} className={card.color} />
              </div>
              <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{card.label}</div>
              <div className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(card.value)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Breakdown */}
      <div>
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Activity Breakdown</h3>
        <div className={`rounded-lg p-5 border ${
          isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-3">
            <div className={`flex items-center justify-between py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Not Home</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.notHome.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.notHome.percentage}%)</span>
              </div>
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Canvassed</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.canvassed.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.canvassed.percentage}%)</span>
              </div>
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Refused</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.refused.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.refused.percentage}%)</span>
              </div>
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Inaccessible Address</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.inaccessible.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.inaccessible.percentage}%)</span>
              </div>
            </div>

            <div className={`flex items-center justify-between py-3 border-b ${
              isDarkMode ? 'border-white/10' : 'border-gray-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dropped Literature</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.droppedLit.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.droppedLit.percentage}%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Wrong Address</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.breakdown.wrongAddress.count.toLocaleString()}</span>
                <span className={`text-xs w-12 text-right ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>({stats.breakdown.wrongAddress.percentage}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h3 className={`mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Canvasser Leaderboard</h3>
        <div className={`rounded-lg overflow-hidden border ${
          isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDarkMode ? 'bg-slate-800 border-white/10' : 'bg-gray-50 border-gray-200'
              }`}>
                <th className={`text-left text-xs font-medium px-4 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Name</th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Home size={12} className="text-orange-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Phone size={12} className="text-green-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <MessageSquare size={12} className="text-blue-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <BarChart3 size={12} className="text-yellow-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Mic size={12} className="text-purple-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Zap size={12} className="text-amber-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Tag size={12} className="text-gray-600" />
                  </div>
                </th>
                <th className={`text-center text-xs font-medium px-3 py-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center justify-center gap-1">
                    <Users size={12} className="text-indigo-600" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.leaderboard.map((person: any, idx: number) => (
                <tr key={idx} className={`border-b ${
                  isDarkMode 
                    ? 'border-white/5 hover:bg-slate-700/50' 
                    : 'border-gray-100 hover:bg-gray-50'
                }`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                        {person.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <span className={`text-sm font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{person.name}</span>
                    </div>
                  </td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.doors.toLocaleString()}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.calls}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.texts}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.textSurveys}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.ivrs}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.surveys.toLocaleString()}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.tags.toLocaleString()}</td>
                  <td className={`text-center text-sm px-3 py-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{person.relationalTexts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};