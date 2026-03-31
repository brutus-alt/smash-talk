/**
 * Hook : matchs d'une ligue.
 * Pont React ↔ TanStack Query ↔ matchesService.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { matchesService } from "../services/matches.service";

export function useMatches(leagueId: string | null) {
  return useQuery({
    queryKey: queryKeys.matches(leagueId ?? undefined),
    queryFn: () => matchesService.getByLeague(leagueId!),
    enabled: !!leagueId,
    staleTime: STALE_TIMES.matches,
  });
}
