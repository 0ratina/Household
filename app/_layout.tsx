import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { bindAuthToQueryClient } from "../src/auth/bindAuthStateChanged";

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 3, staleTime: Infinity, gcTime: Infinity } },
});

export default function RootLayout() {
    useEffect(() => {
        const unsub = bindAuthToQueryClient(queryClient);
        return () => unsub();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
    );
}