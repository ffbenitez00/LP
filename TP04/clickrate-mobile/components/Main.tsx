import React from "react";
import { View, StyleSheet } from "react-native";

interface MainProps {
  children: React.ReactNode;
}

export default function Main({ children }: MainProps) {
  return <View style={styles.main}>{children}</View>;
}

const styles = StyleSheet.create({
  main: {
  flex: 1,
  minHeight: "70%",
  maxWidth: "80%", //  para desktop
  alignSelf: "center",
  padding: 20,
  backgroundColor: "#A38A5F",
  borderWidth: 2,
  borderTopColor: "#b4a695",
  borderLeftColor: "#b4a695",
  borderBottomColor: "#5C462F",
  borderRightColor: "#5C462F",
  borderRadius: 8,
  },
});
