import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

/**
 * Store d'authentification (Zustand).
 *
 * Contient uniquement l'état de session Supabase.
 * Pas de logique métier ici — juste le reflet de l'état auth.
 */

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  isOnboarded: boolean;
};

type AuthActions = {
  setSession: (session: Session | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsOnboarded: (onboarded: boolean) => void;
  reset: () => void;
};

const initialState: AuthState = {
  session: null,
  user: null,
  isLoading: true,
  isOnboarded: false,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

  reset: () => set(initialState),
}));
