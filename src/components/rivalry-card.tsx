import { View, Text } from "react-native";
import { Card, Avatar } from "./ui";
import { timeAgo } from "../lib/utils";

/**
 * RivalryCard — carte de rivalité head-to-head.
 * DÉCOUPLÉ des mocks.
 */

type PlayerDisplay = {
  pseudo: string;
  initials: string;
  color: string;
};

type RivalryCardProps = {
  playerA: PlayerDisplay;
  playerB: PlayerDisplay;
  playerAWins: number;
  playerBWins: number;
  totalMatches: number;
  lastMatchDate: string;
  onPress?: () => void;
};

export function RivalryCard({
  playerA,
  playerB,
  playerAWins,
  playerBWins,
  totalMatches,
  lastMatchDate,
  onPress,
}: RivalryCardProps) {
  const aLeads = playerAWins > playerBWins;
  const bLeads = playerBWins > playerAWins;

  return (
    <Card variant="outlined" onPress={onPress}>
      <View className="flex-row items-center">
        <View className="flex-1 items-center gap-1.5">
          <Avatar initials={playerA.initials} color={playerA.color} size="lg" ring={aLeads} />
          <Text className="text-text text-sm font-semibold">{playerA.pseudo}</Text>
          <Text
            className={`text-2xl font-bold ${aLeads ? "text-accent" : "text-text-muted"}`}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {playerAWins}
          </Text>
        </View>

        <View className="items-center gap-1 px-3">
          <Text className="text-text-muted text-xs font-bold">VS</Text>
          <Text className="text-text-muted text-2xs">{totalMatches} matchs</Text>
        </View>

        <View className="flex-1 items-center gap-1.5">
          <Avatar initials={playerB.initials} color={playerB.color} size="lg" ring={bLeads} />
          <Text className="text-text text-sm font-semibold">{playerB.pseudo}</Text>
          <Text
            className={`text-2xl font-bold ${bLeads ? "text-accent" : "text-text-muted"}`}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {playerBWins}
          </Text>
        </View>
      </View>

      <Text className="text-text-muted text-2xs text-center mt-2">
        Dernier match : {timeAgo(lastMatchDate)}
      </Text>
    </Card>
  );
}
