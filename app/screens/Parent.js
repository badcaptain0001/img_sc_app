import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BannerInfoStep from "./BannerInfoStep"; // Your first step
import Upload from "./Upload"; // Your second step
import Review from "./Review"; // The review step
import axios from "axios";

export default function Parent({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNext = (formData) => {
    // Save banner info and move to the next step
    setStepData({ ...formData });

    setCurrentStep(1);
  };

  const handlePhotosSubmit = (newPhotos) => {
    // Save photos and move to the review step
    setPhotos(newPhotos);
    setCurrentStep(2);
  };

  const handleBack = () => {
    // Navigate back to the previous step
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    const finalData = {
      ...stepData,
      bannerUrls: photos,
      lat: latitude,
      lng: longitude,
    };
    const formData = new FormData();
    
    // Append all other fields as before
    formData.append("bannerHeight", finalData.bannerHeight);
    formData.append("bannerWidth", finalData.bannerWidth);
    formData.append("bannerType", finalData.bannerType);
    formData.append("bannerStatus", finalData.bannerStatus);
    formData.append("nameOfSite", finalData.nameOfSite);
    formData.append("lat", finalData.lat);
    formData.append("lng", finalData.lng);
    formData.append("workerPhone", finalData.workerPhone);
    finalData.bannerUrls.forEach((photo, index) => {
      formData.append(`bannerUrls`, {
        uri: photo.uri,
        type: 'image/jpeg', // or the appropriate MIME type
        name: `image${index}.jpg`
      });
    });
  
    
    setLoading(true); // Set loading to true before making the API call

    axios
      .post("https://svradvertising.co.in/api/banner/uploadbanner", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        // Navigate to a success screen or perform other actions here
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      })
      .catch((error) => {
        console.error("Upload failed:", error.response ? error.response.data : error.message);
      })
      .finally(() => {
        setLoading(false); // Set loading to false after the API call completes
      });
  };

  const handleLocationUpdate = (lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BannerInfoStep onNext={handleNext} />;
      case 1:
        return (
          <Upload
            onPhotosSubmit={handlePhotosSubmit}
            onBack={handleBack}
            onLocationUpdate={handleLocationUpdate}
          />
        );
      case 2:
        return (
          <Review
            stepData={stepData}
            photos={photos}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderStep()}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the loader overlay is above other components
  },
});