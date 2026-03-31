/**
 * Calcul de stats — fonctions pures (Architecture §9).
 *
 * computePlayerStats : stats individuelles d'un joueur dans une ligue
 * computeH2H : bilan head-to-head entre deux joueurs
 *
 * Zéro React, zéro Supabase. Testable unitairement.
 */

import type { MatchRow } from "../lib/database.types";
import {
  getPlayerResult,
  getPlayerMatches,
  getH2HMatches,
  getMatchSets,
} from "./match-utils";

export type PlayerStatsResult = {
  userId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  currentStreakType: "win" | "loss" | "none";
  bestWinStreak: number;
  totalSetsWon: number;
  totalSetsLost: number;
};

export type H2HResult = {
  playerAId: string;
  playerBId: string;
  playerAWins: number;
  playerBWins: number;
  totalMatches: number;
  lastMatchDate: string | null;
};

/**
 * Calcule les stats complètes d'un joueur dans une ligue.
 */
export function computePlayerStats(
  allMatches: MatchRow[],
  playerId: string
): PlayerStatsResult {
  const playerMatches = getPlayerMatches(allMatches, playerId);

  // Trier par date croissante pour calculer les séries
  const sorted = [...playerMatches].sort(
    (a, b) => new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
  );

  let wins = 0;
  let losses = 0;
  let totalSetsWon = 0;
  let totalSetsLost = 0;
  let bestWinStreak = 0;
  let currentWinStreak = 0;

  for (const match of sorted) {
    const result = getPlayerResult(match, playerId);
    if (!result) continue;

    if (result.won) {
      wins++;
      currentWinStreak++;
      if (currentWinStreak > bestWinStreak) {
        bestWinStreak = currentWinStreak;
      }
    } else {
      losses++;
      currentWinStreak = 0;
    }

    // Compter les sets gagnés/perdus
    const sets = getMatchSets(match);
    for (const set of sets) {
      if (result.team === "a") {
        if (set.a > set.b) totalSetsWon++;
        else if (set.b > set.a) totalSetsLost++;
      } else {
        if (set.b > set.a) totalSetsWon++;
        else if (set.a > set.b) totalSetsLost++;
      }
    }
  }

  const totalMatches = wins + losses;

  // Série en cours (depuis le match le plus récent)
  const reverseSorted = [...sorted].reverse();
  let currentStreak = 0;
  let currentStreakType: "win" | "loss" | "none" = "none";

  if (reverseSorted.length > 0) {
    const firstResult = getPlayerResult(reverseSorted[0]!, playerId);
    if (firstResult) {
      currentStreakType = firstResult.won ? "win" : "loss";
      currentStreak = 1;

      for (let i = 1; i < reverseSorted.length; i++) {
        const r = getPlayerResult(reverseSorted[i]!, playerId);
        if (!r) break;
        if (
          (currentStreakType === "win" && r.won) ||
          (currentStreakType === "loss" && !r.won)
        ) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  return {
    userId: playerId,
    totalMatches,
    wins,
    losses,
    winRate: totalMatches > 0 ? wins / totalMatches : 0,
    currentStreak,
    currentStreakType,
    bestWinStreak,
    totalSetsWon,
    totalSetsLost,
  };
}

/**
 * Calcule le bilan head-to-head entre deux joueurs.
 * Ne compte que les matchs où ils sont dans des équipes opposées.
 */
export function computeH2H(
  allMatches: MatchRow[],
  playerAId: string,
  playerBId: string
): H2HResult {
  const h2hMatches = getH2HMatches(allMatches, playerAId, playerBId);

  let playerAWins = 0;
  let playerBWins = 0;

  // Trier par date pour trouver le dernier match
  const sorted = [...h2hMatches].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  for (const match of h2hMatches) {
    const resultA = getPlayerResult(match, playerAId);
    if (resultA?.won) {
      playerAWins++;
    } else {
      playerBWins++;
    }
  }

  return {
    playerAId,
    playerBId,
    playerAWins,
    playerBWins,
    totalMatches: h2hMatches.length,
    lastMatchDate: sorted[0]?.played_at ?? null,
  };
}
