import { useEffect, useRef, useState } from "react";
import {View,Text, StyleSheet, Animated,Pressable,ScrollView} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import Scrollable from "@/components/Scrollable";

export default function Index() {
  const { mostrarSplash, ocultarSplash } = useSplash();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (!mostrarSplash) return;

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [mostrarSplash]);

  const glowShadow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 30],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  // 👉 SPLASH
  if (mostrarSplash) {
    return (
          <View style={styles.splash}>
            <Animated.Text
              style={[styles.title, { opacity: fadeAnim, textShadowRadius: glowShadow }]}
            >
              WELCOME
            </Animated.Text>

            <Pressable onPress={ocultarSplash}>
              <Animated.Image
                source={require("../../assets/img/ClickRateSotipo.png")}
                style={[
                  styles.logo,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                    shadowRadius: glowShadow,
                    shadowOpacity: glowOpacity,
                  },
                ]}
                resizeMode="contain"
              />
            </Pressable>

            <Animated.Text
              style={[styles.title, { opacity: fadeAnim, textShadowRadius: glowShadow }]}
            >
              CLICKRATE
            </Animated.Text>
          </View> 
    );
  }
  // CONTENIDO NORMAL (header/footer ya visibles)
    return (
      <View style={styles.container}>
      {/* CONTENIDO */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View >
        <Main>
          <View style={styles.home}>
            <Text style={styles.homeText}>HOME / INDEX</Text>
          </View>
        </Main>
       
      </View> 
      </ScrollView>
    </View>
    );
  }

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#020617",
    justifyContent: "center",
    alignItems: "center",
  },  
  container: {
    padding: 16,
     alignItems: "center",
    
  },
  title: {
    color: "#e0f2fe",
    fontSize: 34,
    fontWeight: "bold",
    textShadowColor: "#38bdf8",
  },
  logo: {
    width: 160,
    height: 160,
    marginVertical: 24,
    shadowColor: "#38bdf8",
    elevation: 20,
  },
  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  homeText: {
    fontSize: 24,
  },
});