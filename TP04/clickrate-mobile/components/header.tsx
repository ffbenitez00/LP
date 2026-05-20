import { useWindowDimensions, View, Text, Image, Pressable, StyleSheet } from "react-native";
import {useRouter} from "expo-router";
import { useState, useRef} from "react";
import { Animated } from "react-native";

export default function Header() {
  const router = useRouter();//
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    const toValue = menuOpen ? 0 : 1;

    Animated.timing(animation, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setMenuOpen(!menuOpen);
  };

  const rotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.navtop}>

        {/* BOTÓN ANIMADO */}
        {isMobile && (
          <Pressable onPress={toggleMenu}>
            <Animated.Text
              style={[
                styles.burger,
                { transform: [{ rotate }] },
              ]}
            >
              ≡
            </Animated.Text>
          </Pressable>
        )}

        {/* LOGO */}
        <Pressable
          style={[styles.logo, isMobile && styles.logoDerecha]}
          onPress={() => router.replace("/")}
        >
          <Image
            source={
              isMobile
                ? require("../assets/img/ClickRateSotipo.png")
                : require("../assets/img/ClickRateImagotipo.png")
            }
            style={isMobile ? styles.logoMobile : styles.logoImg}
            resizeMode="contain"
          />
        </Pressable>

        {/* LINKS (desktop) */}
        {!isMobile && (
          <View style={styles.navLinks}>
            <Pressable style={[styles.navButton]} onPress={() => router.replace("/(tabs)/skins")}>
              <Text style={styles.navText}>Skins</Text>
            </Pressable>

            <Pressable style={[styles.navButton]} onPress={() => router.replace("/(tabs)/tienda")}>
              <Text style={styles.navText}>Tienda</Text>
            </Pressable>

            <Pressable style={[styles.navButton]} onPress={() => router.replace("/(tabs)/inventario")}>
              <Text style={styles.navText}>Inventario</Text>
            </Pressable>
          </View>
        )}

        {/* USER */}
         {!isMobile && (
        <View style={styles.userMenu}>
          <Pressable onPress={() => setUserMenuOpen(!userMenuOpen)}>
            <Image
              source={require("../assets/img/usuarioLogo.png")}
              style={styles.userIcon}
            />
          </Pressable>
        
          {/* DROPDOWN SOLO SI CLICK */}
          {userMenuOpen && (
            <View style={styles.dropdown} >
                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserMenuOpen(false);
                      router.replace("/(tabs)/login");
                    }}
                  >
                    <Text>Ingresar</Text>
                  </Pressable>

                  <Pressable
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUserMenuOpen(false);
                      router.replace("/(tabs)/register");
                    }}
                  >
                    <Text>Registrarse</Text>
                  </Pressable>
            </View>
          )}
        </View>
       )}
      </View>

      {/* MENÚ MOBILE */}
      {isMobile && menuOpen && (
        <View style={styles.mobileMenu}>

          {/* USER dentro del menú */}
          <Pressable
            onPress={() => setUserMenuOpen(!userMenuOpen)}
          >
            <Text style={styles.mobileItem}>Usuario</Text>
          </Pressable>

          {userMenuOpen && (
            <>
              <Pressable onPress={() => {
                  setUserMenuOpen(false);
                  router.replace("/(tabs)/login");
                }}>
                <Text style={styles.mobileItem}>Ingresar</Text>
              </Pressable>
              <Pressable onPress={() => {
                  setUserMenuOpen(false);
                  router.replace("/(tabs)/register");
                }}>
                <Text style={styles.mobileItem}>Registrarse</Text>
              </Pressable>
            </>
          )}

          <Pressable
            onPress={() => {
              setMenuOpen(false);
              router.replace("/(tabs)/skins");
            }}
          >
            <Text style={styles.mobileItem}>Skins</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMenuOpen(false);
              router.replace("/(tabs)/tienda");
            }}
          >
            <Text style={styles.mobileItem}>Tienda</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMenuOpen(false);
              router.replace("/(tabs)/inventario");
            }}
          >
            <Text style={styles.mobileItem}>Inventario</Text>
          </Pressable>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    top:0,
    width: "100%",
    zIndex: 10,
    backgroundColor: "#A38A5F",
    padding: 8,
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
  
  navtop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    width: "100%"
  },

  logo: {
    flex: 1,
    padding: 5
  },
  burger: {
  fontSize: 26,
  },
  logoDerecha: {
    marginLeft: "auto",
  },
  logoImg: {
    height: 80,
    width: 80,
    resizeMode: "contain",
    borderRadius: 8,
  },
  logoMobile: {
      width: 120,
      height: 40,
      resizeMode: "contain",
  },  
  navLinks: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center"
  },

  navButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#A38A5F",
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: "#b4a695",
    borderLeftColor: "#b4a695",
    borderBottomColor: "#5C462F",
    borderRightColor: "#5C462F",
  },

  navText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#442e17",
  },

  userMenu: {
    flex:1,
    alignItems: "flex-end"
  },

  userIcon: {
    width: 65,
    height: 65,
    borderRadius: 32,
  },

  dropdown: {
    position: "absolute",
    top: 70,
    right: 0,
    backgroundColor: "#A38A5F",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 5,
  },

  dropdownItem: {
    padding: 8,
    color: "#442e17"

  },
  mobileMenu: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,

    backgroundColor: "#A38A5F", // mismo color que header
    padding: 16,

    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,

    borderTopColor: "#C0A17A",
    borderLeftColor: "#C0A17A",
    borderBottomColor: "#5C462F",
    borderRightColor: "#5C462F",

    borderRadius: 10,

    zIndex: 1000,
},

mobileItem: {
   fontSize: 16,
  fontWeight: "bold",
  color: "#442e17",

  padding: 12,
  marginBottom: 8,

  borderRadius: 8,
  backgroundColor: "#A38A5F",

  borderTopWidth: 2,
  borderLeftWidth: 2,
  borderBottomWidth: 2,
  borderRightWidth: 2,

  borderTopColor: "#b4a695",
  borderLeftColor: "#b4a695",
  borderBottomColor: "#5C462F",
  borderRightColor: "#5C462F",
}
});