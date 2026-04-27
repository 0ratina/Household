import {useQuery, useQueryClient} from '@tanstack/react-query'
import {router, useFocusEffect, useLocalSearchParams} from 'expo-router'
import {useCallback, useEffect, useRef, useState} from 'react'
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {getProfilesForHousehold} from '../../../src/api/getProfile'
import {getHousehold} from '../../../src/api/household'
import {getTasksForHousehold} from '../../../src/api/taskOverview'
import {setActiveHousehold} from '../../../src/service/activeHousehold'
import {Profile} from '../../../types/Profile'
import {Task} from '../../../types/Task'

export default function OverviewScreen() {
   const queryClient = useQueryClient()
   const {householdId} = useLocalSearchParams()
   const [selectedDate, setSelectedDate] = useState<Date>(new Date())
   const [profiles, setProfiles] = useState<Profile[]>([])
   const [editMode, setEditMode] = useState(false)
   const longPressTriggered = useRef(false)

   const activeHouseholdId = typeof householdId === 'string' ? householdId : Array.isArray(householdId) ? householdId[0] : null
   useEffect(() => {
      if (!activeHouseholdId) return
      getProfilesForHousehold(activeHouseholdId).then((docs: any[]) => {
         const mappedProfiles: Profile[] = docs.map((d) => ({
            id: d.id,
            AvatarID: d.AvatarID ?? '👤',
            Name: d.Name ?? '',
            HouseHoldID: d.HouseHoldID ?? [],
            isOwner: d.isOwner ?? false,
            AccountId: d.AccountId ?? '',
         }))
         setProfiles(mappedProfiles)
      })
   }, [activeHouseholdId])

   console.log('Overview.tsx activeHouseholdId', activeHouseholdId)

   const {
      data: tasks = [],
      isLoading: loadingTasks,
      refetch,
   } = useQuery({
      queryKey: ['tasks', activeHouseholdId, selectedDate.toDateString()],
      enabled: !!activeHouseholdId,
      queryFn: () => getTasksForHousehold(activeHouseholdId!, selectedDate),
   })

   useFocusEffect(
      useCallback(() => {
         if (!activeHouseholdId) return

         setActiveHousehold(queryClient, activeHouseholdId)

         queryClient.invalidateQueries({
            queryKey: ['tasks', activeHouseholdId, selectedDate.toDateString()],
         })

         getProfilesForHousehold(activeHouseholdId).then((docs: any[]) => {
            const mappedProfiles: Profile[] = docs.map((d) => ({
               id: d.id,
               AvatarID: d.AvatarID ?? '👤',
               Name: d.Name ?? '',
               HouseHoldID: d.HouseHoldID ?? [],
               isOwner: d.isOwner ?? false,
               AccountId: d.AccountId ?? '',
            }))
            setProfiles(mappedProfiles)
         })

         refetch()
      }, [activeHouseholdId, queryClient, selectedDate, refetch]),
   )

   const {data: household} = useQuery({
      queryKey: ['household', activeHouseholdId],
      enabled: !!activeHouseholdId,
      queryFn: () => getHousehold(activeHouseholdId!),
   })

   const isLoading = loadingTasks

   const goToPreviousDay = () => {
      setSelectedDate((prev) => new Date(prev.getTime() - 24 * 60 * 60 * 1000))
   }

   const goToNextDay = () => {
      setSelectedDate((prev) => new Date(prev.getTime() + 24 * 60 * 60 * 1000))
   }
   return (
      <View style={styles.container}>
         <View style={{flex: 1}}>
            {household?.Code && (
               <View style={styles.codeBanner}>
                  <Text style={styles.codeLabel}>Hushållskod</Text>
                  <Text style={styles.codeValue}>{household.Code}</Text>
               </View>
            )}

            <View style={styles.dateHeader}>
               <TouchableOpacity onPress={goToPreviousDay}>
                  <Text style={styles.dateArrow}>{'<'}</Text>
               </TouchableOpacity>

               <Text style={styles.dateText}>
                  {selectedDate.toLocaleDateString('sv-SE', {
                     weekday: 'short',
                     day: 'numeric',
                     month: 'short',
                  })}
               </Text>

               <TouchableOpacity onPress={goToNextDay}>
                  <Text style={styles.dateArrow}>{'>'}</Text>
               </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{padding: 16}}>
               {isLoading && <Text>Laddar uppgifter...</Text>}

               {!isLoading && (!activeHouseholdId || tasks.length === 0) && (
                  <Text style={{textAlign: 'center', color: '#555'}}>Inga uppgifter hittades.</Text>
               )}

               {tasks
                  .filter((task) => {
                     const createdOk = task.createdAt && selectedDate >= task.createdAt
                     const hasCompletion = task.completions?.some((c) => {
                        const completionDate = new Date(c.timestamp)
                        return (
                           completionDate.getFullYear() === selectedDate.getFullYear() &&
                           completionDate.getMonth() === selectedDate.getMonth() &&
                           completionDate.getDate() === selectedDate.getDate()
                        )
                     })
                     return createdOk || hasCompletion
                  })
                  .map((task: Task) => {
                     const showAvatars = task.completedTodayBy && task.completedTodayBy.length > 0

                     return (
                        <TouchableOpacity
                           key={task.id}
                           style={[styles.taskCard, editMode && styles.taskCardEdit]}
                           delayLongPress={300}
                           onLongPress={() => {
                              longPressTriggered.current = true
                              router.push({
                                 pathname: '/updateTask',
                                 params: {id: task.id},
                              })
                           }}
                           onPress={() => {
                              if (longPressTriggered.current) {
                                 longPressTriggered.current = false
                                 return
                              }

                              if (editMode) {
                                 router.push({
                                    pathname: '/updateTask',
                                    params: {id: task.id},
                                 })
                                 return
                              }

                              router.push(`/task/${task.id}?selectedDate=${selectedDate.toISOString()}`)
                           }}>
                           <Text style={styles.taskTitle}>{task.title}</Text>
                           <View
                              style={{
                                 position: 'absolute',
                                 right: 16,
                                 top: 14,
                                 flexDirection: 'row',
                                 alignItems: 'center',
                              }}>
                              {showAvatars
                                 ? (() => {
                                      const distinctProfileIds = Array.from(new Set(task.completedTodayBy))
                                      return distinctProfileIds.map((profileId) => {
                                         const profile = profiles.find((p) => String(p.id) === String(profileId))
                                         return (
                                            <Text key={profileId} style={{marginLeft: 4, fontSize: 18}}>
                                               {profile?.AvatarID ?? '👤'}
                                            </Text>
                                         )
                                      })
                                   })()
                                 : typeof task.daysSinceLastCompletion === 'number' &&
                                   task.daysSinceLastCompletion > 0 &&
                                   task.daysSinceLastCompletion !== task.repeatDay && (
                                      <View
                                         style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: 14,
                                            backgroundColor: task.isOverdue ? '#C54B53' : '#ccc',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowColor: '#000',
                                            shadowOpacity: 0.1,
                                            shadowRadius: 2,
                                            shadowOffset: {width: 0, height: 1},
                                         }}>
                                         <Text
                                            style={{
                                               color: '#fff',
                                               fontSize: 14,
                                               fontWeight: '700',
                                            }}>
                                            {Math.round(task.daysSinceLastCompletion)}
                                         </Text>
                                      </View>
                                   )}
                           </View>
                        </TouchableOpacity>
                     )
                  })}
            </ScrollView>

            <View style={styles.buttonRow}>
               <TouchableOpacity
                  style={[styles.addButton, styles.buttonFlex]}
                  onPress={() => {
                     router.push(`/createtask?householdId=${activeHouseholdId}`)
                  }}>
                  <Text style={styles.addButtonText}>+ Lägg till</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  style={[styles.addButton, styles.buttonFlex, editMode && styles.editButtonActive]}
                  onPress={() => setEditMode((prev) => !prev)}>
                  <Text style={styles.addButtonText}>{editMode ? '✓ Klar' : '✎ Ändra'}</Text>
               </TouchableOpacity>
            </View>
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {flex: 1, backgroundColor: '#EFEFEF'},

   taskCard: {
      backgroundColor: '#fff',
      padding: 14,
      borderRadius: 14,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
      elevation: 3,
   },

   taskTitle: {
      fontWeight: '600',
      fontSize: 16,
      marginBottom: 4,
   },

   taskSub: {
      color: '#666',
      fontSize: 13,
   },

   buttonRow: {
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 8,
   },

   buttonFlex: {
      flex: 1,
      marginHorizontal: 0,
   },

   addButton: {
      backgroundColor: '#111',
      paddingVertical: 14,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
   },

   addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
   },

   editButtonActive: {
      backgroundColor: '#2E8B57',
   },

   taskCardEdit: {
      backgroundColor: '#E8F5E9',
   },

   codeBanner: {
      backgroundColor: '#FFFFFF',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderColor: '#E5E5E5',
      alignItems: 'center',
   },

   codeLabel: {
      fontSize: 11,
      color: '#777',
      textTransform: 'uppercase',
      letterSpacing: 1,
   },

   codeValue: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 2,
   },

   dateHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: '#fff',
      marginBottom: 8,
      borderRadius: 14,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 6,
      shadowOffset: {width: 0, height: 2},
      elevation: 2,
   },

   dateArrow: {
      fontSize: 22,
      fontWeight: '700',
   },

   dateText: {
      fontSize: 16,
      fontWeight: '600',
   },
})
