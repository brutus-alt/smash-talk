import { View, Text, Pressable } from "react-native";

/**
 * SectionHeader — titre de section avec action optionnelle.
 *
 * Usages :
 * - Home : "Dernier match" / "Classement" / "Badges récents"
 * - Profil : "Statistiques" / "Badges (4/12)"
 * - Historique : "Mars 2026" (groupement par mois)
 *
 * L'action est un lien discret à droite ("Voir tout", "Filtrer", etc.)
 */

type SectionHeaderProps = {
  title: string;
  /** Sous-titre optionnel (ex : "4/12", "Cette semaine") */
  subtitle?: string;
  /** Label du lien d'action à droite */
  actionLabel?: string;
  onAction?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-baseline justify-between mb-2">
      <View className="flex-row items-baseline gap-2">
        <Text className="text-text text-base font-bold">{title}</Text>
        {subtitle ? (
          <Text className="text-text-muted text-sm">{subtitle}</Text>
        ) : null}
      </View>

      {actionLabel && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="text-accent text-sm font-semibold">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
