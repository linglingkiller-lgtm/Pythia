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
  Dashboard: {
    accent: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#22D3EE',
    glow: '#A78BFA',
  },
  'War Room': {
    accent: '#FF3B3B',
    gradientFrom: '#FF3B3B',
    gradientTo: '#FFD1D1',
    glow: '#FF3B3B',
  },
  Clients: {
    accent: '#22C55E',
    gradientFrom: '#22C55E',
    gradientTo: '#00E5FF',
    glow: '#22C55E',
  },
  Bills: {
    accent: '#3B82F6',
    gradientFrom: '#3B82F6',
    gradientTo: '#60A5FA',
    glow: '#3B82F6',
  },
  Issues: {
    accent: '#F97316',
    gradientFrom: '#F97316',
    gradientTo: '#FDBA74',
    glow: '#FB923C',
  },
  Legislators: {
    accent: '#B91C1C',
    gradientFrom: '#B91C1C',
    gradientTo: '#93C5FD',
    glow: '#FCA5A5',
  },
  Projects: {
    accent: '#EC4899',
    gradientFrom: '#EC4899',
    gradientTo: '#F97316',
    glow: '#F472B6',
  },
  Calendar: {
    accent: '#06B6D4',
    gradientFrom: '#06B6D4',
    gradientTo: '#A7F3D0',
    glow: '#22D3EE',
  },
  Chat: {
    accent: '#14B8A6',
    gradientFrom: '#14B8A6',
    gradientTo: '#5EEAD4',
    glow: '#2DD4BF',
  },
  Records: {
    accent: '#475569',
    gradientFrom: '#475569',
    gradientTo: '#93C5FD',
    glow: '#94A3B8',
  },
  Team: {
    accent: '#E11D48',
    gradientFrom: '#E11D48',
    gradientTo: '#A855F7',
    glow: '#FB7185',
  },
  Analytics: {
    accent: '#A3E635',
    gradientFrom: '#A3E635',
    gradientTo: '#22D3EE',
    glow: '#A3E635',
  },
  // Default fallback
  Settings: {
    accent: '#64748B',
    gradientFrom: '#64748B',
    gradientTo: '#94A3B8',
    glow: '#94A3B8',
  },
  Suite: {
    accent: '#8B5CF6',
    gradientFrom: '#8B5CF6',
    gradientTo: '#22D3EE',
    glow: '#A78BFA',
  },
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