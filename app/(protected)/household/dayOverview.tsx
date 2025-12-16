import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getTasksForHousehold } from "../../../src/api/taskOverview";
import { useActiveHousehold } from "../../../src/service/activeHousehold";
import { linkTaskToCategory } from "../../../src/service/dayOverview";

export default function DayOverview() {
  const { data: activeHouseholdId } = useActiveHousehold();
  
  const { data: tasks = []} = useQuery({
    queryKey: ["tasks", activeHouseholdId],
    enabled: !!activeHouseholdId,
    queryFn: () => getTasksForHousehold(activeHouseholdId!),
  });
  console.log("dayOverview:activeHouseholdId:", activeHouseholdId);

  const { late,today,doneToday } = linkTaskToCategory(tasks);

  return (
  <View style={styles.container}>
    <View style={styles.contentWrapper}>
      <ScrollView style={styles.content}>

        <View style={styles.infoCard}>
          <Text style={[styles.smallerInfoText, { color: "#C54B53" }]}>
            🔴 Försenade
          </Text>
        </View>

      {late.map (task => (
        <TouchableOpacity 
        key={task.id} 
        style={styles.card}
        onPress={() => router.push(`/task/${task.id}`)}>
          <Text style={styles.cardText}>{task.title}</Text>
          <Text style={[styles.smallerInfoText, { color: "#C54B53" }]}>
            Försenad {task.daysLate} dagar
          </Text>
        </TouchableOpacity>
      ))}

        <View style={styles.infoCard}>
          <Text style={[styles.smallerInfoText, { color: "#E6A700" }]}>
            🟡 Ska göras idag
          </Text>
        </View>
        
      {today.map(task => (
        <TouchableOpacity 
        key={task.id}
        style={styles.card}
        onPress={() => router.push(`/task/${task.id}`)}>
          <Text style={styles.cardText}>{task.title}</Text>
        </TouchableOpacity>
      ))}

        <View style={styles.infoCard}>
          <Text style={[styles.smallerInfoText, { color: "#2E8B57" }]}>
            🟢 Klara
          </Text>
        </View>

      {doneToday.map(task => (
        <TouchableOpacity 
        key = {task.id}
        style={[styles.card, { backgroundColor: "#E6F7EA" }]}
        onPress={() => router.push(`/task/${task.id}`)}>
          <Text style={styles.cardText}>{task.title}</Text>
          <Text style={[styles.smallerInfoText, { color: "#519059ff" }]}>
            Gjord av: {task.completedBy}
          </Text>
        </TouchableOpacity>
      ))}

      </ScrollView>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  content: {
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "700",
  },
  smallerInfoText: {
    fontSize: 15,
    fontWeight: "600",
  },
});