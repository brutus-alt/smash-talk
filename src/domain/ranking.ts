/**
 * Calcul de classement — fonctions pures (Architecture §9).
 *
 * Classement = ratio victoires/matchs (Arbitrages §1.1).
 * Pas d'Elo au MVP.
 * Minimum 3 matchs pour apparaître (Architecture §9).
 * Départage par nombre de victoires.
 *
 * Zéro React, zéro Supabase. Testable unitairement.
 */

import type { LeaguePlayerSummaryRow } from "../lib/database.types";
import type { MatchRow } from "../lib/database.types";
import { getPlayerResult } from "./match-utils";
import { MIN_MATCHES_FOR_RANKING } from "../lib/constants";

export type RankedPlayerResult = {
  userId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
  currentStreak: number;
  currentStreakType: "win" | "loss" | "none";
};

/**
 * Calcule le classement à partir des résumés de la vue league_player_summary.
 * Tri : ratio décroissant, puis nombre de victoires décroissant.
 * Filtre : minimum MIN_MATCHES_FOR_RANKING matchs.
 */
export function computeRankings(
  summaries: LeaguePlayerSummaryRow[],
  matches: MatchRow[]
): RankedPlayerResult[] {
  // Filtrer les joueurs avec assez de matchs
  const eligible = summaries.filter(
    (s) => s.total_matches >= MIN_MATCHES_FOR_RANKING
  );

  // Calculer le ratio et la série pour chaque joueur
  const withStats = eligible.map((s) => {
    const winRate =
      s.total_matches > 0 ? s.wins / s.total_matches : 0;
    const streak = computeCurrentStreak(matches, s.user_id);

    return {
      userId: s.user_id,
      totalMatches: s.total_matches,
      wins: s.wins,
      losses: s.losses,
      winRate,
      currentStreak: streak.count,
      currentStreakType: streak.type,
    };
  });

  // Trier : ratio décroissant, puis victoires décroissantes
  withStats.sort((a, b) => {
    if (b.winRate !== a.winRate) return b.winRate - a.winRate;
    return b.wins - a.wins;
  });

  // Attribuer les rangs
  return withStats.map((player, index) => ({
    ...player,
    rank: index + 1,
  }));
}

/**
 * Calcule la série en cours d'un joueur (V ou D consécutives).
 * Parcourt les matchs du plus récent au plus ancien.
 */
export function computeCurrentStreak(
  matches: MatchRow[],
  playerId: string
): { count: number; type: "win" | "loss" | "none" } {
  // Trier les matchs par date décroissante
  const sorted = [...matches]
    .filter(
      (m) =>
        m.team_a_player_1 === playerId ||
        m.team_a_player_2 === playerId ||
        m.team_b_player_1 === playerId ||
        m.team_b_player_2 === playerId
    )
    .sort(
      (a, b) =>
        new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
    );

  if (sorted.length === 0) {
    return { count: 0, type: "none" };
  }

  const firstResult = getPlayerResult(sorted[0]!, playerId);
  if (!firstResult) return { count: 0, type: "none" };

  const streakType: "win" | "loss" = firstResult.won ? "win" : "loss";
  let count = 1;

  for (let i = 1; i < sorted.length; i++) {
    const result = getPlayerResult(sorted[i]!, playerId);
    if (!result) break;

    const isWin = result.won;
    if ((streakType === "win" && isWin) || (streakType === "loss" && !isWin)) {
      count++;
    } else {
      break;
    }
  }

  return { count, type: streakType };
}
