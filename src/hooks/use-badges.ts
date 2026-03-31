/**
 * Hook : badges d'un joueur dans une ligue.
 * Combine la liste complète des 12 badges avec ceux gagnés par le joueur.
 */

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { badgesService } from "../services/badges.service";
import type { BadgeDisplay } from "../domain/types";

export function useBadges(userId: string | null, leagueId: string | null) {
  return useQuery({
    queryKey: queryKeys.badges(userId ?? undefined),
    queryFn: async (): Promise<BadgeDisplay[]> => {
      const [allBadges, userBadges] = await Promise.all([
        badgesService.getAll(),
        badgesService.getUserBadges(userId!, leagueId!),
      ]);

      const earnedMap = new Map(
        userBadges.map((ub) => [ub.badge_id, ub.earned_at])
      );

      return allBadges.map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        category: badge.category,
        icon: badge.icon,
        earnedAt: earnedMap.get(badge.id) ?? null,
      }));
    },
    enabled: !!userId && !!leagueId,
    staleTime: STALE_TIMES.badges,
  });
}
