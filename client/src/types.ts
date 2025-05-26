export type ThemeColors = {
  background: string;
  foreground: string;
  textBase: string;
  textMuted: string;
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  accentHover: string;
  warning: string;
  success: string;
  info: string;
  border: string;
};

export type Theme = {
  light: ThemeColors;
  dark: ThemeColors;
};
