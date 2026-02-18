import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../../src/firebase";

interface CompletedTask {
  taskId: string;
  userId: string;
  householdId: string;
  value: number;
  doneAt?: Date;
}

export default function StatisticsScreen() {
  const [periodIndex, setPeriodIndex] = useState(0);
  const periods = ["Idag", "Förra veckan", "Oktober"];

  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setHouseholdId] = useState<string | null>(null);

  const defaultTasks = [
    { name: "Laga mat", color: "#F4A261" },
    { name: "Damma", color: "#E76F51" },
    { name: "Diska", color: "#F6BD60" },
    { name: "Ta hand om My", color: "#E9C46A" },
    { name: "Torka golvet", color: "#F7A072" },
    { name: "Vattna blommor", color: "#F28482" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Ingen användare inloggad");
          return;
        }

        const profileQ = query(
          collection(db, "profiles"),
          where("AccountId", "==", user.uid),
        );
        const profileSnap = await getDocs(profileQ);

        if (profileSnap.empty) {
          console.warn("Ingen profil hittad för användaren");
          return;
        }

        const profileData = profileSnap.docs[0].data();
        const householdId = profileData.HouseHoldID;
        setHouseholdId(householdId);

        const statsQ = query(
          collection(db, "completedTasks"),
          where("householdId", "==", householdId),
        );

        const statsSnap = await getDocs(statsQ);
        const statsData = statsSnap.docs.map((doc) => {
          const d = doc.data();
          return {
            ...d,
            doneAt: d.doneAt?.toDate ? d.doneAt.toDate() : undefined,
          } as CompletedTask;
        });

        setCompletedTasks(statsData);
      } catch (e) {
        console.error("Fel vid hämtning av statistik:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalValue = completedTasks.reduce((sum, t) => sum + (t.value || 0), 0);

  const changePeriod = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setPeriodIndex((prev) => (prev > 0 ? prev - 1 : periods.length - 1));
    } else {
      setPeriodIndex((prev) => (prev < periods.length - 1 ? prev + 1 : 0));
    }
  };

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

      {completedTasks.length === 0 && !loading && (
        <Text style={styles.noStatsText}>Ingen statistik ännu 😅</Text>
      )}

      <View style={styles.smallCirclesContainer}>
        {defaultTasks.map((task, index) => (
          <View
            key={index}
            style={[styles.smallCircle, { backgroundColor: task.color }]}
          >
            <Text style={styles.smallText}>{task.name}</Text>
          </View>
        ))}
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
});
