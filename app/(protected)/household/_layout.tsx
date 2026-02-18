import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { getHousehold } from "../../../src/api/household";
import { useActiveHousehold } from "../../../src/service/activeHousehold";

export default function HouseholdTabsLayout() {
  const { data: householdId } = useActiveHousehold();

  const { data: household } = useQuery({
    queryKey: ["household", householdId],
    enabled: !!householdId,
    queryFn: () => getHousehold(householdId!),
  });

  return (
    <Tabs
      screenOptions={{
        tabBarLabel: "Hushåll",
        headerTitleStyle: { fontSize: 24, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="overview"
        options={{
          headerTitle: household?.Name ?? "Sysslor",
          tabBarLabel: "Sysslor",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          headerTitle: household?.Name ?? "Statistik",
          tabBarLabel: "Statistik",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: household?.Name ?? "Profil",
          tabBarLabel: "Profil",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
