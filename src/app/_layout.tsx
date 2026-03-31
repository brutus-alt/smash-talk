import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator } from "react-native";

import { queryClient } from "../lib/query-client";
import { supabase } from "../services/supabase";
import { useAuthStore } from "../stores/auth.store";
import { analytics } from "../lib/analytics";
import { useRegisterPushToken, useNotificationListener } from "../hooks/use-notifications";

import "../../global.css";

/**
 * Root layout — point d'entrée de l'app.
 *
 * Responsabilités :
 * 1. Monter les providers globaux (QueryClient, GestureHandler)
 * 2. Écouter les changements de session Supabase
 * 3. Rediriger vers (auth) ou (tabs) selon l'état de connexion
 */

function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { session, isLoading, user } = useAuthStore();

  // Enregistrer le push token quand l'utilisateur est connecté
  useRegisterPushToken();

  // Écouter les notifications entrantes
  useNotificationListener();

  // Identifier l'utilisateur dans PostHog
  useEffect(() => {
    if (user) {
      analytics.identify(user.id, { email: user.email ?? "" });
      analytics.track("app_opened");
    }
  }, [user]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // Pas de session → rediriger vers login
      router.replace("/(auth)/login");
    } else if (session && inAuthGroup) {
      // Session active + encore sur auth → rediriger vers tabs
      router.replace("/(tabs)/home");
    }
  }, [session, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator color="#22C55E" size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    // Récupérer la session existante au lancement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Écouter les changements de session (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0A0A0F" },
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="match/add"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="match/success"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="league/create"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="league/join"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="player/[id]"
              options={{
                animation: "slide_from_right",
              }}
            />
          </Stack>
        </AuthGate>
        <StatusBar style="light" />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
