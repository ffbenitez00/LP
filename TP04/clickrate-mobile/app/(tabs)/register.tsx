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
  console.log("API:", process.env.EXPO_PUBLIC_API_URL);
  const handleRegister = async () => {
    try {
      const res = await api.post("/register", {
        email,
        password,
        confirmPassword,
        nickname,
      });

      setMsg("error " + res.data.message);
    } catch (err: any) {
      setMsg((err.response?.data?.error || "Error"));
    }
  };

  return (
     <Main>
        <View style={styles.container}>
          <Text style={styles.title}>Registro</Text>
          
          <View style={styles.inputContainer}>
             <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
          </View>
          <View style={styles.inputContainer}>
             <TextInput placeholder="Nickname" value={nickname} onChangeText={setNickname} style={styles.input} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} />
          </View>
          <View style={styles.inputContainer}>
            <TextInput placeholder="Confirm Password" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} />
          </View>
          <Button title="Registrarse" onPress={handleRegister} />

          <Text>{msg}</Text>
        </View>
    </Main>
  );
}

const styles = StyleSheet.create({
  container: { 
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 16,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    overflow: "hidden",
  },

  input: {
    padding: 14,
    fontSize: 16,
    color: "#000",
  },
});