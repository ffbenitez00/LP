import { useEffect, useState } from "react";
import {
  View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ScrollView, useWindowDimensions 
} from "react-native";
import Main from "@/components/Main";
import BackgroundRotator from "@/components/BackgroundRotator";
import { useLocalSearchParams } from 'expo-router';
import { api } from "../../services/api";

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

export default function SkinScreen() {
  const { id } = useLocalSearchParams();
  const skinId = Array.isArray(id) ? id[0] : id;

  const [skin, setSkin] = useState<Skin | null>(null);
  const [loading, setLoading] = useState(true);
   
  const { width } = useWindowDimensions();
  const isMobile = width < 640;
  
  const API_URL = process.env.EXPO_PUBLIC_API_URL!;

  useEffect(() => {
    fetch(`${API_URL}/api/skins`)
      .then(res => res.json())
      .then(json => {
        const encontrada = json.data.find(
          (s: Skin) => s.id === skinId
        );

        setSkin(encontrada || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [skinId]);

  if (loading) return <ActivityIndicator />;

  if (!skin) return <Text>Skin no encontrada</Text>;

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: isMobile ? "column" : "column" }}>
            <Main>
                  <View style={styles.content}>
                    <Text style={styles.title}>{skin.name}</Text>

                    <View style={[styles.imageContainer, { backgroundColor: skin.rarity.color }]}>
                      <Image
                        source={{ uri: `${API_URL}/api/skin-img/${skin.id}` }}
                        style={styles.image}
                        resizeMode="contain"
                      />
                    </View>

                    <View style={styles.infoBlock}>
                    <Text style={styles.label}>Arma</Text>
                    <Text style={styles.value}>{skin.weapon}</Text>
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.label}>Categoría</Text>
                    <Text style={styles.value}>{skin.category}</Text>
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.label}>Rareza</Text>
                    <Text style={[styles.value, { color: skin.rarity.color }]}>
                      {skin.rarity.name}
                    </Text>
                  </View>

                  <Text style={styles.description}>{skin.description}</Text>
                  </View>
            </Main>
         </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 20,
    width: '100%',
    maxWidth: 900, // limita ancho tipo web
  },
  
  head: {
    flexDirection: 'column',
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
    maxWidth: 900,     // 🔥 limita tamaño
    alignSelf: 'center'
  },
  imageContainer: {
      marginTop: 10,
      borderRadius: 12,
      padding: 15,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden', 
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.2)', // 🔥 contraste suave

      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,

      elevation: 6,
  },

  image: {
    width: '100%',
    height: 200,
  },

  body: {
    gap: 10,
  },

  bold: {
    fontWeight: 'bold',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoBlock: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: '#94a3b8', // gris suave
    textTransform: 'uppercase',
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    marginTop: 15,
    fontSize: 14,
    lineHeight: 20,
    color: '#cbd5f5',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});