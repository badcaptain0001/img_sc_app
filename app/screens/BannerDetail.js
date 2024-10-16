import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Ensure you have @expo/vector-icons installed
import MapView, { Marker } from "react-native-maps";
import { theme } from "../core/theme";
const { width } = Dimensions.get("window");

const BannerDetail = ({ route }) => {
  const navigation = useNavigation();
  const { banner } = route.params;
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
       <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Banner Details</Text>
      </View>
      <View style={styles.imageContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          {banner.bannerUrls.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.title}>{banner.nameOfSite}</Text>
        <View style={styles.infoContainer}>
          <InfoItem
            label="Date"
            value={new Date(banner.date).toLocaleDateString()}
          />
          <InfoItem label="Dimensions" value={banner.dimensions} />
          <InfoItem label="Banner Type" value={banner.bannerType} />
          <InfoItem label="Banner Status" value={banner.bannerStatus} />
          <InfoItem label="Worker Name" value={banner.workerName} />
          <InfoItem label="Worker Phone" value={banner.workerPhone} />
        </View>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.title}>Map Location</Text>
        {banner.bannerLocation && banner.bannerLocation.coordinates[1] && (
          <View style={styles.mapContainer}>
            <Text style={styles.mapTitle}>Banner Location</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: banner.bannerLocation.coordinates[1],
                longitude: banner.bannerLocation.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
                zoomEnabled: true,
              }}
            >
              <Marker
                coordinate={{
                  latitude: banner.bannerLocation.coordinates[1],
                  longitude: banner.bannerLocation.coordinates[0],
                }}
                title={banner.nameOfSite}
              />
            </MapView>
          </View>
        )}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "semibold",
    color: "#fff",
  },
  imageContainer: {
    height: 300,
    backgroundColor: "#000",
  },
  imageScroll: {
    height: 300,
  },
  image: {
    width,
    height: 300,
    resizeMode: "cover",
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  mapContainer: {
    marginTop: 20,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  map: {
    height: 200,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default BannerDetail;
