import { View, Text, TouchableOpacity } from "react-native";

type PillProps = { label: string; tone?: "default" | "danger" | "muted"; onPress?: () => void };

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