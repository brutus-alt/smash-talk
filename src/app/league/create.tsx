import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { ModalHeader, Button, Input, Card, Pill } from "../../components/ui";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useCreateLeague } from "../../hooks/use-leagues";

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

  const canCreate = name.trim().length >= 3;

  const handleCreate = async () => {
    if (!canCreate || !userId) return;

    try {
      const league = await createLeague.mutateAsync({
        name: name.trim(),
        emoji,
        userId,
      });

      setActiveLeague(league.id);
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader title="Créer une ligue" onClose={() => router.back()} />

      <ScrollView className="flex-1 px-6" contentContainerClassName="gap-6 pb-8">
        <Input
          label="Nom de la ligue"
          placeholder="Ex : La Ligue du Jeudi"
          value={name}
          onChangeText={setName}
          maxLength={30}
          showCount
          autoFocus
        />

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

        {canCreate ? (
          <Card variant="elevated">
            <Text className="text-text-muted text-xs mb-3">Aperçu</Text>
            <View className="flex-row items-center gap-3">
              <Text className="text-3xl">{emoji}</Text>
              <View>
                <Text className="text-text text-lg font-bold">{name}</Text>
                <Text className="text-text-muted text-sm">1 joueur · 0 matchs</Text>
              </View>
            </View>
          </Card>
        ) : null}
      </ScrollView>

      <View className="px-6 mb-8">
        <Button
          title="Créer ma ligue"
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
