import { Theme } from '@/types';

export const THEMES: Theme[] = [
  {
    id: 'trust',
    name: 'Trust',
    colors: {
      primary: '#1B3A5C',
      onPrimary: '#FFFFFF',
      secondary: '#2D5F8A',
      onSecondary: '#FFFFFF',
      background: '#F7F8FA',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      accent: '#0EA5E9',
      success: '#10B981',
      warning: '#B45309',
      danger: '#EF4444',
      outline: '#E2E8F0',
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    colors: {
      primary: '#60A5FA',
      onPrimary: '#0F172A',
      secondary: '#3B82F6',
      onSecondary: '#FFFFFF',
      background: '#0F172A',
      surface: '#1E293B',
      textPrimary: '#F1F5F9',
      textSecondary: '#94A3B8',
      accent: '#38BDF8',
      success: '#34D399',
      warning: '#D97706',
      danger: '#F87171',
      outline: '#334155',
    },
  },
];

export const DEFAULT_THEME_ID = 'trust';

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}
