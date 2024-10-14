import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import { phoneValidator } from "../helpers/phoneValidator";
import { pinValidator } from "../helpers/pinValidator";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [pin, setPin] = useState({ value: "", error: "" });

  const onLoginPressed = () => {
    // const phoneError = phoneValidator(phone.value);
    // const pinError = pinValidator(pin.value);
    // if (phoneError || pinError) {
    //   setPhone({ ...phone, error: phoneError });
    //   setPin({ ...pin, error: pinError });
    //   return;
    // }
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

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