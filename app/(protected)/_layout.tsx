import { useQuery } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { authKey } from "../../src/auth/bindAuthStateChanged";
import { auth } from "../../src/firebase";

export default function ProtectedLayout() {
  const { data: user, isLoading } = useQuery({
    queryKey: authKey,
    queryFn: async () => auth.currentUser ?? null,
    initialData: auth.currentUser ?? null,
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(public)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="accountOverview"
        options={{
          title: "Mina Hushåll",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="household"
        options={{
          title: "Hushåll",
          headerBackTitle: "Hushåll",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: "Profil",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="createTask"
        options={{
          title: "Skapa en ny syssla",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="updateTask"
        options={{
          title: "Ändra syssla",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="joinHousehold"
        options={{
          title: "Gå med i hushåll",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen
        name="taskOverview"
        options={{
          title: "Översikt Syssla",
          headerTitleStyle: { fontSize: 24, fontWeight: "600" },
        }}
      />
      <Stack.Screen name="modal" options={{ title: "Modal" }} />
      <Stack.Screen name="explore" options={{ title: "explore" }} />
    </Stack>
  );
}
