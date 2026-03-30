import { View, Text, Pressable } from "react-native";
import { Pill } from "./ui";

/**
 * LeagueHeader — en-tête de ligue affiché en haut de la Home.
 * DÉCOUPLÉ des mocks — reçoit des props simples.
 */

type LeagueHeaderProps = {
  name: string;
  emoji: string;
  memberCount: number;
  matchesThisWeek: number;
  onSettings?: () => void;
};

export function LeagueHeader({
  name,
  emoji,
  memberCount,
  matchesThisWeek,
  onSettings,
}: LeagueHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-3xl">{emoji}</Text>
      <Pressable className="flex-1" onPress={onSettings} disabled={!onSettings}>
        <Text className="text-text text-xl font-bold">{name}</Text>
        <Text className="text-text-muted text-sm">{memberCount} joueurs</Text>
      </Pressable>
      {matchesThisWeek > 0 ? (
        <Pill variant="accent" icon="🔥">
          {matchesThisWeek} cette sem.
        </Pill>
      ) : null}
    </View>
  );
}
