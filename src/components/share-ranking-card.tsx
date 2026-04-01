import { View, Text } from "react-native";
import { forwardRef } from "react";
import { colors } from "../lib/theme";

/**
 * Template 2 — Classement top 5 pour partage (Arbitrages §1.4).
 *
 * Redesign : podium pour top 3, rangées avec accent,
 * typo plus forte, barre accent top/bottom.
 * Styles inline uniquement.
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

const RANK_MEDALS = ["👑", "🥈", "🥉"];

export const ShareRankingCard = forwardRef<View, ShareRankingCardProps>(
  function ShareRankingCard({ leagueName, leagueEmoji, players }, ref) {
    const top5 = players.slice(0, 5);

    return (
      <View
        ref={ref}
        style={{
          width: 360,
          height: 640,
          backgroundColor: colors.surface.base,
          overflow: "hidden",
        }}
      >
        {/* Accent bar top */}
        <View style={{ height: 4, backgroundColor: colors.accent.base }} />

        {/* Header */}
        <View style={{ alignItems: "center", paddingTop: 24, gap: 4 }}>
          <Text style={{ fontSize: 28 }}>🏓</Text>
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 22,
              fontWeight: "900",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Smash Talk
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Text style={{ fontSize: 18 }}>{leagueEmoji}</Text>
            <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: "600" }}>
              {leagueName}
            </Text>
          </View>
          <Text
            style={{
              color: colors.accent.base,
              fontSize: 11,
              fontWeight: "800",
              letterSpacing: 2,
              marginTop: 4,
              textTransform: "uppercase",
            }}
          >
            Classement
          </Text>
        </View>

        {/* Rankings */}
        <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20, gap: 8 }}>
          {top5.map((player) => {
            const isTop3 = player.rank <= 3;
            const isFirst = player.rank === 1;

            return (
              <View
                key={player.rank}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: isFirst
                    ? colors.accent.muted
                    : colors.surface.card,
                  borderRadius: 14,
                  padding: 12,
                  borderWidth: isFirst ? 1 : 0,
                  borderColor: isFirst ? "rgba(34, 197, 94, 0.3)" : "transparent",
                }}
              >
                {/* Rank + medal */}
                <View style={{ width: 32, alignItems: "center" }}>
                  {isTop3 ? (
                    <Text style={{ fontSize: 18 }}>
                      {RANK_MEDALS[player.rank - 1]}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: colors.text.muted,
                      }}
                    >
                      {player.rank}
                    </Text>
                  )}
                </View>

                {/* Avatar */}
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: player.color,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: isFirst ? 2 : 0,
                    borderColor: isFirst ? colors.accent.base : "transparent",
                  }}
                >
                  <Text style={{ color: "#FFF", fontSize: 13, fontWeight: "800" }}>
                    {player.initials}
                  </Text>
                </View>

                {/* Name */}
                <Text
                  style={{
                    flex: 1,
                    color: colors.text.primary,
                    fontSize: 15,
                    fontWeight: isFirst ? "900" : "600",
                  }}
                >
                  {player.pseudo}
                </Text>

                {/* Win rate */}
                <Text
                  style={{
                    color: isFirst ? colors.accent.light : colors.text.primary,
                    fontSize: 16,
                    fontWeight: "900",
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {Math.round(player.winRate * 100)}%
                </Text>

                {/* W-L */}
                <Text
                  style={{
                    color: colors.text.muted,
                    fontSize: 10,
                    width: 36,
                    textAlign: "right",
                  }}
                >
                  {player.wins}V-{player.losses}D
                </Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingBottom: 24, gap: 4 }}>
          <Text style={{ color: colors.accent.base, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
            QUI DOMINE ?
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 9 }}>
            smashtalk.app
          </Text>
        </View>

        {/* Accent bar bottom */}
        <View style={{ height: 4, backgroundColor: colors.accent.base }} />
      </View>
    );
  }
);
