/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      /**
       * ─── COULEURS ───
       * Palette restreinte (Arbitrages §6.3).
       * Chaque couleur a un rôle unique. Pas de couleur sans usage.
       */
      colors: {
        surface: {
          DEFAULT: "#0A0A0F",
          card: "#13131D",
          elevated: "#1C1C2B",
          border: "#2A2A3D",
        },
        accent: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
          dark: "#16A34A",
          muted: "rgba(34, 197, 94, 0.12)",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#F87171",
          dark: "#DC2626",
          muted: "rgba(239, 68, 68, 0.12)",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
          dark: "#D97706",
          muted: "rgba(245, 158, 11, 0.12)",
        },
        text: {
          DEFAULT: "#F1F1F6",
          secondary: "#9CA3AF",
          muted: "#6B7280",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
        full: "9999px",
      },
      fontFamily: {
        heading: ["System"],
        body: ["System"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "26px" }],
        xl: ["20px", { lineHeight: "28px" }],
        "2xl": ["24px", { lineHeight: "32px" }],
        "3xl": ["30px", { lineHeight: "36px" }],
        "4xl": ["36px", { lineHeight: "40px" }],
        "5xl": ["48px", { lineHeight: "52px" }],
      },
    },
  },
  plugins: [],
};
