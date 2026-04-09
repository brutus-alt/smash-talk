import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FAB } from "../../components/ui/fab";
import { hapticLight } from "../../lib/haptics";
import { colors } from "../../lib/theme";

/**
 * Layout des tabs principales — 4 onglets (Arbitrages §6.1).
 * Arene | Classement | Matchs | Profil
 *
 * Le FAB (+ Match) est positionne dans ce layout,
 * toujours visible au-dessus de la tab bar.
 *
 * Haptic light a chaque switch d'onglet (touch perfectionnement premium).
 */

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
};

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <Ionicons
      name={name}
      size={22}
      color={focused ? colors.accent.base : colors.text.muted}
    />
  );
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <Tabs
        screenListeners={{
          tabPress: () => {
            hapticLight();
          },
        }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface.base,
            borderTopColor: colors.surface.border,
            borderTopWidth: 1,
            height: 88,
            paddingBottom: 32,
            paddingTop: 10,
          },
          tabBarActiveTintColor: colors.accent.base,
          tabBarInactiveTintColor: colors.text.muted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: -0.1,
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Arene",
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "home" : "home-outline"} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: "Classement",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "podium" : "podium-outline"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "Matchs",
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "tennisball" : "tennisball-outline"} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name={focused ? "person" : "person-outline"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* FAB — pill avec gradient + glow, toujours visible */}
      <FAB onPress={() => router.push("/match/add")} />
    </View>
  );
}
