import { router } from "expo-router";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function TasksScreen() {
  return (
    <View style={{ flex: 1 }}>



      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/createtask")}
      >
        <Text style={styles.addButtonText}>+ Lägg till</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  }
});