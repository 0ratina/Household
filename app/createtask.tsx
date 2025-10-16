import { Ionicons } from "@expo/vector-icons";
import { HeaderShownContext } from "@react-navigation/elements";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput, StyleSheet } from "react-native";

type PillProps = { label: string | number; tone?: "default" | "repeat" | "muted"; onPress?: () => void };

const Pill = ({ label, tone = "default", onPress }: PillProps) => {
    const toneStyle =
        tone === "repeat"
            ? styles.pillRepeat
            : tone === "muted"
                ? styles.pillMuted
                : styles.pillDefault;

    const Comp = onPress ? TouchableOpacity : View;
    return (
        <Comp {...(onPress ? { onPress, activeOpacity: 0.8 } : {})} style={[styles.pill, toneStyle]}>
            <Text style={[styles.pillText, tone === "muted" && { color: "#444" }]}>{label}</Text>
        </Comp>
    );
};

export default function NewTaskScreen() {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [repeatDay, setRepeatDay] = useState(1);
    const [value, setValue] = useState(1);

    const onSave = () => {
        console.log("Spara", { title, desc, repeatDay, value });
        router.back();
    };

    const onClose = () => {
        console.log("Stäng");
        router.back();
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
            >
                <ScrollView contentContainerStyle={styles.content}>

                    <TextInput
                        style={[styles.card, styles.input]}
                        placeholder="Titel"
                        placeholderTextColor="#9B9B9B"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <TextInput
                        style={[styles.card, styles.textarea]}
                        placeholder="Beskrivning"
                        placeholderTextColor="#B0B0B0"
                        value={desc}
                        onChangeText={setDesc}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                    />

                    <View style={[styles.card, styles.rowBetween]}>
                        <Text style={styles.rowLabel}>Återkommer:</Text>
                        <View style={styles.rowRight}>
                            <Text style={styles.subtle}>var</Text>
                            <Pill
                                tone="repeat"
                                label={repeatDay}
                                onPress={() => setRepeatDay((n) => (n >= 30 ? 1 : n + 1))}
                            />
                            <Text style={styles.subtle}>dag</Text>
                        </View>
                    </View>

                    <View style={[styles.card, { padding: 14 }]}>
                        <View style={[styles.rowBetween, { marginBottom: 4 }]}>
                            <Text style={styles.rowLabel}>Värde:</Text>
                            <Pill
                                tone="muted"
                                label={value}
                                onPress={() => setValue((v) => (v >= 5 ? 1 : v + 1))}
                            />
                        </View>
                        <Text style={styles.helper}>Hur energikrävande är sysslan?</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.bottomBar}>
                <TouchableOpacity style={[styles.action, styles.actionDivider]} activeOpacity={0.8} onPress={onSave}>
                    <Ionicons name="add-circle-outline" size={22} style={{ marginRight: 10 }} />
                    <Text style={styles.actionLabel}>Spara</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.action} activeOpacity={0.8} onPress={onClose}>
                    <Ionicons name="close-circle-outline" size={22} style={{ marginRight: 10 }} />
                    <Text style={styles.actionLabel}>Stäng</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const BG = "#EFEFEF";
const MUTED_BG = "#EFEFEF";
const REPEAT = "#C54B53";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BG },
    content: {
        padding: 16,
        paddingBottom: 120,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 14,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },

    screenTitle: {
        fontSize: 22,
        fontWeight: "700",
    },

    input: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
    },
    textarea: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 120,
        fontSize: 16,
    },

    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: "700",
    },
    rowRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    subtle: {
        fontSize: 15,
        color: "#555",
        marginHorizontal: 4,
    },
    helper: {
        fontSize: 13,
        color: "#7A7A7A",
    },

    pill: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    pillText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#fff",
    },
    pillRepeat: { backgroundColor: REPEAT },
    pillDefault: { backgroundColor: "#333" },
    pillMuted: { backgroundColor: MUTED_BG, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },

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