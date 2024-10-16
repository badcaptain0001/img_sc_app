import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Icon library for icons
import { TouchableOpacity } from "react-native";

function StartScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userinfo");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error reading value:", e);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userinfo");
    navigation.reset({
      index: 0,
      routes: [{ name: "LoginScreen" }],
    });
  };

  useEffect(() => {
    getData()
      .then((data) => {
        if (data) {
          setUserDetails(JSON.parse(data));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!userDetails) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: userDetails.profilePicture }}
            style={styles.profilePicture}
          />
          <Text style={styles.fullName}>{userDetails.fullName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <InfoItem label="Phone" value={userDetails.phone} />
          <InfoItem label="Aadhar Card" value={userDetails.aadharCard} />
          <InfoItem label="Address" value={userDetails.address} />
          <InfoItem label="City" value={userDetails.city} />
          <InfoItem label="State" value={userDetails.state} />
          <InfoItem label="Pincode" value={userDetails.pincode} />
          <InfoItem label="Status" value={userDetails.status} />
        </View>
        {/* create a logout button */}
        <View style={styles.infoContainer}>
        <TouchableOpacity onPress={() => logout()}>
          <View style={styles.infoItem}>
            <Text style={styles.value}>Logout</Text>
            <Ionicons name="log-out" size={24} color="#333" />
          </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#333",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: "#666",
  },
  infoContainer: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

export default StartScreen;
