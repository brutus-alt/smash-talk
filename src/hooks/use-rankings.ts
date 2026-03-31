/**
 * Hook : classement d'une ligue.
 * Récupère les résumés depuis la vue SQL + les matchs pour les séries,
 * puis calcule le classement via domain/ranking.ts.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { matchesService } from "../services/matches.service";
import { computeRankings } from "../domain/ranking";

export function useRankings(leagueId: string | null) {
  return useQuery({
    queryKey: queryKeys.rankings(leagueId ?? undefined),
    queryFn: async () => {
      const [summaries, matches] = await Promise.all([
        matchesService.getLeaguePlayerSummary(leagueId!),
        matchesService.getByLeague(leagueId!),
      ]);
      return computeRankings(summaries, matches);
    },
    enabled: !!leagueId,
    staleTime: STALE_TIMES.rankings,
  });
}
