import { View } from "react-native";
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Screen, SectionHeader, EmptyState, SkeletonMatchCard } from "../../components/ui";
import { FadeInUp } from "../../components/ui/animated-view";
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
  const qc = useQueryClient();
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const { data: matches, isLoading } = useMatches(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await qc.invalidateQueries();
    setRefreshing(false);
  }, [qc]);

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
          title="Pas encore dans l'arène"
          description="Rejoins une ligue pour que la mémoire collective commence."
        />
      </Screen>
    );
  }

  if (isLoading) {
    return (
      <Screen mode="scroll">
        <View className="gap-3">
          <SkeletonMatchCard />
          <SkeletonMatchCard />
          <SkeletonMatchCard />
        </View>
      </Screen>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Screen>
        <EmptyState
          emoji="📋"
          title="Rien à raconter… pour l'instant"
          description="Chaque match écrit l'histoire du groupe. Le premier chapitre t'attend."
        />
      </Screen>
    );
  }

  return (
    <Screen mode="scroll" onRefresh={onRefresh} refreshing={refreshing}>
      <SectionHeader title="La mémoire du groupe" subtitle={`${matches.length} matchs`} />

      <View className="gap-3">
        {matches.map((m, index) => (
          <FadeInUp key={m.id} delay={index * 50}>
            <MatchCard
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
          </FadeInUp>
        ))}
      </View>
    </Screen>
  );
}
