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
import type { ComponentProps } from "react";
import { router } from "expo-router";


export default function ProfileScreen() {
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
                    dividerRight
                    onPress={() => {
                        onSave();
                        router.replace("/");
                    }}
                />

                <ActionButton
                    icon="close-circle-outline"
                    label="Stäng"
                    onPress={() => {
                        onClose();
                        router.replace("/");
                    }}
                />
            </View>
        </View>
    );

}

type IconName = ComponentProps<typeof Ionicons>["name"];

type ActionButtonProps = {
    icon: IconName;
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

const PURPLE = "#5F52FF";
const BG = "#EFEFEF";
const CARD = "#FFFFFF";

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: BG,
    },
    container: {
        flex: 1,
        backgroundColor: BG,
    },
    header: {
        backgroundColor: CARD,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "rgba(0,0,0,0.06)",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 120,
    },
    avatarWrap: {
        alignItems: "center",
        marginBottom: 22,
    },
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: PURPLE,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    inputCard: {
        backgroundColor: CARD,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: CARD,
        flexDirection: "row",
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "rgba(0,0,0,0.08)",
    },
    action: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
    },
    actionDivider: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: "rgba(0,0,0,0.08)",
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
});