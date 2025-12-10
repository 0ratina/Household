import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { router } from 'expo-router'
import { signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, db } from '../../src/firebase'

interface Household {
   id: string
   Name: string
   Code: number
}

export const householdKey = (userId: string) => ['households', userId];

async function getHouseholds(): Promise<Household[]> {
   const user = auth.currentUser
   if (!user) {
      console.log('Ingen användare inloggad.')
      return []
   }

   const profileRef = doc(db, "profiles", user.uid);
   const profileSnap = await getDoc(profileRef);

   if (!profileSnap.exists()) return [];

   const profileData = profileSnap.data();
   const householdIds: string[] = profileData?.HouseHoldID || [];

   const households: Household[] = [];

   for (const id of householdIds) {
      const householdRef = doc(db, "households", id);
      const householdSnap = await getDoc(householdRef);

      if (householdSnap.exists()) {
         households.push({
            id: householdSnap.id,
            ...(householdSnap.data() as Omit<Household, "id">),
         });
      }
   }

   return households;
}

export default function AccountOverview() {
   const queryClient = useQueryClient()
   const user = auth.currentUser;
   const query = useQuery({
      queryKey: householdKey(user?.uid ?? ''),
      enabled: !!user,
      queryFn: getHouseholds,
   });

   const handleLogout = async () => {
      try {
         await signOut(auth)
         await AsyncStorage.clear()
         queryClient.clear()
         Alert.alert('Utloggad', 'Du har loggats ut.')
         router.replace('/login')
      } catch (error) {
         console.error('Fel vid utloggning:', error)
         Alert.alert('Fel', 'Kunde inte logga ut. Försök igen.')
      }
   }

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
               <TouchableOpacity onPress={handleLogout}>
                  <Text style={styles.logoutText}>Logga ut</Text>
               </TouchableOpacity>
            </View>

            {query.data.length === 0 ? (
               <Text style={{textAlign: 'center'}}>Inga hushåll hittades.</Text>
            ) : (
               <FlatList
                  data={query.data}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                     <TouchableOpacity style={styles.householdItem} 
                     onPress={() => router.push(`/household/overview?householdId=${item.id}`)}>
                        <Text style={styles.householdName}>{item.Name}</Text>
                     </TouchableOpacity>
                  )}
               />
            )}

            <TouchableOpacity style={styles.button} onPress={() => router.push('/createhousehold')}>
               <Text style={styles.buttonText}>Skapa nytt hushåll</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/joinHousehold')}>
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
      shadowOffset: {width: 0, height: 4},
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
   logoutText: {
      color: '#E74C3C',
      fontWeight: '500',
      fontSize: 16,
   },
})
