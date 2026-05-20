import { useEffect, useRef, useState } from "react";
import {View,Text,Image, TextInput, Button, StyleSheet, Animated,Pressable,ActivityIndicator} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import { api } from "../../services/api";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function LoginScreen() {

  // STATES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ROUTER
  const router = useRouter();

  // API URL
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  // LOGIN
  const handleLogin = async () => {

    try {
      setLoading(true);
      console.log("API:", API_URL);
      const res = await api.post("/login", {
        email,
        password,
      });

      const token = res.data.token;
      // guardamos el token
      await AsyncStorage.setItem("token",token);

      // guardar el usuario
      await AsyncStorage.setItem("user",JSON.stringify(res.data.user));

      setMsg(" Login correcto");

      
      router.replace("/");// redireccionar

    } catch (err: any) {

      console.log(err);

      setMsg(
        (
          err.response?.data?.error ||
          "Error al iniciar sesión"
        )
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <Main>
      <View style={styles.container}>

        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* EMAIL */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor="#666"
          />
        </View>

        {/* PASSWORD */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholderTextColor="#666"
          />
        </View>

        {/* BUTTON */}
        <Pressable
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>
            {
              loading
                ? "Ingresando..."
                : "Ingresar"
            }
          </Text>
        </Pressable>

        {/* MENSAJE */}
        {
          msg.length > 0 && (
            <Text style={styles.msg}>
              {msg}
            </Text>
          )
        }

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

  button: {

    backgroundColor: "#A38A5F",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderTopColor: "#d6c2a5",
    borderLeftColor: "#d6c2a5",
    borderBottomColor: "#5C462F",
    borderRightColor: "#5C462F",
  },

  buttonText: {

    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  msg: {
    marginTop: 20,
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});