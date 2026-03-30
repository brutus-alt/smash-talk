import { View, Text } from "react-native";
import type { ReactNode } from "react";

/**
 * StatRow — affichage d'une stat clé/valeur.
 *
 * Deux layouts :
 * - "horizontal" → label à gauche, valeur à droite. Pour les listes de stats.
 * - "vertical"   → valeur au-dessus, label en-dessous. Pour les grilles compactes.
 *
 * Les valeurs numériques utilisent tabular-nums pour l'alignement (Arbitrages §6.2).
 */

type StatRowLayout = "horizontal" | "vertical";

type StatRowProps = {
  label: string;
  value: string | number;
  layout?: StatRowLayout;
  /** Élément après la valeur (ex : Pill de tendance, icône flèche) */
  trailing?: ReactNode;
  /** Couleur accent sur la valeur (ex : vert pour un bon ratio) */
  highlight?: "accent" | "danger" | "warning" | "default";
};

const highlightClass = {
  accent: "text-accent",
  danger: "text-danger",
  warning: "text-warning",
  default: "text-text",
} as const;

export function StatRow({
  label,
  value,
  layout = "horizontal",
  trailing,
  highlight = "default",
}: StatRowProps) {
  if (layout === "vertical") {
    return (
      <View className="items-center gap-0.5">
        <View className="flex-row items-center gap-1.5">
          <Text
            className={`text-xl font-bold ${highlightClass[highlight]}`}
            style={{ fontVariant: ["tabular-nums"] }}
          >
            {value}
          </Text>
          {trailing ?? null}
        </View>
        <Text className="text-text-muted text-xs">{label}</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-text-secondary text-sm">{label}</Text>
      <View className="flex-row items-center gap-2">
        <Text
          className={`text-base font-semibold ${highlightClass[highlight]}`}
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {value}
        </Text>
        {trailing ?? null}
      </View>
    </View>
  );
}
