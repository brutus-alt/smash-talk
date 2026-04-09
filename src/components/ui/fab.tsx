import { Pressable, Text, Animated, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { usePressScale } from "../../lib/animations";
import { hapticMedium } from "../../lib/haptics";
import { colors, glows } from "../../lib/theme";

/**
 * FAB — Floating Action Button pour ajout de match.
 *
 * Design premium :
 * - Pill allongee avec icone + label
 * - Gradient signature vert -> cyan
 * - Glow vert sous le bouton
 * - Press scale animation
 * - Position bas-droite, au-dessus de la tab bar
 *
 * Plus moderne qu'un FAB rond classique : suit les patterns Linear/Arc/Notion 2024+.
 */

type FABProps = {
  onPress: () => void;
  label?: string;
};

export function FAB({ onPress, label = "Match" }: FABProps) {
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.94);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 102,
          right: 16,
        },
        glows.accent,
        pressStyle,
      ]}
    >
      <Pressable
        onPress={() => {
          hapticMedium();
          onPress();
        }}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <LinearGradient
          colors={colors.gradient.primary as unknown as string[]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 18,
            paddingVertical: 14,
            borderRadius: 999,
          }}
        >
          <Ionicons name="add" size={22} color={colors.surface.base} />
          <Text
            style={{
              color: colors.surface.base,
              fontSize: 15,
              fontWeight: "800",
              letterSpacing: -0.2,
            }}
          >
            {label}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
