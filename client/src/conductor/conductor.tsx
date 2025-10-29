import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Componente de tarjeta reutilizable para el grid de 2x2
const InfoCard = ({
  title,
  value,
  iconName,
  backgroundColor,
  textColor,
}) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: backgroundColor }]}
  >
    <Text style={[styles.cardTitle, { color: textColor }]}>{title}</Text>
    <Text style={[styles.cardValue, { color: textColor }]}>{value}</Text>
    <Ionicons
      name={iconName}
      size={40}
      color={textColor}
      style={styles.cardIcon}
    />
  </TouchableOpacity>
);

// Componente de ítem de categoría
const CategoryItem = ({ iconName, label }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIconBg}>
      <Ionicons name={iconName} size={30} color="#5D5FEF" />
    </View>
    <Text style={styles.categoryLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function ConductorHome() {
  const today = new Date();
  const dateString = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Encabezado --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>{dateString}</Text>
            <Text style={styles.headerSubtitle}>¡Bienvenido, Conductor!</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>

        {/* --- Grid de 2x2 --- */}
        <View style={styles.gridContainer}>
          <InfoCard
            title="Viajes de Hoy"
            value="12"
            iconName="car-sport-outline"
            backgroundColor="#E6E0FF" // Morado claro
            textColor="#333"
          />
          <InfoCard
            title="Ganancia (Hoy)"
            value="$4500"
            iconName="cash-outline"
            backgroundColor="#5D5FEF" // Morado oscuro
            textColor="#FFFFFF"
          />
          <InfoCard
            title="Próximo Viaje"
            value="14:30"
            iconName="time-outline"
            backgroundColor="#7B61FF" // Morado medio
            textColor="#FFFFFF"
          />
          <InfoCard
            title="Calificación"
            value="4.8"
            iconName="star-outline"
            backgroundColor="#FFDDAA" // Naranja claro
            textColor="#333"
          />
        </View>

        {/* --- Tarjeta Ancha (Notificación) --- */}
        <TouchableOpacity style={styles.fullWidthCard}>
          <View>
            <Text style={styles.fullWidthTitle}>Próximo Destino: Centro</Text>
            <Text style={styles.fullWidthBody}>
              Cliente: Ana G. - Calle Falsa 123
            </Text>
          </View>
          <Ionicons
            name="location-outline"
            size={28}
            color="#5D5FEF"
            style={styles.fullWidthIcon}
          />
        </TouchableOpacity>

        {/* --- Categorías --- */}
        <Text style={styles.categoriesTitle}>Accesos Rápidos</Text>
        <View style={styles.categoryContainer}>
          <CategoryItem iconName="person-outline" label="Mi Perfil" />
          <CategoryItem iconName="document-text-outline" label="Historial" />
          <CategoryItem iconName="headset-outline" label="Soporte" />
          <CategoryItem iconName="stats-chart-outline" label="Estadísticas" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F5FF', // Fondo morado muy claro
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Ancho para 2 columnas con espacio
    borderRadius: 24, // Esquinas bien redondeadas
    padding: 20,
    marginBottom: 15,
    minHeight: 160, // Altura mínima
    position: 'relative',
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cardIcon: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    opacity: 0.8,
  },
  fullWidthCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 25,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fullWidthTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  fullWidthBody: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  fullWidthIcon: {
    marginLeft: 10,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconBg: {
    width: 70,
    height: 70,
    borderRadius: 20, // Esquinas redondeadas
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
});
