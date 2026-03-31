import { View, Text } from "react-native";
import { forwardRef } from "react";
import { colors } from "../lib/theme";

/**
 * Template 1 — Résumé de match pour partage (Arbitrages §1.4).
 *
 * Format 9:16 (story Instagram) capturé via react-native-view-shot.
 * Fond sombre, accent couleur, logo Smash Talk.
 *
 * Ce composant est rendu hors écran, capturé en image, puis partagé.
 * Il ne doit pas utiliser NativeWind (le rendu hors écran ne le supporte pas toujours).
 * → On utilise des styles inline.
 */

type PlayerDisplay = {
  pseudo: string;
  initials: string;
  color: string;
};

type ShareMatchCardProps = {
  teamA: [PlayerDisplay, PlayerDisplay];
  teamB: [PlayerDisplay, PlayerDisplay];
  score: string; // "6-4 / 6-3"
  winner: "a" | "b";
  date: string;
};

export const ShareMatchCard = forwardRef<View, ShareMatchCardProps>(
  function ShareMatchCard({ teamA, teamB, score, winner, date }, ref) {
    const winnerColor = colors.accent.base;
    const loserOpacity = 0.5;

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
        <View style={{ alignItems: "center", gap: 4 }}>
          <Text style={{ fontSize: 32 }}>🏓</Text>
          <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: "800" }}>
            Smash Talk
          </Text>
          <Text style={{ color: colors.text.muted, fontSize: 12 }}>{date}</Text>
        </View>

        {/* Match result */}
        <View style={{ alignItems: "center", gap: 24 }}>
          {/* Team A */}
          <View style={{ alignItems: "center", gap: 8, opacity: winner === "a" ? 1 : loserOpacity }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <InitialsCircle {...teamA[0]} />
              <InitialsCircle {...teamA[1]} />
            </View>
            <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: "700" }}>
              {teamA[0].pseudo} + {teamA[1].pseudo}
            </Text>
            {winner === "a" ? (
              <Text style={{ color: winnerColor, fontSize: 14, fontWeight: "700" }}>VICTOIRE ✓</Text>
            ) : null}
          </View>

          {/* Score */}
          <Text style={{ color: colors.text.primary, fontSize: 36, fontWeight: "900", letterSpacing: 2 }}>
            {score}
          </Text>

          {/* Team B */}
          <View style={{ alignItems: "center", gap: 8, opacity: winner === "b" ? 1 : loserOpacity }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <InitialsCircle {...teamB[0]} />
              <InitialsCircle {...teamB[1]} />
            </View>
            <Text style={{ color: colors.text.primary, fontSize: 16, fontWeight: "700" }}>
              {teamB[0].pseudo} + {teamB[1].pseudo}
            </Text>
            {winner === "b" ? (
              <Text style={{ color: winnerColor, fontSize: 14, fontWeight: "700" }}>VICTOIRE ✓</Text>
            ) : null}
          </View>
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

function InitialsCircle({ initials, color }: { initials: string; color: string }) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "700" }}>{initials}</Text>
    </View>
  );
}
