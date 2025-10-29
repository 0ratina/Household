import { View, Text, TouchableOpacity, FlatList, Button, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { db } from '../../../src/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useQuery } from '@tanstack/react-query'

interface Household {
   id: string
   Name: string
   Code: number
}

async function getHouseholds(): Promise<Household[]> {
   const querySnapshot = await getDocs(collection(db, 'households'))
   return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Household, 'id'>),
   }))
}

export default function AccountOverview() {
   const query = useQuery({
      queryKey: ['households'],
      queryFn: getHouseholds,
   })

   if (query.isPending) {
      return (
         <View style={styles.container}>
            <Text style={styles.loading}>Laddar hushåll...</Text>
         </View>
      )
   }

   if (query.isError) {
      return (
         <View style={styles.container}>
            <Text style={styles.error}>Fel vid hämtning av hushåll</Text>
            <Button title='Försök igen' onPress={() => query.refetch()} />
         </View>
      )
   }

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Dina Hushåll</Text>
               <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                  <Ionicons name='person-circle-outline' size={36} color='#007AFF' />
               </TouchableOpacity>
            </View>

            {query.data.length === 0 ? (
               <Text style={{ textAlign: 'center' }}>Inga hushåll hittades.</Text>
            ) : (
               <FlatList
                  data={query.data}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                     <TouchableOpacity style={styles.householdItem} onPress={() => router.push(`/household?id=${item.id}`)}>
                        <Text style={styles.householdName}>{item.Name}</Text>
                     </TouchableOpacity>
                  )}
               />
            )}

            <TouchableOpacity style={styles.button} onPress={() => router.push('/createhousehold')}>
               <Text style={styles.buttonText}>Skapa nytt hushåll</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/household')}>
               <Text style={styles.buttonTextSecondary}>Gå med i hushåll</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      justifyContent: 'flex-start',
   },
   card: {
      backgroundColor: '#fff',
      margin: 16,
      borderRadius: 8,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
   },
   headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
   },
   header: {
      fontSize: 20,
      fontWeight: '600',
      color: '#111',
   },
   householdItem: {
      backgroundColor: '#f5f5f5',
      padding: 12,
      borderRadius: 8,
      marginBottom: 10,
   },
   householdName: {
      fontSize: 16,
      color: '#222',
   },
   button: {
      backgroundColor: '#007AFF',
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 15,
   },
   buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
   },
   buttonSecondary: {
      borderColor: '#007AFF',
      borderWidth: 1,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 10,
   },
   buttonTextSecondary: {
      color: '#007AFF',
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '500',
   },
   loading: {
      fontSize: 18,
      color: '#7A7A7A',
      textAlign: 'center',
      marginTop: 20,
   },
   error: {
      fontSize: 18,
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
   },
})
