/**
 * Domaine — logique métier pure (zéro React, zéro Supabase).
 * Chaque fichier est une collection de fonctions pures testables.
 */

// Types dérivés (calculés, pas en base)
export type {
  PlayerMatchResult,
  RankedPlayer,
  PlayerStats,
  HeadToHeadResult,
  SetScore,
  MatchFormData,
  BadgeDisplay,
  LeaguePlayerSummary,
} from "./types";

// Match utilities
export {
  getPlayerResult,
  getPlayerMatches,
  getH2HMatches,
  getMatchSets,
  getMatchPlayerIds,
} from "./match-utils";

// Match validation
export {
  determineWinner,
  validateMatchPlayers,
  validateMatchSets,
} from "./match-validation";

// Ranking
export {
  computeRankings,
  computeCurrentStreak,
} from "./ranking";
export type { RankedPlayerResult } from "./ranking";

// Stats
export {
  computePlayerStats,
  computeH2H,
} from "./stats";
export type { PlayerStatsResult, H2HResult } from "./stats";

// Badges
export {
  IMMEDIATE_BADGE_RULES,
  buildBadgeContext,
  checkNewBadges,
} from "./badges";
export type { BadgeContext } from "./badges";
