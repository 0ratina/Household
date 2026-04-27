import {Ionicons} from '@expo/vector-icons'
import {useQueryClient} from '@tanstack/react-query'
import {router, useLocalSearchParams} from 'expo-router'
import {doc, getDoc, updateDoc} from 'firebase/firestore'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {db} from '../../src/firebase'

interface Task {
   id?: string
   title: string
   desc?: string
   repeatDay?: number
   value?: number
   createdAt?: Date
   updatedAt?: Date
}

type PillProps = {
   label: string | number
   tone?: 'default' | 'repeat' | 'muted'
   onPress?: () => void
}

function Pill({label, tone = 'default', onPress}: PillProps) {
   const toneStyle = tone === 'repeat' ? styles.pillRepeat : tone === 'muted' ? styles.pillMuted : styles.pillDefault

   const Comp = onPress ? TouchableOpacity : View

   return (
      <Comp {...(onPress ? {onPress, activeOpacity: 0.8} : {})} style={[styles.pill, toneStyle]}>
         <Text style={[styles.pillText, tone === 'muted' && styles.pillTextMuted]}>{label}</Text>
      </Comp>
   )
}

export default function UpdateTaskScreen() {
   const params = useLocalSearchParams()
   const queryClient = useQueryClient()

   const taskId = useMemo(() => {
      const rawId = params.id
      if (typeof rawId === 'string') return rawId
      if (Array.isArray(rawId) && rawId.length > 0) return rawId[0]
      return null
   }, [params.id])

   const [title, setTitle] = useState('')
   const [desc, setDesc] = useState('')
   const [repeatDay, setRepeatDay] = useState(1)
   const [value, setValue] = useState(1)

   const [isFetching, setIsFetching] = useState(true)
   const [isSaving, setIsSaving] = useState(false)

   const loadTask = useCallback(async () => {
      if (!taskId) {
         Alert.alert('Fel', 'Kunde inte hitta task-id.')
         setIsFetching(false)
         return
      }

      try {
         setIsFetching(true)

         const docRef = doc(db, 'tasks', taskId)
         const docSnap = await getDoc(docRef)

         if (!docSnap.exists()) {
            Alert.alert('Fel', 'Task hittades inte.')
            router.back()
            return
         }

         const data = docSnap.data() as Task

         setTitle(data.title ?? '')
         setDesc(data.desc ?? '')
         setRepeatDay(typeof data.repeatDay === 'number' && data.repeatDay > 0 ? data.repeatDay : 1)
         setValue(typeof data.value === 'number' && data.value > 0 ? data.value : 1)
      } catch (error) {
         console.error('Fel vid hämtning av task:', error)
         Alert.alert('Fel', 'Kunde inte hämta tasken.')
         router.back()
      } finally {
         setIsFetching(false)
      }
   }, [taskId])

   useEffect(() => {
      loadTask()
   }, [loadTask])

   const handleIncrementRepeatDay = () => {
      setRepeatDay((current) => (current >= 30 ? 1 : current + 1))
   }

   const handleIncrementValue = () => {
      setValue((current) => (current >= 5 ? 1 : current + 1))
   }

   const handleUpdate = async () => {
      const trimmedTitle = title.trim()

      if (!trimmedTitle) {
         Alert.alert('Saknas titel', 'Skriv en titel!')
         return
      }

      if (!taskId) {
         Alert.alert('Fel', 'Kunde inte hitta task-id.')
         return
      }

      try {
         setIsSaving(true)

         const docRef = doc(db, 'tasks', taskId)

         await updateDoc(docRef, {
            title: trimmedTitle,
            desc: desc.trim(),
            repeatDay,
            value,
            updatedAt: new Date(),
         })

         await Promise.all([
            queryClient.invalidateQueries({queryKey: ['task', taskId]}),
            queryClient.invalidateQueries({queryKey: ['tasks']}),
         ])

         Alert.alert('Klart', 'Task uppdaterad! ✅')
         router.back()
      } catch (error) {
         console.error('Fel vid uppdatering:', error)
         Alert.alert('Fel', 'Kunde inte uppdatera tasken 😢')
      } finally {
         setIsSaving(false)
      }
   }

   const handleClose = () => {
      router.back()
   }

   if (isFetching) {
      return (
         <View style={[styles.container, styles.centered]}>
            <ActivityIndicator size='large' />
            <Text style={styles.loadingText}>Laddar task...</Text>
         </View>
      )
   }

   return (
      <View style={styles.container}>
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{flex: 1}}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}>
            <ScrollView contentContainerStyle={styles.content}>
               <TextInput
                  style={[styles.card, styles.input]}
                  placeholder='Titel'
                  placeholderTextColor='#9B9B9B'
                  value={title}
                  onChangeText={setTitle}
               />

               <TextInput
                  style={[styles.card, styles.textarea]}
                  placeholder='Beskrivning'
                  placeholderTextColor='#B0B0B0'
                  value={desc}
                  onChangeText={setDesc}
                  multiline
                  numberOfLines={5}
                  textAlignVertical='top'
               />

               <View style={[styles.card, styles.rowBetween]}>
                  <Text style={styles.rowLabel}>Återkommer:</Text>
                  <View style={styles.rowRight}>
                     <Text style={styles.subtle}>var</Text>
                     <Pill tone='repeat' label={repeatDay} onPress={handleIncrementRepeatDay} />
                     <Text style={styles.subtle}>dag</Text>
                  </View>
               </View>

               <View style={[styles.card, {padding: 14}]}>
                  <View style={[styles.rowBetween, {marginBottom: 4}]}>
                     <Text style={styles.rowLabel}>Värde:</Text>
                     <Pill tone='muted' label={value} onPress={handleIncrementValue} />
                  </View>
                  <Text style={styles.helper}>Hur energikrävande är sysslan?</Text>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>

         <View style={styles.bottomBar}>
            <TouchableOpacity style={[styles.action, styles.actionDivider]} activeOpacity={0.8} onPress={handleUpdate} disabled={isSaving}>
               <Ionicons name='create-outline' size={22} style={{marginRight: 10}} />
               <Text style={styles.actionLabel}>{isSaving ? 'Sparar...' : 'Ändra'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.action} activeOpacity={0.8} onPress={handleClose} disabled={isSaving}>
               <Ionicons name='close-circle-outline' size={22} style={{marginRight: 10}} />
               <Text style={styles.actionLabel}>Stäng</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#EFEFEF',
   },

   centered: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
   },

   loadingText: {
      marginTop: 12,
      fontSize: 15,
      color: '#555',
   },

   content: {
      padding: 16,
      paddingBottom: 120,
   },

   card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
   },

   input: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
   },

   textarea: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      minHeight: 120,
      fontSize: 16,
   },

   rowBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
   },

   rowLabel: {
      fontSize: 16,
      fontWeight: '700',
   },

   rowRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },

   subtle: {
      fontSize: 15,
      color: '#555',
      marginHorizontal: 4,
   },

   helper: {
      fontSize: 13,
      color: '#7A7A7A',
   },

   pill: {
      minWidth: 28,
      height: 28,
      borderRadius: 14,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
   },

   pillText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#fff',
   },

   pillTextMuted: {
      color: '#444',
   },

   pillRepeat: {
      backgroundColor: '#C54B53',
   },

   pillDefault: {
      backgroundColor: '#333',
   },

   pillMuted: {
      backgroundColor: '#EFEFEF',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.08)',
   },

   bottomBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: 'rgba(0,0,0,0.08)',
   },

   action: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
   },

   actionDivider: {
      borderRightWidth: 0.5,
      borderRightColor: 'rgba(0,0,0,0.08)',
   },

   actionLabel: {
      fontSize: 16,
      fontWeight: '600',
   },
})
