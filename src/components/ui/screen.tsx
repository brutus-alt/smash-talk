import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";

/**
 * Screen — wrapper d'écran principal.
 *
 * Remplace le pattern répétitif SafeAreaView + bg-surface + padding
 * utilisé dans chaque écran.
 *
 * Modes :
 * - fixed   → pas de scroll, contenu en flex. Pour les écrans courts (login, empty states).
 * - scroll  → ScrollView intégré. Pour les écrans avec contenu dynamique.
 */

type ScreenProps = {
  children: ReactNode;
  /** "scroll" ajoute un ScrollView interne. "fixed" est un flex container. */
  mode?: "fixed" | "scroll";
  /** Padding horizontal custom (défaut : px-4) */
  padded?: boolean;
  /** Classe supplémentaire sur le conteneur interne */
  className?: string;
};

export function Screen({
  children,
  mode = "fixed",
  padded = true,
  className = "",
}: ScreenProps) {
  if (mode === "scroll") {
    return (
      <SafeAreaView className="flex-1 bg-surface">
        <ScrollView
          className="flex-1"
          contentContainerClassName={`
            ${padded ? "px-4" : ""}
            pt-3 pb-28 gap-4
            ${className}
          `}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <View
        className={`
          flex-1
          ${padded ? "px-4" : ""}
          pt-3
          ${className}
        `}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
