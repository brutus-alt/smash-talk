/**
 * Hook : membres d'une ligue avec leurs profils.
 * Récupère les members puis les profils associés.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { leaguesService } from "../services/leagues.service";
import { profilesService } from "../services/profiles.service";
import type { ProfileRow, LeagueMemberRow } from "../lib/database.types";

export type MemberWithProfile = LeagueMemberRow & {
  profile: ProfileRow;
};

export function useLeagueMembers(leagueId: string | null) {
  return useQuery({
    queryKey: queryKeys.members(leagueId ?? undefined),
    queryFn: async (): Promise<MemberWithProfile[]> => {
      const members = await leaguesService.getMembers(leagueId!);
      const userIds = members.map((m) => m.user_id);
      const profiles = await profilesService.getByIds(userIds);

      const profileMap = new Map(profiles.map((p) => [p.id, p]));

      return members
        .map((m) => {
          const profile = profileMap.get(m.user_id);
          if (!profile) return null;
          return { ...m, profile };
        })
        .filter((m): m is MemberWithProfile => m !== null);
    },
    enabled: !!leagueId,
    staleTime: STALE_TIMES.members,
  });
}
