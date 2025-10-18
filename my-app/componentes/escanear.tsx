import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EscanearScreen() {
  return (
    <View style={styles.container}>
      {/* Esta pantalla normalmente contendría el componente de la cámara o scanner de QR */}
      <Text style={styles.title}>ScanScreen</Text>
      <View style={styles.playIconPlaceholder}>
        {/* Placeholder para el ícono de 'play' o cámara en el centro */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, color: 'gray', marginBottom: 20 },
  playIconPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
});