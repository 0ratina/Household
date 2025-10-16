import React, {useState} from 'react'
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native'
import {Household} from '../types/Household'

export default function HouseholdScreen() {
   const [households] = useState<Household[]>([
      {id: 1, Code: 1234, Name: 'Familjen Andersson'},
      {id: 2, Code: 5678, Name: 'Familjen Nilsson'},
      {id: 3, Code: 9101, Name: 'Kollektivet Solrosen'},
   ])

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <Text style={styles.header}>Hushåll</Text>

            <FlatList
               data={households}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({item}) => (
                  <View style={styles.item}>
                     <Text style={styles.itemName}>{item.Name}</Text>
                     <Text style={styles.itemCode}>Kod: {item.Code}</Text>
                  </View>
               )}
            />
         </View>

         <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]}>
               <Text style={styles.buttonText}>＋ Lägg till</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]}>
               <Text style={styles.buttonText}>✖ Stäng</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f0f0f0ff',
      justifyContent: 'space-between',
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
      flex: 1,
   },
   header: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: '#111',
   },
   item: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 3,
   },
   itemName: {
      fontSize: 16,
      color: '#111',
      fontWeight: '500',
   },
   itemCode: {
      fontSize: 14,
      color: '#555',
   },
   footer: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#fff',
   },
   button: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 14,
   },
   saveButton: {
      borderRightWidth: 1,
      borderRightColor: '#e0e0e0',
   },
   cancelButton: {},
   buttonText: {
      fontSize: 16,
      color: '#222',
      fontWeight: '500',
   },
})
