import { useEffect, useRef, useState } from "react";
import {View,Text,Image, StyleSheet, Animated,Pressable,ActivityIndicator} from "react-native";
import {useSplash} from "../context/SplashContext";
import BackgroundRotator from "@/components/BackgroundRotator";
import Main from "@/components/Main";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useWindowDimensions } from "react-native";
import { router } from "@/.expo/types/router";


const API_URL = process.env.EXPO_PUBLIC_API_URL!;
const ASSETS_URL = process.env.EXPO_PUBLIC_ASSETS_URL!;
const LIMIT = 20;

type Crate = {
  id: string;
  name: string;
};

type CratesResponse = {
  data: Crate[];
  page: number;
  totalPages: number;
};

export default function Crates() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  const page = Number(params.page) || 1;

  const [crates, setCrates] = useState<Crate[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/crates?page=${page}&limit=${LIMIT}`)
      .then(res => res.json())
      .then((response: CratesResponse) => {
        setCrates(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando cajas:", err);
        setLoading(false);
      });
  }, [page]);

  return (
    <View style={{ flexDirection: isMobile ? "column" : "column" }}>
      <Main>
          <View style={styles.container}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <View style={styles.grid}>
                {crates.map(caja => (
                  <Pressable
                    key={caja.id}
                    style={styles.card}
                    onPress={() =>
                    router.push({
                        pathname: "/case",
                        params: { id: caja.id },
                    })
                  }
                  >
                    <View style={styles.imageContainer}>
                        <Image
                        source={{ uri: `${API_URL}/crates-img/${caja.id}.png` }}
                        style={styles.image}
                        resizeMode="contain"
                        onError={(e) =>
                          console.log(" Error cargando imagen:", caja.id, e.nativeEvent)
                        }
                      />
                    </View>
                    <Text style={styles.title}>{caja.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}

            {/* PAGINACIÓN */}
            <View style={styles.pagination}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Pressable
                  key={p}

                  style={[
                    styles.pageButton,
                    p === page && styles.pageSelected,
                  ]}
                >
                  <Text>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>
      </Main>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
    maxWidth: 900,  //  evita que se estire demasiado
  },

  card: {
    width: 170,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#eee",
    alignItems: "center",
  },

  imageContainer: {
    width: "100%",
    height: 120,          //altura fija
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
    
  title: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
    color: "#333",
  },

  pagination: {
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
  },

  pageButton: {
    padding: 8,
    backgroundColor: "#ccc",
    borderRadius: 6,
  },

  pageSelected: {
    backgroundColor: "#A38A5F",
  },
});