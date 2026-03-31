/**
 * Utilitaires match — fonctions pures (Audit v2 §5).
 *
 * getPlayerResult : détermine si un joueur a gagné/perdu + son équipe
 * getPlayerMatches : filtre les matchs d'un joueur
 * getH2HMatches : filtre les matchs où deux joueurs s'affrontent
 *
 * Zéro React, zéro Supabase. Testable unitairement.
 */

import type { MatchRow } from "../lib/database.types";

export type PlayerResult = {
  team: "a" | "b";
  won: boolean;
  isRecorder: boolean;
};

/**
 * Détermine le résultat d'un joueur dans un match donné.
 * Retourne null si le joueur n'est pas dans ce match.
 */
export function getPlayerResult(
  match: MatchRow,
  playerId: string
): PlayerResult | null {
  const inTeamA =
    match.team_a_player_1 === playerId ||
    match.team_a_player_2 === playerId;
  const inTeamB =
    match.team_b_player_1 === playerId ||
    match.team_b_player_2 === playerId;

  if (!inTeamA && !inTeamB) return null;

  const team = inTeamA ? "a" : "b";
  const won =
    (team === "a" && match.winner === "team_a") ||
    (team === "b" && match.winner === "team_b");

  return {
    team,
    won,
    isRecorder: match.recorded_by === playerId,
  };
}

/**
 * Filtre les matchs auxquels un joueur a participé.
 */
export function getPlayerMatches(
  matches: MatchRow[],
  playerId: string
): MatchRow[] {
  return matches.filter(
    (m) =>
      m.team_a_player_1 === playerId ||
      m.team_a_player_2 === playerId ||
      m.team_b_player_1 === playerId ||
      m.team_b_player_2 === playerId
  );
}

/**
 * Filtre les matchs où deux joueurs s'affrontent (équipes opposées).
 * Exclut les matchs où ils sont coéquipiers.
 */
export function getH2HMatches(
  matches: MatchRow[],
  playerA: string,
  playerB: string
): MatchRow[] {
  return matches.filter((m) => {
    const aInTeamA =
      m.team_a_player_1 === playerA || m.team_a_player_2 === playerA;
    const aInTeamB =
      m.team_b_player_1 === playerA || m.team_b_player_2 === playerA;
    const bInTeamA =
      m.team_a_player_1 === playerB || m.team_a_player_2 === playerB;
    const bInTeamB =
      m.team_b_player_1 === playerB || m.team_b_player_2 === playerB;

    // A dans une équipe, B dans l'autre
    return (aInTeamA && bInTeamB) || (aInTeamB && bInTeamA);
  });
}

/**
 * Extrait les scores des sets d'un match sous forme de tableau.
 */
export function getMatchSets(
  match: MatchRow
): { a: number; b: number }[] {
  const sets: { a: number; b: number }[] = [
    { a: match.score_set_1_a, b: match.score_set_1_b },
    { a: match.score_set_2_a, b: match.score_set_2_b },
  ];

  if (match.score_set_3_a !== null && match.score_set_3_b !== null) {
    sets.push({ a: match.score_set_3_a, b: match.score_set_3_b });
  }

  return sets;
}

/**
 * Retourne les 4 IDs de joueurs d'un match.
 */
export function getMatchPlayerIds(match: MatchRow): string[] {
  return [
    match.team_a_player_1,
    match.team_a_player_2,
    match.team_b_player_1,
    match.team_b_player_2,
  ];
}
