import React from "react";
import { Provider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { theme } from "./app/core/theme";
import {
  LoginScreen,
  BottomTabs,
} from "./app/screens";
import BannerDetail from "./app/screens/BannerDetail";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="LoginScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="BannerDetail" component={BannerDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
