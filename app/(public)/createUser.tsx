import React, { useState, ComponentProps } from 'react'
import { View, Text, TextInput, TouchableOpacity, Button, Alert, StyleSheet } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../src/firebase'

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

async function createUser({ email, password }: { email: string; password: string }) {
   const userCredential = await createUserWithEmailAndPassword(auth, email, password)
   return userCredential.user
}

export default function Register() {
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const mutation = useMutation({
      mutationFn: createUser,
      onSuccess: (user) => {
         Alert.alert('Konto skapat!', `Välkommen ${user.email}`)
         setEmail('')
         setPassword('')
         router.push('/accountOverview')
      },
      onError: (error) => {
         console.error('Fel vid registrering:', error)
         Alert.alert('Kunde inte skapa konto.')
      },
   })

   const onSave = () => {
      if (!email || !password) {
         Alert.alert('Fyll i e-post och lösenord.')
         return
      }
      mutation.mutate({ email, password })
   }

   const onClose = () => {
      router.back()
   }

   return (
      <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
         <Text style={styles.title}>Registrera</Text>
         <View style={styles.container}>
            <View style={styles.card}>
               <Text style={styles.header}>Registrera</Text>

               <TextInput style={styles.input} placeholder='E-post' keyboardType='email-address' value={email} onChangeText={setEmail} />

               <TextInput style={styles.input} placeholder='Lösenord' secureTextEntry value={password} onChangeText={setPassword} />

               <Button title={mutation.isPending ? 'Skapar konto...' : 'Bli medlem'} onPress={onSave} disabled={mutation.isPending} />

               <Link style={styles.link} href='/login'>
                  Logga in
               </Link>
            </View>

            <View style={styles.bottomBar}>
               <ActionButton icon='add-circle-outline' label='Spara' dividerRight onPress={onSave} />
               <ActionButton icon='close-circle-outline' label='Stäng' onPress={onClose} />
            </View>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginTop: 8, marginBottom: 16 },
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
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
   },
   emojiRow: {
      marginTop: 8,
      alignItems: 'center',
   },
   emoji: {
      fontSize: 20,
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
