import { View, Text } from "react-native";
import { forwardRef } from "react";
import { colors } from "../lib/theme";

/**
 * Template 2 — Classement top 5 pour partage (Arbitrages §1.4).
 *
 * Format 9:16 (story) capturé via react-native-view-shot.
 * Styles inline (pas NativeWind) pour compatibilité rendu hors écran.
 */

type RankedPlayerDisplay = {
  rank: number;
  pseudo: string;
  initials: string;
  color: string;
  winRate: number;
  wins: number;
  losses: number;
};

type ShareRankingCardProps = {
  leagueName: string;
  leagueEmoji: string;
  players: RankedPlayerDisplay[];
};

export const ShareRankingCard = forwardRef<View, ShareRankingCardProps>(
  function ShareRankingCard({ leagueName, leagueEmoji, players }, ref) {
    return (
      <View
        ref={ref}
        style={{
          width: 360,
          height: 640,
          backgroundColor: colors.surface.base,
          padding: 32,
          justifyContent: "space-between",
        }}
      >
        {/* Header */}
        <View style={{ alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 32 }}>🏓</Text>
          <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: "800" }}>
            Smash Talk
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Text style={{ fontSize: 20 }}>{leagueEmoji}</Text>
            <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: "600" }}>
              {leagueName}
            </Text>
          </View>
        </View>

        {/* Ranking list */}
        <View style={{ gap: 12 }}>
          {players.slice(0, 5).map((player) => (
            <View
              key={player.rank}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: player.rank === 1 ? colors.accent.muted : colors.surface.card,
                borderRadius: 12,
                padding: 12,
              }}
            >
              {/* Rank */}
              <Text
                style={{
                  width: 24,
                  textAlign: "center",
                  fontSize: player.rank === 1 ? 20 : 16,
                  fontWeight: "800",
                  color: player.rank === 1 ? colors.warning.base : colors.text.muted,
                }}
              >
                {player.rank}
              </Text>

              {/* Avatar */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: player.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "700" }}>
                  {player.initials}
                </Text>
              </View>

              {/* Name */}
              <Text
                style={{
                  flex: 1,
                  color: colors.text.primary,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {player.pseudo}
              </Text>

              {/* Win rate */}
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: 15,
                  fontWeight: "800",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {Math.round(player.winRate * 100)}%
              </Text>

              {/* W-L */}
              <Text style={{ color: colors.text.muted, fontSize: 11, width: 40, textAlign: "right" }}>
                {player.wins}V-{player.losses}D
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: colors.text.muted, fontSize: 10 }}>
            smashtalk.app
          </Text>
        </View>
      </View>
    );
  }
);
