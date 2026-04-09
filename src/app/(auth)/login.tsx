import { View, Text, Alert, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Screen, Button, Input, Logo, MeshGradient } from "../../components/ui";
import { FadeInUp, ScaleBounce } from "../../components/ui/animated-view";
import { useAuthStore } from "../../stores/auth.store";
import { supabase } from "../../services/supabase";
import { colors } from "../../lib/theme";

/**
 * Ecran de connexion — version premium.
 *
 * MVP : Magic Link (email) + Dev Login.
 * Apple/Google Sign-In ajoutes avant le deploiement App Store.
 *
 * Design :
 * - MeshGradient en fond pour profondeur
 * - Logo SVG (monogramme ST avec gradient)
 * - Wordmark "Smash Talk" en typo XXL
 * - CTA gradient avec glow
 *
 * Flow Magic Link :
 * 1. L'utilisateur entre son email
 * 2. Supabase envoie un lien par email
 * 3. L'utilisateur clique le lien -> session creee automatiquement
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

  // Ecran de confirmation apres envoi
  if (emailSent) {
    return (
      <Screen className="justify-center px-6">
        <MeshGradient intensity="subtle" />
        <View className="items-center" style={{ gap: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.accent.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="mail" size={36} color={colors.accent.base} />
          </View>
          <View className="items-center" style={{ gap: 12 }}>
            <Text
              className="text-text text-center"
              style={{
                fontSize: 32,
                fontWeight: "900",
                letterSpacing: -1,
              }}
            >
              Check tes mails
            </Text>
            <Text
              className="text-text-secondary text-base text-center"
              style={{ lineHeight: 24, maxWidth: 280 }}
            >
              On t'a envoye un lien magique a{"\n"}
              <Text className="text-accent font-semibold">{email}</Text>
              {"\n"}Clique dessus pour te connecter.
            </Text>
          </View>

          <View style={{ width: "100%", gap: 12, marginTop: 24 }}>
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
        </View>
      </Screen>
    );
  }

  return (
    <Screen className="justify-center px-6">
      {/* Background mesh gradient */}
      <MeshGradient intensity="normal" />

      {/* Branding hero */}
      <ScaleBounce delay={0}>
        <View className="items-center" style={{ gap: 20, marginBottom: 56 }}>
          <Logo size="lg" />
          <View className="items-center" style={{ gap: 8 }}>
            <Text
              className="text-text"
              style={{
                fontSize: 44,
                fontWeight: "900",
                letterSpacing: -2,
                lineHeight: 48,
              }}
            >
              Smash Talk
            </Text>
            <Text
              className="text-text-secondary text-center"
              style={{
                fontSize: 16,
                lineHeight: 24,
                letterSpacing: -0.2,
              }}
            >
              Ton groupe. Tes rivaux.{"\n"}Tes legendes.
            </Text>
          </View>
        </View>
      </ScaleBounce>

      {/* Email input */}
      <FadeInUp delay={200}>
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
      </FadeInUp>

      {/* Magic Link CTA */}
      <FadeInUp delay={350}>
        <View style={{ marginTop: 16 }}>
          <Button
            title="Entrer dans l'arene"
            size="lg"
            fullWidth
            disabled={!isValidEmail}
            isLoading={isLoading}
            onPress={handleMagicLink}
          />
        </View>
      </FadeInUp>

      {/* Note Apple/Google */}
      <View className="items-center" style={{ marginTop: 20 }}>
        <Text className="text-text-muted text-xs">
          Apple et Google Sign-In bientot disponibles
        </Text>
      </View>

      {/* Dev only */}
      {__DEV__ ? (
        <View style={{ marginTop: 32 }}>
          <Button
            title="Dev Login (test)"
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
