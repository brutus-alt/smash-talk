import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../lib/theme";

/**
 * ModalHeader — en-tête pour les modales plein écran.
 *
 * Usages :
 * - Ajout de match (modale 3 étapes)
 * - Paramètres ligue
 * - Toute modale push qui n'utilise pas le header de navigation par défaut.
 *
 * Composition : titre centré + bouton fermer à droite.
 * Le bouton fermer utilise une icône, pas du texte.
 */

type ModalHeaderProps = {
  title: string;
  onClose: () => void;
  /** Action à gauche (optionnelle, ex : "Retour" dans un flow multi-étapes) */
  leftLabel?: string;
  onLeft?: () => void;
};

export function ModalHeader({
  title,
  onClose,
  leftLabel,
  onLeft,
}: ModalHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Zone gauche */}
      <View className="w-16">
        {leftLabel && onLeft ? (
          <Pressable onPress={onLeft} hitSlop={8}>
            <Text className="text-accent text-base font-semibold">
              {leftLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Titre centré */}
      <Text className="text-text text-base font-bold flex-1 text-center">
        {title}
      </Text>

      {/* Bouton fermer */}
      <View className="w-16 items-end">
        <Pressable
          onPress={onClose}
          hitSlop={8}
          className="w-9 h-9 rounded-full bg-surface-elevated items-center justify-center"
        >
          <Ionicons name="close" size={18} color={colors.text.secondary} />
        </Pressable>
      </View>
    </View>
  );
}
