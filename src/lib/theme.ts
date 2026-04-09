/**
 * Design tokens — source de vérité visuelle.
 *
 * Utilisés pour :
 * - styles inline (Avatar dynamic color, gradients, glows)
 * - LinearGradient (CTA, logo, backgrounds)
 * - StatusBar, NavigationBar
 * - react-native-view-shot (templates partage)
 *
 * Les classes Tailwind restent la voie principale pour le layout.
 * Ces tokens sont le fallback programmatique.
 */

export const colors = {
  surface: {
    base: "#0A0A0F",
    card: "#13131D",
    elevated: "#1C1C2B",
    border: "#2A2A3D",
    overlay: "rgba(10, 10, 15, 0.85)",
  },
  // Vert principal — actions, victoires
  accent: {
    base: "#22C55E",
    light: "#4ADE80",
    dark: "#16A34A",
    muted: "rgba(34, 197, 94, 0.12)",
    glow: "rgba(34, 197, 94, 0.35)",
  },
  // Cyan — second pôle du gradient signature
  cyan: {
    base: "#06D6A0",
    light: "#22E5B5",
    dark: "#04A87C",
  },
  // Gradient signature : CTA, logo, accents premium
  gradient: {
    primary: ["#22C55E", "#06D6A0"] as const,
    primaryDark: ["#16A34A", "#04A87C"] as const,
    danger: ["#EF4444", "#F87171"] as const,
    gold: ["#FBBF24", "#F59E0B"] as const,
  },
  danger: {
    base: "#EF4444",
    light: "#F87171",
    dark: "#DC2626",
    muted: "rgba(239, 68, 68, 0.12)",
  },
  warning: {
    base: "#F59E0B",
    light: "#FBBF24",
    dark: "#D97706",
    muted: "rgba(245, 158, 11, 0.12)",
  },
  text: {
    primary: "#F1F1F6",
    secondary: "#9CA3AF",
    muted: "#6B7280",
    inverse: "#0A0A0F",
  },
} as const;

export const spacing = {
  screenX: 16,
  screenTop: 12,
  cardX: 16,
  cardY: 14,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 56,
  "6xl": 72,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    "2xs": 10,
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
    "7xl": 72,
    "8xl": 96,
  },
} as const;

/** Opacite des etats interactifs */
export const opacity = {
  disabled: 0.4,
  pressed: 0.85,
} as const;

/** Glows reutilisables (boxShadow iOS) */
export const glows = {
  accent: {
    shadowColor: colors.accent.base,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cyan: {
    shadowColor: colors.cyan.base,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
} as const;
