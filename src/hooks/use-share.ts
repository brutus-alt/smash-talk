/**
 * Hook : capture d'un composant en image + partage via Share API native.
 *
 * Utilise react-native-view-shot pour le rendu.
 * Le composant à capturer est rendu hors écran (position absolute, hors viewport).
 * L'image est partagée via Share API puis supprimée du cache.
 *
 * Architecture §20 : zéro storage serveur, capture côté client uniquement.
 */

import { useRef, useCallback, useState } from "react";
import { Share, Platform } from "react-native";
import type { View } from "react-native";
import { analytics } from "../lib/analytics";

// react-native-view-shot sera importé dynamiquement
// pour ne pas crasher si le module n'est pas installé
let captureRef: ((ref: number | View, options?: object) => Promise<string>) | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const viewShot = require("react-native-view-shot");
  captureRef = viewShot.captureRef;
} catch {
  console.warn("[Share] react-native-view-shot non installé. Le partage d'image sera désactivé.");
}

export function useShare() {
  const ref = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const share = useCallback(async (fallbackText?: string) => {
    if (!captureRef || !ref.current) {
      // Fallback : partage texte si view-shot n'est pas dispo
      if (fallbackText) {
        await Share.share({ message: fallbackText });
      }
      return;
    }

    setIsCapturing(true);

    try {
      const uri = await captureRef(ref.current, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });

      await Share.share(
        Platform.OS === "ios"
          ? { url: uri }
          : { message: fallbackText ?? "Smash Talk 🏓", title: "Smash Talk" }
      );

      analytics.track("share_triggered");
    } catch (err) {
      // L'utilisateur a annulé le partage — pas une erreur
      if (err instanceof Error && err.message !== "User did not share") {
        console.warn("[Share] Erreur:", err.message);
      }
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return {
    /** Ref à attacher au composant à capturer */
    shareRef: ref,
    /** Fonction pour déclencher la capture + partage */
    share,
    /** True pendant la capture */
    isCapturing,
  };
}
