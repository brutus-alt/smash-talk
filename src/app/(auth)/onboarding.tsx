import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Screen, Button, Input, Avatar } from "../../components/ui";
import { FadeInUp, ScaleBounce } from "../../components/ui/animated-view";
import { useAuthStore } from "../../stores/auth.store";
import { profilesService } from "../../services/profiles.service";
import { getInitials, getRandomPlayerColor } from "../../lib/utils";

/**
 * Onboarding — création du profil joueur (Arbitrages §2.1).
 *
 * Affiché après la première connexion si le profil n'existe pas encore.
 * Crée le profil dans Supabase (table profiles).
 *
 * Le trigger SQL crée un profil minimal à l'inscription,
 * mais l'onboarding permet de choisir un vrai pseudo.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setIsOnboarded = useAuthStore((s) => s.setIsOnboarded);

  const [pseudo, setPseudo] = useState("");
  const [color] = useState(getRandomPlayerColor);
  const [isLoading, setIsLoading] = useState(false);

  const initials = pseudo.length >= 2 ? getInitials(pseudo) : "??";
  const canContinue = pseudo.trim().length >= 3;

  const handleContinue = async () => {
    if (!canContinue || !user) return;

    setIsLoading(true);

    try {
      const trimmedPseudo = pseudo.trim();
      const playerInitials = getInitials(trimmedPseudo);

      await profilesService.update(user.id, {
        pseudo: trimmedPseudo,
        initials: playerInitials,
        color,
      });

      setIsOnboarded(true);
      router.replace("/(tabs)/home");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen className="px-6 pt-12">
      <FadeInUp delay={0}>
        <View className="gap-2 mb-8">
          <Text className="text-text text-2xl font-bold">
            Qui entre dans l'arène ?
          </Text>
          <Text className="text-text-secondary text-base">
            Choisis le blaze que tes rivaux vont redouter.
          </Text>
        </View>
      </FadeInUp>

      {/* Avatar preview */}
      <ScaleBounce delay={200}>
        <View className="items-center gap-2 mb-8">
          <Avatar initials={initials} color={color} size="xl" />
          <Text className="text-text-muted text-sm">
            Ta tête dans le classement
          </Text>
        </View>
      </ScaleBounce>

      {/* Pseudo input */}
      <FadeInUp delay={350}>
        <Input
          label="Pseudo"
          placeholder="Ex : Nico, Thomas, MarcLeRoi..."
          value={pseudo}
          onChangeText={setPseudo}
          maxLength={20}
          showCount
          autoCapitalize="none"
          autoCorrect={false}
        />
      </FadeInUp>

      {/* CTA */}
      <View className="mt-auto mb-8">
        <Button
          title="C'est parti"
          size="lg"
          fullWidth
          disabled={!canContinue}
          isLoading={isLoading}
          onPress={handleContinue}
        />
      </View>
    </Screen>
  );
}
