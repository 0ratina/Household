import { useQueryClient } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { isUserInHousehold, linkUserToHousehold, verifyHouseholdCode } from '../../src/api/joinHousehold';
import { householdKey } from "./accountOverview";

export default function joinHousehold() {

    const [code, setCode] = useState("");
    const auth = getAuth();
    const queryClient = useQueryClient();

    const handleJoin = async () => {
        if (!code.trim()) {
            Alert.alert("Skriv in en kod!")
            return;
        }
        const household = await verifyHouseholdCode(Number(code.trim()));
        const user = auth.currentUser;

        if (!household) {
            Alert.alert("Koden matchar inget hushhåll");
            return;
        }

        if (!user) {
            Alert.alert("Ingen användare är inloggad.");
            return;
        }

        const alreadyJoined = await isUserInHousehold(user.uid,household.id)
        if (alreadyJoined) {
            Alert.alert(`Du är redan med i: ${household.Name}`);
            return;
        }

        await linkUserToHousehold(user.uid,household.id);
        queryClient.invalidateQueries({
            queryKey: householdKey(user.uid),
        });
        Alert.alert(`Du gick med i: ${household.Name}`);

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