import { View } from "react-native";
import { useRouter } from "expo-router";

import { Screen, SectionHeader, EmptyState } from "../../components/ui";
import { LeagueHeader } from "../../components/league-header";
import { MatchCard } from "../../components/match-card";
import { RankingRow } from "../../components/ranking-row";
import { RivalryCard } from "../../components/rivalry-card";
import { useLeagueStore } from "../../stores/league.store";
import { LEAGUE, MATCHES, RANKINGS, RIVALRIES, getPlayer } from "../../lib/mock-data";

/**
 * Home Ligue — Tab 1 (écran par défaut).
 * Résout les données mock → passe des props résolues aux composants.
 */
export default function HomeScreen() {
  const router = useRouter();
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);

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

  const lastMatch = MATCHES[0]!;
  const top3 = RANKINGS.slice(0, 3);
  const topRivalry = RIVALRIES[0]!;

  // Résolution des données pour MatchCard
  const resolveMatch = (m: typeof lastMatch) => ({
    teamA: [getPlayer(m.teamA[0]), getPlayer(m.teamA[1])] as [ReturnType<typeof getPlayer>, ReturnType<typeof getPlayer>],
    teamB: [getPlayer(m.teamB[0]), getPlayer(m.teamB[1])] as [ReturnType<typeof getPlayer>, ReturnType<typeof getPlayer>],
    sets: m.sets,
    winner: m.winner,
    playedAt: m.playedAt,
  });

  // Résolution des données pour RivalryCard
  const resolveRivalry = (r: typeof topRivalry) => ({
    playerA: getPlayer(r.playerAId),
    playerB: getPlayer(r.playerBId),
    playerAWins: r.playerAWins,
    playerBWins: r.playerBWins,
    totalMatches: r.totalMatches,
    lastMatchDate: r.lastMatchDate,
  });

  return (
    <Screen mode="scroll">
      <LeagueHeader
        name={LEAGUE.name}
        emoji={LEAGUE.emoji}
        memberCount={LEAGUE.memberCount}
        matchesThisWeek={LEAGUE.matchesThisWeek}
      />

      {/* Dernier match */}
      <View>
        <SectionHeader title="Dernier match" />
        <MatchCard {...resolveMatch(lastMatch)} />
      </View>

      {/* Top 3 classement */}
      <View>
        <SectionHeader title="Classement" actionLabel="Voir tout" onAction={() => {}} />
        <View className="bg-surface-card rounded-xl overflow-hidden">
          {top3.map((r) => {
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
      </View>

      {/* Rivalité du moment */}
      <View>
        <SectionHeader title="Rivalité du moment" />
        <RivalryCard {...resolveRivalry(topRivalry)} />
      </View>
    </Screen>
  );
}
