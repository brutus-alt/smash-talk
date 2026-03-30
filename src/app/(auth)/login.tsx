import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { Screen, Button } from "../../components/ui";
import { useAuthStore } from "../../stores/auth.store";

/**
 * Écran de connexion.
 * Apple Sign-In + Google Sign-In uniquement (Audit v2 §10.2).
 * Bouton Dev Login en développement pour tester la navigation.
 */
export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const handleDevLogin = () => {
    // Simulation de session pour le développement
    setSession({
      access_token: "dev-token",
      refresh_token: "dev-refresh",
      expires_in: 3600,
      expires_at: Date.now() / 1000 + 3600,
      token_type: "bearer",
      user: {
        id: "dev-user-001",
        aud: "authenticated",
        role: "authenticated",
        email: "dev@smashtalk.app",
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      },
    } as never);
    router.replace("/(tabs)/home");
  };

  return (
    <Screen className="justify-center gap-6 px-6">
      {/* Branding */}
      <View className="items-center gap-3 mb-16">
        <Text className="text-5xl">🏓</Text>
        <Text className="text-text text-4xl font-bold tracking-tight">
          Smash Talk
        </Text>
        <Text className="text-text-secondary text-base text-center leading-6">
          Chaque match compte.{"\n"}Chaque rivalité vit.
        </Text>
      </View>

      {/* Auth buttons */}
      <View className="gap-3">
        <Button
          title="Continuer avec Apple"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => {
            // TODO: Apple Sign-In via Supabase
          }}
        />
        <Button
          title="Continuer avec Google"
          variant="secondary"
          size="lg"
          fullWidth
          onPress={() => {
            // TODO: Google Sign-In via Supabase
          }}
        />
      </View>

      {/* Dev only */}
      {__DEV__ ? (
        <View className="mt-8">
          <Button
            title="🛠 Dev Login"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleDevLogin}
          />
        </View>
      ) : null}
    </Screen>
  );
}
