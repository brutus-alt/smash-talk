import { View, ScrollView } from "react-native";
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
import { PlayerHero } from "../../components/player-hero";
import { RivalryCard } from "../../components/rivalry-card";
import { MatchCard } from "../../components/match-card";
import {
  RANKINGS,
  BADGES,
  RIVALRIES,
  MATCHES,
  getPlayer,
} from "../../lib/mock-data";

/**
 * Profil d'un joueur — route dynamique /player/[id].
 * SafeAreaView + ModalHeader + ScrollView (pas de Screen wrapper).
 * Résout toutes les données avant de les passer aux composants.
 */
export default function PlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = id ?? "p1";

  const player = getPlayer(playerId);
  const ranking = RANKINGS.find((r) => r.playerId === playerId);

  if (!ranking) {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ModalHeader title="Joueur" onClose={() => router.back()} />
        <EmptyState
          emoji="👻"
          title="Fantôme"
          description="Ce joueur a disparu des radars. Peut-être qu'il fuit la compétition."
        />
      </SafeAreaView>
    );
  }

  const playerRivalries = RIVALRIES.filter(
    (r) => r.playerAId === playerId || r.playerBId === playerId
  );

  const playerMatches = MATCHES.filter(
    (m) => m.teamA.includes(playerId) || m.teamB.includes(playerId)
  ).slice(0, 5);

  const earnedCount = BADGES.filter((b) => b.earnedAt !== null).length;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader title={player.pseudo} onClose={() => router.back()} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-28 gap-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero — props résolues */}
        <PlayerHero
          pseudo={player.pseudo}
          initials={player.initials}
          color={player.color}
          rank={ranking.rank}
          matches={ranking.matches}
          wins={ranking.wins}
          losses={ranking.losses}
          winRate={ranking.winRate}
          streak={ranking.streak}
          streakType={ranking.streakType}
        />

        {/* Stats */}
        <View>
          <SectionHeader title="Ses chiffres" />
          <Card>
            <StatRow label="Matchs joués" value={ranking.matches} />
            <Divider />
            <StatRow label="Victoires" value={ranking.wins} highlight="accent" />
            <Divider />
            <StatRow label="Défaites" value={ranking.losses} highlight="danger" />
            <Divider />
            <StatRow label="Ratio" value={`${Math.round(ranking.winRate * 100)}%`} />
          </Card>
        </View>

        {/* Badges */}
        <View>
          <SectionHeader title="Son palmarès" subtitle={`${earnedCount}/12`} />
          <Card>
            <View className="flex-row flex-wrap gap-3 justify-center py-1">
              {BADGES.slice(0, 6).map((badge) => (
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

        {/* Rivalités — props résolues */}
        {playerRivalries.length > 0 ? (
          <View>
            <SectionHeader title="Ses rivaux" />
            <View className="gap-3">
              {playerRivalries.map((r, i) => (
                <RivalryCard
                  key={i}
                  playerA={getPlayer(r.playerAId)}
                  playerB={getPlayer(r.playerBId)}
                  playerAWins={r.playerAWins}
                  playerBWins={r.playerBWins}
                  totalMatches={r.totalMatches}
                  lastMatchDate={r.lastMatchDate}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* Matchs récents — props résolues */}
        <View>
          <SectionHeader title="Ses derniers combats" subtitle={`${playerMatches.length}`} />
          <View className="gap-3">
            {playerMatches.map((m) => (
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
        </View>

        {/* Provoquer */}
        <View className="mt-2 mb-4">
          <Button
            title={`Chambrer ${player.pseudo} 😈`}
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
