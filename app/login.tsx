import React, {useState} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'

export default function Login() {
   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')

   return (
      <View style={styles.container}>
         <View style={styles.card}>
            <Text style={styles.header}>Logga In</Text>

            <TextInput style={styles.input} placeholder='Användarnamn' placeholderTextColor='#aaa' value={username} onChangeText={setUsername} />

            <TextInput
               style={styles.input}
               placeholder='Lösenord'
               placeholderTextColor='#aaa'
               secureTextEntry
               value={password}
               onChangeText={setPassword}
            />
         </View>

         <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.saveButton]}>
               <Text style={styles.buttonText}>＋ Spara</Text>
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
