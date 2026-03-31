/**
 * Action : Créer une ligue.
 *
 * Orchestre :
 * 1. Créer la ligue
 * 2. Ajouter le créateur comme member avec rôle "owner"
 * 3. Attribuer le badge "founder"
 * 4. Tracker l'event analytics
 */

import { leaguesService } from "../services/leagues.service";
import { badgesService } from "../services/badges.service";
import { analytics } from "../lib/analytics";
import { generateInviteCode } from "../lib/utils";
import type { LeagueInsert } from "../lib/database.types";

type CreateLeagueInput = {
  name: string;
  emoji: string;
  userId: string;
};

export async function createLeagueAction(input: CreateLeagueInput) {
  const inviteCode = generateInviteCode();

  // 1. Créer la ligue
  const leagueInsert: LeagueInsert = {
    name: input.name,
    emoji: input.emoji,
    invite_code: inviteCode,
    created_by: input.userId,
  };
  const league = await leaguesService.create(leagueInsert);

  // 2. Ajouter le créateur comme owner
  await leaguesService.addMember({
    league_id: league.id,
    user_id: input.userId,
    role: "owner",
  });

  // 3. Badge "founder" (best effort)
  try {
    await badgesService.award([
      {
        user_id: input.userId,
        badge_id: "founder",
        league_id: league.id,
      },
    ]);
  } catch {
    // Doublon ou erreur — pas bloquant
  }

  // 4. Analytics
  analytics.track("league_created", { league_id: league.id });

  return league;
}
