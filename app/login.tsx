import {Ionicons} from '@expo/vector-icons'

import {Link, router} from 'expo-router'
import React, {ComponentProps, useState} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View, Button} from 'react-native'

type IconName = ComponentProps<typeof Ionicons>['name']

type ActionButtonProps = {
   icon: IconName
   label: string
   onPress: () => void
   dividerRight?: boolean
}

function ActionButton({icon, label, onPress, dividerRight}: ActionButtonProps) {
   return (
      <TouchableOpacity style={[styles.action, dividerRight && styles.actionDivider]} onPress={onPress} activeOpacity={0.8}>
         <Ionicons name={icon} size={22} style={{marginRight: 10}} />
         <Text style={styles.actionLabel}>{label}</Text>
      </TouchableOpacity>
   )
}

export default function Login() {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   const onSave = () => {
      console.log('Spara tryckt')
   }

   const onClose = () => {
      console.log('Stäng tryckt')
   }

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <Text style={styles.header}>Logga In</Text>

            <TextInput style={styles.input} placeholder='Användarnamn' placeholderTextColor='#7A7A7A' value={username} onChangeText={setUsername} />

            <TextInput
               style={styles.input}
               placeholder='Lösenord'
               placeholderTextColor='#7A7A7A'
               secureTextEntry
               value={password}
               onChangeText={setPassword}
            />
            <Button title='Logga In' onPress={() => router.push('/accountOverview')} />
            <Link style={styles.link} href='/createUser'>
               Bli medlem
            </Link>
         </View>

         <View style={styles.bottomBar}>
            <ActionButton icon='add-circle-outline' label='Spara' dividerRight onPress={onSave} />
            <ActionButton icon='close-circle-outline' label='Stäng' onPress={onClose} />
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
      shadowOffset: {width: 0, height: 4},
      shadowRadius: 6,
   },
   header: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      color: '#111',
   },
   input: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginBottom: 10,
      fontSize: 15,
      color: '#111',
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: {width: 0, height: 2},
      shadowRadius: 3,
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
   link: {
      textAlign: 'center',
      fontSize: 16,
      color: '#007AFF',
      margin: 10,
   },
})
