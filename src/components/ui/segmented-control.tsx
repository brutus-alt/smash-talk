import { View, Text, Pressable } from "react-native";
import { hapticLight } from "../../lib/haptics";

/**
 * SegmentedControl — selecteur a 2-4 segments.
 *
 * Usages :
 * - Classement : "Individuel" | "Par paire"
 * - Stats profil : "Resume" | "Details"
 * - Historique : filtres de periode
 *
 * Le segment actif a un fond elevated + texte primary.
 * Les segments inactifs sont transparents + texte muted.
 *
 * Maximum 4 segments. Au-dela, utiliser un autre pattern.
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
    <View className="flex-row bg-surface-card rounded-xl p-1" style={{ gap: 4 }}>
      {segments.map((segment) => {
        const isActive = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => {
              hapticLight();
              onChange(segment.value);
            }}
            className={`
              flex-1 items-center justify-center py-2.5 rounded-lg
              ${isActive ? "bg-surface-elevated" : "bg-transparent"}
            `}
          >
            <Text
              className={`
                text-sm font-bold
                ${isActive ? "text-text" : "text-text-muted"}
              `}
              style={{ letterSpacing: -0.2 }}
            >
              {segment.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
