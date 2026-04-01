import { View, Text, Pressable, Modal } from "react-native";
import { Avatar } from "./ui";
import type { LeagueRow } from "../lib/database.types";

/**
 * LeagueSwitcher — modal overlay pour changer de ligue active.
 * Affiché quand l'utilisateur tape sur le chevron dans le LeagueHeader.
 *
 * Simple liste avec tap pour sélectionner.
 * Pas de bottom sheet externe — juste un Modal natif avec fond semi-transparent.
 */

type LeagueSwitcherProps = {
  visible: boolean;
  leagues: LeagueRow[];
  activeLeagueId: string;
  onSelect: (leagueId: string) => void;
  onClose: () => void;
  onCreateNew: () => void;
  onJoin: () => void;
};

export function LeagueSwitcher({
  visible,
  leagues,
  activeLeagueId,
  onSelect,
  onClose,
  onCreateNew,
  onJoin,
}: LeagueSwitcherProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/60 justify-end"
        onPress={onClose}
      >
        <Pressable
          className="bg-surface-card rounded-t-3xl px-5 pt-5 pb-10"
          onPress={() => {}} // empêcher la propagation du press
        >
          <View className="w-10 h-1 bg-surface-border rounded-full self-center mb-5" />

          <Text className="text-text text-lg font-bold mb-4">Tes ligues</Text>

          <View className="gap-2">
            {leagues.map((league) => {
              const isActive = league.id === activeLeagueId;
              return (
                <Pressable
                  key={league.id}
                  onPress={() => {
                    onSelect(league.id);
                    onClose();
                  }}
                  className={`
                    flex-row items-center gap-3 p-3 rounded-xl
                    ${isActive ? "bg-accent-muted" : "bg-surface-elevated"}
                  `}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <Text className="text-2xl">{league.emoji}</Text>
                  <Text className={`flex-1 text-base font-semibold ${isActive ? "text-accent" : "text-text"}`}>
                    {league.name}
                  </Text>
                  {isActive ? (
                    <Text className="text-accent text-xs font-bold">ACTIVE</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 mt-5">
            <Pressable
              onPress={() => { onClose(); onCreateNew(); }}
              className="flex-1 bg-surface-elevated py-3 rounded-xl items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-text text-sm font-semibold">+ Créer</Text>
            </Pressable>
            <Pressable
              onPress={() => { onClose(); onJoin(); }}
              className="flex-1 bg-surface-elevated py-3 rounded-xl items-center"
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text className="text-text text-sm font-semibold">Rejoindre</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
