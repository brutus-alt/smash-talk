import { View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { ReactNode } from "react";
import { colors } from "../../lib/theme";

/**
 * Screen — wrapper d'écran principal.
 *
 * Modes :
 * - fixed   → pas de scroll. Pour login, empty states.
 * - scroll  → ScrollView avec pull-to-refresh optionnel.
 *
 * Pull-to-refresh : passer onRefresh + refreshing pour l'activer.
 */

type ScreenProps = {
  children: ReactNode;
  mode?: "fixed" | "scroll";
  padded?: boolean;
  className?: string;
  /** Callback pull-to-refresh (scroll mode uniquement) */
  onRefresh?: () => void;
  /** État du refresh en cours */
  refreshing?: boolean;
};

export function Screen({
  children,
  mode = "fixed",
  padded = true,
  className = "",
  onRefresh,
  refreshing = false,
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
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent.base}
                colors={[colors.accent.base]}
                progressBackgroundColor={colors.surface.card}
              />
            ) : undefined
          }
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
