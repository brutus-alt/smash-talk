import { View } from "react-native";

/**
 * Divider — séparateur horizontal subtil.
 *
 * Utilisé à l'intérieur des cartes pour séparer des sections
 * sans casser le flux visuel. Couleur surface-border.
 */

type DividerProps = {
  className?: string;
};

export function Divider({ className = "" }: DividerProps) {
  return <View className={`h-px bg-surface-border my-2 ${className}`} />;
}
