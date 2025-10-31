import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { db } from "../../../src/firebase";

async function getTasksForHousehold(householdId: string) {
  const tasksRef = collection(db, `households/${householdId}/tasks`);
  const snap = await getDocs(tasksRef);

  return snap.docs.map(d => ({
    id: d.id,
    householdId,
    ...(d.data() as object)
  }));
}

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