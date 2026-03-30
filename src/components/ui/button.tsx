import { Pressable, Text, ActivityIndicator, View } from "react-native";
import type { PressableProps } from "react-native";
import type { ReactNode } from "react";
import { colors } from "../../lib/theme";

/**
 * Bouton du design system.
 *
 * Variantes :
 * - primary   → fond accent vert, texte sombre. CTA principal.
 * - secondary → fond elevated, bordure subtile. Actions secondaires.
 * - danger    → fond rouge. Suppressions, actions destructives.
 * - ghost     → transparent. Actions tertiaires, liens inline.
 *
 * Tailles :
 * - sm → compact (dans les cartes)
 * - md → standard
 * - lg → plein écran, CTA de bas de page
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

const containerClass: Record<ButtonVariant, string> = {
  primary: "bg-accent",
  secondary: "bg-surface-elevated border border-surface-border",
  danger: "bg-danger",
  ghost: "bg-transparent",
};

const pressedClass: Record<ButtonVariant, string> = {
  primary: "bg-accent-dark",
  secondary: "bg-surface-card border border-surface-border",
  danger: "bg-danger-dark",
  ghost: "bg-surface-elevated",
};

const textClass: Record<ButtonVariant, string> = {
  primary: "text-surface font-bold",
  secondary: "text-text font-semibold",
  danger: "text-white font-bold",
  ghost: "text-text-secondary font-semibold",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 rounded-lg",
  md: "px-5 py-3 rounded-xl",
  lg: "px-6 py-4 rounded-xl",
};

const textSizeClass: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
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

  const loaderColor =
    variant === "primary" ? colors.surface.base :
    variant === "danger" ? "#FFFFFF" :
    colors.text.primary;

  return (
    <Pressable
      disabled={isDisabled}
      {...props}
    >
      {({ pressed }) => (
        <View
          className={`
            flex-row items-center justify-center gap-2
            ${sizeClass[size]}
            ${pressed && !isDisabled ? pressedClass[variant] : containerClass[variant]}
            ${fullWidth ? "w-full" : "self-start"}
            ${isDisabled ? "opacity-40" : ""}
          `}
        >
          {isLoading ? (
            <ActivityIndicator color={loaderColor} size="small" />
          ) : (
            <>
              {iconLeft ?? null}
              <Text className={`${textClass[variant]} ${textSizeClass[size]}`}>
                {title}
              </Text>
              {iconRight ?? null}
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}
