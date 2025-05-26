import { create } from 'zustand';
import type { Theme } from '../types';

type ThemeStore = {
  theme: Theme;
  darkMode: boolean;
  updateTheme: (theme: Theme) => void;
  updateDarkMode: (darkMode: boolean) => void;
  applyTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: {
    light: {
      background: '#ffffff',
      foreground: '#000000',
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
    dark: {
      background: '#1f2937',
      foreground: '#f9fafb',
      textBase: '#e5e7eb',
      textMuted: '#9ca3af',
      textPrimary: '#ffffff',
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      secondary: '#9ca3af',
      accent: '#f59e0b',
      accentHover: '#d97706',
      warning: '#f87171',
      success: '#34d399',
      info: '#60a5fa',
      border: '#374151',
    },
  },
  darkMode: false,
  updateTheme: (newTheme) => {
    set((state) => ({
      theme: { ...state.theme, ...newTheme },
    }));
    get().applyTheme();
  },
  updateDarkMode: (darkMode) => {
    set({ darkMode });
    const root = document.documentElement;
    root.classList.toggle('dark', darkMode);
  },
  applyTheme: () => {
    const theme = get().theme;
    const root = document.documentElement;
    const currentTheme = get().darkMode ? theme.dark : theme.light;
    Object.entries(currentTheme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  },
}));
