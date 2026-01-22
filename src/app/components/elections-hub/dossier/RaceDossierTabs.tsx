import { 
  Users, DollarSign, Map, MessageSquare, Target, Zap, FileText, 
  TrendingUp, AlertCircle, CheckCircle2, Calendar, ExternalLink, BrainCircuit, Sparkles,
  PieChart, BarChart2, Layers, Link2, Megaphone, FolderKanban, CheckSquare, MessageCircle, FileBarChart
} from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Race, Candidate, Opportunity, Filing, FieldProject } from '../../../data/electionsHubData';
import { GlassPanel, StatusChip, TrendSparkline } from '../shared/ElectionsSharedComponents';
import { Button } from '../../ui/Button';

// --- Tab 1: Snapshot ---
export const SnapshotTab = ({ race, candidates, opportunities }: { race: Race, candidates: Candidate[], opportunities: Opportunity[] }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Target size={16} />
            <span className="text-xs font-bold uppercase">Competitiveness</span>
          </div>
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {race.competitivenessScore}
            </span>
            <div className="mb-1.5">
               <TrendSparkline data={race.trend.series} color={race.trend.direction === 'worsening' ? 'red' : 'green'} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <StatusChip status={race.lean} size="sm" variant="lean" />
            <span className={race.trend.direction === 'worsening' ? 'text-red-500' : 'text-green-500'}>
              {race.trend.direction} trend
            </span>
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <Zap size={16} />
            <span className="text-xs font-bold uppercase">Money Heat</span>
          </div>
          <div className="flex items-end gap-3">
            <span className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {race.moneyHeat}
            </span>
            <div className="mb-1.5 w-20 h-8 flex items-end gap-1">
               {race.outsideSpendSeries.map((val, i) => (
                 <div key={i} className="flex-1 bg-red-500/50 rounded-t" style={{ height: `${val}%` }} />
               ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-red-400 font-medium">
             High outside spend detected
          </div>
        </GlassPanel>

        <GlassPanel className="p-4">
          <div className="flex items-center gap-2 mb-2 text-gray-500">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold uppercase">Our Involvement</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>War Room</span>
              <StatusChip status={race.ourInvolvement.hasWarRoom ? 'Active' : 'None'} size="sm" />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Active Tasks</span>
              <span className="font-bold">{race.ourInvolvement.taskCount}</span>
            </div>
          </div>
        </GlassPanel>
      </div>

      {/* Key Drivers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section>
          <h3 className={`text-sm font-bold uppercase mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Key Drivers</h3>
          <ul className="space-y-2">
            <li className={`p-3 rounded-lg border text-sm flex gap-3 ${isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span>Incumbent fundraising trailing challenger by 12% in Q1.</span>
            </li>
            <li className={`p-3 rounded-lg border text-sm flex gap-3 ${isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
               <TrendingUp size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
               <span>District demographics shifting younger (Ticket Split Index: {race.districtProfile.ticketSplitIndex}).</span>
            </li>
          </ul>
        </section>

        <section>
          <h3 className={`text-sm font-bold uppercase mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Top Issues</h3>
          <div className="space-y-3">
            {race.topIssues.map((issue, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{issue.issue}</span>
                  <span className="text-gray-500">{issue.salience}% Salience</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-indigo-500" 
                    style={{ width: `${issue.salience}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

// --- Tab 2: Candidates ---
export const CandidatesTab = ({ candidates }: { candidates: Candidate[] }) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4 duration-500">
      {candidates.map(cand => (
        <GlassPanel key={cand.id} className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-lg font-bold">
                {cand.name.charAt(0)}
              </div>
              <div>
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {cand.name} {cand.isIncumbent && <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded ml-1 align-middle">INC</span>}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                   <StatusChip status={cand.status} size="sm" />
                   <span className="text-xs text-gray-500">Credibility: {cand.credibility}%</span>
                </div>
              </div>
            </div>
            {cand.website && (
              <a href={cand.website} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-indigo-500">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
          
          <div className="space-y-4">
             {/* Messaging Tags */}
             <div className="flex flex-wrap gap-2">
               {cand.messagingTags.map(tag => (
                 <span key={tag} className={`text-xs px-2 py-1 rounded border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                   {tag}
                 </span>
               ))}
             </div>

             {/* Mini Finance */}
             {cand.finance.length > 0 && (
               <div className="pt-3 border-t border-gray-100 dark:border-white/5">
                 <div className="text-xs font-semibold mb-2 text-gray-500 uppercase">Latest Finance (Q1)</div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <div className="text-[10px] text-gray-400">Raised</div>
                     <div className="font-mono font-bold text-green-500">${(cand.finance[cand.finance.length-1].raised / 1000).toFixed(0)}k</div>
                   </div>
                   <div>
                     <div className="text-[10px] text-gray-400">Cash on Hand</div>
                     <div className="font-mono font-bold text-blue-500">${(cand.finance[cand.finance.length-1].cash / 1000).toFixed(0)}k</div>
                   </div>
                 </div>
               </div>
             )}
          </div>
        </GlassPanel>
      ))}
    </div>
  );
};

// --- Tab 3: Money & Filings ---
export const MoneyTab = ({ candidates, filings, outsideSpendSeries }: { candidates: Candidate[], filings: Filing[], outsideSpendSeries: number[] }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassPanel className="p-5">
           <h3 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Candidate Fundraising</h3>
           <div className="space-y-4">
             {candidates.map(cand => {
               const latest = cand.finance[cand.finance.length-1] || { raised: 0, cash: 0 };
               const percent = Math.min(100, (latest.raised / 300000) * 100); // Mock scale
               return (
                 <div key={cand.id}>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold">{cand.name}</span>
                     <span className="text-green-500 font-mono">${(latest.raised / 1000).toFixed(1)}k</span>
                   </div>
                   <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
                     <div className="h-full bg-green-500" style={{ width: `${percent}%` }} />
                   </div>
                   <div className="text-[10px] text-gray-400 text-right">COH: ${(latest.cash / 1000).toFixed(1)}k</div>
                 </div>
               );
             })}
             {candidates.length === 0 && <div className="text-sm text-gray-500 italic">No fundraising data available.</div>}
           </div>
        </GlassPanel>

        <GlassPanel className="p-5">
           <h3 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Outside Spend Intensity</h3>
           <div className="flex items-end gap-2 h-32 mb-4">
             {outsideSpendSeries.map((val, i) => (
               <div key={i} className="flex-1 flex flex-col justify-end group relative">
                 <div 
                   className="w-full bg-red-500/80 rounded-t transition-all group-hover:bg-red-500" 
                   style={{ height: `${val}%` }} 
                 />
                 <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">
                   {val}%
                 </div>
               </div>
             ))}
           </div>
           <p className="text-xs text-gray-500">
             Relative outside spending volume over the last 6 months. High peaks indicate heavy PAC involvement.
           </p>
        </GlassPanel>
      </div>

      {/* Filings Table */}
      <div>
        <h3 className={`text-sm font-bold uppercase mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recent Filings</h3>
        <div className={`rounded-lg border overflow-hidden ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
          <table className="w-full text-sm text-left">
            <thead className={`text-xs uppercase font-bold ${isDarkMode ? 'bg-slate-900 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Candidate</th>
                <th className="p-3">Filing Type</th>
                <th className="p-3 text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filings.map(filing => {
                const candidate = candidates.find(c => c.id === filing.candidateId);
                return (
                  <tr key={filing.id} className={isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                    <td className="p-3 text-gray-500">{new Date(filing.received).toLocaleDateString()}</td>
                    <td className={`p-3 font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{candidate?.name || 'Unknown'}</td>
                    <td className="p-3">{filing.type}</td>
                    <td className="p-3 text-right">
                      {filing.link && (
                        <a href={filing.link} target="_blank" rel="noreferrer" className="text-indigo-500 hover:text-indigo-400 inline-flex items-center gap-1 text-xs">
                          View <ExternalLink size={10} />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filings.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500 italic">No filings recorded.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Tab 4: District ---
export const DistrictTab = ({ profile }: { profile: Race['districtProfile'] }) => {
  const { isDarkMode } = useTheme();

  const StatBox = ({ label, value, subtext }: any) => (
    <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
      <div className="text-xs text-gray-500 uppercase mb-1">{label}</div>
      <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBox label="Median Income" value={`$${profile.medianIncome.toLocaleString()}`} />
        <StatBox label="Urbanicity" value={profile.urbanicityIndex} subtext="0 (Rural) - 100 (Urban)" />
        <StatBox label="Education Index" value={profile.educationIndex} subtext="College Deg. % Score" />
        <StatBox label="Ticket Split" value={profile.ticketSplitIndex} subtext="High split propensity" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
           <h3 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age Demographics</h3>
           <div className="space-y-3">
             <div className="flex items-center gap-2">
               <span className="w-16 text-xs text-gray-500">18-29</span>
               <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                 <div className="h-full bg-blue-400" style={{ width: `${profile.ageIndex.under30}%` }} />
               </div>
               <span className="w-8 text-xs font-bold text-right">{profile.ageIndex.under30}%</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-16 text-xs text-gray-500">30-49</span>
               <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                 <div className="h-full bg-blue-500" style={{ width: `${profile.ageIndex.age30_49}%` }} />
               </div>
               <span className="w-8 text-xs font-bold text-right">{profile.ageIndex.age30_49}%</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-16 text-xs text-gray-500">50-64</span>
               <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                 <div className="h-full bg-blue-600" style={{ width: `${profile.ageIndex.age50_64}%` }} />
               </div>
               <span className="w-8 text-xs font-bold text-right">{profile.ageIndex.age50_64}%</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-16 text-xs text-gray-500">65+</span>
               <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                 <div className="h-full bg-blue-700" style={{ width: `${profile.ageIndex.age65plus}%` }} />
               </div>
               <span className="w-8 text-xs font-bold text-right">{profile.ageIndex.age65plus}%</span>
             </div>
           </div>
        </GlassPanel>

        <GlassPanel className="p-5">
           <h3 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Turnout Pattern</h3>
           <div className="flex items-center justify-center h-48 gap-8">
             <div className="text-center group">
               <div className="h-32 w-16 bg-indigo-200 dark:bg-indigo-900/30 rounded-t relative mx-auto flex items-end justify-center overflow-hidden">
                 <div className="w-full bg-indigo-500 transition-all duration-1000" style={{ height: `${profile.turnoutPattern.midterm * 100}%` }} />
               </div>
               <div className="mt-2 text-sm font-bold">Midterm</div>
               <div className="text-xs text-gray-500">{(profile.turnoutPattern.midterm * 100).toFixed(0)}%</div>
             </div>
             <div className="text-center group">
               <div className="h-32 w-16 bg-purple-200 dark:bg-purple-900/30 rounded-t relative mx-auto flex items-end justify-center overflow-hidden">
                 <div className="w-full bg-purple-500 transition-all duration-1000" style={{ height: `${profile.turnoutPattern.presidential * 100}%` }} />
               </div>
               <div className="mt-2 text-sm font-bold">Presidential</div>
               <div className="text-xs text-gray-500">{(profile.turnoutPattern.presidential * 100).toFixed(0)}%</div>
             </div>
           </div>
        </GlassPanel>
      </div>
    </div>
  );
};

// --- Tab 6: Field ---
export const FieldTab = ({ projects }: { projects: FieldProject[] }) => {
  const { isDarkMode } = useTheme();

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Megaphone className="text-gray-400" size={32} />
        </div>
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No Active Field Projects</h3>
        <p className="text-gray-500 max-w-sm mt-2 mb-6">There are no canvassing or ground game projects linked to this race yet.</p>
        <Button variant="primary">Launch Field Project</Button>
      </div>
    );
  }

  const project = projects[0]; // Demo: just show first project
  const latestReport = project.weeklyReports[project.weeklyReports.length - 1];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</h3>
        <Button size="sm" variant="secondary">View War Room</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <GlassPanel className="p-4 text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Doors Knocked</div>
          <div className="text-2xl font-black text-indigo-500">{project.doors.toLocaleString()}</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Conversations</div>
          <div className="text-2xl font-black text-green-500">{project.convos.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">{((project.convos / project.doors) * 100).toFixed(1)}% Rate</div>
        </GlassPanel>
        <GlassPanel className="p-4 text-center">
          <div className="text-xs text-gray-500 uppercase mb-1">Shifts Completed</div>
          <div className="text-2xl font-black text-blue-500">{project.shifts}</div>
        </GlassPanel>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassPanel className="p-5">
           <h4 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Latest Feedback</h4>
           {latestReport ? (
             <div className="space-y-4">
               <div>
                 <div className="text-xs text-gray-500 mb-1">Script Performance Score</div>
                 <div className="flex items-center gap-2">
                   <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                     <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${latestReport.scriptScore}%` }} />
                   </div>
                   <span className="text-sm font-bold">{latestReport.scriptScore}/100</span>
                 </div>
               </div>
               <div>
                 <div className="text-xs text-gray-500 mb-2">Top Objections</div>
                 <div className="flex flex-wrap gap-2">
                   {latestReport.topObjections.map(obj => (
                     <span key={obj} className="px-2 py-1 rounded bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs font-medium">
                       {obj}
                     </span>
                   ))}
                 </div>
               </div>
               <div className={`p-3 rounded text-sm italic border ${isDarkMode ? 'bg-slate-800/50 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                 "{latestReport.notes}"
               </div>
             </div>
           ) : (
             <div className="text-gray-500 italic text-sm">No reports filed yet.</div>
           )}
        </GlassPanel>

        <GlassPanel className="p-5">
           <h4 className={`text-sm font-bold uppercase mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Volunteer Pipeline</h4>
           <div className="space-y-2">
             <div className="flex items-center">
               <div className="w-24 text-xs font-medium text-gray-500">Signups</div>
               <div className="flex-1 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-r flex items-center px-2 relative">
                  <div className="absolute inset-y-0 left-0 bg-blue-500/20 w-full rounded-r" />
                  <span className="relative z-10 font-bold">142</span>
               </div>
             </div>
             <div className="flex items-center">
               <div className="w-24 text-xs font-medium text-gray-500">Training</div>
               <div className="flex-1 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-r flex items-center px-2 relative ml-4">
                  <div className="absolute inset-y-0 left-0 bg-blue-500/40 w-[60%] rounded-r" />
                  <span className="relative z-10 font-bold">48</span>
               </div>
             </div>
             <div className="flex items-center">
               <div className="w-24 text-xs font-medium text-gray-500">Active</div>
               <div className="flex-1 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-r flex items-center px-2 relative ml-8">
                  <div className="absolute inset-y-0 left-0 bg-blue-600/80 w-[40%] rounded-r" />
                  <span className="relative z-10 font-bold text-white">24</span>
               </div>
             </div>
           </div>
        </GlassPanel>
      </div>
    </div>
  );
};

// --- Tab 7: Integrations ---
export const IntegrationsTab = () => {
  const { isDarkMode } = useTheme();

  const IntegrationCard = ({ icon: Icon, title, count, action }: any) => (
    <GlassPanel className="p-4 flex items-center justify-between group">
       <div className="flex items-center gap-3">
         <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
           <Icon size={20} className="text-gray-500" />
         </div>
         <div>
           <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</div>
           <div className="text-xs text-gray-500">{count} Linked Items</div>
         </div>
       </div>
       <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
         {action}
       </Button>
    </GlassPanel>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 gap-3">
        <IntegrationCard icon={FolderKanban} title="Projects" count={2} action="Link Project" />
        <IntegrationCard icon={CheckSquare} title="Tasks" count={12} action="Add Task" />
        <IntegrationCard icon={Calendar} title="Calendar Events" count={5} action="Add Event" />
        <IntegrationCard icon={MessageCircle} title="Chat Threads" count={3} action="Open Chat" />
        <IntegrationCard icon={FileBarChart} title="Records & Briefs" count={8} action="Attach Record" />
      </div>
      
      <div className={`p-4 rounded-lg border border-dashed text-center ${isDarkMode ? 'border-gray-700 bg-slate-900/30' : 'border-gray-300 bg-gray-50'}`}>
        <p className="text-sm text-gray-500 mb-3">Connect other modules to this race to centralized intelligence.</p>
        <Button variant="secondary" size="sm">Browse All Modules</Button>
      </div>
    </div>
  );
};

// --- Tab 8: AI Lab ---
export const AILabTab = ({ race, opportunities, onActivatePlaybook }: any) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className={`p-4 rounded-xl border border-indigo-500/30 ${isDarkMode ? 'bg-indigo-900/10' : 'bg-indigo-50'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="text-indigo-500" size={24} />
          <div>
            <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pythia Strategic Insight</h3>
            <p className="text-xs text-indigo-400">AI-generated analysis based on 14 data points</p>
          </div>
        </div>
        <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? 'text-indigo-100' : 'text-indigo-900'}`}>
          This race is exhibiting classic <span className="font-bold">"early warning" signs of a breakout challenger</span>. 
          While the incumbent maintains a cash advantage, the challenger's narrative around cost-of-living is gaining traction (Volume +34%).
          Recommended strategy is to define the opponent early before they can consolidate undecideds.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="sm">Generate Race Brief</Button>
          <Button variant="secondary" size="sm">Simulate Outcomes</Button>
        </div>
      </div>

      {/* Suggested Actions */}
      <h3 className={`text-sm font-bold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recommended Actions</h3>
      <div className="space-y-3">
        {opportunities.map((opp: any) => (
          <GlassPanel key={opp.id} className="p-4 flex items-center justify-between group">
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <StatusChip status={opp.impact} size="sm" />
                 <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confidence: {opp.confidence}%</span>
               </div>
               <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{opp.title}</div>
             </div>
             <Button size="sm" onClick={() => onActivatePlaybook(opp.playbookKey)}>
               Activate Playbook
             </Button>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
};
