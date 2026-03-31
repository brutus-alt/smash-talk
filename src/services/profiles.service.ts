/**
 * Service Profiles — CRUD Supabase pour la table profiles.
 * Zéro logique métier. Juste les requêtes typées.
 */

import { supabase } from "./supabase";
import type {
  ProfileRow,
  ProfileInsert,
  ProfileUpdate,
} from "../lib/database.types";

export const profilesService = {
  /**
   * Récupère un profil par ID.
   */
  async getById(userId: string): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data as ProfileRow;
  },

  /**
   * Récupère plusieurs profils par IDs.
   * Utile pour afficher les joueurs d'un match.
   */
  async getByIds(userIds: string[]): Promise<ProfileRow[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);
    if (error) throw error;
    return (data ?? []) as ProfileRow[];
  },

  /**
   * Crée un profil (appelé après l'inscription si le trigger ne suffit pas).
   */
  async create(profile: ProfileInsert): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    if (error) throw error;
    return data as ProfileRow;
  },

  /**
   * Met à jour le profil de l'utilisateur courant.
   */
  async update(
    userId: string,
    updates: ProfileUpdate
  ): Promise<ProfileRow> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data as ProfileRow;
  },
};
