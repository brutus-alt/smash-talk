import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Screen, Button, Input, Avatar } from "../../components/ui";
import { getInitials, getRandomPlayerColor } from "../../lib/utils";

/**
 * Onboarding — 3 écrans max (Arbitrages §2.1).
 * Étape 1 : pseudo + aperçu avatar.
 * Le branchement Supabase viendra au Sprint 1.
 */
export default function OnboardingScreen() {
  const router = useRouter();
  const [pseudo, setPseudo] = useState("");
  const [color] = useState(getRandomPlayerColor);

  const initials = pseudo.length >= 2 ? getInitials(pseudo) : "??";

  const handleContinue = () => {
    // TODO: Créer le profil dans Supabase
    router.replace("/(tabs)/home");
  };

  return (
    <Screen className="px-6 pt-12">
      <View className="gap-2 mb-8">
        <Text className="text-text text-2xl font-bold">
          Comment on t'appelle ?
        </Text>
        <Text className="text-text-secondary text-base">
          Choisis un pseudo que tes potes reconnaîtront.
        </Text>
      </View>

      {/* Avatar preview */}
      <View className="items-center gap-2 mb-8">
        <Avatar initials={initials} color={color} size="xl" />
        <Text className="text-text-muted text-sm">
          Ton avatar dans les classements
        </Text>
      </View>

      {/* Pseudo input */}
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

      {/* CTA */}
      <View className="mt-auto mb-8">
        <Button
          title="C'est parti"
          size="lg"
          fullWidth
          disabled={pseudo.trim().length < 3}
          onPress={handleContinue}
        />
      </View>
    </Screen>
  );
}
