/**
 * Hook : ajouter un match.
 * Pont React ↔ TanStack Query ↔ addMatchAction.
 * Invalide les caches matchs + rankings après succès (Audit v2 §12).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/query-keys";
import { addMatchAction } from "../actions/add-match.action";

export function useAddMatch() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addMatchAction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.matches() });
      qc.invalidateQueries({ queryKey: queryKeys.rankings() });
      qc.invalidateQueries({ queryKey: queryKeys.badges() });
    },
  });
}
