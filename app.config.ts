import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Smash Talk",
  slug: "smash-talk",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  scheme: "smashtalk",
  splash: {
    backgroundColor: "#0A0A0F",
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: "app.smashtalk",
    usesAppleSignIn: true,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0A0A0F",
    },
    package: "app.smashtalk",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-apple-authentication",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
  },
});
