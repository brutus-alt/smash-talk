import { View, Text, Pressable, ScrollView, Alert, Share } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { ModalHeader, Button, Input, Card, Pill } from "../../components/ui";
import { FadeInUp, ScaleBounce } from "../../components/ui/animated-view";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useCreateLeague } from "../../hooks/use-leagues";
import { hapticSuccess, hapticError } from "../../lib/haptics";

/**
 * Modale de création de ligue — branchée sur Supabase.
 */

const EMOJI_OPTIONS = ["⚡", "🔥", "🏆", "💀", "🎯", "🦁", "🐉", "🚀", "⭐", "🎾", "🏓", "👑"];

export default function CreateLeagueScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const setActiveLeague = useLeagueStore((s) => s.setActiveLeague);
  const createLeague = useCreateLeague();

  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("⚡");
  const [createdInviteCode, setCreatedInviteCode] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState("");

  const canCreate = name.trim().length >= 3;

  const handleCreate = async () => {
    if (!canCreate || !userId) return;

    try {
      const league = await createLeague.mutateAsync({
        name: name.trim(),
        emoji,
        userId,
      });

      hapticSuccess();
      setActiveLeague(league.id);
      setCreatedInviteCode(league.invite_code);
      setCreatedName(league.name);
    } catch (err) {
      hapticError();
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    }
  };

  const handleShareCode = async () => {
    if (!createdInviteCode) return;
    await Share.share({
      message: `🏓 Rejoins ma ligue "${createdName}" sur Smash Talk !\nCode d'invitation : ${createdInviteCode}`,
    });
  };

  // Écran de succès avec le code d'invitation
  if (createdInviteCode) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ModalHeader title="Ligue créée" onClose={() => router.back()} />

        <View className="flex-1 justify-center items-center gap-6 px-6">
          <ScaleBounce delay={0}>
            <Text className="text-5xl">{emoji}</Text>
          </ScaleBounce>

          <FadeInUp delay={200}>
            <View className="items-center gap-2">
              <Text className="text-text text-2xl font-bold text-center">
                {createdName} est prête !
              </Text>
              <Text className="text-text-secondary text-base text-center">
                Partage ce code à tes potes pour qu'ils rejoignent l'arène.
              </Text>
            </View>
          </FadeInUp>

          <FadeInUp delay={350}>
            <View className="bg-surface-elevated rounded-2xl px-8 py-5 items-center">
              <Text className="text-text-muted text-xs mb-2">CODE D'INVITATION</Text>
              <Text
                className="text-accent text-3xl font-black tracking-widest"
                selectable
              >
                {createdInviteCode}
              </Text>
            </View>
          </FadeInUp>
        </View>

        <View className="px-6 mb-8 gap-3">
          <Button
            title="Envoyer aux potes 📤"
            size="lg"
            fullWidth
            onPress={handleShareCode}
          />
          <Button
            title="C'est bon, allons-y"
            variant="ghost"
            size="md"
            fullWidth
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader title="Fonder ta ligue" onClose={() => router.back()} />

      <ScrollView className="flex-1 px-6" contentContainerClassName="gap-6 pb-8">
        <FadeInUp delay={0}>
          <Input
            label="Le nom de guerre"
            placeholder="Ex : La Ligue du Jeudi, Les Inarrêtables..."
            value={name}
            onChangeText={setName}
            maxLength={30}
            showCount
            autoFocus
          />
        </FadeInUp>

        <FadeInUp delay={100}>
          <View className="gap-2">
            <Text className="text-text-secondary text-sm font-medium">Emblème</Text>
          <View className="flex-row flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEmoji(e)}
                className={`
                  w-12 h-12 rounded-xl items-center justify-center
                  ${emoji === e ? "bg-accent-muted border border-accent" : "bg-surface-elevated"}
                `}
              >
                <Text className="text-2xl">{e}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        </FadeInUp>

        {canCreate ? (
          <FadeInUp delay={200}>
            <Card variant="elevated">
              <Text className="text-text-muted text-xs mb-3">Ça donne ça 👇</Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-3xl">{emoji}</Text>
                <View>
                  <Text className="text-text text-lg font-bold">{name}</Text>
                  <Text className="text-text-muted text-sm">1 joueur · 0 matchs</Text>
                </View>
              </View>
            </Card>
          </FadeInUp>
        ) : null}
      </ScrollView>

      <View className="px-6 mb-8">
        <Button
          title="Lancer la ligue 🚀"
          size="lg"
          fullWidth
          disabled={!canCreate}
          isLoading={createLeague.isPending}
          onPress={handleCreate}
        />
      </View>
    </SafeAreaView>
  );
}
