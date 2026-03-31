import { View, Text } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "../../components/ui";
import { ShareMatchCard } from "../../components/share-match-card";
import { useShare } from "../../hooks/use-share";
import { formatScore } from "../../lib/utils";

/**
 * Écran de succès post-match.
 * Affiché après la validation d'un match.
 * Propose le partage du résultat (template match).
 *
 * Les données du match sont passées via les search params
 * pour éviter un état global supplémentaire.
 */
export default function MatchSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    teamANames: string;
    teamBNames: string;
    teamAInitials: string;
    teamBInitials: string;
    teamAColors: string;
    teamBColors: string;
    score: string;
    winner: string;
    date: string;
  }>();

  const { shareRef, share, isCapturing } = useShare();

  // Reconstruire les données depuis les params
  const teamANames = (params.teamANames ?? "? + ?").split(",");
  const teamBNames = (params.teamBNames ?? "? + ?").split(",");
  const teamAInitials = (params.teamAInitials ?? "??,??").split(",");
  const teamBInitials = (params.teamBInitials ?? "??,??").split(",");
  const teamAColors = (params.teamAColors ?? "#6B7280,#6B7280").split(",");
  const teamBColors = (params.teamBColors ?? "#6B7280,#6B7280").split(",");

  const teamA: [{ pseudo: string; initials: string; color: string }, { pseudo: string; initials: string; color: string }] = [
    { pseudo: teamANames[0] ?? "?", initials: teamAInitials[0] ?? "??", color: teamAColors[0] ?? "#6B7280" },
    { pseudo: teamANames[1] ?? "?", initials: teamAInitials[1] ?? "??", color: teamAColors[1] ?? "#6B7280" },
  ];
  const teamB: [{ pseudo: string; initials: string; color: string }, { pseudo: string; initials: string; color: string }] = [
    { pseudo: teamBNames[0] ?? "?", initials: teamBInitials[0] ?? "??", color: teamBColors[0] ?? "#6B7280" },
    { pseudo: teamBNames[1] ?? "?", initials: teamBInitials[1] ?? "??", color: teamBColors[1] ?? "#6B7280" },
  ];

  const winner = (params.winner ?? "a") as "a" | "b";
  const score = params.score ?? "0-0";
  const date = params.date ?? new Date().toISOString().split("T")[0]!;

  const winnerNames = winner === "a"
    ? `${teamA[0].pseudo} + ${teamA[1].pseudo}`
    : `${teamB[0].pseudo} + ${teamB[1].pseudo}`;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Celebration */}
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <Text className="text-5xl">🎉</Text>
        <Text className="text-text text-2xl font-bold text-center">
          Match enregistré !
        </Text>
        <Text className="text-text-secondary text-base text-center">
          {winnerNames} remporte le match {score}
        </Text>
      </View>

      {/* Share card - rendu hors écran pour capture */}
      <View style={{ position: "absolute", left: -9999 }}>
        <ShareMatchCard
          ref={shareRef}
          teamA={teamA}
          teamB={teamB}
          score={score}
          winner={winner}
          date={date}
        />
      </View>

      {/* Actions */}
      <View className="px-6 mb-8 gap-3">
        <Button
          title="Partager le résultat 📤"
          size="lg"
          fullWidth
          isLoading={isCapturing}
          onPress={() =>
            share(`🏓 ${winnerNames} gagne ${score} sur Smash Talk !`)
          }
        />
        <Button
          title="Retour"
          variant="ghost"
          size="md"
          fullWidth
          onPress={() => router.dismissAll()}
        />
      </View>
    </SafeAreaView>
  );
}
