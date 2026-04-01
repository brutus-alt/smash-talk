import { View, Text } from "react-native";
import { forwardRef } from "react";
import { colors } from "../lib/theme";

/**
 * Template 1 — Résumé de match pour partage (Arbitrages §1.4).
 *
 * Redesign : fond avec dégradé simulé (bandes de couleur),
 * score XXL, bannière de victoire, avatars plus gros.
 * Format 9:16 (story Instagram) + 1:1 (WhatsApp).
 *
 * Styles inline uniquement (pas de NativeWind pour le rendu hors écran).
 */

type PlayerDisplay = {
  pseudo: string;
  initials: string;
  color: string;
};

type ShareMatchCardProps = {
  teamA: [PlayerDisplay, PlayerDisplay];
  teamB: [PlayerDisplay, PlayerDisplay];
  score: string;
  winner: "a" | "b";
  date: string;
};

export const ShareMatchCard = forwardRef<View, ShareMatchCardProps>(
  function ShareMatchCard({ teamA, teamB, score, winner, date }, ref) {
    const winnerTeam = winner === "a" ? teamA : teamB;
    const loserTeam = winner === "a" ? teamB : teamA;

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
        {/* Gradient top bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.accent.base,
          }}
        />

        {/* Header */}
        <View style={{ alignItems: "center", paddingTop: 28, gap: 2 }}>
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
          <Text style={{ color: colors.text.muted, fontSize: 11, marginTop: 4 }}>
            {date}
          </Text>
        </View>

        {/* Score section - hero */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20 }}>
          {/* Winner banner */}
          <View
            style={{
              backgroundColor: colors.accent.muted,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: colors.accent.light,
                fontSize: 13,
                fontWeight: "800",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              🏆 {winnerTeam[0].pseudo} + {winnerTeam[1].pseudo}
            </Text>
          </View>

          {/* Score XXL */}
          <Text
            style={{
              color: colors.text.primary,
              fontSize: 52,
              fontWeight: "900",
              letterSpacing: 4,
              fontVariant: ["tabular-nums"],
            }}
          >
            {score}
          </Text>

          {/* VS line */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16, paddingHorizontal: 32 }}>
            {/* Winner side */}
            <View style={{ flex: 1, alignItems: "center", gap: 10 }}>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <AvatarCircle {...winnerTeam[0]} size={48} />
                <AvatarCircle {...winnerTeam[1]} size={48} />
              </View>
              <Text style={{ color: colors.text.primary, fontSize: 13, fontWeight: "700", textAlign: "center" }}>
                {winnerTeam[0].pseudo}{"\n"}{winnerTeam[1].pseudo}
              </Text>
            </View>

            {/* VS divider */}
            <View style={{ alignItems: "center", gap: 4 }}>
              <View style={{ width: 1, height: 24, backgroundColor: colors.surface.border }} />
              <Text style={{ color: colors.text.muted, fontSize: 11, fontWeight: "800" }}>VS</Text>
              <View style={{ width: 1, height: 24, backgroundColor: colors.surface.border }} />
            </View>

            {/* Loser side */}
            <View style={{ flex: 1, alignItems: "center", gap: 10, opacity: 0.45 }}>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <AvatarCircle {...loserTeam[0]} size={48} />
                <AvatarCircle {...loserTeam[1]} size={48} />
              </View>
              <Text style={{ color: colors.text.primary, fontSize: 13, fontWeight: "700", textAlign: "center" }}>
                {loserTeam[0].pseudo}{"\n"}{loserTeam[1].pseudo}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={{ alignItems: "center", paddingBottom: 24, gap: 4 }}>
          <Text style={{ color: colors.accent.base, fontSize: 11, fontWeight: "700", letterSpacing: 1 }}>
            CHAQUE MATCH COMPTE
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 9 }}>
            smashtalk.app
          </Text>
        </View>

        {/* Gradient bottom bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.accent.base,
          }}
        />
      </View>
    );
  }
);

function AvatarCircle({
  initials,
  color,
  size = 44,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.15)",
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: size * 0.3, fontWeight: "800" }}>
        {initials}
      </Text>
    </View>
  );
}
