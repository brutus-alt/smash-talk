/**
 * Action : Ajouter un match (Audit v2 §12).
 *
 * Orchestre le cas d'usage complet :
 * 1. Insérer le match
 * 2. Vérifier les badges pour les 4 joueurs
 * 3. Envoyer notification (best effort)
 * 4. Tracker l'event analytics
 *
 * Fonction async non-React. Testable indépendamment.
 */

import { matchesService } from "../services/matches.service";
import { badgesService } from "../services/badges.service";
import { notificationsService } from "../services/notifications.service";
import { buildBadgeContext, checkNewBadges } from "../domain/badges";
import { getMatchPlayerIds } from "../domain/match-utils";
import { analytics } from "../lib/analytics";
import type { MatchInsert } from "../lib/database.types";

export async function addMatchAction(input: MatchInsert) {
  // 1. Insérer le match
  const match = await matchesService.create(input);

  // 2. Vérifier les badges pour les 4 joueurs
  const playerIds = getMatchPlayerIds(match);
  const allMatches = await matchesService.getByLeague(match.league_id);

  for (const playerId of playerIds) {
    try {
      // Récupérer les badges déjà gagnés
      const existingBadges = await badgesService.getUserBadges(
        playerId,
        match.league_id
      );
      const earnedIds = existingBadges.map((b) => b.badge_id);

      // Construire le contexte et vérifier les nouveaux badges
      const context = buildBadgeContext(allMatches, playerId, match);
      const newBadgeIds = checkNewBadges(context, earnedIds);

      // Attribuer les nouveaux badges
      if (newBadgeIds.length > 0) {
        await badgesService.award(
          newBadgeIds.map((badgeId) => ({
            user_id: playerId,
            badge_id: badgeId,
            league_id: match.league_id,
          }))
        );
      }
    } catch (err) {
      // Les badges sont best effort — ne pas bloquer si ça échoue
      console.warn(`[Badges] Erreur pour ${playerId}:`, err);
    }
  }

  // 3. Notification (best effort)
  notificationsService
    .notifyNewMatch(match.league_id, match.id)
    .catch(() => {});

  // 4. Analytics
  analytics.track("match_recorded", { league_id: match.league_id });

  return match;
}
