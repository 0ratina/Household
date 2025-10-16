import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


function ProfileScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSave = () => {
        console.log("Spara", { username, password });
    };

    const onClose = () => {
        console.log("Stäng");
    };
    return (
        <View style={styles.container}>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.avatarWrap}
                        onPress={() => console.log("Lägg till bild")}
                    >
                        <View style={styles.avatarCircle}>
                            <Ionicons name="add" size={36} />
                        </View>
                    </TouchableOpacity>

                    <TextInput
                        style={styles.inputCard}
                        placeholder="Användarnamn"
                        placeholderTextColor="#7A7A7A"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.inputCard}
                        placeholder="Lösenord"
                        placeholderTextColor="#7A7A7A"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.bottomBar}>
                <ActionButton
                    icon="add-circle-outline"
                    label="Spara"
                    onPress={onSave}
                    dividerRight
                />
                <ActionButton
                    icon="close-circle-outline"
                    label="Stäng"
                    onPress={onClose}
                />
            </View>
        </View>
    );
}

type ActionButtonProps = {
    icon: string;
    label: string;
    onPress: () => void;
    dividerRight?: boolean;
};


function ActionButton({ icon, label, onPress, dividerRight }: ActionButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.action, dividerRight && styles.actionDivider]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Ionicons name={icon} size={22} style={{ marginRight: 10 }} />
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
}