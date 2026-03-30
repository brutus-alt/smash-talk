import { View, Text } from "react-native";
import { Avatar, Pill, Card, StatRow } from "./ui";

/**
 * PlayerHero — section hero du profil joueur.
 * DÉCOUPLÉ des mocks.
 */

type PlayerHeroProps = {
  pseudo: string;
  initials: string;
  color: string;
  rank: number;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  streakType: "win" | "loss" | "none";
};

export function PlayerHero({
  pseudo,
  initials,
  color,
  rank,
  matches,
  wins,
  losses,
  winRate,
  streak,
  streakType,
}: PlayerHeroProps) {
  const isFirst = rank === 1;

  return (
    <View className="gap-4">
      <View className="items-center gap-3 pt-2">
        <Avatar initials={initials} color={color} size="xl" ring={isFirst} />
        <Text className="text-text text-2xl font-bold">{pseudo}</Text>
        <View className="flex-row gap-2">
          <Pill variant={isFirst ? "warning" : "muted"}>#{rank}</Pill>
          {streak >= 3 ? (
            <Pill
              variant={streakType === "win" ? "accent" : "danger"}
              icon="🔥"
            >
              {streak} {streakType === "win" ? "victoires" : "défaites"}
            </Pill>
          ) : null}
        </View>
      </View>

      <Card>
        <View className="flex-row justify-around">
          <StatRow label="Matchs" value={matches} layout="vertical" />
          <StatRow label="Victoires" value={wins} layout="vertical" highlight="accent" />
          <StatRow label="Défaites" value={losses} layout="vertical" highlight="danger" />
          <StatRow
            label="Ratio"
            value={`${Math.round(winRate * 100)}%`}
            layout="vertical"
            highlight={winRate >= 0.6 ? "accent" : winRate < 0.4 ? "danger" : "default"}
          />
        </View>
      </Card>
    </View>
  );
}
