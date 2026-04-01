import { View, Text } from "react-native";
import { Card, Pill } from "./ui";
import type { RankedPlayerResult } from "../domain/ranking";

/**
 * TensionCard — messages dynamiques de tension/engagement.
 *
 * Génère des phrases chambreuses basées sur l'état du classement :
 * - Qui est en tête
 * - Qui menace qui
 * - Séries en cours
 * - Rivalités proches
 *
 * S'affiche sur la Home, sous le classement.
 */

type PlayerInfo = {
  userId: string;
  pseudo: string;
};

type TensionCardProps = {
  rankings: RankedPlayerResult[];
  players: Map<string, PlayerInfo>;
  currentUserId: string;
};

/**
 * Génère les messages de tension à partir du classement.
 * Retourne un tableau de messages avec emoji + texte.
 */
function generateTensionMessages(
  rankings: RankedPlayerResult[],
  players: Map<string, PlayerInfo>,
  currentUserId: string
): { emoji: string; text: string; variant: "accent" | "danger" | "warning" }[] {
  const messages: { emoji: string; text: string; variant: "accent" | "danger" | "warning" }[] = [];
  if (rankings.length < 2) return messages;

  const getName = (userId: string) => players.get(userId)?.pseudo ?? "???";
  const myRank = rankings.find((r) => r.userId === currentUserId);

  // Leader message
  const leader = rankings[0];
  if (leader) {
    if (leader.userId === currentUserId) {
      messages.push({
        emoji: "👑",
        text: "Tu domines la ligue. Mais pour combien de temps ?",
        variant: "warning",
      });
    } else {
      messages.push({
        emoji: "👑",
        text: `${getName(leader.userId)} est en tête. Quelqu'un va le détrôner ?`,
        variant: "warning",
      });
    }
  }

  // Threat message - who is close to overtaking
  if (myRank && myRank.rank > 1) {
    const above = rankings.find((r) => r.rank === myRank.rank - 1);
    if (above) {
      const winsGap = above.wins - myRank.wins;
      if (winsGap <= 2) {
        messages.push({
          emoji: "🎯",
          text: `Plus que ${winsGap} victoire${winsGap > 1 ? "s" : ""} pour dépasser ${getName(above.userId)}.`,
          variant: "accent",
        });
      }
    }
  }

  // Someone threatening current user
  if (myRank && myRank.rank < rankings.length) {
    const below = rankings.find((r) => r.rank === myRank.rank + 1);
    if (below) {
      const winsGap = myRank.wins - below.wins;
      if (winsGap <= 1) {
        messages.push({
          emoji: "⚠️",
          text: `${getName(below.userId)} est juste derrière toi. Attention.`,
          variant: "danger",
        });
      }
    }
  }

  // Hot streak
  const hotStreak = rankings.find(
    (r) => r.currentStreak >= 3 && r.currentStreakType === "win"
  );
  if (hotStreak) {
    const name = getName(hotStreak.userId);
    const isSelf = hotStreak.userId === currentUserId;
    messages.push({
      emoji: "🔥",
      text: isSelf
        ? `${hotStreak.currentStreak} victoires d'affilée. Personne ne t'arrête.`
        : `${name} enchaîne ${hotStreak.currentStreak} victoires. Qui va l'arrêter ?`,
      variant: "accent",
    });
  }

  // Losing streak
  const coldStreak = rankings.find(
    (r) => r.currentStreak >= 3 && r.currentStreakType === "loss"
  );
  if (coldStreak) {
    const name = getName(coldStreak.userId);
    const isSelf = coldStreak.userId === currentUserId;
    messages.push({
      emoji: "💀",
      text: isSelf
        ? `${coldStreak.currentStreak} défaites. C'est le moment de la revanche.`
        : `${name} coule. ${coldStreak.currentStreak} défaites d'affilée.`,
      variant: "danger",
    });
  }

  // Max 3 messages
  return messages.slice(0, 3);
}

export function TensionCard({ rankings, players, currentUserId }: TensionCardProps) {
  const messages = generateTensionMessages(rankings, players, currentUserId);

  if (messages.length === 0) return null;

  return (
    <Card variant="outlined">
      <View style={{ gap: 12 }}>
        {messages.map((msg, i) => (
          <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 20 }}>{msg.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  lineHeight: 18,
                  color:
                    msg.variant === "accent" ? "#4ADE80" :
                    msg.variant === "danger" ? "#F87171" :
                    "#FBBF24",
                }}
              >
                {msg.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
