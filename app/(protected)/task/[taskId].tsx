import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTask, toggleTaskAchieved } from "../../../src/api/taskOverview";

export default function taskOverview () {
    const {taskId} = useLocalSearchParams();
    const queryClient = useQueryClient();

    const {data: task,} = useQuery({
        queryKey: ["task",taskId],
        enabled: !!taskId,
        queryFn: () => getTask(taskId as string),
    })

    const toggle = useMutation({
        mutationFn: () => toggleTaskAchieved(taskId as string, task?.isAchieved),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["task",taskId]});
            queryClient.invalidateQueries({queryKey: ["tasks"]});
        }
    });
    return (
        <>  
    
        <Stack.Screen options = {{title: "Syssla"}} />
        
            <View style={styles.container}>
                <View style = {styles.contentWrapper}>

                    <ScrollView style = {styles.content}>

                        <View style = {styles.card}>
                            <Text style = {styles.cardText}>{task?.title}</Text>
                        </View>

                        <View style = {styles.infoCard}>
                            <Text style = {styles.infoText}>{task?.desc || "Ingen Beskrivning"} </Text>
                        </View>

                        <View style = {styles.infoCard}>
                            <Text style = {[styles.smallerInfoText, {color: "#2E8B57"}]}>🔁 Var {task?.repeatDay} dag </Text>
                        </View>

                        <View style = {styles.infoCard}> 
                            <Text style = {[styles.smallerInfoText, {color: "#7B61FF"}]}>⚡Värde {task?.value}</Text>
                        </View>
                    </ScrollView>

                    {!task?.isAchieved && (
                        <TouchableOpacity style= {styles.button} onPress={() => toggle.mutate()}> 
                            <Text style = {{fontSize: 18}}>Markera som gjord</Text>
                        </TouchableOpacity>
                    )}

                </View>

            </View>
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFEFEF" 
    },
    button: {
        alignSelf:'center' ,
        backgroundColor: '#fff',   
        borderRadius: 50,              
        paddingVertical: 20,           
        paddingHorizontal: 30, 
        marginBottom: 20,    
        shadowColor: '#000',           
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 14,
        padding: 16, 
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    infoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 14,
        padding: 25, 
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    cardText: {
        fontSize: 18,
        fontWeight: "700",
    },
    infoText: {
        fontSize: 17,
        fontWeight: "700",
    },
    smallerInfoText: {
        fontSize: 15,
        fontWeight: "600",
    },
    content: {
        flexGrow: 1
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },

})