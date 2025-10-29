import React, { useState, ComponentProps } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Household } from '../../types/Household'
import { router } from "expo-router";

type IconName = ComponentProps<typeof Ionicons>['name']

type ActionButtonProps = {
   icon: IconName
   label: string
   onPress: () => void
   dividerRight?: boolean
}

function ActionButton({ icon, label, onPress, dividerRight }: ActionButtonProps) {
   return (
      <TouchableOpacity style={[styles.action, dividerRight && styles.actionDivider]} onPress={onPress} activeOpacity={0.8}>
         <Ionicons name={icon} size={22} style={{ marginRight: 10 }} />
         <Text style={styles.actionLabel}>{label}</Text>
      </TouchableOpacity>
   )
}

export default function HouseholdScreen() {
   const [households] = useState<Household[]>([
      { id: 1, Code: 1234, Name: 'Familjen Andersson' },
      { id: 2, Code: 5678, Name: 'Familjen Nilsson' },
      { id: 3, Code: 9101, Name: 'Kollektivet Solrosen' },
   ])

   const onAdd = () => {
      router.push('/createhousehold');
   };

   const onClose = () => {
      router.back();
   };

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <Text style={styles.header}>Hushåll</Text>

            <FlatList
               data={households}
               keyExtractor={(item) => item.id.toString()}
               renderItem={({ item }) => (
                  <View style={styles.item}>
                     <Text style={styles.itemName}>{item.Name}</Text>
                     <Text style={styles.itemCode}>Kod: {item.Code}</Text>
                  </View>
               )}
            />
         </View>

         <View style={styles.bottomBar}>
            <ActionButton
               icon='add-circle-outline'
               label='Lägg till'
               dividerRight
               onPress={onAdd}
            />

            <ActionButton
               icon='close-circle-outline'
               label='Stäng'
               onPress={onClose} />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      justifyContent: 'space-between',
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
      shadowOffset: { width: 0, height: 2 },
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
   bottomBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
      backgroundColor: '#fff',
   },
   action: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
   },
   actionDivider: {
      borderRightWidth: 1,
      borderRightColor: '#e0e0e0',
   },
   actionLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: '#222',
   },
})
