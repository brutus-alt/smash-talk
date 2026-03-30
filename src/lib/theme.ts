/**
 * Design tokens en TypeScript.
 *
 * Source de vérité pour les valeurs utilisées en dehors de NativeWind :
 * - props `style` inline (backgroundColor dynamique d'un avatar)
 * - Reanimated (couleurs d'animation)
 * - react-native-view-shot (templates partage)
 * - StatusBar, NavigationBar
 *
 * Les classes Tailwind sont la voie principale.
 * Ces tokens sont le fallback programmatique.
 */

export const colors = {
  surface: {
    base: "#0A0A0F",
    card: "#13131D",
    elevated: "#1C1C2B",
    border: "#2A2A3D",
  },
  accent: {
    base: "#22C55E",
    light: "#4ADE80",
    dark: "#16A34A",
    muted: "rgba(34, 197, 94, 0.12)",
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
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
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
  },
} as const;

/** Opacité des états interactifs */
export const opacity = {
  disabled: 0.4,
  pressed: 0.7,
} as const;
