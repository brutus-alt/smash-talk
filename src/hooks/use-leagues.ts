/**
 * Hook : ligues de l'utilisateur + mutations create/join.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { leaguesService } from "../services/leagues.service";
import { createLeagueAction } from "../actions/create-league.action";
import { joinLeagueAction } from "../actions/join-league.action";

export function useMyLeagues() {
  return useQuery({
    queryKey: queryKeys.leagues(),
    queryFn: () => leaguesService.getMyLeagues(),
    staleTime: STALE_TIMES.matches,
  });
}

export function useLeague(leagueId: string | null) {
  return useQuery({
    queryKey: ["league", leagueId],
    queryFn: () => leaguesService.getById(leagueId!),
    enabled: !!leagueId,
    staleTime: STALE_TIMES.matches,
  });
}

export function useCreateLeague() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createLeagueAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.leagues() });
    },
  });
}

export function useJoinLeague() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: joinLeagueAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.leagues() });
    },
  });
}

export function useLookupLeague() {
  return useMutation({
    mutationFn: (code: string) => leaguesService.getByInviteCode(code),
  });
}
