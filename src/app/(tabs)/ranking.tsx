import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

import { Screen, SegmentedControl, SectionHeader, EmptyState } from "../../components/ui";
import { RankingRow } from "../../components/ranking-row";
import { RANKINGS, getPlayer } from "../../lib/mock-data";

/**
 * Classement — Tab 2.
 * Classement individuel complet (8 joueurs).
 * Segmented control pour basculer individuel/paire (paire = P1, mocké vide).
 */

type RankingView = "individual" | "pairs";

const SEGMENTS = [
  { value: "individual" as const, label: "Individuel" },
  { value: "pairs" as const, label: "Par paire" },
] as const;

export default function RankingScreen() {
  const router = useRouter();
  const [view, setView] = useState<RankingView>("individual");

  return (
    <Screen mode="scroll">
      <SectionHeader title="Classement" subtitle="La Ligue du Jeudi" />

      <SegmentedControl segments={SEGMENTS} value={view} onChange={setView} />

      {view === "individual" ? (
        <View className="bg-surface-card rounded-xl overflow-hidden">
          {RANKINGS.map((r) => {
            const p = getPlayer(r.playerId);
            return (
              <RankingRow
                key={r.playerId}
                rank={r.rank}
                pseudo={p.pseudo}
                initials={p.initials}
                color={p.color}
                matches={r.matches}
                wins={r.wins}
                losses={r.losses}
                winRate={r.winRate}
                streak={r.streak}
                streakType={r.streakType}
                movement={r.movement}
                onPress={() => router.push(`/player/${r.playerId}`)}
              />
            );
          })}
        </View>
      ) : (
        <EmptyState
          emoji="🤝"
          title="Par paire"
          description="Le classement par paire arrivera bientôt."
        />
      )}
    </Screen>
  );
}
