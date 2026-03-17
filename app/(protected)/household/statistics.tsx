import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../../src/firebase";
import { useActiveHousehold } from "../../../src/service/activeHousehold";

interface CompletedTask {
  name: string;
  taskId: string;
  userId: string;
  householdId: string;
  value: number;
  doneAt?: Date;
}

export default function StatisticsScreen() {
  const { data: activeHouseholdId } = useActiveHousehold();

  const [periodIndex, setPeriodIndex] = useState(0);
  const periods = ["Idag", "Förra veckan", "Förra månaden"];
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Ingen användare inloggad");
          setCompletedTasks([]);
          return;
        }

        if (!activeHouseholdId) {
          console.warn("Ingen aktiv householdId");
          setCompletedTasks([]);
          return;
        }

        const profileQ = query(
          collection(db, "profiles"),
          where("AccountId", "==", user.uid)
        );

        const profileSnap = await getDocs(profileQ);

        if (profileSnap.empty) {
          console.warn("Ingen profil hittad för användaren");
          setCompletedTasks([]);
          return;
        }

        const currentProfileId = profileSnap.docs[0].id;

        const statsQ = query(
          collection(db, "tasks"),
          where("HouseHoldID", "==", activeHouseholdId)
        );

        const tasksSnap = await getDocs(statsQ);
        const statsData: CompletedTask[] = [];

        tasksSnap.docs.forEach((taskDoc) => {
          const taskData = taskDoc.data();
          const completions = taskData.completions || [];

          completions.forEach((completion: any) => {
            if (completion.profileId === currentProfileId) {
              statsData.push({
                name: taskData.title ?? "Okänd uppgift",
                taskId: taskDoc.id,
                userId: completion.profileId,
                householdId: taskData.HouseHoldID,
                value: taskData.value ?? 0,
                doneAt: completion.timestamp?.toDate?.(),
              });
            }
          });
        });

        setCompletedTasks(statsData);
      } catch (e) {
        console.error("Fel vid hämtning av statistik:", e);
        setCompletedTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [activeHouseholdId]);

  const changePeriod = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setPeriodIndex((prev) => (prev > 0 ? prev - 1 : periods.length - 1));
    } else {
      setPeriodIndex((prev) => (prev < periods.length - 1 ? prev + 1 : 0));
    }
  };

  function filterTasksByPeriod(tasks: CompletedTask[], periodIndex: number) {
    const now = new Date();

    if (periodIndex === 0) {
      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt.getDate() === now.getDate() &&
          t.doneAt.getMonth() === now.getMonth() &&
          t.doneAt.getFullYear() === now.getFullYear()
      );
    } else if (periodIndex === 1) {
      const firstDayOfWeek = new Date(now);
      firstDayOfWeek.setDate(now.getDate() - now.getDay());
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const firstDayOfLastWeek = new Date(firstDayOfWeek);
      firstDayOfLastWeek.setDate(firstDayOfWeek.getDate() - 7);
      firstDayOfLastWeek.setHours(0, 0, 0, 0);

      const lastDayOfLastWeek = new Date(firstDayOfWeek);
      lastDayOfLastWeek.setDate(firstDayOfWeek.getDate() - 1);
      lastDayOfLastWeek.setHours(23, 59, 59, 999);

      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt >= firstDayOfLastWeek &&
          t.doneAt <= lastDayOfLastWeek
      );
    } else if (periodIndex === 2) {
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
        0,
        0,
        0,
        0
      );

      const lastDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999
      );

      return tasks.filter(
        (t) =>
          t.doneAt &&
          t.doneAt >= firstDayOfLastMonth &&
          t.doneAt <= lastDayOfLastMonth
      );
    }

    return tasks;
  }

  const filteredTasks = filterTasksByPeriod(completedTasks, periodIndex);
  const totalValue = filteredTasks.reduce((sum, t) => sum + (t.value || 0), 0);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hushållet</Text>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => changePeriod("prev")}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.periodText}>{periods[periodIndex]}</Text>

        <TouchableOpacity onPress={() => changePeriod("next")}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.bigCircle}>
        <Text style={styles.bigText}>{loading ? "..." : `${totalValue}`}</Text>
        <Text style={{ fontSize: 14 }}>poäng totalt</Text>
      </View>

      {filteredTasks.length === 0 && !loading && (
        <Text style={styles.noStatsText}>Ingen statistik ännu 😅</Text>
      )}

      <View style={styles.smallCirclesContainer}>
        {filteredTasks.map((task, index) => (
          <View
            key={index}
            style={[styles.smallCircle, { backgroundColor: "#f09550" }]}
          >
            <Text style={styles.smallText}>{task.name}</Text>

          </View>
        ))}
      </View>

      <View style={styles.taskCountContainer}>
        <Text>Antal uppgifter: {loading ? "..." : filteredTasks.length}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 40,
    marginBottom: 30,
  },
  periodText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  bigCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#F7C59F",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  bigText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#333",
  },
  noStatsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 20,
  },
  smallCirclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 20,
  },
  smallCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  smallText: {
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },
  taskCountContainer: {
    padding: 10,
    backgroundColor: "#F7C59F",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
})