import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatisticsScreen() {
  const [period, setPeriod] = useState("Idag");

  const tasks = [
    { name: "Dammsuga", color: "#FFD166" },
    { name: "Diska", color: "#06D6A0" },
    { name: "Laga mat", color: "#EF476F" },
    { name: "Ta hand om hunden", color: "#118AB2" },
    { name: "Torka golvet", color: "#073B4C" },
    { name: "Vattna blommor", color: "#8ECAE6" },
  ];

  const changePeriod = (direction: "prev" | "next") => {
    if (direction === "prev") setPeriod("Förra veckan");
    else setPeriod("Nästa vecka");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Statistik</Text>

      <View style={styles.navRow}>
        <TouchableOpacity onPress={() => changePeriod("prev")}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.periodText}>{period}</Text>

        <TouchableOpacity onPress={() => changePeriod("next")}>
          <Ionicons name="arrow-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.bigCircle}>
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
    backgroundColor: "#F8F8F8",
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
    backgroundColor: "#FFD166",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  bigText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  smallCirclesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
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
    elevation: 3,
  },
  smallText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 8,
  },
});