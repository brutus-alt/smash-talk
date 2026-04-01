import { View, ScrollView, ActivityIndicator, Share } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ModalHeader,
  Card,
  SectionHeader,
  BadgeIcon,
  Divider,
  StatRow,
  Button,
  EmptyState,
} from "../../components/ui";
import { FadeInUp, ScaleBounce } from "../../components/ui/animated-view";
import { PlayerHero } from "../../components/player-hero";
import { MatchCard } from "../../components/match-card";
import { useLeagueStore } from "../../stores/league.store";
import { useRankings } from "../../hooks/use-rankings";
import { usePlayerStats } from "../../hooks/use-player-stats";
import { useMatches } from "../../hooks/use-matches";
import { useLeagueMembers } from "../../hooks/use-league-members";
import { useBadges } from "../../hooks/use-badges";
import { getMatchSets, getMatchPlayerIds } from "../../domain/match-utils";

/**
 * Profil d'un joueur — route dynamique /player/[id].
 * Entièrement branché sur Supabase via les hooks TanStack Query.
 */
export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = id ?? "";
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);

  // Hooks Supabase
  const { data: rankings, isLoading: rankingLoading } = useRankings(activeLeagueId);
  const { data: stats } = usePlayerStats(activeLeagueId, playerId);
  const { data: matches } = useMatches(activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);
  const { data: badges } = useBadges(playerId, activeLeagueId);

  // Résoudre un profil depuis les membres
  const resolvePlayer = (userId: string) => {
    const p = members?.find((m) => m.user_id === userId)?.profile;
    return {
      pseudo: p?.pseudo ?? "???",
      initials: p?.initials ?? "??",
      color: p?.color ?? "#6B7280",
    };
  };

  const player = resolvePlayer(playerId);
  const ranking = rankings?.find((r) => r.userId === playerId);

  // Matchs récents de ce joueur (5 derniers)
  const playerMatches = (matches ?? [])
    .filter((m) => getMatchPlayerIds(m).includes(playerId))
    .slice(0, 5);

  const earnedCount = badges?.filter((b) => b.earnedAt !== null).length ?? 0;
  const totalBadges = badges?.length ?? 12;

  // Chambrage via Share API
  const handleChambrage = async () => {
    const winRate = stats ? Math.round(stats.winRate * 100) : 0;
    await Share.share({
      message: `🏓 ${player.pseudo} est à ${winRate}% de victoires sur Smash Talk. Tu penses pouvoir faire mieux ? 😈`,
    });
  };

  // Loading
  if (rankingLoading) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ModalHeader title="Joueur" onClose={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#22C55E" size="large" />
        </View>
      </SafeAreaView>
    );
  }

  // Joueur pas trouvé dans le classement (pas assez de matchs ou erreur)
  if (!ranking) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ModalHeader title={player.pseudo} onClose={() => router.back()} />
        <EmptyState
          emoji="👻"
          title="Fantôme"
          description="Ce joueur n'a pas encore assez de matchs pour apparaître au classement. Patience…"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader title={player.pseudo} onClose={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-28 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <ScaleBounce delay={0}>
          <PlayerHero
            pseudo={player.pseudo}
            initials={player.initials}
            color={player.color}
            rank={ranking.rank}
            matches={ranking.totalMatches}
            wins={ranking.wins}
            losses={ranking.losses}
            winRate={ranking.winRate}
            streak={ranking.currentStreak}
            streakType={ranking.currentStreakType}
          />
        </ScaleBounce>

        {/* Stats détaillées */}
        {stats ? (
          <FadeInUp delay={150}>
            <View>
              <SectionHeader title="Ses chiffres" />
              <Card>
                <StatRow label="Matchs joués" value={stats.totalMatches} />
                <Divider />
                <StatRow label="Victoires 💪" value={stats.wins} highlight="accent" />
                <Divider />
                <StatRow label="Défaites 😤" value={stats.losses} highlight="danger" />
                <Divider />
                <StatRow label="Ratio" value={`${Math.round(stats.winRate * 100)}%`} />
                <Divider />
                <StatRow
                  label="Meilleure série 🔥"
                  value={`${stats.bestWinStreak} V`}
                  highlight="accent"
                />
                <Divider />
                <StatRow label="Sets gagnés" value={stats.totalSetsWon} />
                <Divider />
                <StatRow label="Sets lâchés" value={stats.totalSetsLost} highlight="danger" />
              </Card>
            </View>
          </FadeInUp>
        ) : null}

        {/* Badges */}
        {badges ? (
          <FadeInUp delay={300}>
            <View>
              <SectionHeader title="Son palmarès" subtitle={`${earnedCount}/${totalBadges}`} />
              <Card>
                <View className="flex-row flex-wrap gap-3 justify-center py-1">
                  {badges.map((badge) => (
                    <BadgeIcon
                      key={badge.id}
                      name={badge.name}
                      icon={badge.icon}
                      earned={badge.earnedAt !== null}
                      size="sm"
                    />
                  ))}
                </View>
              </Card>
            </View>
          </FadeInUp>
        ) : null}

        {/* Matchs récents */}
        {playerMatches.length > 0 ? (
          <FadeInUp delay={450}>
            <View>
              <SectionHeader title="Ses derniers combats" subtitle={`${playerMatches.length}`} />
              <View className="gap-3">
                {playerMatches.map((m) => (
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
            </View>
          </FadeInUp>
        ) : null}

        {/* Chambrer */}
        <FadeInUp delay={550}>
          <View className="mt-2 mb-4">
            <Button
              title={`Chambrer ${player.pseudo} 😈`}
              variant="secondary"
              size="lg"
              fullWidth
              onPress={handleChambrage}
            />
          </View>
        </FadeInUp>
      </ScrollView>
    </SafeAreaView>
  );
}
