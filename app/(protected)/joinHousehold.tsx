import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { verifyHouseholdCode,linkUserToHousehold } from '../../src/api/joinHousehold';
import { getAuth } from "firebase/auth";

export default function joinHousehold() {

    const [code, setCode] = useState("");
    const auth = getAuth();

    const handleJoin = async () => {
        if (!code.trim()) {
            Alert.alert("Skriv in en kod!")
            return;
        }
        const household = await verifyHouseholdCode(Number(code.trim()));

        if (household) {
            const user = auth.currentUser;
            if (user) {
                await linkUserToHousehold(user.uid,household.id);
                Alert.alert(`Du gick med i: ${household.Name}`)
            }
            else {
                Alert.alert("Ingen användare är inloggad.")
            }
        }
        else {
            Alert.alert("Koden matchar inget hushåll")
        }
    }
    return (

        <View style={styles.container}>

            <View style={styles.inputView}>
                <TextInput style={styles.input}
                    placeholder="Kod"
                    value={code}
                    onChangeText={setCode}
                />
            </View>

            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
                <Text style={{ fontSize: 18 }}>Gå med</Text>
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
        color: '#111',
    },
    joinButton: {
        alignSelf: 'center',
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
        justifyContent: 'center',
    },


})