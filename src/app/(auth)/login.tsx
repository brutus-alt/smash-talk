import { View, Text, Alert, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Screen, Button, Input } from "../../components/ui";
import { useAuthStore } from "../../stores/auth.store";
import { supabase } from "../../services/supabase";

/**
 * Écran de connexion.
 *
 * MVP : Magic Link (email) + Dev Login.
 * Apple/Google Sign-In ajoutés avant le déploiement App Store.
 *
 * Flow Magic Link :
 * 1. L'utilisateur entre son email
 * 2. Supabase envoie un lien par email
 * 3. L'utilisateur clique le lien → session créée automatiquement
 *    via le listener onAuthStateChange dans _layout.tsx
 */
export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleMagicLink = async () => {
    if (!isValidEmail) return;

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setEmailSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDevLogin = () => {
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

  // Écran de confirmation après envoi
  if (emailSent) {
    return (
      <Screen className="justify-center gap-6 px-6">
        <View className="items-center gap-4">
          <Text className="text-5xl">📬</Text>
          <Text className="text-text text-2xl font-bold text-center">
            Check tes mails
          </Text>
          <Text className="text-text-secondary text-base text-center leading-6 max-w-xs">
            On t'a envoyé un lien magique à{"\n"}
            <Text className="text-accent font-semibold">{email}</Text>
            {"\n"}Clique dessus pour te connecter.
          </Text>
        </View>

        <View className="gap-3 mt-8">
          <Button
            title="Renvoyer le lien"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => {
              setEmailSent(false);
              handleMagicLink();
            }}
          />
          <Button
            title="Changer d'email"
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => {
              setEmailSent(false);
              setEmail("");
            }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="justify-center gap-6 px-6">
      {/* Branding */}
      <View className="items-center gap-3 mb-12">
        <Text className="text-5xl">🏓</Text>
        <Text className="text-text text-4xl font-bold tracking-tight">
          Smash Talk
        </Text>
        <Text className="text-text-secondary text-base text-center leading-6">
          Ton groupe. Tes rivaux.{"\n"}Tes légendes.
        </Text>
      </View>

      {/* Email input */}
      <Input
        label="Ton email"
        placeholder="nico@exemple.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
      />

      {/* Magic Link button */}
      <Button
        title="Entrer dans l'arène"
        size="lg"
        fullWidth
        disabled={!isValidEmail}
        isLoading={isLoading}
        onPress={handleMagicLink}
      />

      {/* Futur : Apple / Google */}
      <View className="items-center mt-4">
        <Text className="text-text-muted text-xs">
          Apple et Google Sign-In bientôt disponibles
        </Text>
      </View>

      {/* Dev only */}
      {__DEV__ ? (
        <View className="mt-6">
          <Button
            title="🛠 Dev Login (test)"
            variant="ghost"
            size="md"
            fullWidth
            onPress={handleDevLogin}
          />
        </View>
      ) : null}
    </Screen>
  );
}
