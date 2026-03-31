/**
 * Types de la base de données Supabase.
 *
 * Écrits manuellement à partir du schéma SQL (migration-part1.sql).
 * Quand la Supabase CLI sera configurée, ce fichier sera remplacé
 * par le fichier auto-généré via `npx supabase gen types typescript`.
 *
 * Conventions :
 * - Row    = ce qu'on lit depuis la DB (SELECT)
 * - Insert = ce qu'on envoie pour créer (INSERT)
 * - Update = ce qu'on envoie pour modifier (UPDATE, tout optionnel)
 */

// ─── PROFILES ───

export type ProfileRow = {
  id: string;
  pseudo: string;
  initials: string;
  color: string;
  avatar_url: string | null;
  created_at: string;
};

export type ProfileInsert = {
  id: string;
  pseudo: string;
  initials: string;
  color: string;
  avatar_url?: string | null;
};

export type ProfileUpdate = {
  pseudo?: string;
  initials?: string;
  color?: string;
  avatar_url?: string | null;
};

// ─── LEAGUES ───

export type LeagueRow = {
  id: string;
  name: string;
  emoji: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type LeagueInsert = {
  name: string;
  emoji?: string;
  invite_code: string;
  created_by: string;
};

export type LeagueUpdate = {
  name?: string;
  emoji?: string;
};

// ─── LEAGUE_MEMBERS ───

export type LeagueMemberRow = {
  id: string;
  league_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  invited_by: string | null;
  joined_at: string;
};

export type LeagueMemberInsert = {
  league_id: string;
  user_id: string;
  role?: "owner" | "admin" | "member";
  invited_by?: string | null;
};

// ─── MATCHES ───

export type MatchRow = {
  id: string;
  league_id: string;
  played_at: string;
  recorded_by: string;
  team_a_player_1: string;
  team_a_player_2: string;
  team_b_player_1: string;
  team_b_player_2: string;
  score_set_1_a: number;
  score_set_1_b: number;
  score_set_2_a: number;
  score_set_2_b: number;
  score_set_3_a: number | null;
  score_set_3_b: number | null;
  winner: "team_a" | "team_b";
  created_at: string;
};

export type MatchInsert = {
  league_id: string;
  played_at?: string;
  recorded_by: string;
  team_a_player_1: string;
  team_a_player_2: string;
  team_b_player_1: string;
  team_b_player_2: string;
  score_set_1_a: number;
  score_set_1_b: number;
  score_set_2_a: number;
  score_set_2_b: number;
  score_set_3_a?: number | null;
  score_set_3_b?: number | null;
  winner: "team_a" | "team_b";
};

// ─── BADGES ───

export type BadgeRow = {
  id: string;
  name: string;
  description: string;
  category: "initiation" | "volume" | "performance" | "serie" | "moment" | "classement" | "social";
  icon: string;
};

// ─── USER_BADGES ───

export type UserBadgeRow = {
  id: string;
  user_id: string;
  badge_id: string;
  league_id: string;
  earned_at: string;
};

export type UserBadgeInsert = {
  user_id: string;
  badge_id: string;
  league_id: string;
};

// ─── PUSH_TOKENS ───

export type PushTokenRow = {
  id: string;
  user_id: string;
  token: string;
  platform: "ios" | "android";
  created_at: string;
};

export type PushTokenInsert = {
  user_id: string;
  token: string;
  platform: "ios" | "android";
};

// ─── VUE : LEAGUE_PLAYER_SUMMARY ───

export type LeaguePlayerSummaryRow = {
  league_id: string;
  user_id: string;
  total_matches: number;
  wins: number;
  losses: number;
};
