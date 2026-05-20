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
    width: "100%",
    maxWidth: 1100,

    alignSelf: "center",

    marginTop: 20,
    marginBottom: 20,

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
