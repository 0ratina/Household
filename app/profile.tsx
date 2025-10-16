import React, { useState } from "react";
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


function ProfileScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onSave = () => {
        // TODO: spara logik
        console.log("Spara", { username, password });
    };

    const onClose = () => {
        // TODO: stäng/navigera bort
        console.log("Stäng");
    };
}