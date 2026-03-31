/**
 * Service Leagues — CRUD Supabase pour leagues + league_members.
 * Zéro logique métier. Juste les requêtes typées.
 */

import { supabase } from "./supabase";
import type {
  LeagueRow,
  LeagueInsert,
  LeagueUpdate,
  LeagueMemberRow,
  LeagueMemberInsert,
} from "../lib/database.types";

export const leaguesService = {
  // ─── LEAGUES ───

  /**
   * Récupère toutes les ligues de l'utilisateur courant.
   */
  async getMyLeagues(): Promise<LeagueRow[]> {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as LeagueRow[];
  },

  /**
   * Récupère une ligue par ID.
   */
  async getById(leagueId: string): Promise<LeagueRow> {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .eq("id", leagueId)
      .single();
    if (error) throw error;
    return data as LeagueRow;
  },

  /**
   * Récupère une ligue par code d'invitation.
   * Utilisé dans le flow "rejoindre une ligue".
   * Note : cette requête nécessite que la RLS autorise la lecture
   * par code — pour le MVP, on peut temporairement bypass via une
   * Edge Function ou une RLS plus permissive sur le code.
   */
  async getByInviteCode(code: string): Promise<LeagueRow | null> {
    const { data, error } = await supabase
      .from("leagues")
      .select("*")
      .eq("invite_code", code)
      .maybeSingle();
    if (error) throw error;
    return data as LeagueRow | null;
  },

  /**
   * Crée une nouvelle ligue.
   */
  async create(league: LeagueInsert): Promise<LeagueRow> {
    const { data, error } = await supabase
      .from("leagues")
      .insert(league)
      .select()
      .single();
    if (error) throw error;
    return data as LeagueRow;
  },

  /**
   * Met à jour une ligue (nom, emoji).
   */
  async update(
    leagueId: string,
    updates: LeagueUpdate
  ): Promise<LeagueRow> {
    const { data, error } = await supabase
      .from("leagues")
      .update(updates)
      .eq("id", leagueId)
      .select()
      .single();
    if (error) throw error;
    return data as LeagueRow;
  },

  /**
   * Supprime une ligue (owner uniquement).
   */
  async delete(leagueId: string): Promise<void> {
    const { error } = await supabase
      .from("leagues")
      .delete()
      .eq("id", leagueId);
    if (error) throw error;
  },

  // ─── LEAGUE MEMBERS ───

  /**
   * Récupère tous les membres d'une ligue.
   */
  async getMembers(leagueId: string): Promise<LeagueMemberRow[]> {
    const { data, error } = await supabase
      .from("league_members")
      .select("*")
      .eq("league_id", leagueId)
      .order("joined_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as LeagueMemberRow[];
  },

  /**
   * Ajoute un membre à une ligue (rejoindre).
   */
  async addMember(member: LeagueMemberInsert): Promise<LeagueMemberRow> {
    const { data, error } = await supabase
      .from("league_members")
      .insert(member)
      .select()
      .single();
    if (error) throw error;
    return data as LeagueMemberRow;
  },

  /**
   * Retire un membre d'une ligue (quitter ou expulser).
   */
  async removeMember(
    leagueId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("league_members")
      .delete()
      .eq("league_id", leagueId)
      .eq("user_id", userId);
    if (error) throw error;
  },
};
