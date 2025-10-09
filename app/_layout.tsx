import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'index' }} />
        <Stack.Screen name="modal" options={{ title: 'Modal' }} />
        <Stack.Screen name="explore" options={{ title: 'explore' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
