import { View, Text, StyleSheet} from 'react-native';
import {Button} from '@react-navigation/elements';
import {Link} from 'expo-router';

export default function HouseHoldOverview() {
  return (
    <View>
      <Link style={styles.household}href='/househould'>
      <Text >Hushåll 1</Text>
               </Link>
               <Link style={styles.household}href='/househould'>
      <Text >Hushåll 2</Text>
               </Link>
               <Link style={styles.household}href='/househould'>
      <Text >Hushåll 3</Text>
               </Link>
               <Link style={styles.household}href='/househould'>
      <Text >Hushåll 4</Text>
               </Link>
               <Link style={styles.household}href='/househould'>
      <Text >Hushåll 5</Text>
               </Link>
               <Link style={styles.household}href='/househould'>
      <Text >Hushåll 6</Text>
               </Link>
    </View>
  );
}

const styles = StyleSheet.create({

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
  
  }
  )
