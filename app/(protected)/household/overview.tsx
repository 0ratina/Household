import { router, useFocusEffect } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { TouchableOpacity, Text, StyleSheet, View, ScrollView } from "react-native";
import { auth, db } from "../../../src/firebase";
import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "../../../types/Task";


async function getTasksForHousehold(householdId: string): Promise<Task[]> {
  if (!householdId) return [];
  const q = query(
    collection(db, "tasks"),
    where("householdId", "==", householdId)
  );
  const snap = await getDocs(q);

  return snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }) as Task
  );
}

async function getActiveHousehold() {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;

  const q = query(collection(db, "profiles"), where("AccountId", "==", uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;

  const profile = snap.docs[0].data() as { householdId?: string; HouseHoldID?: string };
  return profile.householdId ?? profile.HouseHoldID ?? null;
}

export default function OverviewScreen() {
  const queryClient = useQueryClient();

  const { data: householdId, isLoading: loadingHousehold } = useQuery({
    queryKey: ["activeHousehold"],
    queryFn: getActiveHousehold,
  });

  const {
    data: tasks = [],
    isLoading: loadingTasks,
    refetch,
  } = useQuery({
    queryKey: ["tasks", householdId],
    enabled: !!householdId,
    queryFn: () => getTasksForHousehold(householdId!),
  });

  useFocusEffect(
    useCallback(() => {
      if (householdId) {
        queryClient.invalidateQueries({ queryKey: ["tasks", householdId] });
        refetch();
      }
    }, [householdId, queryClient, refetch])
  );

  const isLoading = loadingHousehold || loadingTasks;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {isLoading && <Text>Laddar uppgifter...</Text>}

          {!isLoading && (!householdId || tasks.length === 0) && (
            <Text style={{ textAlign: "center", color: "#555" }}>
              Inga uppgifter hittades.
            </Text>
          )}

          {tasks.map((task: Task) => (
            <View key={task.id} style={styles.taskCard}>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
          ))}
        </ScrollView>

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

  taskCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  taskTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4
  },

  taskSub: {
    color: "#666",
    fontSize: 13
  },

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
  },
});