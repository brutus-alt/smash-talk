import { View, Text } from "react-native";
import { Button } from "./button";

/**
 * EmptyState — affiché quand un écran n'a pas encore de données.
 * Chaque écran du MVP doit avoir un empty state (Architecture §21).
 *
 * Centré verticalement et horizontalement.
 * S'utilise à l'intérieur d'un <Screen> parent.
 *
 * Composition :
 *   emoji (optionnel)
 *   → titre
 *   → description
 *   → bouton CTA (optionnel)
 *   → lien secondaire (optionnel)
 */

type EmptyStateProps = {
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-3">
      {emoji ? <Text className="text-5xl mb-3">{emoji}</Text> : null}

      <Text className="text-text text-xl font-bold text-center">
        {title}
      </Text>

      <Text className="text-text-secondary text-base text-center leading-6 max-w-xs">
        {description}
      </Text>

      {actionLabel && onAction ? (
        <View className="mt-5 w-full items-center">
          <Button
            title={actionLabel}
            onPress={onAction}
            size="lg"
            fullWidth
          />
        </View>
      ) : null}

      {secondaryLabel && onSecondary ? (
        <Button
          title={secondaryLabel}
          variant="ghost"
          size="sm"
          onPress={onSecondary}
        />
      ) : null}
    </View>
  );
}
