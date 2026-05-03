import {Ionicons} from '@expo/vector-icons'
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {router, Stack, useFocusEffect, useLocalSearchParams} from 'expo-router'
import {useCallback} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {getMyProfile} from '../../../src/api/getProfile'
import {addTaskCompletion, getTask} from '../../../src/api/taskOverview'
import {useActiveHousehold} from '../../../src/service/activeHousehold'

export default function taskOverview() {
   const {taskId} = useLocalSearchParams()
   const {selectedDate: selectedDateParam} = useLocalSearchParams()
   let parsedDate: string | undefined
   if (Array.isArray(selectedDateParam)) {
      parsedDate = selectedDateParam[0]
   } else {
      parsedDate = selectedDateParam
   }
   const selectedDate = parsedDate ? new Date(parsedDate) : new Date()
   const queryClient = useQueryClient()
   const {data: activeHousehold} = useActiveHousehold()

   const {data: myProfile} = useQuery({
      queryKey: ['myProfile', activeHousehold],
      queryFn: () => getMyProfile(),
   })
   const {data: task, refetch: refetchTask} = useQuery({
      queryKey: ['task', taskId],
      enabled: !!taskId,
      queryFn: () => getTask(taskId as string, selectedDate),
   })

   useFocusEffect(
      useCallback(() => {
         if (!taskId) return
         refetchTask()
      }, [taskId, refetchTask]),
   )

   const toggle = useMutation({
      mutationFn: () => {
         if (!myProfile?.id) throw new Error('No profile id')
         return addTaskCompletion(taskId as string, myProfile.id)
      },
      onSuccess: () => {
         queryClient.invalidateQueries({queryKey: ['task', taskId]})
         queryClient.invalidateQueries({queryKey: ['tasks']})
         router.back()
      },
   })

   const today = new Date()
   const isToday =
      selectedDate.getFullYear() === today.getFullYear() && selectedDate.getMonth() === today.getMonth() && selectedDate.getDate() === today.getDate()

   const handleBack = () => {
      router.back()
   }

   return (
      <>
         <Stack.Screen options={{title: 'Syssla', headerBackTitle: 'Sysslor'}} />

         <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                  <View style={styles.card}>
                     <Text style={styles.cardText}>{task?.title}</Text>
                  </View>

                  <View style={styles.infoCard}>
                     <Text style={styles.infoText}>{task?.desc || 'Ingen Beskrivning'} </Text>
                  </View>

                  <View style={styles.infoCard}>
                     <Text style={[styles.smallerInfoText, {color: '#2E8B57'}]}>🔁 Var {task?.repeatDay} dag </Text>
                  </View>

                  <View style={styles.infoCard}>
                     <Text style={[styles.smallerInfoText, {color: '#7B61FF'}]}>⚡Värde {task?.value}</Text>
                  </View>
            </ScrollView>

            <View style={styles.bottomBar}>
               <TouchableOpacity
                  style={[styles.action, styles.actionDivider, (!isToday || toggle.isPending) && styles.actionDisabled]}
                  activeOpacity={0.8}
                  onPress={() => toggle.mutate()}
                  disabled={!isToday || toggle.isPending}>
                  <Ionicons name='checkmark-done-circle-outline' size={22} style={{marginRight: 10}} />
                  <Text style={styles.actionLabel}>{toggle.isPending ? 'Sparar...' : 'Markera som gjord'}</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.action} activeOpacity={0.8} onPress={handleBack} disabled={toggle.isPending}>
                  <Ionicons name='arrow-back-circle-outline' size={22} style={{marginRight: 10}} />
                  <Text style={styles.actionLabel}>Back</Text>
               </TouchableOpacity>
            </View>
         </View>
      </>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#EFEFEF',
   },
   card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      marginBottom: 14,
      padding: 16,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
   },
   infoCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      marginBottom: 14,
      padding: 25,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
   },
   cardText: {
      fontSize: 18,
      fontWeight: '700',
   },
   infoText: {
      fontSize: 17,
      fontWeight: '700',
   },
   smallerInfoText: {
      fontSize: 15,
      fontWeight: '600',
   },
   content: {
      padding: 16,
      paddingBottom: 120,
   },
   bottomBar: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      backgroundColor: '#FFFFFF',
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
   actionDisabled: {
      opacity: 0.45,
   },
})
