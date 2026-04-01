import { Animated, View } from "react-native";
import { useEffect, useRef } from "react";

/**
 * Skeleton — placeholder animé pour les états de chargement.
 *
 * Pulse d'opacité entre 0.3 et 0.7 pour simuler un chargement.
 * Remplace les ActivityIndicator pour un rendu plus premium.
 */

type SkeletonProps = {
  /** Largeur (nombre = px, string = Tailwind class) */
  width?: number | "full";
  /** Hauteur en px */
  height?: number;
  /** Border radius en px */
  radius?: number;
  /** Forme circulaire */
  circle?: boolean;
};

export function Skeleton({
  width = "full",
  height = 16,
  radius = 8,
  circle = false,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const size = circle ? height : undefined;

  return (
    <Animated.View
      style={{
        width: width === "full" ? "100%" : (circle ? size : width),
        height,
        borderRadius: circle ? height / 2 : radius,
        backgroundColor: "#1C1C2B",
        opacity,
      }}
    />
  );
}

/**
 * SkeletonRankingRow — placeholder pour une ligne de classement.
 */
export function SkeletonRankingRow() {
  return (
    <View className="flex-row items-center py-3 px-1 gap-3">
      <Skeleton width={28} height={20} radius={4} />
      <Skeleton circle height={40} />
      <View className="flex-1 gap-2">
        <Skeleton width={120} height={14} />
        <Skeleton width={80} height={10} />
      </View>
      <Skeleton width={40} height={16} radius={4} />
    </View>
  );
}

/**
 * SkeletonMatchCard — placeholder pour une carte de match.
 */
export function SkeletonMatchCard() {
  return (
    <View className="bg-surface-card rounded-xl p-4 gap-3">
      <Skeleton width={80} height={10} />
      <View className="flex-row items-center">
        <View className="flex-1 gap-2">
          <View className="flex-row items-center gap-2">
            <Skeleton circle height={28} />
            <Skeleton width={70} height={12} />
          </View>
          <View className="flex-row items-center gap-2">
            <Skeleton circle height={28} />
            <Skeleton width={60} height={12} />
          </View>
        </View>
        <Skeleton width={50} height={20} radius={4} />
        <View className="flex-1 items-end gap-2">
          <View className="flex-row items-center gap-2">
            <Skeleton width={70} height={12} />
            <Skeleton circle height={28} />
          </View>
          <View className="flex-row items-center gap-2">
            <Skeleton width={60} height={12} />
            <Skeleton circle height={28} />
          </View>
        </View>
      </View>
    </View>
  );
}
