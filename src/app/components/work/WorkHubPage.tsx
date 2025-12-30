import React from 'react';
import { LayoutGrid, Users, FolderKanban, FileCheck } from 'lucide-react';
import { MyWorkTab } from './MyWorkTab';
import { ClientWorkTab } from './ClientWorkTab';
import { ProjectsTab } from './ProjectsTab';
import { DeliverablesTab } from './DeliverablesTab';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

type WorkHubTab = 'my-work' | 'client-work' | 'projects' | 'deliverables';

interface WorkHubPageProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
}

export function WorkHubPage({ onNavigateToClient, onNavigateToBill }: WorkHubPageProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = React.useState<WorkHubTab>('my-work');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Handle scroll detection
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

  const tabs = [
    { id: 'my-work' as const, label: 'My Work', icon: LayoutGrid },
    { id: 'client-work' as const, label: 'Client Work', icon: Users },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'deliverables' as const, label: 'Deliverables', icon: FileCheck },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'my-work':
        return 'My Work';
      case 'client-work':
        return 'Client Work';
      case 'projects':
        return 'Projects';
      case 'deliverables':
        return 'Deliverables';
      default:
        return 'Project Hub';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'my-work':
        return 'Personal Tasks & Assignments';
      case 'client-work':
        return 'Client Projects & Management';
      case 'projects':
        return 'Campaign Workflow & Deliverables';
      case 'deliverables':
        return 'Content & Asset Tracking';
      default:
        return 'Manage your work, client projects, and deliverables';
    }
  };

  // Get Projects page theme
  const projectsTheme = getPageTheme('Projects');

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-cyan-50/30 via-white to-blue-50/30'
    }`}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-cyan-900/20 to-transparent'
          : 'bg-gradient-to-b from-cyan-50/40 to-transparent'
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
        {/* Subtle gradient accent line with Projects theme */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(to right, transparent, ${hexToRgba(projectsTheme.gradientFrom, 0.3)}, ${hexToRgba(projectsTheme.gradientTo, 0.25)}, transparent)`,
          }}
        />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Projects" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(projectsTheme.gradientFrom, 0.12)}, ${hexToRgba(projectsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(projectsTheme.gradientFrom, 0.08)}, ${hexToRgba(projectsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(projectsTheme.accent, 0.25)
                    : hexToRgba(projectsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(projectsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(projectsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(projectsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(projectsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <FolderKanban
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? projectsTheme.glow : projectsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: projectsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? projectsTheme.glow : projectsTheme.accent,
                  }}
                >
                  Projects
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
                  {getPageTitle()}
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
                  {getTabSubtitle()}
                </motion.p>
              </div>
            </div>

            {/* Right: Could add action buttons here in the future */}
            <div className="flex items-center gap-2">
              {/* Placeholder for future action buttons */}
            </div>
          </div>

          {/* Subpage Selector - Below Title */}
          <motion.div 
            className="flex items-center"
            animate={{
              marginBottom: isScrolled ? '8px' : '12px',
            }}
            transition={{ duration: 0.25 }}
          >
            <div className={`flex items-center rounded-xl p-1 ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? isDarkMode
                          ? 'text-white shadow-lg'
                          : 'bg-white shadow-md'
                        : isDarkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={
                      activeTab === tab.id
                        ? {
                            background: `linear-gradient(135deg, ${projectsTheme.gradientFrom}, ${projectsTheme.gradientTo})`,
                            boxShadow: isDarkMode
                              ? `0 4px 12px ${hexToRgba(projectsTheme.glow, 0.3)}`
                              : `0 2px 8px ${hexToRgba(projectsTheme.glow, 0.2)}`,
                          }
                        : {}
                    }
                  >
                    <Icon size={16} />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tab Content */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
        {activeTab === 'my-work' && (
          <MyWorkTab
            onNavigateToClient={onNavigateToClient}
            onNavigateToBill={onNavigateToBill}
          />
        )}
        {activeTab === 'client-work' && (
          <ClientWorkTab
            onNavigateToClient={onNavigateToClient}
            onNavigateToBill={onNavigateToBill}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsTab
            onNavigateToClient={onNavigateToClient}
            onNavigateToBill={onNavigateToBill}
          />
        )}
        {activeTab === 'deliverables' && (
          <DeliverablesTab
            onNavigateToClient={onNavigateToClient}
            onNavigateToBill={onNavigateToBill}
          />
        )}
      </div>
    </div>
  );
}