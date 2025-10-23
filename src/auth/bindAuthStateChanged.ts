import { onAuthStateChanged } from "firebase/auth";
import type { QueryClient } from "@tanstack/react-query";
import { auth } from "../firebase";

export const authKey = ["auth", "user"] as const;

export function bindAuthToQueryClient(queryClient: QueryClient) {
    queryClient.setQueryData(authKey, auth.currentUser ?? null);

    const unsub = onAuthStateChanged(auth, (user) => {
        queryClient.setQueryData(authKey, user ?? null);
    });

    return unsub;
}