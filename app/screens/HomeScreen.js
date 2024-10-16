import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { View, FlatList, StyleSheet, Text, SafeAreaView, StatusBar, ActivityIndicator } from "react-native";
import BannerCard from "./BannerCard"; // Import the BannerCard component
import { theme } from "../core/theme";

export default function HomeScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState(null);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userinfo");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.error("Error reading value:", e);
    }
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

  useEffect(() => {
    if (userDetails) {
      axios
        .get(`https://svradvertising.co.in/api/banner/getbanners/${userDetails.uid}`)
        .then((response) => {
          setBanners(response.data.data.reverse() || []); // Ensure data is valid
        })
        .catch((error) => {
          console.error("Error fetching banners:", error.response ? error.response.data : error.message);
        })
        .finally(() => {
          setLoading(false); // Set loading to false after fetching data
        });
    }
  }, [userDetails]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading banners...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>My Banners</Text>
      </View>
      <View style={styles.container}>
        <FlatList
          data={banners}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <BannerCard
              banner={item}
              onPress={() => navigation.navigate('BannerDetail', { banner: item })}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No banners available</Text>} // Handle empty list
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'semibold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});
