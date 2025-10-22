import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Createhousehold () {
    return (

        <View style={styles.container}>

            <View style = {styles.inputView}>
                <TextInput style = {styles.input}
                    placeholder = "Kod"
                />
            </View>


            <TouchableOpacity style= {styles.joinButton}> 
                <Text style = {{fontSize: 18}}>Gå med</Text>
            </TouchableOpacity>
        </View>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: '#F5F6FA',

    },
    input: {
        alignSelf: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        width: '40%',
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 20,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        color: '#111' ,
    },
    joinButton: {
        alignSelf:'center' ,
        backgroundColor: '#fff',   
        borderRadius: 50,              
        paddingVertical: 20,           
        paddingHorizontal: 30,      
        shadowColor: '#000',           
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,

    },
    inputView: {
        flex: 1, 
        justifyContent: 'center' ,
    },


})