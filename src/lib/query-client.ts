import { QueryClient } from "@tanstack/react-query";

/**
 * Client TanStack Query partagé.
 * Configuré avec des defaults conservateurs pour le MVP.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Pas de retry automatique au MVP — erreurs visibles immédiatement
      retry: 1,
      // Refetch quand l'app revient au premier plan
      refetchOnWindowFocus: true,
      // Ne pas refetch quand le réseau revient (pour éviter les cascades)
      refetchOnReconnect: false,
      // Données considérées fraîches pendant 2 minutes par défaut
      staleTime: 2 * 60 * 1000,
      // Cache gardé 10 minutes après dernière utilisation
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});
