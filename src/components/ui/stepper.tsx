import { View, Text, Pressable } from "react-native";

/**
 * Stepper — +/- pour la saisie de score (Arbitrages §3.1).
 *
 * Pas de saisie clavier. Grandes zones de tap.
 * Chiffres en tabular-nums pour l'alignement quand
 * plusieurs steppers sont côte à côte (score set A vs set B).
 *
 * Utilisé exclusivement dans le flow d'ajout de match (étape 2).
 */

type StepperProps = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  label?: string;
};

export function Stepper({
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  label,
}: StepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View className="items-center gap-1.5">
      {label ? (
        <Text className="text-text-muted text-xs">{label}</Text>
      ) : null}

      <View className="flex-row items-center gap-3">
        <Pressable
          onPress={onDecrement}
          disabled={!canDecrement}
          className={`
            w-12 h-12 rounded-xl items-center justify-center
            bg-surface-elevated
            ${!canDecrement ? "opacity-30" : ""}
          `}
          style={({ pressed }) => ({
            opacity: pressed && canDecrement ? 0.7 : canDecrement ? 1 : 0.3,
          })}
        >
          <Text className="text-text text-xl font-bold">−</Text>
        </Pressable>

        <Text
          className="text-text text-4xl font-bold w-14 text-center"
          style={{ fontVariant: ["tabular-nums"] }}
        >
          {value}
        </Text>

        <Pressable
          onPress={onIncrement}
          disabled={!canIncrement}
          className={`
            w-12 h-12 rounded-xl items-center justify-center
            bg-surface-elevated
            ${!canIncrement ? "opacity-30" : ""}
          `}
          style={({ pressed }) => ({
            opacity: pressed && canIncrement ? 0.7 : canIncrement ? 1 : 0.3,
          })}
        >
          <Text className="text-text text-xl font-bold">+</Text>
        </Pressable>
      </View>
    </View>
  );
}
