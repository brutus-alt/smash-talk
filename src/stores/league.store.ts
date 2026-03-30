import { create } from "zustand";

/**
 * Store de ligue active (Zustand).
 *
 * Contient UNIQUEMENT l'ID de la ligue sélectionnée.
 * Quand activeLeagueId change, les query keys TanStack Query
 * changent automatiquement (car elles incluent leagueId).
 * TanStack Query gère le rechargement. Pas de logique custom.
 * (Audit v2 §6)
 */

type LeagueState = {
  activeLeagueId: string | null;
};

type LeagueActions = {
  setActiveLeague: (leagueId: string) => void;
  clearActiveLeague: () => void;
};

export const useLeagueStore = create<LeagueState & LeagueActions>((set) => ({
  activeLeagueId: null,

  setActiveLeague: (leagueId) => set({ activeLeagueId: leagueId }),

  clearActiveLeague: () => set({ activeLeagueId: null }),
}));
