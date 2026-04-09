import { Pressable, Text, ActivityIndicator, View, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { PressableProps } from "react-native";
import type { ReactNode } from "react";
import { colors, glows } from "../../lib/theme";
import { usePressScale } from "../../lib/animations";

/**
 * Button du design system — version premium.
 *
 * Variantes :
 * - primary   -> gradient vert -> cyan + glow vert. CTA principal.
 * - secondary -> fond elevated, bordure subtile.
 * - danger    -> fond rouge plein.
 * - ghost     -> transparent, hover elevated.
 *
 * Effets premium :
 * - Glow vert sous le primary (boxShadow)
 * - Press scale animation (Reanimated)
 * - Gradient direction diagonale
 *
 * Tailles :
 * - sm -> compact (dans les cards)
 * - md -> standard
 * - lg -> CTA plein ecran
 */

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

const sizeMap: Record<ButtonSize, { paddingX: number; paddingY: number; radius: number; fontSize: number }> = {
  sm: { paddingX: 14, paddingY: 8, radius: 12, fontSize: 14 },
  md: { paddingX: 20, paddingY: 12, radius: 14, fontSize: 16 },
  lg: { paddingX: 24, paddingY: 16, radius: 16, fontSize: 17 },
};

export function Button({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const { style: pressStyle, onPressIn, onPressOut } = usePressScale(0.97);
  const dims = sizeMap[size];

  const loaderColor =
    variant === "primary" ? colors.surface.base :
    variant === "danger" ? "#FFFFFF" :
    colors.text.primary;

  const textColor =
    variant === "primary" ? colors.surface.base :
    variant === "danger" ? "#FFFFFF" :
    variant === "ghost" ? colors.text.secondary :
    colors.text.primary;

  // Wrapper container : applique le glow + press scale
  const containerStyle = [
    {
      alignSelf: fullWidth ? ("stretch" as const) : ("flex-start" as const),
      opacity: isDisabled ? 0.4 : 1,
    },
    variant === "primary" && !isDisabled ? glows.accent : {},
    pressStyle,
  ];

  // Contenu interne du bouton
  const innerContent = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingHorizontal: dims.paddingX,
        paddingVertical: dims.paddingY,
      }}
    >
      {isLoading ? (
        <ActivityIndicator color={loaderColor} size="small" />
      ) : (
        <>
          {iconLeft}
          <Text
            style={{
              color: textColor,
              fontSize: dims.fontSize,
              fontWeight: "700",
              letterSpacing: -0.2,
            }}
          >
            {title}
          </Text>
          {iconRight}
        </>
      )}
    </View>
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        disabled={isDisabled}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...props}
      >
        {variant === "primary" ? (
          <LinearGradient
            colors={colors.gradient.primary as unknown as string[]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: dims.radius,
              overflow: "hidden",
            }}
          >
            {innerContent}
          </LinearGradient>
        ) : (
          <View
            style={{
              borderRadius: dims.radius,
              backgroundColor:
                variant === "secondary" ? colors.surface.elevated :
                variant === "danger" ? colors.danger.base :
                "transparent",
              borderWidth: variant === "secondary" ? 1 : 0,
              borderColor: colors.surface.border,
              overflow: "hidden",
            }}
          >
            {innerContent}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
