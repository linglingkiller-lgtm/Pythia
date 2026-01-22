/**
 * PAGE THEME CONFIGURATION
 * Single source of truth for page-specific color identities
 * Each page gets: accent, gradientFrom, gradientTo, and glow colors
 */

export interface PageTheme {
  accent: string;
  gradientFrom: string;
  gradientTo: string;
  glow: string;
}

export const PAGE_THEMES: Record<string, PageTheme> = {
  // Dashboard: Blue
  Dashboard: {
    accent: '#3B82F6', // Blue-500
    gradientFrom: '#3B82F6',
    gradientTo: '#60A5FA', // Blue-400
    glow: '#60A5FA',
  },
  // War Room: Red
  'War Room': {
    accent: '#EF4444', // Red-500
    gradientFrom: '#EF4444',
    gradientTo: '#FCA5A5', // Red-300
    glow: '#EF4444',
  },
  // Clients: Green
  Clients: {
    accent: '#22C55E', // Green-500
    gradientFrom: '#22C55E',
    gradientTo: '#4ADE80', // Green-400
    glow: '#22C55E',
  },
  // Bills: Indigo/Purple
  Bills: {
    accent: '#6366F1', // Indigo-500
    gradientFrom: '#6366F1',
    gradientTo: '#A855F7', // Purple-500
    glow: '#818CF8',
  },
  // Issues: Orange
  Issues: {
    accent: '#F97316', // Orange-500
    gradientFrom: '#F97316',
    gradientTo: '#FDBA74', // Orange-300
    glow: '#FB923C',
  },
  // Legislators: Pink/Magenta
  Legislators: {
    accent: '#EC4899', // Pink-500
    gradientFrom: '#EC4899',
    gradientTo: '#F472B6', // Pink-400
    glow: '#FBCFE8',
  },
  // Elections: Cyan
  Elections: {
    accent: '#06B6D4', // Cyan-500
    gradientFrom: '#06B6D4',
    gradientTo: '#22D3EE', // Cyan-400
    glow: '#67E8F9',
  },
  // Projects: Violet
  Projects: {
    accent: '#8B5CF6', // Violet-500
    gradientFrom: '#8B5CF6',
    gradientTo: '#C4B5FD', // Violet-300
    glow: '#A78BFA',
  },
  // Calendar: Teal
  Calendar: {
    accent: '#14B8A6', // Teal-500
    gradientFrom: '#14B8A6',
    gradientTo: '#5EEAD4', // Teal-300
    glow: '#2DD4BF',
  },
  // Chat: Sky Blue
  Chat: {
    accent: '#0EA5E9', // Sky-500
    gradientFrom: '#0EA5E9',
    gradientTo: '#38BDF8', // Sky-400
    glow: '#7DD3FC',
  },
  // Records: Slate
  Records: {
    accent: '#64748B', // Slate-500
    gradientFrom: '#64748B',
    gradientTo: '#94A3B8', // Slate-400
    glow: '#CBD5E1',
  },
  // Team: Yellow/Amber
  Team: {
    accent: '#EAB308', // Yellow-500
    gradientFrom: '#EAB308',
    gradientTo: '#FDE047', // Yellow-300
    glow: '#FEF08A',
  },
  // Analytics: Purple
  Analytics: {
    accent: '#A855F7', // Purple-500
    gradientFrom: '#A855F7',
    gradientTo: '#D8B4FE', // Purple-300
    glow: '#C084FC',
  },
  // Constellation: Deep Purple/Indigo (Network/Stars theme)
  Constellation: {
    accent: '#7C3AED', // Violet-600
    gradientFrom: '#4C1D95', // Violet-900
    gradientTo: '#6366F1', // Indigo-500
    glow: '#A78BFA', // Violet-400
  },
  // Default fallback
  Settings: {
    accent: '#64748B',
    gradientFrom: '#64748B',
    gradientTo: '#94A3B8',
    glow: '#94A3B8',
  },
  // Suite - keeping somewhat consistent or making unique
  Suite: {
    accent: '#6366F1',
    gradientFrom: '#6366F1',
    gradientTo: '#22D3EE',
    glow: '#818CF8',
  },
  // Fallback for new pages
  LegislatorElections: {
    accent: '#06B6D4', // Cyan-500 (Same as Elections)
    gradientFrom: '#06B6D4',
    gradientTo: '#22D3EE', 
    glow: '#67E8F9',
  },
  'User Management': {
    accent: '#64748B',
    gradientFrom: '#64748B',
    gradientTo: '#94A3B8',
    glow: '#94A3B8',
  },
  'Manager Console': {
    accent: '#EAB308', // Team
    gradientFrom: '#EAB308',
    gradientTo: '#FDE047',
    glow: '#FEF08A',
  }
};

/**
 * Get theme for a specific page
 * Falls back to Settings theme if page not found
 */
export function getPageTheme(pageName: string): PageTheme {
  return PAGE_THEMES[pageName] || PAGE_THEMES.Settings;
}

/**
 * Convert hex color to rgba with opacity
 */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get CSS variables object for a theme
 */
export function getThemeStyles(theme: PageTheme): React.CSSProperties {
  return {
    '--page-accent': theme.accent,
    '--page-gradient-from': theme.gradientFrom,
    '--page-gradient-to': theme.gradientTo,
    '--page-glow': theme.glow,
  } as React.CSSProperties;
}