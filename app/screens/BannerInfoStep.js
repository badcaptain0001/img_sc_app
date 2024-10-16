import React, { useState,useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  ProgressBar,
  Divider,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";

export default function BannerInfoStep({ onNext }) {
  const [workerPhone, setWorkerPhone] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    workerPhone: "",
    bannerHeight: "",
    bannerWidth: "",
    bannerType: "",
    bannerStatus: "Active",
    nameOfSite: "",
  });

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    // Proceed to the next step
    onNext(formData);
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userinfo');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
    getData().then((data) => {
      if (data) {
        setUserDetails(data);
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);
  useEffect(() => {
    if (userDetails) {
      const data = JSON.parse(userDetails);
      formData.workerPhone = data.phone;
    }
  }, [userDetails]);

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Step 1 of 3: Banner Information</Text>
          <ProgressBar
            progress={0.33}
            color="#6200ee"
            style={styles.progressBar}
          />

          <Text style={styles.subHeading}>Enter the Details</Text>
          <Divider style={styles.divider} />
          <TextInput
            label="Banner Height (in feet)"
            value={formData.bannerHeight}
            onChangeText={(text) => handleChange("bannerHeight", text)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Banner Width (in feet)"
            value={formData.bannerWidth}
            onChangeText={(text) => handleChange("bannerWidth", text)}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Banner Type"
            value={formData.bannerType}
            onChangeText={(text) => handleChange("bannerType", text)}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Name of Site"
            value={formData.nameOfSite}
            onChangeText={(text) => handleChange("nameOfSite", text)}
            style={styles.input}
            mode="outlined"
          />

          <Button mode="contained" onPress={handleNext} style={styles.button}>
            Next
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  progressBar: {
    marginBottom: 20,
    width: "100%",
  },
  input: {
    marginBottom: 15,
    width: "100%",
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    width: "100%",
  },
  divider: {
    marginBottom: 20,
    backgroundColor: "#ddd",
    width: "100%",
  },
});