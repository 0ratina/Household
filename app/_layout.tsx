import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { authKey, bindAuthToQueryClient } from "../src/auth/bindAuthStateChanged";
import { auth } from "../src/firebase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 3, staleTime: Infinity, gcTime: Infinity },
  },
});

function useAuthUser() {
  return useQuery({
    queryKey: authKey,
    queryFn: async () => auth.currentUser ?? null,
    initialData: auth.currentUser ?? null,
  });
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <InnerLayout />
    </QueryClientProvider>
  );
}

function InnerLayout() {
  useEffect(() => {
    const unsub = bindAuthToQueryClient(queryClient);
    return () => unsub();
  }, []);

  const { data: user, isLoading } = useAuthUser();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "index" }} />
      <Stack.Screen
        name="profile"
        options={{ title: "Profil", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }}
      />
      <Stack.Screen
        name="createTask"
        options={{ title: "Skapa en ny syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }}
      />
      <Stack.Screen
        name="updateTask"
        options={{ title: "Ändra syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }}
      />
      <Stack.Screen
        name="joinHousehold"
        options={{ title: "Gå med i hushåll", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }}
      />
      <Stack.Screen
        name="taskOverview"
        options={{ title: "Översikt Syssla", headerTitleStyle: { fontSize: 24, fontWeight: "600" } }}
      />
      <Stack.Screen name="modal" options={{ title: "Modal" }} />
      <Stack.Screen name="explore" options={{ title: "explore" }} />
    </Stack>
  );
}
