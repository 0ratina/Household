import { View, Text } from 'react-native';
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View>
      <Text>Test</Text>
      <Link href="/profile">Profil</Link>
    </View>
  );
}
