import React, { useCallback, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform } from "react-native";
import { Link } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (Platform.OS === "android") {
          Alert.alert("Exit App", "Are you sure you want to exit?", [
            { text: "Cancel", style: "cancel" },
            { text: "Exit", onPress: () => BackHandler.exitApp() },
          ]);
          return true;
        }
        return false;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login As</Text>

      <Link href="/(admin)/login" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Admin</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/(screener)/FilterSchools" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Screener</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
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
