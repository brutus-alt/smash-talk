import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Screen, Button, MeshGradient } from "../components/ui";
import { colors } from "../lib/theme";

/**
 * Page 404 personnalisee.
 * Remplace le "Unmatched Route" par defaut d'expo-router.
 */
export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen className="justify-center items-center px-6">
      <MeshGradient intensity="subtle" />

      <View className="items-center" style={{ gap: 24 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: colors.surface.elevated,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="compass-outline" size={36} color={colors.text.secondary} />
        </View>

        <View className="items-center" style={{ gap: 8 }}>
          <Text
            className="text-text"
            style={{
              fontSize: 28,
              fontWeight: "900",
              letterSpacing: -1,
              textAlign: "center",
            }}
          >
            Tu t'es perdu
          </Text>
          <Text
            className="text-text-secondary text-center"
            style={{ fontSize: 15, lineHeight: 22, maxWidth: 280 }}
          >
            Cette page n'existe pas, ou plus.{"\n"}
            On va te ramener au terrain.
          </Text>
        </View>

        <View style={{ marginTop: 16, width: "100%", gap: 12 }}>
          <Button
            title="Retour a l'arene"
            size="lg"
            fullWidth
            onPress={() => router.replace("/")}
          />
        </View>
      </View>
    </Screen>
  );
}
