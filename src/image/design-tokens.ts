/**
 * Gemini CLI Wrapped Design Tokens
 * 
 * Based on Gemini CLI Default Dark Theme
 */

// Gemini CLI Default Dark Theme Colors
// Background: '#1E1E2E'
// Foreground: '' (defaults to white/light gray in terminal)
// LightBlue: '#ADD8E6'
// AccentBlue: '#89B4FA'
// AccentPurple: '#CBA6F7'
// AccentCyan: '#89DCEB'
// AccentGreen: '#A6E3A1'
// AccentYellow: '#F9E2AF'
// AccentRed: '#F38BA8'
// DiffAdded: '#28350B'
// DiffRemoved: '#430000'
// Comment: '#6C7086'
// Gray: '#6C7086'
// DarkGray: interpolated '#6C7086' and '#1E1E2E' -> approx #45475A
// GradientColors: ['#4796E4', '#847ACE', '#C3677F']

export const colors = {
  // Backgrounds
  background: "#1E1E2E", // Default Dark Background
  surface: "#262639", // Slightly lighter than background
  surfaceHover: "#313244", 
  surfaceBorder: "#45475A", // DarkGray approx

  // Text
  text: {
    primary: "#CDD6F4", // Foreground (approx from Catppuccin Text) or #FFFFFF
    secondary: "#A6ADC8", // Subtext
    tertiary: "#6C7086", // Overlay/Gray/Comment
    muted: "#585B70", // Surface2
    disabled: "#45475A", // Surface1
  },

  // Accent colors
  accent: {
    primary: "#CBA6F7", // AccentPurple
    primaryHover: "#74C7EC", // Sapphire? or just lighter blue
    secondary: "#89B4FA", // AccentBlue
    tertiary: "#F9E2AF", // AccentYellow
    cyan: "#89DCEB", // AccentCyan
    green: "#A6E3A1", // AccentGreen
    red: "#F38BA8", // AccentRed
  },

  // Semantic colors
  semantic: {
    success: "#A6E3A1", // AccentGreen
    warning: "#F9E2AF", // AccentYellow
    error: "#F38BA8", // AccentRed
    info: "#89B4FA", // AccentBlue
  },

  // Heatmap colors - Lightest to Darkest progression
  heatmap: {
    empty: "#313244", // Base empty
    level1: "#45475A", // Subtle increase
    level2: "#585B70", // Medium low
    level3: "#B4BEFE", // Lavender (lightest color)
    level4: "#CBA6F7", // Accent Purple
    level5: "#89B4FA", // Accent Blue
    level6: "#7287FD", // Deep Blue (darkest/most intense)
  },
} as const;

export const typography = {
  fontFamily: {
    mono: "IBM Plex Mono",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  size: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 20,
    lg: 24,
    xl: 32,
    "2xl": 40,
    "3xl": 48,
    "4xl": 56,
    "5xl": 64,
    "6xl": 72,
    "7xl": 80,
  },
  lineHeight: {
    none: 1,
    tight: 1.15,
    snug: 1.25,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.75,
  },
  letterSpacing: {
    tighter: -2,
    tight: -1,
    normal: 0,
    wide: 1,
    wider: 2,
    widest: 4,
  },
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const layout = {
  canvas: {
    width: 1600,
    height: 1600,
  },
  padding: {
    horizontal: 64,
    top: 64,
    bottom: 32,
  },
  content: {
    width: 1372,
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
} as const;

export const components = {
  statBox: {
    background: colors.surface,
    borderRadius: layout.radius.lg,
    padding: "24px 32px", // Fixed string padding for Satori compatibility
    gap: 8,
  },
  card: {
    background: colors.surface,
    borderRadius: layout.radius.lg,
    borderColor: colors.surfaceBorder,
    padding: "24px", // Fixed string padding for Satori compatibility
  },
  sectionHeader: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase" as const,
  },
  heatmapCell: {
    size: 23.4,
    gap: 3,
    borderRadius: layout.radius.sm,
  },
  legend: {
    fontSize: typography.size.xs,
    color: colors.text.muted,
    cellSize: 14,
    gap: 6,
  },
  ranking: {
    numberWidth: 48,
    numberSize: typography.size.xl,
    itemSize: typography.size.lg,
    gap: spacing[4],
    logoSize: 32,
    logoBorderRadius: layout.radius.md,
  },
} as const;

export const HEATMAP_COLORS = {
  0: colors.heatmap.empty,
  1: colors.heatmap.level1,
  2: colors.heatmap.level2,
  3: colors.heatmap.level3,
  4: colors.heatmap.level4,
  5: colors.heatmap.level5,
  6: colors.heatmap.level6,
} as const;

export function space(key: keyof typeof spacing): number {
  return spacing[key];
}

export function fontSize(key: keyof typeof typography.size): number {
  return typography.size[key];
}

export function radius(key: keyof typeof layout.radius): number {
  return layout.radius[key];
}