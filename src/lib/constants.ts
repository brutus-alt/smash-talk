/**
 * Constantes globales de l'application.
 * Source de vérité unique — aucune valeur magique dans le code.
 */

/** Pool de 12 couleurs contrastées pour les avatars joueurs (Arbitrages §6.3) */
export const PLAYER_COLORS = [
  "#EF4444", // rouge
  "#F97316", // orange
  "#EAB308", // jaune
  "#22C55E", // vert
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#3B82F6", // bleu
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#D946EF", // fuchsia
  "#EC4899", // rose
  "#F43F5E", // rose-rouge
] as const;

/** Nombre maximum de ligues par joueur au MVP */
export const MAX_LEAGUES_PER_PLAYER = 3;

/** Nombre minimum de matchs pour apparaître au classement (Architecture §9) */
export const MIN_MATCHES_FOR_RANKING = 3;

/** Durée de cache TanStack Query (en ms) */
export const STALE_TIMES = {
  matches: 5 * 60 * 1000, // 5 minutes
  rankings: 1 * 60 * 1000, // 1 minute
  members: 5 * 60 * 1000, // 5 minutes
  badges: 10 * 60 * 1000, // 10 minutes
  profile: 5 * 60 * 1000, // 5 minutes
} as const;

/** Longueur du code d'invitation de ligue */
export const INVITE_CODE_LENGTH = 8;
