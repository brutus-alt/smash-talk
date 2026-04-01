import { View } from "react-native";

import {
  Screen,
  Card,
  SectionHeader,
  BadgeIcon,
  Divider,
  StatRow,
  Button,
  EmptyState,
} from "../../components/ui";
import { FadeInUp } from "../../components/ui/animated-view";
import { PlayerHero } from "../../components/player-hero";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useMyProfile, useSignOut } from "../../hooks/use-auth";
import { usePlayerStats } from "../../hooks/use-player-stats";
import { useRankings } from "../../hooks/use-rankings";
import { useBadges } from "../../hooks/use-badges";

/**
 * Profil — Tab 4.
 * Branché sur Supabase : profil réel, stats, badges.
 */
export default function ProfileScreen() {
  const userId = useAuthStore((s) => s.user?.id) ?? null;
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const signOut = useSignOut();

  const { data: profile } = useMyProfile();
  const { data: stats } = usePlayerStats(activeLeagueId, userId);
  const { data: rankings } = useRankings(activeLeagueId);
  const { data: badges } = useBadges(userId, activeLeagueId);

  const myRanking = rankings?.find((r) => r.userId === userId);
  const earnedCount = badges?.filter((b) => b.earnedAt !== null).length ?? 0;

  // Pas de ligue → profil minimal avec déconnexion
  if (!activeLeagueId) {
    return (
      <Screen mode="scroll">
        <FadeInUp delay={0}>
          <PlayerHero
            pseudo={profile?.pseudo ?? "Joueur"}
            initials={profile?.initials ?? "??"}
            color={profile?.color ?? "#3B82F6"}
            rank={0}
            matches={0}
            wins={0}
            losses={0}
            winRate={0}
            streak={0}
            streakType="none"
          />
        </FadeInUp>

        <EmptyState
          emoji="🏆"
          title="Pas encore dans l'arène"
          description="Rejoins une ligue pour commencer à accumuler des stats et des badges."
        />

        <View className="mt-4 mb-4">
          <Button
            title="Quitter l'arène"
            variant="ghost"
            size="md"
            fullWidth
            onPress={signOut}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen mode="scroll">
      {/* Hero */}
      <FadeInUp delay={0}>
        <PlayerHero
          pseudo={profile?.pseudo ?? "Joueur"}
          initials={profile?.initials ?? "??"}
          color={profile?.color ?? "#3B82F6"}
          rank={myRanking?.rank ?? 0}
          matches={stats?.totalMatches ?? 0}
          wins={stats?.wins ?? 0}
          losses={stats?.losses ?? 0}
          winRate={stats?.winRate ?? 0}
          streak={stats?.currentStreak ?? 0}
          streakType={stats?.currentStreakType ?? "none"}
        />
      </FadeInUp>

      {/* Stats détaillées */}
      {stats ? (
        <FadeInUp delay={100}>
          <View>
            <SectionHeader title="Tes chiffres" />
            <Card>
              <StatRow label="Matchs joués" value={stats.totalMatches} />
              <Divider />
              <StatRow label="Victoires 💪" value={stats.wins} highlight="accent" />
              <Divider />
              <StatRow label="Défaites 😤" value={stats.losses} highlight="danger" />
              <Divider />
              <StatRow label="Ratio de boss" value={`${Math.round(stats.winRate * 100)}%`} />
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
        <View>
          <SectionHeader title="Palmarès" subtitle={`${earnedCount}/${badges.length}`} />
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
      ) : null}

      {/* Déconnexion */}
      <View className="mt-4 mb-4">
        <Button
          title="Quitter l'arène"
          variant="ghost"
          size="md"
          fullWidth
          onPress={signOut}
        />
      </View>
    </Screen>
  );
}
