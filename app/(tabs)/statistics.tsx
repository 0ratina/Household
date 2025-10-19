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