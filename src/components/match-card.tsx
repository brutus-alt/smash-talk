import { View, Text } from "react-native";
import { Card, Avatar, Pill } from "./ui";
import { formatScore, timeAgo } from "../lib/utils";

/**
 * MatchCard — carte de résultat de match.
 *
 * DÉCOUPLÉ des mocks : reçoit des données résolues en props.
 * L'écran parent est responsable de résoudre les IDs en données affichables.
 */

type PlayerDisplay = {
  pseudo: string;
  initials: string;
  color: string;
};

type MatchCardProps = {
  teamA: [PlayerDisplay, PlayerDisplay];
  teamB: [PlayerDisplay, PlayerDisplay];
  sets: { a: number; b: number }[];
  winner: "a" | "b";
  playedAt: string;
  onPress?: () => void;
};

export function MatchCard({ teamA, teamB, sets, winner, playedAt, onPress }: MatchCardProps) {
  const isTeamAWinner = winner === "a";

  return (
    <Card variant="outlined" onPress={onPress}>
      {/* Date */}
      <Text className="text-text-muted text-xs mb-3">{timeAgo(playedAt)}</Text>

      {/* Teams row */}
      <View className="flex-row items-center">
        {/* Team A */}
        <View className={`flex-1 gap-1.5 ${isTeamAWinner ? "opacity-100" : "opacity-50"}`}>
          {teamA.map((p, i) => (
            <View key={i} className="flex-row items-center gap-2">
              <Avatar initials={p.initials} color={p.color} size="sm" />
              <Text className="text-text text-sm font-semibold">{p.pseudo}</Text>
            </View>
          ))}
        </View>

        {/* Score */}
        <View className="items-center px-3">
          <Text
            className="text-text text-lg font-bold"
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {formatScore(sets)}
          </Text>
          <Pill variant={isTeamAWinner ? "accent" : "danger"} icon="✓">
            Victoire
          </Pill>
        </View>

        {/* Team B */}
        <View className={`flex-1 items-end gap-1.5 ${!isTeamAWinner ? "opacity-100" : "opacity-50"}`}>
          {teamB.map((p, i) => (
            <View key={i} className="flex-row items-center gap-2">
              <Text className="text-text text-sm font-semibold">{p.pseudo}</Text>
              <Avatar initials={p.initials} color={p.color} size="sm" />
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
