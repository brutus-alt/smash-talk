/**
 * Validation de match — fonctions pures (Audit v2 §16).
 *
 * determineWinner : détermine le gagnant à partir des scores de sets
 * validateMatchPlayers : vérifie que les 4 joueurs sont différents
 *
 * Pas de validation de score réglementaire (Arbitrages §3.1).
 * Les groupes jouent avec leurs propres règles.
 */

import type { SetScore } from "./types";

/**
 * Détermine le gagnant en comptant les sets gagnés.
 * Un set est gagné par l'équipe avec le plus de jeux.
 * En cas d'égalité sur un set, il n'est compté pour personne.
 *
 * Retourne "team_a", "team_b", ou null si on ne peut pas déterminer.
 */
export function determineWinner(
  sets: SetScore[]
): "team_a" | "team_b" | null {
  let setsA = 0;
  let setsB = 0;

  for (const set of sets) {
    if (set.scoreA > set.scoreB) {
      setsA++;
    } else if (set.scoreB > set.scoreA) {
      setsB++;
    }
    // Égalité sur un set = pas compté
  }

  if (setsA > setsB) return "team_a";
  if (setsB > setsA) return "team_b";
  return null; // Égalité globale — ne devrait pas arriver en padel
}

/**
 * Vérifie que les 4 joueurs sont tous différents.
 */
export function validateMatchPlayers(
  teamAPlayer1: string,
  teamAPlayer2: string,
  teamBPlayer1: string,
  teamBPlayer2: string
): { valid: boolean; error?: string } {
  const players = [teamAPlayer1, teamAPlayer2, teamBPlayer1, teamBPlayer2];

  // Vérifier qu'aucun n'est vide
  if (players.some((p) => !p)) {
    return { valid: false, error: "Tous les joueurs doivent être sélectionnés." };
  }

  // Vérifier qu'ils sont tous différents
  const unique = new Set(players);
  if (unique.size !== 4) {
    return { valid: false, error: "Un joueur ne peut pas être dans les deux équipes." };
  }

  return { valid: true };
}

/**
 * Vérifie qu'au moins 2 sets ont des scores > 0.
 */
export function validateMatchSets(
  sets: SetScore[]
): { valid: boolean; error?: string } {
  if (sets.length < 2) {
    return { valid: false, error: "Un match doit avoir au moins 2 sets." };
  }

  if (sets.length > 3) {
    return { valid: false, error: "Un match ne peut pas avoir plus de 3 sets." };
  }

  // Au moins le premier set doit avoir un score
  const firstSet = sets[0];
  if (!firstSet || (firstSet.scoreA === 0 && firstSet.scoreB === 0)) {
    return { valid: false, error: "Le premier set doit avoir un score." };
  }

  return { valid: true };
}
