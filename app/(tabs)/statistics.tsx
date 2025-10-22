import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatisticsScreen() {
  const [periodIndex, setPeriodIndex] = useState(0);
  const periods = ["Idag", "Förra veckan", "Oktober", "September", "2020"];

  const tasks = [
    { name: "Laga mat", color: "#F4A261" },
    { name: "Damma", color: "#E76F51" },
    { name: "Diska", color: "#F6BD60" },
    { name: "Ta hand om My", color: "#E9C46A" },
    { name: "Torka golvet", color: "#F7A072" },
    { name: "Vattna blommor", color: "#F28482" },
  ];

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
        <Text style={styles.emoji}>🐥</Text>
        <Text style={styles.emoji}>🦊</Text>
        <Text style={styles.emoji}>🐙</Text>
        <Text style={styles.bigText}>Totalt</Text>
      </View>

      <View style={styles.smallCirclesContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={[styles.smallCircle, { backgroundColor: task.color }]}>
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
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  emoji: {
    position: "absolute",
    fontSize: 28,
  },
  bigText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 70,
  },
  smallCirclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
    marginBottom: 50,
  },
  smallCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  smallText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});
