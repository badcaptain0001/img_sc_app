import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../HomeScreen";
import RegisterScreen from "../RegisterScreen";
import StartScreen from "../StartScreen";
import Upload from "../Upload";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Upload":
              iconName = "cloud-upload-outline";
              break;
            case "ResetPassword":
              iconName = "key-outline";
              break;
            case "Start":
              iconName = "rocket-outline";
              break;
            default:
              iconName = "ellipse-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#8046fd",
        tabBarInactiveTintColor: "#2F2F2F",
        tabBarStyle: [
          {
            display: "flex"
          },
          null
        ],
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Start" component={StartScreen} />
    </Tab.Navigator>
  );
}