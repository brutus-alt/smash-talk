import { View, Text, Pressable } from "react-native";
import { Avatar, Pill } from "./ui";

/**
 * RankingRow — une ligne dans le classement.
 * DÉCOUPLÉ des mocks.
 */

type RankingRowProps = {
  rank: number;
  pseudo: string;
  initials: string;
  color: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  streakType: "win" | "loss" | "none";
  movement: number;
  onPress?: () => void;
};

export function RankingRow({
  rank,
  pseudo,
  initials,
  color,
  matches,
  wins,
  losses,
  winRate,
  streak,
  streakType,
  movement,
  onPress,
}: RankingRowProps) {
  const isFirst = rank === 1;

  const movementText =
    movement > 0 ? `↑${movement}` :
    movement < 0 ? `↓${Math.abs(movement)}` :
    "=";

  const movementVariant =
    movement > 0 ? "accent" as const :
    movement < 0 ? "danger" as const :
    "muted" as const;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center py-3 px-1 gap-3"
      style={({ pressed }) => ({ opacity: pressed && onPress ? 0.7 : 1 })}
    >
      <Text
        className={`w-7 text-center font-bold ${isFirst ? "text-warning text-lg" : "text-text-muted text-base"}`}
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {rank}
      </Text>

      <Avatar initials={initials} color={color} size="md" ring={isFirst} />

      <View className="flex-1">
        <Text className="text-text text-base font-semibold">{pseudo}</Text>
        <Text className="text-text-muted text-xs">
          {wins}V - {losses}D · {matches} matchs
        </Text>
      </View>

      <Text
        className="text-text text-base font-bold w-14 text-right"
        style={{ fontVariant: ["tabular-nums"] }}
      >
        {Math.round(winRate * 100)}%
      </Text>

      {streak >= 3 ? (
        <Pill variant={streakType === "win" ? "accent" : "danger"} icon="🔥">
          {streak}
        </Pill>
      ) : null}

      <Pill variant={movementVariant}>{movementText}</Pill>
    </Pressable>
  );
}
