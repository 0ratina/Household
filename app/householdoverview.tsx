import { View, Text, StyleSheet} from 'react-native';
import {Button} from '@react-navigation/elements'

export default function HouseHoldOverview() {
  return (
    <View>
      <Text style={styles.household}>Hushåll 1</Text>
      <Text style={styles.household}>Hushåll 2</Text>
      <Text style={styles.household}>Hushåll 3</Text>
      <Text style={styles.household}>Hushåll 4</Text>
      <Text style={styles.household}>Hushåll 5</Text>
      <Text style={styles.household}>Hushåll 6</Text>
      <Button style={styles.button}>Logga in</Button>
    </View>
  );
}

const styles = StyleSheet.create({
   header: {

   },
  household: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 25,
    color: '#222',
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  button:{
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#222',
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    bottom:-80,
  },
  
  }
  )
