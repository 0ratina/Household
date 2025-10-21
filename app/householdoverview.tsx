import { View, Text, StyleSheet} from 'react-native';

export default function HouseHoldOverview() {
  return (
    <View>
      <Text style={styles.header}>Översikt över hushåll</Text>
    </View>
  );
}

const styles = StyleSheet.create({
   header: {
      flex: 1,
      justifyContent: 'center',
   }})
