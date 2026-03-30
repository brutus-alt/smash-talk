import { View, Text } from "react-native";
import type { ReactNode } from "react";

/**
 * Pill — petit tag coloré pour les indicateurs de statut.
 *
 * Usages :
 * - Série en cours (🔥 5V) → variant "accent"
 * - Série de défaites → variant "danger"
 * - Mouvement classement (↑ +2) → variant "accent"
 * - Badge catégorie → variant "muted"
 * - Position classement (#1) → variant "warning"
 */

type PillVariant = "accent" | "danger" | "warning" | "muted";

type PillProps = {
  children: ReactNode;
  variant?: PillVariant;
  /** Icône ou emoji avant le texte */
  icon?: string;
};

const variantClass: Record<PillVariant, { bg: string; text: string }> = {
  accent: { bg: "bg-accent-muted", text: "text-accent-light" },
  danger: { bg: "bg-danger-muted", text: "text-danger-light" },
  warning: { bg: "bg-warning-muted", text: "text-warning-light" },
  muted: { bg: "bg-surface-elevated", text: "text-text-secondary" },
};

export function Pill({ children, variant = "muted", icon }: PillProps) {
  const conf = variantClass[variant];

  return (
    <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-lg ${conf.bg}`}>
      {icon ? <Text className="text-xs">{icon}</Text> : null}
      <Text className={`text-xs font-semibold ${conf.text}`}>{children}</Text>
    </View>
  );
}
