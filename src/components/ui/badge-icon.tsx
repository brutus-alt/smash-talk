import { View, Text } from "react-native";

/**
 * BadgeIcon — icône de badge dans le profil joueur.
 *
 * États :
 * - earned  → fond accent muted, icône couleur. Gagné.
 * - locked  → fond elevated, icône grisée. Pas encore gagné.
 *
 * L'animation de déverrouillage (Reanimated) sera ajoutée au Sprint 5.
 */

type BadgeIconSize = "sm" | "md";

type BadgeIconProps = {
  name: string;
  icon: string;
  earned: boolean;
  size?: BadgeIconSize;
};

const sizeMap: Record<BadgeIconSize, { box: string; icon: string; label: string; width: string }> = {
  sm: { box: "w-10 h-10 rounded-lg", icon: "text-lg", label: "text-2xs", width: "w-14" },
  md: { box: "w-14 h-14 rounded-xl", icon: "text-2xl", label: "text-xs", width: "w-18" },
};

export function BadgeIcon({ name, icon, earned, size = "md" }: BadgeIconProps) {
  const conf = sizeMap[size];

  return (
    <View className={`items-center gap-1.5 ${conf.width}`}>
      <View
        className={`
          ${conf.box} items-center justify-center
          ${earned ? "bg-accent-muted" : "bg-surface-elevated"}
          ${earned ? "" : "opacity-30"}
        `}
      >
        <Text className={conf.icon}>{icon}</Text>
      </View>
      <Text
        className={`${conf.label} text-center ${earned ? "text-text-secondary" : "text-text-muted"}`}
        numberOfLines={2}
      >
        {name}
      </Text>
    </View>
  );
}
