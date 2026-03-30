import { TextInput, View, Text } from "react-native";
import type { TextInputProps } from "react-native";
import type { ReactNode } from "react";
import { colors } from "../../lib/theme";

/**
 * Input — champ texte du design system.
 *
 * Taille minimum 16pt (Arbitrages §6.2).
 * Fond elevated, coins arrondis, placeholder muted.
 *
 * Options :
 * - label    → libellé au-dessus
 * - error    → message d'erreur en rouge
 * - iconLeft → icône à gauche dans le champ (ex : loupe, code)
 * - maxLength + showCount → compteur de caractères
 */

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  iconLeft?: ReactNode;
  showCount?: boolean;
};

export function Input({
  label,
  error,
  iconLeft,
  showCount = false,
  maxLength,
  value,
  ...props
}: InputProps) {
  const hasError = Boolean(error);

  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-text-secondary text-sm font-medium">
          {label}
        </Text>
      ) : null}

      <View
        className={`
          flex-row items-center bg-surface-elevated rounded-xl
          ${hasError ? "border border-danger" : "border border-transparent"}
        `}
      >
        {iconLeft ? (
          <View className="pl-4">{iconLeft}</View>
        ) : null}

        <TextInput
          className={`
            flex-1 text-text text-base px-4 py-3.5
            ${iconLeft ? "pl-2" : ""}
          `}
          placeholderTextColor={colors.text.muted}
          selectionColor={colors.accent.base}
          value={value}
          maxLength={maxLength}
          {...props}
        />

        {showCount && maxLength ? (
          <Text className="text-text-muted text-xs pr-4">
            {(value ?? "").length}/{maxLength}
          </Text>
        ) : null}
      </View>

      {hasError ? (
        <Text className="text-danger text-xs">{error}</Text>
      ) : null}
    </View>
  );
}
