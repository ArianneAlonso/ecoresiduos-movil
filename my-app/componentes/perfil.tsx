import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function PerfilScreen() {
  // Nota: La imagen del avatar no está incluida en este código, se simula.
  return (
    <View style={styles.container}>
      {/* Header del perfil */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=Avatar' }} // Reemplazar con la URL/Path del avatar
          style={styles.avatar}
        />
        <Text style={styles.username}>NombreUsuario</Text>
        <TouchableOpacity style={styles.settingsIcon}>
          <Text>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Puntos y Logros */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>1500</Text>
          <Text style={styles.statLabel}>Ecopuntos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>20</Text>
          <Text style={styles.statLabel}>Logros</Text>
        </View>
      </View>

      {/* Tabs Logros/Estadísticas */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabButton}>
          <Text style={styles.tabText}>Logros</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Estadísticas</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido de Estadísticas */}
      <View style={styles.contentBox}>
        <Text>Contenido de Estadísticas</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileHeader: { padding: 20, alignItems: 'center', backgroundColor: '#b9f6ca', marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  username: { fontSize: 22, fontWeight: 'bold', color: '#333', marginTop: 5 },
  settingsIcon: { position: 'absolute', top: 30, right: 30 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, marginBottom: 20 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 15, borderRightWidth: 1, borderRightColor: '#eee' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50' },
  statLabel: { color: 'gray' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#f0f0f0' },
  activeTab: { backgroundColor: '#4CAF50', borderRadius: 5 },
  tabText: { fontWeight: 'bold', color: '#333' },
  activeTabText: { color: '#fff' },
  contentBox: { height: 250, backgroundColor: '#f9f9f9', marginHorizontal: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});