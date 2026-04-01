import { Pressable, Text, Animated } from "react-native";
import { usePressScale } from "../../lib/animations";

/**
 * FAB — Floating Action Button pour l'ajout de match.
 *
 * Toujours visible au-dessus de la tab bar (Arbitrages §6.1).
 * Couleur accent forte. CTA principal de toute l'app.
 *
 * Animation : press scale (réduit à 0.9 au tap, rebond au relâchement).
 */

type FABProps = {
  onPress: () => void;
  label?: string;
};

export function FAB({ onPress, label = "+" }: FABProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.9);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 112,
          right: 20,
          elevation: 8,
          shadowColor: "#22C55E",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        pressStyle,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        className="w-14 h-14 rounded-full bg-accent items-center justify-center"
      >
        <Text className="text-surface text-2xl font-bold leading-none">
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
