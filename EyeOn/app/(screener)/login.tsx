import React from 'react'
import { Link } from 'expo-router';
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
          <Text style={styles.title}>Login As</Text>
    
          <Link href="/primary" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Primary</Text>
            </TouchableOpacity>
          </Link>
    
          <Link href="/secondary" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Secondary</Text>
            </TouchableOpacity>
          </Link>
        </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#8F73E2",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginVertical: 10,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
