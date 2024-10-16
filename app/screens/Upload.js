import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";

const { width, height } = Dimensions.get("window");

export default function Upload({ onPhotosSubmit, onBack, onLocationUpdate }) {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [rotationAngles, setRotationAngles] = useState([]);
  const [isReviewing, setIsReviewing] = useState(false);

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
    let loc = await Location.getCurrentPositionAsync({});
    onLocationUpdate(loc.coords.latitude, loc.coords.longitude);
    setLocation(loc);
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
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef && isCameraReady) {
      const photo = await cameraRef.takePictureAsync({ quality: 0.8, exif: true });
      const angle = Platform.OS === "ios" ? 270 : 180; // Rotate by 270 degrees on iOS and 180 degrees on Android
      let manipulatedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ rotate: angle }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setPhotos([...photos, manipulatedPhoto]);
      setRotationAngles([...rotationAngles, 270]); // Initialize rotation angle to 270
      if (photos.length + 1 >= 4) {
        setIsReviewing(true);
      }
    }
  };

  const retakePicture = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newRotationAngles = rotationAngles.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    setRotationAngles(newRotationAngles);
    if (newPhotos.length < 4) {
      setIsReviewing(false);
    }
  };

  const rotateImage = async (index) => {
    const photo = photos[index];
    const currentAngle = rotationAngles[index];
    const newAngle = (currentAngle + 90) % 360; // Rotate by 90 degrees each time

    const rotatedPhoto = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{ rotate: 90 }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    const newPhotos = [...photos];
    newPhotos[index] = rotatedPhoto;

    const newRotationAngles = [...rotationAngles];
    newRotationAngles[index] = newAngle;
    console.log(newRotationAngles);

    setPhotos(newPhotos);
    setRotationAngles(newRotationAngles);
  };

  const savePictures = () => {
    onPhotosSubmit(photos);
  };

  if (isReviewing) {
    return (
      <SafeAreaView style={styles.reviewContainer}>
        <ScrollView contentContainerStyle={styles.reviewScrollContent}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.reviewPhotoContainer}>
              <Image source={{ uri: photo.uri }} style={styles.reviewImage} />
              <View style={styles.reviewButtons}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => retakePicture(index)}
                >
                  <Ionicons name="refresh-outline" size={24} color="white" />
                  <Text style={styles.retakeText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rotateButton}
                  onPress={() => rotateImage(index)}
                >
                  <Ionicons name="sync-outline" size={24} color="white" />
                  <Text style={styles.rotateText}>Rotate</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.reviewButtonsContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={savePictures}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        style={styles.camera}
        type={"back"}
        ref={(ref) => setCameraRef(ref)}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <Animated.View
          style={[styles.frame, { transform: [{ scale: frameScale }] }]}
        >
          <Text style={styles.frameText}>Frame</Text>
        </Animated.View>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.cameraInfo}>
            <Ionicons name="location" size={18} color="white" />
            <Text style={styles.locationText}>
              {location
                ? `${location.coords.latitude.toFixed(2)}, ${location.coords.longitude.toFixed(2)}`
                : "Locating..."}
            </Text>
          </View>
        </View>
        <View style={styles.photoCountContainer}>
          <Text style={styles.photoCountText}>
            {photos.length} / 4 Photos
          </Text>
        </View>
        <ScrollView horizontal style={styles.thumbnailContainer}>
          {photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.uri }}
              style={styles.thumbnail}
            />
          ))}
        </ScrollView>
        <View style={styles.bottomBar}>
          <Animated.View
            style={[styles.buttonContainer, { transform: [{ scale: buttonScale }] }]}
          >
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </CameraView>
    </SafeAreaView>
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
    paddingTop: 10,
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
    top: height * 0.05,
    left: width * 0.05,
    right: width * 0.05,
    bottom: height * 0.17,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  frameText: {
    color: "white",
    fontSize: 20,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  bottomBar: {
    position: "absolute",
    bottom: 10,
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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  photoCountContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 15,
  },
  photoCountText: {
    color: "white",
    fontSize: 16,
  },
  thumbnailContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
    flexDirection: "row",
  },
  thumbnail: {
    width: 50,
    height: 50,
    marginLeft: 5,
    borderRadius: 5,
  },
  reviewContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  reviewScrollContent: {
    padding: 20,
  },
  reviewPhotoContainer: {
    marginBottom: 20,
  },
  reviewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  reviewButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  retakeText: {
    color: "white",
    marginLeft: 5,
  },
  rotateButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  rotateText: {
    color: "white",
    marginLeft: 5,
  },
  reviewButtonsContainer: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  submitText: {
    color: "white",
    fontSize: 18,
  },
  backButton: {
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 18,
  },
  permissionButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 20,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  message: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});