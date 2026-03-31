/**
 * Action : Rejoindre une ligue.
 *
 * Orchestre :
 * 1. Trouver la ligue par code d'invitation
 * 2. Ajouter le joueur comme member
 * 3. Tracker l'event analytics
 */

import { leaguesService } from "../services/leagues.service";
import { analytics } from "../lib/analytics";

type JoinLeagueInput = {
  inviteCode: string;
  userId: string;
  invitedBy?: string;
};

export async function joinLeagueAction(input: JoinLeagueInput) {
  // 1. Trouver la ligue
  const league = await leaguesService.getByInviteCode(input.inviteCode);
  if (!league) {
    throw new Error("Code d'invitation invalide. Vérifie le code et réessaie.");
  }

  // 2. Ajouter le joueur
  await leaguesService.addMember({
    league_id: league.id,
    user_id: input.userId,
    role: "member",
    invited_by: input.invitedBy ?? null,
  });

  // 3. Analytics
  analytics.track("league_joined", { league_id: league.id });

  return league;
}
