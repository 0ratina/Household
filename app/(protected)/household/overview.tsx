import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../../src/firebase";
import { Task } from "../../../types/Task";


async function getTasksForHousehold(householdId: string): Promise<Task[]> {
  if (!householdId) return [];
  const q = query(
    collection(db, "tasks"),
    where("HouseHoldID", "==", householdId)
  );
  const snap = await getDocs(q);
  console.log("hämtar tasks för householdId", householdId,snap.docs.length);

  return snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<Task, "id">) }) as Task,
  );
}

export default function OverviewScreen() {
  const queryClient = useQueryClient();
  const {householdId} = useLocalSearchParams();

  const activeHouseholdId = typeof householdId === "string"
  ? householdId
  : Array.isArray(householdId)
  ? householdId[0]
  : null;

  console.log("Overview.tsx activeHouseholdId",activeHouseholdId)

  const {
    data: tasks = [],
    isLoading: loadingTasks,
    refetch,
  } = useQuery({
    queryKey: ["tasks", activeHouseholdId],
    enabled: !!activeHouseholdId,
    queryFn: () => getTasksForHousehold(activeHouseholdId!),
  });

  useFocusEffect(
    useCallback(() => {
      if (activeHouseholdId) {
        queryClient.invalidateQueries({ queryKey: ["tasks", activeHouseholdId] });
        refetch();
      }
    }, [activeHouseholdId, queryClient, refetch])
  );

  const isLoading = loadingTasks;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {isLoading && <Text>Laddar uppgifter...</Text>}

          {!isLoading && (!activeHouseholdId || tasks.length === 0) && (
            <Text style={{ textAlign: "center", color: "#555" }}>
              Inga uppgifter hittades.
            </Text>
          )}

          {tasks
          .filter(t => !t.isAchieved)
          .map((task: Task) => (
            <TouchableOpacity key={task.id} style={styles.taskCard}
            onPress={() => router.push(`/task/${task.id}`)}
            >
              <Text style={styles.taskTitle}>{task.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            console.log("öppnar CreateTask med householdId", householdId);
            router.push(`/createtask?householdId=${activeHouseholdId}`)
          }}
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