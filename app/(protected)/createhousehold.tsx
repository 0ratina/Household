import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { User } from 'firebase/auth'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { linkUserToHousehold } from '../../src/api/joinHousehold'
import { authKey } from '../../src/auth/bindAuthStateChanged'
import { auth, db } from '../../src/firebase'
import { HouseholdCreate } from '../../types/Household'
import { householdKey } from './accountOverview'


async function createHousehold({household, user}: {household: HouseholdCreate; user: User}) {
   const householdRef = await addDoc(collection(db, 'households'), household)
   
   await linkUserToHousehold(user.uid,householdRef.id)

   const profileRef = doc(db,'profiles', user.uid)
   await setDoc(profileRef,{
      AccountId: user.uid,
      Name: 'Ägare',
      AvatarID: '🦉',
      isOwner: true,
   },
   {merge:true})

   return householdRef.id
}

export default function Createhousehold() {
   const queryClient = useQueryClient()
   const router = useRouter()

   const {data: user, } = useQuery({
      queryKey: authKey,
      queryFn: async () => auth.currentUser ?? null,
      initialData: auth.currentUser ?? null,
   })
   const createMutation = useMutation({
      mutationFn: createHousehold,
      onSuccess: (newHouseholdId) => {
         if (!user) return

         queryClient.invalidateQueries({queryKey: householdKey(user.uid)})
         router.replace(`/household/overview?householdId=${newHouseholdId}`)
      },
   })

   const [householdName, setHouseholdName] = useState('')

   const handleCreate = async () => {
      if (householdName.trim() === '') return
      const randomCode = Math.round(Math.random() * 10000)
      createMutation.mutate({
         household: {
            Code: randomCode,
            Name: householdName,
         },
         user: user!,
      })
   }

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Skapa nytt hushåll</Text>

         <Text style={styles.label}>Hushållets namn:</Text>
         <TextInput placeholder='Skriv in ett namn' value={householdName} onChangeText={setHouseholdName} style={styles.input} />

         <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Skapa hushåll</Text>
         </TouchableOpacity>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      padding: 25,
      backgroundColor: '#F5F6FA',
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 25,
      textAlign: 'center',
      color: '#222',
   },
   label: {
      fontSize: 16,
      marginBottom: 8,
      color: '#444',
   },
   input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      fontSize: 16,
      marginBottom: 20,
      backgroundColor: '#fff',
   },
   button: {
      backgroundColor: '#2E8B57',
      paddingVertical: 12,
      borderRadius: 10,
   },
   buttonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
   },
   resultContainer: {
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 12,
      elevation: 2,
   },
   successText: {
      fontSize: 20,
      marginBottom: 15,
   },
   resultLabel: {
      fontSize: 18,
      marginVertical: 5,
   },
   bold: {
      fontWeight: 'bold',
   },
})
