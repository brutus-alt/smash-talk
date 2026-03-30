import { View, Text } from "react-native";

/**
 * Avatar — cercle coloré avec initiales (Arbitrages §1.6).
 *
 * Tailles :
 * - xs → dans les listes compactes (suggestion de paires)
 * - sm → lignes de classement, historique
 * - md → profil dans les cartes
 * - lg → profil principal, onboarding
 * - xl → écran profil hero
 *
 * ring : anneau accent autour de l'avatar (ex : leader du classement).
 */

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

type AvatarProps = {
  initials: string;
  color: string;
  size?: AvatarSize;
  /** Anneau accent (1er du classement, joueur sélectionné) */
  ring?: boolean;
};

const sizeMap: Record<AvatarSize, { container: string; text: string; ringPad: string }> = {
  xs: { container: "w-7 h-7", text: "text-2xs font-bold", ringPad: "p-0.5" },
  sm: { container: "w-9 h-9", text: "text-xs font-bold", ringPad: "p-0.5" },
  md: { container: "w-11 h-11", text: "text-sm font-bold", ringPad: "p-0.5" },
  lg: { container: "w-14 h-14", text: "text-lg font-bold", ringPad: "p-1" },
  xl: { container: "w-20 h-20", text: "text-2xl font-bold", ringPad: "p-1" },
};

export function Avatar({ initials, color, size = "md", ring = false }: AvatarProps) {
  const conf = sizeMap[size];

  const circle = (
    <View
      className={`${conf.container} rounded-full items-center justify-center`}
      style={{ backgroundColor: color }}
    >
      <Text className={`${conf.text} text-white`}>{initials}</Text>
    </View>
  );

  if (ring) {
    return (
      <View className={`rounded-full border-2 border-accent ${conf.ringPad}`}>
        {circle}
      </View>
    );
  }

  return circle;
}
