/**
 * Types dérivés du domaine (Audit v2 §8).
 *
 * Les types DB (tables Supabase) vivront dans lib/database.types.ts (générés).
 * Ici vivent les types calculés / affichés qui n'existent pas en base.
 */

/** Résultat d'un joueur dans un match (Audit v2 §5.1) */
export type PlayerMatchResult = {
  team: "a" | "b";
  won: boolean;
  isRecorder: boolean;
};

/** Joueur classé — une ligne dans le tableau de classement */
export type RankedPlayer = {
  userId: string;
  pseudo: string;
  initials: string;
  color: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  rank: number;
  previousRank: number | null;
  gapWithAbove: number | null;
  gapWithBelow: number | null;
  currentStreak: number;
  currentStreakType: "win" | "loss" | "none";
};

/** Stats d'un joueur dans une ligue */
export type PlayerStats = {
  userId: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  currentStreakType: "win" | "loss" | "none";
  bestStreak: number;
  totalSetsWon: number;
  totalSetsLost: number;
};

/** Résultat d'un head-to-head entre deux joueurs */
export type HeadToHeadResult = {
  playerAId: string;
  playerBId: string;
  playerAWins: number;
  playerBWins: number;
  totalMatches: number;
  lastMatchDate: string | null;
};

/** Score d'un set */
export type SetScore = {
  scoreA: number;
  scoreB: number;
};

/** Données du formulaire d'ajout de match (Audit v2 §16) */
export type MatchFormData = {
  teamAPlayer1: string;
  teamAPlayer2: string;
  teamBPlayer1: string;
  teamBPlayer2: string;
  playedAt: string;
  sets: SetScore[];
};

/** Badge affiché dans le profil */
export type BadgeDisplay = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  earnedAt: string | null; // null = pas encore gagné
};

/** Résumé joueur pour la vue SQL league_player_summary (Audit v2 §15) */
export type LeaguePlayerSummary = {
  leagueId: string;
  userId: string;
  totalMatches: number;
  wins: number;
  losses: number;
};
