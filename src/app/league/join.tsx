import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { ModalHeader, Button, Input, Card } from "../../components/ui";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useJoinLeague, useLookupLeague } from "../../hooks/use-leagues";
import type { LeagueRow } from "../../lib/database.types";

/**
 * Rejoindre une ligue — branchée sur Supabase.
 * Recherche la ligue par code, affiche un aperçu, puis rejoint.
 */
export default function JoinLeagueScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const setActiveLeague = useLeagueStore((s) => s.setActiveLeague);
  const joinLeague = useJoinLeague();
  const lookupLeague = useLookupLeague();

  const [code, setCode] = useState("");
  const [foundLeague, setFoundLeague] = useState<LeagueRow | null>(null);

  const isCodeComplete = code.trim().length === 8;

  const handleLookup = async () => {
    if (!isCodeComplete) return;

    try {
      const league = await lookupLeague.mutateAsync(code.trim());
      if (league) {
        setFoundLeague(league);
      } else {
        Alert.alert("Introuvable", "Aucune ligue trouvée avec ce code.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    }
  };

  const handleJoin = async () => {
    if (!foundLeague || !userId) return;

    try {
      await joinLeague.mutateAsync({
        inviteCode: code.trim(),
        userId,
      });

      setActiveLeague(foundLeague.id);
      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader title="Rejoindre le combat" onClose={() => router.back()} />

      <View className="flex-1 px-6 gap-6 pt-4">
        <Text className="text-text-secondary text-base">
          Ton pote t'a filé un code ? Colle-le ici et entre dans l'arène.
        </Text>

        <Input
          label="Code secret"
          placeholder="Ex : AB3K7YXZ"
          value={code}
          onChangeText={(text) => {
            setCode(text.toUpperCase());
            setFoundLeague(null); // Reset si on change le code
          }}
          maxLength={8}
          showCount
          autoCapitalize="characters"
          autoCorrect={false}
          autoFocus
        />

        {/* Bouton rechercher si pas encore trouvé */}
        {isCodeComplete && !foundLeague ? (
          <Button
            title="Trouver la ligue"
            variant="secondary"
            size="md"
            fullWidth
            isLoading={lookupLeague.isPending}
            onPress={handleLookup}
          />
        ) : null}

        {/* Aperçu de la ligue trouvée */}
        {foundLeague ? (
          <Card variant="elevated">
            <Text className="text-text-muted text-xs mb-2">Trouvée 🎯</Text>
            <View className="flex-row items-center gap-3">
              <Text className="text-3xl">{foundLeague.emoji}</Text>
              <View>
                <Text className="text-text text-lg font-bold">{foundLeague.name}</Text>
              </View>
            </View>
          </Card>
        ) : null}

        <View className="mt-auto mb-8">
          <Button
            title="Entrer dans la ligue 🔥"
            size="lg"
            fullWidth
            disabled={!foundLeague}
            isLoading={joinLeague.isPending}
            onPress={handleJoin}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
