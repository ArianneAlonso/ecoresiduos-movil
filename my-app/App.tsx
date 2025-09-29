/*
ECORESIDUOS - Expo Go React Native (TypeScript, single-file example)

Instrucciones rápidas (instalar antes de ejecutar):
- expo init my-app --template expo-template-blank-typescript
- cd my-app
- npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-safe-area-context react-native-screens
- npm install @expo/vector-icons
- expo install react-native-gesture-handler react-native-reanimated

Pega este App.tsx (o adapta a tu estructura). Este archivo contiene:
- Bottom Tab Navigator (Inicio, Escanear, Perfil)
- Tres pantallas con estilos y componentes que replican las pantallas que mandaste
- Tipos TS simples y componentes reutilizables

Nota: las imágenes y logos están simulados con View/Avatar. Sustituir por tus assets cuando quieras.
*/

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

type RootTabParamList = {
  Inicio: undefined;
  Escanear: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();
const { width } = Dimensions.get('window');

/* --- Reusable small components --- */
const Avatar: React.FC<{ size?: number }> = ({ size = 90 }) => {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}> 
      {/* Placeholder mascot */}
      <Text style={{ fontSize: size / 3 }}>🌱</Text>
    </View>
  );
};

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{text}</Text>
  </View>
);

/* --- Screens --- */
function InicioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.headerRow}>
          <Badge text="1500 Ecopuntos" />
          <TouchableOpacity style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color="#111" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.heroMascotPlaceholder}>
              <Text style={{ fontSize: 36 }}>🌿</Text>
            </View>
          </View>
          <View style={styles.heroRight}>
            <Text style={styles.heroTitle}>¿Querés descubrir qué nos inspira?</Text>
            <Text style={styles.heroBody}>Conocé quiénes somos y por qué hacemos lo que hacemos</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>Saber Más</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Secciones</Text>
        <View style={styles.sectionsRow}>
          <View style={styles.sectionCard}><MaterialIcons name="local-shipping" size={28} /><Text style={styles.sectionText}>Retiro</Text></View>
          <View style={styles.sectionCard}><MaterialIcons name="map" size={28} /><Text style={styles.sectionText}>Mapa</Text></View>
          <View style={styles.sectionCard}><MaterialIcons name="redeem" size={28} /><Text style={styles.sectionText}>Canjes</Text></View>
          <View style={styles.sectionCard}><MaterialIcons name="event" size={28} /><Text style={styles.sectionText}>Eventos</Text></View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Novedades</Text>
        <View style={styles.tabContainer}>
          <View style={[styles.tabPill, { backgroundColor: '#2f9b3f' }]}><Text style={styles.tabPillText}>Canjes</Text></View>
          <TouchableOpacity style={[styles.tabPill, { backgroundColor: 'transparent', marginLeft: 10 }]}>
            <Text style={[styles.tabPillText, { color: '#2f9b3f' }]}>Eventos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholderBox}>
          <Text>Contenido de la pestaña: Canjes</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function EscanearScreen() {
  return (
    <SafeAreaView style={styles.containerCenter}>
      <Text style={{ marginTop: 30, color: '#666' }}>Pantalla de Escaneo</Text>
      <View style={styles.scanBox}>
        <Text style={{ color: '#aaa' }}>Aquí iría la cámara / lector QR</Text>
      </View>
    </SafeAreaView>
  );
}

function PerfilScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.profileHeader}>
          <View style={{ alignItems: 'center' }}>
            <Avatar size={100} />
            <Text style={styles.username}>NombreUsuario</Text>
          </View>
        </View>

        <View style={styles.pointsCard}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.pointsNumber}>1500</Text>
            <Text style={styles.pointsLabel}>Ecopuntos</Text>
          </View>
          <View style={{ width: 1, backgroundColor: '#eee', marginHorizontal: 16 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.pointsNumber}>20</Text>
            <Text style={styles.pointsLabel}>Logros</Text>
          </View>
        </View>

        <View style={styles.segmentContainer}>
          <TouchableOpacity style={styles.segmentButtonActive}><Text style={{ color: '#fff' }}>Estadísticas</Text></TouchableOpacity>
          <TouchableOpacity style={styles.segmentButton}><Text style={{ color: '#2f9b3f' }}>Logros</Text></TouchableOpacity>
        </View>

        <View style={{ height: 420 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* --- App (Navigator) --- */
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
         initialRouteName="Inicio"
         screenOptions={{
         tabBarActiveTintColor: "#4CAF50",
         tabBarInactiveTintColor: "#777",
         headerStyle: { backgroundColor: "#4CAF50" },
         headerTintColor: "#fff",
         tabBarStyle: { backgroundColor: "#fff", paddingBottom: 5, height: 60 },
         sceneStyle: { backgroundColor: "#f4f4f4" },
  }} >
  <Tab.Screen name="Inicio" component={InicioScreen} />
  <Tab.Screen name="Escanear" component={EscanearScreen} />
  <Tab.Screen name="Perfil" component={PerfilScreen} />
  </Tab.Navigator>
  </NavigationContainer>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  containerCenter: { flex: 1, backgroundColor: '#fff', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { backgroundColor: '#FFD54F', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16, alignSelf: 'flex-start' },
  badgeText: { fontWeight: '600', color: '#fff' },
  bell: { marginRight: 2 },
  heroCard: { flexDirection: 'row', backgroundColor: '#dff0d9', borderRadius: 16, padding: 12, marginTop: 12, overflow: 'hidden' },
  heroLeft: { width: 90, justifyContent: 'center', alignItems: 'center' },
  heroMascotPlaceholder: { width: 72, height: 72, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  heroRight: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  heroTitle: { fontWeight: '700', fontSize: 16, marginBottom: 6 },
  heroBody: { color: '#315a2b' },
  heroButton: { marginTop: 10, backgroundColor: '#2f9b3f', alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20 },
  heroButtonText: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontWeight: '700', fontSize: 18, marginTop: 18 },
  sectionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  sectionCard: { width: (width - 80) / 4, height: 72, borderRadius: 12, backgroundColor: '#f6fbff', justifyContent: 'center', alignItems: 'center' },
  sectionText: { marginTop: 6, fontSize: 12 },
  tabContainer: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  tabPill: { paddingVertical: 8, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#eee' },
  tabPillText: { color: '#fff', fontWeight: '700' },
  placeholderBox: { marginTop: 12, backgroundColor: '#f5f5f5', height: 120, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  scanBox: { marginTop: 30, width: width - 60, height: width - 120, borderRadius: 16, borderWidth: 2, borderStyle: 'dashed', borderColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 16 },
  avatar: { backgroundColor: '#eaf7ee', justifyContent: 'center', alignItems: 'center' },
  username: { marginTop: 12, fontWeight: '700', fontSize: 20 },
  pointsCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 18, marginTop: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  pointsNumber: { fontSize: 28, fontWeight: '800', color: '#5b5b5b' },
  pointsLabel: { color: '#777' },
  segmentContainer: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  segmentButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, backgroundColor: '#f2f2f2' },
  segmentButtonActive: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, backgroundColor: '#2f9b3f' },
  tabBar: { height: 64, paddingBottom: 8, paddingTop: 8, borderTopColor: '#eee' }
});
