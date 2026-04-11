import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageBackground,
  StyleSheet,
} from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const ASSETS_URL = process.env.EXPO_PUBLIC_ASSETS_URL!;
console.log("API_URL:", API_URL);
interface Props {
  activar?: boolean;
}

export default function BackgroundRotator({ activar = true }: Props) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fetch(`${API_URL}/api/backgrounds`)
      .then(res => res.json())
      .then(json => setImages(json.data))
      .catch(err => console.error("Fondos:", err));
  }, []);

  useEffect(() => {
    if (!activar || images.length === 0) return;

    const interval = setInterval(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        setIndex(prev => (prev + 1) % images.length);
        Animated.timing(fade, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activar, images]);

  if (!images.length) return null;

  return (
    <Animated.View
      pointerEvents="none" // 🔒 no captura eventos
      style={[
        StyleSheet.absoluteFillObject,
        { opacity: fade },
      ]}
    >
      <ImageBackground
        source={{ uri: API_URL + images[index] }}
        style={styles.image}
        resizeMode="cover"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
  
    height: "100%",
  },
});

/*import React, { useEffect, useState, useRef} from "react";
import { View, StyleSheet, ImageBackground, Animated } from "react-native";

interface Props {
  children: React.ReactNode;
  activar?: boolean; // <- IMPORTANTE solo rota con TRUE
}

export default function BackgroundRotator({ children, activar=false }: Props) {

  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  //Carga imágenes desde la API
  //Carga imágenes desde la API
  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((json) => setImages(json.data))
      .catch((err) =>
        console.error("Error cargando fondos:", err)
      );
  }, []);

  useEffect(() => {
    if (!activar || images.length === 0) return;

    const interval = setInterval(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % images.length);

        Animated.timing(fade, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [activar, images]);

  if (images.length === 0) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ImageBackground
          source={{ uri: images[index] }}
          style={styles.background}
          resizeMode="cover"
        >
          {children}
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1},

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  bgImage: {
    opacity: 0.85, 
  },
});*/