import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
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

// --- Colores de tu tema EcoResiduos ---
const themeColors = {
  primary: '#4CAF50', // Verde principal
  secondary: '#388E3C', // Verde oscuro
  lightBg: '#F0FDF4', // Fondo verde muy claro
  text: '#1F2937', // Gris oscuro
  placeholder: '#9CA3AF', // Gris para placeholders
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
};

// --- Datos de ejemplo ---
// En una app real, esto vendría de tu API
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
    image:
      'https://placehold.co/100x70/4CAF50/FFFFFF?text=Ruta&font=inter',
  },
  {
    id: '2',
    title: 'Día del Reciclaje',
    date: 'Oct 25, 2025',
    description: 'Participa en el evento especial del Día del Reciclaje.',
    image:
      'https://placehold.co/100x70/3B82F6/FFFFFF?text=Evento&font=inter',
  },
];

// Marcadores de ejemplo
const markers = [
  {
    id: '1',
    latlng: { latitude: -26.183, longitude: -58.175 }, // Coordenadas de ejemplo (cerca de Formosa)
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

// Estilo de mapa (opcional, para un look más limpio)
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#eeeeee' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#c9c9c9' }],
  },
];

export default function MapScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -26.1834, // Latitud inicial (Formosa)
    longitude: -58.1756, // Longitud inicial (Formosa)
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación fue denegado');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);

    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.white }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* --- Cabecera: Saludo y Notificaciones --- */}
        <View className="flex-row justify-between items-center p-6">
          <View>
            <Text className="text-xl" style={{ color: themeColors.placeholder }}>
              Bienvenido de vuelta,
            </Text>
            <Text
              className="text-3xl font-bold"
              style={{ color: themeColors.text }}
            >
              Usuario
            </Text>
          </View>
          <TouchableOpacity
            className="p-3 rounded-full"
            style={{ backgroundColor: themeColors.lightBg }}
          >
            <Bell size={24} color={themeColors.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Barra de Búsqueda --- */}
        <View className="px-6 mb-6">
          <View
            className="flex-row items-center p-4 rounded-xl"
            style={{ backgroundColor: themeColors.lightBg }}
          >
            <Search color={themeColors.placeholder} size={20} />
            <TextInput
              className="flex-1 ml-3 text-base"
              placeholder="Buscar contenedores, puntos..."
              placeholderTextColor={themeColors.placeholder}
            />
          </View>
        </View>

        {/* --- Categorías de Contenedores --- */}
        <View className="mb-6">
          <Text
            className="text-lg font-semibold px-6 mb-3"
            style={{ color: themeColors.text }}
          >
            Categorías
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {categories.map((item, index) => {
              const isSelected = selectedCategory === item.name;
              return (
                <TouchableOpacity
                  key={index}
                  className="items-center mr-4"
                  onPress={() => setSelectedCategory(item.name)}
                >
                  <View
                    className="p-4 rounded-full"
                    style={{
                      backgroundColor: isSelected
                        ? themeColors.primary
                        : themeColors.lightBg,
                    }}
                  >
                    <item.icon
                      size={24}
                      color={isSelected ? themeColors.white : item.color}
                    />
                  </View>
                  <Text
                    className="mt-2 text-sm font-medium"
                    style={{
                      color: isSelected
                        ? themeColors.primary
                        : themeColors.placeholder,
                    }}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* --- Mapa Interactivo --- */}
        <View className="px-6 mb-6">
          <Text
            className="text-lg font-semibold mb-3"
            style={{ color: themeColors.text }}
          >
            Mapa de Contenedores
          </Text>
          <View
            className="rounded-2xl overflow-hidden"
            style={styles.mapContainer}
          >
            {errorMsg ? (
              <Text>{errorMsg}</Text>
            ) : location ? (
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                customMapStyle={mapStyle}
                showsUserLocation={true}
                showsMyLocationButton={false}
              >
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    coordinate={marker.latlng}
                    title={marker.type}
                  >
                    <View
                      className="p-2 rounded-full shadow-lg"
                      style={{ backgroundColor: marker.iconColor }}
                    >
                      <MapPin size={24} color={themeColors.white} />
                    </View>
                  </Marker>
                ))}
              </MapView>
            ) : (
              <ActivityIndicator
                size="large"
                color={themeColors.primary}
                style={{ flex: 1 }}
              />
            )}
          </View>
        </View>

        {/* --- Actualizaciones y Noticias --- */}
        <View>
          <Text
            className="text-lg font-semibold px-6 mb-3"
            style={{ color: themeColors.text }}
          >
            Actualizaciones
          </Text>
          {updates.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center bg-white p-4 mx-6 mb-3 rounded-xl shadow"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-20 h-16 rounded-lg"
                onError={(e) => console.log('Error cargando imagen:', e.nativeEvent.error)}
              />
              <View className="flex-1 ml-4">
                <Text
                  className="text-base font-semibold"
                  style={{ color: themeColors.text }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-sm"
                  style={{ color: themeColors.placeholder }}
                >
                  {item.description}
                </Text>
                <Text
                  className="text-xs mt-1"
                  style={{ color: themeColors.primary }}
                >
                  {item.date}
                </Text>
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
    backgroundColor: '#E5E7EB', // Color de fondo mientras carga el mapa
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

