import { Pressable, Text } from "react-native";

/**
 * FAB — Floating Action Button pour l'ajout de match.
 *
 * Toujours visible au-dessus de la tab bar (Arbitrages §6.1).
 * Couleur accent forte. C'est le CTA principal de toute l'app.
 *
 * Positionné en absolute dans le tabs layout,
 * pas dans un écran individuel.
 */

type FABProps = {
  onPress: () => void;
  /** Label alternatif (défaut : "+") */
  label?: string;
};

export function FAB({ onPress, label = "+" }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      className="
        absolute bottom-28 right-5
        w-14 h-14 rounded-full
        bg-accent items-center justify-center
      "
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        elevation: 8,
        shadowColor: "#22C55E",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      })}
    >
      <Text className="text-surface text-2xl font-bold leading-none">
        {label}
      </Text>
    </Pressable>
  );
}
