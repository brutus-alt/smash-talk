import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useAuthStore } from "../stores/auth.store";
import { colors } from "../lib/theme";

/**
 * Route racine — redirige vers (auth) ou (tabs) selon la session.
 *
 * Cette page evite le bug "Unmatched Route" qui apparaissait au cold boot
 * quand expo-router ne savait pas quelle route servir par defaut.
 *
 * Affiche un loader puis redirige immediatement.
 */
export default function IndexScreen() {
  const router = useRouter();
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace("/(tabs)/home");
    } else {
      router.replace("/(auth)/login");
    }
  }, [session, isLoading]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface.base,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color={colors.accent.base} size="large" />
    </View>
  );
}
