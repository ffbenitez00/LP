import { ReactNode } from "react";
import { ScrollView, StyleSheet,View, } from "react-native";

type Props = {
  children: ReactNode;
};

export default function PageScroll({
  children,
}: Props) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.inner}>
        {children}
      </View>
    </ScrollView>
  );
}
const HEADER_HEIGHT = 90;
const FOOTER_HEIGHT = 90;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: "100%",
  },

  content: {
    flexGrow: 1,

    paddingTop: HEADER_HEIGHT + 20,
    paddingBottom: FOOTER_HEIGHT + 30,
    alignItems: "center",
  },

  inner: {
    width: "100%",
    maxWidth: 1300,

    paddingHorizontal: 16,
    
  },
});