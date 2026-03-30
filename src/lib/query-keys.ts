/**
 * Clés TanStack Query centralisées (Audit v2 §13).
 *
 * Toutes les clés incluent leagueId pour que le changement
 * de ligue active invalide automatiquement le cache.
 */
export const queryKeys = {
  matches: (leagueId?: string) => ["matches", leagueId] as const,
  rankings: (leagueId?: string) => ["rankings", leagueId] as const,
  members: (leagueId?: string) => ["members", leagueId] as const,
  playerStats: (leagueId?: string, playerId?: string) =>
    ["playerStats", leagueId, playerId] as const,
  h2h: (leagueId?: string, p1?: string, p2?: string) =>
    ["h2h", leagueId, p1, p2] as const,
  badges: (userId?: string) => ["badges", userId] as const,
  leagues: () => ["leagues"] as const,
  profile: (userId?: string) => ["profile", userId] as const,
} as const;
