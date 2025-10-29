import { Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../../src/firebase";
import { authKey } from "../../src/auth/bindAuthStateChanged";

export default function Index() {
   const { data: user, isLoading } = useQuery({
      queryKey: authKey,
      queryFn: async () => auth.currentUser ?? null,
      initialData: auth.currentUser ?? null,
   });

   if (user === undefined) {
      return (
         <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" />
         </View>
      );
   }

   return user ? <Redirect href="/(protected)/(tabs)/accountOverview" /> : <Redirect href="/(public)/login" />;
}