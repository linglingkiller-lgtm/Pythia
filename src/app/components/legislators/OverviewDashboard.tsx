import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  Eye,
  ChevronRight,
  TrendingDown,
  Minus
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Legislator } from './legislatorData';

interface OverviewDashboardProps {
  legislators: Legislator[];
  watchedLegislatorIds?: Set<string>;
  onSelectLegislator: (legislatorId: string) => void;
}

export function OverviewDashboard({ legislators, watchedLegislatorIds, onSelectLegislator }: OverviewDashboardProps) {
  const { isDarkMode } = useTheme();

  // Calculate metrics
  const priorityACount = legislators.filter(l => l.priority === 'A').length;
  const priorityBCount = legislators.filter(l => l.priority === 'B').length;
  const watchedCount = watchedLegislatorIds ? watchedLegislatorIds.size : legislators.filter(l => l.watched).length;
  const needsFollowUp = legislators.filter(l => l.relationshipStatus === 'needs-follow-up').length;
  const warmRelationships = legislators.filter(l => l.relationshipStatus === 'warm').length;

  // Theme-aware colors matching your design system
  const bgColor = isDarkMode ? 'bg-slate-800/40' : 'bg-white/40';
  const borderColor = isDarkMode ? 'border-white/10' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-slate-800/60' : 'bg-white/60';
  const cardHoverBg = isDarkMode ? 'hover:bg-slate-700/60' : 'hover:bg-white/80';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Stats Grid - Modern Glassmorphic Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className={`group relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${cardHoverBg}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-red-950/30' : 'bg-red-50'} group-hover:scale-110 transition-transform duration-300`}>
                <Target size={24} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-950/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                +2
              </div>
            </div>
            <div className={`text-4xl font-bold ${textColor} mb-1`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              {priorityACount}
            </div>
            <div className={`text-sm font-semibold ${textMuted} uppercase tracking-wide`}>
              Priority A
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>
              High-value relationships
            </div>
          </div>
        </div>

        <div className={`group relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${cardHoverBg}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-950/30' : 'bg-blue-50'} group-hover:scale-110 transition-transform duration-300`}>
                <Eye size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
              </div>
            </div>
            <div className={`text-4xl font-bold ${textColor} mb-1`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              {watchedCount}
            </div>
            <div className={`text-sm font-semibold ${textMuted} uppercase tracking-wide`}>
              Watching
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>
              Active monitoring
            </div>
          </div>
        </div>

        <div className={`group relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${cardHoverBg}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-amber-950/30' : 'bg-amber-50'} group-hover:scale-110 transition-transform duration-300`}>
                <Clock size={24} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
              </div>
              {needsFollowUp > 0 && (
                <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-600'} animate-pulse`} />
              )}
            </div>
            <div className={`text-4xl font-bold ${textColor} mb-1`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              {needsFollowUp}
            </div>
            <div className={`text-sm font-semibold ${textMuted} uppercase tracking-wide`}>
              Follow-ups
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>
              Needs attention
            </div>
          </div>
        </div>

        <div className={`group relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md transition-all duration-300 hover:shadow-2xl ${cardHoverBg}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-950/30' : 'bg-green-50'} group-hover:scale-110 transition-transform duration-300`}>
                <Activity size={24} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded-full ${isDarkMode ? 'bg-green-950/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                +8
              </div>
            </div>
            <div className={`text-4xl font-bold ${textColor} mb-1`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              {warmRelationships}
            </div>
            <div className={`text-sm font-semibold ${textMuted} uppercase tracking-wide`}>
              Warm
            </div>
            <div className={`text-xs ${textMuted} mt-1`}>
              Strong relationships
            </div>
          </div>
        </div>
      </div>

      {/* Revere Intelligence Panel - Prominent & Modern */}
      <div className={`relative overflow-hidden border ${borderColor} ${bgColor} backdrop-blur-md group hover:shadow-2xl transition-all duration-300`}>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-blue-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className={`relative px-8 py-6 border-b ${borderColor}`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-red-950/50 to-blue-950/50' : 'bg-gradient-to-br from-red-50 to-blue-50'} border ${isDarkMode ? 'border-red-500/20' : 'border-red-200'}`}>
              <Sparkles size={24} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
            </div>
            <div className="flex-1">
              <h2 
                className={`text-2xl font-bold ${textColor} tracking-tight`}
                style={{ fontFamily: '"Corpline", sans-serif' }}
              >
                REVERE STRATEGIC INTELLIGENCE
              </h2>
              <p className={`text-sm ${textMuted} mt-0.5`}>
                Real-time relationship insights & opportunities
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${isDarkMode ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
              LIVE
            </div>
          </div>
        </div>

        {/* Insights Grid */}
        <div className="relative p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Opportunity Insight */}
            <div className={`relative overflow-hidden p-5 rounded-xl border ${isDarkMode ? 'border-blue-500/20 bg-blue-950/20' : 'border-blue-200 bg-blue-50/50'} backdrop-blur-sm group/card hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}>
                  <Zap size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    High-Priority Opportunity
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    <strong>3 Priority A</strong> legislators have open calendar slots this week - schedule meetings now
                  </p>
                  <button className={`mt-3 text-xs font-semibold ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} flex items-center gap-1 transition-colors`}>
                    View Details <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Insight */}
            <div className={`relative overflow-hidden p-5 rounded-xl border ${isDarkMode ? 'border-amber-500/20 bg-amber-950/20' : 'border-amber-200 bg-amber-50/50'} backdrop-blur-sm group/card hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-900/40' : 'bg-amber-100'}`}>
                  <AlertCircle size={20} className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                    Engagement Gap
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    <strong>5 Energy Committee</strong> members haven't been contacted in 30+ days
                  </p>
                  <button className={`mt-3 text-xs font-semibold ${isDarkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'} flex items-center gap-1 transition-colors`}>
                    View Members <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Success Insight */}
            <div className={`relative overflow-hidden p-5 rounded-xl border ${isDarkMode ? 'border-green-500/20 bg-green-950/20' : 'border-green-200 bg-green-50/50'} backdrop-blur-sm group/card hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'}`}>
                  <TrendingUp size={20} className={isDarkMode ? 'text-green-400' : 'text-green-600'} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                    Momentum Building
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    Your outreach frequency is <strong>up 34%</strong> - maintain this pace through session
                  </p>
                  <div className={`mt-3 text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    On track 🎯
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Move */}
            <div className={`relative overflow-hidden p-5 rounded-xl border ${isDarkMode ? 'border-purple-500/20 bg-purple-950/20' : 'border-purple-200 bg-purple-50/50'} backdrop-blur-sm group/card hover:shadow-lg transition-all duration-300`}>
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'}`}>
                  <Target size={20} className={isDarkMode ? 'text-purple-400' : 'text-purple-600'} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs font-bold uppercase tracking-wide mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                    Strategic Move
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                    Speaker Johnson's chief of staff mentioned your client favorably - <strong>follow up within 48hrs</strong>
                  </p>
                  <button className={`mt-3 text-xs font-semibold ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} flex items-center gap-1 transition-colors`}>
                    Take Action <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout - Priority Legislators + Committee Influence */}
      <div className="grid grid-cols-2 gap-6">
        {/* Priority A Legislators */}
        <div className={`border ${borderColor} ${bgColor} backdrop-blur-md overflow-hidden hover:shadow-2xl transition-all duration-300`}>
          <div className={`px-6 py-5 border-b ${borderColor} flex items-center justify-between`}>
            <div>
              <h3 
                className={`text-xl font-bold ${textColor} tracking-tight`}
                style={{ fontFamily: '"Corpline", sans-serif' }}
              >
                PRIORITY A LEGISLATORS
              </h3>
              <p className={`text-xs ${textMuted} mt-0.5`}>Top relationships to maintain</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
              {priorityACount}
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
            {legislators
              .filter(l => l.priority === 'A')
              .slice(0, 8)
              .map((legislator) => (
                <button
                  key={legislator.id}
                  onClick={() => onSelectLegislator(legislator.id)}
                  className={`w-full p-4 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-slate-800/40 hover:bg-slate-700/60' : 'bg-white/40 hover:bg-white/80'} backdrop-blur-sm text-left transition-all duration-200 hover:shadow-lg group/leg`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className={`font-bold ${textColor} group-hover/leg:text-red-600 transition-colors`}>
                        {legislator.name}
                      </div>
                      <div className={`text-xs ${textMuted} mt-0.5`}>
                        {legislator.party}-{legislator.district} • {legislator.chamber}
                      </div>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`${textMuted} group-hover/leg:translate-x-1 transition-transform`}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      legislator.party === 'R'
                        ? (isDarkMode ? 'bg-red-950/40 text-red-400' : 'bg-red-50 text-red-700')
                        : (isDarkMode ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-50 text-blue-700')
                    }`}>
                      {legislator.party === 'R' ? 'Republican' : 'Democrat'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {legislator.committees[0]?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                        <Phone size={12} className={textMuted} />
                      </div>
                      <div className={`p-1.5 rounded ${isDarkMode ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                        <Mail size={12} className={textMuted} />
                      </div>
                    </div>
                    <div className={`text-xs ${textMuted}`}>
                      Last: 3d ago
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Committee Influence Index */}
        <div className={`border ${borderColor} ${bgColor} backdrop-blur-md overflow-hidden hover:shadow-2xl transition-all duration-300`}>
          <div className={`px-6 py-5 border-b ${borderColor}`}>
            <h3 
              className={`text-xl font-bold ${textColor} tracking-tight`}
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              COMMITTEE INFLUENCE
            </h3>
            <p className={`text-xs ${textMuted} mt-0.5`}>Relationship strength by committee</p>
          </div>

          <div className="p-6 space-y-4">
            <CommitteeInfluenceCard
              name="Energy & Environment"
              memberCount={8}
              relationshipScore={87}
              priorityMembers={3}
              trend="up"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />
            <CommitteeInfluenceCard
              name="Appropriations"
              memberCount={12}
              relationshipScore={72}
              priorityMembers={5}
              trend="up"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />
            <CommitteeInfluenceCard
              name="Health & Human Services"
              memberCount={6}
              relationshipScore={64}
              priorityMembers={2}
              trend="stable"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />
            <CommitteeInfluenceCard
              name="Education"
              memberCount={5}
              relationshipScore={58}
              priorityMembers={1}
              trend="down"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
              borderColor={borderColor}
            />
          </div>
        </div>
      </div>

      {/* Recent Activity Feed - Full Width */}
      <div className={`border ${borderColor} ${bgColor} backdrop-blur-md overflow-hidden hover:shadow-2xl transition-all duration-300`}>
        <div className={`px-6 py-5 border-b ${borderColor} flex items-center justify-between`}>
          <div>
            <h3 
              className={`text-xl font-bold ${textColor} tracking-tight`}
              style={{ fontFamily: '"Corpline", sans-serif' }}
            >
              RECENT ACTIVITY
            </h3>
            <p className={`text-xs ${textMuted} mt-0.5`}>Last 7 days of engagement</p>
          </div>
          <button className={`text-sm font-semibold ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors`}>
            View All →
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <ActivityItem
              icon={<Phone size={18} />}
              action="Phone call with Rep. Sarah Martinez"
              detail="Discussed HB 450 support strategy - positive response"
              time="2 hours ago"
              type="call"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
            />
            <ActivityItem
              icon={<Mail size={18} />}
              action="Email sent to Sen. James Wilson"
              detail="Follow-up on budget committee hearing"
              time="Yesterday, 3:45 PM"
              type="email"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
            />
            <ActivityItem
              icon={<MessageSquare size={18} />}
              action="Meeting logged with Rep. David Chen"
              detail="Capitol office meeting - positive outlook on SB 892"
              time="Dec 20, 10:30 AM"
              type="meeting"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
            />
            <ActivityItem
              icon={<CheckCircle size={18} />}
              action="Rep. Lisa Thompson added to watchlist"
              detail="New Energy Committee assignment"
              time="Dec 19, 4:15 PM"
              type="watch"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
            />
            <ActivityItem
              icon={<Calendar size={18} />}
              action="Reminder: Follow up with Sen. Robert Garcia"
              detail="30 days since last contact"
              time="Dec 18"
              type="reminder"
              isDarkMode={isDarkMode}
              textColor={textColor}
              textMuted={textMuted}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Committee Influence Card Component
interface CommitteeInfluenceCardProps {
  name: string;
  memberCount: number;
  relationshipScore: number;
  priorityMembers: number;
  trend: 'up' | 'down' | 'stable';
  isDarkMode: boolean;
  textColor: string;
  textMuted: string;
  borderColor: string;
}

function CommitteeInfluenceCard({ 
  name, 
  memberCount, 
  relationshipScore, 
  priorityMembers, 
  trend,
  isDarkMode,
  textColor,
  textMuted,
  borderColor
}: CommitteeInfluenceCardProps) {
  const scoreColor = relationshipScore >= 75 
    ? (isDarkMode ? 'text-green-400' : 'text-green-600')
    : relationshipScore >= 60
    ? (isDarkMode ? 'text-amber-400' : 'text-amber-600')
    : (isDarkMode ? 'text-red-400' : 'text-red-600');

  const scoreBg = relationshipScore >= 75
    ? (isDarkMode ? 'bg-green-950/20' : 'bg-green-50')
    : relationshipScore >= 60
    ? (isDarkMode ? 'bg-amber-950/20' : 'bg-amber-50')
    : (isDarkMode ? 'bg-red-950/20' : 'bg-red-50');

  const trendIcon = trend === 'up' 
    ? <TrendingUp size={16} className="text-green-500" />
    : trend === 'down'
    ? <TrendingDown size={16} className="text-red-500" />
    : <Minus size={16} className="text-gray-400" />;

  return (
    <div className={`p-5 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-slate-800/40 hover:bg-slate-700/60' : 'bg-white/40 hover:bg-white/80'} backdrop-blur-sm transition-all duration-300 hover:shadow-lg group`}>
      <div className="flex items-start justify-between mb-4">
        <h4 className={`font-bold ${textColor}`}>{name}</h4>
        {trendIcon}
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div>
          <div className={`text-4xl font-bold ${scoreColor}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
            {relationshipScore}
          </div>
          <div className={`text-xs ${textMuted}`}>Influence Score</div>
        </div>
        <div className={`flex-1 h-2 ${scoreBg} rounded-full overflow-hidden`}>
          <div 
            className={`h-full ${scoreColor.replace('text-', 'bg-')} transition-all duration-1000`}
            style={{ width: `${relationshipScore}%` }}
          />
        </div>
      </div>

      <div className={`pt-4 border-t ${borderColor} flex items-center justify-between`}>
        <div>
          <div className={`text-xs ${textMuted}`}>Members tracked</div>
          <div className={`text-lg font-bold ${textColor}`}>{memberCount}</div>
        </div>
        <div>
          <div className={`text-xs ${textMuted}`}>Priority A</div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{priorityMembers}</div>
        </div>
      </div>
    </div>
  );
}

// Activity Item Component
interface ActivityItemProps {
  icon: React.ReactNode;
  action: string;
  detail: string;
  time: string;
  type: 'call' | 'email' | 'meeting' | 'watch' | 'reminder';
  isDarkMode: boolean;
  textColor: string;
  textMuted: string;
}

function ActivityItem({ icon, action, detail, time, type, isDarkMode, textColor, textMuted }: ActivityItemProps) {
  const typeColors = {
    call: isDarkMode ? 'bg-blue-950/30 text-blue-400' : 'bg-blue-50 text-blue-600',
    email: isDarkMode ? 'bg-purple-950/30 text-purple-400' : 'bg-purple-50 text-purple-600',
    meeting: isDarkMode ? 'bg-green-950/30 text-green-400' : 'bg-green-50 text-green-600',
    watch: isDarkMode ? 'bg-amber-950/30 text-amber-400' : 'bg-amber-50 text-amber-600',
    reminder: isDarkMode ? 'bg-red-950/30 text-red-400' : 'bg-red-50 text-red-600',
  };

  return (
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-lg ${typeColors[type]} shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-semibold ${textColor} mb-1`}>{action}</div>
        <div className={`text-sm ${textMuted} mb-1`}>{detail}</div>
        <div className={`text-xs ${textMuted}`}>{time}</div>
      </div>
    </div>
  );
}