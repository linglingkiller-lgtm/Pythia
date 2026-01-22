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
import { PageLayout } from '../ui/PageLayout';

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
    <PageLayout
      title="Client Overview"
      subtitle="Clients"
      headerIcon={
        <div className="relative">
            <Building2
            className="w-7 h-7"
            style={{
                color: isDarkMode ? clientsTheme.glow : clientsTheme.accent,
            }}
            />
            <div
            className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
            style={{
                backgroundColor: clientsTheme.glow,
            }}
            />
        </div>
      }
      accentColor={clientsTheme.accent}
      backgroundImage={
        <Building2 
          size={450} 
          color={isDarkMode ? "white" : clientsTheme.accent} 
          strokeWidth={0.5}
        />
      }
      pageActions={
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
      }
      headerContent={
        <div className="flex items-center gap-2 w-full max-w-4xl">
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
              <span className={`hidden sm:inline text-[10px] font-medium ${isDarkMode ? 'text-orange-400/70' : 'text-orange-700'}`}>
                Expiring
              </span>
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Search - Compact */}
            <div className="flex-1 min-w-[120px]">
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
                  className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
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
        </div>
      }
    >
      <CreateClientModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen}
        onCreate={handleCreateClient}
      />
      
      <div className="p-6">
        {/* Filters Panel */}
        <AnimatePresence>
            {showFilters && (
                <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4 mb-4"
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
    </PageLayout>
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

        {/* Team Avatars */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {owners.map(owner => (
              <div 
                key={owner.id}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-700 text-white' 
                    : 'border-white bg-gray-100 text-gray-700'
                }`}
                title={owner.name}
              >
                {owner.avatar ? (
                  <img src={owner.avatar} alt={owner.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  owner.initials
                )}
              </div>
            ))}
            {owners.length === 0 && (
              <span className={`text-xs italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No owners</span>
            )}
          </div>
          
          <div className={`flex items-center gap-1 text-xs font-medium transition-colors ${
            isDarkMode ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-emerald-600 group-hover:text-emerald-700'
          }`}>
            View Dashboard <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
