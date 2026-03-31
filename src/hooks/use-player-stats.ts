/**
 * Hook : stats d'un joueur dans une ligue.
 * Récupère les matchs et calcule via domain/stats.ts.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { matchesService } from "../services/matches.service";
import { computePlayerStats } from "../domain/stats";

export function usePlayerStats(leagueId: string | null, playerId: string | null) {
  return useQuery({
    queryKey: queryKeys.playerStats(leagueId ?? undefined, playerId ?? undefined),
    queryFn: async () => {
      const matches = await matchesService.getByLeague(leagueId!);
      return computePlayerStats(matches, playerId!);
    },
    enabled: !!leagueId && !!playerId,
    staleTime: STALE_TIMES.matches,
  });
}
