import { View } from "react-native";
import { useRouter } from "expo-router";

import {
  Screen,
  Card,
  SectionHeader,
  BadgeIcon,
  Divider,
  StatRow,
  Button,
} from "../../components/ui";
import { PlayerHero } from "../../components/player-hero";
import { RivalryCard } from "../../components/rivalry-card";
import { RANKINGS, BADGES, RIVALRIES, getPlayer } from "../../lib/mock-data";

/**
 * Profil — Tab 4.
 * Profil du joueur connecté (Nico — p1).
 * Résout les données mock → props résolues pour chaque composant.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const myId = "p1";
  const me = getPlayer(myId);
  const myRanking = RANKINGS.find((r) => r.playerId === myId)!;

  const myRivalries = RIVALRIES.filter(
    (r) => r.playerAId === myId || r.playerBId === myId
  );

  const earnedBadges = BADGES.filter((b) => b.earnedAt !== null);

  return (
    <Screen mode="scroll">
      {/* Hero — props résolues */}
      <PlayerHero
        pseudo={me.pseudo}
        initials={me.initials}
        color={me.color}
        rank={myRanking.rank}
        matches={myRanking.matches}
        wins={myRanking.wins}
        losses={myRanking.losses}
        winRate={myRanking.winRate}
        streak={myRanking.streak}
        streakType={myRanking.streakType}
      />

      {/* Detailed stats */}
      <View>
        <SectionHeader title="Statistiques détaillées" />
        <Card>
          <StatRow label="Matchs joués" value={myRanking.matches} />
          <Divider />
          <StatRow label="Victoires" value={myRanking.wins} highlight="accent" />
          <Divider />
          <StatRow label="Défaites" value={myRanking.losses} highlight="danger" />
          <Divider />
          <StatRow label="Ratio victoires" value={`${Math.round(myRanking.winRate * 100)}%`} />
          <Divider />
          <StatRow
            label="Série en cours"
            value={`${myRanking.streak} ${myRanking.streakType === "win" ? "V" : "D"}`}
            highlight={myRanking.streakType === "win" ? "accent" : "danger"}
          />
          <Divider />
          <StatRow
            label="Position"
            value={`#${myRanking.rank}`}
            highlight={myRanking.rank === 1 ? "warning" : "default"}
          />
        </Card>
      </View>

      {/* Badges */}
      <View>
        <SectionHeader title="Badges" subtitle={`${earnedBadges.length}/${BADGES.length}`} />
        <Card>
          <View className="flex-row flex-wrap gap-3 justify-center py-1">
            {BADGES.map((badge) => (
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
      <View>
        <SectionHeader title="Mes rivalités" subtitle={`${myRivalries.length}`} />
        <View className="gap-3">
          {myRivalries.map((r, i) => (
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

      {/* Settings */}
      <View className="mt-2 mb-4">
        <Button
          title="Paramètres"
          variant="ghost"
          size="md"
          fullWidth
          onPress={() => {}}
        />
      </View>
    </Screen>
  );
}
