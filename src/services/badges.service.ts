/**
 * Service Badges — CRUD Supabase pour badges + user_badges.
 * Zéro logique métier. Juste les requêtes typées.
 */

import { supabase } from "./supabase";
import type {
  BadgeRow,
  UserBadgeRow,
  UserBadgeInsert,
} from "../lib/database.types";

export const badgesService = {
  /**
   * Récupère tous les badges (table de référence, 12 lignes).
   */
  async getAll(): Promise<BadgeRow[]> {
    const { data, error } = await supabase
      .from("badges")
      .select("*")
      .order("id");
    if (error) throw error;
    return (data ?? []) as BadgeRow[];
  },

  /**
   * Récupère les badges gagnés par un joueur dans une ligue.
   */
  async getUserBadges(
    userId: string,
    leagueId: string
  ): Promise<UserBadgeRow[]> {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .eq("league_id", leagueId)
      .order("earned_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as UserBadgeRow[];
  },

  /**
   * Récupère tous les badges gagnés par un joueur (toutes ligues).
   */
  async getAllUserBadges(userId: string): Promise<UserBadgeRow[]> {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*")
      .eq("user_id", userId)
      .order("earned_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as UserBadgeRow[];
  },

  /**
   * Attribue un ou plusieurs badges à un joueur.
   * Utilise la contrainte unique (user_id, badge_id, league_id)
   * pour éviter les doublons — pas besoin de vérifier avant.
   */
  async award(badges: UserBadgeInsert[]): Promise<UserBadgeRow[]> {
    if (badges.length === 0) return [];

    const { data, error } = await supabase
      .from("user_badges")
      .upsert(badges, { onConflict: "user_id,badge_id,league_id" })
      .select();
    if (error) throw error;
    return (data ?? []) as UserBadgeRow[];
  },
};
