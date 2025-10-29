import { Stack } from "expo-router";
import React from "react";

export default function PublicLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" options={{ title: "Logga in" }} />
            <Stack.Screen name="createUser" options={{ title: "Registrera" }} />
        </Stack>
    );
}