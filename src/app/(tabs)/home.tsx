import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { Screen, SectionHeader, EmptyState } from "../../components/ui";
import { LeagueHeader } from "../../components/league-header";
import { MatchCard } from "../../components/match-card";
import { RankingRow } from "../../components/ranking-row";
import { useLeagueStore } from "../../stores/league.store";
import { useLeague } from "../../hooks/use-leagues";
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

  // Hooks Supabase
  const { data: league } = useLeague(activeLeagueId);
  const { data: matches, isLoading: matchesLoading } = useMatches(activeLeagueId);
  const { data: rankings } = useRankings(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);

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
          title="Bienvenue sur Smash Talk"
          description="Crée ta première ligue ou rejoins celle de tes potes pour commencer à tracker vos matchs."
          actionLabel="Créer une ligue"
          onAction={() => router.push("/league/create")}
          secondaryLabel="J'ai un code d'invitation"
          onSecondary={() => router.push("/league/join")}
        />
      </Screen>
    );
  }

  // Loading
  if (matchesLoading) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22C55E" size="large" />
        </View>
      </Screen>
    );
  }

  const lastMatch = matches?.[0];
  const top3 = rankings?.slice(0, 3) ?? [];
  const hasData = matches && matches.length > 0;

  return (
    <Screen mode="scroll">
      {/* League header */}
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
      />

      {/* Dernier match */}
      {lastMatch ? (
        <View>
          <SectionHeader title="Dernier match" />
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
          <SectionHeader title="Dernier match" />
          <EmptyState
            emoji="🎾"
            title="Aucun match"
            description="Enregistre ton premier match avec le bouton + en bas."
          />
        </View>
      )}

      {/* Top 3 classement */}
      {top3.length > 0 ? (
        <View>
          <SectionHeader title="Classement" actionLabel="Voir tout" onAction={() => {}} />
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
      ) : null}
    </Screen>
  );
}
