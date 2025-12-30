import React from 'react';
import { useClientsOverview } from '../../hooks/useClients';
import { mockTeamMembers, type Client } from '../../data/clientsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { Search, Filter, DollarSign, Calendar, FileText, TrendingUp, Eye, MoreVertical, Briefcase, Plus, Download, Users, Building2, Sparkles, AlertCircle, TrendingDown, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { CreateClientModal } from './CreateClientModal';

interface ClientsIndexPageProps {
  onNavigateToClient: (clientId: string) => void;
}

export function ClientsIndexPage({ onNavigateToClient }: ClientsIndexPageProps) {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [ownerFilter, setOwnerFilter] = React.useState<string>('all');
  const [healthFilter, setHealthFilter] = React.useState<string>('all');
  const [runwayFilter, setRunwayFilter] = React.useState<string>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  const { clients, loading, error, refetch, createNewClient } = useClientsOverview({ search: searchQuery });
  
  // Scroll state for header compression
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Calculate contract runway in days
  const getContractRunway = (client: Client) => {
    if (!client.contractEnd) return 999;
    const endDate = new Date(client.contractEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    // Search is handled by hook, but we filter again if needed or rely on hook.
    // Hook handles search, so 'clients' is already filtered by search.
    // But local owner/health/runway filters need to be applied.
    
    const matchesOwner = ownerFilter === 'all' ||
      client.ownerUserIds.includes(ownerFilter);
    
    const matchesHealth = healthFilter === 'all' ||
      client.healthStatus === healthFilter;
    
    const runwayDays = getContractRunway(client);
    const matchesRunway = runwayFilter === 'all' ||
      (runwayFilter === '30' && runwayDays <= 30) ||
      (runwayFilter === '60' && runwayDays <= 60) ||
      (runwayFilter === '90' && runwayDays <= 90);
    
    return matchesOwner && matchesHealth && matchesRunway;
  });

  const activeFiltersCount = [ownerFilter, healthFilter, runwayFilter].filter(f => f !== 'all').length;
  
  // Calculate stats - based on 'clients' (which is just search-filtered), matching prompt requirement
  // "Counts should reflect current dataset (after search, before chip filter is fine)"
  const totalRevenue = clients.reduce((sum, c) => sum + c.contractValueYTD, 0);
  const healthCounts = {
    green: clients.filter(c => c.healthStatus === 'green').length,
    yellow: clients.filter(c => c.healthStatus === 'yellow').length,
    red: clients.filter(c => c.healthStatus === 'red').length,
  };
  const expiringIn30 = clients.filter(c => getContractRunway(c) <= 30).length;

  // Export to CSV
  const handleExport = () => {
    const headers = ['Client Name', 'Health', 'Revenue YTD', 'Monthly Retainer', 'Contract End', 'Bills', 'Issues', 'Tasks', 'Opps'];
    const rows = filteredClients.map(c => [
      c.name,
      c.healthStatus,
      c.contractValueYTD,
      c.contractValueMonthly,
      c.contractEnd,
      c.activeBillsCount,
      c.activeIssuesCount,
      c.tasksThisWeekCount,
      c.opportunitiesCount
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateClient = async (data: any) => {
    const { error } = await createNewClient(data);
    if (!error) {
      refetch();
    }
  };

  // Get Clients page theme
  const clientsTheme = getPageTheme('Clients');

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30'
    }`}>
      <CreateClientModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreateClient}
      />
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-emerald-900/20 to-transparent'
          : 'bg-gradient-to-b from-emerald-50/40 to-transparent'
      }`} />

      {/* Header - Sticky with Glassmorphism */}
      <motion.div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isDarkMode
            ? 'bg-slate-900/40 border-b border-white/[0.08]'
            : 'bg-white/40 border-b border-gray-200/50'
        }`}
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
        animate={{
          paddingTop: isScrolled ? '12px' : '24px',
          paddingBottom: isScrolled ? '12px' : '16px',
        }}
      >
        {/* Subtle gradient accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Clients" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(clientsTheme.gradientFrom, 0.12)}, ${hexToRgba(clientsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(clientsTheme.gradientFrom, 0.08)}, ${hexToRgba(clientsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(clientsTheme.accent, 0.25)
                    : hexToRgba(clientsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(clientsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(clientsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(clientsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(clientsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <Building2
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? clientsTheme.glow : clientsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: clientsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? clientsTheme.glow : clientsTheme.accent,
                  }}
                >
                  Clients
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Client Overview
                </motion.h1>
                <motion.p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {filteredClients.length} Active Clients • ${totalRevenue.toLocaleString()} YTD Revenue
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-emerald-600/90 text-white hover:bg-emerald-600 border border-emerald-500/30'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                New Client
              </button>
            </div>
          </div>

          {/* Stats Row - Inline */}
          <motion.div
            className="flex items-center gap-2 pb-4"
            animate={{
              opacity: isScrolled ? 0.5 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Green Health Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-green-900/10 border-green-500/20 hover:border-green-500/40'
                : 'bg-green-50 border-green-200 hover:border-green-300'
            }`}>
              <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                {healthCounts.green}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-green-400/70' : 'text-green-700'}`}>
                Healthy
              </span>
            </div>

            {/* Yellow Health Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-yellow-900/10 border-yellow-500/20 hover:border-yellow-500/40'
                : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
            }`}>
              <AlertCircle className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                {healthCounts.yellow}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
                At Risk
              </span>
            </div>

            {/* Red Health Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-red-900/10 border-red-500/20 hover:border-red-500/40'
                : 'bg-red-50 border-red-200 hover:border-red-300'
            }`}>
              <TrendingDown className={`w-3 h-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                {healthCounts.red}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-red-400/70' : 'text-red-700'}`}>
                Critical
              </span>
            </div>

            {/* Expiring Soon Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-orange-900/10 border-orange-500/20 hover:border-orange-500/40'
                : 'bg-orange-50 border-orange-200 hover:border-orange-300'
            }`}>
              <Calendar className={`w-3 h-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                {expiringIn30}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-orange-400/70' : 'text-orange-700'}`}>
                Expiring Soon
              </span>
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Search - Compact */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                    isDarkMode ? 'text-slate-500' : 'text-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search clients..."
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/40 border-white/10 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-emerald-500/30'
                      : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-emerald-300'
                  }`}
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                showFilters
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              {activeFiltersCount > 0 ? `${activeFiltersCount}` : 'Filters'}
            </button>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4"
              >
                <div className={`pt-4 border-t grid grid-cols-3 gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Owner
                    </label>
                    <select
                      value={ownerFilter}
                      onChange={e => setOwnerFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All Owners</option>
                      {mockTeamMembers.map(member => (
                        <option key={member.id} value={member.id}>{member.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Health Status
                    </label>
                    <select
                      value={healthFilter}
                      onChange={e => setHealthFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All Health</option>
                      <option value="green">Healthy</option>
                      <option value="yellow">At Risk</option>
                      <option value="red">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Contract Runway
                    </label>
                    <select
                      value={runwayFilter}
                      onChange={e => setRunwayFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All Contracts</option>
                      <option value="30">Ends in 30 days</option>
                      <option value="60">Ends in 60 days</option>
                      <option value="90">Ends in 90 days</option>
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setOwnerFilter('all');
                      setHealthFilter('all');
                      setRunwayFilter('all');
                    }}
                    className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Client Grid */}
      <div className="flex-1 overflow-y-auto p-6 relative z-10" ref={scrollRef}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              runwayDays={getContractRunway(client)}
              onNavigate={() => onNavigateToClient(client.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ClientCardProps {
  client: Client;
  runwayDays: number;
  onNavigate: () => void;
}

function ClientCard({ client, runwayDays, onNavigate }: ClientCardProps) {
  const { isDarkMode } = useTheme();
  
  const getHealthColor = (health: string) => {
    if (isDarkMode) {
      switch (health) {
        case 'green': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'yellow': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'red': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    } else {
      switch (health) {
        case 'green': return 'bg-green-100 text-green-800 border-green-200';
        case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'red': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getRunwayColor = (days: number) => {
    if (days <= 30) return isDarkMode ? 'text-red-400' : 'text-red-600';
    if (days <= 60) return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
    return isDarkMode ? 'text-gray-400' : 'text-gray-600';
  };

  const owners = mockTeamMembers.filter(m => client.ownerUserIds.includes(m.id));

  return (
    <div className={`relative p-5 rounded-lg backdrop-blur-xl border transition-all hover:shadow-xl cursor-pointer overflow-hidden ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10 hover:border-emerald-500/30'
        : 'bg-white/80 border-gray-200 hover:border-emerald-300'
    } shadow-lg`} onClick={onNavigate}>
      {/* Large Watermark Logo */}
      {client.logoInitials && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none select-none">
          <div 
            className={`font-black text-[120px] leading-none tracking-tighter transition-all duration-500 ${
              isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.04]'
            }`}
            style={{ 
              color: client.logoColor || (isDarkMode ? '#fff' : '#000'),
              textShadow: isDarkMode 
                ? `0 0 60px ${client.logoColor || '#10b981'}40, 0 0 100px ${client.logoColor || '#10b981'}20, 0 0 140px ${client.logoColor || '#10b981'}10`
                : `0 0 50px ${client.logoColor || '#10b981'}25, 0 0 80px ${client.logoColor || '#10b981'}15`
            }}
          >
            {client.logoInitials}
          </div>
        </div>
      )}

      {/* Content - positioned above watermark */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`font-bold mb-1 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{client.name}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {client.tags.map(tag => (
                <Chip key={tag} variant="neutral" size="sm">{tag}</Chip>
              ))}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-lg border text-xs font-semibold uppercase tracking-wide ${getHealthColor(client.healthStatus)}`}>
            {client.healthStatus}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <div className={`text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Revenue YTD</div>
            <div className={`font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>${client.contractValueYTD.toLocaleString()}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>${client.contractValueMonthly.toLocaleString()}/mo</div>
          </div>
          
          <div>
            <div className={`text-xs mb-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Contract Runway</div>
            <div className={`font-semibold ${getRunwayColor(runwayDays)}`}>
              {runwayDays} days
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-500' : 'text-gray-600'
            }`}>Ends {new Date(client.contractEnd).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Activity Metrics */}
        <div className={`grid grid-cols-4 gap-2 mb-4 pb-4 border-b ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{client.activeBillsCount}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Bills</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{client.activeIssuesCount}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Issues</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{client.tasksThisWeekCount}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Tasks</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{client.opportunitiesCount}</div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>Opps</div>
          </div>
        </div>

        {/* Owners */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {owners.map(owner => (
                <div
                  key={owner.id}
                  className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold border-2 ${
                    isDarkMode ? 'border-slate-800' : 'border-white'
                  }`}
                  title={owner.name}
                >
                  {owner.initials}
                </div>
              ))}
            </div>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {owners.map(o => o.name).join(', ')}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              <FileText size={14} />
              Report
            </Button>
            <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); }}>
              <Eye size={14} />
              Open
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}