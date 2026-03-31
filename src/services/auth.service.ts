/**
 * Service Auth — accès Supabase Auth.
 *
 * Apple Sign-In + Google Sign-In uniquement au MVP (Audit v2 §10.2).
 * Pas d'email/password.
 *
 * Zéro logique métier. Juste les appels Supabase.
 */

import { supabase } from "./supabase";

export const authService = {
  /**
   * Connexion Apple Sign-In.
   * Le token Apple est obtenu côté client via expo-apple-authentication,
   * puis envoyé ici pour créer/récupérer la session Supabase.
   */
  async signInWithApple(idToken: string) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: idToken,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Connexion Google Sign-In.
   * Le token Google est obtenu côté client via un flow OAuth,
   * puis envoyé ici.
   */
  async signInWithGoogle(idToken: string) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Déconnexion.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Récupère la session courante.
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Récupère l'utilisateur courant.
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
};
