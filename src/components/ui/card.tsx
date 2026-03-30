import { View, Pressable } from "react-native";
import type { ViewProps, PressableProps } from "react-native";
import type { ReactNode } from "react";

/**
 * Card — conteneur de surface avec fond élevé.
 *
 * Variantes :
 * - default    → fond card, coins arrondis. Usage général.
 * - elevated   → fond elevated, pour modales ou cartes surélevées.
 * - outlined   → bordure visible, fond card. Pour distinguer des sections.
 * - pressable  → réagit au tap. Pour les lignes cliquables (match, joueur).
 */

type CardVariant = "default" | "elevated" | "outlined";

type BaseCardProps = {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
};

type StaticCardProps = BaseCardProps & ViewProps & { onPress?: never };
type PressableCardProps = BaseCardProps & Omit<PressableProps, "children"> & { onPress: () => void };

type CardProps = StaticCardProps | PressableCardProps;

const variantClass: Record<CardVariant, string> = {
  default: "bg-surface-card",
  elevated: "bg-surface-elevated",
  outlined: "bg-surface-card border border-surface-border",
};

export function Card({
  children,
  variant = "default",
  className = "",
  onPress,
  ...props
}: CardProps) {
  const baseClass = `rounded-xl px-4 py-3.5 ${variantClass[variant]} ${className}`;

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseClass}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        {...(props as PressableProps)}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClass} {...(props as ViewProps)}>
      {children}
    </View>
  );
}
