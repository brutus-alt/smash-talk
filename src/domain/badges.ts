/**
 * Badges — règles de détection et vérification (Audit v2 §14).
 *
 * 12 badges scindés en :
 * - 9 badges immédiats (vérifiés après chaque match)
 * - 3 badges différés (Fondateur, Recruteur, Sommet)
 *
 * Chaque badge a une fonction pure qui retourne true/false.
 * Zéro React, zéro Supabase. Testable unitairement.
 */

import type { MatchRow } from "../lib/database.types";
import { getPlayerResult, getPlayerMatches, getMatchSets } from "./match-utils";

// ─── CONTEXTE BADGE ───
// Construit à partir des données du joueur après un match.

export type BadgeContext = {
  /** Nombre total de matchs joués */
  totalMatches: number;
  /** Ratio de victoires (0 à 1) */
  winRate: number;
  /** Série actuelle de victoires */
  currentWinStreak: number;
  /** Le match en cours contient un set 6-0 (pour le joueur) */
  hasSixZeroSet: boolean;
  /** Le joueur a gagné après avoir perdu le 1er set */
  hasComeback: boolean;
  /** Nombre maximum de matchs contre un même adversaire */
  maxMatchesVsSameOpponent: number;
};

// ─── RÈGLES DES 9 BADGES IMMÉDIATS ───

export const IMMEDIATE_BADGE_RULES: Record<
  string,
  (ctx: BadgeContext) => boolean
> = {
  first_blood: (ctx) => ctx.totalMatches >= 1,
  marathon: (ctx) => ctx.totalMatches >= 25,
  centurion: (ctx) => ctx.totalMatches >= 100,
  win_machine: (ctx) => ctx.totalMatches >= 10 && ctx.winRate >= 0.7,
  unstoppable: (ctx) => ctx.currentWinStreak >= 5,
  legend: (ctx) => ctx.currentWinStreak >= 10,
  humiliation: (ctx) => ctx.hasSixZeroSet,
  comeback: (ctx) => ctx.hasComeback,
  rival: (ctx) => ctx.maxMatchesVsSameOpponent >= 10,
};

// Les 3 badges différés sont gérés par les actions spécifiques :
// - founder : vérifié dans create-league.action
// - recruiter : vérifié quand un invité rejoint
// - summit : vérifié après chaque mise à jour du classement

/**
 * Construit le BadgeContext pour un joueur à partir de ses matchs.
 */
export function buildBadgeContext(
  allMatches: MatchRow[],
  playerId: string,
  currentMatch: MatchRow
): BadgeContext {
  const playerMatches = getPlayerMatches(allMatches, playerId);
  const totalMatches = playerMatches.length;

  // Win rate
  let wins = 0;
  for (const m of playerMatches) {
    const result = getPlayerResult(m, playerId);
    if (result?.won) wins++;
  }
  const winRate = totalMatches > 0 ? wins / totalMatches : 0;

  // Série de victoires en cours (du plus récent au plus ancien)
  const sorted = [...playerMatches].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );
  let currentWinStreak = 0;
  for (const m of sorted) {
    const result = getPlayerResult(m, playerId);
    if (result?.won) {
      currentWinStreak++;
    } else {
      break;
    }
  }

  // 6-0 dans le match actuel
  const currentResult = getPlayerResult(currentMatch, playerId);
  const sets = getMatchSets(currentMatch);
  let hasSixZeroSet = false;
  if (currentResult) {
    for (const set of sets) {
      if (currentResult.team === "a" && set.a === 6 && set.b === 0) {
        hasSixZeroSet = true;
      }
      if (currentResult.team === "b" && set.b === 6 && set.a === 0) {
        hasSixZeroSet = true;
      }
    }
  }

  // Comeback : gagné le match après avoir perdu le 1er set
  let hasComeback = false;
  if (currentResult?.won && sets.length >= 2) {
    const firstSet = sets[0]!;
    const lostFirstSet =
      (currentResult.team === "a" && firstSet.b > firstSet.a) ||
      (currentResult.team === "b" && firstSet.a > firstSet.b);
    hasComeback = lostFirstSet;
  }

  // Max matchs contre un même adversaire
  const opponentCounts: Record<string, number> = {};
  for (const m of playerMatches) {
    const result = getPlayerResult(m, playerId);
    if (!result) continue;

    // Les adversaires sont les 2 joueurs de l'autre équipe
    const opponents =
      result.team === "a"
        ? [m.team_b_player_1, m.team_b_player_2]
        : [m.team_a_player_1, m.team_a_player_2];

    for (const opp of opponents) {
      opponentCounts[opp] = (opponentCounts[opp] ?? 0) + 1;
    }
  }
  const maxMatchesVsSameOpponent = Math.max(
    0,
    ...Object.values(opponentCounts)
  );

  return {
    totalMatches,
    winRate,
    currentWinStreak,
    hasSixZeroSet,
    hasComeback,
    maxMatchesVsSameOpponent,
  };
}

/**
 * Vérifie quels nouveaux badges un joueur a débloqué.
 * Compare les règles avec les badges déjà obtenus.
 *
 * Retourne la liste des IDs de badges nouvellement gagnés.
 */
export function checkNewBadges(
  context: BadgeContext,
  alreadyEarnedBadgeIds: string[]
): string[] {
  const newBadges: string[] = [];

  for (const [badgeId, rule] of Object.entries(IMMEDIATE_BADGE_RULES)) {
    // Déjà gagné → skip
    if (alreadyEarnedBadgeIds.includes(badgeId)) continue;

    // Tester la règle
    if (rule(context)) {
      newBadges.push(badgeId);
    }
  }

  return newBadges;
}
