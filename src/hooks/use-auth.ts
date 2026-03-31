/**
 * Hook : opérations d'authentification.
 * Centralise sign out + récupération du profil courant.
 */

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { queryKeys } from "../lib/query-keys";
import { STALE_TIMES } from "../lib/constants";
import { authService } from "../services/auth.service";
import { profilesService } from "../services/profiles.service";
import { useAuthStore } from "../stores/auth.store";
import { useLeagueStore } from "../stores/league.store";
import { analytics } from "../lib/analytics";

/**
 * Récupère le profil de l'utilisateur connecté.
 */
export function useMyProfile() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: queryKeys.profile(userId ?? undefined),
    queryFn: () => profilesService.getById(userId!),
    enabled: !!userId,
    staleTime: STALE_TIMES.profile,
  });
}

/**
 * Retourne la fonction de déconnexion.
 */
export function useSignOut() {
  const router = useRouter();
  const qc = useQueryClient();
  const resetAuth = useAuthStore((s) => s.reset);
  const clearLeague = useLeagueStore((s) => s.clearActiveLeague);

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch {
      // Même si l'appel échoue, on nettoie localement
    }

    // Nettoyer tout l'état local
    resetAuth();
    clearLeague();
    qc.clear();
    analytics.reset();

    router.replace("/(auth)/login");
  };

  return signOut;
}
