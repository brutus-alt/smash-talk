import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { ModalHeader, Button, Avatar, Stepper, Card, Pill } from "../../components/ui";
import { useAuthStore } from "../../stores/auth.store";
import { useLeagueStore } from "../../stores/league.store";
import { useLeagueMembers } from "../../hooks/use-league-members";
import { useAddMatch } from "../../hooks/use-add-match";
import { determineWinner } from "../../domain/match-validation";
import type { SetScore } from "../../domain/types";

/**
 * Modale d'ajout de match — 3 étapes, branchée sur Supabase.
 * Utilise useLeagueMembers pour la sélection des joueurs.
 * Utilise useAddMatch pour l'insertion + badges + notif.
 */

type Step = 0 | 1 | 2;

export default function AddMatchScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const activeLeagueId = useLeagueStore((s) => s.activeLeagueId);
  const { data: members } = useLeagueMembers(activeLeagueId);
  const addMatch = useAddMatch();

  const [step, setStep] = useState<Step>(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [sets, setSets] = useState<SetScore[]>([
    { scoreA: 0, scoreB: 0 },
    { scoreA: 0, scoreB: 0 },
  ]);

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
        ? {
            ...s,
            [team === "a" ? "scoreA" : "scoreB"]: Math.max(
              0,
              Math.min(99, (team === "a" ? s.scoreA : s.scoreB) + delta)
            ),
          }
        : s
    ));
  };

  const getProfile = (id: string) => {
    const m = members?.find((m) => m.user_id === id);
    return {
      pseudo: m?.profile.pseudo ?? "???",
      initials: m?.profile.initials ?? "??",
      color: m?.profile.color ?? "#6B7280",
    };
  };

  const handleSubmit = async () => {
    if (!activeLeagueId || !userId || selected.length !== 4) return;

    const winner = determineWinner(sets);
    if (!winner) {
      Alert.alert("Score invalide", "Impossible de déterminer le gagnant. Vérifie les scores.");
      return;
    }

    try {
      await addMatch.mutateAsync({
        league_id: activeLeagueId,
        recorded_by: userId,
        team_a_player_1: selected[0]!,
        team_a_player_2: selected[1]!,
        team_b_player_1: selected[2]!,
        team_b_player_2: selected[3]!,
        score_set_1_a: sets[0]!.scoreA,
        score_set_1_b: sets[0]!.scoreB,
        score_set_2_a: sets[1]!.scoreA,
        score_set_2_b: sets[1]!.scoreB,
        score_set_3_a: sets[2]?.scoreA ?? null,
        score_set_3_b: sets[2]?.scoreB ?? null,
        winner,
      });

      router.back();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      Alert.alert("Erreur", message);
    }
  };

  const stepLabels = ["Équipes", "Score", "Confirmation"];
  const players = members ?? [];

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
            {players.map((member) => {
              const idx = selected.indexOf(member.user_id);
              const isSelected = idx !== -1;
              const teamLabel = idx === 0 || idx === 1 ? "A" : idx === 2 || idx === 3 ? "B" : null;

              return (
                <Pressable
                  key={member.user_id}
                  onPress={() => togglePlayer(member.user_id)}
                  className={`items-center gap-1.5 p-2 rounded-xl w-20 ${isSelected ? "bg-surface-elevated" : ""}`}
                >
                  <Avatar
                    initials={member.profile.initials}
                    color={member.profile.color}
                    size="lg"
                    ring={isSelected}
                  />
                  <Text className="text-text text-xs font-semibold">{member.profile.pseudo}</Text>
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
          <View className="flex-row justify-around">
            <View className="items-center gap-1">
              <View className="flex-row gap-1">
                <Avatar {...getProfile(selected[0] ?? "")} size="sm" />
                <Avatar {...getProfile(selected[1] ?? "")} size="sm" />
              </View>
              <Text className="text-text-secondary text-xs">Équipe A</Text>
            </View>
            <View className="items-center gap-1">
              <View className="flex-row gap-1">
                <Avatar {...getProfile(selected[2] ?? "")} size="sm" />
                <Avatar {...getProfile(selected[3] ?? "")} size="sm" />
              </View>
              <Text className="text-text-secondary text-xs">Équipe B</Text>
            </View>
          </View>

          {sets.map((set, idx) => (
            <Card key={idx} variant="outlined">
              <Text className="text-text-muted text-xs text-center mb-3">Set {idx + 1}</Text>
              <View className="flex-row items-center justify-around">
                <Stepper
                  value={set.scoreA}
                  onIncrement={() => updateSet(idx, "a", 1)}
                  onDecrement={() => updateSet(idx, "a", -1)}
                />
                <Text className="text-text-muted text-lg font-bold">—</Text>
                <Stepper
                  value={set.scoreB}
                  onIncrement={() => updateSet(idx, "b", 1)}
                  onDecrement={() => updateSet(idx, "b", -1)}
                />
              </View>
            </Card>
          ))}

          <View className="mt-auto mb-6">
            <Button title="Suivant" size="lg" fullWidth onPress={() => setStep(2)} />
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
                  {getProfile(selected[0] ?? "").pseudo} + {getProfile(selected[1] ?? "").pseudo}
                </Text>
                <Pill variant="accent">Équipe A</Pill>
              </View>
              <Text className="text-text-muted self-center">vs</Text>
              <View className="items-center gap-1">
                <Text className="text-text text-sm font-semibold">
                  {getProfile(selected[2] ?? "").pseudo} + {getProfile(selected[3] ?? "").pseudo}
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
                Set {idx + 1} : {set.scoreA} - {set.scoreB}
              </Text>
            ))}
          </Card>

          <View className="mt-auto mb-6 gap-3">
            <Button
              title="Valider le match ✓"
              size="lg"
              fullWidth
              isLoading={addMatch.isPending}
              onPress={handleSubmit}
            />
            <Button title="Modifier" variant="ghost" size="md" fullWidth onPress={() => setStep(0)} />
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
