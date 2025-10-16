import { router } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";

type PillProps = { label: string | number; tone?: "default" | "danger" | "muted"; onPress?: () => void };

const Pill = ({ label, tone = "default", onPress }: PillProps) => {
    const toneStyle =
        tone === "danger"
            ? styles.pillDanger
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
    const [repeatDay, setRepeatDay] = useState(7);
    const [value, setValue] = useState(2);

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
                    <View style={[styles.card, { paddingVertical: 16, paddingHorizontal: 16 }]}>
                        <Text style={styles.screenTitle}>Skapa en ny syssla</Text>
                    </View>

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
                                tone="danger"
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
        </View>
    );
}