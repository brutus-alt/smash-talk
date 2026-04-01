import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Pill } from "./ui";

/**
 * LeagueHeader — en-tête de ligue affiché en haut de la Home.
 *
 * Si onSwitch est fourni, le nom est pressable et affiche un chevron
 * pour indiquer qu'on peut changer de ligue.
 */

type LeagueHeaderProps = {
  name: string;
  emoji: string;
  memberCount: number;
  matchesThisWeek: number;
  /** Callback pour ouvrir le sélecteur de ligue */
  onSwitch?: () => void;
  onSettings?: () => void;
};

export function LeagueHeader({
  name,
  emoji,
  memberCount,
  matchesThisWeek,
  onSwitch,
  onSettings,
}: LeagueHeaderProps) {
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-3xl">{emoji}</Text>

      <Pressable
        className="flex-1 flex-row items-center gap-1.5"
        onPress={onSwitch ?? onSettings}
        disabled={!onSwitch && !onSettings}
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <View className="flex-1">
          <Text className="text-text text-xl font-bold">{name}</Text>
          <Text className="text-text-muted text-sm">{memberCount} joueurs</Text>
        </View>
        {onSwitch ? (
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        ) : null}
      </Pressable>

      {matchesThisWeek > 0 ? (
        <Pill variant="accent" icon="🔥">
          {matchesThisWeek} cette sem.
        </Pill>
      ) : null}
    </View>
  );
}
