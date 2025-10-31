import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function taskOverview () {
    return (

            <View style={styles.container}>
                <View style = {styles.contentWrapper}>

                    <ScrollView style = {styles.content}>

                        <View style = {styles.card}>
                            <Text style = {styles.cardText}> Göra tvätten</Text>
                        </View>

                        <View style = {styles.infoCard}>
                            <Text style = {styles.infoText}> 
                                - Glöm inte seprarera vita{"\n"}
                                - Tvätta på 30 grader
                            </Text>
                        </View>
                    </ScrollView>


                    <TouchableOpacity style= {styles.button}> 
                        <Text style = {{fontSize: 18}}>Markera som gjord</Text>
                    </TouchableOpacity>

                </View>

            </View>

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
    content: {
        flexGrow: 1
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },

})