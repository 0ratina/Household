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

import { useMutation } from "@tanstack/react-query";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../src/firebase";

export type Profile = {
    id: number;
    HouseHoldID: number;
    Name: string;
    isOwner: boolean;
    AvatarID: string;
    AccountId: number;
    isRequest: boolean;
};

async function saveProfile(profile: Profile) {
    const { HouseHoldID, AccountId } = profile;
    const ref = doc(db, `households/${HouseHoldID}/profiles/${AccountId}`);

    await setDoc(
        ref,
        {
            ...profile,
        },
        { merge: true }
    );
}

export default function ProfileScreen() {
    const [username, setUsername] = useState("");

    const HouseHoldID: number = 123;
    const AccountId: number = 456;
    const isOwner: boolean = false;
    const isRequest: boolean = false;
    const [avatarId] = useState<string>("");

    const { mutate, isPending } = useMutation({
        mutationFn: async (name: string) => {
            if (!HouseHoldID || !AccountId) {
                throw new Error("Saknar HouseHoldID eller AccountId.");
            }

            const profile: Profile = {
                id: AccountId,
                HouseHoldID,
                Name: name.trim(),
                isOwner,
                AvatarID: avatarId,
                AccountId,
                isRequest,
            };

            await saveProfile(profile);
        },
        onSuccess: () => {
            router.push("/createhousehold");
        },
        onError: (err: any) => {
            console.error(err);
            alert(err?.message ?? "Kunde inte spara profilen");
        },
    });

    const onSave = () => {
        if (!username.trim()) {
            alert("Ange ett användarnamn!");
            return;
        }
        mutate(username);
    };

    const onClose = () => {
        router.back();
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
                        editable={!isPending}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.bottomBar}>
                <ActionButton
                    icon="add-circle-outline"
                    label={isPending ? "Sparar..." : "Spara"}
                    dividerRight
                    onPress={onSave}
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

const profileColor = "#5F52FF";
const BG = "#EFEFEF";

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
        backgroundColor: "#FFFFFF",
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 0.5,
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
        borderColor: profileColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    inputCard: {
        backgroundColor: "#FFFFFF",
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
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        borderTopWidth: 0.5,
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
        borderRightWidth: 0.5,
        borderRightColor: "rgba(0,0,0,0.08)",
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: "600",
    },
});