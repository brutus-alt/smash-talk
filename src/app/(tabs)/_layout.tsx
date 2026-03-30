import { Tabs, useRouter } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FAB } from "../../components/ui/fab";

/**
 * Layout des tabs principales — 4 onglets (Arbitrages §6.1).
 * Home | Classement | Historique | Profil
 *
 * Le FAB (+ Match) est positionné dans ce layout,
 * toujours visible au-dessus de la tab bar.
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
      color={focused ? "#22C55E" : "#6B7280"}
    />
  );
}

export default function TabsLayout() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-surface">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0A0A0F",
            borderTopColor: "#1E1E2E",
            borderTopWidth: 1,
            height: 85,
            paddingBottom: 30,
            paddingTop: 8,
          },
          tabBarActiveTintColor: "#22C55E",
          tabBarInactiveTintColor: "#6B7280",
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
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
            title: "Historique",
            tabBarIcon: ({ focused }) => (
              <TabIcon name={focused ? "time" : "time-outline"} focused={focused} />
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

      {/* FAB — toujours visible au-dessus de la tab bar */}
      <FAB onPress={() => router.push("/match/add")} />
    </View>
  );
}
