import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../lib/theme";

/**
 * MeshGradient — fond decoratif premium.
 *
 * Simule un mesh gradient avec deux LinearGradient superposes :
 * - Un radial vert dans le coin haut-droit
 * - Un radial cyan dans le coin bas-gauche
 *
 * Ne bloque PAS les interactions (pointerEvents none).
 * S'utilise en absolute fill derriere le contenu.
 */

type MeshGradientProps = {
  intensity?: "subtle" | "normal" | "strong";
};

const intensityMap = {
  subtle: { accentOpacity: 0.10, cyanOpacity: 0.08 },
  normal: { accentOpacity: 0.18, cyanOpacity: 0.14 },
  strong: { accentOpacity: 0.30, cyanOpacity: 0.22 },
};

export function MeshGradient({ intensity = "normal" }: MeshGradientProps) {
  const { accentOpacity, cyanOpacity } = intensityMap[intensity];

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Glow vert haut-droit */}
      <LinearGradient
        colors={[
          `rgba(34, 197, 94, ${accentOpacity})`,
          "rgba(34, 197, 94, 0)",
        ]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.3, y: 0.6 }}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "85%",
          height: "55%",
        }}
      />
      {/* Glow cyan bas-gauche */}
      <LinearGradient
        colors={[
          `rgba(6, 214, 160, ${cyanOpacity})`,
          "rgba(6, 214, 160, 0)",
        ]}
        start={{ x: 0, y: 1 }}
        end={{ x: 0.7, y: 0.4 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "85%",
          height: "55%",
        }}
      />
    </View>
  );
}
