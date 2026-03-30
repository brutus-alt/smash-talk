import { Stack } from "expo-router";

/**
 * Layout du groupe auth — Stack simple.
 * Contient login et onboarding.
 * Pas de header visible (design dark immersif).
 */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0A0A0F" },
        animation: "slide_from_bottom",
      }}
    />
  );
}
