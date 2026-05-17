import { useEffect, useRef, useState } from "react";
import {View,Text,Image, TextInput, Button, StyleSheet, Animated,Pressable,ActivityIndicator} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import { api } from "../../services/api";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      const res = await api.post("/register", {
        email,
        password,
        confirmPassword,
        nickname,
      });

      setMsg("✅ " + res.data.message);
    } catch (err: any) {
      setMsg("❌ " + (err.response?.data?.error || "Error"));
    }
  };

  return (
     <Main>
        <View style={styles.container}>
          <Text>Registro</Text>

          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Nickname" value={nickname} onChangeText={setNickname} style={styles.input} />

          <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
          <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />

          <Button title="Registrarse" onPress={handleRegister} />

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