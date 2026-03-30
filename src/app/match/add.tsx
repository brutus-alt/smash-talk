import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { ModalHeader, Button, Avatar, Stepper, Card, Pill } from "../../components/ui";
import { PLAYERS, getPlayer } from "../../lib/mock-data";

/**
 * Modale d'ajout de match — 3 étapes mockées (Arbitrages §3).
 * Étape 1 : Sélection des 4 joueurs
 * Étape 2 : Score par set (steppers)
 * Étape 3 : Confirmation
 */

type Step = 0 | 1 | 2;

export default function AddMatchScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [sets, setSets] = useState([{ a: 0, b: 0 }, { a: 0, b: 0 }]);

  const togglePlayer = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  const updateSet = (idx: number, team: "a" | "b", delta: number) => {
    setSets(sets.map((s, i) =>
      i === idx
        ? { ...s, [team]: Math.max(0, Math.min(99, s[team] + delta)) }
        : s
    ));
  };

  const stepLabels = ["Équipes", "Score", "Confirmation"];

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ModalHeader
        title={stepLabels[step] ?? ""}
        onClose={() => router.back()}
        leftLabel={step > 0 ? "Retour" : undefined}
        onLeft={step > 0 ? () => setStep((step - 1) as Step) : undefined}
      />

      {/* Step indicator */}
      <View className="flex-row px-6 gap-2 mb-4">
        {[0, 1, 2].map((s) => (
          <View
            key={s}
            className={`flex-1 h-1 rounded-full ${s <= step ? "bg-accent" : "bg-surface-elevated"}`}
          />
        ))}
      </View>

      {/* Step 0 — Team selection */}
      {step === 0 ? (
        <View className="flex-1 px-6 gap-4">
          <Text className="text-text-secondary text-sm">
            Sélectionne 4 joueurs. Les 2 premiers = Équipe A, les 2 suivants = Équipe B.
          </Text>

          <View className="flex-row flex-wrap gap-3 justify-center">
            {PLAYERS.map((player) => {
              const idx = selected.indexOf(player.id);
              const isSelected = idx !== -1;
              const teamLabel = idx === 0 || idx === 1 ? "A" : idx === 2 || idx === 3 ? "B" : null;

              return (
                <Pressable
                  key={player.id}
                  onPress={() => togglePlayer(player.id)}
                  className={`items-center gap-1.5 p-2 rounded-xl w-20 ${isSelected ? "bg-surface-elevated" : ""}`}
                >
                  <Avatar
                    initials={player.initials}
                    color={player.color}
                    size="lg"
                    ring={isSelected}
                  />
                  <Text className="text-text text-xs font-semibold">{player.pseudo}</Text>
                  {teamLabel ? (
                    <Pill variant={teamLabel === "A" ? "accent" : "warning"}>{teamLabel}</Pill>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View className="mt-auto mb-6">
            <Button
              title="Suivant"
              size="lg"
              fullWidth
              disabled={selected.length !== 4}
              onPress={() => setStep(1)}
            />
          </View>
        </View>
      ) : null}

      {/* Step 1 — Score entry */}
      {step === 1 ? (
        <View className="flex-1 px-6 gap-6">
          {/* Team labels */}
          <View className="flex-row justify-around">
            <View className="items-center gap-1">
              <View className="flex-row gap-1">
                <Avatar initials={getPlayer(selected[0] ?? "p1").initials} color={getPlayer(selected[0] ?? "p1").color} size="sm" />
                <Avatar initials={getPlayer(selected[1] ?? "p2").initials} color={getPlayer(selected[1] ?? "p2").color} size="sm" />
              </View>
              <Text className="text-text-secondary text-xs">Équipe A</Text>
            </View>
            <View className="items-center gap-1">
              <View className="flex-row gap-1">
                <Avatar initials={getPlayer(selected[2] ?? "p3").initials} color={getPlayer(selected[2] ?? "p3").color} size="sm" />
                <Avatar initials={getPlayer(selected[3] ?? "p4").initials} color={getPlayer(selected[3] ?? "p4").color} size="sm" />
              </View>
              <Text className="text-text-secondary text-xs">Équipe B</Text>
            </View>
          </View>

          {/* Sets */}
          {sets.map((set, idx) => (
            <Card key={idx} variant="outlined">
              <Text className="text-text-muted text-xs text-center mb-3">Set {idx + 1}</Text>
              <View className="flex-row items-center justify-around">
                <Stepper
                  value={set.a}
                  onIncrement={() => updateSet(idx, "a", 1)}
                  onDecrement={() => updateSet(idx, "a", -1)}
                />
                <Text className="text-text-muted text-lg font-bold">—</Text>
                <Stepper
                  value={set.b}
                  onIncrement={() => updateSet(idx, "b", 1)}
                  onDecrement={() => updateSet(idx, "b", -1)}
                />
              </View>
            </Card>
          ))}

          <View className="mt-auto mb-6">
            <Button
              title="Suivant"
              size="lg"
              fullWidth
              onPress={() => setStep(2)}
            />
          </View>
        </View>
      ) : null}

      {/* Step 2 — Confirmation */}
      {step === 2 ? (
        <View className="flex-1 px-6 gap-6">
          <Card variant="elevated">
            <Text className="text-text-muted text-xs text-center mb-3">Récapitulatif</Text>

            <View className="flex-row justify-around mb-4">
              <View className="items-center gap-1">
                <Text className="text-text text-sm font-semibold">
                  {getPlayer(selected[0] ?? "p1").pseudo} + {getPlayer(selected[1] ?? "p2").pseudo}
                </Text>
                <Pill variant="accent">Équipe A</Pill>
              </View>
              <Text className="text-text-muted self-center">vs</Text>
              <View className="items-center gap-1">
                <Text className="text-text text-sm font-semibold">
                  {getPlayer(selected[2] ?? "p3").pseudo} + {getPlayer(selected[3] ?? "p4").pseudo}
                </Text>
                <Pill variant="warning">Équipe B</Pill>
              </View>
            </View>

            {sets.map((set, idx) => (
              <Text
                key={idx}
                className="text-text text-center text-lg font-bold"
                style={{ fontVariant: ["tabular-nums"] }}
              >
                Set {idx + 1} : {set.a} - {set.b}
              </Text>
            ))}
          </Card>

          <View className="mt-auto mb-6 gap-3">
            <Button
              title="Valider le match ✓"
              size="lg"
              fullWidth
              onPress={() => {
                // TODO: addMatchAction
                router.back();
              }}
            />
            <Button
              title="Modifier"
              variant="ghost"
              size="md"
              fullWidth
              onPress={() => setStep(0)}
            />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
