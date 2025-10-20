import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// Definición de tipos para la ubicación y los contenedores
type Coordinate = {
  latitude: number;
  longitude: number;
};

type Contenedor = {
  id: number;
  latitude: number;
  longitude: number;
  tipo: 'Plástico' | 'Papel' | 'Retiro'; // Adaptamos el tipo para el filtro
};

// Contenedores de ejemplo (usando tus coordenadas base)
const contenedores: Contenedor[] = [
  { id: 1, latitude: -34.6037, longitude: -58.3816, tipo: 'Plástico' },
  { id: 2, latitude: -34.6050, longitude: -58.3800, tipo: 'Papel' },
  { id: 3, latitude: -34.6100, longitude: -58.3900, tipo: 'Retiro' }, // Añadimos uno de "Retiro"
];

export default function MapaScreen() {
  const [activeTab, setActiveTab] = useState<'reciclaje' | 'rutas'>('reciclaje');
  const [location, setLocation] = useState<Coordinate | null>(null);
  
  // 1. Obtener la ubicación del usuario
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permiso para ubicación denegado. No se puede mostrar la ubicación del usuario.');
        // Puedes establecer una región por defecto si la ubicación es denegada.
        return; 
      }

      try {
        let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation({ 
          latitude: loc.coords.latitude, 
          longitude: loc.coords.longitude 
        });
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
      }
    })();
  }, []);

  // Función para cambiar de pestaña y filtrar marcadores si es necesario
  const handleTabChange = (tab: 'reciclaje' | 'rutas') => {
    setActiveTab(tab);
  };
  
  // Región inicial del mapa, centrada en la ubicación del usuario o en una ciudad por defecto
  const initialRegion: Region | undefined = location ? {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  } : undefined;

  // Filtra los contenedores según la pestaña activa
  const filteredContenedores = contenedores.filter(c => {
    if (activeTab === 'reciclaje') {
      return c.tipo !== 'Retiro';
    } else {
      return c.tipo === 'Retiro';
    }
  });

  // 2. Componente de Header limpio y moderno
  const Header = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.studioGhibliText}>Ecoresiduos</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Buscar')}><FontAwesome5 name="search" size={20} color="#333" /></TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Notificaciones')}><FontAwesome5 name="bell" size={20} color="#333" /></TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.mainTitle}>ENCONTRÁ PUNTOS VERDES</Text>
      <Text style={styles.subTitle}>
        Descubre los centros de acopio y las rutas de retiro más cercanas a tu ubicación.
      </Text>
    </View>
  );
  
  // 3. Componente de Pestañas
  const TabSelector = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'reciclaje' && styles.activeTabButton]}
        onPress={() => handleTabChange('reciclaje')}
      >
        <Text style={[styles.tabText, activeTab === 'reciclaje' && styles.activeTabText]}>Puntos de Reciclaje</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.tabButton, activeTab === 'rutas' && styles.activeTabButton]}
        onPress={() => handleTabChange('rutas')}
      >
        <Text style={[styles.tabText, activeTab === 'rutas' && styles.activeTabText]}>Rutas de Retiro</Text>
      </TouchableOpacity>
    </View>
  );

  // 4. Contenido Principal con el Mapa
  return (
    <View style={styles.fullContainer}>
      {/* COMENTARIO: El error de 'Text strings must be rendered' no se encuentra en este archivo.
          Revisa 'componentes/inicio.tsx' o los archivos de navegación (_layout.tsx)
          para asegurarte de que no haya texto literal sin envolver en <Text> */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Header />
        
        <TabSelector />

        <View style={styles.mapCard}>
          {/* Se muestra el mapa solo si la ubicación ha sido cargada (location !== null) */}
          {initialRegion ? (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={true}
            >
              {/* Marcador de la ubicación del usuario (Azul) */}
              <Marker 
                coordinate={location!} 
                title="¡Aquí estás!" 
                pinColor="blue" 
              />
              
              {/* Marcadores de Contenedores Verdes */}
              {filteredContenedores.map((c) => (
                <Marker
                  key={c.id}
                  coordinate={{ latitude: c.latitude, longitude: c.longitude }}
                  title={`Contenedor de ${c.tipo}`}
                >
                  <View style={styles.markerContainer}>
                    <MaterialCommunityIcons 
                      name={c.tipo === 'Retiro' ? "truck-fast" : "recycle"} 
                      size={24} 
                      color={c.tipo === 'Retiro' ? "#673ab7" : "#4CAF50"} // Verde o Violeta para camión
                    />
                  </View>
                </Marker>
              ))}

            </MapView>
          ) : (
             <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Cargando ubicación y mapa...</Text>
             </View>
          )}
        </View>
        
        {/* Espacio para contenido adicional si lo hubiera debajo del mapa */}
        <View style={{height: 50}}/> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
    backgroundColor: '#f5f5f5', // Fondo ligeramente gris para separar el contenido
  },
  loadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  // --- Estilos del Header (Inspirado en el diseño Ghibli) ---
  headerContainer: {
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingTop: 40, 
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studioGhibliText: {
    fontSize: 14,
    color: 'gray',
    fontWeight: '500',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  // --- Estilos de Pestañas ---
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 15,
  },
  activeTabButton: {
    backgroundColor: '#4CAF50', // Verde de tu paleta
  },
  tabText: {
    color: '#666',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  // --- Estilos del Mapa ---
  mapCard: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  map: {
    width: width - 40, // Ancho de la tarjeta
    height: 400, // Altura fija para el mapa
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  }
});
