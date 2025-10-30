import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Bell,
  Search,
  Recycle,
  Trash2,
  ListTree,
  MapPin,
} from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Constants from 'expo-constants';

// --- Colores de tu tema EcoResiduos ---
const themeColors = {
  primary: '#4CAF50',
  secondary: '#388E3C',
  lightBg: '#F0FDF4',
  text: '#1F2937',
  placeholder: '#9CA3AF',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
};

// --- Datos de ejemplo ---
const categories = [
  { name: 'Plástico', icon: Recycle, color: '#3B82F6' },
  { name: 'General', icon: Trash2, color: '#6B7280' },
  { name: 'Orgánico', icon: ListTree, color: '#F59E0B' },
  { name: 'Vidrio', icon: Recycle, color: '#10B981' },
];

const updates = [
  {
    id: '1',
    title: 'Nueva Ruta de Recolección',
    date: 'Oct 26, 2025',
    description: 'Se ha añadido una nueva ruta de recolección en la zona norte.',
    image: 'https://placehold.co/100x70/4CAF50/FFFFFF?text=Ruta&font=inter',
  },
  {
    id: '2',
    title: 'Día del Reciclaje',
    date: 'Oct 25, 2025',
    description: 'Participa en el evento especial del Día del Reciclaje.',
    image: 'https://placehold.co/100x70/3B82F6/FFFFFF?text=Evento&font=inter',
  },
];

// Marcadores de ejemplo
const markers = [
  {
    id: '1',
    latlng: { latitude: -26.183, longitude: -58.175 },
    type: 'Plástico',
    iconColor: '#3B82F6',
  },
  {
    id: '2',
    latlng: { latitude: -26.185, longitude: -58.172 },
    type: 'General',
    iconColor: '#6B7280',
  },
  {
    id: '3',
    latlng: { latitude: -26.18, longitude: -58.178 },
    type: 'Orgánico',
    iconColor: '#F59E0B',
  },
];

// Estilo de mapa opcional
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
];

export default function MapScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -26.1834,
    longitude: -58.1756,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación fue denegado');
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        const newRegion = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      } catch {
        setErrorMsg('Error obteniendo ubicación');
      }
    })();
  }, []);

  // API URL automática
  const API_URL = `http://${Constants.manifest?.debuggerHost?.split(':')[0]}:3000/api`;
  console.log('🌐 Usando API URL:', API_URL);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.white }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cabecera */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
          <View>
            <Text style={{ color: themeColors.placeholder, fontSize: 18 }}>Bienvenido de vuelta,</Text>
            <Text style={{ color: themeColors.text, fontSize: 28, fontWeight: 'bold' }}>Usuario</Text>
          </View>
          <TouchableOpacity style={{ padding: 12, borderRadius: 50, backgroundColor: themeColors.lightBg }}>
            <Bell size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {/* Barra de búsqueda */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: themeColors.lightBg }}>
            <Search size={20} color={themeColors.placeholder} />
            <TextInput
              style={{ flex: 1, marginLeft: 12, fontSize: 16, color: themeColors.text }}
              placeholder="Buscar contenedores, puntos..."
              placeholderTextColor={themeColors.placeholder}
            />
          </View>
        </View>

        {/* Categorías */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ color: themeColors.text, fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 }}>Categorías</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {categories.map((item, index) => {
              const isSelected = selectedCategory === item.name;
              return (
                <TouchableOpacity key={index} style={{ alignItems: 'center', marginRight: 12 }} onPress={() => setSelectedCategory(item.name)}>
                  <View style={{ padding: 16, borderRadius: 50, backgroundColor: isSelected ? themeColors.primary : themeColors.lightBg }}>
                    <item.icon size={24} color={isSelected ? themeColors.white : item.color} />
                  </View>
                  <Text style={{ marginTop: 4, fontSize: 12, color: isSelected ? themeColors.primary : themeColors.placeholder }}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Mapa */}
        <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ color: themeColors.text, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Mapa de Contenedores</Text>
          <View style={styles.mapContainer}>
            {errorMsg ? (
              <Text>{errorMsg}</Text>
            ) : location ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                customMapStyle={mapStyle}
                showsUserLocation
                showsMyLocationButton={false}
              >
                {markers
                  .filter(m => selectedCategory === 'Todos' || m.type === selectedCategory)
                  .map(marker => (
                    <Marker key={marker.id} coordinate={marker.latlng} title={marker.type}>
                      <View style={{ padding: 8, borderRadius: 50, backgroundColor: marker.iconColor }}>
                        <MapPin size={24} color={themeColors.white} />
                      </View>
                    </Marker>
                  ))}
              </MapView>
            ) : (
              <ActivityIndicator size="large" color={themeColors.primary} style={{ flex: 1 }} />
            )}
          </View>
        </View>

        {/* Actualizaciones */}
        <View>
          <Text style={{ color: themeColors.text, fontSize: 18, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8 }}>Actualizaciones</Text>
          {updates.map(item => (
            <TouchableOpacity key={item.id} style={{ flexDirection: 'row', backgroundColor: themeColors.cardBg, padding: 12, marginHorizontal: 16, marginBottom: 12, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 }}>
              <Image source={{ uri: item.image }} style={{ width: 80, height: 56, borderRadius: 8 }} onError={(e) => console.log('Error cargando imagen:', e.nativeEvent.error)} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: themeColors.text, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
                <Text style={{ color: themeColors.placeholder, fontSize: 14 }}>{item.description}</Text>
                <Text style={{ color: themeColors.primary, fontSize: 12, marginTop: 4 }}>{item.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 300,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
