import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, router } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { auth } from '../../src/firebase'


async function signInUser({email, password}: {email: string; password: string}) {
   const userCredential = await signInWithEmailAndPassword(auth, email, password)
   return userCredential.user
}

export default function Login() {

   const queryClient = useQueryClient();
   
   const [email, setUsername] = useState('kalle.pulli@hotmail.com')
   const [password, setPassword] = useState('Test123')

   const mutation = useMutation({
      mutationFn: signInUser,
      onSuccess: (user) => {
         Alert.alert('Inloggad!', `Välkommen ${user.email}`)
         setUsername('')
         setPassword('')
         queryClient.invalidateQueries({ queryKey: ['households', user.uid] });
         router.push('/accountOverview')
      },
      onError: (error) => {
         console.error('Fel vid inloggning:', error)
         Alert.alert('Fel användarnamn eller lösenord.')
      },
   })

   const onLogin = () => {
      if (!email || !password) {
         Alert.alert('Fyll i användarnamn och lösenord.')
         return
      }
      mutation.mutate({email, password})
   }

   const onClose = () => {
      router.back()
   }

   return (
      <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: '#f0f0f0'}}>
         <Text style={styles.title}>Logga in</Text>
         <View style={styles.container}>
            <View style={styles.card}>
               <Text style={styles.header}>Logga in</Text>

               <TextInput style={styles.input} placeholder='Användarnamn' placeholderTextColor='#7A7A7A' value={email} onChangeText={setUsername} />

               <TextInput
                  style={styles.input}
                  placeholder='Lösenord'
                  placeholderTextColor='#7A7A7A'
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
               />

               <Button title={mutation.isPending ? 'Loggar in...' : 'Logga in'} onPress={onLogin} disabled={mutation.isPending} />

               <Link style={styles.link} href='/createUser'>
                  Bli medlem
               </Link>
            </View>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   title: {fontSize: 26, fontWeight: '600', textAlign: 'center', marginTop: 8, marginBottom: 16},
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
