import { useEffect, useRef, useState } from "react";
import {View,Text,Image, TextInput, Button, StyleSheet, Animated,Pressable,ActivityIndicator} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import { api } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.token;

      // 🔑 guardar token
      await AsyncStorage.setItem("token", token);

      setMsg(" Login correcto");

    } catch (err: any) {
      setMsg("ERROR NO ES LA CLAVE " + (err.response?.data?.error || "Error"));
    }
  };

  return (
    <Main>
      <View style={styles.container}>
        <Text>Login</Text>

        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />

        <Button title="Ingresar" onPress={handleLogin} />

        <Text>{msg}</Text>
      </View>
    </Main>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
  },
});