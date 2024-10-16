import React, { useState,useEffect } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import axios from "axios";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { pinValidator } from "../helpers/pinValidator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [pin, setPin] = useState({ value: "", error: "" });

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('userinfo', jsonValue);
    } catch (e) {
      // saving error
    }
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
        navigation.reset({
          index: 0,
          routes: [{ name: "Main" }],
        });
      }
    }
    ).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }, []);

  const onLoginPressed = () => {
    const phoneError = phoneValidator(phone.value);
    const pinError = pinValidator(pin.value);
    if (phoneError || pinError) {
      setPhone({ ...phone, error: phoneError });
      setPin({ ...pin, error: pinError });
      return;
    }
    const obj = {
      phone: phone.value,
      pin: parseInt(pin.value),
    };
    axios
      .post("https://svradvertising.co.in/api/users/login", obj)
      .then((response) => {
        try {
          storeData(JSON.stringify(response.data.user));
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        } catch (error) {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error("API call error:", error.response.data);
        alert(error.response.data.message);
      });
  };

  // navigation.reset({
  //   index: 0,
  //   routes: [{ name: "Main" }],
  // });

  return (
    <Background>
      <Logo />
      <Header>Welcome Back</Header>
      <TextInput
        label="Phone Number"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text, error: "" })}
        error={!!phone.error}
        errorText={phone.error}
        autoCapitalize="none"
        keyboardType="phone-pad"
        maxLength={10}
      />
      <TextInput
        label="PIN"
        returnKeyType="done"
        value={pin.value}
        onChangeText={(text) => setPin({ value: text, error: "" })}
        error={!!pin.error}
        errorText={pin.error}
        secureTextEntry
        keyboardType="numeric"
        maxLength={4}
      />
      <Button mode="contained" onPress={onLoginPressed}>
        Log in
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "center",
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
    marginLeft: 4,
  },
});
