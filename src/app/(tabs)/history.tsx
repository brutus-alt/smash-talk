import { View, ActivityIndicator } from "react-native";

import { Screen, SectionHeader, EmptyState } from "../../components/ui";
import { MatchCard } from "../../components/match-card";
import { useLeagueStore } from "../../stores/league.store";
import { useMatches } from "../../hooks/use-matches";
import { useLeagueMembers } from "../../hooks/use-league-members";
import { getMatchSets } from "../../domain/match-utils";

/**
 * Historique — Tab 3.
 * Liste chronologique de tous les matchs depuis Supabase.
 */
export default function HistoryScreen() {
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const { data: matches, isLoading } = useMatches(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);

  const resolvePlayer = (userId: string) => {
    const p = members?.find((m) => m.user_id === userId)?.profile;
    return {
      pseudo: p?.pseudo ?? "???",
      initials: p?.initials ?? "??",
      color: p?.color ?? "#6B7280",
    };
  };

  if (!activeLeagueId) {
    return (
      <Screen>
        <EmptyState
          emoji="📋"
          title="Pas de ligue"
          description="Rejoins ou crée une ligue pour voir l'historique."
        />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22C55E" size="large" />
        </View>
      </Screen>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Screen>
        <EmptyState
          emoji="📋"
          title="Aucun match"
          description="L'historique se remplira au fil des matchs. Enregistre ton premier match !"
        />
      </Screen>
    );
  }

  return (
    <Screen mode="scroll">
      <SectionHeader title="Historique" subtitle={`${matches.length} matchs`} />

      <View className="gap-3">
        {matches.map((m) => (
          <MatchCard
            key={m.id}
            teamA={[
              resolvePlayer(m.team_a_player_1),
              resolvePlayer(m.team_a_player_2),
            ]}
            teamB={[
              resolvePlayer(m.team_b_player_1),
              resolvePlayer(m.team_b_player_2),
            ]}
            sets={getMatchSets(m)}
            winner={m.winner === "team_a" ? "a" : "b"}
            playedAt={m.played_at}
          />
        ))}
      </View>
    </Screen>
  );
}
