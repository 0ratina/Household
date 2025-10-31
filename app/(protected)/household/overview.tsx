import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { auth, db } from "../../../src/firebase";
import { useQuery } from "@tanstack/react-query";

async function getTasksForHousehold(householdId: string) {
  const tasksRef = collection(db, `households/${householdId}/tasks`);
  const snap = await getDocs(tasksRef);

  return snap.docs.map(d => ({
    id: d.id,
    householdId,
    ...(d.data() as object)
  }));
}

export default function OverviewScreen() {
  const uid = auth.currentUser?.uid;

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["allTasks"],
    enabled: !!uid,
    queryFn: () => getAllMyHouseholdTasks(uid!),
  });


  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>



        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/createtask")}
        >
          <Text style={styles.addButtonText}>+ Lägg till</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFEFEF" },
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

function getAllMyHouseholdTasks(arg0: string): any {
  throw new Error("Function not implemented.");
}
