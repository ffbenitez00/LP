import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SplashProvider } from "./context/SplashContext";
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ScrollView,
} from "react-native";
export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SplashProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
       
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        
        <StatusBar style="auto" />
      </ThemeProvider>
    </SplashProvider>

  );
}