/**
 * Service Notifications — gestion des push tokens + envoi de notifications.
 *
 * MVP : le client appelle l'Edge Function après l'insert du match (Audit v2 §7).
 * Pour l'instant, on gère juste les tokens. L'envoi viendra au Sprint 6.
 */

import { supabase } from "./supabase";
import type { PushTokenRow, PushTokenInsert } from "../lib/database.types";

export const notificationsService = {
  /**
   * Enregistre le push token du device.
   */
  async registerToken(token: PushTokenInsert): Promise<PushTokenRow> {
    const { data, error } = await supabase
      .from("push_tokens")
      .upsert(token, { onConflict: "user_id" })
      .select()
      .single();
    if (error) throw error;
    return data as PushTokenRow;
  },

  /**
   * Supprime le push token (déconnexion).
   */
  async removeToken(userId: string): Promise<void> {
    const { error } = await supabase
      .from("push_tokens")
      .delete()
      .eq("user_id", userId);
    if (error) throw error;
  },

  /**
   * Notifie les membres d'une ligue qu'un match a été enregistré.
   * MVP : best effort, ne bloque pas si ça échoue.
   *
   * TODO Sprint 6 : appeler une Edge Function Supabase ici.
   */
  async notifyNewMatch(
    _leagueId: string,
    _matchId: string
  ): Promise<void> {
    // TODO: Appeler l'Edge Function
    // await supabase.functions.invoke('notify-new-match', {
    //   body: { league_id: leagueId, match_id: matchId },
    // });
    console.log("[Notifications] notifyNewMatch — TODO Sprint 6");
  },
};
