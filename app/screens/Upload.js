import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
  Modal,
  StatusBar,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function Upload({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const frameAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkLocationPermission();
    animateFrame();
    animateButton();
  }, []);

  const checkLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const animateFrame = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(frameAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(frameAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const animateButton = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnimation, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnimation, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const frameScale = frameAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.98, 1.02],
  });

  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef && isCameraReady) {
      const photo = await cameraRef.takePictureAsync({ quality: 0.8 });
      setPhotos([...photos, photo]);
      if (photos.length + 1 >= 4) {
        setIsModalVisible(true);
      }
    }
  };

  const retakePicture = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setIsModalVisible(false);
  };

  const savePictures = () => {
    console.log("Photos saved:", photos);
    // Handle the photos (e.g., upload them)
    setIsModalVisible(false);
    // Navigate to the next screen or show a success message
    navigation.navigate("UploadSuccess", { photos });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={styles.camera}
        type={"back"}
        ref={(ref) => setCameraRef(ref)}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <Animated.View style={[styles.frame, { transform: [{ scale: frameScale }] }]}>
          <Text style={styles.frameText}>Frame</Text>
        </Animated.View>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.cameraInfo}>
            <Ionicons name="location" size={18} color="white" />
            <Text style={styles.locationText}>
              {location ? `${location.coords.latitude.toFixed(2)}, ${location.coords.longitude.toFixed(2)}` : "Locating..."}
            </Text>
          </View>
        </View>
        <View style={styles.bottomBar}>
          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo.uri }} style={styles.previewImage} />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={[styles.modalButton, styles.retakeButton]} onPress={() => retakePicture(index)}>
                    <Ionicons name="refresh-outline" size={24} color="white" />
                    <Text style={styles.modalButtonText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={savePictures}>
              <Ionicons name="checkmark-outline" size={24} color="white" />
              <Text style={styles.modalButtonText}>Save All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    padding: 10,
  },
  cameraInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  locationText: {
    color: "white",
    marginLeft: 5,
    fontSize: 12,
  },
  frame: {
    position: "absolute",
    top: height * 0.1,
    left: width * 0.05,
    right: width * 0.05,
    bottom: height * 0.1,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  frameText: {
    color: "white",
    opacity: 0.7,
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    transform: [{ rotate: "90deg" }],
  },
  bottomBar: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  message: {
    textAlign: "center",
    color: "white",
    fontSize: 18,
    marginBottom: 20,
    marginTop: 50,
  },
  permissionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: "center",
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    alignItems: "center",
    width: width * 0.9,
  },
  photoContainer: {
    marginBottom: 20,
  },
  previewImage: {
    width: width * 0.8,
    height: height * 0.5,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  retakeButton: {
    backgroundColor: "#FF4136",
  },
  saveButton: {
    backgroundColor: "#2ECC40",
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});