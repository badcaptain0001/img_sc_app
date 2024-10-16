import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView } from "react-native";

export default function Review({ stepData, photos, onSubmit, onBack }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Review Your Submission</Text>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.subHeading}>Banner Information</Text>
          {Object.entries(stepData).map(([key, value]) => (
            <View key={key} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{key}:</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeading}>Photos</Text>
          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo.uri }}
                style={styles.image}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#1a1a1a',
  },
  scrollContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subHeading: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    color: '#2c3e50',
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: '#34495e',
  },
  infoValue: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: {
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  submitButton: {
    backgroundColor: "#3498db",
  },
  backButtonText: {
    color: '#34495e',
    fontWeight: "bold",
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: "bold",
  },
});