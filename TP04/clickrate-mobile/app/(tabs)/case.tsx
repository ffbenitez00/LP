import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {View,Text,Image, StyleSheet, Animated,Pressable,ActivityIndicator} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Skin = {
  id: string;
  name: string;
  weapon: string;
  category: string;
  description: string;
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

  const API_URL = process.env.EXPO_PUBLIC_API_URL!;

  const [crate, setCrate] = useState<Crate | null>(null);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!crateId) return;

    const fetchData = async () => {
      try {
        const crateData = await fetch(`${API_URL}/api/crates/${crateId}`).then(r => r.json());
        const skinsData = await fetch(`${API_URL}/api/crates/${crateId}/skins`).then(r => r.json());

        setCrate(crateData);
        setSkins(skinsData);
      } catch (err) {
        console.error("Error cargando crate:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [crateId]);

  //Comprar caja
  const comprarCaja = async () => {
    if (!crate) return;

    const key = "inventarioCajas";
    const data = await AsyncStorage.getItem(key);
    const inventario = data ? JSON.parse(data) : [];

    const existente = inventario.find((c: any) => c.id === crate.id);

    if (existente) {
      existente.cantidad = (existente.cantidad || 1) + 1;
    } else {
      inventario.push({
        id: crate.id,
        name: crate.name,
        image: `${API_URL}/api/crate-img/${crate.id}`,
        cantidad: 1,
      });
    }

    await AsyncStorage.setItem(key, JSON.stringify(inventario));

    Alert.alert("Compra realizada", `Has comprado la caja "${crate.name}"`);
  };

  if (loading) return <ActivityIndicator size="large" />;
  if (!crate) return <Text>Crate no encontrada</Text>;

  const renderSkin = (skin: Skin) => (
    <Pressable
      key={skin.id}
      style={[
        styles.skinCard,
        { backgroundColor: skin.rarity.color },
      ]}
      onPress={() =>
        router.push({
          pathname: "/skin",
          params: { id: skin.id },
        })
      }
    >
      <Image
        source={{ uri: `${API_URL}/api/skin-img/${skin.id}` }}
        style={styles.skinImage}
        resizeMode="contain"
      />
      <Text style={styles.skinText}>{skin.name}</Text>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{crate.name}</Text>

      {/* Imagen + botón */}
      <View style={styles.header}>
        <Image
          source={{ uri: `${API_URL}/api/crate-img/${crate.id}` }}
          style={styles.crateImage}
          resizeMode="contain"
        />

        <Pressable style={styles.button} onPress={comprarCaja}>
          <Text style={styles.buttonText}>Comprar</Text>
        </Pressable>
      </View>

      {/* Skins normales */}
      <Text style={styles.sectionTitle}>Contiene:</Text>
      <View style={styles.grid}>
        {crate.contains.map(item => {
          const skinData = skins.find(s => s.id === item.id);
          return skinData ? renderSkin(skinData) : null;
        })}
      </View>

      {/* Skins raras */}
      {crate.contains_rare && crate.contains_rare.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Skins raras:</Text>
          <View style={styles.grid}>
            {crate.contains_rare.map(item => {
              const skinData = skins.find(s => s.id === item.id);
              return skinData ? renderSkin(skinData) : null;
            })}
          </View>
        </>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  header: {
    alignItems: "center",
    marginBottom: 20,
  },

  crateImage: {
    width: 200,
    height: 150,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#A38A5F",
    padding: 10,
    borderRadius: 6,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },

  skinCard: {
    width: 140,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  skinImage: {
    width: "100%",
    height: 80,
  },

  skinText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});