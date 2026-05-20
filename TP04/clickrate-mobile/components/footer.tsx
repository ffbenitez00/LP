import { View, Text, Image, Linking, Pressable, StyleSheet } from "react-native";

export default function Footer() {
  return (
    <View style={styles.footer}>
      
      <Pressable 
        style={styles.item}
        onPress={() => Linking.openURL("https://github.com/Franku88")}
      >
        <Image source={require("../assets/img/gitLogo.png")} style={styles.logo} />
        <Text style={styles.name}>Benitez, Franco Fabian</Text>
      </Pressable>

      <Pressable 
        style={styles.item}
        onPress={() => Linking.openURL("https://github.com/jamiroZ")}
      >
        <Image source={require("../assets/img/gitLogo.png")} style={styles.logo} />
        <Text style={styles.name}>Zuñiga, Jamiro</Text>
      </Pressable>
    
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    
    backgroundColor: "#A38A5F",
    width: "100%",
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: "#C0A17A",
    borderLeftColor: "#C0A17A",
    borderBottomColor: "#5C462F",
    borderRightColor: "#5C462F",
  },

  item: {
    alignItems: "center",
    gap: 6,
  },

  logo: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },

  name: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});