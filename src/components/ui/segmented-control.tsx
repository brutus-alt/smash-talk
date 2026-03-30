import { View, Text, Pressable } from "react-native";

/**
 * SegmentedControl — onglets inline pour basculer entre des vues.
 *
 * Usages :
 * - Classement : "Individuel" | "Par paire"
 * - Stats profil : "Résumé" | "Détails"
 * - Historique : filtres de période
 *
 * Le segment actif a un fond elevated + texte primary.
 * Les segments inactifs sont transparents + texte muted.
 *
 * Maximum 4 segments. Au-delà, utiliser un autre pattern.
 */

type Segment<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  segments: readonly Segment<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View className="flex-row bg-surface-card rounded-xl p-1 gap-1">
      {segments.map((segment) => {
        const isActive = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange(segment.value)}
            className={`
              flex-1 items-center justify-center py-2.5 rounded-lg
              ${isActive ? "bg-surface-elevated" : "bg-transparent"}
            `}
          >
            <Text
              className={`
                text-sm font-semibold
                ${isActive ? "text-text" : "text-text-muted"}
              `}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
