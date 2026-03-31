/**
 * Service Matches — CRUD Supabase pour matches + vue league_player_summary.
 * Zéro logique métier. Juste les requêtes typées.
 */

import { supabase } from "./supabase";
import type {
  MatchRow,
  MatchInsert,
  LeaguePlayerSummaryRow,
} from "../lib/database.types";

export const matchesService = {
  /**
   * Récupère tous les matchs d'une ligue, triés du plus récent au plus ancien.
   */
  async getByLeague(leagueId: string): Promise<MatchRow[]> {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("league_id", leagueId)
      .order("played_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as MatchRow[];
  },

  /**
   * Récupère un match par ID.
   */
  async getById(matchId: string): Promise<MatchRow> {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("id", matchId)
      .single();
    if (error) throw error;
    return data as MatchRow;
  },

  /**
   * Enregistre un nouveau match.
   */
  async create(match: MatchInsert): Promise<MatchRow> {
    const { data, error } = await supabase
      .from("matches")
      .insert(match)
      .select()
      .single();
    if (error) throw error;
    return data as MatchRow;
  },

  /**
   * Supprime un match (owner/admin uniquement).
   */
  async delete(matchId: string): Promise<void> {
    const { error } = await supabase
      .from("matches")
      .delete()
      .eq("id", matchId);
    if (error) throw error;
  },

  /**
   * Récupère le résumé par joueur depuis la vue league_player_summary.
   * Utilisé pour le classement (évite de charger tous les matchs).
   */
  async getLeaguePlayerSummary(
    leagueId: string
  ): Promise<LeaguePlayerSummaryRow[]> {
    const { data, error } = await supabase
      .from("league_player_summary")
      .select("*")
      .eq("league_id", leagueId);
    if (error) throw error;
    return (data ?? []) as LeaguePlayerSummaryRow[];
  },
};
