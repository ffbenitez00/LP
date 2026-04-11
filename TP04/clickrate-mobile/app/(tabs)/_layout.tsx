import React from 'react';
import { View, StyleSheet } from "react-native";
import { Slot } from "expo-router";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useSplash } from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";

export default function TabsLayout() {
  const { mostrarSplash } = useSplash();

  return (
    <View style={styles.container}>

      {/* FONDO ( DETRÁS DE TODO) */}
      {!mostrarSplash && <BackgroundRotator activar />}

      {/* HEADER */}
      {!mostrarSplash && <Header/>}

      {/*CONTENIDO */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* FOOTER */}
      {!mostrarSplash && <Footer />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    position:"relative"
  },
  content: {
      flex: 1,
      width: "100%", // 
      paddingTop: 80,    //altura del Header
    paddingBottom: 80, // altura del Footer
  },
});