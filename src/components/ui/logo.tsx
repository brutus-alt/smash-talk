import { View } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "../../lib/theme";

/**
 * Logo Smash Talk — monogramme "ST" dans un carre arrondi.
 *
 * SVG vectoriel, sans dependance externe.
 * Carre arrondi avec gradient signature vert -> cyan.
 * Lettres "ST" en blanc, font weight 900.
 *
 * Tailles :
 * - sm  : 32px (header tab bar)
 * - md  : 48px (cards, modales)
 * - lg  : 72px (login, branding)
 * - xl  : 120px (hero, splash)
 */

type LogoSize = "sm" | "md" | "lg" | "xl";

const SIZES: Record<LogoSize, number> = {
  sm: 32,
  md: 48,
  lg: 72,
  xl: 120,
};

type LogoProps = {
  size?: LogoSize;
  monochrome?: boolean;
};

export function Logo({ size = "md", monochrome = false }: LogoProps) {
  const px = SIZES[size];

  return (
    <View style={{ width: px, height: px }}>
      <Svg width={px} height={px} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.accent.base} />
            <Stop offset="100%" stopColor={colors.cyan.base} />
          </LinearGradient>
          <LinearGradient id="logoShine" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
            <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Carre arrondi avec gradient */}
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="24"
          ry="24"
          fill={monochrome ? colors.text.primary : "url(#logoGradient)"}
        />

        {/* Overlay shine pour le relief */}
        <Rect
          x="0"
          y="0"
          width="100"
          height="100"
          rx="24"
          ry="24"
          fill="url(#logoShine)"
        />

        {/* Lettres ST */}
        <SvgText
          x="50"
          y="50"
          textAnchor="middle"
          fontSize="52"
          fontWeight="900"
          fontFamily="System"
          fill={monochrome ? colors.surface.base : "#FFFFFF"}
          dy="18"
          letterSpacing="-3"
        >
          ST
        </SvgText>
      </Svg>
    </View>
  );
}
