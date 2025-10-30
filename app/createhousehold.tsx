import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from "expo-router";
import { createHousehold } from '@/api/Household';
import { useMutation } from "@tanstack/react-query";



export default function Createhousehold () {
  const [householdName, setHouseholdName] = useState('');
  const [createdCode, setCreatedCode] = useState('');

  const mutation = useMutation({
    mutationFn: createHousehold,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Skapa nytt hushåll</Text>

      {!createdCode ? (
        <>
          <Text style={styles.label}>Hushållets namn:</Text>
          <TextInput
            placeholder="Skriv in ett namn"
            value={householdName}
            onChangeText={setHouseholdName}
            style={styles.input}
          />
          <Text style={styles.label}>Hushållets kod:</Text>
          <TextInput
            placeholder="Skriv in kod"
            value={createdCode}
            onChangeText={setCreatedCode}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button} onPress={() => mutation.mutate({ householdName, createdCode })}>
            <Text style={styles.buttonText}>Skapa hushåll</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.successText}>🎉 Hushållet har skapats!</Text>
          <Text style={styles.resultLabel}>Namn: <Text style={styles.bold}>{householdName}</Text></Text>
          <Text style={styles.resultLabel}>Kod: <Text style={styles.bold}>{createdCode}</Text></Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#4B7BE5', marginTop: 20 }]}
            onPress={() => {
           router.push("/househould");  
           }}

          >
            <Text style={styles.buttonText}>Gå till hushållet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#F5F6FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  successText: {
    fontSize: 20,
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 18,
    marginVertical: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
});
