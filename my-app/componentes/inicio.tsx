import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Animated 
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const soundFile = require('../assets/sounds/ding.mp3');

export default function InicioScreen() {
  const [ecopuntos, setEcopuntos] = useState(1500);
  const [notification, setNotification] = useState<{ amount: number } | null>(null);
  const soundObject = useRef<Audio.Sound | null>(null);

  const animatedValue = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: false });
      soundObject.current = sound;
    } catch (error) {
      console.error('Error al cargar el sonido:', error);
    }
  };

  const playSound = async () => {
    if (soundObject.current) {
      try {
        await soundObject.current.stopAsync();
        await soundObject.current.replayAsync();
      } catch (error) {
        console.error('Error al reproducir el sonido:', error);
      }
    }
  };

  useEffect(() => {
    loadSound();
    return () => {
      soundObject.current?.unloadAsync();
    };
  }, []);

  const handleAddEcopuntos = (amount: number) => {
    setEcopuntos(ecopuntos + amount);
    playSound();
    setNotification({ amount });

    animatedValue.setValue(0);
    opacity.setValue(1);

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start(() => setNotification(null));
  };

  const FloatingNotification = () => {
    if (!notification) return null;

    const translateY = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -40],
    });

    return (
      <Animated.View style={[
        styles.floatingNotification,
        { transform: [{ translateY }], opacity }
      ]}>
        <Text style={styles.notificationText}>
          +{notification.amount} Ecopuntos 🌱
        </Text>
      </Animated.View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FloatingNotification />
        <View style={styles.ecopuntosBox}>
          <FontAwesome5 name="leaf" size={18} color="#388E3C" />
          <Text style={styles.ecopuntosText}>{ecopuntos} Ecopuntos</Text>
        </View>

        <View style={styles.inspirationCard}>
          <Text style={styles.inspirationTitle}>¿Querés descubrir qué nos inspira?</Text>
          <Text style={styles.inspirationSubtitle}>
            Conocé quiénes somos y por qué hacemos lo que hacemos 🌍
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Saber Más</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.simulateButton}
        onPress={() => handleAddEcopuntos(50)}
      >
        <Text style={styles.simulateButtonText}>🎁 Recibir 50 Ecopuntos</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Secciones</Text>
      <View style={styles.sectionsGrid}>
        <View style={[styles.sectionItem, { backgroundColor: '#E8F5E9' }]}>
          <MaterialCommunityIcons name="recycle" size={26} color="#2E7D32" />
          <Text style={styles.sectionText}>Retiro</Text>
        </View>
        <View style={[styles.sectionItem, { backgroundColor: '#E3F2FD' }]}>
          <MaterialCommunityIcons name="map-marker" size={26} color="#1565C0" />
          <Text style={styles.sectionText}>Mapa</Text>
        </View>
        <View style={[styles.sectionItem, { backgroundColor: '#FFF3E0' }]}>
          <FontAwesome5 name="gift" size={24} color="#EF6C00" />
          <Text style={styles.sectionText}>Canjes</Text>
        </View>
        <View style={[styles.sectionItem, { backgroundColor: '#FCE4EC' }]}>
          <MaterialCommunityIcons name="calendar-star" size={26} color="#AD1457" />
          <Text style={styles.sectionText}>Eventos</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Novedades</Text>
      <View style={styles.newsCard}>
        <Text style={styles.newsText}>📢 Próximamente: nuevos puntos de reciclaje en tu ciudad.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6fff8' },

  header: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 3,
    position: 'relative',
  },

  ecopuntosBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
  },
  ecopuntosText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#2E7D32',
    fontSize: 15,
  },

  inspirationCard: {
    backgroundColor: '#fff',
    marginTop: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  inspirationTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color: '#2E7D32',
  },
  inspirationSubtitle: {
    color: '#555',
  },
  button: {
    backgroundColor: '#43A047',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },

  simulateButton: {
    backgroundColor: '#6A1B9A',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    elevation: 3,
  },
  simulateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 10,
    color: '#2E7D32',
  },

  sectionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  sectionItem: {
    width: '40%',
    marginVertical: 8,
    borderRadius: 15,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  sectionText: {
    fontWeight: '600',
    marginTop: 5,
    color: '#333',
  },

  newsCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  newsText: { color: '#555', fontSize: 14 },

  floatingNotification: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
  },
  notificationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
