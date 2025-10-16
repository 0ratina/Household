import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'index' }} />
        <Stack.Screen name="profile" options={{
          title: 'Profil', headerTitleStyle: {
            fontSize: 24,
            fontWeight: "600",
          }
        }} />
        <Stack.Screen name="createTask" options={{
          title: 'Skapa en ny syssla', headerTitleStyle: {
            fontSize: 24,
            fontWeight: "600",
          }
        }} />
        <Stack.Screen name="updateTask" options={{
          title: 'Ändra syssla', headerTitleStyle: {
            fontSize: 24,
            fontWeight: "600",
          }
        }} />
        <Stack.Screen name="modal" options={{ title: 'Modal' }} />
        <Stack.Screen name="explore" options={{ title: 'explore' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
