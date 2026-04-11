import { useEffect, useState } from "react";
import {
  View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ScrollView,
} from "react-native";
import Main from "@/components/Main";
import { useWindowDimensions } from "react-native";

type Skin = {
  id: number;
  name: string;
  weapon: string;
  category: string;
  rarity: {
    name: string;
    color: string;
  };
};

export default function Skins() {
  const { width } = useWindowDimensions();
  const isMobile = width < 640;

  const [skins, setSkins] = useState<Skin[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.EXPO_PUBLIC_API_URL!;

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/api/skins?page=${page}&limit=${perPage}`)
      .then((res) => res.json())
      .then((json) => {
        setSkins(json.data);
        setTotalPages(json.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando skins:", err);
        setLoading(false);
      });
  }, [page]);

  const renderSkin = (item: Skin) => (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: item.rarity.color },
      ]}
    >
      <Image
        source={{ uri: `${API_URL}/api/skin-img/${item.id}` }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Arma: {item.weapon}</Text>
        <Text>Categoría: {item.category}</Text>
        <Text>Rareza: {item.rarity.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, height: "100%" }}>
    <View style={{ flexDirection: isMobile ? "column" : "column" }}>
     
      {/* CONTENIDO */} 
          <Main >
           
              {loading ? (
                <ActivityIndicator size="large" />
              ) : (

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    {skins.map((item) => (
                      <View
                        key={item.id}
                        style={{
                          width: isMobile ? "100%" : "23%",
                          marginBottom: 12,
                        }}
                      >
                        {renderSkin(item)}
                      </View>
                    ))}
                  </View>
              )}  

          </Main>
       
        {/* PAGINACIÓN */}
          <View
            style={[
              styles.pagination,
              isMobile ? styles.paginationMobile : styles.paginationDesktop,

            ]}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPage(p)}
                style={[
                  styles.pageButton,
                  p === page && styles.pageSelected,
                ]}
              >
                <Text style={styles.pageText}>{p}</Text>
              </Pressable>
            ))}
          </View>
      
    </View>
   </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },

  card: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  image: {
    width: 120,
    height: 120,
  },

  info: {
    alignItems: "center",
    marginTop: 8,
  },

  name: {
    fontWeight: "bold",
    marginBottom: 4,
  },

  pagination: {
    width: 80,
    alignItems: "center",
    paddingTop: 20,
  },

  pageButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#ccc",
    marginBottom: 6,
  },

  pageSelected: {
    backgroundColor: "#A38A5F",
  },

  pageText: {
    fontWeight: "bold",
  },

  paginationDesktop: {
   
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    gap: 10,
  },

  paginationMobile: {
    flexDirection: "row",
    
    flexWrap: "wrap",
    paddingVertical: 10,
    gap: 10,
  },
});