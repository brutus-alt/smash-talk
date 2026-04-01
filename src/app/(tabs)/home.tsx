import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";

import { Screen, SectionHeader, EmptyState, SkeletonMatchCard, SkeletonRankingRow } from "../../components/ui";
import { FadeInUp, ScaleBounce } from "../../components/ui/animated-view";
import { LeagueHeader } from "../../components/league-header";
import { LeagueSwitcher } from "../../components/league-switcher";
import { MatchCard } from "../../components/match-card";
import { RankingRow } from "../../components/ranking-row";
import { TensionCard } from "../../components/tension-card";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useLeague, useMyLeagues } from "../../hooks/use-leagues";
import { useMatches } from "../../hooks/use-matches";
import { useRankings } from "../../hooks/use-rankings";
import { useLeagueMembers } from "../../hooks/use-league-members";
import { getMatchSets } from "../../domain/match-utils";
import type { ProfileRow } from "../../lib/database.types";

/**
 * Home Ligue — Tab 1 (écran par défaut).
 * Branché sur Supabase via les hooks TanStack Query.
 * Les composants reçoivent des props résolues (découplés).
 */
export default function HomeScreen() {
  const router = useRouter();
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const setActiveLeague = useLeagueStore((s) => s.setActiveLeague);
  const userId = useAuthStore((s) => s.user?.id) ?? "";

  // Hooks Supabase
  const qc = useQueryClient();
  const { data: league } = useLeague(activeLeagueId);
  const { data: myLeagues } = useMyLeagues();
  const { data: matches, isLoading: matchesLoading } = useMatches(activeLeagueId);
  const { data: rankings } = useRankings(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);

  // League switcher
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const hasMultipleLeagues = (myLeagues?.length ?? 0) > 1;

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await qc.invalidateQueries();
    setRefreshing(false);
  }, [qc]);

  // Helper : résoudre un profil depuis les membres
  const getProfile = (userId: string): ProfileRow | undefined =>
    members?.find((m) => m.user_id === userId)?.profile;

  const resolvePlayer = (userId: string) => {
    const p = getProfile(userId);
    return {
      pseudo: p?.pseudo ?? "???",
      initials: p?.initials ?? "??",
      color: p?.color ?? "#6B7280",
    };
  };

  // Pas de ligue active → empty state
  if (!activeLeagueId) {
    return (
      <Screen>
        <EmptyState
          emoji="🏓"
          title="L'arène t'attend"
          description="Crée ta ligue, invite tes potes, et prouve que t'es le boss du padel."
          actionLabel="Créer ma ligue"
          onAction={() => router.push("/league/create")}
          secondaryLabel="J'ai un code d'invitation"
          onSecondary={() => router.push("/league/join")}
        />
      </Screen>
    );
  }

  // Loading — skeleton
  if (matchesLoading) {
    return (
      <Screen mode="scroll">
        <View className="gap-4">
          <SkeletonMatchCard />
          <View className="bg-surface-card rounded-xl overflow-hidden">
            <SkeletonRankingRow />
            <SkeletonRankingRow />
            <SkeletonRankingRow />
          </View>
        </View>
      </Screen>
    );
  }

  const lastMatch = matches?.[0];
  const top3 = rankings?.slice(0, 3) ?? [];
  const hasData = matches && matches.length > 0;

  return (
    <Screen mode="scroll" onRefresh={onRefresh} refreshing={refreshing}>
      {/* League switcher modal */}
      <LeagueSwitcher
        visible={switcherOpen}
        leagues={myLeagues ?? []}
        activeLeagueId={activeLeagueId ?? ""}
        onSelect={setActiveLeague}
        onClose={() => setSwitcherOpen(false)}
        onCreateNew={() => router.push("/league/create")}
        onJoin={() => router.push("/league/join")}
      />

      {/* League header */}
      <FadeInUp delay={0}>
        <LeagueHeader
          name={league?.name ?? "Ma Ligue"}
          emoji={league?.emoji ?? "⚡"}
          memberCount={members?.length ?? 0}
          matchesThisWeek={matches?.filter((m) => {
            const d = new Date(m.played_at);
            const now = new Date();
            const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
            return diff <= 7;
          }).length ?? 0}
          onSwitch={hasMultipleLeagues ? () => setSwitcherOpen(true) : undefined}
        />
      </FadeInUp>

      {/* Dernier match */}
      <FadeInUp delay={100}>
        {lastMatch ? (
          <View>
            <SectionHeader title="Dernier combat" />
            <MatchCard
              teamA={[
                resolvePlayer(lastMatch.team_a_player_1),
                resolvePlayer(lastMatch.team_a_player_2),
              ]}
              teamB={[
                resolvePlayer(lastMatch.team_b_player_1),
                resolvePlayer(lastMatch.team_b_player_2),
              ]}
              sets={getMatchSets(lastMatch)}
              winner={lastMatch.winner === "team_a" ? "a" : "b"}
              playedAt={lastMatch.played_at}
            />
          </View>
        ) : (
          <View>
            <SectionHeader title="Dernier combat" />
            <EmptyState
              emoji="🎾"
              title="Le terrain t'attend"
              description="Premier match, première légende. Tape sur + et montre ce que tu vaux."
            />
          </View>
        )}
      </FadeInUp>

      {/* Top 3 classement */}
      {top3.length > 0 ? (
        <FadeInUp delay={200}>
          <View>
            <SectionHeader title="Qui domine ?" actionLabel="Voir tout" onAction={() => router.push("/(tabs)/ranking")} />
            <View className="bg-surface-card rounded-xl overflow-hidden">
              {top3.map((r) => {
                const p = resolvePlayer(r.userId);
                return (
                  <RankingRow
                    key={r.userId}
                    rank={r.rank}
                    pseudo={p.pseudo}
                    initials={p.initials}
                    color={p.color}
                    matches={r.totalMatches}
                    wins={r.wins}
                    losses={r.losses}
                    winRate={r.winRate}
                    streak={r.currentStreak}
                    streakType={r.currentStreakType}
                    movement={0}
                    onPress={() => router.push(`/player/${r.userId}`)}
                  />
                );
              })}
            </View>
          </View>
        </FadeInUp>
      ) : null}

      {/* Tension — messages dynamiques */}
      {rankings && rankings.length >= 2 && members ? (
        <FadeInUp delay={300}>
          <View>
            <SectionHeader title="Dans l'arène" />
            <TensionCard
              rankings={rankings}
              players={new Map(
                members.map((m) => [
                  m.user_id,
                  { userId: m.user_id, pseudo: m.profile.pseudo },
                ])
              )}
              currentUserId={userId}
            />
          </View>
        </FadeInUp>
      ) : null}
    </Screen>
  );
}
