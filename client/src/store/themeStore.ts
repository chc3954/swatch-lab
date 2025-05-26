import { create } from 'zustand';
import type { ThemeColors } from '../types';

type ThemeStore = {
  theme: ThemeColors;
  updateTheme: (theme: ThemeColors) => void;
  applyTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: {
    background: '#ffffff',
    foreground: '#f1f1f1',
    textBase: '#1a1a1a',
    textMuted: '#6b7280',
    textPrimary: '#ffffff',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    secondary: '#64748b',
    accent: '#f59e0b',
    accentHover: '#d97706',
    warning: '#f87171',
    success: '#34d399',
    info: '#60a5fa',
    border: '#e5e7eb',
  },
  darkMode: false,
  updateTheme: (newTheme) => {
    set((state) => ({
      theme: { ...state.theme, ...newTheme },
    }));
    get().applyTheme();
  },
  applyTheme: () => {
    const theme = get().theme;
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  },
}));
