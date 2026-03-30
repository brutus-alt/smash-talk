import { View } from "react-native";

import { Screen, SectionHeader } from "../../components/ui";
import { MatchCard } from "../../components/match-card";
import { MATCHES, getPlayer } from "../../lib/mock-data";

/**
 * Historique — Tab 3.
 * Liste chronologique de tous les matchs (données mock).
 * Résout les IDs en données affichables avant de passer aux composants.
 */
export default function HistoryScreen() {
  return (
    <Screen mode="scroll">
      <SectionHeader title="Historique" subtitle={`${MATCHES.length} matchs`} />

      <View className="gap-3">
        {MATCHES.map((m) => (
          <MatchCard
            key={m.id}
            teamA={[getPlayer(m.teamA[0]), getPlayer(m.teamA[1])]}
            teamB={[getPlayer(m.teamB[0]), getPlayer(m.teamB[1])]}
            sets={m.sets}
            winner={m.winner}
            playedAt={m.playedAt}
          />
        ))}
      </View>
    </Screen>
  );
}
