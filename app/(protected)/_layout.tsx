import { Stack, Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../../src/firebase";
import { authKey } from "../../src/auth/bindAuthStateChanged";

export default function ProtectedLayout() {
  const { data: user, isLoading } = useQuery({
    queryKey: authKey,
    queryFn: async () => auth.currentUser ?? null,
    initialData: auth.currentUser ?? null
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "index" }} />
      <Stack.Screen name="profile" options={{ title: "Profil", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }} />
      <Stack.Screen name="createTask" options={{ title: "Skapa en ny syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }} />
      <Stack.Screen name="updateTask" options={{ title: "Ändra syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }} />
      <Stack.Screen name="joinHousehold" options={{ title: "Gå med i hushåll", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }} />
      <Stack.Screen name="taskOverview" options={{ title: "Översikt Syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }} />
      <Stack.Screen name="modal" options={{ title: "Modal" }} />
      <Stack.Screen name="explore" options={{ title: "explore" }} />
    </Stack>
  );
}