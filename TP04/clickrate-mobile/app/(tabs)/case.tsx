import { useLocalSearchParams ,useRouter} from "expo-router";
import { useEffect, useRef, useState } from "react";
import {View,Text,Image, StyleSheet, Animated,Pressable,ActivityIndicator, ScrollView,Alert, useWindowDimensions } from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import PageScroll from "@/components/PageScroll";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Skin = {
  id: string;
  name: string;
  weapon: string;
  category: string;
  rarity: {
    name: string;
    color: string;
  };
};

type Crate = {
  id: string;
  name: string;
  contains: { id: string }[];
  contains_rare?: { id: string }[];
};

export default function CaseScreen() {
  const { id } = useLocalSearchParams();
  const crateId = Array.isArray(id) ? id[0] : id;

  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL!;
  
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [crate, setCrate] = useState<Crate | null>(null);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [rareSkins, setRareSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!crateId) return;

  const fetchData = async () => {
    try {
      setLoading(true);

      const crateRes = await fetch(
        `${API_URL}/api/crates/${crateId}`
      );

      const crateData = await crateRes.json();

      const skinsRes = await fetch(
        `${API_URL}/api/crates/${crateId}/skins`
      );

      const skinsData = await skinsRes.json();

      setCrate(crateData);
      setSkins(skinsData.normal);
      setRareSkins(skinsData.rare);

    } catch (err) {
      console.error("Error cargando crate:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [crateId]);

  // COMPRAR CAJA
  const comprarCaja = async () => {
    if (!crate) return;

    try {
      const key = "inventarioCajas";

      const data = await AsyncStorage.getItem(key);

      const inventario = data ? JSON.parse(data) : [];

      const existente = inventario.find(
        (c: any) => c.id === crate.id
      );

      if (existente) {
        existente.cantidad =
          (existente.cantidad || 1) + 1;
      } else {
        inventario.push({
          id: crate.id,
          name: crate.name,
          image: `${API_URL}/api/crate-img/${crate.id}.png`,
          cantidad: 1,
        });
      }

      await AsyncStorage.setItem(
        key,
        JSON.stringify(inventario)
      );

      Alert.alert(
        "Compra realizada",
        `Has comprado la caja "${crate.name}"`
      );

    } catch (err) {
      console.error("Error guardando inventario:", err);
    }
  };

  // RENDER SKIN
  const renderSkin = (skin: Skin) => (
    <Pressable
      key={skin.id}
      style={[
        styles.skinCard,
        {
          backgroundColor: skin.rarity.color,
        },
      ]}
      onPress={() =>
        router.push({
          pathname: "/skin",
          params: { id: skin.id },
        })
      }
    >
      <View style={styles.skinInner}>
        <Image
          source={{
            uri: `${API_URL}/api/skin-img/${skin.id}`,
          }}
          style={styles.skinImage}
          resizeMode="contain"
        />

        <Text style={styles.skinText}>
          {skin.name}
        </Text>
      </View>
    </Pressable>
  );

  // LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // NO ENCONTRADA
  if (!crate) {
    return (
      <View style={styles.center}>
        <Text>Caja no encontrada</Text>
      </View>
    );
  }

  return (
     <PageScroll>
            <View style={{ flexDirection: isMobile ? "column" : "column" }}>
                <Main>     
                      <Text style={styles.title}> {crate.name} </Text>

                      {/* HEADER */}
                      <View style={styles.header}>
                        <View style={styles.crateContainer}>
                          <View style={styles.imageWrapper}>
                            <Image
                              source={{ uri: `${API_URL}/api/crates-img/${crate.id}` }}
                              style={styles.image}
                              resizeMode="contain"
                            />
                          </View>
                        </View>

                        <Pressable
                          style={styles.buyButton}
                          onPress={comprarCaja}
                        >
                          <Text style={styles.buyButtonText}>
                            Comprar Caja
                          </Text>
                        </Pressable>
                      </View>

                      {/* SKINS */}
                      <Text style={styles.sectionTitle}>
                        Contiene:
                      </Text>

                      <View style={styles.grid}>
                        {skins.map(renderSkin)}
                      </View>

                      {/* SKINS RARAS */}
                      {rareSkins.length > 0 && (
                        <>
                          <Text style={styles.sectionTitle}>
                            Skins raras:
                          </Text>

                          <View style={styles.grid}>
                            {rareSkins.map(renderSkin)}
                          </View>
                        </>
                      )}
                    
                </Main>
        </View>
    </PageScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  header: {
    alignItems: "center",
    gap: 16,
  },

  crateContainer: {
    width: 300,
    height: 200,
    borderRadius: 16,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#A38A5F",

    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  imageWrapper: {
    width: "100%",
    height: 260,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,

    backgroundColor: "#8B6B47",

    borderRadius: 14,

    borderWidth: 3,
    borderTopColor: "#d6c2a5",
    borderLeftColor: "#d6c2a5",
    borderBottomColor: "#4e3825",
    borderRightColor: "#4e3825",
  },

  image: {
    width: "85%",
    height: "85%",
  },
  crateImage: {
    width: "90%",
    height: "90%",
  },

  buyButton: {
    marginTop: 10,
    backgroundColor: "#A38A5F",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 3,
    alignItems: "center",
    borderTopColor: "#d6c2a5",
    borderLeftColor: "#d6c2a5",
    borderBottomColor: "#4e3825",
    borderRightColor: "#4e3825",
  },

  buyButtonText: {
    color: "#4e3825",
    fontWeight: "bold",
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    width: "100%",
  },

  skinCard: {
    width: 160,
    borderRadius: 12,
    padding: 2,

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },

  skinInner: {
    backgroundColor: "#0f172a",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },

  skinImage: {
    width: 120,
    height: 80,
  },

  skinText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
    color: "white",
  },
});