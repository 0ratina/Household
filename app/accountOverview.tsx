import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native'
import {router} from 'expo-router'
import {Ionicons} from '@expo/vector-icons'

export default function KontoOversikt() {
   const hushall = [
      {id: '1', namn: 'Familjen Andersson'},
      {id: '2', namn: 'Kollegorna på kontoret'},
   ]

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            {/* Header med titel + profilikon */}
            <View style={styles.headerContainer}>
               <Text style={styles.header}>Dina Hushåll</Text>
               <TouchableOpacity onPress={() => router.push('/profile')}>
                  <Ionicons name='person-circle-outline' size={36} color='#007AFF' />
               </TouchableOpacity>
            </View>

            <FlatList
               data={hushall}
               keyExtractor={(item) => item.id}
               renderItem={({item}) => (
                  <TouchableOpacity style={styles.householdItem} onPress={() => router.push('/househould')}>
                     <Text style={styles.householdName}>{item.namn}</Text>
                  </TouchableOpacity>
               )}
            />

            {/* Knappar */}
            <TouchableOpacity style={styles.button} onPress={() => router.push('/createhousehold')}>
               <Text style={styles.buttonText}>Skapa nytt hushåll</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.push('/househould')}>
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
})
